import styles from './bysupplier.module.css';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const FilterSection = ({ openDropdown, toggleDropdown, countryOrigin, handleCountry, dropdownRef, resetFilters, areFiltersApplied, handleCompanyType }) => {
    const handleReset = () => {
        if (resetFilters) {
            resetFilters();
        }
        toggleDropdown(null);
    };

    return (
        <div className={styles.filterContainer} ref={dropdownRef}>
            <ul className={styles.filterSection}>
                <li
                    className={styles.filterLiSection}
                    onClick={() => toggleDropdown('gmpApprovals')}
                >
                    Company Type {openDropdown === 'gmpApprovals' ? <FaAngleUp /> : <FaAngleDown />}
                    {openDropdown === 'gmpApprovals' && (
                        <ul className={styles.filterInnerSection}>
                           <li onClick={() => handleCompanyType('Manufacturer')}>Manufacturer</li>
                            <li onClick={() => handleCompanyType('Distributor')}>Distributor</li>
                            <li onClick={() => handleCompanyType('Medical Practitioner')}>Medical Practitioner</li>
                            <li onClick={() => handleCompanyType('Service Provider')}>Service Provider</li>
                        </ul>
                    )}
                </li>
                <li
                    className={styles.filterLiSection}
                    onClick={() => toggleDropdown('countryOfOrigin')}
                >
                    Country of Origin {openDropdown === 'countryOfOrigin' ? <FaAngleUp /> : <FaAngleDown />}
                    {openDropdown === 'countryOfOrigin' && (
                        <ul className={styles.filterInnerSection}>
                            {countryOrigin?.map((country, i) => (
                                <li key={i} onClick={() => handleCountry(country)}>
                                    {country}
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            </ul>
            {/* Show reset button only when filters are applied */}
            {areFiltersApplied && (
                <button 
                    className={styles.resetButton}
                    onClick={handleReset}
                >
                    Reset Filters
                </button>
            )}
        </div>
    );
};

export default FilterSection;