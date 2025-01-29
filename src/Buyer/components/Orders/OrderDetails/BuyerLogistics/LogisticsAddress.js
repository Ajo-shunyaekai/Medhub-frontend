import React, { useState } from "react";
import styles from "./logisticsaddress.module.css";

const LogisticsAddress = () => {
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const addresses = [
        {
            id: 1,
            type: "Registered Address",
            name: "Shivanshi Tripathi",
            addressLine: "C-12 Birlagram Nagda MP (456331)",
            phone: "+91 6265699633",
            addressType: null,
        },
        {
            id: 2,
            type: "Address",
            name: "Shivanshi Tripathi",
            addressLine: "C-12 Birlagram",
            country: "India Nagda MP (456331)",
            phone: "+91 6265699633",
            addressType: "Factory",
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.headSection}>
                <div className={styles.mainHeading}>Book Logistics</div>
                <div className={styles.addressButton}>Add New Address</div>
            </div>
            <div className={styles.addressCardContainer}>
                {addresses.map((address) => (
                    <div key={address.id} className={styles.addressCardSection}>
                        <div className={styles.addressRadioSection}>
                            <input
                                type="radio"
                                name="selectedAddress"
                                value={address.id}
                                checked={selectedAddressId === address.id}
                                onChange={() => setSelectedAddressId(address.id)}
                            />
                        </div>
                        <div className="addressContentSection">
                            <div className={styles.addressCardHead}>{address.type}</div>
                            <div className={styles.addressNameSection}>
                                <span className={styles.addressName}>{address.name}</span>
                                {address.addressType && (
                                    <div className={styles.addressType}>{address.addressType}</div>
                                )}
                            </div>
                            <span className={styles.addressFull}>{address.addressLine}</span>
                            {address.country && (
                                <span className={styles.addressCountry}>{address.country}</span>
                            )}
                            <span className={styles.addressPhone}>{address.phone}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogisticsAddress;
