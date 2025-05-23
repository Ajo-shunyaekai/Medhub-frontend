import SearchIcon from '../../../../assets/images/Buy/search-icon.svg';
import styles from './search.module.css';

const SearchSection = ({ inputValue, handleInputChange, handleProductSearch, handleKeyDown, placeholder }) => {
    return (
        <div className={styles.searchContainer}>
            <input 
                className={styles.searchInput}
                type='text'
                placeholder={`${placeholder || "Search"}`}
                value={inputValue}
                onChange={(e) => handleInputChange(e)}
                onKeyDown={handleKeyDown}
            />
            <div 
                className={styles.searchSection}
                onClick={handleProductSearch}
            >
                <img 
                    className={styles.searchIcon}
                    src={SearchIcon}
                    alt="Search Icon"
                />
                Search
            </div>
        </div>
    );
};

export default SearchSection;