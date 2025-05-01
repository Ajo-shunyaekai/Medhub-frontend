import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import OrderCancel from '../OrderCancel';
import moment from 'moment/moment';
import PaginationComponent from "../../SharedComponents/Pagination/Pagination"
import styles from "../../../assets/style/table.module.css";

const CompleteOrder = ({ orderList, totalOrders, currentPage, ordersPerPage, handlePageChange, activeLink }) => {
    const [modal, setModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId);
        setModal(!modal);
    };

    // Define columns for react-data-table-component
    const columns = [
        {
            name: 'Order ID',
            selector: (row) => row?.order_id,
            sortable: true,

        },
        {
            name: 'Date',
            selector: (row) => row?.created_at,
            sortable: true,
            cell: (row) => <div>{moment(row?.created_at).format('DD/MM/YYYY')}</div>,
        },
        {
            name: 'Buyer Name',
            selector: (row) => row?.buyer?.buyer_name,
            sortable: true,

        },
        {
            name: 'Quantity',
            selector: (row) => row?.items?.reduce((total, item) => total + (item?.quantity || item?.quantity_required), 0),
            sortable: true,

        },
        {
            name: 'Status',
            selector: (row) => row?.order_status,
            sortable: true,
            cell: (row) => (
                <div>
                    {row?.order_status?.charAt(0)?.toUpperCase() + row?.order_status.slice(1)}
                </div>
            ),
        },
        {
            name: 'Action',
            cell: (row) => (

                <Link to={`/supplier/active-orders-details/${row?.order_id}`}>
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
                     
                  color: #99a0ac;
                  font-weight: 500 !important;
              }
              .rdt_TableCellStatus {
                     
                  color: #333;
              }
          `}
            </style>

            <DataTable
                columns={columns}
                data={orderList}
                persistTableHead
                noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                pagination={false}
                responsive
            />

            {modal && <OrderCancel setModal={setModal} orderId={selectedOrderId} activeLink={activeLink} />}
            {orderList.length > 0 && (
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={totalOrders}
                    pageRangeDisplayed={8}
                    onChange={handlePageChange}
                />
            )}
        </div>

    );
};

export default CompleteOrder;