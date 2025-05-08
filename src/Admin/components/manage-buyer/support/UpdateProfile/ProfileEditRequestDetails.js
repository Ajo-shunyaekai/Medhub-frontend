import React, { useEffect } from "react";
import styles from "./editprofile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import CompanyType from "../../../../assets/Images/companytype.svg";
import CompanyName from "../../../../assets/Images/companyname.svg";
import Status from "../../../../assets/Images/StatusIcon.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfileEditReqsDetail,
  updateProfileEditReqsDetail,
} from "../../../../../redux/reducers/adminSlice";
import { formatDate } from "../../../../../utils/dateFormatter";
import Loader from "../../../shared-components/Loader/Loader";
const getFieldValue = (field) => {
  if (!field) return "";
  return typeof field === "object" && field.value !== undefined
    ? field.value
    : field;
};

const isFieldChanged = (field) => {
  return typeof field === "object" && field.isChanged === true;
}

const EditProfileDetails = ({ socket }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileEditReqDetail, loading } = useSelector(
    (state) => state?.adminReducer
  );
  const { user } = useSelector((state) => state?.userReducer);

  const handleAdminAction = async (action) => {
    try {
      const apiPayload = {
        id,
        status: action,
        type: "buyer",
        admin_id: user?.admin_id,
      };
      const updatedProfileRequest = await dispatch(
        updateProfileEditReqsDetail(apiPayload)
      );

      if (updatedProfileRequest.meta.requestStatus === "fulfilled" && socket) {
        socket.emit("updateProfileEditRequest", {
          buyerId: profileEditReqDetail?.user_id,
          message: `Your Profile edit request has been ${action} by the Admin!`,
          link: process.env.REACT_APP_PUBLIC_URL,
        });
        navigate("/admin/buyer-support/edit-profile");
      } else {
        console.error(
          "Failed to update profile request:",
          updatedProfileRequest.error
        );
        alert("Failed to update profile request. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleAdminAction:", error);
      alert("An unexpected error occurred.");
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

  // Handle loading and no-data states
  if (loading) {
    return <Loader/>
  }

  if (!profileEditReqDetail) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className={styles.editProfileContainer}>
      <div className={styles.editProfileHead}>
        Profile ID: {profileEditReqDetail?.user_id}
      </div>
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
          <span className={styles.editProfileInnerHead}>Buyer Name</span>
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
              alt="Type"
            />
            <span className={styles.editProfileInnerText}>
              {profileEditReqDetail?.usertype}
            </span>
          </div>
        </div>
        <div className={styles.editProfileInnerContainer}>
          <span className={styles.editProfileInnerHead}>Status</span>
          <div className={styles.editprofileAddSec}>
            <img className={styles.editProfileImg} src={Status} alt="Status" />
            <span className={styles.editProfileInnerText}>
              {profileEditReqDetail?.editReqStatus || "N/A"}
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
              {getFieldValue(
                profileEditReqDetail?.registeredAddress?.company_reg_address
              ) && (
                <span
                  className={
                    isFieldChanged(
                      profileEditReqDetail?.registeredAddress
                        ?.company_reg_address
                    )
                      ? styles.editProfileInnerTextHighlight
                      : styles.editProfileInnerText
                  }
                >
                  {getFieldValue(
                    profileEditReqDetail?.registeredAddress?.company_reg_address
                  )}
                </span>
              )}
              {getFieldValue(
                profileEditReqDetail?.registeredAddress?.locality
              ) && (
                <span
                  className={
                    isFieldChanged(
                      profileEditReqDetail?.registeredAddress?.locality
                    )
                      ? styles.editProfileInnerTextHighlight
                      : styles.editProfileInnerText
                  }
                >
                  {getFieldValue(
                    profileEditReqDetail?.registeredAddress?.locality
                  )}
                </span>
              )}
              {getFieldValue(
                profileEditReqDetail?.registeredAddress?.land_mark
              ) && (
                <span
                  className={
                    isFieldChanged(
                      profileEditReqDetail?.registeredAddress?.land_mark
                    )
                      ? styles.editProfileInnerTextHighlight
                      : styles.editProfileInnerText
                  }
                >
                  {getFieldValue(
                    profileEditReqDetail?.registeredAddress?.land_mark
                  )}
                </span>
              )}
              {(getFieldValue(profileEditReqDetail?.registeredAddress?.city) ||
                getFieldValue(profileEditReqDetail?.registeredAddress?.state) ||
                getFieldValue(
                  profileEditReqDetail?.registeredAddress?.pincode
                ) ||
                getFieldValue(
                  profileEditReqDetail?.registeredAddress?.country
                )) && (
                <span
                  className={
                    isFieldChanged(
                      profileEditReqDetail?.registeredAddress?.city
                    ) ||
                    isFieldChanged(
                      profileEditReqDetail?.registeredAddress?.state
                    ) ||
                    isFieldChanged(
                      profileEditReqDetail?.registeredAddress?.pincode
                    ) ||
                    isFieldChanged(
                      profileEditReqDetail?.registeredAddress?.country
                    )
                      ? styles.editProfileInnerTextHighlight
                      : styles.editProfileInnerText
                  }
                >
                  {getFieldValue(profileEditReqDetail?.registeredAddress?.city)}
                  {getFieldValue(
                    profileEditReqDetail?.registeredAddress?.city
                  ) && ", "}
                  {getFieldValue(
                    profileEditReqDetail?.registeredAddress?.state
                  )}
                  {getFieldValue(
                    profileEditReqDetail?.registeredAddress?.state
                  ) && " "}
                  {getFieldValue(
                    profileEditReqDetail?.registeredAddress?.pincode
                  )}
                  {getFieldValue(
                    profileEditReqDetail?.registeredAddress?.pincode
                  ) && ", "}
                  {getFieldValue(
                    profileEditReqDetail?.registeredAddress?.country
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {profileEditReqDetail?.editReqStatus === "Pending" && (
        <div className={styles.editButtonContainer}>
          <button
            className={styles.editButtonSubmit}
            onClick={() => handleAdminAction("Approved")}
          >
            Approve
          </button>
          <button
            className={styles.editButtonCancel}
            onClick={() => handleAdminAction("Rejected")}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProfileDetails;
