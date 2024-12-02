import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/dashboardorder.css'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postRequestWithToken } from '../../api/Requests';
import moment from 'moment/moment';
import OrderCancel from '../OrderCancel';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

const InquiryRequestList = () => {
    const navigate = useNavigate()

    const [show, setShow] = useState(false);

    const [modal, setModal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId)
        setModal(!modal)
    }

    const [orderList, setOrderList] = useState([])
    const [totalOrders, setTotalOrders] = useState()
    const [currentPage, setCurrentPage] = useState(1);


    const ordersPerPage = 5;

    const [inquiryList, setInquiryList] = useState([])
    const [totalInquiries, setTotalInquiries] = useState()

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }

        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            filterKey: 'completed',
            pageNo: currentPage,
            pageSize: ordersPerPage,
        }

        postRequestWithToken('supplier/enquiry/enquiry-list', obj, async (response) => {
            if (response.code === 200) {
                setInquiryList(response.result.data)
                setTotalInquiries(response.result.totalItems)
            } else {
                toast(response.message, { type: 'error' })
                console.log('error in order list api', response);
            }
        })
    }, [currentPage])
    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Inquiry Request</div>
                <div className="completed-order-container">
                    <div className="completed-order-container-right-2">
                        <Table responsive="xxl" className='completed-order-table-responsive'>
                            <thead>
                                <div className='completed-table-row-container m-0' style={{ backgroundColor: 'transparent' }} >
                                    < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color' >Inquiry ID	</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Date	</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Buyer Name</span>
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
                                {inquiryList?.length > 0 ? (
                                    inquiryList.map((order, index) => (
                                        <div className='completed-table-row-container' key={index}>
                                            <div className='completed-table-row-item completed-table-order-1'>
                                                <div className='completed-table-text-color'>{order.enquiry_id}</div>
                                            </div>

                                            <div className='completed-table-row-item completed-table-order-1'>
                                                <div className='completed-table-text-color'>{moment(order?.created_at).format("DD/MM/YYYY")}</div>
                                            </div>
                                            <div className='completed-table-row-item  completed-table-order-2'>
                                                <div className='table-text-color'>{order.buyer.buyer_name}</div>
                                            </div>
                                            <div className='completed-table-row-item completed-table-order-1'>
                                                <div className='completed-table-text-color'>
                                                    {order?.enquiry_status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                </div>
                                            </div>
                                            <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                                <Link to={`/supplier/inquiry-request-details/${order.enquiry_id}`}>
                                                    <div className='completed-order-table completed-order-table-view '><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <>
                            <div className='pending-products-no-orders'>
                                No Inquiry Request
                            </div>

                        </>
                                )}
                            </tbody>

                        </Table>
                        <div className='completed-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalInquiries}
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
                                    Total Items: {totalInquiries}
                                </div>
                            </div>
                        </div>
                        {
                            modal === true ? <OrderCancel setModal={setModal} orderId={selectedOrderId} activeLink={'completed'} /> : ''
                        }
                    </div>
                </div>
            </div>



        </>
    )
}

export default InquiryRequestList