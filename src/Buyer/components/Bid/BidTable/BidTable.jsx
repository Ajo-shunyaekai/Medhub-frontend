import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DataTable from "react-data-table-component";
import moment from "moment";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";
import { getTimeRemaining } from "../helper";
import { width } from "@mui/system";
 
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
      width: "110px",
    },
    {
      name: "Bid Start Date",
      selector: (row) => moment(row?.general?.startDate)?.format("DD/MM/YYYY"),
      sortable: true,
      width: "160px",
    },
    {
      name: "Bid End Date",
      selector: (row) => moment(row?.general?.endDate)?.format("DD/MM/YYYY"),
      sortable: true,
      width: "160px",
    },
    // {
    //   name: "Time Remaining",
    //   // selector: (row) => getTimeRemaining(row?.general?.endDate, row?.general?.endTime || "00:00"),
    //   cell: (row) => {
    //     return <span>{getTimeRemaining(row?.general?.endDate, row?.general?.endTime || "00:00")}</span>;
    //   },
    //   sortable: true,
    // },
    {
      name: "Time Remaining",
      cell: (row) => {
        const startDate = row?.general?.startDate;
        const startTime = row?.general?.startTime || "00:00"; // if you have it
        const endDate = row?.general?.endDate;
        const endTime = row?.general?.endTime || "00:00";
 
        return (
          <span>
            {getTimeRemaining(startDate, startTime, endDate, endTime)}
          </span>
        );
      },
      sortable: false,
      width: "150px",
    },
 
    // {
    //   name: "Participated",
    //   selector: (row) => row?.participated,
    //   sortable: true,
    // },
    {
      name: "Total Bids",
      selector: (row) => Number(row?.totalBidsCount || 0),
      sortable: true,
      width: "110px",
    },
 
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.buttonContainer}>
          <Link to={`/buyer/bid/${row?._id}`} title="View Details">
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
 
           @media (min-width: 1200px) and (max-width: 1320px) {
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
 
          @media(min-width:1380px){
            .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 110px;
            }
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 160px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 150px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 200px;
            }
            .rdt_TableCol:nth-child(6),
            .rdt_TableCell:nth-child(6) {
              min-width: 120px;
            }
            
          }
 
          @media(min-width:1451px){
          
          .rdt_TableCol:nth-child(2),
            .rdt_TableCell:nth-child(2) {
              min-width: 130px;
            }
          
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 180px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 180px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 190px;
            }
          }
          @media(min-width:1511px){
            .rdt_TableCol:nth-child(2),
              .rdt_TableCell:nth-child(2) {
                min-width: 150px;
              }
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 180px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 180px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 200px;
            }
          }
 
          @media(min-width:1560px){
          .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 200px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 200px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 220px;
            }
          }
 
          @media(min-width:1620px){
            .rdt_TableCol:nth-child(2),
              .rdt_TableCell:nth-child(2) {
                min-width: 170px;
              }
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 210px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 210px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 210px;
            }
          }
          @media(min-width:1680px){
            .rdt_TableCol:nth-child(2),
              .rdt_TableCell:nth-child(2) {
                min-width: 180px;
              }
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 220px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 220px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 215px;
            }
          }
          @media(min-width:1720px){
            .rdt_TableCol:nth-child(2),
              .rdt_TableCell:nth-child(2) {
                min-width: 200px;
              }
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 250px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 240px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 220px;
            }
            .rdt_TableCol:nth-child(6),
            .rdt_TableCell:nth-child(6) {
              min-width: 120px;
            }
          }
 
          @media(min-width:1800px){
            .rdt_TableCol:nth-child(2),
              .rdt_TableCell:nth-child(2) {
                min-width: 200px;
            }
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 270px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 250px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 240px;
            }
          }
 
          @media(min-width:1860px){
            .rdt_TableCol:nth-child(2),
              .rdt_TableCell:nth-child(2) {
                min-width: 200px;
            }
            .rdt_TableCol:nth-child(3),
            .rdt_TableCell:nth-child(3) {
              min-width: 280px;
            }
            .rdt_TableCol:nth-child(4),
            .rdt_TableCell:nth-child(4) {
              min-width: 260px;
            }
            .rdt_TableCol:nth-child(5),
            .rdt_TableCell:nth-child(5) {
              min-width: 260px;
            }
          }
        `}
      </style>
      <div className={styles.tableMainContainer}>
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