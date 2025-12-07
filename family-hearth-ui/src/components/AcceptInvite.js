import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { acceptInvite } from '../api';
import './AcceptInvite.css';

function AcceptInvite() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage('');
    try {
      await acceptInvite(code, { name, email });
      setMessage('Invitation accepted successfully! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
      console.error('Error accepting invite:', error);
    }
  };

  return (
    <div className="accept-invite-container">
      <h2>Accept Invitation</h2>
      <p>You've been invited to join a family! Please enter your details to accept.</p>
      <p>Invite Code: <strong>{code}</strong></p>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <button type="submit" className="btn-submit">Accept Invitation</button>
      </form>
    </div>
  );
}

export default AcceptInvite;
