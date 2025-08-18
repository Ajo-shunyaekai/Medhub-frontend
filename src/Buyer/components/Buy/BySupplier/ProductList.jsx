import React, {useEffect, useState} from 'react'
import styles from "../../../assets/style/table.module.css";
import style from './productlist.module.css'
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import PaginationComponent from '../../SharedComponents/Pagination/pagination';
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentBidDetails } from '../../../../redux/reducers/bidSlice';
import { minWidth } from '@mui/system';

const ProductList = ({supplierId}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBidDetails } = useSelector((state) => state?.bidReducer || {});



  const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage?.getItem("buyer_id");
  const buyerId = buyerIdSessionStorage || buyerIdLocalStorage

  const [currentBids, setCurrentBids] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bidsPerPage = 5;

   useEffect(() => {
    if (!buyerId) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }
    
    if (buyerId &&  supplierId) {
      dispatch(fetchCurrentBidDetails(`bid/get-current-bid-details/${buyerId}/${supplierId}?pageNo=${currentPage}&pageSize=${bidsPerPage}`));
    }
   }, [ buyerId, supplierId, dispatch, currentPage]);

    const columns = [
    {
        name: "Product Name",
        selector: (row) => row?.productName,
        sortable: true,
    },
    {
        name: "Qty Required",
        selector: (row) => row?.quantityRequired,
        sortable: true,
       /*  minWidth:"100px" */
    },
    {
        name: "Target Price",
        selector: (row) => (row?.targetPrice && row?.targetPrice + " USD"),
        sortable: true,
        /* maxWidth:"175px" */
    },
    {
        name: "Delivery Timeline",
        selector: (row) =>( row?.timeLine && row?.timeLine + " Days"),
        sortable: true,
    },
    {
        name: "Action",
        cell: (row) => (
        <div
        onClick={()=>navigate(`/buyer/product-details/${row.productId}`)}
            /* to={`/buyer/bid/${id}/${row?.companyType?.toLowerCase()}/${row?.itemId}`} */
            title="View Details"
        >
            <div className={styles.activeBtn}>
            <VisibilityOutlinedIcon className={styles["table-icon"]} />
            </div>
        </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    },
    {
      name:'Request',
      cell: (row) => (
        <div className={styles.requestQuoteContainer}>
          Request Quote
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth:"140px"
    }
    ];

    useEffect(() => {
      const indexOfLastProduct = currentPage * bidsPerPage;
    // const indexOfFirstOrder = indexOfLastProduct - bidsPerPage;

      const bidData = [];
       (currentBidDetails?.bidDocs || [])?.forEach(bid => {
        (bid.additionalDetails || [])?.forEach(item => {
          (item.participants || []).forEach(participant => {
            bidData?.push({
              productName: item.name,
              quantityRequired: item.quantity,
              targetPrice: item.targetPrice,
              timeLine: item.delivery,
              itemId: item.itemId,
              bidId: bid.bid_id,
              productId: participant.productId,
             });
            });
          });
        });

    // const currentBids = bidData?.slice(indexOfFirstOrder,indexOfLastProduct);
    setCurrentBids(bidData)

    }, [currentBidDetails, currentPage])
    


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

      <DataTable
        columns={columns}
        data={currentBids || []}
        noDataComponent={
          <div className={styles["no-data"]}>No Data Available</div>
        }
        persistTableHead
        pagination={false}
        responsive
      />

      <div className={style.paginationDiv}>
        <PaginationComponent
            activePage={currentPage}
            itemsCountPerPage={bidsPerPage}
            totalItemsCount={currentBidDetails?.totalItems || 0}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
        />
      </div>

    </div>
  )
}

export default ProductList