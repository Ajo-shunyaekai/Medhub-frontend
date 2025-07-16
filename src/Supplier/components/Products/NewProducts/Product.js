import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./addproductlist.css";
import styles from "./product.module.css";
import SecondaryMarket from "./SecondaryMarket";
import NewProduct from "./NewProduct";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsList } from "../../../../redux/reducers/productSlice";
import Loader from "../../SharedComponents/Loader/Loader";
import FileUploadModal from "../../SharedComponents/FileUploadModal/FileUploadModal";
import { bulkUpload } from "../../../../redux/reducers/productSlice";

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productReducer);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // const path            = location.pathname?.split('/').filter(Boolean);;
  // const lastPart        = path[path.length - 1];
  // const showButtonGroup = lastPart === 'newproduct' ||  lastPart === 'product';

  const [medicineType, setMedicineType] = useState(() => {
    switch (location.pathname) {
      case "/supplier/product/newproduct":
        return "new";
      case "/supplier/product/secondarymarket":
        return "secondary market";
      default:
        return "new";
    }
  });

  const getActiveButtonFromPath = (path) => {
    switch (path) {
      case "/supplier/product/newproduct":
        return "newproduct";
      case "/supplier/product/secondarymarket":
        return "secondarymarket";
      default:
        return "newproduct";
    }
  };

  const activeButton = getActiveButtonFromPath(location.pathname);

  const handleButtonClick = (button) => {
    setCurrentPage(1);
    switch (button) {
      case "newproduct":
        setMedicineType("new");
        navigate("/supplier/product/newproduct");
        break;
      case "secondarymarket":
        setMedicineType("secondary market");
        navigate("/supplier/product/secondarymarket");
        break;
      default:
        navigate("/supplier/product/newproduct");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
  };

  const handleUpdateProductUpload = () => {
    if (selectedFile) {
      const bulkFormData = new FormData();
      bulkFormData.append("supplier_id", localStorage?.getItem("_id"));
      bulkFormData.append("csvfile", selectedFile);
      dispatch(bulkUpload(bulkFormData));
    }
  };

  useEffect(() => {
    const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage?.getItem("supplier_id");
    const supplier_id =
      localStorage?.getItem("_id") || localStorage?.getItem("_id");

    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      localStorage?.clear();
      navigate("/supplier/login");
      return;
    }
    const fetchData = async () => {
      const marketType = activeButton === "newproduct" ? "new" : "secondary";
      const response = await dispatch(
        fetchProductsList({
          url: `product?market=${marketType}&supplier_id=${supplier_id}&page_no=${currentPage}&page_size=${itemsPerPage}&showDuplicate=false`,
          // obj: { countries: ["India"] },
        })
      );
      if (response.meta.requestStatus === "fulfilled") {
        setTotalItems(response.payload?.totalItems);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, currentPage, medicineType]);

  return (
    <div className={styles.productContainer}>
      <div className={styles.productHead}>Products</div>
      <div className={styles.productButtonSection}>
        <div className={styles.mainButtons}>
          <div
            className={`${styles.newProductButton} ${
              activeButton === "newproduct" ? styles.active : ""
            }`}
            onClick={() => handleButtonClick("newproduct")}
          >
            New Product
          </div>
          <div
            className={`${styles.secondaryButton} ${
              activeButton === "secondarymarket" ? styles.active : ""
            }`}
            onClick={() => handleButtonClick("secondarymarket")}
          >
            Secondary Market
          </div>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {activeButton === "newproduct" && (
            <NewProduct
              products={products?.products}
              totalItems={totalItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              handlePageChange={handlePageChange}
            />
          )}
          {activeButton === "secondarymarket" && (
            <SecondaryMarket
              products={products?.products}
              totalItems={totalItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              handlePageChange={handlePageChange}
            />
          )}
        </>
      )}

      {open && (
        <FileUploadModal
          onClose={() => setOpen(false)}
          onSelectFile={handleSelectFile}
          onHandleUpload={handleUpdateProductUpload}
          modaltitle="Update Product"
          title="Update"
          selectedFile={selectedFile}
        />
      )}
    </div>
  );
};

export default Product;
