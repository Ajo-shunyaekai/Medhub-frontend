import axios from 'axios';
axios.defaults.baseURL                       = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type']  = 'application/json';
axios.defaults.headers.post['authorization'] = process.env.REACT_APP_Authorization;
// axios.defaults.withCredentials               = true

export const postRequest = async (URL, requestData, callback) => {
    try {
        const response  = await axios.post(URL, requestData);
        // return response.data;
        return callback(response.data);

    } catch (err) {
        return callback({code : 500, message : 'Connection faild, please start node server'});
    }
}

export const getRequest = async (URL, requestData, callback) => {
    try {
        const response = await axios.get(URL, {
            params: requestData, // Attach any query params if needed
            headers: {
                Authorization: process.env.REACT_APP_Authorization || '',
                'Content-Type': 'application/json',
                access_token: sessionStorage.getItem('token') || localStorage.getItem('token'), // Include tokens if required
            },
            withCredentials: true, // Ensure credentials are sent
        });

        console.log('GET Request URL:', URL);
        console.log('Response:', response.data);

        return callback(response.data);

    } catch (err) {
        console.error('Error in GET Request:', err);
        return callback({ code: 500, message: 'Connection failed, please start node server' });
    }
};


export const postRequestWithFile = async (URL, requestData, callback) => {
    try {
        const response = await axios({
            method  : "POST",
            url     : URL,
            data    : requestData,
            headers : {
                // "access_token" : sessionStorage.getItem('buyer_token') || localStorage.getItem('buyer_token'),
                "Content-Type" : "multipart/form-data",                
                "user_type" : (sessionStorage.getItem('buyer_id') || localStorage.getItem('buyer_id')) ? "Buyer" : 
                (sessionStorage.getItem('supplier_id') || localStorage.getItem('supplier_id')) ? "Supplier" : (sessionStorage.getItem('admin_id') || localStorage.getItem('admin_id')) ? "Admin" : (sessionStorage.getItem('seller_id') || localStorage.getItem('seller_id')) ? "Seller" : undefined,
            }
        });
        // return response.data;
        return callback(response.data);

    } catch (err) {
        return callback({code : 500, message : 'Connection faild, please start node server'});
        // throw err;
    }
}

export const postRequestWithToken = async (URL, requestData, callback) => {
    try {
        const response = await axios({
            method  : "POST",
            url     : URL,    
            data    : requestData,
            // withCredentials : true,
            headers : {
                "access_token" : sessionStorage.getItem('token') || localStorage.getItem('token'),
                "buyer_id"     : sessionStorage.getItem('buyer_id') || localStorage.getItem('buyer_id'),
                // access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IE1heSAwMiAyMDI0IDExOjM2OjE2IEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsImJ1eWVySWQiOiJCVVktcDQ4MHhxdXNjeiIsImlhdCI6MTcxNDYyOTk3Nn0.NADTShvxaTLQBizjnmA9-NC1v-jFcFcLqrx5yOwAP8g',
                "Content-Type" : "application/json",
                "user_type" : (sessionStorage.getItem('buyer_id') || localStorage.getItem('buyer_id')) ? "Buyer" : 
                (sessionStorage.getItem('supplier_id') || localStorage.getItem('supplier_id')) ? "Supplier" : (sessionStorage.getItem('admin_id') || localStorage.getItem('admin_id')) ? "Admin" : (sessionStorage.getItem('seller_id') || localStorage.getItem('seller_id')) ? "Seller" : undefined,
            } 
        });
        
        if(response.status == 401){ 
            sessionStorage.clear();

        } else {  // if(response.status == 200)
            return callback(response.data);

        } 
    } catch (err) {
        return callback({code : 500, message : 'Connection failed, please start node server '});
    }
}

export const postRequestWithTokenAndFile = async (URL, requestData, callback) => {
    try {
        const response = await axios({
            method  : "POST",
            url     : URL,
            data    : requestData,
            headers : {
                "access_token" : sessionStorage.getItem('token') || localStorage.getItem('token'),
                "buyer_id"     :  sessionStorage.getItem('buyer_id') || localStorage.getItem('buyer_id'),
                "Content-Type" : "multipart/form-data",                
                "user_type" : (sessionStorage.getItem('buyer_id') || localStorage.getItem('buyer_id')) ? "Buyer" : 
                (sessionStorage.getItem('supplier_id') || localStorage.getItem('supplier_id')) ? "Supplier" : (sessionStorage.getItem('admin_id') || localStorage.getItem('admin_id')) ? "Admin" : (sessionStorage.getItem('seller_id') || localStorage.getItem('seller_id')) ? "Seller" : undefined,
            }
        });
        return callback(response.data);

    } catch (err) {
        return callback({code : 500, message : 'Connection faild, please start node server '});

    }
}

export const checkAuth = async () => {
}

