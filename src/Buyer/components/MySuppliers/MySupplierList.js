import React from "react";
import styles from "./mysupplier.module.css";
import { Link } from "react-router-dom";
import Loader from "../SharedComponents/Loader/Loader";
import PaginationComponent from "../SharedComponents/Pagination/pagination";

const MySupplierList = ({
  mySuppliers,
  loading,
  currentPage,
  itemsPerPage,
  totalItems,
  handlePageChange,
}) => {
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.mySupplierMainContainer}>
          <div className={styles.mySupplierMainSection}>
            {mySuppliers.length > 0 ? (
              mySuppliers.map((supplier, i) => {
                return (
                  <div className={styles.mySupplierCardSection} key={i}>
                    <div className={styles.mySupplierCardFirstUpparSection}>
                      <div className={styles.mySupplierImageSection}>
                        <img
                          src={
                            supplier?.supplier_details?.supplier_image?.[0]?.startsWith(
                              "http"
                            )
                              ? supplier?.supplier_details?.supplier_image?.[0]
                              : `${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplier?.supplier_details?.supplier_image?.[0]}`
                          }
                          alt="Supplier"
                        />
                      </div>
                    </div>
                    <div className={styles.mySupplierCardContentSection}>
                      <div className={styles.mySupplierNameHead}>
                        {supplier?.supplier_details?.supplier_name}
                      </div>

                      <div className={styles.mySupplierCardFirstSection}>
                        <div className={styles.mySupplierInnerCardSection}>
                          <div className={styles.mySupplierCardHeading}>
                            Company Type
                          </div>
                          <div className={styles.mySupplierCardText}>
                            {supplier?.supplier_details?.supplier_type}
                          </div>
                        </div>
                        <div className={styles.mySupplierInnerCardSection}>
                          <div className={styles.mySupplierCardHeading}>
                            Country of Origin
                          </div>
                          <div className={styles.mySupplierCardText}>
                            {supplier?.supplier_details?.country_of_origin ||
                              "United Arab Emirates"}
                          </div>
                        </div>
                        <div className={styles.mySupplierInnerCardSection}>
                          <div className={styles.mySupplierCardHeading}>
                            Country of Operation
                          </div>
                          <div className={styles.mySupplierCardText}>
                            {supplier?.supplier_details?.country_of_operation?.[0]
                              ? `${supplier.supplier_details.country_of_operation[0]}${
                                  supplier.supplier_details.country_of_operation.length > 1 ? " ..." : ""
                                }`
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.mySupplierCardButton}>
                      <Link
                        to={`/buyer/supplier-details/${supplier?.supplier_details?.supplier_id}`}
                      >
                        <div className={styles.mySupplierCardButtonDetails}>
                          View Details
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.mySupplierError}>No suppliers found</div>
            )}
          </div>
          {mySuppliers && mySuppliers.length > 0 && (
            <PaginationComponent
              activePage={currentPage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={totalItems}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          )}
        </div>
      )}
    </>
  );
};

export default MySupplierList;