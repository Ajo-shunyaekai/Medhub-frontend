import React, { useState, useEffect, useRef } from 'react';
import styles from './productdetails.module.css';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const FilterSection = ({
  countryAvailable = [],
  handlePriceRange = () => {},
  handleDeliveryTime = () => {},
  handleStockedIn = () => {},
  handleQuantity = () => {},
  handleReset = () => {},
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    deliveryTime: [],
    stockedIn: [],
    totalQuantity: [],
  });

  const dropdownRef = useRef(null);

  // Define filter data
  const filters = [
    {
      key: 'price',
      label: 'Unit Price',
      options: [
        { value: '1 - 10', label: '1-10 USD' },
        { value: '10 - 20', label: '10-20 USD' },
        { value: '20 - 30', label: '20-30 USD' },
        { value: '30 - 40', label: '30-40 USD' },
        { value: 'greater than 40', label: 'More than 40 USD' },
      ],
      handler: handlePriceRange,
    },
    {
      key: 'deliveryTime',
      label: 'Delivery Time',
      options: [
        { value: '1 - 5', label: '1-5 Days' },
        { value: '5 - 10', label: '5-10 Days' },
        { value: '10 - 15', label: '10-15 Days' },
        { value: '15 - 20', label: '15-20 Days' },
        { value: '20 - 25', label: '20-25 Days' },
        { value: 'greater than 25', label: 'More than 25 Days' },
      ],
      handler: handleDeliveryTime,
    },
    {
      key: 'stockedIn',
      label: 'Stocked In',
      options: countryAvailable.length > 0
        ? countryAvailable.map((country) => ({ value: country, label: country }))
        : [
            { value: 'Åland Islands', label: 'Åland Islands' },
            { value: 'Luxembourg', label: 'Luxembourg' },
            { value: 'American Samoa', label: 'American Samoa' },
          ],
      handler: handleStockedIn,
    },
    {
      key: 'totalQuantity',
      label: 'Total Quantity',
      options: [
        { value: '0 - 500', label: '0-500' },
        { value: '500 - 1000', label: '500-1000' },
        { value: '1000 - 2000', label: '1000-2000' },
        { value: '2000 - 3000', label: '2000-3000' },
        { value: '3000 - 4000', label: '3000-4000' },
        { value: 'greater than 4000', label: 'More than 4000' },
      ],
      handler: handleQuantity,
    },
  ];

  // Toggle dropdown visibility
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  // Handle filter selection
  const handleFilterChange = (categoryKey, itemValue) => {
    setSelectedFilters((prev) => {
      const currentSelections = prev[categoryKey];
      const updatedSelections = currentSelections.includes(itemValue)
        ? currentSelections.filter((val) => val !== itemValue) // Deselect
        : [...currentSelections, itemValue]; // Select

      const updatedFilters = {
        ...prev,
        [categoryKey]: updatedSelections,
      };

      // Call the respective handler with updated selections
      const filter = filters.find((f) => f.key === categoryKey);
      if (filter?.handler) {
        filter.handler(updatedSelections);
      }

      return updatedFilters;
    });
  };

  // Handle click outside to close dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdown(null);
    }
  };

  // Reset all filters and close dropdown
  const resetAllFilters = () => {
    const resetState = {
      price: [],
      deliveryTime: [],
      stockedIn: [],
      totalQuantity: [],
    };
    setSelectedFilters(resetState);
    setOpenDropdown(null); // Close any open dropdown
    handleReset(); // Call parent reset handler
  };

  // Add event listener for click outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if any filters are selected
  const anyFilterSelected = Object.values(selectedFilters).some(
    (selections) => selections.length > 0
  );

  return (
    <div className={styles.mainContainerFilter} ref={dropdownRef}>
      <div className={styles.innerSectionFilter}>
        {/* Filter Dropdowns */}
        <div className={styles.mainSectionFilter}>
          {filters.map((filter) => (
            <div key={filter.key} className={styles.medicinesSectionFilter}>
              <div
                className={styles.PurcahseButtonFilter}
                onClick={() => toggleDropdown(filter.key)}
              >
                <span>{filter.label}</span>
                {openDropdown === filter.key ? <FaAngleUp /> : <FaAngleDown />}
              </div>
              {openDropdown === filter.key && (
                <div className={styles.filterDropdownContentFilter}>
                  {filter.options.map((option) => (
                    <div key={option.value} className={styles.filterOptionFilter}>
                      <label className={styles.medicineTextFilter}>
                        <input
                          type="checkbox"
                          checked={selectedFilters[filter.key].includes(option.value)}
                          onChange={() => handleFilterChange(filter.key, option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reset Button */}
        {anyFilterSelected && (
          <div className={styles.mainPurchaseSectionFilter}>
            <button className={styles.ResetButton} onClick={resetAllFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;