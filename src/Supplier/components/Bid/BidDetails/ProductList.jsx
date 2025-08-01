import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import styles from "../../../assets/style/table.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchBidById } from "../../../../redux/reducers/bidSlice";

const ProductList = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { bidDetails } = useSelector((state) => state?.bidReducer || {});

  useEffect(() => {
    if (id) {
      dispatch(fetchBidById(`bid/${id}`));
    }
  }, [id]);

  const [currentPage, setCurrentPage] = useState(1);
  const bidsPerPage = 5;

  // Function to calculate totalBidsPCount from participants
  const getTotalBids = (participants) => {
    // Assuming `totalBidsPCount` exists on participants, you can sum or use the first participant's count.
    return participants?.reduce((total, participant) => total + (participant?.totalBidsPCount || 0), 0) || 0;
  };

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row?.type,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row?.category,
      sortable: true,
    },
    {
      name: "Quantity Required",
      selector: (row) => row?.quantity,
      sortable: true,
    },
    {
      name: "Target Price",
      selector: (row) => row?.targetPrice + " USD",
      sortable: true,
    },
    {
      name: "Timeline",
      selector: (row) => row?.delivery + " Days",
    },
    {
      name: "Total Bids",
      selector: (row) => getTotalBids(row?.participants),  // Use the function to get total bids
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link
          to={`/supplier/bid/${id}/${row?.type?.toLowerCase()}/${row?.itemId}`}
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
  const currentOrders = bidDetails?.additionalDetails?.slice(
    indexOfFirstOrder,
    indexOfLastProduct
  );

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
      {bidDetails?.additionalDetails?.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={bidsPerPage}
          totalItemsCount={bidDetails?.additionalDetails?.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductList;
