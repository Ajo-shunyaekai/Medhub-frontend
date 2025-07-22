import React, { useState } from 'react'
import Styles from './loginlayout.module.css'
import { useDispatch } from 'react-redux';
import { setEmailToResetPassword } from '../../../../redux/reducers/userDataSlice';
import {apiRequests} from '../../../../api/index'
import { toast } from "react-toastify";

const VerifyEmail = ({step, setStep}) => {
  const [loading, setLoading]           = useState(false);
  const [email, setEmail]               = useState('');
  const [errors, setErrors]             = useState({});
  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    
    if (e.target.value.length <= 50) {
        setEmail(e.target.value);

        // Clear errors if email was previously invalid
        if (errors.email) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: '',
            }));
        }
    } else {
        setErrors((prevErrors) => ({
            ...prevErrors,
            email: '',
        }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
        newErrors.email = 'Email is Required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email Address is Invalid';
    }

    return newErrors;
   };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }
        else {
            setLoading(true)
            let obj = {
                email,
                usertype: "Logistics"
            }
            dispatch(setEmailToResetPassword(email));
            try {
                const response = await apiRequests?.postRequest(`auth/verify-email`, obj);
                console.log("response from forgot-password: ",response);
                if (response?.code !== 200) {
                toast.error(response?.message);
                setLoading(false);
                return;
                }
                toast.success(
                response?.message || "Email Verified and otp sent on the mail"
                );
                setLoading(false)
                setStep(2);
            }
            catch (error) {
                setLoading(false)
                toast(error.message, { type: "error" });
            }
            finally{
                setLoading(false)
            }
        }
    };

  return (
    <div>
      <form className={Styles.mainFormContainer} onSubmit={handleSubmit}>
          <div className={Styles.loginFormMainDiv}>
             <label className={Styles.loginFormMainLabel}>Email ID*</label>
             <input 
              type="email"
              autoComplete='off'
              name='email'
              placeholder='username@domain.com'
              value={email}
              onChange={handleEmailChange}
              className={Styles.loginFormInput}
              />
              {errors.email && <span className={Styles.loginErrors}>{errors.email}</span>}
          </div>

          {/* button */}
          <div className={Styles.loginFormMainButtons}>
              
              <button 
              type='submit' 
              className={Styles.loginFormMainLogin}
              disabled={loading}
              >
                  {/* Login */}
                  {loading ? (
                      <div className={Styles.loadingSpinner}></div> 
                  ) : (
                      'Verify Email'
                  )}
                  </button>
          </div>
      </form>
    </div>
  )
}

export default VerifyEmail