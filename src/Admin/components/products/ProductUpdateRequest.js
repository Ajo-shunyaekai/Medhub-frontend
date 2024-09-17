import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../style/order.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { postRequestWithToken } from '../../api/Requests';
import NewProductUpdateRequest from './NewProductUpdateRequest';
import SecondaryUpdateRequest from './SecondaryUpdateRequest';
import Loader from '../../../components/Loader';

const ProductUpdateRequest = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/product-update-requests/newproduct':
                return 'newproduct';
                case '/admin/product-update-requests/secondary':
                return 'secondary';
            default:
                return 'newproduct';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'newproduct':
                navigate('/admin/product-update-requests/newproduct');
                break;
                case 'secondary':
                navigate('/admin/product-update-requests/secondary');
                break;
            default:
                navigate('/admin/product-update-requests/newproduct');
        }
    };

    const [loading, setLoading]             = useState(true);
    const [productList, setProductList]     = useState([])
    const [totalProducts, setTotalProducts] = useState()
    const [currentPage, setCurrentPage]     = useState(1); 
    const listPerPage = 5;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }
        const medicineType = activeLink === 'newproduct' ? 'new_medicine' : activeLink === 'secondary' ? 'secondary_medicine' : activeLink;
        const obj = {
            admin_id     : adminIdSessionStorage || adminIdLocalStorage,
            medicineType : medicineType,
            status       : 0,
            pageNo       : currentPage, 
            pageSize     : listPerPage,
        }

        postRequestWithToken('admin/get-medicine-edit-request-list', obj, async (response) => {
            if (response.code === 200) {
                setProductList(response.result.data);
                setTotalProducts(response.result.totalItems);
            } else {
               console.log('error in order list api',response);
            }
            setLoading(false);
          })
    },[activeLink, currentPage])

    return (
        <>
        {loading ? (
                     <Loader />
                ) : (
            <div className={styles[`order-container`]}>
                <div className={styles['complete-container-order-section']}>
                    <div className={styles['complete-conatiner-head']}>Product Update Requests</div>
                </div>
                <div className={styles[`order-wrapper`]}>
                    <div className={styles[`order-wrapper-left`]}>
                        <div
                            onClick={() => handleLinkClick('newproduct')}
                            className={`${activeLink === 'newproduct' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>New Product Update Requests</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('secondary')}
                            className={`${activeLink === 'secondary' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Secondary Product Update Requests</div>
                        </div>
                    </div>
                    <div className={styles[`order-wrapper-right`]}>
                        {activeLink === 'newproduct' &&
                         <NewProductUpdateRequest
                            productList     = {productList} 
                            totalProducts    = {totalProducts} 
                            currentPage      = {currentPage}
                            listPerPage      = {listPerPage}
                            handlePageChange = {handlePageChange}
                            activeLink       = {activeLink}
                         />}
                        {activeLink === 'secondary' &&
                        <SecondaryUpdateRequest
                            productList     = {productList} 
                            totalProducts    = {totalProducts} 
                            currentPage      = {currentPage}
                            listPerPage      = {listPerPage}
                            handlePageChange = {handlePageChange}
                            activeLink       = {activeLink}
                        />}
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default ProductUpdateRequest; 