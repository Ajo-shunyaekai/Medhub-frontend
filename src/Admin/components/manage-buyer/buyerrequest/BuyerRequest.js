import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postReqCSVDownload, postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';
import moment from 'moment/moment';
import Button from "../../shared-components/UiElements/Button/Button";
import Search from '../../shared-components/SearchComponent/Search';
 
const BuyerRequest = () => {
    const navigate = useNavigate();
    const location = useLocation();
 
    const queryParams = new URLSearchParams(location.search);
    const filterValue = queryParams.get('filterValue');
 
    const adminIdSessionStorage = localStorage?.getItem("admin_id");
    const adminIdLocalStorage = localStorage?.getItem("admin_id");
 
    const [loading, setLoading] = useState(true);
    const [downloadLoader, setDownloadLoader] = useState(false);
    const [buyerRequestList, setBuyerRequestList] = useState([]);
    const [totalRequests, setTotalRequests] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 8;
 
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
      console.log(trimmedValue); // log inputValue, not stale searchKey
      fetchSellerRequests(clearData ? "" : trimmedValue);
    };
 
    const fetchSellerRequests = (searchKey = '') => {
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: 'pending',
            filterValue: filterValue,
            pageNo: currentPage,
            pageSize: listPerPage,
            searchKey: searchKey
        };
 
        postRequestWithToken('admin/get-buyer-reg-req-list', obj, async (response) => {
            if (response?.code === 200) {
                setBuyerRequestList(response.result.data);
                setTotalRequests(response.result.totalItems);
            }
            setLoading(false);
        });
    };
 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
 
    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage?.clear();
            navigate('/admin/login');
            return;
        }
        fetchSellerRequests();
    }, [currentPage,  adminIdSessionStorage, adminIdLocalStorage, filterValue, navigate]);
 
    const handleDownload = async () => {
        setDownloadLoader(true);
        const result = await postReqCSVDownload('admin/get-buyer-list-csv', {}, 'buyer_requests_list.csv');
        if (!result?.success) {
            // Handle error if needed
        }
        setTimeout(()=>{ setDownloadLoader(false) },2000);
    };
 
    const columns = [
        {
            name: 'Date',
            selector: row => moment(row?.createdAt).format("DD/MM/YYYY"),
            sortable: true,
        },
        {
            name: 'Registration No.',
            selector: row => row?.registration_no,
            sortable: true,
        },
        {
            name: 'GST/VAT Registration Number',
            selector: row => row?.vat_reg_no,
            sortable: true,
        },
        {
            name: 'Company Name',
            selector: row => row?.buyer_name,
            sortable: true,
        },
        {
            name: 'Company Type',
            selector: row => row?.buyer_type,
            sortable: true,
        },
        {
            name: 'Country of Origin',
            selector: row => row?.country_of_origin,
            sortable: true,
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
                        <span className={styles.title}>Buyer Request</span>
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
                        placeholder='Search Buyers'
                    />
 
                    <DataTable
                        columns={columns}
                        data={buyerRequestList}
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        persistTableHead
                        pagination={false}
                        responsive
                    />
                    {buyerRequestList.length > 0 && (
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
        </section>
    );
};
 
export default BuyerRequest;