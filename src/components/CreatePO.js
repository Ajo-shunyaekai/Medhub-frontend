import React, { useEffect, useState } from 'react';
import styles from '../style/createInvoice.module.css';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import CreatePOImageUpload from './CreatePOImageUpload';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';

const CreatePO = () => {
    const { inquiryId } = useParams()
    const navigate      = useNavigate();

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

    const [currentDate, setCurrentDate] = useState('');
    const [poNumber, setPONumber] = useState()
    const [orderItems, setOrderItems] = useState([])

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    setCurrentDate(`${day}-${month}-${year}`);

    const generateRandomNumber = () => Math.floor(10000000 + Math.random() * 90000000);
    setPONumber(generateRandomNumber());

    const storedItems = sessionStorage.getItem('acceptedQuotationItems');
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        setOrderItems(parsedItems);
      } catch (error) {
        console.error('Error parsing stored items:', error);
      }
    }
  }, []);

    const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

    
    const [inquiryDetails, setInquiryDetails] = useState()

    useEffect(() => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const obj = {
            buyer_id    : buyerIdSessionStorage || buyerIdLocalStorage,
            enquiry_id  : inquiryId
        }
        postRequestWithToken('buyer/enquiry/enquiry-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result)
            } else {
                console.log('error in order list api', response);
            }
        })
    }, [])

    console.log(orderItems)

    return (
        <div className={styles['create-invoice-container']}>
            <div className={styles['create-invoice-heading']}>Create Purchased Order</div>
            <form className={styles['create-po-main-form-container']}>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Supplier</div>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>PO Date</label>
                            <input className={styles['create-invoice-div-input']} type='text' 
                                name='InvoiceDate' placeholder='Enter PO Date' 
                                value={currentDate}
                                readOnly
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>PO Number</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='InvoiceNumber' placeholder='Enter PO Number'
                                value={poNumber}
                                readOnly
                              />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Name' placeholder='Enter Name' value={inquiryDetails?.supplier?.supplier_name} readOnly />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Address' value={inquiryDetails?.supplier?.supplier_address} readOnly />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Email ID' value={inquiryDetails?.supplier?.contact_person_email} readOnly/>
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile Number</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Mobile No.' value={inquiryDetails?.supplier?.contact_person_mobile_no} readOnly/>
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
                            <input className={styles['create-invoice-div-input']} type='text' name='Name' placeholder='Enter Name' value={inquiryDetails?.buyer?.buyer_name} readOnly  />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Address' value={inquiryDetails?.buyer?.buyer_address} readOnly  />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Email ID' value={inquiryDetails?.buyer?.contact_person_email} readOnly />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile Number</label>
                            <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Mobile No.' value={inquiryDetails?.buyer?.contact_person_mobile_no} readOnly />
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
                        {/* <span className={styles['create-invoice-add-tem-button']} onClick={addFormItem}>Add More</span> */}
                    </div>
                    {/* {formItems.map((item, index) => ( */}
                    {
                        orderItems?.map((item, i) => {
                            return (
                                <div className={styles['form-item-container']} key={item.id}>
                            <div className={styles['craete-invoice-form']}>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Product Name</label>
                                    {/* <Select
                                        className={styles['create-invoice-div-selects']}
                                        options={productOptions}
                                        value={productOptions.find(option => option.value === item.productName)}
                                        onChange={(selectedOption) => handleProductChange(selectedOption, index)}
                                    /> */}
                                    <input className={styles['create-invoice-div-input']} type='text' name={`pdtName-${item.id}`} placeholder='Product Name' value={item?.medicine_details?.medicine_name}/>
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Quantity</label>
                                    <input className={styles['create-invoice-div-input']} type='text' name={`Qty-${item.id}`} placeholder='Enter Quantity' value={item?.quantity_required}/>
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Unit Price</label>
                                    <input className={styles['create-invoice-div-input']} type='text' name={`UnitPrice-${item.id}`} placeholder='Enter Unit Price' value={item?.unit_price} />
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Total Amount</label>
                                    <input className={styles['create-invoice-div-input']} type='text' name={`TotalAmount-${item.id}`} placeholder='Enter Total Amount' value={item?.counter_price || item?.target_price}/>
                                </div>
                            </div>
                            {/* {formItems.length > 1 && (
                                <div className={styles['create-invoice-close-btn']} onClick={() => removeFormItem(item.id)}>
                                    <CloseIcon />
                                </div>
                            )} */}
                        </div>
                            )
                        })
                    }
                        
                    {/* ))} */}
                </div>
                {/* <div className={styles['create-invoice-section']}>
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
                </div> */}
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

                {/* <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-upload-purchase']}>
                        <div className={styles['create-invoice-form-heading']}>Upload Company Logo</div>
                        <CreatePOImageUpload />
                    </div>
                </div> */}
                <div className={styles['craete-invoices-button']}>
                    <div className={styles['create-invoices-cancel']}>Cancel</div>
                    <div className={styles['create-invoices-submit']}>Submit</div>
                </div>
            </form>
        </div>
    );
}

export default CreatePO;