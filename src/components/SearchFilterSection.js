import React, { useState, useEffect, useRef } from 'react';
import '../style/searcjhfilter.css';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const SearchFilterSection = ({countryAvailable, handlePriceRange, handleDeliveryTime, handleStockedIn, handleQuantity, handleReset}) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [checkedItems, setCheckedItems] = useState({
        price: {},
        deliveryTime: {},
        stockedIn: {},
        totalQuantity: {},
    });
    
    const [anyCheckboxChecked, setAnyCheckboxChecked] = useState(false);

    const dropdownRef = useRef(null);

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const handleCheckboxChange = (category, item) => {
        setCheckedItems((prevCheckedItems) => {
            const updatedCategory = {
                ...prevCheckedItems[category],
                [item]: !prevCheckedItems[category][item],
            };

            // Check if any checkbox is checked
            const anyChecked = Object.values(updatedCategory).some(value => value) ||
                Object.values(prevCheckedItems).some(cat =>
                    cat !== updatedCategory && Object.values(cat).some(value => value)
                );

            setAnyCheckboxChecked(anyChecked);

            const updatedCheckedItems = {
                ...prevCheckedItems,
                [category]: updatedCategory,
            };

            if (category === 'price') {
                handlePriceRange(Object.keys(updatedCategory).filter(key => updatedCategory[key]));
            } else if (category === 'deliveryTime') {
                handleDeliveryTime(Object.keys(updatedCategory).filter(key => updatedCategory[key]));
            } else if (category === 'stockedIn') {
                handleStockedIn(Object.keys(updatedCategory).filter(key => updatedCategory[key]));
            } else if (category === 'totalQuantity') {
                handleQuantity(Object.keys(updatedCategory).filter(key => updatedCategory[key]));
            }

            return updatedCheckedItems;
        });
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpenDropdown(null);
        }
    };

    const resetAllCheckboxes = () => {
        setCheckedItems({
            price: {},
            deliveryTime: {},
            countryAvailableIn: {},
            stockedIn: {},
            totalQuantity : {}
        });
        handleReset()
        setAnyCheckboxChecked(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const Checkbox = ({ category, item, label }) => (
        <label className='search-seller-label-section'>
            <input
                type="checkbox"
                checked={!!checkedItems[category][item]}
                onChange={() => handleCheckboxChange(category, item)}
            />
            {label}
        </label>
    );

    return (
        <div className='search-seller-filter-container' ref={dropdownRef}>
            <ul className='search-seller-filter-ul'>
                <li className='search-seller-filter-drop'>
                    <div className='search-filter-heading' onClick={() => toggleDropdown('price')}>
                        Unit Price {openDropdown === 'price' ? <FaAngleUp /> : <FaAngleDown />}
                    </div>
                    {openDropdown === 'price' && (
                        <ul className='search-seller-inner-dropdown'>
                            <li className='search-seller-li-cont'><Checkbox category="price" item="1 - 10" label="1-10 USD" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="price" item="10 - 20" label="10-20 USD" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="price" item="20 - 30" label="20-30 USD" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="price" item="30 - 40" label="30-40 USD" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="price" item="greater than 40" label="More than 40 USD" /></li>
                        </ul>
                    )}
                </li>
                <li className='search-seller-filter-drop'>
                    <div className='search-filter-heading' onClick={() => toggleDropdown('deliveryTime')}>
                        Delivery Time {openDropdown === 'deliveryTime' ? <FaAngleUp /> : <FaAngleDown />}
                    </div>
                    {openDropdown === 'deliveryTime' && (
                        <ul className='search-seller-inner-dropdown'>
                            <li className='search-seller-li-cont'><Checkbox category="deliveryTime" item="1 - 5" label="1-5 Days" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="deliveryTime" item="5 - 10" label="5-10 Days" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="deliveryTime" item="10 - 15" label="10-15 Days" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="deliveryTime" item="15 - 20" label="15-20 Days" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="deliveryTime" item="20 - 25" label="20-25 Days" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="deliveryTime" item="greater than 25" label="More than 25 Days" /></li>
                        </ul>
                    )}
                </li>
                <li className='search-seller-filter-drop'>
                    <div className='search-filter-heading' onClick={() => toggleDropdown('stockedIn')}>
                        Stocked In {openDropdown === 'stockedIn' ? <FaAngleUp /> : <FaAngleDown />}
                    </div>
                    {openDropdown === 'stockedIn' && (
                        <ul className='search-seller-inner-dropdown'>
                            {countryAvailable?.map(country => (
                                <li className='search-seller-li-cont' key={country}>
                                    <Checkbox category="stockedIn" item={country} label={country} />
                                </li>
                            ))}
                            
                        </ul>
                    )}
                </li>
                <li className='search-seller-filter-drop'>
                    <div className='search-filter-heading' onClick={() => toggleDropdown('totalQuantity')}>
                        Total Quantity {openDropdown === 'totalQuantity' ? <FaAngleUp /> : <FaAngleDown />}
                    </div>
                    {openDropdown === 'totalQuantity' && (
                        <ul className='search-seller-inner-dropdown'>
                            <li className='search-seller-li-cont'><Checkbox category="totalQuantity" item="0 - 500" label="0-500" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="totalQuantity" item="500 - 1000" label="500-1000" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="totalQuantity" item="1000 - 2000" label="1000-2000" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="totalQuantity" item="2000 - 3000" label="2000-3000" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="totalQuantity" item="3000 - 400" label="3000-4000" /></li>
                            <li className='search-seller-li-cont'><Checkbox category="totalQuantity" item="greater than 4000" label="More than 4000" /></li>
                        </ul>
                    )}
                </li>
            </ul>
            {anyCheckboxChecked && (
                <div className='reset-button' onClick={resetAllCheckboxes}>Reset</div>
            )}
        </div>
    );
};

export default SearchFilterSection;
