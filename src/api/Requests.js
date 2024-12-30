import axios from 'axios';
import { user_type } from '../constants';
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
                access_token: sessionStorage.getItem('token') , // Include tokens if required
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
                "access_token" : sessionStorage.getItem('token') ,
                "buyer_id"     : sessionStorage.getItem('buyer_id') ,
                "supplier_id"  : sessionStorage.getItem("supplier_id"),
                "admin_id"     : sessionStorage.getItem("admin_id"),
                "Content-Type" : "multipart/form-data",                
                "user_type"    : user_type,
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
                "access_token" : sessionStorage.getItem('token') ,
                "buyer_id"     : sessionStorage.getItem('buyer_id') ,
                "supplier_id"  : sessionStorage.getItem("supplier_id"),
                "admin_id"     : sessionStorage.getItem("admin_id"),
                "Content-Type" : "application/json",
                "user_type"    : user_type,
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
                "access_token" : sessionStorage.getItem('token') ,
                "buyer_id"     : sessionStorage.getItem('buyer_id') ,
                "supplier_id"  : sessionStorage.getItem("supplier_id"),
                "admin_id"     : sessionStorage.getItem("admin_id"),
                "Content-Type" : "multipart/form-data",                
                "user_type"    : user_type,
            }
        });
        return callback(response.data);

    } catch (err) {
        return callback({code : 500, message : 'Connection faild, please start node server '});

    }
}

export const checkAuth = async () => {
}

