import React from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment';
import Table from '../../UI/Table/Table';
import styles from './NewInventoryList.module.css';

const InventoryList = ({ list, totalList, currentPage, listPerPage, handlePageChange, page }) => {
    
    const columns = [
        {
            name     : 'Warehouse ID',
            selector : row => moment(row?.created_at).format("DD/MM/YYYY"),
            sortable : true,
        },
        {
            name     : 'Product ID',
            selector : row => row?.logistics_id,
            sortable : true,
        },
        {
            name     : 'Product Name',
            selector : row => row?.supplierDetails?.[0]?.supplier_name || 'N/A',
            sortable : true,
        },
        {
            name     : 'Product Quantity',
            selector : row => row?.supplierDetails?.[0]?.supplier_name || 'N/A',
            sortable : true,
        },
        {
            name     : 'Batch Number',
            selector : row => row?.status?.charAt(0)?.toUpperCase() + row?.status?.slice(1),
            sortable : true,
        },
        {
            name     : 'Delivery Date',
            selector : row => row?.status?.charAt(0)?.toUpperCase() + row?.status?.slice(1),
            sortable : true,
        },
        {
            name     : 'Status',
            cell     : row => (
                        <Link to={page === 'pickupOrder' 
                            ? `/logistics/pickup-order-details/${row?.logistics_id}`
                            : `/logistics/logistics-details/${row?.logistics_id}`}>
                            <RemoveRedEyeOutlinedIcon className={styles.viewButton} />
                        </Link>
                        ),
            ignoreRowClick: true,
            allowOverflow: true,
        }
    ];

    return (
        <Table
            columns      = {columns}
            data         = {list}
            totalItems   = {totalList}
            currentPage  = {currentPage}
            itemsPerPage = {listPerPage}
            onPageChange = {handlePageChange}
        />
    );
};

export default InventoryList;
