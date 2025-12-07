import React, { useState } from 'react';
import { createInviteCode } from '../api';
import './GenerateInvite.css';

function GenerateInvite({ familyId }) {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState(null);

  const handleGenerateInvite = async () => {
    setError(null);
    try {
      const { code } = await createInviteCode(familyId);
      const inviteUrl = `${window.location.origin}/accept-invite/${code}`;
      setInviteCode(inviteUrl);
    } catch (error) {
      setError(error.message);
      console.error('Error generating invite code:', error);
    }
  };

  return (
    <div className="generate-invite-container">
      <h3>Invite a Family Member</h3>
      <button onClick={handleGenerateInvite} className="btn-primary">Generate Invite Link</button>
      {error && <p className="error-message">{error}</p>}
      {inviteCode && (
        <div className="invite-code-display">
          <p>Share this link with your family member:</p>
          <input type="text" value={inviteCode} readOnly />
          <button onClick={() => navigator.clipboard.writeText(inviteCode)}>Copy</button>
        </div>
      )}
    </div>
  );
}

export default GenerateInvite;
