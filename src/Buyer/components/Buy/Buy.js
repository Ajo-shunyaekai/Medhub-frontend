import React, { useEffect, useState } from 'react';
import './buy.css';
import Right from "../../assest/images/right-arrow.svg"
import BuySeller from './BySupplier/BuySeller';
import BuyProduct from './ByProduct/BuyProduct';
import Buy2ndMarket from './SecondaryMarket/Buy2ndMarket';
import { Link, useLocation, useNavigate } from 'react-router-dom';
const Buy = () => {
    const location = useLocation();
    const navigate = useNavigate();

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
    // breadcrumbs code 
    const [activeBreadcrumb, setActiveBreadcrumb] = useState('By Seller');

    const breadcrumbs = ['By Seller', 'By Product', 'By Product Search Details'];

    const handleBreadcrumbClick = (breadcrumb) => {
        setActiveBreadcrumb(breadcrumb);
    };

    return (
        <>
            <div className='buy-main-container'>
                <div className='buy-main-heading'>Buy</div>
                <div className='buy-breadcrumbs-section'>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={breadcrumb}>
                            <span
                                className={`breadcrumbs-head ${activeBreadcrumb === breadcrumb ? 'active' : ''}`}
                                onClick={() => handleBreadcrumbClick(breadcrumb)}
                            >
                                {breadcrumb}
                            </span>
                            {index < breadcrumbs.length - 1 && (
                                <img className="breadcrumbs-icon" src={Right} alt=">" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <div className='buy-button-section'>
                    <div className={`buy-button-one ${activeButton === 'seller' ? 'active' : ''}`} onClick={() => handleButtonClick('seller')}>
                        By Seller
                    </div>
                    <div className={`buy-button-two ${activeButton === 'product' ? 'active' : ''}`} onClick={() => handleButtonClick('product')}>
                        By Category
                    </div>
                    <div className={`buy-button-two ${activeButton === 'market' ? 'active' : ''}`} onClick={() => handleButtonClick('market')}>
                        Secondary Market
                    </div>
                </div>
                {activeButton === 'seller' && <BuySeller active={activeButton} />}
                {activeButton === 'product' && <div>
                    <BuyProduct active={activeButton} />
                </div>}
                {activeButton === 'market' && <div>
                    <Buy2ndMarket active={activeButton} />
                </div>}
            </div>
        </>
    );
};

export default Buy;
