import React, { useState, useRef, useEffect } from 'react';
import styles from '../style/custommodalorder.module.css';

const CustomOrderModal = ({ isOpen, onClose, onSubmit }) => {
    const [doorToDoor, setDoorToDoor] = useState(false);
    const [customClearance, setCustomClearance] = useState(false);
    const [transportMode, setTransportMode] = useState('');
    const [dropLocation, setDropLocation] = useState({ name: '', contact: '', address: '' });
    const [dropdownOpen, setDropdownOpen] = useState(false);
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

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!transportMode) return; // Prevent submission if transportMode is not selected
        onSubmit({ doorToDoor, customClearance, transportMode, dropLocation });
        onClose(); // Close modal after submission
    };

    const handleSelectChange = (value) => {
        setTransportMode(value);
        setDropdownOpen(false); // Close dropdown after selection
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <div className={styles.modalHeading}>Book Logistics</div>
                <div className={styles.modalCustomContent}>
                    <div className={styles['custom-modal-checkbox-sections']}>
                        <div className={styles.modalFormGroup}>
                            <input
                                type="checkbox"
                                checked={doorToDoor}
                                onChange={() => setDoorToDoor(!doorToDoor)}
                            />
                            <label className={styles.modalContentText}>Door to Door</label>
                        </div>
                        <div className={styles.modalFormGroup}>
                            <input
                                type="checkbox"
                                checked={customClearance}
                                onChange={() => setCustomClearance(!customClearance)}
                            />
                            <label className={styles.modalContentText}>Include Custom Clearance</label>
                        </div>
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
                    </div>
                    <div className={styles['custom-modal-input-form-containers-section']}>
                        <label className={styles.selectModalText}>Drop Location Details</label>
                        <div className={styles['custom-modal-input-container']}>
                            <label className={styles['custom-modal-label-heading']}>Name</label>
                            <input
                                className={styles.selectInputGroups}
                                type="text"
                                placeholder="Enter Name"
                                value={dropLocation.name}
                                onChange={(e) => setDropLocation({ ...dropLocation, name: e.target.value })}
                            />
                        </div>
                        <div className={styles['custom-modal-input-container']}>
                            <label className={styles['custom-modal-label-heading']}>Mobile Number</label>
                            <input
                                className={styles.selectInputGroups}
                                type="text"
                                placeholder="Enter Mobile Number"
                                value={dropLocation.contact}
                                onChange={(e) => setDropLocation({ ...dropLocation, contact: e.target.value })}
                            />
                        </div>
                        <div className={styles['custom-modal-input-container']}>
                            <label className={styles['custom-modal-label-heading']}>Address</label>
                            <input
                                className={styles.selectInputGroups}
                                type="text"
                                placeholder="Enter Address"
                                value={dropLocation.address}
                                onChange={(e) => setDropLocation({ ...dropLocation, address: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.modalcustombuttonsec}>
                    <button className={styles['custom-modal-label-button-section']} onClick={handleSubmit}>Request Seller for Further Details</button>
                </div>
            </div>
        </div>
    );
};

export default CustomOrderModal;
