import React, { useEffect, useState } from 'react';
import styles from './mysupplier.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../SharedComponents/Loader/Loader';
import { toast } from 'react-toastify';
import PaginationComponent from '../SharedComponents/Pagination/pagination';

const MySupplier = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [mySuppliers, setMySuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState();
    const itemsPerPage = 4;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            pageNo: currentPage,
            pageSize: itemsPerPage
        }
        postRequestWithToken('buyer/my-supplier-list', obj, async (response) => {
            if (response.code === 200) {
                setMySuppliers(response.result.data)
                setTotalItems(response.result.totalItems)
            } else {
                toast(response.message, { type: 'error' })
            }
            setLoading(false);
        })
    }, [currentPage])

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.mySupplierMainContainer}>
                    <div className={styles.mySupplierMainHead}>My Supplier</div>
                    <div className={styles.mySupplierMainSection}>
                        {mySuppliers.length > 0 ? (
                            mySuppliers.map((supplier, i) => {
                                return (
                                    <div className={styles.mySupplierCardSection} key={i}>
                                        <div className={styles.mySupplierCardFirstUpparSection}>
                                            <div className={styles.mySupplierImageSection}>
                                                <img src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplier?.supplier_details?.supplier_image[0]}`} alt='Supplier' />
                                            </div>
                                        </div>
                                        <div className={styles.mySupplierCardContentSection}>
                                            <div className={styles.mySupplierNameHead}>{supplier?.supplier_details?.supplier_name}</div>
                                            {/* <div className='mysupplier-description'>License No: {supplier?.supplier_details?.license_no || 'LIC-097342'}</div> */}
                                            
                                            <div className={styles.mySupplierCardFirstSection}>
                                                <div className={styles.mySupplierInnerCardSection}>
                                                    <div className={styles.mySupplierCardHeading}>Company Type</div>
                                                    <div className={styles.mySupplierCardText}>{supplier?.supplier_details?.supplier_type}</div>
                                                </div>
                                                <div className={styles.mySupplierInnerCardSection}>
                                                    <div className={styles.mySupplierCardHeading}>Country of Origin</div>
                                                    <div className={styles.mySupplierCardText}>{supplier?.supplier_details?.country_of_origin || 'United Arab Emirates'}</div>
                                                </div>
                                                <div className={styles.mySupplierInnerCardSection}>
                                                    <div className={styles.mySupplierCardHeading}>GST/VAT Registration Number</div>
                                                    <div className={styles.mySupplierCardText}>{supplier?.supplier_details?.tax_no}</div>
                                                </div>
                                                
                                            </div>
                                        </div>

                                        <div className={styles.mySupplierCardButton}>
                                            <Link to={`/buyer/supplier-details/${supplier?.supplier_details?.supplier_id}`}>
                                                <div className={styles.mySupplierCardButtonDetails}>View Details</div>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                            ) : (
                            <div className={styles.mySupplierError}>
                                No suppliers found
                            </div>
                        )}
                    </div>
                    {mySuppliers && mySuppliers.length > 0 && (
                        <PaginationComponent
                            activePage={currentPage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={totalItems}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                        />
                    )}
                </div >
            )}
        </>
    )
}

export default MySupplier;


{/* {mySuppliers.length > 0 && (
<div className={styles.mySupplierPaginationSectionMain}>
    <div className={styles.pagiContainer}>
        <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={totalItems}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass={styles.pageItem}
            linkClass={styles.pageLink}
            prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
            nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
            hideFirstLastPages={true}
        />
        <div className={styles.pagiTotal}>
            Total Items: {totalItems}
        </div>
    </div>
</div>
)} */}