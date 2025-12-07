import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyMagicLink } from '../api';

function MagicLinkVerification() {
  const [message, setMessage] = useState('Verifying your magic link, please wait...');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let isCancelled = false;

    const verify = async () => {
      if (!token) {
        setMessage('No token found. Please return to the login page and try again.');
        return;
      }

      try {
        const { accessToken: jwt, refreshToken } = await verifyMagicLink(token, signal);

        if (isCancelled) return;

        if (!jwt || !refreshToken) {
          throw new Error("Authentication failed: server did not provide valid tokens.");
        }

        localStorage.setItem('jwt', jwt);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.removeItem('user');
        localStorage.removeItem('family');
        window.dispatchEvent(new Event('login'));
        
        setMessage('Verification successful! Redirecting you to the dashboard...');
        
        navigate('/dashboard');
        setTimeout(() => {
          if (!isCancelled) {
          }
        }, 2000);

      } catch (error) {
        if (isCancelled || error.name === 'AbortError') {
          console.log('Request aborted or component unmounted.');
          return;
        }
        
        console.error('Error verifying magic link:', error);
        setMessage('Invalid or expired magic link. Please try again.');
      }
    };

    verify();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [token, navigate]);

  return (
    <div className="magic-link-verification-container">
      <div className="status-box">
        <h2>Magic Link Verification</h2>
        <p className="verification-message">{message}</p>
      </div>
    </div>
  );
}

export default MagicLinkVerification;