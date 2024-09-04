import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import '../style/login.css';
import logo from '../assest/signup.svg';
import { Link } from 'react-router-dom';
import { postRequest } from '../api/Requests';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from 'react-spinners';


const Login = () => {
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
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
            // } else if (!/(?=.*[A-Z])/.test(password)) {
            //     newErrors.password = 'Password must contain at least one uppercase letter';
            // } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
            //     newErrors.password = 'Password must contain at least one special character';
        }

        return newErrors;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setLoading(true)
            let obj = {
                email,
                password
            }
            postRequest('buyer/login', obj, async (response) => {
                if (response.code === 200) {
                    // toast(response.message, { type: "success" });
                    
                    sessionStorage.setItem('buyer_id', response.result.buyer_id)
                    sessionStorage.setItem('buyer_name', response.result.buyer_name)
                    sessionStorage.setItem('buyer_email', response.result.buyer_email)
                    sessionStorage.setItem('buyer_country_code', response.result.buyer_country_code)
                    sessionStorage.setItem('buyer_mobile', response.result.buyer_mobile)
                    sessionStorage.setItem('contact_person_country_code', response.result.contact_person_country_code)
                    sessionStorage.setItem('contact_person_mobile', response.result.contact_person_mobile)
                    sessionStorage.setItem('contact_person_name', response.result.contact_person_name)
                    sessionStorage.setItem('buyer_image', response.result.buyer_image)
                    sessionStorage.setItem('license_image', response.result.license_image)
                    sessionStorage.setItem('tax_image', response.result.tax_image)
                    sessionStorage.setItem('token', response.result.token)
                    sessionStorage.setItem('list_count', response.result.list_count)
                    setTimeout(() => {
                        navigate("/buyer");
                        setLoading(true)
                    }, 500);
                } else {
                    setLoading(false)
                    toast(response.message, { type: "error" });
                    console.log('error while login')
                }
                
            })

        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: '',
            }));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: '',
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (sessionStorage.getItem("buyer_id") !== undefined && sessionStorage.getItem("buyer_id")) {
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
                    <div className='login-form-main-div'>
                        <span className='login-form-main-password'>Forgot Password?</span>
                    </div>
                    <div className='login-form-main-buttons'>
                       
                        <button type='button' className='login-form-main-cancel' onClick={handleCancel}>Cancel</button>
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
                        <span className='login__signup__here'>&nbsp;Signup here</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
