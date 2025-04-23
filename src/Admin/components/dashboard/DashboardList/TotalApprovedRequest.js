import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';
import '../../../assets/style/table.css'

const TotalApprovedRequest = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = localStorage.getItem('admin_id');
    const adminIdLocalStorage = localStorage.getItem('admin_id');

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
            localStorage.clear();
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

        postRequestWithToken('admin/get-buyer-supplier-aprroved-reg-req-list', obj, async (response) => {
            if (response?.code === 200) {
                setRequestList(response.result.data);
                setTotalRequests(response.result.totalItems);
            }
            setLoading(false);
        });
    }, [currentPage]);

    const columns = [
        {
            name: 'Registration Type',
            selector: (row) => row.registration_type,
            sortable: true,
        },
        {
            name: 'Company Type',
            selector: (row) => row.buyer_type || row.supplier_type,
            sortable: true,
        },
        {
            name: 'Company Name',
            selector: (row) => row.buyer_name || row.supplier_name,
            sortable: true,
        },
        {
            name: 'Country of Origin',
            selector: (row) => row.country_of_origin,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <Link
                    to={
                        row.registration_type === 'Buyer'
                            ? `/admin/buyer-details/${row.buyer_id}`
                            : `/admin/supplier-details/${row.supplier_id}`
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
        <div className={styles.container}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <header className={styles.header}>
                        <span className={styles.title}>Total Approved Request List</span>

                    </header>

                    <DataTable
                        columns={columns}
                        data={requestList}
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        persistTableHead
                        pagination={false}
                        responsive
                    />
                    <PaginationComponent
                        activePage={currentPage}
                        itemsCountPerPage={listPerPage}
                        totalItemsCount={totalRequests}
                        pageRangeDisplayed={10}
                        onChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default TotalApprovedRequest;