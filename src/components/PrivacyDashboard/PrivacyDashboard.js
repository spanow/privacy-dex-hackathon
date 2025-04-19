import React from 'react';
import PropTypes from 'prop-types';
import PrivacyIndicator from './PrivacyIndicator';

const PrivacyDashboard = ({
  identityProtected = true,
  amountsHidden = true,
  historyPrivate = true,
  mevProtected = true
}) => {
  return (
    <div className="privacy-shield rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">PRIVACY SHIELD</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PrivacyIndicator 
          label="Identity" 
          active={identityProtected} 
          activeText="Protected"
          inactiveText="Exposed"
          testId="identity-indicator"
        />
        <PrivacyIndicator 
          label="Amounts" 
          active={amountsHidden}
          activeText="Hidden"
          inactiveText="Visible"
          testId="amounts-indicator"
        />
        <PrivacyIndicator 
          label="History" 
          active={historyPrivate}
          activeText="Private"
          inactiveText="Public"
          testId="history-indicator"
        />
        <PrivacyIndicator 
          label="Protection" 
          active={mevProtected}
          activeText="Anti-MEV"
          inactiveText="Vulnerable"
          testId="mev-indicator"
        />
      </div>
    </div>
  );
};

PrivacyDashboard.propTypes = {
  identityProtected: PropTypes.bool,
  amountsHidden: PropTypes.bool,
  historyPrivate: PropTypes.bool,
  mevProtected: PropTypes.bool
};

export default PrivacyDashboard;