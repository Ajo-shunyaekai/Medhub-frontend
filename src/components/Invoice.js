import React, { useEffect, useState } from 'react';
import styles from '../style/invoice.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PendingInvoice from '../components/invoice/PendingInvoice';
import PaidInvoice from '../components/invoice/CompleteInvoice';
import OngoingInvoice from '../components/invoice/OngoingInvoice';
import { postRequestWithToken } from '../api/Requests';


const Invoice = () => {
    // const location = useLocation();
    // const navigate = useNavigate()

    // const [activeIndex, setActiveIndex] = useState(0);

    // const headings = ['Pending Invoices', 'Paid Invoices'];

    // const handleItemClick = (index) => {
    //     setActiveIndex(index);
    // };

    // // const getActiveLinkFromPath = (path) => {
    // //     switch (path) {
    // //         case '/invoice/pending':
    // //             return 'pending';
    // //         case '/invoice/paid':
    // //             return 'paid';
    // //         default:
    // //             return 'pending';
    // //     }
    // // };

    

    // const handleLinkClick = (link) => {
    //     switch (link) {
    //         case 'pending':
    //             navigate('/invoice/pending');
    //             break;
    //         case 'paid':
    //             navigate('/invoice/paid');
    //             break;
    //         default:
    //             navigate('/invoice/pending');
    //     }
    // };
    // useEffect(() => {
    //     const getActiveLinkFromPath = (path) => {
    //         switch (path) {
    //             case '/invoice/pending':
    //                 return 0;
    //             case '/invoice/paid':
    //                 return 1;
    //             default:
    //                 return 0;
    //         }
    //     };

    //     setActiveIndex(getActiveLinkFromPath(location.pathname));
    // }, [location.pathname]);

    // const activeLink = getActiveLinkFromPath(location.pathname);

    // const [invoiceList, setInvoiceList] = useState([])
    // const [totalInvoices, setTotalInvoices] = useState()
    // const [currentPage, setCurrentPage] = useState(1); 
    // const invoicesPerPage = 1;

    // const handlePageChange = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };

    // useEffect(() => {
    //     const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    //     const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

    //     if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
    //     navigate("/login");
    //     return;
    //     }

    //     const obj = {
    //         buyer_id  : buyerIdSessionStorage || buyerIdLocalStorage,
    //         filterKey : activeIndex === 0 ? 'pending' : activeIndex === 1 ? 'completed' : '',
    //         page_no   : currentPage, 
    //         limit     : invoicesPerPage,
    //     }

    //     postRequestWithToken('buyer/order/buyer-invoice-list', obj, async (response) => {
    //         if (response.code === 200) {
    //             setInvoiceList(response.result.data)
    //             // setTotalOrders(response.result.totalItems)
    //         } else {
    //            console.log('error in invoice list api',response);
    //         }
    //       })
    // },[activeIndex])


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

        const obj = {
            buyer_id  : buyerIdSessionStorage || buyerIdLocalStorage,
            filterKey : activeIndex === 0 ? 'pending' : activeIndex === 1 ? 'completed' : '',
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
            {/* <div className={styles[`invoice-container`]}>
                <div className={styles['complete-conatiner-head']}>Invoices</div>
                
                <div className={styles[`invoice-wrapper`]}>
                    <div className={styles[`invoice-wrapper-left`]}>
                        <div
                            onClick={() => handleLinkClick('pending')}
                            className={`${activeLink === 'pending' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div>Pending Invoices</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('paid')}
                            className={`${activeLink === 'paid' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div>Paid Invoices</div>
                        </div>
                    </div>
                    <div className={styles[`invoice-wrapper-right`]}>
                        {activeLink === 'pending' && <PendingInvoice />}
                        {activeLink === 'paid' && <PaidInvoice />}
                    </div>
                </div>
            </div> */}

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
}

export default Invoice;
