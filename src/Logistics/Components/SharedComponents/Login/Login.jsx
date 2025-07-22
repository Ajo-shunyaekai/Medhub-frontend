import React, { useState } from 'react'
import logo from '../../../Assets/Images/navibluelogo.svg'
import Styles from './loginlayout.module.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {apiRequests} from '../../../../api/index'
import Cookies from 'js-cookie';

const Login = ({socket}) => {

  const [loading, setLoading]           = useState(false);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]             = useState({});

  const navigate = useNavigate();

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

    const handlePasswordChange = (e) => {
      

        if (e.target.value.length <= 25) {
            setPassword(e.target.value);
            if (errors.password) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: '',
                }));
            }
        }
    };

    const validateForm = () => {
     const newErrors = {};

     // Email validation
     if (!email) {
        newErrors.email = 'Email is Required';
     } 
     else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email Address is Invalid';
     }

     // Password validation
     if (!password) {
        newErrors.password = 'Password is Required';
     } 
     else if (!/(?=.*[A-Z])/.test(password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
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
                password,
                usertype: "Logistics"
            }
            try {
                const response = await apiRequests?.postRequest(`auth/login`, obj)
                console.log("response in logistic login: ",response);
                if(response?.code !== 200){
                    toast(response.message, { type: "error" });
                }else{
                    const { accessToken, refreshToken} = response.data;
                    // Store tokens in cookies
                    localStorage?.setItem(`token1`, accessToken)
                    localStorage?.setItem(`token2`, refreshToken)
                    Cookies.set('accessToken', accessToken,);
                    Cookies.set('refreshToken', refreshToken,);

                    const {data} = await response;
                    for (let x in data) {
                        localStorage?.setItem(`${x}`, data[x])
                        if(x ==='registeredAddress'){
                            for (let y in data[x]) {
                                localStorage?.setItem(`${y}`, data[x][y])
                            }
                        }
                    }
                    setTimeout(() => {
                        navigate("/logistic");
                        setLoading(true)
                    }, 1000);

                    if ('Notification' in window) {
                        if (Notification.permission === 'granted') {
                            // If permission is already granted, register the user directly
                            console.log('response?.data.partner_id',response?.data.partner_id)
                            const userId = response?.data.partner_id;
                            socket.emit('registerPartner', userId);
                        } else if (Notification.permission !== 'denied') {
                            // Request permission if not already denied
                            const permission = await Notification.requestPermission();
                            if (permission === 'granted') {
                                console.log('response?.data.partner_id',response?.data.partner_id)
                                const userId = response.data.partner_id;
                                socket.emit("registerPartner", userId);
                            }
                        }
                    }

                }
            } catch (error) {
                setLoading(false)
                toast(error.message, { type: "error" });
            } finally{
                setLoading(false)

            }
        }
    };

  return (
    <section className={Styles.loginFormContainer}>
        <p className={Styles.loginHeadingText}>Logistics Login</p>

        {/* form-section */}
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
          <div className={Styles.loginFormMainDiv}>
              <label className={Styles.loginFormMainLabel}>Password*</label>
              <div className={Styles.loginFormInputEyeContainer}>
                  <input
                      className={Styles.loginFormInput}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='off'
                      name='password'
                      placeholder='******'
                      value={password}
                      onChange={handlePasswordChange}
                  />
                  {showPassword ? (
                      <VisibilityOffIcon className={Styles.loginFormInputEyeIcons} onClick={()=>setShowPassword(!showPassword)} />
                  ) : (
                      <VisibilityIcon className={Styles.loginFormInputEyeIcons} onClick={()=>setShowPassword(!showPassword)} />
                  )}
              </div>
              {errors.password && <span className={Styles.loginErrors}>{errors.password}</span>}
          </div>
          <Link to='/logistic/forgot-password'>
            <div className={Styles.loginFormMainDiv}>
                <span className={Styles.loginFormMainPassword}>Forgot Password?</span>
            </div>
          </Link>

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
                      'Login'
                  )}
                  </button>
          </div>
        </form>
    </section>
  )
}

export default Login