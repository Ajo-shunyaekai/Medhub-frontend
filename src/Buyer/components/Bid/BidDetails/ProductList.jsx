// ProductList.jsx
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addToFavourite, fetchBidById } from "../../../../redux/reducers/bidSlice";
import { minWidth } from "@mui/system";
import { MdOutlineStarBorder, MdOutlineStar } from "react-icons/md";
 
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

  const handleAddToFavourite = async (row) => {
   try {
    console.log('row',row)
    const bidId = row.bidId
    const paricipantId = row.paricipantId
    const itemId = row.id
    const updatedFavourite = !row.favourite; 

    const response = await dispatch(addToFavourite(`bid/add-to-favourite/${bidId}/${paricipantId}/${itemId}`))
    console.log('response',response)
    // setNewOrder((prev) =>
    //   prev.map((p) =>
    //     p.participantId === row.participantId && p.itemId === row.itemId
    //       ? { ...p, favourite: updatedFavourite }
    //       : p
    //   )
    // );

   } catch (error) {
    
   }
  }
 
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
      minWidth:"190px"
    },
    {
      name: "Company Type",
      selector: (row) => row?.companyType,
      sortable: true,
      minWidth:"140px"
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
      maxWidth:"140px"
    },
    {
      name: "Delivery Timeline",
      selector: (row) =>( row?.timeLine && row?.timeLine + " Days"),
      sortable: true,
      minWidth:"160px"
    },
    {
      name: "Action",
      cell: (row) => (
       <div className={styles.actionBtnContainer}>
          <Link
            // to={`/buyer/bid/${id}/${row?.companyType?.toLowerCase()}/${row?.itemId}`}
          to={`/buyer/supplier-details/${row?.supplierId}`}
          state={{
            bidId: row.bidId,
            userId: row.userId,
            participantId: row.participantId,
          }}
            title="View Details"
          >
            <div className={styles.activeBtn} onClick={handleAddToFavourite}>
              <VisibilityOutlinedIcon className={styles["table-icon"]}/>
            </div>
          </Link>
          <Link>
            <div className={styles.activeBtn}
            onClick={() => handleAddToFavourite(row)}
            >
            {/* <MdOutlineStarBorder size={18} className={styles["table-icon"]}/> */}
            {row.favourite ? (
          <MdOutlineStar size={18} className={styles["table-icon"]} />
        ) : (
          <MdOutlineStarBorder size={18} className={styles["table-icon"]} />
        )}
            </div>
          </Link>
       </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth:"150px"
    },

    {
      name:"Request",
      cell: (row) => (
        <div className={styles.requestQuoteContainer}>
          Request Quote
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth:"150px"
    }
  ];
 
 
  useEffect(()=>{
    const indexOfLastProduct = currentPage * bidsPerPage;
    const indexOfFirstOrder = indexOfLastProduct - bidsPerPage;

     const allRows = [];
      (bidDetails?.additionalDetails || []).forEach((item) => {
        (item.participants || []).forEach((participant) => {
          allRows?.push({
            registeredCountry: participant?.participantCountry,
            companyName: participant?.participantName,
            companyType: participant?.participantType,
            supplierId: participant?.participantId,
            amount: participant?.amount,
            timeLine: participant?.timeLine,
            favourite: participant?.favourite || false,
            itemId: item?.itemId,

            bidId: bidDetails?._id,
            userId: bidDetails?.userId,
            participantId: participant?.id, 
            id: participant._id
          });
        });
      });
 console.log('allRows',allRows)
    const currentOrder = allRows?.slice(indexOfFirstOrder,indexOfLastProduct);
 
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