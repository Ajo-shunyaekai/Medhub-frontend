import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../../api/Requests';
import moment from 'moment/moment';
import Loader from '../../../components/Loader';

const TotalPO = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const [loading, setLoading]         = useState(true);
    const [list, setList]               = useState([]);
    const [totalList, setTotalList]     = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 5;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const fetchData = () => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }

        const obj = {
            admin_id    : adminIdSessionStorage || adminIdLocalStorage,
            pageNo      : currentPage,
            pageSize    : listPerPage,
            filterValue : filterValue,
        };

            obj.status = 'active';  
            postRequestWithToken('admin/get-po-list', obj, (response) => {
                if (response.code === 200) {
                    setList(response.result.data);
                    setTotalList(response.result.totalItems);
                } else {
                    console.log('Error fetching PO list', response);
                }
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]); 
    
    return (
        <>
         { loading ? (
                     <Loader />
            ) : (
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Total Purchased Orders</div>
                <div className="completed-order-container">
                    <div className="completed-order-container-right-2">
                        <Table responsive="xxl" className='completed-order-table-responsive'>
                            <thead>
                                <div className='completed-table-row-container m-0' style={{ backgroundColor: 'transparent' }} >
                                {/* < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color'>Registration Type</span>
                                    </div> */}
                                    < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color'>PO ID</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Inquiry ID</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>PO Date</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Status</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Action</span>
                                    </div>

                                </div>
                            </thead>

                            <tbody className='bordered'>
                            {list?.length > 0 ? (
                                list.map((po, index) => (
                                    <div className='completed-table-row-container'>
                                        {/* <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{po.registration_type}</div>
                                        </div> */}
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{po.purchaseOrder_id}</div>
                                        </div>

                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{po.enquiry_id}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-table-order-2'>
                                            <div className='table-text-color'>{moment(po.created_at).format("DD/MM/YYYY")}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>
                                            {po?.po_status ? po?.po_status.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : ''}
                                            </div>
                                        </div>
                                        <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                            <Link to={`/admin/buyer-purchased-order-details/${po.purchaseOrder_id}`}>
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
                                totalItemsCount={totalList}
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
                                    Total Items: {totalList}
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

export default TotalPO






