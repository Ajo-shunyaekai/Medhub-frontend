import React from 'react'
import searchIcon from '../../../../assets/images/Buy/search-icon.svg'
import styles from './search.module.css'
import { FaTimes } from 'react-icons/fa';
 
const Search = ({ inputValue, setInputValue, handleInputChange, handleProductSearch, handleKeyDown, placeholder, setSearchKey }) => {
    return (
        <div className={styles.searchContainer}>
            <input
                className={styles.searchInput}
                type='search'
                placeholder={`${placeholder || "Search"}`}
                value={inputValue}
                onChange={(e) => handleInputChange(e)}
                onKeyDown={handleKeyDown}
            />
            <div
                className={styles.searchSection}
                onClick={()=>{handleProductSearch(false);}}
            >
                <img
                    className={styles.searchIcon}
                    src={searchIcon}
                    alt="Search Icon"
                />
                <span>Search</span>
            </div>
            <div onClick={() => { setInputValue(''); setSearchKey(""); handleProductSearch(true); }} className={styles.cross}>
                {
                    inputValue && <span><FaTimes /></span>
                }
            </div>
        </div>
    );
}
 
export default Search