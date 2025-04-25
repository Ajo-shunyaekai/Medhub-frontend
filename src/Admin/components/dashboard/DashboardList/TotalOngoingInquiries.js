import React from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment/moment';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';

const TotalOngoingInquiries = ({ list, totalList, currentPage, ordersPerPage, handlePageChange, activeLink }) => {
    const columns = [
        {
            name: 'Inquiry ID',
            selector: row => row.enquiry_id,
            sortable: true,
           
        },
        {
            name: 'Date',
            selector: row => row.created_at,
            sortable: true,
            cell: row => <div>{moment(row.created_at).format("DD/MM/YYYY")}</div>,
        },
        {
            name: 'Supplier Name',
            selector: row => row.supplier?.supplier_name,
            sortable: true,
           
        },
        {
            name: 'Status',
            selector: row => row.po_status,
            sortable: true,
            cell: row => (
                <div>
                    {row.po_status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
            ),
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/admin/ongoing-inquiries-details/${row.enquiry_id}`}>
                    <div className={styles.activeBtn}>
                               <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                             </div>
                </Link>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className={styles.container}>
           <style>
                {`
                    .rdt_Table {
                       border: none;
    background-color: unset !important;
                    }
                        .rdt_TableRow{
                      background-color: #ffffff !important;
    border-bottom: none !important;
                        }
                    .rdt_TableHeadRow {
                            background-color: #f9f9fa;
    font-weight: bold;
    border-bottom: none !important;
                    }
    .rdt_TableBody{
    gap:10px !important;
    }
                    .rdt_TableCol {
                        text-align: center;
                        color: #333;
                    }
                    .rdt_TableCell {
                       
                           text-align: center;
    color: #99a0ac;
    font-weight: 500 !important;
                    }
                    .rdt_TableCellStatus {
                        text-align: center;
                        color: #333;
                    }
                `}
            </style>
                <DataTable
                    columns={columns}
                    data={list}
                    persistTableHead
                    noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                    pagination={false}
                    responsive
                />
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={totalList}
                    pageRangeDisplayed={10}
                    onChange={handlePageChange}
                />
            </div>
       
    );
};

export default TotalOngoingInquiries;