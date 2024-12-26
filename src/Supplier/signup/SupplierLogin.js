import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import '../style/login.css';
import logo from '../assest/logo.svg';
import { Link } from 'react-router-dom';
import { apiRequests } from '../../api/index';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from '../../redux/reducers/userDataSlice';
import { useDispatch } from 'react-redux';


const SupplierLogin = ({socket}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
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
            newErrors.email = 'Email Address is Invalid';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is Required';
        } else if (!/(?=.*[A-Z])/.test(password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } 
        // else if (!/(?=.*[!@#$%^&*])/.test(password)) {
        //     newErrors.password = 'Password must contain at least one special character';
        // }

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
                user_type: "Supplier"
            }

            // postRequest('supplier/login', obj, async(response) => {
            //     if(response.code === 200) {
            //         // toast(response.message, { type: "success" });
            //         sessionStorage.setItem('supplier_id',response.result.supplier_id)
            //         sessionStorage.setItem('supplier_name',response.result.supplier_name)
            //         sessionStorage.setItem('supplier_email',response.result.supplier_email)
            //         sessionStorage.setItem('supplier_country_code',response.result.supplier_country_code)
            //         sessionStorage.setItem('supplier_mobile',response.result.supplier_mobile)
            //         sessionStorage.setItem('contact_person_country_code',response.result.contact_person_country_code)
            //         sessionStorage.setItem('contact_person_mobile',response.result.contact_person_mobile_no)
            //         sessionStorage.setItem('contact_person_name',response.result.contact_person_name)
            //         sessionStorage.setItem('supplier_image',response.result.supplier_image)
            //         sessionStorage.setItem('license_image',response.result.license_image)
            //         sessionStorage.setItem('tax_image',response.result.tax_image)
            //         sessionStorage.setItem('token',response.result.token)                    
            //         sessionStorage.setItem('_id', response?.result?._id)
            //         setTimeout(() => {
            //             navigate("/supplier");
            //             setLoading(true)
            //           }, 1000);

            //         //   if ('Notification' in window && Notification.permission !== 'granted') {
            //         //     const permission = await Notification.requestPermission();
            //         //     if (permission === 'granted') {
            //         //       const userId = response.result.supplier_id; 
            //         //       socket.emit('register',  userId );
            //         //     }
            //         //   } 

            //         if ('Notification' in window) {
            //             if (Notification.permission === 'granted') {
            //                 // If permission is already granted, register the user directly
            //                 const userId = response.result.supplier_id;
            //                 socket.emit('register', userId);
            //             } else if (Notification.permission !== 'denied') {
            //                 // Request permission if not already denied
            //                 const permission = await Notification.requestPermission();
            //                 if (permission === 'granted') {
            //                     // const userId = response.result.supplier_id;
            //                     // socket.emit('register', userId);
            //                 }
            //             }
            //         }
            //     } else {
            //         setLoading(false)
            //         toast(response.message, { type: "error" });
            //         console.log('error while login')
            //     }
            // })
            try {
                // const response = await apiRequests?.postRequest(`auth/login`, obj)
                // if(response.code !== 200){
                //     toast(response.message, { type: "error" });
                // }else{
                //     console.log("response ", response)
                //     const {result} = await response;
                //     for (let x in result) {
                //         sessionStorage.setItem(`${x}`, result[x])
                //         console.log(`RESPONSE OF LOGIN ADMIN USER : ${x} ${ result[x]}`)
                //     }
                //     setTimeout(() => {
                //         navigate("/supplier");
                //         setLoading(true)
                //         }, 1000);

                //     if ('Notification' in window) {
                //         if (Notification.permission === 'granted') {
                //             // If permission is already granted, register the user directly
                //             const userId = response.result.supplier_id;
                //             socket.emit('register', userId);
                //         } else if (Notification.permission !== 'denied') {
                //             // Request permission if not already denied
                //             const permission = await Notification.requestPermission();
                //             if (permission === 'granted') {
                //                 // const userId = response.result.supplier_id;
                //                 // socket.emit('register', userId);
                //             }
                //         }
                //     }

                // }
                const action = await dispatch(loginUser(obj))
                
                // Check if login was successful
                if (loginUser.fulfilled.match(action)) {
                    setTimeout(() => {
                        navigate("/supplier"); // Navigate to '/buyer' upon successful login
                    }, 500);
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
                toast(error.message, { type: "error" });
                console.log('error while login')
            } finally{
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
        if ( sessionStorage.getItem("supplier_id") !== undefined && sessionStorage.getItem("supplier_id") ) {
            navigate('/supplier');
        }
    }, []);

    const handleCancel = () => {
        setEmail('')
        setPassword('')
        setErrors({})
      }

    return (
        <div className='login-main-container'>
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
                    <Link to='/supplier/sign-up'>
                        <span className='login__signup__here'>&nbsp;Signup here</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SupplierLogin;
