import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileEditReqsList } from "../../../../../redux/reducers/adminSlice";
import { formatDate } from "../../../../../utils/dateFormatter";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import PaginationComponent from '../../../shared-components/Pagination/Pagination';
import styles from '../../../../assets/style/table.module.css';
import Loader from "../../../shared-components/Loader/Loader";

const EditProfileList = () => {
  const dispatch = useDispatch();
  const { profileEditReqs, loading } = useSelector((state) => state?.adminReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const reqsPerPage = 8;

  const columns = [
    {
      name: "Date & Time",
      selector: (row) => formatDate(row?.createdAt),
      sortable: true,
    },
    {
      name: "Supplier ID",
      selector: (row) => row?.user_id,
      sortable: true,
    },
    {
      name: "Supplier Name",
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
        <Link to={`/admin/supplier-edit-profile-details/${row?._id}`} title="View Details">
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

  // Calculate the current data slice
  const indexOfLastReq = currentPage * reqsPerPage;
  const indexOfFirstReq = indexOfLastReq - reqsPerPage;
  const currentReqsForDisplay = Array.isArray(profileEditReqs)
    ? profileEditReqs.slice(indexOfFirstReq, indexOfLastReq)
    : [];

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <Loader/>
  }

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
        `}
      </style>
      <DataTable
        columns={columns}
        data={currentReqsForDisplay}
        persistTableHead
        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
        pagination={false}
        responsive
      />
      {profileEditReqs?.length > reqsPerPage && (
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