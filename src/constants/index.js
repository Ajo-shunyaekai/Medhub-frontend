import io from "socket.io-client";

export const socket = io.connect(process.env.REACT_APP_SERVER_URL);

const user_type_from_url = window?.location?.href
  ?.split("/")?.[3]
  ?.toLowerCase();

export const user_type =
  sessionStorage.getItem("buyer_id") || localStorage.getItem("buyer_id")
    ? "Buyer"
    : sessionStorage.getItem("supplier_id") ||
      localStorage.getItem("supplier_id")
    ? "Supplier"
    : sessionStorage.getItem("admin_id") || localStorage.getItem("admin_id")
    ? "Admin"
    : sessionStorage.getItem("seller_id") || localStorage.getItem("seller_id")
    ? "Seller"
    : user_type_from_url === "buyer"
    ? "Buyer"
    : user_type_from_url === "admin"
    ? "Admin"
    : user_type_from_url === "supplier" && "Supplier";
