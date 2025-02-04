import React, { useState } from "react";
import styles from "./supplierlogistics.module.css"
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { PhoneInput } from "react-international-phone";
const SupplierAddAddress = () => {
    const [addressType, setAddressType] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    const handleChange = (e) => {
        setAddressType(e.target.value);
    };  
    return (
        <div className={styles.container}>
            <div className={styles.logisticsHeading}>Add New Address</div>
        <form className={styles.formLogistics}>
            <div className={styles.formInnerClass}>
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
                                value="factory"
                                onChange={handleChange}
                                checked={addressType === 'factory'}
                            />
                            <label className={styles.formLabel}>Factory</label>
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
            <div className={styles['logistic-Button-Section']}>
                <button type='submit' className={styles['logistic-submit']}>Save Address</button>
                <div className={styles['logistic-cancel']}>Cancel</div>
            </div>
        </form>
        </div>
    )
}

export default SupplierAddAddress