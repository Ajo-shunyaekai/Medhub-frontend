import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../style/inquirypurchaseorder.css';
import order_list from '../assest/dashboard/order_list.svg';
import OnGoingOrder from './inquiry/OnGoingOrder';
import PurchasedOrder from './inquiry/PurchasedOrder'


const InquiryPurchaseOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/supplier/inquiry-purchase-orders/ongoing':
                return 'ongoing';
            case '/supplier/inquiry-purchase-orders/purchased':
                return 'purchased';
            default:
                return 'ongoing';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        switch (link) {
            case 'ongoing':
                navigate('/supplier/inquiry-purchase-orders/ongoing');
                break;
            case 'purchased':
                navigate('/supplier/inquiry-purchase-orders/purchased');
                break;
            default:
                navigate('/supplier/inquiry-purchase-orders/ongoing');
        }
    };

    return (
        <div className='inquiry-purchase-main-container'>
            <div className="inquiry-purchase-name">
                Inquiry & Purchased Orders
            </div>
            <div className="inquiry-purchase-container">
                <div className="inquiry-purchase-container-left">
                    <div
                        onClick={() => handleLinkClick('ongoing')}
                        className={activeLink === 'ongoing' ? 'active inquiry-purchase-left-wrapper' : 'inquiry-purchase-left-wrapper'}
                    >
                        <img src={order_list} alt="inquiry-purchase icon" />
                        <div>Inquiry Request</div>
                    </div>
                    <div
                        onClick={() => handleLinkClick('purchased')}
                        className={activeLink === 'purchased' ? 'active inquiry-purchase-left-wrapper' : 'inquiry-purchase-left-wrapper'}
                    >
                        <img src={order_list} alt="inquiry-purchase icon" />
                        <div>Purchased Orders</div>
                    </div>
                </div>
                <div className="inquiry-purchase-container-right">
                    <div responsive="xl" className='inquiry-purchase-table-responsive'>
                        {activeLink === 'ongoing' && <OnGoingOrder/>}
                        {activeLink === 'purchased' && <PurchasedOrder/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InquiryPurchaseOrder;