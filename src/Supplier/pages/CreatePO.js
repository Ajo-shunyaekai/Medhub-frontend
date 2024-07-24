import React, { useState } from 'react';
import styles from '../style/createInvoice.module.css';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import CreatePOImageUpload from './CreatePOImageUpload';

const CreatePO = () => {
    const [formItems, setFormItems] = useState([{ id: Date.now(), productName: '' }]);

    const productOptions = [
        { value: 'Product1', label: 'Product 1' },
        { value: 'Product2', label: 'Product 2' },
        { value: 'Product3', label: 'Product 3' }
    ];

    const addFormItem = () => {
        setFormItems([...formItems, { id: Date.now(), productName: '' }]);
    };

    const removeFormItem = (id) => {
        setFormItems(formItems.filter(item => item.id !== id));
    };

    const handleProductChange = (selectedOption, index) => {
        const newFormItems = [...formItems];
        newFormItems[index].productName = selectedOption.value;
        setFormItems(newFormItems);
    };

    return (
        <div className={styles['create-invoice-container']}>
            <div className={styles['create-invoice-heading']}>Create Purchased Order</div>
            <form className={styles['create-po-main-form-container']}>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Supplier</div>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>PO Date</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='InvoiceDate' placeholder='Enter PO Date' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>PO Number</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='InvoiceNumber' placeholder='Enter PO Number' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Name' placeholder='Enter Name' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Address' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Email ID' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile Number</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Mobile No.' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Company Registration Number</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Company Registration Number' />
                        </div>

                    </div>
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Buyer</div>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Name' placeholder='Enter Name' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Address' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Email ID' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile Number</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Mobile No.' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Company Registration Number</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Company Registration Number' />
                        </div>
                    </div>
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-add-item-cont']}>
                        <div className={styles['create-invoice-form-heading']}>Order Details</div>
                        <span className={styles['create-invoice-add-tem-button']} onClick={addFormItem}>Add More</span>
                    </div>
                    {formItems.map((item, index) => (
                        <div className={styles['form-item-container']} key={item.id}>
                            <div className={styles['craete-invoice-form']}>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Product Name</label>
                                    <Select
                                        className={styles['create-invoice-div-selects']}
                                        options={productOptions}
                                        value={productOptions.find(option => option.value === item.productName)}
                                        onChange={(selectedOption) => handleProductChange(selectedOption, index)}
                                    />
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Quantity</label>
                                    <input className={styles['create-invoice-div-input']} type='text' name={`Qty-${item.id}`} placeholder='Enter Quantity' />
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Unit Price</label>
                                    <input className={styles['create-invoice-div-input']} type='text' name={`UnitPrice-${item.id}`} placeholder='Enter Unit Price' />
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Total Amount</label>
                                    <input className={styles['create-invoice-div-input']} type='text' name={`TotalAmount-${item.id}`} placeholder='Enter Total Amount' />
                                </div>
                            </div>
                            {formItems.length > 1 && (
                                <div className={styles['create-invoice-close-btn']} onClick={() => removeFormItem(item.id)}>
                                    <CloseIcon />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Payment Information</div>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Account Number</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='AccountNumber' placeholder='Enter Account Number' />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Sort Code</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='SortCode' placeholder='Enter Sort Code' />
                        </div>
                    </div>
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Additional Instructions</div>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-textarea']}>
                            <label className={styles['create-invoice-div-label']}>Description</label>
                            <textarea
                                className={styles['create-invoice-div-input']}
                                name="description"
                                rows="4"
                                cols="10"
                                placeholder='Enter Description'
                            />
                        </div>
                    </div>
                </div>

                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-upload-purchase']}>
                        <div className={styles['create-invoice-form-heading']}>Upload Company Logo</div>
                        <CreatePOImageUpload />
                    </div>
                </div>
                <div className={styles['craete-invoices-button']}>
                    <div className={styles['create-invoices-cancel']}>Cancel</div>
                    <div className={styles['create-invoices-submit']}>Create Purchased Order</div>
                </div>
            </form>
        </div>
    );
}

export default CreatePO;