import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api";
import styles from './NewPickupOrder.module.css';

import Main from "../../UI/Main/Main";
import PickupOrderList from './PickupOrderList';

function NewPickupOrder() {
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
    const partnerIdLocalStorage   = localStorage.getItem("partner_id");

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
    <Main title="Pickup Order's">
        <div className={styles.pickupOrderContainer}>
            <PickupOrderList 
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

export default NewPickupOrder;