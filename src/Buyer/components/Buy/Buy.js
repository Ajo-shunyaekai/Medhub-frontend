import React, { useEffect, useState } from 'react';
import './buy.css';
import Right from "../../assest/images/right-arrow.svg";
import BuySeller from './BySupplier/BuySeller';
import BuyProduct from './ByProduct/BuyProduct';
import Buy2ndMarket from './SecondaryMarket/Buy2ndMarket';
import { useLocation, useNavigate } from 'react-router-dom';

const Buy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // State to manage selected category (if any)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filterCategory, setFilterCategory] = useState(''); // Generics, Originals, Biosimilars, Medical Devices, Nutraceutical
    
    const getBreadCrumbs = (pathname, selectedCategory, filterCategory) => {
        const crumbs = [{ name: 'Buy', path: '/buyer/buy/By-Supplier' }];
        
        switch (pathname) {
            case '/buyer/buy/By-Supplier':
                crumbs.push({ name: 'Supplier', path: '/buyer/buy/By-Supplier' });
                break;
            case '/buyer/buy/By-Product':
                crumbs.push({ name: 'Category', path: '/buyer/buy/By-Product' });
                if (selectedCategory) {
                    crumbs.push({ name: selectedCategory, path: `/buyer/buy/By-Product/${selectedCategory}` });
                }
                // Add the filterCategory breadcrumb if it exists
                if (filterCategory) {
                    crumbs.push({ name: filterCategory, path: `/buyer/buy/By-Product` });
                }
                break;
            case '/buyer/buy/Secondary-Market':
                crumbs.push({ name: 'Secondary Market', path: '/buyer/buy/Secondary-Market' });
                if (selectedCategory) {
                    crumbs.push({ name: selectedCategory, path: `/buyer/buy/Secondary-Market/${selectedCategory}` });
                }
                // Add the filterCategory breadcrumb if it exists
                if (filterCategory) {
                    crumbs.push({ name: filterCategory, path: `/buyer/buy/Secondary-Market` });
                }
                break;
            default:
                crumbs.push({ name: 'Supplier', path: '/buyer/buy/By-Supplier' });
        }
        return crumbs;
    };
    
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        const crumbs = getBreadCrumbs(location.pathname, selectedCategory, filterCategory);
        setBreadcrumbs(crumbs);
    }, [location.pathname, selectedCategory, filterCategory]); // Add filterCategory as a dependency

    const handleBreadcrumbClick = (path) => {
        navigate(path);
    };
    
    useEffect(()=>{
        setFilterCategory("")
    },[location.pathname])

    const getActiveButtonFromPath = (path) => {
        switch (path) {
            case '/buyer/buy/By-Supplier':
                return 'seller';
            case '/buyer/buy/By-Product':
                return 'product';
            case '/buyer/buy/Secondary-Market':
                return 'market';
            default:
                return 'seller';
        }
    };

    const activeButton = getActiveButtonFromPath(location.pathname);

    const handleButtonClick = (button) => {
        switch (button) {
            case 'seller':
                navigate('By-Supplier');
                break;
            case 'product':
                navigate('By-Product');
                break;
            case 'market':
                navigate('Secondary-Market');
                break;
            default:
                navigate('By-Supplier');
        }
    };


    return (
        <>
            <div className='buy-main-container'>
                <div className='buy-main-heading'>Buy</div>
                
                {/* Render breadcrumbs */}
                <div className='buy-breadcrumbs-section'>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={breadcrumb.name}>
                            <span
                                className={`breadcrumbs-head ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                                onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                            >
                                {breadcrumb.name}
                            </span>
                            {index < breadcrumbs.length - 1 && (
                                <img className="breadcrumbs-icon" src={Right} alt=">" />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className='buy-button-section'>
                    <div className={`buy-button-one ${activeButton === 'seller' ? 'active' : ''}`} onClick={() => handleButtonClick('seller')}>
                        By Supplier
                    </div>
                    <div className={`buy-button-two ${activeButton === 'product' ? 'active' : ''}`} onClick={() => handleButtonClick('product')}>
                        By Product
                    </div>
                    <div className={`buy-button-two ${activeButton === 'market' ? 'active' : ''}`} onClick={() => handleButtonClick('market')}>
                        Secondary Market
                    </div>
                </div>

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
