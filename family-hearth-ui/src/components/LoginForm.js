import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { requestMagicLink } from '../api';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setError(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage('');
    try {
      await requestMagicLink(email);
      setMessage('Magic link sent! Check your email for the link.');
    } catch (error) {
      setError(error.message);
      console.error('Error sending magic link:', error);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login to FamilyHearth</h2>
      <p>Enter your email to receive a magic link.</p>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <button type="submit" className="btn-submit">Send Magic Link</button>
      </form>
      <p className="verify-token-link">
        Alternatively, you can <Link to="/verify-token">verify your token manually</Link>.
      </p>
    </div>
  );
}

export default LoginForm;