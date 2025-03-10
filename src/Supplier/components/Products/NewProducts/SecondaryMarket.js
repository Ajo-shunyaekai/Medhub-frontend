import React, { useEffect, useState } from 'react';
import styles from './product.module.css';
import './product.css'
import ProductImage from '../../../assets/images/productImage.png'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from 'react-js-pagination';
import { fetchProductsList } from "../../../../redux/reducers/productSlice";
import ADD from '../../../assets/images/plus.svg';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const NewProduct = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const totalItems = products?.length || 0;

  useEffect(() => {
    dispatch(fetchProductsList('product?market=secondary'));
  }, [dispatch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products?.slice(indexOfFirstProduct, indexOfLastProduct) || [];

  return (
    <>
      <div className={styles.container}>
        <Link to="/add-product">
          <div className={styles.mainSection}>
            <span className={styles.head}>Add a Product</span>
            <div className={styles.imgContainer}>
              <img className={styles.productIcon} src={ADD} alt='add' />
            </div>
          </div>
        </Link>

        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product._id} className={styles.mainCard}>
              <div className={styles.cardImgSection}>
                <div className={styles.cardImg}>
                  <img
                    className={styles.productImg}
                    src={product.general.image.lengßßth > 0 ? product.general.image[0] : ProductImage}
                    alt='Product Img'
                  />
                </div>
                <Link to={`/supplier/product-details/${product._id}`}>
                  <div className={styles.cardButton}>
                    View Details
                  </div>
                </Link>
              </div>
              <div className={styles.cardContentSection}>
                <div className={styles.cardMainHeading}>
                  {product.general.name || 'Unnamed Product'}
                </div>
                <div className={styles.cardInnerContainer}>
                  <span className={styles.cardHead}>Category</span>
                  <span className={styles.cardText}>
                  {product?.category
                      ?.replace(/([a-z])([A-Z])/g, "$1 $2")
                      ?.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
                </div>
                <div className={styles.cardInnerContainer}>
                  <span className={styles.cardHead}>Sub Category</span>
                  <span className={styles.cardText}>
                    {product?.[product?.category]?.subCategory || 'N/A'}
                  </span>
                </div>
                <div className={styles.cardInnerContainer}>
                  <span className={styles.cardHead}>Part/Model No.</span>
                  <span className={styles.cardText}>
                    {product.general.model || 'N/A'}
                  </span>
                </div>
                <div className={styles.cardInnerContainer}>
                  <span className={styles.cardHead}>Total Quantity</span>
                  <span className={styles.cardText}>
                    {product.general.quantity || '0'}
                  </span>
                </div>
                <div className={styles.cardInnerContainer}>
                  <span className={styles.cardHead}>Stock Status</span>
                  <span className={styles.cardText}>
                    {product.inventoryDetails?.stock || product.inventory?.stock || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noDataSection}>
            No Data Available
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div className={styles.paginationSection}>
          <div className='pagi-container'>
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={totalItems}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
              prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
              nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
              hideFirstLastPages={true}
            />
            <div className='pagi-total'>
              Total Items: {totalItems}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewProduct;