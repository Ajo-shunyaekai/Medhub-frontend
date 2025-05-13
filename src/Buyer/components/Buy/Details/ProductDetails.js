import styles from "./productdetails.module.css";
import Select from "react-select";
import "../../SharedComponents/SignUp/signup.css"
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOtherSupplierProductsList,
  fetchProductDetail,
} from "../../../../redux/reducers/productSlice";
import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import CloseIcon from "../../../assets/images/Icon.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "../UiShared/ProductCards/ProductCard";
import { Formik, Form, Field, ErrorMessage } from "formik";
import RenderProductFiles from "./RenderFiles";
import * as Yup from "yup";
import { addToList } from "../../../../redux/reducers/listSlice";
import { updateInquiryCartCount } from "../../../../redux/reducers/inquirySlice";
import { postRequestWithToken } from "../../../../api/Requests";
import Loader from "../../SharedComponents/Loader/Loader";

Modal.setAppElement("#root");

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  selectedQuantity: Yup.string().required("Quantity Range is Required"),
  quantityRequired: Yup.number()
    .required("Quantity is Required")
    .positive("Must be a positive number")
    .typeError("Must be a number"),
  targetPrice: Yup.number()
    .required("Target Price is Required")
    .positive("Must be a positive price")
    .typeError("Must be a number"),
});

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state?.productReducer || {});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading as true
  const pdfFile =
    productDetail?.secondaryMarketDetails?.purchaseInvoiceFile?.[0] ||
    productDetail?.data?.[0]?.secondaryMarketDetails?.purchaseInvoiceFile?.[0];
  const pdfUrl = pdfFile
    ? pdfFile?.startsWith("http")
      ? pdfFile
      : `${process.env.REACT_APP_SERVER_URL}/uploads/products/${pdfFile}`
    : "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";

  const fallbackImageUrl =
    "https://medhub.shunyaekai.com/uploads/fallbackImage.jpg";

  // Utility to check if URL ends with image extension
  const isImageExtension = (fileName) => {
    return /\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName);
  };

  const inventoryList = productDetail?.inventoryDetails?.inventoryList || [];
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalitems] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [searchKey, setSearchKey] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    price: [],
    deliveryTime: [],
    stockedIn: [],
    totalQuantity: [],
  });
  const itemsPerPage = 5;

  const searchTimeoutRef = useRef(null);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (id) {
      setLoading(true); // Set loading true before fetching
      dispatch(fetchProductDetail(`product/${id}`)).then(() => {
        setLoading(false); // Set loading false after fetch completes
      });
    }
  }, [id, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading true before fetching
        const response = await dispatch(
          fetchOtherSupplierProductsList(
            `product/get-other-products/${id}?page_no=${currentPage}&page_size=${itemsPerPage}&search_key=${
              searchKey || ""
            }`
          )
        );
        if (response.meta.requestStatus === "fulfilled") {
          setProductList(response?.payload?.products || []);
          setTotalitems(response?.payload?.totalItems || 0);
        } else {
          setProductList([]);
          setTotalitems(0);
        }
      } catch (error) {
        console.error("Error fetching other supplier products:", error);
      } finally {
        setLoading(false); // Set loading false after fetch completes
      }
    };
    fetchData();
  }, [id, dispatch, currentPage, searchKey]);

  const getCategoryData = (property) => {
    if (!productDetail?.category) return null;
    return productDetail[productDetail.category]?.[property];
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchKey(e.target.value);
      setCurrentPage(1);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setSearchKey(inputValue);
      setCurrentPage(1);
    }
  };

  const quantityOptions = inventoryList.map((ele) => ({
    value: `${ele.quantityFrom}-${ele.quantityTo}`,
    label: `${ele.quantityFrom} - ${ele.quantityTo}`,
    price: ele.price,
    deliveryTime: ele.deliveryTime,
  }));

  // Get the first quantity option as the default
  const defaultOption = quantityOptions[0] || {
    value: "",
    price: "",
    deliveryTime: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log("values", values);
    setLoading(true); // Set loading true during form submission
    const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage?.getItem("buyer_id");
    const buyerId =
      localStorage?.getItem("_id") || localStorage?.getItem("_id");

    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      setLoading(false);
      return;
    }

    const obj = {
      buyerId,
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      medId: id,
      product_id: productDetail?.product_id,
      supplier_id: productDetail?.userDetails?.supplier_id,
      quantity_required: values?.quantityRequired,
      target_price: values?.targetPrice,
      quantity: values?.selectedQuantity,
      unit_price: values?.price,
      unit_tax: productDetail?.general?.unit_tax,
      est_delivery_time: values?.deliveryTime,
    };

    postRequestWithToken("buyer/add-to-list", obj, async (response) => {
      if (response?.code === 200) {
        toast(response.message, { type: "success" });
        localStorage?.setItem("list_count", response.result.listCount);
        dispatch(updateInquiryCartCount(response.result.listCount));
        setTimeout(() => {
          navigate("/buyer/send-inquiry");
          setLoading(false);
        }, 1000);
      } else {
        setLoading(false);
        toast(response.message, { type: "error" });
      }
    });
  };

  // Create a ref for the container to scroll
  const containerRef = useRef(null);

  // Scroll to the top of the component when the id changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [id]);

  // Render Loader if loading is true, otherwise render the content
  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.section}>
        <div className={styles.ProductMainContainer}>
          <span className={styles.medicineName}>
            {productDetail?.general?.name}
          </span>
        </div>
        {/* Start Secondar Market section */}
        {(productDetail?.secondaryMarketDetails?.purchasedOn ||
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
        )}

        {/* End Secondar Market section */}
        {/* Start general information section */}
        <div className={styles.mainContainer}>
          <span className={styles.innerHead}>
            General Information
          </span>
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
              {productDetail?.[productDetail?.category]?.anotherCategory && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Sub Category(Level3)
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.[productDetail?.category]?.anotherCategory}{" "}
                  </span>
                </div>
              )}
              {productDetail?.general?.form && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Type/Form</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.form}
                  </span>
                </div>
              )}
              {productDetail?.general?.unit_tax && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Tax%</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.unit_tax}
                  </span>
                </div>
              )}
              {productDetail?.general?.quantity && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Quantity</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.quantity}
                  </span>
                </div>
              )}
              {productDetail?.general?.volumn && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Size/Volumn
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.volumn}
                  </span>
                </div>
              )}

              {productDetail?.general?.packageType && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Packaging Type
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.packageType}
                  </span>
                </div>
              )}
              {(productDetail?.general?.packageMaterial ||
                productDetail?.general?.packageMaterialIfOther) && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Packaging Material
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.packageMaterial ||
                      productDetail?.general?.packageMaterialIfOther}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.mainSection}>
              {productDetail?.[productDetail?.category]?.subCategory && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Sub Category
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.[productDetail?.category]?.subCategory}{" "}
                  </span>
                </div>
              )}
              {productDetail?.general?.model && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Part/Model Number</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.model}
                  </span>
                </div>
              )}
              {productDetail?.general?.weight && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Weight</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.weight}{" "}
                    {productDetail?.general?.unit}
                  </span>
                </div>
              )}

              {productDetail?.general?.upc && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>UPC</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.upc}
                  </span>
                </div>
              )}
              {productDetail?.general?.brand && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Dimension</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.brand}
                  </span>
                </div>
              )}
              {productDetail?.general?.brand && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Brand Name</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.brand}
                  </span>
                </div>
              )}

              {productDetail?.storage && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Storage Conditions
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.storage}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* End general information section */}

        {productDetail?.general?.aboutManufacturer && (
          <div className={styles.mainContainer}>
            <div className={styles.manufacturerDescriptionSection}>
              <span className={styles.medicineHead}>Short Description</span>
              <span
                className={styles.medicineDescriptionContent}
                dangerouslySetInnerHTML={{
                  __html: productDetail?.general?.aboutManufacturer,
                }}
              ></span>
            </div>
          </div>
        )}

        {/* Start product description */}
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
        {/* End the product description */}

     </div>
      <div className={styles.section}>
        <ProductCard
          productList={productList}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          basePath="/buyer/product-details"
          heading="Similar Products"
        />
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

          {/* PDF display with loading and error handling */}
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
    </div>
  );
};

export default ProductDetails;
