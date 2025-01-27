import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { FaFilePdf, FaFileWord } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Profile = () => {
  const [supplierData, setSupplierData] = useState(null);
  useEffect(() => {
    const supplierId = sessionStorage.getItem("supplier_id");
    const supplierName = sessionStorage.getItem("supplier_name");
    const supplierEmail = sessionStorage.getItem("contact_person_email");
    const supplierMobileCode = sessionStorage.getItem("supplier_country_code");
    const supplierMobile = sessionStorage.getItem("supplier_mobile");
    const supplierAddress = sessionStorage.getItem("supplier_address");
    const supplierImage = sessionStorage.getItem("supplier_image");
    const supplierType = sessionStorage.getItem("supplier_type");
    const supplierPersonCountryCode = sessionStorage.getItem("contact_person_country_code");
    const supplierPersonMobileNo = sessionStorage.getItem("contact_person_mobile_no");
    const supplierPersonName = sessionStorage.getItem("contact_person_name");
    const supplierOperation = sessionStorage.getItem("country_of_operation");
    const supplierOrigin = sessionStorage.getItem("country_of_origin");
    const supplierDesignation = sessionStorage.getItem("designation");
    const supplierLicanseDate = sessionStorage.getItem("license_expiry_date");
    const supplierLicaneseNo = sessionStorage.getItem("license_no");
    const suppliertags = sessionStorage.getItem("tags");
    const supplierTaxNo = sessionStorage.getItem("tax_no");
    const supplierVatRegNo = sessionStorage.getItem("vat_reg_no");
    const supplierRegistrationNo = sessionStorage.getItem("registration_no");
    const supplierDescription = sessionStorage.getItem("description");
    const supplierPaymentTerms = sessionStorage.getItem("payment_terms");
    const supplierSalesName = sessionStorage.getItem("sales_person_name");
    const supplierTaxImage = sessionStorage.getItem("tax_image");
    const supplierLicenseImage = sessionStorage.getItem("license_image");
    const supplierCertificateImage = sessionStorage.getItem("certificate_image");
    const supplierActivityCode = sessionStorage.getItem("activity_code");
    const supplierMedicalImage = sessionStorage.getItem("medical_practitioner_image")

    const supplierLocality = sessionStorage.getItem("locality");
    const supplierLandMark = sessionStorage.getItem("land_mark");
    const supplierCity = sessionStorage.getItem("city");
    const supplierState = sessionStorage.getItem("state");
    const supplierCountry = sessionStorage.getItem("country");
    const supplierPincode = sessionStorage.getItem("pincode")
    

  



    
    if (supplierId) {
      setSupplierData({
        supplierId,
        supplierName,
        supplierEmail,
        supplierMobileCode,
        supplierMobile,
        supplierAddress,
        supplierImage,
        supplierType,
        supplierPersonCountryCode,
        supplierPersonMobileNo,
        supplierSalesName,
        supplierPersonName,
        supplierRegistrationNo,
        supplierOperation,
        supplierOrigin,
        supplierDesignation,
        supplierLicanseDate,
        supplierLicaneseNo,
        suppliertags,
        supplierTaxNo,
        supplierVatRegNo,
        supplierDescription,
        supplierPaymentTerms,
        supplierActivityCode,
        supplierLicenseImage,
        supplierCertificateImage,
        supplierTaxImage,
        supplierMedicalImage,


        supplierLocality,
        supplierLandMark, 
        supplierCity,
        supplierState,
      supplierCountry ,
      supplierPincode
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
      const fileUrl = `${process.env.REACT_APP_SERVER_URL}/uploads/supplier/supplierImage_files/${file}`;

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
        const docxUrl = `${process.env.REACT_APP_SERVER_URL}/uploads/supplier/supplierImage_files/${docxFileName}`;

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

  if (!supplierData) return <div>Loading...</div>;
  return (
    <div className={styles.container}>
      <div className={styles.profileHeadSection}>
        <div className={styles.MainHeading}>Profile</div>
        {/* <Link to='/supplier/edit-profile'>
          <div className={styles.EditButtonSection}>
            <span className={styles.editButton}>Edit</span>
          </div>
        </Link> */}
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.imgSection}>
          {supplierData.supplierImage && (
            <img
              src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplierData.supplierImage}`}
              alt="supplier Profile"
              className={styles.profileImage}
            />
          )}
        </div>
        <div className={styles.contentSection}>
          <div className={styles.companyNameSection}>
            <span className={styles.mainHead}>{supplierData.supplierName}&nbsp;({supplierData.supplierType})
            </span>
          </div>
          <div className={styles.contentIconSection}>
            <div className={styles.addressSection}>
              <div className={styles.iconSection}>
                <MdOutlineAttachEmail className={styles.icon} />
                <span className={styles.textSection}>{supplierData.supplierEmail}</span>
              </div>
              <div className={styles.iconSection}>
                <LuPhoneCall className={styles.icon} />
                <span className={styles.textSection}>
                  {supplierData.supplierMobileCode} {supplierData.supplierMobile}
                </span>
              </div>
            </div>
            <div className={styles.addressSection}>
              <div className={styles.iconSection}>
                <FaRegAddressCard className={styles.icon} />
                <div className={styles.addressContainers}>
                  <span className={styles.textSection}>{supplierData.supplierAddress || 'Udyog Vihar'}</span>
                  <span className={styles.textSection}>{supplierData.supplierLocality || 'Sector 19'} {supplierData.supplierLandMark || 'Phase 5'}</span>
                  <span className={styles.textSection}>{supplierData.supplierCountry} {supplierData.supplierState || 'Haryana'} {supplierData.supplierCity || 'Gurgaon'}</span>
                  <span className={styles.textSection}>{supplierData.supplierPincode || '122016'}</span>      
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
                <div className={styles.companyText}>{supplierData.supplierRegistrationNo}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>VAT Registration No.</div>
                <div className={styles.companyText}>{supplierData.supplierVatRegNo}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Sales Person Name</div>
                <div className={styles.companyText}>{supplierData.supplierSalesName || '-'}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Country of Origin</div>
                <div className={styles.companyText}>{supplierData.supplierOrigin}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Country of Operation</div>
                <div className={styles.companyText}>{supplierData.supplierOperation}</div>
              </div>
            </div>
            <div className={styles.companyInnerContainer}>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Company License No.</div>
                <div className={styles.companyText}>{supplierData.supplierLicaneseNo}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>License Expiry/ Renewal Date</div>
                <div className={styles.companyText}>{supplierData.supplierLicanseDate}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Company Tax No.</div>
                <div className={styles.companyText}>{supplierData.supplierTaxNo}</div>
              </div>
              <div className={styles.companyDetails}>
                <div className={styles.companyHead}>Tags</div>
                <div className={styles.companyText}>{supplierData.suppliertags}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* style the textarea container */}
        <div className={styles.textareaContainer}>
        <div className={styles.textareaSeaction}>
          <div className={styles.textareaHead}>About Company</div>
          <span className={styles.textareaContent}>{supplierData.supplierDescription}</span>
        </div>
        <div className={styles.textareaSeaction}>
          <div className={styles.textareaHead}>Business / Trade Activity Code</div>
          <span className={styles.textareaContent}>{supplierData.supplierActivityCode}</span>
        </div>
      </div>
      <div className={styles.companySection}>
        <div className={styles.companyContainerContactSection}>
          <div className={styles.companyMainHeading}>Contact Details</div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Contact Name</div>
            <div className={styles.companyText}>{supplierData.supplierPersonName}</div>
          </div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Mobile No.</div>
            <div className={styles.companyText}>{supplierData.supplierPersonCountryCode} {supplierData.supplierPersonMobileNo}</div>
          </div>
          <div className={styles.companyDetails}>
            <div className={styles.companyHead}>Designation</div>
            <div className={styles.companyText}>{supplierData.supplierDesignation}</div>
          </div>
        </div>
        <div className={styles.textareaSeaction}>
          <div className={styles.textareaHead}>Payment Terms</div>
          <span className={styles.textareaContent}>{supplierData.supplierPaymentTerms}</span>
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
              {renderFiles(supplierData?.supplierLicenseImage, "Trade License")}
            </div>
          </div>

          {/* Tax Certificate */}
          <div className={styles.documentInnerSection}>
            <div className={styles.documentDocName}>Tax Certificate</div>
            <div className={styles.documentDocContent}>
              {renderFiles(supplierData?.supplierTaxImage, "Tax Certificate")}
            </div>
          </div>

          {/* Certificate */}
          <div className={styles.documentInnerSection}>
            <div className={styles.documentDocName}>Certificate</div>
            <div className={styles.documentDocContent}>
              {renderFiles(supplierData?.supplierCertificateImage, "Certificate")}
            </div>
          </div>

          {/* Medical Practitioner */}
          <div className={styles.documentInnerSection}>
            <div className={styles.documentDocName}>Medical Practitioner</div>
            <div className={styles.documentDocContent}>
              {renderFiles(supplierData?.supplierMedicalImage, "Medical Practitioner")}
            </div>
          </div>
        </div>
      </div>;
    </div>
  );
};

export default Profile;
