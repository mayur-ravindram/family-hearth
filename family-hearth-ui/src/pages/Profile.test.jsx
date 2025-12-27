import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Profile from './Profile';

// Mock the authedApi module
jest.mock('../authedApi', () => ({
  createSignedUrl: jest.fn(),
  uploadFile: jest.fn(),
  confirmMedia: jest.fn(),
  updateUser: jest.fn(),
}));

const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://via.placeholder.com/150',
};

const renderWithAuthProvider = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>,
    renderOptions
  );
};

describe('Profile Page', () => {
  it('renders loading state initially', () => {
    const providerProps = {
      user: null,
      loading: true,
      authError: null,
    };
    renderWithAuthProvider(<Profile />, { providerProps });
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it('renders user information when loaded', () => {
    const providerProps = {
      user: mockUser,
      loading: false,
      authError: null,
    };
    renderWithAuthProvider(<Profile />, { providerProps });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByAltText('User Avatar')).toHaveAttribute('src', mockUser.avatarUrl);
  });

  it('shows an error message if user fails to load', () => {
    const providerProps = {
      user: null,
      loading: false,
      authError: 'Failed to load',
    };
    renderWithAuthProvider(<Profile />, { providerProps });
    expect(screen.getByText(/error loading profile/i)).toBeInTheDocument();
  });

  it('contains a file input and a save button for avatar upload', () => {
    const providerProps = {
      user: mockUser,
      loading: false,
      authError: null,
    };
    renderWithAuthProvider(<Profile />, { providerProps });

    expect(screen.getByLabelText(/update profile picture/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save new picture/i })).toBeInTheDocument();
  });
});
