import React, { useState, useEffect } from "react";
import styles from "./supplierlogistics.module.css";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { RiDeleteBin5Line } from "react-icons/ri";

const initialAddresses = [
    { id: 1, name: "Shivanshi Tripathi", type: "Warehouse", addressLine1: "476 Udyog Vihar Phase 5", addressLine2: "Sector 19 Near 478", country: "India Haryana Gurugram 456331", isRegistered: true },
    { id: 2, name: "Shivanshi Tripathi", type: "Warehouse", addressLine1: "A-21 Industrial Area", addressLine2: "Near Metro Station", country: "India Delhi 110045", isRegistered: false },
    { id: 3, name: "Rohan Sharma", type: "Office", addressLine1: "789 Business Hub", addressLine2: "Main Road", country: "India Mumbai 400001", isRegistered: false },
    { id: 4, name: "Sanya Mehta", type: "Store", addressLine1: "234 Shopping Plaza", addressLine2: "Park Avenue", country: "India Bangalore 560034", isRegistered: false }
];

const SupplierLogisticsAddress = () => {
    const [selectedAddress, setSelectedAddress] = useState(() => {
        return JSON.parse(localStorage.getItem("selectedAddress")) || null;
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [addresses, setAddresses] = useState(initialAddresses);

    useEffect(() => {
        localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
    }, [selectedAddress]);

    const addressesPerPage = 4;
    const indexOfLastAddress = currentPage * addressesPerPage;
    const indexOfFirstAddress = indexOfLastAddress - addressesPerPage;
    const currentAddresses = addresses.slice(indexOfFirstAddress, indexOfLastAddress);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={styles.container}>
            <div className={styles.innerHeadSection}>
                <div className={styles.logisticsHeading}>Address List</div>
                <Link to='/supplier/add-new-address'>
                    <div className={styles.innerButtons}>Add New Address</div>
                </Link>
            </div>
            <div className={styles.logisticAddressContainer}>
                {currentAddresses.map((address) => (
                    <div key={address.id} className={styles.logisticsAddressSection}>
                        <div className={styles.logisticsAddressInnerSection}>
                            <span className={styles.logisticsAddCheckbox}>
                                <input
                                    type="radio"
                                    name="address"
                                    checked={selectedAddress === address.id}
                                    onChange={() => setSelectedAddress(address.id)}
                                />
                            </span>
                            <div className={styles.pickupInnerContainer}>
                                <div className={styles.logisticsAddHeadSection}>
                                    <span className={styles.logisticsAddressHead}>
                                        {address.isRegistered ? "Registered Address" : "Address"}
                                    </span>
                                    {/* Delete button always visible for non-registered addresses */}
                                    {!address.isRegistered && (
                                        <div className={styles.actionButtons}>
                                            {/* Show edit button only if the address is selected */}
                                            {selectedAddress === address.id && (
                                                <Link to="/supplier/edit-new-address">
                                                    <span className={styles.logisticsAddressButton}>Edit</span>
                                                </Link>
                                            )}
                                            {/* Delete button always visible for non-registered addresses */}
                                            <RiDeleteBin5Line className={styles.deleteIcon} />
                                        </div>
                                    )}
                                </div>
                                <span className={styles.pickupText}>
                                    {address.name} <span className={styles.pickupAdd}>{address.type}</span>
                                </span>
                                <span className={styles.pickupText}>{address.addressLine1}</span>
                                <span className={styles.pickupText}>{address.addressLine2}</span>
                                <span className={styles.pickupText}>{address.country}</span>
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
                    prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                    nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                    hideFirstLastPages={true}
                />
            </div>

            <div className={styles['logistic-Button-Section']}>
                <button type='submit' className={styles['logistic-submit']}>Deliver Here</button>
                <div className={styles['logistic-cancel']}>Cancel</div>
            </div>
        </div>
    );
};

export default SupplierLogisticsAddress;






















