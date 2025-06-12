// src/components/Spinner.jsx
import React from 'react';

const Spinner = ({ size = '1.25rem', color = 'white' }) => {
  return (
    <div
      className="loading-spinner"
      style={{ height: size, width: size, borderBottomColor: color }}
    ></div>
  );
};

export default Spinner;