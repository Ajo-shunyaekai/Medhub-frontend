import axios from 'axios';
axios.defaults.baseURL                       = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type']  = 'application/json';
axios.defaults.headers.post['authorization'] = process.env.REACT_APP_Authorization;

const content_type2 =  "application/json"
const apiHeaders = {
    "access_token" : sessionStorage.getItem('token') || localStorage.getItem('token'),
    "buyer_id"     :  sessionStorage.getItem('buyer_id') || localStorage.getItem('buyer_id'),
    "supplier_id"  :  sessionStorage.getItem('supplier_id') || localStorage.getItem('supplier_id'),
    "admin_id"     :  sessionStorage.getItem('admin_id') || localStorage.getItem('admin_id'),
    "Content-Type" : content_type2,                
    "user_type"    : (sessionStorage.getItem('buyer_id') || localStorage.getItem('buyer_id')) ? "Buyer" : 
    (sessionStorage.getItem('supplier_id') || localStorage.getItem('supplier_id')) ? "Supplier" : (sessionStorage.getItem('admin_id') || localStorage.getItem('admin_id')) ? "Admin" : (sessionStorage.getItem('seller_id') || localStorage.getItem('seller_id')) ? "Seller" : undefined,
}

export const apiRequests = {

  getRequest: async function (URL, requestData = {}) {
    try {
      const response = await axios.post(URL, requestData, {
        headers: {
          ...apiHeaders,
          user_type: apiHeaders?.user_type || requestData?.user_type,
        },
      });
      return response.data;
    } catch (err) {
      return { code: 500, message: err?.response?.data?.message };
    }
  },

  postRequest: async function (URL, requestData) {
    try {
      const response = await axios.post(URL, requestData, {
        headers: {
          ...apiHeaders,
          user_type: apiHeaders?.user_type || requestData?.user_type,
        },
      });

      if (response.status == 401) {
        sessionStorage.clear();
      } else {
        // if(response.status == 200)
        return response.data;
      }
    } catch (err) {
      console.log("err,", err);
      return { code: 500, message: err?.response?.data?.message };
    }
  },

  postRequestWithFile: async function (URL, requestData, user_type) {
    try {
      console.log(`requestData ${requestData}`);
      const response = await axios.post(URL, requestData, {
        headers: {
          ...apiHeaders,
          user_type: user_type,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err) {
      return { code: 500, message: err?.response?.data?.message };
    }
  },
};
