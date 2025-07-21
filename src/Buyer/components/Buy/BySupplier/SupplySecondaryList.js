import React, { useState, useEffect } from "react";
import styles from "./supplierdetails.module.css";
import { Link } from "react-router-dom";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import ProductImage from "../../../assets/images/productImage.png"
import { extractLast13WithExtension } from "../../../../utils/helper";

const SupplySecondaryList = ({
  productsData,
  totalProducts,
  currentPage,
  productsPerPage,
  handleProductPageChange,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const formatCategory = (str) => {
    return str.replace(/([A-Z])/g, " $1").trim();
  };
  const handleResize = () => {
    setItemsPerPage(4);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.mainCardsContainer}>
        {productsData?.length > 0 ? (
          productsData?.map((product, i) => {
            // const firstImage = Array.isArray(product?.general?.image)
            //   ? product.general?.image[0]
            //   : null;
            const firstViewKey = Object.keys(product.general.image || {})[0];
            const imageName = product?.general?.image?.[0] || product.general.image?.[firstViewKey]?.[0];
            const serverUrl = process.env.REACT_APP_SERVER_URL;
            let imageSrc = ProductImage;

            if (imageName) {
              imageSrc = imageName.startsWith("http")
                ? imageName
                : `${serverUrl}uploads/products/${imageName}`;
            }

            const linkTo = `/buyer/product-details/${product._id}`;
            const costPerProduct =
            product?.inventoryDetails?.[0]?.inventoryList?.price || "N/A";
            const stockedIn = product?.inventoryDetails?.[0]?.stockedInDetails[0]?.country ||
              "N/A";
            return (
              <div key={product.id} className={styles.productCont}>
                  <div className={styles.infoMainContainer}>
                <div className={styles.imgCont}>
                  {/* <img
                    src={
                      firstImage?.startsWith("http")
                        ? firstImage
                        : `${process.env.REACT_APP_SERVER_URL}uploads/products/${firstImage}`
                    }
                    alt="Product"
                  /> */}
                   <img
                    src={imageSrc}
                      alt={extractLast13WithExtension(imageName) || "ProductImg"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = Image;
                      }}
                  />
                </div>
                 <Link to={linkTo}>
                  <div className={styles.btnCont}>
                    <span className={styles.btnText}>View Details</span>
                  </div>
                </Link>
                </div>
                <div className={styles.rightCont}>
                  <div className={styles.title}>{product?.general?.name}</div>
                  <div className={styles.infoCont}>
                    <div className={styles.infoChild}>
                      <div className={styles.infoSection}>
                        <div className={styles.label}>Category</div>
                        <div className={styles.value}>
                          {/* {formatCategory(product?.category)} */}
                          {product?.category
                        ?.replace(/([a-z])([A-Z])/g, "$1 $2")
                        ?.replace(/\b\w/g, (char) => char.toUpperCase())}
                        </div>
                      </div>
                      <div className={styles.infoSection}>
                        <div className={styles.label}>Sub Category</div>
                        <div className={styles.value}>
                          {product?.[product?.category]?.subCategory || product?.categoryObject?.subCategory ||  "N/A"}
                        </div>
                      </div>
                      <div className={styles.infoSection}>
                        <div className={styles.label}>Stocked In Countries</div>
                        <div className={styles.value}>
                          {stockedIn}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

               
              </div>
            );
          })
        ) : (
          <div className={styles.noDataCont}>
            <div className={styles.noDataMsg}>No data available</div>
          </div>
        )}
      </div>
      {productsData && productsData.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={productsPerPage}
          totalItemsCount={totalProducts}
          pageRangeDisplayed={5}
          onChange={handleProductPageChange}
        />
      )}
    </div>
  );
};

export default SupplySecondaryList;
