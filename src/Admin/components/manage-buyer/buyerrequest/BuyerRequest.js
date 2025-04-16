import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';
import '../../../assets/style/table.css'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postReqCSVDownload, postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';
import moment from 'moment/moment';

const BuyerRequest = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = localStorage.getItem("admin_id");
    const adminIdLocalStorage = localStorage.getItem("admin_id");

    const [loading, setLoading] = useState(true);
    const [buyerRequestList, setBuyerRequestList] = useState([]);
    const [totalRequests, setTotalRequests] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 10;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage.clear();
            navigate("/admin/login");
            return;
        }
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: 'pending',
            filterValue: filterValue,
            pageNo: currentPage,
            pageSize: listPerPage,
        };

        postRequestWithToken('admin/get-buyer-reg-req-list', obj, async (response) => {
            if (response?.code === 200) {
                setBuyerRequestList(response.result.data);
                setTotalRequests(response.result.totalItems);
            }
            setLoading(false);
        });
    }, [currentPage, adminIdSessionStorage, adminIdLocalStorage, filterValue, navigate]);

    const handleDownload = async () => {
        setLoading(true);
        const result = await postReqCSVDownload('admin/get-buyer-list-csv', {}, 'buyer_list.csv');
        if (!result?.success) {
            // Optionally show error to user
        }
        setLoading(false);
    };

    const columns = [
        {
            name: 'Date',
            selector: row => moment(row.createdAt).format("DD/MM/YYYY"),
            sortable: true,

        },
        {
            name: 'Registration No.',
            selector: row => row.registration_no,
            sortable: true,

        },
        {
            name: 'GST/VAT Registration Number',
            selector: row => row.vat_reg_no,
            sortable: true,

        },
        {
            name: 'Company Name',
            selector: row => row.buyer_name,
            sortable: true,

        },
        {
            name: 'Company Type',
            selector: row => row.buyer_type,
            sortable: true,

        },
       
       
        {
            name: 'Country of Origin',
            selector: row => row.country_of_origin,
            sortable: true,

        },
      

        {
            name: 'Action',
            cell: row => (
                <Link to={`/admin/buyer-request-details/${row.buyer_id}`}>
                    <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
                </Link>
            ),
        },
    ];

    return (
        <section className={styles.container}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <header className={styles.header}>
                        <span className={styles.title}>Buyer Request</span>
                        <button className={styles.button} onClick={handleDownload}>
                            Download
                        </button>
                    </header>

                    <DataTable
                        columns={columns}
                        data={buyerRequestList}
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        persistTableHead
                        pagination={false}
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
        </section>
    );
};

export default BuyerRequest;