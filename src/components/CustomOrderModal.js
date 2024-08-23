import React, { useState, useRef, useEffect } from 'react';
import styles from '../style/custommodalorder.module.css';
import { PhoneInput } from 'react-international-phone';
import {
    CitySelect,
    CountrySelect,
    StateSelect,
    LanguageSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
const CustomOrderModal = ({ isOpen, onClose, onSubmit }) => {
    const [doorToDoor, setDoorToDoor] = useState(true);
    const [customClearance, setCustomClearance] = useState(false);
    const [transportMode, setTransportMode] = useState('');
    const [dropLocation, setDropLocation] = useState({ name: '', contact: '', address: '', cityDistrict: '', state: '', pincode: '' });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const dropdownRef = useRef(null);

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
        if (!doorToDoor && !customClearance) newErrors.checkboxes = 'Please select at least one option.';
        if (!transportMode) newErrors.transportMode = 'Please select a mode of transport.';
        if (!dropLocation.name) newErrors.name = 'Name is required.';
        if (!dropLocation.contact) newErrors.contact = 'Mobile number is required.';
        if (!dropLocation.address) newErrors.address = 'Address is required.';
        if (!dropLocation.cityDistrict) newErrors.cityDistrict = 'City is required.';
        if (!dropLocation.state) newErrors.state = 'State is required.';
        if (!dropLocation.pincode) newErrors.pincode = 'Pincode is required.';
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
        onClose();
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
    // const handleCheckboxChange = (checkbox) => {
    //     if (checkbox === 'doorToDoor') {
    //         setDoorToDoor(!doorToDoor);
    //         setErrors((prevErrors) => ({ ...prevErrors, checkboxes: '' }));
    //     } else if (checkbox === 'customClearance') {
    //         setCustomClearance(!customClearance);
    //         setErrors((prevErrors) => ({ ...prevErrors, checkboxes: '' }));
    //     }
    // };

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


    const handleContactInput = (e) => {
        // Allow only numbers
        const value = e.target.value.replace(/[^0-9]/g, '');
        handleInputChange('contact', value);
    };

    const handlePincodeInput = (e) => {
        // Allow only numbers
        const value = e.target.value.replace(/[^0-9]/g, '');
        handleInputChange('pincode', value);
    };

    const handleTextInput = (field, e) => {
        // Allow only letters and spaces
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        handleInputChange(field, value);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={() => { onClose(); reset(); }}>&times;</span>
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
                        </div>
                        {errors.transportMode && <div className={styles.error}>{errors.transportMode}</div>}
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
                                value={dropLocation.name}
                                onInput={(e) => handleTextInput('name', e)}
                            />
                            {errors.name && <div className={styles.error}>{errors.name}</div>}
                        </div>
                        <div className={styles['custom-modal-input-container']}>
                            <label className={styles['custom-modal-label-heading']}>Mobile Number</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name="companyPhone"
                                value={dropLocation.contact}
                                onInput={handleContactInput}
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
                                    onChange={(e) => {
                                        setCountryid(e.id);
                                    }}
                                    placeHolder="Select Country"
                                />
                            </div>
                            <div className={styles['custom-modal-input-container']}>
                                <label className={styles['custom-modal-label-heading']}>State</label>
                                <StateSelect
                                    className={styles['order-modal-input']}
                                    countryid={countryid}
                                    onChange={(e) => {
                                        setstateid(e.id);
                                    }}
                                    placeHolder="Select State"
                                />
                                {errors.pincode && <div className={styles.error}>{errors.pincode}</div>}
                            </div>
                        </div>
                        <div className={styles['custom-modal-state-containers-section']}>
                            <div className={styles['custom-modal-input-container']}>
                                <label className={styles['custom-modal-label-heading']}>City/District</label>
                                <CitySelect
                                    className={styles['order-modal-input']}
                                    countryid={countryid}
                                    stateid={stateid}
                                    onChange={(e) => {
                                        console.log(e);
                                    }}
                                    placeHolder="Select City"
                                />
                                {errors.state && <div className={styles.error}>{errors.state}</div>}
                            </div>
                            <div className={styles['custom-modal-input-container']}>
                                <label className={styles['custom-modal-label-heading']}>Pin Code</label>
                                <input
                                    className={styles.selectInputGroups}
                                    type="text"
                                    placeholder="Enter Pin Code"
                                    value={dropLocation.pincode}
                                    onInput={handlePincodeInput}
                                />
                                {errors.pincode && <div className={styles.error}>{errors.pincode}</div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.modalcustombuttonsec}>
                    <button className={styles['custom-modal-label-button-section']} onClick={handleSubmit}>
                        Request Seller for Further Details
                    </button>
                </div>
            </div>
        </div>
    );
};


export default CustomOrderModal;


