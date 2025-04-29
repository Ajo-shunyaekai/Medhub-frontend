import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/secondsidebar.module.css";
import { AiOutlineProduct } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import ApprovedNewProducts from "./NewProducts";
import ApprovedSecondaryProducts from "./SecondaryProducts";
import Loader from "../../shared-components/Loader/Loader";
import { apiRequests } from "../../../../api";
import { fetchProductsList } from "../../../../redux/reducers/productSlice";

const ApprovedProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminIdSessionStorage = localStorage?.getItem("admin_id");
  const adminIdLocalStorage = localStorage?.getItem("admin_id");

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
  const listPerPage = 10;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  useEffect(() => {
    const fetchProducts = async () => {
      if (!adminIdSessionStorage && !adminIdLocalStorage) {
        localStorage?.clear();
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
      localStorage?.clear();
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
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>
              Products List
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.sidebar}>
              <div
                onClick={() => handleLinkClick("new")}
                className={`${activeLink === "new" ? styles.active : ""} ${styles.tab}`}
              >
                <AiOutlineProduct
                   className={styles.icon}
                />
                <div className={styles.text}>New Products</div>
              </div>
              <div
                onClick={() => handleLinkClick("secondary")}
                className={`${
                  activeLink === "secondary" ? styles.active : ""
                } ${styles.tab}`}
              >
                <AiOutlineProduct
                   className={styles.icon}
                />
                <div className={styles.text}>Secondary Products</div>
              </div>
            </div>
            <div className={styles.main}>
              {activeLink === "new" && (
                <ApprovedNewProducts
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
