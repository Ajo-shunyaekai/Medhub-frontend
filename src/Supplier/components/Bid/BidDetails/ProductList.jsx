// ProductList.jsx
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import styles from "../../../assets/style/table.module.css";

const ProductList = ({}) => {
  const dummyBids = [
    {
      _id: "BID20250701",
      productId: "BID20250701",
      name: "TEST ABC1",
      category: "TEST ABC1",
      totalBids: 10,
      status: "Active",
    },
    {
      _id: "BID20250628",
      productId: "BID20250628",
      name: "TEST ABC1",
      category: "TEST ABC1",
      totalBids: 10,
      status: "Completed",
    },
    {
      _id: "BID20250620",
      productId: "BID20250620",
      name: "TEST ABC1",
      category: "TEST ABC1",
      totalBids: 10,
      status: "Cancelled",
    },
    {
      _id: "BID20250703",
      productId: "BID20250703",
      name: "TEST ABC1",
      category: "TEST ABC1",
      totalBids: 10,
      status: "Active",
    },
    {
      _id: "BID20250615",
      productId: "BID20250615",
      name: "TEST ABC1",
      category: "TEST ABC1",
      totalBids: 10,
      status: "Completed",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const bidsPerPage = 5;

  const columns = [
    {
      name: "Product/Service Id",
      selector: (row) => row?.productId,
      sortable: true,
    },
    {
      name: "Product/Service Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Product/Service Category",
      selector: (row) => row?.category,
      sortable: true,
    },
    {
      name: "Total Bids",
      selector: (row) => row?.totalBids,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.invoice_status,
      sortable: true,
      cell: (row) => (
        <span>
          {row?.invoice_status?.charAt(0)?.toUpperCase() +
            row.invoice_status?.slice(1)}
        </span>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <Link
          to={`/supplier/bid-product-details/${row?.invoice_id}`}
          title="View Details"
        >
          <div className={styles.activeBtn}>
            <VisibilityOutlinedIcon className={styles["table-icon"]} />
          </div>
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const indexOfLastProduct = currentPage * bidsPerPage;
  const indexOfFirstOrder = indexOfLastProduct - bidsPerPage;
  const currentOrders = dummyBids?.slice(indexOfFirstOrder, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.mainInvoicecontainer2}>
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
      {/* <div className={styles.sectionMainContainer}> */}
      {/* <header className={styles.header}>
          <span className={styles.title}>Product List</span>
        </header> */}
      <DataTable
        columns={columns}
        data={currentOrders || []}
        noDataComponent={
          <div className={styles["no-data"]}>No Data Available</div>
        }
        persistTableHead
        pagination={false}
        responsive
      />
      {dummyBids?.length > 0 ? (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={bidsPerPage}
          totalItemsCount={dummyBids?.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      ) : null}
    </div>
    // </div>
  );
};

export default ProductList;
