import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './subscription.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CurrentPlan from './Plan';
import TransactionHistory from './TransactionHistory';

const Subscription = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const getActiveLinkFromPath = (path) => {
            switch (path) {
                case '/buyer/subscription/current-plan':
                    return 0;
                case '/buyer/subscription/transaction-history':
                    return 1;
                default:
                    return 0;
            }
        };

        const newIndex = getActiveLinkFromPath(location.pathname);
        setActiveIndex(newIndex);
    }, [location.pathname]);

    const handleLinkClick = (link) => {
        switch (link) {
            case 'current-plan':
                setActiveIndex(0);
                navigate('/buyer/subscription/current-plan');
                break;
            case 'transaction-history':
                setActiveIndex(1);
                navigate('/buyer/subscription/transaction-history');
                break;
            default:
                setActiveIndex(0);
                navigate('/buyer/subscription/current-plan');
        }
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className={styles.container}>
                    <span className={styles.heading}>Subscription</span>
                    <div className={styles.buttonContainer}>
                        <div
                            onClick={() => handleLinkClick('current-plan')}
                            className={`${styles.Button} ${activeIndex === 0 ? styles.active : ''}`}
                        >
                            <span className={styles.subscriptionButton}>Current Plan</span>
                        </div>
                        <div
                            onClick={() => handleLinkClick('transaction-history')}
                            className={`${styles.Button} ${activeIndex === 1 ? styles.active : ''}`}
                        >
                            <span className={styles.subscriptionButton}>Transaction History</span>
                        </div>
                    </div>
                    <div className={styles.innerContainer}>
                        {activeIndex === 0 && <CurrentPlan />}
                        {activeIndex === 1 && <TransactionHistory />}
                    </div>
                </div>
            )}
        </>
    );
};

export default Subscription;
