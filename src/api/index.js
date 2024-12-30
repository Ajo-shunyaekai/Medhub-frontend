import axios from 'axios';
// import { user_type } from "../constants";
axios.defaults.baseURL                       = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type']  = 'application/json';
axios.defaults.headers.post['authorization'] = process.env.REACT_APP_Authorization;

const user_type_from_url = window?.location?.href
  ?.split("/")?.[3]
  ?.toLowerCase();

const user_type =
  sessionStorage.getItem("buyer_id") || user_type_from_url === "buyer" || window?.location?.pathname == '/buyer' || window?.location?.pathname?.includes('/buyer/')
    ? "Buyer"
    : sessionStorage.getItem("supplier_id") || localStorage.getItem("supplier_id") ||  user_type_from_url === "supplier"  || window?.location?.pathname?.includes('/supplier/')
    ? "Supplier"
    : sessionStorage.getItem("admin_id") || localStorage.getItem("admin_id") ||  user_type_from_url === "admin"  || window?.location?.pathname?.includes('/admin/')
    ? "Admin"
    : sessionStorage.getItem("seller_id") || localStorage.getItem("seller_id") ||  user_type_from_url === "seller"  || window?.location?.pathname?.includes('/seller/')
    && "Seller";

export const apiRequests = {
  postRequestWithNoToken: async function (URL, requestData = {}) {

    try {
      const response  = await axios.post(URL, requestData);
      return response.data;
    } catch (err) {
      return { code: 500, message: err?.response?.data?.message };
    }
  },

  postRequest : async (URL, requestData) => {
    try {
      const response  = await axios({
        method  : "POST",
        url     : URL,    
        data    : requestData,
        // withCredentials : true,
        headers : {
            "access_token" : sessionStorage.getItem('token'),
            "buyer_id"     : sessionStorage.getItem('buyer_id'),
            "supplier_id"  : sessionStorage.getItem("supplier_id"),
            "admin_id"     : sessionStorage.getItem("admin_id"),
            "Content-Type" : "application/json",
            "user_type"    : user_type
        } 
      });
      return response.data;

    } catch (err) {
        return {code : 500, message : err?.response?.data?.message };
    }
  },
 
  postRequestWithFile: async function (URL, requestData) {
    try {
      const response = await axios({
        method  : "POST",
        url     : URL,    
        data    : requestData,
        // withCredentials : true,
        headers : {
            "access_token" : sessionStorage.getItem('token'),
            "buyer_id"     : sessionStorage.getItem('buyer_id'),
            "supplier_id"  : sessionStorage.getItem("supplier_id"),
            "admin_id"     : sessionStorage.getItem("admin_id"),
            "Content-Type" : "multipart/form-data",
            "user_type"    : user_type
        } 
      });
      return response.data;
    } catch (err) {
      return { code: 500, message: err?.response?.data?.message };
    }
  },
};
 