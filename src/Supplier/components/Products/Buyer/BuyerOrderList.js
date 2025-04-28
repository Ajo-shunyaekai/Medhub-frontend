import React from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment/moment';
import PaginationComponent from '../../SharedComponents/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';

const BuyerOrderList = ({ orderList }) => {
    const getTotalQuantity = (items) => {
        return items.reduce((total, item) => total + (item.quantity || item.quantity_required), 0);
    };

    const columns = [
        {
            name: 'Order ID',
            selector: (row) => row.order_id,
            sortable: true,
        },
        {
            name: 'Date',
            selector: (row) => row.created_at,
            sortable: true,
            cell: (row) => (
                <span>
                    {moment(row.created_at).format('DD/MM/YYYY')}
                </span>
            ),
        },
        {
            name: 'Quantity',
            selector: (row) => getTotalQuantity(row.items),
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <Link to={`/supplier/active-orders-details/${row.order_id}`}>
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

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedData = orderList
        ? orderList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : [];

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
            <span className={styles.title}>Order List</span>
            <DataTable
                columns={columns}
                data={paginatedData}
                persistTableHead
                noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                pagination={false}
                responsive
            />
            {orderList && orderList.length > 0 && (
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={orderList.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default BuyerOrderList;