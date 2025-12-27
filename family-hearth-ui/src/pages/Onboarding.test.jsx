import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Onboarding from './Onboarding';
import { requestMagicLink } from '../api';
import { vi } from 'vitest';

// Mock the requestMagicLink function
vi.mock('../api', () => ({
  requestMagicLink: vi.fn(),
}));

describe('Onboarding', () => {
  it('renders the onboarding form', () => {
    render(
      <Router>
        <Onboarding />
      </Router>
    );

    expect(screen.getByText('Welcome to FamilyHearth!')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Magic Link' })).toBeInTheDocument();
  });

  it('calls requestMagicLink on form submission', async () => {
    render(
      <Router>
        <Onboarding />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send Magic Link' }));

    expect(requestMagicLink).toHaveBeenCalledWith('john.doe@example.com');
  });
});