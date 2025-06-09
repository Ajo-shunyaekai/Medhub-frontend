import React from "react";
import styles from "./supplierlist.module.css";
import ProductImage from "../../../assets/images/productImage.png";
import { Link } from "react-router-dom";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";

const SupplierList = ({
  supplierList,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  // Helper function to validate if a URL is valid
  const isValidHttpUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  // Helper function to check if the file has an image extension
  const isImageExtension = (fileName) => {
    const extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    return extensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        {supplierList?.length > 0 ? (
          supplierList?.map((supplier) => (
            <div key={supplier.supplier_id} className={styles.mainCard}>
              <div className={styles.cardImgSection}>
                <div className={styles.cardImg}>
                  <img
                    className={styles.productImg}
                    src={
                      supplier.supplier_image?.[0]
                        ? supplier.supplier_image[0].startsWith("http")
                          ? isValidHttpUrl(supplier.supplier_image[0]) &&
                            isImageExtension(supplier.supplier_image[0])
                            ? supplier.supplier_image[0]
                            : ProductImage
                          : isImageExtension(supplier.supplier_image[0])
                          ? `${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplier.supplier_image[0]}`
                          : ProductImage
                        : ProductImage
                    }
                    alt="Supplier Logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = ProductImage;
                    }}
                  />
                </div>
                <Link to={`/buyer/supplier-details/${supplier.supplier_id}`}>
                  <div className={styles.cardButton}>View Details</div>
                </Link>
              </div>
              <div className={styles.cardContentSection}>
                <div className={styles.cardMainHeading}>
                  {supplier.supplier_name}
                </div>
                <div className={styles.cardInnerContainer}>
                  <span className={styles.cardHead}>Company Type</span>
                  <span className={styles.cardText}>
                    {supplier.supplier_type}
                  </span>
                </div>
                <div className={styles.cardInnerContainer}>
                  <span className={styles.cardHead}>Country of Origin</span>
                  <span className={styles.cardText}>
                    {supplier.country_of_origin}
                  </span>
                </div>
                <div className={styles.cardInnerContainer}>
                  <span className={styles.cardHead}>Country of Operation</span>
                  <span className={styles.cardText}>
                    {supplier.country_of_operation?.length > 0
                      ? `${supplier.country_of_operation[0]}${
                          supplier.country_of_operation.length > 1 ? ", ..." : ""
                        }`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noDataSection}>No Suppliers Available</div>
        )}
      </div>

      {supplierList?.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={totalItems}
          pageRangeDisplayed={5}
          onChange={onPageChange}
        />
      )}
    </div>
  );
};

export default SupplierList;