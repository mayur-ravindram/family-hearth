import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { acceptInvite } from '../authedApi';

function AcceptInvite() {
  const { code } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
      if (fullName) setName(fullName);
    }
  }, [user, authLoading]);

  const handleAccept = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await acceptInvite(code, { name: name, email: user.email });
      setSuccess('Invite accepted successfully! Redirecting to your dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError('Failed to accept invite. It might be invalid or expired.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    localStorage.setItem('redirectAfterLogin', location.pathname);
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-6">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold mb-4">You've been invited!</h1>
          <p className="mb-6">Please log in to accept the invitation.</p>
          <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Accept Invite</h1>
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
        {code && !loading && !error && !success && (
          <form onSubmit={handleAccept} className="text-left">
            <p className="mb-4 text-center">You are invited to join a family!</p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Your Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Join Family
              </button>
            </div>
          </form>
        )}
        {!code && (
          <div>
            <p className="mb-4">No invite code provided.</p>
            <Link to="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptInvite;
