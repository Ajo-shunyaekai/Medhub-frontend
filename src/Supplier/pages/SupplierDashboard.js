import React, { useEffect, useState } from 'react';
import WorldMap from "react-svg-worldmap";
import { Link, useNavigate } from 'react-router-dom';
// import dashboards from '../style/dashboard.css'
// import trending from "../assest/dashboard/trendingup.svg"
// import Arrow from "../assest/dashboard/arrow.svg"
// import Form from 'react-bootstrap/Form';
// import ThreeDot from '../assest/dashboard/three-dot.svg'
// import LineChart from '../pages/chart/LineChart'
import ProgressBar from '../pages/chart/ProgressBar';
import OrangeBar from '../pages/chart/OrangeBar'
// import PinkBar from '../pages/chart/PinkBar'
import CircularBar from '../pages/chart/CircularBar';
// import WeeklyBar from '../pages/chart/WeeklyBar';
// import MonthlyBar from '../pages/chart/MonthlyBar';
import ConversionChart from '../pages/chart/ConversionChart';
import SearchEngineChart from '../pages/chart/SearchEngineChart'
import DirectlyChart from '../pages/chart/DirectlyChart'
import { postRequestWithToken } from '../api/Requests';
import {countryToCodeMapping, convertCountryToCode} from '../assest/countryCodes/countryCode'


const SupplierDashboard = () => {
    console.log('supplierIdLocalStorage, supplierIdSessionStorage');
    const navigate = useNavigate()

    const [countryData, setCountryData]     = useState([]);
    const [orderSummary, setOrderSummary]   = useState()
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
            supplier_id  : supplierIdSessionStorage || supplierIdLocalStorage,
            user_type    : 'supplier'
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
    },[])


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
                                    <Link to='/supplier/order-requests'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Order Request</div>
                                            <div className='top-text'>{orderSummary?.pendingCount[0]?.count || 100}</div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/ongoing-orders'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Ongoing Orders</div>
                                            <div className='top-text'>{orderSummary?.activeCount[0]?.count || 50}</div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/completed-orders'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Completed Orders</div>
                                            <div className='top-text'>{orderSummary?.completedCount[0]?.count || 20}</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className='bottom-container'>
                                    <Link to='/supplier/invoice/pending'>
                                        <div className='bottom-cart-cont'>
                                            <div className='bottom-head'>Pending Invoices:<span className='bottom-text'> 65</span></div>
                                            <div className='bottom-graph'>
                                                <ProgressBar />
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to='/supplier/invoice/paid'>
                                        <div className='bottom-cart-cont'>
                                            <div className='bottom-head'> Completed Invoices:<span className='bottom-text'> 25</span></div>
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
                                    <CircularBar totalSalesAmount = {orderSummary?.totalPurchaseAmount[0]?.total_purchase} />
                                </div>
                            </div>
                        </div>
                        <div className='cart-left-bottom-section'>
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>30</span>
                                    <span className='left-bottom-plus'>+3.5</span>
                                </div>
                                <div className='left-bottom-head'>Weekly Sales</div>
                                <div className='line-chart-graph'>
                                    <ConversionChart />
                                </div>
                            </div>
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>25</span>
                                    <span className='left-bottom-plus'>-2.0</span>
                                </div>
                                <div className='left-bottom-head'>Monthly Sales</div>
                                <div className='line-chart-graph'>
                                    <SearchEngineChart />
                                </div>
                            </div>
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>40</span>
                                    <span className='left-bottom-plus'>+4.5</span>
                                </div>
                                <div className='left-bottom-head'>Yearly Sales</div>
                                <div className='line-chart-graph'>
                                    <DirectlyChart />
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
                        <div className='right-head'>Your buyer countries</div>
                        <div className='right-country-section'>
                            <div className='country-sect'>
                                <span className='country-names'>{countryData[0]?.country}</span>
                                <span className='country-price'>{countryData[0]?.value} AED</span>
                            </div>
                            <div className='country-sect'>
                                <span className='country-name'>{countryData[1]?.country}</span>
                                <span className='country-price'>{countryData[1]?.value} AED</span>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
                {/* end the graph container */}
            </div>
        </>
    )
}

export default SupplierDashboard