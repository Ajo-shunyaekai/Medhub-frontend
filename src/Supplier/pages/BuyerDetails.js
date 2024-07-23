import React, { useState } from 'react';
import buyerdetails from '../style/buyerdetails.css'
import BuyerOrderList from './buyer/BuyerOrderList';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import { Link } from 'react-router-dom';

const BuyerDetails = () => {

    return (
        <>
            <div className='supplier-details-container'>
                <div className='supplier-details-inner-conatiner'>
                    <div className='supplier-details-left-inner-container'>
                        <div className='supplier-details-left-uppar-section'>
                            <div className='supplier-details-left-uppar-head'>Pharmaceuticals Pvt Ltd</div>
                            <div className='supplier-details-left-inner-section'>
                                <div className='supplier-details-left-inner-sec-text'>Buyer ID: SP12345657</div>
                                <div className='supplier-details-left-inner-img-container'>
                                    <div className='supplier-details-left-inner-mobile-button'>
                                        <PhoneInTalkOutlinedIcon className='supplier-details-left-inner-icon' />
                                        <span className='tooltip'>+971 120 2541 25</span>
                                    </div>
                                    <div className='supplier-details-left-inner-email-button'>
                                        <MailOutlineIcon className='supplier-details-left-inner-icon' />
                                        <span className='tooltip'>supplier@example.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='supplier-details-description-section'>
                            <div className='supplier-details-description-head'>Description</div>
                            <div className='supplier-details-description-content'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>
                        </div>
                        <div className='supllier-details-section'>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>License No.</div>
                                <div className='supplier-details-inner-text'>455SD78954</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Tax No.</div>
                                <div className='supplier-details-inner-text'>5655565FDA6</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Address</div>
                                <div className='supplier-details-inner-text'>476 Udyog Vihar Gurugaon</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Country of Origin</div>
                                <div className='supplier-details-inner-text'>Dubai</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Country of Operation</div>
                                <div className='supplier-details-inner-text'>Dubai, London, Singapur</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Contact Person Name:</div>
                                <div className='supplier-details-inner-text'>Mr. Satish Kumar</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Designation</div>
                                <div className='supplier-details-inner-text'>Market General Manager</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Email ID</div>
                                <div className='supplier-details-inner-text'>Pvt@gmail.com</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Mobile No.</div>
                                <div className='supplier-details-inner-text'>+971 1408767</div>
                            </div>
                        </div>
                    </div>
                    <div className='supplier-details-card-section'>
                        <div className='supplier-details-uppar-card-section'>
                            <div className='supplier-details-uppar-card-inner-section'>
                                <div className='supplier-details-card-container'>
                                    <Link to='/supplier/buyer-completed-list'>
                                        <div className='supplier-details-card-container-contents'>
                                            <div className='supplier-details-card-conteianer-head'>Completed Orders</div>
                                            <div className='supplier-details-card-conteianer-text'>45</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className='supplier-details-card-container'>
                                    <Link to='/supplier/buyer-active-list'>
                                        <div className='supplier-details-card-container-contents'>
                                            <div className='supplier-details-card-conteianer-head'>Active Orders</div>
                                            <div className='supplier-details-card-conteianer-text'>45</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className='supplier-details-card-container'>
                                    <Link to='/supplier/buyer-pending-list'>
                                        <div className='supplier-details-card-container-contents'>
                                            <div className='supplier-details-card-conteianer-head'>Pending Orders</div>
                                            <div className='supplier-details-card-conteianer-text'>45</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className='supplier-details-bottom-table-section'>
                            <BuyerOrderList />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BuyerDetails