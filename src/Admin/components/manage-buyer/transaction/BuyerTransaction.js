import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';

const BuyerTransaction = () => {
    const navigate = useNavigate();
    const adminIdSessionStorage = localStorage?.getItem("admin_id");
    const adminIdLocalStorage = localStorage?.getItem("admin_id");

    const [loading, setLoading] = useState(true);
    const [transactionList, setTransactionList] = useState([]);
    const [totalList, setTotalList] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 10;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage?.clear();
            navigate("/admin/login");
            return;
        }
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: 'paid',
            pageNo: currentPage,
            pageSize: listPerPage,
        };

        postRequestWithToken('admin/get-transaction-list', obj, async (response) => {
            if (response?.code === 200) {
                setTransactionList(response.result.data);
                setTotalList(response.result.totalItems);
            }
            setLoading(false);
        });
    }, [currentPage, adminIdSessionStorage, adminIdLocalStorage, navigate]);

    const columns = [
        {
            name: 'Transaction ID',
            selector: row => row?.transaction_id,
            sortable: true,
        },
        {
            name: 'Supplier Name',
            selector: row => row?.supplier_name,
            sortable: true,
        },
        {
            name: 'Total Amount',
            selector: row => row?.total_amount_paid ? `${row?.total_amount_paid} USD` : 'Amount Not Provided',
            sortable: true,
        },
        {
            name: 'Payment Mode',
            selector: row => row?.mode_of_payment || 'Mode Not Provided',
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row?.status ? row?.status?.charAt(0)?.toUpperCase() + row?.status.slice(1) : 'Status Unknown',
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/admin/buyer-transaction-details/${row?.invoice_id}`}>
                    <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
                </Link>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            sortable: false,
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
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.tableMainContainer}>
                    <span className={styles.title}>Buyer Transaction List</span>
                    <DataTable
                        columns={columns}
                        data={transactionList}
                        persistTableHead
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        pagination={false}
                        responsive
                    />
                    {transactionList.length > 0 && (
                        <PaginationComponent
                            activePage={currentPage}
                            itemsCountPerPage={listPerPage}
                            totalItemsCount={totalList}
                            pageRangeDisplayed={10}
                            onChange={handlePageChange}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default BuyerTransaction;