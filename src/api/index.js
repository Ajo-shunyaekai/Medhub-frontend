import axios from "axios";
import { toast } from "react-toastify";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["authorization"] =
  process.env.REACT_APP_Authorization;

export const apiRequests = {
  postRequestWithNoToken: async (URL, requestData) => {
    try {
      const response = await axios.post(URL, requestData);
      // return response.data;
      return response.data;
    } catch (err) {
      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },

  getRequest: async (URL) => {
    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: {},
        headers: {
          authorization: process.env.REACT_APP_Authorization,
          accesstoken: localStorage?.getItem("token"),
          token1: localStorage?.getItem("token1"),
          token2: localStorage?.getItem("token2"),
          buyer_id: localStorage?.getItem("buyer_id"),
          supplier_id: localStorage?.getItem("supplier_id"),
          admin_id: localStorage?.getItem("admin_id"),
          partner_id: localStorage?.getItem("partner_id"),
          "Content-Type": "application/json",
          usertype: localStorage?.getItem("buyer_id")
            ? "Buyer"
            : localStorage?.getItem("supplier_id")
            ? "Supplier"
            : localStorage?.getItem("admin_id")
            ? "Admin"
            : localStorage?.getItem("seller_id")
            ? "Seller"
            : localStorage?.getItem("partner_id")
            ? "Logistics"
            : undefined,
        },
      });

      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }

      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },

  getRequest2: async ({
    url = "",
    userType = undefined,
    obj = {},
    contentType = "application/json",
  }) => {
    try {
      const response = await axios({
        method: "POST",
        url: url,
        data: obj,
        headers: {
          "Content-Type": contentType,
          usertype: userType === "buyer" ? "Buyer" : "Supplier",
        },
      });

      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }

      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },

  postRequest: async (URL, requestData = {}) => {
    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: requestData,
        headers: {
          accesstoken: localStorage?.getItem("token"),
          token1: localStorage?.getItem("token1"),
          token2: localStorage?.getItem("token2"),
          buyer_id: localStorage?.getItem("buyer_id"),
          supplier_id: localStorage?.getItem("supplier_id"),
          admin_id: localStorage?.getItem("admin_id"),
          "Content-Type": "application/json",
          usertype: localStorage?.getItem("buyer_id")
            ? "Buyer"
            : localStorage?.getItem("supplier_id")
            ? "Supplier"
            : localStorage?.getItem("admin_id")
            ? "Admin"
            : localStorage?.getItem("seller_id")
            ? "Seller"
            : localStorage?.getItem("partner_id")
            ? "Logistics"
            : undefined,
        },
      });

      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }

      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },

  postRequestWithFile: async (URL, requestData) => {
    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: requestData,
        headers: {
          accesstoken: localStorage?.getItem("token"),
          token1: localStorage?.getItem("token1"),
          token2: localStorage?.getItem("token2"),
          buyer_id: localStorage?.getItem("buyer_id"),
          supplier_id: localStorage?.getItem("supplier_id"),
          admin_id: localStorage?.getItem("admin_id"),
          partner_id: localStorage?.getItem("partner_id"),
          "Content-Type": "multipart/form-data",
          usertype: localStorage?.getItem("buyer_id")
            ? "Buyer"
            : localStorage?.getItem("supplier_id")
            ? "Supplier"
            : localStorage?.getItem("admin_id")
            ? "Admin"
            : localStorage?.getItem("seller_id")
            ? "Seller"
            : localStorage?.getItem("partner_id")
            ? "Logistics"
            : undefined,
        },
      });

      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }

      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
      // throw err;
    }
  },

  postReqCSVDownload: async (URL, requestData, fileName) => {
    try {
      axios
        .post(URL, requestData, {
          responseType: "blob", // Handle response as a blob for downloading
          headers: {
            "Content-Type": "application/json",
            authorization: process.env.REACT_APP_Authorization,
            accesstoken: localStorage?.getItem("token"),
            token1: localStorage?.getItem("token1"),
            token2: localStorage?.getItem("token2"),
            buyer_id: localStorage?.getItem("buyer_id"),
            supplier_id: localStorage?.getItem("supplier_id"),
            admin_id: localStorage?.getItem("admin_id"),
            partner_id: localStorage?.getItem("partner_id"),
            usertype: localStorage?.getItem("buyer_id")
              ? "Buyer"
              : localStorage?.getItem("supplier_id")
              ? "Supplier"
              : localStorage?.getItem("admin_id")
              ? "Admin"
              : localStorage?.getItem("seller_id")
              ? "Seller"
              : localStorage?.getItem("partner_id")
              ? "Logistics"
              : undefined,
          }, // Include the headers
        })
        .then((response) => {
          if (
            response.data &&
            response.data instanceof Blob &&
            response.headers["content-type"]?.includes("text/csv")
          ) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
          } else {
            // Attempt to read JSON from Blob to extract message
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const json = JSON.parse(reader.result);
                toast.warning(
                  json?.message || "No data available to download."
                );
              } catch (e) {
                toast.warning("No data available to download.");
              }
            };
            reader.readAsText(response.data);
          }
        })
        .catch((error) => {
          console.error("There was an error downloading the CSV file!", error);
        });
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }

      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
      // throw err;
    }
  },

  putRequest: async (URL, requestData) => {
    try {
      const response = await axios({
        method: "PUT",
        url: URL,
        data: requestData,
        headers: {
          authorization: process.env.REACT_APP_Authorization,
          accesstoken: localStorage?.getItem("token"),
          token1: localStorage?.getItem("token1"),
          token2: localStorage?.getItem("token2"),
          buyer_id: localStorage?.getItem("buyer_id"),
          supplier_id: localStorage?.getItem("supplier_id"),
          admin_id: localStorage?.getItem("admin_id"),
          "Content-Type": "application/json",
          usertype: localStorage?.getItem("buyer_id")
            ? "Buyer"
            : localStorage?.getItem("supplier_id")
            ? "Supplier"
            : localStorage?.getItem("admin_id")
            ? "Admin"
            : localStorage?.getItem("seller_id")
            ? "Seller"
            : undefined,
        },
      });

      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }

      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },

  deleteRequest: async (URL) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: URL,
        headers: {
          authorization: process.env.REACT_APP_Authorization,
          accesstoken: localStorage?.getItem("token"),
          token1: localStorage?.getItem("token1"),
          token2: localStorage?.getItem("token2"),
          buyer_id: localStorage?.getItem("buyer_id"),
          supplier_id: localStorage?.getItem("supplier_id"),
          admin_id: localStorage?.getItem("admin_id"),
          "Content-Type": "application/json",
          usertype: localStorage?.getItem("buyer_id")
            ? "Buyer"
            : localStorage?.getItem("supplier_id")
            ? "Supplier"
            : localStorage?.getItem("admin_id")
            ? "Admin"
            : localStorage?.getItem("seller_id")
            ? "Seller"
            : undefined,
        },
      });

      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }

      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },
};
