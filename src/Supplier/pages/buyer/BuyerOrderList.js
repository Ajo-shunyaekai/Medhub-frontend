import React from 'react'
import buyerdetails from '../../style/buyerdetails.css'
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

const BuyerOrderList = () => {
    const orders = [
        { id: 'PR1234567', price: '588 AED', quantity: 100 },
        { id: 'PR1234568', price: '700 AED', quantity: 50 },
        { id: 'PR1234569', price: '1200 AED', quantity: 200 },
        { id: 'PR1234570', price: '300 AED', quantity: 150 },
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
                            <td className='supply-tdss'>Price</td>
                            <td className='supply-tdss'>Quantity</td>
                            <td className='supply-button-tdss'>Action</td>
                        </tr>
                    </thead>
                    <tbody className='supply-table-tbody'>
                        {orders.map((order, index) => (
                            <tr className='supply-table-tr' key={index}>
                                <td className='supply-td'>
                                    <div className="table-supply-section-content">
                                        <span className="table-g-supply-text">{order.id}</span>
                                    </div>
                                </td>
                                <td className='supply-td'>
                                    <div className="table-supply-section-content">
                                        <span className="table-g-supply-text">{order.price}</span>
                                    </div>
                                </td>
                                <td className='supply-td'>
                                    <div className="table-supply-section-content">
                                        <span className="table-g-supply-text">{order.quantity}</span>
                                    </div>
                                </td>
                                <td className='supply-button-td'>
                                    <div className="table-supply-section-content">
                                        <Link to='/supplier/active-orders-details'>
                                            <div className='table-supply-section-view'>
                                                <RemoveRedEyeOutlinedIcon className='table-supply-section-eye' />
                                            </div>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BuyerOrderList
