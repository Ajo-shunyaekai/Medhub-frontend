import axios from "axios";
import { user_type } from "../constants";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["access_token"] = sessionStorage.getItem("token") ;
axios.defaults.headers.post["authorization"] =
  process.env.REACT_APP_Authorization;

  const apiHeaders = {
  // "access_token": sessionStorage.getItem("token") ,
  "buyer_id": sessionStorage.getItem("buyer_id") ,
  "supplier_id": sessionStorage.getItem("supplier_id") ,
  "admin_id": sessionStorage.getItem("admin_id") ,
  "Content-Type": "application/json",
  "user_type": user_type,
};

export const apiRequests = {
  postRequestWithNoToken: async function (URL, requestData = {}) {
    const token = sessionStorage.getItem("token") ;
    console.log(URL, token)

    try {

      const response = await axios.post(URL, requestData, {
        headers: { ...apiHeaders, },
      });
      return response.data;
    } catch (err) {
      return { code: 500, message: err?.response?.data?.message };
    }
  },

  postRequest: async function (URL, requestData) {
    const token =  sessionStorage.getItem("token") ;
    console.log(URL, token)
    
    try {
      const response = await axios.post(URL, requestData, {
        headers: { ...apiHeaders, "access_token": token },
      });
      return response.data;
    } catch (err) {
      console.log("err,", err);
      return { code: 500, message: err?.response?.data?.message };
    }
  },

  postRequestWithFile: async function (URL, requestData) {
    const token =  sessionStorage.getItem("token") ;
    console.log(URL, token)

    try {
      const response = await axios.post(URL, requestData, {
        headers: {
          ...apiHeaders,
          "access_token": token,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err) {
      return { code: 500, message: err?.response?.data?.message };
    }
  },
};

