import React, { useEffect, useState } from 'react';
import '../style/orderdetails.css'
import OnGoingList from './OnGoingList';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import moment from 'moment-timezone';
import ProductList from './details/ProductList';

const OnGoingInquiriesDetails = () => {
    const { inquiryId } = useParams()
    const navigate = useNavigate();

    const [inquiryDetails, setInquiryDetails] = useState()

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            supplier_id: buyerIdSessionStorage || buyerIdLocalStorage,
            enquiry_id: inquiryId
        }

        postRequestWithToken('buyer/enquiry/enquiry-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result)
                // setTotalInquiries(response.result.totalItems)
            } else {
                console.log('error in order list api', response);
            }
        })
    }, [])

    return (
        <div className='order-details-container'>
            <div className='order-details-conatiner-heading'>Inquiry ID: <span>{inquiryDetails?.enquiry_id}</span></div>
            <div className='order-details-section'>
                <div className='order-details-left-section'>
                    <div className='order-details-top-inner-section'>
                        <div className='order-details-left-inner-section-container'>
                            <div className='order-details-left-top-containers'>
                                <Link to={`/buyer/supplier-details/${inquiryDetails?.supplier?.supplier_id}`}>
                                    <div className='order-details-top-order-cont'>
                                        <div className='order-details-left-top-main-heading'> Supplier Name</div>
                                        <div className='order-details-left-top-main-contents'> {inquiryDetails?.supplier.supplier_name}</div>
                                    </div>
                                </Link>
                                <div className='order-details-top-order-cont'>
                                    <div className='order-details-left-top-main-heading'>Type</div>
                                    <div className='order-details-left-top-main-contents'>{inquiryDetails?.supplier.supplier_type || 'Manufacturer'}</div>
                                </div>
                                <div className='order-details-top-order-cont'>
                                    <div className='order-details-left-top-main-heading'> Date & Time</div>
                                    <div className='order-details-left-top-main-contents'>{moment(inquiryDetails?.created_at).tz('Asia/Kolkata').format("DD/MM/YYYY HH:mm")}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* start the assign driver section */}
            <div className='order-details-assign-driver-section'>
                <OnGoingList items={inquiryDetails?.items} />
            </div>
            {/* end the assign driver section */}
            {/* Start the return enquiry section */}
            <div className='order-details-assign-driver-section'>
                <ProductList/>
            </div>
            <div className='order-details-payment-pending-container'>
                <div className='order-details-payment-pending-left-section'>
                    <div className='order-details-payment-pending-terms-cont'>
                        <div className='order-details-payment-pending-first-terms-cont'>
                            <div className='order-details-payment-first-terms-heading'>Est. Delivery Time</div>
                            <div className='order-details-payment-first-terms-text'>15 Days</div>
                        </div>
                    </div>
                </div>
                <div className='order-details-paymen-pending-right-section'>
                    <div className='order-details-payment-first-terms-containers'>
                        <div className='order-details-payment-first-terms-heading'>Payment Terms</div>
                        <div className='order-details-payment-first-terms-text'>
                            <ul className='order-details-payment-ul-section'>
                                <li className='order-details-payment-li-section'>30% advance payment 70% on delivery.</li>
                                <li className='order-details-payment-li-section'>50% advance payment 50% on delivery.</li>
                                <li className='order-details-payment-li-section'>70% advance payment 30% on delivery.</li>
                                <li className='order-details-payment-li-section'>100% advance payment.</li>
                                <li className='order-details-payment-li-section'>100% payment on delivery.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='pending-order-button-section'>
                <a href='mailto:supplier@example.com?subject=Inquiry%20about%20Order%20987456321' className='pending-order-contact-order'>
                    Contact Supplier
                </a>
                <Link to='/buyer/Create-PO'>
                    <div className='pending-order-create-order'>Create Purchased Order</div>
                </Link>
            </div>


            {/* End the return enquiry section */}
        </div>
    )
}

export default OnGoingInquiriesDetails
















