import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./login.css";
import "./forgotpass.css";
import { useSelector } from "react-redux";
import { apiRequests } from "../../../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Validation schemas for each step using Yup

const passwordValidationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not exceed 15 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ChangePassword = ({ step, setStep }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else if (field === 'confirmPassword') {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };


  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const { emailToResetPassword } = useSelector((state) => state?.userReducer);
  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={passwordValidationSchema}
      onSubmit={async (values) => {
        // Handle password change logic here
        setLoading(true)
        const payloadData = {
          password: values.password,
          confirmPassword: values.confirmPassword,
          email: emailToResetPassword,
          user_type: "Supplier",
        };
        console.log("Password reset:", payloadData);
        const response = await apiRequests.postRequest(
          "auth/reset-password",
          payloadData
        );
        if (response?.code != 200) {
          toast.error(response?.message);
          // navigate("supplier/login");
          setLoading(false)
          return;
        }
        toast.success("Password Changed Successfully!");
        setLoading(false)
        navigate("/supplier/login");
      }}
      validateOnBlur={true}
      validateOnChange={true} // Validate on change as well
    >
      {({ errors, touched }) => (
        <Form className="login-main-form-section">
          {/* New Password Field */}
          <div className="login-form-main-div">
            <label className="login-form-main-label">
              New Password<span className="labelstamp">*</span>
            </label>
            <div className="password-input-container">
              <Field
                className="login-form-main-input"
                autoComplete="off"
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                placeholder="Enter the New Password"
              />
              <button
                type="button"
                className="toggle-password-visibility"
                onClick={() => togglePasswordVisibility('password')}
                disabled={!document.querySelector('[name="password"]')?.value}
              >
                {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="errors-message"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="login-form-main-div">
            <label className="login-form-main-label">
              Confirm Password<span className="labelstamp">*</span>
            </label>
            <div className="password-input-container">
              <Field
                className="login-form-main-input"
                autoComplete="off"
                type={confirmPasswordVisible ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter the New Password"
              />
              <button
                type="button"
                className="toggle-password-visibility"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                disabled={!document.querySelector('[name="confirmPassword"]')?.value}
              >
                {confirmPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="errors-message"
            />
          </div>

          {/* Submit Button */}
          <div className="login-form-main-buttons">
            <button type="submit" className="login-form-main-login" disabled={loading}>
              {loading ? <div className="loading-spinner"></div> : 'Reset Password'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePassword;
