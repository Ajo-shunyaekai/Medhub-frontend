import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
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
<<<<<<< Updated upstream

=======
import OngoingInquiriesDetails from './buyer/OngoingInquiriesDetails.js';
import BuyerPurchasedOrderDetails from './buyer/BuyerPurchasedOrderDetails.js';
import BuyerInvoiceDetails from './buyer/BuyerInvoiceDetails.js';
import BuyerProformaDetails from './buyer/BuyerProformaDetails.js';
import BuyerProforma from './buyer/BuyerProforma.js';
>>>>>>> Stashed changes
const AdminSidebar = () => {
    const navigate = useNavigate();
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const [notificationList, setNotificationList] = useState([])
    const [count, setCount] = useState()
    const [refresh, setRefresh] = useState(false)
    
    const handleClick = (id, event) => {
        const obj = {
            admin_id : adminIdSessionStorage || adminIdLocalStorage,
            notification_id : id,
            event ,
            status : 1
        }
        postRequestWithToken('admin/update-notification-status', obj, (response) => {
            if (response.code === 200) {
                setRefresh(true)
            } else {
                console.log('error in order details api');
            }
        });
    }

    useEffect( () => { 
        if( !adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
        }
        const obj = {
            // order_id : orderId,
            admin_id : adminIdSessionStorage || adminIdLocalStorage,
        };
        postRequestWithToken('admin/get-notification-list', obj, (response) => {
            if (response.code === 200) {
                setNotificationList(response.result.data);
                setCount(response.result.totalItems || 0)
            } else {
                console.log('error in order details api');
            }
        });
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
                <Route path="/admin/login" element={<AdminLogin />} />
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
                  <Route path="/admin/seller-request" element={<SellerRequest />} />
                  <Route path="/admin/buyer-request" element={<BuyerRequest/>} />          
                  <Route path="/admin/approved-seller" element={<ApprovedSeller />} />
                  <Route path="/admin/rejected-seller" element={<RejectedSeller />} />
                  <Route path="/admin/approved-buyer" element={<ApprovedBuyer />} />
                  <Route path="/admin/rejected-buyer" element={<RejectedBuyer />} />
                  <Route path="/admin/seller-transaction" element={<SellerTransaction />} />
                  <Route path="/admin/buyer-transaction" element={<BuyerTransaction />} />
                  <Route path="/admin/seller-support/complaint" element={<SellerSupport />} />
                  <Route path="/admin/seller-support/feedback" element={<SellerSupport />} />
                  <Route path="/admin/seller-support" element={<Navigate to="/admin/seller-support/complaint" />} />
                  <Route path="/admin/complaint" element={<Complaint />} />
                  <Route path="/admin/feedback" element={<Feedback />} />
                  <Route path="/admin/seller-invoice/paid" element={<SellerInvoice/>} />
                  <Route path="/admin/seller-invoice/pending" element={<SellerInvoice/>} />
                  <Route path="/admin/seller-invoice/proforma" element={<SellerInvoice/>} />
                  <Route path="/admin/seller-invoice" element={<Navigate to="/admin/seller-invoice/paid" />} />
                  <Route path="/admin/pending-invoice" element={<PendingInvoice/>} />
                  <Route path="/admin/paid-invoice" element={<PaidInvoice/>} />
                  <Route path="/admin/approved-product" element={<ApprovedProduct/>} />
                  <Route path="/admin/rejected-product" element={<RejectedProduct/>} />
                  <Route path="/admin/product-requests" element={<ProductRequests/>} />
                  <Route path="/admin/buyer-request-details/:buyerId" element={<DetailsBuyerRequest/>} />
                  <Route path="/admin/supplier-request-details/:supplierId" element={<SupplierRequestDetails/>} />
                  <Route path="/admin/supplier-details/:supplierId" element={<SupplierDetails />} />
                  <Route path="/admin/product-update-request" element={<ProductUpdateRequest/>} />
                  <Route path="/admin/inquiry-request-details" element={<InquiryRequestDetails/>} />
                  <Route path="/admin/purchased-order-details" element={<PurchasedOrderDetails/>} />
                  <Route path="/admin/seller-inquiry-details/:inquiryId" element={<SellerInquiryDetails/>} />
                  <Route path="/admin/seller-inquiry-product-list" element={<SellerInquiryProductList/>} />
                  <Route path="/admin/seller-purchased-order-details" element={<SellerPurchasedOrderDetails/>} />
                  <Route path="/admin/seller-active-codinator" element={<SellerActiveCodinator/>} />
                  <Route path="/admin/seller-active-invoice-list" element={<SellerActiveInvoiceList/>} />
                  <Route path="/admin/seller-invoice-details" element={<SellerInvoiceDetails/>} />
                  <Route path="/admin/proforma-invoice-details" element={<ProformaInvoiceDetails/>} />
<<<<<<< Updated upstream
=======
                  <Route path="/admin/ongoing-inquiries-details" element={<OngoingInquiriesDetails/>} />
                  <Route path="/admin/buyer-purchased-order-details" element={<BuyerPurchasedOrderDetails/>} />
                  <Route path="/admin/buyer-invoice-details" element={<BuyerInvoiceDetails/>}/>
                  <Route path="/admin/buyer-proforma-details" element={<BuyerProformaDetails/>}/>
                  
>>>>>>> Stashed changes
                  
                  {/* start the buyer route */}
                  <Route path="/admin/buyer-invoice/paid" element={<BuyerInvoice/>} />
                  <Route path="/admin/buyer-invoice/pending" element={<BuyerInvoice/>} />
                  <Route path="/admin/buyer-invoice/proforma" element={<BuyerInvoice/>} />
                  <Route path="/admin/buyer-invoice" element={<Navigate to="/admin/buyer-invoice/paid" />} />
                  <Route path="/admin/buyer-invoice" element={<BuyerInvoice/>} />
                  <Route path="/admin/buyer-pending" element={<BuyerPending/>} />
                  <Route path="/admin/buyer-paid" element={<BuyerPaid/>} />
                  <Route path="/admin/buyer-proforma" element={<BuyerProforma/>} />
                  
                  <Route path="/admin/buyer-support/complaint" element={<BuyerSupport/>} />
                  <Route path="/admin/buyer-support/feedback" element={<BuyerSupport/>} />
                  <Route path="/admin/buyer-support" element={<Navigate to="/admin/buyer-support/complaint" />} />
                  <Route path="/admin/buyer-complaint" element={<BuyerComplaint/>} />
                  <Route path="/admin/buyer-feedback" element={<BuyerFeedback/>} />    
                  <Route path="/admin/buyer-details/:buyerId" element={<BuyerDetails />} />   
                  {/* start the seller inquiry route  */}
                  <Route path="/admin/seller-inquiry/inquiry" element={<SellerInquiry />} />
                   <Route path="/admin/seller-purchased/purchased" element={<SellerInquiry/>} />
                    <Route path="/admin/seller-inquiry" element={<Navigate to="/admin/seller-inquiry/inquiry" />} />
                  {/* end the seller inquiry route */}
                  <Route path="/admin/buyer-inquiry/inquiry" element={<BuyerInquiry/>} />
                   <Route path="/admin/buyer-purchased/purchased" element={<BuyerInquiry/>} />
                    <Route path="/admin/buyer-inquiry" element={<Navigate to="/admin/buyer-inquiry/inquiry" />} />
                  BuyerInquiry
                  {/* end the buyer route */}

                   {/* Start the order route */}
                   <Route path="/admin/buyer-order/active" element={<BuyerOrder />} />
                   <Route path="/admin/buyer-order/complete" element={<BuyerOrder/>} />
                    <Route path="/admin/buyer-order/pending" element={<BuyerOrder/>} />
                    <Route path="/admin/buyer-order" element={<Navigate to="/admin/buyer-order/active" />} />
                    <Route path="/admin/seller-order/active" element={<SellerOrder/>} />
                    <Route path="/admin/seller-order/complete" element={<SellerOrder/>} />
                    <Route path="/admin/seller-order/pending" element={<SellerOrder/>} />
                    <Route path="/admin/seller-order" element={<Navigate to="/admin/seller-order/active" />} />
                    <Route path="/admin/active-buyer-order" element={<ActiveBuyerOrder/>} />
                    <Route path="/admin/completed-buyer-order" element={<CompletedBuyerOrder/>} />
                    <Route path="/admin/pending-buyer-order" element={<PendingBuyerOrder/>} />
                    <Route path="/admin/active-seller-order" element={<ActiveSellerOrder/>} />
                    <Route path="/admin/completed-seller-order" element={<CompletedSellerOrder/>} />
                    <Route path="/admin/pending-seller-order" element={<PendingSellerOrder/>} />
                    <Route path="/admin/order-details/:orderId" element={<OrderDetails/>} />
                    <Route path="/admin/supplier-order-details/:orderId" element={<SupplierOrderDetails/>} />

                    <Route path="/admin/product-request-details/:medicineId" element={<ProductRequestDetails/>} />
                    <Route path="/admin/product-details/:medicineId" element={<ProductDetails/>} />

                    <Route path="/admin/notification-list" element={<NotificationList />} />
                </Routes>
              </AdmSidebar>
            </div>
          )
    }

  
}
export default AdminSidebar;