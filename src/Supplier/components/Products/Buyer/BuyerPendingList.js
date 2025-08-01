import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PaginationComponent from '../../SharedComponents/Pagination/Pagination';
import Loader from '../../SharedComponents/Loader/Loader';
import styles from '../../../assets/style/table.module.css';
import { postRequestWithToken } from '../../../api/Requests';
import moment from 'moment/moment';

const BuyerPendingList = () => {
    const { buyerId } = useParams();
    const navigate = useNavigate();

    const [orderList, setOrderList] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const ordersPerPage = 8;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            localStorage?.clear();
            navigate("/supplier/login");
            return;
        }

        setLoading(true); // Set loading to true before API call
        const obj = {
            buyer_id: buyerId,
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            order_type: 'pending',
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
            setLoading(false); // Set loading to false after API call
        });
    }, [currentPage, buyerId, navigate]);

    const columns = [
        {
            name: 'Order ID',
            selector: row => row?.order_id,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => moment(row?.created_at).format("DD/MM/YYYY"),
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row?.items?.reduce((total, item) => total + item?.quantity, 0),
            sortable: true,
        },
        {
            name: 'Price',
            selector: row => {
                const totalPrice = row?.items?.reduce((price, item) => {
                    const itemPrice = parseFloat(item.price.match(/[\d.]+/)[0]);
                    return price + itemPrice;
                }, 0);
                return totalPrice.toFixed(2);
            },
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row?.order_status,
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/supplier/active-orders-details/${row?.order_id}`}>
                    <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
                </Link>
            ),
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
                        font-weight: 500;
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
                   
                   color: #99a0ac;
                   font-size: 0.825rem;
            }
                `}
            </style>
            <div className={styles.tableMainContainer}>
                <span className={styles.title}>Enquiry Request</span>
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
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BuyerPendingList;