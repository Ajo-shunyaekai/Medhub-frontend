import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ActiveOrder from "../../Orders/ActiveOrders/ActiveOrder";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api";
import "./PickupOrders.css";
import Section from "../../UI/Section";

const PickupOrders = () => {
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
    const partnerIdSessionStorage = localStorage.getItem("partner_id");
    const partnerIdLocalStorage = localStorage.getItem("partner_id");

    if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
      localStorage.clear();
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
    <>
      <Section classes="pickup-order-main-container">
        <div className="order-name">Pickup Order's</div>
        <div className="order-container-right container mt-3">
          <div responsive="xl" className="order-table-responsive">
            <ActiveOrder
              list={list}
              totalList={totalList}
              currentPage={currentPage}
              listPerPage={listPerPage}
              handlePageChange={handlePageChange}
              page="pickupOrder"
            />
          </div>
        </div>
      </Section>
    </>
  );
};

export default PickupOrders;
