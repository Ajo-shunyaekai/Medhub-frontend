import React, { useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './buyerdetails.module.css';
import BuyerOrderList from '../Buyer/BuyerOrderList';
import { postRequestWithToken } from '../../../api/Requests';
import { apiRequests } from '../../../../api';
import Loader from "../../SharedComponents/Loader/Loader"

const BuyerDetails = () => {
    const { buyerId } = useParams();
    const navigate = useNavigate();
    const [buyer, setBuyer] = useState(null);
    const [buyerSupplierOrder, setBuyerSupplierOrder] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentOrderPage, setCurrentOrderPage] = useState(1);
    const [activeButton, setActiveButton] = useState('orders');
    const [loading, setLoading] = useState(true);
    const ordersPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            const supplierId = localStorage.getItem('supplier_id');
            if (!supplierId) {
                localStorage.clear();
                navigate('/supplier/login');
                return;
            }

            try {
                const response = await apiRequests.getRequest(`buyer/get-specific-buyer-details/${buyerId}`, {
                    supplier_id: supplierId,
                    buyer_id: buyerId,
                });
                if (response?.code === 200) {
                    setBuyer(response.result);
                }
            } catch (error) {
                console.error('Error fetching buyer details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [buyerId, navigate]);

    useEffect(() => {
        const supplierId = localStorage.getItem('supplier_id');
        if (!supplierId) {
            localStorage.clear();
            navigate('/supplier/login');
            return;
        }

        const fetchBuyerSupplierOrder = () => {
            const obj = {
                buyer_id: buyerId,
                supplier_id: supplierId,
                pageSize: ordersPerPage,
                pageNo: currentOrderPage,
                order_type: '',
            };

            postRequestWithToken('buyer/buyer-supplier-orders', obj, async (response) => {
                if (response?.code === 200) {
                    setBuyerSupplierOrder(response.result);
                    setTotalOrders(response.result.totalOrders || 0);
                }
            });
        };
        fetchBuyerSupplierOrder();
    }, [currentOrderPage, buyerId, navigate]);

    const handleOrderPageChange = (pageNumber) => {
        setCurrentOrderPage(pageNumber);
    };

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    if (loading) {
        return <Loader />;
    }

    if (!buyer) {
        return <div>No buyer data available.</div>;
    }

    return (
        <div className={styles.container}>
            {buyer?.buyer_id && (
                <span className={styles.heading}>Buyer ID: {buyer.buyer_id}</span>
            )}

            <div className={styles.section}>
                <div className={styles.leftCard}>
                    {(buyer?.buyer_name || buyer?.buyer_type || buyer?.buyer_mobile) && (
                        <div className={styles.cardSection}>
                            <div className={styles.innerSection}>
                                {buyer?.buyer_name && (
                                    <span className={styles.mainHead}>{buyer.buyer_name}</span>
                                )}
                                {buyer?.websiteAddress && (
                                    <a
                                        href={buyer.websiteAddress}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.typeHead}
                                    >
                                        {buyer.websiteAddress}
                                    </a>
                                )}
                                {buyer?.buyer_type && (
                                    <span className={styles.typeHead}>{buyer.buyer_type}</span>
                                )}
                            </div>
                            {(buyer?.buyer_mobile || buyer?.buyer_email) && (
                                <div className={styles.headIcons}>
                                    {buyer?.buyer_email && (
                                        <div
                                            className={styles.reactContainer}
                                            data-tooltip-id="emailTooltip"
                                            data-tooltip-content={buyer.buyer_email}
                                        >
                                            <MailOutlineIcon className={styles.Icon} />
                                            <ReactTooltip id="emailTooltip" place="top" effect="solid" />
                                        </div>
                                    )}
                                    {buyer?.buyer_mobile && (
                                        <div
                                            className={styles.reactContainer}
                                            data-tooltip-id="phoneTooltip"
                                            data-tooltip-content={`${buyer.buyer_country_code || ''} ${buyer.buyer_mobile}`}
                                        >
                                            <PhoneInTalkOutlinedIcon className={styles.Icon} />
                                            <ReactTooltip id="phoneTooltip" place="top" effect="solid" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {buyer?.description && (
                        <div className={styles.innerContainer}>
                            <div className={styles.cardContainer}>
                                <span className={styles.cardHead}>Description</span>
                                <span className={styles.cardContents}>{buyer.description}</span>
                            </div>
                        </div>
                    )}

                    {buyer?.registeredAddress && (
                        <div className={styles.innerContainer}>
                            <div className={styles.cardContainer}>
                                <span className={styles.cardHeads}>Address</span>
                                <span className={styles.cardContents}>
                                    {[
                                        buyer.registeredAddress.company_reg_address,
                                        buyer.registeredAddress.locality,
                                        buyer.registeredAddress.land_mark,
                                    ]
                                        .filter(Boolean)
                                        .join(', ')}
                                    {[
                                        buyer.registeredAddress.city,
                                        buyer.registeredAddress.state,
                                        buyer.registeredAddress.country,
                                        buyer.registeredAddress.pincode,
                                    ].filter(Boolean).length > 0 && (
                                        <div>
                                            {[
                                                buyer.registeredAddress.city,
                                                buyer.registeredAddress.state,
                                                buyer.registeredAddress.country,
                                                buyer.registeredAddress.pincode,
                                            ]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </div>
                                    )}
                                </span>
                            </div>
                        </div>
                    )}

                    {(buyer?.registration_no ||
                        buyer?.vat_reg_no ||
                        buyer?.activity_code ||
                        buyer?.sales_person_name ||
                        buyer?.country_of_origin ||
                        buyer?.country_of_operation ||
                        buyer?.interested_in ||
                        buyer?.license_no ||
                        buyer?.license_expiry_date ||
                        buyer?.contact_person_name ||
                        buyer?.contact_person_email ||
                        buyer?.contact_person_mobile ||
                        buyer?.designation ||
                        buyer?.approx_yearly_purchase_value) && (
                        <div className={styles.cardInnerSection}>
                            {buyer?.registration_no && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Company Registration No</span>
                                    <span className={styles.cardContent}>{buyer.registration_no}</span>
                                </div>
                            )}
                            {buyer?.vat_reg_no && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>GST/VAT Registration Number</span>
                                    <span className={styles.cardContent}>{buyer.vat_reg_no}</span>
                                </div>
                            )}
                            {buyer?.activity_code && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Business Activity Code</span>
                                    <span className={styles.cardContent}>{buyer.activity_code}</span>
                                </div>
                            )}
                            {buyer?.sales_person_name && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Medhub Global Sales Representative</span>
                                    <span className={styles.cardContent}>{buyer.sales_person_name}</span>
                                </div>
                            )}
                            {buyer?.country_of_origin && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Country of Origin</span>
                                    <span className={styles.cardContent}>{buyer.country_of_origin}</span>
                                </div>
                            )}
                            {buyer?.country_of_operation?.length > 0 && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Countries of Operation</span>
                                    <span className={styles.cardContent}>{buyer.country_of_operation.join(', ')}</span>
                                </div>
                            )}
                            {buyer?.interested_in?.length > 0 && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Interested In</span>
                                    <span className={styles.cardContent}>{buyer.interested_in.join(', ')}</span>
                                </div>
                            )}
                            {buyer?.approx_yearly_purchase_value && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Approx. Yearly Purchase Value</span>
                                    <span className={styles.cardContent}>{buyer.approx_yearly_purchase_value}</span>
                                </div>
                            )}
                            {buyer?.license_no && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>License No.</span>
                                    <span className={styles.cardContent}>{buyer.license_no}</span>
                                </div>
                            )}
                            {buyer?.license_expiry_date && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>License Expiry/Renewal Date</span>
                                    <span className={styles.cardContent}>{buyer.license_expiry_date}</span>
                                </div>
                            )}
                            {buyer?.contact_person_name && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Contact Name</span>
                                    <span className={styles.cardContent}>{buyer.contact_person_name}</span>
                                </div>
                            )}
                            {buyer?.contact_person_email && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Email ID</span>
                                    <span className={styles.cardContent}>{buyer.contact_person_email}</span>
                                </div>
                            )}
                            {buyer?.contact_person_mobile && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Mobile No.</span>
                                    <span className={styles.cardContent}>
                                        {`${buyer.contact_person_country_code || ''} ${buyer.contact_person_mobile}`}
                                    </span>
                                </div>
                            )}
                            {buyer?.designation && (
                                <div className={styles.cardMainContainer}>
                                    <span className={styles.cardHead}>Designation</span>
                                    <span className={styles.cardContent}>{buyer.designation}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.rightCard}>
                    <div className={styles.rightContainer}>
                        <Link className={styles.rightSection} to={`/supplier/buyer-active-list/${buyerId}`}>
                            <span className={styles.rightHead}>Active Orders</span>
                            <span className={styles.rightContent}>{buyerSupplierOrder?.activeCount || 0}</span>
                        </Link>
                        <Link className={styles.rightSection} to={`/supplier/buyer-completed-list/${buyerId}`}>
                            <span className={styles.rightHead}>Completed Orders</span>
                            <span className={styles.rightContent}>{buyerSupplierOrder?.completedCount || 0}</span>
                        </Link>
                        <Link className={styles.rightSection} to={`/supplier/buyer-pending-list/${buyerId}`}>
                            <span className={styles.rightHead}>Inquiry Request</span>
                            <span className={styles.rightContent}>{buyerSupplierOrder?.pendingCount || 0}</span>
                        </Link>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button
                            className={`${styles.button} ${activeButton === 'orders' ? styles.active : ''}`}
                            onClick={() => handleButtonClick('orders')}
                        >
                            Orders List
                        </button>
                    </div>
                    {activeButton === 'orders' && (
                        <BuyerOrderList
                            orderList={buyerSupplierOrder?.orderList || []}
                            totalOrders={totalOrders}
                            currentPage={currentOrderPage}
                            ordersPerPage={ordersPerPage}
                            handleOrderPageChange={handleOrderPageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerDetails;