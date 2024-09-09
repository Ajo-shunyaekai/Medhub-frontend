import React from 'react'
import Successful from '../assest/successful.svg'
import '../style/thankyou.css'
import { Link, useLocation } from 'react-router-dom'

const ThankYou = () => {
    const location = useLocation();
    const { from } = location.state || {}; 
    return (
        <div className='thank-you-main-container'>
            <div className='thank-you-section'>
                <div className='thank-you-image-section'>
                    <img className='thank-you-image-container' src={Successful} alt='successful' />
                </div>
                <div className='thank-you-main-heading'>Thank You for Sending Us Your Inquiry!!</div>
                <div className='thank-you-main-content'>We’ve received your inquiry,
                    and our team will respond to you shortly.</div>
                <Link to='/buyer/'>
                    <div className='thank-you-buttons-section'>
                        <span className='thank-you-buttons'>Go Back</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default ThankYou