import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../api';
import styles from './NewOrder.module.css';

import Main from '../UI/Main/Main';
import OrderList from './OrderList';

import order_list from '../../assets/images/dashboard/order_list.svg'
import ActiveOrder from './ActiveOrders/ActiveOrder';
import CompletedOrder from './CompletedOrders/CompleteOrder';
import PendingOrder from './PendingOrders/PendingOrders'
import OngoingOrder from './OngoingOrders/OngoingOrders'
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../SharedComponents/Loader/Loader';
import DataTable from 'react-data-table-component';

function NewOrder() {
    const location = useLocation();
    const navigate = useNavigate()

    const [loading, setLoading]         = useState(true);
    const [list, setList]               = useState([])
    const [totalList, setTotalList]     = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 5;

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/logistics/order/active':
                return 'active';
            case '/logistics/order/completed':
                return 'completed';
            case '/logistics/order/pending':
                return 'pending';
            // case '/logistics/order/ongoing':
            //     return 'ongoing';
            default:
                return 'pending';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'active':
                navigate('active');
                break;
            case 'completed':
                navigate('completed');
                break;
            case 'pending':
                navigate('pending');
                break;
            // case 'ongoing':
            //     navigate('ongoing');
            //     break;
            default:
                navigate('pending');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const fetchData = async ()=> {
        const partnerIdSessionStorage = localStorage.getItem("partner_id");
        const partnerIdLocalStorage   = localStorage.getItem("partner_id");
    
        if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
        navigate("/logistics/login");
        return;
        }
        const obj = {
            partner_id   : partnerIdSessionStorage || partnerIdLocalStorage,
            status       : activeLink,
            page_no      : currentPage, 
            limit        : listPerPage,
        }
    
        
        try {
            const response = await apiRequests.getRequest(`logistics/get-logistics-request-list?status=${activeLink}&pageNo=${currentPage}&pageSize=${listPerPage}`)
            if (response.code === 200) {
                setList(response.result.data)
                setTotalList(response.result.totalItems)
            }
            
        } catch (error) {
            toast(error.message, {type:'error'})
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    },[activeLink, currentPage])

  return (
    <Main title="Logistics Requests">

        <div className={styles.requestContainer}>
            <div className={styles.buttonContainer}>
                <button  className={`${styles.button} ${activeLink === 'pending' ? styles.activeButton : ''}`}  onClick={() => handleLinkClick('pending')}>
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
                <OrderList 
                    list             = {list}
                    totalList        = {totalList}
                    currentPage      = {currentPage}
                    listPerPage      = {listPerPage}
                    handlePageChange = {handlePageChange}
                    activeLink       = {activeLink}
                />
            </div>
        </div>
    </Main>
  )
}

export default NewOrder;

{/* <div className="order-container">
    <div className="order-container-left">
        <div onClick={() => handleLinkClick('pending')} className={activeLink === 'pending' ? 'active order-left-wrapper' : 'order-left-wrapper'}>
            <img src={order_list} alt="order icon" />
            <div>Pending Requests</div>
        </div>
        <div onClick={() => handleLinkClick('active')} className={activeLink === 'active' ? 'active order-left-wrapper' : 'order-left-wrapper'}>
            <img src={order_list} alt="order icon" />
            <div>Active Requests</div>
        </div>
        <div onClick={() => handleLinkClick('completed')} className={activeLink === 'completed' ? 'active order-left-wrapper' : 'order-left-wrapper'}>
            <img src={order_list} alt="order icon" />
            <div>Completed Requests</div>
        </div>


    </div>

    <div className="order-container-right">
        <div responsive="xl" className='order-table-responsive'>

            {
                activeLink === 'active' ?
                    <ActiveOrder
                        list={list}
                        totalList={totalList}
                        currentPage={currentPage}
                        listPerPage={listPerPage}
                        handlePageChange={handlePageChange}
                        activeLink={activeLink}
                    />
                    : activeLink === 'completed' ?
                        <CompletedOrder
                            list={list}
                            totalList={totalList}
                            currentPage={currentPage}
                            listPerPage={listPerPage}
                            handlePageChange={handlePageChange}
                            activeLink={activeLink}
                        /> :
                        activeLink === 'pending' ?
                            <PendingOrder
                                list={list}
                                totalList={totalList}
                                currentPage={currentPage}
                                listPerPage={listPerPage}
                                handlePageChange={handlePageChange}
                                activeLink={activeLink}
                            /> : 
                            activeLink === 'ongoing' ?
                            <OngoingOrder
                                list={list}
                                totalList={totalList}
                                currentPage={currentPage}
                                listPerPage={listPerPage}
                                handlePageChange={handlePageChange}
                                activeLink={activeLink}
                            /> : ''
            }


        </div>
    </div>
</div> */}