import React, { useState, useEffect } from 'react';
import styles from '../../style/createInvoice.module.css';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import countryList from 'react-select-country-list';

const ProformaInvoice = () => {
    const [formData, setFormData] = useState({
        operationCountries: [],
        originCountry: ''
    });
    const [countries, setCountries] = useState([]);
    const [formItems, setFormItems] = useState([{ id: Date.now(), productName: '' }]);

    useEffect(() => {
        const countryOptions = countryList().getData();
        setCountries(countryOptions);
    }, []);

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
            <div className={styles['create-invoice-heading']}>Create Proforma Invoice</div>
            <div className={styles['create-invoice-section']}>
                <div className={styles['create-invoice-form-heading']}>Supplier</div>
                <form className={styles['craete-invoice-form']}>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Name</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='Name' placeholder='Enter Name' />
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Invoice Number</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='InvoiceNumber' placeholder='Enter Invoice Number' />
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Invoice Generate Date</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='InvoiceDate' placeholder='Enter Invoice Generate Date' />
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Payment Due Date</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='InvoiceDate' placeholder='Enter Payment Due Date' />
                    </div>
                     <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Total Due Amount</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='InvoiceDate' placeholder='Enter Total Due Amount' />
                    </div>

                    
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Email ID</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Email ID' />
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Mobile No.' />
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Address</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='VatRegNo' placeholder='Enter Address' />
                    </div>
                </form>
            </div>
            <div className={styles['create-invoice-section']}>
                <div className={styles['create-invoice-form-heading']}>Buyer</div>
                <form className={styles['craete-invoice-form']}>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Name</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='Name' placeholder='Enter Name' />
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Email ID</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Email ID' />
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Mobile No.' />
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Address</label>
                        <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Address' />
                    </div>
                </form>
            </div>
            <div className={styles['create-invoice-section']}>
                <div className={styles['create-invoice-add-item-cont']}>
                    <div className={styles['create-invoice-form-heading']}>Add Item</div>
                    {/* <span className={styles['create-invoice-add-tem-button']} onClick={addFormItem}>Add More</span> */}
                </div>
                {formItems.map((item, index) => (
                    <div className={styles['form-item-container']} key={item.id}>
                        <form className={styles['craete-invoice-form']}>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Product Name</label>
                                <input className={styles['create-invoice-div-input']} type='text' name={`Qty-${item.id}`} placeholder='Enter Product Name' />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Quantity</label>
                                <input className={styles['create-invoice-div-input']} type='text' name={`Qty-${item.id}`} placeholder='Enter Quantity' />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Listed Price</label>
                                <input className={styles['create-invoice-div-input']} type='text' name={`UnitPrice-${item.id}`} placeholder='Enter Unit Price' />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Tax Percentage</label>
                                <input className={styles['create-invoice-div-input']} type='text' name={`UnitPrice-${item.id}`} placeholder='Enter Tax Percentage' />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Total Amount</label>
                                <input className={styles['create-invoice-div-input']} type='text' name={`TotalAmount-${item.id}`} placeholder='Enter Total Amount' />
                            </div>
                        </form>
                        {formItems.length > 1 && (
                            <div className={styles['create-invoice-close-btn']} onClick={() => removeFormItem(item.id)}>
                                <CloseIcon />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles['craete-invoices-button']}>
                <div className={styles['create-invoices-cancel']}>Cancel</div>
                <div className={styles['create-invoices-submit']}>Create Proforma Invoice</div>
            </div>
        </div>
    );
}

export default ProformaInvoice;





