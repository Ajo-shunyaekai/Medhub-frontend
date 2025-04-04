import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../../assets/style/order.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useDispatch, useSelector } from "react-redux";
import { postRequestWithToken } from '../../../api/Requests';
import ApprovedNewProducts from './ApprovedNewProducts';
import ApprovedSecondaryProducts from './ApprovedSecondaryProducts';
import Loader from '../../shared-components/Loader/Loader';
import { apiRequests } from '../../../../api';
import { fetchProductsList } from '../../../../redux/reducers/productSlice';

const ApprovedProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
 
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");
 
    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/approved-product/newproduct':
                return 'newproduct';
                case '/admin/approved-product/secondary':
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
                navigate('/admin/approved-product/newproduct');
                break;
                case 'secondary':
                navigate('/admin/approved-product/secondary');
                break;
            default:
                navigate('/admin/approved-product/newproduct');
        }
    };
 
    const [loading, setLoading]             = useState(true);
    const [productList, setProductList]     = useState([])
    const [medicineList, setMedicineList] = useState([])
    const [totalProducts, setTotalProducts] = useState()
    const [currentPage, setCurrentPage] = useState(1); 
    const listPerPage = 5;
 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
 
    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!adminIdSessionStorage && !adminIdLocalStorage) {
    //         navigate("/admin/login");
    //         return;
    //     }
    //     const medicineType = activeLink === 'newproduct' ? 'new' : activeLink === 'secondary' ? 'secondary market' : activeLink;
    //     const obj = {
    //         admin_id     : adminIdSessionStorage || adminIdLocalStorage,
    //         medicineType : medicineType,
    //         status       : 1,
    //         pageNo       : currentPage, 
    //         pageSize     : listPerPage,
    //     }
 
    //     postRequestWithToken('admin/get-medicine-list', obj, async (response) => {
    //         if (response.code === 200) {
    //             setProductList(response.result.data);
    //             setTotalProducts(response.result.totalItems);
    //         } else {
    //         }
    //         setLoading(false);
    //       })
    //       try {
    //           const response = await apiRequests.getRequest(`medicine/get-all-medicines-list?pageNo=${currentPage}&pageSize=${listPerPage}&medicine_type=${medicineType}&status=${1}`)
    //           if(response?.code !== 200){
    //             return
    //           }
    //           setProductList(response.result.data);
    //           setTotalProducts(response.result.totalItems);
    //         // postRequestWithToken(`medicine/get-all-medicines-list?pageNo=${currentPage}&pageSize=${listPerPage}&medicine_type=${medicineType}&status=${1}`, obj, async (response) => {
    //         //     if (response.code === 200) {
    //         //         setProductList(response.result.data);
    //         //         setTotalProducts(response.result.totalItems);
    //         //     } else {
    //         //     }
    //         // })
    //       } catch (error) {
    //       } finally{
    //         setLoading(false);
    //       }
    //     }
    //     fetchData()
    // },[activeLink, currentPage])


    useEffect(() => {
        const fetchProducts = async() => {
            if (!adminIdSessionStorage && !adminIdLocalStorage) {
                navigate("/admin/login");
                return;
            }

            const marketType = activeLink === 'newproduct' ? 'new' : activeLink === 'secondary' ? 'secondary' : activeLink;

            const response = await dispatch(
                                fetchProductsList(`product?market=${marketType}&page_no=${currentPage}&page_size=${listPerPage}`)
                            );
                if (response.meta.requestStatus === 'fulfilled') {
                    setMedicineList(response.payload.products)
                    setTotalProducts(response.payload?.totalItems);
                    setLoading(false);
                }
        }
        fetchProducts()
    }, [currentPage, activeLink])

    const handleDownload = () => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
        navigate("/admin/login");
        return;
        }
        const medicineType = activeLink === 'newproduct' ? 'new' : activeLink === 'secondary' ? 'secondary market' : activeLink;
        const obj = {
            admin_id     : adminIdSessionStorage || adminIdLocalStorage,
            medicineType : medicineType,
            status       : 1,
            pageNo       : currentPage, 
            pageSize     : listPerPage,
        }

        apiRequests?.postReqCSVDownload('medicine/get-all-medicines-list-csv', obj, `${activeLink === 'newproduct' ? 'New Products' : 'Secondary Market Products'} Approved.csv`)        
    };

    return (
        <>
        {loading ? (
                     <Loader />
                ) : (
            <div className={styles[`order-container`]}>
                <div className={styles['complete-container-order-section']}>
                    <div className={styles['complete-conatiner-head']}>Approved Products List</div>
                </div>
                <div className={styles[`order-wrapper`]}>
                    <div className={styles[`order-wrapper-left`]}>
                        <div
                            onClick={() => handleLinkClick('newproduct')}
                            className={`${activeLink === 'newproduct' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Approved New Products</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('secondary')}
                            className={`${activeLink === 'secondary' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Approved Secondary Products</div>
                        </div>
                    </div>
                    <div className={styles[`order-wrapper-right`]}>
                        {activeLink === 'newproduct' &&
                         <ApprovedNewProducts
                        //  productList     = {productList} 
                        productList={medicineList}
                         totalProducts    = {totalProducts} 
                         currentPage      = {currentPage}
                         listPerPage      = {listPerPage}
                         handlePageChange = {handlePageChange}
                         activeLink       = {activeLink}
                         />}
                        {activeLink === 'secondary' &&
                        <ApprovedSecondaryProducts
                        // productList         = {productList} 
                        productList={medicineList}
                        totalProducts       = {totalProducts} 
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

export default ApprovedProduct; 