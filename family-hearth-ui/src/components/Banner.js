import React from 'react';
import { Link } from 'react-router-dom';

function Banner() {
  return (
    <header className="banner">
      <h1><Link to="/">FamilyHearth</Link></h1>
    </header>
  );
}

export default Banner;