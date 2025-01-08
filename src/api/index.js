import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["authorization"] =
  process.env.REACT_APP_Authorization;
// axios.defaults.withCredentials               = true
 
export const apiRequests = {
  postRequestWithNoToken: async (URL, requestData) => {
    try {
      const response = await axios.post(URL, requestData);
      // return response.data;
      return response.data;
    } catch (err) {
      return {
        code: 500,
        message: "Connection faild, please start node server",
      };
    }
  },
 
  getRequest: async (URL, requestData) => {
    try {
      const response = await axios({
        method: "GET",
        url: URL,
        // withCredentials : true,
        headers: {
          authorization : process.env.REACT_APP_Authorization,
          access_token:
            sessionStorage.getItem("token") ||
            localStorage.getItem("token") ||
            undefined,
          buyer_id:
            sessionStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id") ||
            undefined,
          supplier_id:
            sessionStorage.getItem("supplier_id") ||
            localStorage.getItem("supplier_id") ||
            undefined,
          admin_id:
            sessionStorage.getItem("admin_id") ||
            localStorage.getItem("admin_id") ||
            undefined,
          "Content-Type": "application/json",
          user_type:
            sessionStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id")
              ? "Buyer"
              : sessionStorage.getItem("supplier_id") ||
                localStorage.getItem("supplier_id")
              ? "Supplier"
              : sessionStorage.getItem("admin_id") ||
                localStorage.getItem("admin_id")
              ? "Admin"
              : sessionStorage.getItem("seller_id") ||
                localStorage.getItem("seller_id")
              ? "Seller"
              : undefined,
        },
      });
 
      if (response.status == 401) {
        sessionStorage.clear();
      } else {
        // if(response.status == 200)
        return response.data;
      }
    } catch (err) {
      return {
        code: 500,
        message: "Connection failed, please start node server ",
      };
    }
  },
 
  postRequest: async (URL, requestData) => {
    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: requestData,
        // withCredentials : true,
        headers: {
          access_token:
            sessionStorage.getItem("token") ||
            localStorage.getItem("token") ||
            undefined,
          buyer_id:
            sessionStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id") ||
            undefined,
          supplier_id:
            sessionStorage.getItem("supplier_id") ||
            localStorage.getItem("supplier_id") ||
            undefined,
          admin_id:
            sessionStorage.getItem("admin_id") ||
            localStorage.getItem("admin_id") ||
            undefined,
          "Content-Type": "application/json",
          user_type:
            sessionStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id")
              ? "Buyer"
              : sessionStorage.getItem("supplier_id") ||
                localStorage.getItem("supplier_id")
              ? "Supplier"
              : sessionStorage.getItem("admin_id") ||
                localStorage.getItem("admin_id")
              ? "Admin"
              : sessionStorage.getItem("seller_id") ||
                localStorage.getItem("seller_id")
              ? "Seller"
              : undefined,
        },
      });
 
      if (response.status == 401) {
        sessionStorage.clear();
      } else {
        // if(response.status == 200)
        return response.data;
      }
    } catch (err) {
      return {
        code: 500,
        message: "Connection failed, please start node server ",
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
          access_token:
            sessionStorage.getItem("token") ||
            localStorage.getItem("token") ||
            undefined,
          buyer_id:
            sessionStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id") ||
            undefined,
          supplier_id:
            sessionStorage.getItem("supplier_id") ||
            localStorage.getItem("supplier_id") ||
            undefined,
          admin_id:
            sessionStorage.getItem("admin_id") ||
            localStorage.getItem("admin_id") ||
            undefined,
          "Content-Type": "multipart/form-data",
          user_type:
            sessionStorage.getItem("buyer_id") ||
            localStorage.getItem("buyer_id")
              ? "Buyer"
              : sessionStorage.getItem("supplier_id") ||
                localStorage.getItem("supplier_id")
              ? "Supplier"
              : sessionStorage.getItem("admin_id") ||
                localStorage.getItem("admin_id")
              ? "Admin"
              : sessionStorage.getItem("seller_id") ||
                localStorage.getItem("seller_id")
              ? "Seller"
              : undefined,
        },
      });
      // return response.data;
      return response.data;
    } catch (err) {
      return {
        code: 500,
        message: "Connection faild, please start node server",
      };
      // throw err;
    }
  },
 
  postReqCSVDownload : async (URL, requestData, fileName) => {
    try {
      axios.post(URL, requestData, {
        responseType: 'blob',  // Handle response as a blob for downloading
        headers: {
        'Content-Type': 'application/json',
        'authorization': process.env.REACT_APP_Authorization,
        'access_token': sessionStorage.getItem("token") || localStorage.getItem("token") || undefined,
        'buyer_id': sessionStorage.getItem("buyer_id") || localStorage.getItem("buyer_id") || undefined,
        'supplier_id': sessionStorage.getItem("supplier_id") || localStorage.getItem("supplier_id") || undefined,
        'admin_id': sessionStorage.getItem("admin_id") || localStorage.getItem("admin_id") || undefined,
        'user_type':
            sessionStorage.getItem("buyer_id") || localStorage.getItem("buyer_id")
            ? "Buyer"
            : sessionStorage.getItem("supplier_id") || localStorage.getItem("supplier_id")
            ? "Supplier"
            : sessionStorage.getItem("admin_id") || localStorage.getItem("admin_id")
            ? "Admin"
            : sessionStorage.getItem("seller_id") || localStorage.getItem("seller_id")
            ? "Seller"
            : undefined,
        },  // Include the headers
    })
    .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);  // Set the file name for download
        document.body.appendChild(link);
        link.click();
    })
    .catch(error => {
        console.error('There was an error downloading the CSV file!', error);
    });
    } catch (err) {
      return {
        code: 500,
        message: "Connection faild, please start node server",
      };
      // throw err;
    }
  },
  
};