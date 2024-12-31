import React, { useEffect, useState } from 'react';
import './buy.css';
import BuySeller from './BySupplier/BuySeller';
import BuyProduct from './ByProduct/BuyProduct';
import Buy2ndMarket from './SecondaryMarket/Buy2ndMarket';
import { useLocation, useNavigate } from 'react-router-dom';
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


    return (
        <>
            <div className='buy-main-container'>
                <div className='buy-main-heading'>Buy</div>
                <div className='buy-button-section'>
                    <div className={`buy-button-one ${activeButton === 'seller' ? 'active' : ''}`} onClick={() => handleButtonClick('seller')}>
                        By Seller
                    </div>
                    <div className={`buy-button-two ${activeButton === 'product' ? 'active' : ''}`} onClick={() => handleButtonClick('product')}>
                        By Product
                    </div>
                    <div className={`buy-button-two ${activeButton === 'market' ? 'active' : ''}`} onClick={() => handleButtonClick('market')}>
                   Secondary Market
                    </div>
                </div>
                {activeButton === 'seller' && <BuySeller active={activeButton}/>}
                {activeButton === 'product' && <div>
                    <BuyProduct active = {activeButton}/>
                </div>}
                {activeButton === 'market' && <div>
                    <Buy2ndMarket active = {activeButton}/>
                </div>}
            </div>
        </>
    );
};

export default Buy;
