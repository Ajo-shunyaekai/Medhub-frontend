import React, {useEffect, useState } from 'react';
import WorldMap from "react-svg-worldmap";
import { Link } from 'react-router-dom';
import '../style/dashboard.css'
import ProgressBar from './chart/ProgressBar';
import OrangeBar from './chart/OrangeBar'
import CircularBar from './chart/CircularBar';
import ConversionChart from './chart/ConversionChart';
import SearchEngineChart from './chart/SearchEngineChart'
import DirectlyChart from './chart/DirectlyChart'
import PinkBar from './chart/PinkBar'
import Trending from '../assest/dashboard/trendingup.svg'
import Arrow from '../assest/dashboard/arrow.svg'
import { postRequestWithToken } from '../api/Requests';
import {countryToCodeMapping, convertCountryToCode} from '../assest/countryCodes/countryCode'


const AdminDashboard = () => {
    
    const [countryData, setCountryData]                 = useState([]);
    const [dashboardData, setDashboard] = useState()

    useEffect(() => {
        // const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        // const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        // if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        // navigate("/admin/login");
        // return;
        // }

        const obj = {
            admin_id  : 'ADM-b9c743706ae7'
        }

        postRequestWithToken('admin/dashboard-data-list', obj, async (response) => {
            if (response.code === 200) {
                setDashboard(response?.result)
                const convertedData = convertCountryToCode(response?.result?.buyerCountryData);
                setCountryData(convertedData);
            } else {
               console.log('error in orders-summary-details api',response);
            }
        })
    },[])

    console.log(countryData);


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
                                    <Link to='/admin/buyer-request'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>No. of Buyer Request</div>
                                            <div className='top-text'>{dashboardData?.buyerRegisReqCount.count}</div>
                                        </div>
                                    </Link>
                                  
                                    <Link to='/admin/seller-request'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>No. of Seller Request</div>
                                            <div className='top-text'>{dashboardData?.supplierRegisReqCount.count}</div>
                                        </div>
                                    </Link>
                                      <Link to='#'>
                                        <div className='top-content-section'>
                                            <div className='top-head'>Total Request</div>
                                            <div className='top-text'>
                                            {(Number(dashboardData?.buyerRegisReqCount.count) || 0) + (Number(dashboardData?.supplierRegisReqCount.count) || 0)}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className='bottom-container'>
                                    <Link to='/admin/rejected-buyer'>
                                    <div className='bottom-cart-cont'>
                                        <div className='bottom-head'>Rejected Buyer:<span className='bottom-text'> {dashboardData?.completedCount[0]?.count}</span></div>
                                        <div className='bottom-graph'>
                                            <ProgressBar />
                                        </div>
                                    </div>
                                    </Link>
                                    <Link to='/admin/rejected-seller'>
                                        <div className='bottom-cart-cont'>
                                            <div className='bottom-head'>Rejected Seller:<span className='bottom-text'> {dashboardData?.pendingCount[0]?.count}</span></div>
                                            <div className='bottom-graph'>
                                                <OrangeBar />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className='cart-top-left-section'>
                                <div className='left-head'>Total Commission</div>
                                <div className='circular-process'>
                                    <CircularBar />
                                </div>
                            </div>
                        </div>
                        <div className='cart-left-bottom-section'>
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>{dashboardData?.supplierAcceptedReqCount?.count}</span>
                                    {/* <span className='left-bottom-plus'>+3.5</span> */}
                                </div>
                                <div className='left-bottom-head'>Approved Buyer</div>
                                <div className='line-chart-graph'>
                                    <ConversionChart />
                                </div>
                            </div>
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>{dashboardData?.supplierAcceptedReqCount?.count}</span>
                                    {/* <span className='left-bottom-plus'>-2.0</span> */}
                                </div>
                                <div className='left-bottom-head'>Approved Supplier</div>
                                <div className='line-chart-graph'>
                                    <SearchEngineChart />
                                </div>
                            </div>
                            <div className='cart-left-bottom-container'>
                                <div className='left-bottom-cart-top'>
                                    <span className='left-bottom-pert'>
                                    {(Number(dashboardData?.supplierAcceptedReqCount.count) || 0) + (Number(dashboardData?.supplierAcceptedReqCount.count) || 0)}
                                    </span>
                                    {/* <span className='left-bottom-plus'>+4.5</span> */}
                                </div>
                                <div className='left-bottom-head'>Total Approved Request</div>
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
                        <div className='right-head'>Top Buyer and Seller Countries</div>
                        <div className='right-country-section'>
                            <div className='country-sect'>
                                <span className='country-names'>{countryData[0]?.country}</span>
                                <span className='country-price'>{countryData[0]?.value}</span>
                            </div>
                            <div className='country-sect'>
                                <span className='country-name'>{countryData[1]?.country}</span>
                                <span className='country-price'>{countryData[1]?.value}</span>
                            </div>
                            <div className='country-sect'>
                                <span className='country-name'>{countryData[2]?.country}</span>
                                <span className='country-price'> {countryData[2]?.value}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end the card conatiner */}
                {/* start the bottom container */}
                <div className='main-bottom-cart-container'>
                    <div className='bottom-section-left-cont'>
                        <div className='bottom-first-sections'>
                            <div className='bottom-img-cont'>
                                <img src={Trending} alt='img' />
                            </div>
                            <div className='bottom-text-cont'>
                                <div className='bottom-text-head'>Weekly top sell</div>
                                <div className='bottom-text-pect'>+ 2.50%</div>
                            </div>
                        </div>
                        <div className='bottom-arrow-cont'>
                            <img src={Arrow} alt='img'/>
                        </div>
                    </div>
                    <div className='bottom-section-right-cont'>
                        <div className='bottom-cont-left-sec'>
                            <div className='bottom-cont-left-head'>Task statistics</div>
                            <div className='bottom-cont-left-cart'>
                                <div className='bottom-cont-left-one'>
                                    <div className='bottom-cont-left-text'>52</div>
                                    <div className='bottom-cont-left-num'>Tasks</div>
                                </div>
                                <div className='bottom-cont-left-one'>
                                    <div className='bottom-cont-left-texts'>+15</div>
                                    <div className='bottom-cont-left-num'>Added</div>
                                </div>
                                <div className='bottom-cont-left-one'>
                                    <div className='bottom-cont-left-text'>45.5%</div>
                                    <div className='bottom-cont-left-num'>Remain</div>
                                </div>
                            </div>
                        </div>
                        <div className='bottom-cont-right-sec'>
                            <div className='bottom-cont-right-sec-head'>This week</div>
                            <div className='bottom-cont-right-sec-completion'>
                                <div className='bottom-cont-right-sections-head'>Task completion</div>
                                <div className='bottom-cont-right-sect-progress'> <PinkBar /> <span className='bottom-cont-right-cont-pinkbar'>65%</span> </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end the botom container */}
            </div>
        </>
    )
}

export default AdminDashboard