import React, { useEffect, useState } from 'react';
import WorldMap from "react-svg-worldmap";
import { Link, useNavigate } from 'react-router-dom';
import './dashboard.css'
import ProgressBar from './Charts/ProgressBar';
import OrangeBar from './Charts/OrangeBar'
import CircularBar from './Charts/CircularBar';
import ConversionChart from './Charts/ConversionChart';
import SearchEngineChart from './Charts/SearchEngineChart'
import { postRequestWithToken } from '../../api/Requests';
import { convertCountryToCode } from '../SharedComponents/countryCodes/countryCode'
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
 
        <div className='buyer-panel-dashboard-section'>
            <div className='buyer-panel-dashboard-heading'>Dashboard</div>
            <div className='buyer-panel-analystic-button' >
                <div className='buyer-panel-buttons'>Analytics</div>
            </div>
            <div className='buyer-panel-cart-main-container'>
                <div className='buyer-panel-cart-left-main-container'>
                    <div className='buyer-panel-cart-left-top-section'>
                        <div className='buyer-panel-cart-top-right-section'>
                            <div className='buyer-panel-top-container'>
                                <Link className='buyer-panel-top-content-section' to='/supplier/inquiry-request-list'>
 
                                    <div className='buyer-panel-top-head'>Inquiry Request</div>
                                    <div className='buyer-panel-top-text'>{orderSummary?.enquiryCount || 0}</div>
 
                                </Link>
                                <Link className='buyer-panel-top-content-section' to='/supplier/purchased-orders-list'>
 
                                    <div className='buyer-panel-top-head'>Purchased Orders</div>
                                    <div className='buyer-panel-top-text'>{orderSummary?.purchaseOrderCount || 0}</div>
 
                                </Link>
                                <Link className='buyer-panel-top-content-section' to='/supplier/ongoing-orders'>
 
                                    <div className='buyer-panel-top-head'>Active Orders</div>
                                    <div className='buyer-panel-top-text'>{orderSummary?.orderDetails?.activeCount[0]?.count || 0}</div>
 
                                </Link>
                                <Link className='buyer-panel-top-content-section' to='/supplier/completed-orders'>
 
                                    <div className='buyer-panel-top-head'>Completed Orders</div>
                                    <div className='buyer-panel-top-text'>{orderSummary?.orderDetails?.completedCount[0]?.count || 0}</div>
 
                                </Link>
 
                            </div>
                            <div className='buyer-panel-bottom-container'>
                                <Link className='buyer-panel-bottom-cart-cont' to='/supplier/pending-invoices-list'>
 
                                    <div className='buyer-panel-bottom-head'>Pending Invoices: <span className='buyer-panel-bottom-text'>{orderSummary?.invoiceDetails?.pendingCount || 0}</span></div>
                                    <div className='buyer-panel-bottom-graph'>
                                        <ProgressBar />
                                    </div>
 
                                </Link>
                                <Link className='buyer-panel-bottom-cart-cont' to='/supplier/completed-invoices-list'>
 
                                    <div className='buyer-panel-bottom-head'>Completed Invoices: <span className='buyer-panel-bottom-text'>{orderSummary?.invoiceDetails?.paidCount || 0}</span></div>
                                    <div className='buyer-panel-bottom-graph'>
                                        <OrangeBar />
                                    </div>
 
                                </Link>
                            </div>
                        </div>
                        <div className='buyer-panel-cart-top-left-section'>
                            <div className='buyer-panel-left-head'>Total Sales Amount</div>
                            <div className='buyer-panel-circular-process'>
                                <CircularBar totalSalesAmount={orderSummary?.orderDetails?.totalPurchaseAmount[0]?.total_purchase} />
                            </div>
                        </div>
                    </div>
                    <div className='buyer-panel-cart-left-bottom-section'>
                        <Link className='buyer-panel-cart-left-bottom-container'>
 
                            <div className='buyer-panel-left-bottom-cart-top'>
                                <span className='buyer-panel-left-bottom-pert'>{salesSummary[0]?.weeklyData[0]?.orderCount || 0}</span>
                            </div>
                            <div className='buyer-panel-left-bottom-head'>Weekly Sales</div>
                            <div className='buyer-panel-line-chart-graph'>
                                <ConversionChart />
                            </div>
 
                        </Link>
                        <Link className='buyer-panel-cart-left-bottom-container'>
 
                            <div className='buyer-panel-left-bottom-cart-top'>
                                <span className='buyer-panel-left-bottom-pert'>{salesSummary[0]?.monthlyData[0]?.orderCount || 0}</span>
                            </div>
                            <div className='buyer-panel-left-bottom-head'>Monthly Sales</div>
                            <div className='buyer-panel-line-chart-graph'>
                                <SearchEngineChart />
                            </div>
 
                        </Link>
                    </div>
                </div>
                <div className='buyer-panel-cart-right-main-container'>
                    <div className='buyer-panel-map-container'>
                        <WorldMap
                            color="red"
                            value-suffix="people"
                            size="sm"
                            data={countryData}
                        />
                    </div>
                    <div className='buyer-panel-right-head'>Your Buyer Countries</div>
                    <div className='buyer-panel-right-country-section'>
                        {countryData?.slice(0, 2).map((data, index) => (
                            <div className='buyer-panel-country-sect' key={index}>
                                <span className='buyer-panel-country-names'>{data?.country}</span>
                                <span className='buyer-panel-country-price'>{data?.value} USD</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default SupplierDashboard