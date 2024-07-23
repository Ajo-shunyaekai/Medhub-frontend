import React, { useEffect } from 'react';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';  Hai
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';  Hai
// import "@fortawesome/fontawesome-free/css/all.min.css";

import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import SupSidebar from '../components/SupSidebar';
import PopupModal from '../pages/PopupModal.js';
import SupplierDashboard from '../pages/SupplierDashboard.js';
import Product from '../pages/Product.js';
import Order from '../pages/Order.js';
import Invoice from '../pages/invoice/Invoice.js';
import Support from '../pages/Support.js';
import OrderRequest from '../pages/OrderRequest.js';
import ActiveOrder from '../pages/ActiveOrder.js';
import CompleteOrder from '../pages/CompleteOrder.js';
import DeletedOrder from '../pages/DeletedOrder.js';
import OrderCancel from '../pages/OrderCancel.js';
import OrderDetails from '../pages/OrderDetails.js';
import ProductDetails from '../pages/ProductDetails.js';
import CountryDetails from '../pages/CountryDetails.js';
import Header from '../pages/Header.js';
import FaqSupport from '../pages/FaqSupport.js';
import PendingInvoice from '../pages/invoice/PendingInvoice.js';
import CompleteInvoice from '../pages/invoice/CompleteInvoice.js';
import CreateInvoice from '../pages/invoice/CreateInvoice.js';
import DashboardOngoing from '../pages/dashboardOrders/DashboardOngoing.js';
import OrderRequests from '../pages/dashboardOrders/OrderRequest';
import CompletedOrders from '../pages/dashboardOrders/CompletedOrders.js';
import OngoingInvoice from '../pages/invoice/OngoingInvoice.js';

import ImageUploader from '../signup/ImageUploader.js';
import SuccessModal from '../signup/SuccessModal.js';

import InvoiceDesign from '../pages/invoice/InvoiceDesign.js';
import ActiveOrdersDetails from '../pages/ActiveOrdersDetails.js';
import ActiveAssignDriver from '../pages/details/ActiveAssignDriver.js';
import BuyerDetails from '../pages/BuyerDetails.js'
import BuyerCompletedList from '../pages/buyer/BuyerCompletedList.js';
import BuyerActiveList from '../pages/buyer/BuyerActiveList.js';
import BuyerPendingList from '../pages/buyer/BuyerPendingList.js';
import AddProduct from '../pages/AddProduct.js';
import EditAddProduct from '../pages/EditAddProduct.js';
import SecondaryProductDetails from '../pages/SecondaryProductDetails.js';
import SupplierPurchaseInvoice from '../pages/invoice/SupplierPurchaseInvoice.js';


import SupplierLogin from '../signup/SupplierLogin.js';
import SupplierSignUp from '../signup/SupplierSignUp.js';


const SupplierSidebar = () => {
    
    const navigate = useNavigate();
    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

    useEffect( () => { 
        if( !supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
        }
    },[]) ;
    
    if( !supplierIdSessionStorage && !supplierIdLocalStorage) { 
        return (<>
            <Routes>
                <Route path="/supplier/sign-up" element={<SupplierSignUp />} />
                <Route path="/supplier/login" element={<SupplierLogin />} />
            </Routes> 
        </>)
    } else {
        return (<>
            <div>
                <SupSidebar >
                <Routes>
                    <Route path="/supplier" element={<SupplierDashboard />} />
                    <Route path="/supplier/order/active" element={<Order />} />
                    <Route path="/supplier/order/completed" element={<Order />} />
                    <Route path="/supplier/order/order-request" element={<Order />} />
                    <Route path="/supplier/order" element={<Navigate to="/supplier/order/order-request" />} />
                    <Route path="/supplier/product/newproduct" element={<Product />} />
                    <Route path="/supplier/product/secondarymarket" element={<Product />} />
                    <Route path="/supplier/product" element={<Navigate to="/supplier/product/newproduct" />} />
                    <Route path="/supplier/invoice/pending" element={<Invoice />} />
                    <Route path="/supplier/invoice/paid" element={<Invoice />} />
                    <Route path="/supplier/invoice" element={<Navigate to="/supplier/invoice/pending" />} />
                    <Route path="/supplier/invoice" element={<Invoice />} />
                    <Route path="/supplier/support" element={<Support />} />
                    <Route path="/supplier/header" element={<Header />} />
                    <Route path="/supplier/order-request" element={<OrderRequest />} />
                    <Route path="/supplier/active-order" element={<ActiveOrder />} />
                    <Route path="/supplier/complete-order" element={<CompleteOrder />} />
                    <Route path="/supplier/deleted-order" element={<DeletedOrder />} />
                    <Route path="/supplier/popup-Modal" element={<PopupModal />} />
                    <Route path="/supplier/ordercancel" element={<OrderCancel />} />
                    <Route path="/supplier/order-details/:orderId" element={<OrderDetails />} />
                    <Route path="/supplier/product-details/:medicineId" element={<ProductDetails />} />
                    <Route path="/supplier/country-details" element={<CountryDetails />} />
                    <Route path="/supplier/faq-support" element={<FaqSupport />} />
                    <Route path="/supplier/pending-invoice" element={<PendingInvoice />} />
                    <Route path="/supplier/complete-invoice" element={<CompleteInvoice />} />
                    <Route path="/supplier/ongoing-invoice" element={<OngoingInvoice />} />
                    <Route path="/supplier/create-invoice" element={<CreateInvoice />} />
                    <Route path="/supplier/order-requests" element={<OrderRequests />} />
                    <Route path="/supplier/ongoing-orders" element={<DashboardOngoing />} />
                    <Route path="/supplier/completed-orders" element={<CompletedOrders />} />  
                    <Route path="/supplier/image-uploader" element={<ImageUploader />} />
                    <Route path="/supplier/success-modal" element={<SuccessModal />} />
                    <Route path="/supplier/invoice-design" element={<InvoiceDesign />} />
                    <Route path="/supplier/active-orders-details/:orderId" element={<ActiveOrdersDetails />} />
                    <Route path="/supplier/active-assign-driver" element={<ActiveAssignDriver />} />
                    <Route path="/supplier/buyer-details" element={<BuyerDetails />} />
                    <Route path="/supplier/buyer-completed-list" element={<BuyerCompletedList />} />
                    <Route path="/supplier/buyer-active-list" element={<BuyerActiveList />} />
                    <Route path="/supplier/buyer-pending-list" element={<BuyerPendingList />} />
                    <Route path="/supplier/add-product" element={<AddProduct/>} />
                    <Route path="/supplier/edit-product/:medicineId" element={<EditAddProduct/>} /> 
                    <Route path="/supplier/secondary-product-details/:medicineId" element={<SecondaryProductDetails/>} />
                    <Route path="/supplier/supplier-purchase-invoice" element={<SupplierPurchaseInvoice/>} />
                </Routes>
                </SupSidebar>
            </div>
        </>); 
    }
}

export default SupplierSidebar;