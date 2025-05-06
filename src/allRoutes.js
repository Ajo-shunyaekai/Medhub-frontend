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
      import("./Buyer/components/SharedComponents/Login/Login")
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
    path: "ongoing-inquiries-list",
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
    path: "send-inquiry",
    component: lazy(() =>
      import("./Buyer/components/Buy/SendInquiry/SendInquiry")
    ),
  },
  {
    path: "inquiry",
    component: lazy(() => import("./Buyer/components/Inquiry/index")),
    children: [
      {
        path: "inquiry",
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
    path: "cancel-inquiry-list/:inquiryId",
    component: lazy(() =>
      import("./Buyer/components/Inquiry/Inquiry/CancelnquiryList")
    ),
  },
  {
    path: "ongoing-inquiries-details/:inquiryId",
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
      import("./Supplier//components/Products/NewProducts/Product")
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
    path: "inquiry-request-list",
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
    path: "inquiry-purchase-orders",
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
    path: "inquiry-request-details/:inquiryId",
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
    path: "Support",
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
