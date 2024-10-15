import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import OrderCancel from '../../components/orders/OrderCancel'
import { postRequestWithToken } from '../../api/Requests';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';

const OngoingInquiriesList = () => {
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [modal, setModal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId)
        setModal(!modal)
    }
    const [totalOrders, setTotalOrders] = useState()

    // Alloted Order JSOn file
    const [activeOrders, setActiveOrders] = useState([
        {
            "inquiry_id": "3654646",
            "date": "12-04-2024",
            "supplier_name": "Pharmaceuticals",
            "status": "Pending"
        },

        {
            "inquiry_id": "3654444",
            "date": "12-04-2024",
            "supplier_name": "Pharmaceuticals",
            "status": "Pending"
        },
        {
            "inquiry_id": "365433",
            "date": "12-04-2024",
            "supplier_name": "Pharmaceuticals",
            "status": "Pending"
        },
        {
            "inquiry_id": "3654333",
            "date": "12-04-2024",
            "supplier_name": "Pharmaceuticals",
            "status": "Pending"
        },
    ]);


    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(5)

    const [inquiryList, setInquiryList] = useState([])
    const [totalInquiries, setTotalInquiries] = useState()

    // const indexOfLastOrder = currentPage * ordersPerPage;
    // const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    // const currentOrders = inquiryList.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const totalPages = Math.ceil(inquiryList.length / ordersPerPage);

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            filterKey : 'pending',
            pageNo: currentPage,
            pageSize: ordersPerPage,
        }

        postRequestWithToken('buyer/enquiry/enquiry-list', obj, async (response) => {
            if (response.code === 200) {
                setInquiryList(response.result.data)
                setTotalInquiries(response.result.totalItems)
            } else {
                toast(response.message, {type:'error'})
               console.log('error in order list api',response);
            }
            // setLoading(false);
        })
    }, [currentPage])

    const handleNavigate = (id) => {
        navigate(`/buyer/cancel-inquiry-list/${id}`)
      }

    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Ongoing Inquiries List</div>
                <div className="completed-order-container">
                    <div className="completed-order-container-right-2">
                        <Table responsive="xxl" className='completed-order-table-responsive'>
                            <thead>
                                <div className='completed-table-row-container m-0' style={{ backgroundColor: 'transparent' }} >
                                    < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color' >Inquiry ID</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Date</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Supplier Name	</span>
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

                                {inquiryList?.map((order, index) => (
                                    <div className='completed-table-row-container'>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order?.enquiry_id}</div>
                                        </div>

                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{moment(order?.created_at).format("DD/MM/YYYY")}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-table-order-2'>
                                            <div className='table-text-color'>{order.supplier.supplier_name}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>
                                                {/* {order.status} */}
                                                {order?.enquiry_status === 'Quotation submitted'
                            ? 'Quotation Received'
                            : order?.enquiry_status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                          }
                                         </div>
                                        </div>
                                        <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                            <Link to={`/buyer/ongoing-inquiries-details/${order.enquiry_id}`}>
                                                <div className='completed-order-table completed-order-table-view ' onClick={showModal}>
                                                    <RemoveRedEyeOutlinedIcon className="table-icon" />
                                                </div>
                                            </Link>
                                            {order?.enquiry_status === 'pending' && (
                                            <div className='completed-order-table completed-order-table-cancel' 
                                            // onClick={() => showModal(order.order_id)}
                                            onClick={() => handleNavigate(order?.enquiry_id)}
                                            >
                                                <HighlightOffIcon className="table-icon" />
                                            </div>
                                             )}
                                        </div>
                                    </div>
                                ))}
                            </tbody>
                        </Table>

                        {
                            modal === true ? <OrderCancel setModal={setModal} orderId={selectedOrderId} activeLink={'active'} /> : ''
                        }
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
                    </div>
                </div >
            </div>



        </>
    )
}

export default OngoingInquiriesList