import { useState, useEffect, useRef } from "react";
import styles from "./productdetails.module.css";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { RiArrowUpDownLine} from "react-icons/ri";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import countryList from "react-select-country-list";

const FilterSection = ({
  countryAvailable = [],
  handlePriceRange = () => {},
  handleDeliveryTime = () => {},
  handleStockedIn = () => {},
  handleQuantity = () => {},
  handleStockedInCountry = () => {},
  handleReset = () => {},
  handleSortToggle = () => {},
  handleCountry = () => {},
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    // price: [],
    // deliveryTime: [],
    stockStatus: [],
    totalQuantity: [],
    countries: [],
  });
  const [sortAsc, setSortAsc] = useState(true);
  const [countries, setCountries] = useState([]);
  // const [sortOrder, setSortOrder] = useState({});
  const [sortOrder, setSortOrder] = useState({
    type: null, // 'price' or 'totalQuantity' or null
    sortName: null, // 'price' or 'quantity' or null
    order: 'asc', // 'asc' or 'desc'
  });

  const dropdownRef = useRef(null);

  // useEffect(() => {
  //   const options = countryList().getData();
  //   setCountries(options);
  // }, []);
  useEffect(() => {
    const rawCountries = countryList().getData(); // { label: "India", value: "IN" }
    const formatted = rawCountries.map((c) => ({
      value: c.label, // <-- Send full country name as value
      label: c.label, // <-- Display full country name in UI
    }));
    setCountries(formatted);
  }, []);
  

  // Define filter data
  const filters = [
    {
      key: "countries",
      label: "Stocked In Countries",
      options: countries,
      handler: handleStockedInCountry,
    },
    // {
    //   key: "price",
    //   label: "Unit Price",
    //   options: [
    //     { value: "greater than 40", label: "More than 40 USD" },
    //     { value: "30 - 40", label: "30-40 USD" },
    //     { value: "20 - 30", label: "20-30 USD" },
    //     { value: "10 - 20", label: "10-20 USD" },
    //     { value: "1 - 10", label: "1-10 USD" },
    //   ],
    //   handler: handlePriceRange,
    // },
    // {
    //   key: "totalQuantity",
    //   label: "Quantity",
    //   options: [
    //     { value: "greater than 4000", label: "More than 4000" },
    //     { value: "3000 - 4000", label: "3000-4000" },
    //     { value: "2000 - 3000", label: "2000-3000" },
    //     { value: "1000 - 2000", label: "1000-2000" },
    //     { value: "500 - 1000", label: "500-1000" },
    //     { value: "0 - 500", label: "0-500" },
    //   ],
    //   handler: handleQuantity,
    // },
    {
      key: "price",
      label: "Unit Price",
      handler: handlePriceRange,
      isSort: true,
    },
    {
      key: "totalQuantity",
      label: "Quantity",
      handler: handleQuantity,
      isSort: true,
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

  // const handleSort = (key) => {
  //   setSortOrder((prev) => {
  //     const newOrder = prev[key] === "asc" ? "desc" : "asc";
  
  //     const filter = filters.find((f) => f.key === key);
  //     if (filter?.handler) {
  //       filter.handler(newOrder);
  //     }
  
  //     return { ...prev, [key]: newOrder };
  //   });
  // };
  
  const handleSort = (key) => {
    setSortOrder((prev) => {
      let newOrder;
      
      // If clicking the same sort type, toggle order
      if (prev.type === key) {
        newOrder = {
          type: key,
          sortName: filters.find(f => f.key === key)?.sortName || key,
          order: prev.order === "asc" ? "desc" : "asc",
        };
      } else {
        // If clicking a different sort type, start with ascending
        newOrder = {
          type: key,
          sortName: filters.find(f => f.key === key)?.sortName || key,
          order: "asc",
        };
      }

      // Call the respective handler with the new order
      const filter = filters.find((f) => f.key === key);
      if (filter?.handler) {
        filter.handler(newOrder.order);
      }

      return newOrder;
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
      // price: [],
      // deliveryTime: [],
      stockStatus: [],
      totalQuantity: [],
      countries: [],
    };
    setSelectedFilters(resetState);
    setOpenDropdown(null); // Close any open dropdown
    handleReset(); // Call parent reset handler
  };

  // Add event listener for click outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if any filters are selected
  const anyFilterSelected = Object.values(selectedFilters).some(
    (selections) => selections.length > 0
  );

  const toggleSort = () => {
    setSortAsc((prev) => !prev);
    handleSortToggle(!sortAsc);
  };

  return (
    <div className={styles.mainContainerFilter} ref={dropdownRef}>
      <div className={styles.innerSectionFilter}>
        {/* Filter Dropdowns */}
        <div className={styles.mainSectionFilter}>

          {filters.map((filter) => (
            <div key={filter.key} className={styles.medicinesSectionFilter}>
              <div className={styles.PurcahseButtonFilter}>
                <span>{filter.label}</span>

                {/* Icon logic */}
                {filter.key === "countries" ? (
                  <div onClick={() => toggleDropdown(filter.key)}>
                    {openDropdown === filter.key ? <FaAngleUp /> : <FaAngleDown />}
                  </div>
                ) : (
                  <div onClick={() => handleSort(filter.key)}>
                    {/* {sortOrder[filter.key] === "asc" ? <GoSortAsc /> : <GoSortDesc />} */}
                    {sortOrder.type === filter.key ? (
                      sortOrder.order === "asc" ? <GoSortAsc/> : <GoSortDesc/>
                    ) : (
                      <GoSortAsc/> 
                    )}
                  </div>
                )}
              </div>

              {/* Render dropdown only for filters with options */}
              {openDropdown === filter.key && filter.options && (
                <div className={styles.filterDropdownContentFilter}>
                  {filter.options.map((option) => (
                    <div key={option.value} className={styles.filterOptionFilter}>
                      <label className={styles.medicineTextFilter}>
                        <input
                          type="checkbox"
                          checked={selectedFilters[filter.key]?.includes(option.value)}
                          onChange={() =>
                            handleFilterChange(filter.key, option.value)
                          }
                        />
                        <span>{option.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Sorting Button */}
          {/* <div className={styles.PurcahseButtonFilter} onClick={toggleSort}>
            <span>Sort</span> <RiArrowUpDownLine />
          </div> */}
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
