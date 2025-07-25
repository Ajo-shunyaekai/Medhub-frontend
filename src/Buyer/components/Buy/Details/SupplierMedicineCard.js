import React from "react";
import { Link } from "react-router-dom";
import Image from "../../../assets/images/image.png";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "./medicinecard.module.css";
import ProductImage from "../../../assets/images/productImage.png";
import { extractLast13WithExtension } from "../../../../utils/helper";

const SupplierMedicineCard = ({
  productList,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  isSecondaryMarket = false,
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
        <span className={styles.heading}>Supplier List</span>
      <div className={styles.gridContainer}>
        
        {productList &&
          productList.length > 0 &&
          productList.map((medicine, index) => {
            // const firstImage =
            //   Array.isArray(medicine?.general?.image) &&
            //   medicine.general.image.length > 0
            //     ? medicine?.general?.image?.[0]?.startsWith("http")
            //       ? medicine?.general?.image?.[0]
            //       : `${process.env.REACT_APP_SERVER_URL}uploads/products/${medicine?.general?.image?.[0]}`
            //     : Image;

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

            // Extract only the required fields
            const supplierName = medicine?.userDetails?.supplier_name || "N/A";
            const productName = medicine?.general?.name || "N/A";
            const costPerProduct =
              medicine?.inventoryDetails?.[0]?.inventoryList?.price || "N/A";
            const totalQuantity = medicine?.general?.quantity || "N/A";
            const estimatedDeliveryTime =
              medicine?.inventoryDetails?.[0]?.inventoryList?.deliveryTime ||
              "N/A";
              const stockedIn = medicine?.inventoryDetails?.[0]?.stockedInDetails[0]?.country ||
              "N/A";
            const stockStatus = medicine?.inventoryDetails?.[0]?.stock || "N/A";

            return (
              <div className={styles.card} key={index}>
              
                <div className={styles.innerContainer}>
                  <div className={styles.imageContainer}>
                    {/* <img src={firstImage} alt="Product" /> */}
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
                  <Link to={`/buyer/product-details/${medicine._id}`}>
                    <button className={styles.button}>View Details</button>
                  </Link>
                </div>
                <div className={styles.contentSection}>
                  <div className={styles.section}>
                    <span className={styles.head}>Supplier Name</span>
                    <span className={styles.text}>{supplierName}</span>
                  </div>
                  <div className={styles.section}>
                    <span className={styles.head}>Product Name</span>
                    <span className={styles.text}>{productName}</span>
                  </div>
                  <div className={styles.section}>
                    <span className={styles.head}>Cost Per Product</span>
                    <span className={styles.text}>
                      {costPerProduct !== "N/A" ? `${costPerProduct} USD` : "N/A"}
                    </span>
                  </div>
                  <div className={styles.section}>
                    <span className={styles.head}>Total Quantity</span>
                    <span className={styles.text}>{totalQuantity}</span>
                  </div>
                  {/* <div className={styles.section}>
                    <span className={styles.head}>Est. Shipping Time</span>
                    <span className={styles.text}>
                      {estimatedDeliveryTime !== "N/A"
                        ? `${estimatedDeliveryTime} `
                        : "TBC- based on quantity"}
                    </span>
                  </div> */}
                  <div className={styles.section}>
                    <span className={styles.head}>Stocked In Country</span>
                    <span className={styles.text}>{stockedIn}</span>
                  </div>
                  {/* <div className={styles.section}>
                    <span className={styles.head}>Stock Status</span>
                    <span className={styles.text}>{stockStatus}</span>
                  </div> */}
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

export default SupplierMedicineCard;
