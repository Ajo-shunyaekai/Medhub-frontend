import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../assets/images/image.png';
import PaginationComponent from '../../SharedComponents/Pagination/pagination';
import styles from './medicinecard.module.css';

const SupplierMedicineCard = ({ 
    medicineList, 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange,
    isSecondaryMarket = false
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                {medicineList && medicineList.length > 0 && medicineList.map((medicine, index) => {
                    const firstImage = Array.isArray(medicine?.general?.image) && medicine.general.image.length > 0
                        ? `${process.env.REACT_APP_SERVER_URL}uploads/products/${medicine.general.image[0]}`
                        : Image;

                    // Extract only the required fields
                    const supplierName = medicine?.userDetails?.supplier_name || 'N/A';
                    const productName = medicine?.general?.name || "N/A";
                    const costPerProduct = medicine?.inventoryDetails[0]?.inventoryList?.price || 'N/A';
                    const totalQuantity = medicine?.general?.quantity || 'N/A';
                    const estimatedDeliveryTime = medicine?.inventoryDetails[0]?.inventoryList?.deliveryTime || 'N/A';
                    const stockStatus = medicine?.inventoryDetails[0]?.stock || 'N/A';

                    return (
                        <div className={styles.card} key={index}>
                            <div className={styles.innerContainer}>
                                <div className={styles.imageContainer}>
                                    <img 
                                        src={firstImage} 
                                        alt="Product" 
                                    />
                                </div>
                                <Link to={`/buyer/product-details/${medicine._id}`}>
                                    <button className={styles.button}>View Details</button>
                                </Link>
                            </div>
                            <div className={styles.contentSection}>
                                <div className={styles.section}>
                                    <span className={styles.head}>Supplier Name</span>
                                    <span className={styles.text}>
                                        {supplierName}
                                    </span>
                                </div>
                                <div className={styles.section}>
                                    <span className={styles.head}>Product Name</span>
                                    <span className={styles.text}>
                                        {productName}
                                    </span>
                                </div>
                                <div className={styles.section}>
                                    <span className={styles.head}>Cost Per Product</span>
                                    <span className={styles.text}>
                                        {costPerProduct !== 'N/A' ? `$${costPerProduct}` : 'N/A'}
                                    </span>
                                </div>
                                <div className={styles.section}>
                                    <span className={styles.head}>Total Quantity</span>
                                    <span className={styles.text}>
                                        {totalQuantity}
                                    </span>
                                </div>
                                <div className={styles.section}>
                                    <span className={styles.head}>Est. Delivery Time</span>
                                    <span className={styles.text}>
                                        {estimatedDeliveryTime !== 'N/A' ? `${estimatedDeliveryTime} Days` : 'N/A'}
                                    </span>
                                </div>
                                <div className={styles.section}>
                                    <span className={styles.head}>Stock Status</span>
                                    <span className={styles.text}>
                                        {stockStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {(!medicineList || medicineList.length === 0) && (
                    <div className={styles.noData}>No data found</div>
                )}
            </div>
            {totalItems > itemsPerPage && (
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={totalItems}
                    pageRangeDisplayed={5}
                    onChange={onPageChange}
                />
            )}
        </div>
    );
};

export default SupplierMedicineCard;