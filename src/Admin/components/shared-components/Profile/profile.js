import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import Loader from "../Loader/Loader";

const Profile = () => {
  const [adminData, setAdminData] = useState(null);

  // Fetching data from sessionStorage
  useEffect(() => {
    const adminId = sessionStorage.getItem("admin_id");
    const adminName = sessionStorage.getItem("user_name");
    const adminEmail = sessionStorage.getItem("email");

    if (adminId) {
      setAdminData({
        adminId,
        adminName,
        adminEmail,
      });
    }
  }, []);

  if (!adminData) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.MainHeading}>Profile</div>
      <div className={styles.profileContainer}>
        <div className={styles.imgSection}>
          {/* Display admin image */}
          {adminData.adminImage && (
            <img
              src={`${process.env.REACT_APP_BASE_URL}/images/${adminData.adminImage}`} // Assuming the image path is provided correctly
              alt="admin Profile"
              className={styles.profileImage}
            />
          )}
        </div>
        <div className={styles.contentSection}>
          <span className={styles.mainHead}>{adminData.adminName}</span>
          <div className={styles.contentIconSection}>
            <div className={styles.iconSection}>
              <MdOutlineAttachEmail className={styles.icon} />
              <span className={styles.textSection}>{adminData.adminEmail}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
