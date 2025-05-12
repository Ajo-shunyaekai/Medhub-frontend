import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './BuyerDashboard.module.css';

import WorldMap from "react-svg-worldmap";
import ProgressBar from './chart/ProgressBar';
import OrangeBar from './chart/OrangeBar'
import CircularBar from './chart/CircularBar';
import ConversionChart from './chart/ConversionChart';
import SearchEngineChart from './chart/SearchEngineChart'
import { postRequestWithToken } from '../../../api/Requests';
import { convertCountryToCode } from '../SharedComponents/countryCodes/countryCode'

const Dashboard = () => {
    const navigate = useNavigate()
    const [countryData, setCountryData] = useState([]);
    const [activeButton, setActiveButton] = useState('1h');
    const [orderSummary, setOrderSummary] = useState()
    const [sellerCountry, setSellerCountry] = useState()
    useEffect(() => {

        const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            localStorage?.clear();
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage
        }

        postRequestWithToken('buyer/orders-seller-country', obj, async (response) => {
            if (response?.code === 200) {
                setSellerCountry(response?.result)
                const convertedData = await convertCountryToCode(response?.result || []);
                setCountryData(convertedData);
            } else {
            }
        })
    }, [])

    useEffect(() => {
        const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            localStorage?.clear();
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage
        }

        postRequestWithToken('buyer/orders-summary-details', obj, async (response) => {
            if (response?.code === 200) {
                setOrderSummary(response?.result || [])
            } else {
            }
        })
    }, [])

    return (

        <div className={styles.dashboardContainer}>
            <div className={styles.pageTitle}>Dashboard</div>
            {/* <div className={styles.navButton}>
                <div className={styles.button}>Analytics</div>
            </div> */}
            <div className={styles.wrapper}>
                <div className={styles.leftAside}>
                    <div className={styles.orderSection}>
                        <div className={styles.section}>
                            <div className={styles.ordersRow}>
                                <Link  className={styles.order} to='/buyer/ongoing-inquiries-list'>
                                   
                                        <div className={styles.orderHeading}>Ongoing Inquiries</div>
                                        <div className={styles.totalorders}>{orderSummary?.enquiryCount || 0}</div>
                                   
                                </Link>
                                <Link className={styles.order} to='/buyer/purchased-orders-list'>
                                   
                                        <div className={styles.orderHeading}>Purchased Orders</div>
                                        <div className={styles.totalorders}>{orderSummary?.purchaseOrderCount || 0}</div>
                                    
                                </Link>
                                <Link className={styles.order} to='/buyer/active-orders'>
                                    
                                        <div className={styles.orderHeading}>Active Orders</div>
                                        <div className={styles.totalorders}>{orderSummary?.orderDetails?.activeCount?.[0]?.count || 0}</div>
                                   
                                </Link>
                                <Link className={styles.order} to='/buyer/completed-order'>
                                   
                                        <div className={styles.orderHeading}>Completed Orders</div>
                                        <div className={styles.totalorders}>{orderSummary?.orderDetails?.completedCount?.[0]?.count || 0}</div>
                                   
                                </Link>

                            </div>
                            <div className={styles.invoiceRow}>
                                <Link className={styles.card} to='/buyer/complete-invoices-list'>

                                    <div className={styles.cardHeading}>Completed Invoices: <span className={styles.totalInvoice}>{orderSummary?.invoiceDetails?.paidCount || 0}</span></div>
                                    <div className={styles.bar}>
                                        <ProgressBar />
                                    </div>

                                </Link>
                                <Link className={styles.card} to='/buyer/pending-invoices-list'>

                                    <div className={styles.cardHeading}>Pending Invoices: <span className={styles.totalInvoice}>{orderSummary?.invoiceDetails?.pendingCount || 0}</span></div>
                                    <div className={styles.bar}>
                                        <OrangeBar />
                                    </div>

                                </Link>
                            </div>
                        </div>
                        <div className={styles.rightAside}>
                            <div className={styles.asideHeading}>Total Purchase</div>
                            <div className={styles.circularProcess}>
                                <CircularBar totalPurchase={orderSummary?.orderDetails?.totalPurchaseAmount?.[0]?.total_purchase || 0} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.performaSection}>
                        <Link className={styles.performaCard} to='/buyer/invoice/proforma-invoice'>

                            <div className={styles.performaCardCount}>
                                <span className={styles.performaCardCounts}>{orderSummary?.orderDetails?.activeCount?.[0]?.count || 0}</span>
                            </div>
                            <div className={styles.performaCardHeading}>Proforma Invoices</div>
                            <div className={styles.performaCardGraph}>
                                <ConversionChart />
                            </div>

                        </Link>
                        <Link className={styles.performaCard} to='/buyer/my-supplier'>

                            <div className={styles.performaCardCount}>
                                <span className={styles.performaCardCounts}>{orderSummary?.supplierCount || 0}</span>
                            </div>
                            <div className={styles.performaCardHeading}>My Supplier</div>
                            <div className={styles.performaCardGraph}>
                                <SearchEngineChart />
                            </div>

                        </Link>
                    </div>
                </div>
                <div className={styles.mapSection}>
                    <div className={styles.map}>
                        <WorldMap
                            color="red"
                            value-suffix="people"
                            size="sm"
                            data={countryData}
                        />
                    </div>
                    <div className={styles.mapHeading}>Your Seller Countries</div>
                    <div className={styles.countryName}>
                        {countryData?.slice(0, 2).map((data, index) => (
                            <div className={styles.countrySection} key={index}>
                                <span className={styles.countryTitle}>{data?.country}</span>
                                <span className={styles.countryPrice}>{data?.value} USD</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Dashboard