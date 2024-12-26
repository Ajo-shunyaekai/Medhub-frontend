import axios from "axios";
import { user_type } from "../constants";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["authorization"] =
  process.env.REACT_APP_Authorization;

// const apiHeaders = {
//   "access_token":
//     sessionStorage.getItem("token") || localStorage.getItem("token"),
//   "buyer_id":
//     sessionStorage.getItem("buyer_id") || localStorage.getItem("buyer_id"),
//   "supplier_id":
//     sessionStorage.getItem("supplier_id") ||
//     localStorage.getItem("supplier_id"),
//   "admin_id":
//     sessionStorage.getItem("admin_id") || localStorage.getItem("admin_id"),
//   "Content-Type": "application/json",
//   "user_type": user_type,
// };

// export const apiRequests = {
//   getRequest: async function (URL, requestData = {}) {
//     try {
//       const response = await axios.post(URL, requestData, {
//         headers: apiHeaders,
//       });
//       return response.data;
//     } catch (err) {
//       return { code: 500, message: err?.response?.data?.message };
//     }
//   },

//   postRequest: async function (URL, requestData) {
//     try {
//       const response = await axios.post(URL, requestData, {
//         headers: apiHeaders,
//       });

//       if (response.status == 401) {
//         sessionStorage.clear();
//       } else {
//         // if(response.status == 200)
//         return response.data;
//       }
//     } catch (err) {
//       console.log("err,", err);
//       return { code: 500, message: err?.response?.data?.message };
//     }
//   },

//   postRequestWithFile: async function (URL, requestData) {
//     try {
//       const response = await axios.post(URL, requestData, {
//         headers: {
//           ...apiHeaders,
//           user_type: user_type,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return response.data;
//     } catch (err) {
//       return { code: 500, message: err?.response?.data?.message };
//     }
//   },
// };
const apiHeaders = {
  "access_token": sessionStorage.getItem("token") || localStorage.getItem("token"),
  "buyer_id": sessionStorage.getItem("buyer_id") || localStorage.getItem("buyer_id"),
  "supplier_id": sessionStorage.getItem("supplier_id") || localStorage.getItem("supplier_id"),
  "admin_id": sessionStorage.getItem("admin_id") || localStorage.getItem("admin_id"),
  "Content-Type": "application/json",
  "user_type": user_type,
};

export const apiRequests = {
  getRequest: async function (URL, requestData = {}) {
    const token = await sessionStorage.getItem("token") || localStorage.getItem("token");
    const checkforToken = window?.location?.pathname!= '/supplier/login' && window?.location?.pathname!= '/supplier/sign-up' &&window?.location?.pathname!= '/buyer/login' && window?.location?.pathname!= '/buyer/sign-up' &&window?.location?.pathname!= '/admin/login' && window?.location?.pathname!= '/admin/sign-up' &&!token
    if (checkforToken) {
      console.error("Token not found!");
      return { code: 401, message: "Token not available" };
    }

    try {
      const response = await axios.post(URL, requestData, {
        headers: { ...apiHeaders, "access_token": token },
      });
      return response.data;
    } catch (err) {
      return { code: 500, message: err?.response?.data?.message };
    }
  },

  postRequest: async function (URL, requestData) {
    const token = await sessionStorage.getItem("token") || localStorage.getItem("token");
    const checkforToken = window?.location?.pathname!= '/supplier/login' && window?.location?.pathname!= '/supplier/sign-up' &&window?.location?.pathname!= '/buyer/login' && window?.location?.pathname!= '/buyer/sign-up' &&window?.location?.pathname!= '/admin/login' && window?.location?.pathname!= '/admin/sign-up' &&!token
    if (checkforToken) {
      console.error("Token not found!");
      return { code: 401, message: "Token not available" };
    }

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
    const token = await sessionStorage.getItem("token") || localStorage.getItem("token");
    const checkforToken = window?.location?.pathname!= '/supplier/login' && window?.location?.pathname!= '/supplier/sign-up' &&window?.location?.pathname!= '/buyer/login' && window?.location?.pathname!= '/buyer/sign-up' &&window?.location?.pathname!= '/admin/login' && window?.location?.pathname!= '/admin/sign-up' &&!token
    if (checkforToken) {
      console.error("Token not found!");
      return { code: 401, message: "Token not available" };
    }

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

