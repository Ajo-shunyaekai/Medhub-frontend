import React, { useEffect, useState } from 'react';
import styles from './NewOrder.module.css';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../api';

import Main from '../UI/Main/Main';
import OrderList from './OrderList';
import Loader from '../SharedComponents/Loader/Loader';

function NewOrder() {
  const [loading, setLoading]         = useState(true);
  const [list, setList]               = useState([]);
  const [totalList, setTotalList]     = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeLink, setActiveLink]   = useState('pending');
  const listPerPage = 10;

  const handleLinkClick = (link) => {
    setCurrentPage(1);
    setActiveLink(link);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchData = async () => {
    const partnerId = localStorage?.getItem("partner_id");

    if (!partnerId) {
      localStorage?.clear();
      window.location.href = "/logistics/login";
      return;
    }

    try {
      setLoading(true);
      const response = await apiRequests.getRequest(
        `logistics/get-logistics-request-list?status=${activeLink}&pageNo=${currentPage}&pageSize=${listPerPage}`
      );

      if (response?.code === 200) {
        setList(response.result.data);
        setTotalList(response.result.totalItems);
      }
    } catch (error) {
      toast(error.message, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeLink, currentPage]);

  return (
    <Main title="Orders">
      <div className={styles.requestContainer}>
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${activeLink === 'pending' ? styles.activeButton : ''}`} onClick={() => handleLinkClick('pending')}>
            Pending Requests
          </button>
          <button className={`${styles.button} ${activeLink === 'active' ? styles.activeButton : ''}`} onClick={() => handleLinkClick('active')}>
            Active Requests
          </button>
          <button className={`${styles.button} ${activeLink === 'completed' ? styles.activeButton : ''}`} onClick={() => handleLinkClick('completed')}>
            Completed Requests
          </button>
        </div>

        <div className={styles.tableContainer}>
          {loading ? (
            <Loader />
          ) : (
            <OrderList
              list={list}
              totalList={totalList}
              currentPage={currentPage}
              listPerPage={listPerPage}
              handlePageChange={handlePageChange}
              activeLink={activeLink}
            />
          )}
        </div>
      </div>
    </Main>
  );
}

export default NewOrder;