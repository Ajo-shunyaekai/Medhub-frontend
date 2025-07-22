import React from 'react'
import io from "socket.io-client";
import logo from '../../../Assets/Images/navibluelogo.svg'
import { useLocation } from 'react-router-dom'
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Styles from './loginlayout.module.css'

const socket = io.connect(process.env.REACT_APP_SERVER_URL, {
    autoConnect: false,
  });

const LoginLayout = () => {
    const location = useLocation().pathname;
    const path = location.split('/').at(2);
    

  return (
    <div className={Styles.mainContainer}>
        {/* logo */}
        <div className={Styles.imageContainer}>
            <img src={logo} alt="logistic-login" className={Styles.logoImage} />
        </div>
        {/* render whether login-section, forgot-password or email verification */}
        <div className=''>
            {
                path == 'login'? (<Login socket={socket}/>):(<ForgotPassword/>)
            }
        </div>

    </div>
  )
}

export default LoginLayout