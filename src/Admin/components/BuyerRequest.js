import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../style/request.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../api/Requests';
import Loader from '../../components/Loader';

const BuyerRequest = () => {
    const navigate = useNavigate()
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");
    
    const [loading, setLoading]                   = useState(true);
    const [buyerRequestList, setBuyerRequestList] = useState([])
    const [totalRequests, setTotalRequests]       = useState()
    const [currentPage, setCurrentPage]           = useState(1);
    const listPerPage = 5;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }
        const obj = {
            admin_id    : adminIdSessionStorage || adminIdLocalStorage ,
            filterKey   : 'pending',
            filterValue : filterValue,
            pageNo      : currentPage, 
            pageSize    : listPerPage,
        }

        postRequestWithToken('admin/get-buyer-reg-req-list', obj, async (response) => {
            if (response.code === 200) {
                setBuyerRequestList(response.result.data)
                setTotalRequests(response.result.totalItems)
            } else {
               console.log('error in get-buyer-reg-req-list api',response);
            }
            setLoading(false);
        })
    },[currentPage])

    return (
        <>
         { loading ? (
                     <Loader />
                ) : (
            <div className={styles['rejected-main-container']}>
                <div className={styles['rejected-main-head']}>Buyer Request</div>
                <div className={styles['rejected-container']}>
                    <div className={styles['rejected-container-right-2']}>
                        <Table responsive="xxl" className={styles['rejected-table-responsive']}>
                            <thead>
                                <div className={styles['rejected-table-row-container']} style={{ backgroundColor: 'transparent' }}>
                                    <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                        <span className={styles['rejected-header-text-color']}>Company Type</span>
                                    </div>
                                    <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                        <span className={styles['rejected-header-text-color']}>Company Name</span>
                                    </div>
                                    <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                        <span className={styles['rejected-header-text-color']}>Country of Origin</span>
                                    </div>
                                    <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-2']}`}>
                                        <span className={styles['rejected-header-text-color']}>Company License No</span>
                                    </div>
                                    <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                        <span className={styles['rejected-header-text-color']}>Company Tax No.</span>
                                    </div>
                                    <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                        <span className={styles['rejected-header-text-color']}>Action</span>
                                    </div>
                                </div>
                            </thead>
                            <tbody className={styles.bordered}>
                            {buyerRequestList?.length > 0 ? (
                                    buyerRequestList?.map((buyer, index) => (
                                        <div className={styles['rejected-table-row-container']} key={index}>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                            <div className={styles['rejected-table-text-color']}>{buyer.buyer_type}</div>
                                        </div>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                            <div className={styles['rejected-table-text-color']}>{buyer.buyer_name}</div>
                                        </div>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                            <div className={styles['table-text-color']}>{buyer.country_of_origin}</div>
                                        </div>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-2']}`}>
                                            <div className={styles['rejected-table-text-color']}>{buyer.license_no}</div>
                                        </div>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                            <div className={styles['rejected-table-text-color']}>{buyer.tax_no}</div>
                                        </div>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-btn']} ${styles['rejected-table-order-1']}`}>
                                            <Link to={`/admin/buyer-request-details/${buyer.buyer_id}`}>
                                            <div className={`${styles['rejected-table']} ${styles['rejected-table-view']}`}>
                                                <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                                            </div>
                                            </Link>
                                        </div>
                                        </div>
                                    ))
                                    ) : (
                                        <>
                                        <div className='pending-products-no-orders'>
                                            No Data Available
                                        </div>
                                    </>
                                    )}

                            </tbody>
                        </Table>
                        <div className={styles['rejected-pagi-container']}>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={listPerPage}
                                totalItemsCount={totalRequests}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                               itemClass="page-item"
                                    linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className={styles['rejected-pagi-total']}>
                                <div>Total Items: {totalRequests}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default BuyerRequest;
