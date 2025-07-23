// PaginationComponent.jsx
import React from 'react';
import './pagination.css';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import styles from './pagination.module.css';
import { useMatch } from 'react-router-dom';
 
const PaginationComponent = ({
    activePage,
    itemsCountPerPage,
    totalItemsCount,
    pageRangeDisplayed,
    onChange,
}) => {
 
    const matchOne = useMatch('/buyer/bid/:id');
    const matchTwo = useMatch('/buyer/bid/:id/:type/:itemId');
    const isSupplierBidPage = !!(matchOne || matchTwo);
 
    return (
        <div className={isSupplierBidPage? styles.paginationContainerTwo : styles.paginationContainer}>    
            <Pagination
                activePage={activePage}
                itemsCountPerPage={itemsCountPerPage}
                totalItemsCount={totalItemsCount}
                pageRangeDisplayed={pageRangeDisplayed}
                onChange={onChange}
                itemClass="page-item"
                linkClass="page-link"
                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                hideFirstLastPages={true}
            />
            <div className={styles.pagiTotal}>
                Total Items: {totalItemsCount}
            </div>
        </div>
    );
};
 
export default PaginationComponent;