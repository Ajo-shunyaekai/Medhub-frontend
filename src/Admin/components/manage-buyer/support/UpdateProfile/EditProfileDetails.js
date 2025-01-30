import React, { useEffect } from "react";
import styles from "./editprofile.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfileEditReqsDetail,
  updateProfileEditReqsDetail,
} from "../../../../../redux/reducers/adminSlice";
import { formatDate } from "../../../../../utils/dateFormatter";
import { toast } from "react-toastify";
 
const EditProfileDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileEditReqDetail, loading } = useSelector(
    (state) => state?.adminReducer
  );
 
  const handleAdminAction = async (action) => {
    // Dispatch the action to update the profile
    const apiPayload = {
      id,
      status: action,
      type: "buyer",
    };
    const updatedProfileRequest = await dispatch(
      updateProfileEditReqsDetail(apiPayload)
    );
 
    // After dispatching, check if the profile update was successful
    if (updatedProfileRequest.meta.requestStatus === "fulfilled") {
      toast.success("Success");
      console.log("Success");
    }
  };
 
  useEffect(() => {
    if (id) {
      dispatch(
        fetchProfileEditReqsDetail(
          `admin/get-profile-edit-request-details/buyer/${id}`
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
          <span className={styles.editProfileInnerText}>
            {formatDate(profileEditReqDetail?.createdAt)}
          </span>
        </div>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Buyer Name</span>
          <span className={styles.editProfileInnerText}>
            {profileEditReqDetail?.name}
          </span>
        </div>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Company Type</span>
          <span className={styles.editProfileInnerText}>
            {profileEditReqDetail?.user_type}
          </span>
        </div>
      </div>
 
      <div className={styles.editProfileSection}>
        <div className={styles.editProfileAddressContainer}>
          <span className={styles.editProfileInnerHead}>
            Registered Address
          </span>
          {profileEditReqDetail?.registeredAddress?.company_reg_address
            ?.value && (
            <span className={styles.editProfileInnerText}>
              {
                profileEditReqDetail?.registeredAddress?.company_reg_address
                  ?.value
              }
            </span>
          )}
          {profileEditReqDetail?.registeredAddress?.locality?.value && (
            <span className={styles.editProfileInnerText}>
              {profileEditReqDetail?.registeredAddress?.locality?.value}
            </span>
          )}
          {(profileEditReqDetail?.registeredAddress?.land_mark?.value ||
            profileEditReqDetail?.registeredAddress?.city?.value ||
            profileEditReqDetail?.registeredAddress?.state?.value ||
            profileEditReqDetail?.registeredAddress?.pincode?.value ||
            profileEditReqDetail?.registeredAddress?.country?.value) && (
            <span className={styles.editProfileInnerText}>
              {profileEditReqDetail?.registeredAddress?.land_mark?.value}{" "}
              {profileEditReqDetail?.registeredAddress?.city?.value}{" "}
              {profileEditReqDetail?.registeredAddress?.state?.value}{" "}
              {profileEditReqDetail?.registeredAddress?.pincode?.value}{" "}
              {profileEditReqDetail?.registeredAddress?.country?.value}
            </span>
          )}
        </div>
      </div>
 
      <div className={styles.editButtonContainer}>
        <button
          className={styles.editButtonSubmit}
          onClick={(e) => handleAdminAction("Approved")}
        >
          Accept
        </button>
        <button
          className={styles.editButtonCancel}
          onClick={(e) => handleAdminAction("Rejected")}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
 
export default EditProfileDetails;