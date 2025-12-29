import axios from 'axios';
import mockApi from './mockApi'; // Import the mock API

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

let api;

if (USE_MOCK_API) {
  console.log('Using Mock API');
  api = mockApi;
} else {
  console.log('Using Real API');
  api = axios.create({
    baseURL: '/api/v1',
  });
}

// Export functions that use the chosen api instance
export const requestMagicLink = (email) => api.post('/auth/magic-link', { email });
export const verifyToken = (token) => api.post('/auth/verify', { token });
export const checkUserExists = (email) => api.get(`/users/exists?email=${email}`);
export const devLogin = (email) => api.post('/auth/dev/login', { email });
export const refreshToken = (refreshToken) => api.post('/auth/refresh', { refreshToken });
export const acceptInvite = (code, { firstName, lastName, email, phone }) => api.post(`/invites/${code}/accept`, { firstName, lastName, email, phone });

// For default export consistency, if needed (though named exports are generally preferred for API functions)
export default api;



