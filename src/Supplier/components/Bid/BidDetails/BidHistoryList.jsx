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
import { Tooltip } from "react-tooltip";

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
      // selector: (row) => moment(row?.date).format("DD-MM-YYYY") || 0,
      selector: (row) => {
      return row?.date ? moment(row.date).format("DD-MM-YYYY") : "-";
    },
      sortable: true,
    },
    {
      name: "Bid Price",
      selector: (row) => row?.price?.value + " USD",
      sortable: true,
      cell: (row, rowIndex) => (
        <span style={{ color: row?.price?.edited ? "#31c971" : "#99a0ac" }}>
          {!row?.price?.edited && `${row?.price?.value} USD`}
          {row?.price?.edited && (
            <span id={`price-tooltip-${rowIndex}`}>
              {row?.price?.value} USD
              <Tooltip
                anchorId={`price-tooltip-${rowIndex}`}
                delayHide={500}
                content="Bid Price was edited"
              />
            </span>
          )}
        </span>
      ),
    },
    {
      name: "Bid Timeline",
      selector: (row) => row?.timeline?.value + " Days",
      sortable: true,
      cell: (row, rowIndex) => (
        <span style={{ color: row?.timeline?.edited ? "#31c971" : "#99a0ac" }}>
          {!row?.timeline?.edited && `${row?.timeline?.value} Days`}
          {row?.timeline?.edited && (
            <span id={`timeline-tooltip-${rowIndex}`}>
              {row?.timeline?.value} Days
              <Tooltip
                anchorId={`timeline-tooltip-${rowIndex}`}
                delayHide={500}
                content="Bid timeline was edited"
              />
            </span>
          )}
        </span>
      ),
    },
    {
      name: "T&C",
      selector: (row) => row?.tnc?.value,
      sortable: true,
      cell: (row, rowIndex) => {
        const value = row?.tnc?.value || "";
        const updatedTnC =
          value.length > 10 ? value.slice(0, 10) + "..." : value;
        return (
          <span style={{ color: row?.tnc?.edited ? "#31c971" : "#99a0ac" }}>
            {!row?.tnc?.edited && updatedTnC}
            {row?.tnc?.edited && (
              <span id={`tnc-tooltip-${rowIndex}`}>
                {updatedTnC}
                <Tooltip
                  anchorId={`tnc-tooltip-${rowIndex}`}
                  delayHide={500}
                  content="Bid Terms and conditions was edited"
                />
              </span>
            )}
          </span>
        );
      },
    },

    {
      name: "History",
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

    const allRows = [];

    (bidDetails?.additionalDetails || []).forEach((item) => {
      (item.participants || []).forEach((participant) => {
        (participant.history || []).forEach((history) => {
          allRows.push({
            price: history.amount,
            timeline: history.timeLine,
            type: history.type,
            tnc: history.tnc,
            date: history.date,
          });
        });
      });
    });

    setTotalHistory(allRows.length);

    const historyList = allRows.slice(indexOfFirstHistory, indexOfLastHistory);

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
      {totalHistory > 0 && (
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
