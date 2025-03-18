import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './addproductlist.css';
import styles from './product.module.css';
import SecondaryMarket from './SecondaryMarket';
import NewProduct from './NewProduct';
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsList } from "../../../../redux/reducers/productSlice";
import Loader from '../../SharedComponents/Loader/Loader';

const Product = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.productReducer);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5


    const [medicineType, setMedicineType] = useState(() => {

        switch (location.pathname) {
            case '/supplier/product/newproduct':
                return 'new';
            case '/supplier/product/secondarymarket':
                return 'secondary market';
            default:
                return 'new';
        }
    });


    const getActiveButtonFromPath = (path) => {
        switch (path) {
            case '/supplier/product/newproduct':
                return 'newproduct';
            case '/supplier/product/secondarymarket':
                return 'secondarymarket';
            default:
                return 'newproduct';
        }
    };

    const activeButton = getActiveButtonFromPath(location.pathname);

    const handleButtonClick = (button) => {
        setCurrentPage(1)
        switch (button) {
            case 'newproduct':
                setMedicineType('new')
                navigate('/supplier/product/newproduct');
                break;
            case 'secondarymarket':
                setMedicineType('secondary market')
                navigate('/supplier/product/secondarymarket');
                break;
            default:
                navigate('/supplier/product/newproduct');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage.getItem("supplier_id");
        const supplier_id = sessionStorage.getItem("_id") || localStorage.getItem("_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        const fetchData = async () => {
            
            const marketType = activeButton === 'newproduct' ? 'new' : 'secondary';
            const response = await dispatch(
                fetchProductsList(`product?market=${marketType}&supplier_id=${supplier_id}&page_no=${currentPage}&page_size=${itemsPerPage}`)
            );
            if (response.meta.requestStatus === 'fulfilled') {
                console.log('Products fetched successfully:', response.payload);
                setTotalItems(response.payload?.totalItems);
                setLoading(false);
            }
        };
    
        fetchData();
    }, [dispatch, currentPage, medicineType]);
    

    return (
        <>
            <div className={styles.productContainer}>
                <div className={styles.productHead}>
                    Products
                </div>
                <div className={styles.productButtonSection}>
                    <div
                        className={`${styles.newProductButton} ${activeButton === 'newproduct' ? styles.active : ''}`}
                        onClick={() => handleButtonClick('newproduct')}
                    >
                        New Product
                    </div>
                    <div
                        className={`${styles.secondaryButton} ${activeButton === 'secondarymarket' ? styles.active : ''}`}
                        onClick={() => handleButtonClick('secondarymarket')}
                    >
                        Secondary Market
                    </div>
                </div>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {activeButton === 'newproduct' &&
                            <NewProduct
                                products={products?.products}
                                totalItems={totalItems}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePageChange={handlePageChange}
                            />}
                        {activeButton === 'secondarymarket' &&
                            <SecondaryMarket
                                products={products?.products}
                                totalItems={totalItems}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePageChange={handlePageChange}
                            />}
                    </>
                )}
            </div>
        </>
    )
}

export default Product;

