import styles from "./productdetails.module.css";
import Select from "react-select";
import "../../../assets/style/react-input-phone.css";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOtherSupplierProductsList,
  fetchProductDetail,
} from "../../../../redux/reducers/productSlice";
import { useState, useEffect, useRef } from "react";
// import Modal from "react-modal";
import Modal from "react-modal";
import { Document, Page, pdfjs } from "react-pdf";
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
import Accordion from "react-bootstrap/Accordion";
import PdfViewerModal from "../../../../common/PdfViewer";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
 
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
 
const toTitleCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // add space between camelCase words
    .replace(/[_\-]/g, " ") // replace underscores/dashes with spaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
 
const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state?.productReducer || {});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [pdfToPreview, setPdfToPreview] = useState(null);
  const pdfFile =
    productDetail?.secondaryMarketDetails?.purchaseInvoiceFile?.[0] ||
    productDetail?.data?.[0]?.secondaryMarketDetails?.purchaseInvoiceFile?.[0];
  // const pdfUrl = pdfFile
  //   ? pdfFile?.startsWith("http")
  //     ? pdfFile
  //     : `${process.env.REACT_APP_SERVER_URL}/uploads/products/${pdfFile}`
  //   : "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";
 
  const pdfUrl = pdfFile
    ? (() => {
        const filename = pdfFile?.split("/")?.pop();
        return `${process.env.REACT_APP_SERVER_URL.replace(
          /\/$/,
          ""
        )}/pdf-proxy/${filename}`;
      })()
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
    const buyerId =
      localStorage?.getItem("buyer_id") || localStorage?.getItem("buyer_id");
    if (!buyerId) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading true before fetching
        const response = await dispatch(
          fetchOtherSupplierProductsList(
            `product/get-other-products/${id}?buyer_id=${buyerId}&page_no=${currentPage}&page_size=${itemsPerPage}&search_key=${
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
 
  // const quantityOptions = inventoryList?.map((ele) => ({
  //   // value: `${ele.quantityFrom}-${ele.quantityTo}`,
  //   // label: `${ele.quantityFrom} - ${ele.quantityTo}`,
  //   value: ele.quantity,
  //   label: ele.quantity,
  //   price: ele.price,
  //   deliveryTime: ele.deliveryTime,
  // }));
 
  const quantityOptions = inventoryList?.map((ele) => {
    const hasRange = ele.quantityFrom && ele.quantityTo;
    const displayValue = hasRange
      ? `${ele.quantityFrom}-${ele.quantityTo}`
      : ele.quantity;
 
    return {
      value: displayValue,
      label: displayValue,
      price: ele.price,
      deliveryTime: ele.deliveryTime,
    };
  });
 
  // Get the first quantity option as the default
  const defaultOption = quantityOptions[0] || {
    value: "",
    price: "",
    deliveryTime: "",
  };
 
  const handleSubmit = (values, { resetForm }) => {
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
          navigate("/buyer/send-enquiry");
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
 
  // Function to open PDF in a new window
  const openPurchaseInvoice = () => {
    if (pdfFile) {
      // window.open(pdfUrl, "_blank");
      setPdfToPreview(pdfUrl);
      setOpen(true);
    } else {
      alert("No purchase invoice file available.");
    }
  };
 
  const handleClose = () => {
    setOpen(false);
    setPdfToPreview(null);
  };
 
  // For new image thumbnail
  const baseUrl = process.env.REACT_APP_SERVER_URL?.endsWith("/")
    ? process.env.REACT_APP_SERVER_URL
    : `${process.env.REACT_APP_SERVER_URL}/`;
 
  const getFullImageUrl = (img) =>
    img?.startsWith("http") ? img : `${baseUrl}uploads/products/${img}`;
 
  const imageArray = Array.isArray(productDetail?.general?.image)
    ? productDetail.general.image
    : Object.values(productDetail?.general?.image || {}).flat();
 
  const [selectedImage, setSelectedImage] = useState(() =>
    imageArray.length > 0 ? getFullImageUrl(imageArray[0]) : fallbackImageUrl
  );
 
  // Update main image if productDetail changes
  useEffect(() => {
    if (imageArray.length > 0) {
      setSelectedImage(getFullImageUrl(imageArray[0]));
    }
  }, [productDetail?.general?.image]);
 
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
        {/* Start Secondary Market section */}
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
                                  ?.countryAvailable?.length -
                                  1 && ", "}
                            </span>
                          )
                        )}
                      </span>
                    </div>
                  )}
 
                  {/* {productDetail?.secondaryMarketDetails
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
                  )} */}
                </div>
              )}
 
              {productDetail?.secondaryMarketDetails?.purchaseInvoiceFile
                ?.length > 0 && (
                <div className={styles.mainPurchaseSection}>
                  <button
                    className={styles.PurcahseButton}
                    onClick={openPurchaseInvoice} // Updated to open in new window
                  >
                    View Purchase Invoice
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {/* End Secondary Market section */}
 
        {/* Start general information section */}
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
              {/* {productDetail?.[productDetail?.category]?.anotherCategory && ( */}
              {(productDetail?.[productDetail?.category]?.anotherCategory ||
                productDetail?.anotherCategory) && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Sub Category(Level3)
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.[productDetail?.category]
                      ?.anotherCategory || productDetail?.anotherCategory}
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
              {productDetail?.general?.unit_tax && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Tags</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.tags?.join(", ") || "N/A"}
                  </span>
                </div>
              )}
              {productDetail?.general?.strength && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Strength</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.strength}{" "}
                    {productDetail?.general?.strengthUnit}
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
              {/* {productDetail?.general?.volumn && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Size/Volumn
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.volumn}
                  </span>
                </div>
              )} */}
 
              {/* {productDetail?.general?.packageType && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Packaging Type
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.packageType}
                  </span>
                </div>
              )} */}
              {/* {(productDetail?.general?.packageMaterial ||
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
              {productDetail?.general?.model && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Part/Model Number</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.model}
                  </span>
                </div>
              )}
              {/* {productDetail?.general?.weight && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Weight</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.weight}{" "}
                    {productDetail?.general?.unit}
                  </span>
                </div>
              )} */}
 
              {productDetail?.general?.upc && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>UPC</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.upc}
                  </span>
                </div>
              )}
 
              {/* {productDetail?.general?.dimension && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Dimension</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.dimension} {""} {productDetail?.general?.dimensionUnit}
                  </span>
                </div>
              )} */}
              {productDetail?.general?.brand && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Brand Name</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.brand}
                  </span>
                </div>
              )}
              {productDetail?.general?.minimumPurchaseQuantity && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Minimum Order Quantity
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.minimumPurchaseQuantity}
                  </span>
                </div>
              )}
              {productDetail?.general?.quantity && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Total Quantity</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.quantity}
                  </span>
                </div>
              )}
 
              {productDetail?.general?.buyersPreferredFrom && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Buyers Preferred From
                  </span>
                  <span className={styles.medicineText}>
                    {/* {productDetail?.general?.buyersPreferredFrom} */}
                    {productDetail.general.buyersPreferredFrom.length <= 25 ? (
                      productDetail.general.buyersPreferredFrom.join(", ")
                    ) : (
                      <>
                        {productDetail.general.buyersPreferredFrom
                          .slice(0, 25)
                          .join(", ")}
                        <span>{" ... "}</span>
                        <span
                          id="buyer-tooltip"
                          style={{ textDecoration: "underline" }}
                        >
                          {"view more"}
                        </span>
                        <Tooltip
                          anchorId="buyer-tooltip"
                          place="bottom"
                          className={styles.toolTip}
                          delayHide={500}
                          content={productDetail.general.buyersPreferredFrom
                            .slice(25)
                            .join(", ")}
                        />
                      </>
                    )}
                  </span>
                </div>
              )}
 
              {/* {productDetail?.storage && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Storage Conditions
                  </span>
                  <span className={styles.medicineText}>
                    {productDetail?.storage}
                  </span>
                </div>
              )} */}
            </div>
          </div>
        </div>
 
        {/* End general information section */}
 
        {/* {productDetail?.general?.aboutManufacturer && (
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
        )} */}
 
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
 
        {/* Start Manufacturer section */}
        {(productDetail?.general?.manufacturer ||
          // productDetail?.general?.aboutManufacturer ||
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
                        Contry of Origin
                      </span>
                      <span className={styles.medicineText}>
                        {productDetail?.general?.countryOfOrigin}
                      </span>
                    </div>
                  )}
                  {productDetail?.general?.aboutManufacturer && (
                    // <div className={styles.manufacturersection}>
                    //   <span className={styles.medicineHead}>
                    //     About Manufacturer
                    //   </span>
                    //   <span className={styles.medicineText}>
                    //     {productDetail?.general?.aboutManufacturer}
                    //   </span>
                    // </div>
                    <div className={styles.additionalUploadSection34}>
                      <span className={styles.medicineHead34}>
                        About Manufacturer
                      </span>
                      <div className={styles.additionalImageSection34}>
                        {/* {productDetail?.categoryDetails?.map((item, index) => ( */}
                        <div className={styles.complianceSection34}>
                          <span className={styles.medicineContent34}>
                            {productDetail?.general?.aboutManufacturer}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
 
        {/* End Manufacturer section */}
 
        {/* Start of Category Other Details */}
        {productDetail?.categoryDetails?.length > 0 && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Other Details{" "}
              {productDetail?.category
                ? `of ${productDetail.category
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}`
                : ""}
            </span>
            <div className={styles.innerComplianceSection}>
              {productDetail?.categoryDetails
                ?.filter((item) => item?.type != "textarea")
                ?.map((item, index) => (
                  <div className={styles.additionalUploadSection}>
                    <span className={styles.medicineHead}>
                      {toTitleCase(item?.name)}
                    </span>
                    <div className={styles.additionalImageSection}>
                      {/* {productDetail?.categoryDetails?.map((item, index) => ( */}
                      <div
                        className={styles.complianceSection}
                        key={item._id || index}
                      >
                        {item?.type == "file" ? (
                          <RenderProductFiles files={[item.fieldValue]} />
                        ) : (
                          <span className={styles.medicineContent}>
                            {item.fieldValue}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              {productDetail?.categoryDetails
                ?.filter((item) => item?.type == "textarea")
                ?.map((item, index) => (
                  <div className={styles.additionalUploadSection34}>
                    <span className={styles.medicineHead34}>
                      {toTitleCase(item?.name)}
                    </span>
                    <div className={styles.additionalImageSection34}>
                      {/* {productDetail?.categoryDetails?.map((item, index) => ( */}
                      <div
                        className={styles.complianceSection34}
                        key={item._id || index}
                      >
                        {item?.type == "file" ? (
                          <RenderProductFiles files={[item.fieldValue]} />
                        ) : (
                          <span className={styles.medicineContent34}>
                            {item.fieldValue}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div
              className={styles.innerComplianceSection}
              style={{ marginTop: "20px" }}
            ></div>
          </div>
        )}
        {/* End of Category Other Details */}
 
        {/* Start product image section */}
 
        {/* <div className={styles.mainContainer}>
          <span className={styles.innerHead}>Product Images</span>
          <div className={styles.productImageSection}>
            {productDetail?.general?.image?.map((img, index) => {
              const baseUrl = process.env.REACT_APP_SERVER_URL?.endsWith("/")
                ? process.env.REACT_APP_SERVER_URL
                : `${process.env.REACT_APP_SERVER_URL}/`;
 
              const imgUrl = img?.startsWith("http")
                ? img
                : `${baseUrl}uploads/products/${img}`;
 
              const isImageFile = isImageExtension(imgUrl);
 
              return (
                <div className={styles.imageContainer} key={index}>
                  <img
                    className={styles.imageSection}
                    src={isImageFile ? imgUrl : fallbackImageUrl}
                    alt="Product Image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImageUrl;
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div> */}
 
        {/* {productDetail?.general?.image &&
          Object.keys(productDetail.general.image).length > 0 && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>Product Images</span>
              <div className={styles.productImageSection}>
                {Object.entries(productDetail.general.image).map(
                  ([viewLabel, images]) =>
                    images.map((imgUrl, index) => {
                      const isImageFile = isImageExtension(imgUrl);
                      return (
                        <div className={styles.imageContainer} key={`${viewLabel}-${index}`}>
                          <span>{viewLabel.charAt(0).toUpperCase() + viewLabel.slice(1)} Image</span>
                          <img
                            className={styles.imageSection}
                            src={isImageFile ? imgUrl : fallbackImageUrl}
                            alt={`${viewLabel} view`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = fallbackImageUrl;
                            }}
                          />
                          <div className={styles.imageLabel}>{viewLabel.toUpperCase()}</div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )} */}
 
        {/* {Array.isArray(productDetail?.general?.image) ? (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Product Images</span>
            <div className={styles.productImageSection}>
              {productDetail.general.image.map((img, index) => {
                const baseUrl = process.env.REACT_APP_SERVER_URL?.endsWith("/")
                  ? process.env.REACT_APP_SERVER_URL
                  : `${process.env.REACT_APP_SERVER_URL}/`;
 
                const imgUrl = img?.startsWith("http")
                  ? img
                  : `${baseUrl}uploads/products/${img}`;
 
                const isImageFile = isImageExtension(imgUrl);
 
                return (
                  <div className={styles.imageContainer} key={index}>
                    <img
                      className={styles.imageSection}
                      src={isImageFile ? imgUrl : fallbackImageUrl}
                      alt="Product Image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImageUrl;
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          productDetail?.general?.image &&
          Object.keys(productDetail.general.image).length > 0 && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>Product Images</span>
              <div className={styles.productImageSection}>
                {Object.entries(productDetail.general.image).map(
                  ([viewLabel, images]) =>
                    images.map((imgUrl, index) => {
                      const isImageFile = isImageExtension(imgUrl);
                      return (
                        <div
                          className={styles.imageContainer}
                          key={`${viewLabel}-${index}`}
                        >
                          <span className={styles.medicineHead}>{viewLabel.charAt(0).toUpperCase() +
                              viewLabel.slice(1)}{" "} Image</span>
                          <img
                            className={styles.imageSection}
                            src={isImageFile ? imgUrl : fallbackImageUrl}
                            alt={`${viewLabel} view`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = fallbackImageUrl;
                            }}
                          />
                          <div className={styles.imageLabel}>
                            {viewLabel.toUpperCase()}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )
        )} */}
 
        {/* New way of displaying product */}
        {imageArray.length > 0 && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Product Images</span>
            <div className={styles.imageViewerSection}>
              <div className={styles.imageContainer2}>
                <img
                  className={styles.imageSection}
                  // src={
                  //   isImageExtension(selectedImage)
                  //     ? selectedImage
                  //     : fallbackImageUrl
                  // }
                  src={selectedImage ? selectedImage :  fallbackImageUrl}
                  alt="Main Product Image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImageUrl;
                  }}
                />
              </div>
              <div className={styles.thumbnailContainer}>
                {imageArray.map((img, index) => {
                  const imgUrl = getFullImageUrl(img);
                  const isImageFile = isImageExtension(imgUrl);
 
                  return (
                    <div className={styles.thumbnail}>
                      <img
                        key={index}
                        className={`${styles.thumbnailImage2} ${
                          selectedImage === imgUrl ? styles.activeThumbnail : ""
                        }`}
                        // src={isImageFile ? imgUrl : fallbackImageUrl}
                        src={imgUrl ? imgUrl : fallbackImageUrl}
                        alt={`Thumbnail ${index}`}
                        onClick={() => setSelectedImage(imgUrl)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackImageUrl;
                        }}
                      />
                      <span
                        className={styles.medicineHead}
                        onClick={() => setSelectedImage(imgUrl)}
                      >
                        {index == 0
                          ? "Front"
                          : index == 1
                          ? "Back"
                          : index == 2
                          ? "Side"
                          : "Closeup"}{" "}
                        Image
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* Start Inventory & Packaging section */}
        {(productDetail?.inventoryDetails?.stockedInDetails?.length > 0 ||
          productDetail?.inventoryDetails?.sku ||
          productDetail?.inventoryDetails?.stock ||
          productDetail?.inventoryDetails?.date) && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Inventory & Packaging</span>
            <div className={styles.innerMainSection}>
              {/* {(productDetail?.inventoryDetails?.sku ||
                productDetail?.inventoryDetails?.stock ||
                productDetail?.inventoryDetails?.date) && (
                <div className={styles.inventorySection}>
                  <div className={styles.mainSection}>
                    {productDetail?.inventoryDetails?.sku && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>SKU</span>
                        <span className={styles.medicineText}>
                          {productDetail?.inventoryDetails?.sku}
                        </span>
                      </div>
                    )}
                    {productDetail?.inventoryDetails?.countries && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Stocked in Countries
                        </span>
                        <span className={styles.medicineText}>
                          {productDetail.inventoryDetails.countries.map(
                            (country, index) => (
                              <span key={index}>
                                {country}
                                {index <
                                productDetail.inventoryDetails.countries
                                  ?.length -
                                  1
                                  ? ", "
                                  : ""}
                              </span>
                            )
                          )}
                        </span>
                      </div>
                    )}
                  </div>
 
                  <div className={styles.mainSection}>
                    {productDetail?.inventoryDetails?.stock && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Stock</span>
                        <span className={styles.medicineText}>
                          {productDetail?.inventoryDetails?.stock}
                        </span>
                      </div>
                    )}
                    {productDetail?.inventoryDetails?.date && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Date of Manufacture
                        </span>
                        <span className={styles.medicineText}>
                          {new Date(
                            productDetail.inventoryDetails.date
                          ).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )} */}
              {productDetail?.inventoryDetails?.stockedInDetails?.length >
                0 && (
                <div className={styles.inventorySection}>
                  <div className={styles.mainSection}>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        Stocked In Countries
                      </span>
                      <span className={styles.medicineHead}>Quantity</span>
                    </div>
 
                    {productDetail?.inventoryDetails?.stockedInDetails?.map(
                      (ele) => (
                        <div className={styles.medicinesSection}>
                          <span className={styles.medicineHead}>
                            {ele?.country}
                          </span>
                          <span className={styles.medicineTexts2}>
                            {ele?.quantity} {ele?.type}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* End Inventory & Packaging section */}
 
        {/* Start Compliance & Certification Health & Safety */}
        {(productDetail?.cNCFileNDate?.length > 0 ||
          productDetail?.healthNSafety?.safetyDatasheet?.length > 0 ||
          productDetail?.healthNSafety?.healthHazardRating?.length > 0 ||
          productDetail?.healthNSafety?.environmentalImpact?.length > 0) && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Compliance & Certification</span>
            <div className={styles.innerComplianceSection}>
              {productDetail?.cNCFileNDate?.length > 0 && (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>
                    Regulatory Compliance
                  </span>
                  <div className={styles.additionalImageSection}>
                    {productDetail.cNCFileNDate.map((item, index) => (
                      <div
                        className={styles.complianceSection}
                        key={item._id || index}
                      >
                        {/* <RenderProductFiles files={item.file} /> */}
                        <RenderProductFiles
                          files={
                            Array.isArray(item.file) ? item.file : [item.file]
                          }
                        />
                        <span className={styles.medicineContent}>
                          {item.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* {productDetail?.healthNSafety?.safetyDatasheet?.length > 0 && (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>Safety Datasheet</span>
                  <div className={styles.additionalImageSection}>
                    <RenderProductFiles
                      files={productDetail?.healthNSafety?.safetyDatasheet}
                    />
                  </div>
                </div>
              )} */}
            </div>
            <div
              className={styles.innerComplianceSection}
              style={{ marginTop: "20px" }}
            >
              {/* {productDetail?.healthNSafety?.healthHazardRating?.length > 0 && (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>
                    Health Hazard Rating
                  </span>
                  <div className={styles.additionalImageSection}>
                    <RenderProductFiles
                      files={productDetail?.healthNSafety?.healthHazardRating}
                    />
                  </div>
                </div>
              )} */}
              {/* {productDetail?.healthNSafety?.environmentalImpact?.length >
                0 && (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>
                    Environmental Impact
                  </span>
                  <div className={styles.additionalImageSection}>
                    <RenderProductFiles
                      files={productDetail?.healthNSafety?.environmentalImpact}
                    />
                  </div>
                </div>
              )} */}
            </div>
          </div>
        )}
        {/* End Compliance & Certification Health & Safety */}
 
        {/* Start Additional information */}
        {(productDetail?.additional?.other ||
          productDetail?.additional?.warranty ||
          productDetail?.additional?.guidelinesFile?.length > 0) && (
          <div className={styles.addtionalContainer}>
            <span className={styles.innerHead}>Additional Information </span>
            <div className={styles.manufacturerMainContainer}>
              {productDetail?.additional?.other && (
                <div className={styles.additionalSection}>
                  {productDetail?.additional?.warranty && (
                    <div className={styles.additionalInnerSection}>
                      <span className={styles.medicineHead}>Warranty</span>
                      <span className={styles.medicineText}>
                        {productDetail?.additional?.warranty}
                      </span>
                    </div>
                  )}
                  {productDetail?.additional?.other && (
                    <div className={styles.additionalInnerSection}>
                      <span className={styles.medicineHead}>
                        Other Information
                      </span>
                      <span className={styles.medicineText}>
                        {productDetail?.additional?.other}
                      </span>
                    </div>
                  )}
                </div>
              )}
 
              {productDetail?.additional?.guidelinesFile?.length > 0 && (
                <div className={styles.additionalUploadSection}>
                  <div className={styles.additionalUploadSection}>
                    <span className={styles.medicineHead}>User Guidelines</span>
                    <div className={styles.additionalImageSection}>
                      <RenderProductFiles
                        files={productDetail?.additional?.guidelinesFile}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
 
        {/* End Additional information */}
 
        {/* start of Product documents */}
        {(productDetail?.documents?.catalogue?.length > 0 ||
          productDetail?.documents?.specification?.length > 0) && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Product Documents</span>
            <div className={styles.innerComplianceSection}>
              {productDetail?.documents?.catalogue?.length > 0 && (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>Product Catalogue</span>
                  <div className={styles.additionalImageSection}>
                    <RenderProductFiles
                      files={productDetail?.documents?.catalogue}
                    />
                  </div>
                </div>
              )}
              {productDetail?.documents?.specification?.length > 0 && (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>Specification</span>
                  <div className={styles.additionalImageSection}>
                    <RenderProductFiles
                      files={productDetail?.documents?.specification}
                    />
                  </div>
                </div>
              )}
            </div>
            <div
              className={styles.innerComplianceSection}
              style={{ marginTop: "20px" }}
            >
              {productDetail?.healthNSafety?.healthHazardRating?.length > 0 && (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>
                    Health Hazard Rating
                  </span>
                  <div className={styles.additionalImageSection}>
                    {/* <RenderProductFiles
                      files={productDetail?.healthNSafety?.healthHazardRating}
                    /> */}
                  </div>
                </div>
              )}
              {productDetail?.healthNSafety?.environmentalImpact?.length >
                0 && (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>
                    Environmental Impact
                  </span>
                  <div className={styles.additionalImageSection}>
                    {/* <RenderProductFiles
                      files={productDetail?.healthNSafety?.environmentalImpact}
                    /> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* end of product document */}
 
        {/* Start the product inventory section */}
        {productDetail?.inventoryDetails?.inventoryList?.length > 0 && (
          <div className={styles.mainContainer}>
            {/* <span className={styles.innerHead}>Product Inventory</span> */}
            <div className={styles.innerInventorySection}>
              <div className={styles.inventorySection}>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Quantity*</span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>
                    Cost Per Product*
                  </span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>
                    Est. Shipping Time*
                  </span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>
                    Quantity Required*
                  </span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Target Price*</span>
                </div>
              </div>
 
              <Formik
                initialValues={{
                  selectedQuantity: defaultOption.value,
                  price: defaultOption.price,
                  deliveryTime: defaultOption.deliveryTime,
                  quantityRequired: "",
                  targetPrice: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, values, errors, touched }) => {
                  // Get the selected quantity details
                  const selectedOption =
                    quantityOptions.find(
                      (opt) => opt.value === values.selectedQuantity
                    ) || defaultOption;
 
                  return (
                    <Form className={styles.formSection}>
                      <div className={styles.fromContainer}>
                        <div className={styles.inventoryContainer}>
                          <Select
                            options={quantityOptions}
                            value={quantityOptions.find(
                              (opt) => opt.value === values.selectedQuantity
                            )}
                            placeholder="Select Quantity"
                            onChange={(option) => {
                              setFieldValue(
                                "selectedQuantity",
                                option?.value || ""
                              );
                              setFieldValue("targetPrice", ""); // Reset target price when quantity changes
                            }}
                            className={
                              errors.selectedQuantity &&
                              touched.selectedQuantity
                                ? styles.errorSelect
                                : ""
                            }
                          />
                          <ErrorMessage
                            name="selectedQuantity"
                            component="span"
                            className={styles.errorText}
                          />
                        </div>
                        <div className={styles.inventoryContainer}>
                          <span className={styles.inventoryInput} readOnly>
                            {selectedOption.price
                              ? `${selectedOption.price} USD`
                              : "N/A"}
                          </span>
                        </div>
                        <div className={styles.inventoryContainer}>
                          <span className={styles.inventoryInput} readOnly>
                            {selectedOption.deliveryTime}
                          </span>
                        </div>
                        <div className={styles.inventoryContainer}>
                          <Field
                            type="number"
                            name="quantityRequired"
                            className={styles.inventoryInput}
                            placeholder="Enter quantity"
                          />
                          <ErrorMessage
                            name="quantityRequired"
                            component="span"
                            className={styles.errorText}
                          />
                        </div>
                        <div className={styles.inventoryContainer}>
                          <Field
                            type="number"
                            name="targetPrice"
                            className={styles.inventoryInput}
                            placeholder="Enter target price"
                          />
                          <ErrorMessage
                            name="targetPrice"
                            component="span"
                            className={styles.errorText}
                          />
                        </div>
                      </div>
                      <div className={styles.buttonContainer}>
                        <button
                          type="submit"
                          className={styles.submitButton}
                          disabled={loading}
                        >
                          {/* Add to List */}
                          {loading ? (
                            <div className="loading-spinner"></div>
                          ) : (
                            "Add to Cart"
                          )}
                        </button>
                        <button
                          type="button"
                          className={styles.cancelButton}
                          onClick={() => setFieldValue("quantityRequired", "")}
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
              {/* );
              // })} */}
            </div>
          </div>
        )}
        {/* End the product inventory section */}
 
        {productDetail?.faqs?.length > 0 && (
          <>
            <span className={styles.innerHead}>FAQs</span>
            <div className="faq-container">
              <Accordion>
                {productDetail?.faqs?.map((item, index) => (
                  <Accordion.Item eventKey={index} className="faq-cover mt-2">
                    <Accordion.Header className="faq-heading">
                      {" "}
                      {item?.ques}
                    </Accordion.Header>
                    <Accordion.Body>{item?.ans}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </>
        )}
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
      </div>
 
      <PdfViewerModal
        isOpen={open}
        onClose={handleClose}
        fileUrl={pdfToPreview}
      />
    </div>
  );
};
 
export default ProductDetails;