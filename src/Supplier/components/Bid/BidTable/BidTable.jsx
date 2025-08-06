import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DataTable from "react-data-table-component";
import moment from "moment";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import styles from "../../../assets/style/table.module.css";
import { getTimeRemaining } from "../helper";
import { width } from "@mui/system";
import CountdownTimer from "../../../../utils/CountDownTimer";
 
 
const BidTable = ({
  bidList,
  totalBids,
  currentPage,
  bidPerPage,
  handlePageChange,
}) => {
  const columns = [
    {
      name: "Bid ID",
      selector: (row) => row?.bid_id,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row?.status
          ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
          : "",
      sortable: true,
      width: "90px",
    },
    {
      name: "Bid Start Date",
      selector: (row) => moment(row?.general?.startDate)?.format("DD/MM/YYYY"),
      sortable: true,
      width: "140px",
    },
    {
      name: "Bid End Date",
      selector: (row) => moment(row?.general?.endDate)?.format("DD/MM/YYYY"),
      sortable: true,
      width:"140px"
    },
    {
      name: "Time Remaining",
      // selector: (row) => moment(row?.general?.endDate)?.format("DD/MM/YYYY"),
      cell: (row) => {
        const startDate = row?.general?.startDate;
        const startTime = row?.general?.startTime || "00:00";
        const endDate = row?.general?.endDate;
        const endTime = row?.general?.endTime || "00:00";
 
        // return (
        //   <span>
        //     {getTimeRemaining(startDate, startTime, endDate, endTime)}
        //   </span>
        // );
         return (
            <CountdownTimer
              startDate={startDate}
              startTime={startTime}
              endDate={endDate}
              endTime={endTime}
            />
          );
      },
      sortable: true,
      width: "140px",
    },
    // {
    //   name: "Participated",
    //   selector: (row) => row?.participated || 'Yes',
    //   sortable: true,
    // },
   {
      name: "Participated",
      selector: (row) => {
        const supplierId = localStorage?.getItem("_id");
 
        const hasParticipated = row?.additionalDetails?.some(detail =>
          detail?.participants?.some(participant => participant?.id === supplierId)
        );
 
        return hasParticipated ? "Yes" : "No";
      },
      sortable: true,
    },
    {
      name: "Total Bids",
      selector: (row) => Number(row?.totalBidsCount || 0),
      sortable: true,
      width: "100px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.buttonContainer}>
          <Link to={`/supplier/bid/${row?._id}`} title="View Details">
            <div className={styles.activeBtn}>
              <RemoveRedEyeOutlinedIcon className={styles["table-icon"]} />
            </div>
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
 
  return (
    <div className={styles.container}>
      <style>
        {`
          .rdt_Table {
            border: none;
            background-color: unset !important;
            width: 100% !important;
            table-layout: auto !important; 
            overflow-x: hidden !important; 
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
 
           @media (min-width: 1200px) and (max-width: 1233px) {
          .rdt_TableCol:nth-child(1),
            .rdt_TableCell:nth-child(1) {
              min-width: 30px;
            }
            
            .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 30px;
            }
 
           
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 30px;
            }
 
            
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 30px;
            }
 
          
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 50px;
            }
 
            .rdt_TableCol:nth-child(6),
            .rdt_TableCell:nth-child(6) {
              min-width: 40px;
            }
 
           
            .rdt_TableCol:nth-child(7),
            .rdt_TableCell:nth-child(7) {
              min-width: 60px;
            }
 
         
            .rdt_TableCol:nth-child(8),
            .rdt_TableCell:nth-child(8) {
              min-width: 30px;
            }
          }
 
 
        @media (min-width: 1234px) and (max-width: 1249px) {
          .rdt_TableCol:nth-child(1),
            .rdt_TableCell:nth-child(1) {
              min-width: 30px;
            }
            
            .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 30px;
            }
 
            
            
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 50px;
            }
 
           
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 50px;
            }
 
            
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 80px;
            }
 
            
            .rdt_TableCol:nth-child(6),
            .rdt_TableCell:nth-child(6) {
              min-width: 40px;
            }
 
           
            .rdt_TableCol:nth-child(7),
            .rdt_TableCell:nth-child(7) {
              min-width: 80px;
            }
 
          
            .rdt_TableCol:nth-child(8),
            .rdt_TableCell:nth-child(8) {
              min-width: 40px;
            }
          }
 
         @media (min-width: 1250px) and (max-width: 1284px) {
          .rdt_TableCol:nth-child(1),
            .rdt_TableCell:nth-child(1) {
              min-width: 30px;
            }
           
            .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 40px;
            }
 
            
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 80px;
            }
 
            
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 80px;
            }
 
            
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 110px;
            }
 
            
            .rdt_TableCol:nth-child(6),
            .rdt_TableCell:nth-child(6) {
              min-width: 70px;
            }
 
          
            .rdt_TableCol:nth-child(7),
            .rdt_TableCell:nth-child(7) {
              min-width: 100px;
            }
 
            
            .rdt_TableCol:nth-child(8),
            .rdt_TableCell:nth-child(8) {
              min-width: 50px;
            }
          }
 
 
          @media (min-width: 1285px) and (max-width: 1349px) {
          .rdt_TableCol:nth-child(1),
            .rdt_TableCell:nth-child(1) {
              min-width: 80px;
            }
           
            .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 80px;
            }
 
            
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 110px;
            }
 
           
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 110px;
            }
 
           
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 130px;
            }
 
           
            .rdt_TableCol:nth-child(6),
            .rdt_TableCell:nth-child(6) {
              min-width: 100px;
            }
 
           
            .rdt_TableCol:nth-child(7),
            .rdt_TableCell:nth-child(7) {
              min-width: 100px;
            }
 
            
            .rdt_TableCol:nth-child(8),
            .rdt_TableCell:nth-child(8) {
              min-width: 80px;
            }
          }
 
 
          @media (min-width: 1350px) and (max-width: 1399px) {
            .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 100px;
            }
 
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 120px;
            }
 
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 120px;
            }
 
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 130px;
            }
 
            .rdt_TableCol:nth-child(6),
            .rdt_TableCell:nth-child(6) {
              min-width: 100px;
            }
 
            .rdt_TableCol:nth-child(7),
            .rdt_TableCell:nth-child(7) {
              min-width: 100px;
            }
          }
 
 
          @media (min-width: 1420px) {
          .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 100px;
            }
           .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 150px;
            }
           .rdt_TableCol:nth-child(7),
            .rdt_TableCell:nth-child(7) {
              min-width: 110px;
            }
          }
          @media(min-width:1500px){
            .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 110px;
            }
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 140px;
            }
            .rdt_TableCol:nth-child(34),
            .rdt_TableCell:nth-child(4) {
              min-width: 140px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 180px;
            }
            .rdt_TableCol:nth-child(6),
            .rdt_TableCell:nth-child(6) {
              min-width: 100px;
            }
            .rdt_TableCol:nth-child(7),
            .rdt_TableCell:nth-child(7) {
              min-width: 140px;
            }
          }
 
          @media(min-width:1550px){
          .rdt_TableCol:nth-child(34),
            .rdt_TableCell:nth-child(4) {
              min-width: 150px;
            }
          .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 190px;
            }
          }
          @media(min-width:1600px){
          .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 130px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 140px;
            }
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 160px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 200px;
            }
            .rdt_TableCol:nth-child(6),
            .rdt_TableCell:nth-child(6) {
              min-width: 150px;
            }
 
            .rdt_TableCol:nth-child(7),
            .rdt_TableCell:nth-child(7) {
              min-width: 130px;
            }
          }
          @media(min-width:1700px){
            .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 120px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 230px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 180px;
            }
 
            .rdt_TableCol:nth-child(6),
            .rdt_TableCell:nth-child(6) {
              min-width: 190px;
            }
          }
        `}
      </style>
      <div className={styles.tableMainContainer} >
        <DataTable
          columns={columns}
          data={bidList}
          noDataComponent={
            <div className={styles["no-data"]}>No Data Available</div>
          }
          persistTableHead
          pagination={false}
          responsive
        />
        {bidList?.length > 0 && (
          <PaginationComponent
            activePage={currentPage}
            itemsCountPerPage={bidPerPage}
            totalItemsCount={totalBids}
            pageRangeDisplayed={10}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};
 
export default BidTable;