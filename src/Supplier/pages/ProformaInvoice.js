import React, { useState, useEffect } from 'react';
import styles from '../style/proformainvoice.module.css';
import countryList from 'react-select-country-list';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { PhoneInput } from 'react-international-phone';
import { phoneValidationRules, countryCodes } from '../../utils/phoneNumberValidation';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { getRequest } from '../../api/Requests';


const ProformaInvoice = ({socket}) => {
    const { purchaseOrderId } = useParams();
    const navigate            = useNavigate();

    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

    const [loading, setLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [dueDate, setDueDate] = useState('')
    const [invoiceNumber, setInvoiceNumber] = useState();
    const [inquiryDetails, setInquiryDetails] = useState();
    const [orderItems, setOrderItems] = useState([])
    const [dateError, setDateError] = useState('')
    const [dateValue, setDateValue] = useState();
    const [mobileError, setMobileError] = useState('')
    const [errors, setErrors]    = useState({})
    const [formData, setFormData] = useState({
        invoiceDate: '',
            invoiceDueDate: '',
            invoiceNumber: '',
            dueDate : '',
            depositRequested : '',
            depositDue : '',
            supplierName: '',
            supplierAddress: '',
            supplierEmail: '',
            supplierMobile: '',
            newSupplierMobile: '',
            buyerName: '',
            buyerAddress: '',
            buyerEmail: '',
            buyerMobile: '',
            newBuyerMobile: '',
            orderItems: [],
            paymentTerms : '',
            totalDueAmount : '',
            totalAmount: ''
    })

    const handlePaymentDueDateChange = (e) => {
        setDateValue(e)
        setDateError(null)
        setFormData(prevState => ({
            ...prevState,
            dueDate: formatDate(e)
        }));
    }

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
    
        return `${day}-${month}-${year}`;
    };
    useEffect(() => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const year = today.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        setCurrentDate(formattedDate);
        // setValue('invoiceDate', `${day}-${month}-${year}`);

        const generateRandomNumber = () => Math.floor(10000000 + Math.random() * 90000000);
        const generatedInvoiceNumber = generateRandomNumber();

        setFormData(prevState => ({
            ...prevState,
            invoiceNumber: generatedInvoiceNumber,
            invoiceDate: formattedDate
        }));

        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 15);
        const dueDay = String(dueDate.getDate()).padStart(2, '0');
        const dueMonth = String(dueDate.getMonth() + 1).padStart(2, '0');
        const dueYear = dueDate.getFullYear();
        const formattedDueDate = `${dueDay}-${dueMonth}-${dueYear}`;
        setDueDate(formattedDueDate)
        // setValue('invoiceDueDate', formattedDueDate);

    }, []);

    useEffect(() => {
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        const obj = {
            supplier_id      : supplierIdSessionStorage || supplierIdLocalStorage,
            purchaseOrder_id : purchaseOrderId
        };
        postRequestWithToken('supplier/purchaseorder/get-po-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result);
                const data = response.result
                const formattedSupplierMobile = `${data?.supplier_country_code || ''}-${data?.supplier_mobile || ''}`;
                const formattedBuyerMobile = `${data?.buyer_country_code || ''}-${data?.buyer_mobile || ''}`;

                const paymentTermsString = response?.result?.enquiry_details[0]?.payment_terms?.join('\n'); 
        
                setFormData(prevFormData => ({
                    ...prevFormData,
                    poId: data.purchaseOrder_id,
                    description : data.additional_instructions,
                    supplierId: data?.supplier_id,
                    supplierName: data?.supplier_name,
                    supplierEmail: data?.supplier_email,
                    supplierAddress: data?.supplier_address,
                    supplierMobile: formattedSupplierMobile,
                    supplierContactPersonMobile: data?.supplier_details[0]?.contact_person_mobile_no,
                    supplierContactPersonCountryCode: data?.supplier_details[0]?.contact_person_country_code,
                    supplierRegNo: data?.supplier_regNo,
                    buyerId: data?.buyer_details?.buyer_id,
                    buyerName: data?.buyer_name,
                    buyerEmail: data?.buyer_email,
                    buyerAddress : data?.buyer_address,
                    buyerMobile: formattedBuyerMobile,
                    buyerRegNo: data?.buyer_regNo,
                    orderItems: data?.order_items,
                    // totalDueAmount : data?.total_amount,
                    totalAmount : data?.total_amount,
                    paymentTerms : paymentTermsString
                }));
                setOrderItems(data?.order_items)
            } else {
                console.log('error in order list api', response);
            }
        });
    }, [navigate, supplierIdSessionStorage, supplierIdLocalStorage]);


    // useEffect(() => {
    //     getRequest('supplier/purchaseorder/get-po-details/8776', {}, (response) => {
    //         console.log('Response:', response);
    //     });
    // }, []);

    const resetForm = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
           
            // supplierId: data?.supplier_id,
            supplierName: '',
            supplierEmail: '',
            supplierAddress: '',
            supplierMobile: '',
            dueDate : '',
            depositRequested : '',
            depositDue : '',
            totalDueAmount : ''
            
            
        }));
        setDateValue()
    }

    const handleCancel = () => {
        resetForm()
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        let newErrors = {};
        let isValid = true;

        if (name === 'description') {
            if (value.length > 1000) {
                newErrors.description = 'Description cannot exceed 1000 characters';
                isValid = false;
            } else {
                newErrors.description = '';
            }
        }
        if (name === 'productName' || name === 'dossierStatus') {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                isValid = false;
            } else {
                newErrors[name] = '';
            }
        }
        if (name === 'totalQuantity' || name === 'minPurchaseUnit' ) {
            if (!/^\d*$/.test(value)) {
                isValid = false;
            } else {
                newErrors[name] = '';
            }
        }
        if (name === 'unitTax') {
            if (!/^\d*\.?\d*$/.test(value)) {
                isValid = false;
            } else {
                newErrors.unitTax = '';
            }
        }
        if (isValid) {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
        setErrors(prevState => ({ ...prevState, ...newErrors }));
    };

    const validateForm = () => {
        let formErrors = {};
        if(!formData.supplierName) formErrors.supplierName = 'Supplier Name is Required'
        if(!formData.supplierEmail) formErrors.supplierEmail = 'Supplier Email is Required'
        if(!formData.supplierAddress) formErrors.supplierAddress = 'Supplier Address is Required'
        if(!formData.supplierMobile) formErrors.supplierMobile = 'Supplier Mobile is Required'
        if(!formData.depositRequested) formErrors.depositRequested = 'Deposit Requested is Required'
        if(!formData.depositDue) formErrors.depositDue = 'Deposit Due is Required'
        if(!formData.dueDate) formErrors.dueDate = 'Payment Due Date is Required'
        if(!formData.totalDueAmount) formErrors.totalDueAmount = 'Total Due Amount is Required'

        // if(!formData.suppl) formErrors.buyerRegNo = 'Buyer VAT Reg No. is Required'
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }

        if(validateForm()) {
            setLoading(true)
            setDateError('');
            const updatedOrderItems = orderItems.map(item => ({
                ...item,
                unit_tax: item?.medicine_details?.unit_tax,
                est_delivery_days: item?.est_delivery_days,
            }));
    
            const  buyerDetails = inquiryDetails.buyer_details[0];
            const buyerCountryCode = buyerDetails.contact_person_country_code || '';
            const buyerMobileNumber = buyerDetails.contact_person_mobile || '';
            const formattedBuyerPhoneNumber = formatPhoneNumber(buyerMobileNumber, buyerCountryCode);
            const  supplierDetails = inquiryDetails.supplier_details[0];
            const supplierCountryCode = supplierDetails.contact_person_country_code || '';
            const supplierMobileNumber = supplierDetails.contact_person_mobile_no || '';
            const formattedSupplierPhoneNumber = formatPhoneNumber(supplierMobileNumber, supplierCountryCode);
    
            const obj = {
                supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
                enquiry_id: inquiryDetails?.enquiry_id,
                purchaseOrder_id: purchaseOrderId,
                buyer_id: inquiryDetails?.buyer_id,
                orderItems: updatedOrderItems,
                data: {
                    ...formData,
                    // dueDate: formatDate(dateValue),
                    newBuyerMobile: formattedBuyerPhoneNumber,
                    newSupplierMobile: formattedSupplierPhoneNumber,
                },
                totalAmount: roundedGrandTotalAmount
            };
            postRequestWithToken('buyer/order/create-order', obj, async (response) => {
                if (response.code === 200) {
                    
                    toast(response.message, { type: 'success' })

                    socket.emit('createOrder', {
                        buyerId : inquiryDetails?.buyer_id, 
                        inquiryId  : inquiryDetails?.enquiry_id,
                        poId : purchaseOrderId,
                        message    : `Order Created for ${inquiryDetails?.enquiry_id}`,
                        link       : process.env.REACT_APP_PUBLIC_URL
                        // send other details if needed
                    });
                    // setTimeout(() => {
                        navigate('/supplier/order/active')
                    // }, 500)
                    setLoading(false)
                } else {
                    setLoading(false)
                    console.log('error in create-order api', response);
                    toast(response.message, { type: 'error' })
                }
                // setLoading(false)
            });
        } else {
            setLoading(false)
            toast('Some Fields are Missing', { type: "error" });
            console.log('errorrrrr', formData);
        }
       

    };


    const handleNumberInput = (event) => {
        const { name, value } = event.target;
    
        // Remove any characters that are not digits or a single decimal point
        let cleanedValue = value.replace(/[^0-9.]/g, '');
    
        // Ensure only one decimal point is allowed
        if (cleanedValue.split('.').length > 2) {
            cleanedValue = cleanedValue.replace(/\.+$/, ''); // Remove extra decimal points
        }
    
        // Split into integer and decimal parts
        let [integerPart, decimalPart] = cleanedValue.split('.');
    
        // Limit the integer part to 9 digits
        if (integerPart.length > 9) {
            integerPart = integerPart.slice(0, 9);
        }
    
        // Limit the decimal part to 3 digits, if it exists
        if (decimalPart && decimalPart.length > 3) {
            decimalPart = decimalPart.slice(0, 3);
        }
    
        // Recombine the integer and decimal parts
        cleanedValue = decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart;
    
        // Update state
        setFormData(prevState => ({
            ...prevState,
            [name]: cleanedValue,
        }));
    };
    
    const grandTotalAmount = orderItems.reduce((total, item) => {
        return total + (parseFloat(item?.total_amount) || 0);
    }, 0);

    const roundedGrandTotalAmount = parseFloat(grandTotalAmount.toFixed(2));

    const formatPhoneNumber = (phoneNumber, countryCode) => {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        return `+${countryCode}-${cleanedNumber}`;
    };
    
    const validatePhoneNumber = (phoneNumber, countryCode) => {
    
        const validationRule = phoneValidationRules[countryCode];
        if (validationRule) {
            return validationRule.test(phoneNumber);
        } else {
            return false; 
        }
    };

    // const handlePhoneChange = (value, type) => {
    //     let countryCode = '';
    //     let mobileNumber = value;
    //     let isValidNumber = false;
    
    //     // Extract the country code and the mobile number
    //     for (let code of countryCodes) {
    //         if (value.startsWith(code)) {
    //             countryCode = code.replace('+', ''); 
    //             mobileNumber = value.substring(code.length); 
    //             break;
    //         }
    //     }
    
    //     // Validate the phone number based on the country code
    //     if (countryCode && mobileNumber) {
    //         isValidNumber = validatePhoneNumber(mobileNumber, countryCode);
    
    //         if (isValidNumber) {
    //             const formattedPhoneNumber = formatPhoneNumber(mobileNumber, countryCode);
    //             console.log("formattedPhoneNumber", formattedPhoneNumber);
    
    //             // Update formData with the formatted phone number
    //             setFormData(prevState => ({
    //                 ...prevState,
    //                 [type]: formattedPhoneNumber,  // Here, type should be 'buyerMobile' to update the correct field
    //             }));
    //         } else {
    //             setFormData(prevState => ({
    //                 ...prevState,
    //                 [type]: '',  // Clear the field if invalid
    //             }));
    //             console.error('Invalid phone number format for the specified country code');
    //         }
    //     } else {
    //         setFormData(prevState => ({
    //             ...prevState,
    //             [type]: '',  // Clear the field if invalid
    //         }));
    //         console.error('Invalid phone number format or unknown country code');
    //     }
    // };


    const handlePhoneChange = (value, type) => {
        try {
            const phoneNumber = parsePhoneNumberFromString(value);
            if (phoneNumber && phoneNumber.isValid()) {
                const formattedPhoneNumber = phoneNumber.formatInternational();
                
                setFormData(prevState => ({
                    ...prevState,
                    [type]: formattedPhoneNumber,
                }));
            } else {
                console.error('Invalid phone number');
                setFormData(prevState => ({
                    ...prevState,
                    [type]: '', // Clear the field if invalid
                }));

                // setErrors(prevErrors => ({
                //     ...prevErrors,
                //     [type]: 'Invalid phone number format', // Set error message for invalid phone number
                // }));
            }
        } catch (error) {
            console.error('Error parsing phone number:', error);
            setFormData(prevState => ({
                ...prevState,
                [type]: '', // Clear the field if an error occurs
            }));

            // setErrors(prevErrors => ({
            //     ...prevErrors,
            //     [type]: 'Invalid phone number format', // Set error message for invalid phone number
            // }));
        }
    };
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
        <div className={styles['create-invoice-container']}>
            <div className={styles['create-invoice-heading']}>Create Proforma Invoice</div>
            <form className={styles['craete-invoice-form']} 
            onSubmit={handleSubmit}
            >
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Supplier</div>
                    <div className={styles['create-invoice-inner-form-container']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierName' placeholder='Enter Name'
                                value={formData.supplierName}
                                onChange={handleChange}
                                // {...register('supplierName', { validate: value => value?.trim() !== '' || 'Supplier name is required' })} 
                                />
                                {errors.supplierName && <p style={{color: 'red', fontSize: '12px'}}>{errors.supplierName}</p>}
                        </div>
                        
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Invoice Number</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                placeholder='Enter Invoice Number'
                                name='invoiceNumber'
                                value={formData.invoiceNumber}
                                readOnly
                                // {...register('invoiceNumber')} 
                                />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Invoice Generate Date</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='invoiceDate'
                                placeholder='Enter Invoice Generate Date'
                                value={currentDate}
                                readOnly
                                // {...register('invoiceDate')} 
                                />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Payment Due Date</label>
                            <DatePicker
                                className={styles['create-invoice-div-input']}
                                onChange={handlePaymentDueDateChange}
                                value={dateValue}
                                // minDate={new Date()}
                                minDate={tomorrow}
                                clearIcon={null}
                                format="dd/MM/yyyy"
                                placeholder='dd/MM/yyyy'
                            />
                             {errors.dueDate && <p style={{color: 'red', fontSize: '12px'}}>{errors.dueDate}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Deposit Requested</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='depositRequested'
                                placeholder='Enter Deposit Requested'
                                value={formData.depositRequested}
                                // {...register('depositRequested',{ validate: value => value?.trim() !== '' || 'Deposit Requested is Required' })}
                                onInput={handleNumberInput}
                                />
                                {errors.depositRequested && <p style={{color: 'red', fontSize: '12px'}}>{errors.depositRequested}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Deposit Due</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='depositDue'
                                placeholder='Enter Deposit Due'
                                value={formData.depositDue}
                                // {...register('depositDue',{ validate: value => value?.trim() !== '' || 'Deposit Due is Required' })}
                                onInput={handleNumberInput}
                                 />
                                 {errors.depositDue && <p style={{color: 'red', fontSize: '12px'}}>{errors.depositDue}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Total Due Amount</label>

                            <input className={styles['create-invoice-div-input']} type='text'
                                name='totalDueAmount'
                                placeholder='Enter Total Due Amount'
                                // {...register('totalDueAmount',
                                // )}
                                // readOnly
                                value={formData.totalDueAmount}
                                onInput={handleNumberInput}
                                />
                                {errors.totalDueAmount && <p style={{color: 'red', fontSize: '12px'}}>{errors.totalDueAmount}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierEmail'
                                placeholder='Enter Email ID'
                                value={formData.supplierEmail}
                                onChange={handleChange}
                                // {...register('supplierEmail', { validate: value => value?.trim() !== '' || 'Supplier email is required' })} 
                                />
                            {errors.supplierEmail && <p style={{color: 'red', fontSize: '12px'}}>{errors.supplierEmail}</p>}
                        </div>

                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                            <PhoneInput
                            className='signup-form-section-phone-input'
                            defaultCountry="uk"
                            name='supplierMobile'
                            // value={watch('supplierMobile')}
                            value={formData.supplierMobile}
                            // onChange={handleSupplierPhoneChange}
                            onChange={(value) => handlePhoneChange(value, 'supplierMobile')}
                        />
                            {errors.supplierMobile && <p style={{color: 'red', fontSize: '12px'}}>{errors.supplierMobile}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierAddress'
                                placeholder='Enter Address'
                                value={formData.supplierAddress}
                                onChange={handleChange}
                                // {...register('supplierAddress', { validate: value => value?.trim() !== '' || 'Supplier address is required' })} 
                                />
                            {errors.supplierAddress && <p style={{color: 'red', fontSize: '12px'}}>{errors.supplierAddress}</p>}
                        </div>
                    </div>
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Buyer</div>
                    <div className={styles['create-invoice-inner-form-container']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='buyerName' placeholder='Enter Name'
                                readOnly
                                value={formData.buyerName}
                                // {...register('buyerName', { validate: value => value?.trim() !== '' || 'Buyer name is required' })}
                                />
                            {errors.buyerName && <p style={{color: 'red', fontSize: '12px'}}>{errors.buyerName}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='buyerEmail'
                                placeholder='Enter Email ID'
                                readOnly
                                value={formData.buyerEmail}
                                // {...register('buyerEmail', { validate: value => value?.trim() !== '' || 'Buyer email is required' })} 
                                />
                            {errors.buyerEmail && <p style={{color: 'red', fontSize: '12px'}}>{errors.buyerEmail}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                            <PhoneInput
                            className='signup-form-section-phone-input'
                            defaultCountry="ae"
                            name='phoneinput'
                            // value={watch('buyerMobile')}
                            value={formData.buyerMobile}
                            disabled
                            // onChange={handleBuyerPhoneChange}
                        />
                            {errors.buyerMobile && <p style={{color: 'red', fontSize: '12px'}}>{errors.buyerMobile}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='buyerAddress'
                                placeholder='Enter Address'
                                readOnly
                                value={formData.buyerAddress}
                                // {...register('buyerAddress', { validate: value => value?.trim() !== '' || 'Buyer address is required' })} 
                                />
                            {errors.buyerAddress && <p style={{color: 'red', fontSize: '12px'}}>{errors.buyerAddress}</p>}
                        </div>
                    </div>
                </div>
                <div className={styles['create-invoice-section']}>
                    {orderItems.map((item, index) => {
                        return (
                            <div className={styles['form-item-container']} key={item.id}>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Product Name</label>
                                <input className={styles['create-invoice-div-input']} type='text' name={`Qty-${item.id}`}
                                    placeholder='Enter Product Name'
                                    value={item?.medicine_details?.medicine_name}
                                    readOnly
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Quantity</label>
                                <input className={styles['create-invoice-div-input']} type='text'
                                    name={`Qty-${item.id}`}
                                    placeholder='Enter Quantity'
                                    value={item?.quantity_required}
                                    readOnly
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Price</label>
                                <input className={styles['create-invoice-div-input']} type='text'
                                    name={`UnitPrice-${item.id}`}
                                    placeholder='Enter Price'
                                    value={item?.counter_price || item?.target_price}
                                    readOnly
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Tax%</label>
                                <input className={styles['create-invoice-div-input']} type='text'
                                    name={`UnitPrice-${item.id}`}
                                    placeholder='Enter Tax%'
                                    value={item?.medicine_details?.unit_tax}
                                    readOnly
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Total Amount</label>
                                <input className={styles['create-invoice-div-input']} type='text'
                                    name={`TotalAmount-${item.id}`} placeholder='Enter Total Amount'
                                    value={item?.total_amount}
                                    readOnly
                                />
                            </div>
                        </div>
                        )
                    }
                        
                    )}
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-textarea']}>
                            <label className={styles['create-invoice-div-label']}>Payment Terms</label>
                            <textarea
                                className={styles['create-invoice-div-input']}
                                name="paymentTerms"
                                rows="4"
                                cols="10"
                                placeholder='Enter Payment Terms'
                                value={formData.paymentTerms}
                                // {...register('paymentTerms')}
                                readOnly 
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['craete-invoices-button']}>
                    <button 
                    type='submit' 
                    className={styles['create-invoices-submit']}
                    disabled={loading}
                    >
                        {/* Create Proforma Invoice */}
                        {loading ? (
                                <div className={styles['loading-spinner']}></div> 
                            ) : (
                                'Create Proforma Invoice'
                            )}
                    </button>
                    <div className={styles['create-invoices-cancel']} onClick={handleCancel}>Cancel</div>
                </div>
            </form>
        </div >
    );
}

export default ProformaInvoice;





