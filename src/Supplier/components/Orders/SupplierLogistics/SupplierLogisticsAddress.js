import React, { useState, useEffect } from "react";
import styles from "./supplierlogistics.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  fetchAddressListRedux,
  updateLogisticsAddress,
  deleteAddress,
} from "../../../../redux/reducers/addressSlice";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination"; // Import the common pagination component

const SupplierLogisticsAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId, supplierId } = useParams();
  const { address, updatedAddress } = useSelector((state) => state?.addressReducer);
  
  // Initialize state with empty array instead of undefined initialAddresses
  const [selectedAddress, setSelectedAddress] = useState(updatedAddress?._id || "");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  useEffect(() => {
    dispatch(fetchAddressListRedux(supplierId));
  }, [dispatch, supplierId]);

  const addressesPerPage = 4;
  const indexOfLastAddress = currentPage * addressesPerPage;
  const indexOfFirstAddress = indexOfLastAddress - addressesPerPage;
  const currentAddresses = address?.slice(indexOfFirstAddress, indexOfLastAddress) || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChangeAddress = () => {
    const updatedAdd = currentAddresses?.find((add) => add?._id === selectedAddress) || {};
    dispatch(updateLogisticsAddress(updatedAdd));
    navigate(`/supplier/logistics-form/${orderId}/${supplierId}`);
  };

  const handleEdit = () => {
    const updatedAdd = currentAddresses?.find((add) => add?._id === selectedAddress) || {};
    dispatch(updateLogisticsAddress(updatedAdd));
    navigate(`/supplier/edit-new-address/${orderId}/${supplierId}/${selectedAddress}`);
  };

  const handleDeleteAddress = async () => {
    const deleteApi = await dispatch(
      deleteAddress({ addressId: selectedAddress, userId: supplierId })
    );

    if (deleteApi.meta.requestStatus === "fulfilled") {
      dispatch(fetchAddressListRedux(supplierId));
      setSelectedAddress(""); // Clear selection after deletion
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerHeadSection}>
        <div className={styles.logisticsHeading}>Address List</div>
        <Link to={`/supplier/add-new-address/${orderId}/${supplierId}`}>
          <div className={styles.innerButtons}>Add New Address</div>
        </Link>
      </div>
      <div className={styles.logisticAddressContainer}>
        {currentAddresses.length > 0 ? (
          currentAddresses.map((address) => (
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
                          <span
                            className={styles.logisticsAddressButton}
                            onClick={handleEdit}
                          >
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
                    {address.company_reg_address}, {address.locality}
                  </span>
                  <span className={styles.pickupText}>
                    {address.city}, {address.state}, {address.country},{" "}
                    {address.pincode}
                  </span>
                  <span className={styles.pickupText}>
                    {address.mobile_number}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noAddress}>No addresses found</div>
        )}
      </div>

      {address?.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={addressesPerPage}
          totalItemsCount={address.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      )}

      <div className={styles["logistic-Button-Section"]}>
        <button
          type="submit"
          className={styles["logistic-submit"]}
          onClick={handleChangeAddress}
          disabled={!selectedAddress}
        >
          Deliver Here
        </button>
        <div
          className={styles["logistic-cancel"]}
          onClick={() => {
            dispatch(updateLogisticsAddress({}));
            navigate(`/supplier/logistics-form/${orderId}/${supplierId}`);
          }}
        >
          Cancel
        </div>
      </div>
    </div>
  );
};

export default SupplierLogisticsAddress;