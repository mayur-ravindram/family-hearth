import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyToken } from '../api';
import { useAuth } from '../AuthContext';

function Verify() {
  const { token: paramToken } = useParams();
  const navigate = useNavigate();
  const { login, accessToken } = useAuth(); // Get accessToken from AuthContext
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isVerificationAttempted = useRef(false); // Use useRef to prevent re-calls

  useEffect(() => {
    const verifyToken = async () => {
      // If user is already authenticated, redirect to dashboard
      if (accessToken) {
        navigate('/dashboard');
        return;
      }

      if (!paramToken) {
        setError('No token provided.');
        setLoading(false);
        return;
      }

      // Ensure verification is attempted only once
      if (isVerificationAttempted.current) {
        return;
      }

      isVerificationAttempted.current = true; // Mark as attempted
      setLoading(true);

      try {
        const response = await verifyToken(paramToken);
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
        setError('Invalid or expired magic link. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [paramToken, login, navigate, accessToken]); // Added accessToken to dependencies

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Verifying your magic link...</h1>
        <p className="text-lg text-gray-600">Please wait while we log you in.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Verification Failed</h1>
        <p className="text-lg text-gray-600 mb-4">{error}</p>
        <a href="/login" className="text-blue-500 hover:underline">
          Return to Login
        </a>
      </div>
    );
  }

  return null;
}

export default Verify;
