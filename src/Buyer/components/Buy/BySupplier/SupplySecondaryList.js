import React, { useState, useEffect } from 'react';
import styles from './supplierdetails.module.css';
import { Link } from 'react-router-dom';
import PaginationComponent from '../../SharedComponents/Pagination/pagination';

const SupplySecondaryList = ({ productsData, totalProducts, currentPage, productsPerPage, handleProductPageChange }) => {
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const formatCategory = (str) => {
    return str.replace(/([A-Z])/g, ' $1').trim();
  };
  const handleResize = () => {
    setItemsPerPage(4);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.mainCardsContainer}>
        {productsData?.length > 0 ? (
          productsData?.map((product, i) => {
            const firstImage = Array.isArray(product?.general?.image) ? product.general?.image[0] : null;
            const linkTo = `/buyer/product-details/${product._id}`
            return (
              <div key={product.id} className={styles.productCont}>
                <div className={styles.imgCont}>
                  <img
                    src={`${process.env.REACT_APP_SERVER_URL}uploads/products/${firstImage}`}
                    alt='Product'
                  />
                </div>
                <div className={styles.rightCont}>
                  <div className={styles.title}>{product?.general?.name}</div>
                  <div className={styles.infoCont}>
                    <div className={styles.infoChild}>
                      <div className={styles.infoSection}>
                        <div className={styles.label}>Category</div>
                        <div className={styles.value}>{formatCategory(product?.category)}</div>
                      </div>
                      <div className={styles.infoSection}>
                        <div className={styles.label}>Sub Category</div>
                        <div className={styles.value}>{product?.categoryObject.subCategory}</div>
                      </div>
                      <div className={styles.infoSection}>
                        <div className={styles.label}>Total Quantity</div>
                        <div className={styles.value}>{product.general?.quantity}</div>
                      </div>
                      <div className={styles.infoSection}>
                        <div className={styles.label}>Stock Status</div>
                        <div className={styles.value}>{product.inventoryDetails[0]?.stock}</div>
                      </div>



                    </div>

                  </div>
                </div>

                <Link to={linkTo}>
                  <div className={styles.btnCont}>
                    <span className={styles.btnText}>View Details</span>
                  </div>
                </Link>
              </div>
            )
          })
        ) : (
          <div className={styles.noDataCont}>
            <div className={styles.noDataMsg}>No data available</div>
          </div>
        )}
      </div>
      {productsData && productsData.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={productsPerPage}
          totalItemsCount={totalProducts}
          pageRangeDisplayed={5}
          onChange={handleProductPageChange}
        />
      )}
    </div>
  );
};

export default SupplySecondaryList;
