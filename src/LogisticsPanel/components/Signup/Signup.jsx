import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import { apiRequests } from "../../../api/index";
import { toast, ToastContainer } from "react-toastify";
import logo from "../../assets/images/navibluelogo.svg";
import styles from "./Signup.module.css";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleClickShowPassword = () =>
    setShowPassword((show) => !show);

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = "Enter a valid 10-digit number";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = "Must contain at least one uppercase letter";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const response = await apiRequests.postRequest(`auth/login`, {
        email,
        password,
        usertype: "Logistics",
      });

      if (response?.code !== 200) {
        toast.error(response.message);
      } else {
        const { accessToken, refreshToken } = response.data;
        localStorage?.setItem("token1", accessToken);
        localStorage?.setItem("token2", refreshToken);
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);

        Object.entries(response.data).forEach(([key, value]) => {
          localStorage?.setItem(key, value);
        });

        setTimeout(() => navigate("/logistics"), 500);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.loginContainer}>
      <ToastContainer />
      <main className={styles.cardContainer}>
        <div className={styles.wrapper}>
          <div className="row">
            <div className="col-12">
              <img className={styles.logo} src={logo} alt="logo" />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h4 className={styles.title}>Logistics Signup</h4>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <TextField
              id="fullname"
              label="Full Name"
              variant="filled"
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              helperText={errors.fullName}
              error={!!errors.fullName}
            />

            <TextField
              id="email"
              label="Email Address"
              variant="filled"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={errors.email}
              error={!!errors.email}
            />

            <TextField
              id="contact"
              label="Contact Number"
              variant="filled"
              fullWidth
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              helperText={errors.contact}
              error={!!errors.contact}
            />

            <FormControl variant="filled" fullWidth error={!!errors.password}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <FilledInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.password && (
                <p className={styles.errorText}>{errors.password}</p>
              )}
            </FormControl>

            <FormControl
              variant="filled"
              fullWidth
              error={!!errors.confirmPassword}
            >
              <InputLabel htmlFor="confirmPassword">
                Confirm Password
              </InputLabel>
              <FilledInput
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.confirmPassword && (
                <p className={styles.errorText}>{errors.confirmPassword}</p>
              )}
            </FormControl>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? (
                <div className={styles.loadingSpinner}></div>
              ) : (
                "Signup"
              )}
            </button>
          </form>
        </div>
      </main>
    </section>
  );
}

export default Signup;
