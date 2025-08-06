// ProductList.jsx
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchBidById } from "../../../../redux/reducers/bidSlice";
import { minWidth } from "@mui/system";
 
const ProductList = ({}) => {
  const { id, itemId } = useParams();
  const dispatch = useDispatch();
  const { bidDetails } = useSelector((state) => state?.bidReducer || {});
 
  const [newOrder, setNewOrder] = useState([]);
 
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
      name: "Company Name",
      selector: (row) => row?.companyName,
      sortable: true,
      minWidth:"210px"
    },
    {
      name: "Company Type",
      selector: (row) => row?.companyType,
      sortable: true,
      minWidth:"100px"
    },
    {
      name: "From Country",
      selector: (row) => row?.registeredCountry,
      sortable: true,
      minWidth:"120px"
    },
    {
      name: "Bid Price",
      selector: (row) => (row?.amount && row?.amount + " USD"),
      sortable: true,
      maxWidth:"175px"
    },
    {
      name: "Delivery Timeline",
      selector: (row) =>( row?.timeLine && row?.timeLine + " Days"),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link
          to={`/buyer/bid/${id}/${row?.companyType?.toLowerCase()}/${row?.itemId}`}
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
 
 
  useEffect(()=>{
    const indexOfLastProduct = currentPage * bidsPerPage;
    const indexOfFirstOrder = indexOfLastProduct - bidsPerPage;
    /* const currentOrders = bidDetails?.additionalDetails?.slice(indexOfFirstOrder,indexOfLastProduct) || [];
    const currentOrdersWithCountry = currentOrders.map((order)=>(
      {
        ...order,
        registeredCountry : bidDetails?.buyerDetails?.registeredAddress?.country,
        companyName : bidDetails?.buyerDetails?.company_name,
        companyType: bidDetails?.buyerDetails?.registeredAddress?.type,
        amount : order.participants ? order?.participants[0]?.amount : "Nill",
        timeLine: order.participants ? order?.participants[0]?.timeLine : "Nill"
      }
    )); */
 
    const allRows = (bidDetails?.additionalDetails || []).flatMap((item)=>{
      return (item.participants || []).map((participant)=>({
        registeredCountry : participant?.participantCountry,
        companyName : participant?.participantName,
        companyType: participant?.participantType,
        amount: participant.amount,
        timeLine: participant.timeLine,
        itemId: item.itemId
      }))
    });
 
    const currentOrder = allRows.slice(indexOfFirstOrder,indexOfLastProduct);
 
    setNewOrder(currentOrder);
  },[bidDetails,currentPage]);
 
 
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
      {bidDetails?.additionalDetails?.participants?.length > 0 ? (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={bidsPerPage}
          totalItemsCount={bidDetails?.additionalDetails?.participants?.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      ) : null}
    </div>
    // </div>
  );
};
 
export default ProductList;