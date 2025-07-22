import React, { useEffect, useState } from 'react'
import Styles from './loginlayout.module.css'
import OtpInput from "react-otp-input";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from 'react-redux';
import { apiRequests } from "../../../../api/index";
import { toast } from "react-toastify";

const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

const Verifyotp = ({ step, setStep }) => {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60); // Timer starts at 60 seconds
  const [canResend, setCanResend] = useState(false); // Initially disable resend button
  const { emailToResetPassword } = useSelector((state) => state?.userReducer);
    

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
        usertype: "Logistics", // Make sure you have the correct usertype
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
          usertype: "Logistics",
        };
        setLoading(true)
        const response = await apiRequests.postRequest(
          "auth/verify-otp",
          payloadData
        );
        if (response?.code !== 200) {
          toast.error(response?.message);
          setLoading(false)
          return;
        }
        toast.success(response?.message || "OTP Verified");
        setLoading(false)
        setStep(3); // Proceed to OTP verification step
      }}
      validateOnBlur={true}
      validateOnChange={false}
    >
      {({ setFieldValue, values }) => (
        <Form >
          <div className={Styles.otpForm}>
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
          <p className={Styles.verifyFooter}>
            Didn't receive the code?{" "}
            <span
              className={`${Styles.resendLink} ${canResend ? Styles.active : Styles.disabled}`}
              /* onClick={() => canResend && reqResendOTP("Resend OTP clicked")} */
              style={{ cursor: canResend ? "pointer" : "not-allowed" }}
            >
              {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
            </span>
          </p>
          <div className={Styles.loginFormMainButtons}>
            <button type="submit" className={Styles.loginFormMainLogin} disabled={loading}>
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
  )
}

export default Verifyotp