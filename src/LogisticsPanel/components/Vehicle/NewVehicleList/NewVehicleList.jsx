import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api";
import styles from './NewVehicleList.module.css';
import Main from "../../UI/Main/Main";
import VehicleLists from "./VehicleLists";


// import "./VehicleList.css";
// import './vehicleorder.css';
// import './vehiclelists.css';
import ActiveOrder from "../../Orders/ActiveOrders/ActiveOrder";
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import moment from 'moment/moment';
import Section from "../../UI/Section";

function NewVehicleList() {
    const navigate                        = useNavigate();
    const [loading, setLoading]           = useState(true);
    const [list, setList]                 = useState([]);
    const [totalList, setTotalList]       = useState();
    const [currentPage, setCurrentPage]   = useState(1);
    const listPerPage                     = 10;

    const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    };

    const fetchData = async () => {
    const partnerIdSessionStorage = localStorage?.getItem("partner_id");
    const partnerIdLocalStorage = localStorage?.getItem("partner_id");

    if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
        localStorage?.clear();
        navigate("/logistics/login");
        return;
    }

    try {
        const response = await apiRequests.getRequest(
        `logistics/get-logistics-request-list?status=active&pageNo=${currentPage}&pageSize=${listPerPage}`
        );
        if (response?.code === 200) {
        setList(response.result.data);
        setTotalList(response.result.totalItems);
        }
    } catch (error) {
        toast(error.message, { type: "error" });
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
    fetchData();
    }, [currentPage]);
  return (
    <Main title='Vehicle Lists'>
        <div className={styles.vehicleListContainer}>
            <VehicleLists 
                list             = {list}
                totalList        = {totalList}
                currentPage      = {currentPage}
                listPerPage      = {listPerPage}
                handlePageChange = {handlePageChange}
                page             = "pickupOrder"
            />
        </div>
    </Main>
  )
}

export default NewVehicleList;