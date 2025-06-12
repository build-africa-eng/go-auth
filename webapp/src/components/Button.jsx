// src/components/Button.jsx
import React from 'react';
import Spinner from './Spinner';

const Button = ({ children, onClick, disabled, className, ariaLabel, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
    >
      {disabled ? <Spinner /> : children}
    </button>
  );
};

export default Button;