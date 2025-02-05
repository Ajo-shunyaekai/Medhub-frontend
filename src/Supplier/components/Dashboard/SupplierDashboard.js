import React, { useEffect, useState } from 'react';
import WorldMap from "react-svg-worldmap";
import { Link, useNavigate } from 'react-router-dom';
import './dashboard.css'
import ProgressBar from './Charts/ProgressBar';
import OrangeBar from './Charts/OrangeBar'
import CircularBar from './Charts/CircularBar';
import ConversionChart from './Charts/ConversionChart';
import SearchEngineChart from './Charts/SearchEngineChart'
import DirectlyChart from './Charts/DirectlyChart'
import { postRequestWithToken } from '../../api/Requests';
import {countryToCodeMapping, convertCountryToCode} from '../SharedComponents/countryCodes/countryCode'


const SupplierDashboard = () => {
    const navigate = useNavigate()

    const [countryData, setCountryData]     = useState([]);
    const [orderSummary, setOrderSummary]   = useState()
    const [salesSummary, setSalesSummary]   = useState([])
    const [sellerCountry, setSellerCountry] = useState()
    const [activeButton, setActiveButton]   = useState('1h');

    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage   = localStorage.getItem("supplier_id");
        
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }

        const obj = {
            supplier_id : supplierIdSessionStorage || supplierIdLocalStorage,
            user_type   : 'supplier'
        }
        postRequestWithToken('supplier/orders-buyer-country', obj, async (response) => {
            if (response.code === 200) {
                setSellerCountry(response?.result)
                const convertedData = convertCountryToCode(response?.result);
                setCountryData(convertedData);
            } else {
               console.log('error in orders-buyer-country api',response);
            }
        });
        postRequestWithToken('supplier/orders-summary-details', obj, async (response) => {
            if (response.code === 200) {
                setOrderSummary(response?.result)
            } else {
               console.log('error in orders-summary-details api',response);
            }
        })

        postRequestWithToken('order/sales-filter', obj, async (response) => {
            if (response.code === 200) {
                setSalesSummary(response?.result)
            } else {
               console.log('error in sales-filter api',response);
            }
        })
    },[])

    const chartData = {
        labels: [], // Populate labels based on your data
        values: []  // Populate values based on your data
    };

    if (salesSummary.length > 0) {
        // Example of processing yearly data for the chart
        chartData.labels = salesSummary[0]?.yearlyData.map(item => item._id.year) || [];
        chartData.values = salesSummary[0]?.yearlyData.map(item => item.orderCount) || [];
    }
    return (
        <>
            <div className='supplier-dashboard-section'>
                <div className='supplier-dashboard-heading'>Dashboard</div>
                <div className='supplier-analystic-button' >
                    <div className='supplier-buttons'>Analytics</div>
                </div>
                {/* start the card container */}
                <div className='supplier-cart-main-container'>
                    <div className='supplier-cart-left-main-container'>
                        <div className='supplier-cart-left-top-section'>
                            <div className='supplier-cart-top-right-section'>
                                <div className='supplier-top-container'>
                                    <Link to='/supplier/inquiry-request-list'>
                                        <div className='supplier-top-content-section'>
                                            <div className='supplier-top-head'>Inquiry Request</div>
                                            <div className='supplier-top-text'>{orderSummary?.enquiryCount || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/purchased-orders-list'>
                                        <div className='supplier-top-content-section'>
                                            <div className='supplier-top-head'>Purchased Orders</div>
                                            <div className='supplier-top-text'>{orderSummary?.purchaseOrderCount || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/ongoing-orders'>
                                        <div className='supplier-top-content-section'>
                                            <div className='supplier-top-head'>Active Orders</div>
                                            <div className='supplier-top-text'>{orderSummary?.orderDetails?.activeCount[0]?.count || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/completed-orders'>
                                        <div className='supplier-top-content-section'>
                                            <div className='supplier-top-head'>Completed Orders</div>
                                            <div className='supplier-top-text'>{orderSummary?.orderDetails?.completedCount[0]?.count || 0}</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className='supplier-bottom-container'>
                                    <Link to='/supplier/pending-invoices-list'>
                                        <div className='supplier-bottom-cart-cont'>
                                            <div className='supplier-bottom-head'>Pending Invoices: <span className='supplier-bottom-text'>{orderSummary?.invoiceDetails?.pendingCount || 0}</span></div>
                                            <div className='supplier-bottom-graph'>
                                                <ProgressBar />
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/completed-invoices-list'>
                                        <div className='supplier-bottom-cart-cont'>
                                            <div className='supplier-bottom-head'> Completed Invoices: <span className='supplier-bottom-text'>{orderSummary?.invoiceDetails?.paidCount || 0}</span></div>
                                            <div className='supplier-bottom-graph'>
                                                <OrangeBar />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className='supplier-cart-top-left-section'>
                                <div className='supplier-left-head'>Total Sales Amount</div>
                                <div className='supplier-circular-process'>
                                    <CircularBar totalSalesAmount = {orderSummary?.orderDetails?.totalPurchaseAmount[0]?.total_purchase}  />
                                </div>
                            </div>
                        </div>
                        <div className='supplier-supplier-cart-left-bottom-section'>
                            <div className='supplier-supplier-cart-left-bottom-container'>
                                <div className='supplier-supplier-left-bottom-cart-top'>
                                    <span className='supplier-supplier-left-bottom-pert'>{salesSummary[0]?.weeklyData[0]?.orderCount || 0}</span>
                                </div>
                                <div className='supplier-supplier-left-bottom-head'>Weekly Sales</div>
                                <div className='supplier-supplier-line-chart-graph'>
                                    <ConversionChart />
                                </div>
                            </div>
                            <div className='supplier-supplier-cart-left-bottom-container'>
                                <div className='supplier-supplier-left-bottom-cart-top'>
                                    <span className='supplier-supplier-left-bottom-plus'>{salesSummary[0]?.monthlyData[0]?.orderCount || 0}</span>
                                </div>
                                <div className='supplier-supplier-left-bottom-head'>Monthly Sales</div>
                                <div className='supplier-supplier-line-chart-graph'>
                                    <SearchEngineChart />
                                </div>
                            </div>
                            <div className='supplier-supplier-cart-left-bottom-container'>
                                <div className='supplier-supplier-left-bottom-cart-top'>
                                    <span className='supplier-supplier-left-bottom-pert'>{salesSummary[0]?.yearlyData[0]?.orderCount || 0}</span>
                                </div>
                                <div className='supplier-supplier-left-bottom-head'>Yearly Sales</div>
                                <div className='supplier-supplier-line-chart-graph'>
                                    <DirectlyChart data={chartData}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='supplier-cart-right-main-container'>
                        <div className='supplier-map-container'>
                            <WorldMap
                                color="red"
                                value-suffix="people"
                                size="sm"
                                data={countryData}
                            />
                        </div>
                        <div className='supplier-right-head'>Your Buyer Countries</div>
                        <div className='supplier-right-country-section'>
                            {countryData?.slice(0, 2).map((data, index) => (
                                <div className='supplier-country-sect' key={index}>
                                    <span className='supplier-country-names'>{data?.country}</span>
                                    <span className='supplier-country-price'>{data?.value} USD</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* end the graph container */}
            </div>
        </>
    )
}

export default SupplierDashboard