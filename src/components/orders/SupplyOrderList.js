import React from 'react'
import '../../style/supplierdetails.css'
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment/moment';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


const SupplyOrderList = ({ orderList, totalOrders, currentPage, ordersPerPage, handleOrderPageChange }) => {

    return (
        <div className="supply-card-body">
            <div>
                {/* <div className="table-assign-supply-heading">Order List</div> */}
            </div>
            <div className='supply-order-list-main-section'>
                <table className="supply-table">
                    {
                        orderList && orderList.length > 0 ?
                            <thead className='supply-details-thead-section'>
                                <tr>
                                    <td className='supply-tdss'>Order ID</td>
                                    <td className='supply-tdss'>Date</td>
                                    <td className='supply-tdss'>Status</td>
                                    <td className='supply-button-tdss'>Action</td>

                                </tr>

                            </thead> : ''
                    }


                    <tbody className='supply-table-tbody'>
                        {
                            orderList && orderList.length > 0 ? (
                                orderList?.map((order, i) => {
                                    const totalQuantity = order.items.reduce((total, item) => {
                                        return total + item.quantity;
                                    }, 0);
                                    const orderedDate = moment(order.created_at).format("DD/MM/YYYY")
                                    return (
                                        <tr className='supply-table-tr'>
                                            <td className='supply-td'>
                                                <div className="table-supply-section-content">
                                                    <span className="table-g-supply-text">{order.order_id || 'ORD-8723RD213fd'}</span>
                                                </div>
                                            </td>
                                            <td className='supply-td' >
                                                <div className="table-supply-section-content">
                                                    <span className="table-g-supply-text">{orderedDate || '22/05/2024'}</span>
                                                </div>
                                            </td>
                                            <td className='supply-td'>
                                                <div className="table-supply-section-content">
                                                    <span className="table-g-supply-text">{order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1) || 'Pending'}</span>
                                                </div>
                                            </td>
                                            <td className='supply-button-td'>
                                                <div className="table-supply-section-content">
                                                    <Link to={`/buyer/order-details/${order.order_id || `ORD-8723RD213fd`}`}>
                                                        <div className='table-supply-section-view'>
                                                            <RemoveRedEyeOutlinedIcon className='table-supply-section-eye' />
                                                        </div>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) :
                                (
                                    <div className='no-data-container'>
                                        <div className='no-data-message'>No data available</div>
                                    </div>
                                )
                        }


                    </tbody>
                </table>
            </div>
            <div className='pagi-container'>
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={totalOrders}
                    pageRangeDisplayed={5}
                    onChange={handleOrderPageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                    nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                    hideFirstLastPages={true}
                />
                <div className='pagi-total'>
                    Total Items: {totalOrders}
                </div>
            </div>
        </div>
    )
}
export default SupplyOrderList