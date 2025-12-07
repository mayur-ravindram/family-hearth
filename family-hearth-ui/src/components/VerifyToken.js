import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VerifyToken() {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleVerifyToken = () => {
    if (token) {
      navigate(`/auth/verify/${token}`);
    }
  };

  return (
    <div className="verify-token-container">
      <h2>Verify Your Magic Token</h2>
      <p>Please paste the token you received to complete the verification process.</p>
      <div className="form-group">
        <label htmlFor="token">Paste Token:</label>
        <input
          type="text"
          id="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your token here..."
        />
      </div>
      <button onClick={handleVerifyToken} className="btn-submit">Verify</button>
    </div>
  );
}

export default VerifyToken;