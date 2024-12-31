import React from 'react'
import './subscription.css'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';


const Subscription = () => {
  return (
    <div className='membership-main-section'>
      <div className='membership-main-heading'>Subscription</div>
      <div className='subscription-card-container'>
        <div className='subscription-plan-head'>Subscription since October 2024</div>
        <div className='subscription-plan-section-cont'>
          <div className='subscription-basic-paln'>Basic Plan</div>
          <div className='subscription-next-payment'>Next Payment: 30 July 2025</div>
        </div>
        <Link to='/buyer/subscription-membership' className='subscription-footer-link'>
        <div className='subscription-footer-container'>       
          <div className='subscriprion-footer-head'>Subscription Membership</div>
          <div className='subscription-footer-icon'>
            <ChevronRightIcon />
          </div>         
        </div>
        </Link>
      </div>
    </div>
  )
}

export default Subscription