import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SupplierDashboard.module.css';

import WorldMap from "react-svg-worldmap";
import ProgressBar from './Charts/ProgressBar';
import OrangeBar from './Charts/OrangeBar'
import CircularBar from './Charts/CircularBar';
import ConversionChart from './Charts/ConversionChart';
import SearchEngineChart from './Charts/SearchEngineChart'
import { postRequestWithToken } from '../../api/Requests';
import { convertCountryToCode } from '../SharedComponents/countryCodes/countryCode';

const SupplierDashboard = () => {
    const navigate = useNavigate()
    const [countryData, setCountryData] = useState([]);
    const [orderSummary, setOrderSummary] = useState()
    const [salesSummary, setSalesSummary] = useState([])
    const [sellerCountry, setSellerCountry] = useState()
 
    useEffect(() => {
        const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage?.getItem("supplier_id");
 
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            localStorage?.clear();
            navigate("/supplier/login");
            return;
        }
 
        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            usertype: 'supplier'
        }
        postRequestWithToken('supplier/orders-buyer-country', obj, async (response) => {
            if (response?.code === 200) {
                setSellerCountry(response?.result)
                const convertedData = convertCountryToCode(response?.result);
                setCountryData(convertedData);
            } else {
            }
        });
        postRequestWithToken('supplier/orders-summary-details', obj, async (response) => {
            if (response?.code === 200) {
                setOrderSummary(response?.result)
            } else {
            }
        })
 
        postRequestWithToken('order/sales-filter', obj, async (response) => {
            if (response?.code === 200) {
                setSalesSummary(response?.result)
            } else {
            }
        })
    }, [])
 
    const chartData = {
        labels: [],
        values: []
    };
 
    if (salesSummary.length > 0) {
        chartData.labels = salesSummary[0]?.yearlyData.map(item => item._id.year) || [];
        chartData.values = salesSummary[0]?.yearlyData.map(item => item.orderCount) || [];
    }
    return (
 
        <div className={styles.dashboardContainer}>
            <div className={styles.pageTitle}>Dashboard</div>
            <div className={styles.navButton}>
                <div className={styles.button}>Analytics</div>
            </div>
            <div className={styles.wrapper}>
                <div className={styles.leftAside}>
                    <div className={styles.orderSection}>
                        <div className={styles.section}>
                            <div className={styles.ordersRow}>
                                <Link className={styles.order} to='/supplier/inquiry-request-list'>
 
                                    <div className={styles.orderHeading}>Inquiry Request</div>
                                    <div className={styles.totalorders}>{orderSummary?.enquiryCount || 0}</div>
 
                                </Link>
                                <Link className={styles.order} to='/supplier/purchased-orders-list'>
 
                                    <div className={styles.orderHeading}>Purchased Orders</div>
                                    <div className={styles.totalorders}>{orderSummary?.purchaseOrderCount || 0}</div>
 
                                </Link>
                                <Link className={styles.order} to='/supplier/ongoing-orders'>
 
                                    <div className={styles.orderHeading}>Active Orders</div>
                                    <div className={styles.totalorders}>{orderSummary?.orderDetails?.activeCount[0]?.count || 0}</div>
 
                                </Link>
                                <Link className={styles.order} to='/supplier/completed-orders'>
 
                                    <div className={styles.orderHeading}>Completed Orders</div>
                                    <div className={styles.totalorders}>{orderSummary?.orderDetails?.completedCount[0]?.count || 0}</div>
 
                                </Link>
 
                            </div>
                            <div className={styles.invoiceRow}>
                                <Link className={styles.card} to='/supplier/pending-invoices-list'>
 
                                    <div className={styles.cardHeading}>Pending Invoices: <span className={styles.totalInvoice}>{orderSummary?.invoiceDetails?.pendingCount || 0}</span></div>
                                    <div className={styles.bar}>
                                        <ProgressBar />
                                    </div>
 
                                </Link>
                                <Link className={styles.card} to='/supplier/completed-invoices-list'>
 
                                    <div className={styles.cardHeading}>Completed Invoices: <span className={styles.totalInvoice}>{orderSummary?.invoiceDetails?.paidCount || 0}</span></div>
                                    <div className={styles.bar}>
                                        <OrangeBar />
                                    </div>
 
                                </Link>
                            </div>
                        </div>
                        <div className={styles.rightAside}>
                            <div className={styles.asideHeading}>Total Sales Amount</div>
                            <div className={styles.circularProcess}>
                                <CircularBar totalSalesAmount={orderSummary?.orderDetails?.totalPurchaseAmount[0]?.total_purchase} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.performaSection}>
                        <Link className={styles.performaCard}>
 
                            <div className={styles.performaCardCount}>
                                <span className={styles.performaCardCounts}>{salesSummary[0]?.weeklyData[0]?.orderCount || 0}</span>
                            </div>
                            <div className={styles.performaCardHeading}>Weekly Sales</div>
                            <div className={styles.performaCardGraph}>
                                <ConversionChart />
                            </div>
 
                        </Link>
                        <Link className={styles.performaCard}>
 
                            <div className={styles.performaCardCount}>
                                <span className={styles.performaCardCounts}>{salesSummary[0]?.monthlyData[0]?.orderCount || 0}</span>
                            </div>
                            <div className={styles.performaCardHeading}>Monthly Sales</div>
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
                    <div className={styles.mapHeading}>Your Buyer Countries</div>
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
 
export default SupplierDashboard