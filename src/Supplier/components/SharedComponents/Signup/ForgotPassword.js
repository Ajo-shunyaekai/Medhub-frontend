import React, { useState } from 'react';
import './login.css';
import './forgotpass.css'
import logo from '../../../assest/images/logo.svg';

const ForgotPasswordFlow = () => {
    const [step, setStep] = useState(1); // 1: Forgot Password, 2: OTP Verification, 3: Change Password

    // Function to render the corresponding step UI
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <form className='login-main-form-section'>
                        <div className='login-form-main-div'>
                            <label className='login-form-main-label'>Email ID</label>
                            <input
                                className='login-form-main-input'
                                autoComplete='off'
                                type='text'
                                name='email'
                                placeholder='username@domain.com'
                            />
                        </div>
                        <div className='login-form-main-buttons'>
                            <button
                                type='button'
                                className='login-form-main-login'
                                onClick={() => setStep(2)}
                            >
                                Verify Email
                            </button>
                        </div>
                    </form>
                );
            case 2:
                return (
                    <form className='login-main-form-section'>
                        <div className="otp-inputs">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    className="otp-input"
                                />
                            ))}
                        </div>
                        <p className="verify-footer">
                            Didn't receive the code?{' '}
                            <span className="resend-link">Request again</span>
                        </p>
                        <div className='login-form-main-buttons'>
                            <button
                                type='button'
                                className='login-form-main-login'
                                onClick={() => setStep(3)}
                            >
                                Verify OTP
                            </button>
                        </div>
                    </form>
                );
            case 3:
                return (
                    <form className='login-main-form-section'>
                        <div className='login-form-main-div'>
                            <label className='login-form-main-label'>New Password</label>
                            <input
                                className='login-form-main-input'
                                autoComplete='off'
                                type='password'
                                name='password'
                                placeholder='Enter the New Password'
                            />
                        </div>
                        <div className='login-form-main-div'>
                            <label className='login-form-main-label'>Confirm Password</label>
                            <input
                                className='login-form-main-input'
                                autoComplete='off'
                                type='password'
                                name='confirmPassword'
                                placeholder='Enter the Confirm Password'
                            />
                        </div>
                        <div className='login-form-main-buttons'>
                            <button
                                type='button'
                                className='login-form-main-login'
                                onClick={() => alert('Password Changed Successfully!')}
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className='login-main-container'>
            <div className='login-container-logo-section'>
                <img src={logo} alt="Logo" />
            </div>
            <div className='login-container-form-section'>
                <div className='login-container-form-section-heading'>
                    {step === 1 && 'Forgot Password'}
                    {step === 2 && 'OTP Verification'}
                    {step === 3 && 'Change Your Password'}
                </div>
                {renderStep()}
            </div>
        </div>
    );
};

export default ForgotPasswordFlow;
