import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./editprofile.module.css";
import Table from "react-bootstrap/Table";
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileEditReqsList } from "../../../../../redux/reducers/adminSlice";
import { formatDate } from "../../../../../utils/dateFormatter";

const EditProfileList = ({}) => {
  const dispatch = useDispatch();
  const { profileEditReqs } = useSelector((state) => state?.adminReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const reqsPerPage = 5;
  const indexOfLastReq = currentPage * reqsPerPage;
  const indexOfFirstReq = indexOfLastReq - reqsPerPage;
  const currentReqsForDispaly = profileEditReqs.slice(
    indexOfFirstReq,
    indexOfLastReq
  ); // use sliced data for pagination

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(
      fetchProfileEditReqsList("admin/get-profile-edit-requests?type=buyer")
    );
  }, [dispatch]);

  return (
    <>
      <div className={styles["complaint-main-container"]}>
        <div className={styles["complaint-container"]}>
          <div className={styles["complaint-container-right-2"]}>
            <Table
              responsive="xxl"
              className={styles["complaint-table-responsive"]}
            >
              <thead>
                <div
                  className={styles["complaint-table-row-container"]}
                  style={{ backgroundColor: "transparent" }}
                >
                  <div
                    className={`${styles["complaint-table-row-item"]} ${styles["complaint-table-order-1"]}`}
                  >
                    <span className={styles["complaint-header-text-color"]}>
                      Date & Time
                    </span>
                  </div>
                  <div
                    className={`${styles["complaint-table-row-item"]} ${styles["complaint-table-order-1"]}`}
                  >
                    <span className={styles["complaint-header-text-color"]}>
                      Buyer ID
                    </span>
                  </div>
                  <div
                    className={`${styles["complaint-table-row-item"]} ${styles["complaint-table-order-1"]}`}
                  >
                    <span className={styles["complaint-header-text-color"]}>
                      Buyer Name
                    </span>
                  </div>
                  <div
                    className={`${styles["complaint-table-row-item"]} ${styles["complaint-table-order-1"]}`}
                  >
                    <span className={styles["complaint-header-text-color"]}>
                      Status
                    </span>
                  </div>
                  <div
                    className={`${styles["complaint-table-row-item"]} ${styles["complaint-table-order-1"]}`}
                  >
                    <span className={styles["complaint-header-text-color"]}>
                      Action
                    </span>
                  </div>
                </div>
              </thead>
              <tbody className={styles.bordered}>
                {currentReqsForDispaly && currentReqsForDispaly?.length > 0 ? (
                  currentReqsForDispaly?.map((req, index) => (
                    <div className={styles["complaint-table-row-container"]}>
                      <div
                        className={`${styles["complaint-table-row-item"]} ${styles["complaint-table-order-1"]}`}
                      >
                        <div className={styles["complaint-table-text-color"]}>
                          {formatDate(req?.createdAt)}
                        </div>
                      </div>
                      <div
                        className={`${styles["complaint-table-row-item"]} ${styles["complaint-table-order-1"]}`}
                      >
                        <div className={styles["complaint-table-text-color"]}>
                          {req?.user_id}
                        </div>
                      </div>
                      <div
                        className={`${styles["complaint-table-row-item"]} ${styles["complaint-table-order-1"]}`}
                      >
                        <div
                          className={`${styles["complaint-table-text-color"]} ${styles["truncated-text"]}`}
                        >
                          {req?.name}
                        </div>
                      </div>
                      <div
                        className={`${styles["complaint-table-row-item"]} ${styles["complaint-table-order-1"]}`}
                      >
                        <div className={styles["complaint-table-text-color"]}>
                          {req?.editReqStatus}
                        </div>
                      </div>
                      <div
                        className={`${styles["complaint-table-row-item"]} ${styles["complaint-table-btn"]} ${styles["complaint-table-order-1"]}`}
                      >
                        <Link to={`/admin/buyer-edit-profile-details/${req?._id}`}>
                          <div
                            className={`${styles["complaint-table"]} ${styles["complaint-table-view"]}`}
                          >
                            <RemoveRedEyeOutlinedIcon
                              className={styles["table-icon"]}
                            />
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div class="pending-products-no-orders">
                    No data available
                  </div>
                )}
              </tbody>
            </Table>
            {profileEditReqs?.length > 0 && (
              <div className={styles["complaint-pagi-container"]}>
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={reqsPerPage}
                  totalItemsCount={profileEditReqs?.length || 0}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                  itemClass="page-item"
                  linkClass="page-link"
                  prevPageText={
                    <KeyboardDoubleArrowLeftIcon style={{ fontSize: "15px" }} />
                  }
                  nextPageText={
                    <KeyboardDoubleArrowRightIcon
                      style={{ fontSize: "15px" }}
                    />
                  }
                  hideFirstLastPages={true}
                />
                <div className={styles["complaint-pagi-total"]}>
                  <div>Total Items: {profileEditReqs?.length || 0}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileList;
