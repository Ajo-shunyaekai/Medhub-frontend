import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../../../redux/reducers/userDataSlice";
import Loader from "../Loader/Loader";
import {
  extractLast13WithExtension,
  renderFiles,
  renderFiles2,
} from "../../../../utils/helper";

const Profile = () => {
  const { user } = useSelector((state) => state?.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const documentsArray = [
    { headings: "Trade License", keyword: "license_image" },
    { headings: "Tax Certificate", keyword: "tax_image" },
    { headings: "Certificate", keyword: "certificate_image" },
    {
      headings: "Medical Practitioner",
      keyword: "medical_certificate",
    },
  ];

  useEffect(() => {
    (id || localStorage?.getItem("_id")) &&
      dispatch(fetchUserData(id || localStorage?.getItem("_id")));
  }, [dispatch, id, localStorage?.getItem("_id")]);

  if (!user) return <Loader />;

  return (
    // Start the Buyer Complete profile code

    <div className={styles.container}>
      <div className={styles.profileHeadSection}>
        <div className={styles.MainHeading}>Profile</div>
        <Link to={`/buyer/edit-profile/${localStorage?.getItem("_id")}`}>
          <div className={styles.EditButtonSection}>
            <span className={styles.editButton}>Edit</span>
          </div>
        </Link>
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.imgSection}>
          {/* Display buyer image */}
          {user?.buyer_image?.[0] && (
            <img
              src={
                user?.buyer_image?.[0]?.startsWith("http")
                  ? user?.buyer_image?.[0]
                  : `${process.env.REACT_APP_SERVER_URL}/uploads/buyer/buyer_images/${user?.buyer_image?.[0]}`
              }
              alt="Buyer Profile"
              className={styles.profileImage}
            />
          )}
        </div>
        <div className={styles.contentSection}>
          <div className={styles.companyNameSection}>
            <span className={styles.mainHead}>
              {user?.buyer_name}&nbsp;({user?.buyer_type || "N/A"})
            </span>
          </div>
          <div className={styles.contentIconSection}>
            <div className={styles.addressSection}>
              <div className={styles.iconSection}>
                <MdOutlineAttachEmail className={styles.icon} />
                <span className={styles.textSection}>
                  {user?.buyer_email || "N/A"}
                </span>
              </div>
              <div className={styles.iconSection}>
                <LuPhoneCall className={styles.icon} />
                <span className={styles.textSection}>
                  {user?.buyer_country_code} {user?.buyer_mobile}
                </span>
              </div>
            </div>
            <div className={styles.addressSection}>
              <div className={styles.iconSection}>
                <FaRegAddressCard className={styles.icon} />
                <div className={styles.addressContainers}>
                  {(user?.registeredAddress?.company_reg_address ||
                    user?.buyer_address) && (
                    <span className={styles.textSection}>
                      {user?.registeredAddress?.company_reg_address ||
                        user?.buyer_address ||
                        ""}
                    </span>
                  )}
                  {(user?.registeredAddress?.locality ||
                    user?.registeredAddress?.land_mark) && (
                    <span className={styles.textSection}>
                      {user?.registeredAddress?.locality || ""}{" "}
                      {user?.registeredAddress?.land_mark || ""}
                    </span>
                  )}
                  {(user?.registeredAddress?.state ||
                    user?.registeredAddress?.city ||
                    user?.registeredAddress?.country) && (
                    <span className={styles.textSection}>
                      {user?.registeredAddress?.city || ""}{" "}
                      {user?.registeredAddress?.state || ""}{" "}
                      {user?.registeredAddress?.country || ""}
                    </span>
                  )}
                  {user?.registeredAddress?.pincode && (
                    <span className={styles.textSection}>
                      {user?.registeredAddress?.pincode || ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* style the company container*/}
      <div className={styles.companySection}>
        <div className={styles.companyContainerSection}>
          <div className={styles.companyMainHeading}>Company Details</div>
          <div className={styles.companyDetailsSection}>
            <div className={styles.companyInnerContainer}>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>
                  Company Registration No.
                </div>
                <div className={styles.companyText}>
                  {user?.registration_no || "N/A"}
                </div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>VAT Registration No.</div>
                <div className={styles.companyText}>
                  {user?.vat_reg_no || "N/A"}
                </div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Sales Person Name</div>
                <div className={styles.companyText}>
                  {user?.buyerSalesName || "N/A"}
                </div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Country of Origin</div>
                <div className={styles.companyText}>
                  {user?.country_of_origin || "N/A"}
                </div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Country of Operation</div>
                <div className={styles.companyText}>
                  {user?.country_of_operation || "N/A"}
                </div>
              </div>
            </div>
            <div className={styles.companyInnerContainer}>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Company License No.</div>
                <div className={styles.companyText}>
                  {user?.license_no || "N/A"}
                </div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>
                  License Expiry/ Renewal Date
                </div>
                <div className={styles.companyText}>
                  {user?.license_expiry_date || "N/A"}
                </div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Company Tax No.</div>
                <div className={styles.companyText}>
                  {user?.tax_no || "N/A"}
                </div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>
                  Approx. Yearly Purchase Value
                </div>
                <div className={styles.companyText}>
                  {user?.approx_yearly_purchase_value || "N/A"}
                </div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Interested In</div>
                <div className={styles.companyText}>
                  {user?.interested_in || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* style the textarea container */}
      <div className={styles.textareaContainer}>
        <div className={styles.companyContainerSection}>
          <div className={styles.textareaHead}>About Company</div>
          <span className={styles.textareaContent}>
            {user?.description || "N/A"}
          </span>
        </div>
      </div>
      <div className={styles.companySection}>
        <div className={styles.companyContainerContactSection}>
          <div className={styles.companyMainHeading}>Contact Details</div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Contact Name</div>
            <div className={styles.companyText}>
              {user?.contact_person_name || "N/A"}
            </div>
          </div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Email ID</div>
            <div className={styles.companyText}>
              {user?.contact_person_email || "N/A"}
            </div>
          </div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Mobile No.</div>
            <div className={styles.companyText}>
              {user?.contact_person_country_code} {user?.contact_person_mobile}
            </div>
          </div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Designation</div>
            <div className={styles.companyText}>
              {user?.designation || "N/A"}
            </div>
          </div>
        </div>
        <div className={styles.textareaSeaction}>
          <div className={styles.textareaHead}>
            Business/Trade Activity Code
          </div>
          <span className={styles.textareaContent}>
            {user?.activity_code || "N/A"}
          </span>
        </div>
      </div>
      {/* style the documents section */}
      <div className={styles.documentContainer}>
        <div className={styles.documentMainHeading}>Documents</div>
        <div className={styles.documentSection}>
          {documentsArray?.map(
            (ele, index) =>
              user?.[ele?.keyword]?.length > 0 && (
                <div className={styles.documentInnerSection}>
                  <div className={styles.documentDocName}>{ele?.headings}</div>
                  <div className={styles.documentDocContent}>
                    {renderFiles2(user?.[ele?.keyword], ele?.headings, styles)}
                    {ele?.headings == "Certificate" &&
                      user?.certificateFileNDate?.[index]?.date && (
                        <p>{user?.certificateFileNDate?.[index]?.date}</p>
                      )}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      ;
    </div>
  );
};

export default Profile;
