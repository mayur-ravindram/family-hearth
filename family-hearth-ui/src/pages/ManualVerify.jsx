import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyMagicLink } from '../api';
import { useAuth } from '../AuthContext';

function ManualVerify() {
  console.log('ManualVerify component rendered!');
  const navigate = useNavigate();
  const { login, accessToken } = useAuth(); // Get accessToken from AuthContext
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false); // New state to prevent multiple calls

  useEffect(() => {
    console.log('ManualVerify useEffect triggered:', { accessToken });
    // If user is already authenticated, redirect to dashboard
    if (accessToken) {
      console.log('ManualVerify: User already authenticated with accessToken. Redirecting to /dashboard.');
      navigate('/dashboard');
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('ManualVerify: handleSubmit triggered.');

    if (!token) {
      setError('Please enter a token.');
      console.log('ManualVerify: No token entered.');
      return;
    }
    if (isVerifying) {
      console.log('ManualVerify: Verification already in progress. Skipping.');
      return;
    }

    setLoading(true);
    setIsVerifying(true); // Set verifying state
    setError('');
    console.log('ManualVerify: Starting manual verification for token:', token);

    try {
      const response = await verifyMagicLink(token);
      const { accessToken: newAccessToken, refreshToken } = response.data;
      console.log('ManualVerify: API response received.', { newAccessToken: !!newAccessToken, refreshToken: !!refreshToken });

      if (newAccessToken) {
        login({ accessToken: newAccessToken, refreshToken });
        console.log('ManualVerify: Login successful. Navigating to /dashboard.');
        navigate('/dashboard');
      } else {
        console.log('ManualVerify: No accessToken returned from server. Throwing error.');
        throw new Error('No accessToken returned from server.');
      }
    } catch (err) {
      console.error('ManualVerify: Verification failed.', err);
      setError('Invalid or expired token. Please try again.');
    } finally {
      setLoading(false);
      setIsVerifying(false); // Reset verifying state
      console.log('ManualVerify: Verification attempt concluded. Loading and isVerifying set to false.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Manual Token Verification</h1>
      <p className="text-gray-600 mb-4">For development use. Paste the magic link token below.</p>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="token">
            Magic Link Token
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="token"
            type="text"
            placeholder="Enter token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading || isVerifying}
          >
            {loading || isVerifying ? 'Verifying...' : 'Verify and Login'}
          </button>
        </div>
        {error && <p className="mt-4 text-red-500 text-xs italic">{error}</p>}
      </form>
    </div>
  );
}

export default ManualVerify;
