import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'; 
import logo from '../assets/signup.svg';
import AdmSidebar from '../components/AdmSidebar.js';
import AdminDashboard from '../components/AdminDashboard';
import LineChart from '../components/chart/LineChart';
import ProgressBar from '../components/chart/ProgressBar';
import ApprovedSeller from '../components/seller/ApprovedSeller';
import RejectedSeller from '../components/seller/RejectedSeller';
import ApprovedBuyer from '../components/buyer/ApprovedBuyer';
import RejectedBuyer from '../components/buyer/RejectedBuyer';
import SellerTransaction from '../components/seller/SellerTransaction';
import BuyerTransaction from '../components/buyer/BuyerTransaction';
import SellerSupport from '../components/seller/SellerSupport';
import Complaint from '../components/seller/Complaint';
import Feedback from '../components/seller/Feedback';
import SellerInvoice from '../components/seller/SellerInvoice'
import PendingInvoice from '../components/seller/PendingInvoice'
import PaidInvoice from '../components/seller/PaidInvoice'
import BuyerInvoice from '../components/buyer/BuyerInvoice'
import BuyerPending from '../components/buyer/BuyerPending';
import BuyerPaid from '../components/buyer/BuyerPaid';
import BuyerSupport from '../components/buyer/BuyerSupport'
import BuyerComplaint from '../components/buyer/BuyerComplaint';
import BuyerFeedback from '../components/buyer/BuyerFeedback';
import ApprovedProduct from '../components/products/ApprovedProduct';
import RejectedProduct from '../components/products/RejectedProduct';
import BuyerRequest from '../components/BuyerRequest';
import SellerRequest from '../components/SellerRequest';
import AdminLogin from '../components/login/Login.js'
import AdminSignUp from './signup/AdminSignUp.js';
import ProductRequests from './products/ProductRequests.js';
import DetailsBuyerRequest from './DetailsBuyerRequest.js';
import BuyerOrder from './buyer/BuyerOrder.js'
import SellerOrder from './seller/SellerOrder.js'
import ActiveBuyerOrder from './buyer/ActiveBuyerOrder.js';
import PendingBuyerOrder from './buyer/PendingBuyerOrder.js';
import ActiveSellerOrder from './seller/ActiveSellerOrder.js';
import CompletedSellerOrder from './seller/CompletedSellerOrder.js';
import PendingSellerOrder from './seller/PendingSellerOrder.js';
import CompletedBuyerOrder from './buyer/CompletedBuyerOrder.js';
import SupplierRequestDetails from './SupplierRequestDetails.js'
import BuyerDetails from '../../Admin/components/buyer/BuyerDetails.js';
import SupplierDetails from '../../Admin/components/seller/SupplierDetails.js'
import ProductRequestDetails from './ProductRequestDetails.js';
import ProductDetails from './products/ProductDetails.js';
import OrderDetails from './buyer/OrderDetails.js';
import SupplierOrderDetails from './seller/OrderDetails.js'
import NotificationList from './NotificationList.js'
import { postRequestWithToken } from '../api/Requests.js';
import ProductUpdateRequest from './products/ProductUpdateRequest.js'; 
import SellerInquiry from './seller/SellerInquiry.js';
import InquiryRequest from './seller/InquiryRequest.js';
import PurchasedOrder from './seller/PurchasedOrder.js';
import BuyerOngoingInquiry from './buyer/BuyerOngoingInquiry.js';
import BuyerPurchasedOrder from './buyer/BuyerPurchasedOrder.js';
import BuyerInquiry from './buyer/BuyerInquiry.js';
import InquiryRequestDetails from './seller/InquiryRequestDetails.js';
import PurchasedOrderDetails from './seller/PurchasedOrderDetails.js';
import SellerInquiryDetails from './seller/SellerInquiryDetails.js';
import SellerInquiryProductList from './seller/SellerInquiryProductList.js';
import SellerPurchasedOrderDetails from './seller/SellerPurchasedOrderDetails.js';
import SellerActiveCodinator from './seller/SellerActiveCodinator.js';
import SellerActiveInvoiceList from './seller/SellerActiveInvoiceList.js';
import SellerProformaInvoice from './seller/SellerProformaInvoice.js';
import SellerInvoiceDetails from './seller/SellerInvoiceDetails.js';
import ProformaInvoiceDetails from './seller/ProformaInvoiceDetails.js';
import OngoingInquiriesDetails from './buyer/OngoingInquiriesDetails.js';
import BuyerPurchasedOrderDetails from './buyer/BuyerPurchasedOrderDetails.js';
import BuyerInvoiceDetails from './buyer/BuyerInvoiceDetails.js';
import BuyerProformaDetails from './buyer/BuyerProformaDetails.js';
import BuyerProforma from './buyer/BuyerProforma.js';
import EditUpdateProductdetails from './EditUpdateProductdetails.js';
import NewProductRequest from './products/NewProductRequest.js';
import SecondaryProductRequest from './products/SecondaryProductRequest.js';
import SecondaryProductRequestDetails from './SecondaryProductRequestDetails.js';
import NewProductUpdateRequest from './products/NewProductUpdateRequest.js';
import SecondaryUpdateRequest from './products/SecondaryUpdateRequest.js';
import EditUpdateSecondaryDetails from './EditUpdateSecondaryDetails.js';
import RejectedNewProduct from './products/RejectedNewProduct.js';
import RejectedSecondaryProducts from './products/RejectedSecondaryProducts.js';
import SecondaryProductDetails from './products/SecondaryProductDetails.js';
import TotalRequestList from './dashboard/TotalRequestList'
import TotalApprovedRequest from './dashboard/TotalApprovedRequest.js';
import InquiriesDashList from './dashboard/InquiriesDashList.js';
import TotalOngoingInquiries from './dashboard/TotalOngoingInquiries.js';
import TotalInquiriesRequest from './dashboard/TotalInquiriesRequest.js';
import TotalPO from './dashboard/TotalPO.js';
import TotalActiveOrders from './dashboard/TotalActiveOrders.js';
import TotalCompletedOrder from './dashboard/TotalCompletedOrder.js';
import SellerTransactionDetails from './seller/SellerTransactionDetails.js';
import SellerFeedbackDetails from './seller/SellerFeedbackDetails.js';
import SellerComplaintDetails from './seller/SellerComplaintDetails.js';
import BuyerFeedbackDetails from './buyer/BuyerFeedbackDetails.js';
import BuyerComplaintDetails from './buyer/BuyerComplaintDetails.js';
import BuyerTransactionDetails from './buyer/BuyerTransactionDetails.js';
import DateRange from './DateRange.js';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const adminIdSessionStorage = localStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const socket = io.connect(process.env.REACT_APP_SERVER_URL);

    const [notificationList, setNotificationList] = useState([])
    const [count, setCount]                       = useState()
    const [refresh, setRefresh]                   = useState(false)

    const showNotification = (title, options, url) => { 
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, options);
    
            notification.onclick = () => {
                window.focus();  
                window.location.href = url;  
            };
        }
    };
    
    const handleClick = (id, event) => {
        const obj = {
            admin_id : adminIdSessionStorage || adminIdLocalStorage,
            notification_id : id,
            event ,
            status : 1
        }
        postRequestWithToken('admin/update-notification-status', obj, (response) => {
            if (response?.code === 200) {
                setRefresh(true)
            } else {
            }
        });
    }

    useEffect( () => { 
        
        if (adminIdSessionStorage || adminIdLocalStorage) {
        const obj = {
            admin_id : adminIdSessionStorage || adminIdLocalStorage,
        };
        const adminId = adminIdSessionStorage || adminIdLocalStorage;
        socket.emit('registerAdmin', adminId);

        const fetchNotifications = () => {
            postRequestWithToken('admin/get-notification-list', obj, (response) => {
                if (response?.code === 200) {
                    setNotificationList(response.result.data);
                    setCount(response.result.totalItems || 0)
                } else {
                }
            });
      };

      // Initial fetch for notifications
      fetchNotifications();

      socket.on('buyerRegistered', (message) => {
        const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
        showNotification('New Buyer Registration Request', {
            body: message,
            icon: logo,
        }, link);

        // Re-fetch notifications to get the latest data
        fetchNotifications();
    });

    socket.on('supplierRegistered', (message) => {
        const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
        showNotification('New Supplier Registration Requester', {
            body: message,
            icon: logo,
        }, link);

        // Re-fetch notifications to get the latest data
        fetchNotifications();
    });

    socket.on('medicineRequest', (message) => {
        const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
        showNotification('New Medicine Approval Request', {
            body: message,
            icon: logo,
        }, link);
        fetchNotifications();
    });

    socket.on('newMedicineEditRequest', (message) => {
        
        const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
        showNotification('New Medicine Edit Approval Request', {
            body: message,
            icon: logo,
        }, link);
        fetchNotifications();
    });

    socket.on('secondaryMedicineEditRequest', (message) => {
        const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
        showNotification('New Medicine Edit Approval Request', {
            body: message,
            icon: logo,
        }, link);
        fetchNotifications();
    });

    return () => {
        socket.off('buyerRegistered');
    };
   }
    },[refresh, adminIdSessionStorage, adminIdLocalStorage]) ;
    
    useEffect( () => { 
        if( !adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
        }
    },[]) ;
   
    if( !adminIdSessionStorage && !adminIdLocalStorage) {
        return (<>
            <Routes>
                <Route path="admin/sign-up" element={<AdminSignUp />} />
                <Route path="/admin/login" element={<AdminLogin socket={socket} />} />
            </Routes> 
        </>)
    } else {
        return (
            <div>
              <AdmSidebar notificationList={notificationList} count={count} handleClick={handleClick}>
                <Routes>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/line-chart" element={<LineChart />} />
                  <Route path="/admin/progress-bar" element={<ProgressBar />} />
                  <Route path="/admin/supplier-request" element={<SellerRequest />} />
                  <Route path="/admin/buyer-request" element={<BuyerRequest/>} />          
                  <Route path="/admin/approved-supplier" element={<ApprovedSeller />} />
                  <Route path="/admin/rejected-supplier" element={<RejectedSeller />} />
                  <Route path="/admin/approved-buyer" element={<ApprovedBuyer />} />
                  <Route path="/admin/rejected-buyer" element={<RejectedBuyer />} />
                  <Route path="/admin/supplier-transaction" element={<SellerTransaction />} />
                  <Route path="/admin/buyer-transaction" element={<BuyerTransaction />} />
                  <Route path="/admin/supplier-support/complaint" element={<SellerSupport />} />
                  <Route path="/admin/supplier-support/enquiry" element={<SellerSupport />} />
                  <Route path="/admin/supplier-support" element={<Navigate to="/admin/supplier-support/complaint" />} />
                  <Route path="/admin/complaint" element={<Complaint />} />
                  <Route path="/admin/enquiry" element={<Feedback />} />
                  <Route path="/admin/supplier-invoice/paid" element={<SellerInvoice/>} />
                  <Route path="/admin/supplier-invoice/pending" element={<SellerInvoice/>} />
                  <Route path="/admin/supplier-invoice/proforma" element={<SellerInvoice/>} />
                  <Route path="/admin/supplier-invoice" element={<Navigate to="/admin/supplier-invoice/paid" />} />
                  <Route path="/admin/pending-invoice" element={<PendingInvoice/>} />
                  <Route path="/admin/paid-invoice" element={<PaidInvoice/>} />
                  <Route path="/admin/buyer-request-details/:buyerId" element={<DetailsBuyerRequest/>} />
                  <Route path="/admin/supplier-request-details/:supplierId" element={<SupplierRequestDetails/>} />
                  <Route path="/admin/supplier-details/:supplierId" element={<SupplierDetails />} />
                  <Route path="/admin/inquiry-request-details" element={<InquiryRequestDetails/>} />
                  <Route path="/admin/purchased-order-details" element={<PurchasedOrderDetails />} />
                  <Route path="/admin/supplier-inquiry-details/:inquiryId" element={<SellerInquiryDetails/>} />
                  <Route path="/admin/supplier-inquiry-product-list" element={<SellerInquiryProductList/>} />
                  <Route path="/admin/supplier-purchased-order-details/:purchaseOrderId" element={<SellerPurchasedOrderDetails/>} />
                  <Route path="/admin/supplier-active-codinator" element={<SellerActiveCodinator/>} />
                  <Route path="/admin/supplier-active-invoice-list" element={<SellerActiveInvoiceList/>} />
                  <Route path="/admin/supplier-invoice-details/:invoiceId" element={<SellerInvoiceDetails/>} />
                  <Route path="/admin/proforma-invoice-details/:orderId" element={<ProformaInvoiceDetails/>} />
                  <Route path="/admin/ongoing-inquiries-details/:inquiryId" element={<OngoingInquiriesDetails/>} />
                  <Route path="/admin/buyer-purchased-order-details/:purchaseOrderId" element={<BuyerPurchasedOrderDetails/>} />
                  <Route path="/admin/buyer-invoice-details/:invoiceId" element={<BuyerInvoiceDetails/>}/>
                  <Route path="/admin/buyer-proforma-details/:orderId" element={<BuyerProformaDetails/>}/>
                  <Route path="/admin/edit-product-details/:medicineId" element={<EditUpdateProductdetails socket = {socket} />}/>
                  {/* Start the product navigate route */}
                  
                  <Route path="/admin/date-range" element={<DateRange/>} />
                  <Route path="/admin/buyer-enquiry-details/:supportId" element={<BuyerFeedbackDetails/>} />
                  <Route path="/admin/buyer-complaint-details/:supportId" element={<BuyerComplaintDetails/>} />
                  <Route path="/admin/buyer-transaction-details/:invoiceId" element={<BuyerTransactionDetails/>} />
                  
                  <Route path="/admin/supplier-transaction-details/:invoiceId" element={<SellerTransactionDetails/>} />
                  <Route path="/admin/supplier-enquiry-details/:supportId" element={<SellerFeedbackDetails/>} />
                  <Route path="/admin/supplier-complaint-details/:supportId" element={<SellerComplaintDetails/>} />
                  <Route path="/admin/rejected-product/newproduct" element={<RejectedProduct/>} />
                  <Route path="/admin/rejected-product/secondary" element={<RejectedProduct/>} />
                  <Route path="/admin/rejected-product" element={<Navigate to="/admin/rejected-product/newproduct" />} />
                  <Route path="/admin/approved-product/newproduct" element={<ApprovedProduct/>} />
                  <Route path="/admin/approved-product/secondary" element={<ApprovedProduct/>} />
                  <Route path="/admin/approved-product" element={<Navigate to="/admin/approved-product/newproduct" />} />
                  <Route path="/admin/edit-secondary-details/:medicineId" element={<EditUpdateSecondaryDetails socket = {socket}/>} />
                  <Route path="/admin/product-update-requests/newproduct" element={<ProductUpdateRequest/>} />
                  <Route path="/admin/product-update-requests/secondary" element={<ProductUpdateRequest/>} />
                  <Route path="/admin/product-update-requests" element={<Navigate to="/admin/product-update-requests/newproduct" />} />
                  <Route path="/admin/secondary-product-request-details/:medicineId" element={<SecondaryProductRequestDetails socket = {socket}/>} />
                  <Route path="/admin/product-requests/newproduct" element={<ProductRequests/>} />
                  <Route path="/admin/product-requests/secondary" element={<ProductRequests/>} />
                  <Route path="/admin/total-request-list" element={<TotalRequestList/>} />
                  <Route path="/admin/total-approved-request" element={<TotalApprovedRequest/>} />
                  <Route path="/admin/total-PO" element={<TotalPO/>} />
                  <Route path="/admin/total-active-orders" element={<TotalActiveOrders/>} />
                  <Route path="/admin/total-completed-order" element={<TotalCompletedOrder/>} />
                  <Route path="/admin/product-requests" element={<Navigate to="/admin/product-requests/newproduct" />} />
                  {/* End the product navigate route */}
                  {/* Start the Inquiries section */}            
                  
                  <Route path="/admin/total-inquiries-request" element={<TotalInquiriesRequest/>} />
                  <Route path="/admin/total-ongoing-inquiries" element={<TotalOngoingInquiries/>} />
                  <Route path="/admin/inquiries-section" element={<InquiriesDashList/>} />
                  <Route path="/admin/inquiries-section/request" element={<InquiriesDashList/>} />
                  <Route path="/admin/inquiries-section/ongoing" element={<InquiriesDashList/>} />
                  <Route path="/admin/inquiries-section" element={<Navigate to="/admin/inquiries-section/request" />} />
                  {/* End the Inquiries Section */}
                  {/* start the buyer route */}
                  <Route path="/admin/secondary-product-details/:medicineId" element={<SecondaryProductDetails/>} />
                  
                  <Route path="/admin/buyer-invoice/paid" element={<BuyerInvoice/>} />
                  <Route path="/admin/buyer-invoice/pending" element={<BuyerInvoice/>} />
                  <Route path="/admin/buyer-invoice/proforma" element={<BuyerInvoice/>} />
                  <Route path="/admin/buyer-invoice" element={<Navigate to="/admin/buyer-invoice/paid" />} />
                  <Route path="/admin/buyer-invoice" element={<BuyerInvoice/>} />
                  <Route path="/admin/buyer-pending" element={<BuyerPending/>} />
                  <Route path="/admin/buyer-paid" element={<BuyerPaid/>} />
                  {/* <Route path="/admin/supplier-invoice/proforma" element={<SellerInvoice/>} /> */}
                  <Route path="/admin/buyer-support/complaint" element={<BuyerSupport/>} />
                  <Route path="/admin/buyer-support/enquiry" element={<BuyerSupport/>} />
                  <Route path="/admin/buyer-support" element={<Navigate to="/admin/buyer-support/complaint" />} />
                  <Route path="/admin/buyer-complaint" element={<BuyerComplaint/>} />
                  <Route path="/admin/buyer-enquiry" element={<BuyerFeedback/>} />    
                  <Route path="/admin/buyer-details/:buyerId" element={<BuyerDetails />} />   
                  {/* start the seller inquiry route  */}
                  <Route path="/admin/supplier-inquiry/inquiry" element={<SellerInquiry />} />
                   <Route path="/admin/supplier-purchased/purchased" element={<SellerInquiry/>} />
                    <Route path="/admin/supplier-inquiry" element={<Navigate to="/admin/supplier-inquiry/inquiry" />} />
                  {/* end the seller inquiry route */}
                  <Route path="/admin/buyer-inquiry/inquiry" element={<BuyerInquiry/>} />
                   <Route path="/admin/buyer-purchased/purchased" element={<BuyerInquiry/>} />
                    <Route path="/admin/buyer-inquiry" element={<Navigate to="/admin/buyer-inquiry/inquiry" />} />
      
                  {/* end the buyer route */}

                   {/* Start the order route */}
                   <Route path="/admin/buyer-order/active" element={<BuyerOrder />} />
                   <Route path="/admin/buyer-order/complete" element={<BuyerOrder/>} />
                    <Route path="/admin/buyer-order/pending" element={<BuyerOrder/>} />
                    <Route path="/admin/buyer-order" element={<Navigate to="/admin/buyer-order/active" />} />
                    <Route path="/admin/supplier-order/active" element={<SellerOrder/>} />
                    <Route path="/admin/supplier-order/complete" element={<SellerOrder/>} />
                    <Route path="/admin/supplier-order/pending" element={<SellerOrder/>} />
                    <Route path="/admin/supplier-order" element={<Navigate to="/admin/supplier-order/active" />} />
                    <Route path="/admin/active-buyer-order" element={<ActiveBuyerOrder/>} />
                    <Route path="/admin/completed-buyer-order" element={<CompletedBuyerOrder/>} />
                    <Route path="/admin/pending-buyer-order" element={<PendingBuyerOrder/>} />
                    <Route path="/admin/active-supplier-order" element={<ActiveSellerOrder/>} />
                    <Route path="/admin/completed-supplier-order" element={<CompletedSellerOrder/>} />
                    <Route path="/admin/pending-supplier-order" element={<PendingSellerOrder/>} />
                    <Route path="/admin/order-details/:orderId" element={<OrderDetails/>} />
                    <Route path="/admin/supplier-order-details/:orderId" element={<SupplierOrderDetails/>} />

                    <Route path="/admin/product-request-details/:medicineId" element={<ProductRequestDetails socket = {socket}/>} />
                    <Route path="/admin/product-details/:medicineId" element={<ProductDetails/>} />

                    <Route path="/admin/notification-list" element={<NotificationList />} />
                </Routes>
              </AdmSidebar>
            </div>
          )
    }

  
}
export default AdminSidebar;