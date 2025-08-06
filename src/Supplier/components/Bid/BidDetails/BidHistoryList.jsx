import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import styles from "../../../assets/style/table.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchBidById } from "../../../../redux/reducers/bidSlice";
import moment from "moment";
import { style } from "@mui/system/Stack/createStack";
import { color } from "@mui/system";

const BidHistoryList = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { bidDetails } = useSelector((state) => state?.bidReducer || {});

  const [history, setHistory] = useState([]);
  const [totalHistory, setTotalHistory] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchBidById(`bid/${id}`));
    }
  }, [id]);

  const [currentPage, setCurrentPage] = useState(1);
  const historyPerPage = 5;

  const columns = [
    {
      name: "Date",
      selector: (row) => moment(row?.date).format("DD-MM-YYYY") || 0,
      sortable: true,
    },
    {
      name: "Bid Price",
      selector: (row) => row?.price?.value + " USD",
      sortable: true,
      cell: (row) => (
        <span style={{ color: row?.price?.edited ? "#31c971" : "#99a0ac" }}>
          {row?.price?.value} USD
        </span>
      ),
    },
    {
      name: "Bid Timeline",
      selector: (row) => row?.timeline?.value + " Days",
      sortable: true,
      cell: (row) => (
        <span style={{ color: row?.timeline?.edited ? "#31c971" : "99a0ac" }}>
          {row?.timeline?.value} Days
        </span>
      ),
    },
    {
      name: "Bid Modified",
      selector: (row) => row?.type,
      sortable: true,
    },
  ];

  /*     const conditionalRowStyles = [
        {
            when: row => row?.price?.edited === true || row?.timeline?.edited === true,
            style: {
            color: '#ff0000',
            }
        }
    ]; */

  useEffect(() => {
    const indexOfLastHistory = currentPage * historyPerPage;
    const indexOfFirstHistory = indexOfLastHistory - historyPerPage;

    const allRows = (bidDetails?.additionalDetails || [])
      ?.flatMap((item) => {
        return (item.participants || []).flatMap((participant) => {
          return (participant.history || []).map((history) => ({
            price: history.amount,
            timeline: history.timeLine,
            type: history.type,
            tnc:  history.tnc,
            timeStamp: history.date,
          }));
        });
      })

    setTotalHistory(allRows.length);

    /* console.log("All rows: ",allRows); */

    const historyList = allRows.slice(indexOfFirstHistory, indexOfLastHistory);

    /*  console.log("historyList: ",historyList); */
    setHistory(historyList);
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
      <DataTable
        columns={columns}
        data={history || []}
        noDataComponent={
          <div className={styles["no-data"]}>No Data Available</div>
        }
        persistTableHead
        pagination={false}
        responsive
        /*    conditionalRowStyles={conditionalRowStyles} */
      />
      {bidDetails?.additionalDetails?.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={historyPerPage}
          totalItemsCount={totalHistory}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BidHistoryList;
