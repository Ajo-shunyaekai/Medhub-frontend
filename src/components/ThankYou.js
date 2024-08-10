import React from 'react'
import Successful from '../assest/successful.svg'
import '../style/thankyou.css'
const ThankYou = () => {
    return (
        <div className='thank-you-main-container'>
            <div className='thank-you-section'>
                <div className='thank-you-image-section'>
                    <img className='thank-you-image-container' src={Successful} alt='successful' />
                </div>
                <div className='thank-you-main-heading'>Thanks for submitting !</div>
                <div className='thank-you-main-content'>Lorem Ipsum is simply dummy text of the printing and typesetting 
                    industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                     when an unknown printer took a galley of type and scrambled it to make a type specimen book.</div>
            </div>
        </div>
    )
}

export default ThankYou