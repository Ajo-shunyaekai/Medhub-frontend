import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BuyerSidebar from './Buyer/BuyerRoutes/Router';
import AdminSidebar from './Admin/AdminRoutes/Router';
import SupplierSidebar from './Supplier/SupplierRoutes/Router';
import LogisticsRoutes from './LogisticsPanel/LogisticsRoutes/Router'
import SubscriptionRoutes from './SubscriptionPlan/LandingSubscription'


const activekey = () => {
    var res          = window?.location?.pathname;
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

useEffect(() => {
    const route = activekey();
    if (route.includes('buyer')) {
        import('./App.css').then(() => setCssFile('App.css'));
    } else if (route.includes('supplier')) {
        import('./SupplierApp.css').then(() => setCssFile('SupplierApp.css'));
    } else if (route.includes('admin')) {
        import('./AdminApp.css').then(() => setCssFile('AdminApp.css'));
    }
    else if (route.includes('logistics')) {
        import('./logistics.css').then(() => setCssFile('logistics.css'));
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
    else if (activekey().includes('logistics')) {
        return <LogisticsRoutes/>;
    }
    else if (activekey().includes('subscription')) {
        return <SubscriptionRoutes/>;
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
