import React from "react";
import styles from "./mysuppliercard.module.css";
import { Link } from "react-router-dom";
import PaginationComponent from "../SharedComponents/Pagination/pagination";

const MySupplierCard = ({
  mySuppliers,
  loading,
  currentPage,
  itemsPerPage,
  totalItems,
  handlePageChange,
}) => {
  return (
   
        <div className={styles.section}>
          <div className={styles.container}>
            {mySuppliers.length > 0 ? (
              mySuppliers.map((supplier, i) => {
                return (
                  <div className={styles.mainCard} key={i}>
                    <div className={styles.cardImgSection}>
                      <div className={styles.cardImg}>
                        <img
                          className={styles.productImg}
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
                      <Link
                        to={`/buyer/supplier-details/${supplier?.supplier_details?.supplier_id}`}
                      >
                        <div className={styles.cardButton}>View Details</div>
                      </Link>
                    </div>
                    <div className={styles.cardContentSection}>
                      <div className={styles.cardMainHeading}>
                        {supplier?.supplier_details?.supplier_name}
                      </div>

                      <div className={styles.cardInnerContainer}>
                        <span className={styles.cardHead}>Company Type</span>
                        <div className={styles.cardText}>
                          {supplier?.supplier_details?.supplier_type}
                        </div>
                      </div>
                      <div className={styles.cardInnerContainer}>
                        <span className={styles.cardHead}>Country of Origin</span>

                        <div className={styles.cardText}>
                          {supplier?.supplier_details?.country_of_origin ||
                            "United Arab Emirates"}
                        </div>
                      </div>
                      <div className={styles.cardInnerContainer}>
                        <span className={styles.cardHead}>Country of Operation</span>
                        <div className={styles.cardText}>
                          {supplier?.supplier_details?.country_of_operation?.[0]
                            ? `${supplier.supplier_details.country_of_operation[0]}${supplier.supplier_details.country_of_operation.length > 1 ? " ..." : ""
                            }`
                            : "N/A"}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            ) : (
             <div className={styles.noDataSection}>No Suppliers Available</div>
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
      
  );
};

export default MySupplierCard;