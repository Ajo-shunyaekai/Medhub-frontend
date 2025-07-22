import React from 'react';
import './Pagination.css';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import styles from './Pagination.module.css';

const PaginationComponent = ({
        activePage,
        itemsCountPerPage,
        totalItemsCount,
        pageRangeDisplayed,
        onChange,
    }) => {
  return (
    <div className={styles.paginationContainer}>    
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
  )
}

export default PaginationComponent