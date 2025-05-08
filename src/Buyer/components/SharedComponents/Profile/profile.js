import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { RiHonourLine } from "react-icons/ri";
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

// Utility function to check if a value is valid (not null, undefined, or empty)
const isValid = (value) => {
  if (Array.isArray(value))
    return value.length > 0 && value.some((item) => item);
  if (typeof value === "object" && value !== null)
    return Object.values(value).some((val) => isValid(val));
  return (
    value !== null && value !== undefined && value !== "" && value !== "N/A"
  );
};

// Utility function to check if files are valid
const hasValidFiles = (files) => {
  if (!files) return false;
  if (Array.isArray(files))
    return files.length > 0 && files.some((file) => file);
  return isValid(files);
};

const Profile = () => {
  const { user } = useSelector((state) => state?.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id || localStorage?.getItem("_id")) {
          await dispatch(
            fetchUserData(id || localStorage?.getItem("_id"))
          ).unwrap();
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, id, navigate]);

  if (loading) return <Loader />;

  if (!user) return <div>No user data available</div>;

  // Check if sections have valid data
  const hasCompanyDetails = [
    user?.registration_no,
    user?.vat_reg_no,
    user?.buyerSalesName,
    user?.country_of_origin,
    user?.license_no,
    user?.country_of_operation,
    user?.tax_no,
    user?.approx_yearly_purchase_value,
    user?.interested_in,
    user?.license_expiry_date,
  ].some(isValid);

  const hasContactDetails = [
    user?.contact_person_name,
    user?.contact_person_email,
    user?.contact_person_country_code,
    user?.contact_person_mobile,
    user?.designation,
  ].some(isValid);

  const hasAboutCompany = isValid(user?.description);
  const hasActivityCode = isValid(user?.activity_code);

  const hasDocuments = [
    user?.license_image,
    user?.tax_image,
    user?.certificate_image,
    user?.medical_certificate,
  ].some(hasValidFiles);

  const hasAddressDetails = [
    user?.registeredAddress?.company_reg_address,
    user?.buyer_address,
    user?.registeredAddress?.locality,
    user?.registeredAddress?.land_mark,
    user?.registeredAddress?.state,
    user?.registeredAddress?.city,
    user?.registeredAddress?.country,
    user?.registeredAddress?.pincode,
  ].some(isValid);

  return (
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
        {user?.buyer_image && (
          <div className={styles.imgSection}>
            <img
              src={
                user?.buyer_image?.[0]?.startsWith("http")
                  ? user?.buyer_image?.[0]
                  : `${process.env.REACT_APP_SERVER_URL}/uploads/buyer/buyer_images/${user?.buyer_image?.[0]}`
              }
              alt="Buyer Profile"
              className={styles.profileImage}
            />
          </div>
        )}
        <div className={styles.contentSection}>
          <div className={styles.companyNameSection}>
            <span className={styles.mainHead}>
              {user?.buyer_name} ({user?.buyer_type || "N/A"})
            </span>
          </div>
          {(hasAddressDetails ||
            user?.websiteAddress ||
            user?.buyer_email ||
            user?.buyer_mobile) && (
            <div className={styles.contentIconSection}>
              <div className={styles.addressSection}>
                {user?.websiteAddress && (
                  <div className={styles.iconSection}>
                    <RiHonourLine className={styles.icon} />
                    <span className={styles.textSection}>
                      <a
                        href={user?.websiteAddress}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.textSection}
                      >
                        {user?.websiteAddress}
                      </a>
                    </span>
                  </div>
                )}
                {user?.buyer_email && (
                  <div className={styles.iconSection}>
                    <MdOutlineAttachEmail className={styles.icon} />
                    <span className={styles.textSection}>
                      {user?.buyer_email}
                    </span>
                  </div>
                )}
                {user?.buyer_mobile && (
                  <div className={styles.iconSection}>
                    <LuPhoneCall className={styles.icon} />
                    <span className={styles.textSection}>
                      {user?.buyer_country_code} {user?.buyer_mobile}
                    </span>
                  </div>
                )}
              </div>
              {hasAddressDetails && (
                <div className={styles.addressSection}>
                  <div className={styles.iconSection}>
                    <FaRegAddressCard className={styles.icon} />
                    <div className={styles.addressContainers}>
                      {(user?.registeredAddress?.company_reg_address ||
                        user?.buyer_address) && (
                        <span className={styles.textSection}>
                          {user?.registeredAddress?.company_reg_address ||
                            user?.buyer_address}
                        </span>
                      )}
                      {(user?.registeredAddress?.locality ||
                        user?.registeredAddress?.land_mark) && (
                        <span className={styles.textSection}>
                          {user?.registeredAddress?.locality}{" "}
                          {user?.registeredAddress?.land_mark}
                        </span>
                      )}
                      {(user?.registeredAddress?.state ||
                        user?.registeredAddress?.city ||
                        user?.registeredAddress?.country) && (
                        <span className={styles.textSection}>
                          {user?.registeredAddress?.city}{" "}
                          {user?.registeredAddress?.state}{" "}
                          {user?.registeredAddress?.country}
                        </span>
                      )}
                      {user?.registeredAddress?.pincode && (
                        <span className={styles.textSection}>
                          {user?.registeredAddress?.pincode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {hasCompanyDetails && (
        <div className={styles.companySection}>
          <div className={styles.companyContainerSection}>
            <div className={styles.companyMainHeading}>Company Details</div>
            <div className={styles.companyDetailsSection}>
              <div className={styles.companyInnerContainer}>
                {user?.registration_no && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>
                      Company Registration No.
                    </div>
                    <div className={styles.companyText}>
                      {user?.registration_no}
                    </div>
                  </div>
                )}
                {user?.vat_reg_no && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>
                      GST/VAT Registration No.
                    </div>
                    <div className={styles.companyText}>{user?.vat_reg_no}</div>
                  </div>
                )}
                {user?.sales_person_name && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>
                      Medhub Global Sales Representative
                    </div>
                    <div className={styles.companyText}>
                      {user?.sales_person_name}
                    </div>
                  </div>
                )}
                {user?.country_of_origin && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Country of Origin</div>
                    <div className={styles.companyText}>
                      {user?.country_of_origin}
                    </div>
                  </div>
                )}
                {user?.country_of_operation && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>
                      Country of Operation
                    </div>
                    <div className={styles.companyText}>
                      {user?.country_of_operation}
                    </div>
                  </div>
                )}
                {user?.license_no && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>
                      Company License No.
                    </div>
                    <div className={styles.companyText}>{user?.license_no}</div>
                  </div>
                )}
              </div>
              <div className={styles.companyInnerContainer}>
                {user?.sales_person_name && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>
                      Country of Operation
                    </div>
                    <div className={styles.companyText}>
                      {user?.country_of_operation}
                    </div>
                  </div>
                )}

                {user?.activity_code && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>
                      Business/Trade Activity Code
                    </div>
                    <div className={styles.companyText}>
                      {user?.activity_code}
                    </div>
                  </div>
                )}
                {user?.approx_yearly_purchase_value && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>
                      Approx. Yearly Purchase Value
                    </div>
                    <div className={styles.companyText}>
                      {user?.approx_yearly_purchase_value}
                    </div>
                  </div>
                )}
                {user?.interested_in && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Interested In</div>
                    <div className={styles.companyText}>
                      {user?.interested_in}
                    </div>
                  </div>
                )}
                {user?.license_expiry_date && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>
                      License Expiry/ Renewal Date
                    </div>
                    <div className={styles.companyText}>
                      {user?.license_expiry_date}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {hasAboutCompany && (
        <div className={styles.textareaContainer}>
          <div className={styles.companyContainerSection}>
            <div className={styles.textareaHead}>About Company</div>
            <span className={styles.textareaContent}>{user?.description}</span>
          </div>
        </div>
      )}

      {hasContactDetails && (
        <div className={styles.companySection}>
          <div className={styles.companyContainerSection}>
            <div className={styles.companyMainHeading}>Contact Details</div>
            <div className={styles.companyDetailsSection}>
              <div className={styles.companyInnerContainer}>
                {user?.contact_person_name && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Contact Name</div>
                    <div className={styles.companyText}>
                      {user?.contact_person_name}
                    </div>
                  </div>
                )}
                {user?.contact_person_email && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Email ID</div>
                    <div className={styles.companyText}>
                      {user?.contact_person_email}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.companyInnerContainer}>
                {user?.contact_person_mobile && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Mobile No.</div>
                    <div className={styles.companyText}>
                      {user?.contact_person_country_code}{" "}
                      {user?.contact_person_mobile}
                    </div>
                  </div>
                )}
                {user?.designation && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Designation</div>
                    <div className={styles.companyText}>
                      {user?.designation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {hasActivityCode && (
        <div className={styles.textareaSeaction}>
          <div className={styles.textareaHead}>
            Business/Trade Activity Code
          </div>
          <span className={styles.textareaContent}>{user?.activity_code}</span>
        </div>
      )}
      {/* )} */}
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
    </div>
  );
};

export default Profile;
