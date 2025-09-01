import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/secondsidebar.module.css";
import { AiOutlineProduct } from "react-icons/ai";
import { useDispatch } from "react-redux";
import ApprovedNewProducts from "./NewProducts";
import ApprovedSecondaryProducts from "./SecondaryProducts";
import Loader from "../../shared-components/Loader/Loader";
import { apiRequests } from "../../../../api";
import { fetchProductsList } from "../../../../redux/reducers/productSlice";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import DatePicker from "react-date-picker";
import { categoriesData } from "../../../../utils/Category";

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
  const [totalProducts, setTotalProducts] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const listPerPage = 8;

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
      fetchProductsList({
        url: `product?market=${marketType}&page_no=${currentPage}&page_size=${listPerPage}&showDuplicate=false`,
        // obj: { countries: ["India"] },
        
  })
    );
    if (response.meta.requestStatus === "fulfilled") {
      setProductList(response.payload.products);
      setTotalProducts(response.payload?.totalItems);
      setLoading(false);
    }
  };
  fetchProducts();
}, [currentPage, activeLink, adminIdLocalStorage, adminIdSessionStorage, dispatch, navigate]);

  // const handleDownload = () => {
  //   if (!adminIdSessionStorage && !adminIdLocalStorage) {
  //     localStorage?.clear();
  //     navigate("/admin/login");
  //     return;
  //   }
  //   const medicineType =
  //     activeLink === "new"
  //       ? "new"
  //       : activeLink === "secondary"
  //       ? "secondary market"
  //       : activeLink;
  //   const obj = {
  //     admin_id: adminIdSessionStorage || adminIdLocalStorage,
  //     medicineType: medicineType,
  //     status: 1,
  //     pageNo: currentPage,
  //     pageSize: listPerPage,
  //   };

  //   apiRequests?.postReqCSVDownload(
  //     "medicine/get-all-medicines-list-csv",
  //     obj,
  //     `${
  //       activeLink === "new" ? "New Products" : "Secondary Market Products"
  //     } Approved.csv`
  //   );
  // };

  /* filter and download button state manage */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUploadTypeOpen, setIsUploadTypeOpen] = useState(false);

  const [filteredData, setFilteredData] = useState({startDate:null, endDate:null, category:"All", uploadType:"All"});

  const [categoryOptions, setCategoryOptions] = useState([
    { label: "All", value: "All" },
    ...(categoriesData?.map((c) => ({ label: c.name, value: c.name })) || []),
  ]);

  const uploadType = ["All","Manual Type","Bulk Type"];

  console.log("categoryOptions: ",categoryOptions);
  console.log("filtereData: ", filteredData);

  const handleResetFilter = () => {
    setFilteredData({startDate:null, endDate:null, category:"All", uploadType:"All"});
    setIsFilterOpen(false);
  }

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
            <div className={`${isFilterOpen?styles.headerBtnDiv:styles.headerBtnDivFilterClose}`}>
              <div className={styles.filterBtnMainContainer}>
                <div className={styles.filteredBtnContainer}>
                  <div onClick={()=>setIsFilterOpen(!isFilterOpen)} className={styles.filterProductBtn}>
                    <span>Filter Product</span>
                    {
                      isFilterOpen? <FaAngleUp/>: <FaAngleDown/>
                    }
                  </div>
                  {
                  isFilterOpen &&
                  <ul className={styles.filterInnerSection}>
                    <li onClick={()=>setIsDateOpen(!isDateOpen)} className={styles.filterList}>
                      <span>Date</span>
                      {
                        isDateOpen? <FaAngleUp/> : <FaAngleDown/>
                      }
                    </li>
                    {/* {
                      isDateOpen &&
                      (
                       <div>
                         <li className={styles.filterList}>
                          <label>Start Date</label>
                           <DatePicker 
                            format="dd/MM/yyyy"
                            placeholder="__/__/____"
                            clearIcon={null}
                            calendarIcon={null}
                            className={styles.dateInput}
                            onKeyDown={(e) => e.preventDefault()}

                           />
                         </li>
                         <li></li>
                       </div>
                      )
                    } */}
                    <li onClick={()=>setIsCategoryOpen(!isCategoryOpen)} className={styles.filterList}>
                      <span>Category</span>
                      {
                        isCategoryOpen? <FaAngleUp/> :<FaAngleDown/>
                      }
                    </li>
                    {
                      isCategoryOpen && (
                        <ul className={styles.categoryOpenUl}>
                        {
                          categoryOptions.map((category,i)=>(
                            <li
                             key={i}
                             onClick={() =>
                                setFilteredData((prev) => ({ ...prev, category: category.value }))
                              }
                             className={`
                              ${styles.categoryLi}
                              ${filteredData.category === category.value ? styles.activeCategory: ""}
                              `}>
                              {category.label}
                            </li>
                          ))
                        }
                        </ul>
                      )
                    }
                    <li 
                    onClick={()=>setIsUploadTypeOpen(!isUploadTypeOpen)} 
                    className={`
                      ${isUploadTypeOpen? styles.filterList: styles.filterListLast}
                      ${isCategoryOpen? styles.borderTop:""}
                    `}>
                      <span>Upload Type</span>
                      {
                        isUploadTypeOpen? <FaAngleUp/> : <FaAngleDown/>
                      }
                    </li>
                    {
                      isUploadTypeOpen && (
                       <ul className={styles.uploadOpenUl}>
                          {
                            uploadType.map((type,i)=> (
                              <li 
                              key={i}
                              onClick={(prev)=>{
                                setFilteredData({...prev,uploadType:type})
                              }}
                              className={`
                              ${styles.categoryLi}
                              ${filteredData.uploadType === type ? styles.activeCategory: ""}
                              `}
                              >
                                {type}
                              </li>
                            ))
                          }
                        </ul>
                      )
                    }
                  </ul>
                  }
                </div>

                {isFilterOpen && <button className={styles.applyFilter}>Apply</button>}
                {isFilterOpen &&<button onClick={handleResetFilter} className={styles.resetFilterBtn}>Reset Filter</button>}
              </div>
              {/* download product list */}
              <div className={isFilterOpen?styles.downloadBtnIsOpen:styles.downloadBtn}>Download</div>
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
                  productList={productList}
                  totalProducts={totalProducts}
                  currentPage={currentPage}
                  listPerPage={listPerPage}
                  handlePageChange={handlePageChange}
                  activeLink={activeLink}
                />
              )}
              {activeLink === "secondary" && (
                <ApprovedSecondaryProducts
                  productList={productList}
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
