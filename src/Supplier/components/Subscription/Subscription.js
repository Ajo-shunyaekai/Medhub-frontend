import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './subscription.module.css';
import CurrentPlan from './Plan';
import TransactionHistory from './TransactionHistory';
import Loader from '../SharedComponents/Loader/Loader';

const Subscription = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const getActiveLinkFromPath = (path) => {
            switch (path) {
                case '/supplier/subscription/current-plan':
                    return 0;
                case '/supplier/subscription/transaction-history':
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
                navigate('/supplier/subscription/current-plan');
                break;
            case 'transaction-history':
                setActiveIndex(1);
                navigate('/supplier/subscription/transaction-history');
                break;
            default:
                setActiveIndex(0);
                navigate('/supplier/subscription/current-plan');
        }
    };

    return (
        <>
            {loading ? (
                <Loader/>
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
