import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postReqCSVDownload, postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';
import Button from "../../shared-components/UiElements/Button/Button";

const ApprovedBuyer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');

    const adminIdSessionStorage = localStorage?.getItem("admin_id");
    const adminIdLocalStorage = localStorage?.getItem("admin_id");

    const [loading, setLoading] = useState(true);
    const [downloadLoader, setDownloadLoader] = useState(false);
    const [buyerList, setBuyerList] = useState([]);
    const [totalBuyers, setTotalBuyers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 8;

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage?.clear();
            navigate("/admin/login");
            return;
        }

        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: 'accepted',
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
    }, [currentPage, filterValue, adminIdSessionStorage, adminIdLocalStorage, navigate]);

    const handleDownload = async () => {
        setDownloadLoader(true);
        const obj = {
            filterKey: 'accepted'
        };

        const result = await postReqCSVDownload('admin/get-buyer-list-csv', obj, 'approved_buyers_list.csv');
        if (!result?.success) {
            // Handle error if needed
        }
        setTimeout(()=>{ setDownloadLoader(false) },2000);
    };

    const columns = [
        {
            name: 'Buyer ID',
            selector: row => row?.buyer_id,
            sortable: true,
        },
        {
            name: 'Registration No',
            selector: row => row?.registration_no,
            sortable: true,
        },
        {
            name: 'GST/VAT Registration No',
            selector: row => row?.vat_reg_no,
            sortable: true,
        },
        {
            name: 'Buyer Name',
            selector: row => row?.buyer_name,
            sortable: true,
        },
        {
            name: 'Buyer Type',
            selector: row => row?.buyer_type,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row?.account_status,
            sortable: true,
            cell: row => (
                <div className={styles.tableText}>
                    {row?.account_status
                        ? (row?.account_status === 1 ? 'Accepted' :
                            row?.account_status === 2 ? 'Rejected' : 'Pending')
                        : ''
                    }
                </div>
            ),
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/admin/buyer-details/${row?.buyer_id}`} title="View Details">
                    <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
                </Link>
            ),
        }
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
    font-weight: bold !important;
    font-size: 14px !important;
    border-bottom: none !important;
                    }
                    .rdt_TableBody {
                        gap: 10px !important;
                    }
                    .rdt_TableCol {
                            
                       color: #212121 !important;
    font-weight: 600 !important;
                    }
                    .rdt_TableCell {
                            
                        color: #616161;
                        font-weight: 500 !important;
                    }
                    .rdt_TableCellStatus {
                            
                        color: #616161;
                    }
                `}
            </style>
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.tableMainContainer}>
                    <header className={styles.header}>
                        <span className={styles.title}>Approved Buyer</span>
                        {/* <button className={styles.button} onClick={handleDownload}>
                            Download
                        </button> */}
                        <Button onClick={handleDownload} loading={downloadLoader}>
                            Download
                        </Button>
                    </header>
                    <DataTable
                        columns={columns}
                        data={buyerList}
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        persistTableHead
                        pagination={false}
                        responsive
                    />
                    {buyerList.length > 0 && (
                        <PaginationComponent
                            activePage={currentPage}
                            itemsCountPerPage={listPerPage}
                            totalItemsCount={totalBuyers}
                            pageRangeDisplayed={8}
                            onChange={setCurrentPage}
                        />
                    )}
                </div>
            )}
        </section>
    );
};

export default ApprovedBuyer;