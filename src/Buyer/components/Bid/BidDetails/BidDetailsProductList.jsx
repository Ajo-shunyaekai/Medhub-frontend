import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchBidById } from "../../../../redux/reducers/bidSlice";
import { Tooltip } from "react-tooltip";
 
const BidDetailsProductList = ({}) => {
  const { id, itemId } = useParams();
  const dispatch = useDispatch();
  const { bidDetails } = useSelector((state) => state?.bidReducer || {});
 
  useEffect(() => {
    if (id) {
      dispatch(fetchBidById(`bid/${id}`));
    }
  }, [id]);
 
  const [currentPage, setCurrentPage] = useState(1);
  const bidsPerPage = 5;
 
  const columns = [
    // {
    //   name: "Id",
    //   selector: (row) =>
    //     (row?.type == "Product" ? "PDT" : "SRV") + " - " + row?.itemId,
    //   sortable: true,
    // },
    {
      name: "Product Name",
      selector: (row) => row?.productName,
      sortable: true,
      minWidth: "170px"
    },
    {
      name: "Type",
      selector: (row) => row?.type,
      sortable: true,
      minWidth : "130px"
    },
    {
      name: "Category",
      selector: (row) => row?.category,
      sortable: true,
      minWidth: "190px",
      cell : (row) => (
        <span id="category-toolTip">
          {row?.category.length > 21? row?.category.slice(0,21)+"...":row?.category}
          {
            row?.category.length > 21 && (
            <Tooltip
            anchorId="category-toolTip"
            content={row?.category}
            delayHide={500}
            place="bottom"
            positionStrategy="fixed"
            />
            )
          }
        </span>
      )
      
    },
    /* {
      name: "Open For",
      selector: (row) => row?.openFor,
      sortable: true,
    }, */
    {
      name: "Quantity Required",
      selector: (row) => row?.quantityRequired,
      sortable: true,
      minWidth: "210px"
    },
    {
      name: "Target Price",
      selector: (row) => row?.targetPrice + " USD",
      sortable: true,
      minWidth:"150px"
    },
  /*   {
      name: "Timeline",
      selector: (row) => row?.timeline + " Days",
      sortable: true,
    }, */
    {
      name: "Total Bids",
      selector: (row) => Number(row?.totalBidsCount || 0),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link
          to={`/buyer/bid/${id}/${row?.type?.toLowerCase()}/${row?.itemId}`}
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
 
  const [newOrder, setNewOrder] = useState([]);
 
  useEffect(() => {
    const allRows = bidDetails?.additionalDetails?.map((item) => ({
      productName: item?.name,
      type: item?.type,
      category: item?.category,
      quantityRequired: item?.quantity,
      targetPrice: item?.targetPrice,
      timeline: item?.delivery,
      totalBidsCount: item?.totalBidsCount || 0,
      itemId: item?.itemId,
    }));
 
    const indexOfLastProduct = currentPage * bidsPerPage;
    const indexOfFirstOrder = indexOfLastProduct - bidsPerPage;
    const currentOrders = allRows?.slice(indexOfFirstOrder, indexOfLastProduct);
    setNewOrder(currentOrders);
  }, [bidDetails, currentPage]);
 
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
        data={newOrder || []}
        noDataComponent={
          <div className={styles["no-data"]}>No Data Available</div>
        }
        persistTableHead
        pagination={false}
        responsive
      />
      {bidDetails?.additionalDetails?.length > 0 ? (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={bidsPerPage}
          totalItemsCount={bidDetails?.additionalDetails?.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      ) : null}
    </div>
    // </div>
  );
};
 
export default BidDetailsProductList;