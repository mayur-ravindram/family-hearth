import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user }) => {
  if (!user) {
    return null;
  }

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return '';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="user-profile">
      <div className="avatar">
        {getInitials(user.firstName, user.lastName)}
      </div>
    </div>
  );
};

export default UserProfile;