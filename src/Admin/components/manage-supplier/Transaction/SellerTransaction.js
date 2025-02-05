import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../assest/style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';

const SellerTransaction = () => {
    const navigate = useNavigate()
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const [loading, setLoading]           = useState(true);
    const [transactionList, setTransactionList] = useState([])
    const [totalList, setTotalList]           = useState()
    const [currentPage, setCurrentPage] = useState(1);
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
            admin_id  : adminIdSessionStorage || adminIdLocalStorage ,
            filterKey : 'paid',
            pageNo    : currentPage, 
            pageSize  : listPerPage,
        }

        postRequestWithToken('admin/get-transaction-list', obj, async (response) => {
            if (response.code === 200) {
                setTransactionList(response.result.data)
                setTotalList(response.result.totalItems)
            } else {
               console.log('error in transaction-list api',response);
            }
            setLoading(false);
        })
    },[currentPage])


    return (
        <>
        { loading ? (
                     <Loader />
                ) : (
            <div className='rejected-main-container'>
                <div className="rejected-main-head">Supplier Transaction List</div>
                <div className="rejected-container">
                    <div className="rejected-container-right-2">
                        <Table responsive="xxl" className='rejected-table-responsive'>
                            <thead>
                                <div className='rejected-table-row-container' style={{ backgroundColor: 'transparent' }}>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Transaction ID</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Buyer Name</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Total Amount</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-2'>
                                        <span className='rejected-header-text-color'>Payment Mode</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Status</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Action</span>
                                    </div>
                                </div>
                            </thead>
                            <tbody className='bordered'>
                                {/* {transactionList?.map((transaction, index) => ( */}
                                {transactionList?.length > 0 ? (
                                    transactionList.map((transaction, index) => (
                                    <div className='rejected-table-row-container' key={index}>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{transaction.transaction_id}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{transaction.buyer_name}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                        <div className='table-text-color'>
                                           {transaction.total_amount_paid ? `${transaction.total_amount_paid} USD` : null}
                                        </div>

                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-2'>
                                            <div className='rejected-table-text-color'>{transaction.mode_of_payment}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>
                                                {/* {transaction.status} */}
                                                {transaction?.status?.charAt(0).toUpperCase() + transaction?.status.slice(1)  }
                                            </div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-btn rejected-table-order-1'>
                                            <Link to={`/admin/supplier-transaction-details/${transaction.invoice_id}`}>
                                                <div className='rejected-table rejected-table-view'><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
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
                        <div className='rejected-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={listPerPage}
                                totalItemsCount={totalList}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='rejected-pagi-total'>
                                <div>Total Items: {totalList}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default SellerTransaction;