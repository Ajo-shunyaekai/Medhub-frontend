import { useState, useEffect, useRef } from "react";
import styles from './bysupplier.module.css';
import SearchSection from '../UiShared/Search/Search';
import FilterSection from './Filter';
import SupplierCard from './SupplierCard';
import { useNavigate } from 'react-router-dom';
import Loader from '../../SharedComponents/Loader/Loader';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../../api';
import { postRequestWithToken } from '../../../../api/Requests';

const BuySeller = ({ active }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [supplierList, setSupplierList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [countryOrigin, setCountryOrigin] = useState([]);
    const [filterCountry, setFilterCountry] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 4;

    const dropdownRef = useRef(null);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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

    const handleCountry = (country) => {
        setFilterCountry(country);
        setOpenDropdown(null);
    };

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpenDropdown(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const buyerId = sessionStorage.getItem("buyer_id") || localStorage.getItem("buyer_id");
                if (!buyerId) {
                    navigate("/buyer/login");
                    return;
                }

                if (active === 'seller') {
                    const response = await apiRequests.getRequest(
                        `supplier/get-all-suppliers-list?filterKey=accepted&pageNo=${currentPage}&pageSize=${itemsPerPage}&searchKey=${searchKey}&filterCountry=${filterCountry}`,
                        { buyer_id: buyerId }
                    );

                    if (response?.code !== 200) {
                        toast(response.message, { type: 'error' });
                        console.log('error in supplier list api', response);
                        return;
                    }

                    setSupplierList(response.result.data);
                    setTotalItems(response.result.totalItems);
                }
            } catch (error) {
                console.log(`Error: ${error}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchKey, filterCountry, currentPage, active, navigate]);

    useEffect(() => {
        const buyerId = sessionStorage.getItem("buyer_id") || localStorage.getItem("buyer_id");
        if (!buyerId) {
            navigate("/buyer/login");
            return;
        }

        postRequestWithToken('buyer/supplier/get-filter-values', { buyer_id: buyerId }, (response) => {
            if (response.code === 200) {
                setCountryOrigin(response.result[0].country);
            } else {
                console.log('error in get filter values api', response);
            }
        });
    }, [navigate]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.Maincontainer}>
                    <SearchSection 
                        inputValue={inputValue}
                        handleInputChange={handleInputChange}
                        handleProductSearch={handleProductSearch}
                        handleKeyDown={handleKeyDown}
                    />
                    <FilterSection 
                        openDropdown={openDropdown}
                        toggleDropdown={toggleDropdown}
                        countryOrigin={countryOrigin}
                        handleCountry={handleCountry}
                        dropdownRef={dropdownRef}
                    />
                    <SupplierCard 
                        supplierList={supplierList}
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

export default BuySeller;