import React from 'react'
import styles from './logisticsdetails.module.css'
import ProductList from './LogisticsProductList'

const LogisticsDetails = () => {
    return (
        <div className={styles.container}>
            <div className={styles.MainHead}>Order ID : 123456</div>
            <div className={styles.logisticsSection}>
                <div className={styles.logisticsCompanySection}>
                    <span className={styles.logisticsCompanyHead}>Supplier Details:</span>
                    <div className={styles.logisticsInnerSection}>
                        <span className={styles.logisticsInnerHead}>Company Name:</span>
                        <span className={styles.logisticsInnerText}>Shunyaekai Technologies</span>
                    </div>
                    <div className={styles.logisticsInnerSection}>
                        <span className={styles.logisticsInnerHead}>Company Type:</span>
                        <span className={styles.logisticsInnerText}>Distributor</span>
                    </div>
                    <div className={styles.logisticsInnerSection}>
                        <span className={styles.logisticsInnerHead}>Contact Name:</span>
                        <span className={styles.logisticsInnerText}>Shivanshi Tripathi</span>
                    </div>
                    <div className={styles.logisticsInnerSection}>
                        <span className={styles.logisticsInnerHead}>Email ID:</span>
                        <span className={styles.logisticsInnerText}>shivanshi@gmail.com</span>
                    </div>
                    <div className={styles.logisticsInnerSection}>
                        <span className={styles.logisticsInnerHead}>Phone No:</span>
                        <span className={styles.logisticsInnerText}>+91 6265699644</span>
                    </div>
                </div>

                <div className={styles.logisticsCompanySection}>
                    <span className={styles.logisticsCompanyHead}>Buyer Details:</span>
                    <div className={styles.logisticsInnerSection}>
                        <span className={styles.logisticsInnerHead}>Company Name:</span>
                        <span className={styles.logisticsInnerText}>Shunyaekai Technologies</span>
                    </div>
                    <div className={styles.logisticsInnerSection}>
                        <span className={styles.logisticsInnerHead}>Company Type:</span>
                        <span className={styles.logisticsInnerText}>Distributor</span>
                    </div>
                    <div className={styles.logisticsInnerSection}>
                        <span className={styles.logisticsInnerHead}>Contact Name:</span>
                        <span className={styles.logisticsInnerText}>Shivam Sharma</span>
                    </div>
                    <div className={styles.logisticsInnerSection}>
                        <span className={styles.logisticsInnerHead}>Email ID:</span>
                        <span className={styles.logisticsInnerText}>shivam@gmail.com</span>
                    </div>
                    <div className={styles.logisticsInnerSection}>
                        <span className={styles.logisticsInnerHead}>Phone No:</span>
                        <span className={styles.logisticsInnerText}>+91 9340066877</span>
                    </div>
                </div>
            </div>
            {/* Start the table product details name */}
            <ProductList />
            {/* End the table product details name */}
            {/* start the logistics section */}
            <div className={styles.logisticsSection}>
                <div className={styles.logisticsDropContainer}>
                    <div className={styles.logisticsCompanySection}>
                        <span className={styles.logisticsCompanyHead}>Drop Details</span>
                        <span className={styles.logisticsText}>Shivanshi Tripathi  <span className={styles.logisticsAddress}>Home</span></span>
                        <span className={styles.logisticsText}>6265699633</span>
                        <span className={styles.logisticsText}>C-12 Birlagram Nagda</span>
                        <span className={styles.logisticsText}>India</span>
                    </div>
                    <div className={styles.logisticsAddSec}>
                        <div className={styles.logisticsAddContainer}>
                            <span className={styles.logisticsAddHead}>Mode of Transport</span>
                            <span className={styles.logisticsAddText}>Warehouse</span>
                        </div>
                        <div className={styles.logisticsAddContainer}>
                            <span className={styles.logisticsAddHead}>Extra Services</span>
                            <span className={styles.logisticsAddText}>Warehouse</span>
                        </div>
                    </div>
                </div>
                <div className={styles.logisticsDropContainer}>
                    <div className={styles.logisticsCompanySection}>
                        <span className={styles.logisticsCompanyHead}>Pickup Details</span>
                        <span className={styles.logisticsText}>Shivanshi Tripathi <span className={styles.logisticsAddress}>Home</span></span>
                        <span className={styles.logisticsText}>6265699633</span>
                        <span className={styles.logisticsText}>C-12 Birlagram Nagda</span>
                        <span className={styles.logisticsText}>India</span>
                    </div>
                    <div className={styles.logisticsAddSec}>
                        <div className={styles.logisticsAddContainer}>
                            <span className={styles.logisticsAddHead}>Preferred Date of Pickup</span>
                            <span className={styles.logisticsAddText}>Warehouse</span>
                        </div>
                        <div className={styles.logisticsAddContainer}>
                            <span className={styles.logisticsAddHead}>Preferred Time of Pickup</span>
                            <span className={styles.logisticsAddText}>Warehouse</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* end the logistics section */}

            {/* start the package details */}
            <div className={styles.packageMainContainer}>
                <div className={styles.packageMainHeading}>Package Details</div>
                <div className={styles.packageConatiner}>
                    <div className={styles.packageWeight}>
                        <div className={styles.logisticsAddHead}>Package Weight</div>
                        <span className={styles.logisticsAddText}>500</span>
                    </div>
                    <div className={styles.packageDimension}>
                        <div className={styles.packageDimensionSEction}>
                            <div className={styles.logisticsAddHead}>Height</div>
                            <span className={styles.logisticsAddText}>100</span>
                        </div>
                        <div className={styles.packageDimensionSEction}>
                            <div className={styles.logisticsAddHead}>Width</div>
                            <span className={styles.logisticsAddText}>100</span>
                        </div>
                        <div className={styles.packageDimensionSEction}>
                            <div className={styles.logisticsAddHead}>Length</div>
                            <span className={styles.logisticsAddText}>50</span>
                        </div>
                    </div>
                    <div className={styles.packageWeight}>
                        <div className={styles.logisticsAddHead}>Total Volume</div>
                        <span className={styles.logisticsAddText}>1500</span>
                    </div>
                </div>
            </div>

            {/* start the logistics section */}
            <div className={styles.logisticsButtonContainer}>
                <button className={styles.logisticsAccept}>Accept </button>
                <buttton className={styles.logisticsCancel}>Cancel</buttton>
            </div>
            {/* end the package details */}
        </div>
    )
}

export default LogisticsDetails