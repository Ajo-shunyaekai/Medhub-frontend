import React from 'react';
import { Link } from 'react-router-dom';
import styles from './editprofile.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const EditProfileList = ({ supportList, handlePageChange, currentPage, totalItems, listPerPage }) => {
  return (
    <>
      <div className={styles['complaint-main-container']}>
        <div className={styles['complaint-container']}>
          <div className={styles['complaint-container-right-2']}>
            <Table responsive="xxl" className={styles['complaint-table-responsive']}>
              <thead>
                <div className={styles['complaint-table-row-container']} style={{ backgroundColor: 'transparent' }}>
                  <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                    <span className={styles['complaint-header-text-color']}>Date & Time</span>
                  </div>
                  <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                    <span className={styles['complaint-header-text-color']}>Buyer ID</span>
                  </div>
                  <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                    <span className={styles['complaint-header-text-color']}>Buyer Name</span>
                  </div>
                  <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                    <span className={styles['complaint-header-text-color']}>Status</span>
                  </div>
                  <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                    <span className={styles['complaint-header-text-color']}>Action</span>
                  </div>
                </div>
              </thead>
              <tbody className={styles.bordered}>

                <div className={styles['complaint-table-row-container']}>
                  <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                    <div className={styles['complaint-table-text-color']}>12-12-2024 11:55:05</div>
                  </div>
                  <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                    <div className={styles['complaint-table-text-color']}>BUY-1234</div>
                  </div>
                  <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                    <div className={`${styles['complaint-table-text-color']} ${styles['truncated-text']}`}>
                      MedLink Neutraceuticals
                    </div>
                  </div>
                  <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                    <div className={styles['complaint-table-text-color']}>Pending</div>
                  </div>
                  <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-btn']} ${styles['complaint-table-order-1']}`}>
                    <Link to='/admin/buyer-edit-profile-details'>
                      <div className={`${styles['complaint-table']} ${styles['complaint-table-view']}`}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                      </div>
                    </Link>
                  </div>
                </div>


              </tbody>
            </Table>
            <div className={styles['complaint-pagi-container']}>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={listPerPage}
                totalItemsCount={totalItems}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                hideFirstLastPages={true}
              />
              <div className={styles['complaint-pagi-total']}>
                <div>Total Items: {totalItems}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfileList;
