import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import Image from "../../../assets/images/man.png"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../../../redux/reducers/userDataSlice";
import Loader from "../Loader/Loader";

const Profile = () => {
  const { user } = useSelector((state) => state?.userReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

     useEffect(() => {
      const partnerIdSessionStorage = localStorage.getItem("partner_id");
      const partnerIdLocalStorage   = localStorage.getItem("partner_id");
  
      if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
      localStorage.clear();
      navigate("/logistics/login");
      return;
      }
        (id || localStorage?.getItem("_id")) &&
          dispatch(fetchUserData(id || localStorage?.tItem("_id")));
      }, [dispatch, id, localStorage?.getItem("_id")]);

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
          <span className={styles.mainHead}>{user?.company_name}</span>
          <div className={styles.contentIconSection}>
            <div className={styles.iconSection}>
              <MdOutlineAttachEmail className={styles.icon} />
              <span className={styles.textSection}>{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
