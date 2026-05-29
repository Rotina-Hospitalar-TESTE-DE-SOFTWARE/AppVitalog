import React from 'react';

const Card = ({ children, title, icon: Icon, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <h3 className="card-title">
          {Icon && <Icon size={20} />}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
