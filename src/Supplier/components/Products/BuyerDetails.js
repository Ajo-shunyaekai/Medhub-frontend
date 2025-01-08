import React, { useEffect, useState } from 'react';
import './buyerdetails.css'
import BuyerOrderList from './Buyer/BuyerOrderList';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../api/Requests';
import { apiRequests } from '../../../api';

const BuyerDetails = () => {
    const {buyerId} = useParams()
    const navigate = useNavigate()
    const [buyer, setBuyer] = useState()
 
    const [buyerSupplierOrder, setBuyerSupplierOrder] = useState([])
    const [totalOrders, setTotalOrders]               = useState()
    const [currentOrderPage, setCurrentOrderPage]     = useState(1)
    const ordersPerPage                               = 5;
 
    useEffect(() => {
        const fetchData = async () => {
            const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
            const supplierIdLocalStorage   = localStorage.getItem("supplier_id");
 
            if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
            }
 
            const obj = {
                supplier_id : supplierIdSessionStorage || supplierIdLocalStorage,
                buyer_id    : buyerId,
 
            }
            // postRequestWithToken('supplier/buyer-details', obj, async (response) => {
            //     if (response.code === 200) {
            //         setBuyer(response.result)
            //     } else {
            //     console.log('error in supplier-details api');
            //     }
            // })
            try {
                const response = await apiRequests.getRequest(`buyer/get-specific-buyer-details/${buyerId}`, obj);
                if (response?.code !== 200) {
                    console.log('error in get-buyer-details api', response);
                    return;
                }
                setBuyer(response?.result);
                // postRequestWithToken(`buyer/get-specific-buyer-details/${buyerId}`, obj, async (response) => {
                //     if (response.code === 200) {
                //         setBuyer(response.result)
                //     } else {
                //         console.log('error in get-buyer-details api', response);
                //     }
                // })
            } catch (error) {
                console.log('error in get-buyer-details api', error);
            }
        }
        fetchData()
    },[])
 
    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage   = localStorage.getItem("supplier_id");
 
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        navigate("/supplier/login");
        return;
        }
 
        const fetchBuyerSupplierOrder = () => {
            const obj = {
                buyer_id    :buyerId,
                supplier_id : supplierIdSessionStorage || supplierIdLocalStorage ,
                pageSize    : ordersPerPage,
                pageNo      : currentOrderPage,
                order_type  : ''
            }
    
            postRequestWithToken('buyer/buyer-supplier-orders', obj, async(response) => {
                if(response.code === 200) {
                    setBuyerSupplierOrder(response.result)
                    setTotalOrders(response.result.totalOrders)
                } else {
                    console.log('error in buyer-supplier-orders api');
                }
            })
        }
        fetchBuyerSupplierOrder()
    },[currentOrderPage])
 
    const handleOrderPageChange = (pageNumber) => {
        setCurrentOrderPage(pageNumber);
    };

    return (
        <>
            <div className='supplier-details-container'>
                <div className='supplier-details-inner-conatiner'>
                    <div className='supplier-details-left-inner-container'>
                        <div className='supplier-details-left-uppar-section'>
                            <div className='supplier-details-left-uppar-head'>{buyer?.buyer_name}</div>
                            <div className='supplier-details-left-inner-section'>
                                <div className='supplier-details-left-inner-sec-text'>Buyer ID: {buyer?.buyer_id}</div>
                                <div className='supplier-details-left-inner-img-container'>
                                    <div className='supplier-details-left-inner-mobile-button'>
                                        <PhoneInTalkOutlinedIcon className='supplier-details-left-inner-icon' />
                                        <span className='tooltip'>{buyer?.buyer_country_code} {buyer?.buyer_mobile}</span>
                                    </div>
                                    <div className='supplier-details-left-inner-email-button'>
                                        <MailOutlineIcon className='supplier-details-left-inner-icon' />
                                        <span className='tooltip'>{buyer?.buyer_email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='supplier-details-description-section'>
                            <div className='supplier-details-description-head'>Description</div>
                            <div className='supplier-details-description-content'>{buyer?.description}</div>
                        </div>
                        <div className='supllier-details-section'>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>License No.</div>
                                <div className='supplier-details-inner-text'>{buyer?.license_no}</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Tax No.</div>
                                <div className='supplier-details-inner-text'>{buyer?.tax_no}</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Address</div>
                                <div className='supplier-details-inner-text'>{buyer?.buyer_address}</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Country of Origin</div>
                                <div className='supplier-details-inner-text'>{buyer?.country_of_origin}</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Country of Operation</div>
                                <div className='supplier-details-inner-text'>{buyer?.country_of_operation?.join(', ')}</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Contact Person Name:</div>
                                <div className='supplier-details-inner-text'>Mr. {buyer?.contact_person_name}</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Designation</div>
                                <div className='supplier-details-inner-text'>{buyer?.designation}</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Email ID</div>
                                <div className='supplier-details-inner-text'>{buyer?.contact_person_email}</div>
                            </div>
                            <div className='supplier-details-inner-section'>
                                <div className='supplier-details-inner-head'>Mobile No.</div>
                                <div className='supplier-details-inner-text'>{buyer?.contact_person_country_code} {buyer?.contact_person_mobile}</div>
                            </div>
                        </div>
                    </div>
                    <div className='supplier-details-card-section'>
                        <div className='supplier-details-uppar-card-section'>
                            <div className='supplier-details-uppar-card-inner-section'>
                                <div className='supplier-details-card-container'>
                                    <Link to={`/supplier/buyer-completed-list/${buyerId}`}>
                                        <div className='supplier-details-card-container-contents'>
                                            <div className='supplier-details-card-conteianer-head'>Completed Orders</div>
                                            <div className='supplier-details-card-conteianer-text'>{buyerSupplierOrder?.completedCount || 0}</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className='supplier-details-card-container'>
                                    <Link to={`/supplier/buyer-active-list/${buyerId}`}>
                                        <div className='supplier-details-card-container-contents'>
                                            <div className='supplier-details-card-conteianer-head'>Active Orders</div>
                                            <div className='supplier-details-card-conteianer-text'>{buyerSupplierOrder?.activeCount || 0}</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className='supplier-details-card-container'>
                                    <Link to={`/supplier/buyer-pending-list/${buyerId}`}>
                                        <div className='supplier-details-card-container-contents'>
                                            <div className='supplier-details-card-conteianer-head'>Inquiry Request</div>
                                            <div className='supplier-details-card-conteianer-text'>{buyerSupplierOrder?.pendingCount || 0}</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className='supplier-details-bottom-table-section'>
                            <BuyerOrderList 
                             orderList     = {buyerSupplierOrder?.orderList} 
                             totalOrders   = {totalOrders}
                             currentPage   = {currentOrderPage}
                             ordersPerPage = {ordersPerPage}
                             handleOrderPageChange = {handleOrderPageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BuyerDetails