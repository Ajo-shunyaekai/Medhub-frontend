import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import logincss from '../../style/login.css';
import logo from '../../assest/signup.svg';
import { Link } from 'react-router-dom';
import { postRequest } from '../../api/Requests';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!/(?=.*[A-Z])/.test(password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
            newErrors.password = 'Password must contain at least one special character';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
                const obj = {
                    email ,
                    password
                }
        
                postRequest('admin/login', obj, async (response) => {
                    if (response.code === 200) {
                        toast(response.message, { type: "success" });
                        sessionStorage.setItem('admin_id', response.result?.admin_id) 
                        sessionStorage.setItem('user_name', response.result?.user_name)
                        sessionStorage.setItem('token', response.result?.token)
                        sessionStorage.setItem('email', response.result?.email)

                        setTimeout(() => {
                        navigate("/admin");
                      }, 1000);
                    } else {
                        toast(response.message, { type: "error" });
                       console.log('error in admin/login api',response);
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
                    <div className='login-form-main-div'>
                        <span className='login-form-main-password'>Forgot Password?</span>
                    </div>
                    <div className='login-form-main-buttons'>
                        <button type='button' className='login-form-main-cancel'>Cancel</button>
                        <button type='submit' className='login-form-main-login'>Login</button>
                    </div>
                </form>
                <div className="header__center">OR</div>
                <div className='login-form-main-signup'>
                    <span className='login__signup__content'>Don't have an account?</span>
                    <Link to='/admin/sign-up'>
                        <span className='login__signup__here'>&nbsp;Signup here</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
