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

const EditProformaInvoice = () => {
    const { purchaseOrderId } = useParams();
    const navigate = useNavigate();

    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");

    const [currentDate, setCurrentDate] = useState('');
    const [dueDate, setDueDate] = useState('')
    const [invoiceNumber, setInvoiceNumber] = useState();
    const [inquiryDetails, setInquiryDetails] = useState();
    const [orderItems, setOrderItems] = useState([])

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
    const [value, onChange] = useState(new Date());
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

    // let grandTotalAmount = 0

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            invoiceDate: '',
            invoiceDueDate: '',
            invoiceNumber: '',
            depositRequested : '',
            depositDue : '',
            supplierName: '',
            supplierAddress: '',
            supplierEmail: '',
            supplierMobile: '',
            newSupplierMobile: '',
           
            // supplierRegNo: '',
            buyerName: '',
            buyerAddress: '',
            buyerEmail: '',
            buyerMobile: '',
            newBuyerMobile: '',
            // buyerRegNo: '',
            orderItems: [],
            // description: ''
        }
    });

    useEffect(() => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = today.getFullYear();
        setCurrentDate(`${day}-${month}-${year}`);
        setValue('invoiceDate', `${day}-${month}-${year}`);

        const generateRandomNumber = () => Math.floor(10000000 + Math.random() * 90000000);
        setInvoiceNumber(generateRandomNumber());
        setValue('invoiceNumber', generateRandomNumber());

        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 15);
        const dueDay = String(dueDate.getDate()).padStart(2, '0');
        const dueMonth = String(dueDate.getMonth() + 1).padStart(2, '0');
        const dueYear = dueDate.getFullYear();
        const formattedDueDate = `${dueDay}-${dueMonth}-${dueYear}`;
        setDueDate(formattedDueDate)
        setValue('invoiceDueDate', formattedDueDate);

        // const storedItems = sessionStorage.getItem('acceptedQuotationItems');

    }, [setValue]);

    useEffect(() => {
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            purchaseOrder_id: purchaseOrderId
            // enquiry_id: inquiryId,
        };
        postRequestWithToken('supplier/purchaseorder/get-po-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result);
                setValue('supplierName', response?.result?.supplier_details[0]?.supplier_name);
                setValue('supplierAddress', response?.result?.supplier_details[0]?.supplier_address);
                setValue('supplierEmail', response?.result?.supplier_details[0]?.contact_person_email);
                // setValue('supplierMobile', response?.result?.supplier_details[0]?.contact_person_mobile_no);
                // setValue('supplierCountryCode', response?.result?.supplier_details[0]?.contact_person_country_code);
                const supplierDetails = response.result.supplier_details[0];
                const countryCode = supplierDetails.contact_person_country_code || '';
                const mobileNumber = supplierDetails.contact_person_mobile_no || '';
                const formattedPhoneNumber = `${countryCode}${mobileNumber}`;
                const newFormattedPhoneNumber = `${countryCode}-${mobileNumber}`;
                console.log('newFormattedPhoneNumber',newFormattedPhoneNumber);
                setValue('supplierMobile', formattedPhoneNumber);
                setValue('newSupplierMobile',newFormattedPhoneNumber)
                // setValue('supplierRegNo',response?.result?.supplier_details[0]?.registration_no)
                setValue('buyerName', response?.result?.buyer_details[0]?.buyer_name);
                setValue('buyerAddress', response?.result?.buyer_details[0]?.buyer_address);
                setValue('buyerEmail', response?.result?.buyer_details[0]?.contact_person_email);

                // setValue('buyerMobile', response?.result?.buyer_details[0]?.contact_person_mobile);
                // setValue('buyerCountryCode', response?.result?.buyer_details[0]?.contact_person_country_code);
                const  buyerDetails = response.result.buyer_details[0];
                const buyerCountryCode = buyerDetails.contact_person_country_code || '';
                const buyerMobileNumber = buyerDetails.contact_person_mobile || '';
                const formattedBuyerPhoneNumber = `${buyerCountryCode} ${buyerMobileNumber}`;
                const newFormattedBuyerPhoneNumber = `${buyerCountryCode}-${buyerMobileNumber}`;
                setValue('buyerMobile', formattedBuyerPhoneNumber);
                setValue('newBuyerMobile',newFormattedBuyerPhoneNumber)

                // setValue('buyerRegNo',response?.result?.buyer_details[0]?.registration_no)
                const totalDueAmount = response?.result?.order_items.reduce((total, item) => total + parseFloat(item.total_amount), 0);
                setValue('totalDueAmount', totalDueAmount?.toFixed(2));
                setValue('orderItems', response?.result?.order_items)
                // setValue('paymentTerms', response?.result?.enquiry_details[0]?.payment_terms)
                const paymentTermsString = response?.result?.enquiry_details[0]?.payment_terms?.join('\n'); // Join with newline or ', ' for comma-separated
                setValue('paymentTerms', paymentTermsString);

                
                setOrderItems(response?.result?.order_items)
            } else {
                console.log('error in order list api', response);
            }
        });
    }, [navigate, supplierIdSessionStorage, supplierIdLocalStorage, setValue]);

    const onSubmit = (data) => {

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        const updatedOrderItems = orderItems.map(item => ({
            ...item,
            unit_tax: item?.medicine_details?.unit_tax
        }));
        // const newData = {
        //     ...data,
        //     value
        // }
        // const obj = {
        //     supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
        //     enquiry_id: inquiryDetails?.enquiry_id,
        //     purchaseOrder_id: purchaseOrderId,
        //     buyer_id: inquiryDetails?.buyer_id,
        //     // itemIds     : itemId,
        //     orderItems: updatedOrderItems,
        //     data : newData,
        //     totalAmount : roundedGrandTotalAmount
        // };
        const  buyerDetails = inquiryDetails.buyer_details[0];
        const buyerCountryCode = buyerDetails.contact_person_country_code || '';
    const buyerMobileNumber = buyerDetails.contact_person_mobile || '';
    const formattedBuyerPhoneNumber = formatPhoneNumber(buyerMobileNumber, buyerCountryCode);
    const  supplierDetails = inquiryDetails.supplier_details[0];
    const supplierCountryCode = supplierDetails.contact_person_country_code || '';
    const supplierMobileNumber = supplierDetails.contact_person_mobile || '';
    const formattedSupplierPhoneNumber = formatPhoneNumber(supplierMobileNumber, supplierCountryCode);

    // Prepare the object for submission
    const obj = {
        supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
        enquiry_id: inquiryDetails?.enquiry_id,
        purchaseOrder_id: purchaseOrderId,
        buyer_id: inquiryDetails?.buyer_id,
        orderItems: updatedOrderItems,
        data: {
            ...data,
            dueDate: value,
            buyerMobile: formattedBuyerPhoneNumber,
            newBuyerMobile: formattedBuyerPhoneNumber,
            newSupplierMobile: formattedSupplierPhoneNumber,
        },
        totalAmount: roundedGrandTotalAmount
    };
        console.log(obj);
        postRequestWithToken('buyer/order/create-orde', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, { type: 'success' })
                setTimeout(() => {
                    navigate('/supplier/order/active')
                }, 1000)
            } else {
                console.log('error in create-order api', response);
                toast(response.message, { type: 'error' })
            }
        });

    };

    const handleNumberInput = (event) => {
        const value = event.target.value;
        // Remove any non-numeric characters
        event.target.value = value.replace(/[^0-9]/g, '');
    };

    const grandTotalAmount = orderItems.reduce((total, item) => {
        // Convert item.total_amount to a number and add to total
        return total + (parseFloat(item?.total_amount) || 0);
    }, 0);

    // Optional: round grandTotalAmount to 2 decimal places
    const roundedGrandTotalAmount = parseFloat(grandTotalAmount.toFixed(2));

    const formatPhoneNumber = (phoneNumber, countryCode) => {
        // Remove non-numeric characters
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
        // Format based on length
        if (cleanedNumber.length <= 10) {
            // Shorter numbers
            return `+${countryCode}-${cleanedNumber}`;
        } else {
            // Longer numbers
            return `+${countryCode}-${cleanedNumber.slice(0, 6)}-${cleanedNumber.slice(6)}`;
        }
    };

    const handleBuyerPhoneChange = (value) => {
        // Extract country code and mobile number from the value
        const countryCode = value.split(' ')[0].replace('+', '');
        const mobileNumber = value.split(' ')[1] || '';
    
        // Format the phone number
        const formattedPhoneNumber = formatPhoneNumber(mobileNumber, countryCode);
    
        // Update the state with the formatted phone number
        setValue('buyerMobile', formattedPhoneNumber);
    };

    return (
        <div className={styles['create-invoice-container']}>
            <div className={styles['create-invoice-heading']}>Create Proforma Invoice</div>
            <form className={styles['craete-invoice-form']} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Supplier</div>
                    <div className={styles['create-invoice-inner-form-container']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierName' placeholder='Enter Name'
                                {...register('supplierName', { validate: value => value?.trim() !== '' || 'Supplier name is required' })} />
                        </div>
                        {errors.supplierName && <p>{errors.supplierName.message}</p>}
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Invoice Number</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                placeholder='Enter Invoice Number'
                                name='invoiceNumber'
                                value={invoiceNumber}
                                readOnly
                                {...register('invoiceNumber')} />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Invoice Generate Date</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='invoiceDate'
                                placeholder='Enter Invoice Generate Date'
                                value={currentDate}
                                readOnly
                                {...register('invoiceDate')} />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Payment Due Date</label>
                            <DatePicker
                                className={styles['create-invoice-div-input']}
                                onChange={onChange}
                                value={value}
                                minDate={new Date()}
                                clearIcon={null}
                                format="dd/MM/yyyy"
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Deposit Requested</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='depositRequested'
                                placeholder='Enter Deposit Requested'
                                {...register('depositRequested',{ validate: value => value?.trim() !== '' || 'Deposit requested is required' })}
                                // value={`USD ${watch('totalDueAmount') || ''}`}
                                onInput={handleNumberInput}
                                />
                                {errors.depositRequested && <p>{errors.depositRequested.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Deposit Due</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='depositDue'
                                placeholder='Enter Deposit Due'
                                {...register('depositDue',{ validate: value => value?.trim() !== '' || 'Deposit due is required' })}
                                onInput={handleNumberInput}
                                 />
                                 {errors.depositDue && <p>{errors.depositDue.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Total Due Amount</label>

                            <input className={styles['create-invoice-div-input']} type='text'
                                name='totalDueAmount'
                                placeholder='Enter Total Due Amount'
                                {...register('totalDueAmount',
                                   
                                )}
                                onInput={handleNumberInput}
                                />
                                
                                
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierEmail'
                                placeholder='Enter Email ID'
                                {...register('supplierEmail', { validate: value => value?.trim() !== '' || 'Supplier email is required' })} />
                            {errors.supplierEmail && <p>{errors.supplierEmail.message}</p>}
                        </div>

                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                            <PhoneInput
                            className='signup-form-section-phone-input'
                            defaultCountry="ae"
                            name='phoneinput'
                            value={watch('supplierMobile')}
                            onChange={(value) => setValue('supplierMobile', value)}
                            // {...register('supplierMobile', { 
                            //     required: 'Supplier mobile is required', 
                            //     validate: value => value?.trim() !== '' || 'Supplier mobile is required'
                            // })}
                            // {...register('supplierMobile', { validate: value => value?.trim() !== '' || 'Supplier mobile no. is required' })} 
                            // onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                        />
                            {errors.supplierMobile && <p>{errors.supplierMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierAddress'
                                placeholder='Enter Address'
                                {...register('supplierAddress', { validate: value => value?.trim() !== '' || 'Supplier address is required' })} />
                            {errors.supplierAddress && <p>{errors.supplierAddress.message}</p>}
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
                                {...register('buyerName', { validate: value => value?.trim() !== '' || 'Buyer name is required' })} />
                            {errors.buyerName && <p>{errors.buyerName.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='buyerEmail'
                                placeholder='Enter Email ID'
                                {...register('buyerEmail', { validate: value => value?.trim() !== '' || 'Buyer email is required' })} />
                            {errors.buyerEmail && <p>{errors.buyerEmail.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                            <PhoneInput
                            className='signup-form-section-phone-input'
                            defaultCountry="ae"
                            name='phoneinput'
                            value={watch('buyerMobile')}
                            // onChange={(value) => setValue('buyerMobile', value)}
                            onChange={handleBuyerPhoneChange}
                            // {...register('buyerMobile', { validate: value => value?.trim() !== '' || 'Buyer mobile no. is required' })} 
                            // onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                        />
                            {errors.buyerMobile && <p>{errors.buyerMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='buyerAddress'
                                placeholder='Enter Address'
                                {...register('buyerAddress', { validate: value => value?.trim() !== '' || 'Buyer address is required' })} />
                            {errors.buyerAddress && <p>{errors.buyerAddress.message}</p>}
                        </div>
                    </div>
                </div>
                <div className={styles['create-invoice-section']}>
                    {/* <div className={styles['create-invoice-add-item-cont']}>
                        <div className={styles['create-invoice-form-heading']}>Add Item</div>
                    </div> */}
                    {orderItems.map((item, index) => {
                        // grandTotalAmount += item?.total_amount
                        // grandTotalAmount = parseFloat(grandTotalAmount.toFixed(2));
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
                                    value={item?.unit_price}
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
                            {/* {formItems.length > 1 && (
                                <div className={styles['create-invoice-close-btn']} onClick={() => removeFormItem(item.id)}>
                                    <CloseIcon />
                                </div>
                            )} */}
                        </div>
                        )
                    }
                        
                    )}
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-textarea']}>
                            <label className={styles['create-invoice-div-label']}>Payment Terms</label>
                            {/* <textarea
                                className={styles['create-invoice-div-input']}
                                name="paymentTerms"
                                rows="4"
                                cols="10"
                                placeholder='Enter Payment Terms'
                                {...register('paymentTerms')}
                            /> */}
                            <textarea
                                className={styles['create-invoice-div-input']}
                                name="paymentTerms"
                                rows="4"
                                cols="10"
                                placeholder='Enter Payment Terms'
                                {...register('paymentTerms')}
                                readOnly 
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['craete-invoices-button']}>
                    <button type='submit' className={styles['create-invoices-submit']}>Save</button>
                    <div className={styles['create-invoices-cancel']}>Cancel</div>
                </div>
            </form>
        </div >
    );
}

export default EditProformaInvoice;







