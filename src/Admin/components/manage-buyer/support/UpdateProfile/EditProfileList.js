import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileEditReqsList } from "../../../../../redux/reducers/adminSlice";
import { formatDate } from "../../../../../utils/dateFormatter";
import PaginationComponent from "../../../shared-components/Pagination/Pagination";
import styles from "../../../../assets/style/table.module.css";

const EditProfileList = () => {
  const dispatch = useDispatch();
  const { profileEditReqs } = useSelector((state) => state?.adminReducer);
  const [currentPage, setCurrentPage] = useState(1);
  const reqsPerPage = 8;
  const indexOfLastReq = currentPage * reqsPerPage;
  const indexOfFirstReq = indexOfLastReq - reqsPerPage;
  const currentReqs = profileEditReqs?.slice(indexOfFirstReq, indexOfLastReq);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(
      fetchProfileEditReqsList("admin/get-profile-edit-requests?type=buyer")
    );
  }, [dispatch]);

  const columns = [
    {
      name: "Date & Time",
      selector: (row) => formatDate(row?.createdAt),
      sortable: true,
    },
    {
      name: "Buyer ID",
      selector: (row) => row?.user_id,
      sortable: true,
    },
    {
      name: "Buyer Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.editReqStatus,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/admin/buyer-edit-profile-details/${row?._id}`}>
          <div className={styles.activeBtn}>
            <RemoveRedEyeOutlinedIcon className={styles["table-icon"]} />
          </div>
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      sortable: false,
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
            font-weight: bold;
            border-bottom: none !important;
          }
          .rdt_TableBody {
            gap: 10px !important;
          }
          .rdt_TableCol {
                
            color: #333;
          }
          .rdt_TableCell {
                
            color: #333;
            font-weight: 500 !important;
          }
          .rdt_TableCellStatus {
                
            color: #333;
          }
        `}
      </style>
      <DataTable
        columns={columns}
        data={currentReqs}
        persistTableHead
        noDataComponent={<div className={styles["no-data"]}>No Data Available</div>}
        pagination={false}
        responsive
      />
      {profileEditReqs?.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={reqsPerPage}
          totalItemsCount={profileEditReqs?.length || 0}
          pageRangeDisplayed={8}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default EditProfileList;