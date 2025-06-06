import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { postReqCSVDownload, postRequestWithToken } from "../../../api/Requests";
import Loader from "../../shared-components/Loader/Loader";
import { apiRequests } from "../../../../api";
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';
import Button from "../../shared-components/UiElements/Button/Button";

const RejectedSuppliers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const filterValue = queryParams.get("filterValue");

  const adminIdSessionStorage = localStorage?.getItem("admin_id");
  const adminIdLocalStorage = localStorage?.getItem("admin_id");

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [sellerList, setSellerList] = useState([]);
  const [totalSellers, setTotalSellers] = useState(0);
  const listPerPage = 8;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDownload = async () => {
    setDownloadLoader(true);
    const obj = {
      filterKey: 'rejected'
    };
    const result = await postReqCSVDownload('admin/get-supplier-list-csv', obj, 'rejected_suppliers_list.csv');
    if (!result?.success) {
      console.error('Error downloading CSV');
    }
    setTimeout(()=>{ setDownloadLoader(false) },2000);
  };

  useEffect(() => {
    const fetchSupplierList = async () => {
      if (!adminIdSessionStorage && !adminIdLocalStorage) {
        localStorage?.clear();
        navigate("/admin/login");
        return;
      }

      const obj = {
        admin_id: adminIdSessionStorage || adminIdLocalStorage,
        filterKey: "rejected",
        filterValue: filterValue,
        pageNo: currentPage,
        pageSize: listPerPage,
      };

      setLoading(true);
      const response = await apiRequests.getRequest(
        `supplier/get-all-suppliers-list?filterKey=rejected&filterValue=${filterValue}&pageNo=${currentPage}&pageSize=${listPerPage}`
      );

      if (response?.code === 200) {
        setSellerList(response.result.data || []);
        setTotalSellers(response.result.totalItems || 0);
      } else {
        setSellerList([]);
        setTotalSellers(0);
      }
      setLoading(false);
    };

    fetchSupplierList();
  }, [currentPage, filterValue, adminIdSessionStorage, adminIdLocalStorage, navigate]);

  // Define columns for DataTable
  const columns = [
    {
      name: "Supplier ID",
      selector: (row) => row?.supplier_id,
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
    //   name: "Mobile No.",
    //   selector: (row) => `${row?.supplier_country_code} ${row?.supplier_mobile}`,
    //   sortable: true,
    // },
    {
      name: "Status",
      selector: (row) =>
        row?.account_status
          ? row?.account_status === 1
            ? "Accepted"
            : row?.account_status === 2
              ? "Rejected"
              : "Pending"
          : "",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/admin/supplier-details/${row?.supplier_id}`} title="View Details">
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
    <div className={`${styles.container} auth`}>
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
            <span className={styles.title}>Rejected Supplier</span>
            {/* <button className={styles.button} onClick={handleDownload}>
              Download
            </button> */}
            <Button onClick={handleDownload} loading={downloadLoader}>
                Download
            </Button>
          </header>
          <DataTable
            columns={columns}
            data={sellerList}
            pagination={false} // Disable built-in pagination
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            persistTableHead
            responsive
          />
          {sellerList.length > 0 && (
            <PaginationComponent
              activePage={currentPage}
              itemsCountPerPage={listPerPage}
              totalItemsCount={totalSellers}
              pageRangeDisplayed={8}
              onChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RejectedSuppliers;