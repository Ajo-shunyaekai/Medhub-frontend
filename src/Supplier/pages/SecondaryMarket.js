import React, { useState } from 'react';
import styles from '../style/product.module.css';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MedicineOne from '../assest/paracetamol.png';

const SecondaryMarket = ({productList, currentPage, totalItems, itemsPerPage, handlePageChange}) => {

    return (
        <>
            <div className={styles['new-product-support-main-section']}>
                <div className={styles['support-container']}>
                    <Link to='/supplier/add-product' style={{ marginTop: '-24px' }}>
                        <div className={styles['support-container-text-add']}>Add a Product</div>
                        <div className={styles['support-add-card']}>
                            <div className={styles['support-add-icon-container']}>
                                <AddOutlinedIcon className={styles['support-add-icon']} />
                            </div>
                        </div>
                    </Link>

                    {
                        productList && productList.length > 0 ? (
                            productList?.map((product, i) => {
                                const firstImage = Array.isArray(product?.medicine_image) ? product.medicine_image[0] : null;
                                return (
                                    <div className='buy-product-card-section' key={i}>
                            <div className='buy-product-card-first-section-right'>
                                <div className='buy-product-card-first-medicine-image'>
                                    {/* <img src={MedicineOne} alt="Medicine" /> */}
                                    <img  src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${firstImage}`}  alt="Medicine" /> 
                                </div>
                                <div className='buy-product-card-first-button-container'>
                                    <Link to={`/supplier/secondary-product-details/${product.medicine_id}`}>
                                        <div className='buy-product-card-first-send-button'>
                                            View Details
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className='buy-product-card-first-section'>
                                <div className='buy-product-card-first-left'>
                                    <div className='buy-product-card-first-copmany-name'>{product.medicine_name}</div>
                                    <div className='buy-product-card-first-copmany-description'>{product.composition}</div>
                                </div>
                                <div className='buy-product-card-second-section'>
                                    <div className='buy-product-card-second-head'>Country of Origin</div>
                                    <div className='buy-product-card-second-text'>{product.country_of_origin}</div>
                                </div>
                                <div className='buy-product-card-second-section'>
                                    <div className='buy-product-card-second-head'>Stocked in</div>
                                    <div className='buy-product-card-second-text'>{product.stocked_in?.join(', ')}</div>
                                </div>
                                <div className='buy-product-card-second-section'>
                                    <div className='buy-product-card-second-head'>Dossier Type</div>
                                    <div className='buy-product-card-second-text'>{product.dossier_type}</div>
                                </div>
                                <div className='buy-product-card-second-section'>
                                    <div className='buy-product-card-second-head'>Dossier Status</div>
                                    <div className='buy-product-card-second-text'>{product.dossier_status}</div>
                                </div>
                                <div className='buy-product-card-second-section'>
                                    <div className='buy-product-card-second-head'>GMP Approvals</div>
                                    <div className='buy-product-card-second-text'>{product.gmp_approvals}</div>
                                </div>
                            </div>
                        </div>
                                )
                            })
                        ) : (
                            <>
                           <div className={styles['support-add-card']}>
                           <span className={styles['support-span']}>No Products Available</span>
                            </div>
                            </>
                            
                        )
                    }
                </div>
                <div className={styles['new-product-pagination-section']}>
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
                            <div className='pagi-total'>
                                Total Items: {totalItems}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SecondaryMarket