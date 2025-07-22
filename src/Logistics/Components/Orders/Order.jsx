import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "../../Assets/Styles/secondsidebar.module.css"; 
import { TbReorder } from "react-icons/tb";
import ActiveOrder from './ActiveOrder/ActiveOrder';
import CompletedOrder from './CompletedOrder/CompletedOrder';
import Loader from '../SharedComponents/Loader/Loader';
import PendingOrder from './PendingOrder/PendingOrder';
import { toast } from 'react-toastify'; 
import { apiRequests } from '../../../api/index';


const Order = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const getActiveLinkFromPath = (path) => {
      switch (path) {
          case '/logistic/order/active':
              return 'active';
          case '/logistic/order/completed':
              return 'completed';
          case '/logistic/order/pending':
               return 'pending';
          default:
              return 'active';
      }
  };

  const activeLink = getActiveLinkFromPath(location.pathname);

  const handleLinkClick = (link) => {
      setCurrentPage(1);
      switch (link) {
          case 'active':
              navigate('/logistic/order/active');
              break;
          case 'completed':
              navigate('/logistic/order/completed');
              break;
           case 'pending':
               navigate('/logistic/order/pending');
               break; 
          default:
              navigate('/logistic/order/active');
      }
  };

  const [show, setShow] = useState(false);
  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modal, setModal] = useState(false)

  const showModal = () => {
      setModal(!modal)
  }

  const [showOrder, showOrderDetails] = useState(false)

  const showOrderModal = () => {
      showOrderDetails(!showOrder)
  }

  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
  };
  
  const fetchData = async () => {
    const logisticsIdSessionStorage = localStorage?.getItem("partner_id");
    const logisticsIdLocalStorage = localStorage?.getItem("partner_id");

    if (!logisticsIdSessionStorage && !logisticsIdLocalStorage) {
         localStorage?.clear();
        navigate("/logistic/login"); 
        return;
    }
    const obj = {
        partner_id: logisticsIdSessionStorage || logisticsIdLocalStorage,
        filterKey: activeLink,
        page_no: currentPage,
        limit: ordersPerPage,
    }
 
    try {
        const response = await apiRequests.getRequest(`logistics/get-logistics-request-list?status=${activeLink}&pageNo=${currentPage}&pageSize=${ordersPerPage}`);
        console.log(response);
        if (response?.code === 200) {
            setOrderList(response.result.data)
            setTotalOrders(response.result.totalItems)
        }
    } catch (error) {
        toast(error.message, { type: 'error' })
    } finally {
        setLoading(false);
    } 
  }
   
  useEffect(() => {
    fetchData()
  }, [activeLink, currentPage]);


  return (
        <section>
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            Orders
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.sidebar}>
                            <div
                                onClick={() => handleLinkClick('active')}
                                className={`${styles.tab} ${activeLink === 'active' ? styles.active : ''}`}
                            >
                                <TbReorder className={styles.icon} />
                                <div className={styles.text}>Active Orders</div>
                            </div>
                            <div
                                onClick={() => handleLinkClick('completed')}
                                className={`${styles.tab} ${activeLink === 'completed' ? styles.active : ''}`}
                            >
                                <TbReorder className={styles.icon} />
                                <div className={styles.text}>Completed Orders</div>
                            </div>
                            <div
                                onClick={() => handleLinkClick('pending')}
                                className={`${styles.tab} ${activeLink === 'pending' ? styles.active : ''}`}
                            >
                                <TbReorder className={styles.icon} />
                                <div className={styles.text}>Pending Orders</div>
                            </div>
                        </div>

                        <div className={styles.main}>
                            {
                                activeLink === 'active' ?
                                    <ActiveOrder
                                        orderList={orderList}
                                        totalOrders={totalOrders}
                                        currentPage={currentPage}
                                        ordersPerPage={ordersPerPage}
                                        handlePageChange={handlePageChange}
                                        activeLink={activeLink}
                                    />
                                    : activeLink === 'completed' ?
                                        <CompletedOrder
                                            orderList={orderList}
                                            totalOrders={totalOrders}
                                            currentPage={currentPage}
                                            ordersPerPage={ordersPerPage}
                                            handlePageChange={handlePageChange}
                                            activeLink={activeLink}
                                        />
                                    : activeLink === 'pending' ?
                                        <PendingOrder
                                            orderList={orderList}
                                            totalOrders={totalOrders}
                                            currentPage={currentPage}
                                            ordersPerPage={ordersPerPage}
                                            handlePageChange={handlePageChange}
                                            activeLink={activeLink}
                                        />
                                    : ''    
                            }
                        </div>
                    </div>
                </div>
            )}
        </section>
  )
}

export default Order