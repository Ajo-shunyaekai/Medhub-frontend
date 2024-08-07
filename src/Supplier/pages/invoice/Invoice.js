

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styles from '../../style/invoice.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PendingInvoice from '../invoice/PendingInvoice';
import PaidInvoice from '../invoice/CompleteInvoice'; 
import { postRequestWithToken } from '../../api/Requests';
import ProformaList from './ProformaList';

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
                case '/supplier/invoice/pending':
                    return 0;
                case '/supplier/invoice/paid':
                    return 1;
                    case '/supplier/invoice/proforma':
                        return 2;                   
                default:
                    return 0;
            }
        };

        setActiveIndex(getActiveLinkFromPath(location.pathname));
    }, [location.pathname]);

    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        navigate("/supplier/login");
        return;
        }
        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            filterKey: activeIndex === 0 ? 'pending' : 'completed',
            page_no: currentPage,
            limit: invoicesPerPage,
        };

        postRequestWithToken('supplier/order/supplier-invoice-list', obj, async (response) => {
            if (response.code === 200) {
                setInvoiceList(response.result.data);
                setTotalInvoices(response.result.totalItems)
                // setTotalOrders(response.result.totalItems)
            } else {
                console.log('error in invoice list api', response);
            }
        });
    }, [activeIndex, currentPage]);

    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'pending':
                setActiveIndex(0);
                navigate('/supplier/invoice/pending');
                break;
            case 'paid':
                setActiveIndex(1);
                navigate('/supplier/invoice/paid');
                break;
                case 'proforma':
                    setActiveIndex(2);
                    navigate('/supplier/invoice/proforma');
                    break;
                
            default:
                setActiveIndex(0);
                navigate('/supplier/invoice/pending');
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
                {activeIndex === 0 && (
                    <Link to='/supplier/create-invoice'>
                        <div className={styles['complete-conatiner-create-invoice']}>Create Invoice</div>
                    </Link>
                )}
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
                        onClick={() => handleLinkClick('proforma')}
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
                    currentPage={currentPage} 
                    totalInvoices={totalInvoices}
                    invoicesPerPage={invoicesPerPage}
                    handlePageChange={handlePageChange}
                    />}
                    {activeIndex === 1 && 
                    <PaidInvoice 
                    invoiceList={invoiceList} 
                    currentPage={currentPage} 
                    totalInvoices={totalInvoices}
                    invoicesPerPage={invoicesPerPage}
                    handlePageChange={handlePageChange}
                    />}
                    {activeIndex === 2 && 
                    <ProformaList 
                    invoiceList={invoiceList} 
                    currentPage={currentPage} 
                    totalInvoices={totalInvoices}
                    invoicesPerPage={invoicesPerPage}
                    handlePageChange={handlePageChange}
                    />}
                </div>
            </div>
        </div>
        </>
    );
};

export default Invoice;

