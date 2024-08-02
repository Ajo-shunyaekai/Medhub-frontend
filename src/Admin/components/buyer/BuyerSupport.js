import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../style/sellersupport.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BuyerComplaint from './BuyerComplaint';
import BuyerFeedback from './BuyerFeedback';
import { postRequestWithToken } from '../../api/Requests';

const SellerSupport = () => {
    const location = useLocation();
    const navigate = useNavigate();
       const adminIdSessionStorage = sessionStorage.getItem("admin_id");
        const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/buyer-support/complaint':
                return 'complaint';
            case '/admin/buyer-support/feedback':
                return 'feedback';
            default:
                return 'complaint';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'complaint':
                navigate('/admin/buyer-support/complaint');
                break;
            case 'feedback':
                navigate('/admin/buyer-support/feedback');
                break;
            default:
                navigate('/admin/buyer-support/complaint');
        }
    };

    const [currentPage, setCurrentPage] = useState(1)
    const [supportList, setSupportList] = useState([])
    const [totalItems, setTotalIems]    = useState()
    const listPerPage = 2

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
        navigate("/admin/login");
        return;
        }
        const obj = {
            admin_id  : adminIdSessionStorage || adminIdLocalStorage,
            filterKey : 'buyer',
            supportType : activeLink,
            pageNo    : currentPage, 
            pageSize  : listPerPage,
        }

        postRequestWithToken('admin/support-list', obj, async (response) => {
            if (response.code === 200) {
                setSupportList(response.result.data)
                setTotalIems(response.result.totalItems)
            } else {
               console.log('error in support-list api',response);
            }
        })
    },[currentPage, activeLink])

    return (
        <>
            <div className={styles[`invoice-container`]}>
                <div className={styles['complete-container-invoice-section']}>
                    <div className={styles['complete-conatiner-head']}>Support</div>
                </div>
                <div className={styles[`invoice-wrapper`]}>
                    <div className={styles[`invoice-wrapper-left`]}>
                        <div
                            onClick={() => handleLinkClick('complaint')}
                            className={`${activeLink === 'complaint' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div>Complaint</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('feedback')}
                            className={`${activeLink === 'feedback' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                            <div>Feedback</div>
                        </div>
                    </div>
                    <div className={styles[`invoice-wrapper-right`]}>
                        {activeLink === 'complaint' && 
                        <BuyerComplaint
                            supportList = {supportList}
                            handlePageChange = {handlePageChange}
                            currentPage = {currentPage}
                            totalItems ={totalItems}
                            listPerPage={listPerPage}
                        />}
                        {activeLink === 'feedback' && 
                        <BuyerFeedback 
                            supportList = {supportList}
                            handlePageChange = {handlePageChange}
                            currentPage = {currentPage}
                            totalItems ={totalItems}
                            listPerPage={listPerPage}
                        />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SellerSupport;
