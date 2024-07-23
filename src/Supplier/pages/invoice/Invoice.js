// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import styles from '../../style/invoice.module.css';
// import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
// import PendingInvoice from '../invoice/PendingInvoice';
// import PaidInvoice from '../invoice/CompleteInvoice';
// import { Link } from 'react-router-dom';
// import { postRequestWithToken } from '../../api/Requests';


// const Invoice = () => {

//     const location = useLocation();
//     const navigate = useNavigate();

//     const [activeIndex, setActiveIndex] = useState(0);

//     const getActiveLinkFromPath = (path) => {
//         switch (path) {
//             case '/invoice/pending':
//                 return 'pending';
//             case '/invoice/paid':
//                 return 'paid';
//             default:
//                 return 'pending';
//         }
//     };

//     const activeLink = getActiveLinkFromPath(location.pathname);
   

//     const handleLinkClick = (link) => {
//         switch (link) {
//             case 'pending':
//                 setActiveIndex(0)
//                 navigate('/invoice/pending');
//                 break;
//             case 'paid':
//                 setActiveIndex(1)
//                 navigate('/invoice/paid');
//                 break;
//             default:
//                 navigate('/invoice/pending');
//         }
//     };

    
    
//     const headings = ['Pending Invoices', 'Paid Invoices'];

//     const handleItemClick = (index) => {
//         setActiveIndex(index);
//     };

//     const [invoiceList, setInvoiceList] = useState([])
//     const [totalInvoices, setTotalInvoices] = useState()
//     const [currentPage, setCurrentPage] = useState(1);
//     const invoicesPerPage = 1;

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     useEffect(() => {
//         const obj = {
//             buyer_id: "BYR-jmn98sdanx",
//             filterKey: activeIndex === 0 ? 'pending' : activeIndex === 1 ? 'completed' : '',
//             page_no: currentPage,
//             limit: invoicesPerPage,
//         }

//         postRequestWithToken('supplier/order/supplier-invoice-list', obj, async (response) => {
//             if (response.code === 200) {
//                 setInvoiceList(response.result.data)
//                 // setTotalOrders(response.result.totalItems)
//             } else {
//                 console.log('error in invoice list api', response);
//             }
//         })
//     }, [activeIndex])

//     return (
//         <>
//             <div className={styles[`invoice-container`]}>
//                 <div className={styles['complete-container-invoice-section']}>
//                     <div className={styles['complete-conatiner-head']}>Invoices</div>
//                     <Link to='/create-invoice'>
//                         <div className={styles['complete-conatiner-create-invoice']}>Create Invoice</div>
//                     </Link>
//                 </div>
                
//                 <div className={styles[`invoice-wrapper`]}>
//                 <div className={styles[`invoice-wrapper-left`]}>
//                         <div
//                             onClick={() => handleLinkClick('pending')}
//                             className={`${activeLink === 'pending' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
//                         >
//                             <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
//                             <div>Pending Invoices</div>
//                         </div>
//                         <div
//                             onClick={() => handleLinkClick('paid')}
//                             className={`${activeLink === 'paid' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
//                         >
//                             <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
//                             <div>Paid Invoices</div>
//                         </div>
//                     </div>
//                     <div className={styles[`invoice-wrapper-right`]}>
//                         {activeLink === 'pending' && <PendingInvoice invoiceList={invoiceList}/>}
//                         {activeLink === 'paid' && <PaidInvoice invoiceList={invoiceList}/>}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Invoice;


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styles from '../../style/invoice.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PendingInvoice from '../invoice/PendingInvoice';
import PaidInvoice from '../invoice/CompleteInvoice';
import { postRequestWithToken } from '../../api/Requests';

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
                    <Link to='/supplier/create-invoice'>
                        <div className={styles['complete-conatiner-create-invoice']}>Create Invoice</div>
                    </Link>
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default Invoice;

