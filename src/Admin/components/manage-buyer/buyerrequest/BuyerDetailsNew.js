import React, { useEffect, useState } from "react";
import "../../../assets/style/detailsrequest.css";
import { Modal } from "react-responsive-modal";
import moment from "moment/moment";
import { FaEdit } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-responsive-modal/styles.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import { Link, useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../../../api/Requests";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api/index";
import {
  extractLast13WithExtension,
  renderFiles,
} from "../../../../utils/helper";
import { useSelector } from "react-redux";
import RenderFiles from '../../../../Buyer/components/Buy/Details/RenderFiles'

const BuyerDetailsNew = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { buyerId } = useParams();
  const navigate = useNavigate();
  const adminIdSessionStorage = localStorage?.getItem("admin_id");
  const adminIdLocalStorage = localStorage?.getItem("admin_id");
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [salesPersonName, setSalesPersonName] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const { user } = useSelector((state) => state.userReducer);

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

  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [buyerDetails, setBuyerDetails] = useState();

  useEffect(() => {
    const getBuyerDetails = async () => {
      if (!adminIdSessionStorage && !adminIdLocalStorage) {
        localStorage?.clear();
        navigate("/admin/login");
        return;
      }
      const obj = {
        admin_id: adminIdSessionStorage || adminIdLocalStorage,
        buyer_id: buyerId,
      };

      try {
        const response = await apiRequests.getRequest(
          `buyer/get-specific-buyer-details/${buyerId}`,
          obj
        );
        if (response?.code !== 200) {
          return;
        }
        setBuyerDetails(response?.result);
        setSalesPersonName(response?.result?.sales_person_name);
      } catch (error) { }
    };
    getBuyerDetails();
  }, []);

  const handleAcceptReject = (action) => {
    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      buyer_id: buyerId,
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
      "admin/accept-reject-buyer-registration",
      obj,
      async (response) => {
        if (response?.code === 200) {
          toast(response.message, { type: "success" });
          setLoading(false);
          setRejectLoading(false);
          setTimeout(() => {
            navigate("/admin/buyer-request");
          }, 500);
        } else {
          setLoading(false);
          setRejectLoading(false);
          toast(response.message, { type: "error" });
        }
      }
    );
  };
  const handleRejectClick = () => {
    setIsModalOpen(true);
  };
  return (
    <div className="buyer-details-container">
      <div className="buyer-details-inner-conatiner">
        <div className="buyer-details-edit-button-container">
          <div className="buyer-details-container-heading">
            Buyer ID: {buyerDetails?.buyer_id}
          </div>
          {user?.accessControl?.buyer?.requests?.edit &&
            buyerDetails?.account_status == 1 && (
              <>
                <Link to={`/admin/edit-details/buyer/${buyerDetails?._id}`}>
                  <span className="buyer-details-edit-button">Edit</span>
                </Link>
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
                      buyerDetails?.buyer_image[0]?.startsWith("http")
                        ? buyerDetails?.buyer_image[0]
                        : `${process.env.REACT_APP_SERVER_URL}uploads/buyer/buyer_images/${buyerDetails?.buyer_image[0]}`
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
                        {buyerDetails?.buyer_name}
                      </div>
                      <div className="buyer-details-left-link-container">
                        {buyerDetails?.websiteAddress}
                      </div>
                    </div>
                    <div className="buyer-details-left-inner-img-container">
                      <div className="buyer-details-left-inner-mobile-button">
                        <PhoneInTalkOutlinedIcon
                          data-tooltip-id={
                            buyerDetails?.buyer_country_code &&
                              buyerDetails?.buyer_mobile
                              ? "my-tooltip-1"
                              : null
                          }
                          className="buyer-details-left-inner-icon"
                        />
                        {buyerDetails?.buyer_country_code &&
                          buyerDetails?.buyer_mobile && (
                            <ReactTooltip
                              id="my-tooltip-1"
                              place="bottom"
                              effect="solid"
                              content={`${buyerDetails.buyer_country_code} ${buyerDetails.buyer_mobile}`}
                            />
                          )}
                      </div>
                      <div className="buyer-details-left-inner-email-button">
                        <a
                          href={`mailto:${buyerDetails?.contact_person_email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MailOutlineIcon
                            data-tooltip-id={
                              buyerDetails?.contact_person_email
                                ? "my-tooltip-2"
                                : null
                            }
                            className="buyer-details-left-inner-icon"
                          />
                        </a>
                        {buyerDetails?.contact_person_email && (
                          <ReactTooltip
                            id="my-tooltip-2"
                            place="bottom"
                            effect="solid"
                            content={buyerDetails.contact_person_email}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="buyer-details-uppar-right-container-section">
                  <div className="buyer-details-account-container-section">
                    <div className="buyer-details-inner-section">
                      <div className="buyer-details-inner-head">
                        Account Status :
                      </div>
                      <div
                        className="buyer-details-button-text"
                        style={{
                          backgroundColor:
                            buyerDetails?.account_status === 0
                              ? "orange"
                              : buyerDetails?.account_status === 1
                                ? "green"
                                : "red",
                        }}
                      >
                        {buyerDetails?.account_status === 0
                          ? "Pending"
                          : buyerDetails?.account_status === 1
                            ? "Active"
                            : "Inactive"}
                      </div>
                    </div>
                    <div className="buyer-details-inner-section">
                      <div className="buyer-details-inner-head">
                        Account Creation Date :
                      </div>
                      <div className="buyer-details-inner-text">
                        {moment(buyerDetails?.createdAt).format("DD-MM-YYYY")}
                      </div>
                    </div>
                    <div className="buyer-details-inner-section">
                      <div className="buyer-details-inner-head">
                        Company Type:
                      </div>
                      <div className="buyer-details-inner-text">
                        {buyerDetails?.buyer_type}
                      </div>
                    </div>
                  </div>
                  <div className="buyer-details-company-type-section">
                    <div className="buyer-details-company-type-sec-head">
                      Address:
                    </div>
                    <div className="buyer-details-company-type-sec-text">
                      {buyerDetails?.buyer_address}{" "}
                      {buyerDetails?.registeredAddress?.locality}
                    </div>
                    <div className="buyer-details-company-type-sec-text">
                      {buyerDetails?.registeredAddress?.land_mark || ""}{" "}
                      {buyerDetails?.registeredAddress?.country}{" "}
                      {buyerDetails?.registeredAddress?.state || ""}{" "}
                      {buyerDetails?.registeredAddress?.city || ""}
                    </div>
                    <div className="buyer-details-company-type-sec-text">
                      {buyerDetails?.registeredAddress?.pincode || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="buyer-details-description-section">
            <div className="buyer-details-description-head">Description</div>
            <div className="buyer-details-description-content">
              {buyerDetails?.description}
            </div>
          </div>
          <div className="buyers-details-section">
            <div className="buyer-details-inner-left-section">
              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">
                  Medhub Global Sales Representative :
                  {user?.accessControl?.buyer?.requests?.edit &&
                    buyerDetails?.account_status == 0 && (
                      <FaEdit className="edit-icon" onClick={handleEditClick} />
                    )}
                </div>
                <div className="buyer-details-inner-text">
                  {user?.accessControl?.buyer?.requests?.edit &&
                    buyerDetails?.account_status == 0 &&
                    isEditable ? (
                    <input
                      type="text"
                      defaultValue={buyerDetails?.sales_person_name}
                      onChange={handleChange}
                      className="editable-details"
                      placeholder="Medhub Global Sales Representative"
                    />
                  ) : (
                    <span>{buyerDetails?.sales_person_name}</span>
                  )}
                </div>
              </div>
              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">
                  Company Registartion No. :
                </div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.registration_no}
                </div>
              </div>
              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">
                  GST/VAT Registration No. :
                </div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.vat_reg_no}
                </div>
              </div>
               {buyerDetails?.license_no && (
                <div className="buyer-details-inner-section">
                  <div className="buyer-details-inner-head">
                    License No. :
                  </div>
                  <div className="buyer-details-inner-text">
                    {buyerDetails.license_no}
                  </div>
                </div>


              )}

               {buyerDetails?.yrFounded && (
                <div className="buyer-details-inner-section">
                  <div className="buyer-details-inner-head">
                    Year Company Founded :
                  </div>
                  <div className="buyer-details-inner-text">
                    {buyerDetails.yrFounded}
                  </div>
                </div>


              )}
              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">
                  Approx. Yearly Purchase Value:
                </div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.approx_yearly_purchase_value}
                </div>
              </div>
              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">
                  Country of Origin :
                </div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.country_of_origin}
                </div>
              </div>


              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">Interested In :</div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.interested_in?.join(", ")}
                </div>
              </div>
            </div>
            <div className="buyer-details-inner-left-section">
            <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">
                Year Company Founded :
                </div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.yrFounded ? buyerDetails?.yrFounded : '-'}
                </div>
              </div>
            <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">
                  Annual Turnover :
                </div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.annualTurnover ? `${buyerDetails?.annualTurnover} USD` : '-'}
                </div>
              </div>
              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">
                  Business/Trade Activity Code :
                </div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.activity_code || "-"}
                </div>
              </div>


              {buyerDetails?.annualTurnover && (
                <div className="buyer-details-inner-section">
                  <div className="buyer-details-inner-head">
                    Annual Turnover :
                  </div>
                  <div className="buyer-details-inner-text">
                    {buyerDetails.annualTurnover}
                  </div>
                </div>
              )}

              {buyerDetails?.license_expiry_date && (
                <div className="buyer-details-inner-section">
                  <div className="buyer-details-inner-head">
                    License Expiry Date :
                  </div>
                  <div className="buyer-details-inner-text">
                    {buyerDetails.license_expiry_date}
                  </div>
                </div>
              )}
              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">Contact Name :</div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.contact_person_name}
                </div>
              </div>
              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">Designation :</div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.designation}
                </div>
              </div>
              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">Email ID :</div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.contact_person_email}
                </div>
              </div>
              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">Mobile No. :</div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.contact_person_country_code}{" "}
                  {buyerDetails?.contact_person_mobile}
                </div>
              </div>

              <div className="buyer-details-inner-section">
                <div className="buyer-details-inner-head">
                  Country of Operation :
                </div>
                <div className="buyer-details-inner-text">
                  {buyerDetails?.country_of_operation?.join(", ")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="buyer-details-card-section">
          <div className="buyer-details-uppar-card-section">
            <div className="buyer-details-uppar-card-inner-section">
              {buyerDetails?.buyer_type === "Medical Practitioner" && (
                <div className="buyer-details-card-container">
                  <div className="buyer-details-company-logo-heading">
                    Medical Practitioner Document
                  </div>
                  <div className="buyer-details-company-img-container">
                    {/* {renderFiles(
                      buyerDetails?.medical_certificate,
                      "medical_practitioner_images"
                    )} */}
                    <RenderFiles files={buyerDetails?.medical_certificate} />
                  </div>
                </div>
              )}
              <div className="buyer-details-card-container">
                <div className="buyer-details-company-logo-heading">
                  Trade License
                </div>
                <div className="buyer-details-company-img-container">
                  {/* {renderFiles(buyerDetails?.license_image, "license_images")} */}
                  <RenderFiles files={buyerDetails?.license_image} />
                </div>
              </div>
              <div className="buyer-details-card-container">
                <div className="buyer-details-company-logo-heading">
                  Certificate
                </div>
                <div className="buyer-details-company-img-container">
                  {/* {renderFiles(
                    buyerDetails?.certificateFileNDate?.length > 0
                      ? buyerDetails?.certificateFileNDate?.map(
                        (ele, index) => ({
                          ...ele,
                          file: ele?.file
                            ? ele?.file
                            : buyerDetails?.certificate_image?.[index],
                        })
                      )
                      : buyerDetails?.certificate_image,
                    "certificate_images",
                    buyerDetails?.certificateFileNDate?.length > 0
                  )} */}

                  {buyerDetails?.certificateFileNDate?.map((ele, index) => (
                    <div key={index}>
                      <RenderFiles files={[ele?.file || buyerDetails?.certificate_image?.[index]]} />
                      {/* {ele?.date && <p>{moment(ele?.date).format("DD MMM YYYY")}</p>} */}
                      {ele?.date && <p>{ele?.date}</p>}
                    </div>
                  ))}
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

        <div className="buyer-details-container2">
          {user?.accessControl?.buyer?.requests?.edit &&
            buyerDetails?.account_status == 0 && (
              <div className="buyer-details-button-containers">
                <div
                  className="buyer-details-button-accept"
                  onClick={() => handleAcceptReject("accept")}
                  disabled={loading}
                >
                  {loading ? <div className="loading-spinner"></div> : "Accept"}
                </div>
                <div
                  className="buyer-details-button-reject"
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
          {/* 
          {user?.accessControl?.buyer?.requests?.edit && buyerDetails?.account_status == 0 && isModalOpen && (
            <BuyerCustomModal onClose={closeModal} />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default BuyerDetailsNew;
