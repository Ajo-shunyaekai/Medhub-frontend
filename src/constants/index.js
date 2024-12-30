import io from "socket.io-client";

export const socket = io.connect(process.env.REACT_APP_SERVER_URL);

const user_type_from_url = window?.location?.href
  ?.split("/")?.[3]
  ?.toLowerCase();
  
  

export const user_type =
  sessionStorage.getItem("buyer_id") || user_type_from_url === "buyer" || window?.location?.pathname == '/buyer' || window?.location?.pathname?.includes('/buyer/')
    ? "Buyer"
    : sessionStorage.getItem("supplier_id") ||  user_type_from_url === "supplier"  || window?.location?.pathname == '/supplier' || window?.location?.pathname?.includes('/supplier/')
    ? "Supplier"
    : sessionStorage.getItem("admin_id") ||  user_type_from_url === "admin"  || window?.location?.pathname == '/admin' || window?.location?.pathname?.includes('/admin/')
    ? "Admin"
    : sessionStorage.getItem("seller_id") ||  user_type_from_url === "seller"  || window?.location?.pathname == '/seller' || window?.location?.pathname?.includes('/seller/')
    && "Seller";
