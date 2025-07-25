import { useState, useEffect, useRef } from "react";
import styles from './bysupplier.module.css';
import SearchSection from '../UiShared/Search/Search';
import FilterSection from './Filter';
import SupplierCard from './SupplierCard';
import SupplierList from './SupplierList';
import { useNavigate } from 'react-router-dom';
import Loader from '../../SharedComponents/Loader/Loader';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../../api';
import { postRequestWithToken } from '../../../../api/Requests';
import { BsCardList } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa";


const BuySeller = ({ active }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [supplierList, setSupplierList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [countryOrigin, setCountryOrigin] = useState([]);
    const [filterCountry, setFilterCountry] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
    const itemsPerPage = 10;

    const dropdownRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            setSearchKey(e.target.value);
            setCurrentPage(1);
        }, 500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            setSearchKey(inputValue);
            setCurrentPage(1);
        }
    };

    const handleCountry = (country) => {
        setFilterCountry(country);
        setOpenDropdown(null);
    };

    const handleCompanyType = (type) => {
        setCompanyType(type);
        setOpenDropdown(null);
    };

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const resetFilters = () => {
        setFilterCountry('');
        setInputValue('');
        setSearchKey('');
        setCurrentPage(1);
        setOpenDropdown(null);
    };

    const areFiltersApplied = () => {
        return filterCountry !== '' || searchKey !== '';
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
                const buyerId = localStorage?.getItem("buyer_id") || localStorage?.getItem("buyer_id");
                if (!buyerId) {
                    localStorage?.clear();
                    navigate("/buyer/login");
                    return;
                }

                if (active === 'seller') {
                    const response = await apiRequests.getRequest(
                        `supplier/get-all-suppliers-list?filterKey=accepted&pageNo=${currentPage}&pageSize=${itemsPerPage}&searchKey=${searchKey}&filterCountry=${filterCountry}&type=${companyType}`,
                        { buyer_id: buyerId }
                    );

                    if (response?.code !== 200) {
                        toast(response.message, { type: 'error' });
                        return;
                    }

                    setSupplierList(response.result.data);
                    setTotalItems(response.result.totalItems);
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchKey, filterCountry, currentPage, active, companyType, navigate]);

    useEffect(() => {
        const buyerId = localStorage?.getItem("buyer_id") || localStorage?.getItem("buyer_id");
        if (!buyerId) {
            localStorage?.clear();
            navigate("/buyer/login");
            return;
        }

        postRequestWithToken('supplier/get-filter-values', { buyer_id: buyerId }, (response) => {
            if (response?.code === 200) {
                setCountryOrigin(response.result[0].country);
            } else {
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
                        handleProductSearch={() => {}}
                        handleKeyDown={handleKeyDown}
                        placeholder='Search Suppliers'
                    />
                    <FilterSection 
                        openDropdown={openDropdown}
                        toggleDropdown={toggleDropdown}
                        countryOrigin={countryOrigin}
                        handleCountry={handleCountry}
                        dropdownRef={dropdownRef}
                        resetFilters={resetFilters}
                        areFiltersApplied={areFiltersApplied()}
                        handleCompanyType={handleCompanyType}
                    />
                    {/* <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${viewMode === 'card' ? styles.activeTab : ''}`}
                            onClick={() => setViewMode('card')}
                            title=" List View"
                        >
                            <BsCardList className={styles.tabIcon} />
                        </button>
                        <button
                            className={`${styles.tabButton} ${viewMode === 'list' ? styles.activeTab : ''}`}
                            onClick={() => setViewMode('list')}
                            title="Card View"
                        >
                            <FaRegAddressCard className={styles.tabIcon} />
                            
                        </button>
                    </div> */}
                     <SupplierList 
                            supplierList={supplierList}
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    {/* {viewMode === 'card' ? (
                        <SupplierCard 
                            supplierList={supplierList}
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    ) : (
                       
                    )} */}
                </div>
            )}
        </>
    );
};

export default BuySeller;