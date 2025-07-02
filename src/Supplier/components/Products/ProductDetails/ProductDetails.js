import styles from "./productdetail.module.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail } from "../../../../redux/reducers/productSlice";
import RenderProductFiles from "../RenderProductFiles";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import CloseIcon from "../../../assets/images/Icon.svg";
import moment from "moment";
import { borderBottom } from "@mui/system";
import Accordion from "react-bootstrap/Accordion";
 
Modal.setAppElement("#root");
 
const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state?.productReducer || {});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const pdfFile =
    productDetail?.secondaryMarketDetails?.purchaseInvoiceFile?.[0] ||
    productDetail?.data?.[0]?.secondaryMarketDetails?.purchaseInvoiceFile?.[0];
  const pdfUrl = pdfFile
    ? pdfFile?.startsWith("http")
      ? pdfFile
      : `${process.env.REACT_APP_SERVER_URL}/uploads/products/${pdfFile}`
    : "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";
 
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(`product/${id}`));
    }
  }, [id]);
 
  const getCategoryData = (property) => {
    if (!productDetail?.category) return null;
    return productDetail[productDetail.category]?.[property];
  };
 
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle empty or undefined dates
 
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return ""; // Handle invalid dates
 
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = dateObj.getFullYear();
 
    return `${day}-${month}-${year}`;
  };
 
  const fallbackImageUrl =
    "https://medhub.shunyaekai.com/uploads/fallbackImage.jpg";
 
  // Utility to check if URL ends with image extension
  const isImageExtension = (fileName) => {
    return /\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName);
  };
  const openPurchaseInvoice = () => {
    if (pdfFile) {
      window.open(pdfUrl, "_blank");
    } else {
      alert("No purchase invoice file available.");
    }
  };
 
  return (
    <div className={styles.container}>
      <span className={styles.heading}>Product Details</span>
      <div className={styles.section}>
        <div className={styles.mainUpparContainer}>
          <div className={styles.InnerContainer}>
            <span className={styles.medicineName}>
              {productDetail?.general?.name}
            </span>
            <Link
              to={`/supplier/edit-product/${id}`}
              className={styles.editButton}
            >
              Edit
            </Link>
          </div>
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
                         Minimum Order Quantity
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
                    onClick={openPurchaseInvoice}
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
          <div className={styles.headingSecContainer}>
            <span className={styles.innerHead}>General Information</span>{" "}
            {productDetail?.updatedAt && (
              <span className={styles.medicineHead2}>
                (Last Modified Date:{" "}
                {moment(productDetail?.updatedAt || new Date()).format(
                  "DD/MM/YYYY"
                )}
                )
              </span>
            )}
          </div>
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
              {productDetail?.anotherCategory && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Sub Category(Level3)
                  </span>
                  <span className={styles.medicineText}>
                    {/* {productDetail?.[productDetail?.category]?.anotherCategory}{" "} */}
                    {productDetail?.anotherCategory}
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
              {productDetail?.general?.strength && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Strength</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.strength}
                    {productDetail?.general?.strengthUnit}
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
              {productDetail?.general?.tags && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Tags</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.tags?.join(", ")}
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
                    {productDetail?.general?.volumeUnit}
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
              {/* {productDetail?.[productDetail?.category]?.subCategory && ( */}
              {productDetail?.subCategory && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Product Sub Category
                  </span>
                  <span className={styles.medicineText}>
                    {/* {productDetail?.[productDetail?.category]?.subCategory}{" "} */}
                    {productDetail?.subCategory}
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
                    {productDetail?.general?.dimension}
                    {productDetail?.general?.dimensionUnit}
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
              {productDetail?.general?.minimumPurchaseQuantity ||
                (productDetail?.general?.minimumPurchaseUnit && (
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>
                      Minimum Order Quantity
                    </span>
                    <span className={styles.medicineText}>
                      {productDetail?.general?.minimumPurchaseQuantity ||
                        productDetail?.general?.minimumPurchaseUnit}
                    </span>
                  </div>
                ))}
              {productDetail?.general?.totalQuantity ||
                (productDetail?.general?.quantity && (
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Total Quantity</span>
                    <span className={styles.medicineText}>
                      {productDetail?.general?.totalQuantity ||
                        productDetail?.general?.quantity}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
 
        {/* End general information section */}
        {/* Start Short description */}
        {/* {productDetail?.general?.aboutManufacturer && (
          <div className={styles.mainContainer}>
            <div className={styles.manufacturerDescriptionSection}>
              <span className={styles.medicineHead}>Short Description</span>
              <span className={styles.medicineDescriptionContent}>
                {productDetail?.general?.aboutManufacturer}
              </span>
            </div>
          </div>
        )} */}
        {/* End the Short description */}
 
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
 
        <div className={styles.mainContainer}>
          <span className={styles.innerHead}>Manufacturer Details</span>
          <div className={styles.manufacturerMainContainer}>
            <div className={styles.manufacturerContainer}>
              <div className={styles.manufacturersection}>
                <span className={styles.medicineHead}>Manufacturer Name</span>
                <span className={styles.medicineText}>
                  {productDetail?.general?.manufacturer || "N/A"}
                </span>
              </div>
              <div className={styles.manufacturersection}>
                <span className={styles.medicineHead}>Country of Origin</span>
                <span className={styles.medicineText}>
                  {productDetail?.general?.countryOfOrigin || "N/A"}
                </span>
              </div>
              <div className={styles.manufacturersection}>
                <span className={styles.medicineHead}>About Manufacturer</span>
                <span className={styles.medicineText}>
                  {productDetail?.general?.aboutManufacturer || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {productDetail?.categoryDetails?.length > 0 && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Other Details</span>
            <div className={styles.innerComplianceSection}>
              {productDetail?.categoryDetails?.map((item, index) => (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>{item?.name}</span>
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
            </div>
            <div
              className={styles.innerComplianceSection}
              style={{ marginTop: "20px" }}
            ></div>
          </div>
        )}
 
        {productDetail?.general?.image &&
          (Array.isArray(productDetail.general.image)
            ? // Render if image is an array
              productDetail.general.image.length > 0 && (
                <div className={styles.mainContainer}>
                  <span className={styles.innerHead}>Product Images</span>
                  <div className={styles.productImageSection}>
                    {productDetail.general.image.map((img, index) => {
                      const baseUrl =
                        process.env.REACT_APP_SERVER_URL?.endsWith("/")
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
              )
            : // Render if image is an object
              Object.keys(productDetail.general.image).length > 0 && (
                <div className={styles.mainContainer}>
                  <span className={styles.innerHead}>Product Images</span>
                  <div className={styles.productImageSection}>
                    {Object.entries(productDetail.general.image).map(
                      ([viewLabel, images]) =>
                        images?.map((imgUrl, index) => {
                          const isImageFile = isImageExtension(imgUrl);
                          return (
                            <div
                              className={styles.imageContainer}
                              key={`${viewLabel}-${index}`}
                            >
                              <span>
                                {viewLabel.charAt(0).toUpperCase() +
                                  viewLabel.slice(1)}{" "}
                                Image
                              </span>
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
              ))}
 
        {/* End product image section */}
 
        {/* Start Inventory & Packaging section */}
        {(productDetail?.inventoryDetails?.stockedInDetails?.length > 0 ||
          productDetail?.inventoryDetails?.sku ||
          productDetail?.inventoryDetails?.stock ||
          productDetail?.inventoryDetails?.date) && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Inventory & Packaging</span>
            <div className={styles.innerMainSection}>
              {(productDetail?.inventoryDetails?.sku ||
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
                          {/* {productDetail?.inventoryDetails?.date} */}
                          {formatDate(productDetail?.inventoryDetails?.date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {productDetail?.inventoryDetails?.stockedInDetails?.length >
                0 && (
                <div className={styles.inventorySection}>
                  <div className={styles.mainSection}>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        Stocked In Countries
                      </span>
                      <span className={styles.medicineHeadings}>Quantity</span>
                    </div>
 
                    {productDetail?.inventoryDetails?.stockedInDetails?.map(
                      (ele) => (
                        <div className={styles.medicinesSection}>
                          <span className={styles.medicineHead}>
                            {ele?.country}
                          </span>
                          <span className={styles.medicineTexts}>
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
 
        {/* Start the product inventory section */}
        {productDetail?.inventoryDetails?.inventoryList?.length > 0 && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Product Inventory</span>
            <div className={styles.innerInventorySection}>
              <div className={styles.inventorySection}>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Quantity</span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Cost Per Product</span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Total Price</span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>
                    Est. Shipping Time
                  </span>
                </div>
              </div>
              {productDetail?.inventoryDetails?.inventoryList?.map((ele) => (
                <div className={styles.inventorySection}>
                  <div className={styles.inventoryContainer}>
                    {/* <span className={styles.inventoryInput}>
                      {ele?.quantityFrom} - {ele?.quantityTo}
                      {ele?.quantity}
                      
                    </span> */}
                    {ele?.quantityFrom && ele?.quantityTo ? (
                      <span className={styles.inventoryInput}>
                        {ele.quantityFrom} - {ele.quantityTo}
                      </span>
                    ) : ele?.quantity ? (
                      <span className={styles.inventoryInput}>
                        {ele.quantity}
                      </span>
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>
                      {ele?.price} USD
                    </span>
                  </div>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>
                      {ele?.totalPrice} USD
                    </span>
                  </div>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>
                      {ele?.deliveryTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* End the product inventory section */}
        {/* Start Compliance & Certification Health & Safety */}
        {(productDetail?.cNCFileNDate?.length > 0 ||
          productDetail?.healthNSafety?.safetyDatasheet?.length > 0 ||
          productDetail?.healthNSafety?.healthHazardRating?.length > 0 ||
          productDetail?.healthNSafety?.environmentalImpact?.length > 0) && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Compliances & Certification
            </span>
            <div className={styles.innerComplianceSection}>
              {productDetail?.cNCFileNDate?.length > 0 && (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>
                    Regulatory Compliance
                  </span>
                  <div className={styles.additionalImageSection}>
                    {productDetail?.cNCFileNDate?.map((item, index) => (
                      <div
                        className={styles.complianceSection}
                        key={item._id || index}
                      >
                        <RenderProductFiles files={item.file} />
                        <span className={styles.medicineContent}>
                          {formatDate(item.date)}
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
        {
          <>
            <div className="support-heading">FAQ</div>
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
        }
        {/* Start Manufacturer section */}
 
        <div className={styles.mainManufacturerContainer}></div>
 
        {/* End Manufacturer section */}
 
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