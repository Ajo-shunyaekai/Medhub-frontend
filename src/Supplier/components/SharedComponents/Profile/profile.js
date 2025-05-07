import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { RiHonourLine } from "react-icons/ri";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../../../redux/reducers/userDataSlice";
import Loader from "../../SharedComponents/Loader/Loader";

const Profile = () => {
  const { user } = useSelector((state) => state?.userReducer);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const extractFileName = (url) => (url ? url.split("/")?.pop() : "Unknown");

  const renderFiles = (files, type) => {
    // Return null if files are invalid (null, undefined, empty string, or empty array)
    if (!files || files === "" || (Array.isArray(files) && files.length === 0)) {
      return null;
    }

    // Ensure files is an array
    if (!Array.isArray(files)) {
      files = [files];
    }

    return files.map((file, index) => {
      // Skip rendering if file is invalid
      if (!file) return null;

      const fileUrl = `${process.env.REACT_APP_SERVER_URL}/Uploads/supplier/supplier_image_files/${file}`;

      if (file?.endsWith(".pdf")) {
        return (
          <div key={index} className={styles.pdfSection}>
            <FaFilePdf size={50} color="red" style={{ cursor: "pointer" }} />
            <div className={styles.fileName}>{extractFileName(file)}</div>
          </div>
        );
      } else if (
        file?.endsWith(".vnd.openxmlformats-officedocument.wordprocessingml.document") ||
        file?.endsWith(".docx")
      ) {
        const docxFileName = file.replace(
          ".vnd.openxmlformats-officedocument.wordprocessingml.document",
          ".docx"
        );
        return (
          <div key={index} className={styles.docxSection}>
            <FaFileWord size={50} color="blue" style={{ cursor: "pointer" }} />
            <div className={styles.fileName}>{extractFileName(docxFileName)}</div>
          </div>
        );
      } else {
        return (
          <img
            key={index}
            src={fileUrl}
            alt={type}
            className={styles.documentImage}
          />
        );
      }
    });
  };

  // Function to format categories with commas
  const formatCategories = (categories) => {
    if (!categories) return "";
    if (Array.isArray(categories)) {
      return categories.join(", ");
    }
    return categories.split(/[,;]/).map(item => item.trim()).join(", ");
  };

  // Function to format country of operation with commas
  const formatCountryOfOperation = (countries) => {
    if (!countries) return "";
    if (Array.isArray(countries)) {
      return countries.join(", ");
    }
    return countries.split(/[,;]/).map(item => item.trim()).join(", ");
  };

  // Function to format bank details into multiple lines
  const formatBankDetails = (bankDetails) => {
    if (!bankDetails) return [];
    return bankDetails.split(/[,;\n]/).map(item => item.trim()).filter(item => item);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id || localStorage?.getItem("_id")) {
        setLoading(true);
        await dispatch(fetchUserData(id || localStorage?.getItem("_id")));
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);

  if (loading) return <Loader />;

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.profileHeadSection}>
        <div className={styles.MainHeading}>Profile</div>
        <Link
          to={`/supplier/edit-profile/${
            user?._id || localStorage?.getItem("_id")
          }`}
        >
          <div className={styles.EditButtonSection}>
            <span className={styles.editButton}>Edit</span>
          </div>
        </Link>
      </div>
      <div className={styles.profileContainer}>
        {user?.supplier_image && (
          <div className={styles.imgSection}>
            <img
              src={`${process.env.REACT_APP_SERVER_URL}Uploads/supplier/supplier_image_files/${user?.supplier_image}`}
              alt="supplier Profile"
              className={styles.profileImage}
            />
          </div>
        )}
        <div className={styles.contentSection}>
          {(user?.supplier_name || user?.supplier_type) && (
            <div className={styles.companyNameSection}>
              <span className={styles.mainHead}>
                {user?.supplier_name} {user?.supplier_type && `(${user?.supplier_type})`}
              </span>
            </div>
          )}
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
              {user?.contact_person_email && (
                <div className={styles.iconSection}>
                  <MdOutlineAttachEmail className={styles.icon} />
                  <span className={styles.textSection}>{user?.contact_person_email}</span>
                </div>
              )}
              {(user?.supplier_country_code || user?.supplier_mobile) && (
                <div className={styles.iconSection}>
                  <LuPhoneCall className={styles.icon} />
                  <span className={styles.textSection}>
                    {user?.supplier_country_code} {user?.supplier_mobile}
                  </span>
                </div>
              )}
            </div>
            {(user?.registeredAddress?.company_reg_address ||
              user?.supplier_address ||
              user?.registeredAddress?.locality ||
              user?.registeredAddress?.land_mark ||
              user?.registeredAddress?.city ||
              user?.registeredAddress?.state ||
              user?.registeredAddress?.country ||
              user?.registeredAddress?.pincode) && (
              <div className={styles.addressSection}>
                <div className={styles.iconSection}>
                  <FaRegAddressCard className={styles.icon} />
                  <div className={styles.addressContainers}>
                    {(user?.registeredAddress?.company_reg_address ||
                      user?.supplier_address) && (
                      <span className={styles.textSection}>
                        {user?.registeredAddress?.company_reg_address || user?.supplier_address}
                      </span>
                    )}
                    {(user?.registeredAddress?.locality ||
                      user?.registeredAddress?.land_mark) && (
                      <span className={styles.textSection}>
                        {user?.registeredAddress?.locality}{" "}
                        {user?.registeredAddress?.land_mark}
                      </span>
                    )}
                    {(user?.registeredAddress?.city ||
                      user?.registeredAddress?.state ||
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
        </div>
      </div>
      {(user?.registration_no ||
        user?.vat_reg_no ||
        user?.categories ||
        user?.sales_person_name ||
        user?.license_no ||
        user?.country_of_operation ||
        user?.country_of_origin ||
        user?.tags ||
        user?.license_expiry_date) && (
        <div className={styles.companySection}>
          <div className={styles.companyContainerSection}>
            <div className={styles.companyMainHeading}>Company Details</div>
            <div className={styles.companyDetailsSection}>
              <div className={styles.companyInnerContainer}>
                {user?.registration_no && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Company Registration No.</div>
                    <div className={styles.companyText}>{user?.registration_no}</div>
                  </div>
                )}
                {user?.vat_reg_no && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>VAT Registration No.</div>
                    <div className={styles.companyText}>{user?.vat_reg_no}</div>
                  </div>
                )}
                {user?.activity_code && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Business/Trade Activity Code</div>
                    <div className={styles.companyText}>{user?.activity_code}</div>
                  </div>
                )}
                {user?.sales_person_name && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Medhub Global Sales Representative</div>
                    <div className={styles.companyText}>{user?.sales_person_name}</div>
                  </div>
                )}
                {user?.categories && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Categories you Trade In</div>
                    <div className={styles.companyText}>{formatCategories(user?.categories)}</div>
                  </div>
                )}
              </div>
              <div className={styles.companyInnerContainer}>
                {user?.country_of_operation && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Country of Operation</div>
                    <div className={styles.companyText}>{formatCountryOfOperation(user?.country_of_operation)}</div>
                  </div>
                )}
                {user?.country_of_origin && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Country of Origin</div>
                    <div className={styles.companyText}>{user?.country_of_origin}</div>
                  </div>
                )}
                {user?.tags && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Tags</div>
                    <div className={styles.companyText}>{user?.tags}</div>
                  </div>
                )}
                {user?.license_no && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Company License No.</div>
                    <div className={styles.companyText}>{user?.license_no}</div>
                  </div>
                )}
                {user?.license_expiry_date && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>License Expiry/ Renewal Date</div>
                    <div className={styles.companyText}>{user?.license_expiry_date}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {(user?.description || user?.activity_code) && (
        <div className={styles.textareaContainer}>
          {user?.description && (
            <div className={styles.textareaSeaction}>
              <div className={styles.textareaHead}>About Company</div>
              <span className={styles.textareaContent}>{user?.description}</span>
            </div>
          )}
        </div>
      )}
      {(user?.contact_person_name ||
        user?.contact_person_country_code ||
        user?.contact_person_mobile_no ||
        user?.designation ||
        user?.bank_details) && (
        <div className={styles.companySection}>
          <div className={styles.companyContainerContactSection}>
            <div className={styles.companyMainHeading}>Contact Details</div>
            {user?.contact_person_name && (
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Contact Name</div>
                <div className={styles.companyText}>{user?.contact_person_name}</div>
              </div>
            )}
            {(user?.contact_person_country_code || user?.contact_person_mobile_no) && (
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Mobile No.</div>
                <div className={styles.companyText}>
                  {user?.contact_person_country_code} {user?.contact_person_mobile_no}
                </div>
              </div>
            )}
            {user?.designation && (
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Designation</div>
                <div className={styles.companyText}>{user?.designation}</div>
              </div>
            )}
          </div>
          {user?.bank_details && (
            <div className={styles.companyContainerContactSection}>
              <div className={styles.textareaHead}>Bank Details</div>
              <div className={styles.textareaContent}>
                {formatBankDetails(user?.bank_details).map((detail, index) => (
                  <div key={index}>{detail}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {user?.supplier_type !== "Service Provider" &&
        (user?.license_image ||
          user?.tax_image ||
          user?.certificate_image ||
          user?.medical_certificate) && (
          <div className={styles.documentContainer}>
            <div className={styles.documentMainHeading}>Documents</div>
            <div className={styles.documentSection}>
              {user?.license_image && renderFiles(user?.license_image, "Trade License") && (
                <div className={styles.documentInnerSection}>
                  <div className={styles.documentDocName}>Trade License</div>
                  <div className={styles.documentDocContent}>
                    {renderFiles(user?.license_image, "Trade License")}
                  </div>
                </div>
              )}
              {user?.certificate_image && renderFiles(user?.certificate_image, "Certificate") && (
                <div className={styles.documentInnerSection}>
                  <div className={styles.documentDocName}>Certificate</div>
                  <div className={styles.documentDocContent}>
                    {renderFiles(user?.certificate_image, "Certificate")}
                  </div>
                </div>
              )}
              {/* Only render Medical Practitioner section if medical_certificate exists and is valid */}
              {user?.medical_certificate && renderFiles(user?.medical_certificate, "Medical Practitioner") && (
                <div className={styles.documentInnerSection}>
                  <div className={styles.documentDocName}>Medical Practitioner</div>
                  <div className={styles.documentDocContent}>
                    {renderFiles(user?.medical_certificate, "Medical Practitioner")}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default Profile;