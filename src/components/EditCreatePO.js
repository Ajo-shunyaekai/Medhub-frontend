import React, { useEffect, useState } from 'react';
import styles from '../style/createInvoice.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
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

const EditCreatePO = () => {
    const { purchaseOrderId } = useParams()
    const navigate            = useNavigate();

    const [poDetails, setPoDetails] = useState();

    const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            poDate: '',
            poNumber: '',
            supplierName: '',
            supplierAddress: '',
            supplierEmail: '',
            supplierMobile: '',
            supplierRegNo: '',
            buyerName: '',
            buyerAddress: '',
            buyerEmail: '',
            buyerMobile: '',
            buyerRegNo: '',
            orderItems: [],
            description: ''
        }
    });

    useEffect(() => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const obj = {
            buyer_id         : buyerIdSessionStorage || buyerIdLocalStorage,
            purchaseOrder_id : purchaseOrderId,
        };
        postRequestWithToken('buyer/purchaseorder/get-po-details', obj, async (response) => {
            if (response.code === 200) {
                setPoDetails(response?.result);
                setValue('poId', response?.result?.purchaseOrder_id);
                setValue('poDate', response?.result?.po_date);
                setValue('poNumber', response?.result?.po_number);
                setValue('description', response?.result?.additional_instructions);
                setValue('poStatus', response?.result?.po_status);
                setValue('buyerName', response?.result?.buyer_name);
                setValue('buyerEmail', response?.result?.buyer_email);
                // setValue('buyerMobile', response?.result?.buyer_mobile);
                const buyerDetails = response.result;
                const buyerCountryCode = buyerDetails.buyer_country_code || '';
                const buyerMobileNumber = buyerDetails.buyer_mobile || '';
                const buyerFormattedPhoneNumber = `${buyerCountryCode}${buyerMobileNumber}`;
                setValue('buyerMobile', buyerFormattedPhoneNumber);
                setValue('buyerAddress', response?.result?.buyer_address);
                setValue('buyerRegNo', response?.result?.buyer_regNo);
                setValue('supplierName', response?.result?.supplier_name);
                setValue('supplierEmail', response?.result?.supplier_email);
                // setValue('supplierMobile', response?.result?.supplier_mobile);
                const supplierDetails = response.result;
                const countryCode = supplierDetails.supplier_country_code || '';
                const mobileNumber = supplierDetails.supplier_mobile || '';
                const formattedPhoneNumber = `${countryCode}${mobileNumber}`;
                setValue('supplierMobile', formattedPhoneNumber);
                setValue('supplierAddress', response?.result?.supplier_address);
                setValue('supplierRegNo', response?.result?.supplier_regNo);
                setValue('orderItems', response?.result?.order_items);
            } else {
                console.log('error in order list api', response);
            }
        });
    }, [navigate, buyerIdSessionStorage, buyerIdLocalStorage, purchaseOrderId, setValue]);

    const onSubmit = (data) => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const supplierId = poDetails?.supplier_details[0]?.supplier_id;  
        const enquiryId  = poDetails?.enquiry_id;    

        const obj = {
            buyer_id         : buyerIdSessionStorage || buyerIdLocalStorage,
            purchaseOrder_id : purchaseOrderId,
            supplier_id      : supplierId,
            enquiry_id       : enquiryId,
            data
        };
        postRequestWithToken('buyer/purchaseorder/edit-po', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, {type: 'success'})
                setTimeout(() => {
                    navigate('/buyer/inquiry-purchase-orders/purchased')
                },1000)
            } else {
                console.log('error in order list api', response);
                toast(response.message, {type: 'error'})
            }
        });
    };

    const formatPhoneNumber = (phoneNumber, countryCode) => {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        return `+${countryCode}-${cleanedNumber}`;
    };
    
    const handlePhoneChange = (value, type) => {
        let countryCode = '';
        let mobileNumber = value;
        for (let code of countryCodes) {
            if (value.startsWith(code)) {
                countryCode = code.replace('+', ''); // Remove the '+'
                mobileNumber = value.substring(code.length); 
                break;
            }
        }
        if (countryCode && mobileNumber) {
            const formattedPhoneNumber = formatPhoneNumber(mobileNumber, countryCode);
            console.log("formattedPhoneNumber", formattedPhoneNumber);
            setValue(type, formattedPhoneNumber);
        } else {
            console.error('Invalid phone number format or unknown country code');
        }
    };

    return (
        <div className={styles['create-invoice-container']}>
            <div className={styles['create-invoice-heading']}>Edit Purchase Order</div>
            <form className={styles['create-po-main-form-container']} onSubmit={handleSubmit(onSubmit)}>
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
                                {...register('buyerName', { validate: value => value.trim() !== '' || 'Buyer name is required' })}
                            />
                            {errors.buyerName && <p>{errors.buyerName.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='buyerAddress'
                                placeholder='Enter Address'
                                {...register('buyerAddress', { validate: value => value.trim() !== '' || 'Buyer address is required' })}
                            />
                            {errors.buyerAddress && <p>{errors.buyerAddress.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='email'
                                name='buyerEmail'
                                placeholder='Enter Email ID'
                                {...register('buyerEmail', { validate: value => value.trim() !== '' || 'Buyer email is required' })}
                            />
                            {errors.buyerEmail && <p>{errors.buyerEmail.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile Number</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name='buyerMobile'
                                value={watch('buyerMobile')}
                                placeholder='Enter Mobile No.'
                                onChange={(value) => handlePhoneChange(value, 'buyerMobile')}
                                // {...register('buyerMobile', { validate: value => value.trim() !== '' || 'Buyer mobile number is required' })}
                            />
                            {errors.buyerMobile && <p>{errors.buyerMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Company Registration Number</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='buyerRegNo'
                                placeholder='Enter Company Registration Number'
                                {...register('buyerRegNo', { validate: value => value.trim() !== '' || 'Buyer registration number is required' })}
                            />
                            {errors.buyerRegNo && <p>{errors.buyerRegNo.message}</p>}
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
                                // value={currentDate}
                                readOnly
                                {...register('poDate')}
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>PO Number</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='poNumber'
                                // value={poNumber}
                                readOnly
                                {...register('poNumber')}
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
                                {...register('supplierName', { validate: value => value.trim() !== '' || 'Supplier name is required' })}
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
                                readOnly
                                {...register('supplierAddress', { validate: value => value.trim() !== '' || 'Supplier address is required' })}
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
                                readOnly
                                {...register('supplierEmail', { validate: value => value.trim() !== '' || 'Supplier email is required' })}
                            />
                            {errors.supplierEmail && <p>{errors.supplierEmail.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile Number</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name='supplierMobile'
                                value={watch('supplierMobile')}
                                disabled
                                placeholder='Enter Mobile No.'
                                onChange={(value) => handlePhoneChange(value, 'supplierMobile')}
                                // {...register('supplierMobile', { validate: value => value.trim() !== '' || 'Supplier mobile number is required' })}
                            />
                            {errors.supplierMobile && <p>{errors.supplierMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Company Registration Number</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='supplierRegNo'
                                placeholder='Enter Company Registration Number'
                                readOnly
                                {...register('supplierRegNo', { validate: value => value.trim() !== '' || 'Supplier registration number is required' })}
                            />
                            {errors.supplierRegNo && <p>{errors.supplierRegNo.message}</p>}
                        </div>
                    </div>
                </div>
               
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-add-item-cont']}>
                        <div className={styles['create-invoice-form-heading']}>Order Details</div>
                    </div>
                    {poDetails?.order_items?.map((item, index) => (
                        <div className={styles['form-item-container']} key={item._id}>
                            <div className={styles['craete-invoice-form']}>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Item Name</label>
                                    <input
                                        className={styles['create-invoice-div-input']}
                                        type='text'
                                        name={`orderItems[${index}].productName`}
                                        placeholder='Item Name'
                                        value = {item?.medicine_details?.medicine_name}
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
                                        value = {item?.quantity_required}
                                        readOnly
                                    />
                                    {errors.orderItems?.[index]?.quantity && <p>{errors.orderItems[index].quantity.message}</p>}
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Unit Price</label>
                                    <input
                                        className={styles['create-invoice-div-input']}
                                        type='text'
                                        name={`orderItems[${index}].unitPrice`}
                                        placeholder='Enter Unit Price'
                                        value = {item?.unit_price}
                                        readOnly
                                    />
                                    {errors.orderItems?.[index]?.unitPrice && <p>{errors.orderItems[index].unitPrice.message}</p>}
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Total Amount</label>
                                    <input
                                        className={styles['create-invoice-div-input']}
                                        type='text'
                                        name={`orderItems[${index}].totalAmount`}
                                        placeholder='Enter Total Amount'
                                        value = {item?.total_amount || item?.counter_price} 
                                        readOnly
                                    />
                                    {errors.orderItems?.[index]?.totalAmount && <p>{errors.orderItems[index].totalAmount.message}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
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
                                {...register('description')}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['craete-invoices-button']}>
                <button type='submit' className={styles['create-invoices-submit']}>Edit</button>
                    <div className={styles['create-invoices-cancel']}>Cancel</div>
                   
                </div>
            </form>
        </div>
    );
};

export default EditCreatePO;