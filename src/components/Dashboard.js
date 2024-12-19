import React, { useEffect, useState } from 'react';
import WorldMap from "react-svg-worldmap";
import { Link, useNavigate } from 'react-router-dom';
import '../style/dashboard.css'
import trending from "../assest/trendingup.svg"
import Arrow from "../assest/arrow.svg"
import Form from 'react-bootstrap/Form';
import ThreeDot from '../assest/three-dot.svg'
import LineChart from '../components/chart/LineChart'
import ProgressBar from './chart/ProgressBar';
import OrangeBar from './chart/OrangeBar'
import PinkBar from './chart/PinkBar'
import CircularBar from './chart/CircularBar';
import WeeklyBar from './chart/WeeklyBar';
import MonthlyBar from './chart/MonthlyBar';
import ConversionChart from '../components/chart/ConversionChart';
import SearchEngineChart from './chart/SearchEngineChart'
import DirectlyChart from './chart/DirectlyChart'
import { postRequestWithToken } from '../api/Requests';
import {countryToCodeMapping, convertCountryToCode} from '../assest/countryCodes/countryCode'

  
const Dashboard = () => {
    const navigate = useNavigate()

    const [countryData, setCountryData]     = useState([]);
    const [activeButton, setActiveButton]   = useState('1h');
    const [orderSummary, setOrderSummary]   = useState()
    const [sellerCountry, setSellerCountry] = useState()

    const handleButtonClick = (value) => {
        setActiveButton(value);
    };

    useEffect(() => {

        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        navigate("/buyer/login");
        return;
        }

        const obj = {
            buyer_id  : buyerIdSessionStorage || buyerIdLocalStorage
        }

        postRequestWithToken('buyer/orders-seller-country', obj, async (response) => {
            if (response.code === 200) {
                setSellerCountry(response?.result)
                const convertedData = await convertCountryToCode(response?.result||[]);
                setCountryData(convertedData);
            } else {
               console.log('error in orders-seller-country api',response);
            }
        })
    },[])

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        navigate("/buyer/login");
        return;
        }

        const obj = {
            buyer_id  : buyerIdSessionStorage || buyerIdLocalStorage
        }

        postRequestWithToken('buyer/orders-summary-details', obj, async (response) => {
            if (response.code === 200) {
                setOrderSummary(response?.result || [])
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
                                <Link to='/buyer/ongoing-inquiries-list'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Ongoing Inquiries</div>
                                            <div className='top-text'>{orderSummary?.enquiryCount || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/buyer/purchased-orders-list'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Purchased Orders</div>
                                            <div className='top-text'>{orderSummary?.purchaseOrderCount || 0}</div>
                                        </div>
                                    </Link>
                                <Link to='/buyer/ongoing-orders'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Active Orders</div>
                                            <div className='top-text'>{orderSummary?.orderDetails?.activeCount?.[0]?.count || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/buyer/completed-orders'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Completed Orders</div>
                                            <div className='top-text'>{orderSummary?.orderDetails?.completedCount?.[0]?.count || 0}</div>
                                        </div>
                                    </Link>
                                    
                                </div>
                                <div className='bottom-container'>
                                <Link to='/buyer/complete-invoices-list'>
                                    <div className='bottom-cart-cont'>
                                        <div className='bottom-head'>Complete Invoices: <span className='bottom-text'>{orderSummary?.orderDetails?.activeCount?.count || 0}</span></div>
                                        <div className='bottom-graph'>
                                            <ProgressBar />
                                        </div>
                                    </div>
                                </Link>
                                <Link to='/buyer/pending-invoices-list'>
                                    <div className='bottom-cart-cont'>
                                        <div className='bottom-head'>Pending Invoices: <span className='bottom-text'>{orderSummary?.orderDetails?.activeCount?.count || 0}</span></div>
                                        <div className='bottom-graph'>
                                            <OrangeBar />
                                        </div>
                                    </div>
                                    </Link>
                                </div>
                            </div>
                            <div className='cart-top-left-section'>
                                <div className='left-head'>Total Purchase</div>
                                <div className='circular-process'>
                                    <CircularBar totalPurchase = {orderSummary?.orderDetails?.totalPurchaseAmount?.[0]?.total_purchase || 0}/>
                                </div>
                            </div>
                        </div>
                        <div className='cart-left-bottom-section'>
                        
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>{orderSummary?.enquiryCount?.[0]?.count || 0}</span>
                                    {/* <span className='left-bottom-plus'>+3.5</span> */}
                                </div>
                                <div className='left-bottom-head'>Lorem</div>
                                <div className='line-chart-graph'>
                                    <ConversionChart />
                                </div>
                            </div>
                            
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>{orderSummary?.purchaseOrderCount?.[0]?.count || 0}</span>
                                    {/* <span className='left-bottom-plus'>-2.0</span> */}
                                </div>
                                <div className='left-bottom-head'>Lorem</div>
                                <div className='line-chart-graph'>
                                    <SearchEngineChart />
                                </div>
                            </div>
                            
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>40</span>
                                    {/* <span className='left-bottom-plus'>+4.5</span> */}
                                </div>
                                <div className='left-bottom-head'>Lorem</div>
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
                        <div className='right-head'>Your Seller Countries</div>
                        <div className='right-country-section'>
                            <div className='country-sect'>
                                <span className='country-names'>{countryData?.[0]?.country}</span>
                                <span className='country-price'>{countryData?.[0]?.value} AED</span>
                            </div>
                            <div className='country-sect'>
                                <span className='country-name'>{countryData?.[1]?.country}</span>
                                <span className='country-price'>{countryData?.[1]?.value} AED</span>
                            </div>
                            {/* <div className='country-sect'>
                                <span className='country-name'>India</span>
                                <span className='country-price'>$1234</span>
                            </div> */}
                        </div>
                    </div>
                </div>
                
                {/* end the graph container */}
            </div>
        </>
    )
}

export default Dashboard