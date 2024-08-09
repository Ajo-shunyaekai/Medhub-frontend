import React, { useState } from 'react';
import styles from '../style/ordermodal.module.css';

const OrderCustomModal = ({ show, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        pickupTime: '',
        packages: '',
        weight: '',
        volume: '',
    });

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        console.log('Submitted data:', formData);
        onClose(); // Close the modal after submission
    };

    return (
        <div className={styles['order-modal-overlay']}>
            <div className={styles['order-modal-content-section']}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <form className={styles['main-modal-form-container']} onSubmit={handleSubmit}>
                    <div className={styles['order-modal-main-heading']}>Pickup Details</div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Name</label>
                        <input placeholder='Enter Name' type="text" name="name" value={formData.name} onChange={handleChange} className={styles['order-modal-input']} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Email ID</label>
                        <input placeholder='Enter Email ID' className={styles['order-modal-input']} type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Mobile No</label>
                        <input placeholder='Enter Mobile No.' className={styles['order-modal-input']} type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Address</label>
                        <input placeholder='Enter Full Address' className={styles['order-modal-input']} name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>City/District</label>
                        <input placeholder='Enter Full Address' className={styles['order-modal-input']} name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>State</label>
                        <input placeholder='Enter Full Address' className={styles['order-modal-input']} name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Pin Code</label>
                        <input placeholder='Enter Full Address' className={styles['order-modal-input']} name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Preferred Time Of Pickup</label>
                        <input placeholder='Enter Preferred Time Of Pickup ' className={styles['order-modal-input']} type="text" name="pickupTime" value={formData.pickupTime} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-main-heading']}>Shipment Details</div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>No. of Packages</label>
                        <input placeholder='Enter No. of Packages' className={styles['order-modal-input']} type="text" name="packages" value={formData.packages} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Total Weight</label>
                        <input placeholder='Enter Weight' className={styles['order-modal-input']} type="text" name="weight" value={formData.weight} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Total Volume</label>
                        <input placeholder='Enter Length*Width*Height' className={styles['order-modal-input']} type="text" name="volume" value={formData.volume} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-main-heading']}>Buyer Details</div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Buyer Name</label>
                        <input placeholder='Enter Buyer Name' className={styles['order-modal-input']} type="text" name="packages" value={formData.packages} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Company Type</label>
                        <input placeholder='Enter Company Type' className={styles['order-modal-input']} type="text" name="weight" value={formData.weight} onChange={handleChange} required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Mobile No.</label>
                        <input placeholder='Enter Mobile No.' className={styles['order-modal-input']} type="text" name="volume" value={formData.volume} onChange={handleChange} required />
                    </div>
                    <div className={styles['modal-order-button-section']}>
                        <button type="submit" className={styles.submitButton}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderCustomModal;




