import React, { useState, useRef, useEffect } from 'react';
import styles from '../style/custommodalorder.module.css';
import { PhoneInput  } from 'react-international-phone';
import { parsePhoneNumberFromString, isValidNumber } from 'libphonenumber-js';
import {
    CitySelect,
    CountrySelect,
    StateSelect,
    LanguageSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";


const CustomOrderModal = ({ isOpen, onClose, onSubmit,setLoading,loading,setIsModalOpen }) => {
    const [doorToDoor, setDoorToDoor] = useState(true);
    const [customClearance, setCustomClearance] = useState(false);
    const [transportMode, setTransportMode] = useState('');
    const [dropLocation, setDropLocation] = useState({ name: '', email: '', contact: '', address: '', country: '', cityDistrict: '', state: '', pincode: '' });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const dropdownRef = useRef(null);
    const [companyPhone, setCompanyPhone] = useState('');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    const reset = () => {
        setDoorToDoor(true);
        setCustomClearance(false);
        setTransportMode('');
        setDropLocation({ name: '', contact: '', address: '', cityDistrict: '', state: '', pincode: '' });
        setErrors({});
    };

    const validate = () => {
        const newErrors = {};
        if (!doorToDoor && !customClearance) newErrors.checkboxes = 'Please Select at Least One Option.';
        if (!transportMode) newErrors.transportMode = 'Please Select a Mode of Transport.';
        if (!dropLocation.name) newErrors.name = 'Name is Required.';
        if (!dropLocation.email) newErrors.email = 'Email ID is Required.';
        if (!dropLocation.contact) newErrors.contact = 'Mobile Number is Required.';
        if (!dropLocation.address) newErrors.address = 'Address is Required.';
        if (!dropLocation.country) newErrors.country = 'Country is Required.';
        if (!dropLocation.cityDistrict) newErrors.cityDistrict = 'City is Required.';
        if (!dropLocation.state) newErrors.state = 'State is Required.';
        // if (!dropLocation.pincode) newErrors.pincode = 'Pincode is Required.';
        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Prevent submission if there are validation errors
        }
        onSubmit({ doorToDoor, customClearance, transportMode, dropLocation });
        reset();
        // onClose();
    };

    const handleSelectChange = (value) => {
        setTransportMode(value);
        setDropdownOpen(false);
        setErrors((prevErrors) => ({ ...prevErrors, transportMode: '' }));
    };

    const handleInputChange = (field, value) => {
        setDropLocation((prev) => ({ ...prev, [field]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    };
    const [countryid, setCountryid] = useState(0);
    const [stateid, setstateid] = useState(0);

    const handleCheckboxChange = (checkbox) => {
        if (checkbox === 'doorToDoor') {
            setDoorToDoor(true);
            setCustomClearance(false);
            setErrors((prevErrors) => ({ ...prevErrors, checkboxes: '' }));
        } else if (checkbox === 'customClearance') {
            setCustomClearance(true);
            setDoorToDoor(false);
            setErrors((prevErrors) => ({ ...prevErrors, checkboxes: '' }));
        }
    };

    // const handleContactInput = (value) => {
    //     console.log(value);
    //     // Clean the phone number value (remove non-numeric characters)
    //     const cleanedValue = value.replace(/[^0-9]/g, '');
    //     console.log(cleanedValue);
    //     handleInputChange('contact', cleanedValue);
    // };


    const formatPhoneNumber = (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        if (phoneNumber) {
            const countryCallingCode = `+${phoneNumber.countryCallingCode}`;
            const nationalNumber = phoneNumber.nationalNumber;
            return `${countryCallingCode}-${nationalNumber}`;
        }
        return value;
    };

    const handlePhoneChange = (name, value) => {
        setErrors(prevState => ({ ...prevState, [name]: '' }));
        if (value.trim() !== '') {
            const phoneRegex = /^[0-9]{10,15}$/;
            if (phoneRegex.test(value.replace(/\D/g, ''))) { // Remove non-digits for regex test
                const formattedNumber = formatPhoneNumber(value);
                console.log('formattedNumber',formattedNumber);
                handleInputChange('contact', formattedNumber );
                // setFormData(prevState => ({ ...prevState, [name]: formattedNumber }));
            } else {
                // setErrors(prevState => ({ ...prevState, [name]: 'Invalid phone number' }));
            }
        } else {
            // Handle empty input if needed
        }
    };

    const handlePincodeInput = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        handleInputChange('pincode', value);
    };

    // const handleTextInput = (field, e) => {
    //     const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    //     handleInputChange(field, value);
    // };
    const handleTextInput = (field, e) => {
        const value = e.target.value;

        if (field === 'email') {
            handleInputChange(field, value);
        } else {
            // For fields other than email, strip out invalid characters
            const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
            handleInputChange(field, sanitizedValue);
        }
    };

    const handleCountryChange = (e) => {
        setCountryid(e.id);
        handleInputChange('country', e.name);
    };

    const handleStateChange = (e) => {
        setstateid(e.id);
        handleInputChange('state', e.name);
    };

    const handleCityChange = (e) => {
        handleInputChange('cityDistrict', e.name);
    };

    if (!isOpen) return null;

    const handleClose = () => {
        setIsModalOpen(false)
    }

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={handleClose}>&times;</span>
                <div className={styles.modalHeading}>Book Logistics</div>
                <div className={styles.modalCustomContent}>
                    <div className={styles['custom-modal-checkbox-sections']}>
                        <div className={styles.modalFormGroup}>
                            <input
                                type="checkbox"
                                checked={doorToDoor}
                                onChange={() => handleCheckboxChange('doorToDoor')}
                            />
                            <label className={styles.modalContentText}>Door to Door</label>
                        </div>
                        <div className={styles.modalFormGroup}>
                            <input
                                type="checkbox"
                                checked={customClearance}
                                onChange={() => handleCheckboxChange('customClearance')}
                            />
                            <label className={styles.modalContentText}>Include Custom Clearance</label>
                        </div>
                        {errors.checkboxes && <div className={styles.error}>{errors.checkboxes}</div>}
                    </div>
                    <div className={styles.selectFormGroup}>
                        <label className={styles.selectModalText}>Preferred Mode of Transport</label>
                        <div ref={dropdownRef} className={styles.dropdown}>
                            <div className={styles.dropdownButton} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                {transportMode || "Select Mode"} <span className={styles.dropdownIcon}>▼</span>
                            </div>
                            {dropdownOpen && (
                                <div className={styles.dropdownContent}>
                                    <div
                                        className={styles.dropdownItem}
                                        onClick={() => handleSelectChange('Road Transport')}
                                    >
                                        Road Transport
                                    </div>
                                    <div
                                        className={styles.dropdownItem}
                                        onClick={() => handleSelectChange('Ship Transport')}
                                    >
                                        Ship Transport
                                    </div>
                                    <div
                                        className={styles.dropdownItem}
                                        onClick={() => handleSelectChange('Air Transport')}
                                    >
                                        Air Transport
                                    </div>
                                </div>
                            )}
                            {errors.transportMode && <div className={styles.error}>{errors.transportMode}</div>}
                        </div>                       
                    </div>
                    <div className={styles['custom-modal-input-form-containers-section']}>
                        <label className={styles.selectModalText}>Drop Details</label>
                        <div className={styles['custom-modal-input-container']}>
                            <label className={styles['custom-modal-label-heading']}>Name</label>
                            <input
                                className={styles.selectInputGroups}
                                type="text"
                                placeholder="Enter Name"
                                value={dropLocation.name}
                                onInput={(e) => handleTextInput('name', e)}
                            />
                            {errors.name && <div className={styles.error}>{errors.name}</div>}
                        </div>
                        <div className={styles['custom-modal-input-container']}>
                            <label className={styles['custom-modal-label-heading']}>Email ID</label>
                            <input
                                className={styles.selectInputGroups}
                                type="text"
                                placeholder="Enter Email ID"
                                value={dropLocation.email}
                                onInput={(e) => handleTextInput('email', e)}
                            />
                            {errors.email && <div className={styles.error}>{errors.email}</div>}
                        </div>
                        <div className={styles['custom-modal-input-container']}>
                            <label className={styles['custom-modal-label-heading']}>Mobile Number</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name="contact"
                                value={dropLocation.contact}
                                // onChange={(e) => {handleContactInput(e)}}
                                // onChange={handleContactInput}
                                onChange={(value) => {
                                    const formattedValue = formatPhoneNumber(value);
                                    setCompanyPhone(formattedValue);
                                    handlePhoneChange('companyPhone', value);
                                }}
                            />
                            {errors.contact && <div className={styles.error}>{errors.contact}</div>}
                        </div>
                        <div className={styles['custom-modal-input-container']}>
                            <label className={styles['custom-modal-label-heading']}>Address</label>
                            <input
                                className={styles.selectInputGroups}
                                type="text"
                                placeholder="Enter Address"
                                value={dropLocation.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                            />
                            {errors.address && <div className={styles.error}>{errors.address}</div>}
                        </div>
                        <div className={styles['custom-modal-state-containers-section']}>
                            <div className={styles['custom-modal-input-container']}>
                                <label className={styles['custom-modal-label-heading']}>Country</label>
                                <CountrySelect
                                    className={styles['order-modal-input']}
                                    // onChange={(e) => {
                                    //     setCountryid(e.id);
                                    // }}
                                    onChange={handleCountryChange}
                                    placeHolder="Select Country"
                                />
                                {errors.country && <div className={styles.error}>{errors.country}</div>}
                            </div>
                            <div className={styles['custom-modal-input-container']}>
                                <label className={styles['custom-modal-label-heading']}>State</label>
                                <StateSelect
                                    className={styles['order-modal-input']}
                                    countryid={countryid}
                                    // onChange={(e) => {
                                    //     setstateid(e.id);
                                    // }}
                                    onChange={handleStateChange}
                                    placeHolder="Select State"
                                />
                                {errors.state && <div className={styles.error}>{errors.state}</div>}
                            </div>
                        </div>
                        <div className={styles['custom-modal-state-containers-section']}>
                            <div className={styles['custom-modal-input-container']}>
                                <label className={styles['custom-modal-label-heading']}>City/District</label>
                                <CitySelect
                                    className={styles['order-modal-input']}
                                    countryid={countryid}
                                    stateid={stateid}
                                    // onChange={(e) => {
                                    //     console.log(e);
                                    // }}
                                    onChange={handleCityChange}
                                    placeHolder="Select City"
                                />
                                {errors.cityDistrict && <div className={styles.error}>{errors.cityDistrict}</div>}
                            </div>
                            <div className={styles['custom-modal-input-container']}>
                                <label className={styles['custom-modal-label-heading']}>Pin Code(optional)</label>
                                <input
                                    className={styles.selectInputGroups}
                                    type="text"
                                    placeholder="Enter Pin Code"
                                    value={dropLocation.pincode}
                                    onInput={handlePincodeInput}
                                />
                                {/* {errors.pincode && <div className={styles.error}>{errors.pincode}</div>} */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.modalcustombuttonsec}>
                    <button 
                    className={styles['custom-modal-label-button-section']}
                     onClick={handleSubmit}
                     disabled={loading}
                     >
                        {/* Request Seller for Further Details */}
                        {loading ? (
                                <div className='loading-spinner'></div> 
                            ) : (
                                'Request Seller for Further Details'
                            )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomOrderModal;


