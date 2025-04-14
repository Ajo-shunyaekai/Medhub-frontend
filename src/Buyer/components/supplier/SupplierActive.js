import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postRequestWithToken } from '../../../api/Requests';
import moment from 'moment/moment';
import PaginationComponent from '../SharedComponents/Pagination/pagination';
import styles from './supplieractive.module.css';
import './table.css';

const SupplierActive = () => {
    const { supplierId } = useParams();
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const buyerIdSessionStorage = localStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            localStorage.clear();
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            supplier_id: supplierId,
            order_type: 'active',
            pageNo: currentPage,
            pageSize: ordersPerPage,
        };

        postRequestWithToken('/buyer/buyer-supplier-orders', obj, async (response) => {
            if (response?.code === 200) {
                setOrderList(response.result.orderList || []); // Ensure orderList is always an array
                setTotalOrders(response.result.totalOrders || 0);
            }
        });
    }, [currentPage, navigate, supplierId]);

    const columns = [
        {
            name: 'Order ID',
            selector: row => row.order_id,
            sortable: true,
            cell: row => <div className={styles.tableText}>{row.order_id}</div>,
        },
        {
            name: 'Date',
            selector: row => row.created_at,
            sortable: true,
            cell: row => <div className={styles.tableText}>{moment(row.created_at).format("DD/MM/YYYY")}</div>,
        },
        {
            name: 'Quantity',
            selector: row => row.items.reduce((total, item) => total + (item.quantity_required || item.quantity), 0),
            sortable: true,
            cell: row => {
                const totalQuantity = row.items.reduce((total, item) => total + (item.quantity_required || item.quantity), 0);
                return <div className={styles.tableText}>{totalQuantity}</div>;
            },
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => <div className={styles.tableText}>{row.status}</div>,
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/buyer/order-details/${row.order_id}`}>
                    <div className={styles.actionBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles.icon} />
                    </div>
                </Link>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className={styles.mainContainer}>
            <div className={styles.mainHeader}>Active Orders</div>
            <div className={styles.container}>
                <div className={styles.section}>
                    <DataTable
                        columns={columns}
                        data={orderList}
                        noDataComponent={<div className={styles.noData}>No Data Available</div>}
                        persistTableHead // Ensures headers are always shown
                        pagination
                        paginationServer
                        paginationTotalRows={totalOrders}
                        paginationPerPage={ordersPerPage}
                        paginationComponent={() => (
                            <PaginationComponent
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalOrders}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default SupplierActive;