import React, { useEffect, useState } from 'react';
import styles from '../style/createInvoice.module.css';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import { PhoneInput } from 'react-international-phone';
import CreatePOImageUpload from './CreatePOImageUpload';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

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

const CreatePO = () => {
    const { inquiryId } = useParams();
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState('');
    const [poNumber, setPONumber] = useState();
    const [orderItems, setOrderItems] = useState([]);
    const [inquiryDetails, setInquiryDetails] = useState();
    const [itemId, setItemId] = useState([])

    const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage.getItem("buyer_id");
    let grandTotalAmount = 0;


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
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = today.getFullYear();
        setCurrentDate(`${day}-${month}-${year}`);
        setValue('poDate', `${day}-${month}-${year}`);

        const generateRandomNumber = () => Math.floor(10000000 + Math.random() * 90000000);
        setPONumber(generateRandomNumber());
        setValue('poNumber', generateRandomNumber());

        const storedItems = sessionStorage.getItem('acceptedQuotationItems');
        if (storedItems) {
            try {
                const parsedItems = JSON.parse(storedItems);
                setOrderItems(parsedItems);
                setValue('orderItems', parsedItems);
                const itemIds = parsedItems.map(item => item._id);
                setItemId(itemIds);
            } catch (error) {
                console.error('Error parsing stored items:', error);
            }
        }
    }, [setValue]);

    useEffect(() => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            enquiry_id: inquiryId,
        };
        postRequestWithToken('buyer/enquiry/enquiry-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result);
                setValue('supplierName', response?.result?.supplier?.supplier_name);
                setValue('supplierAddress', response?.result?.supplier?.supplier_address);
                setValue('supplierEmail', response?.result?.supplier?.contact_person_email);
                // setValue('supplierMobile', response?.result?.supplier?.contact_person_mobile_no);

                const supplierDetails = response.result.supplier;
                const countryCode = supplierDetails.contact_person_country_code || '';
                const mobileNumber = supplierDetails.contact_person_mobile_no || '';
                const formattedPhoneNumber = `${countryCode}${mobileNumber}`;
                setValue('supplierMobile', formattedPhoneNumber);
                // const newFormattedPhoneNumber = `${countryCode}-${mobileNumber}`;

                setValue('supplierRegNo', response?.result?.supplier?.registration_no)
                setValue('buyerName', response?.result?.buyer?.buyer_name);
                setValue('buyerAddress', response?.result?.buyer?.buyer_address);
                setValue('buyerEmail', response?.result?.buyer?.contact_person_email);
                // setValue('buyerMobile', response?.result?.buyer?.contact_person_mobile);

                const buyerDetails = response.result.buyer;
                const buyerCountryCode = buyerDetails.contact_person_country_code || '';
                const buyerMobileNumber = buyerDetails.contact_person_mobile || '';
                const buyerFormattedPhoneNumber = `${buyerCountryCode}${buyerMobileNumber}`;
                setValue('buyerMobile', buyerFormattedPhoneNumber);
                setValue('buyerRegNo', response?.result?.buyer?.registration_no)
            } else {
                console.log('error in order list api', response);
            }
        });
    }, [navigate, buyerIdSessionStorage, buyerIdLocalStorage, inquiryId, setValue]);


    const onSubmit = (data) => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const updatedOrderItems = orderItems.map((item) => {
            const unitTax = item.medicine_details.unit_tax || 0;
            const totalPrice = (item?.counter_price || item?.target_price) * item.quantity_required;
            const totalTax = totalPrice * (unitTax / 100);
            const totalAmount = totalPrice + totalTax;

            return {
                ...item,
                totalAmount: totalAmount,
            };
        });
        const newData = {
            ...data,
            orderItems: updatedOrderItems,
        };
        const obj = {
            buyer_id : buyerIdSessionStorage || buyerIdLocalStorage,
            enquiry_id: inquiryId,
            supplier_id: inquiryDetails?.supplier?.supplier_id,
            itemIds: itemId,
            data: newData,
            grandTotalAmount
        };
        console.log(obj);
        postRequestWithToken('buyer/purchaseorder/create-po', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, { type: 'success' })
                setTimeout(() => {
                    navigate('/buyer/inquiry-purchase-orders/purchased')
                }, 1000)
            } else {
                console.log('error in order list api', response);
                toast(response.message, { type: 'error' })
            }
        });
    };

    // const formatPhoneNumber = (phoneNumber, countryCode) => {
    //     // Remove non-numeric characters from the phone number
    //     const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    //     // Format as +countryCode-number
    //     return `+${countryCode}-${cleanedNumber}`;
    // };

    // const handleSupplierPhoneChange = (value) => {
    //     // console.log("value", value);
        
    //     let countryCode = '';
    //     let mobileNumber = value;
    
    //     // Find the longest matching country code
    //     for (let code of countryCodes) {
    //         if (value.startsWith(code)) {
    //             countryCode = code.replace('+', ''); // Remove the '+'
    //             mobileNumber = value.substring(code.length); // Remaining part of the string
    //             break;
    //         }
    //     }
    //     if (countryCode && mobileNumber) {
    //         // Format the phone number
    //         const formattedPhoneNumber = formatPhoneNumber(mobileNumber, countryCode);
            
    //         console.log("formattedPhoneNumber", formattedPhoneNumber);
            
    //         // Update the state with the formatted phone number
    //         setValue('supplierMobile', formattedPhoneNumber);
    //     } else {
    //         // Handle case where no country code is found or invalid value
    //         console.error('Invalid phone number format or unknown country code');
    //     }
    // };

    // const handleBuyerPhoneChange = (value) => {
    //     // console.log("value", value);
        
    //     let countryCode = '';
    //     let mobileNumber = value;
    
    //     // Find the longest matching country code
    //     for (let code of countryCodes) {
    //         if (value.startsWith(code)) {
    //             countryCode = code.replace('+', ''); // Remove the '+'
    //             mobileNumber = value.substring(code.length); // Remaining part of the string
    //             break;
    //         }
    //     }
    
    //     if (countryCode && mobileNumber) {
    //         // Format the phone number
    //         const formattedPhoneNumber = formatPhoneNumber(mobileNumber, countryCode);
            
    //         console.log("formattedPhoneNumber", formattedPhoneNumber);
            
    //         // Update the state with the formatted phone number
    //         setValue('buyerMobile', formattedPhoneNumber);
    //     } else {
    //         // Handle case where no country code is found or invalid value
    //         console.error('Invalid phone number format or unknown country code');
    //     }
    // };

    const formatPhoneNumber = (phoneNumber, countryCode) => {
        // Remove non-numeric characters from the phone number
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        
        // Format as +countryCode-number
        return `+${countryCode}-${cleanedNumber}`;
    };
    
    const handlePhoneChange = (value, type) => {
        let countryCode = '';
        let mobileNumber = value;
    
        // Find the longest matching country code
        for (let code of countryCodes) {
            if (value.startsWith(code)) {
                countryCode = code.replace('+', ''); // Remove the '+'
                mobileNumber = value.substring(code.length); // Remaining part of the string
                break;
            }
        }
    
        if (countryCode && mobileNumber) {
            // Format the phone number
            const formattedPhoneNumber = formatPhoneNumber(mobileNumber, countryCode);
    
            console.log("formattedPhoneNumber", formattedPhoneNumber);
    
            // Update the state with the formatted phone number
            setValue(type, formattedPhoneNumber);
        } else {
            // Handle case where no country code is found or invalid value
            console.error('Invalid phone number format or unknown country code');
        }
    };

    return (
        <div className={styles['create-invoice-container']}>
            <div className={styles['create-invoice-heading']}>Create Purchase Order</div>
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
                                //  onChange={handleBuyerPhoneChange}
                                onChange={(value) => handlePhoneChange(value, 'buyerMobile')}
                           
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
                                value={currentDate}
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
                                value={poNumber}
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
                                // onChange={handleSupplierPhoneChange}
                                onChange={(value) => handlePhoneChange(value, 'supplierMobile')}
                                
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
                                {...register('description')}
                            />
                        </div>
                        {/* <div className={styles['create-invoice-div-textarea']}>
                            <label className={styles['create-invoice-div-label']}>Payment Terms</label>
                            <textarea
                                className={styles['create-invoice-div-input']}
                                name="description"
                                rows="4"
                                cols="10"
                                placeholder='Enter Payment Terms'
                                {...register('description')}
                            />
                        </div> */}
                    </div>
                </div>
                <div className={styles['craete-invoices-button']}>
                    <button type='submit' className={styles['create-invoices-submit']}>Submit</button>
                    <div className={styles['create-invoices-cancel']}>Cancel</div>
                </div>
            </form>
        </div>
    );
};

export default CreatePO;