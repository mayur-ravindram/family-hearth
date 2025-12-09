import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import CreateFamily from './CreateFamily';
import Invite from './Invite';
import AcceptInvite from './AcceptInvite';
import * as api from '../api';

jest.mock('../api');

const mockUser = { id: 1, email: 'test@example.com' };

const renderWithProviders = (ui, { providerProps, route = '/' } = {}) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Families Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('full family creation, invite, and accept flow', async () => {
    const providerProps = {
      user: mockUser,
      loading: false,
    };

    // 1. Create Family
    api.createFamily.mockResolvedValue({ data: { id: 1, name: 'Test Family' } });
    
    renderWithProviders(
      <Routes>
        <Route path="/create-family" element={<CreateFamily />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
      { providerProps, route: '/create-family' }
    );

    fireEvent.change(screen.getByLabelText(/Family Name/i), { target: { value: 'Test Family' } });
    fireEvent.click(screen.getByText(/Create Family/i));

    await waitFor(() => {
      expect(api.createFamily).toHaveBeenCalledWith({ name: 'Test Family' });
      expect(localStorage.getItem('familyId')).toBe('1');
      expect(screen.getByText('Family created successfully! Redirecting to dashboard...')).toBeInTheDocument();
    });
    
    // 2. Invite
    api.createInvite.mockResolvedValue({ data: { code: 'test-invite-code' } });

    renderWithProviders(
      <Routes>
        <Route path="/invite" element={<Invite />} />
      </Routes>,
      { providerProps, route: '/invite' }
    );

    fireEvent.click(screen.getByText(/Generate Invite Link/i));

    await waitFor(() => {
      expect(api.createInvite).toHaveBeenCalledWith('1', { maxUses: 5 });
      expect(screen.getByText(/Your invite link is:/i)).toBeInTheDocument();
      expect(screen.getByText(/test-invite-code/i)).toBeInTheDocument();
    });

    // 3. Accept Invite
    api.acceptInvite.mockResolvedValue({ data: {} });

    renderWithProviders(
      <Routes>
        <Route path="/accept-invite/:code" element={<AcceptInvite />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
      { providerProps, route: '/accept-invite/test-invite-code' }
    );

    await waitFor(() => {
      expect(api.acceptInvite).toHaveBeenCalledWith('test-invite-code', { userId: mockUser.id });
      expect(screen.getByText('Invite accepted successfully! Redirecting to your dashboard...')).toBeInTheDocument();
    });
  });
});
