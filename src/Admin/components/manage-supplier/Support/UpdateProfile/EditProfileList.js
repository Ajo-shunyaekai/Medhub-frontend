import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileEditReqsList } from "../../../../../redux/reducers/adminSlice";
import { formatDate } from "../../../../../utils/dateFormatter";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import PaginationComponent from '../../../shared-components/Pagination/Pagination';
import styles from '../../../../assets/style/table.module.css';
import '../../../../assets/style/table.css'

const EditProfileList = () => {
  const dispatch = useDispatch();
  const { profileEditReqs } = useSelector((state) => state?.adminReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const reqsPerPage = 10;

  const columns = [
    {
      name: "Date & Time",
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
    },
    {
      name: "Supplier ID",
      selector: (row) => row.user_id,
      sortable: true,

    },
    {
      name: "Supplier Name",
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
        <Link to={`/admin/supplier-edit-profile-details/${row._id}`}>
          <div className={styles.activeBtn}>
            <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
          </div>
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      sortable: false,
    },
  ];

  useEffect(() => {
    dispatch(
      fetchProfileEditReqsList("admin/get-profile-edit-requests?type=supplier")
    );
  }, [dispatch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastReq = currentPage * reqsPerPage;
  const indexOfFirstReq = indexOfLastReq - reqsPerPage;
  const currentReqsForDisplay = profileEditReqs.slice(
    indexOfFirstReq,
    indexOfLastReq
  );

  return (
    <div className={styles.container}>
      <DataTable
        columns={columns}
        data={currentReqsForDisplay}
        persistTableHead
        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
        pagination={false}
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