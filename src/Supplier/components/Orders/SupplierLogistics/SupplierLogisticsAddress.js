import React, { useState, useEffect } from "react";
import styles from "./supplierlogistics.module.css";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "react-js-pagination";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  fetchAddressListRedux,
  updateLogisticsAddress,
  deleteAddress,
} from "../../../../redux/reducers/addressSlice";

const initialAddresses = [
  {
    id: 1,
    name: "Shivanshi Tripathi",
    type: "Warehouse",
    addressLine1: "476 Udyog Vihar Phase 5",
    addressLine2: "Sector 19 Near 478",
    country: "India Haryana Gurugram 456331",
    isRegistered: true,
  },
  {
    id: 2,
    name: "Shivanshi Tripathi",
    type: "Warehouse",
    addressLine1: "A-21 Industrial Area",
    addressLine2: "Near Metro Station",
    country: "India Delhi 110045",
    isRegistered: false,
  },
  {
    id: 3,
    name: "Rohan Sharma",
    type: "Office",
    addressLine1: "789 Business Hub",
    addressLine2: "Main Road",
    country: "India Mumbai 400001",
    isRegistered: false,
  },
  {
    id: 4,
    name: "Sanya Mehta",
    type: "Store",
    addressLine1: "234 Shopping Plaza",
    addressLine2: "Park Avenue",
    country: "India Bangalore 560034",
    isRegistered: false,
  },
];

const SupplierLogisticsAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId, supplierId } = useParams();
  const { address, updatedAddress } = useSelector(
    (state) => state?.addressReducer
  );
  const [selectedAddress, setSelectedAddress] = useState(
    updatedAddress?._id || ""
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [addresses, setAddresses] = useState(initialAddresses);

  useEffect(() => {
    localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  const addressesPerPage = 4;
  const indexOfLastAddress = currentPage * addressesPerPage;
  const indexOfFirstAddress = indexOfLastAddress - addressesPerPage;
  const currentAddresses = address?.slice(
    indexOfFirstAddress,
    indexOfLastAddress
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchAddressListRedux(supplierId));
  }, [dispatch]);

  const handleChangeAddress = () => {
    const updatedAdd =
      currentAddresses?.find((add) => add?._id == selectedAddress) || {};
    dispatch(updateLogisticsAddress(updatedAdd));
    // navigate(-1);
    navigate(`/supplier/logistics-form/${orderId}/${supplierId}`)
  };

  const handleEdit = () => {
    const updatedAdd =
      currentAddresses?.find((add) => add?._id == selectedAddress) || {};
    dispatch(updateLogisticsAddress(updatedAdd));
    navigate(`/supplier/edit-new-address/${orderId}/${supplierId}/${selectedAddress}`);
  };

  const handleDeleteAddress = async () => {
    const deleteApi = await dispatch(
      deleteAddress({ addressId: selectedAddress, userId: supplierId })
    );

    if (deleteApi.meta.requestStatus === "fulfilled") {
      dispatch(fetchAddressListRedux(supplierId));
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
        {currentAddresses?.map((address) => (
          <div key={address.id} className={styles.logisticsAddressSection} onClick={() => setSelectedAddress(address._id)} >
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
                  {/* Delete button always visible for non-registered addresses */}
                  {selectedAddress === address._id &&
                    address.type !== "Registered" &&
                    address.address_type !== "Registered" && (
                      <div className={styles.actionButtons}>
                        {/* Show edit button only if the address is selected */}
                        {/* {selectedAddress === address.id && (
                                                <Link to="/supplier/edit-new-address"> */}
                        <span
                          className={styles.logisticsAddressButton}
                          onClick={handleEdit}
                        >
                          Edit
                        </span>
                        {/* </Link>
                                            )} */}
                        {/* Delete button always visible for non-registered addresses */}
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
                  {address.company_reg_address}, {address.locality},{" "}
                  {address.locality}
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
        ))}
      </div>

      <div className={styles.pagiContainer}>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={addressesPerPage}
          totalItemsCount={addresses.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
          prevPageText={
            <KeyboardDoubleArrowLeftIcon style={{ fontSize: "15px" }} />
          }
          nextPageText={
            <KeyboardDoubleArrowRightIcon style={{ fontSize: "15px" }} />
          }
          hideFirstLastPages={true}
        />
      </div>

      <div className={styles["logistic-Button-Section"]}>
        <button
          type="submit"
          className={styles["logistic-submit"]}
          onClick={handleChangeAddress}
        >
          Deliver Here
        </button>
        <div
          className={styles["logistic-cancel"]}
          onClick={() => {
            dispatch(updateLogisticsAddress({}));
            // navigate(-1);
            navigate(`/supplier/logistics-form/${orderId}/${supplierId}`)
          }}
        >
          Cancel
        </div>
      </div>
    </div>
  );
};

export default SupplierLogisticsAddress;
