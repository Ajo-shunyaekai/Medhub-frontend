import React from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import PaginationComponent from '../../../shared-components/Pagination/Pagination';
import styles from '../../../../assets/style/table.module.css';
import '../../../../assets/style/table.css'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

const Feedback = ({ supportList, handlePageChange, currentPage, totalItems, listPerPage }) => {
    const columns = [
        {
            name: 'Feedback ID',
            selector: row => row.support_id || 'ID Not Provided',
            sortable: true,
           
        },
        {
            name: 'Subject',
            selector: row => row.order_id || row.subject || 'N/A',
            sortable: true,
           
        },
        {
            name: 'Message',
            selector: row => row.reason || row.message || 'N/A',
            sortable: true,
            grow: 2,
            wrap: true,
          
        },
        {
            name: 'Action',
            sortable: false,
          
            cell: row => (
                <Link to={`/admin/supplier-enquiry-details/${row.support_id}`}>
                  <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
                </Link>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            sortable: false,
        }
    ];
    return (
            <div className={styles.container}>
                <DataTable
                    columns={columns}
                    data={supportList}
                    persistTableHead
                    noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                    pagination={false}
                    responsive
                />
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={listPerPage}
                    totalItemsCount={totalItems}
                    pageRangeDisplayed={10}
                    onChange={handlePageChange}
                />
            </div>
    );
};

export default Feedback;