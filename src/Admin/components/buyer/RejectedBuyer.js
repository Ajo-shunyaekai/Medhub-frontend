import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../../api/Requests';

const RejectedBuyer = () => {
    const rejectedOrders = [
        {
            reject_id: "000001",
            reject_name: "Atom Pharma Pvt. Ltd.",
            reject_mobile: "9869589",
            reject_email: "atom.pharma@gmail.com",
            reject_status: "Rejected"
        },
        {
            reject_id: "000002",
            reject_name: "Atom Pharma Pvt. Ltd.",
            reject_mobile: "9869589",
            reject_email: "atom.pharma@gmail.com",
            reject_status: "Rejected"
        },
        {
            reject_id: "000003",
            reject_name: "Atom Pharma Pvt. Ltd.",
            reject_mobile: "9869589",
            reject_email: "atom.pharma@gmail.com",
            reject_status: "Rejected"
        },
        {
            reject_id: "000004",
            reject_name: "Atom Pharma Pvt. Ltd.",
            reject_mobile: "9869589",
            reject_email: "atom.pharma@gmail.com",
            reject_status: "Rejected"
        },
        {
            reject_id: "000005",
            reject_name: "Atom Pharma Pvt. Ltd.",
            reject_mobile: "9869589",
            reject_email: "atom.pharma@gmail.com",
            reject_status: "Rejected"
        },
        {
            reject_id: "000006",
            reject_name: "Atom Pharma Pvt. Ltd.",
            reject_mobile: "9869589",
            reject_email: "atom.pharma@gmail.com",
            reject_status: "Rejected"
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = rejectedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [buyerList, setBuyerList]     = useState([])
    const [totalBuyers, setTotalBuyers] = useState()
    const listPerPage = 2

    useEffect(() => {
        // const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        // const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        // if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        // navigate("/admin/login");
        // return;
        // }
        const obj = {
            admin_id  : 'ADM-b9c743706ae7',
            filterKey : 'rejected',
            pageNo    : currentPage, 
            pageSize  : listPerPage,
        }

        postRequestWithToken('admin/get-buyer-list', obj, async (response) => {
            if (response.code === 200) {
                setBuyerList(response.result.data)
                setTotalBuyers(response.result.totalItems)
            } else {
               console.log('error in get-buyer-list list api',response);
            }
          })
    },[currentPage])

    return (
        <>
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
                                {buyerList?.map((buyer, index) => (
                                    <div className='rejected-table-row-container' key={index}>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{buyer.buyer_id}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{buyer.buyer_name}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='table-text-color'>{buyer.buyer_mobile}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-2'>
                                            <div className='rejected-table-text-color'>{buyer.buyer_email}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{buyer.account_status ? (buyer.account_status === 1 ? 'accepted' : (buyer.account_status === 2 ? 'rejected' : 'pending')) : ''}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-btn rejected-table-order-1'>
                                            <Link to='/admin/order-details'>
                                                <div className='rejected-table rejected-table-view'><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
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
        </>
    );
}

export default RejectedBuyer;
