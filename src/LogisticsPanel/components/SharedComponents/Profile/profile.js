import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import Image from "../../../assest/images/man.png"

const Profile = () => {
  return (
    <div className={styles.container}>
      <div className={styles.MainHeading}>Profile</div>
      <div className={styles.profileContainer}>
        <div className={styles.imgSection}>
            <img
              src={Image}
              alt="admin Profile"
              className={styles.profileImage}
            />
        </div>
        <div className={styles.contentSection}>
          <span className={styles.mainHead}>Shivanshi Tripathi</span>
          <div className={styles.contentIconSection}>
            <div className={styles.iconSection}>
              <MdOutlineAttachEmail className={styles.icon} />
              <span className={styles.textSection}>Shivanshi@shunyaekai.tech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
