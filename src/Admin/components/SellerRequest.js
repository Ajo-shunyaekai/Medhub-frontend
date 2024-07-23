import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/request.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const SellerRequest = () => {
    const buyerRequest = [
        {
            type: "Distributor",
            name: "Atom Pharma Pvt. Ltd.",
            origin: "India",
            license: "JGASD778",
            tax: "15FEGFEGE"
        },
        {
            type: "Manufacturer",
            name: "Atom Pharma Pvt. Ltd.",
            origin: "India",
            license: "JGASD778",
            tax: "15FEGFEGE"
        },
        {
            type: "Manufacturer",
            name: "Atom Pharma Pvt. Ltd.",
            origin: "India",
            license: "JGASD778",
            tax: "15FEGFEGE"
        },
        {
            type: "Distributor",
            name: "Atom Pharma Pvt. Ltd.",
            origin: "India",
            license: "JGASD778",
            tax: "15FEGFEGE"
        },
        {
            type: "Manufacturer",
            name: "Atom Pharma Pvt. Ltd.",
            origin: "India",
            license: "JGASD778",
            tax: "15FEGFEGE"
        },
        {
            type: "Manufacturer",
            name: "Atom Pharma Pvt. Ltd.",
            origin: "India",
            license: "JGASD778",
            tax: "15FEGFEGE"
        },
        {
            type: "Distributor",
            name: "Atom Pharma Pvt. Ltd.",
            origin: "India",
            license: "JGASD778",
            tax: "15FEGFEGE"
        },
        {
            type: "Manufacturer",
            name: "Atom Pharma Pvt. Ltd.",
            origin: "India",
            license: "JGASD778",
            tax: "15FEGFEGE"
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = buyerRequest.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className={styles['rejected-main-container']}>
                <div className={styles['rejected-main-head']}>Seller Request</div>
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
                                {currentOrders?.map((request, index) => (
                                    <div className={styles['rejected-table-row-container']} key={index}>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                            <div className={styles['rejected-table-text-color']}>{request.type}</div>
                                        </div>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                            <div className={styles['rejected-table-text-color']}>{request.name}</div>
                                        </div>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                            <div className={styles['table-text-color']}>{request.origin}</div>
                                        </div>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-2']}`}>
                                            <div className={styles['rejected-table-text-color']}>{request.license}</div>
                                        </div>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-order-1']}`}>
                                            <div className={styles['rejected-table-text-color']}>{request.tax}</div>
                                        </div>
                                        <div className={`${styles['rejected-table-row-item']} ${styles['rejected-table-btn']} ${styles['rejected-table-order-1']}`}>
                                            <Link to='/order-details'>
                                                <div className={`${styles['rejected-table']} ${styles['rejected-table-view']}`}><RemoveRedEyeOutlinedIcon className={styles["table-icon"]} /></div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </tbody>
                        </Table>
                        <div className={styles['rejected-pagi-container']}>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={buyerRequest.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass={styles["page-item"]}
                                linkClass={styles["page-link"]}
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className={styles['rejected-pagi-total']}>
                                <div>Total Items: {buyerRequest.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SellerRequest;