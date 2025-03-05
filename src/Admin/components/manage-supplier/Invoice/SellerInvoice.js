import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../../assets/style/sellersupport.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PendingInvoice from './Pending/PendingInvoice'
import PaidInvoice from './Paid/PaidInvoice' 
import { postRequestWithToken } from '../../../api/Requests';
import SellerProformaInvoice from './Proforma/SellerProformaInvoice';
import Loader from '../../shared-components/Loader/Loader';
import { apiRequests } from '../../../../api';


const SellerInvoice = () => {
    const location = useLocation();
    const navigate = useNavigate();
 
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");
 
    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/supplier-invoice/paid':
                return 'paid';
            case '/admin/supplier-invoice/pending':
                return 'pending';
            case '/admin/supplier-invoice/proforma':
                return 'proforma';
            default:
                return 'paid';
        }
    };
 
    const activeLink = getActiveLinkFromPath(location.pathname);
 
    const handleLinkClick = (link) => {
        setCurrentPage(1);
        switch (link) {
            case 'paid':
                navigate('/admin/supplier-invoice/paid');
                break;
            case 'pending':
                navigate('/admin/supplier-invoice/pending');
                break;
            case 'proforma':
                navigate('/admin/supplier-invoice/proforma');
                break;
            default:
                navigate('/admin/supplier-invoice/paid');
        }
    };
 
    const [loading, setLoading]         = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [invoiceList, setInvoiceList] = useState([]);
    const [totalItems, setTotalItems]   = useState(0);
    const listPerPage = 5;
 
    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }
 
        const obj = {
            admin_id    : adminIdSessionStorage || adminIdLocalStorage,
            pageNo      : currentPage, 
            pageSize    : listPerPage,
            page_no      : currentPage, 
            page_size    : listPerPage,
        };
 
        if (activeLink === 'paid' || activeLink === 'pending') {
            obj.filterKey = activeLink;
            const fetchInvoiceList = async () => {
                try {
                    const response = await apiRequests.getRequest(`order/get-all-invoice-list?pageNo=${currentPage}&pageSize=${listPerPage}&filterKey=${activeLink}`)
                    if(response?.code!==200){
                        console.log('error in invoice list api', response);
                        return
                    }
                    
                    setInvoiceList(response.result.data);
                    setTotalItems(response.result.totalItems);
                    // postRequestWithToken(`order/get-all-invoice-list?pageNo=${currentPage}&pageSize=${listPerPage}&filterKey=${activeLink}`, obj, async (response) => {
                    //     if (response.code == 200) {
                    //         setInvoiceList(response.result.data);
                    //         setTotalItems(response.result.totalItems);
                    //     }
                    // })
                } catch (error) {
                    console.log('Error in get-invoice-list API', error);
                    
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
            //         console.log('Error in get-invoice-list API', response);
            //     }
                setLoading(false);
            // });
        } else if (activeLink === 'proforma') {
            // Call a different API for 'proforma' invoices
            obj.filterKey = 'active'
            postRequestWithToken('admin/buyer-order-list', obj, async (response) => {
                if (response.code === 200) {
                    setInvoiceList(response.result.data);
                    setTotalItems(response.result.totalItems);
                } else {
                    console.log('Error in buyer-order-list API', response);
                }
                setLoading(false);
            });
        }
    }, [currentPage, activeLink]);
 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
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
                            <PaidInvoice 
                                invoiceList={invoiceList}
                                totalItems={totalItems}
                                currentPage={currentPage}
                                listPerPage={listPerPage}
                                handlePageChange={handlePageChange}
                            />
                        }
                        {activeLink === 'pending' && 
                            <PendingInvoice  
                                invoiceList={invoiceList}
                                totalItems={totalItems}
                                currentPage={currentPage}
                                listPerPage={listPerPage}
                                handlePageChange={handlePageChange}
                            />
                        }
                        {activeLink === 'proforma' && 
                            <SellerProformaInvoice  
                                invoiceList={invoiceList}
                                totalItems={totalItems}
                                currentPage={currentPage}
                                listPerPage={listPerPage}
                                handlePageChange={handlePageChange}
                            />
                        }
                    </div>
                </div>
            </div>
            )}
        </>
    );
}


export default SellerInvoice;
