import React from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import PaginationComponent from '../../../shared-components/Pagination/Pagination';
import styles from '../../../../assets/style/table.module.css';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

const Feedback = ({ supportList, handlePageChange, currentPage, totalItems, listPerPage }) => {
    const columns = [
        {
            name: 'Enquiry ID',
            selector: row => row?.support_id || 'ID Not Provided',
            sortable: true,
        },
        {
            name: 'Subject',
            selector: row => row?.order_id || row?.subject || 'N/A',
            sortable: true,
        },
        {
            name: 'Message',
            selector: row => row?.reason || row?.message || 'N/A',
            sortable: true,
            grow: 2,
            wrap: true,
        },
        {
            name: 'Action',
            sortable: false,
            cell: row => (
                <Link to={`/admin/supplier-enquiry-details/${row?.support_id}`}>
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
            <style>
                {`
                    .rdt_Table {
                        border: none;
                        background-color: unset !important;
                    }
                    .rdt_TableRow {
                        background-color: #ffffff !important;
                        border-bottom: none !important;
                    }
                    .rdt_TableHeadRow {
                        background-color: #f9f9fa;
                        font-weight: bold;
                        border-bottom: none !important;
                    }
                    .rdt_TableBody {
                        gap: 10px !important;
                    }
                    .rdt_TableCol {
                            
                        color: #333;
                    }
                    .rdt_TableCell {
                            
                        color: #333;
                        font-weight: 500 !important;
                    }
                    .rdt_TableCellStatus {
                            
                        color: #333;
                    }
                `}
            </style>
            <DataTable
                columns={columns}
                data={supportList}
                persistTableHead
                noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                pagination={false}
                responsive
            />
            {supportList && supportList.length > 0 && (
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={listPerPage}
                    totalItemsCount={totalItems}
                    pageRangeDisplayed={8}
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default Feedback;