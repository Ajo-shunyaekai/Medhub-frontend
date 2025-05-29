import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Successful from '../../../assets/images/successful.svg';
import styles from './thankyou.module.css';
import { style } from '@mui/system';

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};

  useEffect(() => {
    window.history.pushState(null, '', window?.location?.pathname);

    const handleBackButton = (e) => {
      e.preventDefault();
      navigate('/buyer/buy/new-products');
    };

    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.section}>
        
          <img className={styles.imageContainer} src={Successful} alt='successful' />
        
        <div className={styles.mainHeading}>
          Thank You for your Inquiry !!
        </div>
        <span className={styles.mainContent}>
          The Supplier has been notified of your enquiry and will respond  in due  course. <br/> Please keep check your emails for any notifications from the suppliers.
        </span>
        <span className={styles.mainContent}>
          A copy of the enquiry has also been emailed to you for your reference.
        </span>
        <div className={styles.buttonContainer}>
        <Link to='/buyer/buy/new-products'>
          <div className={styles.buttonsSection}>
            <span className={styles.button}>Search more products</span>
          </div>
        </Link>
        <Link to='/buyer/send-inquiry'>
          <div className={styles.buttonsSection}>
            <span className={styles.button}>Back to your cart</span>
          </div>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;