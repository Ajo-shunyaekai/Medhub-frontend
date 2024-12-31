import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client'; 
import logo from '../assest/logo.svg';
import SignUp from '../signup/SignUp.js';
import Login from '../signup/Login.js';
import Sidebar from './Sidebar.js';
import Dashboard from './Dashboard';
import Buy from './Buy'
import Order from './Order.js';
import MySupplier from './MySupplier.js';
import Invoice from './Invoice.js';
import Support from './Support.js';
import ActiveOrder from './orders/ActiveOrder.js';
import CompleteOrder from './orders/CompleteOrder.js';
import DeletedOrder from './orders/DeletedOrder.js';
import OrderCancel from './orders/OrderCancel.js';
import LineChart from './chart/LineChart';
import ProgressBar from './chart/ProgressBar';
import OrderDetails from './OrderDetails.js';
import PendingDetails from './PendingDetails.js';
import ProductDetails from './ProductDetails.js'
import OrderDetailsCircularBar from './chart/OrderDetailsCircularBar.js';
import SupplierDetails from './SupplierDetails.js';
import CompletedOrders from './dashboard/CompletedOrders.js';
import OngoingOrders from './dashboard/OngoingOrders.js';
import PendingOrders from './dashboard/PendingOrders.js';
import SupplyOrderList from './orders/SupplyOrderList.js';
import CompleteInvoice from './invoice/CompleteInvoice.js';
import OngoingInvoice from './invoice/OngoingInvoice.js';
import PendingInvoice from './invoice/PendingInvoice.js';
import PayModal from './pay/PayModal'
import UploadDocument from './pay/UploadDocument'
import InvoiceDesign from './pay/invoiceDesign.js';
import CustomModal from './pay/CustomModal.js';
import InvoiceCardDesign from './pay/InvoiceCardDesign.js'
import ProductDetailsCard from './ProductDetailsCard.js';
import SupplierCompleted from './supplier/SuplierCompleted.js'
import SupplierActive from './supplier/SupplierActive.js'
import SupplierPending from './supplier/SupplierPending.js'
import ImageUploader from '../signup/ImageUploader.js';
import SuccessModal from '../signup/SuccessModal.js';
import Buy2ndMarket from './sections/Buy2ndMarket.js'
import MarketProductDetails from './MarketProductDetails.js';
import SupplyProductList from './orders/SupplyProductList.js'
import SupplierPurchaseInvoice from './pay/SupplierPurchaseInvoice.js'
import SendInquiry from './SendInquiry';
import SearchProductDetails from './SearchProductDetails.js';
import Subscription from './Subscription.js';
import TableMembership from './membership/TableMembership.js';
import SubscriptionMembership from './SubscriptionMembership.js';
import SearchMarketProductDetails from './SearchMarketProductDetails.js';
import CreatePO from '../components/CreatePO.js';
import CreatePOImageUpload from '../components/CreatePOImageUpload.js';
import PurchasedOrderDetails from '../components/PurchasedOrderDetails.js'
import OnGoingInquiriesDetails from '../components/OnGoingInquiriesDetails.js'
import OnGoingList from '../components/OnGoingList.js'
import InquiryPurchaseOrders from '../components/InquiryPurchaseOrders.js'
import OnGoingOrder from '../components/inquiry/OnGoingOrder.js'
import PurchasedOrder from '../components/inquiry/PurchasedOrder.js'
import SuccessfulInquiryModal from '../components/SuccessfulInquiryModal.js'
import EditCreatePO from '../components/EditCreatePO.js'
import CustomOrderModal from './CustomOrderModal.js';
import ProformaInvoice from './invoice/ProformaInvoice.js';
import { postRequestWithToken } from '../api/Requests.js';
import ProformaInvoiceDetails from './ProformaInvoiceDetails.js';
import ThankYou from './ThankYou.js';
import { toast } from 'react-toastify';
import NotificationList from './NotificationList.js'
import CancelnquiryList from './CancelnquiryList.js';
import SupplySecondaryList from './orders/SupplySecondaryList.js';
import OngoingInquiriesList from './dashboard/OngoingInquiriesList.js';
import PurchasedOrdersList from './dashboard/PurchasedOrdersList.js';
import CompleteInvoicesList from './dashboard/CompleteInvoicesList.js';
import PendingInvoicesList from './dashboard/PendingInvoicesList.js';

const BuyerSidebar = () => {
    const buyerIdSessionStorage = sessionStorage.getItem('buyer_id');
    const buyerIdLocalStorage   = localStorage.getItem('buyer_id');

    const socket = io.connect(process.env.REACT_APP_SERVER_URL);
    const location = useLocation();
    

    const activeKey = () => {
        const res = window.location.pathname.split("/");
        return res.length > 1 ? `/${res[1]}` : "/";
    };
    const navigate = useNavigate();
    
    const [notificationList, setNotificationList] = useState([])
    const [count, setCount]                       = useState()
    const [refresh, setRefresh]                   = useState(false)
    const [invoiceCount, setInvoiceCount]         = useState()

    const showNotification = (title, options, url) => {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, options);
    
            // Add an onclick event to the notification
            notification.onclick = () => {
                window.focus();  
                window.location.href = url;  
            };
        }
    };

    // Fetch notification list function
const fetchNotifications = () => {
    const obj = {
        buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
    };

    postRequestWithToken('buyer/get-notification-list', obj, (response) => {
        if (response.code === 200) {
            // Update notification list and count
            setNotificationList(response.result.data);
            setCount(response.result.totalItems || 0);
        } else {
            console.log('error in fetching notification list');
        }
    });
};


    useEffect(() => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage && location.pathname !== '/buyer/sign-up') {
            navigate("/buyer/login");
        }
    }, [location.pathname]); 
    
    const handleClick = (id, event) => {
        const obj = {
            notification_id : id,
            event ,
            status : 1,
            buyer_id : buyerIdSessionStorage || buyerIdLocalStorage,
            user_type: 'buyer'
        }
        postRequestWithToken('buyer/update-notification-status', obj, (response) => {
            if (response.code === 200) {
                // setRefresh(true)
                fetchNotifications()
            } else {
                console.log('error in order details api');
            }
        });
    }


    useEffect(() => {
        if (buyerIdSessionStorage || buyerIdLocalStorage) {
            const obj = {
                buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            };
    
            const buyerId = buyerIdSessionStorage || buyerIdLocalStorage;
            
            // Emit buyerId to socket
            socket.emit('registerBuyer', buyerId);

            postRequestWithToken('buyer/get-invoice-count', obj, (response) => {
                if (response.code === 200) {
                    // Update notification list and count
                    setInvoiceCount(response.result);
                    
                } else {
                    console.log('error in fetching notification list');
                }
            });
    
            // Fetch notification list on component mount
            // const fetchNotifications = () => {
            //     postRequestWithToken('buyer/get-notification-list', obj, (response) => {
            //         if (response.code === 200) {
            //             // Update notification list and count
            //             setNotificationList(response.result.data);
            //             setCount(response.result.totalItems || 0);
            //         } else {
            //             console.log('error in fetching notification list');
            //         }
            //     });
            // };
    
            // Initial fetch for notifications
            fetchNotifications();
    
            // Listen for new enquiry quotations via socket
            socket.on('enquiryQuotation', (message) => {
                console.log(`Enquiry quote notification: ${message}`);
                
                const link = `${process.env.REACT_APP_BUYER_URL}/notification-list`;
                showNotification('New Quote Received', {
                    body: message,
                    icon: logo,
                }, link);
    
                // Re-fetch notifications to get the latest data
                fetchNotifications();
            });

            socket.on('orderCreated', (message) => {
                const link = `${process.env.REACT_APP_BUYER_URL}/notification-list`;
                showNotification('Order Created', {
                    body: message,
                    icon: logo,
                }, link);
                fetchNotifications();
            });


            socket.on('shipmentDetailsSubmission', (message) => {
                const link = `${process.env.REACT_APP_BUYER_URL}/notification-list`;
                showNotification('Shipment Details Submitted', {
                    body: message,
                    icon: logo,
                }, link);
                fetchNotifications();
            });

            socket.on('invoiceCreated', (message) => {
                const link = `${process.env.REACT_APP_BUYER_URL}/notification-list`;
                showNotification('Order Created', {
                    body: message,
                    icon: logo,
                }, link);
                fetchNotifications();
            });
    
            return () => {
                socket.off('enquiryQuotation');
            };
        }
    }, [refresh, buyerIdSessionStorage, buyerIdLocalStorage]);
    

    if( !buyerIdSessionStorage && !buyerIdLocalStorage) { 
        return (
        <>
            <Routes>
                <Route path="/buyer/sign-up" element={<SignUp socket={socket}/>} />
                <Route path="/buyer/login" element={<Login
                   socket = {socket}
                 />} />
            </Routes> 
        </>)
    } else {
        return ( 
            <>
                <div>
                    <Routes>
                        <Route path="/buyer/thank-you" element={<ThankYou/>} />
                        <Route
                            path="*"
                            element={
                                <Sidebar invoiceCount = {invoiceCount} notificationList={notificationList} count={count} handleClick={handleClick}>
                                    <Routes>
                                        <Route path="/buyer" element={<Dashboard />} />
                                        <Route path="/buyer/order/active" element={<Order />} />
                                        <Route path="/buyer/order/completed" element={<Order />} />
                                        <Route path="/buyer/order/pending" element={<Order />} />
                                        <Route path="/buyer/order" element={<Navigate to="/buyer/order/active" />} />
                                        <Route path="/buyer/buy/seller" element={<Buy />} />
                                        <Route path="/buyer/buy/product" element={<Buy />} />
                                        <Route path="/buyer/buy/market" element={<Buy />} />
                                        <Route path="/buyer/buy" element={<Navigate to="/buyer/buy/seller" />} />
                                        <Route path="/buyer/my-supplier" element={<MySupplier />} />
                                        <Route path="/buyer/invoice/pending" element={<Invoice socket = {socket}/>} />
                                        <Route path="/buyer/invoice/paid" element={<Invoice socket = {socket}/>} />
                                        <Route path="/buyer/invoice/proforma" element={<Invoice socket = {socket}/>} />
                                        <Route path="/buyer/invoice" element={<Navigate to="/buyer/invoice/pending" />} />
                                        <Route path="/buyer/support" element={<Support />} />
                                        <Route path="/buyer/proforma-invoice" element={<ProformaInvoice/>} />
                                        <Route path="/buyer/active-order" element={<ActiveOrder />} />
                                        <Route path="/buyer/complete-order" element={<CompleteOrder />} />
                                        <Route path="/buyer/deleted-order" element={<DeletedOrder />} />
                                        {/* <Route path="/buyer/popup-Modal" element={<PopupModal />} /> */}
                                        <Route path="/buyer/ordercancel" element={<OrderCancel />} />
                                        <Route path="/buyer/line-chart" element={<LineChart />} />
                                        <Route path="/buyer/progress-bar" element={<ProgressBar />} />
                                        <Route path="/buyer/order-details/:orderId" element={<OrderDetails socket={socket}/>} />
                                        <Route path="/buyer/pending-details/:orderId" element={<PendingDetails />} />
                                        <Route path="/buyer/medicine-details/:medicineId" element={<ProductDetails />} />
                                        <Route path="/buyer/supplier-details/products/:supplierId" element={<SupplierDetails />} />
                                        <Route path="/buyer/supplier-details/secondary/:supplierId" element={<SupplierDetails />} />
                                        <Route path="/buyer/supplier-details/orders/:supplierId" element={<SupplierDetails />} />
                                        <Route path="/buyer/supplier-details/:supplierId" element={<SupplierDetails />} />
                                        {/* <Route path="/buyer/supplier-details/:supplierId" element={<Navigate to="/buyer/supplier-details/products/:supplierId" />} /> */}
                                        <Route path="/buyer/completed-orders" element={<CompletedOrders />} />
                                        <Route path="/buyer/ongoing-orders" element={<OngoingOrders />} />
                                        <Route path="/buyer/supply-order-list" element={<SupplyOrderList />} />
                                        <Route path="/buyer/pending-orders" element={<PendingOrders />} />
                                        <Route path="/buyer/order-details-circular-bar" element={<OrderDetailsCircularBar />} />
                                        <Route path="/complete-invoice" element={<CompleteInvoice />} />
                                        <Route path="/buyer/ongoing-invoice" element={<OngoingInvoice />} />
                                        <Route path="/buyer/pending-invoice" element={<PendingInvoice />} />
                                        <Route path="/buyer/upload-document" element={<UploadDocument />} />
                                        <Route path="/buyer/invoice-design/:invoiceId" element={<InvoiceDesign />} />
                                        <Route path="/buyer/custom-modal" element={<CustomModal />} />
                                        <Route path="/buyer/invoice-card-design" element={<InvoiceCardDesign />} />
                                        <Route path="/buyer/product-details-card" element={<ProductDetailsCard />} />
                                        <Route path="/buyer/supplier-completed/:supplierId" element={<SupplierCompleted />} />
                                        <Route path="/buyer/supplier-active/:supplierId" element={<SupplierActive />} />
                                        <Route path="/buyer/supplier-pending/:supplierId" element={<SupplierPending />} />
                                        <Route path="/buyer/supply-product-list" element={<SupplyProductList />} />
                                        <Route path="/buyer/buy-2nd-market" element={<Buy2ndMarket />} />
                                        <Route path="/buyer/market-product-details/:medicineId" element={<MarketProductDetails />} />
                                        <Route path="/buyer/supplier-purchase-invoice" element={<SupplierPurchaseInvoice />} />
                                        <Route path="/buyer/send-inquiry" element={<SendInquiry socket = {socket} />} />
                                        <Route path="/buyer/search-product-details/:medicineId" element={<SearchProductDetails />} />
                                        <Route path="/buyer/subscription" element={<Subscription />} />
                                        <Route path="/buyer/subscription-membership" element={<SubscriptionMembership />} />
                                        <Route path="/buyer/table-membership" element={<TableMembership />} />
                                        <Route path="/buyer/search-market-product-details/:medicineId" element={<SearchMarketProductDetails />} />
                                        <Route path="/buyer/Create-PO/:inquiryId" element={<CreatePO socket = {socket}/>} />
                                        <Route path="/buyer/create-PO-Image-Upload" element={<CreatePOImageUpload />} />
                                        <Route path="/buyer/purchased-order-details/:purchaseOrderId" element={<PurchasedOrderDetails />} />
                                        <Route path="/buyer/ongoing-inquiries-details/:inquiryId" element={<OnGoingInquiriesDetails />} />
                                        <Route path="/buyer/ongoing-list" element={<OnGoingList />} />
                                        <Route path="/buyer/edit-create-PO/:purchaseOrderId" element={<EditCreatePO  socket = {socket}/>} />
                                        <Route path="/buyer/custom-order-modal" element={<CustomOrderModal />} />
                                        <Route path="/buyer/Proforma-Invoice-Details/:orderId" element={<ProformaInvoiceDetails />} />
                                        <Route path="/buyer/inquiry-purchase-orders/ongoing" element={<InquiryPurchaseOrders />} />
                                        <Route path="/buyer/inquiry-purchase-orders/purchased" element={<InquiryPurchaseOrders />} />
                                        <Route path="/buyer/inquiry-purchase-orders" element={<Navigate to="/buyer/inquiry-purchase-orders/ongoing" />} />
                                        <Route path="/buyer/on-going-order" element={<OnGoingOrder />} />
                                        <Route path="/buyer/purchased-order" element={<PurchasedOrder />} />
                                        <Route path="/buyer/notification-list" element={<NotificationList />} />
                                        <Route path="/buyer/cancel-inquiry-list/:inquiryId" element={<CancelnquiryList/>} />
                                        <Route path="/buyer/successful-inquiry-modal" element={<SuccessfulInquiryModal />} />
                                        <Route path="/buyer/ongoing-inquiries-list" element={<OngoingInquiriesList/>} />
                                        <Route path="/buyer/purchased-orders-list" element={<PurchasedOrdersList/>} />
                                        <Route path="/buyer/pending-invoices-list" element={<PendingInvoicesList/>} />
                                        <Route path="/buyer/complete-invoices-list" element={<CompleteInvoicesList/>} />
                                        
                                    </Routes>
                                </Sidebar>
                            }
                        />
                    </Routes>
                </div>
            </>
        );
        
    }

}

export default BuyerSidebar;