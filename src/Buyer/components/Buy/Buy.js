import React, { useEffect, useState } from 'react';
import styles from './buy.module.css';
import Right from "../../assets/images/right-arrow.svg";
import BuySeller from './BySupplier/BySupplier';
import BuyProduct from './ByProduct/BuyProduct';
import Buy2ndMarket from './SecondaryMarket/Buy2ndMarket';
import AccordionFilter from './UiShared/Category/Category';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineFilter } from "react-icons/hi";

const Buy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [isOpen, setIsOpen] = useState(false); // State to control accordion

    const getBreadCrumbs = (pathname, selectedCategory, filterCategory) => {
        const crumbs = [{ name: 'Buy', path: '/buyer/buy/by-supplier' }];
        switch (pathname) {
            case '/buyer/buy/by-supplier':
                crumbs.push({ name: 'Supplier', path: '/buyer/buy/by-supplier' });
                break;
            case '/buyer/buy/by-product':
                crumbs.push({ name: 'Category', path: '/buyer/buy/by-product' });
                if (selectedCategory) {
                    crumbs.push({ name: selectedCategory, path: `/buyer/buy/by-product/${selectedCategory}` });
                }
                if (filterCategory) {
                    crumbs.push({ name: filterCategory, path: `/buyer/buy/by-product` });
                }
                break;
            case '/buyer/buy/secondary-market':
                crumbs.push({ name: 'Secondary Market', path: '/buyer/buy/secondary-market' });
                if (selectedCategory) {
                    crumbs.push({ name: selectedCategory, path: `/buyer/buy/secondary-market/${selectedCategory}` });
                }
                if (filterCategory) {
                    crumbs.push({ name: filterCategory, path: `/buyer/buy/secondary-market` });
                }
                break;
            default:
                crumbs.push({ name: 'Supplier', path: '/buyer/buy/by-supplier' });
        }
        return crumbs;
    };

    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        const crumbs = getBreadCrumbs(location.pathname, selectedCategory, filterCategory);
        setBreadcrumbs(crumbs);
    }, [location.pathname, selectedCategory, filterCategory]);

    const handleBreadcrumbClick = (path) => {
        navigate(path);
    };

    useEffect(() => {
        setFilterCategory("");
    }, [location.pathname]);

    const getActiveButtonFromPath = (path) => {
        switch (path) {
            case '/buyer/buy/by-supplier':
                return 'seller';
            case '/buyer/buy/by-product':
                return 'product';
            case '/buyer/buy/secondary-market':
                return 'market';
            default:
                return 'seller';
        }
    };

    const activeButton = getActiveButtonFromPath(location.pathname);

    const handleButtonClick = (button) => {
        switch (button) {
            case 'seller':
                navigate('by-supplier');
                break;
            case 'product':
                navigate('by-product');
                break;
            case 'market':
                navigate('secondary-market');
                break;
            default:
                navigate('by-supplier');
        }
    };

    const toggleAccordion = () => {
        setIsOpen(!isOpen); // Toggle the accordion state
    };

    return (
        <>
            <div className={styles.main}>
                <div className={styles.heading}>Buy</div>

                {/* Render breadcrumbs */}
                <div className={styles.breadcrumbSection}>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={breadcrumb.name}>
                            <span
                                className={`${styles.breadcrumbText} ${index === breadcrumbs.length - 1 ? styles.active : ''}`}
                                onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                            >
                                {breadcrumb.name}
                            </span>
                            {index < breadcrumbs.length - 1 && (
                                <img className={styles.breadcrumbIcon} src={Right} alt=">" />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className={styles.section}>
                    <div className={styles.innerSection}>
                        <div
                            className={`${styles.supplierBtn} ${activeButton === 'seller' ? styles.active : ''}`}
                            onClick={() => handleButtonClick('seller')}
                        >
                            By Supplier
                        </div>
                        <div
                            className={`${styles.productBtn} ${activeButton === 'product' ? styles.active : ''}`}
                            onClick={() => handleButtonClick('product')}
                        >
                            By Product
                        </div>
                        <div
                            className={`${styles.productBtn} ${activeButton === 'market' ? styles.active : ''}`}
                            onClick={() => handleButtonClick('market')}
                        >
                            Secondary Market
                        </div>
                    </div>
                    {/* Conditionally render the filter button */}
                    {(activeButton === 'product' || activeButton === 'market') && (
                        <div className={styles.innerSection}>
                            <button className={styles.filterButton} onClick={toggleAccordion}>
                                <HiOutlineFilter className={styles.filterIcon} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Render AccordionFilter only when filter is relevant */}
                {(activeButton === 'product' || activeButton === 'market') && (
                    <AccordionFilter isOpen={isOpen} toggleAccordion={toggleAccordion} setFilterCategory={setFilterCategory} />
                )}

                {activeButton === 'seller' && <BuySeller active={activeButton} />}
                {activeButton === 'product' && (
                    <div>
                        <BuyProduct active={activeButton} filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
                    </div>
                )}
                {activeButton === 'market' && (
                    <div>
                        <Buy2ndMarket active={activeButton} filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
                    </div>
                )}
            </div>
        </>
    );
};

export default Buy;