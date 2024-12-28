import React from 'react';

const ProfileSection = ({ user }) => {
  return (
    <div className="profile-section">
      <img src={user.avatar || '/default-avatar.png'} alt="Avatar" />
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {/* Add buttons or forms for updating the profile */}
    </div>
  );
};

export default ProfileSection;
