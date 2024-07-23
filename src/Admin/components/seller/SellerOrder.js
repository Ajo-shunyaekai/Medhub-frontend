import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../style/order.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ActiveSellerOrder from './ActiveSellerOrder';
import CompletedSellerOrder from './CompletedSellerOrder';
import PendingSellerOrder from './PendingSellerOrder';
const SellerOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/seller-order/active':
                return 'active';
                case '/admin/seller-order/complete':
                return 'complete';
            case '/admin/seller-order/pending':
                return 'pending';
            default:
                return 'active';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        switch (link) {
            case 'active':
                navigate('/admin/seller-order/active');
                break;
                case 'complete':
                navigate('/admin/seller-order/complete');
                break;
            case 'pending':
                navigate('/admin/seller-order/pending');
                break;
            default:
                navigate('/admin/seller-order/active');
        }
    };

    return (
        <>
            <div className={styles[`order-container`]}>
                <div className={styles['complete-container-order-section']}>
                    <div className={styles['complete-conatiner-head']}>Orders</div>
                </div>
                <div className={styles[`order-wrapper`]}>
                    <div className={styles[`order-wrapper-left`]}>
                        <div
                            onClick={() => handleLinkClick('active')}
                            className={`${activeLink === 'active' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Active Orders</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('complete')}
                            className={`${activeLink === 'complete' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Completed Orders</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('pending')}
                            className={`${activeLink === 'pending' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Pending Orders</div>
                        </div>
                    </div>
                    <div className={styles[`order-wrapper-right`]}>
                        {activeLink === 'active' && <ActiveSellerOrder/>}
                        {activeLink === 'complete' && <CompletedSellerOrder/>}
                        {activeLink === 'pending' && <PendingSellerOrder/>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SellerOrder;