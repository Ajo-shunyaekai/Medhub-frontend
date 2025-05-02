// ProductButton.jsx
import React, { useEffect, useState } from 'react';
import styles from './productbutton.module.css';
import ProductCard from '../UiShared/ProductCards/ProductCard';
import OtherSuppliers from '../Details/SupplierMedicineCard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOtherSupplierProductsList, fetchProductDetail, fetchSupplierProductsList } from '../../../../redux/reducers/productSlice';

const ProductButton = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { productDetail } = useSelector((state) => state?.productReducer || {});

    const [activeButton, setActiveButton] = useState('similar-products');
    const [productList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 5;

    // Get active button from path
    const getActiveButtonFromPath = (path) => {
        switch (path) {
            case `/buyer/product-details/${id}/similar-products`:
                return 'similar-products';
            case `/buyer/product-details/${id}/other-supplier`:
                return 'other-supplier';
            default:
                return 'similar-products';
        }
    };

    // Handle button click and navigation
    const handleButtonClick = (button) => {
        setActiveButton(button);
        setCurrentPage(1); // Reset to first page on button change
        switch (button) {
            case 'similar-products':
                navigate(`/buyer/product-details/${id}/similar-products`);
                break;
            case 'other-supplier':
                navigate(`/buyer/product-details/${id}/other-supplier`);
                break;
            default:
                navigate(`/buyer/product-details/${id}/similar-products`);
        }
    };

    // Fetch product details
    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetail(`product/${id}`));
        }
    }, [id, dispatch]);

    // Fetch data based on active button
    useEffect(() => {
        const fetchData = async () => {
            let response;
            if (activeButton === 'similar-products') {
                const endpoint = `product/get-other-products/${id}?page_no=${currentPage}&page_size=${itemsPerPage}`;
                response = await dispatch(fetchOtherSupplierProductsList(endpoint));
            } else if (activeButton === 'other-supplier') {
                const endpoint = `product/get-suppliers/${id}?page_no=${currentPage}&page_size=${itemsPerPage}`;
                response = await dispatch(fetchSupplierProductsList(endpoint));
            }

            if (response?.meta?.requestStatus === 'fulfilled') {
                setProductList(response?.payload?.products || []);
                setTotalItems(response?.payload?.totalItems || 0);
            } else {
                setProductList([]);
                setTotalItems(0);
            }
        };
        fetchData();
    }, [id, dispatch, currentPage, activeButton]);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Update active button based on path
    useEffect(() => {
        setActiveButton(getActiveButtonFromPath(location.pathname));
    }, [location.pathname]);

    return (
        <div className={styles.main}>
            <div className={styles.section}>
                <div className={styles.innerSection}>
                    <div
                        className={`${styles.supplierBtn} ${activeButton === 'similar-products' ? styles.active : ''}`}
                        onClick={() => handleButtonClick('similar-products')}
                    >
                        Similar Products
                    </div>
                    <div
                        className={`${styles.productBtn} ${activeButton === 'other-supplier' ? styles.active : ''}`}
                        onClick={() => handleButtonClick('other-supplier')}
                    >
                        Other Supplier
                    </div>
                </div>
            </div>

         
            {activeButton === 'similar-products' && (
                <ProductCard
                    productList={productList}
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    heading={false}
                />
            )}
            {activeButton === 'other-supplier' && (
                <OtherSuppliers
                    productList={productList}
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default ProductButton;