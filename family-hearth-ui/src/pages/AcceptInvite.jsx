import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { acceptInvite } from '../api';

function AcceptInvite() {
  const { code } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to finish
    }
    if (!user) {
      // Not logged in, redirect to login
      navigate('/login');
      return;
    }

    const handleAccept = async () => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        await acceptInvite(code, { userId: user.id });
        setSuccess('Invite accepted successfully! Redirecting to your dashboard...');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        setError('Failed to accept invite. It might be invalid or expired.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && code) {
      handleAccept();
    }
  }, [code, user, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Accepting Invite...</h1>
        {loading && <p>Please wait while we process your invite.</p>}
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!code && !loading && (
          <div>
            <p className="mb-4">No invite code provided.</p>
            <Link to="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Go to Dashboard
            </Link>
          </div>
        )}
        {code && !loading && !error && !success && (
            <p>Preparing to accept invite code: {code}</p>
        )}
      </div>
    </div>
  );
}

export default AcceptInvite;
