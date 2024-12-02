import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../../api/Requests';
import Loader from '../../../components/Loader';

const TotalApprovedRequest = () => {

    const navigate = useNavigate()
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");


    const [loading, setLoading]             = useState(true);
    const [requestList, setRequestList]     = useState([])
    const [totalRequests, setTotalRequests] = useState()
    const [currentPage, setCurrentPage]     = useState(1);
    const listPerPage = 5;

    // const indexOfLastOrder = currentPage * ordersPerPage;
    // const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    // const currentOrders = requestSection.slice(indexOfFirstOrder, indexOfLastOrder);
    
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

        postRequestWithToken('admin/get-buyer-supplier-aprroved-reg-req-list', obj, async (response) => {
            if (response.code === 200) {
                setRequestList(response.result.data)
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
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Total Approved Request List</div>
                <div className="completed-order-container">
                    <div className="completed-order-container-right-2">
                        <Table responsive="xxl" className='completed-order-table-responsive'>
                            <thead>
                                <div className='completed-table-row-container m-0' style={{ backgroundColor: 'transparent' }} >
                                < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color' >Registration Type</span>
                                    </div>
                                    < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color' >Company Type</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Company Name</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Country of Origin	</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Company License No.</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Company Tax No.</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Action</span>
                                    </div>

                                </div>
                            </thead>

                            <tbody className='bordered'>
                            {requestList?.length > 0 ? (
                                    requestList.map((request, index) => (
                                    <div className='completed-table-row-container'>
                                         <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{request.registration_type}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{request.buyer_type || request.supplier_type}</div>
                                        </div>

                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{request.buyer_name || request.supplier_name}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-table-order-2'>
                                            <div className='table-text-color'>{request.country_of_origin}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{request.license_no}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{request.tax_no}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                            <Link 
                                              to={
                                                request.registration_type === 'Buyer' 
                                                ? `/admin/buyer-details/${request.buyer_id}` 
                                                : `/admin/supplier-details/${request.supplier_id}`
                                            }
                                            >
                                                <div className='completed-order-table completed-order-table-view '><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                            </Link>
                                        </div>
                                    </div>
                                 ))
                                ) : (
                                    <div class="pending-products-no-orders">No data available</div>
                                )}
                            </tbody>
                        </Table>
                        <div className='completed-pagi-container'>
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
                            <div className='completed-pagi-total'>
                                <div className='completed-pagi-total'>
                                    Total Items: {totalRequests}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
           )}
        </>
    )
}

export default TotalApprovedRequest