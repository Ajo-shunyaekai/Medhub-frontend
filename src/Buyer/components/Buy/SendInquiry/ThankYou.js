import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Successful from '../../../assest/images/successful.svg';
import './thankyou.css';

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};

  useEffect(() => {
    // Push the dashboard route to the history stack
    // This ensures the back button will navigate to the dashboard
    window.history.pushState(null, '', window.location.pathname);

    // Handle the popstate event (browser back button)
    const handleBackButton = (e) => {
      e.preventDefault();
      navigate('/buyer/buy/by-product');
    };

    window.addEventListener('popstate', handleBackButton);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  return (
    <div className='thank-you-main-container'>
      <div className='thank-you-section'>
        <div className='thank-you-image-section'>
          <img className='thank-you-image-container' src={Successful} alt='successful' />
        </div>
        <div className='thank-you-main-heading'>
          Thank You for Sending Us Your Inquiry!!
        </div>
        <div className='thank-you-main-content'>
          We've received your inquiry, and our team will respond to you shortly.
        </div>
        <Link to='/buyer/buy/by-product'>
          <div className='thank-you-buttons-section'>
            <span className='thank-you-buttons'>Go Back</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;