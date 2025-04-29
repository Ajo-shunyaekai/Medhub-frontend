import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';

const TotalRequestList = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = localStorage?.getItem('admin_id');
    const adminIdLocalStorage = localStorage?.getItem('admin_id');

    const [loading, setLoading] = useState(true);
    const [requestList, setRequestList] = useState([]);
    const [totalRequests, setTotalRequests] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 10;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage?.clear();
            navigate('/admin/login');
            return;
        }
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: 'pending',
            filterValue: filterValue,
            pageNo: currentPage,
            pageSize: listPerPage,
        };

        postRequestWithToken('admin/get-buyer-supplier-reg-req-list', obj, async (response) => {
            if (response?.code === 200) {
                setRequestList(response.result.data);
                setTotalRequests(response.result.totalItems);
            } else {
                setRequestList([]);
            }
            setLoading(false);
        });
    }, [currentPage]);

    const columns = [
        {
            name: 'Registration Type',
            selector: (row) => row?.registration_type,
            sortable: true,
        },
        {
            name: 'Company Type',
            selector: (row) => row?.buyer_type || row?.supplier_type,
            sortable: true,
        },
        {
            name: 'Company Name',
            selector: (row) => row?.buyer_name || row?.supplier_name,
            sortable: true,
        },
        {
            name: 'Country of Origin',
            selector: (row) => row?.country_of_origin,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => row?.status || 'Pending',
            sortable: true,
            cell: (row) => <div>{row?.status || 'Pending'}</div>,
        },
        {
            name: 'Action',
            cell: (row) => (
                <Link
                    to={
                        row?.registration_type === 'Buyer'
                            ? `/admin/buyer-request-details/${row?.buyer_id}`
                            : `/admin/supplier-request-details/${row?.supplier_id}`
                    }
                >
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
        <section className={styles.container}>
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
                    <header className={styles.header}>
                        <span className={styles.title}>Total Request List</span>
                    </header>
                    <DataTable
                        columns={columns}
                        data={requestList}
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        persistTableHead
                        pagination={false}
                    />
                    {requestList.length > 0 && totalRequests > 0 && (
                        <PaginationComponent
                            activePage={currentPage}
                            itemsCountPerPage={listPerPage}
                            totalItemsCount={totalRequests}
                            pageRangeDisplayed={10}
                            onChange={handlePageChange}
                        />
                    )}
                </div>
            )}
        </section>
    );
};

export default TotalRequestList;