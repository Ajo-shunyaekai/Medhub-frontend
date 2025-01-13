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
            <div className='dashboard-section'>
                <div className='dashboard-heading'>Dashboard</div>
                <div className='analystic-button' >
                    <div className='buttons'>Analytics</div>
                </div>
                {/* start the card container */}
                <div className='cart-main-container'>
                    <div className='cart-left-main-container'>
                        <div className='cart-left-top-section'>
                            <div className='cart-top-right-section'>
                                <div className='top-container'>
                                    <Link to='/supplier/inquiry-request-list'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Inquiry Request</div>
                                            <div className='top-text'>{orderSummary?.enquiryCount || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/purchased-orders-list'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Purchased Orders</div>
                                            <div className='top-text'>{orderSummary?.purchaseOrderCount || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/ongoing-orders'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Active Orders</div>
                                            <div className='top-text'>{orderSummary?.orderDetails?.activeCount[0]?.count || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/completed-orders'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Completed Orders</div>
                                            <div className='top-text'>{orderSummary?.orderDetails?.completedCount[0]?.count || 0}</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className='bottom-container'>
                                    <Link to='/supplier/pending-invoices-list'>
                                        <div className='bottom-cart-cont'>
                                            <div className='bottom-head'>Pending Invoices: <span className='bottom-text'>{orderSummary?.invoiceDetails?.pendingCount || 0}</span></div>
                                            <div className='bottom-graph'>
                                                <ProgressBar />
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/completed-invoices-list'>
                                        <div className='bottom-cart-cont'>
                                            <div className='bottom-head'> Completed Invoices: <span className='bottom-text'>{orderSummary?.invoiceDetails?.paidCount || 0}</span></div>
                                            <div className='bottom-graph'>
                                                <OrangeBar />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className='cart-top-left-section'>
                                <div className='left-head'>Total Sales Amount</div>
                                <div className='circular-process'>
                                    <CircularBar totalSalesAmount = {orderSummary?.orderDetails?.totalPurchaseAmount[0]?.total_purchase}  />
                                </div>
                            </div>
                        </div>
                        <div className='cart-left-bottom-section'>
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>{salesSummary[0]?.weeklyData[0]?.orderCount || 0}</span>
                                    {/* <span className='left-bottom-plus'>+3.5</span> */}
                                </div>
                                <div className='left-bottom-head'>Weekly Sales</div>
                                <div className='line-chart-graph'>
                                    <ConversionChart />
                                </div>
                            </div>
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    {/* <span className='left-bottom-pert'>1</span> */}
                                    <span className='left-bottom-plus'>{salesSummary[0]?.monthlyData[0]?.orderCount || 0}</span>
                                </div>
                                <div className='left-bottom-head'>Monthly Sales</div>
                                <div className='line-chart-graph'>
                                    <SearchEngineChart />
                                </div>
                            </div>
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>{salesSummary[0]?.yearlyData[0]?.orderCount || 0}</span>
                                    {/* <span className='left-bottom-plus'>+4.5</span> */}
                                </div>
                                <div className='left-bottom-head'>Yearly Sales</div>
                                <div className='line-chart-graph'>
                                    <DirectlyChart data={chartData}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='cart-right-main-container'>
                        <div className='map-container'>
                            <WorldMap
                                color="red"
                                value-suffix="people"
                                size="sm"
                                data={countryData}
                            />
                        </div>
                        <div className='right-head'>Your Buyer Countries</div>
                        <div className='right-country-section'>
                            {/* <div className='country-sect'>
                                <span className='country-names'>{countryData[0]?.country}</span>
                                <span className='country-price'>{countryData[0]?.value} USD</span>
                            </div>
                            <div className='country-sect'>
                                <span className='country-name'>{countryData[1]?.country}</span>
                                <span className='country-price'>{countryData[1]?.value} USD</span>
                            </div> */}
                            {countryData?.slice(0, 2).map((data, index) => (
                                <div className="country-sect" key={index}>
                                    <span className="country-names">{data?.country}</span>
                                    <span className="country-price">{data?.value} USD</span>
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