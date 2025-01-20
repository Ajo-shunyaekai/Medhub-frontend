import React, { useState } from 'react';
import './login.css';
import './forgotpass.css'
import logo from '../../../assest/images/logo.svg';
import ChangePassword from './ChangePassword';
import VerifyOTP from './VerifyOTP';
import VerifyEmail from './VerifyEmail';

const ForgotPasswordFlow = () => {
    const [step, setStep] = useState(1); // 1: Forgot Password, 2: OTP Verification, 3: Change Password
  
    // Function to render the corresponding step UI
    const renderStep = () => {
      switch (step) {
        case 1:
          return (
            <VerifyEmail
              step={step}
              setStep={setStep}
            />
          );
        case 2:
          return (
            <VerifyOTP
              step={step}
              setStep={setStep}
            />
          );
        case 3:
          return (
            <ChangePassword
              step={step}
              setStep={setStep}
            />
          );
        default:
          return null;
      }
    };
  
    return (
      <div className="login-main-container">
        <div className="login-container-logo-section">
          <img src={logo} alt="Logo" />
        </div>
        <div className="login-container-form-section">
          <div className="login-container-form-section-heading">
            {step === 1 && "Forgot Password"}
            {step === 2 && "OTP Verification"}
            {step === 3 && "Change Your Password"}
          </div>
          {renderStep()}
        </div>
      </div>
    );
  };

export default ForgotPasswordFlow;
