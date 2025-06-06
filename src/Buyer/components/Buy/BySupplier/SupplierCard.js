import { Link } from "react-router-dom";
import styles from "./bysupplier.module.css";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";

const SupplierCard = ({
  supplierList,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  return (
    <div className={styles.cardMainContainer}>
      <div className={styles.cardContainer}>
        {supplierList && supplierList.length > 0 ? (
          supplierList.map((supplier, index) => (
            <div className={styles.cardSection} key={index}>
              <div className={styles.headSection}>
                <span className={styles.cardLogo}>
                  <img
                    src={
                      supplier.supplier_image[0]?.startsWith("http")
                        ? supplier.supplier_image[0]
                        : `${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplier.supplier_image[0]}`
                    }
                    alt="Logo"
                  />
                </span>

                <div className={styles.cardContentContainer}>
                  <span className={styles.cardHeading}>
                    {supplier.supplier_name || "Shunyaekai Technologies"}
                  </span>
                  <div className={styles.cardInnerContainer}>
                    <div className={styles.cardContentSection}>
                      <span className={styles.cardHead}>Company Type</span>
                      <span className={styles.cardText}>
                        {supplier.company_type || "Manufacturer"}
                      </span>
                    </div>
                    <div className={styles.cardContentSection}>
                      <span className={styles.cardHead}>Country of Origin</span>
                      <span className={styles.cardText}>
                        {supplier.country_of_origin || "N/A"}
                      </span>
                    </div>
                    <div className={styles.cardContentSection}>
                      <span className={styles.cardHead}>
                      Country of Operation
                      </span>
                      <span className={styles.cardText}>
                        {/* {supplier.country_of_operation?.join(', ') || "N/A"} */}
                        {supplier.country_of_operation?.length > 0
      ? `${supplier.country_of_operation[0]}${supplier.country_of_operation.length > 1 ? ', ...' : ''}`
      : 'N/A'}
                      </span>
                    </div>
                  </div>
                  {/* <div className={styles.cardContentSection}>
                                    <span className={styles.cardHead}>Description</span>
                                    <span className={styles.cardText}>{supplier.description || ''}</span>
                                </div> */}
                </div>
              </div>
              <div className={styles.ButtonContainer}>
                <Link to={`/buyer/supplier-details/${supplier.supplier_id}`}>
                  <button className={styles.cardButton}>View Details</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noData}>No suppliers found</div>
        )}
      </div>

      {/* Add PaginationComponent here */}
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

export default SupplierCard;
