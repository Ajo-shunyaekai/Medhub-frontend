import React from 'react';
import '../style/sendinruiry.css';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-inquiry">
      <div className="modal-content-inquiry">
        <span className='model-content-heading'>Your inquiry is successfully sent</span>
        <div className="modal-close-button-inquiry" onClick={onClose}>
            <span className='modal-ok-button'>OK</span>
            </div>
      </div>
    </div>
  );
};

export default SuccessModal;



