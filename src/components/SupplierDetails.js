import React, { useEffect, useState } from 'react';
import '../style/supplierdetails.css'
import SupplyOrderList from './orders/SupplyOrderList'
import SupplyProductList from './orders/SupplyProductList';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';

const SupplierDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { supplierId } = useParams()

    const getActiveButtonFromPath = (path) => {
        switch (path) {
            case `/buyer/supplier-details/products/${supplierId}`:
                return 'products';
            case `/buyer/supplier-details/orders/${supplierId}`:
                return 'orders';
            default:
                return 'products';
        }
    };

    const activeButton = getActiveButtonFromPath(location.pathname);

    const handleButtonClick = (button) => {
        switch (button) {
            case 'products':
                navigate(`/buyer/supplier-details/products/${supplierId}`);
                setActiveTab('products');
                break;
            case 'orders':
                navigate(`/buyer/supplier-details/orders/${supplierId}`);
                setActiveTab('orders');
                break;
            default:
                navigate(`/buyer/supply/products/${supplierId}`);
                setActiveTab('products');
        }
    };

    const [activeTab, setActiveTab] = useState('products');

    const showProducts = () => {
        setActiveTab('products');
    };

    const showOrders = () => {
        setActiveTab('orders');
    };

   

    const [supplier, setSupplier]                     = useState()

    const [buyerSupplierOrder, setBuyerSupplierOrder] = useState([])
    const [totalOrders, setTotalOrders]               = useState()
    const [currentOrderPage, setCurrentOrderPage]     = useState(1)
    const ordersPerPage                               = 2;

    const [productList, setProductList]               = useState([])
    const [totalProducts, setTotalProducts]           = useState()
    const [currentPage, setCurrentPage]               = useState(1); 
    const productsPerPage                             = 2;

    const handleProductPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleOrderPageChange = (pageNumber) => {
        setCurrentOrderPage(pageNumber);
    };
    

    //supplier-details
    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            supplier_id : supplierId,
            buyer_id    : buyerIdSessionStorage || buyerIdLocalStorage,

        }
        postRequestWithToken('buyer/supplier-details', obj, async (response) => {
            if (response.code === 200) {
                setSupplier(response.result)
            } else {
               console.log('error in supplier-details api');
            }
          })
    },[])

    //buyer-supplier-orders
    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        navigate("/buyer/login");
        return;
        }

        const fetchBuyerSupplierOrder = () => {
            const obj = {
                buyer_id    : buyerIdSessionStorage || buyerIdLocalStorage,
                supplier_id : supplierId,
                pageSize    : ordersPerPage,
                pageNo      : currentOrderPage,
                order_type  : ''
            }
    
            postRequestWithToken('buyer/buyer-supplier-orders', obj, async(response) => {
                if(response.code === 200) {
                    setBuyerSupplierOrder(response.result)
                    setTotalOrders(response.result.totalOrders)
                } else {
                    console.log('error in buyer-supplier-orders api');
                }
            })
        }
        fetchBuyerSupplierOrder()
    },[currentOrderPage])

    //supplier-product-list
    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        navigate("/buyer/login");
        return;
        }

        const obj = {
            supplier_id : supplierId,
            buyer_id    : buyerIdSessionStorage || buyerIdLocalStorage,
            pageSize    : productsPerPage,
            pageNo      : currentPage
        }

        postRequestWithToken('buyer/supplier-product-list', obj, async (response) => {
            if (response.code === 200) {
                setProductList(response.result.data)
                setTotalProducts(response.result.totalItems)
            } else {
               console.log('error in supplier-details api');
            }
          })
    },[currentPage])
    
    return (
        <>
            <div className='buyer-supplier-details-container'>
                <div className='buyer-supplier-details-inner-conatiner'>
                    <div className='buyer-supplier-details-left-inner-container'>
                        <div className='buyer-supplier-details-left-uppar-section'>
                            <div className='buyer-supplier-details-company-type-conatiner'>
                                <div className='buyer-supplier-details-left-uppar-head'>{supplier?.supplier_name || 'XYZ Pharmaceuticals'}</div>
                                <div className='buyer-supplier-details-company-type-button'>{supplier?.supplier_type || 'Manufacturer'}</div>
                            </div>
                            <div className='buyer-supplier-details-left-inner-section'>
                                    <div className='buyer-supplier-details-left-inner-sec-text'>Supplier ID: {supplier?.supplier_id || 'SUP-0987RF67R'}</div>
                                <div className='buyer-supplier-details-left-inner-img-container'>
                                    <div className='buyer-supplier-details-left-inner-mobile-button'>
                                        <PhoneInTalkOutlinedIcon className='buyer-supplier-details-left-inner-icon' />
                                        <span className='tooltip'>{supplier?.supplier_country_code || +971} {supplier?.supplier_mobile || 765765}</span>
                                    </div>
                                    <div className='buyer-supplier-details-left-inner-email-button'>
                                        <MailOutlineIcon className='buyer-supplier-details-left-inner-icon' />
                                        <span className='tooltip'>{supplier?.supplier_email || 'supplier@gmail.com'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='buyer-supplier-details-description-section'>
                            <div className='buyer-supplier-details-description-head'>Description</div>
                            <div className='buyer-supplier-details-description-content'>{supplier?.description || 'test description'}</div>
                        </div>
                        <div className='buyer-supplier-details-section'>
                        <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Contact Person Name:</div>
                                <div className='buyer-supplier-details-inner-text'>{supplier?.contact_person_name || 'Ashutosh Sharma'}</div>
                            </div>
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Designation</div>
                                <div className='buyer-supplier-details-inner-text'>{supplier?.designation || 'Marketing Manager'}</div>
                            </div>
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Email ID</div>
                                <div className='buyer-supplier-details-inner-text'>Pvt@gmail.com</div>
                            </div>
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Mobile No.</div>
                                <div className='buyer-supplier-details-inner-text'>+971 1408767</div>
                            </div>
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Address</div>
                                <div className='buyer-supplier-details-inner-text'>{supplier?.supplier_address || '476 Udyog Vihar, Phase 5, Gurgaon'}</div>
                            </div>
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>License No.</div>
                                <div className='buyer-supplier-details-inner-text'>{supplier?.license_no || 'LIC-98768732'}</div>
                            </div>
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>License Expiry Date</div>
                                <div className='buyer-supplier-details-inner-text'>{supplier?.license_expiry_date || '12-08-26'}</div>
                            </div>
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Tax No.</div>
                                <div className='buyer-supplier-details-inner-text'>5655565FDA6</div>
                            </div>
                            
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Country of Origin</div>
                                <div className='buyer-supplier-details-inner-text'>{supplier?.country_of_origin || 'United Arab Emirated'}</div>
                            </div>
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Country of Operation</div>
                                <div className='buyer-supplier-details-inner-text'>Dubai, London, Singapur</div>
                            </div>
                            
                           
                            
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Payment Terms</div>
                                <div className='buyer-supplier-details-inner-text'>{supplier?.payment_terms || 'COD, Debit'}</div>
                            </div>
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Est. Delivery Time</div>
                                <div className='buyer-supplier-details-inner-text'>{supplier?.estimated_delivery_time || '12 days'}</div>
                            </div>
                            <div className='buyer-supplier-details-inner-section'>
                                <div className='buyer-supplier-details-inner-head'>Tags</div>
                                <div className='buyer-supplier-details-inner-text'>{supplier?.tags || 'Tag1, Tag2'}</div>
                            </div>
                        </div>
                    </div>
                    <div className='buyer-supplier-details-card-section'>
                        <div className='buyer-supplier-details-uppar-card-section'>
                            <div className='buyer-supplier-details-uppar-card-inner-section'>
                                <div className='buyer-supplier-details-card-container'>
                                {/* <Link to='/supplier-completed'> */}
                                <Link to={`/buyer/supplier-completed/${supplierId}`}>
                                    <div className='buyer-supplier-details-card-container-contents'>
                                        <div className='buyer-supplier-details-card-conteianer-head'>Completed Orders</div>
                                        <div className='buyer-supplier-details-card-conteianer-text'>{buyerSupplierOrder?.completedCount || 0}</div>
                                    </div>
                                    </Link>

                                </div>
                                <div className='buyer-supplier-details-card-container'>
                                {/* <Link to='/supplier-active'> */}
                                <Link to={`/buyer/supplier-active/${supplierId}`}>
                                    <div className='buyer-supplier-details-card-container-contents'>
                                        <div className='buyer-supplier-details-card-conteianer-head'>Active Orders</div>
                                        <div className='buyer-supplier-details-card-conteianer-text'>{buyerSupplierOrder?.activeCount || 0}</div>
                                    </div>
                                </Link>

                                </div>
                                <div className='buyer-supplier-details-card-container'>
                                {/* <Link to='/supplier-pending'> */}
                                <Link to={`/buyer/supplier-pending/${supplierId}`}>
                                    <div className='buyer-supplier-details-card-container-contents'>
                                        <div className='buyer-supplier-details-card-conteianer-head'>Pending Orders</div>
                                        <div className='buyer-supplier-details-card-conteianer-text'>{buyerSupplierOrder?.pendingCount || 0}</div>
                                    </div>
                                 </Link>
                                </div>
                            </div>
                        </div>
                        <div className='buyer-supplier-details-bottom-table-section'>
                        
                            <div className='buyer-supplier-details-bottom-group-container'>
                                <button className={`buyer-supplier-details-product-bottom ${activeButton === 'products' ? 'active' : ''}`} onClick={() => handleButtonClick('products')}>
                                    Products
                                </button>
                                <button className={`buyer-supplier-details-list-bottom ${activeButton === 'orders' ? 'active' : ''}`} onClick={() => handleButtonClick('orders')}>
                                    Previous Orders List
                                </button>
                            </div>
                            <div className='list-section'>
                                {activeTab === 'products' ? 
                                <SupplyProductList 
                                productsData    ={productList} 
                                totalProducts   = {totalProducts}
                                currentPage     = {currentPage}
                                productsPerPage = {productsPerPage}
                                handleProductPageChange = {handleProductPageChange}
                                /> 
                                : 
                                <SupplyOrderList 
                                orderList     = {buyerSupplierOrder?.orderList} 
                                totalOrders   = {totalOrders}
                                currentPage   = {currentOrderPage}
                                ordersPerPage = {ordersPerPage}
                                handleOrderPageChange = {handleOrderPageChange}
                                />}
                            </div>
                            {/* <SupplyOrderList orderList = {buyerSupplierOrder?.orderList}/> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SupplierDetails