import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requestMagicLink, checkUserExists } from '../api';
import { useAuth } from '../AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { authError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await checkUserExists(email);
      if (data.exists) {
        await requestMagicLink(email);
        setMessage('We\'ve sent a magic link to your email. Check your inbox!');
      } else {
        navigate('/onboarding', { state: { email } });
      }
    } catch (err) {
      setError('Failed to send magic link. Please check the email and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome Back
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Sign in to continue to your FamilyHearth.
            </p>
        </div>

        {message ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg text-center">
            <p className="font-semibold">Success!</p>
            <p>{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                className="w-full px-4 py-3 text-lg text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Sending Link...' : 'Send Magic Link'}
            </button>

             {(error || authError) && (
              <p className="text-center text-red-500 text-sm">
                {error || authError}
              </p>
            )}
          </form>
        )}
        
        <div className="mt-6 text-center">
          <a href="/manual-verify" className="text-sm text-slate-500 hover:text-slate-700 hover:underline">
            Have a token? Verify manually.
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;