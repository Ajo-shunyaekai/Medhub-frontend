import React, { useEffect, useState } from 'react';
import WorldMap from "react-svg-worldmap";
import { Link, useNavigate } from 'react-router-dom';
import './dashboard.css'
import ProgressBar from './chart/ProgressBar';
import OrangeBar from './chart/OrangeBar'
import CircularBar from './chart/CircularBar';
import ConversionChart from './chart/ConversionChart';
import SearchEngineChart from './chart/SearchEngineChart'
import DirectlyChart from './chart/DirectlyChart'
import PinkBar from './chart/PinkBar'
import Trending from '../../assets/Images/dashboard/trendingup.svg'
import Arrow from '../../assets/Images/dashboard/arrow.svg'
import { postRequestWithToken } from '../../api/Requests';
import { countryToCodeMapping, convertCountryToCode } from '../shared-components/countryCodes/countryCode'


const AdminDashboard = () => {
    const navigate = useNavigate()

    const adminIdSessionStorage = localStorage?.getItem("admin_id");
    const adminIdLocalStorage = localStorage?.getItem("admin_id");

    const [countryData, setCountryData] = useState([]);
    const [dashboardData, setDashboard] = useState()
    const [filterValue, setFilterValue] = useState('')

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage?.clear();
            navigate("/admin/login");
            return;
        }

        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterValue: filterValue
        }

        postRequestWithToken('admin/dashboard-data-list', obj, async (response) => {
            if (response?.code === 200) {
                setDashboard(response?.result)
                const convertedData = convertCountryToCode(response?.result?.buyerCountryData);
                setCountryData(convertedData);
            } else {
            }
        })
    }, [])

    return (

        <div className='buyer-panel-dashboard-section'>
            <div className='buyer-panel-dashboard-heading'>Dashboard</div>
            {/* <div className='buyer-panel-analystic-button' >
                <div className='buyer-panel-buttons'>Analytics</div>
            </div> */}
            <div className='buyer-panel-cart-main-container'>
                <div className='buyer-panel-cart-left-main-container'>
                    <div className='buyer-panel-cart-left-top-section'>
                        <div className='buyer-panel-cart-top-right-section'>
                            <div className='buyer-panel-top-container'>
                                <Link className='buyer-panel-top-content-section' to={`/admin/buyer-request?filterValue=${filterValue}`}>

                                    <div className='buyer-panel-top-head'>No. of Buyer Request</div>
                                    <div className='buyer-panel-top-text'>{dashboardData?.buyerRegisReqCount.count || 0}</div>

                                </Link>
                                <Link className='buyer-panel-top-content-section' to={`/admin/supplier-request?filterValue=${filterValue}`}>

                                    <div className='buyer-panel-top-head'>No. of Supplier Request</div>
                                    <div className='buyer-panel-top-text'>{dashboardData?.supplierRegisReqCount.count || 0}</div>

                                </Link>
                                <Link className='buyer-panel-top-content-section' to={`/admin/total-request-list?filterValue=${filterValue}`}>

                                    <div className='buyer-panel-top-head'>Total Request</div>
                                    <div className='buyer-panel-top-text'> {(Number(dashboardData?.buyerRegisReqCount.count) || 0) + (Number(dashboardData?.supplierRegisReqCount.count) || 0)}</div>

                                </Link>
                            </div>
                            <div className='buyer-panel-bottom-container'>
                                <Link className='buyer-panel-bottom-cart-cont' to={`/admin/rejected-buyer?filterValue=${filterValue}`}>

                                    <div className='buyer-panel-bottom-head'>Rejected Buyer: <span className='buyer-panel-bottom-text'>{dashboardData?.buyerRejectedReqCount?.count || 0}</span></div>
                                    <div className='buyer-panel-bottom-graph'>
                                        <ProgressBar />
                                    </div>

                                </Link>
                                <Link className='buyer-panel-bottom-cart-cont' to={`/admin/rejected-supplier?filterValue=${filterValue}`}>

                                    <div className='buyer-panel-bottom-head'>Rejected Supplier: <span className='buyer-panel-bottom-text'>{dashboardData?.supplierRejectedReqCount?.count || 0}</span></div>
                                    <div className='buyer-panel-bottom-graph'>
                                        <OrangeBar />
                                    </div>

                                </Link>
                            </div>
                        </div>
                        <div className='buyer-panel-cart-top-left-section'>
                            <div className='buyer-panel-left-head'>Total Commission</div>
                            <div className='buyer-panel-circular-process'>
                                <CircularBar />
                            </div>
                        </div>
                    </div>
                    <div className='admin-panel-cart-left-bottom-section'>
                        <Link className='admin-panel-cart-left-bottom-container' to={`/admin/approved-buyer?filterValue=${filterValue}`}>

                            <div className='admin-panel-left-bottom-cart-top'>
                                <span className='admin-panel-left-bottom-pert'>{dashboardData?.buyerAcceptedReqCount?.count || 0}</span>
                            </div>
                            <div className='admin-panel-left-bottom-head'>Approved Buyer</div>
                            <div className='admin-panel-line-chart-graph'>
                                <ConversionChart />
                            </div>

                        </Link>
                        <Link className='admin-panel-cart-left-bottom-container' to={`/admin/approved-supplier?filterValue=${filterValue}`}>

                            <div className='admin-panel-left-bottom-cart-top'>
                                <span className='admin-panel-left-bottom-pert'>{dashboardData?.supplierAcceptedReqCount?.count || 0}</span>
                            </div>
                            <div className='admin-panel-left-bottom-head'>Approved Supplier</div>
                            <div className='admin-panel-line-chart-graph'>
                                <SearchEngineChart />
                            </div>

                        </Link>

                        <Link className='admin-panel-cart-left-bottom-container' to={`/admin/total-approved-request?filterValue=${filterValue}`}>

                            <div className='admin-panel-left-bottom-cart-top'>
                                <span className='admin-panel-left-bottom-pert'> {(Number(dashboardData?.buyerAcceptedReqCount.count) || 0) + (Number(dashboardData?.supplierAcceptedReqCount.count) || 0)}</span>
                            </div>
                            <div className='admin-panel-left-bottom-head'>Total Approved Request</div>
                            <div className='admin-panel-line-chart-graph'>
                                <DirectlyChart />
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
                    <div className='buyer-panel-right-head'>Top Buyer and Supplier Countries</div>
                    <div className='buyer-panel-right-country-section'>
                        {countryData?.slice(0, 2).map((data, index) => (
                            <div className='buyer-panel-country-sect' key={index}>
                                <span className='buyer-panel-country-names'>{countryData[0]?.country}</span>
                                <span className='buyer-panel-country-price'>{countryData[0]?.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* start the bottom container */}
            <div className='main-bottom-cart-container'>
                <div className='bottom-section-left-cont'>
                    <Link
                        to={`/admin/inquiries-section/request?filterValue=${filterValue}`}
                    >
                        <div className='bottom-text-cont'>
                            <div className='buyer-panel-top-head'>Total Inquiries</div>
                            <div className='buyer-panel-top-text'>{dashboardData?.inquiryCount || 0}</div>
                        </div>

                        <div className='bottom-arrow-cont'>
                            <img src={Arrow} alt='img' />
                        </div>
                    </Link>
                </div>

                <div className='bottom-section-left-cont'>
                    <Link

                        to={`/admin/total-PO?filterValue=${filterValue}`}
                    >
                        <div className='bottom-text-cont'>
                            <div className='buyer-panel-top-head'>Total PO</div>
                            <div className='buyer-panel-top-text'>{dashboardData?.poCount || 0}</div>

                        </div>
                        <div className='bottom-arrow-cont'>
                            <img src={Arrow} alt='img' />
                        </div>
                    </Link>

                </div>
                <div className='bottom-section-left-cont'>
                    <Link

                        to={`/admin/total-active-orders?filterValue=${filterValue}`}
                    >
                        <div className='bottom-text-cont'>
                            <div className='buyer-panel-top-head'>Total Active Orders</div>
                            <div className='buyer-panel-top-text'>{dashboardData?.orderCount || 0}</div>

                        </div>
                        <div className='bottom-arrow-cont'>
                            <img src={Arrow} alt='img' />
                        </div>
                    </Link>
                </div>
                <div className='bottom-section-left-cont'>
                    <Link

                        to={`/admin/total-completed-order?filterValue=${filterValue}`}
                    >
                        <div className='bottom-text-cont'>
                            <div className='buyer-panel-top-head'>Total Completed Orders</div>
                            <div className='buyer-panel-top-text'>{dashboardData?.completedOrderPercentage || 0}</div>

                        </div>
                        <div className='bottom-arrow-cont'>
                            <img src={Arrow} alt='img' />
                        </div>
                    </Link>
                </div>
            </div>

            {/* end the botom container */}
        </div>


    )
}

export default AdminDashboard