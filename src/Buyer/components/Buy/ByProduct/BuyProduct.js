import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './byproduct.module.css'
import SearchSection from '../UiShared/Search/Search';
import Category from '../UiShared/Category/Category';
import ProductCard from '../UiShared/ProductCards/ProductCard';
import { useDispatch, useSelector } from "react-redux";
import Loader from '../../SharedComponents/Loader/Loader';
import { fetchProductsList } from '../../../../redux/reducers/productSlice';

const BuyProduct = ({ active, filterCategory, setFilterCategory }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [medicineList, setMedicineList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [searchKey, setSearchKey] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalitems] = useState(0); // Initialize with 0
    const itemsPerPage = 6;

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (e.target.value === '') {
            setSearchKey('');
        }
    };

    const handleProductSearch = () => {
        setSearchKey(inputValue);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleProductSearch();
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCategoryFilter = (category) => {
        setCurrentPage(1);
        setFilterCategory(category);
    };

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        if (active === 'product') {
            const fetchData = async () => {
                setLoading(true); // Set loading true before fetch
                const marketType = active === 'product' ? 'new' : 'secondary';
                const response = await dispatch(
                    fetchProductsList(`product?market=${marketType}&page_no=${currentPage}&page_size=${itemsPerPage}&search_key=${searchKey || ''}&category=${filterCategory || ''}`)
                );
                if (response.meta.requestStatus === 'fulfilled') {
                    console.log('Products fetched successfully:', response.payload);
                    setMedicineList(response.payload.products || []);
                    setTotalitems(response.payload?.totalItems || 0);
                    setLoading(false);
                } else {
                    setMedicineList([]);
                    setTotalitems(0);
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [dispatch, currentPage, searchKey, filterCategory, active, navigate]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.productContainer}>
                    <Category handleCategoryFilter={handleCategoryFilter} />
                    <SearchSection
                        inputValue={inputValue}
                        handleInputChange={handleInputChange}
                        handleProductSearch={handleProductSearch}
                        handleKeyDown={handleKeyDown}
                    />
                    <ProductCard 
                        medicineList={medicineList}
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
};

export default BuyProduct;