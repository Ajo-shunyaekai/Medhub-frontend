import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './login.css';
import logo from '../../../assets/Images/logo.svg';
import { apiRequests } from '../../../../api/index';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';

const Login = ({socket}) => {
    const [loading, setLoading]           = useState(false);
    const [email, setEmail]               = useState('');
    const [password, setPassword]         = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors]             = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!email) {
            newErrors.email = 'Email is Required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is Invalid';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is Required';
        } else if (!/(?=.*[A-Z])/.test(password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
            newErrors.password = 'Password must contain at least one special character';
        }

        return newErrors;
    };

    const handleCancel = () => {
        setEmail('')
        setPassword('')
        setErrors({})
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setLoading(true)
                const obj = {
                    email ,
                    password,
                    usertype: "Admin"
                }
        
             
                try {
                    const response = await apiRequests?.postRequest(`auth/login`, obj)
                    if(response?.code !== 200){
                        toast(response.message, { type: "error" });
                    }else{
                        const { accessToken, refreshToken} = response.data;
                        // Store tokens in cookies
                        localStorage.setItem(`token1`, accessToken)
                        localStorage.setItem(`token2`, refreshToken)
                        Cookies.set('accessToken', accessToken,);
                        Cookies.set('refreshToken', refreshToken,);

                        const {data} = await response;
                        for (let x in data) {
                            localStorage.setItem(`${x}`, data[x])
                            if(x =='registeredAddress'){
                                for (let y in data[x]) {
                                    localStorage.setItem(`${y}`, data[x][y])
                                }
                            }
                        }
    
                        setTimeout(() => {
                            navigate("/admin");
                        }, 1000);
    
                        if ('Notification' in window) {
                            if (Notification.permission === 'granted') {
                                // If permission is already granted, register the user directly
                                const userId = response.data?.admin_id;
                                socket.emit('registerAdmin', userId);
                            } else if (Notification.permission !== 'denied') {
                                // Request permission if not already denied
                                const permission = await Notification.requestPermission();
                                if (permission === 'granted') {
                                    const userId = response.data?.admin_id;
                                    socket.emit('registerAdmin', userId);
                                }
                            }
                        } else {
                            setLoading(false)
                            toast(response.message, { type: "error" });
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='login-main-container'>
            <ToastContainer />
            <div className='login-container-logo-section'>
                <img src={logo} alt="Logo" />
            </div>
            <div className='login-container-form-section'>
                <div className='login-container-form-section-heading'>Login</div>
                <form className='login-main-form-section' onSubmit={handleSubmit}>
                    <div className='login-form-main-div'>
                        <label className='login-form-main-label'>Email ID</label>
                        <input
                            className='login-form-main-input'
                            autoComplete='off'
                            type='text'
                            name='email'
                            placeholder='username@domain.com'
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {errors.email && <span className="login-errors">{errors.email}</span>}
                    </div>
                    <div className='login-form-main-div'>
                        <label className='login-form-main-label'>Password</label>
                        <div className='login-form-input-eye-container'>
                            <input
                                className='login-form-main-input'
                                type={showPassword ? 'text' : 'password'}
                                autoComplete='off'
                                name='password'
                                placeholder='******'
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {showPassword ? (
                                <VisibilityOffIcon className='login-form-input-eye-icons' onClick={togglePasswordVisibility} />
                            ) : (
                                <VisibilityIcon className='login-form-input-eye-icons' onClick={togglePasswordVisibility} />
                            )}
                        </div>
                        {errors.password && <span className="login-errors">{errors.password}</span>}
                    </div>
                    {/* <div className='login-form-main-div'>
                        <span className='login-form-main-password'>Forgot Password?</span>
                    </div> */}
                    <div className='login-form-main-buttons'>
                        {/* <button type='button' className='login-form-main-cancel' onClick={handleCancel}>Cancel</button> */}
                        <button type='submit' 
                        className='login-form-main-login'
                        style={{marginTop:'10px'}}
                        disabled={loading}
                        >
                            {loading ? (
                                <div className='loading-spinner'></div> 
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
