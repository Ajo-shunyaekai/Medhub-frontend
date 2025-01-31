import React, { useEffect } from "react";
import styles from "./editprofile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import CompanyType from "../../../../assest/Images/companytype.svg";
import CompanyName from "../../../../assest/Images/companyname.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfileEditReqsDetail,
  updateProfileEditReqsDetail,
} from "../../../../../redux/reducers/adminSlice";
import { formatDate } from "../../../../../utils/dateFormatter";

const EditProfileDetails = ({ socket }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileEditReqDetail, loading } = useSelector(
    (state) => state?.adminReducer
  );
  const { user } = useSelector((state) => state?.userReducer);

  const handleAdminAction = async (action) => {
    // Dispatch the action to update the profile
    const apiPayload = {
      id,
      status: action,
      type: "supplier",
      admin_id: user?.admin_id,
    };
    const updatedProfileRequest = await dispatch(
      updateProfileEditReqsDetail(apiPayload)
    );

    // After dispatching, check if the profile update was successful
    if (updatedProfileRequest.meta.requestStatus === "fulfilled") {
      socket.emit("updateProfileEditRequest", {
        supplierId: profileEditReqDetail.user_id, // The supplier to be notified
        message: `Your Proile edit request has been ${action} by the Admin!`,
        link: process.env.REACT_APP_PUBLIC_URL,
        // send other details if needed
      });
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(
        fetchProfileEditReqsDetail(
          `admin/get-profile-edit-request-details/supplier/${id}`
        )
      );
    }
  }, [id, dispatch]);

  return (
    <div className={styles.editProfileContainer}>
      <div className={styles.editProfileHead}>Profile ID : </div>
      <div className={styles.editProfileSection}>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Date & Time</span>
          <div className={styles.editprofileAddSec}>
            <BsCalendar2Date className={styles.icon} />
            <span className={styles.editProfileInnerText}>
              {formatDate(profileEditReqDetail?.createdAt)}
            </span>
          </div>
        </div>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Supplier Name</span>
          <div className={styles.editprofileAddSec}>
            <img
              className={styles.editProfileImg}
              src={CompanyName}
              alt="Name"
            />
            <span className={styles.editProfileInnerText}>
              {profileEditReqDetail?.name}
            </span>
          </div>
        </div>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Company Type</span>
          <div className={styles.editprofileAddSec}>
            <img
              className={styles.editProfileImg}
              src={CompanyType}
              alt="Name"
            />
            <span className={styles.editProfileInnerText}>
              {profileEditReqDetail?.user_type}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.editProfileSection}>
        <div className={styles.editProfileAddressContainer}>
          <div className={styles.editProfileInnerHead}>Contact Details</div>
          <div className={styles.editprofileAddSec}>
            <MdOutlineAttachEmail className={styles.icon} />
            <span className={styles.editProfileInnerText}>
              {profileEditReqDetail?.contact_person_email}
            </span>
          </div>
          <div className={styles.editprofileAddSec}>
            <LuPhoneCall className={styles.icon} />
            <span className={styles.editProfileInnerText}>
              {profileEditReqDetail?.contact_person_country_code}{" "}
              {profileEditReqDetail?.contact_person_mobile}
            </span>
          </div>
        </div>

        <div className={styles.editProfileAddressContainer}>
          <div className={styles.editProfileInnerHead}>Registered Address</div>
          <div className={styles.editprofileAddSec}>
            <FaRegAddressCard className={styles.icon} />
            <div className={styles.editProfileAddInnerSec}>
              {profileEditReqDetail?.registeredAddress?.company_reg_address
                ?.value && (
                <span
                  className={
                    profileEditReqDetail?.registeredAddress?.company_reg_address
                      ?.isChanged
                      ? styles.editProfileInnerTextHighlight
                      : styles.editProfileInnerText
                  }
                >
                  {
                    profileEditReqDetail?.registeredAddress?.company_reg_address
                      ?.value
                  }
                </span>
              )}
              {profileEditReqDetail?.registeredAddress?.locality?.value && (
                <span
                  className={
                    profileEditReqDetail?.registeredAddress?.locality?.isChanged
                      ? styles.editProfileInnerTextHighlight
                      : styles.editProfileInnerText
                  }
                >
                  {profileEditReqDetail?.registeredAddress?.locality?.value}
                </span>
              )}
              {profileEditReqDetail?.registeredAddress?.lamd_mark?.value && (
                <span
                  className={
                    profileEditReqDetail?.registeredAddress?.lamd_mark
                      ?.isChanged
                      ? styles.editProfileInnerTextHighlight
                      : styles.editProfileInnerText
                  }
                >
                  {profileEditReqDetail?.registeredAddress?.lamd_mark?.value}
                </span>
              )}
              {(profileEditReqDetail?.registeredAddress?.city?.value ||
                profileEditReqDetail?.registeredAddress?.state?.value ||
                profileEditReqDetail?.registeredAddress?.pincode?.value ||
                profileEditReqDetail?.registeredAddress?.country?.value) && (
                <span
                  className={
                    profileEditReqDetail?.registeredAddress?.city?.isChanged ||
                    profileEditReqDetail?.registeredAddress?.state?.isChanged ||
                    profileEditReqDetail?.registeredAddress?.pincode
                      ?.isChanged ||
                    profileEditReqDetail?.registeredAddress?.country?.isChanged
                      ? styles.editProfileInnerTextHighlight
                      : styles.editProfileInnerText
                  }
                >
                  {profileEditReqDetail?.registeredAddress?.city?.value}{" "}
                  {profileEditReqDetail?.registeredAddress?.state?.value}{" "}
                  {profileEditReqDetail?.registeredAddress?.pincode?.value}{" "}
                  {profileEditReqDetail?.registeredAddress?.country?.value}
                </span>
              )}
              <div className={styles.editprofileAddSec}></div>
            </div>
          </div>
        </div>
      </div>
      {profileEditReqDetail?.editReqStatus == "Pending" ? (
        <div className={styles.editButtonContainer}>
          <button
            className={styles.editButtonSubmit}
            onClick={(e) => handleAdminAction("Approved")}
          >
            Approve
          </button>
          <button
            className={styles.editButtonCancel}
            onClick={(e) => handleAdminAction("Rejected")}
          >
            Reject
          </button>
        </div>
      ) : (
        <div className={styles.editButtonContainer}>
          <button
            className={
              profileEditReqDetail?.editReqStatus == "Approved"
                ? styles.editButtonSubmit
                : styles.editButtonCancel
            }
            onClick={(e) => e.preventDefault()}
          >
            {profileEditReqDetail?.editReqStatus}
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProfileDetails;
