import React from 'react'
import styles from '../../style/pendingInvoice.css';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { Link } from 'react-router-dom';
const OngoingInvoice = () => {
    return (
        <div className='pending-invo-container' >
            <div className='table-responsive mh-2 50'>
                <table className="table table-theme table-row v-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr>
                            <th className="text-muted invoice-th">Invoice ID</th>
                            <th className="text-muted invoice-th">Product Name</th>
                            <th className="text-muted invoice-th">Payment Amount</th>
                            <th className="text-muted invoice-th">Payment Type</th>
                            <th className="text-muted invoice-th">Status</th>
                            <th className="text-muted invoice-th">Action</th>
                        </tr>
                    </thead>
                    <tbody className='pending-invoies-tbody-section'>
                        <tr data-id="9" className='table-row v-middle'>
                            <td>
                                <span className="item-title">18452025</span>
                            </td>
                            <td>
                                <span className="item-title">Paracetamol</span>
                            </td>
                            <td>
                                <div className="mx-0">
                                    <span className="item-title text-color">2748 USD</span>
                                </div>
                            </td>

                            <td className="flex">
                                <span className="item-title text-color">Cash on delivery</span>
                            </td>
                            <td className="flex">
                                <span className="item-title text-color">Pending</span>
                            </td>
                            <td>
                                <div className='invoice-details-button-row'>
                                    <Link to='#'>
                                        <div className='invoice-details-button-column'>
                                            <VisibilityOutlinedIcon className='invoice-view' />
                                        </div>
                                    </Link>
                                    <div className='invoice-details-button-column-download'>
                                        <CloudDownloadOutlinedIcon className='invoice-view' />
                                    </div>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                    <tbody className='pending-invoies-tbody-section'>
                        <tr data-id="9" className='table-row v-middle'>
                            <td>
                                <span className="item-title">18452025</span>
                            </td>
                            <td>
                                <span className="item-title">Paracetamol</span>
                            </td>
                            <td>
                                <div className="mx-0">
                                    <span className="item-title text-color">2748 USD</span>
                                </div>
                            </td>

                            <td className="flex">
                                <span className="item-title text-color">Cash on delivery</span>
                            </td>
                            <td className="flex">
                                <span className="item-title text-color">Pending</span>
                            </td>
                            <td>
                                <div className='invoice-details-button-row'>
                                    <Link to='#'>
                                        <div className='invoice-details-button-column'>
                                            <VisibilityOutlinedIcon className='invoice-view' />
                                        </div>
                                    </Link>
                                    <div className='invoice-details-button-column-download'>
                                        <CloudDownloadOutlinedIcon className='invoice-view' />
                                    </div>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                    <tbody className='pending-invoies-tbody-section'>
                        <tr data-id="9" className='table-row v-middle'>
                            <td>
                                <span className="item-title">18452025</span>
                            </td>
                            <td>
                                <span className="item-title">Paracetamol</span>
                            </td>
                            <td>
                                <div className="mx-0">
                                    <span className="item-title text-color">2748 USD</span>
                                </div>
                            </td>

                            <td className="flex">
                                <span className="item-title text-color">Cash on delivery</span>
                            </td>
                            <td className="flex">
                                <span className="item-title text-color">Pending</span>
                            </td>
                            <td>
                                <div className='invoice-details-button-row'>
                                    <Link to='#'>
                                        <div className='invoice-details-button-column'>
                                            <VisibilityOutlinedIcon className='invoice-view' />
                                        </div>
                                    </Link>
                                    <div className='invoice-details-button-column-download'>
                                        <CloudDownloadOutlinedIcon className='invoice-view' />
                                    </div>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                    <tbody className='pending-invoies-tbody-section'>
                        <tr data-id="9" className='table-row v-middle'>
                            <td>
                                <span className="item-title">18452025</span>
                            </td>
                            <td>
                                <span className="item-title">Paracetamol</span>
                            </td>
                            <td>
                                <div className="mx-0">
                                    <span className="item-title text-color">2748 USD</span>
                                </div>
                            </td>

                            <td className="flex">
                                <span className="item-title text-color">Cash on delivery</span>
                            </td>
                            <td className="flex">
                                <span className="item-title text-color">Pending</span>
                            </td>
                            <td>
                                <div className='invoice-details-button-row'>
                                    <Link to='#'>
                                        <div className='invoice-details-button-column'>
                                            <VisibilityOutlinedIcon className='invoice-view' />
                                        </div>
                                    </Link>
                                    <div className='invoice-details-button-column-download'>
                                        <CloudDownloadOutlinedIcon className='invoice-view' />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OngoingInvoice
