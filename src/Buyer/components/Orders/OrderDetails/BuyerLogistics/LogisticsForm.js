import React, { useState } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { PhoneInput } from "react-international-phone";
import styles from "./logistics.module.css";
import { Link } from "react-router-dom";
const LogisticsForm = () => {
    const [addressType, setAddressType] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selected, setSelected] = useState(true);
    const handleChange = (e) => {
        setAddressType(e.target.value);
    };
    const handleChanges = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            // Add the service to the state
            setSelectedServices((prev) => [...prev, value]);
        } else {
            // Remove the service from the state
            setSelectedServices((prev) =>
                prev.filter((service) => service !== value)
            );
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.logisticsHeading}>Book Logistics</div>

            <form className={styles.formLogistics}>
                <div className={styles.formInnerClass}>
                    <div className={styles.innerHeading}>Drop Details</div>
                    <div className={styles.checkboxSection}>
                        <input type="checkbox" id="termsCheckbox" className={styles.checkboxInput} />
                        <label htmlFor="termsCheckbox" className={styles.checkboxLabel}>
                            Same as registered address
                        </label>
                    </div>
                    <div className={styles['inner-container']}>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Full Name<span className={styles.labelstamp}>*</span></label>

                            <input
                                className={styles.formInput}
                                type="text"
                                placeholder="Enter your full name"
                                autoComplete="off"
                            />

                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Mobile Number<span className={styles.labelstamp}>*</span></label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name="contact"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Address<span className={styles.labelstamp}>*</span></label>
                            <input
                                className={styles.formInput}
                                type="text"
                                placeholder="House No, Building, Street, Area"
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Locality/Town<span className={styles.labelstamp}>*</span></label>
                            <input
                                className={styles.formInput}
                                type="text"
                                placeholder="Road Name, Area, Colony"
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Landmark</label>
                            <input
                                className={styles.formInput}
                                type="text"
                                placeholder="Enter Landmark"
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Country<span className={styles.labelstamp}>*</span></label>
                            <Select
                                options={Country.getAllCountries()}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.isoCode}
                                value={selectedCountry}
                                onChange={(option) => {
                                    setSelectedCountry(option);
                                    setSelectedState(null);
                                    setSelectedCity(null);
                                }}
                                placeholder="Select Country"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>State</label>
                            <Select
                                options={
                                    selectedCountry
                                        ? [
                                            ...State.getStatesOfCountry(selectedCountry.isoCode),
                                            { name: "Other", isoCode: "OTHER" },
                                        ]
                                        : []
                                }
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.isoCode}
                                value={selectedState}
                                onChange={(option) => {
                                    setSelectedState(option);
                                    setSelectedCity(null);
                                }}
                                placeholder="Select State"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>City</label>
                            <Select
                                options={
                                    selectedState && selectedState.isoCode !== "OTHER"
                                        ? [
                                            ...City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode),
                                            { name: "Other" },
                                        ]
                                        : [{ name: "Other" }]
                                }
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.name}
                                value={selectedCity}
                                onChange={setSelectedCity}
                                placeholder="Select City"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Pincode</label>
                            <input
                                className={styles.formInput}
                                type="text"
                                placeholder="Enter your pincode"
                                autoComplete="off"
                            />
                        </div>

                    </div>

                    <div className={styles.addressContainer}>
                        <div className={styles.innerHeading}>Type of Address<span className={styles.labelstamp}>*</span></div>
                        <div className={styles.radioInnerContainer}>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="warehouse"
                                    onChange={handleChange}
                                    checked={addressType === 'warehouse'}
                                />
                                <label className={styles.formLabel}>Warehouse</label>
                            </div>
                            <div className={styles.radioGroup}>

                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="shop"
                                    onChange={handleChange}
                                    checked={addressType === 'shop'}
                                />
                                <label className={styles.formLabel}>Shop</label>
                            </div>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="other"
                                    onChange={handleChange}
                                    checked={addressType === 'other'}
                                />
                                <label className={styles.formLabel}>Other</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Start the drop detais section */}

                <div className={styles.cardContainer}>
                    <div className={styles.cardHeadSection}>
                        <span className={styles.cardHeading}>Drop Details</span>
                        <Link to="/buyer/logistics-address">
                            <span className={styles.cardButton}>Change</span>
                        </Link>
                    </div>
                    {/* <label className={styles.radioContainer}> */}
                        {/* <input type="radio" checked={selected} onChange={() => { }} /> */}

                        <div className={styles.cardInnerContainer}>
                            <span className={styles.cardText}>Shivanshi Tripathi
                                <span className={styles.cardType}>Warehouse</span>
                            </span>
                            <span className={styles.cardText}>H No 12 Birlagram Nagda</span>
                            <span className={styles.cardText}>Near Bal Mandir</span>
                            <span className={styles.cardText}>India Madhya Pradesh</span>
                            <span className={styles.cardText}>Nagda 456331</span>
                        </div>
                    {/* </label> */}
                </div>
                {/* End the drop details section */}

                <div className={styles.formInnerClass}>
                    <div className={styles.addressContainer}>
                        <div className={styles.innerHeading}>
                            Mode of Transport<span className={styles.labelstamp}>*</span>
                        </div>
                        <div className={styles.radioInnerContainer}>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="aircargo"
                                    onChange={handleChange}
                                    checked={addressType === "aircargo"}
                                />
                                <label className={styles.radioLabel}>
                                    <span className={styles.radioSpan}>Air Cargo</span>{" "}
                                    <span className={styles.radioText}>
                                        (Fastest Delivery & High Charges)
                                    </span>
                                </label>
                            </div>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="seafreight"
                                    onChange={handleChange}
                                    checked={addressType === "seafreight"}
                                />
                                <label className={styles.radioLabel}>
                                    <span className={styles.radioSpan}> Sea Freight</span>{" "}
                                    <span className={styles.radioText}>
                                        (Faster Delivery & Comparatively Low Charges)
                                    </span>
                                </label>
                            </div>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="roadfreight"
                                    onChange={handleChange}
                                    checked={addressType === "roadfreight"}
                                />
                                <label className={styles.radioLabel}>
                                    <span className={styles.radioSpan}> Road Freight </span>{" "}
                                    <span className={styles.radioText}>
                                        (Delivery & Lower Charges)
                                    </span>
                                </label>
                            </div>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="logistices"
                                    onChange={handleChange}
                                    checked={addressType === "logistices"}
                                />
                                <label className={styles.formLabel}>
                                    Ask the Logistics Partner to Recommend
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.addressContainer}>
                        <div className={styles.innerHeading}>Extra Services</div>
                        <div className={styles.radioInnerContainer}>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="checkbox"
                                    name="extraService"
                                    value="doortodoor"
                                    onChange={handleChanges}
                                    checked={selectedServices.includes("doortodoor")}
                                />
                                <label className={styles.formLabel}>Door to Door</label>
                            </div>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="checkbox"
                                    name="extraService"
                                    value="PorttoPort"
                                    onChange={handleChanges}
                                    checked={selectedServices.includes("PorttoPort")}
                                />
                                <label className={styles.formLabel}>Port to Port</label>
                            </div>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="checkbox"
                                    name="extraService"
                                    value="customclearance"
                                    onChange={handleChanges}
                                    checked={selectedServices.includes("customclearance")}
                                />
                                <label className={styles.formLabel}>Custom Clearance</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles["logistic-Button-Section"]}>
                    <button type="submit" className={styles["logistic-submit"]}>
                        Request Supplier for Further Details
                    </button>
                    <div className={styles["logistic-cancel"]}>Cancel</div>
                </div>
            </form>
        </div>
    );
};

export default LogisticsForm;
