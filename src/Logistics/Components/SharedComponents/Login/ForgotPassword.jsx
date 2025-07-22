import React, { useState } from 'react'
import VerifyEmail from './VerifyEmail';
import Verifyotp from './Verifyotp';
import UpdatePassword from './UpdatePassword';
import Styles from './loginlayout.module.css'

const ForgotPassword = () => {
    const [step, setStep] = useState(1);

    const renderSteps = () => {
        switch(step){
            case 1: return(
                <VerifyEmail step={step} setStep={setStep}/>
            );
            case 2: return(
                <Verifyotp step={step} setStep={setStep}/>
            );
            case 3: return(
                <UpdatePassword step={step} setStep={setStep}/>
            )
            default: return null;
        }
    }

  return (
    <div className={Styles.loginFormContainer}>
        <div className={Styles.loginHeadingText}>
            {step === 1 && "Change Your Password"}
            {step === 2 && "OTP Verification"}
            {step === 3 && "Change Your Password"}
        </div>
        {renderSteps()}
    </div>
  )
}

export default ForgotPassword