import React from 'react';

function UserProfile({ username, role, status }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '12px' }}>
      <h3>User: {username}</h3>
      <p>Role: {role}</p>
      <p>Account Status: {status}</p>
    </div>
  );
}

export default UserProfile;