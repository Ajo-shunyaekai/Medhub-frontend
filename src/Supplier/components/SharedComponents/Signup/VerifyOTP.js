import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import OtpInput from "react-otp-input";
import "./login.css";
import "./forgotpass.css";
import { useSelector } from "react-redux";
import { apiRequests } from "../../../../api";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false)

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

  // Function to request resending the OTP
  const reqResendOTP = async () => {
    try {
      const payloadData = {
        email: emailToResetPassword,
        usertype: "Supplier", // Make sure you have the correct usertype
      };

      const response = await apiRequests.postRequest(
        "auth/resend-otp",
        payloadData
      );

      if (response?.code !== 200) {
        toast.error(response?.message);
        return;
      }

      toast.success(response?.message || "OTP Resent Successfully");
      setTimer(60); // Reset timer after successfully resending OTP
      setCanResend(false); // Disable resend button again after sending
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <Formik
      initialValues={{ otp: "" }}
      validationSchema={otpValidationSchema}
      onSubmit={async (values) => {
        // Handle OTP verification logic here
        const payloadData = {
          otp: values.otp,
          email: emailToResetPassword,
          usertype: "Supplier",
        };
        setLoading(true)
        const response = await apiRequests.postRequest(
          "auth/verify-otp",
          payloadData
        );
        if (response?.code != 200) {
          toast.error(response?.message);
          setLoading(false)
          return;
        }
        toast.success(response?.message || "OTP Verified");
        setLoading(false)
        setStep(3); // Proceed to OTP verification step
      }}
      validateOnBlur={true}
      validateOnChange={false} // Only validate when user submits
    >
      {({ setFieldValue, values }) => (
        <Form className="login-main-form-section">
          <div className="otp-inputs">
            <OtpInput
              value={values.otp}
              onChange={(otp) => setFieldValue("otp", otp)} 
              numInputs={6}
              separator={<span style={{ width: "8px" }}></span>}
              isInputNum={true}
              shouldAutoFocus={true}
              inputStyle={{
                border: "1px solid transparent",
                borderRadius: "8px",
                width: "54px",
                height: "54px",
                fontSize: "14px",
                color: "#282f86",
                fontWeight: "500",
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
              onClick={() => canResend && reqResendOTP("Resend OTP clicked")}
              style={{ cursor: canResend ? "pointer" : "not-allowed" }}
            >
              {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
            </span>
          </p>
          <div className="login-form-main-buttons">
            <button type="submit" className="login-form-main-login" disabled={loading}>
            {loading ? (
                  <div className='loading-spinner'></div>
              ) : (
                  'Verify OTP'
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default VerifyOTP;
