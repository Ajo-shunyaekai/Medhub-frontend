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
        <div className={styles.mainContainer}>
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
                    {productDetail?.general?.volumeUnit}
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
             {productDetail?.general?.dimension && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Dimension</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.dimension}
                    {productDetail?.general?.dimensionUnit}
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
        {/* Start Short description */}
        {productDetail?.general?.aboutManufacturer && (
          <div className={styles.mainContainer}>
            <div className={styles.manufacturerDescriptionSection}>
              <span className={styles.medicineHead}>Short Description</span>
              <span className={styles.medicineDescriptionContent}>
                {productDetail?.general?.aboutManufacturer}
              </span>
            </div>
          </div>
        )}
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
                        Country where Stock Trades
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
                  <span className={styles.inventoryHead}>
                    Est. Delivery Time
                  </span>
                </div>
              </div>
              {productDetail?.inventoryDetails?.inventoryList?.map((ele) => (
                <div className={styles.inventorySection}>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>
                      {ele?.quantityFrom} - {ele?.quantityTo}
                    </span>
                  </div>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>{ele?.price}</span>
                  </div>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>
                      {ele?.deliveryTime || "TBC- based on quantity"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* End the product inventory section */}

        {/* Start the category details section */}
        {/* Medical Equipment and Devices */}
        {productDetail?.category === "MedicalEquipmentAndDevices" &&
          [
            "interoperability",
            "laserType",
            "coolingSystem",
            "spotSize",
            "diagnosticFunctions",
            "specification",
            productDetail?.[productDetail?.category]?.specificationFile
              ?.length > 0 && "specificationFile",
            "performanceTestingReport",
            productDetail?.[productDetail?.category]
              ?.performanceTestingReportFile?.length > 0 &&
              "performanceTestingReportFile",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>
                Medical Equipment and Devices
              </span>
              <div className={styles.innerSection}>
                {/* Basic Details */}
                {["interoperability", "laserType"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("interoperability") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Interoperability
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("interoperability")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("laserType") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Laser Type</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("laserType")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Drug Class & Controlled Substance */}
                {["coolingSystem", "spotSize"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("coolingSystem") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Cooling System
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("coolingSystem")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("spotSize") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Spot Size</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("spotSize")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Textarea Section */}
              <div className={styles.textareaContainer}>
                {/* Composition & Formulation */}

                {[
                  "specification",
                  "specificationFile",
                  "performanceTestingReport",
                  "performanceTestingReportFile",
                ].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("specification") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Specification
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("specification")}
                        </span>
                        <div className={styles.uploadFileSection}>
                          <RenderProductFiles
                            files={getCategoryData("specificationFile")}
                          />
                        </div>
                      </div>
                    )}
                    {getCategoryData("performanceTestingReport") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Performance Testing Report
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("performanceTestingReport")}
                        </span>

                        <div className={styles.uploadFileSection}>
                          <RenderProductFiles
                            files={getCategoryData(
                              "performanceTestingReportFile"
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {["diagnosticFunctions"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("diagnosticFunctions") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Diagnostic Functions
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("diagnosticFunctions")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        {/* End Medical Equipment and Devices */}

        {/* Pharmaceuticals */}
        {productDetail?.category === "Pharmaceuticals" &&
          [
            "genericName",
            "strength",
            "otcClassification",
            "drugClass",
            "expiry",
            "controlledSubstance",
            "composition",
            "formulation",
            "purpose",
            "drugAdministrationRoute",
            "allergens",
            "sideEffectsAndWarnings",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>Pharmaceuticals</span>
              <div className={styles.innerSection}>
                {/* Basic Details */}
                {["genericName", "strength", "otcClassification"].some(
                  getCategoryData
                ) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("genericName") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Generic Name
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("genericName")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("strength") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Strength</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("strength")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("otcClassification") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          OTC Classification
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("otcClassification")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Drug Class & Controlled Substance */}
                {["drugClass", "expiry", "controlledSubstance"].some(
                  getCategoryData
                ) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("drugClass") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Drug Class</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("drugClass")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("controlledSubstance") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Controlled Substance
                        </span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Textarea Section */}
              {[
                "composition",
                "formulation",
                "purpose",
                "drugAdministrationRoute",
                "allergens",
                "sideEffectsAndWarnings",
              ].some(getCategoryData) && (
                <div className={styles.textareaContainer}>
                  {/* Composition & Formulation */}
                  {["composition", "drugAdministrationRoute"].some(
                    getCategoryData
                  ) && (
                    <div className={styles.textareaSection}>
                      {getCategoryData("composition") && (
                        <div className={styles.textareaInnerSection}>
                          <span className={styles.medicineHead}>
                            Composition/Ingredients
                          </span>
                          <span className={styles.medicineContent}>
                            {getCategoryData("composition")}
                          </span>
                        </div>
                      )}

                      {getCategoryData("drugAdministrationRoute") && (
                        <div className={styles.textareaInnerSection}>
                          <span className={styles.medicineHead}>
                            Drug Administration Route
                          </span>
                          <span className={styles.medicineContent}>
                            {getCategoryData("drugAdministrationRoute")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Purpose & Drug Administration */}
                  {["purpose", "formulation"].some(getCategoryData) && (
                    <div className={styles.textareaSection}>
                      {getCategoryData("purpose") && (
                        <div className={styles.textareaInnerSection}>
                          <span className={styles.medicineHead}>Purpose</span>
                          <span className={styles.medicineContent}>
                            {getCategoryData("purpose")}
                          </span>
                        </div>
                      )}
                      {getCategoryData("formulation") && (
                        <div className={styles.textareaInnerSection}>
                          <span className={styles.medicineHead}>
                            Formulation
                          </span>
                          <span className={styles.medicineContent}>
                            {getCategoryData("formulation")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Side Effects & Allergens */}
                  {["sideEffectsAndWarnings", "allergens"].some(
                    getCategoryData
                  ) && (
                    <div className={styles.textareaSection}>
                      {getCategoryData("sideEffectsAndWarnings") && (
                        <div className={styles.textareaInnerSection}>
                          <span className={styles.medicineHead}>
                            Side Effects and Warnings
                          </span>
                          <span className={styles.medicineContent}>
                            {getCategoryData("sideEffectsAndWarnings")}
                          </span>
                        </div>
                      )}
                      {getCategoryData("allergens") && (
                        <div className={styles.textareaInnerSection}>
                          <span className={styles.medicineHead}>Allergens</span>
                          <span className={styles.medicineContent}>
                            {getCategoryData("allergens")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        {/* End Pharmaceuticals */}

        {/* Skin, Hair and Cosmetic Supplies */}
        {productDetail?.category === "SkinHairCosmeticSupplies" &&
          [
            "spf",
            "vegan",
            "crueltyFree",
            "expiry",
            "elasticity",
            "dermatologistTested",
            productDetail?.[productDetail?.category]?.dermatologistTestedFile
              ?.length > 0 && "dermatologistTestedFile",
            "strength",
            "controlledSubstance",
            "otcClassification",
            "adhesiveness",
            "thickness",
            "pediatricianRecommended",
            productDetail?.[productDetail?.category]
              ?.pediatricianRecommendedFile?.length > 0 && "fragrance",
            "formulation",
            "composition",
            "purpose",
            "targetCondition",
            "drugAdministrationRoute",
            "drugClass",
            "sideEffectsAndWarnings",
            "allergens",
            "concentration",
            "fillerType",
            "moisturizers",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>
                Skin, Hair and Cosmetic Supplies
              </span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {[
                  "spf",
                  "vegan",
                  "crueltyFree",
                  "expiry",
                  "elasticity",
                  "fragrance",
                  "dermatologistTested",
                  "dermatologistTestedFile",
                ].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("spf") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>SPF</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("spf")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("vegan") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Vegan</span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("crueltyFree") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Cruelty-Free
                        </span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}

                    {getCategoryData("elasticity") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Elasticity</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("elasticity")}
                        </span>
                      </div>
                    )}

                    {getCategoryData("fragrance") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Fragrance</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("fragrance")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("dermatologistTested") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Dermatologist Tested
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("dermatologistTested")}
                        </span>
                      </div>
                    )}

                    {getCategoryData("dermatologistTestedFile") && (
                      <div className={styles.medicinesFileSection}>
                        <span className={styles.medicineHead}>Upload File</span>
                        <div className={styles.uploadFileSection}>
                          <RenderProductFiles
                            files={getCategoryData("dermatologistTestedFile")}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Drug Info Section */}
                {[
                  "strength",
                  "controlledSubstance",
                  "otcClassification",
                  "adhesiveness",
                  "thickness",
                  "pediatricianRecommended",
                  "pediatricianRecommendedFile",
                ].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("strength") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Strength</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("strength")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("controlledSubstance") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Controlled Substance
                        </span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("adhesiveness") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Adhesiveness
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("adhesiveness")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("otcClassification") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Otc Classification
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("otcClassification")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("thickness") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Thickness</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("thickness")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("pediatricianRecommended") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Pediatrician Recommended
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("pediatricianRecommended")}
                        </span>
                      </div>
                    )}

                    {getCategoryData("pediatricianRecommendedFile") && (
                      <div className={styles.medicinesFileSection}>
                        <span className={styles.medicineHead}>Upload File</span>
                        <div className={styles.uploadFileSection}>
                          <RenderProductFiles
                            files={getCategoryData(
                              "pediatricianRecommendedFile"
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["composition", "purpose"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("composition") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Composition/Ingredients
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("composition")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("purpose") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Purpose</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("purpose")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["targetCondition", "drugAdministrationRoute"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("targetCondition") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Target Condition
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("targetCondition")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("drugAdministrationRoute") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Drug Administration Route
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("drugAdministrationRoute")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["drugClass", "allergens"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("drugClass") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Drug Class</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("drugClass")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("allergens") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Allergens</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("allergens")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["sideEffectsAndWarnings", "concentration"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("sideEffectsAndWarnings") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Side Effects And Warnings
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("sideEffectsAndWarnings")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("concentration") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Concentration
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("concentration")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["fillerType", "moisturizers"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("fillerType") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Filler Type</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("fillerType")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("moisturizers") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Moisturizers
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("moisturizers")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["formulation"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("formulation") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Formulation</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("formulation")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Skin, Hair and Cosmetic Supplies */}

        {/* Vital Health and Wellness */}
        {productDetail?.category == "VitalHealthAndWellness" &&
          [
            "genericName",
            "strength",
            "controlledSubstance",
            "otcClassification",
            "expiry",
            "vegan",
            "crueltyFree",
            "healthBenefit",
            "composition",
            "purpose",
            "drugAdministrationRoute",
            "drugClass",
            "sideEffectsAndWarnings",
            "allergens",
            "thickness",
            "powdered",
            "additivesNSweeteners",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>
                Vital Health and Wellness
              </span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {[
                  "genericName",
                  "strength",
                  "controlledSubstance",
                  "otcClassification",
                ].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("genericName") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Generic Name
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("genericName")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("strength") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Strength</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("strength")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("controlledSubstance") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Controlled Substance
                        </span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("otcClassification") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Otc Classification
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("otcClassification")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Drug Info Section */}
                {["expiry", "vegan", "crueltyFree"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("vegan") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Vegan</span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("crueltyFree") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Cruelty Free
                        </span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["drugClass", "drugAdministrationRoute"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("drugClass") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}> Drug Class</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("drugClass")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("drugAdministrationRoute") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Drug Administration Route
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("drugAdministrationRoute")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["healthBenefit", "composition"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("healthBenefit") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Health Benefit
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("healthBenefit")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("composition") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Composition/Ingredients
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("composition")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["formulation", "purpose"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("formulation") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Formulation</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("formulation")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("purpose") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Purpose</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("purpose")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["sideEffectsAndWarnings", "allergens"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("sideEffectsAndWarnings") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Side Effects and Warnings
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("sideEffectsAndWarnings")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("allergens") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Allergens</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("allergens")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["additivesNSweeteners"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("additivesNSweeteners") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Additives & Sweeteners
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("additivesNSweeteners")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Vital Health and Wellness */}

        {/* Medical Consumables and Disposables */}

        {productDetail?.category == "MedicalConsumablesAndDisposables" &&
          [
            "thickness",
            "powdered",
            "productMaterial",
            "expiry",
            "texture",
            "sterilized",
            "filtrationEfficiency",
            "breathability",
            "layerCount",
            "fluidResistance",
            "filtrationType",
            "purpose",
            "chemicalResistance",
            "allergens",
            "coating",
            "shape",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>
                Medical Consumables and Disposables
              </span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {[
                  "thickness",
                  "powdered",
                  "productMaterial",
                  "expiry",
                  "texture",
                  "sterilized",
                ].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("thickness") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Thickness</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("thickness")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("powdered") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Powdered</span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("productMaterial") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Product Material
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("productMaterial")}
                        </span>
                      </div>
                    )}

                    {getCategoryData("texture") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Texture</span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("sterilized") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Sterilized</span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                  </div>
                )}
                {/* Drug Info Section */}
                {[
                  "filtrationEfficiency",
                  "breathability",
                  "layerCount",
                  "fluidResistance",
                  "filtrationType",
                ].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("filtrationEfficiency") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Filtration Efficiency
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("filtrationEfficiency")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("breathability") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Breathability
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("breathability")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("layerCount") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Layer Count</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("layerCount")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("fluidResistance") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Fluid Resistance
                        </span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("filtrationType") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Filtration Type
                        </span>
                        <span className={styles.medicineText}>
                          {Array.isArray(getCategoryData("filtrationType"))
                            ? getCategoryData("filtrationType").join(", ")
                            : getCategoryData("filtrationType")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["purpose", "chemicalResistance"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("purpose") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Purpose</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("purpose")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("chemicalResistance") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Chemical Resistance
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("chemicalResistance")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["allergens", "shape"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("allergens") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}> Allergens</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("allergens")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("shape") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}> Shape</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("shape")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["coating"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("coating") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}> Coating</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("coating")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        {/* End Medical Consumables and Disposables */}

        {/* Laboratory Supplies */}
        {productDetail?.category == "LaboratorySupplies" &&
          [
            "connectivity",
            "physicalState",
            "hazardClassification",
            "magnificationRange",
            "objectiveLenses",
            "resolution",
            "powerSource",
            "shape",
            "coating",
            "purpose",
            "casNumber",
            "grade",
            "concentration",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>Laboratory Supplies</span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {["connectivity", "physicalState"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("connectivity") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Connectivity
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("connectivity")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("physicalState") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Physical State
                        </span>
                        <span className={styles.medicineText}>
                          {Array.isArray(getCategoryData("physicalState"))
                            ? getCategoryData("physicalState").join(", ")
                            : getCategoryData("physicalState")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Drug Info Section */}
                {["hazardClassification"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("hazardClassification") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Hazard Classification
                        </span>
                        <span className={styles.medicineText}>
                          {Array.isArray(
                            getCategoryData("hazardClassification")
                          )
                            ? getCategoryData("hazardClassification").join(", ")
                            : getCategoryData("hazardClassification")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["magnificationRange", "objectiveLenses"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("magnificationRange") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Magnification Range
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("magnificationRange")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("objectiveLenses") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Objective Lenses
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("objectiveLenses")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["resolution", "powerSource"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("powerSource") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Power Source
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("powerSource")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("resolution") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Resolution</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("resolution")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["shape", "coating"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("shape") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}> Shape</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("shape")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("coating") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Coating</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("coating")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["purpose", "casNumber"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("purpose") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}> Purpose</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("purpose")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("casNumber") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>CAS Number</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("casNumber")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["grade", "concentration"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("grade") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Grade</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("grade")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("concentration") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Concentration
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("concentration")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Laboratory Supplies */}

        {/* Diagnostic and Monitoring Devices */}
        {productDetail?.category == "DiagnosticAndMonitoringDevices" &&
          [
            "measurementRange",
            "noiseLevel",
            "usageRate",
            "diagnosticFunctions",
            "flowRate",
            "concentration",
            "maintenanceNotes",
            "compatibleEquipment",
            "specification",
            productDetail?.[productDetail?.category]?.specificationFile
              ?.length > 0 && "specificationFile",
            "performanceTestingReport",
            productDetail?.[productDetail?.category]
              ?.performanceTestingReportFile?.length > 0 &&
              "performanceTestingReportFile",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>
                {" "}
                Diagnostic and Monitoring Devices
              </span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {["measurementRange", "noiseLevel"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("measurementRange") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Measurement Range
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("measurementRange")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("noiseLevel") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Noise Level</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("noiseLevel")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Drug Info Section */}
                {["usageRate"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("usageRate") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Usage Rate</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("usageRate")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["diagnosticFunctions", "flowRate"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("diagnosticFunctions") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Diagnostic Functions
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("diagnosticFunctions")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("flowRate") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}> Flow Rate</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("flowRate")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["concentration", "maintenanceNotes"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("concentration") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Concentration
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("concentration")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("maintenanceNotes") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Maintenance Notes
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("maintenanceNotes")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["compatibleEquipment"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("compatibleEquipment") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Compatible Equipment
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("compatibleEquipment")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {[
                  "specification",
                  "specificationFile",
                  "performanceTestingReport",
                  "performanceTestingReportFile",
                ].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("specification") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Specification
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("specification")}
                        </span>
                        <div className={styles.uploadFileSection}>
                          <RenderProductFiles
                            files={getCategoryData("specificationFile")}
                          />
                        </div>
                      </div>
                    )}
                    {getCategoryData("performanceTestingReport") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Performance Testing Report
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("performanceTestingReport")}
                        </span>

                        <div className={styles.uploadFileSection}>
                          <RenderProductFiles
                            files={getCategoryData(
                              "performanceTestingReportFile"
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Diagnostic and Monitoring Devices */}

        {/* Hospital and Clinic Supplies */}

        {productDetail?.category == "HospitalAndClinicSupplies" &&
          [
            "adhesiveness",
            "absorbency",
            "thickness",
            "powdered",
            "productMaterial",
            "expiry",
            "texture",
            "sterilized",
            "fluidResistance",
            "elasticity",
            "purpose",
            "chemicalResistance",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>
                Hospital and Clinic Supplies
              </span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {[
                  "expiry",
                  "absorbency",
                  "thickness",
                  "powdered",
                  "productMaterial",
                ].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}

                    {getCategoryData("absorbency") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Absorbency</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("absorbency")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("thickness") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Thickness</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("thickness")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("powdered") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}> Powdered</span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("productMaterial") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Product Material
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("productMaterial")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Drug Info Section */}
                {[
                  "adhesiveness",
                  "texture",
                  "sterilized",
                  "fluidResistance",
                  "elasticity",
                ].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("adhesiveness") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Adhesiveness
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("adhesiveness")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("texture") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}> Texture</span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("sterilized") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Sterilized</span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("fluidResistance") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Fluid Resistance
                        </span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("elasticity") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Elasticity</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("elasticity")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["purpose", "chemicalResistance"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("purpose") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Purpose</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("purpose")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("chemicalResistance") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Chemical Resistance
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("chemicalResistance")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Hospital and Clinic Supplies */}

        {/* Orthopedic Supplies */}

        {productDetail?.category == "OrthopedicSupplies" &&
          [
            "elasticity",
            "sterilized",
            "absorbency",
            "strength",
            "moistureResistance",
            "breathability",
            "colorOptions",
            "purpose",
            "targetCondition",
            "coating",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>Orthopedic Supplies</span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {["strength", "sterilized", "absorbency"].some(
                  getCategoryData
                ) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("strength") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}> Strength</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("strength")}
                        </span>
                      </div>
                    )}

                    {getCategoryData("sterilized") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}> Sterilized</span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                    {getCategoryData("absorbency") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}> Absorbency</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("absorbency")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Drug Info Section */}
                {["elasticity", "moistureResistance"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("elasticity") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Elasticity</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("elasticity")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("moistureResistance") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Moisture Resistance
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("moistureResistance")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["purpose", "targetCondition"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("targetCondition") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Target Condition
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("targetCondition")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("purpose") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Purpose</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("purpose")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["breathability", "colorOptions"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("breathability") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Breathability
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("breathability")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("colorOptions") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Color Options
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("colorOptions")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["coating"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("coating") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Coating</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("coating")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Orthopedic Supplies */}

        {/* Dental Products */}
        {productDetail?.category == "DentalProducts" &&
          [
            "productMaterial",
            "usageRate",
            "expiry",
            "purpose",
            "targetCondition",
            "maintenanceNotesc",
            "compatibleEquipment",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>Dental Products</span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {["expiry", "usageRate"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("usageRate") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Usage Rate</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("usageRate")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Drug Info Section */}
                {["productMaterial"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("productMaterial") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Product Material
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("productMaterial")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["purpose", "targetCondition"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("purpose") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Purpose</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("purpose")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("targetCondition") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Target Condition
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("targetCondition")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["maintenanceNotes", "compatibleEquipment"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("maintenanceNotes") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Maintenance Notes
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("maintenanceNotes")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("compatibleEquipment") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Compatible Equipment
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("compatibleEquipment")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Dental Products */}

        {/* Eye Care Supplies */}
        {productDetail?.category == "EyeCareSupplies" &&
          [
            "diameter",
            "frame",
            "lens",
            "lensMaterial",
            "lensPower",
            "baseCurve",
            "colorOptions",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>Eye Care Supplies</span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {["diameter", "frame"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("diameter") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}> Diameter</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("diameter")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("frame") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Frame</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("frame")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Drug Info Section */}
                {["lens", "lensMaterial"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("lens") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Lens</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("lens")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("lensMaterial") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Lens Material
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("lensMaterial")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["lensPower", "baseCurve"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("lensPower") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Lens Power</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("lensPower")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("baseCurve") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}> Base Curve</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("baseCurve")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["colorOptions"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("colorOptions") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Color Options
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("colorOptions")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        {/* End Eye Care Supplies */}

        {/* Home Healthcare Products */}
        {productDetail?.category == "HomeHealthcareProducts" &&
          [
            "maxWeightCapacity",
            "gripType",
            "batteryType",
            "batterySize",
            "expiry",
            "colorOptions",
            "foldability",
            "lockingMechanism",
            "flowRate",
            "concentration",
            "performanceTestingReport",
            "composition",
            productDetail?.[productDetail?.category]
              ?.performanceTestingReportFile?.length > 0 &&
              "performanceTestingReportFile",
            "typeOfSupport",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>Home Healthcare Products</span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {["maxWeightCapacity", "gripType", "expiry"].some(
                  getCategoryData
                ) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("maxWeightCapacity") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Max Weight Capacity
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("maxWeightCapacity")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("gripType") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Grip Type</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("gripType")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Drug Info Section */}
                {["batterySize", "batteryType"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("batterySize") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Battery Size
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("batterySize")}
                        </span>
                      </div>
                    )}

                    {getCategoryData("batteryType") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Battery Type
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("batteryType")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["colorOptions", "foldability"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("colorOptions") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Color Options
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("colorOptions")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("foldability") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Foldability</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("foldability")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["lockingMechanism", "typeOfSupport"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("lockingMechanism") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Locking Mechanism
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("lockingMechanism")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("typeOfSupport") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Type of Support
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("typeOfSupport")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["flowRate", "concentration"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("flowRate") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Flow Rate</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("flowRate")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("concentration") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Concentration
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("concentration")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {[
                  "performanceTestingReport",
                  "performanceTestingReportFile",
                ].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("performanceTestingReport") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Performance Testing Report
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("performanceTestingReport")}
                        </span>
                      </div>
                    )}

                    {getCategoryData("performanceTestingReportFile") && (
                      <div className={styles.uploadFileSection}>
                        <RenderProductFiles
                          files={getCategoryData(
                            "performanceTestingReportFile"
                          )}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Home Healthcare Products */}

        {/* Alternative Medicines */}
        {productDetail?.category == "AlternativeMedicines" &&
          [
            "expiry",
            "purpose",
            "composition",
            "healthClaims",
            productDetail?.[productDetail?.category]?.healthClaimsFiles
              ?.length > 0 && "healthClaimsFiles",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>Alternative Medicines</span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {["expiry"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["purpose", "composition"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("composition") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Composition/Ingredients
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("composition")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("purpose") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}> Purpose</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("purpose")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["healthClaims", "healthClaimsFiles"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("healthClaims") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Health Claims
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("healthClaims")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("healthClaimsFiles") && (
                      <div className={styles.uploadFileSection}>
                        <RenderProductFiles
                          files={getCategoryData("healthClaimsFiles")}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Alternative Medicines */}

        {/* Emergency and First Aid Supplies */}

        {productDetail?.category == "EmergencyAndFirstAidSupplies" &&
          ["expiry", "composition", "productLongevity", "foldability"].some(
            getCategoryData
          ) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>
                Emergency and First Aid Supplies
              </span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {["expiry"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["productLongevity", "composition"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("productLongevity") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Product Longevity
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("productLongevity")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("composition") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Composition/Ingredients
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("composition")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["foldability"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("foldability") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Foldability</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("foldability")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Emergency and First Aid Supplies */}

        {/* Disinfection and Hygiene Supplies */}
        {productDetail?.category == "DisinfectionAndHygieneSupplies" &&
          [
            "expiry",
            "composition",
            "concentration",
            "formulation",
            "fragrance",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>
                Disinfection and Hygiene Supplies
              </span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {["expiry"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["composition", "concentration"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("composition") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          {" "}
                          Composition/Ingredients
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("composition")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("concentration") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Concentration
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("concentration")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["formulation", "fragrance"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("formulation") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Formulation</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("formulation")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("fragrance") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Fragrance</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("fragrance")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Disinfection and Hygiene Supplies */}

        {/* Nutrition and Dietary Products */}
        {productDetail?.category == "NutritionAndDietaryProducts" &&
          [
            "flavorOptions",
            "aminoAcidProfile",
            "fatContent",
            "expiry",
            "vegan",
            "purpose",
            "healthBenefit",
            "composition",
            "additivesNSweeteners",
            "dairyFree",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>
                Nutrition and Dietary Products
              </span>
              <div className={styles.innerSection}>
                {/* Generic Info Section */}
                {["expiry", "vegan"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("expiry") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>
                          Shelf Life/Expiry
                        </span>
                        <span className={styles.medicineText}>
                          {getCategoryData("expiry")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("vegan") === true && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Vegan</span>
                        <span className={styles.medicineText}>Yes</span>
                      </div>
                    )}
                  </div>
                )}
                {["dairyFree"].some(getCategoryData) && (
                  <div className={styles.mainSection}>
                    {getCategoryData("dairyFree") && (
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Dairy Free</span>
                        <span className={styles.medicineText}>
                          {getCategoryData("dairyFree")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Composition/Formulation/Purpose Section */}
              <div className={styles.textareaContainer}>
                {["flavorOptions", "aminoAcidProfile"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("flavorOptions") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          flavorOptions
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("flavorOptions")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("aminoAcidProfile") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          aminoAcidProfile
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("aminoAcidProfile")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["healthBenefit", "composition"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("healthBenefit") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          healthBenefit
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("healthBenefit")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("composition") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Composition/Ingredients
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("composition")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["fatContent", "additivesNSweeteners"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("fatContent") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>fatContent</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("fatContent")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("additivesNSweeteners") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Additives & Sweeteners
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("additivesNSweeteners")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {["purpose"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("purpose") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>purpose</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("purpose")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* End Nutrition and Dietary Products */}

        {/* Healthcare IT Solutions */}
        {productDetail?.category == "HealthcareITSolutions" &&
          [
            "license",
            "scalabilityInfo",
            "addOns",
            "userAccess",
            "keyFeatures",
            "coreFunctionalities",
            "interoperability",
            productDetail?.[productDetail?.category]?.interoperabilityFile
              ?.length > 0 && "interoperabilityFile",
          ].some(getCategoryData) && (
            <div className={styles.mainContainer}>
              <span className={styles.innerHead}>Healthcare IT Solutions</span>
              <div className={styles.textareaContainer}>
                {/* Composition/Formulation/Purpose Section */}
                {["license", "scalabilityInfo"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("license") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>License</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("license")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("scalabilityInfo") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          ScalabilityInfo
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("scalabilityInfo")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["addOns", "userAccess"].some(getCategoryData) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("addOns") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>Add-Ons</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("addOns")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("userAccess") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>User Access</span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("userAccess")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["keyFeatures", "coreFunctionalities"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("keyFeatures") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Key Features
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("keyFeatures")}
                        </span>
                      </div>
                    )}
                    {getCategoryData("coreFunctionalities") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Core Functionalities
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("coreFunctionalities")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {["interoperability", "interoperabilityFile"].some(
                  getCategoryData
                ) && (
                  <div className={styles.textareaSection}>
                    {getCategoryData("interoperability") && (
                      <div className={styles.textareaInnerSection}>
                        <span className={styles.medicineHead}>
                          Interoperability
                        </span>
                        <span className={styles.medicineContent}>
                          {getCategoryData("interoperability")}
                        </span>
                      </div>
                    )}
                    {productDetail?.[productDetail?.category]
                      ?.interoperabilityFile?.length > 0 && (
                      <div className={styles.uploadFileSection}>
                        <RenderProductFiles
                          files={
                            productDetail?.[productDetail?.category]
                              ?.interoperabilityFile
                          }
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        {/* End Healthcare IT Solutions */}

        {/* End the category details section */}

        {productDetail?.general?.image?.length > 0 && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Product Images</span>
            <div className={styles.productImageSection}>
              {productDetail?.general?.image?.map((img, index) => {
                const baseUrl = process.env.REACT_APP_SERVER_URL?.endsWith("/")
                  ? process.env.REACT_APP_SERVER_URL
                  : `${process.env.REACT_APP_SERVER_URL}/`;

                // If not a full URL, prepend base path
                const imgUrl = img?.startsWith("http")
                  ? img
                  : `${baseUrl}uploads/products/${img}`;

                // Check if it ends with image extension
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
        )}
        {/* End product image section */}
        {/* Start Compliance & Certification Health & Safety */}
        {(productDetail?.cNCFileNDate?.length > 0 ||
          productDetail?.healthNSafety?.safetyDatasheet?.length > 0 ||
          productDetail?.healthNSafety?.healthHazardRating?.length > 0 ||
          productDetail?.healthNSafety?.environmentalImpact?.length > 0) && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Compliance & Certification And Health & Safety
            </span>
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
                        <RenderProductFiles files={[item.file]} />
                        <span className={styles.medicineContent}>
                          {formatDate(item.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {productDetail?.healthNSafety?.safetyDatasheet?.length > 0 && (
                <div className={styles.additionalUploadSection}>
                  <span className={styles.medicineHead}>Safety Datasheet</span>
                  <div className={styles.additionalImageSection}>
                    <RenderProductFiles
                      files={productDetail?.healthNSafety?.safetyDatasheet}
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
                    <RenderProductFiles
                      files={productDetail?.healthNSafety?.healthHazardRating}
                    />
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
                    <RenderProductFiles
                      files={productDetail?.healthNSafety?.environmentalImpact}
                    />
                  </div>
                </div>
              )}
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
        {/* Start Manufacturer section */}
      
<div className={styles.mainManufacturerContainer}>
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
    </div>
  </div>
</div>
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