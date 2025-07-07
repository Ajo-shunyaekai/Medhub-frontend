import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment/moment';
import { postRequestWithToken } from '../../../api/Requests';
import PaginationComponent from '../../SharedComponents/Pagination/Pagination';
import Loader from '../../SharedComponents/Loader/Loader';
import styles from '../../../assets/style/table.module.css';

const BuyerCompletedList = () => {
    const { buyerId } = useParams();
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Initialize loading state
    const ordersPerPage = 8;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
            order_type: 'completed',
            pageNo: currentPage,
            pageSize: ordersPerPage,
        };

        setLoading(true); // Set loading to true before API call
        postRequestWithToken('/buyer/buyer-supplier-orders', obj, async (response) => {
            if (response?.code === 200) {
                setOrderList(response.result.orderList || []);
                setTotalOrders(response.result.totalOrders || 0);
            } else {
                setOrderList([]);
                setTotalOrders(0);
            }
            setLoading(false); // Set loading to false after response
        });
    }, [currentPage, buyerId, navigate]);

    // Define columns for react-data-table-component
    const columns = [
        {
            name: 'Order ID',
            selector: (row) => row?.order_id,
            sortable: true,
        },
        {
            name: 'Date',
            selector: (row) => moment(row?.created_at).format('DD/MM/YYYY'),
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: (row) =>
                row?.items?.reduce((total, item) => total + (item?.quantity_required || item?.quantity), 0),
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
                        color: #5e676f;
                        font-size: 0.825rem;
                        font-weight: 600;
                        border-bottom: none !important;
                    }
                    .rdt_TableBody {
                        gap: 10px !important;
                    }
                    .rdt_TableCol {
                       
                        color: #5e676f !important;
              font-size: 0.825rem;
    font-weight: 500 !important;
                    }
                    .rdt_TableCell {
                      
                           color: #99a0ac;
              font-size: 0.825rem;
                     
                    }
                    .rdt_TableCellStatus {
                        text-align: center;
                           color: #99a0ac;
              font-size: 0.825rem;
                    }
                `}
            </style>
            <div className={styles.tableMainContainer}>
                <span className={styles.title}>Completed Orders</span>
                {loading ? (
                    <Loader /> // Display loader while loading
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

export default BuyerCompletedList;