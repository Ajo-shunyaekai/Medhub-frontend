import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import './suppliercomplatedorder.css';
import { postRequestWithToken } from '../../../api/Requests';
import moment from 'moment/moment';

const SupplierActive = () => {
    const { supplierId } = useParams();
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState([]);
    const [totalOrders, setTotalOrders] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            supplier_id: supplierId,
            order_type: 'active',
            pageNo: currentPage,
            pageSize: ordersPerPage,
        };

        postRequestWithToken('/buyer/buyer-supplier-orders', obj, async (response) => {
            if (response.code === 200) {
                setOrderList(response.result.orderList);
                setTotalOrders(response.result.totalOrders);
            } else {
                console.log('Error in buyer-supplier-orders API');
            }
        });
    }, [currentPage]);

    return (
        <div className='completed-order-main-container'>
            <div className="completed-order-main-head">Active Orders</div>
            <div className="completed-order-container">
                <div className="completed-order-container-right-2">
                    <Table responsive="xxl" className='completed-order-table-responsive'>
                        <thead>
                            <tr className='completed-table-row-container m-0' style={{ backgroundColor: 'transparent' }}>
                                <th className='table-row-item table-order-1'>
                                    <span className='completed-header-text-color'>Order ID</span>
                                </th>
                                <th className='completed-table-row-item completed-table-order-2'>
                                    <span className='completed-header-text-color'>Date</span>
                                </th>
                                <th className='completed-table-row-item completed-table-order-1'>
                                    <span className='completed-header-text-color'>Quantity</span>
                                </th>
                                <th className='completed-table-row-item completed-table-order-1'>
                                    <span className='completed-header-text-color'>Status</span>
                                </th>
                                <th className='completed-table-row-item completed-table-order-1'>
                                    <span className='completed-header-text-color'>Action</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bordered'>
                            {orderList.length > 0 ? (
                                orderList.map((order, i) => {
                                    const totalQuantity = order.items.reduce((total, item) => {
                                        return total + (item.quantity_required || item.quantity);
                                    }, 0);

                                    const orderedDate = moment(order.created_at).format("DD/MM/YYYY");
                                    return (
                                        <tr className='completed-table-row-container' key={i}>
                                            <td className='completed-table-row-item completed-table-order-1'>
                                                <div className='completed-table-text-color'>{order.order_id}</div>
                                            </td>
                                            <td className='completed-table-row-item completed-table-order-2'>
                                                <div className='completed-table-text-color'>{orderedDate}</div>
                                            </td>
                                            <td className='completed-table-row-item completed-table-order-1'>
                                                <div className='completed-table-text-color'>{totalQuantity}</div>
                                            </td>
                                            <td className='completed-table-row-item completed-table-order-1'>
                                                <div className='completed-table-text-color'>{order.status}</div>
                                            </td>
                                            <td className='completed-table-row-item completed-order-table-btn completed-table-order-1'>
                                                <Link to={`/buyer/order-details/${order.order_id}`}>
                                                    <div className='completed-order-table completed-order-table-view'>
                                                        <RemoveRedEyeOutlinedIcon className="table-icon" />
                                                    </div>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" class="pending-products-no-orders">
                                        No Data Available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {orderList.length > 0 && (
                        <div className='completed-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalOrders}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='completed-pagi-total'>
                                Total Items: {totalOrders}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupplierActive;
