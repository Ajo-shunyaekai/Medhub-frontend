import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postReqCSVDownload, postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';
import moment from 'moment/moment';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';
import '../../../assets/style/table.css'

const SellerRequest = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = localStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const [loading, setLoading] = useState(true);
    const [sellerRequestList, setSellerRequestList] = useState([]);
    const [totalRequests, setTotalRequests] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 5;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
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

        postRequestWithToken('admin/get-supplier-reg-req-list', obj, async (response) => {
            if (response.code === 200) {
                setSellerRequestList(response.result.data);
                setTotalRequests(response.result.totalItems);
            } else {
                console.error('Error fetching supplier requests:', response.message);
            }
            setLoading(false);
        });
    }, [currentPage, adminIdSessionStorage, adminIdLocalStorage, filterValue, navigate]);

    const handleDownload = async () => {
        setLoading(true);
        const result = await postReqCSVDownload('admin/get-supplier-list-csv', {}, 'supplier_list.csv');
        if (!result?.success) {
            console.error('Error downloading CSV');
        }
        setLoading(false);
    };

    // Define columns for react-data-table-component
    const columns = [
        {
            name: 'Date',
            selector: (row) => moment(row.createdAt).format('DD/MM/YYYY'),
            sortable: true,
            // width: '120px',
        },
        {
            name: 'Company Type',
            selector: (row) => row.supplier_type,
            sortable: true,
            // width: '150px',
        },
        {
            name: 'Company Name',
            selector: (row) => row.supplier_name,
            sortable: true,
            // width: '200px',
        },
        {
            name: 'Email',
            selector: (row) => row.contact_person_email,
            sortable: true,
            // width: '250px',
        },
        {
            name: 'Country of Origin',
            selector: (row) => row.country_of_origin,
            sortable: true,
            // width: '150px',
        },
        {
            name: 'Company License No',
            selector: (row) => row.license_no,
            sortable: true,
            // width: '150px',
        },
        {
            name: 'Company Tax No.',
            selector: (row) => row.tax_no,
            sortable: true,
            // width: '150px',
        },
        {
            name: 'Action',
            cell: (row) => (
                <Link to={`/admin/supplier-request-details/${row.supplier_id}`}>
                    <div className={styles.activeBtn}>
                    <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
                </Link>
            ),
            center: true,
        },
    ];
    return (
        <section className={styles.container}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <header className={styles.header}>
                        <span className={styles.title}>Supplier Requests</span>
                        <button className={styles.button} onClick={handleDownload}>
                            Download
                        </button>
                    </header>
                   
                        <DataTable
                            columns={columns}
                            data={sellerRequestList}
                            // customStyles={customStyles}
                            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                            persistTableHead
                            pagination={false} // Disable built-in pagination
                        />
                 
                   
                        <PaginationComponent
                            activePage={currentPage}
                            itemsCountPerPage={listPerPage}
                            totalItemsCount={totalRequests}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                        />
                </>
            )}
        </section>
    );
};

export default SellerRequest;