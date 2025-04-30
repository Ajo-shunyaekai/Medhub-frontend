import React, { useState, useEffect } from "react";
import styles from "./logisticsaddress.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  fetchAddressListRedux,
  updateLogisticsAddress,
  deleteAddress,
} from "../../../../../redux/reducers/addressSlice";
import PaginationComponent from "../../../SharedComponents/Pagination/pagination";

const LogisticsAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId, buyerId } = useParams();
  const { address, updatedAddress } = useSelector((state) => state?.addressReducer);
  const [selectedAddress, setSelectedAddress] = useState(updatedAddress?._id || "");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage?.setItem("selectedAddress", JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  const addressesPerPage = 4;
  const indexOfLastAddress = currentPage * addressesPerPage;
  const indexOfFirstAddress = indexOfLastAddress - addressesPerPage;
  const currentAddresses = address?.slice(indexOfFirstAddress, indexOfLastAddress) || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchAddressListRedux(buyerId));
  }, [dispatch, buyerId]);

  const handleChangeAddress = () => {
    const updatedAdd = currentAddresses?.find((add) => add?._id === selectedAddress) || {};
    dispatch(updateLogisticsAddress(updatedAdd));
    navigate(`/buyer/logistics-form/${orderId}/${buyerId}`);
  };

  const handleEdit = () => {
    const updatedAdd = currentAddresses?.find((add) => add?._id === selectedAddress) || {};
    dispatch(updateLogisticsAddress(updatedAdd));
    navigate(`/buyer/edit-new-address/${orderId}/${buyerId}/${selectedAddress}`);
  };

  const handleDeleteAddress = async () => {
    const deleteApi = await dispatch(deleteAddress({ addressId: selectedAddress, userId: buyerId }));
    if (deleteApi.meta.requestStatus === "fulfilled") {
      dispatch(fetchAddressListRedux(buyerId));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerHeadSection}>
        <div className={styles.logisticsHeading}>Address List</div>
        <Link to={`/buyer/add-new-address/${orderId}/${buyerId}`}>
          <div className={styles.innerButtons}>Add New Address</div>
        </Link>
      </div>
      <div className={styles.logisticAddressContainer}>
        {currentAddresses?.map((address) => (
          <div
            key={address._id}
            className={styles.logisticsAddressSection}
            onClick={() => setSelectedAddress(address._id)}
          >
            <div className={styles.logisticsAddressInnerSection}>
              <span className={styles.logisticsAddCheckbox}>
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress === address._id}
                  onChange={() => setSelectedAddress(address._id)}
                />
              </span>
              <div className={styles.pickupInnerContainer}>
                <div className={styles.logisticsAddHeadSection}>
                  <span className={styles.logisticsAddressHead}>
                    {address.isRegistered ? "Registered Address" : "Address"}
                  </span>
                  {selectedAddress === address._id &&
                    address.type !== "Registered" &&
                    address.address_type !== "Registered" && (
                      <div className={styles.actionButtons}>
                        <span className={styles.logisticsAddressButton} onClick={handleEdit}>
                          Edit
                        </span>
                        <RiDeleteBin5Line
                          className={styles.deleteIcon}
                          onClick={handleDeleteAddress}
                        />
                      </div>
                    )}
                </div>
                <span className={styles.pickupText}>
                  {address.full_name}{" "}
                  <span className={styles.pickupAdd}>
                    {address.type || address.address_type}
                  </span>
                </span>
                <span className={styles.pickupText}>
                  {address.company_reg_address}, {address.locality}, {address.locality}
                </span>
                <span className={styles.pickupText}>
                  {address.city}, {address.state}, {address.country}, {address.pincode}
                </span>
                <span className={styles.pickupText}>{address.mobile_number}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PaginationComponent
        activePage={currentPage}
        itemsCountPerPage={addressesPerPage}
        totalItemsCount={address?.length || 0}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />

      <div className={styles["logistic-Button-Section"]}>
        <button className={styles["logistic-submit"]} onClick={handleChangeAddress}>
          Deliver Here
        </button>
        <div
          className={styles["logistic-cancel"]}
          onClick={() => {
            dispatch(updateLogisticsAddress({}));
            navigate(`/buyer/logistics-form/${orderId}/${buyerId}`);
          }}
        >
          Cancel
        </div>
      </div>
    </div>
  );
};

export default LogisticsAddress;