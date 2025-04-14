import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/order.module.css";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useDispatch, useSelector } from "react-redux";
import { postRequestWithToken } from "../../../api/Requests";
import ApprovedNewProducts from "./ApprovedNewProducts";
import ApprovedSecondaryProducts from "./ApprovedSecondaryProducts";
import Loader from "../../shared-components/Loader/Loader";
import { apiRequests } from "../../../../api";
import { fetchProductsList } from "../../../../redux/reducers/productSlice";

const ApprovedProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminIdSessionStorage = localStorage.getItem("admin_id");
  const adminIdLocalStorage = localStorage.getItem("admin_id");

  const getActiveLinkFromPath = (path) => {
    switch (path) {
      case "/admin/products/new":
        return "new";
      case "/admin/products/secondary":
        return "secondary";
      default:
        return "new";
    }
  };

  const activeLink = getActiveLinkFromPath(location.pathname);

  const handleLinkClick = (link) => {
    setCurrentPage(1);
    switch (link) {
      case "new":
        navigate("/admin/products/new");
        break;
      case "secondary":
        navigate("/admin/products/secondary");
        break;
      default:
        navigate("/admin/products/new");
    }
  };

  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [medicineList, setMedicineList] = useState([]);
  const [totalProducts, setTotalProducts] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const listPerPage = 5;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  useEffect(() => {
    const fetchProducts = async () => {
      if (!adminIdSessionStorage && !adminIdLocalStorage) {
        localStorage.clear();
        navigate("/admin/login");
        return;
      }

      const marketType =
        activeLink === "new"
          ? "new"
          : activeLink === "secondary"
          ? "secondary"
          : activeLink;

      const response = await dispatch(
        fetchProductsList(
          `product?market=${marketType}&page_no=${currentPage}&page_size=${listPerPage}`
        )
      );
      if (response.meta.requestStatus === "fulfilled") {
        setMedicineList(response.payload.products);
        setTotalProducts(response.payload?.totalItems);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, activeLink]);

  const handleDownload = () => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      localStorage.clear();
      navigate("/admin/login");
      return;
    }
    const medicineType =
      activeLink === "new"
        ? "new"
        : activeLink === "secondary"
        ? "secondary market"
        : activeLink;
    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      medicineType: medicineType,
      status: 1,
      pageNo: currentPage,
      pageSize: listPerPage,
    };

    apiRequests?.postReqCSVDownload(
      "medicine/get-all-medicines-list-csv",
      obj,
      `${
        activeLink === "new" ? "New Products" : "Secondary Market Products"
      } Approved.csv`
    );
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles[`order-container`]}>
          <div className={styles["complete-container-order-section"]}>
            <div className={styles["complete-conatiner-head"]}>
              Products List
            </div>
          </div>
          <div className={styles[`order-wrapper`]}>
            <div className={styles[`order-wrapper-left`]}>
              <div
                onClick={() => handleLinkClick("new")}
                className={`${activeLink === "new" ? styles.active : ""} ${
                  styles["order-wrapper-left-text"]
                }`}
              >
                <DescriptionOutlinedIcon
                  className={styles["order-wrapper-left-icons"]}
                />
                <div>New Products</div>
              </div>
              <div
                onClick={() => handleLinkClick("secondary")}
                className={`${
                  activeLink === "secondary" ? styles.active : ""
                } ${styles["order-wrapper-left-text"]}`}
              >
                <DescriptionOutlinedIcon
                  className={styles["order-wrapper-left-icons"]}
                />
                <div>Secondary Products</div>
              </div>
            </div>
            <div className={styles[`order-wrapper-right`]}>
              {activeLink === "new" && (
                <ApprovedNewProducts
                  //  productList     = {productList}
                  productList={medicineList}
                  totalProducts={totalProducts}
                  currentPage={currentPage}
                  listPerPage={listPerPage}
                  handlePageChange={handlePageChange}
                  activeLink={activeLink}
                />
              )}
              {activeLink === "secondary" && (
                <ApprovedSecondaryProducts
                  // productList         = {productList}
                  productList={medicineList}
                  totalProducts={totalProducts}
                  currentPage={currentPage}
                  listPerPage={listPerPage}
                  handlePageChange={handlePageChange}
                  activeLink={activeLink}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApprovedProduct;
