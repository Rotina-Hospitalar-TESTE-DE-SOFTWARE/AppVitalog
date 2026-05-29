import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  placeholder, 
  icon: Icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {Icon && <Icon size={16} />}
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className="input-field"
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
