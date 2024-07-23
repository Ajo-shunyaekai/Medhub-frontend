import React from 'react';
import '../style/detailsrequest.css'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import CompanyLogo from '../assest/companylogo.png'
import TradeLicense from '../assest/certificate.jpg'
import TaxCertificate from '../assest/tax-certificate.jpg'
import Certificate from '../assest/Medical_certificate.jpg'

const DetailsBuyerRequest = () => {
    return (
        <>
            <div className='buyer-details-container'>
                <div className='buyer-details-inner-conatiner'>
                    <div className='buyer-details-container-heading'>Buyer Request</div>
                    <div className='buyer-details-left-inner-container'>
                        <div className='buyer-details-left-uppar-section'>
                            <div className='buyer-details-uppar-main-logo-section'>
                                <div className='buyer-details-company-logo-container'>
                                    <div className='buyer-details-company-logo-section'>
                                        <img src={CompanyLogo} alt='CompanyLogo' />
                                    </div>
                                </div>
                                <div className='buyer-details-uppar-right-main-section'>
                                    <div className='buyer-details-uppar-main-containers'>
                                        <div className='buyer-details-upper-section-container'>
                                            <div className='buyer-details-left-uppar-head'>Pharmaceuticals Pvt Ltd</div>
                                        </div>
                                        <div className='buyer-details-left-inner-section'>
                                            <div className='buyer-details-left-company-type'>
                                                <div className='buyer-details-left-inner-sec-text'>Buyer ID: BU12398765</div>
                                            </div>
                                            <div className='buyer-details-left-inner-img-container'>
                                                <div className='buyer-details-left-inner-mobile-button'>
                                                    <PhoneInTalkOutlinedIcon className='buyer-details-left-inner-icon' />
                                                    <span className='tooltip buyer-tooltip'>+971 120 2541 25</span>
                                                </div>
                                                <div className='buyer-details-left-inner-email-button'>
                                                    <MailOutlineIcon className='buyer-details-left-inner-icon' />
                                                    <span className='tooltip buyer-tooltip'>buyer@example.com</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='buyer-details-uppar-right-container-section'>
                                        <div className='buyer-details-company-type-section'>
                                            <div className='buyer-details-company-type-sec-head'>Company Type:</div>
                                            <div className='buyer-details-company-type-sec-text'> Distributor</div>
                                        </div>
                                        <div className='buyer-details-company-type-section'>
                                            <div className='buyer-details-company-type-sec-head'>Address:</div>
                                            <div className='buyer-details-company-type-sec-text'>C-12 Birlagram Nagda</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='buyer-details-description-section'>
                            <div className='buyer-details-description-head'>Description</div>
                            <div className='buyer-details-description-content'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>
                        </div>
                        <div className='buyers-details-section'>
                            <div className='buyer-details-inner-left-section'>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Contact Person Name :</div>
                                    <div className='buyer-details-inner-text'>Mr. Satish Kumar</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Designation :</div>
                                    <div className='buyer-details-inner-text'>Market General Manager</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Email ID :</div>
                                    <div className='buyer-details-inner-text'>Pvt@gmail.com</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Mobile No. :</div>
                                    <div className='buyer-details-inner-text'>+971 1408767</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>License No. :</div>
                                    <div className='buyer-details-inner-text'>455SD78954</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>License Expiry Date :</div>
                                    <div className='buyer-details-inner-text'>12/09/2030</div>
                                </div>
                            </div>
                            <div className='buyer-details-inner-left-section'>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Tax No. :</div>
                                    <div className='buyer-details-inner-text'>5655565FDA6</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Approx. Yearly Purchase :<br /> Value</div>
                                    <div className='buyer-details-inner-text'>250</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Country of Origin :</div>
                                    <div className='buyer-details-inner-text'>Dubai</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Country of Operation :</div>
                                    <div className='buyer-details-inner-text'>Dubai, London, Singapur</div>
                                </div>

                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Interested In :</div>
                                    <div className='buyer-details-inner-text'>Nutraceuticals, Biosimilars</div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='buyer-details-card-section'>
                        <div className='buyer-details-uppar-card-section'>
                            <div className='buyer-details-uppar-card-inner-section'>
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Trade License</div>
                                    <div className='buyer-details-company-img-container'>
                                        <img src={TradeLicense} alt='License' />
                                    </div>
                                </div>
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Tax Certificate</div>
                                    <div className='buyer-details-company-img-container'>
                                        <img src={TaxCertificate} alt='Tax' />
                                    </div>
                                </div>
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Certificate</div>
                                    <div className='buyer-details-company-img-container'>
                                        <img src={Certificate} alt='Certificate' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='buyer-details-button-containers'>
                        <div className='buyer-details-button-reject'>Reject</div>
                        <div className='buyer-details-button-accept'>Accept</div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsBuyerRequest




