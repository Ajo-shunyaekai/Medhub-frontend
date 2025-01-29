import React from 'react'
import styles from './editprofile.module.css'

const EditProfileDetails = () => {
  return (
    <div className={styles.editProfileContainer}>
      <div className={styles.editProfileHead}>Profile ID : </div>
      <div className={styles.editProfileSection}>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Date & Time</span>
          <span className={styles.editProfileInnerText}>12-12-2024  12:54:08</span>
        </div>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Buyer Name</span>
          <span className={styles.editProfileInnerText}>Pure Med Pharmaceuticals</span>
        </div>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Company Type</span>
          <span className={styles.editProfileInnerText}>End Users</span>
        </div>
      </div>


      <div className={styles.editProfileSection}>
        <div className={styles.editProfileAddressContainer}>
          <span className={styles.editProfileInnerHead}>Registered Address</span>
          <span className={styles.editProfileInnerText}>476 Udyog Vihar</span>
          <span className={styles.editProfileInnerText}>Gurugram Haryana</span>
          <span className={styles.editProfileInnerText}>India</span>
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