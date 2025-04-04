import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../../assets/style/sellersupport.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BuyerPending from './pending/BuyerPending';
import BuyerPaid from './paid/BuyerPaid';
import { postRequestWithToken } from '../../../api/Requests';
import BuyerProforma from './proforma/BuyerProforma';
import Loader from '../../shared-components/Loader/Loader';
import { apiRequests } from '../../../../api';

const SellerInvoice = () => {
    const location = useLocation();
    const navigate = useNavigate();
 
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");
 
    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/buyer-invoice/paid':
                return 'paid';
            case '/admin/buyer-invoice/pending':
                return 'pending';
                case '/admin/buyer-invoice/proforma':
                    return 'proforma';
            default:
                return 'paid';
        }
    };
 
    const activeLink = getActiveLinkFromPath(location.pathname);
 
    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'paid':
                navigate('/admin/buyer-invoice/paid');
                break;
            case 'pending':
                navigate('/admin/buyer-invoice/pending');
                break;
                case 'proforma':
                    navigate('/admin/buyer-invoice/proforma');
                    break;
            default:
                navigate('/admin/buyer-invoice/paid');
        }
    };
 
    const [loading, setLoading]         = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [invoiceList, setInvoiceList] = useState()
    const [totalItems, setTotalItems]   = useState()
    const listPerPage     = 5;
 
    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }
 
        const filterKey = activeLink === 'paid' ? 'paid' : 'pending';
        const obj = {
            admin_id    : adminIdSessionStorage || adminIdLocalStorage,
            filterKey   : filterKey,
            pageNo      : currentPage, 
            pageSize    : listPerPage,
            page_no      : currentPage, 
            page_size    : listPerPage,
        }
 
        if (activeLink === 'paid' || activeLink === 'pending') {
            obj.filterKey = activeLink;
            const fetchInvoiceList = async () => {
                try {
                    const response = await apiRequests.getRequest(`order/get-all-invoice-list?filterKey=${filterKey}&pageNo=${currentPage}&pageSize=${listPerPage}`)
                    if(response?.code!==200){
                        return
                    }
                    
                    setInvoiceList(response.result.data);
                    setTotalItems(response.result.totalItems);
                    // postRequestWithToken(`order/get-all-invoice-list?filterKey=${filterKey}&pageNo=${currentPage}&pageSize=${listPerPage}`, obj, async (response) => {
                    //     if (response.code == 200) {
                    //         setInvoiceList(response.result.data);
                    //         setTotalItems(response.result.totalItems);
                    //     }
                    // })
                } catch (error) {
                    
                } finally {
                    setLoading(false);
                }
            }
            fetchInvoiceList()
            // postRequestWithToken('admin/get-invoice-list', obj, async (response) => {
            //     if (response.code === 200) {
            //         setInvoiceList(response.result.data);
            //         setTotalItems(response.result.totalItems);
            //     } else {
            //     }
                // setLoading(false);
            // });
        } else if (activeLink === 'proforma') {
            // Call a different API for 'proforma' invoices
            obj.filterKey = 'active'
            postRequestWithToken('admin/buyer-order-list', obj, async (response) => {
                if (response.code === 200) {
                    setInvoiceList(response.result.data);
                    setTotalItems(response.result.totalItems);
                } else {
                }
                setLoading(false);
            });
        }
    },[currentPage, activeLink])
 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }
    return (
        <>
        {loading ? (
                     <Loader />
                ) : (
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
                            <div className={styles.invoiceHead}>Paid Invoices</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('pending')}
                            className={`${activeLink === 'pending' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div className={styles.invoiceHead}>Pending Invoices</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('proforma')}
                            className={`${activeLink === 'proforma' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div className={styles.invoiceHead}>Proforma Invoices</div>
                        </div>

                        
                    </div>
                    <div className={styles[`invoice-wrapper-right`]}>
                        {activeLink === 'paid' && 
                        <BuyerPaid
                            invoiceList = {invoiceList}
                            totalItems = {totalItems}
                            currentPage = {currentPage}
                            listPerPage = {listPerPage}
                            handlePageChange = {handlePageChange}
                        />}
                        {activeLink === 'pending' && 
                        <BuyerPending
                            invoiceList = {invoiceList}
                            totalItems = {totalItems}
                            currentPage = {currentPage}
                            listPerPage = {listPerPage}
                            handlePageChange = {handlePageChange}
                        />}
                         {activeLink === 'proforma' && 
                        <BuyerProforma
                            invoiceList = {invoiceList}
                            totalItems = {totalItems}
                            currentPage = {currentPage}
                            listPerPage = {listPerPage}
                            handlePageChange = {handlePageChange}
                        />}
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default SellerInvoice;
