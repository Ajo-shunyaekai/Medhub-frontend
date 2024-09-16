import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../../api/Requests';

const RejectedOrders = () => {
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
    const ordersPerPage = 5;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = rejectedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [sellerList, setSellerList]     = useState([])
    const [totalSellers, setTotalSellers] = useState()
    const listPerPage = 5

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

        postRequestWithToken('admin/get-supplier-list', obj, async (response) => {
            if (response.code === 200) {
                setSellerList(response.result.data)
                setTotalSellers(response.result.totalItems)
            } else {
               console.log('error in order list api',response);
            }
          })
    },[])

    return (
        <>
            <div className='rejected-main-container'>
                <div className="rejected-main-head">Rejected Seller</div>
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
                                {sellerList?.map((supplier, index) => (
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
                                ))}
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
        </>
    );
}

export default RejectedOrders;
