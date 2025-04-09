import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NewDashboard.module.css";

import WorldMap from "react-svg-worldmap";
import CircularBar from "./chart/CircularBar";
import { toast } from "react-toastify";
import { apiRequests } from "../../../api";
import Main from "./../UI/Main/Main";
import DashboardCard from "../UI/DashboardCard/DashboardCard";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import SyncIcon from '@mui/icons-material/Sync';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function NewDashboard() {
  const navigate = useNavigate();
  const [countryData, setCountryData] = useState([]);
  const [orderSummary, setOrderSummary] = useState();
  const [dashboardData, setDashboardData] = useState({});

  const fetchData = async () => {
    const partnerIdSessionStorage = sessionStorage.getItem("partner_id");
    const partnerIdLocalStorage = localStorage.getItem("partner_id");

    if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
      navigate("/logistics/login");
      return;
    }
    const obj = {
      partner_id: partnerIdSessionStorage || partnerIdLocalStorage,
      usertype: "Logistics",
    };

    try {
      const response = await apiRequests.getRequest(
        `logistics/get-logistics-dashboard-data`
      );
      if (response.code === 200) {
        setDashboardData(response.result);
      }
    } catch (error) {
      toast(error.message, { type: "error" });
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Main title={"Dashboard"}>
      <div className={styles.dashboardContainer}>
        <div className={styles.mapContainer}>
            <div className={styles.cardSection}>
                <div className={styles.cardHeading}>Total Purchase</div>
                <div className={styles.roundedProcess}>
                    <CircularBar
                        totalPurchase={
                            orderSummary?.orderDetails?.totalPurchaseAmount?.[0]
                            ?.total_purchase || 0
                        }
                    />
                </div>
            </div>

            <div className={styles.cardSection}>
                <div className={styles.cardHeading}>Your Seller Countries</div>
                <div className={styles.roundedProcess}>
                    <WorldMap color="red" value-suffix="people" size="sm" data={countryData} />
                </div>
                
                <div className={styles.rightSection}>
                    {countryData?.slice(0, 2).map((data, index) => (
                    <div className={styles.countrySelc} key={index}>
                        <span className={styles.countryName}>{data?.country}</span>
                        <span className={styles.countryPrice}>{data?.value} USD</span>
                    </div>
                    ))}
                </div>
            </div>
        </div>
        <div className={styles.cardContainer}>
            <DashboardCard title='Total Orders'      count={80}  icons={<ShoppingCartIcon className={styles.icons} />} />
            <DashboardCard title='Pending Orders'    count={80}  icons={<HourglassFullIcon className={styles.icons}/>} />
            <DashboardCard title='Ongoing Orders'    count={80}  icons={<SyncIcon className={styles.icons}/>} />
            <DashboardCard title='Active Orders'     count={80}  icons={<LocalShippingIcon className={styles.icons}/>} />
            <DashboardCard title='Completed Orders'  count={80}  icons={<CheckCircleIcon className={styles.icons}/>} />
        </div>
      </div>
    </Main>
  );
}

export default NewDashboard;

/*
<div className="logistics-analystic-button">
    <div className="logistics-buttons">Analytics</div>
</div>
<div className="logistics-cart-main-container">
    <div className="logistics-cart-left-main-container">
    <div className="logistics-cart-left-top-section">
        <div className="logistics-cart-top-right-section">
        <div className="logistics-top-container">
            <div className="logistics-top-content-section">
            <div className="logistics-top-head">Total Orders</div>
            <div className="logistics-top-text">
                {dashboardData?.total || 0}
            </div>
            </div>
            <div className="logistics-top-content-section">
            <div className="logistics-top-head">Pending Orders</div>
            <div className="logistics-top-text">
                {dashboardData?.pending || 0}
            </div>
            </div>

            <div className="logistics-top-content-section">
            <div className="logistics-top-head">Ongoing Orders</div>
            <div className="logistics-top-text">
                {dashboardData?.ongoing || 0}
            </div>
            </div>

            <div className="logistics-top-content-section">
            <div className="logistics-top-head">Active Orders</div>
            <div className="logistics-top-text">
                {dashboardData?.active || 0}
            </div>
            </div>

            <div className="logistics-top-content-section">
            <div className="logistics-top-head">Completed Orders</div>
            <div className="logistics-top-text">
                {dashboardData?.completed || 0}
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>

    <div className="logistics-cart-left-main-container">
    <div className="logistics-cart-top-left-section">
        <div className="logistics-left-head">Total Purchase</div>
        <div className="logistics-circular-process">
        <CircularBar
            totalPurchase={
            orderSummary?.orderDetails?.totalPurchaseAmount?.[0]
                ?.total_purchase || 0
            }
        />
        </div>
    </div>
    <div className="logistics-cart-right-main-container">
        <div className="logistics-map-container">
        <WorldMap
            color="red"
            value-suffix="people"
            size="sm"
            data={countryData}
        />
        </div>
        <div className="logistics-right-head">Your Seller Countries</div>
        <div className="logistics-right-country-section">
        {countryData?.slice(0, 2).map((data, index) => (
            <div className="country-sect" key={index}>
            <span className="country-names">{data?.country}</span>
            <span className="country-price">{data?.value} USD</span>
            </div>
        ))}
        </div>
    </div>
    </div>
</div>
</div>
*/