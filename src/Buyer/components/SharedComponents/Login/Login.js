import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import './login.css';
import styles from "./Login.module.css";
import logo from "../../../assets/images/navibluelogo.svg";
import { Link } from "react-router-dom";
import { apiRequests } from "../../../../api/index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import {
  messaging,
  getToken,
  onMessage,
} from "../../../../utils/firebaseUtils";
import Cookies from "js-cookie";
import { handleGAEvent } from "../../../../analytics";

const Login = ({ socket }) => {
  const [fcmToken, setFcmToken] = useState(null);

  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is Required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email Address is Invalid";
    }

    if (!password) {
      newErrors.password = "Password is Required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleGAEvent("CTA", "Clicked Buyer Login", "Login Button");
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setLoading(true);
      let obj = {
        email,
        password,
        usertype: "Buyer",
      };
      try {
        const response = await apiRequests?.postRequest(`auth/login`, obj);
        if (response?.code !== 200) {
          toast(response.message, { type: "error" });
          return;
        }
        const { accessToken, refreshToken } = response.data;
        // Store tokens in cookies
        localStorage?.setItem(`token1`, accessToken);
        localStorage?.setItem(`token2`, refreshToken);
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);

        const { data } = await response;
        for (let x in data) {
          localStorage?.setItem(`${x}`, data[x]);
          if (x == "registeredAddress") {
            for (let y in data[x]) {
              localStorage?.setItem(`${y}`, data[x][y]);
            }
          }
        }
        setTimeout(() => {
          navigate("/buyer");
          setLoading(true);
        }, 500);

        if ("Notification" in window) {
          if (Notification.permission === "granted") {
            // If permission is already granted, register the user directly
            const userId = response.data.buyer_id;
            socket.emit("registerBuyer", userId);
          } else if (Notification.permission !== "denied") {
            // Request permission if not already denied
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
              const userId = response.data.buyer_id;
              socket.emit("registerBuyer", userId);
            }
          }
        } else {
          setLoading(false);
          toast(response.message, { type: "error" });
        }
      } catch (error) {
        setLoading(false);
        toast(error.message, { type: "error" });
      } finally {
        setLoading(false);
      }
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (
      localStorage?.getItem("buyer_id") !== undefined &&
      localStorage?.getItem("buyer_id")
    ) {
      navigate("/buyer");
    }
  }, []);

  const handleCancel = () => {
    setEmail("");
    setPassword("");
    setErrors({});
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleGAEvent(
        "Engagement",
        "Time Spent > 30 seconds",
        "Buyer Login Page"
      );
    }, 30000); // 30 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  return (
    <div className={styles.loginMainContainer}>
      {/* <ToastContainer /> */}
      <div className={styles.loginContainerLogoSection}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.loginContainerFormSection}>
        <div className={styles.loginContainerFormSectionHeading}>
          Buyer Login
        </div>
        <form className={styles.loginMainFormSection} onSubmit={handleSubmit}>
          <div className={styles.loginFormMainDiv}>
            <label className={styles.loginFormMainLabel}>Email ID</label>
            <input
              className={styles.loginFormMainInput}
              autoComplete="off"
              type="text"
              name="email"
              placeholder="username@domain.com"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && (
              <span className={styles.loginErrors}>{errors.email}</span>
            )}
          </div>
          <div className={styles.loginFormMainDiv}>
            <label className={styles.loginFormMainLabel}>Password</label>
            <div className={styles.loginFormInputEyeContainer}>
              <input
                className={styles.loginFormMainInput}
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                name="password"
                placeholder="******"
                value={password}
                onChange={handlePasswordChange}
              />
              {showPassword ? (
                <VisibilityOffIcon
                  className={styles.loginFormInputEyeIcons}
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <VisibilityIcon
                  className={styles.loginFormInputEyeIcons}
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            {errors.password && (
              <span className={styles.loginErrors}>{errors.password}</span>
            )}
          </div>
          <Link to="/buyer/forgot-password">
            <div className={styles.loginFormMainDiv}>
              <span className={styles.loginFormMainPassword}>
                Forgot Password?
              </span>
            </div>
          </Link>
          <div className={styles.loginFormMainButtons}>
            <button
              type="submit"
              className={styles.loginFormMainLogin}
              disabled={loading}
            >
              {/* Login */}
              {loading ? (
                <div className={styles.loadingSpinner}></div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <div className={styles.headerCenter}>OR</div>
        <div className={styles.loginFormMainSignup}>
          <span className={styles.loginSignupContent}>
            Don't have an account?
          </span>
          <Link to="/buyer/sign-up">
            <span className={styles.loginSignupHere}>&nbsp;Sign up here</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
