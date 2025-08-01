import styles from "./productdetails.module.css";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetail,
  fetchSupplierProductsList,
} from "../../../../redux/reducers/productSlice";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import CloseIcon from "../../../assets/images/Icon.svg";
import SearchSection from "../UiShared/Search/Search"; // Updated import
import FilterSection from "../Details/FilterSection"; // Updated import
import SupplierMedicineCard from "../Details/SupplierMedicineCard"; // Updated import

Modal.setAppElement("#root");

const SearchProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchValue = location.state?.searchValue;
  const dispatch = useDispatch();
  const { productDetail, supplierProductList } = useSelector(
    (state) => state?.productReducer || {}
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // State for search and filter

  const [inputValue, setInputValue] = useState("");
  const [searchKey, setSearchKey] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalitems] = useState(0);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    price: [],
    // deliveryTime: [],
    totalQuantity: [],
    stockStatus: [],
    countries: []
  });

  const [currentSort, setCurrentSort] = useState({
    type: null,
    sortName: null,
    order: 'asc',
  });

  const pdfFile =
    productDetail?.secondaryMarketDetails?.purchaseInvoiceFile?.[0] ||
    productDetail?.data?.[0]?.secondaryMarketDetails?.purchaseInvoiceFile?.[0];
  const pdfUrl = pdfFile
    ? pdfFile?.startsWith("http")
      ? pdfFile
      : `${process.env.REACT_APP_SERVER_URL}/uploads/products/${pdfFile}`
    : "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";

  // Fetch product details on mount or when id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(`product/${id}`));
    }
  }, [id, dispatch]);

  // Update filtered data when productDetail changes

  useEffect(() => {
    const buyerId =
    localStorage?.getItem("buyer_id") ||
    localStorage?.getItem("buyer_id");
  if (!buyerId) {
    localStorage?.clear();
    navigate("/buyer/login");
    return;
  }
    const fetchData = async () => {
      const query = [];

      query.push(`buyer_id=${buyerId}`);

      if (searchValue)
        query.push(`search_value=${encodeURIComponent(searchValue)}`);
      if (searchKey) query.push(`search_key=${encodeURIComponent(searchKey)}`);
      query.push(`page_no=${currentPage}`);
      query.push(`page_size=${itemsPerPage}`);

      if (filters.price.length > 0) {
        query.push(
          `price=${filters.price
            .map((val) => val.replace(/ /g, "%20"))
            .join(",")}`
        );
      }

      // if (filters.deliveryTime.length > 0) {
      //   query.push(`delivery_time=${filters.deliveryTime.map(val => val.replace(/ /g, '%20')).join(',')}`);
      // }

      if (filters.totalQuantity.length > 0) {
        query.push(
          `quantity=${filters.totalQuantity
            .map((val) => val.replace(/ /g, "%20"))
            .join(",")}`
        );
      }

      if (filters.stockStatus.length > 0) {
        query.push(
          `stock_status=${filters.stockStatus
            .map((val) => val.replace(/ /g, "%20"))
            .join(",")}`
        );
      }

      if (filters.countries.length > 0) {
        query.push(
          `countries=${filters.countries
            .map((val) => val.replace(/ /g, "%20"))
            .join(",")}`
        );
      }
  

      const queryString = query.join("&");
      const url = `product/get-suppliers/${id}?${queryString}`;

      const response = await dispatch(fetchSupplierProductsList(url));

      if (response.meta.requestStatus === "fulfilled") {
        setProductList(response?.payload?.products || []);
        setOriginalList(response?.payload?.products || []);
        setTotalitems(response?.payload?.totalItems || 0);
      } else {
        setProductList([]);
        setTotalitems(0);
      }
    };

    fetchData();
  }, [id, dispatch, currentPage, searchKey, filters]);

  useEffect(() => {
    const dataToFilter = productDetail?.data || [productDetail] || [];
    setFilteredData(dataToFilter);
  }, [productDetail]);

  const getCategoryData = (property) => {
    if (!productDetail?.category) return null;
    return productDetail[productDetail.category]?.[property];
  };

  // Search handlers
  const handleInputChange = (e) => {
    const input = e.target.value;

    setInputValue(e.target.value);

    if (e.target.value === "") {
      setSearchKey("");
    }
  };

  const handleProductSearch = () => {
    setSearchKey(inputValue);
    setCurrentPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleProductSearch();
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filter handlers (minimal implementation, adjust as per your needs)
  // const handlePriceRange = (selectedValues) => {
  //   setFilters((prev) => ({ ...prev, price: selectedValues }));
  // };

  // const handleDeliveryTime = (selectedValues) => {
  //   setFilters((prev) => ({ ...prev, deliveryTime: selectedValues }));
  // };

  const handleStockedIn = (selectedValues) => {
    setFilters((prev) => ({ ...prev, stockStatus: selectedValues }));
  };

  const handleStockedInCountry = (selectedValues) => {
    setFilters((prev) => ({ ...prev, countries: selectedValues }));
  };



  // const handleQuantity = (selectedValues) => {
  //   setFilters((prev) => ({ ...prev, totalQuantity: selectedValues }));
  // };

  const handleQuantity = (sortOrder) => {
    const sorted = [...productList].sort((a, b) =>
      sortOrder === "asc"
        ? (a.general?.quantity || 0) - (b.general?.quantity || 0)
        : (b.general?.quantity || 0) - (a.general?.quantity || 0)
    );
    setProductList(sorted);

    setCurrentSort({
      type: 'totalQuantity',
      sortName: 'quantity',
      order: sortOrder
    });
  };
  
  
  const handlePriceRange = (sortOrder) => {
   
    const sorted = [...productList].sort((a, b) => {
      const priceA = Number(a.inventoryDetails?.[0]?.inventoryList?.price) || 0;
      const priceB = Number(b.inventoryDetails?.[0]?.inventoryList?.price) || 0;
  
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
  
    setProductList(sorted);

    setCurrentSort({
      type: 'price',
      sortName: 'price',
      order: sortOrder
    });
  };
  
  
  const handleReset = () => {
    const dataToFilter = productDetail?.data || [productDetail] || [];
    setFilteredData(dataToFilter);
    setInputValue("");
    setProductList(originalList);
    const resetState = {
      price: [],
      // deliveryTime: [],
      stockStatus: [],
      totalQuantity: [],
      countries: []
    };
    setFilters(resetState);
    setCurrentSort({
      type: null,
      sortName: null,
      order: 'asc',
    });
  };

  // Configuration for ProductCards
  const fieldsConfig = {
    title: {
      key: "general.name",
      render: (item) => item?.general?.name || "N/A",
    },
    details: [
      {
        key: "general.form",
        label: "Type/Form",
        render: (item) => item?.general?.form || "N/A",
      },
      {
        key: "general.quantity",
        label: "Quantity",
        render: (item) => item?.general?.quantity || "N/A",
      },
    ],
  };

  const secondaryFieldsConfig = [
    {
      key: "secondaryMarketDetails.condition",
      label: "Condition",
      render: (item) => item?.secondaryMarketDetails?.condition || "N/A",
    },
    {
      key: "secondaryMarketDetails.countryAvailable",
      label: "Country Available",
      render: (item) =>
        item?.secondaryMarketDetails?.countryAvailable?.join(", ") || "N/A",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.ProductMainContainer}>
          <span className={styles.medicineName}>
            {productDetail?.general?.name}
          </span>
        </div>

        {/* Secondary Market Section */}
        {/* {(productDetail?.secondaryMarketDetails?.purchasedOn ||
          productDetail?.secondaryMarketDetails?.countryAvailable?.length > 0 ||
          productDetail?.secondaryMarketDetails?.purchaseInvoiceFile?.length >
            0 ||
          productDetail?.secondaryMarketDetails?.condition) && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Secondary Market Information
            </span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                {productDetail?.secondaryMarketDetails?.purchasedOn && (
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Purchased on</span>
                    <span className={styles.medicineText}>
                      {String(
                        new Date(
                          productDetail?.secondaryMarketDetails?.purchasedOn
                        )?.getDate()
                      ).padStart(2, "0")}
                      /
                      {String(
                        new Date(
                          productDetail?.secondaryMarketDetails?.purchasedOn
                        )?.getMonth() + 1
                      ).padStart(2, "0")}
                      /
                      {new Date(
                        productDetail?.secondaryMarketDetails?.purchasedOn
                      )?.getFullYear()}
                    </span>
                  </div>
                )}
                {productDetail?.secondaryMarketDetails?.condition && (
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Condition</span>
                    <span className={styles.medicineText}>
                      {productDetail?.secondaryMarketDetails?.condition}
                    </span>
                  </div>
                )}
              </div>
              {(productDetail?.secondaryMarketDetails?.countryAvailable
                ?.length > 0 ||
                productDetail?.secondaryMarketDetails?.minimumPurchaseUnit) && (
                <div className={styles.mainSection}>
                  {productDetail?.secondaryMarketDetails?.countryAvailable
                    ?.length > 0 && (
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        Country Available in
                      </span>
                      <span className={styles.medicineText}>
                        {productDetail?.secondaryMarketDetails?.countryAvailable?.map(
                          (country, index) => (
                            <span key={index}>
                              {country}
                              {index !==
                                productDetail?.secondaryMarketDetails
                                  ?.countryAvailable.length -
                                  1 && ", "}
                            </span>
                          )
                        )}
                      </span>
                    </div>
                  )}
                  {productDetail?.secondaryMarketDetails
                    ?.minimumPurchaseUnit && (
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        Minimum Purchase Unit
                      </span>
                      <span className={styles.medicineText}>
                        {
                          productDetail?.secondaryMarketDetails
                            ?.minimumPurchaseUnit
                        }
                      </span>
                    </div>
                  )}
                </div>
              )}
              {productDetail?.secondaryMarketDetails?.purchaseInvoiceFile
                ?.length > 0 && (
                <div className={styles.mainPurchaseSection}>
                  <button
                    className={styles.PurcahseButton}
                    onClick={() => setModalIsOpen(true)}
                  >
                    View Purchase Invoice
                  </button>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* General Information Section */}
        <div className={styles.mainContainer}>
          <span className={styles.innerHead}>General Information</span>
          <div className={styles.innerSection}>
            <div className={styles.mainSection}>
              {productDetail?.category && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Category</span>
                  <span className={styles.medicineText}>
                    {productDetail?.category
                      ?.replace(/([a-z])([A-Z])/g, "$1 $2")
                      ?.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
                </div>
              )}
              {(productDetail?.[productDetail?.category]?.anotherCategory ||
                productDetail?.anotherCategory) && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Sub Category(Level3)
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.[productDetail?.category]?.anotherCategory || productDetail?.anotherCategory}
                  </span>
                </div>
              )}

              {/* {productDetail?.general?.quantity && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Quantity</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.quantity}
                  </span>
                </div>
              )} */}
            </div>
            <div className={styles.mainSection}>
              {(productDetail?.[productDetail?.category]?.subCategory ||
                productDetail?.subCategory) && (
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>
                      Product Sub Category
                    </span>
                    <span className={styles.medicineText}>
                      {productDetail?.[productDetail?.category]?.subCategory ||
                        productDetail?.subCategory}
                    </span>
                  </div>
                )}
              {/* {productDetail?.general?.form && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Type/Form</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.form}
                  </span>
                </div>
              )} */}
              {/* {productDetail?.general?.model && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Part/Model Number</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.model}
                  </span>
                </div>
              )} */}
              {/* {productDetail?.general?.weight && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Weight</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.weight}{" "}
                    {productDetail?.general?.unit}
                  </span>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Product Description */}
        {productDetail?.general?.description && (
          <div className={styles.mainContainer}>
            <div className={styles.manufacturerDescriptionSection}>
              <span className={styles.medicineHead}>Product Description</span>
              <span
                className={styles.medicineDescriptionContent}
                dangerouslySetInnerHTML={{
                  __html: productDetail?.general?.description,
                }}
              ></span>
            </div>
          </div>
        )}

        {/* Manufacturer Section */}
        {/* {(productDetail?.general?.manufacturer ||
          productDetail?.general?.aboutManufacturer ||
          productDetail?.general?.countryOfOrigin) && (
          <div className={styles.mainManufacturerContainer}>
            <span className={styles.innerHead}>Manufacturer Details</span>
            <div className={styles.manufacturerMainContainer}>
              {(productDetail?.general?.manufacturer ||
                productDetail?.general?.countryOfOrigin) && (
                <div className={styles.manufacturerContainer}>
                  {productDetail?.general?.manufacturer && (
                    <div className={styles.manufacturersection}>
                      <span className={styles.medicineHead}>
                        Manufacturer Name
                      </span>
                      <span className={styles.medicineText}>
                        {productDetail?.general?.manufacturer}
                      </span>
                    </div>
                  )}
                  {productDetail?.general?.countryOfOrigin && (
                    <div className={styles.manufacturersection}>
                      <span className={styles.medicineHead}>
                        Country of Origin
                      </span>
                      <span className={styles.medicineText}>
                        {productDetail?.general?.countryOfOrigin}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* Modal for PDF Preview */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Purchase Invoice"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <div
            className={styles.closeButton}
            onClick={() => setModalIsOpen(false)}
          >
            <img className={styles.closeImg} src={CloseIcon} alt="closeIcon" />
          </div>
          {pdfFile ? (
            <iframe
              src={pdfUrl}
              className={styles.pdfIframe}
              title="Purchase Invoice"
              onError={() =>
                alert("Failed to load PDF. Please check the file path.")
              }
            />
          ) : (
            <p>Loading PDF or file not found...</p>
          )}
        </Modal>
      </div>
      {/* Search Section */}
      <SearchSection
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleProductSearch={handleProductSearch}
        handleKeyDown={handleKeyDown}
      />

      {/* Filter Section */}
      <FilterSection
        countryAvailable={
          productDetail?.secondaryMarketDetails?.countryAvailable || []
        }
        handlePriceRange={handlePriceRange}
        // handleDeliveryTime={handleDeliveryTime}
        handleStockedIn={handleStockedIn}
        handleQuantity={handleQuantity}
        handleStockedInCountry = {handleStockedInCountry}
        handleReset={handleReset}
        currentSort={currentSort}
      />

      {/* Product Cards */}
      <SupplierMedicineCard
        productList={productList}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SearchProductDetails;
