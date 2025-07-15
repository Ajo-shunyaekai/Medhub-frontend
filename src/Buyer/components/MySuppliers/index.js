import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";
import { postRequestWithToken } from "../../../api/Requests";
import Loader from "../SharedComponents/Loader/Loader";
import { toast } from "react-toastify";
import { BsCardList } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa";
import SupplierList from "./MySupplierList";
import SupplierCard from "./MySupplierCard";

const MySuppliers = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [mySuppliers, setMySuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState();
  const [viewMode, setViewMode] = useState("list"); // Default to 'list'
  const itemsPerPage = 4;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      pageNo: currentPage,
      pageSize: itemsPerPage,
    };
    postRequestWithToken("buyer/my-supplier-list", obj, async (response) => {
      if (response?.code === 200) {
        setMySuppliers(response.result.data);
        setTotalItems(response.result.totalItems);
      } else {
        toast(response.message, { type: "error" });
      }
      setLoading(false);
    });
  }, [currentPage]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <div className={styles.section}>
            <span className={styles.mainHead}>My Supplier</span>
            <SupplierCard
              mySuppliers={mySuppliers}
              loading={loading}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              handlePageChange={handlePageChange}
            />
            {/* <div className={styles.tabContainer}>
              <button
                className={`${styles.tabButton} ${viewMode === 'list' ? styles.activeTab : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <BsCardList className={styles.tabIcon} />
              </button>
              <button
                className={`${styles.tabButton} ${viewMode === 'card' ? styles.activeTab : ''}`}
                onClick={() => setViewMode('card')}
                title="Card View"
              >
                <FaRegAddressCard className={styles.tabIcon} />
              </button>
            </div> */}
          </div>
          {/* {viewMode === 'list' ? (
            <SupplierList
              mySuppliers={mySuppliers}
              loading={loading}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              handlePageChange={handlePageChange}
            />
          ) : (
           
          )} */}
        </div>
      )}
    </>
  );
};

export default MySuppliers;
