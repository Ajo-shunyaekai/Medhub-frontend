import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["authorization"] =
  process.env.REACT_APP_Authorization;
// axios.defaults.withCredentials               = true

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
  }
};

export const postRequestWithFile = async (URL, requestData, callback) => {
  try {
    const response = await axios({
      method: "POST",
      url: URL,
      data: requestData,
      headers: {
        // "accesstoken" : localStorage.getItem('buyer_token') || localStorage.getItem('buyer_token'),
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
        // accesstoken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiV2VkIEp1bCAxNyAyMDI0IDEzOjIyOjQzIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsImVtYWlsIjoiYWRtaW5Ac2h1bnlhZWthaS50ZWNoIiwiaWF0IjoxNzIxMjAyNzYzfQ.7KnHj1ywbLqb7B8OzrIuRmScx_gzM8y-7iCi2L3PWLk',
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
        buyer_id: localStorage.getItem("buyer_id"),
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

export const postReqCSVDownload = async (URL, requestData, fileName) => {
  try {
    axios
      .post(URL, requestData, {
        responseType: "blob", // Handle response as a blob for downloading
        headers: {
          "Content-Type": "application/json",
          authorization: process.env.REACT_APP_Authorization,
          accesstoken: localStorage.getItem("token"),
          token1: localStorage.getItem("token1"),
          token2: localStorage.getItem("token2"),
          buyer_id: localStorage.getItem("buyer_id"),
          supplier_id: localStorage.getItem("supplier_id"),
          admin_id: localStorage.getItem("admin_id"),
          partner_id: localStorage.getItem("partner_id"),
          usertype: localStorage.getItem("buyer_id")
            ? "Buyer"
            : localStorage.getItem("supplier_id")
            ? "Supplier"
            : localStorage.getItem("admin_id")
            ? "Admin"
            : localStorage.getItem("seller_id")
            ? "Seller"
            : localStorage.getItem("partner_id")
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
};

export const checkAuth = async () => {};
