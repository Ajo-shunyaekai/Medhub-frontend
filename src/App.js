import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BuyerSidebar from './Buyer/BuyerRoutes/Router';
// import SupplierSidebar from './Supplier/components/SupplierSidebar.js';
// import AdminSidebar from './Admin/components/AdminSidebar.js';

const activekey = () => {
    let res = window.location.pathname;
    const baseUrl = ''; 
    const baseUrlParts = baseUrl.split("/");
    const resParts = res.split("/");
    res = resParts.length > 0 ? resParts[baseUrlParts.length] : "/";
    res = res ? "/" + res : "/";
    if (res === '/') {
        res = '/buyer';
    }
    return res;
};

function App() {
    const [cssFile, setCssFile] = useState('');

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
            // return <SupplierSidebar />;
        } else if (activekey().includes('admin')) {
            // return <AdminSidebar />;
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
