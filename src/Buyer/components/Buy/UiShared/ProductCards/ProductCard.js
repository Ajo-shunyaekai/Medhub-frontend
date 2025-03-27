import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../../assets/images/image.png';
import PaginationComponent from '../../../SharedComponents/Pagination/pagination';
import styles from './productcard.module.css';

// Helper function to add spaces before capital letters
const formatCategory = (str) => {
    if (!str) return 'N/A';
    return str.replace(/([A-Z])/g, ' $1').trim();
};

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const ProductCard = ({ 
    medicineList, 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange,
    isSecondaryMarket = false,
    basePath = "/buyer/search-product-details"
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                {medicineList && medicineList.length > 0 && medicineList.map((medicine, index) => {
                    const firstImage = Array.isArray(medicine?.general?.image) && medicine.general.image.length > 0
                        ? `${process.env.REACT_APP_SERVER_URL}uploads/products/${medicine.general.image[0]}`
                        : Image;

                    return (
                        <div className={styles.card} key={index}>
                            <div className={styles.innerContainer}>
                                <div className={styles.imageContainer}>
                                    <img 
                                        src={firstImage} 
                                        alt={medicine?.general?.name || 'Medicine'} 
                                    />
                                </div>
                                <Link to={`${basePath}/${medicine._id}`}>
                                    <button className={styles.button}>View Details</button>
                                </Link>
                            </div>
                            <div className={styles.contentSection}>
                                <Link to={`${basePath}/${medicine._id}`}>
                                    <span className={styles.mainHeading}>
                                        {medicine?.general?.name || 'N/A'}
                                    </span>
                                </Link>
                                <div className={styles.section}>
                                    <span className={styles.head}>Category</span>
                                    <span className={styles.text}>
                                        {formatCategory(medicine?.category)}
                                    </span>
                                </div>
                                <div className={styles.section}>
                                    <span className={styles.head}>Sub Category</span>
                                    <span className={styles.text}>
                                        {medicine?.general?.form || 'N/A'}
                                    </span>
                                </div>
                                {isSecondaryMarket ? (
                                    <>
                                        <div className={styles.section}>
                                            <span className={styles.head}>Purchased On</span>
                                            <span className={styles.text}>
                                                {formatDate(medicine?.secondayMarketDetails?.purchasedOn)}
                                            </span>
                                        </div>
                                        <div className={styles.section}>
                                            <span className={styles.head}>Condition</span>
                                            <span className={styles.text}>
                                                {medicine?.secondayMarketDetails?.condition || 'N/A'}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.section}>
                                            <span className={styles.head}>Part/Model No.</span>
                                            <span className={styles.text}>
                                                {medicine?.general?.model || 'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.section}>
                                            <span className={styles.head}>Total Quantity</span>
                                            <span className={styles.text}>
                                                {medicine?.general?.quantity || 'N/A'}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className={styles.section}>
                                    <span className={styles.head}>Stock Status</span>
                                    <span className={styles.text}>
                                        {medicine?.inventoryDetails?.[0]?.stock || 'N/A'}
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

export default ProductCard;