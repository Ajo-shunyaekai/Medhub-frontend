import React, { useState } from 'react'
import Styles from './loginlayout.module.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const UpdatePassword = () => {
  const [loading, setLoading]  = useState(false);
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]             = useState({});

  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handlePasswordChange = (e) => {
    

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

  const handleNewPasswordChange = (e) => {
          if (e.target.value.length <= 25) {
          setNewPassword(e.target.value);
          if (errors.password) {
              setErrors((prevErrors) => ({
                  ...prevErrors,
                  password: '',
              }));
          }
      }
  }
  
  return (
    <div>
      <form className={Styles.mainFormContainer}>
          <div className={Styles.loginFormMainDiv}>
              <label className={Styles.loginFormMainLabel}>Password*</label>
              <div className={Styles.loginFormInputEyeContainer}>
                  <input
                      className={Styles.loginFormInput}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='off'
                      name='password'
                      placeholder='******'
                      value={password}
                      onChange={handlePasswordChange}
                  />
                  {showPassword ? (
                      <VisibilityOffIcon className={Styles.loginFormInputEyeIcons} onClick={()=>setShowPassword(!showPassword)} />
                  ) : (
                      <VisibilityIcon className={Styles.loginFormInputEyeIcons} onClick={()=>setShowPassword(!showPassword)} />
                  )}
              </div>
              {errors.password && <span className={Styles.loginErrors}>{errors.password}</span>}
          </div>
          <div className={Styles.loginFormMainDiv}>
              <label className={Styles.loginFormMainLabel}>Password*</label>
              <div className={Styles.loginFormInputEyeContainer}>
                  <input
                      className={Styles.loginFormInput}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='off'
                      name='newPassword'
                      placeholder='******'
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                  />
                  {showPassword ? (
                      <VisibilityOffIcon className={Styles.loginFormInputEyeIcons} onClick={()=>setShowNewPassword(!showNewPassword)} />
                  ) : (
                      <VisibilityIcon className={Styles.loginFormInputEyeIcons} onClick={()=>setShowNewPassword(!showNewPassword)} />
                  )}
              </div>
              {errors.password && <span className={Styles.loginErrors}>{errors.password}</span>}
          </div>
          {/* button */}
          <div className={Styles.loginFormMainButtons}>
              
              <button 
              type='submit' 
              className={Styles.loginFormMainLogin}
              disabled={loading}
              >
                  {/* Login */}
                  {loading ? (
                      <div className={Styles.loadingSpinner}></div> 
                  ) : (
                      'Reset Password'
                  )}
                  </button>
          </div>
      </form>
    </div>
  )
}

export default UpdatePassword