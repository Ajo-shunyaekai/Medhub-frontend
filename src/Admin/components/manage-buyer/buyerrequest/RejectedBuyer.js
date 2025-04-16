import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postReqCSVDownload, postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';
import '../../../assets/style/table.css'

const RejectedBuyer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = localStorage.getItem("admin_id");
    const adminIdLocalStorage = localStorage.getItem("admin_id");

    const [loading, setLoading] = useState(true);
    const [buyerList, setBuyerList] = useState([]);
    const [totalBuyers, setTotalBuyers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 10;

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage.clear();
            navigate("/admin/login");
            return;
        }

        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: 'rejected',
            filterValue: filterValue,
            pageNo: currentPage,
            pageSize: listPerPage,
        };

        postRequestWithToken('admin/get-buyer-list', obj, async (response) => {
            if (response?.code === 200) {
                setBuyerList(response.result.data);
                setTotalBuyers(response.result.totalItems);
            }
            setLoading(false);
        });
    }, [currentPage, adminIdSessionStorage, adminIdLocalStorage, filterValue, navigate]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDownload = async () => {
        setLoading(true);
        const obj = { filterKey: 'rejected' };
        await postReqCSVDownload('admin/get-buyer-list-csv', obj, 'buyer_list.csv');
        setLoading(false);
    };

    const columns = [
        {
            name: 'Buyer ID',
            selector: (row) => row.buyer_id,
            sortable: true,
        },
        {
            name: 'Registration No',
            selector: row => row.registration_no,
            sortable: true,

        },
        {
            name: 'GST/VAT Registration No',
            selector: row => row.vat_reg_no,
            sortable: true,

        },
        {
            name: 'Buyer Name',
            selector: row => row.buyer_name,
            sortable: true,
        },
        {
            name: 'Buyer Type',
            selector: row => row.buyer_type,
            sortable: true,

        },
        {
            name: "Mobile No.",
            selector: (row) => `${row.buyer_country_code} ${row.buyer_mobile}`,
            sortable: true,
          },

        {
            name: 'Status',
            selector: (row) =>
                row.account_status
                    ? row.account_status === 1
                        ? 'Accepted'
                        : row.account_status === 2
                            ? 'Rejected'
                            : 'Pending'
                    : 'Status Unknown',
            sortable: true,

        },
        {
            name: 'Action',
            cell: (row) => (
                <Link to={`/admin/buyer-details/${row.buyer_id}`}>
                    <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
                </Link>
            ),

        },
    ];

    return (
        <div className={styles.container}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <header className={styles.header}>
                        <span className={styles.title}> Rejected Buyer</span>
                        <button className={styles.button} onClick={handleDownload}>
                            Download
                        </button>
                    </header>


                    <DataTable
                        columns={columns}
                        data={buyerList}
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        persistTableHead
                        pagination={false}

                    />

                    <PaginationComponent
                        activePage={currentPage}
                        itemsCountPerPage={listPerPage}
                        totalItemsCount={totalBuyers}
                        pageRangeDisplayed={10}
                        onChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default RejectedBuyer;