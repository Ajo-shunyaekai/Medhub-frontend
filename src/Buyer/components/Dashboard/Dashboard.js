import React, { useEffect, useState } from 'react';
import WorldMap from "react-svg-worldmap";
import { Link, useNavigate } from 'react-router-dom';
import './Buyerdashboard.css'
import ProgressBar from './chart/ProgressBar';
import OrangeBar from './chart/OrangeBar'
import CircularBar from './chart/CircularBar';
import ConversionChart from './chart/ConversionChart';
import SearchEngineChart from './chart/SearchEngineChart'
import DirectlyChart from './chart/DirectlyChart'
import { postRequestWithToken } from '../../../api/Requests';
import { countryToCodeMapping, convertCountryToCode } from '../SharedComponents/countryCodes/countryCode'


const Dashboard = () => {
    const navigate = useNavigate()

    const [countryData, setCountryData] = useState([]);
    const [activeButton, setActiveButton] = useState('1h');
    const [orderSummary, setOrderSummary] = useState()
    const [sellerCountry, setSellerCountry] = useState()

    const handleButtonClick = (value) => {
        setActiveButton(value);
    };

    useEffect(() => {

        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage
        }

        postRequestWithToken('buyer/orders-seller-country', obj, async (response) => {
            if (response.code === 200) {
                setSellerCountry(response?.result)
                const convertedData = await convertCountryToCode(response?.result || []);
                setCountryData(convertedData);
            } else {
                console.log('error in orders-seller-country api', response);
            }
        })
    }, [])

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage
        }

        postRequestWithToken('buyer/orders-summary-details', obj, async (response) => {
            if (response.code === 200) {
                setOrderSummary(response?.result || [])
            } else {
                console.log('error in orders-summary-details api', response);
            }
        })
    }, [])

    return (
        <>
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
                                    <Link to='/buyer/ongoing-inquiries-list'>
                                        <div className='buyer-panel-top-content-section'>
                                            <div className='buyer-panel-top-head'>Ongoing Inquiries</div>
                                            <div className='buyer-panel-top-text'>{orderSummary?.enquiryCount || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/buyer/purchased-orders-list'>
                                        <div className='buyer-panel-top-content-section'>
                                            <div className='buyer-panel-top-head'>Purchased Orders</div>
                                            <div className='buyer-panel-top-text'>{orderSummary?.purchaseOrderCount || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/buyer/active-orders'>
                                        <div className='buyer-panel-top-content-section'>
                                            <div className='buyer-panel-top-head'>Active Orders</div>
                                            <div className='buyer-panel-top-text'>{orderSummary?.orderDetails?.activeCount?.[0]?.count || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/buyer/completed-order'>
                                        <div className='buyer-panel-top-content-section'>
                                            <div className='buyer-panel-top-head'>Completed Orders</div>
                                            <div className='buyer-panel-top-text'>{orderSummary?.orderDetails?.completedCount?.[0]?.count || 0}</div>
                                        </div>
                                    </Link>

                                </div>
                                <div className='buyer-panel-bottom-container'>
                                    <Link to='/buyer/complete-invoices-list'>
                                        <div className='buyer-panel-bottom-cart-cont'>
                                            <div className='buyer-panel-bottom-head'>Completed Invoices: <span className='buyer-panel-bottom-text'>{orderSummary?.invoiceDetails?.paidCount || 0}</span></div>
                                            <div className='buyer-panel-bottom-graph'>
                                                <ProgressBar />
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to='/buyer/pending-invoices-list'>
                                        <div className='buyer-panel-bottom-cart-cont'>
                                            <div className='buyer-panel-bottom-head'>Pending Invoices: <span className='buyer-panel-bottom-text'>{orderSummary?.invoiceDetails?.pendingCount || 0}</span></div>
                                            <div className='buyer-panel-bottom-graph'>
                                                <OrangeBar />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className='buyer-panel-cart-top-left-section'>
                                <div className='buyer-panel-left-head'>Total Purchase</div>
                                <div className='buyer-panel-circular-process'>
                                    <CircularBar totalPurchase={orderSummary?.orderDetails?.totalPurchaseAmount?.[0]?.total_purchase || 0} />
                                </div>
                            </div>
                        </div>
                        <div className='buyer-panel-cart-left-bottom-section'>
                            <Link to='/buyer/invoice/Proforma-Invoice'>
                                <div className='buyer-panel-cart-left-bottom-container'>
                                    <div className='buyer-panel-left-bottom-cart-top'>
                                        <span className='buyer-panel-left-bottom-pert'>{orderSummary?.orderDetails?.activeCount?.[0]?.count || 0}</span>
                                    </div>
                                    <div className='buyer-panel-left-bottom-head'>Proforma Invoices</div>
                                    <div className='buyer-panel-line-chart-graph'>
                                        <ConversionChart />
                                    </div>
                                </div>
                            </Link>
                            <Link to='/buyer/my-supplier'>
                                <div className='buyer-panel-cart-left-bottom-container'>
                                    <div className='buyer-panel-left-bottom-cart-top'>
                                        <span className='buyer-panel-left-bottom-pert'>{orderSummary?.supplierCount || 0}</span>
                                    </div>
                                    <div className='buyer-panel-left-bottom-head'>My Supplier</div>
                                    <div className='buyer-panel-line-chart-graph'>
                                        <SearchEngineChart />
                                    </div>
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
                        <div className='buyer-panel-right-head'>Your Seller Countries</div>
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

        </>
    )
}

export default Dashboard