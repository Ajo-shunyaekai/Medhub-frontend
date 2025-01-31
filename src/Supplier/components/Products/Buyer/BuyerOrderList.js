import React from 'react'
import '../buyerdetails.css'
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment/moment';

const BuyerOrderList = ({orderList, totalOrders, currentPage, ordersPerPage, handleOrderPageChange}) => {
    const orders = [
        { id: 'PR1234567', price: '588 USD', quantity: 100 },
        { id: 'PR1234568', price: '700 USD', quantity: 50 },
        { id: 'PR1234569', price: '1200 USD', quantity: 200 },
        { id: 'PR1234570', price: '300 USD', quantity: 150 },
    ];

    return (
        <div className="supply-card-body">
            <div>
                <div className="table-assign-supply-heading">Order List</div>
            </div>
            <div className='supply-order-list-main-section'>
                <table className="supply-table">
                    <thead className='supply-details-thead-section'>
                        <tr>
                            <td className='supply-tdss'>Order ID</td>
                            <td className='supply-tdss'>Date</td>
                            <td className='supply-tdss'>Quantity</td>
                            <td className='supply-button-tdss'>Action</td>
                        </tr>
                    </thead>
                    <tbody className='supply-table-tbody'>
                        {/* {orders.map((order, index) => ( */}
                        {
                            orderList && orderList.length > 0 ? (
                            orderList?.map((order,i) => {
                                const totalQuantity = order.items.reduce((total, item) => {
                                    return total + item.quantity || item.quantity_required;
                                  }, 0);
                                  const orderedDate = moment(order.created_at).format("DD/MM/YYYY")
                                return (
                            <tr className='supply-table-tr' key={i}>
                                <td className='supply-td'>
                                    <div className="table-supply-section-content">
                                        <span className="table-g-supply-text">{order.order_id}</span>
                                    </div>
                                </td>
                                <td className='supply-td'>
                                    <div className="table-supply-section-content">
                                        <span className="table-g-supply-text">{orderedDate}</span>
                                    </div>
                                </td>
                                <td className='supply-td'>
                                    <div className="table-supply-section-content">
                                        <span className="table-g-supply-text">{totalQuantity || 100}</span>
                                    </div>
                                </td>
                                <td className='supply-button-td'>
                                    <div className="table-supply-section-content">
                                        <Link to={`/supplier/active-orders-details/${order.order_id }`}>
                                            <div className='table-supply-section-view'>
                                                <RemoveRedEyeOutlinedIcon className='table-supply-section-eye' />
                                            </div>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                             )
                            }) 
                            ) : 'no orders'
                        }
                        {/* ))} */}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BuyerOrderList
