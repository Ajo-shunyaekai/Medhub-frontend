import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postReqCSVDownload, postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';
import { apiRequests } from '../../../../api';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';
import Button from "../../shared-components/UiElements/Button/Button";
import Search from '../../shared-components/SearchComponent/Search'
 
const ApprovedSeller = () => {
    const navigate = useNavigate();
    const location = useLocation();
 
    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');
 
    const adminIdSessionStorage = localStorage?.getItem('admin_id');
    const adminIdLocalStorage = localStorage?.getItem('admin_id');
 
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 8;
 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
 
    const [loading, setLoading] = useState(true);
    const [downloadLoader, setDownloadLoader] = useState(false);
    const [sellerRequestList, setSellerRequestList] = useState([]);
    const [totalRequests, setTotalRequests] = useState(0);
 
    /* search-bar */
    const [inputValue, setInputValue] = useState('');
    const [searchKey, setSearchKey] = useState('');
    
 
    const searchTimeoutRef = useRef(null);
 
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            setSearchKey(inputValue);
            setCurrentPage(1);
        }
    };
 
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            setSearchKey(e.target.value);
            setCurrentPage(1);
        }, 500);
    };
 
    const handleProductSearch = (clearData) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
 
        const trimmedValue = inputValue.trim();
        setSearchKey(clearData ? "" : trimmedValue);
        setCurrentPage(1);
        fetchSellerRequests(clearData ? "" : trimmedValue);
    };
 
    const fetchSellerRequests = (searchKey = '') => {
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: 'pending',
            filterValue: filterValue,
            pageNo: currentPage,
            pageSize: listPerPage,
            searchKey: searchKey,
            status: 1,
        };
 
        setLoading(true);
 
        postRequestWithToken('admin/get-supplier-reg-req-list', obj, (response) => {
            if (response?.code === 200) {
                setSellerRequestList(response.result.data);
                setTotalRequests(response.result.totalItems);
            } else {
                console.error('Error fetching supplier requests:', response.message);
            }
            setLoading(false);
        });
    };
    
    
 
    const handleDownload = async () => {
        setDownloadLoader(true);
        const obj = {
            filterKey: 'accepted'
        }
        const result = await postReqCSVDownload('admin/get-supplier-list-csv', obj, 'approved_suppliers_list.csv');
        if (!result?.success) {
            console.error('Error downloading CSV');
        }
        setTimeout(()=>{ setDownloadLoader(false) },2000);
    };
 
    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage?.clear();
            navigate('/admin/login');
            return;
        }
        fetchSellerRequests();
    }, [currentPage,  adminIdSessionStorage, adminIdLocalStorage, filterValue, navigate]);
 
    const columns = [
        {
            name: 'Supplier ID',
            selector: row => row?.supplier_id,
            sortable: true,
        },
        {
            name: 'Registration No.',
            selector: row => row?.registration_no,
            sortable: true,
        },
        {
            name: 'GST/VAT Registration No.',
            selector: row => row?.vat_reg_no,
            sortable: true,
        },
        {
            name: 'Supplier Name',
            selector: row => row?.supplier_name,
            sortable: true,
        },
        {
            name: 'Supplier Type',
            selector: row => row?.supplier_type,
            sortable: true,
        },
        // {
        //     name: 'Mobile No.',
        //     selector: row => row?.supplier_mobile,
        //     sortable: true,
        //     cell: row => (
        //         <>
        //             {row?.supplier_country_code} {row?.supplier_mobile}
        //         </>
        //     ),
        // },
        {
            name: 'Status',
            selector: row => row?.account_status,
            sortable: true,
            cell: row => (
                <div className={styles.tableCell}>
                    {row?.account_status
                        ? row?.account_status === 1
                            ? 'Accepted'
                            : row?.account_status === 2
                                ? 'Rejected'
                                : 'Pending'
                        : ''}
                </div>
            ),
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/admin/supplier-details/${row?.supplier_id}`} title="View Details">
                    <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
                </Link>
            ),
            center: true,
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
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.tableMainContainer}>
                    <header className={styles.header}>
                        <span className={styles.title}>Approved Supplier</span>
                        {/* <button className={styles.button} onClick={handleDownload}>
                            Download
                        </button> */}
                        <Button onClick={handleDownload} loading={downloadLoader}>
                            Download
                        </Button>
                    </header>
 
                    {/* Search-Section */}
                    <Search
                        setInputValue={setInputValue}
                        inputValue={inputValue}
                        handleInputChange={handleInputChange}
                        setSearchKey={setSearchKey}
                        handleProductSearch={handleProductSearch}
                        handleKeyDown={handleKeyDown}
                        placeholder='Search Suppliers'
                    />
 
                    <DataTable
                        columns={columns}
                        data={sellerRequestList}
                        persistTableHead
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        pagination={false}
                        responsive
                    />
                  
                    {sellerRequestList.length > 0 && (
                        <PaginationComponent
                            activePage={currentPage}
                            itemsCountPerPage={listPerPage}
                            totalItemsCount={totalRequests}
                            pageRangeDisplayed={8}
                            onChange={handlePageChange}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
 
export default ApprovedSeller;