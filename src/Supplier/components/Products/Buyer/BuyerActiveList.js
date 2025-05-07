import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment/moment';
import { postRequestWithToken } from '../../../api/Requests';
import PaginationComponent from '../../SharedComponents/Pagination/Pagination';
import Loader from '../../SharedComponents/Loader/Loader';
import styles from '../../../assets/style/table.module.css';

const BuyerActiveList = () => {
    const { buyerId } = useParams();
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const ordersPerPage = 8;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setLoading(true); // Show loader when changing pages
    };

    useEffect(() => {
        const supplierIdSessionStorage = localStorage?.getItem('supplier_id');
        const supplierIdLocalStorage = localStorage?.getItem('supplier_id');

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            localStorage?.clear();
            navigate('/supplier/login');
            return;
        }

        const obj = {
            buyer_id: buyerId,
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            order_type: 'active',
            pageNo: currentPage,
            pageSize: ordersPerPage,
        };

        postRequestWithToken('/buyer/buyer-supplier-orders', obj, async (response) => {
            if (response?.code === 200) {
                setOrderList(response.result.orderList || []);
                setTotalOrders(response.result.totalOrders || 0);
            } else {
                setOrderList([]);
                setTotalOrders(0);
            }
            setLoading(false); // Hide loader after data is fetched
        });
    }, [currentPage, buyerId, navigate]);

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
            cell: (row) => (
                <div>
                    {moment(row?.created_at).format('DD/MM/YYYY')}
                </div>
            ),
        },
        {
            name: 'Quantity',
            selector: (row) =>
                row?.items?.reduce((total, item) => {
                    return total + (item?.quantity_required || item?.quantity);
                }, 0),
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => row?.status,
            sortable: true,
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
            <div className={styles.tableMainContainer}>
                <span className={styles.title}>Active Orders</span>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={orderList}
                            persistTableHead
                            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                            pagination={false}
                            responsive
                        />
                        {orderList.length > 0 && (
                            <PaginationComponent
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalOrders}
                                pageRangeDisplayed={8}
                                onChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BuyerActiveList;