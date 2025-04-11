import { ContinuousColorLegend } from "@mui/x-charts";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["authorization"] =
  process.env.REACT_APP_Authorization;
// axios.defaults.withCredentials               = true

export const getRequestTest = async (URL) => {
  try {
    const response = await axios.get(URL);
  } catch (error) {
    // return callback({code : 500, message : 'Connection faild, please start node server'});
  }
};
export const postRequest = async (URL, requestData, callback) => {
  try {
    const response = await axios.post(URL, requestData);
    // return response.data;
    return callback(response.data);
  } catch (err) {
    return callback({
      code: 500,
      message: "Connection faild, please start node server",
    });
    // throw err;
  }
};

export const postRequestWithFile = async (URL, requestData, callback) => {
  try {
    const response = await axios({
      method: "POST",
      url: URL,
      data: requestData,
      headers: {
        // "accesstoken" : sessionStorage.getItem('buyer_token') || localStorage.getItem('buyer_token'),
        "Content-Type": "multipart/form-data",
        usertype: localStorage.getItem("buyer_id")
          ? "Buyer"
          : localStorage.getItem("supplier_id")
          ? "Supplier"
          : localStorage.getItem("admin_id")
          ? "Admin"
          : localStorage.getItem("seller_id")
          ? "Seller"
          : undefined,
      },
    });
    // return response.data;
    return callback(response.data);
  } catch (err) {
    return callback({
      code: 500,
      message: "Connection faild, please start node server",
    });
    // throw err;
  }
};

export const postRequestWithToken = async (URL, requestData, callback) => {
  try {
    const response = await axios({
      method: "POST",
      url: URL,
      data: requestData,
      // withCredentials : true,
      headers: {
        accesstoken: localStorage.getItem("token"),
        token1: localStorage.getItem("token1"),
        token2: localStorage.getItem("token2"),
        supplier_id: localStorage.getItem("supplier_id"),
        // accesstoken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IE1heSAwMiAyMDI0IDExOjM2OjE2IEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsImJ1eWVySWQiOiJCVVktcDQ4MHhxdXNjeiIsImlhdCI6MTcxNDYyOTk3Nn0.NADTShvxaTLQBizjnmA9-NC1v-jFcFcLqrx5yOwAP8g',
        "Content-Type": "application/json",
        usertype: localStorage.getItem("buyer_id")
          ? "Buyer"
          : localStorage.getItem("supplier_id")
          ? "Supplier"
          : localStorage.getItem("admin_id")
          ? "Admin"
          : localStorage.getItem("seller_id")
          ? "Seller"
          : undefined,
      },
    });

    if (response.status == 401) {
      localStorage.clear();
      window.location.reload();
    } else {
      return callback(response.data);
    }
  } catch (err) {
    return callback({
      code: 500,
      message: "Connection failed, please start node server ",
    });
  }
};

export const postRequestWithTokenAndFile = async (
  URL,
  requestData,
  callback
) => {
  try {
    const response = await axios({
      method: "POST",
      url: URL,
      data: requestData,
      headers: {
        accesstoken: localStorage.getItem("token"),
        token1: localStorage.getItem("token1"),
        token2: localStorage.getItem("token2"),
        supplier_id: localStorage.getItem("supplier_id"),
        "Content-Type": "multipart/form-data",
        usertype: localStorage.getItem("buyer_id")
          ? "Buyer"
          : localStorage.getItem("supplier_id")
          ? "Supplier"
          : localStorage.getItem("admin_id")
          ? "Admin"
          : localStorage.getItem("seller_id")
          ? "Seller"
          : undefined,
      },
    });
    return callback(response.data);
  } catch (err) {
    return callback({
      code: 500,
      message: "Connection faild, please start node server ",
    });
  }
};

export const checkAuth = async () => {};
