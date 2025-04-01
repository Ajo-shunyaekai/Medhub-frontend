import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './market.module.css'
import Category from '../UiShared/Category/Category';
import Search from '../UiShared/Search/Search';
import ProductCard from '../UiShared/ProductCards/ProductCard';
import Loader from '../../SharedComponents/Loader/Loader';
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsList } from '../../../../redux/reducers/productSlice';

const Buy2ndMarket = ({ active, filterCategory, setFilterCategory }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true);
    const [medicineList, setMedicineList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [searchKey, setSearchKey] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

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
        setFilterCategory(category);
    };

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        if (active === 'market') {
            const fetchData = async () => {
                const marketType = 'secondary'; // Hardcoding for secondary market
                const response = await dispatch(
                    fetchProductsList(`product?market=${marketType}&page_no=${currentPage}&page_size=${itemsPerPage}&search_key=${searchKey}&category=${filterCategory || ''}`)
                );
                if (response.meta.requestStatus === 'fulfilled') {
                    setMedicineList(response?.payload?.products);
                    setTotalItems(response?.payload?.totalItems);
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [dispatch, currentPage, searchKey, filterCategory]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.marketContainer}>
                    <Category handleCategoryFilter={handleCategoryFilter} />
                    <Search 
                        inputValue={inputValue}
                        handleInputChange={handleInputChange}
                        handleKeyDown={handleKeyDown}
                        handleProductSearch={handleProductSearch}
                    />
                    <ProductCard 
                        medicineList={medicineList}
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        isSecondaryMarket={true}
                    />
                </div>
            )}
        </>
    );
};

export default Buy2ndMarket;