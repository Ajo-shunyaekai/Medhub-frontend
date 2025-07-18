import React from "react";
import { Link } from "react-router-dom";
import Image from "../../../../assets/images/image.png";
import PaginationComponent from "../../../SharedComponents/Pagination/pagination";
import styles from "./productcard.module.css";
import ProductImage from "../../../../assets/images/productImage.png";
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
  return medicine[medicine.category].subCategory;
};

const ProductCard = ({
  productList,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
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
    <div className={styles.container}>
      {heading && <h5 className={styles.cardHeading}>{heading}</h5>}
      <div className={styles.gridContainer}>
        {productList &&
          productList.length > 0 &&
          productList.map((medicine, index) => {
            const firstViewKey = Object.keys(medicine.general.image || {})[0];
            const imageName = medicine.general.image?.[0] || medicine.general.image?.[firstViewKey]?.[0];
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
            
            const costPerProduct =
            medicine?.inventoryDetails?.[0]?.inventoryList?.price || "N/A";
            const stockedIn = medicine?.inventoryDetails?.[0]?.stockedInDetails[0]?.country ||
              "N/A";

            return (
              <div className={styles.card} key={index}>
                <div className={styles.innerContainer}>
                  <div className={styles.imageContainer}>
                    <img
                      src={imageSrc}
                      alt={
                        extractLast13WithExtension(
                            imageName
                        ) || "ProductImg"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = Image;
                      }}
                    />
                  </div>
                   <div className={styles.buttonContainer}>
                  <Link to={`/buyer/product-details/${medicine._id}`}>
                    <button className={styles.button}>View Details</button>
                  </Link>
                </div>
                </div>
                <div className={styles.contentSection}>
                  <Link to={`/buyer/product-details/${medicine._id}`}>
                    <span className={styles.mainHeading}>
                      {medicine?.general?.name || "N/A"}
                    </span>
                  </Link>
                  <div className={styles.cardContentSection}>
                    <div className={styles.section}>
                      <span className={styles.head}>Category</span>
                      <span className={styles.text}>
                        {formatCategory(medicine?.category)}
                      </span>
                    </div>
                    <div className={styles.section}>
                      <span className={styles.head}>Sub Category</span>
                      <span className={styles.text}>
                        {/* {getSubCategory(medicine)} */}
                        {medicine?.subCategory || "N/A"}
                      </span>
                    </div>
                    {isSecondaryMarket ? (
                      <>
                        <div className={styles.section}>
                          <span className={styles.head}>Purchased On</span>
                          <span className={styles.text}>
                            {formatDate(
                              medicine?.secondaryMarketDetails?.purchasedOn
                            )}
                          </span>
                        </div>
                        <div className={styles.section}>
                          <span className={styles.head}>Condition</span>
                          <span className={styles.text}>
                            {medicine?.secondaryMarketDetails?.condition ||
                              "N/A"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* <div className={styles.section}>
                          <span className={styles.head}>Total Quantity</span>
                          <span className={styles.text}>
                            {medicine?.general?.quantity || "N/A"}
                          </span>
                        </div> */}
                      </>
                    )}
                    {/* <div className={styles.section}>
                      <span className={styles.head}>Stock Status</span>
                      <span className={styles.text}>
                        {medicine?.inventoryDetails?.[0]?.stock || "N/A"}
                      </span>
                    </div> */}
                      <div className={styles.section}>
                      <span className={styles.head}>Cost Per Product</span>
                      <span className={styles.text}>
                        {costPerProduct !== "N/A" ? `${costPerProduct} USD` : "N/A"}
                      </span>
                    </div>
                     <div className={styles.section}>
                      <span className={styles.head}>Stocked In Countries</span>
                      <span className={styles.text}>
                        {stockedIn}
                      </span>
                    </div>
                  </div>
                </div>
               
              </div>
            );
          })}
        {(!productList || productList.length === 0) && (
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

export default ProductCard;
