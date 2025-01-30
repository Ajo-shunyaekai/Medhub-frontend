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


const SupplierPending = () => {
    const { supplierId } = useParams()
    const navigate        = useNavigate()

    const [activeOrders, setActiveOrders] = useState([
        {
            "order_id": "3654646",
            "order_datetime": "12/02/2024",
            "order_quantity": "20 Ton",
            "order_price": "$2000",
            "status": "Pending"
        },
        {
            "order_id": "000002",
            "order_datetime": "20/02/2024",
            "order_quantity": "15 Ton",
            "order_price": "$1500",
            "status": "Pending"
        },
        {
            "order_id": "000003",
            "order_datetime": "20/02/2024",
            "order_quantity": "25 Ton",
            "order_price": "$2500",
            "status": "Pending"
        },
        {
            "order_id": "000004",
            "order_datetime": "20/02/2024",
            "order_quantity": "30 Ton",
            "order_price": "$3000",
            "status": "Pending"
        },
    ]);

    const [orderList, setOrderList] = useState([])
    const [totalOrders, setTotalOrders] = useState()

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 1;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = activeOrders.slice(indexOfFirstOrder, indexOfFirstOrder + ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id    : buyerIdSessionStorage || buyerIdLocalStorage,
            supplier_id : supplierId,
            order_type  : 'pending',
            pageNo      : currentPage,
            pageSize    : ordersPerPage
        }

        postRequestWithToken('buyer/buyer-supplier-orders', obj, async (response) => {
            if (response.code === 200) {
                setOrderList(response.result.orderList)
                setTotalOrders(response.result.totalOrders)
            } else {
               console.log('error in buyer-supplier-orders  api');
            }
          })
    }, [currentPage])

    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Pending Orders</div>
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
                                    <th className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Price</span>
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
                                {/* {currentOrders.map((order, index) => (
                                    <tr className='completed-table-row-container' key={index}>
                                        <td className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.order_id}</div>
                                        </td>
                                        <td className='completed-table-row-item completed-table-order-2'>
                                            <div className='completed-table-text-color'>{order.order_datetime}</div>
                                        </td>
                                        <td className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.order_quantity}</div>
                                        </td>
                                        <td className='completed-table-row-item completed-table-order-2'>
                                            <div className='completed-table-text-color'>{order.order_price}</div>
                                        </td>
                                        <td className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.status}</div>
                                        </td>
                                        <td className='completed-table-row-item completed-order-table-btn completed-table-order-1'>
                                           <Link to='/order-details/8734543'>
                                                <div className='completed-order-table completed-order-table-view'>
                                                    <RemoveRedEyeOutlinedIcon className="table-icon" />
                                                </div>
                                            </Link>
                                        </td>
                                    </tr>
                                ))} */}
                                {
                                    orderList?.map((order, i) => {
                                        const totalQuantity = order.items.reduce((total, item) => {
                                            return total + item.quantity;
                                          }, 0);
                                          
                                          const totalPrice = order.items.reduce((price, item) => {
                                            const itemPrice = parseFloat(item.price.match(/[\d.]+/)[0]);
                                            return price + itemPrice;
                                          }, 0);

                                          const orderedDate = moment(order.created_at).format("DD/MM/YYYY")
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
                                                <td className='completed-table-row-item completed-table-order-2'>
                                                    <div className='completed-table-text-color'>{totalPrice || '500 USD'} USD</div>
                                                </td>
                                                <td className='completed-table-row-item completed-table-order-1'>
                                                    <div className='completed-table-text-color'>{order.order_status}</div>
                                                </td>
                                                <td className='completed-table-row-item completed-order-table-btn completed-table-order-1'>
                                                    <Link to={`/buyer/pending-details/${order.order_id}`}>
                                                        <div className='completed-order-table completed-order-table-view'>
                                                            <RemoveRedEyeOutlinedIcon className="table-icon" />
                                                        </div>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <div className='completed-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                // totalItemsCount={activeOrders.length}
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
                                {/* Total Items: {activeOrders.length} */}
                                Total Items: {totalOrders}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SupplierPending;
