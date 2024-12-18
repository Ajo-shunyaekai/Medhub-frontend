import { ContinuousColorLegend } from '@mui/x-charts';
import axios from 'axios';
axios.defaults.baseURL                       = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type']  = 'application/json';
axios.defaults.headers.post['authorization'] = process.env.REACT_APP_Authorization;
// axios.defaults.withCredentials               = true

export const getRequestTest = async(URL)=>{
    try {
        const response = await axios.get(URL)

        console.log(`response of get request : ${response?.data}`)
        
    } catch (error) {
        // return callback({code : 500, message : 'Connection faild, please start node server'});        
        console.log(`Error in get request: ${error}  `)
    }

}
export const postRequest = async (URL, requestData, callback) => {
    try {
        
        const response  = await axios.post(URL, requestData);
        // return response.data;
        return callback(response.data);

    } catch (err) {
        return callback({code : 500, message : 'Connection faild, please start node server'});
        // throw err;
    }
}

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
            method          : "POST",
            url             : URL,    
            data            : requestData,
            // withCredentials : true,
            headers : {
                "access_token" : sessionStorage.getItem('token') || localStorage.getItem('token'),
                "supplier_id" : sessionStorage.getItem('supplier_id') || localStorage.getItem('supplier_id'),
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
                "supplier_id"     :  sessionStorage.getItem('supplier_id') || localStorage.getItem('supplier_id'),
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

