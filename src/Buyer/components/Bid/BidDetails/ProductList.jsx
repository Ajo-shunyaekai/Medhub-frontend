// ProductList.jsx
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addToFavourite, fetchBidById, requestQuote } from "../../../../redux/reducers/bidSlice";
import { minWidth } from "@mui/system";
import { toast } from "react-toastify";
import { MdOutlineStarBorder,  MdStarRate } from "react-icons/md";
import { postRequestWithToken } from "../../../../api/Requests";
import RequestModal from "./RequestModal/RequestModal";
 
const ProductList = ({socket}) => {

  const { id, itemId } = useParams();
  const dispatch = useDispatch();
  const { bidDetails } = useSelector((state) => state?.bidReducer || {});
 
  const [newOrder, setNewOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [requestQuoteBidObject, setRequestQuoteBidObject] = useState(null);

  const onClose = () => {
    setIsOpen(false);
  }
 
  useEffect(() => { 
    if (id) {
      dispatch(fetchBidById(`bid/${id}`));
    }
  }, [id]);
 
  const [currentPage, setCurrentPage] = useState(1);
  const bidsPerPage = 5;

 const handleAddToFavourite = async (row) => {
  try {
    const bidId = row.bidId;
    const participantId = row.participantId;  
    const itemId = row.additionalDetailsId;

    const updatedFavourite = !row.favourite;

    // const response = await dispatch(
    //   addToFavourite(`bid/add-to-favourite/${bidId}/${itemId}/${participantId}`)
    // );

    // if (response.meta.requestStatus === "fulfilled") {
      // setNewOrder((prev) =>
      //   prev.map((p) =>
      //     p.participantId === participantId && p.itemId === row.itemId
      //       ? { ...p, favourite: updatedFavourite }
      //       : p
      //   )
      // );
    //   if (updatedFavourite) {
    //     // toast.success("Added to favourites!");
    //     toast.success("Added to favourites!", { toastId: `${participantId}-${itemId}`});
    //   } else {
    //     // toast.warning("Removed from favourites!");
    //     toast.warning("Removed from favourites!", { toastId: `${participantId}-${itemId}`});
    //   }
    // } else {
    //   toast.error("Failed to update favourite. Please try again.");
    // }

    postRequestWithToken(`/bid/add-to-favourite/${bidId}/${itemId}/${participantId}`, {}, async(response) => {
      if(response?.code === 200) {
           setNewOrder((prev) =>
        prev.map((p) =>
          p.participantId === participantId && p.itemId === row.itemId
            ? { ...p, favourite: updatedFavourite }
            : p
        )
      );
       toast(response.message, { type: "success" });
      } else {

      }
    })
  } catch (error) {
    console.error("Error updating favourite:", error);
  }
 };

//  const handleRequestQuote = (row) => {
//   try {
//     // setLoading(true);
//     const obj = {
//       bidId: row.bidId,
//       additionalDetailsId: row.additionalDetailsId,
//       supplierId: row.participantId,
//       buyerId: row.userId,
//       productId: row.productId,
//       quantityRequired: row.quantityRequired,
//       targetPrice: row.amount,
//       deliveryTime: row.deliveryTime
//     }
//     dispatch(requestQuote(obj).unwrap().then((response) => {
//       if(response?.meta.requestStatus === 'fulfilled') {
//         // setLoading(false);
//       }
//     }))
//   } catch (error) {
//     toast.error(error);
//   } finally {
//     // setLoading(false);
//   }
//  }


const handleRequestQuote = async(row) => {
  try {
    setLoading(true);
    const obj = {
      bidId: row.bidId,
      itemId: row.additionalDetailsId,
      participantId: row.participantId,
      buyerId: row.userId,
      productId: row.productId,
      quantityRequired: row.quantityRequired,
      targetPrice: row.amount,
      deliveryTime: row.deliveryTime
    }

   await postRequestWithToken(`bid/send-enquiry/${obj.bidId}/${obj.itemId}/${obj.participantId}`,
      obj,
      async (response) => {
        if(response.code === 200) {
          socket.emit("sendInquiry", {
              supplierId: row.supplierId,
              message: "You have a new enquiry from a buyer!",
              link: process.env.REACT_APP_PUBLIC_URL,
            });
           toast(response.message, { type: "success" });
        } else {
          toast(response.message, { type: "error" });
        }
      }

    )
  } catch (error) {
    toast.error(error);
  } finally {
    setLoading(false);
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

          <Link
           title="Add to Favourite"
          >
            <div  className={styles.activeDownloadBtn}
             onClick={() => handleAddToFavourite(row)}
            >
            {/* {isFavourite? <MdStarRate size={18} className={styles["table-icon"]}/>:<MdOutlineStarBorder size={18} className={styles["table-icon"]}/>} */}
            {row.favourite
            ? <MdStarRate size={18} className={styles["table-icon"]}/>
            : <MdOutlineStarBorder size={18} className={styles["table-icon"]}/>
          }
         
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
        <button /* disabled={row.quoteRequested} */ className={styles.requestQuoteContainer} 
        onClick={() => {setIsOpen(true); setRequestQuoteBidObject(row)}}
        >
          {row?.quoteRequested?`Quote Requested`:`Request Quote`}
        </button>
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
            additionalDetailsId: item?._id,
            bidId: bidDetails?._id,
            userId: bidDetails?.userId,
            participantId: participant?.id, 
            id: participant._id,
            productId: participant?.productId,
            productName: participant?.productName,
            quantityRequired: item?.quantity,
            targetPrice: participant?.amount,
            deliveryTime: participant?.timeLine,
            tnc: participant?.tnc,
            quoteRequested: item?.quoteRequested
          });
        });
      });

    const sortedRows = allRows.sort((a, b) => {
        if (a.favourite === b.favourite) return 0;
        return a.favourite ? -1 : 1; // favourites on top
      });

      const currentOrder = sortedRows.slice(indexOfFirstOrder, indexOfLastProduct);
    // const currentOrder = allRows?.slice(indexOfFirstOrder,indexOfLastProduct);
 
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

     { isOpen &&
      <RequestModal
       onClose = {onClose}
       isOpen = {isOpen}
       handleRequestQuote = {handleRequestQuote}
       requestQuoteBidObject = {requestQuoteBidObject}
       setRequestQuoteBidObject = {setRequestQuoteBidObject}
       isLoading = {loading}
       setIsLoading = {setLoading}
      />
     }
    </div>
    // </div>
  );
};
 
export default ProductList;