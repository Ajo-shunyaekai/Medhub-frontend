import React from 'react'
import styles from './editprofile.module.css'
import { MdOutlineAttachEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import CompanyType from "../../../../assest/Images/companytype.svg"
import CompanyName from "../../../../assest/Images/companyname.svg"

const EditProfileDetails = () => {
  return (
    <div className={styles.editProfileContainer}>
      <div className={styles.editProfileHead}>Profile ID : </div>
      <div className={styles.editProfileSection}>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Date & Time</span>
          <div className={styles.editprofileAddSec}>
          <BsCalendar2Date className={styles.icon} />
          <span className={styles.editProfileInnerText}>12-12-2024  12:54:08</span>
          </div>
        </div>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Buyer Name</span>
          <div className={styles.editprofileAddSec}>
          <img className={styles.editProfileImg} src={CompanyName} alt='Name'/>
          <span className={styles.editProfileInnerText}>Pure Med Pharmaceuticals</span>
          </div>
        </div>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Company Type</span>
          <div className={styles.editprofileAddSec}>
          <img  className={styles.editProfileImg} src={CompanyType} alt='Name'/>
          <span className={styles.editProfileInnerText}>End Users</span>
          </div>
        </div>
      </div>


      <div className={styles.editProfileSection}>
        <div className={styles.editProfileAddressContainer}>
          <div className={styles.editProfileInnerHead}>Contact Details</div>
          <div className={styles.editprofileAddSec}>
            <MdOutlineAttachEmail className={styles.icon} />
            <span className={styles.editProfileInnerText}>Shivanshitripathi82gmail.com</span>
          </div>
          <div className={styles.editprofileAddSec}>
            <LuPhoneCall className={styles.icon} />
            <span className={styles.editProfileInnerText}>+91 6265986969</span>
          </div>
        </div>

        <div className={styles.editProfileAddressContainer}>
        <div className={styles.editProfileInnerHead}>Registered Address</div>
          <div className={styles.editprofileAddSec}>
            <FaRegAddressCard className={styles.icon} />
            <div className={styles.editProfileAddInnerSec}>
            <span className={styles.editProfileInnerText}>476 Udyog Vihar</span>
            <span className={styles.editProfileInnerText}>Gurugram Haryana</span>
            <span className={styles.editProfileInnerText}>India</span>
            <div className={styles.editprofileAddSec}>
            </div>
            </div>
          </div>
        </div>

      </div>
      <div className={styles.editButtonContainer}>
        <button className={styles.editButtonSubmit}>Accept</button>
        <button className={styles.editButtonCancel}>Reject</button>
      </div>

    </div>

  )
}

export default EditProfileDetails