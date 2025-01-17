import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./login.css";
import "./forgotpass.css";
import { useDispatch } from "react-redux";
import { setEmailToResetPassword } from "../../../../redux/reducers/userDataSlice";
import { apiRequests } from "../../../../api";

// Validation schemas for each step using Yup
const emailValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const VerifyEmail = ({ step, setStep }) => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={emailValidationSchema}
      onSubmit={async (values) => {
        // Handle email verification logic here
        dispatch(setEmailToResetPassword(values.email));
        const payloadData = {
          email: values.email,
          user_type: "Buyer",
        };
        console.log("Email submitted:", payloadData);
        const response = await apiRequests.postRequest(
          "auth/verify-email",
          payloadData
        );
        if (response?.code == 200) {
          setStep(2); // Proceed to OTP verification step
        }
      }}
      validateOnBlur={true}
      validateOnChange={false} // Only validate when user submits
    >
      {() => (
        <Form className="login-main-form-section">
          <div className="login-form-main-div">
            <label className="login-form-main-label">Email ID*</label>
            <Field
              className="login-form-main-input"
              autoComplete="off"
              type="text"
              name="email"
              placeholder="username@domain.com"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="error-message"
            />
          </div>
          <div className="login-form-main-buttons">
            <button type="submit" className="login-form-main-login">
              Verify Email
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default VerifyEmail;
