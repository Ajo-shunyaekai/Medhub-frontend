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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <form onSubmit={handleSubmit}>
          <h2>Pickup Details</h2>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Phone No:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Address:</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required></textarea>
          </div>
          <div className={styles.formGroup}>
            <label>Preferred Time Of Pickup:</label>
            <input type="text" name="pickupTime" value={formData.pickupTime} onChange={handleChange} required />
          </div>

          <h2>Shipment Details</h2>
          <div className={styles.formGroup}>
            <label>No of Packages:</label>
            <input type="number" name="packages" value={formData.packages} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Total Weight:</label>
            <input type="text" name="weight" value={formData.weight} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Total Volume (LxBxH):</label>
            <input type="text" name="volume" value={formData.volume} onChange={handleChange} required />
          </div>
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default OrderCustomModal;




