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
import { apiRequests } from '../../../api';


const ApprovedSeller = () => {
    const navigate = useNavigate()
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage     = 5;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [loading, setLoading]           = useState(true);
    const [sellerList, setSellerList]     = useState([])
    const [totalSellers, setTotalSellers] = useState()
    const listPerPage = 5

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!adminIdSessionStorage && !adminIdLocalStorage) {
                    navigate("/admin/login");
                    return;
                }
                const obj = {
                    admin_id    : adminIdSessionStorage || adminIdLocalStorage ,
                    filterKey   : 'accepted',
                    filterValue : filterValue,
                    pageNo      : currentPage, 
                    pageSize    : listPerPage,
                }
        
                // postRequestWithToken('admin/get-supplier-list', obj, async (response) => {
                //     if (response.code === 200) {
                //         setSellerList(response.result.data)
                //         setTotalSellers(response.result.totalItems)
                //     } else {
                //        console.log('error in order list api',response);
                //     }
                //     setLoading(false);
                // })
                // const response = await apiRequests.postRequest(`supplier/get-all-suppliers-list`, obj);
                // if (response?.code !== 200) {
                //     console.log('error in supplier list api',response);
                //     return;
                // }
                // setSellerList(response.result.data)
                // setTotalSellers(response.result.totalItems)
                postRequestWithToken('supplier/get-all-suppliers-list', obj, async (response) => {
                    if (response.code === 200) {
                        setSellerList(response.result.data)
                        setTotalSellers(response.result.totalItems)
                    } else {
                       console.log('error in order list api',response);
                    }
                })
            } catch (error) {
                console.log(error)
            } finally{
                setLoading(false);
            }
        }
        fetchData()
    },[currentPage])


    return (
        <>
        { loading ? (
                     <Loader />
                ) : (
            <div className='rejected-main-container'>
              <div className="rejected-main-head">Approved Seller</div>
                <div className="rejected-container">
                    <div className="rejected-container-right-2">
                        <Table responsive="xxl" className='rejected-table-responsive'>
                            <thead>
                                <div className='rejected-table-row-container' style={{ backgroundColor: 'transparent' }}>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Supplier ID</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Supplier Name</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Mobile No.</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-2'>
                                        <span className='rejected-header-text-color'>Email ID</span>
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
                                {/* {sellerList?.map((supplier, index) => ( */}
                                {sellerList?.length > 0 ? (
                                    sellerList?.map((supplier, index) => (
                                    <div className='rejected-table-row-container' key={index}>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{supplier.supplier_id}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{supplier.supplier_name}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='table-text-color'>{supplier.supplier_country_code} {supplier.supplier_mobile}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-2'>
                                            <div className='rejected-table-text-color'>{supplier.supplier_email}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{supplier.account_status ? (supplier.account_status === 1 ? 'Accepted' : (supplier.account_status === 2 ? 'Rejected' : 'Pending')) : ''}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-btn rejected-table-order-1'>
                                            <Link to={`/admin/supplier-details/${supplier.supplier_id}`}>
                                                <div className='rejected-table rejected-table-view'><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                            </Link>
                                        </div>
                                    </div>
                                // ))}
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
                                totalItemsCount={totalSellers}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='rejected-pagi-total'>
                                <div>Total Items: {totalSellers}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default ApprovedSeller;


