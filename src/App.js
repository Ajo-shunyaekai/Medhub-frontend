import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BuyerSidebar from './Buyer/BuyerRoutes/Router';
import SupplierSidebar from './Supplier/components/SupplierSidebar.js';
import AdminSidebar from './Admin/components/AdminSidebar.js';

// import BuyerSidebar from './components/BuyerSidebar.js';
// import SupplierSidebar from './Supplier/components/SupplierSidebar.js'
// import AdminSidebar from './Admin/components/AdminSidebar.js';
import { postRequestWithToken } from './api/Requests.js';
import { apiRequests } from './api/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from './redux/reducers/userDataSlice.js';

// const socket = io('http://localhost:3333', {
//     transports: ['websocket'],
//     withCredentials: true
//   }); 

    const activekey = () => {
        var res          = window.location.pathname;
        var baseUrl      = ''; 
        baseUrl          = baseUrl.split("/");
        res              = res.split("/");
        res              = res.length > 0 ? res[baseUrl.length] : "/";
        res              = res ? "/" + res : "/";

        if (res === '/') {
            res = '/buyer';
        }
        return res
    }
    
    
    function App() {
        const [cssFile, setCssFile] = useState()

        const _id = sessionStorage?.getItem('_id') || localStorage?.getItem('_id');
        const dispatch = useDispatch();
        const {user} = useSelector(state=>state?.userReducer)
        // console.log(`loggedIn user's profile details : ${user?._id}`)

        useEffect(()=>{
            _id && dispatch(fetchUserData(_id))
        },[_id])

    useEffect(() => {
        const route = activekey();
        if (route.includes('buyer')) {
            import('./App.css').then(() => setCssFile('App.css'));
        } else if (route.includes('supplier')) {
            import('./SupplierApp.css').then(() => setCssFile('SupplierApp.css'));
        } else if (route.includes('admin')) {
            import('./AdminApp.css').then(() => setCssFile('AdminApp.css'));
        }
    }, []);

    const renderSidebar = () => {
        if (activekey().includes('buyer')) {
            return <BuyerSidebar />;
        } else if (activekey().includes('supplier')) {
            return <SupplierSidebar />;
        } else if (activekey().includes('admin')) {
            return <AdminSidebar />;
        }
        return null;
    };

    return (
            <div className="App">
                <ToastContainer />
                {renderSidebar()}
            </div>
    );
}

export default App;
