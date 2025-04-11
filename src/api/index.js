import axios from "axios";
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
          accesstoken:
            localStorage.getItem("token") ||
            localStorage.getItem("token") ||
            undefined,
          buyer_id:
            localStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id") ||
            undefined,
          supplier_id:
            localStorage.getItem("supplier_id") ||
            localStorage.getItem("supplier_id") ||
            undefined,
          admin_id:
            localStorage.getItem("admin_id") ||
            localStorage.getItem("admin_id") ||
            undefined,
          partner_id:
            localStorage.getItem("partner_id") ||
            localStorage.getItem("partner_id") ||
            undefined,
          "Content-Type": "application/json",
          usertype:
            localStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id")
              ? "Buyer"
              : localStorage.getItem("supplier_id") ||
                localStorage.getItem("supplier_id")
              ? "Supplier"
              : localStorage.getItem("admin_id") ||
                localStorage.getItem("admin_id")
              ? "Admin"
              : localStorage.getItem("seller_id") ||
                localStorage.getItem("seller_id")
              ? "Seller"
              : localStorage.getItem("partner_id") ||
                localStorage.getItem("partner_id")
              ? "Logistics"
              : undefined,
        },
      });

      if (response.status == 401) {
        localStorage.clear();
        return;
      }
      return response.data;
    } catch (err) {
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
          usertype: userType == "buyer" ? "Buyer" : "Supplier" || undefined,
        },
      });

      if (response.status == 401) {
        localStorage.clear();
        return;
      }
      return response.data;
    } catch (err) {
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
          accesstoken:
            localStorage.getItem("token") ||
            localStorage.getItem("token") ||
            undefined,
          buyer_id:
            localStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id") ||
            undefined,
          supplier_id:
            localStorage.getItem("supplier_id") ||
            localStorage.getItem("supplier_id") ||
            undefined,
          admin_id:
            localStorage.getItem("admin_id") ||
            localStorage.getItem("admin_id") ||
            undefined,
          "Content-Type": "application/json",
          usertype:
            localStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id")
              ? "Buyer"
              : localStorage.getItem("supplier_id") ||
                localStorage.getItem("supplier_id")
              ? "Supplier"
              : localStorage.getItem("admin_id") ||
                localStorage.getItem("admin_id")
              ? "Admin"
              : localStorage.getItem("seller_id") ||
                localStorage.getItem("seller_id")
              ? "Seller"
              : localStorage.getItem("partner_id") ||
                localStorage.getItem("partner_id")
              ? "Logistics"
              : undefined,
        },
      });

      if (response.status == 401) {
        localStorage.clear();
        return;
      }
      return response.data;
    } catch (err) {
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
          accesstoken:
            localStorage.getItem("token") ||
            localStorage.getItem("token") ||
            undefined,
          buyer_id:
            localStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id") ||
            undefined,
          supplier_id:
            localStorage.getItem("supplier_id") ||
            localStorage.getItem("supplier_id") ||
            undefined,
          admin_id:
            localStorage.getItem("admin_id") ||
            localStorage.getItem("admin_id") ||
            undefined,
          partner_id:
            localStorage.getItem("partner_id") ||
            localStorage.getItem("partner_id") ||
            undefined,
          "Content-Type": "multipart/form-data",
          usertype:
            localStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id")
              ? "Buyer"
              : localStorage.getItem("supplier_id") ||
                localStorage.getItem("supplier_id")
              ? "Supplier"
              : localStorage.getItem("admin_id") ||
                localStorage.getItem("admin_id")
              ? "Admin"
              : localStorage.getItem("seller_id") ||
                localStorage.getItem("seller_id")
              ? "Seller"
              : localStorage.getItem("partner_id") ||
                localStorage.getItem("partner_id")
              ? "Logistics"
              : undefined,
        },
      });
      // return response.data;
      return response.data;
    } catch (err) {
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
            accesstoken:
              localStorage.getItem("token") ||
              localStorage.getItem("token") ||
              undefined,
            buyer_id:
              localStorage.getItem("buyer_id") ||
              localStorage.getItem("buyer_id") ||
              undefined,
            supplier_id:
              localStorage.getItem("supplier_id") ||
              localStorage.getItem("supplier_id") ||
              undefined,
            admin_id:
              localStorage.getItem("admin_id") ||
              localStorage.getItem("admin_id") ||
              undefined,
            partner_id:
              localStorage.getItem("partner_id") ||
              localStorage.getItem("partner_id") ||
              undefined,
            usertype:
              localStorage.getItem("buyer_id") ||
              localStorage.getItem("buyer_id")
                ? "Buyer"
                : localStorage.getItem("supplier_id") ||
                  localStorage.getItem("supplier_id")
                ? "Supplier"
                : localStorage.getItem("admin_id") ||
                  localStorage.getItem("admin_id")
                ? "Admin"
                : localStorage.getItem("seller_id") ||
                  localStorage.getItem("seller_id")
                ? "Seller"
                : localStorage.getItem("partner_id") ||
                  localStorage.getItem("partner_id")
                ? "Logistics"
                : undefined,
          }, // Include the headers
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName); // Set the file name for download
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error("There was an error downloading the CSV file!", error);
        });
    } catch (err) {
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
          accesstoken:
            localStorage.getItem("token") ||
            localStorage.getItem("token") ||
            undefined,
          buyer_id:
            localStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id") ||
            undefined,
          supplier_id:
            localStorage.getItem("supplier_id") ||
            localStorage.getItem("supplier_id") ||
            undefined,
          admin_id:
            localStorage.getItem("admin_id") ||
            localStorage.getItem("admin_id") ||
            undefined,
          "Content-Type": "application/json",
          usertype:
            localStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id")
              ? "Buyer"
              : localStorage.getItem("supplier_id") ||
                localStorage.getItem("supplier_id")
              ? "Supplier"
              : localStorage.getItem("admin_id") ||
                localStorage.getItem("admin_id")
              ? "Admin"
              : localStorage.getItem("seller_id") ||
                localStorage.getItem("seller_id")
              ? "Seller"
              : undefined,
        },
      });

      if (response.status == 401) {
        localStorage.clear();
        return;
      }
      return response.data;
    } catch (err) {
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
          accesstoken:
            localStorage.getItem("token") ||
            localStorage.getItem("token") ||
            undefined,
          buyer_id:
            localStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id") ||
            undefined,
          supplier_id:
            localStorage.getItem("supplier_id") ||
            localStorage.getItem("supplier_id") ||
            undefined,
          admin_id:
            localStorage.getItem("admin_id") ||
            localStorage.getItem("admin_id") ||
            undefined,
          "Content-Type": "application/json",
          usertype:
            localStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id")
              ? "Buyer"
              : localStorage.getItem("supplier_id") ||
                localStorage.getItem("supplier_id")
              ? "Supplier"
              : localStorage.getItem("admin_id") ||
                localStorage.getItem("admin_id")
              ? "Admin"
              : localStorage.getItem("seller_id") ||
                localStorage.getItem("seller_id")
              ? "Seller"
              : undefined,
        },
      });

      if (response.status == 401) {
        localStorage.clear();
        return;
      }
      return response.data;
    } catch (err) {
      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },
};
