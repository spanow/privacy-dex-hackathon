import React from 'react';
import PropTypes from 'prop-types';

const PrivacyIndicator = ({ 
  label, 
  active, 
  activeText, 
  inactiveText,
  testId 
}) => {
  return (
    <div className="privacy-indicator">
      <div 
        className={`privacy-indicator-dot ${active ? 'active' : 'inactive'}`}
        data-testid={testId}
      ></div>
      <div className="flex flex-col">
        <span className="font-medium">{label}</span>
        <span className="text-sm text-gray-300">
          {active ? activeText : inactiveText}
        </span>
      </div>
    </div>
  );
};

PrivacyIndicator.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  activeText: PropTypes.string.isRequired,
  inactiveText: PropTypes.string.isRequired,
  testId: PropTypes.string
};

export default PrivacyIndicator;