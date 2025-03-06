import { useEffect, useState } from "react";
import Modal from "react-modal";
import CloseIcon from "../../../assets/images/Icon.svg";
import styles from "./productdetail.module.css";
import Doc from "../../../assets/images/doc.png";
import PDF from "../../../assets/images/pdf.png";
import Image from "../../../assets/images/product-details/para.webp";
import Image1 from "../../../assets/images/product-details/paracetamol.png";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail } from "../../../../redux/reducers/productSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state?.productReducer);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const pdfUrl = "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";

  useEffect(() => {
    id && dispatch(fetchProductDetail(`product/${id}`));
  }, [id]);

  console.log("productDetails fromredux", productDetail);

  return (
    <div className={styles.container}>
      <span className={styles.heading}>Product Details</span>
      <div className={styles.section}>
        <div className={styles.mainContainer}>
          <div className={styles.InnerContainer}>
            <span className={styles.medicineName}>
              {productDetail?.general?.name}
            </span>
            <button className={styles.editButton}>Edit</button>
          </div>
        </div>

        {/* Start Secondar Market section */}
        <div className={styles.mainContainer}>
          <span className={styles.innerHead}>Secondary Market Information</span>
          <div className={styles.innerSection}>
            <div className={styles.mainSection}>
              <div className={styles.medicinesSection}>
                <span className={styles.medicineHead}>Purchased on</span>
                <span className={styles.medicineText}>12/10/2025</span>
              </div>
              <div className={styles.medicinesSection}>
                <span className={styles.medicineHead}>Condition</span>
                <span className={styles.medicineText}>New</span>
              </div>
            </div>
            <div className={styles.mainSection}>
              <div className={styles.medicinesSection}>
                <span className={styles.medicineHead}>
                  Country Available in
                </span>
                <span className={styles.medicineText}>
                  India, United Arab Emirates
                </span>
              </div>

              <div className={styles.medicinesSection}>
                <span className={styles.medicineHead}>
                  Minimum Purchase Unit
                </span>
                <span className={styles.medicineText}>20000</span>
              </div>
            </div>
            <div className={styles.mainPurchaseSection}>
              <button
                className={styles.PurcahseButton}
                onClick={() => setModalIsOpen(true)}
              >
                View Purchase Invoice
              </button>
            </div>
          </div>
        </div>

        {/* End Secondar Market section */}
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
              {productDetail?.general?.countryOfOrigin && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Country of origin</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.countryOfOrigin}
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
              {productDetail?.general?.model && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Part/Model Number</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.model}
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
              {productDetail?.general?.weight && (
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Weight</span>
                  <span className={styles.medicineText}>
                    {productDetail?.general?.weight}{" "}
                    {productDetail?.general?.unit}
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
          </div>
        </div>

        {/* End general information section */}

        {/* Start product description */}
        {productDetail?.general?.description && (
          <div className={styles.mainContainer}>
            <div className={styles.manufacturerDescriptionSection}>
              <span className={styles.medicineHead}>Product Description</span>
              <span
                className={styles.medicineContent}
                dangerouslySetInnerHTML={{
                  __html: productDetail?.general?.description,
                }}
              ></span>
            </div>
          </div>
        )}
        {/* End the product description */}

        {/* Start Inventory & Packaging section */}
        <div className={styles.mainContainer}>
          <span className={styles.innerHead}>Inventory & Packaging</span>
          <div className={styles.innerMainSection}>
            <div className={styles.inventorySection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>SKU</span>
                  <span className={styles.medicineText}>
                    SKU1DFGDFGDF346346233
                  </span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Date of Manufacture
                  </span>
                  <span className={styles.medicineText}>03-03-2025</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Stock</span>
                  <span className={styles.medicineText}>Imaging Tools </span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Stocked in Country
                  </span>
                  <span className={styles.medicineText}>India</span>
                </div>
              </div>
            </div>
            <div className={styles.inventorySection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Countries where Stock Trades
                  </span>
                  <span className={styles.medicineHeadings}>Quantity</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    United Arab Emirates
                  </span>
                  <span className={styles.medicineTexts}>112 Pack</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>United Kingdom</span>
                  <span className={styles.medicineTexts}>225 Box</span>
                </div>

                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>China</span>
                  <span className={styles.medicineTexts}>112 Strip</span>
                </div>

                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Pakistan</span>
                  <span className={styles.medicineTexts}>250 Pack</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Inventory & Packaging section */}

        {/* Start the Stocked-in Country section */}
        {productDetail?.inventoryDetails?.stockedInDetails?.length > 0 && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Stocked-in Country</span>
            <div className={styles.innerInventorySection}>
              <div className={styles.inventorySection}>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Country</span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Quantity</span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Package Type</span>
                </div>
              </div>
              {productDetail?.inventoryDetails?.stockedInDetails?.map((ele) => (
                <div className={styles.inventorySection}>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>
                      {ele?.country}
                    </span>
                  </div>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>
                      {ele?.quantity}
                    </span>
                  </div>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>{ele?.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* End the product inventory section */}
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
                      {ele?.country}
                    </span>
                  </div>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>
                      {ele?.quantity}
                    </span>
                  </div>
                  <div className={styles.inventoryContainer}>
                    <span className={styles.inventoryInput}>{ele?.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* End the product inventory section */}

        {/* Start the category details section */}
        {/* Medical Equipment and Devices */}
        {productDetail?.category == "MedicalEquipmentAndDevices" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Medical Equipment and Devices
            </span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Interoperability</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Laser Type</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Cooling System</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Spot Size</span>
                  <span className={styles.medicineText}>25235</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Diagnostic Functions
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Specification</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                  <div className={styles.uploadFileSection}>
                    <div className={styles.uploadFileContainer}>
                      <img src={Doc} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img src={PDF} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image1}
                        alt="Image"
                      />
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img src={Doc} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                  </div>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Performance Testing Report
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                  <div className={styles.uploadFileSection}>
                    <div className={styles.uploadFileContainer}>
                      <img src={Doc} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img src={PDF} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image1}
                        alt="Image"
                      />
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image}
                        alt="Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* End Medical Equipment and Devices */}

        {/* Pharmaceuticals */}
        {productDetail?.category == "Pharmaceuticals" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Pharmaceuticals</span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Generic Name</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Strength</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    OTC Classification
                  </span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Drug Class</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Controlled Substance
                  </span>
                  <span className={styles.medicineText}>25235</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>25235</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Composition/Ingredients
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Formulation</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Purpose</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Drug Administration Route
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Side Effects and Warnings
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Allergens</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* End Pharmaceuticals */}

        {/* Skin, Hair and Cosmetic Supplies */}
        {productDetail?.category == "SkinHairCosmeticSupplies" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Skin, Hair and Cosmetic Supplies{" "}
            </span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>SPF</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Vegan</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Cruelty-Free</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Elasticity</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Dermatologist Tested
                  </span>
                  <span className={styles.medicineText}>Yes</span>
                </div>
                <div className={styles.medicinesFileSection}>
                  <span className={styles.medicineHead}>Upload File</span>
                  <div className={styles.uploadFileSection}>
                    <div className={styles.uploadFileContainer}>
                      <img src={Doc} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img src={PDF} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image1}
                        alt="Image"
                      />
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image}
                        alt="Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Strength</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Controlled Substance
                  </span>
                  <span className={styles.medicineText}>25235</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    OTC Classification
                  </span>
                  <span className={styles.medicineText}>25235</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Adhesiveness</span>
                  <span className={styles.medicineText}>25235</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Thickness</span>
                  <span className={styles.medicineText}>25235</span>
                </div>

                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Pediatrician Recommended
                  </span>
                  <span className={styles.medicineText}>Yes</span>
                </div>
                <div className={styles.medicinesFileSection}>
                  <span className={styles.medicineHead}>Upload File</span>
                  <div className={styles.uploadFileSection}>
                    <div className={styles.uploadFileContainer}>
                      <img src={Doc} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image}
                        alt="Image"
                      />
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img src={PDF} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image1}
                        alt="Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Fragrance</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Formulation</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Composition/Ingredients
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Purpose</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Target Condition</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Drug Administration Route
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Drug Class</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Side Effects and Warnings
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Allergens</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Concentration</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Moisturizers</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Filler Type</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* End Skin, Hair and Cosmetic Supplies */}

        {/* Vital Health and Wellness */}
        {productDetail?.category == "VitalHealthAndWellness" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Vital Health and Wellness</span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Generic Name</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Strength</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Controlled Substance
                  </span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    OTC Classification
                  </span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Vegan</span>
                  <span className={styles.medicineText}>25235</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Cruelty-Free</span>
                  <span className={styles.medicineText}>25235</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Health Benefit</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Composition/Ingredients
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Formulation</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Purpose</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Drug Administration Route
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Drug Class</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Side Effects and Warnings
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Allergens</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Additives & Sweeteners
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Vital Health and Wellness */}

        {/* Medical Consumables and Disposables */}
        {productDetail?.category == "MedicalConsumablesAndDisposables" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Medical Consumables and Disposables
            </span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Thickness</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Powdered</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Material</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Texture</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Sterilized</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Filtration Efficiency
                  </span>
                  <span className={styles.medicineText}>3645</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Breathability</span>
                  <span className={styles.medicineText}>25235</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Layer Count</span>
                  <span className={styles.medicineText}>25235</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Fluid Resistance</span>
                  <span className={styles.medicineText}>25235</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Filtration Type</span>
                  <span className={styles.medicineText}>25235</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Purpose</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Chemical Resistance
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Allergens</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Shape</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Coating</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Medical Consumables and Disposables */}

        {/* Laboratory Supplies */}

        {productDetail?.category == "LaboratorySupplies" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Laboratory Supplies</span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Connectivity</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Physical State</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Hazard Classification
                  </span>
                  <span className={styles.medicineText}>3645</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Magnification Range
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Objective Lenses</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Power Source</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Resolution</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Shape</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Coating</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Purpose</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>CAS Number</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Grade</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Concentration</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Laboratory Supplies */}

        {/* Diagnostic and Monitoring Devices */}

        {productDetail?.category == "DiagnosticAndMonitoringDevices" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Diagnostic and Monitoring Devices
            </span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Measurement Range</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Noise Level</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Usage Rate</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Diagnostic Functions
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Flow Rate</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Concentration</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Maintenance Notes</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Compatible Equipment
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Specification</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                  <div className={styles.uploadFileSection}>
                    <div className={styles.uploadFileContainer}>
                      <img src={Doc} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image}
                        alt="Image"
                      />
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img src={PDF} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image1}
                        alt="Image"
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Performance Testing Report
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974.{" "}
                  </span>
                  <div className={styles.uploadFileSection}>
                    <div className={styles.uploadFileContainer}>
                      <img src={Doc} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image}
                        alt="Image"
                      />
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img src={PDF} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image1}
                        alt="Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Diagnostic and Monitoring Devices */}

        {/* Hospital and Clinic Supplies */}
        {productDetail?.category == "HospitalAndClinicSupplies" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Hospital and Clinic Supplies
            </span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Adhesiveness</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Absorbency</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Thickness</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Powdered</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Material</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Texture</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Sterilized</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Fluid Resistance</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Elasticity</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Purpose</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Chemical Resistance
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Hospital and Clinic Supplies */}

        {/* Orthopedic Supplies */}
        {productDetail?.category == "OrthopedicSupplies" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Orthopedic Supplies</span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Elasticity</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Sterilized</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Absorbency</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Strength</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Moisture Resistance
                  </span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Breathability</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Color Options</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Purpose</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Target Condition</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Coating</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Orthopedic Supplies */}

        {/* Dental Products */}
        {productDetail?.category == "DentalProducts" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Dental Products </span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Product Material</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Usage Rate</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Purpose</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Target Condition</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Maintenance Notes</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Compatible Equipment
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Dental Products */}

        {/* Eye Care Supplies */}

        {productDetail?.category == "EyeCareSupplies" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Eye Care Supplies</span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Diameter</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Frame</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Lens</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Lens Material</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Lens Power</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Base Curve</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Color Options</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Eye Care Supplies */}

        {/* Home Healthcare Products */}
        {productDetail?.category == "HomeHealthcareProducts" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Home Healthcare Products</span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>
                    Max Weight Capacity
                  </span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Grip Type</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Battery Type</span>
                  <span className={styles.medicineText}>21312124</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Battery Size</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>3645</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Color Options</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Foldability</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Locking Mechanism</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Type of Support</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>

              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Flow Rate</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Concentration</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Performance Testing Report
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                  <div className={styles.uploadFileSection}>
                    <div className={styles.uploadFileContainer}>
                      <img src={Doc} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image}
                        alt="Image"
                      />
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img src={PDF} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image1}
                        alt="Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Home Healthcare Products */}

        {/* Alternative Medicines */}

        {productDetail?.category == "AlternativeMedicines" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Alternative Medicines</span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Purpose</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Composition/Ingredients
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Health Claims</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                  <div className={styles.uploadFileSection}>
                    <div className={styles.uploadFileContainer}>
                      <img src={Doc} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image}
                        alt="Image"
                      />
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img src={PDF} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image1}
                        alt="Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Alternative Medicines */}

        {/* Emergency and First Aid Supplies */}
        {productDetail?.category == "EmergencyAndFirstAidSupplies" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Emergency and First Aid Supplies
            </span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Composition/Ingredients
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Product Longevity</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Foldability</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Emergency and First Aid Supplies */}

        {/* Disinfection and Hygiene Supplies */}
        {productDetail?.category == "DisinfectionAndHygieneSupplies" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Disinfection and Hygiene Supplies
            </span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Composition/Ingredients
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Concentration</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Formulation</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Fragrance</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Disinfection and Hygiene Supplies */}

        {/* Nutrition and Dietary Products */}
        {productDetail?.category == "NutritionAndDietaryProducts" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>
              Nutrition and Dietary Products
            </span>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Shelf Life/Expiry</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Vegan</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
              </div>
              <div className={styles.mainSection}>
                <div className={styles.medicinesSection}>
                  <span className={styles.medicineHead}>Dairy Free</span>
                  <span className={styles.medicineText}>Bottle</span>
                </div>
              </div>
            </div>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Flavor Options</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Amino Acid Profile
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Fat Content</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Purpose</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Health Benefit</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Composition/Ingredients
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Additives & Sweeteners
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Nutrition and Dietary Products */}

        {/* Healthcare IT Solutions */}
        {productDetail?.category == "HealthcareITSolutions" && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Healthcare IT Solutions</span>
            <div className={styles.textareaContainer}>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>License</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Scalability Info</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Add-Ons</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>User Access</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Key Features</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>
                    Core Functionalities
                  </span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                </div>
              </div>
              <div className={styles.textareaSection}>
                <div className={styles.textareaInnerSection}>
                  <span className={styles.medicineHead}>Interoperability</span>
                  <span className={styles.medicineContent}>
                    Farmson Pharmaceutical Gujarat Private Limited is a Non-govt
                    company, incorporated on 15 Feb, 1974. It's a private
                    unlisted company and is classified as'company limited by
                    shares'. Company's authorized capital stands at Rs 1000.0
                    lakhs and has 28.863998% paid-up capital which is Rs 288.64
                    lakhs.
                  </span>
                  <div className={styles.uploadFileSection}>
                    <div className={styles.uploadFileContainer}>
                      <img src={Doc} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image}
                        alt="Image"
                      />
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img src={PDF} className={styles.productIcon} alt="Doc" />
                      <a
                        className={styles.additionalLink}
                        href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        dd12-13_0.pdf
                      </a>
                    </div>
                    <div className={styles.uploadFileContainer}>
                      <img
                        className={styles.uploadImage}
                        src={Image1}
                        alt="Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Healthcare IT Solutions */}

        {/* End the category details section */}
        {/* Start Manufacturer section */}
        {(productDetail?.general?.manufacturer ||
          productDetail?.general?.aboutManufacturer ||
          productDetail?.general?.countryOfOrigin) && (
          <div className={styles.mainContainer}>
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
                </div>
              )}
              {productDetail?.general?.aboutManufacturer && (
                <div className={styles.manufacturerDescriptionSection}>
                  <span className={styles.medicineHead}>
                    About Manufacturer
                  </span>
                  <span className={styles.medicineContent}>
                    {productDetail?.general?.aboutManufacturer}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* End Manufacturer section */}
        {/* Start product image section */}
        {productDetail?.general?.image?.length > 0 && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Product Images</span>
            <div className={styles.productImageSection}>
              {productDetail?.general?.image?.map((img) => (
                <div className={styles.imageContainer}>
                  <img
                    className={styles.imageSection}
                    src={
                      productDetail?.bulkUpload
                        ? `${process.env.REACT_APP_SERVER_URL}uploads/products/${img}`
                        : { img }
                    }
                    alt="image"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* End product image section */}
        {/* Start Compliance & Certification Health & Safety */}
        <div className={styles.mainContainer}>
          <span className={styles.innerHead}>
            Compliance & Certification And Health & Safety
          </span>
          <div className={styles.innerComplianceSection}>
            <div className={styles.additionalUploadSection}>
              <span className={styles.medicineHead}>Regulatory Compliance</span>
              <div className={styles.additionalImageSection}>
                <div className={styles.additionalInnerImage}>
                  <img src={PDF} className={styles.complianceIcon} alt="PDF" />
                  <a
                    className={styles.additionalLink}
                    href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dd12-13_0.pdf
                  </a>
                </div>
                <div className={styles.additionalInnerImage}>
                  <img
                    src={Image1}
                    className={styles.complianceImage}
                    alt="PDF"
                  />
                </div>
                <div className={styles.additionalInnerImage}>
                  <img src={Doc} className={styles.complianceIcon} alt="Doc" />
                  <a
                    className={styles.additionalLink}
                    href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dd12-13_0.pdf
                  </a>
                </div>
                <div className={styles.additionalInnerImage}>
                  <img
                    src={Image}
                    className={styles.complianceImage}
                    alt="PDF"
                  />
                </div>
              </div>
            </div>
            <div className={styles.additionalUploadSection}>
              <span className={styles.medicineHead}>Safety Datasheet</span>
              <div className={styles.additionalImageSection}>
                <div className={styles.additionalInnerImage}>
                  <img src={PDF} className={styles.complianceIcon} alt="PDF" />
                  <a
                    className={styles.additionalLink}
                    href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dd12-13_0.pdf
                  </a>
                </div>
                <div className={styles.additionalInnerImage}>
                  <img
                    src={Image1}
                    className={styles.complianceImage}
                    alt="PDF"
                  />
                </div>
                <div className={styles.additionalInnerImage}>
                  <img src={Doc} className={styles.complianceIcon} alt="Doc" />
                  <a
                    className={styles.additionalLink}
                    href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dd12-13_0.pdf
                  </a>
                </div>
                <div className={styles.additionalInnerImage}>
                  <img
                    src={Image}
                    className={styles.complianceImage}
                    alt="PDF"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className={styles.innerComplianceSection}
            style={{ marginTop: "20px" }}
          >
            <div className={styles.additionalUploadSection}>
              <span className={styles.medicineHead}>Health Hazard Rating</span>
              <div className={styles.additionalImageSection}>
                <div className={styles.additionalInnerImage}>
                  <img src={PDF} className={styles.complianceIcon} alt="PDF" />
                  <a
                    className={styles.additionalLink}
                    href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dd12-13_0.pdf
                  </a>
                </div>
                <div className={styles.additionalInnerImage}>
                  <img
                    src={Image1}
                    className={styles.complianceImage}
                    alt="PDF"
                  />
                </div>
                <div className={styles.additionalInnerImage}>
                  <img src={Doc} className={styles.complianceIcon} alt="Doc" />
                  <a
                    className={styles.additionalLink}
                    href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dd12-13_0.pdf
                  </a>
                </div>
                <div className={styles.additionalInnerImage}>
                  <img
                    src={Image}
                    className={styles.complianceImage}
                    alt="PDF"
                  />
                </div>
              </div>
            </div>
            <div className={styles.additionalUploadSection}>
              <span className={styles.medicineHead}>Environmental Impact</span>
              <div className={styles.additionalImageSection}>
                <div className={styles.additionalInnerImage}>
                  <img src={PDF} className={styles.complianceIcon} alt="PDF" />
                  <a
                    className={styles.additionalLink}
                    href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dd12-13_0.pdf
                  </a>
                </div>
                <div className={styles.additionalInnerImage}>
                  <img
                    src={Image1}
                    className={styles.complianceImage}
                    alt="PDF"
                  />
                </div>
                <div className={styles.additionalInnerImage}>
                  <img src={Doc} className={styles.complianceIcon} alt="Doc" />
                  <a
                    className={styles.additionalLink}
                    href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dd12-13_0.pdf
                  </a>
                </div>
                <div className={styles.additionalInnerImage}>
                  <img
                    src={Image}
                    className={styles.complianceImage}
                    alt="PDF"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Compliance & Certification Health & Safety */}

        {/* Start Additional information */}
        <div className={styles.addtionalContainer}>
          <span className={styles.innerHead}>
            Storage & Handling And Additional Information{" "}
          </span>
          <div className={styles.manufacturerMainContainer}>
            <div className={styles.additionalSection}>
              <div className={styles.additionalInnerSection}>
                <span className={styles.medicineHead}>Storage Conditions</span>
                <span className={styles.medicineText}>24 Months</span>
              </div>
              <div className={styles.additionalInnerSection}>
                <span className={styles.medicineHead}>Warranty</span>
                <span className={styles.medicineText}>24 Months</span>
              </div>
            </div>
            <div className={styles.manufacturerDescriptionSection}>
              <span className={styles.medicineHead}>Other Information</span>
              <span className={styles.medicineContent}>
                A pharmaceutical refers to a substance used for diagnosing,
                treating, preventing, or curing diseases, encompassing a wide
                range of medicines from simple pain relievers to complex
                biological treatments like vaccines; essentially, any drug that
                is manufactured and regulated for medical use, with the
                pharmaceutical industry
              </span>
            </div>
            <div className={styles.additionalUploadSection}>
              <div className={styles.additionalUploadSection}>
                <span className={styles.medicineHead}>User Guidelines</span>
                <div className={styles.additionalImageSection}>
                  <div className={styles.additionalInnerImage}>
                    <img
                      src={PDF}
                      className={styles.complianceIcon}
                      alt="PDF"
                    />
                    <a
                      className={styles.additionalLink}
                      href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      dd12-13_0.pdf
                    </a>
                  </div>
                  <div className={styles.additionalInnerImage}>
                    <img
                      src={Image1}
                      className={styles.complianceImage}
                      alt="PDF"
                    />
                  </div>
                  <div className={styles.additionalInnerImage}>
                    <img
                      src={Doc}
                      className={styles.complianceIcon}
                      alt="Doc"
                    />
                    <a
                      className={styles.additionalLink}
                      href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      dd12-13_0.pdf
                    </a>
                  </div>
                  <div className={styles.additionalInnerImage}>
                    <img
                      src={Image}
                      className={styles.complianceImage}
                      alt="PDF"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* End Additional information */}
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
            <img className={styles.closeImg} src={CloseIcon} alt="clsoeIcon" />
          </div>

          {/* PDF display using iframe */}
          <iframe
            src={pdfUrl}
            className={styles.pdfIframe}
            title="Purchase Invoice"
          ></iframe>
        </Modal>
      </div>
    </div>
  );
};

export default ProductDetails;
