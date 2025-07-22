import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WorldMap from "react-svg-worldmap";
import ProgressBar from './Charts/ProgressBar';
import OrangeBar from './Charts/OrangeBar'
import CircularBar from './Charts/CircularBar';
import ConversionChart from './Charts/ConversionChart';
import SearchEngineChart from './Charts/SearchEngineChart'
/* import { postRequestWithToken } from '../../api/Requests'; */
import { convertCountryToCode } from '../SharedComponents/CountryCodes/CountryCodes';
import styles from './LogisticsDashboard.module.css'


const LogisticsDashboard = () => {

  const navigate = useNavigate()
  const [countryData, setCountryData] = useState([]);
  const [orderSummary, setOrderSummary] = useState()
  const [salesSummary, setSalesSummary] = useState([])
  const [sellerCountry, setSellerCountry] = useState()

  useEffect(() => {
      const logisticIdSessionStorage = localStorage?.getItem("partner_id");
      const logisticIdLocalStorage = localStorage?.getItem("partner_id");

       if (!logisticIdSessionStorage && !logisticIdLocalStorage) {
          localStorage?.clear();
          navigate("/logistic/login");
          return;
      } 

    //   const obj = {
    //       supplier_id: logisticIdSessionStorage || logisticIdLocalStorage,
    //       usertype: 'logistic'
    //   }
    /*   postRequestWithToken('supplier/orders-buyer-country', obj, async (response) => {
          if (response?.code === 200) {
              setSellerCountry(response?.result)
              const convertedData = convertCountryToCode(response?.result);
              setCountryData(convertedData);
          } else {
          }
      }); */
   /*    postRequestWithToken('supplier/orders-summary-details', obj, async (response) => {
          if (response?.code === 200) {
              setOrderSummary(response?.result)
          } else {
          }
      }) */

    /*   postRequestWithToken('order/sales-filter', obj, async (response) => {
          if (response?.code === 200) {
              setSalesSummary(response?.result)
          } else {
          }
      }) */
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
    <div className={styles.dashboardContainer}>
        <div className={styles.pageTitle}>Dashboard</div>
        {/* <div className={styles.navButton}>
            <div className={styles.button}>Analytics</div>
        </div> */}
        <div className={styles.wrapper}>
            <div className={styles.leftAside}>
                <div className={styles.orderSection}>
                    <div className={styles.section}>
                        <div className={styles.ordersRow}>
                            <Link className={styles.order} to='/logistic'>

                                <div className={styles.orderHeading}>Order Request</div>
                                <div className={styles.totalorders}>{orderSummary?.enquiryCount || 0}</div>

                            </Link>
                           {/*  <Link className={styles.order} to='/supplier/purchased-orders-list'>

                                <div className={styles.orderHeading}>Purchased Orders</div>
                                <div className={styles.totalorders}>{orderSummary?.purchaseOrderCount || 0}</div>

                            </Link> */}
                            <Link className={styles.order} to='/logistic/order/active'>

                                <div className={styles.orderHeading}>Active Orders</div>
                                <div className={styles.totalorders}>{orderSummary?.orderDetails?.activeCount[0]?.count || 0}</div>

                            </Link>
                            <Link className={styles.order} to='/logistic/order/completed'>

                                <div className={styles.orderHeading}>Completed Orders</div>
                                <div className={styles.totalorders}>{orderSummary?.orderDetails?.completedCount[0]?.count || 0}</div>

                            </Link>

                        </div>
                        <div className={styles.invoiceRow}>
                            <Link className={styles.card} to='/supplier/pending-invoices-list'>

                                <div className={styles.cardHeading}>Pending Orders: <span className={styles.totalInvoice}>{orderSummary?.invoiceDetails?.pendingCount || 0}</span></div>
                                <div className={styles.bar}>
                                    <ProgressBar />
                                </div>

                            </Link>
                            <Link className={styles.card} to='/supplier/completed-invoices-list'>

                                <div className={styles.cardHeading}>Completed Orders: <span className={styles.totalInvoice}>{orderSummary?.invoiceDetails?.paidCount || 0}</span></div>
                                <div className={styles.bar}>
                                    <OrangeBar />
                                </div>

                            </Link>
                        </div>
                    </div>
                    <div className={styles.rightAside}>
                        <div className={styles.asideHeading}>Total Orders Amount</div>
                        <div className={styles.circularProcess}>
                            <CircularBar totalSalesAmount={orderSummary?.orderDetails?.totalPurchaseAmount[0]?.total_purchase} />
                        </div>
                    </div>
                </div>
                <div className={styles.performaSection}>
                    <Link className={styles.performaCard}>

                        <div className={styles.performaCardCount}>
                            <span className={styles.performaCardCounts}>{salesSummary[0]?.weeklyData[0]?.orderCount || 0}</span>
                        </div>
                        <div className={styles.performaCardHeading}>Weekly Orders</div>
                        <div className={styles.performaCardGraph}>
                            <ConversionChart />
                        </div>

                    </Link>
                    <Link className={styles.performaCard}>

                        <div className={styles.performaCardCount}>
                            <span className={styles.performaCardCounts}>{salesSummary[0]?.monthlyData[0]?.orderCount || 0}</span>
                        </div>
                        <div className={styles.performaCardHeading}>Monthly Orders</div>
                        <div className={styles.performaCardGraph}>
                            <SearchEngineChart />
                        </div>

                    </Link>
                </div>
            </div>
            <div className={styles.mapSection}>
                <div className={styles.map}>
                    <WorldMap
                        color="red"
                        value-suffix="people"
                        size="sm"
                        data={countryData}
                    />
                </div>
                <div className={styles.mapHeading}>Your Buyer Countries</div>
                <div className={styles.countryName}>
                    {countryData?.slice(0, 2).map((data, index) => (
                        <div className={styles.countrySection} key={index}>
                            <span className={styles.countryTitle}>{data?.country}</span>
                            <span className={styles.countryPrice}>{data?.value} USD</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default LogisticsDashboard