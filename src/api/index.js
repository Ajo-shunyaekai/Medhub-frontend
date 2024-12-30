import axios from 'axios';
import { user_type } from "../constants";
axios.defaults.baseURL                       = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type']  = 'application/json';
axios.defaults.headers.post['authorization'] = process.env.REACT_APP_Authorization;

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

