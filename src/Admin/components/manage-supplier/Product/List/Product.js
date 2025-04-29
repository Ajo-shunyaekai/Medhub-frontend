// Product.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { MdProductionQuantityLimits } from "react-icons/md";
import styles from "../../../../assets/style/secondsidebar.module.css";
import NewProduct from "./NewProductList";
import SecondaryMarket from "./SecondaryProductList";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsList } from "../../../../../redux/reducers/productSlice";
import Loader from "../../../shared-components/Loader/Loader";
import FileUploadModal from "../FileUpload/FileUpload";
import { bulkUpload } from "../../../../../redux/reducers/productSlice";

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { supplierId } = useParams();
  const { products } = useSelector((state) => state.productReducer);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [medicineType, setMedicineType] = useState(() => {
    switch (location.pathname) {
      case `/admin/supplier/${supplierId}/products/new`:
        return "new";
      case `/admin/supplier/${supplierId}/products/secondary`:
        return "secondary";
      default:
        return "new";
    }
  });

  const getActiveButtonFromPath = (path) => {
    switch (path) {
      case `/admin/supplier/${supplierId}/products/new`:
        return "new";
      case `/admin/supplier/${supplierId}/products/secondary`:
        return "secondary";
      default:
        return "new";
    }
  };

  const activeButton = getActiveButtonFromPath(location.pathname);

  const handleButtonClick = (button) => {
    setCurrentPage(1);
    switch (button) {
      case "new":
        setMedicineType("new");
        navigate(`/admin/supplier/${supplierId}/products/new`);
        break;
      case "secondary":
        setMedicineType("secondary");
        navigate(`/admin/supplier/${supplierId}/products/secondary`);
        break;
      default:
        navigate(`/admin/supplier/${supplierId}/products/new`);
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
      bulkFormData.append("supplier_id", supplierId);
      bulkFormData.append("csvfile", selectedFile);
      dispatch(bulkUpload(bulkFormData)).then((response) => {
        if (response?.meta.requestStatus === "fulfilled") {
          // Refresh product list after bulk upload
          const marketType = activeButton === "new" ? "new" : "secondary";
          dispatch(
            fetchProductsList(
              `product?market=${marketType}&supplier_id=${supplierId}&page_no=1&page_size=${itemsPerPage}`
            )
          );
        }
      });
    }
  };

  useEffect(() => {
    const admin_id = localStorage?.getItem("_id");
    if (!admin_id) {
      localStorage?.clear();
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const marketType = activeButton === "new" ? "new" : "secondary";
      const response = await dispatch(
        fetchProductsList(
          `product?market=${marketType}&supplier_id=${supplierId}&page_no=${currentPage}&page_size=${itemsPerPage}`
        )
      );
      if (response.meta.requestStatus === "fulfilled") {
        setTotalItems(response.payload?.totalItems);
        setLoading(false);
      } else {
        console.error("Failed to fetch products:", response.error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, currentPage, medicineType, supplierId, location.pathname]); // Add location.pathname as a dependency

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>Products</div>
            <Link to={`/admin/supplier/${supplierId}/add-product`}>
              <button className={styles.button}>Add Product</button>
            </Link>
          </div>
          <div className={styles.content}>
            <div className={styles.sidebar}>
              <div
                className={`${styles.tab} ${
                  activeButton === "new" ? styles.active : ""
                }`}
                onClick={() => handleButtonClick("new")}
              >
                <MdProductionQuantityLimits className={styles.icon} />
                <div className={styles.text}>New Product</div>
              </div>
              <div
                className={`${styles.tab} ${
                  activeButton === "secondary" ? styles.active : ""
                }`}
                onClick={() => handleButtonClick("secondary")}
              >
                <MdProductionQuantityLimits className={styles.icon} />
                <div className={styles.text}>Secondary Market</div>
              </div>
            </div>
            <div className={styles.main}>
              {activeButton === "new" && (
                <NewProduct
                  products={products?.products}
                  totalItems={totalItems}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  handlePageChange={handlePageChange}
                />
              )}
              {activeButton === "secondary" && (
                <SecondaryMarket
                  products={products?.products}
                  totalItems={totalItems}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  handlePageChange={handlePageChange}
                />
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
          </div>
        </div>
      )}
    </>
  );
};

export default Product;