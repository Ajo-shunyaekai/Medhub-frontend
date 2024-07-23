import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../style/sellersupport.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PendingInvoice from './PendingInvoice'
import PaidInvoice from './PaidInvoice' 
import { postRequestWithToken } from '../../api/Requests';

const SellerInvoice = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/seller-invoice/paid':
                return 'paid';
            case '/admin/seller-invoice/pending':
                return 'pending';
            default:
                return 'paid';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'paid':
                navigate('/admin/seller-invoice/paid');
                break;
            case 'pending':
                navigate('/admin/seller-invoice/pending');
                break;
            default:
                navigate('/admin/seller-invoice/paid');
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [invoiceList, setInvoiceList] = useState()
    const [totalItems, setTotalItems]   = useState()
    const listPerPage     = 2;

    useEffect(() => {
        // const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        // const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        // if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        // navigate("/admin/login");
        // return;
        // }
        const filterKey = activeLink === 'paid' ? 'completed' : 'pending';
        const obj = {
            admin_id    : 'ADM-b9c743706ae7',
            filterKey   : filterKey,
            supportType : activeLink,
            pageNo      : currentPage, 
            pageSize    : listPerPage,
        }

        postRequestWithToken('admin/buyer-supplier-invoices-list', obj, async (response) => {
            if (response.code === 200) {
                setInvoiceList(response.result.data)
                setTotalItems(response.result.totalItems)
            } else {
               console.log('error in buyer-supplier-invoices-list api',response);
            }
        })
    },[currentPage, activeLink])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <>
            <div className={styles[`invoice-container`]}>
                <div className={styles['complete-container-invoice-section']}>
                    <div className={styles['complete-conatiner-head']}>Invoices</div>
                </div>
                <div className={styles[`invoice-wrapper`]}>
                    <div className={styles[`invoice-wrapper-left`]}>
                        <div
                            onClick={() => handleLinkClick('paid')}
                            className={`${activeLink === 'paid' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div>Paid Invoices</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('pending')}
                            className={`${activeLink === 'pending' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div>Pending Invoices</div>
                        </div>
                    </div>
                    <div className={styles[`invoice-wrapper-right`]}>
                        {activeLink === 'paid' && 
                        <PaidInvoice 
                           invoiceList = {invoiceList}
                           totalItems = {totalItems}
                           currentPage = {currentPage}
                           listPerPage = {listPerPage}
                           handlePageChange = {handlePageChange}
                        />}
                        {activeLink === 'pending' && 
                        <PendingInvoice  
                            invoiceList = {invoiceList}
                            totalItems = {totalItems}
                            currentPage = {currentPage}
                            listPerPage = {listPerPage}
                            handlePageChange = {handlePageChange}
                        />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SellerInvoice;
