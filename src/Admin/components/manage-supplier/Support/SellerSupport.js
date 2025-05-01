import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "../../../assets/style/secondsidebar.module.css";
import { BiSupport } from "react-icons/bi";
import Complaint from './Complaint/SellerComplaint';
import Feedback from './Feedback/Feedback';
import EditProfile from './UpdateProfile/EditProfileList'
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';

const SellerSupport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const adminIdSessionStorage = localStorage?.getItem("admin_id");
    const adminIdLocalStorage = localStorage?.getItem("admin_id");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1)
    const [supportList, setSupportList] = useState([])
    const [totalItems, setTotalIems] = useState()
    const listPerPage = 8
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }
    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/supplier-support/complaint':
                return 'complaint';
            case '/admin/supplier-support/enquiry':
                return 'enquiry';
            case '/admin/supplier-support/edit-profile':
                return 'editprofile';
            default:
                return 'complaint';
        }
    };
    const activeLink = getActiveLinkFromPath(location.pathname);
    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'complaint':
                navigate('/admin/supplier-support/complaint');
                break;
            case 'enquiry':
                navigate('/admin/supplier-support/enquiry');
                break;
            case 'editprofile':
                navigate('/admin/supplier-support/edit-profile');
                break;
            default:
                navigate('/admin/supplier-support/complaint');
        }
    };
    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage?.clear();
            navigate("/admin/login");
            return;
        }
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: 'supplier',
            supportType : activeLink == "enquiry" ? "feedback" : activeLink,
            pageNo: currentPage,
            pageSize: listPerPage,
        }
        postRequestWithToken('admin/get-support-list', obj, async (response) => {
            if (response?.code === 200) {
                setSupportList(response.result.data)
                setTotalIems(response.result.totalItems)
            } else {
            }
            setLoading(false);
        })
    }, [currentPage, activeLink])
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.title}>Support</div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.sidebar}>
                            <div
                                onClick={() => handleLinkClick('complaint')}
                                className={`${activeLink === 'complaint' ? styles.active : ''} ${styles.tab}`}
                            >
                                 <BiSupport className={styles.icon} />
                                <div className={styles.text}>Complaint</div>
                            </div>
                            <div
                                onClick={() => handleLinkClick('enquiry')}
                                className={`${activeLink === 'enquiry' ? styles.active : ''} ${styles.tab}`}
                            >
                                <BiSupport className={styles.icon} />
                                <div className={styles.text}>Enquiry</div>
                            </div>

                            <div
                                onClick={() => handleLinkClick('editprofile')}
                                className={`${activeLink === 'editprofile' ? styles.active : ''} ${styles.tab}`}
                            >
                                <BiSupport className={styles.icon} />
                                <div className={styles.text}>Edit Profile Requests</div>
                            </div>
                        </div>
                        <div className={styles.main}>
                            {activeLink === 'complaint' &&
                                <Complaint
                                    supportList={supportList}
                                    handlePageChange={handlePageChange}
                                    currentPage={currentPage}
                                    totalItems={totalItems}
                                    listPerPage={listPerPage}
                                />}
                            {activeLink === 'enquiry' &&
                                <Feedback
                                    supportList={supportList}
                                    handlePageChange={handlePageChange}
                                    currentPage={currentPage}
                                    totalItems={totalItems}
                                    listPerPage={listPerPage}

                                />}
                                
                                {activeLink === 'editprofile' &&
                                <EditProfile
                                    supportList={supportList}
                                    handlePageChange={handlePageChange}
                                    currentPage={currentPage}
                                    totalItems={totalItems}
                                    listPerPage={listPerPage}

                                />}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SellerSupport;
