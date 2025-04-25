import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';

const SellerTransaction = () => {
    const navigate = useNavigate();
    const adminId = localStorage.getItem("admin_id");

    const [loading, setLoading] = useState(true);
    const [transactionList, setTransactionList] = useState([]);
    const [totalList, setTotalList] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 10;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!adminId) {
            localStorage.clear();
            navigate("/admin/login");
            return;
        }

        const obj = {
            admin_id: adminId,
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
    }, [currentPage, adminId, navigate]);

    const columns = [
        {
            name: 'Transaction ID',
            selector: row => row.transaction_id,
            sortable: true,

        },
        {
            name: 'Buyer Name',
            selector: row => row.buyer_name,
            sortable: true,

        },
        {
            name: 'Total Amount',
            selector: row => row.total_amount_paid,
            sortable: true,
            cell: row => (
                <div className={styles.tableCell}>
                    {row.total_amount_paid ? `${row.total_amount_paid} USD` : '-'}
                </div>
            )
        },
        {
            name: 'Payment Mode',
            selector: row => row.mode_of_payment,
            sortable: true,

        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <div className={styles.tableCell}>
                    {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
                </div>
            )
        },
        {
            name: 'Action',
            cell: row => (
                
                    <a href={`/admin/supplier-transaction-details/${row.invoice_id}`}>
                        <div className={styles.activeBtn}>
                            <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                        </div>
                    </a>
               
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }
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
            {loading ? (
                <Loader />
            ) : (
                <>

                    <span className={styles.title}>Supplier Transaction List</span>


                    <DataTable
                        columns={columns}
                        data={transactionList}
                        persistTableHead
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        pagination={false}
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
                </>
            )}
        </div>
    );
};

export default SellerTransaction;