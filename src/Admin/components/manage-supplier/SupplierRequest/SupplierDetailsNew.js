import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import "../../../assets/style/detailsrequest.css";
import { Modal } from "react-responsive-modal";
import moment from "moment/moment";
import "react-responsive-modal/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import { Link, useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../../../api/Requests";
import { toast } from "react-toastify";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import SupplierCustomModal from "./SupplierCustomModal";
import { apiRequests } from "../../../../api/index";
import {
  extractLast13WithExtension,
  renderFiles,
} from "../../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import RenderFiles from "../../../../Buyer/components/Buy/Details/RenderFiles";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { sendSubscriptionPaymentUrlEmail } from "../../../../redux/reducers/subscriptionSlice";
import NewModal from "../../shared-components/NewModal";

const SupplierDetailsNew = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState();
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const adminIdSessionStorage = localStorage?.getItem("admin_id");
  const adminIdLocalStorage = localStorage?.getItem("admin_id");
  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [salesPersonName, setSalesPersonName] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const { user } = useSelector((state) => state.userReducer);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
  };

  /* handling inner width as per view port */
  const [handleScreeenWidth, setHandleScreenWidth] = useState(
    window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => setHandleScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return window.removeEventListener("resize", handleResize);
  }, []);

  const shouldLineBreak =
    (handleScreeenWidth >= 992 && handleScreeenWidth <= 1080) ||
    (handleScreeenWidth >= 1130 && handleScreeenWidth <= 1220);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleChange = (e) => {
    setSalesPersonName(e.target.value);
  };

  const openModal = (url) => {
    window.open(url, "_blank");
  };

  const closeModal = () => {
    setOpen(false);
    setPdfUrl(null);
  };

  useEffect(() => {
    const getSupplierdetails = async () => {
      if (!adminIdSessionStorage && !adminIdLocalStorage) {
        localStorage?.clear();
        navigate("/admin/login");
        return;
      }

      const obj = {
        admin_id: adminIdSessionStorage || adminIdLocalStorage,
        supplier_id: supplierId,
      };
      try {
        const response = await apiRequests.getRequest(
          `supplier/get-specific-supplier-details/${supplierId}`,
          obj
        );
        if (response?.code !== 200) {
          return;
        }
        setSupplierDetails(response?.result);
        setSalesPersonName(response?.result?.sales_person_name);
      } catch (error) {}
    };
    getSupplierdetails();
  }, [adminIdSessionStorage, adminIdLocalStorage, supplierId, navigate]);

  const handleRejectClick = () => {
    setIsModalOpen(true);
  };
  const handleAcceptReject = (action) => {
    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      supplier_id: supplierId,
      action: action,
      sales_person_name: salesPersonName,
    };
    if (!salesPersonName || salesPersonName === "") {
      toast("Medhub Global Sales Representative is required", {
        type: "error",
      });
      return;
    }

    if (action === "accept") {
      setLoading(true);
    } else if (action === "reject") {
      setRejectLoading(true);
    }

    postRequestWithToken(
      "admin/accept-reject-supplier-registration",
      obj,
      async (response) => {
        if (response?.code === 200) {
          setLoading(false);
          setRejectLoading(false);
          toast(response.message, { type: "success" });
          setTimeout(() => {
            navigate("/admin/supplier-request");
          }, 1000);
        } else {
          setLoading(false);
          toast(response.message, { type: "error" });
        }
      }
    );
  };

  const sendPaymentUrlEmail = async () => {
    setIsOpen(true);
  };

  return (
    <div>
      <div className="buyer-details-container">
        <div className="buyer-details-inner-conatiner">
          <div className="buyer-details-edit-button-container">
            <span className="buyer-details-container-heading">
              Supplier ID: {supplierDetails?.supplier_id}
            </span>
            {supplierDetails?.account_status == 1 ? (
              <>
                <div className="buyer-details-product-list-section">
                  <Link
                    to={`/admin/supplier/${supplierDetails?._id}/products/new`}
                  >
                    <span className="buyer-details-edit-button">
                      Product List
                    </span>
                  </Link>
                  {user?.accessControl?.supplier?.requests?.edit && (
                    <Link
                      to={`/admin/edit-details/supplier/${supplierDetails?._id}`}
                    >
                      <span className="buyer-details-red-button">Edit</span>
                    </Link>
                  )}
                  {user?.accessControl?.supplier?.requests?.edit && (
                    <>
                      <Link
                        onClick={() =>
                          !supplierDetails?.currentSubscription &&
                          sendPaymentUrlEmail()
                        }
                      >
                        <span
                          className={
                            supplierDetails?.currentSubscription
                              ? "buyer-details-green-button"
                              : "buyer-details-red-button"
                          }
                          data-tooltip-id="subscription-tooltip"
                          title={
                            supplierDetails?.currentSubscription
                              ? "Subscribed"
                              : "Send Payment Link"
                          }
                        >
                          {supplierDetails?.currentSubscription
                            ? "Subscribed"
                            : "Send Payment Link"}
                        </span>
                      </Link>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="buyer-details-product-list-section">
                  {user?.accessControl?.supplier?.requests?.edit && (
                    <>
                      <Link onClick={sendPaymentUrlEmail}>
                        <span
                          className={
                            supplierDetails?.currentSubscription
                              ? "buyer-details-green-button"
                              : "buyer-details-red-button"
                          }
                          data-tooltip-id="subscription-tooltip"
                          title={
                            supplierDetails?.currentSubscription
                              ? "Subscribed"
                              : "Send Payment Link"
                          }
                        >
                          {supplierDetails?.currentSubscription
                            ? "Subscribed"
                            : "Send Payment Link"}
                        </span>
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="buyer-details-left-inner-container">
            <div className="buyer-details-left-uppar-section">
              <div className="buyer-details-uppar-main-logo-section">
                <div className="buyer-details-company-logo-container">
                  <div className="buyer-details-company-logo-section">
                    <img
                      src={
                        supplierDetails?.supplier_image[0]?.startsWith("http")
                          ? supplierDetails?.supplier_image[0]
                          : `${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplierDetails?.supplier_image[0]}`
                      }
                      alt="CompanyLogo"
                    />
                  </div>
                </div>
                <div className="buyer-details-uppar-right-main-section">
                  <div className="buyer-details-uppar-main-containers">
                    <div className="buyer-details-left-inner-section">
                      <div className="buyer-details-upper-section-container">
                        <div className="buyer-details-left-uppar-head">
                          {supplierDetails?.supplier_name}
                        </div>
                        <div className="buyer-details-left-link-container">
                          {supplierDetails?.websiteAddress}
                        </div>
                      </div>
                      <div className="buyer-details-left-inner-img-container">
                        <div className="buyer-details-left-inner-mobile-button">
                          <PhoneInTalkOutlinedIcon
                            data-tooltip-id={
                              supplierDetails?.supplier_country_code &&
                              supplierDetails?.supplier_mobile
                                ? "my-tooltip-1"
                                : null
                            }
                            className="buyer-details-left-inner-icon"
                          />
                          {supplierDetails?.supplier_country_code &&
                            supplierDetails?.supplier_mobile && (
                              <ReactTooltip
                                id="my-tooltip-1"
                                place="bottom"
                                effect="solid"
                                content={`${supplierDetails.supplier_country_code} ${supplierDetails.supplier_mobile}`}
                              />
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="buyer-details-uppar-right-container-section">
                    <div className="buyer-details-account-container-section">
                      <div className="newSection">
                        <div className="buyer-details-inner-head-second">
                          Account Status :
                        </div>
                        <div
                          className="buyer-details-button-text"
                          style={{
                            backgroundColor:
                              supplierDetails?.account_status === 0
                                ? "#f4c414"
                                : supplierDetails?.account_status === 1
                                ? "#31c971"
                                : "red",
                          }}
                        >
                          {supplierDetails?.account_status === 0
                            ? "Pending"
                            : supplierDetails?.account_status === 1
                            ? "Active"
                            : "Inactive"}
                        </div>
                      </div>
                      <div className="newSection">
                        <div className="buyer-details-inner-head-second">
                          Account Creation Date :
                        </div>
                        <div className="buyer-details-inner-text">
                          {moment(supplierDetails?.createdAt).format(
                            "DD-MM-YYYY"
                          )}
                        </div>
                      </div>
                      <div className="newSection">
                        <div className="buyer-details-inner-head-second">
                          Company Type:
                        </div>
                        <div className="buyer-details-inner-text">
                          {" "}
                          {supplierDetails?.supplier_type}
                        </div>
                      </div>
                    </div>
                    <div className="buyer-details-company-type-section">
                      <div className="buyer-details-company-type-sec-head">
                        Address:
                      </div>
                      <div className="buyer-details-company-type-sec-text">
                        {supplierDetails?.supplier_address}{" "}
                        {supplierDetails?.registeredAddress?.locality}{" "}
                        {supplierDetails?.registeredAddress?.land_mark}{" "}
                      </div>
                      <div className="buyer-details-company-type-sec-text">
                        {" "}
                        {supplierDetails?.registeredAddress?.country}{" "}
                        {supplierDetails?.registeredAddress?.state}{" "}
                        {supplierDetails?.registeredAddress?.city}{" "}
                        {supplierDetails?.registeredAddress?.pincode}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="buyer-details-bank-container">
              <div className="buyer-details-bank-section">
                <div className="buyer-details-description-head">
                  Description
                </div>
                <div className="buyer-details-description-content">
                  {supplierDetails?.description}
                </div>
              </div>
              <div className="buyer-details-bank-section">
                <div className="buyer-details-description-head">
                  Bank Details
                </div>
                <div className="buyer-details-description-content">
                  {supplierDetails?.bank_details
                    ?.split("\r\n")
                    .map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                </div>
              </div>
            </div>
            <div className="buyers-details-section">
              <div className="buyer-details-inner-left-section">
                <div className="buyer-details-inner-section">
                  <div className="buyer-details-inner-head">
                    Medhub Global Sales Representative :
                    {user?.accessControl?.supplier?.requests?.edit &&
                      supplierDetails?.account_status == 0 && (
                        <FaEdit
                          className="edit-icon"
                          onClick={handleEditClick}
                        />
                      )}
                  </div>
                  <div className="buyer-details-inner-text">
                    {user?.accessControl?.supplier?.requests?.edit &&
                    supplierDetails?.account_status == 0 &&
                    isEditable ? (
                      <input
                        type="text"
                        defaultValue={supplierDetails?.sales_person_name}
                        onChange={handleChange}
                        className="editable-details"
                        placeholder="Medhub Global Sales Representative"
                      />
                    ) : (
                      <span>{supplierDetails?.sales_person_name}</span>
                    )}
                  </div>
                </div>
                <div className="buyer-details-inner-section">
                  <div className="buyer-details-inner-head">
                    Company Registration No. :
                  </div>
                  <div className="buyer-details-inner-text">
                    {supplierDetails?.registration_no}
                  </div>
                </div>
                <div className="buyer-details-inner-section">
                  <div className="buyer-details-inner-head">
                    GST/VAT Registration No :
                  </div>
                  <div className="buyer-details-inner-text">
                    {supplierDetails?.vat_reg_no}
                  </div>
                </div>
                {supplierDetails?.yrFounded && (
                  <div className="buyer-details-inner-section">
                    <div className="buyer-details-inner-head">
                      Year Company Founded :
                    </div>
                    <div className="buyer-details-inner-text">
                      {supplierDetails?.yrFounded}
                    </div>
                  </div>
                )}
                {supplierDetails?.license_no && (
                  <div className="buyer-details-inner-section">
                    <div className="buyer-details-inner-head">
                      License No. :
                    </div>
                    <div className="buyer-details-inner-text">
                      {supplierDetails?.license_no}
                    </div>
                  </div>
                )}
                {supplierDetails?.tags && (
                  <div className="buyer-details-inner-section">
                    <div className="buyer-details-inner-head">Tags :</div>
                    <div className="buyer-details-inner-text">
                      {supplierDetails?.tags}
                    </div>
                  </div>
                )}
                <div className="buyer-details-inner-section">
                  <div className="buyer-details-inner-head">
                    Country of Origin :
                  </div>
                  <div className="buyer-details-inner-text">
                    {supplierDetails?.country_of_origin}
                  </div>
                </div>

                <div className="buyer-details-inner-section">
                  <div className="buyer-details-inner-head">
                    Category you Trade in :
                  </div>
                  <div className="buyer-details-inner-text">
                    {supplierDetails?.categories.length < 6 ? (
                      supplierDetails?.categories.slice(0, 5).join(",")
                    ) : (
                      <>
                        {window.innerWidth < 1380
                          ? supplierDetails?.categories.slice(0, 4).join(",")
                          : supplierDetails?.categories.slice(0, 4).join(",")}
                        <span>{"..."}</span>
                        {shouldLineBreak && <br />}
                        <span className="view-more" id="admin-supplier">
                          View More
                        </span>
                        <Tooltip
                          anchorId="admin-supplier"
                          content={supplierDetails?.categories.join(",")}
                          delayHide={500}
                          place="bottom-start"
                          className="toolTipNew"
                        />
                      </>
                    )}
                  </div>
                </div>

                {supplierDetails?.productsIndicator && (
                  <div className="buyer-details-inner-section">
                  <div className="buyer-details-inner-head">
                    Number of Products :
                  </div>
                  <div className="buyer-details-inner-text">
                    {supplierDetails?.productsIndicator}
                  </div>
                </div>
                )}
              </div>
              <div className="buyer-details-inner-left-section">
                {supplierDetails?.annualTurnover && (
                  <div className="newSection">
                    <div className="newHead">Annual Turnover :</div>
                    <div className="newText">
                      {supplierDetails?.annualTurnover
                        ? `${supplierDetails?.annualTurnover} USD`
                        : "-"}
                    </div>
                  </div>
                )}

                <div className="newSection">
                  <div className="newHead">Business/Trade Activity Code :</div>
                  <div className="newText">
                    {supplierDetails?.activity_code || "-"}
                  </div>
                </div>
                {/* Conditionally render License Expiry Date */}
                {supplierDetails?.license_expiry_date && (
                  <div className="newSection">
                    <div className="newHead">License Expiry Date :</div>
                    <div className="newText">
                      {supplierDetails?.license_expiry_date}
                    </div>
                  </div>
                )}

                <div className="newSection">
                  <div className="newHead">Contact Person Name :</div>
                  <div className="newText">
                    {supplierDetails?.contact_person_name}
                  </div>
                </div>
                <div className="newSection">
                  <div className="newHead">Designation :</div>
                  <div className="newText">{supplierDetails?.designation}</div>
                </div>
                <div className="newSection">
                  <div className="newHead">Email ID :</div>
                  <div className="newText">
                    {supplierDetails?.contact_person_email}
                  </div>
                </div>
                <div className="newSection">
                  <div className="newHead">Mobile No. :</div>
                  <div className="newText">
                    {supplierDetails?.contact_person_country_code}{" "}
                    {supplierDetails?.contact_person_mobile_no}
                  </div>
                </div>

                <div className="newSection">
                  <div className="newHead">Country of Operation :</div>
                  <div className="newText">
                    {supplierDetails?.country_of_operation?.join(", ")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="buyer-details-card-section">
            <div className="buyer-details-uppar-card-section">
              <div className="buyer-details-uppar-card-inner-section">
                {supplierDetails?.supplier_type === "Medical Practitioner" && (
                  <div className="buyer-details-card-container">
                    <div className="buyer-details-company-logo-heading">
                      Medical Practitioner Document
                    </div>
                    <div className="buyer-details-company-img-container">
                      {/* {renderFiles(
                      supplierDetails?.medical_certificate,
                      "medical_practitioner_image"
                    )} */}
                      <RenderFiles
                        files={supplierDetails?.medical_certificate}
                      />
                    </div>
                  </div>
                )}
                {/* Trade License */}
                <div className="buyer-details-card-container">
                  <div className="buyer-details-company-logo-heading">
                    Trade Licensee
                  </div>
                  <div className="buyer-details-company-img-container">
                    {/* {renderFiles(supplierDetails?.license_image, "license_image")} */}
                    <RenderFiles files={supplierDetails?.license_image} />
                  </div>
                </div>
                {/* Certificate */}
                <div className="buyer-details-card-container">
                  <div className="buyer-details-company-logo-heading">
                    Certificate
                  </div>
                  <div className="buyer-details-company-img-container">
                    {/* {renderFiles(
                    supplierDetails?.certificateFileNDate?.length > 0
                      ? supplierDetails?.certificateFileNDate?.map(
                        (ele, index) => ({
                          ...ele,
                          file: ele?.file
                            ? ele?.file
                            : supplierDetails?.certificate_image?.[index],
                        })
                      )
                      : supplierDetails?.certificate_image,
                    "certificate_image",
                    supplierDetails?.certificateFileNDate?.length > 0
                  )} */}
                    {supplierDetails?.certificateFileNDate?.map(
                      (ele, index) => (
                        <div key={index}>
                          <RenderFiles
                            files={[
                              ele?.file ||
                                supplierDetails?.certificate_image?.[index],
                            ]}
                          />
                          {/* {ele?.date && <p>{moment(ele?.date).format("DD MMM YYYY")}</p>} */}
                          {ele?.date && <p>{ele?.date}</p>}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal for PDF viewing */}
            <Modal open={open} onClose={closeModal} center>
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  style={{ width: "500px", height: "500px", border: "none" }}
                  title="PDF Viewer"
                />
              ) : (
                <p>Unable to load the PDF. Check the URL or try again later.</p>
              )}
            </Modal>
          </div>

          {/* product catalogue */}
          {
            supplierDetails?.product_catalogue?.length > 0 && (
              <div className="buyer-details-product-catalogue-card-section">
                <p className="buyer-details-company-logo-heading">Product Catalogue</p>
                <div className="buyer-details-product-catalogue-section">
                  <RenderFiles files={supplierDetails?.product_catalogue}/>
                </div>
              </div>
            )
          }

          <div className="buyer-details-container2">
            {/* Rest of your JSX content */}
            {user?.accessControl?.supplier?.requests?.edit &&
              supplierDetails?.account_status == 0 && (
                <div className="buyer-details-button-containers">
                  <div
                    className="buyer-details-button-accept"
                    onClick={() => handleAcceptReject("accept")}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      "Accept"
                    )}
                  </div>
                  <div
                    className="buyer-details-button-reject"
                    // onClick={handleRejectClick}
                    onClick={() => handleAcceptReject("reject")}
                    disabled={rejectLoading}
                  >
                    {rejectLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      "Reject"
                    )}
                  </div>
                </div>
              )}

            {user?.accessControl?.supplier?.requests?.edit &&
              supplierDetails?.account_status == 0 &&
              isModalOpen && <SupplierCustomModal onClose={closeModal} />}
          </div>
          <div className="buyer-details-container2">
            <NewModal
              isOpen={isOpen}
              onClose={onClose}
              id={supplierId}
              userType={"Supplier"}
            />
          </div>
          <div className="bottomMargin"></div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailsNew;
