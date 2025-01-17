import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import OtpInput from "react-otp-input";
import "./login.css";
import "./forgotpass.css";
import { useSelector } from "react-redux";
import { apiRequests } from "../../../../api";

const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

const VerifyOTP = ({ step, setStep }) => {
  const { emailToResetPassword } = useSelector((state) => state?.userReducer);
  const [timer, setTimer] = useState(60); // Timer starts at 60 seconds
  const [canResend, setCanResend] = useState(false); // Initially disable resend button

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(intervalId); // Clean up interval on component unmount
    } else {
      setCanResend(true); // Enable resend after 1 minute
    }
  }, [step, timer]);

  return (
    <Formik
      initialValues={{ otp: "" }}
      validationSchema={otpValidationSchema}
      onSubmit={async (values) => {
        // Handle OTP verification logic here
        const payloadData = {
          otp: values.otp,
          email: emailToResetPassword,
          user_type: "Supplier",
        };
        console.log("OTP submitted:", payloadData);
        const response = await apiRequests.postRequest(
          "auth/verify-otp",
          payloadData
        );
        if (response?.code == 200) {
          setStep(3); // Proceed to password reset step
        }
      }}
      validateOnBlur={true}
      validateOnChange={false} // Only validate when user submits
    >
      {({ setFieldValue, values }) => (
        <Form className="login-main-form-section">
          <div className="otp-inputs">
            <label className="login-form-main-label">OTP*</label>
            <OtpInput
              value={values.otp} // Now it refers to Formik's state
              onChange={(otp) => setFieldValue("otp", otp)} // Update Formik state
              numInputs={6}
              separator={<span style={{ width: "8px" }}></span>}
              isInputNum={true}
              shouldAutoFocus={true}
              inputStyle={{
                border: "1px solid transparent",
                borderRadius: "8px",
                width: "54px",
                height: "54px",
                fontSize: "12px",
                color: "#000",
                fontWeight: "400",
                caretColor: "blue",
              }}
              focusStyle={{
                border: "1px solid #CFD3DB",
                outline: "none",
              }}
            />
          </div>
          <ErrorMessage name="otp" component="div" className="error-message" />
          <p className="verify-footer">
            Didn't receive the code?{" "}
            <span
              className={`resend-link ${canResend ? "active" : "disabled"}`}
              onClick={() => canResend && console.log("Resend OTP clicked")}
              style={{ cursor: canResend ? "pointer" : "not-allowed" }}
            >
              {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
            </span>
          </p>
          <div className="login-form-main-buttons">
            <button type="submit" className="login-form-main-login">
              Verify OTP
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default VerifyOTP;
