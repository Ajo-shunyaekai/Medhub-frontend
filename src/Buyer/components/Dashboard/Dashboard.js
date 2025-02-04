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
            <div className='buyer-dashboard-section'>
                <div className='buyer-dashboard-heading'>Dashboard</div>
                <div className='buyer-analystic-button' >
                    <div className='buyer-buttons'>Analytics</div>
                </div>
                <div className='buyer-cart-main-container'>
                    <div className='buyer-cart-left-main-container'>
                        <div className='buyer-cart-left-top-section'>
                            <div className='buyer-cart-top-right-section'>
                                <div className='buyer-top-container'>
                                    <Link to='/buyer/ongoing-inquiries-list'>
                                        <div className='buyer-top-content-section'>
                                            <div className='buyer-top-head'>Ongoing Inquiries</div>
                                            <div className='buyer-top-text'>{orderSummary?.enquiryCount || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/buyer/purchased-orders-list'>
                                        <div className='buyer-top-content-section'>
                                            <div className='buyer-top-head'>Purchased Orders</div>
                                            <div className='buyer-top-text'>{orderSummary?.purchaseOrderCount || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/buyer/active-orders'>
                                        <div className='buyer-top-content-section'>
                                            <div className='buyer-top-head'>Active Orders</div>
                                            <div className='buyer-top-text'>{orderSummary?.orderDetails?.activeCount?.[0]?.count || 0}</div>
                                        </div>
                                    </Link>
                                    <Link to='/buyer/completed-order'>
                                        <div className='buyer-top-content-section'>
                                            <div className='buyer-top-head'>Completed Orders</div>
                                            <div className='buyer-top-text'>{orderSummary?.orderDetails?.completedCount?.[0]?.count || 0}</div>
                                        </div>
                                    </Link>

                                </div>
                                <div className='buyer-bottom-container'>
                                    <Link to='/buyer/complete-invoices-list'>
                                        <div className='buyer-bottom-cart-cont'>
                                            <div className='buyer-bottom-head'>Completed Invoices: <span className='buyer-bottom-text'>{orderSummary?.invoiceDetails?.paidCount || 0}</span></div>
                                            <div className='buyer-bottom-graph'>
                                                <ProgressBar />
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to='/buyer/pending-invoices-list'>
                                        <div className='buyer-bottom-cart-cont'>
                                            <div className='buyer-bottom-head'>Pending Invoices: <span className='buyer-bottom-text'>{orderSummary?.invoiceDetails?.pendingCount || 0}</span></div>
                                            <div className='buyer-bottom-graph'>
                                                <OrangeBar />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className='buyer-cart-top-left-section'>
                                <div className='buyer-left-head'>Total Purchase</div>
                                <div className='buyer-circular-process'>
                                    <CircularBar totalPurchase={orderSummary?.orderDetails?.totalPurchaseAmount?.[0]?.total_purchase || 0} />
                                </div>
                            </div>
                        </div>
                        <div className='buyer-cart-left-bottom-section'>
                            <Link to='/buyer/invoice/Proforma-Invoice'>
                                <div className='buyer-cart-left-bottom-container'>
                                    <div className='buyer-left-bottom-cart-top'>
                                        <span className='buyer-left-bottom-pert'>{orderSummary?.enquiryCount?.[0]?.count || 0}</span>
                                    </div>
                                    <div className='buyer-left-bottom-head'>Proforma Invoices</div>
                                    <div className='buyer-line-chart-graph'>
                                        <ConversionChart />
                                    </div>
                                </div>
                            </Link>
                            <Link to='/buyer/my-supplier'>
                                <div className='buyer-cart-left-bottom-container'>
                                    <div className='buyer-left-bottom-cart-top'>
                                        <span className='buyer-left-bottom-pert'>{orderSummary?.purchaseOrderCount?.[0]?.count || 0}</span>
                                    </div>
                                    <div className='buyer-left-bottom-head'>My Supplier</div>
                                    <div className='buyer-line-chart-graph'>
                                        <SearchEngineChart />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className='buyer-cart-right-main-container'>
                        <div className='buyer-map-container'>
                            <WorldMap
                                color="red"
                                value-suffix="people"
                                size="sm"
                                data={countryData}
                            />
                        </div>
<<<<<<< Updated upstream
                        <div className='right-head'>Your Seller Countries</div>
                        <div className='right-country-section'>
                            {/* <div className='country-sect'>
                                <span className='country-names'>{countryData?.[0]?.country}</span>
                                <span className='country-price'>{countryData?.[0]?.value} USD</span>
                            </div>
                            <div className='country-sect'>
                                <span className='country-name'>{countryData?.[1]?.country}</span>
                                <span className='country-price'>{countryData?.[1]?.value} USD</span>
                            </div> */}
=======
                        <div className='buyer-right-head'>Your Seller Countries</div>
                        <div className='buyer-right-country-section'>
>>>>>>> Stashed changes
                            {countryData?.slice(0, 2).map((data, index) => (
                                <div className='buyer-country-sect' key={index}>
                                    <span className='buyer-country-names'>{data?.country}</span>
                                    <span className='buyer-country-price'>{data?.value} USD</span>
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