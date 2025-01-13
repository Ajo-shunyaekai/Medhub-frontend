import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";

const Profile = () => {
  const [buyerData, setBuyerData] = useState(null);

  // Fetching data from sessionStorage
  useEffect(() => {
    const buyerId = sessionStorage.getItem("buyer_id");
    const buyerName = sessionStorage.getItem("buyer_name");
    const buyerEmail = sessionStorage.getItem("buyer_email");
    const buyerMobileCode = sessionStorage.getItem("buyer_country_code");
    const buyerMobile = sessionStorage.getItem("buyer_mobile");
    const buyerAddress = sessionStorage.getItem("buyer_address");
    const buyerImage = sessionStorage.getItem("buyer_image"); 
    const buyerType = sessionStorage.getItem("buyer_type");

    if (buyerId) {
      setBuyerData({
        buyerId,
        buyerName,
        buyerEmail,
        buyerMobileCode,
        buyerMobile,
        buyerAddress,
        buyerImage,
        buyerType,
      });
    }
  }, []);

  if (!buyerData) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.MainHeading}>Profile</div>
      <div className={styles.profileContainer}>
        <div className={styles.imgSection}>
          {/* Display buyer image */}
          {buyerData.buyerImage && (
            <img
              src={`${process.env.REACT_APP_SERVER_URL}/uploads/buyer/buyer_images/${buyerData.buyerImage}`} // Assuming the image path is provided correctly
              alt="Buyer Profile"
              className={styles.profileImage}
            />
          )}
        </div>
        <div className={styles.contentSection}>
          <span className={styles.mainHead}>{buyerData.buyerName}&nbsp;({buyerData.buyerType})</span>
          <div className={styles.contentIconSection}>
            <div className={styles.iconSection}>
              <MdOutlineAttachEmail className={styles.icon} />
              <span className={styles.textSection}>{buyerData.buyerEmail}</span>
            </div>
            <div className={styles.iconSection}>
              <LuPhoneCall className={styles.icon} />
              <span className={styles.textSection}>{buyerData.buyerMobileCode} {buyerData.buyerMobile}</span>
            </div>
          </div>
          <div className={styles.iconSection}>
            <FaRegAddressCard className={styles.icon} />
            <span className={styles.textSection}>{buyerData.buyerAddress}</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
