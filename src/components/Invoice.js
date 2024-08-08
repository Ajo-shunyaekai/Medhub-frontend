import React, { useEffect, useState } from 'react';
import styles from '../style/invoice.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PendingInvoice from '../components/invoice/PendingInvoice';
import PaidInvoice from '../components/invoice/CompleteInvoice';
import OngoingInvoice from '../components/invoice/OngoingInvoice';
import { postRequestWithToken } from '../api/Requests';
import ProformaInvoice from './invoice/ProformaInvoice';

const Invoice = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(0);
    const [invoiceList, setInvoiceList] = useState([]);
    const [totalInvoices, setTotalInvoices] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const invoicesPerPage = 2;

    useEffect(() => {
        const getActiveLinkFromPath = (path) => {
            switch (path) {
                case '/buyer/invoice/pending':
                    return 0;
                case '/buyer/invoice/paid':
                    return 1;
                    case '/buyer/invoice/proforma':
                        return 2;
                    
                default:
                    return 0;
            }
        };

        setActiveIndex(getActiveLinkFromPath(location.pathname));
    }, [location.pathname]);

    useEffect(() => {
             const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        navigate("/buyer/login");
        return;
        }
        const filterKey = activeIndex === 0 ? 'pending' : activeIndex === 1 ? 'completed' : 'active';
        const obj = {
            buyer_id  : buyerIdSessionStorage || buyerIdLocalStorage,
            filterKey : filterKey,
            page_no   : currentPage, 
            limit     : invoicesPerPage,
        }

        postRequestWithToken('buyer/order/buyer-invoice-list', obj, async (response) => {
            if (response.code === 200) {
                setInvoiceList(response.result.data)
                // setTotalOrders(response.result.totalItems)
            } else {
               console.log('error in invoice list api',response);
            }
          })
    }, [activeIndex, currentPage]);

    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'pending':
                setActiveIndex(0);
                navigate('/buyer/invoice/pending');
                break;
            case 'paid':
                setActiveIndex(1);
                navigate('/buyer/invoice/paid');
                break;
                case 'active':
                setActiveIndex(2);
                navigate('/buyer/invoice/proforma');
                break;
                
            default:
                setActiveIndex(0);
                navigate('/buyer/invoice/pending');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className={styles['invoice-container']}>
                <div className={styles['complete-container-invoice-section']}>
                    <div className={styles['complete-conatiner-head']}>Invoices</div>
                    
                </div>
                <div className={styles['invoice-wrapper']}>
                    <div className={styles['invoice-wrapper-left']}>
                        <div
                            onClick={() => handleLinkClick('pending')}
                            className={`${activeIndex === 0 ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div>Pending Invoices</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('paid')}
                            className={`${activeIndex === 1 ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div>Paid Invoices</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('active')}
                            className={`${activeIndex === 2 ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div>Proforma Invoices</div>
                        </div>
                    </div>
                    <div className={styles['invoice-wrapper-right']}>
                        {activeIndex === 0 && 
                        <PendingInvoice 
                        invoiceList={invoiceList} 
                        currentPage = {currentPage} 
                        totalInvoices = {totalInvoices}
                        invoicesPerPage    = {invoicesPerPage}
                        handlePageChange = {handlePageChange}
                        />}
                        {activeIndex === 1 && 
                        <PaidInvoice 
                        invoiceList={invoiceList} 
                        currentPage = {currentPage} 
                        totalInvoices = {totalInvoices}
                        invoicesPerPage    = {invoicesPerPage}
                        handlePageChange = {handlePageChange}
                        />}
                         {activeIndex === 2 && 
                        <ProformaInvoice 
                        invoiceList={invoiceList} 
                        currentPage = {currentPage} 
                        totalInvoices = {totalInvoices}
                        invoicesPerPage    = {invoicesPerPage}
                        handlePageChange = {handlePageChange}
                        />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Invoice;
