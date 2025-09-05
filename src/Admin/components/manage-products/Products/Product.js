import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/secondsidebar.module.css";
import { AiOutlineProduct } from "react-icons/ai";
import { useDispatch } from "react-redux";
import ApprovedNewProducts from "./NewProducts";
import ApprovedSecondaryProducts from "./SecondaryProducts";
import Loader from "../../shared-components/Loader/Loader";
import { apiRequests } from "../../../../api";
import {
  fetchFilteredProductsList,
  fetchProductsList,
} from "../../../../redux/reducers/productSlice";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { categoriesData } from "../../../../utils/Category";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";
import { postRequestWithToken } from "../../../api/Requests";
import { postReqCSVDownload } from "../../../api/Requests";
import { toast } from "react-toastify";
 
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
 
  /* filter and download button state manage */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUploadTypeOpen, setIsUploadTypeOpen] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
 
  /* check whether filter is applied or not */
  const [isFiltered, setIsFiltered] = useState(false);
 
  const dropdownRef = useRef(null);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const uploadDropdownRef = useRef(null);
  const supplierDropdownRef = useRef(null);
 
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      if (event.target.closest("#categoryBtn")) return;
      setIsCategoryOpen(false);
      if (filteredData?.category.length == 0) {
        setCategorySearch("");
      }
    }
  };
 
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 
  /* upload dropdown onclick outside */
  const handleClickOutsideUploadDropdown = (event) => {
    if (
      uploadDropdownRef.current &&
      !uploadDropdownRef.current.contains(event.target)
    ) {
      if (event.target.closest("#uploadButton")) return;
      setIsUploadTypeOpen(false);
    }
  };
 
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideUploadDropdown);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideUploadDropdown
      );
    };
  }, []);
 
  /* from dropdown onclick outside */
  const handleClickOutsideFromDropdown = (event) => {
    if (fromDateRef.current && !fromDateRef.current.contains(event.target)) {
      setFromDate(false);
    }
  };
 
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideFromDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideFromDropdown);
    };
  }, []);
 
  /* to date dropdown onclick outside */
  const handleClickOutsideToDropdown = (event) => {
    if (toDateRef.current && !toDateRef.current.contains(event.target)) {
      setToDate(false);
    }
  };
 
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideToDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideToDropdown);
    };
  }, []);
 
  /* supplier dropdown ref */
  const handleClickOutsideSupplierDropdown = (event) => {
    if (
      supplierDropdownRef.current &&
      !supplierDropdownRef.current.contains(event.target)
    ) {
      if (event.target.closest("#supplierBtn")) return;
      setIsSupplierTypeOpen(false);
      if (!filteredData?.supplier) {
        setSupplierSearch("");
      }
    }
  };
 
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideSupplierDropdown);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideSupplierDropdown
      );
    };
  }, []);
 
  const [filteredData, setFilteredData] = useState({
    startDate: undefined,
    endDate: undefined,
    category: [],
    uploadType: "",
    supplier: "",
  });
 
  const [categoryOptions, setCategoryOptions] = useState(
    categoriesData?.map((c) => ({ label: c.name, value: c.schema })) || []
  );
 
  const uploadType = ["Bulk Upload", "Manual Upload"];
 
  const handleResetFilter = () => {
    setFilteredData({
      startDate: undefined,
      endDate: undefined,
      category: [],
      uploadType: "",
      supplier: "",
    });
    setIsFilterOpen(false);
    setIsFiltered(false);
  };
 
  const [oldFilter, setOldFilter] = useState(null);
 
  const applyHandler = async () => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      localStorage?.clear();
      navigate("/admin/login");
      return;
    }
 
    const currentFilterStr = JSON.stringify(filteredData);
    const oldFilterStr = JSON.stringify(oldFilter);
 
    if (!isFiltered || currentFilterStr !== oldFilterStr) {
      setCurrentPage(1);
    }
 
    const marketType =
      activeLink === "new"
        ? "new"
        : activeLink === "secondary"
        ? "secondary"
        : activeLink;
 
    const params = new URLSearchParams({
      page_no:
        !isFiltered || currentFilterStr !== oldFilterStr ? 1 : currentPage,
      page_size: listPerPage,
    });
    if (filteredData?.supplier) {
      params.append("supplierId", filteredData.supplier);
    }
 
    const obj = {
      from: filteredData?.startDate && filteredData.startDate.toString(),
      to: filteredData?.endDate && filteredData.endDate.toString(),
      market: marketType,
    };
 
    if (filteredData?.category && filteredData?.category?.length > 0) {
      obj.category = filteredData?.category;
    }
 
    if (filteredData.uploadType && filteredData?.uploadType != "") {
      obj.bulkUpload =
        filteredData?.uploadType.toLowerCase() == "bulk upload" && true;
    }
 
    const response = await dispatch(
      fetchFilteredProductsList({
        url: `product/product-csv-download?${params.toString()}`,
        obj: obj,
      })
    );
 
    if (response?.meta?.requestStatus === "fulfilled") {
      setProductList(response.payload.products);
      setTotalProducts(response.payload?.totalItems);
      setLoading(false);
      setIsFiltered(true);
      setOldFilter(filteredData);
    }
  };
 
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
 
  const isFilterEmpty = (data) => {
    return (
      (!data?.category || data.category.length === 0) &&
      (!data?.uploadType || data.uploadType === "") &&
      (!data?.startDate || data.startDate === null) &&
      (!data?.endDate || data.endDate === null) &&
      (!data?.supplier || data.supplier === "")
    );
  };
 
  useEffect(() => {
    if (isFilterEmpty(filteredData)) {
      setIsFiltered(false);
    }
  }, [filteredData]);
 
  useEffect(() => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      localStorage?.clear();
      navigate("/admin/login");
      return;
    }
 
    setLoading(true);
    if (isFiltered) {
      applyHandler();
    } else {
      fetchProducts();
    }
  }, [
    currentPage,
    isFiltered,
    activeLink,
    adminIdLocalStorage,
    adminIdSessionStorage,
    dispatch,
    navigate,
  ]);
 
  useEffect(() => {
    setIsFiltered(false);
  }, [filteredData]);

  console.log("isFiltered: ",isFiltered);
  console.log("totalProducts: ",totalProducts);
 
  const [sellerData, setSellerData] = useState([]);
  const [totalRequests, setTotalRequests] = useState(null);
  /* fetching approved supplier */
  const fetchApprovedSupplier = () => {
    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      dropDown: true,
      /* filterValue: filterValue,
            pageNo: currentPage,
            pageSize: listPerPage,
            searchKey: searchKey, */
      status: 1,
    };
 
    setLoading(true);
 
    postRequestWithToken("admin/get-supplier-reg-req-list", obj, (response) => {
      if (response?.code === 200) {
        setSellerData(response.result.data);
        setTotalRequests(response.result.totalItems);
      } else {
        console.error("Error fetching supplier requests:", response.message);
      }
      setLoading(false);
    });
  };
 
  useEffect(() => {
    fetchApprovedSupplier();
  }, [
    currentPage,
    activeLink,
    adminIdLocalStorage,
    adminIdSessionStorage,
    dispatch,
    navigate,
  ]);
 
  const [fromDate, setFromDate] = useState(false);
  const [toDate, setToDate] = useState(false);
  const [isSupplierTypeOpen, setIsSupplierTypeOpen] = useState(false);
 
  const [supplierSearch, setSupplierSearch] = useState(""); // for input search text
 
  // Filter suppliers based on search text
  const filteredSuppliers = sellerData
    .filter((supplier) =>
      supplier.supplier_name
        .toLowerCase()
        .includes(supplierSearch.toLowerCase())
    )
    .sort((a, b) => a.supplier_name.localeCompare(b.supplier_name));
 
  const [categorySearch, setCategorySearch] = useState("");
 
  const filteredCategories = categoryOptions.filter((cat) =>
    cat.label.toLowerCase().includes(categorySearch.toLowerCase())
  );
 
  const handleCategory = (categoryValue) => {
    setFilteredData((prev) => {
      let updatedCategory = [...prev.category];
 
      /* if category already exist then remove from category */
      if (updatedCategory.includes(categoryValue)) {
        updatedCategory = updatedCategory.filter(
          (category) => category != categoryValue
        );
      } else {
        updatedCategory.push(categoryValue);
      }
      setCategorySearch("");
      //updating filteredData
      return { ...prev, category: updatedCategory };
    });
  };
 
  const handleDownload = async () => {
    setDownloadLoader(true);
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
 
    const params = new URLSearchParams({
      page_no: currentPage,
      page_size: listPerPage,
    });
 
    if (isFiltered && filteredData?.supplier) {
      params.append("supplierId", filteredData.supplier);
    }
 
    const obj = {
/*       from: (isFiltered && filteredData?.startDate) && filteredData.startDate.toString(),
      to: (isFiltered && filteredData?.endDate) && filteredData.endDate.toString(), */
      csvDownload: true,
      market: marketType,
    };

    if(isFiltered && filteredData?.startDate){
      obj.from = filteredData.startDate.toString();
    }
    if(isFiltered && filteredData?.endDate){
      obj.to = filteredData.endDate.toString();
    }
 
    if (isFiltered && filteredData?.category && filteredData?.category?.length > 0) {
      obj.category = filteredData?.category;
    }
 
    if (isFiltered && filteredData.uploadType && filteredData?.uploadType != "") {
      obj.bulkUpload =
        filteredData?.uploadType.toLowerCase() == "bulk upload" && true;
    }
 
    console.log("object in download: ",obj);

    await postReqCSVDownload(
      `product/product-csv-download?${params.toString()}`,
      obj,
      `${
        activeLink === "new" ? "New Products" : "Secondary Market Products"
      }.csv`
    );
    setTimeout(()=>{ setDownloadLoader(false) },2000);
  };
 
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>Products List</div>
            <div /* className={styles.headerBtnDivFilterClose} */
              className={styles.headerBtnDiv}
              /* className={`${(isFilterOpen ||
                   filteredData?.category.length > 0 || 
                   filteredData?.uploadType ||
                   filteredData?.startDate ||
                   filteredData?.endDate ||
                   filteredData?.supplier
                  )?styles.headerBtnDiv:styles.headerBtnDivFilterClose}`} */
            >
              <div
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={styles.filterProductBtn}
              >
                <span>Filter Product</span>
                {isFilterOpen ? <FaAngleUp /> : <FaAngleDown />}
              </div>
 
              {isFilterOpen &&
                (filteredData?.category?.length > 0 ||
                  filteredData?.uploadType ||
                  filteredData?.startDate ||
                  filteredData?.endDate ||
                  filteredData?.supplier) && (
                  <button
                    onClick={applyHandler}
                    className={styles.applyFilter}
                    id="apply-filter-button"
                  >
                    Apply
                  </button>
                )}
 
              {/* Reset button */}
              {((isFilterOpen && filteredData?.category.length > 0) ||
                filteredData?.uploadType ||
                filteredData?.startDate ||
                filteredData?.endDate ||
                filteredData?.supplier) && (
                <button
                  onClick={handleResetFilter}
                  className={styles.resetFilterBtn}
                  id="apply-reset-button"
                >
                  Reset Filter
                </button>
              )}
              {/* download product list */}
              <button
                onClick={handleDownload}
                disabled={totalProducts==0}
                className={
                  isFilterOpen ||
                  filteredData?.category.length > 1 ||
                  filteredData?.uploadType ||
                  filteredData?.startDate ||
                  filteredData?.endDate ||
                  filteredData?.supplier
                    ? styles.downloadBtnIsOpen
                    : styles.downloadBtn
                }
              >
               {
                downloadLoader? <span className={styles.loadingSpinner}></span>: "Download"
               }
              </button>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.sidebar}>
              <div
                onClick={() => handleLinkClick("new")}
                className={`${activeLink === "new" ? styles.active : ""} ${
                  styles.tab
                }`}
              >
                <AiOutlineProduct className={styles.icon} />
                <div className={styles.text}>New Products</div>
              </div>
              <div
                onClick={() => handleLinkClick("secondary")}
                className={`${
                  activeLink === "secondary" ? styles.active : ""
                } ${styles.tab}`}
              >
                <AiOutlineProduct className={styles.icon} />
                <div className={styles.text}>Secondary Products</div>
              </div>
            </div>
            <div className={styles.main}>
              {/* add filter here -> new update */}
              {isFilterOpen && (
                <div className={styles.filterMainContainer}>
                  {/* startDate */}
                  <div className={styles.fromDateMainContainer}>
                    <div
                      onClick={() => setFromDate(!fromDate)}
                      className={styles.fromDateContainer}
                    >
                      {filteredData?.startDate ? (
                        <div className={styles.fromDate}>
                          {filteredData?.startDate
                            ?.toLocaleDateString("en-GB")
                            .replace(/\//g, "-")}
                          {fromDate ? (
                            <FaAngleUp className={styles.fromDateIcon} />
                          ) : (
                            <FaAngleDown className={styles.fromDateIcon} />
                          )}
                        </div>
                      ) : (
                        <div className={styles.fromDate}>
                          <span>From Date</span>
                          {fromDate ? (
                            <FaAngleUp className={styles.fromDateIcon} />
                          ) : (
                            <FaAngleDown className={styles.fromDateIcon} />
                          )}
                        </div>
                      )}
                    </div>
                    {isFilterOpen && fromDate && (
                      <ul
                        ref={fromDateRef}
                        className={styles.fromDateContainerUl}
                      >
                        <li className={styles.fromDateContainerLi}>
                          <DatePicker
                            format="dd/MM/yyyy"
                            placeholder="dd/mm/yyyy"
                            maxDate={filteredData?.endDate || new Date()}
                            clearIcon={null}
                            className={`${styles.dateInput} ${styles["react-date-picker__wrapper"]}`}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(date) => {
                              setFilteredData((prev) => ({
                                ...prev,
                                startDate: date,
                              }));
                              setFromDate(false);
                            }}
                            value={filteredData.startDate}
                          />
                        </li>
                      </ul>
                    )}
                    {isFilterOpen && filteredData?.startDate && (
                      <div
                        onClick={() =>
                          setFilteredData((prev) => ({
                            ...prev,
                            startDate: undefined,
                          }))
                        }
                        className={styles.formDateRefresh}
                      >
                        <AiOutlineClose size={16} />
                      </div>
                    )}
                  </div>
 
                  {/* end date */}
                  <div className={styles.fromDateMainContainer}>
                    <div
                      onClick={() => setToDate(!toDate)}
                      className={styles.fromDateContainer}
                    >
                      {filteredData?.endDate ? (
                        <div className={styles.fromDate}>
                          {filteredData?.endDate
                            ?.toLocaleDateString("en-GB")
                            .replace(/\//g, "-")}
                          {toDate ? (
                            <FaAngleUp className={styles.fromDateIcon} />
                          ) : (
                            <FaAngleDown className={styles.fromDateIcon} />
                          )}
                        </div>
                      ) : (
                        <div className={styles.fromDate}>
                          <span>To Date</span>
                          {toDate ? (
                            <FaAngleUp className={styles.fromDateIcon} />
                          ) : (
                            <FaAngleDown className={styles.fromDateIcon} />
                          )}
                        </div>
                      )}
                    </div>
                    {isFilterOpen && toDate && (
                      <ul
                        ref={toDateRef}
                        className={styles.fromDateContainerUl}
                      >
                        <li className={styles.fromDateContainerLi}>
                          <DatePicker
                            format="dd/MM/yyyy"
                            placeholder="dd/mm/yyyy"
                            maxDate={new Date()}
                            minDate={filteredData?.startDate || null}
                            clearIcon={null}
                            className={`${styles.dateInput} ${styles["react-date-picker__wrapper"]}`}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(date) => {
                              setFilteredData((prev) => ({
                                ...prev,
                                endDate: date,
                              }));
                              setToDate(false);
                            }}
                            value={filteredData.endDate}
                          />
                        </li>
                      </ul>
                    )}
                    {isFilterOpen && filteredData?.endDate && (
                      <div
                        onClick={() =>
                          setFilteredData((prev) => ({
                            ...prev,
                            endDate: undefined,
                          }))
                        }
                        className={styles.formDateRefresh}
                      >
                        <AiOutlineClose size={16} />
                      </div>
                    )}
                  </div>
 
                  {/* category */}
                  <div className={styles.fromDateMainContainer}>
                    {/* button */}
                    <div
                      id="categoryBtn"
                      /* onClick={()=>setIsCategoryOpen(!isCategoryOpen)}  */ className={
                        styles.fromDateContainer
                      }
                    >
                      <input
                        type="text"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        onFocus={() => setIsCategoryOpen(true)}
                        placeholder="Category"
                        className={styles.supplierInput}
                      />
                      <span onClick={() => setIsCategoryOpen((prev) => !prev)}>
                        {isCategoryOpen ? <FaAngleUp /> : <FaAngleDown />}
                      </span>
                      {filteredData?.category?.length > 0 && (
                        <span className={styles.categoryCountDiv}>
                          {filteredData.category.length}
                        </span>
                      )}
                    </div>
 
                    {/* category dropdown */}
                    {isFilterOpen && isCategoryOpen && (
                      <ul
                        ref={dropdownRef}
                        className={
                          filteredData?.category?.length > 0
                            ? styles.leftCategoryDropdown
                            : styles.categoryDropdown
                        }
                      >
                        {filteredCategories.length == 0 && (
                          <li className={styles.elementNotFound}>
                            No Category Found!
                          </li>
                        )}
                        {filteredCategories.map((category, i) => (
                          <li
                            key={i}
                            onClick={() => handleCategory(category.value)}
                            className={`
                                  ${styles.categoryLi}
                                  ${
                                    filteredData?.category.includes(
                                      category?.value
                                    )
                                      ? styles.activeCategory
                                      : styles.categoryLiHover
                                  }
                                `}
                          >
                            <input
                              type="checkbox"
                              checked={filteredData?.category.includes(
                                category?.value
                              )}
                            />
                            {category.label}
                          </li>
                        ))}
                      </ul>
                    )}
 
                    {isFilterOpen && filteredData?.category.length > 0 && (
                      <div
                        onClick={() => {
                          setFilteredData((prev) => ({
                            ...prev,
                            category: [],
                          }));
                          setCategorySearch("");
                        }}
                        className={styles.formDateRefresh}
                      >
                        <AiOutlineClose size={16} />
                      </div>
                    )}
                  </div>
 
                  {/* supplier */}
                  <div className={styles.fromDateMainContainer}>
                    {/* button */}
                    <div
                      id="supplierBtn"
                      /* onClick={(e)=>{e.stopPropagation();setIsSupplierTypeOpen(!isSupplierTypeOpen);}} */
                      className={styles.fromDateContainer}
                    >
                      <input
                        type="text"
                        value={
                          filteredData?.supplier
                            ? sellerData.find(
                                (s) => s._id === filteredData?.supplier
                              )?.supplier_name
                            : supplierSearch
                        }
                        onChange={(e) => {
                          setSupplierSearch(e.target.value);
                          setFilteredData((prev) => ({
                            ...prev,
                            supplier: "",
                          })); // clear selected supplier if typing
                        }}
                        onFocus={() => setIsSupplierTypeOpen(true)}
                        placeholder="Supplier"
                        className={styles.supplierInput}
                      />
 
                      {/* Dropdown icon */}
                      <span
                        onClick={() => setIsSupplierTypeOpen((prev) => !prev)}
                      >
                        {isSupplierTypeOpen ? <FaAngleUp /> : <FaAngleDown />}
                      </span>
                    </div>
 
                    {/* supplier dropdown */}
                    {isFilterOpen && isSupplierTypeOpen && (
                      <ul
                        ref={supplierDropdownRef}
                        className={
                          filteredData?.startDate &&
                          filteredData?.endDate &&
                          filteredData?.category.length > 0 &&
                          filteredData?.uploadType.length > 0
                            ? styles.categoryDropdown
                            : styles.leftCategoryDropdown
                        } /* className={filteredData?.supplier ? styles.leftCategoryDropdown:styles.categoryDropdown} */
                      >
                        {filteredSuppliers.length == 0 && (
                          <li className={styles.elementNotFound}>
                            No Supplier Found!
                          </li>
                        )}
                        {filteredSuppliers.map((supplierLi, i) => {
                          return (
                            <li
                              key={i}
                              onClick={() => {
                                setFilteredData((prev) => ({
                                  ...prev,
                                  supplier: supplierLi?._id,
                                }));
                              }}
                              className={`
                                  ${styles.supplierLi}
                                  ${
                                    filteredData?.supplier === supplierLi?._id
                                      ? styles.activeCategory
                                      : styles.supplierLiHover
                                  }
                                  `}
                            >
                              {supplierLi?.supplier_name}
                            </li>
                          );
                        })}
                      </ul>
                    )}
 
                    {isFilterOpen && filteredData?.supplier && (
                      <div
                        onClick={() => {
                          setFilteredData((prev) => ({
                            ...prev,
                            supplier: "",
                          }));
                          setSupplierSearch("");
                        }}
                        className={styles.formDateRefresh}
                      >
                        <AiOutlineClose size={16} />
                      </div>
                    )}
                  </div>
 
                  {/* Upload Type */}
                  <div className={styles.fromDateMainContainer}>
                    {/* button */}
                    <div
                      id="uploadButton"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUploadTypeOpen(!isUploadTypeOpen);
                      }}
                      className={styles.fromDateContainerUpload}
                    >
                      {filteredData?.uploadType ? (
                        <div className={styles.fromDate}>
                          {filteredData?.uploadType}
                          {isUploadTypeOpen ? (
                            <FaAngleUp className={styles.fromDateIcon} />
                          ) : (
                            <FaAngleDown className={styles.fromDateIcon} />
                          )}
                        </div>
                      ) : (
                        <div className={styles.fromDate}>
                          <span>Upload Type</span>
                          {isUploadTypeOpen ? (
                            <FaAngleUp className={styles.fromDateIcon} />
                          ) : (
                            <FaAngleDown className={styles.fromDateIcon} />
                          )}
                        </div>
                      )}
                    </div>
 
                    {/* Upload dropdown */}
                    {isFilterOpen && isUploadTypeOpen && (
                      <ul
                        ref={uploadDropdownRef}
                        className={
                          filteredData?.startDate &&
                          filteredData?.endDate &&
                          filteredData?.category.length > 0 &&
                          filteredData?.supplier.length > 0
                            ? styles.uploadDropdown
                            : styles.leftUploadDropdown
                        } /* className={filteredData?.uploadType ? styles.leftUploadDropdown:styles.uploadDropdown} */
                      >
                        {uploadType.map((type, i) => (
                          <li
                            key={i}
                            onClick={() => {
                              setFilteredData((prev) => ({
                                ...prev,
                                uploadType: type,
                              }));
                            }}
                            className={`
                                ${styles.supplierLi}
                                ${
                                  filteredData?.uploadType === type
                                    ? styles.activeCategory
                                    : styles.supplierLiHover
                                }
                                `}
                          >
                            {type}
                          </li>
                        ))}
                      </ul>
                    )}
 
                    {isFilterOpen && filteredData?.uploadType && (
                      <div
                        onClick={() =>
                          setFilteredData((prev) => ({
                            ...prev,
                            uploadType: "",
                          }))
                        }
                        className={styles.formDateRefresh}
                      >
                        <AiOutlineClose size={16} />
                      </div>
                    )}
                  </div>
 
                  {/* Reset button */}
                  {/*  {(isFilterOpen ||
                    filteredData?.category.length > 0 || 
                    filteredData?.uploadType ||
                    filteredData?.startDate ||
                    filteredData?.endDate ||
                    filteredData?.supplier
                    ) 
                      &&
                      <button 
                      onClick={handleResetFilter}
                      className={styles.resetFilterBtn}
                      id="apply-reset-button"
                      >
                        Reset Filter
                      </button>
                    } */}
                </div>
              )}
 
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