import io from "socket.io-client";

export const socket = io.connect(process.env.REACT_APP_SERVER_URL);

const user_type_from_url = window?.location?.href
  ?.split("/")?.[3]
  ?.toLowerCase();
  console.log('user_type_from_url',user_type_from_url);
  

export const user_type =
  sessionStorage.getItem("buyer_id") || localStorage.getItem("buyer_id") || user_type_from_url === "buyer" || window?.location?.pathname == '/buyer' || window?.location?.pathname?.includes('/buyer/')
    ? "Buyer"
    : sessionStorage.getItem("supplier_id") || localStorage.getItem("supplier_id") ||  user_type_from_url === "supplier"  || window?.location?.pathname?.includes('/supplier/')
    ? "Supplier"
    : sessionStorage.getItem("admin_id") || localStorage.getItem("admin_id") ||  user_type_from_url === "admin"  || window?.location?.pathname?.includes('/admin/')
    ? "Admin"
    : sessionStorage.getItem("seller_id") || localStorage.getItem("seller_id") ||  user_type_from_url === "seller"  || window?.location?.pathname?.includes('/seller/')
    && "Seller";
