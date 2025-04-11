import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './login.css';
import logo from '../../../assets/images/navibluelogo.svg';
import { Link } from 'react-router-dom';
import { apiRequests } from '../../../../api/index';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from 'react-spinners';
import { messaging, getToken, onMessage } from '../../../../utils/firebaseUtils';


const Login = ({ socket }) => {
    const [fcmToken, setFcmToken] = useState(null)

    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is Required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email Address is Invalid';
        }

        if (!password) {
            newErrors.password = 'Password is Required';
            // } else if (!/(?=.*[A-Z])/.test(password)) {
            //     newErrors.password = 'Password must contain at least one uppercase letter';
            // } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
            //     newErrors.password = 'Password must contain at least one special character';
        }

        return newErrors;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setLoading(true)
            let obj = {
                email,
                password,
                usertype: "Buyer"
            }
            try {
                const response = await apiRequests?.postRequest(`auth/login`, obj)
                if (response.code !== 200) {
                    toast(response.message, { type: "error" });
                    return
                }
                const { data } = await response;
                for (let x in data) {
                    localStorage.setItem(`${x}`, data[x])
                    if(x =='registeredAddress'){
                        for (let y in data[x]) {
                            localStorage.setItem(`${y}`, data[x][y])
                        }
                    }
                }
                setTimeout(() => {
                    navigate("/buyer");
                    setLoading(true)
                }, 500);

                if ('Notification' in window) {
                    if (Notification.permission === 'granted') {
                        // If permission is already granted, register the user directly
                        const userId = response.data.buyer_id;
                        socket.emit('registerBuyer', userId);
                    } else if (Notification.permission !== 'denied') {
                        // Request permission if not already denied
                        const permission = await Notification.requestPermission();
                        if (permission === 'granted') {
                            const userId = response.data.buyer_id;
                            socket.emit('registerBuyer', userId);
                        }
                    }
                } else {
                    setLoading(false)
                    toast(response.message, { type: "error" });
                }
            } catch (error) {
                setLoading(false)
                toast(error.message, { type: "error" });
            } finally {
                setLoading(false)

            }

        }
    };

    const handleEmailChange = (e) => {
        // setEmail(e.target.value);
        // if (errors.email) {
        //     setErrors((prevErrors) => ({
        //         ...prevErrors,
        //         email: '',
        //     }));
        // }
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
        // setPassword(e.target.value);
        // if (errors.password) {
        //     setErrors((prevErrors) => ({
        //         ...prevErrors,
        //         password: '',
        //     }));
        // }
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

    useEffect(() => {
        if (localStorage.getItem("buyer_id") !== undefined && localStorage.getItem("buyer_id")) {
            navigate('/buyer');
        }
    }, []);

    const handleCancel = () => {
        setEmail('')
        setPassword('')
        setErrors({})
    }

    return (
        <div className='login-main-container'>
            {/* <ToastContainer /> */}
            <div className='login-container-logo-section'>
                <img src={logo} alt="Logo" />
            </div>
            <div className='login-container-form-section'>
                <div className='login-container-form-section-heading'>Buyer Login</div>
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
                    <Link to='/buyer/forgot-password'>
                        <div className='login-form-main-div'>
                            <span className='login-form-main-password'>Forgot Password?</span>
                        </div>
                    </Link>
                    <div className='login-form-main-buttons'>

                        {/* <button type='button' className='login-form-main-cancel' onClick={handleCancel}>Cancel</button> */}
                        <button
                            type='submit'
                            className='login-form-main-login'
                            disabled={loading}
                        >
                            {/* Login */}
                            {loading ? (
                                <div className='loading-spinner'></div>
                            ) : (
                                'Login'
                            )}
                        </button>

                    </div>
                </form>
                <div className="header__center">OR</div>
                <div className='login-form-main-signup'>
                    <span className='login__signup__content'>Don't have an account?</span>
                    <Link to='/buyer/sign-up'>
                        <span className='login__signup__here'>&nbsp;Sign up here</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
