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

const countryCodes = [
    '+1',    // USA, Canada
    '+7',    // Russia, Kazakhstan
    '+20',   // Egypt
    '+27',   // South Africa
    '+30',   // Greece
    '+31',   // Netherlands
    '+32',   // Belgium
    '+33',   // France
    '+34',   // Spain
    '+36',   // Hungary
    '+39',   // Italy
    '+40',   // Romania
    '+41',   // Switzerland
    '+43',   // Austria
    '+44',   // UK
    '+45',   // Denmark
    '+46',   // Sweden
    '+47',   // Norway
    '+48',   // Poland
    '+49',   // Germany
    '+51',   // Peru
    '+52',   // Mexico
    '+53',   // Cuba
    '+54',   // Argentina
    '+55',   // Brazil
    '+56',   // Chile
    '+57',   // Colombia
    '+58',   // Venezuela
    '+60',   // Malaysia
    '+61',   // Australia
    '+62',   // Indonesia
    '+63',   // Philippines
    '+64',   // New Zealand
    '+65',   // Singapore
    '+66',   // Thailand
    '+81',   // Japan
    '+82',   // South Korea
    '+84',   // Vietnam
    '+86',   // China
    '+90',   // Turkey
    '+91',   // India
    '+92',   // Pakistan
    '+93',   // Afghanistan
    '+94',   // Sri Lanka
    '+95',   // Myanmar
    '+98',   // Iran
    '+212',  // Morocco
    '+213',  // Algeria
    '+216',  // Tunisia
    '+218',  // Libya
    '+220',  // Gambia
    '+221',  // Senegal
    '+222',  // Mauritania
    '+223',  // Mali
    '+224',  // Guinea
    '+225',  // Côte d'Ivoire
    '+226',  // Burkina Faso
    '+227',  // Niger
    '+228',  // Togo
    '+229',  // Benin
    '+230',  // Mauritius
    '+231',  // Liberia
    '+232',  // Sierra Leone
    '+233',  // Ghana
    '+234',  // Nigeria
    '+235',  // Chad
    '+236',  // Central African Republic
    '+237',  // Cameroon
    '+238',  // Cape Verde
    '+239',  // São Tomé and Príncipe
    '+240',  // Equatorial Guinea
    '+241',  // Gabon
    '+242',  // Republic of the Congo
    '+243',  // Democratic Republic of the Congo
    '+244',  // Angola
    '+245',  // Guinea-Bissau
    '+246',  // British Indian Ocean Territory
    '+247',  // Ascension Island
    '+248',  // Seychelles
    '+249',  // Sudan
    '+250',  // Rwanda
    '+251',  // Ethiopia
    '+252',  // Somalia
    '+253',  // Djibouti
    '+254',  // Kenya
    '+255',  // Tanzania
    '+256',  // Uganda
    '+257',  // Burundi
    '+258',  // Mozambique
    '+260',  // Zambia
    '+261',  // Madagascar
    '+262',  // Réunion, Mayotte
    '+263',  // Zimbabwe
    '+264',  // Namibia
    '+265',  // Malawi
    '+266',  // Lesotho
    '+267',  // Botswana
    '+268',  // Eswatini
    '+269',  // Comoros
    '+290',  // Saint Helena
    '+291',  // Eritrea
    '+292',  // South Sudan
    '+293',  // Nauru
    '+294',  // Seychelles
    '+295',  // French Guiana
    '+296',  // Saint Pierre and Miquelon
    '+297',  // Aruba
    '+298',  // Faroe Islands
    '+299',  // Greenland
    '+350',  // Gibraltar
    '+351',  // Portugal
    '+352',  // Luxembourg
    '+353',  // Ireland
    '+354',  // Iceland
    '+355',  // Albania
    '+356',  // Malta
    '+357',  // Cyprus
    '+358',  // Finland
    '+359',  // Bulgaria
    '+370',  // Lithuania
    '+371',  // Latvia
    '+372',  // Estonia
    '+373',  // Moldova
    '+374',  // Armenia
    '+375',  // Belarus
    '+376',  // Andorra
    '+377',  // Monaco
    '+378',  // San Marino
    '+379',  // Vatican City
    '+380',  // Ukraine
    '+381',  // Serbia
    '+382',  // Montenegro
    '+383',  // Kosovo
    '+385',  // Croatia
    '+386',  // Slovenia
    '+387',  // Bosnia and Herzegovina
    '+388',  // Yugoslavia
    '+389',  // North Macedonia
    '+390',  // Vatican City
    '+391',  // San Marino
    '+392',  // Andorra
    '+393',  // Monaco
    '+394',  // Kosovo
    '+395',  // Vatican City
    '+396',  // San Marino
    '+397',  // Andorra
    '+398',  // Monaco
    '+399',  // Kosovo
    '+1869', // Saint Kitts and Nevis
    '+1876', // Jamaica
    '+1954', // Venezuela
];

const ProformaInvoice = () => {
    const { purchaseOrderId } = useParams();
    const navigate            = useNavigate();

    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

    const [currentDate, setCurrentDate] = useState('');
    const [dueDate, setDueDate] = useState('')
    const [invoiceNumber, setInvoiceNumber] = useState();
    const [inquiryDetails, setInquiryDetails] = useState();
    const [orderItems, setOrderItems] = useState([])
    const [dateError, setDateError] = useState('')
    const [dateValue, setDateValue] = useState();

    const handlePaymentDueDateChange = (e) => {
        setDateValue(e)
        setDateError(null)
    }

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
            buyerName: '',
            buyerAddress: '',
            buyerEmail: '',
            buyerMobile: '',
            newBuyerMobile: '',
            orderItems: [],
        }
    });

    useEffect(() => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
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

    }, [setValue]);

    useEffect(() => {
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            purchaseOrder_id: purchaseOrderId
        };
        postRequestWithToken('supplier/purchaseorder/get-po-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result);
                setValue('supplierName', response?.result?.supplier_details[0]?.supplier_name);
                setValue('supplierAddress', response?.result?.supplier_details[0]?.supplier_address);
                setValue('supplierEmail', response?.result?.supplier_details[0]?.contact_person_email);
                const supplierDetails = response.result.supplier_details[0];
                const countryCode = supplierDetails.contact_person_country_code || '';
                const mobileNumber = supplierDetails.contact_person_mobile_no || '';
                const formattedPhoneNumber = `${countryCode}${mobileNumber}`;
                const newFormattedPhoneNumber = `${countryCode}-${mobileNumber}`;
                setValue('supplierMobile', formattedPhoneNumber);
                setValue('newSupplierMobile',newFormattedPhoneNumber)
                setValue('buyerName', response?.result?.buyer_details[0]?.buyer_name);
                setValue('buyerAddress', response?.result?.buyer_details[0]?.buyer_address);
                setValue('buyerEmail', response?.result?.buyer_details[0]?.contact_person_email);
                const  buyerDetails = response.result.buyer_details[0];
                const buyerCountryCode = buyerDetails.contact_person_country_code || '';
                const buyerMobileNumber = buyerDetails.contact_person_mobile || '';
                const formattedBuyerPhoneNumber = `${buyerCountryCode} ${buyerMobileNumber}`;
                const newFormattedBuyerPhoneNumber = `${buyerCountryCode}-${buyerMobileNumber}`;
                setValue('buyerMobile', formattedBuyerPhoneNumber);
                setValue('newBuyerMobile',newFormattedBuyerPhoneNumber)
                const totalDueAmount = response?.result?.order_items.reduce((total, item) => total + parseFloat(item.total_amount), 0);
                setValue('totalDueAmount', totalDueAmount?.toFixed(2));
                setValue('orderItems', response?.result?.order_items)
                const paymentTermsString = response?.result?.enquiry_details[0]?.payment_terms?.join('\n'); 
                setValue('paymentTerms', paymentTermsString);
                setOrderItems(response?.result?.order_items)
                setValue('paymentDueDate', '');
            } else {
                console.log('error in order list api', response);
            }
        });
    }, [navigate, supplierIdSessionStorage, supplierIdLocalStorage, setValue]);

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
    
        return `${day}-${month}-${year}`;
    };
    
    const onSubmit = (data) => {
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        if (dateValue === undefined || dateValue === null || dateValue === '' ) {
            setDateError('Payment Due Date is Required');
            toast('Some fields are missing', {type: 'error'})
            return false;
        }
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
                ...data,
                dueDate: formatDate(dateValue),
                newBuyerMobile: formattedBuyerPhoneNumber,
                newSupplierMobile: formattedSupplierPhoneNumber,
            },
            totalAmount: roundedGrandTotalAmount
        };
        postRequestWithToken('buyer/order/create-order', obj, async (response) => {
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
        event.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'); 
    };

    const grandTotalAmount = orderItems.reduce((total, item) => {
        return total + (parseFloat(item?.total_amount) || 0);
    }, 0);

    const roundedGrandTotalAmount = parseFloat(grandTotalAmount.toFixed(2));

    const formatPhoneNumber = (phoneNumber, countryCode) => {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        return `+${countryCode}-${cleanedNumber}`;
    };
    
    const handleBuyerPhoneChange = (value) => {
        let countryCode = '';
        let mobileNumber = value;
    
        for (let code of countryCodes) {
            if (value.startsWith(code)) {
                countryCode = code.replace('+', ''); 
                mobileNumber = value.substring(code.length);
                break;
            }
        }
        if (countryCode && mobileNumber) {
            const formattedPhoneNumber = formatPhoneNumber(mobileNumber, countryCode);
            setValue('buyerMobile', formattedPhoneNumber);
        } else {
            console.error('Invalid phone number format or unknown country code');
        }
    };

    const handleSupplierPhoneChange = (value) => {
        let countryCode = '';
        let mobileNumber = value;
        for (let code of countryCodes) {
            if (value.startsWith(code)) {
                countryCode = code.replace('+', ''); 
                mobileNumber = value.substring(code.length); 
                break;
            }
        }
        if (countryCode && mobileNumber) {
            const formattedPhoneNumber = formatPhoneNumber(mobileNumber, countryCode);
            setValue('supplierMobile', formattedPhoneNumber);
        } else {
            console.error('Invalid phone number format or unknown country code');
        }
    };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
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
                                onChange={handlePaymentDueDateChange}
                                value={dateValue}
                                // minDate={new Date()}
                                minDate={tomorrow}
                                clearIcon={null}
                                format="dd/MM/yyyy"
                                placeholder='dd/MM/yyyy'
                            />
                             {dateError && <p style={{color: 'red'}}>{dateError}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Deposit Requested</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='depositRequested'
                                placeholder='Enter Deposit Requested'
                                {...register('depositRequested',{ validate: value => value?.trim() !== '' || 'Deposit Requested is Required' })}
                                onInput={handleNumberInput}
                                />
                                {errors.depositRequested && <p style={{color: 'red'}}>{errors.depositRequested.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Deposit Due</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='depositDue'
                                placeholder='Enter Deposit Due'
                                {...register('depositDue',{ validate: value => value?.trim() !== '' || 'Deposit Due is Required' })}
                                onInput={handleNumberInput}
                                 />
                                 {errors.depositDue && <p style={{color: 'red'}}>{errors.depositDue.message}</p>}
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
                            {errors.supplierEmail && <p style={{color: 'red'}}>{errors.supplierEmail.message}</p>}
                        </div>

                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                            <PhoneInput
                            className='signup-form-section-phone-input'
                            defaultCountry="ae"
                            name='phoneinput'
                            value={watch('supplierMobile')}
                            onChange={handleSupplierPhoneChange}
                        />
                            {errors.supplierMobile && <p style={{color: 'red'}}>{errors.supplierMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierAddress'
                                placeholder='Enter Address'
                                {...register('supplierAddress', { validate: value => value?.trim() !== '' || 'Supplier address is required' })} />
                            {errors.supplierAddress && <p style={{color: 'red'}}>{errors.supplierAddress.message}</p>}
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
                                {...register('buyerName', { validate: value => value?.trim() !== '' || 'Buyer name is required' })} />
                            {errors.buyerName && <p style={{color: 'red'}}>{errors.buyerName.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='buyerEmail'
                                placeholder='Enter Email ID'
                                readOnly
                                {...register('buyerEmail', { validate: value => value?.trim() !== '' || 'Buyer email is required' })} />
                            {errors.buyerEmail && <p style={{color: 'red'}}>{errors.buyerEmail.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                            <PhoneInput
                            className='signup-form-section-phone-input'
                            defaultCountry="ae"
                            name='phoneinput'
                            value={watch('buyerMobile')}
                            disabled
                            onChange={handleBuyerPhoneChange}
                        />
                            {errors.buyerMobile && <p style={{color: 'red'}}>{errors.buyerMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='buyerAddress'
                                placeholder='Enter Address'
                                readOnly
                                {...register('buyerAddress', { validate: value => value?.trim() !== '' || 'Buyer address is required' })} />
                            {errors.buyerAddress && <p style={{color: 'red'}}>{errors.buyerAddress.message}</p>}
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
                                {...register('paymentTerms')}
                                readOnly 
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['craete-invoices-button']}>
                    <button type='submit' className={styles['create-invoices-submit']}>Create Proforma Invoice</button>
                    <div className={styles['create-invoices-cancel']}>Cancel</div>
                </div>
            </form>
        </div >
    );
}

export default ProformaInvoice;





