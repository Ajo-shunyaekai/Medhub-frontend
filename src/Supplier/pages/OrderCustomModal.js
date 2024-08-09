import React, { useState } from 'react';
import styles from '../style/ordermodal.module.css';
import { postRequestWithToken } from '../api/Requests';
import { useNavigate } from 'react-router-dom';

const OrderCustomModal = ({ show, onClose, buyerData, orderId, buyerId, setRefresh }) => {
    const [formData, setFormData] = useState({
        suppliername: '',
        supplierEmail: '',
        supplierMobile: '',
        address: '',
        cityDistrict : '',
        pincode : '',
        pickupTime: '',
        packages: '',
        length: '',
        breadth: '',
        height: '',
        weight: '',
        volume: '',
        buyerName: buyerData?.buyer_name,
        buyerEmail : buyerData?.buyer_email,
        buyerMobile : buyerData?.buyer_mobile,
        buyerType : buyerData?.buyer_type

    });

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        const formattedData = {
            supplier_details: {
                name: formData.suppliername,
                mobile: formData.supplierMobile,
                email: formData.supplierEmail,
                address: formData.address,
                ciyt_disctrict: formData.cityDistrict,
                pincode: formData.pincode,
                prefered_pickup_time: formData.pickupTime,
            },
            shipment_details: {
                length: formData.length,
                breadth: formData.breadth,
                height: formData.height,
                total_weight: formData.weight,
                total_volume: formData.volume,
            },
            buyer_details: {
                name       : buyerData?.buyer_name,
                mobile     : buyerData?.buyer_mobile,
                email      : buyerData?.buyer_email,
                buyer_type : buyerData?.buyer_type
            },
            
        };
        const obj = {
            supplier_id : supplierIdSessionStorage || supplierIdLocalStorage,
            buyer_id : buyerId,
            order_id : orderId,
            shipment_details : formattedData
        }
        postRequestWithToken('supplier/order/submit-details', obj, (response) => {
            if (response.code === 200) {
                setRefresh(true)
                onClose()
            } else {
                console.log('error in order details api');
            }
        });
        // ; 
    };

    return (
        <div className={styles['order-modal-overlay']}>
            <div className={styles['order-modal-content-section']}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <form className={styles['main-modal-form-container']} onSubmit={handleSubmit}>
                    <div className={styles['order-modal-main-heading']}>Pickup Details</div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Name</label>
                        <input placeholder='Enter Name' type="text" 
                        name="suppliername" 
                        value={formData.suppliername} 
                        onChange={handleChange} 
                        className={styles['order-modal-input']} 
                        required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Email ID</label>
                        <input placeholder='Enter Email ID' 
                            className={styles['order-modal-input']} 
                            type="email" 
                            name="supplierEmail" 
                            value={formData.supplierEmail} 
                            onChange={handleChange} required 
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Mobile No</label>
                        <input placeholder='Enter Mobile No.' 
                            className={styles['order-modal-input']} 
                            type="text" 
                            name="supplierMobile"
                            value={formData.supplierMobile} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Address</label>
                        <input placeholder='Enter Full Address'
                            className={styles['order-modal-input']} 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            required 
                         />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>City/District</label>
                        <input placeholder='Enter Full Address' 
                            className={styles['order-modal-input']} 
                            name="cityDistrict" 
                            value={formData.cityDistrict}
                            onChange={handleChange} 
                            required 
                         />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>State</label>
                        <input placeholder='Enter Full Address' 
                            className={styles['order-modal-input']} 
                            name="state"
                             value={formData.state} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Pin Code</label>
                        <input placeholder='Enter Full Address' 
                            className={styles['order-modal-input']}
                            name="pincode"
                            value={formData.pincode} 
                            onChange={handleChange}
                            required 
                          />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Preferred Time Of Pickup</label>
                        <input placeholder='Enter Preferred Time Of Pickup '
                            className={styles['order-modal-input']} 
                            type="text"
                             name="pickupTime" 
                            value={formData.pickupTime} 
                            onChange={handleChange} 
                            required 
                         />
                    </div>
                    <div className={styles['order-modal-main-heading']}>Shipment Details</div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>No. of Packages</label>
                        <input placeholder='Enter No. of Packages'
                         className={styles['order-modal-input']} 
                         type="text" 
                         name="packages" 
                         value={formData.packages}
                          onChange={handleChange} 
                          required 
                          />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Total Weight</label>
                        <input placeholder='Enter Weight' 
                        className={styles['order-modal-input']} 
                        type="text" 
                        name="weight" 
                        value={formData.weight}
                         onChange={handleChange} 
                         required 
                         />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Total Volume</label>
                        <input placeholder='Enter Length*Width*Height' 
                        className={styles['order-modal-input']} 
                        type="text" 
                        name="volume" 
                        value={formData.volume} 
                        onChange={handleChange} 
                        required 
                        />
                    </div>
                    <div className={styles['order-modal-main-heading']}>Buyer Details</div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Buyer Name</label>
                        <input placeholder='Enter Buyer Name'
                         className={styles['order-modal-input']} 
                         type="text"
                         name="buyerName" 
                         readOnly
                         defaultValue={buyerData.buyer_name} 
                        //  onChange={handleChange} 
                         required
                          />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Company Type</label>
                        <input placeholder='Enter Company Type' 
                        className={styles['order-modal-input']} 
                        type="text" 
                        name="buyerCompanyType" 
                        readOnly
                         defaultValue={buyerData.buyer_type} 
                        //  onChange={handleChange} 
                         required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Mobile No.</label>
                        <input placeholder='Enter Mobile No.' 
                        className={styles['order-modal-input']} 
                        type="text"
                        name="buyerMobile"
                        readOnly 
                        defaultValue={buyerData.buyer_mobile} 
                        //  onChange={handleChange} 
                         required />
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




