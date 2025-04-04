import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../../assets/style/sellersupport.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Complaint from './Complaint/SellerComplaint';
import Feedback from './Feedback/Feedback';
import EditProfile from './UpdateProfile/EditProfileList'
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';

const SellerSupport = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage = localStorage.getItem("admin_id");

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1)
    const [supportList, setSupportList] = useState([])
    const [totalItems, setTotalIems] = useState()
    const listPerPage = 5

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/supplier-support/complaint':
                return 'complaint';
            case '/admin/supplier-support/feedback':
                return 'feedback';
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
            case 'feedback':
                navigate('/admin/supplier-support/feedback');
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
            navigate("/admin/login");
            return;
        }

        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: 'supplier',
            supportType: activeLink,
            pageNo: currentPage,
            pageSize: listPerPage,
        }

        postRequestWithToken('admin/get-support-list', obj, async (response) => {
            if (response.code === 200) {
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
                                <div className={styles.supportHead}>Complaint</div>
                            </div>
                            <div
                                onClick={() => handleLinkClick('feedback')}
                                className={`${activeLink === 'feedback' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                            >
                                <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                                <div className={styles.supportHead}>Feedback</div>
                            </div>

                            <div
                                onClick={() => handleLinkClick('editprofile')}
                                className={`${activeLink === 'editprofile' ? styles.active : ''} ${styles['invoice-wrapper-left-text']}`}
                            >
                                <DescriptionOutlinedIcon className={styles['invoice-wrapper-left-icons']} />
                                <div className={styles.supportHead}>Edit Profile Requests</div>
                            </div>
                        </div>
                        <div className={styles[`invoice-wrapper-right`]}>
                            {activeLink === 'complaint' &&
                                <Complaint
                                    supportList={supportList}
                                    handlePageChange={handlePageChange}
                                    currentPage={currentPage}
                                    totalItems={totalItems}
                                    listPerPage={listPerPage}
                                />}
                            {activeLink === 'feedback' &&
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
