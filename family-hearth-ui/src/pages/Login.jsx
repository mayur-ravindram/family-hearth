import { useState } from 'react';
import { requestMagicLink } from '../api';
import { useAuth } from '../AuthContext'; // Import useAuth

function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { authError } = useAuth(); // Get authError from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await requestMagicLink(email);
      setMessage('Success! Check your email (or console) for the magic link.');
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </div>
        {message && <p className="mt-4 text-green-500 text-xs italic">{message}</p>}
        {(error || authError) && <p className="mt-4 text-red-500 text-xs italic">{error || authError}</p>}
        <div className="mt-4 text-center">
          <a href="/manual-verify" className="text-blue-500 hover:underline text-sm">
            Manually verify token
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
