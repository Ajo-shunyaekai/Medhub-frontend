import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, FilledInput, FormControl, InputLabel, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import OtpInput from "react-otp-input";

import { apiRequests } from "../../../api/index";
import logo from "../../assets/images/navibluelogo.svg";
import styles from "./ForgotPassword.module.css";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  // Email step handler
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Please enter a valid email" });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // await apiRequests.postRequest("auth/send-otp", { email });
      toast.success("OTP sent to email");
      setStep(2);
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // OTP step handler
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      // await apiRequests.postRequest("auth/verify-otp", { email, otp });
      toast.success("OTP verified");
      setStep(3);
    } catch (err) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Password reset handler
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      // await apiRequests.postRequest("auth/reset-password", { email, password });
      toast.success("Password reset successfully");
      navigate("/logistics/login");
    } catch (err) {
      toast.error("Failed to reset password");
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

          {/* Step 1: Email Verification */}
          {step === 1 && (
            <>
              <h4 className={styles.title}>Forgot Password</h4>
              <form onSubmit={handleEmailSubmit} className={styles.loginForm}>
                <TextField
                  label="Email Address"
                  variant="filled"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText={errors.email}
                  error={!!errors.email}
                />
                <button type="submit" className={styles.loginButton} disabled={loading}>
                  {loading ? <div className={styles.loadingSpinner}></div> : "Verify Email"}
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <h4 className={styles.title}>OTP Verification</h4>
              <form onSubmit={handleOtpSubmit} className={styles.loginForm}>
                <div className={styles.otpSection}>
                  <OtpInput
                    value={otp}
                    separator={<span style={{ width: "8px" }}></span>}
                    onChange={setOtp}
                    numInputs={6}
                    isInputNum
                    shouldAutoFocus
                    inputStyle={{
                      border: "1px solid #282f86",
                      borderRadius: "8px",
                      width: "54px",
                      height: "54px",
                      fontSize: "16px",
                      color: "#282F86",
                      fontWeight: "500",
                      caretColor: "#282F86",
                    }}
                    focusStyle={{
                      border: "2px solid #282F86",
                      outline: "none",
                    }}
                  />
                </div>
                <p className="verify-footer">
                  Didn't receive the code?{" "}
                  <span className={styles.resend} onClick={() => toast.success("Resend OTP")}>
                    Resend OTP
                  </span>
                </p>
                <button type="submit" className={styles.loginButton} disabled={loading}>
                  {loading ? <div className={styles.loadingSpinner}></div> : "Verify OTP"}
                </button>
              </form>
            </>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <>
              <h4 className={styles.title}>Change Your Password</h4>
              <form onSubmit={handlePasswordReset} className={styles.loginForm}>
                <FormControl variant="filled" fullWidth error={!!errors.password}>
                  <InputLabel htmlFor="password">New Password</InputLabel>
                  <FilledInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                </FormControl>

                <FormControl variant="filled" fullWidth error={!!errors.confirmPassword}>
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <FilledInput
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    />
                    {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                  </FormControl>

                  <button type="submit" className={styles.loginButton} disabled={loading}>
                    {loading ? <div className={styles.loadingSpinner}></div> : "Reset Password"}
                  </button>

              </form>
            </>
          )}
        </div>
      </main>
    </section>
  );
}

export default ForgotPassword;
