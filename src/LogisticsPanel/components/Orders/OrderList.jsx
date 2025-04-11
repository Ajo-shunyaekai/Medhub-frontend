import React from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment';
import Table from '../UI/Table/Table';
import styles from './NewOrder.module.css';

const OrderList = ({ list, totalList, currentPage, listPerPage, handlePageChange, page }) => {
    
    const columns = [
        {
            name: 'Date & Time',
            selector: row => moment(row.created_at).format("DD/MM/YYYY"),
            sortable: true,
        },
        {
            name: 'Order ID',
            selector: row => row.logistics_id,
            sortable: true,
        },
        {
            name: 'Supplier Name',
            selector: row => row.supplierDetails?.[0]?.supplier_name || 'N/A',
            sortable: true,
        },
        ...(page !== "pickupOrder" ? [{
            name: 'Buyer Name',
            selector: row => row.buyerDetails?.[0]?.buyer_name || 'N/A',
            sortable: true,
        }] : []),
        {
            name: 'Status',
            selector: row => row?.status?.charAt(0).toUpperCase() + row?.status?.slice(1),
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={page === 'pickupOrder' 
                    ? `/logistics/pickup-order-details/${row.logistics_id}`
                    : `/logistics/logistics-details/${row.logistics_id}`}>
                    <RemoveRedEyeOutlinedIcon className={styles.viewButton} />
                </Link>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        }
    ];

    return (
        <Table
            columns={columns}
            data={list}
            totalItems={totalList}
            currentPage={currentPage}
            itemsPerPage={listPerPage}
            onPageChange={handlePageChange}
        />
    );
};

export default OrderList;
