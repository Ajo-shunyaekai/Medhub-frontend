import styles from './bysupplier.module.css';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const FilterSection = ({ openDropdown, toggleDropdown, countryOrigin, handleCountry, dropdownRef }) => {
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
                            <li>Manufacturer</li>
                            <li>Distributor</li>
                            <li>Medical Practitioner</li>
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
        </div>
    );
};

export default FilterSection;