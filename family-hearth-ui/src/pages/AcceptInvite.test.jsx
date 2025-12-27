import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import AcceptInvite from './AcceptInvite';
import { useAuth } from '../AuthContext';
import { getInviteEmail, checkUserExists } from '../api';
import { vi } from 'vitest';

// Mock the API functions
vi.mock('../api', () => ({
  getInviteEmail: vi.fn(),
  checkUserExists: vi.fn(),
  acceptInvite: vi.fn(),
}));

// Mock the useAuth hook
vi.mock('../AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AcceptInvite', () => {
  it('redirects to login for existing users', async () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    getInviteEmail.mockResolvedValue('existing@example.com');
    checkUserExists.mockResolvedValue(true);

    const navigate = vi.fn();
    render(
      <MemoryRouter initialEntries={['/accept-invite/testcode']}>
        <AcceptInvite />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  it('redirects to onboarding for new users', async () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    getInviteEmail.mockResolvedValue('new@example.com');
    checkUserExists.mockResolvedValue(false);

    render(
      <MemoryRouter initialEntries={['/accept-invite/testcode']}>
        <AcceptInvite />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/onboarding');
    });
  });

  it('shows the accept form for logged in users', () => {
    useAuth.mockReturnValue({
      user: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      loading: false,
    });

    render(
      <Router>
        <AcceptInvite />
      </Router>
    );

    expect(screen.getByText('You are invited to join a family!')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toHaveValue('John Doe');
    expect(screen.getByRole('button', { name: 'Join Family' })).toBeInTheDocument();
  });
});
