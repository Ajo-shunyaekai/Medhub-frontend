import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './NewVehicleList.module.css';

import ActiveOrder from "../../Orders/ActiveOrders/ActiveOrder";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api";
// import "./VehicleList.css";

// import './vehicleorder.css';
// import './vehiclelists.css';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import moment from 'moment/moment';
import Section from "../../UI/Section";
import Main from "../../UI/Main/Main";
import VehicleLists from "./VehicleLists";

function NewVehicleList() {
    const navigate                        = useNavigate();
    const [loading, setLoading]           = useState(true);
    const [list, setList]                 = useState([]);
    const [totalList, setTotalList]       = useState();
    const [currentPage, setCurrentPage]   = useState(1);
    const listPerPage                     = 5;

    const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    };

    const fetchData = async () => {
    const partnerIdSessionStorage = sessionStorage.getItem("partner_id");
    const partnerIdLocalStorage = localStorage.getItem("partner_id");

    if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
        navigate("/logistics/login");
        return;
    }

    try {
        const response = await apiRequests.getRequest(
        `logistics/get-logistics-request-list?status=active&pageNo=${currentPage}&pageSize=${listPerPage}`
        );
        if (response.code === 200) {
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
                list={list}
                totalList={totalList}
                currentPage={currentPage}
                listPerPage={listPerPage}
                handlePageChange={handlePageChange}
                page="pickupOrder"
            />
        </div>
    </Main>
  )
}

export default NewVehicleList;