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

const RejectedBuyer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [loading, setLoading]         = useState(true);
    const [buyerList, setBuyerList]     = useState([])
    const [totalBuyers, setTotalBuyers] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 2

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }
        const obj = {
            admin_id    : adminIdSessionStorage || adminIdLocalStorage,
            filterKey   : 'rejected',
            filterValue : filterValue,
            pageNo      : currentPage, 
            pageSize    : listPerPage,
        }

        postRequestWithToken('admin/get-buyer-list', obj, async (response) => {
            if (response.code === 200) {
                setBuyerList(response.result.data)
                setTotalBuyers(response.result.totalItems)
            } else {
               console.log('error in get-buyer-list list api',response);
            }
            setLoading(false);
        })
    },[currentPage])

    return (
        <>
        {loading ? (
                     <Loader />
                ) : (
            <div className='rejected-main-container'>
                <div className="rejected-main-head">Rejected Buyer</div>
                <div className="rejected-container">
                    <div className="rejected-container-right-2">
                        <Table responsive="xxl" className='rejected-table-responsive'>
                            <thead>
                                <div className='rejected-table-row-container' style={{ backgroundColor: 'transparent' }}>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Buyer ID</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Buyer Name</span>
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
                            {buyerList?.length > 0 ? (
                                buyerList.map((buyer, index) => (
                                    <div className='rejected-table-row-container' key={index}>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <div className='rejected-table-text-color'>{buyer.buyer_id}</div>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <div className='rejected-table-text-color'>{buyer.buyer_name}</div>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <div className='table-text-color'>{buyer.buyer_country_code} {buyer.buyer_mobile || 'Not Provided'}</div>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-2'>
                                        <div className='rejected-table-text-color'>{buyer.buyer_email || 'Not Provided'}</div>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <div className='rejected-table-text-color'>
                                        {buyer.account_status 
                                            ? (buyer.account_status === 1 ? 'Accepted' 
                                            : (buyer.account_status === 2 ? 'Rejected' : 'Pending'))
                                            : 'Status Unknown'
                                        }
                                        </div>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-btn rejected-table-order-1'>
                                        <Link to={`/admin/buyer-details/${buyer.buyer_id}`}>
                                        <div className='rejected-table rejected-table-view'>
                                            <RemoveRedEyeOutlinedIcon className="table-icon" />
                                        </div>
                                        </Link>
                                    </div>
                                    </div>
                                ))
                                ) : (
                                    <div class="pending-products-no-orders">No data available</div>
                                )}

                            </tbody>
                        </Table>
                        <div className='rejected-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={listPerPage}
                                totalItemsCount={totalBuyers}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='rejected-pagi-total'>
                                <div>Total Items: {totalBuyers}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default RejectedBuyer;
