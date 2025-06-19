import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { postRequestWithToken } from "../../../api/Requests";
import moment from "moment/moment";
import Loader from '../../shared-components/Loader/Loader';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';

const TotalPO = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const filterValue = queryParams.get("filterValue");

  const adminIdSessionStorage = localStorage?.getItem("admin_id");
  const adminIdLocalStorage = localStorage?.getItem("admin_id");

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [totalList, setTotalList] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const listPerPage = 8;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchData = () => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      localStorage?.clear();
      navigate("/admin/login");
      return;
    }

    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      pageNo: currentPage,
      pageSize: listPerPage,
      filterValue: filterValue,
    };

    obj.status = "active";
    postRequestWithToken("purchaseorder/get-po-list", obj, (response) => {
      if (response?.code === 200) {
        setList(response.result.data);
        setTotalList(response.result.totalItems);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const columns = [
    {
      name: "PO ID",
      selector: (row) => row?.purchaseOrder_id,
      sortable: true,
    },
    {
      name: "Enquiry ID",
      selector: (row) => row?.enquiry_id,
      sortable: true,
    },
    {
      name: "PO Date",
      selector: (row) => row?.created_at,
      sortable: true,
      cell: (row) => <div>{moment(row?.created_at).format("DD/MM/YYYY")}</div>,
    },
    {
      name: "Status",
      selector: (row) => row?.po_status,
      sortable: true,
      cell: (row) => (
        <div>
          {row?.po_status
            ? row?.po_status
                ?.split(" ")
                ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
                ?.join(" ")
            : ""}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/admin/buyer-purchased-order-details/${row?.purchaseOrder_id}`}>
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
    font-weight: bold !important;
    font-size: 14px !important;
    border-bottom: none !important;
          }
          .rdt_TableBody {
            gap: 10px !important;
          }
          .rdt_TableCol {
                
           color: #5e676f !important;
    font-weight: 500 !important;
          }
          .rdt_TableCell {
                
               color: #99a0ac;
   
          }
          .rdt_TableCellStatus {
                
               color: #99a0ac;
          }
        `}
      </style>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.tableMainContainer}>
          <header className={styles.header}>
            <span className={styles.title}>Total Purchased Orders</span>
          </header>

          <DataTable
            columns={columns}
            data={list}
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            persistTableHead
            pagination={false}
            responsive
          />
          {list.length > 0 && totalList > 0 && (
            <PaginationComponent
              activePage={currentPage}
              itemsCountPerPage={listPerPage}
              totalItemsCount={totalList}
              pageRangeDisplayed={8}
              onChange={handlePageChange}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default TotalPO;