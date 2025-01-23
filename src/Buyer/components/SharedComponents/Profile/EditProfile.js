import React, { useState, useEffect } from 'react';
import styles from './profile.module.css'
import Select from 'react-select';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Country, State, City } from "country-state-city";

const EditProfile = () => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        setSelectedState(null);
        setSelectedCity(null);

        if (!selectedOption) {
            setErrors((prevState) => ({
                ...prevState,
                country: "Country is required",
            }));
        } else {
            setErrors((prevState) => ({ ...prevState, country: "" }));
            setFormData({ ...formData, country: selectedOption });
        }
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        setSelectedCity(null);

        if (!selectedOption) {
            setErrors((prevState) => ({
                ...prevState,
                state: "State is required",
            }));
        } else {
            setErrors((prevState) => ({ ...prevState, state: "" }));
            setFormData({ ...formData, state: selectedOption });
        }
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);

        if (!selectedOption) {
            setErrors((prevState) => ({
                ...prevState,
                city: "City is required",
            }));
        } else {
            setErrors((prevState) => ({ ...prevState, city: "" }));
            setFormData({ ...formData, city: selectedOption });
        }
    };


    return (
        <div className={styles.editProfileContainer}>
            <span className={styles.editProfileHead}>Edit Profile</span>
            <form className={styles.editForm}>
                <div className={styles.editProfileSection}>
                    <span className={styles.editProfileSubHead}>Contact Details</span>
                    <div className={styles.editProfileInnerSection}>
                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>Contact Name <span className={styles.labelStamp}>*</span> </label>
                            <input className={styles.editInput} type='text' name="contactPersonName" placeholder='Enter Contact Name'></input>
                        </div>
                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>Email<span className={styles.labelStamp}>*</span> </label>
                            <input className={styles.editInput} type='text' name="email" placeholder='Enter Email'></input>
                        </div>
                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>Phone Number<span className={styles.labelStamp}>*</span> </label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="gb"
                                name="mobile"

                            />
                        </div>
                    </div>
                </div>

                <div className={styles.editProfileSection}>
                    <span className={styles.editProfileSubHead}>Password</span>
                    <div className={styles.editProfileInnerSection}>
                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>Old Password<span className={styles.labelStamp}>*</span> </label>
                            <input className={styles.editInput} type='password' placeholder='Enter Old Password'></input>
                        </div>
                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>New Password<span className={styles.labelStamp}>*</span> </label>
                            <input className={styles.editInput} type='password' placeholder='Enter New Password'></input>
                        </div>
                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>Confirm Password<span className={styles.labelStamp}>*</span> </label>
                            <input className={styles.editInput} type='password' placeholder='Enter Confirm Password'></input>
                        </div>
                    </div>
                </div>


                <div className={styles.editProfileSection}>
                    <span className={styles.editProfileSubHead}>Billing Address Details</span>
                    <div className={styles.editProfileInnerSection}>
                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>Company Billing Address<span className={styles.labelStamp}>*</span> </label>
                            <input className={styles.editInput} type='text' name="companyAddress" placeholder='Enter Company Billing Address'></input>
                        </div>
                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>Area/Locality/Road Name<span className={styles.labelStamp}>*</span> </label>
                            <input className={styles.editInput} type='text' name="locality" placeholder='Enter Area/Locality/Road Name'></input>
                        </div>
                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>Landmark</label>
                            <input className={styles.editInput} type='text' name="landMark" placeholder='Enter Landmark'></input>
                        </div>

                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>
                                Country<span className={styles.labelStamp}>*</span>
                            </label>
                            <Select
                                options={Country.getAllCountries()}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.isoCode}
                                value={selectedCountry}
                                onChange={handleCountryChange}
                                placeholder="Select Country"
                            />
                            {errors.country && <span className={styles.error}>{errors.country}</span>}
                        </div>

                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>
                                State<span className={styles.labelStamp}>*</span>
                            </label>
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
                                onChange={handleStateChange}
                                placeholder="Select State"
                                
                            />
                            {errors.state && <span className={styles.error}>{errors.state}</span>}
                        </div>

                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>
                                City<span className={styles.labelStamp}>*</span>
                            </label>
                            <Select
                                options={
                                    selectedState && selectedState.isoCode !== "OTHER"
                                        ? [
                                            ...City.getCitiesOfState(
                                                selectedState.countryCode,
                                                selectedState.isoCode
                                            ),
                                            { name: "Other" },
                                        ]
                                        : [{ name: "Other" }]
                                }
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.name}
                                value={selectedCity}
                                onChange={handleCityChange}
                                placeholder="Select City"
                               
                            />
                            {errors.city && <span className={styles.error}>{errors.city}</span>}
                        </div>
                        <div className={styles.editSubSection}>
                            <label className={styles.editLabel}>Pincode</label>
                            <input className={styles.editInput} type='text' name="pincode" placeholder='Enter Pincode'></input>
                        </div>
                    </div>
                </div>


                <div className={styles.editButtonSection}>
                    <button className={styles.editSubmit}>Submit</button>
                    <button className={styles.editCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default EditProfile