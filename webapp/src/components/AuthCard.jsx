// src/components/AuthCard.jsx
import React from 'react';

const AuthCard = ({ children, title }) => {
  return (
    <div className="auth-card">
      <h2 className="auth-heading">{title}</h2>
      {children}
    </div>
  );
};

export default AuthCard;