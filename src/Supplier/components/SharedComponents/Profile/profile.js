import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";

const Profile = () => {
  const [supplierData, setSupplierData] = useState(null);

  // Fetching data from sessionStoragen
  useEffect(() => {
    const supplierId = sessionStorage.getItem("supplier_id");
    const supplierName = sessionStorage.getItem("supplier_name");
    const supplierEmail = sessionStorage.getItem("supplier_email");
    const supplierMobileCode = sessionStorage.getItem("supplier_country_code");
    const supplierMobile = sessionStorage.getItem("supplier_mobile");
    const supplierAddress = sessionStorage.getItem("supplier_address");
    const supplierImage = sessionStorage.getItem("supplier_image"); 
    const supplierType = sessionStorage.getItem("supplier_type");

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
      });
    }
  }, []);

  if (!supplierData) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.MainHeading}>Profile</div>
      <div className={styles.profileContainer}>
        <div className={styles.imgSection}>
          {/* Display supplier image */}
          {supplierData.supplierImage && (
            <img
              src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplierData.supplierImage}`} // Assuming the image path is provided correctly
              alt="supplier Profile"
              className={styles.profileImage}
            />
          )}
        </div>
        <div className={styles.contentSection}>
          <span className={styles.mainHead}>{supplierData.supplierName}&nbsp;({supplierData.supplierType})</span>
          <div className={styles.contentIconSection}>
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
          <div className={styles.iconSection}>
            <FaRegAddressCard className={styles.icon} />
            <span className={styles.textSection}>{supplierData.supplierAddress}</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
