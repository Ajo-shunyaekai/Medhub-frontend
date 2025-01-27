import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { FaFilePdf, FaFileWord } from 'react-icons/fa';
import { Link } from "react-router-dom";
const Profile = () => {
  const [buyerData, setBuyerData] = useState(null);

  // Fetching data from sessionStorage
  useEffect(() => {
    const buyerId = sessionStorage.getItem("buyer_id");
    const buyerName = sessionStorage.getItem("buyer_name");
    const buyerType = sessionStorage.getItem("buyer_type");
    const buyerEmail = sessionStorage.getItem("buyer_email");
    const buyerMobileCode = sessionStorage.getItem("buyer_country_code");
    const buyerMobile = sessionStorage.getItem("buyer_mobile");
    const buyerAddress = sessionStorage.getItem("buyer_address");

    const buyerlocality = sessionStorage.getItem("locality");
    const buyerLandMark = sessionStorage.getItem("land_mark");
    const buyerCity = sessionStorage.getItem("city");
    const buyerState = sessionStorage.getItem("state");
    const buyerCountry = sessionStorage.getItem("country");
    const buyerPincode = sessionStorage.getItem("pincode");
    const buyerDescription = sessionStorage.getItem("description");
    const buyerContactMobileCode = sessionStorage.getItem("contact_person_country_code");
    const buyerPersonEmail = sessionStorage.getItem("contact_person_email");
    const buyerPersonMobile = sessionStorage.getItem("contact_person_mobile");
    const buyerContactPerson = sessionStorage.getItem("contact_person_name");
    const buyerDesignation = sessionStorage.getItem("designation");
    const buyerCountryOperation = sessionStorage.getItem("country_of_operation");
    const buyerCountryOrigin = sessionStorage.getItem("country_of_origin");
    const buyerInterested = sessionStorage.getItem("interested_in");
    const buyerLicenseNo = sessionStorage.getItem("license_no");
    const buyerLicenseDate = sessionStorage.getItem("license_expiry_date");
    const buyerPurchaseValue = sessionStorage.getItem("approx_yearly_purchase_value");
    const buyerRegistration = sessionStorage.getItem("registration_no");
    const buyerVAT = sessionStorage.getItem("vat_reg_no");
    const buyerTaxNo = sessionStorage.getItem("tax_no");
    const buyerActivityCode = sessionStorage.getItem("activity_code");

    // Start the buyer another list
    const buyerCertificateImage = sessionStorage.getItem("certificate_image");
    const buyerImage = sessionStorage.getItem("buyer_image");
    const buyerLicenseImage = sessionStorage.getItem("license_image");
    const buyerTaxImage = sessionStorage.getItem("tax_image");
    const buyerMedicalImage = sessionStorage.getItem("medical_certificate");


    if (buyerId) {
      setBuyerData({
        buyerId,
        buyerName,
        buyerEmail,
        buyerMobileCode,
        buyerMobile,
        buyerAddress,
        buyerType,
        buyerDescription,
        buyerContactMobileCode,
        buyerPersonEmail,
        buyerPersonMobile,
        buyerContactPerson,
        buyerDesignation,
        buyerCountryOperation,
        buyerCountryOrigin,
        buyerInterested,
        buyerLicenseNo,
        buyerLicenseDate,
        buyerPurchaseValue,
        buyerRegistration,
        buyerVAT,
        buyerTaxNo,
        buyerlocality,
        buyerLandMark,
        buyerCity,
        buyerState,
        buyerCountry,
        buyerPincode,
        buyerActivityCode,
        buyerCertificateImage,
        buyerImage,
        buyerLicenseImage,
        buyerTaxImage,
        buyerMedicalImage
      });
    }
  }, []);
  const extractFileName = (url) => (url ? url.split("/").pop() : "Unknown");
  const renderFiles = (files, type) => {
    if (!Array.isArray(files)) {
      if (!files || files === "") {
        return <div>No files available</div>;
      }
      files = [files];
    }

    return files.map((file, index) => {
      const fileUrl = `${process.env.REACT_APP_SERVER_URL}/uploads/buyer/buyer_images/${file}`;

      if (file.endsWith(".pdf")) {
        return (
          <div key={index} className={styles.pdfSection}>
            <FaFilePdf
              size={50}
              color="red"
              style={{ cursor: "pointer" }}
              onClick={() => window.open(fileUrl, "_blank")}
            />
            <div
              className={styles.fileName}
              onClick={() => window.open(fileUrl, "_blank")}
            >
              {extractFileName(file)}
            </div>
          </div>
        );
      } else if (
        file.endsWith(".vnd.openxmlformats-officedocument.wordprocessingml.document") ||
        file.endsWith(".docx")
      ) {
        const docxFileName = file.replace(
          ".vnd.openxmlformats-officedocument.wordprocessingml.document",
          ".docx"
        );
        const docxUrl = `${process.env.REACT_APP_SERVER_URL}/uploads/buyer/buyer_images/${docxFileName}`;

        return (
          <div key={index} className={styles.docxSection}>
            <FaFileWord
              size={50}
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={() => window.open(docxUrl, "_blank")}
            />
            <div
              className={styles.fileName}
              onClick={() => window.open(docxUrl, "_blank")}
            >
              {extractFileName(docxFileName)}
            </div>
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

  if (!buyerData) return <div>Loading...</div>;

  return (

    // Start the Buyer Complete profile code 

    <div className={styles.container}>
      <div className={styles.profileHeadSection}>
        <div className={styles.MainHeading}>Profile</div>
        {/* <Link to='/buyer/edit-profile'>
          <div className={styles.EditButtonSection}>
            <span className={styles.editButton}>Edit</span>
          </div>
        </Link> */}
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.imgSection}>
          {/* Display buyer image */}
          {buyerData.buyerImage && (
            <img
              src={`${process.env.REACT_APP_SERVER_URL}/uploads/buyer/buyer_images/${buyerData.buyerImage}`}
              alt="Buyer Profile"
              className={styles.profileImage}
            />
          )}
        </div>
        <div className={styles.contentSection}>
          <div className={styles.companyNameSection}>
            <span className={styles.mainHead}>{buyerData.buyerName}&nbsp;({buyerData.buyerType})
            </span>
          </div>
          <div className={styles.contentIconSection}>
            <div className={styles.addressSection}>
              <div className={styles.iconSection}>
                <MdOutlineAttachEmail className={styles.icon} />
                <span className={styles.textSection}>{buyerData.buyerEmail}</span>
              </div>
              <div className={styles.iconSection}>
                <LuPhoneCall className={styles.icon} />
                <span className={styles.textSection}>
                  {buyerData.buyerMobileCode} {buyerData.buyerMobile}
                </span>
              </div>
            </div>
            <div className={styles.addressSection}>
              <div className={styles.iconSection}>
                <FaRegAddressCard className={styles.icon} />
                <div className={styles.addressContainers}>
                  <span className={styles.textSection}>{buyerData.buyerAddress || 'Udyog Vihar'}</span>
                  <span className={styles.textSection}>{buyerData.buyerlocality || 'Sectorr 19'}, {buyerData.buyerLandMark || 'Phase 5'}</span>
                  <span className={styles.textSection}>{buyerData.buyerCountry || 'India'}, {buyerData.buyerState || 'Haryana'}, {buyerData.buyerCity || 'Gurgaon'}</span>
                  <span className={styles.textSection}>{buyerData.buyerPincode || '122016'}</span>
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
                <div className={styles.companyHead}>Company Registration No.</div>
                <div className={styles.companyText}>{buyerData.buyerRegistration}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>VAT Registration No.</div>
                <div className={styles.companyText}>{buyerData.buyerVAT}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Sales Person Name</div>
                <div className={styles.companyText}>{buyerData.buyerSalesName || 'Kapil Dev'}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Country of Origin</div>
                <div className={styles.companyText}>{buyerData.buyerCountryOrigin}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Country of Operation</div>
                <div className={styles.companyText}>{buyerData.buyerCountryOperation}</div>
              </div>
            </div>
            <div className={styles.companyInnerContainer}>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Company License No.</div>
                <div className={styles.companyText}>{buyerData.buyerLicenseNo}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>License Expiry/ Renewal Date</div>
                <div className={styles.companyText}>{buyerData.buyerLicenseDate}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Company Tax No.</div>
                <div className={styles.companyText}>{buyerData.buyerTaxNo}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Approx. Yearly Purchase Value</div>
                <div className={styles.companyText}>{buyerData.buyerPurchaseValue}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Interested In</div>
                <div className={styles.companyText}>{buyerData.buyerInterested}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* style the textarea container */}
      <div className={styles.textareaContainer}>
        <div className={styles.companyContainerSection}>
          <div className={styles.textareaHead}>About Company</div>
          <span className={styles.textareaContent}>{buyerData.buyerDescription}</span>
        </div>
      </div>

      <div className={styles.companySection}>
        <div className={styles.companyContainerContactSection}>
          <div className={styles.companyMainHeading}>Contact Details</div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Contact Name</div>
            <div className={styles.companyText}>{buyerData.buyerContactPerson}</div>
          </div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Email ID</div>
            <div className={styles.companyText}>{buyerData.buyerPersonEmail}</div>
          </div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Mobile No.</div>
            <div className={styles.companyText}>{buyerData.buyerContactMobileCode} {buyerData.buyerPersonMobile}</div>
          </div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Designation</div>
            <div className={styles.companyText}>{buyerData.buyerDesignation}</div>
          </div>
        </div>
        <div className={styles.textareaSeaction}>
          <div className={styles.textareaHead}>Business / Trade Activity Code</div>
          <span className={styles.textareaContent}>{buyerData.buyerActivityCode || 'BRT8765123'}</span>
        </div>
      </div>

      {/* style the documents section */}
      <div className={styles.documentContainer}>
        <div className={styles.documentMainHeading}>Documents</div>
        <div className={styles.documentSection}>
          {/* Trade License */}
          <div className={styles.documentInnerSection}>
            <div className={styles.documentDocName}>Trade License</div>
            <div className={styles.documentDocContent}>
              {renderFiles(buyerData?.buyerLicenseImage, "Trade License")}
            </div>
          </div>

          {/* Tax Certificate */}
          <div className={styles.documentInnerSection}>
            <div className={styles.documentDocName}>Tax Certificate</div>
            <div className={styles.documentDocContent}>
              {renderFiles(buyerData?.buyerTaxImage, "Tax Certificate")}
            </div>
          </div>

          {/* Certificate */}
          <div className={styles.documentInnerSection}>
            <div className={styles.documentDocName}>Certificate</div>
            <div className={styles.documentDocContent}>
              {renderFiles(buyerData?.buyerCertificateImage, "Certificate")}
            </div>
          </div>

          {/* Medical Practitioner */}
          <div className={styles.documentInnerSection}>
            <div className={styles.documentDocName}>Medical Practitioner</div>
            <div className={styles.documentDocContent}>
              {renderFiles(buyerData?.buyerMedicalImage, "Medical Practitioner")}
            </div>
          </div>
        </div>
      </div>;
    </div>
  );
};

export default Profile;
