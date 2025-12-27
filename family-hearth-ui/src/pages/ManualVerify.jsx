import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { verifyToken } from '../api';
import { useAuth } from '../AuthContext';

function ManualVerify() {
  const navigate = useNavigate();
  const { login, accessToken } = useAuth();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (accessToken) {
      navigate('/dashboard');
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please enter a token.');
      return;
    }
    if (isVerifying) {
      return;
    }

    setLoading(true);
    setIsVerifying(true);
    setError('');

    try {
      const response = await verifyToken(token);
      const { accessToken: newAccessToken, refreshToken } = response.data;

      if (newAccessToken) {
        login({ accessToken: newAccessToken, refreshToken });
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('No accessToken returned from server.');
      }
    } catch (err) {
      console.error('ManualVerify: Verification failed.', err);
      setError('Invalid or expired token. Please try again.');
    } finally {
      setLoading(false);
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Manual Verification
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Paste the magic token you received to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="token" className="sr-only">
              Magic Link Token
            </label>
            <input
              className="w-full px-4 py-3 text-lg font-mono text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              id="token"
              type="text"
              placeholder="Enter token here"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:bg-blue-400 disabled:scale-100"
            disabled={loading || isVerifying}
          >
            {loading || isVerifying ? 'Verifying...' : 'Verify and Login'}
          </button>

          {error && (
            <p className="text-center text-red-500 text-sm">
              {error}
            </p>
          )}
        </form>
        
        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 hover:underline transition-colors duration-300">
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ManualVerify;
