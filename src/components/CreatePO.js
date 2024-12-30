import React, { useEffect, useState } from 'react';
import styles from '../style/createInvoice.module.css';
import { PhoneInput } from 'react-international-phone';
import CreatePOImageUpload from './CreatePOImageUpload';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { phoneValidationRules, countryCodes } from '../utils/phoneNumberValidation';
import { apiRequests } from '../api';


const CreatePO = ({socket}) => {
    const { inquiryId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [poNumber, setPONumber] = useState();
    const [orderItems, setOrderItems] = useState([]);
    const [rejectedItems, setRejectedItems] = useState([])
    const [inquiryDetails, setInquiryDetails] = useState();
    const [itemId, setItemId] = useState([])
    const [rejectedItemId, setRejectedItemId] = useState([])
    const [errors, setErrors]    = useState({})
    const [formData, setFormData] = useState({
        purchaseOrderId: '',
        poDate: '',
        poNumber: '',
        description : '',
        poStatus : '',
        buyerId: '',
        buyerName: '',
        buyerAddress: '',
        buyerEmail: '',
        buyerMobile: '',
        buyerCountryCode: '',
        buyerContactPersonMobile: '',
        buyerContactPersonCountryCode: '',
        buyerRegNo: '',
        supplierId: '',
        supplierName: '',
        supplierEmail: '',
        supplierAddress: '',
        supplierMobile: '',
        supplierCountryCode: '',
        supplierContactPersonMobile: '',
        supplierContactPersonCountryCode: '',
        supplierRegNo: '',
        orderItems: [],
    })

    const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage.getItem("buyer_id");
    let grandTotalAmount = 0;

    useEffect(() => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = today.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
    
        const generateRandomNumber = () => Math.floor(10000000 + Math.random() * 90000000);
        const generatedInvoiceNumber = generateRandomNumber();
    
        setFormData(prevState => ({
            ...prevState,
            poNumber: generatedInvoiceNumber,
            poDate: formattedDate
        }));
    
        setCurrentDate(formattedDate);
        setPONumber(generatedInvoiceNumber);
    
        const storedItems = sessionStorage.getItem('acceptedQuotationItems');
        const rejectedItems = sessionStorage.getItem('rejectedQuotationItems');
        if (storedItems) {
            try {
                const parsedItems = JSON.parse(storedItems);
                setOrderItems(parsedItems);
                setFormData(prevState => ({
                    ...prevState,
                    orderItems: parsedItems,
                }));
                const itemIds = parsedItems.map(item => item._id);
                setItemId(itemIds);
            } catch (error) {
                console.error('Error parsing stored items:', error);
            }
        }

        if (rejectedItems) {
            try {
                const parsedItems = JSON.parse(rejectedItems);
                setRejectedItems(parsedItems);
                setFormData(prevState => ({
                    ...prevState,
                    rejectedItems: parsedItems,
                }));
                const itemIds = parsedItems.map(item => item._id);
                setRejectedItemId(itemIds);
            } catch (error) {
                console.error('Error parsing stored items:', error);
            }
        }
    }, [inquiryId]);
    
    useEffect(() => {
        const fetchData = async ()=> {
            if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
                navigate("/buyer/login");
                return;
            }
            const obj = {
                buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
                enquiry_id: inquiryId,
            };
            // postRequestWithToken('buyer/enquiry/enquiry-details', obj, async (response) => {
            //     if (response.code === 200) {
            //         setInquiryDetails(response?.result);
            //         const data = response.result
            //         const formattedSupplierMobile = `${data?.supplier?.supplier_country_code || ''}-${data?.supplier?.supplier_mobile || ''}`;
            //         const formattedBuyerMobile = `${data?.buyer?.buyer_country_code || ''}-${data?.buyer?.buyer_mobile || ''}`;

            //         setFormData(prevFormData => ({
            //             ...prevFormData,
            //             poId: data.purchaseOrder_id,
                
            //             description : data.additional_instructions,
            //             supplierId: data?.supplier?.supplier_id,
            //             supplierName: data?.supplier?.supplier_name,
            //             supplierEmail: data?.supplier?.supplier_email,
            //             supplierAddress: data?.supplier?.supplier_address,
            //             supplierMobile: formattedSupplierMobile,
            //             supplierContactPersonMobile: data?.supplier?.contact_person_mobile_no,
            //             supplierContactPersonCountryCode: data?.supplier?.contact_person_country_code,
            //             supplierRegNo: data?.supplier?.registration_no,
            //             buyerId: data?.buyer?.buyer_id,
            //             buyerName: data?.buyer?.buyer_name,
            //             buyerEmail: data?.buyer?.buyer_email,
            //             buyerAddress : data?.buyer?.buyer_address,
            //             buyerMobile: formattedBuyerMobile,
            //             buyerRegNo: data?.buyer?.registration_no,
            //             orderItems: data?.items,
            //         }));
            //     } else {
            //         console.log('error in order list api', response);
            //     }
            // });
                      
            // const response = await apiRequests.postRequest(`enquiry/get-specific-enquiry-details/${inquiryId}`, obj);
            // if (response?.code !== 200) {
            //     console.log('error in get-enquiry-details api', response);
            //     return;
            // }
            // setInquiryDetails(response?.result);
            // const data = response.result
            // const formattedSupplierMobile = `${data?.supplier?.supplier_country_code || ''}-${data?.supplier?.supplier_mobile || ''}`;
            // const formattedBuyerMobile = `${data?.buyer?.buyer_country_code || ''}-${data?.buyer?.buyer_mobile || ''}`;

            // setFormData(prevFormData => ({
            //     ...prevFormData,
            //     poId: data.purchaseOrder_id,
        
            //     description : data.additional_instructions,
            //     supplierId: data?.supplier?.supplier_id,
            //     supplierName: data?.supplier?.supplier_name,
            //     supplierEmail: data?.supplier?.supplier_email,
            //     supplierAddress: data?.supplier?.supplier_address,
            //     supplierMobile: formattedSupplierMobile,
            //     supplierContactPersonMobile: data?.supplier?.contact_person_mobile_no,
            //     supplierContactPersonCountryCode: data?.supplier?.contact_person_country_code,
            //     supplierRegNo: data?.supplier?.registration_no,
            //     buyerId: data?.buyer?.buyer_id,
            //     buyerName: data?.buyer?.buyer_name,
            //     buyerEmail: data?.buyer?.buyer_email,
            //     buyerAddress : data?.buyer?.buyer_address,
            //     buyerMobile: formattedBuyerMobile,
            //     buyerRegNo: data?.buyer?.registration_no,
            //     orderItems: data?.items,
            // }));
            postRequestWithToken(`enquiry/get-specific-enquiry-details/${inquiryId}`, obj, async (response) => {
                if (response.code === 200) {
                    setInquiryDetails(response?.result);
                    const data = response.result
                    const formattedSupplierMobile = `${data?.supplier?.supplier_country_code || ''}-${data?.supplier?.supplier_mobile || ''}`;
                    const formattedBuyerMobile = `${data?.buyer?.buyer_country_code || ''}-${data?.buyer?.buyer_mobile || ''}`;

                    setFormData(prevFormData => ({
                        ...prevFormData,
                        poId: data.purchaseOrder_id,
                
                        description : data.additional_instructions,
                        supplierId: data?.supplier?.supplier_id,
                        supplierName: data?.supplier?.supplier_name,
                        supplierEmail: data?.supplier?.supplier_email,
                        supplierAddress: data?.supplier?.supplier_address,
                        supplierMobile: formattedSupplierMobile,
                        supplierContactPersonMobile: data?.supplier?.contact_person_mobile_no,
                        supplierContactPersonCountryCode: data?.supplier?.contact_person_country_code,
                        supplierRegNo: data?.supplier?.registration_no,
                        buyerId: data?.buyer?.buyer_id,
                        buyerName: data?.buyer?.buyer_name,
                        buyerEmail: data?.buyer?.buyer_email,
                        buyerAddress : data?.buyer?.buyer_address,
                        buyerMobile: formattedBuyerMobile,
                        buyerRegNo: data?.buyer?.registration_no,
                        orderItems: data?.items,
                    }));
                } else {
                    console.log('error in order list api', response);
                }
            });
        }
        fetchData()
    }, [navigate, buyerIdSessionStorage, buyerIdLocalStorage, inquiryId]);

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
        if (name === 'buyerRegNo') {
            if (!/^[a-zA-Z0-9]{0,16}$/.test(value)) {
                newErrors.buyerRegNo = '';
                isValid = false;
            } else {
                newErrors.buyerRegNo = '';
            }
        }
        if (isValid) {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
        setErrors(prevState => ({ ...prevState, ...newErrors }));
    };

    const validateForm = () => {
        let formErrors = {};
        if(!formData.buyerName) formErrors.buyerName = 'Buyer Name is Required'
        if(!formData.buyerEmail) formErrors.buyerEmail = 'Buyer Email is Required'
        if(!formData.buyerAddress) formErrors.buyerAddress = 'Buyer Address is Required'
        if(!formData.buyerMobile) formErrors.buyerMobile = 'Buyer Mobile is Required'
        if(!formData.buyerRegNo) formErrors.buyerRegNo = 'Buyer VAT Reg No. is Required'
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        if(validateForm()) {
            setLoading(true)
            const updatedOrderItems = orderItems.map((item) => {
                const est_delivery_days = item.est_delivery_days
                const unitTax = item.medicine_details.unit_tax || 0;
                const totalPrice = (item?.counter_price || item?.target_price) * item.quantity_required;
                const totalTax = totalPrice * (unitTax / 100);
                const totalAmount = totalPrice + totalTax;
                // const totalAmount = totalPrice + (unitTax / 100);
    
                return {
                    ...item,
                    totalAmount: totalAmount,
                };
            });
            const newData = {
                ...formData,
                orderItems: updatedOrderItems,
            };
            const obj = {
                buyer_id : buyerIdSessionStorage || buyerIdLocalStorage,
                enquiry_id: inquiryId,
                supplier_id: inquiryDetails?.supplier?.supplier_id,
                itemIds: itemId,
                rejectedIds  :rejectedItemId,
                data: newData,
                grandTotalAmount
            };
            postRequestWithToken('buyer/purchaseorder/create-po', obj, async (response) => {
                if (response.code === 200) {
                    toast(response.message, { type: 'success' })
                    socket.emit('createPO', {
                        supplierId : inquiryDetails?.supplier?.supplier_id, 
                        inquiryId  : inquiryId,
                        message    : `PO created for ${inquiryId}`,
                        link       : process.env.REACT_APP_PUBLIC_URL
                        // send other details if needed
                    });
                    setTimeout(() => {
                        navigate('/buyer/inquiry-purchase-orders/purchased')
                        setLoading(true)
                    }, 1000)
                } else {
                    setLoading(false)
                    console.log(obj);
                    console.log('error in order list api', response);
                    toast(response.message, { type: 'error' })
                }
            });
        } else {
            setLoading(false)
            toast('Some Fields are Missing', { type: "error" });
            console.log('errorrrrr', formData);
        }
       
    };

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

    const handlePhoneChange = (value, type) => {
        let countryCode = '';
        let mobileNumber = value;
        let isValidNumber = false;

        // Extract the country code and the mobile number
        for (let code of countryCodes) {
            if (value.startsWith(code)) {
                console.log('code', code);
                countryCode = code.replace('+', ''); 
                mobileNumber = value.substring(code.length); 
                break;
            }
        }
        console.log('countryCode', countryCode);
        console.log(' mobileNumber', mobileNumber);

        // if (countryCode === '971' && mobileNumber.length > 9) {
        //     mobileNumber = mobileNumber.substring(0, 9);
        // }
        
        // Validate the phone number based on the country code
        if (countryCode && mobileNumber) {
            isValidNumber = validatePhoneNumber(mobileNumber, countryCode);
    
            if (isValidNumber) {
                const formattedPhoneNumber = formatPhoneNumber(mobileNumber, countryCode);
    
                // Update formData with the formatted phone number
                setFormData(prevState => ({
                    ...prevState,
                    [type]: formattedPhoneNumber,  // Here, type should be 'buyerMobile' to update the correct field
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    [type]: '',  // Clear the field if invalid
                }));
                console.error('Invalid phone number format for the specified country code');
            }
        } else {
            setFormData(prevState => ({
                ...prevState,
                [type]: '',  // Clear the field if invalid
            }));
            console.error('Invalid phone number format or unknown country code');
        }
    };


   
    
    
    

    return (
        <div className={styles['create-invoice-container']}>
            <div className={styles['create-invoice-heading']}>Create Purchase Order</div>
            <form className={styles['create-po-main-form-container']} 
            onSubmit={handleSubmit}>
                
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Buyer</div>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='buyerName'
                                placeholder='Enter Name'
                                value={formData.buyerName}
                                onChange={handleChange}
                                // {...register('buyerName', { validate: value => value.trim() !== '' || 'Buyer name is required' })}
                            />
                            {errors.buyerName && <p style={{color: 'red'}}>{errors.buyerName}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='buyerAddress'
                                placeholder='Enter Address'
                                value={formData.buyerAddress}
                                onChange={handleChange}
                                // {...register('buyerAddress', { validate: value => value.trim() !== '' || 'Buyer address is required' })}
                            />
                            {errors.buyerAddress && <p style={{color: 'red'}}>{errors.buyerAddress}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='email'
                                name='buyerEmail'
                                placeholder='Enter Email ID'
                                value={formData.buyerEmail}
                                onChange={handleChange}
                                // {...register('buyerEmail', { validate: value => value.trim() !== '' || 'Buyer email is required' })}
                            />
                            {errors.buyerEmail && <p style={{color: 'red'}}>{errors.buyerEmail}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile Number</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name='buyerMobile'
                                // value={watch('buyerMobile')}
                                value={formData.buyerMobile}
                                //  onChange={handleBuyerPhoneChange}
                                onChange={(value) => handlePhoneChange(value, 'buyerMobile')}
                           
                            />
                            {errors.buyerMobile && <p style={{color: 'red'}}>{errors.buyerMobile}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Company Registration Number</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='buyerRegNo'
                                placeholder='Enter Company Registration Number'
                                value={formData.buyerRegNo}
                                onChange={handleChange}
                                // {...register('buyerRegNo', { validate: value => value?.trim() !== '' || 'Buyer registration number is required' })}
                            />
                            {errors.buyerRegNo && <p style={{color: 'red'}}>{errors.buyerRegNo}</p>}
                        </div>
                    </div>
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Supplier</div>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>PO Date</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='poDate'
                                value={currentDate}
                                readOnly
                                // {...register('poDate')}
                                // value={formData.buyerName}
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>PO Number</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='poNumber'
                                value={poNumber}
                                readOnly
                                // {...register('poNumber')}
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='supplierName'
                                placeholder='Enter Name'
                                readOnly
                                value={formData.supplierName}
                                // {...register('supplierName', { validate: value => value?.trim() !== '' || 'Supplier name is required' })}
                            />
                            {errors.supplierName && <p>{errors.supplierName.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='supplierAddress'
                                placeholder='Enter Address'
                                value={formData.supplierAddress}
                                readOnly
                                // {...register('supplierAddress', { validate: value => value?.trim() !== '' || 'Supplier address is required' })}
                            />
                            {errors.supplierAddress && <p>{errors.supplierAddress.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='email'
                                name='supplierEmail'
                                placeholder='Enter Email ID'
                                value={formData.supplierEmail}
                                readOnly
                                // {...register('supplierEmail', { validate: value => value?.trim() !== '' || 'Supplier email is required' })}
                            />
                            {errors.supplierEmail && <p>{errors.supplierEmail.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile Number</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name='supplierMobile'
                                // value={watch('supplierMobile')}
                                value={formData.supplierMobile}
                                disabled
                                // onChange={handleSupplierPhoneChange}
                                // onChange={(value) => handlePhoneChange(value, 'supplierMobile')}
                                
                            />
                            {errors.supplierMobile && <p>{errors.supplierMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Company Registration Number</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='supplierRegNo'
                                readOnly
                                placeholder='Enter Company Registration Number'
                                value={formData.supplierRegNo}
                                // {...register('supplierRegNo', { validate: value => value?.trim() !== '' || 'Supplier registration number is required' })}
                            />
                            {errors.supplierRegNo && <p>{errors.supplierRegNo.message}</p>}
                        </div>
                    </div>
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-add-item-cont']}>
                        <div className={styles['create-invoice-form-heading']}>Order Details</div>
                    </div>
                    {orderItems?.map((item, index) => {
                        const unitTax = item.medicine_details.unit_tax || 0
                        const totalPrice = (item?.counter_price || item?.target_price) * item.quantity_required
                        const totalTax = totalPrice * (unitTax / 100)
                        const totalAmount = totalPrice + totalTax
                        grandTotalAmount += totalAmount;
                        grandTotalAmount = parseFloat(grandTotalAmount.toFixed(2));
                        return (
                            <div className={styles['form-item-container']} key={item._id}>
                                <div className={styles['craete-invoice-form']}>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Item Name</label>
                                        <input
                                            className={styles['create-invoice-div-input']}
                                            type='text'
                                            name={`orderItems[${index}].productName`}
                                            placeholder='Item Name'
                                            // defaultValue={item?.medicine_details?.medicine_name}
                                            // {...register(`orderItems[${index}].productName`, { validate: value => value.trim() !== '' || 'Product name is required' })}
                                            value={item?.medicine_details?.medicine_name}
                                            readOnly
                                        />
                                        {errors.orderItems?.[index]?.productName && <p>{errors.orderItems[index].productName.message}</p>}
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Quantity</label>
                                        <input
                                            className={styles['create-invoice-div-input']}
                                            type='text'
                                            name={`orderItems[${index}].quantity`}
                                            placeholder='Enter Quantity'
                                            // defaultValue={item?.quantity_required}
                                            // {...register(`orderItems[${index}].quantity`, { validate: value => value.trim() !== '' || 'Quantity is required' })}
                                            value={item?.quantity_required}
                                            readOnly
                                        />
                                        {errors.orderItems?.[index]?.quantity && <p>{errors.orderItems[index].quantity.message}</p>}
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Price</label>
                                        <input
                                            className={styles['create-invoice-div-input']}
                                            type='text'
                                            name={`orderItems[${index}].unitPrice`}
                                            placeholder='Enter Price'
                                            // defaultValue={item?.unit_price}
                                            // {...register(`orderItems[${index}].unitPrice`, { validate: value => value.trim() !== '' || 'Unit price is required' })}
                                            value={item?.counter_price || item?.target_price}
                                            readOnly
                                        />
                                        {errors.orderItems?.[index]?.unitPrice && <p>{errors.orderItems[index].unitPrice.message}</p>}
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Tax%</label>
                                        <input
                                            className={styles['create-invoice-div-input']}
                                            type='text'
                                            name={`orderItems[${index}].unitTax`}
                                            placeholder='Enter Unit Tax'
                                            value={item?.medicine_details?.unit_tax}
                                            readOnly
                                        />
                                        {errors.orderItems?.[index]?.unitTax && <p>{errors.orderItems[index].unitTax.message}</p>}
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Total Amount</label>
                                        <input
                                            className={styles['create-invoice-div-input']}
                                            type='text'
                                            name={`orderItems[${index}].totalAmount`}
                                            placeholder='Enter Total Amount'
                                            // defaultValue={item?.counter_price || item?.target_price}
                                            // {...register(`orderItems[${index}].totalAmount`, { validate: value => value.trim() !== '' || 'Total amount is required' })}
                                            value={totalAmount.toFixed(2)}
                                            readOnly
                                        />
                                        {errors.orderItems?.[index]?.totalAmount && <p>{errors.orderItems[index].totalAmount.message}</p>}
                                    </div>
                                </div>
                            </div>
                        )
                    }


                    )}
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
                                onChange={handleChange}
                                // {...register('description')}
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
                        {/* Submit */}
                        {loading ? (
                                <div className='loading-spinner'></div> 
                            ) : (
                                'Submit'
                            )}
                      </button>
                    
                    {/* <div className={styles['create-invoices-cancel']}>Cancel</div> */}
                </div>
            </form>
        </div>
    );
};

export default CreatePO;