import { lazy } from "react";

// Lazy imports using array
export const buyerRoutesConfig = [
  {
    path: "/buyer/login",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Login/Login")
    ),
  },
  {
    path: "/buyer/forgot-password",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Login/ForgotPassword")
    ),
  },
  {
    path: "/buyer/sign-up",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/SignUp/SignUp")
    ),
  },
  {
    path: "/buyer/privacy-policy",
    component: lazy(() => import("./Policies/PrivcyPolicy")),
  },
  {
    path: "/buyer/terms-and-conditions",
    component: lazy(() => import("./Policies/Terms&Conditions")),
  },
  {
    path: "/buyer/thank-you",
    component: lazy(() =>
      import("./Buyer/components/Buy/SendInquiry/ThankYou")
    ),
  },
  {
    path: "*",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Error/Error")
    ),
  },
];

export const buyerNestedRoutes = [
  {
    index: true,
    component: lazy(() => import("./Buyer/components/Dashboard")),
  },
  {
    path: "edit-profile/:id",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Profile/EditProfile")
    ),
  },
  {
    path: "profile/:id",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Profile/profile")
    ),
  },
  {
    path: "ongoing-enquiries-list",
    component: lazy(() =>
      import("./Buyer/components/Dashboard/DashboardList/OngoingInquiriesList")
    ),
  },
  {
    path: "purchased-orders-list",
    component: lazy(() =>
      import("./Buyer/components/Dashboard/DashboardList/PurchasedOrdersList")
    ),
  },
  {
    path: "active-orders",
    component: lazy(() =>
      import("./Buyer/components/Dashboard/DashboardList/ActiveOrders")
    ),
  },
  {
    path: "completed-order",
    component: lazy(() =>
      import("./Buyer/components/Dashboard/DashboardList/CompletedOrders")
    ),
  },
  {
    path: "buy",
    component: lazy(() => import("./Buyer/components/Buy")),
    children: [
      {
        path: "suppliers",
        component: lazy(() =>
          import("./Buyer/components/Buy/BySupplier/BySupplier")
        ),
      },
      {
        path: "new-products",
        component: lazy(() =>
          import("./Buyer/components/Buy/ByProduct/BuyProduct")
        ),
      },
      {
        path: "secondary-market",
        component: lazy(() =>
          import("./Buyer/components/Buy/SecondaryMarket/Buy2ndMarket")
        ),
      },
    ],
  },
  {
    path: "bid",
    component: lazy(() => import("./Buyer/components/Bid/BidTable")),
    children: [
      {
        path: "active",
        component: lazy(() => import("./Buyer/components/Bid/BidTable")),
      },
      {
        path: "completed",
        component: lazy(() => import("./Buyer/components/Bid/BidTable")),
      },
      {
        path: "cancelled",
        component: lazy(() => import("./Buyer/components/Bid/BidTable")),
      },
    ],
  },
  {
    path: "bid/:id",
    component: lazy(() =>
      import("./Buyer/components/Bid/BidDetails/BidDetails")
    ),
  },
  {
    path: "bid/create-bid",
    component: lazy(() => import("./Buyer/components/Bid/CreateBid/CreateBid")),
  },
  {
    path: "product-details/:id",
    component: lazy(() =>
      import("./Buyer/components/Buy/Details/ProductDetails")
    ),
    children: [
      {
        path: "similar-products",
        component: lazy(() =>
          import("./Buyer/components/Buy/UiShared/ProductCards/ProductCard")
        ),
      },
      {
        path: "other-supplier",
        component: lazy(() =>
          import("./Buyer/components/Buy/Details/SupplierMedicineCard")
        ),
      },
    ],
  },
  {
    path: "search-product-details/:id",
    // path: "search-product-details",
    component: lazy(() =>
      import("./Buyer/components/Buy/Details/SearchProductDetails")
    ),
  },
  {
    path: "supplier-details/:supplierId",
    component: lazy(() =>
      import("./Buyer/components/Buy/BySupplier/SupplierDetails")
    ),
    children: [
      {
        path: "products",
        component: lazy(() =>
          import("./Buyer/components/Buy/BySupplier/SupplyProductList")
        ),
      },
      {
        path: "secondary",
        component: lazy(() =>
          import("./Buyer/components/Buy/BySupplier/SupplySecondaryList")
        ),
      },
      {
        path: "orders",
        component: lazy(() =>
          import("./Buyer/components/Buy/BySupplier/SupplyOrderList")
        ),
      },
    ],
  },
  {
    path: "send-enquiry",
    component: lazy(() =>
      import("./Buyer/components/Buy/SendInquiry/SendInquiry")
    ),
  },
  {
    path: "enquiry",
    component: lazy(() => import("./Buyer/components/Inquiry/index")),
    children: [
      {
        path: "enquiry",
        component: lazy(() =>
          import("./Buyer/components/Inquiry/Inquiry/OnGoingOrder")
        ),
      },
      {
        path: "purchased-order",
        component: lazy(() =>
          import("./Buyer/components/Inquiry/PurchasedOrder/PurchasedOrder")
        ),
      },
    ],
  },

  {
    path: "create-po/:inquiryId",
    component: lazy(() =>
      import("./Buyer/components/Inquiry/PurchasedOrder/CreatePO")
    ),
  },
  {
    path: "edit-po/:purchaseOrderId",
    component: lazy(() =>
      import("./Buyer/components/Inquiry/PurchasedOrder/EditCreatePO")
    ),
  },
  {
    path: "cancel-enquiry-list/:inquiryId",
    component: lazy(() =>
      import("./Buyer/components/Inquiry/Inquiry/CancelnquiryList")
    ),
  },
  {
    path: "ongoing-enquiries-details/:inquiryId",
    component: lazy(() =>
      import("./Buyer/components/Inquiry/Inquiry/OnGoingInquiriesDetails")
    ),
  },
  {
    path: "purchased-order-details/:purchaseOrderId",
    component: lazy(() =>
      import("./Buyer/components/Inquiry/PurchasedOrder/PurchasedOrderDetails")
    ),
  },
  {
    path: "logistics-form/:orderId/:buyerId",
    component: lazy(() =>
      import(
        "./Buyer/components/Orders/OrderDetails/BuyerLogistics/LogisticsForm"
      )
    ),
  },
  {
    path: "order",
    component: lazy(() => import("./Buyer/components/Orders/index")),
    children: [
      {
        path: "active-orders",
        component: lazy(() =>
          import("./Buyer/components/Orders/ActiveOrders/ActiveOrder")
        ),
      },
      {
        path: "completed-orders",
        component: lazy(() =>
          import("./Buyer/components/Orders/CompletedOrders/CompleteOrder")
        ),
      },
    ],
  },
  {
    path: "order-details/:orderId",
    component: lazy(() =>
      import("./Buyer/components/Orders/OrderDetails/OrderDetails")
    ),
  },
  {
    path: "my-supplier",
    component: lazy(() => import("./Buyer/components/MySuppliers/index")),
  },
  {
    path: "subscription",
    component: lazy(() =>
      import("./Buyer/components/Subscription/Subscription")
    ),
    children: [
      {
        path: "current-plan",
        component: lazy(() => import("./Buyer/components/Subscription/Plan")),
      },
      {
        path: "transaction-history",
        component: lazy(() =>
          import("./Buyer/components/Subscription/TransactionHistory")
        ),
      },
    ],
  },
  {
    path: "subscription-invoice-details",
    component: lazy(() =>
      import("./Buyer/components/Subscription/SubscriptionInvoiceDetails")
    ),
  },

  {
    path: "invoice",
    component: lazy(() => import("./Buyer/components/Invoice/index")),
    children: [
      {
        path: "pending-invoice",
        component: lazy(() =>
          import(
            "./Buyer/components/Dashboard/DashboardList/PendingInvoicesList"
          )
        ),
      },
      {
        path: "paid-invoice",
        component: lazy(() =>
          import("./Buyer/components/Invoice/Paid/CompleteInvoice")
        ),
      },
      {
        path: "proforma-invoice",
        component: lazy(() =>
          import("./Buyer/components/Invoice/Proforma/ProformaInvoice")
        ),
      },
    ],
  },
  {
    path: "invoice-design/:invoiceId",
    component: lazy(() => import("./Buyer/components/Invoice/invoiceDesign")),
  },
  {
    path: "complete-invoices-list",
    component: lazy(() =>
      import("./Buyer/components/Dashboard/DashboardList/CompleteInvoicesList")
    ),
  },
  {
    path: "pending-invoices-list",
    component: lazy(() =>
      import("./Buyer/components/Dashboard/DashboardList/PendingInvoicesList")
    ),
  },
  {
    path: "proforma-invoice-details/:orderId",
    component: lazy(() =>
      import("./Buyer/components/Invoice/ProformaInvoiceDetails")
    ),
  },
  {
    path: "support",
    component: lazy(() => import("./Buyer/components/Support/index")),
  },
  {
    path: "notification-list",
    component: lazy(() =>
      import(
        "./Buyer/components/SharedComponents/Notification/NotificationList"
      )
    ),
  },
  {
    path: "supplier-completed/:supplierId",
    component: lazy(() =>
      import("./Buyer/components/supplier/SuplierCompleted")
    ),
  },
  {
    path: "supplier-active/:supplierId",
    component: lazy(() => import("./Buyer/components/supplier/SupplierActive")),
  },
  {
    path: "logistics-form/:orderId/:buyerId",
    component: lazy(() =>
      import(
        "./Buyer/components/Orders/OrderDetails/BuyerLogistics/LogisticsForm"
      )
    ),
  },
  {
    path: "add-new-address/:orderId/:buyerId",
    component: lazy(() =>
      import(
        "./Buyer/components/Orders/OrderDetails/BuyerLogistics/AddNewAddress"
      )
    ),
  },
  {
    path: "edit-new-address/:orderId/:buyerId/:addressId",
    component: lazy(() =>
      import(
        "./Buyer/components/Orders/OrderDetails/BuyerLogistics/EditNewAddress"
      )
    ),
  },
  {
    path: "logistics-address/:orderId/:buyerId",
    component: lazy(() =>
      import(
        "./Buyer/components/Orders/OrderDetails/BuyerLogistics/LogisticsAddress"
      )
    ),
  },
  {
    path: "*",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Error/Error")
    ),
  },
];

export const supplierRoutesConfig = [
  {
    path: "/supplier/login",
    component: lazy(() =>
      import("./Supplier/components/SharedComponents/Signup/SupplierLogin")
    ),
  },
  {
    path: "/supplier/sign-up",
    component: lazy(() =>
      import("./Supplier/components/SharedComponents/Signup/SupplierSignUp")
    ),
  },
  {
    path: "/supplier/forgot-password",
    component: lazy(() =>
      import("./Supplier/components/SharedComponents/Signup/ForgotPassword")
    ),
  },
  {
    path: "/supplier/privacy-policy",
    component: lazy(() => import("./Policies/PrivcyPolicy")),
  },
  {
    path: "/supplier/terms-and-conditions",
    component: lazy(() => import("./Policies/Terms&Conditions")),
  },
  {
    path: "*",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Error/Error")
    ),
  },
];

export const supplierNestedRoutes = [
  {
    index: true,
    component: lazy(() => import("./Supplier/components/Dashboard/index")),
  },
  {
    path: "product",
    component: lazy(() =>
      import("./Supplier/components/Products/NewProducts/Product")
    ),
    children: [
      {
        path: "newproduct",
        component: lazy(() =>
          import("./Supplier/components/Products/NewProducts/NewProduct")
        ),
      },
      {
        path: "secondarymarket",
        component: lazy(() =>
          import("./Supplier/components/Products/NewProducts/SecondaryMarket")
        ),
      },
    ],
  },
  {
    path: "enquiry-request-list",
    component: lazy(() =>
      import("./Supplier/components/Dashboard/DashboardList/InquiryRequestList")
    ),
  },
  {
    path: "purchased-orders-list",
    component: lazy(() =>
      import(
        "./Supplier/components/Dashboard/DashboardList/PurchasedOrdersList"
      )
    ),
  },
  {
    path: "ongoing-orders",
    component: lazy(() =>
      import("./Supplier/components/Dashboard/DashboardList/DashboardOngoing")
    ),
  },
  {
    path: "completed-orders",
    component: lazy(() =>
      import("./Supplier/components/Dashboard/DashboardList/CompletedOrders")
    ),
  },
  {
    path: "pending-invoices-list",
    component: lazy(() =>
      import(
        "./Supplier/components/Dashboard/DashboardList/PendingInvoicesList"
      )
    ),
  },
  {
    path: "completed-invoices-list",
    component: lazy(() =>
      import(
        "./Supplier/components/Dashboard/DashboardList/CompletedInvoicesList"
      )
    ),
  },
  {
    path: "enquiry-purchase-orders",
    component: lazy(() =>
      import("./Supplier/components/Inquiry/InquiryPurchaseOrders")
    ),
    children: [
      {
        path: "ongoing",
        component: lazy(() =>
          import("./Supplier/components/Inquiry/InquiryRequest/OnGoingOrder")
        ),
      },
      {
        path: "purchased",
        component: lazy(() =>
          import("./Supplier/components/Inquiry/PurchasedOrder/PurchasedOrder")
        ),
      },
    ],
  },
  {
    path: "invoice",
    component: lazy(() => import("./Supplier/components/Invoices/Invoice")),
    children: [
      {
        path: "pending",
        component: lazy(() =>
          import(
            "./Supplier/components/Invoices/PendingInvoices/PendingInvoice"
          )
        ),
      },
      {
        path: "paid",
        component: lazy(() =>
          import("./Supplier/components/Invoices/PaidInvoices/CompleteInvoice")
        ),
      },
      {
        path: "proforma",
        component: lazy(() =>
          import("./Supplier/components/Invoices/ProformaInvoices/ProformaList")
        ),
      },
    ],
  },
  {
    path: "order",
    component: lazy(() => import("./Supplier/components/Orders/Order")),
    children: [
      {
        path: "active",
        component: lazy(() =>
          import("./Supplier/components/Orders/ActiveOrders/ActiveOrder")
        ),
      },
      {
        path: "completed",
        component: lazy(() =>
          import("./Supplier/components/Orders/CompletedOrders/CompleteOrder")
        ),
      },
    ],
  },
  {
    path: "add-product",
    component: lazy(() =>
      import("./Supplier/components/Products/AddProduct/AddProduct")
    ),
  },
  {
    path: "preview-file",
    component: lazy(() =>
      import(
        "./Supplier/components/Products/AddProduct/PreviewFile/PreviewFile"
      )
    ),
  },
  {
    // path: "product-details",
    path: "product-details/:id",
    component: lazy(() =>
      import("./Supplier/components/Products/ProductDetails/ProductDetails")
    ),
  },
  {
    path: "edit-product/:id",
    component: lazy(() =>
      import("./Supplier/components/Products/AddProduct/EditAddProduct")
    ),
  },
  {
    path: "enquiry-request-details/:inquiryId",
    component: lazy(() =>
      import(
        "./Supplier/components/Inquiry/InquiryRequest/InquiryRequestDetails"
      )
    ),
  },
  {
    path: "purchased-order-details/:purchaseOrderId",
    component: lazy(() =>
      import(
        "./Supplier/components/Inquiry/PurchasedOrder/PurchasedOrderDetails"
      )
    ),
  },
  {
    path: "proforma-invoice/:purchaseOrderId",
    component: lazy(() =>
      import("./Supplier/components/Invoices/ProformaInvoices/ProformaInvoice")
    ),
  },
  {
    path: "active-orders-details/:orderId",
    component: lazy(() =>
      import("./Supplier/components/Orders/ActiveOrdersDetails")
    ),
  },
  {
    path: "invoice-design/:invoiceId",
    component: lazy(() =>
      import("./Supplier/components/Invoices/InvoiceDesign")
    ),
  },
  {
    path: "proforma-invoice-details/:orderId",
    component: lazy(() =>
      import(
        "./Supplier/components/Invoices/ProformaInvoices/ProformaDetailsPage"
      )
    ),
  },
  {
    path: "create-invoice/:orderId",
    component: lazy(() =>
      import("./Supplier/components/Invoices/CreateInvoice")
    ),
  },
  {
    path: "buyer-details/:buyerId",
    component: lazy(() =>
      import("./Supplier/components/Products/ProductDetails/BuyerDetails")
    ),
  },
  {
    path: "buyer-completed-list/:buyerId",
    component: lazy(() =>
      import("./Supplier/components/Products/Buyer/BuyerCompletedList")
    ),
  },
  {
    path: "buyer-active-list/:buyerId",
    component: lazy(() =>
      import("./Supplier/components/Products/Buyer/BuyerActiveList")
    ),
  },
  {
    path: "buyer-pending-list/:buyerId",
    component: lazy(() =>
      import("./Supplier/components/Products/Buyer/BuyerPendingList")
    ),
  },
  {
    path: "support",
    component: lazy(() => import("./Supplier/components/Support/Support")),
  },
  {
    path: "subscription",
    component: lazy(() =>
      import("./Supplier/components/Subscription/Subscription")
    ),
    children: [
      {
        path: "transaction-history",
        component: lazy(() =>
          import("./Supplier/components/Subscription/TransactionHistory")
        ),
      },
      {
        path: "current-plan",
        component: lazy(() =>
          import("./Supplier/components/Subscription/Plan")
        ),
      },
    ],
  },
  {
    path: "subscription-invoice-details",
    component: lazy(() =>
      import("./Supplier/components/Subscription/SubscriptionInvoiceDetails")
    ),
  },
  {
    path: "notification-list",
    component: lazy(() =>
      import(
        "./Supplier/components/SharedComponents/Notification/NotificationList"
      )
    ),
  },
  {
    path: "profile/:id",
    component: lazy(() =>
      import("./Supplier/components/SharedComponents/Profile/profile")
    ),
  },
  {
    path: "edit-profile/:id",
    component: lazy(() =>
      import("./Supplier/components/SharedComponents/Profile/EditProfile")
    ),
  },
  {
    path: "logistics-form/:orderId/:supplierId",
    component: lazy(() =>
      import("./Supplier/components/Orders/SupplierLogistics/SupplierLogistics")
    ),
  },
  {
    path: "add-new-address/:orderId/:supplierId",
    component: lazy(() =>
      import(
        "./Supplier/components/Orders/SupplierLogistics/SupplierAddAddress"
      )
    ),
  },
  {
    path: "edit-new-address/:orderId/:supplierId/:addressId",
    component: lazy(() =>
      import(
        "./Supplier/components/Orders/SupplierLogistics/SupplierEditAddress"
      )
    ),
  },
  {
    path: "logistics-address/:orderId/:supplierId",
    component: lazy(() =>
      import(
        "./Supplier/components/Orders/SupplierLogistics/SupplierLogisticsAddress"
      )
    ),
  },
  {
    path: "*",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Error/Error")
    ),
  },
];

export const adminRoutesConfig = [
  {
    path: "/admin/login",
    component: lazy(() =>
      import("./Admin/components/shared-components/login/Login")
    ),
  },
  {
    path: "*",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Error/Error")
    ),
  },
];

export const adminNestedRoutes = [
  {
    index: true,
    component: lazy(() => import("./Admin/components/dashboard/index")),
  },
  {
    path: "supplier/:supplierId/preview-file",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/Product/PreviewFile/PreviewFile"
      )
    ),
  },
  {
    path: "total-request-list",
    component: lazy(() =>
      import("./Admin/components/dashboard/DashboardList/TotalRequestList")
    ),
  },
  {
    path: "enquiries-section",
    component: lazy(() =>
      import("./Admin/components/dashboard/DashboardList/InquiriesDashList")
    ),
    children: [
      {
        path: "request",
        component: lazy(() =>
          import(
            "./Admin/components/dashboard/DashboardList/TotalInquiriesRequest"
          )
        ),
      },
      {
        path: "ongoing",
        component: lazy(() =>
          import(
            "./Admin/components/dashboard/DashboardList/TotalOngoingInquiries"
          )
        ),
      },
    ],
  },
  {
    path: "edit-details/:userType/:id",
    component: lazy(() =>
      import(
        "./Admin/components/shared-components/EditDetails/EditProfileDetails"
      )
    ),
  },
  {
    path: "profile",
    component: lazy(() =>
      import("./Admin/components/shared-components/Profile/profile")
    ),
  },
  {
    path: "notification-list",
    component: lazy(() =>
      import(
        "./Admin/components/shared-components/notification/NotificationList"
      )
    ),
  },
  {
    path: "total-approved-request",
    component: lazy(() =>
      import("./Admin/components/dashboard/DashboardList/TotalApprovedRequest")
    ),
  },
  {
    path: "total-po",
    component: lazy(() =>
      import("./Admin/components/dashboard/DashboardList/TotalPO")
    ),
  },
  {
    path: "total-active-orders",
    component: lazy(() =>
      import("./Admin/components/dashboard/DashboardList/TotalActiveOrders")
    ),
  },
  {
    path: "total-completed-order",
    component: lazy(() =>
      import("./Admin/components/dashboard/DashboardList/TotalCompletedOrder")
    ),
  },
  {
    path: "buyer-request",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/buyerrequest/BuyerRequest")
    ),
  },
  {
    path: "approved-buyer",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/buyerrequest/ApprovedBuyer")
    ),
  },
  {
    path: "rejected-buyer",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/buyerrequest/RejectedBuyer")
    ),
  },
  {
    path: "buyer-details/:buyerId",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/buyerrequest/BuyerDetailsNew")
    ),
  },
  {
    path: "buyer-enquiry",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/inquiry/index")
    ),
    children: [
      {
        path: "ongoing-enquiry",
        component: lazy(() =>
          import(
            "./Admin/components/manage-buyer/inquiry/Ongoing-Inquiries/BuyerOngoingInquiry"
          )
        ),
      },
      {
        path: "purchased-order",
        component: lazy(() =>
          import(
            "./Admin/components/manage-buyer/inquiry/Purchased-Order/BuyerPurchasedOrder"
          )
        ),
      },
    ],
  },
  {
    path: "buyer-invoice",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/invoices/index")
    ),
    children: [
      {
        path: "paid",
        component: lazy(() =>
          import("./Admin/components/manage-buyer/invoices/paid/BuyerPaid")
        ),
      },
      {
        path: "pending",
        component: lazy(() =>
          import(
            "./Admin/components/manage-buyer/invoices/pending/BuyerPending"
          )
        ),
      },
      {
        path: "proforma",
        component: lazy(() =>
          import(
            "./Admin/components/manage-buyer/invoices/proforma/BuyerProforma"
          )
        ),
      },
    ],
  },
  {
    path: "buyer-order",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/order/index")
    ),
    children: [
      {
        path: "active",
        component: lazy(() =>
          import(
            "./Admin/components/manage-buyer/order/ActiveOrder/ActiveBuyerOrder"
          )
        ),
      },
      {
        path: "complete",
        component: lazy(() =>
          import(
            "./Admin/components/manage-buyer/order/CompletedOrder/CompletedBuyerOrder"
          )
        ),
      },
    ],
  },
  {
    path: "buyer-support",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/support/index")
    ),
    children: [
      {
        path: "complaint",
        component: lazy(() =>
          import(
            "./Admin/components/manage-buyer/support/complaint/BuyerComplaint"
          )
        ),
      },
      {
        path: "enquiry",
        component: lazy(() =>
          import(
            "./Admin/components/manage-buyer/support/feedback/BuyerFeedback"
          )
        ),
      },
      {
        path: "edit-profile",
        component: lazy(() =>
          import(
            "./Admin/components/manage-buyer/support/UpdateProfile/EditProfileList"
          )
        ),
      },
    ],
  },
  {
    path: "buyer-edit-profile-details/:id",
    component: lazy(() =>
      import(
        "./Admin/components/manage-buyer/support/UpdateProfile/ProfileEditRequestDetails"
      )
    ),
  },
  {
    path: "buyer-transaction",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/transaction/index")
    ),
  },
  {
    path: "buyer-transaction-details/:invoiceId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-buyer/transaction/BuyerTransactionDetails"
      )
    ),
  },
  {
    path: "ongoing-enquiries-details/:inquiryId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-buyer/inquiry/Ongoing-Inquiries/OngoingInquiriesDetails"
      )
    ),
  },
  {
    path: "buyer-purchased-order-details/:purchaseOrderId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-buyer/inquiry/Purchased-Order/BuyerPurchasedOrderDetails"
      )
    ),
  },
  {
    path: "order-details/:orderId",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/order/OrderDetails")
    ),
  },
  {
    path: "buyer-invoice-details/:invoiceId",
    component: lazy(() =>
      import("./Admin/components/manage-buyer/invoices/BuyerInvoiceDetails")
    ),
  },
  {
    path: "buyer-proforma-details/:orderId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-buyer/invoices/proforma/BuyerProformaDetails"
      )
    ),
  },
  {
    path: "buyer-complaint-details/:supportId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-buyer/support/complaint/BuyerComplaintDetails"
      )
    ),
  },
  {
    path: "buyer-enquiry-details/:supportId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-buyer/support/feedback/BuyerFeedbackDetails"
      )
    ),
  },
  {
    path: "supplier-request",
    component: lazy(() =>
      import("./Admin/components/manage-supplier/SupplierRequest/SellerRequest")
    ),
  },
  {
    path: "approved-supplier",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/SupplierRequest/ApprovedSeller"
      )
    ),
  },
  {
    path: "rejected-supplier",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/SupplierRequest/RejectedSeller"
      )
    ),
  },
  {
    path: "supplier-transaction",
    component: lazy(() =>
      import("./Admin/components/manage-supplier/Transaction/SellerTransaction")
    ),
  },
  {
    path: "supplier-enquiry",
    component: lazy(() =>
      import("./Admin/components/manage-supplier/Inquiry/index")
    ),
    children: [
      {
        path: "enquiry-request",
        component: lazy(() =>
          import(
            "./Admin/components/manage-supplier/Inquiry/InquiryRequest/InquiryRequest"
          )
        ),
      },
      {
        path: "purchased-order",
        component: lazy(() =>
          import(
            "./Admin/components/manage-supplier/Inquiry/PurchasedOrder/PurchasedOrder"
          )
        ),
      },
    ],
  },
  {
    path: "supplier-order",
    component: lazy(() =>
      import("./Admin/components/manage-supplier/Order/index")
    ),
    children: [
      {
        path: "active",
        component: lazy(() =>
          import(
            "./Admin/components/manage-supplier/Order/ActiveOrder/ActiveSellerOrder"
          )
        ),
      },
      {
        path: "complete",
        component: lazy(() =>
          import(
            "./Admin/components/manage-supplier/Order/CompletedOrder/CompletedSellerOrder"
          )
        ),
      },
    ],
  },
  {
    path: "supplier-invoice",
    component: lazy(() =>
      import("./Admin/components/manage-supplier/Invoice/index")
    ),
    children: [
      {
        path: "paid",
        component: lazy(() =>
          import("./Admin/components/manage-supplier/Invoice/Paid/PaidInvoice")
        ),
      },
      {
        path: "pending",
        component: lazy(() =>
          import(
            "./Admin/components/manage-supplier/Invoice/Pending/PendingInvoice"
          )
        ),
      },
      {
        path: "proforma",
        component: lazy(() =>
          import(
            "./Admin/components/manage-supplier/Invoice/Proforma/SellerProformaInvoice"
          )
        ),
      },
    ],
  },
  {
    path: "supplier-support",
    component: lazy(() =>
      import("./Admin/components/manage-supplier/Support/index")
    ),
    children: [
      {
        path: "complaint",
        component: lazy(() =>
          import(
            "./Admin/components/manage-supplier/Support/Complaint/SellerComplaint"
          )
        ),
      },
      {
        path: "enquiry",
        component: lazy(() =>
          import("./Admin/components/manage-supplier/Support/Feedback/Feedback")
        ),
      },
      {
        path: "edit-profile",
        component: lazy(() =>
          import(
            "./Admin/components/manage-supplier/Support/UpdateProfile/EditProfileList"
          )
        ),
      },
    ],
  },
  {
    path: "supplier-edit-profile-details/:id",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/Support/UpdateProfile/ProfileEditRequestDetails"
      )
    ),
  },
  {
    path: "supplier-details/:supplierId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/SupplierRequest/SupplierDetailsNew"
      )
    ),
  },
  {
    path: "supplier-transaction-details/:invoiceId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/Transaction/SellerTransactionDetails"
      )
    ),
  },
  {
    path: "supplier-enquiry-details/:inquiryId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/Inquiry/InquiryRequest/SellerInquiryDetails"
      )
    ),
  },
  {
    path: "supplier-purchased-order-details/:purchaseOrderId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/Inquiry/PurchasedOrder/SellerPurchasedOrderDetails"
      )
    ),
  },
  {
    path: "supplier-order-details/:orderId",
    component: lazy(() =>
      import("./Admin/components/manage-supplier/Order/OrderDetails")
    ),
  },
  {
    path: "supplier-invoice-details/:invoiceId",
    component: lazy(() =>
      import("./Admin/components/manage-supplier/Invoice/SellerInvoiceDetails")
    ),
  },
  {
    path: "proforma-invoice-details/:orderId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/Invoice/Proforma/ProformaInvoiceDetails"
      )
    ),
  },
  {
    path: "supplier-complaint-details/:supportId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/Support/Complaint/SellerComplaintDetails"
      )
    ),
  },
  {
    path: "supplier-enquiry-details/:supportId",
    component: lazy(() =>
      import(
        "./Admin/components/manage-supplier/Support/Feedback/SellerFeedbackDetails"
      )
    ),
  },
  {
    path: "products",
    component: lazy(() =>
      import("./Admin/components/manage-products/Products/Product")
    ),
    children: [
      {
        path: "new",
        component: lazy(() =>
          import("./Admin/components/manage-products/Products/NewProducts")
        ),
      },
      {
        path: "secondary",
        component: lazy(() =>
          import(
            "./Admin/components/manage-products/Products/SecondaryProducts"
          )
        ),
      },
    ],
  },
  {
    path: "product-details/:id",
    component: lazy(() =>
      import("./Admin/components/manage-products/ProductDetails/ProductDetails")
    ),
  },
  {
    path: "supplier/:supplierId/products",
    component: lazy(() =>
      import("./Admin/components/manage-supplier/Product/List/Product")
    ),
    children: [
      {
        path: "new",
        component: lazy(() =>
          import(
            "./Admin/components/manage-supplier/Product/List/NewProductList"
          )
        ),
      },
      {
        path: "secondary",
        component: lazy(() =>
          import(
            "./Admin/components/manage-supplier/Product/List/SecondaryProductList"
          )
        ),
      },
    ],
  },
  {
    path: "supplier/:supplierId/edit-product/:id",
    component: lazy(() =>
      // import(
      //   "./Admin/components/manage-supplier/Product/AddProduct/EditAddProduct"
      // )
      import("./Supplier/components/Products/AddProduct/EditAddProduct")
    ),
  },
  {
    path: "supplier/:supplierId/add-product",
    component: lazy(() =>
      // import("./Admin/components/manage-supplier/Product/AddProduct/AddProduct")
    import("./Supplier/components/Products/AddProduct/AddProduct")
    ),
  },
  {
    path: "*",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Error/Error")
    ),
  },
];

export const logisticsRoutesConfig = [
  {
    path: "/logistics/login",
    component: lazy(() => import("./LogisticsPanel/components/Login/Login")),
  },
  {
    path: "/logistics/forgot-password",
    component: lazy(() =>
      import("./LogisticsPanel/components/ForgotPassword/ForgotPassword")
    ),
  },
  {
    path: "/logistics/sign-up",
    component: lazy(() => import("./LogisticsPanel/components/Signup/Signup")),
  },
  {
    path: "*",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Error/Error")
    ),
  },
];

export const logisticsNestedRoutes = [
  {
    index: true,
    component: lazy(() =>
      import("./LogisticsPanel/components/Dashboard/NewDashboard")
    ),
  },
  {
    path: "order",
    component: lazy(() =>
      import("./LogisticsPanel/components/Orders/NewOrder")
    ),
  },
  {
    path: "logistics-details/:requestId",
    component: lazy(() =>
      import(
        "./LogisticsPanel/components/Orders/NewOrderDetails/NewOrderDetails"
      )
    ),
  },
  {
    path: "pickup-order",
    component: lazy(() =>
      import(
        "./LogisticsPanel/components/PickupOrders/NewPickupOrder/NewPickupOrder"
      )
    ),
  },
  {
    path: "pickup-order-details/:requestId",
    component: lazy(() =>
      import(
        "./LogisticsPanel/components/PickupOrders/NewPickupOrderDetails/NewPickupOrderDetails"
      )
    ),
  },
  {
    path: "add-inventory",
    component: lazy(() =>
      import("./LogisticsPanel/components/Inventory/AddInventory/InventoryForm")
    ),
  },
  {
    path: "inventory-list",
    component: lazy(() =>
      import(
        "./LogisticsPanel/components/Inventory/NewInventoryList/NewInventoryList"
      )
    ),
  },
  {
    path: "add-vehicle",
    component: lazy(() =>
      import("./LogisticsPanel/components/Vehicle/NewAddVehicle/NewAddVehicle")
    ),
  },
  {
    path: "vehicle-list",
    component: lazy(() =>
      import(
        "./LogisticsPanel/components/Vehicle/NewVehicleList/NewVehicleList"
      )
    ),
  },
  {
    path: "shipment",
    component: lazy(() =>
      import("./LogisticsPanel/components/Shipment/NewShipment")
    ),
  },
  {
    path: "tracking",
    component: lazy(() =>
      import(
        "./LogisticsPanel/components/Tracking/NewTrackingForm/NewTrackingForm"
      )
    ),
  },
  {
    path: "profile",
    component: lazy(() =>
      import("./LogisticsPanel//components/SharedComponents/Profile/Profile")
    ),
  },
  {
    path: "*",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Error/Error")
    ),
  },
];

export const subscriptionRoutesConfig = [
  {
    path: "/subscription/:userType/:userId/select-plan",
    component: lazy(() => import("./SubscriptionPlan/SubscriptionPage")),
  },
  {
    path: "/subscription/:userType/:userId/successful",
    component: lazy(() => import("./SubscriptionPlan/PayementSucsessful")),
  },
  {
    path: "/subscription/:userType/:userId/failure",
    component: lazy(() => import("./SubscriptionPlan/PaymentFailure")),
  },
  {
    path: "*",
    component: lazy(() =>
      import("./Buyer/components/SharedComponents/Error/Error")
    ),
  },
];
