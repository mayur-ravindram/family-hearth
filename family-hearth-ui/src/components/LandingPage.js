import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="hero">
        <h1>Welcome to FamilyHearth</h1>
        <p>Your private, digital hearth to share moments and memories with the ones who matter most.</p>
        <div className="cta-buttons">
          <Link to="/create-family" className="btn btn-primary">Create a Family</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
      <div className="features">
        <div className="feature">
          <h2>Private & Secure</h2>
          <p>Share with confidence. Your family's space is invite-only and secure.</p>
        </div>
        <div className="feature">
          <h2>Stay Connected</h2>
          <p>Post updates, share photos, and keep in touch, no matter how far apart.</p>
        </div>
        <div className="feature">
          <h2>Create Memories</h2>
          <p>A central place for your family's stories and milestones.</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;