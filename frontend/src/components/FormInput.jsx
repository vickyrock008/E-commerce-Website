// src/components/FormInput.jsx

import React from 'react';

// This component is now defined ONCE, outside of any re-rendering page.
const FormInput = ({ label, name, type = 'text', required = false, value, onChange, readOnly = false, inputMode }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && '*'}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      required={required}
      value={value}
      onChange={onChange}
      inputMode={inputMode}
      readOnly={readOnly}
      // I've merged the styles from both files for consistency
      className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-3 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-red-500 focus:border-red-500'}`}
    />
  </div>
);

export default FormInput;