import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileEditReqsList } from "../../../../../redux/reducers/adminSlice";
import { formatDate } from "../../../../../utils/dateFormatter";
import PaginationComponent from "../../../shared-components/Pagination/Pagination";
import styles from "../../../../assets/style/table.module.css";
import "../../../../assets/style/table.css";

const EditProfileList = () => {
  const dispatch = useDispatch();
  const { profileEditReqs } = useSelector((state) => state?.adminReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const reqsPerPage = 10;

  // Calculate the index of the first and last item for the current page
  const indexOfLastReq = currentPage * reqsPerPage;
  const indexOfFirstReq = indexOfLastReq - reqsPerPage;

  // Slice the data to get only the items for the current page
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
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
    },
    {
      name: "Buyer ID",
      selector: (row) => row.user_id,
      sortable: true,
    },
    {
      name: "Buyer Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.editReqStatus,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/admin/buyer-edit-profile-details/${row._id}`}>
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
      <DataTable
        columns={columns}
        data={currentReqs} // Use sliced data instead of full profileEditReqs
        persistTableHead
        noDataComponent={<div className={styles["no-data"]}>No Data Available</div>}
        pagination={false} // Pagination is handled by PaginationComponent
        responsive
      />
      {profileEditReqs?.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={reqsPerPage}
          totalItemsCount={profileEditReqs?.length || 0}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default EditProfileList;