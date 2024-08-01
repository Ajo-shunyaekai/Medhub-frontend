import React, { useEffect, useState } from 'react';
import '../style/orderdetails.css'
import OnGoingList from './OnGoingList';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import moment from 'moment-timezone';
import ProductList from './details/ProductList';
import { toast } from 'react-toastify';

const OnGoingInquiriesDetails = () => {
    const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

    const { inquiryId } = useParams()
    const navigate      = useNavigate();

    const [inquiryDetails, setInquiryDetails] = useState()
    const [acceptedItems, setAcceptedItems]   = useState([]);
    const [rejectedItems, setRejectedItems]   = useState([]);

    const email      = inquiryDetails?.supplier?.contact_person_email; 
    const subject    = `Inquiry about Inquiry ${inquiryDetails?.enquiry_id || 'unknown'}`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    useEffect(() => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const obj = {
            buyer_id    : buyerIdSessionStorage || buyerIdLocalStorage,
            enquiry_id  : inquiryId
        }
        postRequestWithToken('buyer/enquiry/enquiry-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result)
                const acceptedItems = [];
                const rejectedItems = [];

                response?.result?.quotation_items?.forEach(item => {
                    if (item.status === 'accepted') {
                        acceptedItems.push(item);
                    } else if (item.status === 'rejected') {
                        rejectedItems.push(item);
                    }
                });
                setAcceptedItems(acceptedItems);
                setRejectedItems(rejectedItems);

                sessionStorage.setItem('acceptedQuotationItems', JSON.stringify(acceptedItems));
                sessionStorage.setItem('rejectedQuotationItems', JSON.stringify(rejectedItems));


            } else {
                console.log('error in order list api', response);
            }
        })
    }, [inquiryDetails])

    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.removeItem('acceptedQuotationItems');
            sessionStorage.removeItem('rejectedQuotationItems');
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    
    const handleAccept = (item, status) => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const obj = {
            buyer_id    : buyerIdSessionStorage || buyerIdLocalStorage,
            enquiry_id  : inquiryId,
            item_id     : item._id,
            new_status  : status
        }
        postRequestWithToken('buyer/enquiry/accept-reject-quotation', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, {type: 'success'})
                postRequestWithToken('buyer/enquiry/enquiry-details', obj, async (response) => {
                    if (response.code === 200) {
                        setInquiryDetails(response?.result)
                        // setInquiryDetails(response?.result)
                setAcceptedItems(prevItems => {
                    const updatedItems = [...prevItems, item];
                    sessionStorage.setItem('acceptedQuotationItems', JSON.stringify(updatedItems));
                    return updatedItems;
                });
                setRejectedItems(prevItems => {
                    const updatedItems = prevItems.filter(rejItem => rejItem._id !== item._id);
                    sessionStorage.setItem('rejectedQuotationItems', JSON.stringify(updatedItems));
                    return updatedItems;
                });
                    } else {
                        console.log('error in order list api', response);
                    }
                })
                
            } else {
                toast(response.message, {type: 'error'})
                console.log('error in accept-reject-quotation api', response);
            }
        })
        
    };

    const handleReject = (item, status) => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const obj = {
            buyer_id    : buyerIdSessionStorage || buyerIdLocalStorage,
            enquiry_id  : inquiryId,
            item_id     : item._id,
            new_status  : status
        }
        postRequestWithToken('buyer/enquiry/accept-reject-quotation', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, {type: 'success'})
                postRequestWithToken('buyer/enquiry/enquiry-details', obj, async (response) => {
                    if (response.code === 200) {
                        setInquiryDetails(response?.result)
                setRejectedItems(prevItems => {
                    const updatedItems = [...prevItems, item];
                    sessionStorage.setItem('rejectedQuotationItems', JSON.stringify(updatedItems));
                    return updatedItems;
                });
                setAcceptedItems(prevItems => {
                    const updatedItems = prevItems.filter(accItem => accItem._id !== item._id);
                    sessionStorage.setItem('acceptedQuotationItems', JSON.stringify(updatedItems));
                    return updatedItems;
                });
                    } else {
                        console.log('error in order list api', response);
                    }
                })
            } else {
                toast(response.message, {type: 'error'})
                console.log('error in accept-reject-quotation api', response);
            }
        })
        
    };

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
                                        <div className='order-details-left-top-main-contents'> {inquiryDetails?.supplier?.supplier_name}</div>
                                    </div>
                                </Link>
                                <div className='order-details-top-order-cont'>
                                    <div className='order-details-left-top-main-heading'>Type</div>
                                    <div className='order-details-left-top-main-contents'>{inquiryDetails?.supplier?.supplier_type || 'Manufacturer'}</div>
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
            {
                inquiryDetails?.quotation_items.length > 0 ?
                <div className='order-details-assign-driver-section'>
                   <ProductList 
                        quotationItems = {inquiryDetails?.quotation_items}
                        handleAccept   = {handleAccept}
                        handleReject   = {handleReject}
                   />
                </div> : ''
            }
            
            {
                inquiryDetails?.quotation_items.length > 0 && inquiryDetails?.payment_terms?.length > 0 ?
                <div className='order-details-payment-pending-container'>
                <div className='order-details-payment-pending-left-section'>
                    <div className='order-details-payment-pending-terms-cont'>
                        <div className='order-details-payment-pending-first-terms-cont'>
                            <div className='order-details-payment-first-terms-heading'>Est. Delivery Time</div>
                            <div className='order-details-payment-first-terms-text'>{inquiryDetails?.supplier?.estimated_delivery_time}</div>
                        </div>
                    </div>
                </div>
                <div className='order-details-paymen-pending-right-section'>
                    <div className='order-details-payment-first-terms-containers'>
                        <div className='order-details-payment-first-terms-heading'>Payment Terms</div>
                        <div className='order-details-payment-first-terms-text'>
                            <ul className='order-details-payment-ul-section'>
                                {
                                    inquiryDetails?.payment_terms?.map((terms, i) => {
                                        return (
                                            <li className='order-details-payment-li-section'>{terms}</li>
                                        )
                                    })
                                }
                               
                                {/* <li className='order-details-payment-li-section'>50% advance payment 50% on delivery.</li>
                                <li className='order-details-payment-li-section'>70% advance payment 30% on delivery.</li>
                                <li className='order-details-payment-li-section'>100% advance payment.</li>
                                <li className='order-details-payment-li-section'>100% payment on delivery.</li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div> : ''
            }
            {
                inquiryDetails?.quotation_items.length > 0 && inquiryDetails?.payment_terms.length > 0 ?
                <div className='pending-order-button-section'>
                <a href={mailtoLink} className='pending-order-contact-order'>
                    Contact Supplier
                </a>
                {/* <Link to={`/buyer/Create-PO/${inquiryId}`}>
                    <div className='pending-order-create-order'>Create Purchased Order</div>
                </Link> */}
                {acceptedItems.length > 0 ? (
                <Link to={`/buyer/Create-PO/${inquiryId}`}>
                    <div className='pending-order-create-order'>Create Purchased Order</div>
                </Link>
            ) : (
                <div className='pending-order-create-order'>Create Purchased Order</div>
            )}
            </div> : ''
            }

            {/* End the return enquiry section */}
        </div>
    )
}

export default OnGoingInquiriesDetails
















