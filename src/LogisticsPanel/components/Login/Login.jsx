import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import { apiRequests } from "../../../api/index";
import { toast, ToastContainer } from "react-toastify";
import logo from "../../assets/images/navibluelogo.svg";
import styles from "./Login.module.css";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';

function Login() {
  const [email, setEmail]                = useState("");
  const [password, setPassword]          = useState("");
  const [showPassword, setShowPassword]  = useState(false);
  const [loading, setLoading]            = useState(false);
  const [errors, setErrors]              = useState({});
  const navigate                         = useNavigate();

  const handleClickShowPassword          = () => setShowPassword((show) => !show);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = "Must contain at least one uppercase letter";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequests.postRequest(`auth/login`, { email, password, usertype: "Logistics" });
      if (response?.code !== 200) {
        toast.error(response.message);
      } else {
        const { accessToken, refreshToken} = response.data;
        // Store tokens in cookies
        localStorage.setItem(`token1`, accessToken)
        localStorage.setItem(`token2`, refreshToken)
        Cookies.set('accessToken', accessToken,);
        Cookies.set('refreshToken', refreshToken,);
        
        Object.entries(response.data).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
        setTimeout(() => navigate("/logistics"), 500);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    if (e.target.value.length <= 50) {
      setEmail(e.target.value);
      if (errors.email) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "",
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    if (e.target.value.length <= 25) {
      setPassword(e.target.value);
      if (errors.password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "",
        }));
      }
    }
  };

  return (
    <section className={`${styles.loginContainer}`}>
      <ToastContainer />
      <main className={`${styles.cardContainer}`}>
        <div className={`${styles.wrapper}`}>
          <div className="row">
            <div className="col-12">
              <img className={`${styles.logo}`} src={logo} alt="logo" />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h4 className={`${styles.title}`}>Logistics Login</h4>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={`${styles.loginForm}`}>
            <TextField
              id="email"
              label="Email Address"
              variant="filled"
              fullWidth
              value={email}
              autoComplete="off"
              onChange={handleEmailChange}
              helperText={errors.email}
              error={!!errors.email}
            />

            <FormControl variant="filled" fullWidth error={!!errors.password}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <FilledInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="new-password"
                onChange={handlePasswordChange}
                helperText={errors.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.password && (
                <p className={styles.errorText}>{errors.password}</p>
              )}
            </FormControl>

            <button
              type="submit"
              className={`${styles.loginButton}`}
              disabled={loading}
            >
              {loading ? (
                <div className={`${styles.loadingSpinner}`}></div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="row">
            <div className={`col-12 ${styles.links}`}>
              <Link to={`/logistics/forgot-password`} className={`${styles.link}`}>
                Forgot Password
              </Link>
              <Link to={`/logistics/sign-up`} className={`${styles.link}`}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default Login;
