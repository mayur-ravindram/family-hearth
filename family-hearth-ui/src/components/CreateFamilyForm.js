import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFamily } from '../api';

function CreateFamilyForm() {
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const { family, jwt } = await createFamily({
        name,
        timezone,
        adminName,
        adminEmail,
        phone,
      });
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('family', JSON.stringify(family));
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      console.error('Error creating family:', error);
    }
  };

  return (
    <div className="create-family-form-container">
      <h2>Create Your Family Hearth</h2>
      <p>Start a new private space for your family.</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="familyName">Family Name</label>
            <input
                type="text"
                id="familyName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., The Millers"
                required
            />
        </div>
        <div className="form-group">
            <label htmlFor="timezone">Timezone</label>
            <input
                type="text"
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                required
            />
        </div>
        <div className="form-group">
            <label htmlFor="adminName">Your Name</label>
            <input
                type="text"
                id="adminName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="John Doe"
                required
            />
        </div>
        <div className="form-group">
          <label htmlFor="adminEmail">Your Email</label>
          <input
            type="email"
            id="adminEmail"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="form-group">
            <label htmlFor="phone">Your Phone</label>
            <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(123) 456-7890"
                required
            />
        </div>
        <button type="submit" className="btn-submit">Create Family</button>
      </form>
    </div>
  );
}

export default CreateFamilyForm;