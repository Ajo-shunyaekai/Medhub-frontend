import React from "react";
import styles from "./product.module.css";
import "./product.css";
import ProductImage from "../../../assets/images/productImage.png";
import { Link } from "react-router-dom";
import ADD from "../../../assets/images/plus.svg";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";

const NewProduct = ({
  products,
  totalItems,
  currentPage,
  itemsPerPage,
  handlePageChange,
}) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
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
      <div className={styles.container}>
        <Link to="/supplier/add-product">
          <div className={styles.mainSection}>
            <span className={styles.head}>Add a Product</span>
            <div className={styles.imgContainer}>
              <img className={styles.productIcon} src={ADD} alt="add" />
            </div>
          </div>
        </Link>
        {products?.length > 0 ? (
          products?.map((product) => {
            const firstViewKey = Object.keys(product.general.image || {})[0];
            const imageName = product.general.image?.[0] || product.general.image?.[firstViewKey]?.[0];
            const serverUrl = process.env.REACT_APP_SERVER_URL;
            let imageSrc = ProductImage;

            if (imageName) {
              const imageUrl = imageName?.startsWith("http")
                ? imageName
                : `${serverUrl}uploads/products/${imageName}`;
              if (isValidHttpUrl(imageName) && isImageExtension(imageName)) {
                imageSrc = imageName;
              } else if (isImageExtension(imageName)) {
                imageSrc = imageUrl;
              }
            }

            return (
              <div key={product._id} className={styles.mainCard}>
                <div className={styles.cardImgSection}>
                  <div className={styles.cardImg}>
                    <img
                      className={styles.productImg}
                      src={imageSrc}
                      alt="Product Img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = ProductImage;
                      }}
                    />
                  </div>
                  <Link to={`/supplier/product-details/${product._id}`}>
                    <div className={styles.cardButton}>View Details</div>
                  </Link>
                </div>
                <div className={styles.cardContentSection}>
                  <div className={styles.cardMainHeading}>
                    {product.general.name || "Unnamed Product"}
                  </div>
                  <div className={styles.cardInnerContainer}>
                    <span className={styles.cardHead}>Category</span>
                    <span className={styles.cardText}>
                      {product?.category
                        ?.replace(/([a-z])([A-Z])/g, "$1 $2")
                        ?.replace(/\b\w/g, (char) => char.toUpperCase())}
                    </span>
                  </div>
                  <div className={styles.cardInnerContainer}>
                    <span className={styles.cardHead}>Sub Category</span>
                    <span className={styles.cardText}>
                      {product?.[product?.category]?.subCategory || "N/A"}
                    </span>
                  </div>
                  <div className={styles.cardInnerContainer}>
                    <span className={styles.cardHead}>Part/Model No.</span>
                    <span className={styles.cardText}>
                      {product.general.model || "N/A"}
                    </span>
                  </div>
                  <div className={styles.cardInnerContainer}>
                    <span className={styles.cardHead}>Total Quantity</span>
                    <span className={styles.cardText}>
                      {product.general.quantity || "0"}
                    </span>
                  </div>
                  <div className={styles.cardInnerContainer}>
                    <span className={styles.cardHead}>Stock Status</span>
                    <span className={styles.cardText}>
                      {product.inventoryDetails[0]?.stock ||
                        product.inventory?.stock ||
                        "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.noDataSection}>No Data Available</div>
        )}
      </div>

      {products?.length > 0 && (
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

export default NewProduct;
