import React from "react";
import { Link } from "react-router-dom";
import styles from "./productlist.module.css";
import Image from "../../../../assets/images/image.png";
import ProductImage from "../../../../assets/images/productImage.png";
import PaginationComponent from "../../../SharedComponents/Pagination/pagination";
import { extractLast13WithExtension } from "../../../../../utils/helper";

// Helper function to add spaces before capital letters
const formatCategory = (str) => {
  return str.replace(/([A-Z])/g, " $1").trim();
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to get subcategory dynamically for any category
const getSubCategory = (medicine) => {
  return medicine[medicine.category]?.subCategory || medicine?.subCategory || "N/A";
};

const ProductList = ({
  productList,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  searchValue,
  isSecondaryMarket = false,
  heading,
}) => {
  const isImageExtension = (filename) => {
    return /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(filename);
  };

  const isValidHttpUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  return (
    <div className={styles.section}>
      {heading && <h4 className={styles.cardHeading}>{heading}</h4>}
      <div className={styles.container}>
        {productList && productList.length > 0 ? (
          productList.map((medicine, index) => {
            const firstViewKey = Object.keys(medicine.general.image || {})[0];
            const imageName = medicine?.general?.image?.[0] || medicine.general.image?.[firstViewKey]?.[0];
            const serverUrl = process.env.REACT_APP_SERVER_URL;
            let imageSrc = ProductImage; // default fallback image

            // if (imageName) {
            //   const imageUrl = imageName?.startsWith("http")
            //     ? imageName
            //     : `${serverUrl}uploads/products/${imageName}`;
            //   if (isValidHttpUrl(imageName) && isImageExtension(imageName)) {
            //     imageSrc = imageName;
            //   } else if (isImageExtension(imageName)) {
            //     imageSrc = imageUrl;
            //   }
            // }
            if (imageName) {
              imageSrc = imageName.startsWith("http")
                ? imageName
                : `${serverUrl}uploads/products/${imageName}`;
            }

            return (
              <div key={index} className={styles.mainCard}>
                <div className={styles.cardImgSection}>
                  <div className={styles.cardImg}>
                    <img
                      src={imageSrc}
                      alt={extractLast13WithExtension(imageName) || "ProductImg"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = Image;
                      }}
                    />
                  </div>
                  {/* <Link to={`/buyer/product-details/${medicine._id}`}> */}
                  {/* <Link to={`/buyer/search-product-details/${medicine._id}`}> */}
                  <Link
                    to={{
                      pathname: `/buyer/search-product-details/${medicine._id}`,
                    }}
                    state={{ searchValue }}
                  >
                    <div className={styles.cardButton}>View Details</div>
                  </Link>
                </div>
                <div className={styles.cardContentSection}>
                  {/* <Link to={`/buyer/product-details/${medicine._id}`}> */}
                  {/* <Link to={`/buyer/search-product-details/${medicine._id}`}> */}
                  <Link
                    to={{
                      pathname: `/buyer/search-product-details/${medicine._id}`,
                    }}
                    state={{ searchValue }}
                  >
                    <div className={styles.cardMainHeading}>
                      {medicine?.general?.name || "N/A"}
                    </div>
                  </Link>
                  <div className={styles.cardInnerContainer}>
                    <span className={styles.cardHead}>Category</span>
                    <span className={styles.cardText}>
                      {formatCategory(medicine?.category) || "N/A"}
                    </span>
                  </div>
                  <div className={styles.cardInnerContainer}>
                    <span className={styles.cardHead}>Sub Category</span>
                    <span className={styles.cardText}>
                      {getSubCategory(medicine)}
                    </span>
                  </div>
                  {/* {isSecondaryMarket ? (
                    <>
                      <div className={styles.cardInnerContainer}>
                        <span className={styles.cardHead}>Purchased On</span>
                        <span className={styles.cardText}>
                          {formatDate(medicine?.secondaryMarketDetails?.purchasedOn)}
                        </span>
                      </div>
                      <div className={styles.cardInnerContainer}>
                        <span className={styles.cardHead}>Condition</span>
                        <span className={styles.cardText}>
                          {medicine?.secondaryMarketDetails?.condition || "N/A"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.cardInnerContainer}>
                      <span className={styles.cardHead}>Strength</span>
                      <span className={styles.cardText}>
                        {medicine?.general?.strength || "N/A"} {medicine?.general?.strengthUnit}
                      </span>
                    </div>
                  )} */}
                   <div className={styles.cardInnerContainer}>
                      <span className={styles.cardHead}>Strength</span>
                      <span className={styles.cardText}>
                        {medicine?.general?.strength || "N/A"} {medicine?.general?.strengthUnit}
                      </span>
                    </div>
                  {/* <div className={styles.cardInnerContainer}>
                    <span className={styles.cardHead}>Stock Status</span>
                    <span className={styles.cardText}>
                      {medicine?.inventoryDetails?.[0]?.stock || "N/A"}
                    </span>
                  </div> */}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.noData}>No data found</div>
        )}
      </div>
      {totalItems > itemsPerPage && (
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

export default ProductList;