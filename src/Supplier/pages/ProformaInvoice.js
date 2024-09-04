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

const phoneValidationRules = {
    '1': /^\d{10}$/,                // USA/Canada: 10 digits
    '44': /^(\d{10}|\d{11})$/,      // UK: 10 or 11 digits
    '33': /^\d{10}$/,                // France: 10 digits
    '49': /^\d{11,14}$/,             // Germany: 11 to 14 digits (including country code)
    '91': /^[6-9]\d{9}$/,            // India: 10 digits, starts with 6-9
    '81': /^\d{10}$/,                // Japan: 10 digits
    '82': /^\d{10}$/,                // South Korea: 10 digits
    '61': /^(\d{9}|\d{10})$/,        // Australia: 9 or 10 digits
    '971': /^\d{7,9}$/,              // UAE: 7 to 9 digits
    '55': /^\d{10,11}$/,             // Brazil: 10 or 11 digits
    '27': /^\d{10}$/,                // South Africa: 10 digits
    '52': /^\d{10}$/,                // Mexico: 10 digits
    '46': /^\d{6,11}$/,              // Sweden: 6 to 11 digits
    '34': /^\d{9}$/,                 // Spain: 9 digits
    '64': /^\d{9}$/,                 // New Zealand: 9 digits
    '39': /^\d{10}$/,                // Italy: 10 digits
    '55': /^\d{11}$/,                // Brazil: 11 digits (often with 2-digit area code, note that '55' is duplicated)
    '27': /^\d{10}$/,                // South Africa: 10 digits
    '53': /^\d{8}$/,                 // Cuba: 8 digits
    '20': /^\d{10}$/,                // Egypt: 10 digits
    '90': /^\d{10}$/,                // Turkey: 10 digits
    '7': /^(\d{10}|\d{11})$/,        // Russia: 10 or 11 digits
    '44': /^(\d{10}|\d{11})$/,       // UK: 10 or 11 digits
    '91': /^[6-9]\d{9}$/,            // India: 10 digits, starts with 6-9
    '52': /^\d{10}$/,                // Mexico: 10 digits
    '55': /^\d{11}$/,                // Brazil: 11 digits
    '91': /^[6-9]\d{9}$/,            // India: 10 digits
    '971': /^\d{7,9}$/,              // UAE: 7 to 9 digits
    '60': /^\d{9,10}$/,              // Malaysia: 9 or 10 digits
    '62': /^\d{10,13}$/,             // Indonesia: 10 to 13 digits
    '63': /^\d{10}$/,                // Philippines: 10 digits
    '86': /^\d{11}$/,                // China: 11 digits
    '90': /^\d{10}$/,                // Turkey: 10 digits
    '98': /^\d{10}$/,                // Iran: 10 digits
    '92': /^\d{10}$/,                // Pakistan: 10 digits
    '94': /^\d{10}$/,                // Sri Lanka: 10 digits
    '91': /^[6-9]\d{9}$/,            // India: 10 digits
    '20': /^\d{10}$/,                // Egypt: 10 digits
    '27': /^\d{10}$/,                // South Africa: 10 digits
    '41': /^\d{10}$/,                // Switzerland: 10 digits
    '47': /^\d{8}$/,                 // Norway: 8 digits
    '48': /^\d{9}$/,                 // Poland: 9 digits
    '30': /^\d{10}$/,                // Greece: 10 digits
    '31': /^\d{10}$/,                // Netherlands: 10 digits
    '32': /^\d{9}$/,                 // Belgium: 9 digits
    '33': /^\d{10}$/,                // France: 10 digits
    '34': /^\d{9}$/,                 // Spain: 9 digits
    '35': /^\d{8,9}$/,              // Portugal: 8 or 9 digits
    '36': /^\d{9}$/,                // Hungary: 9 digits
    '37': /^\d{8}$/,                // Moldova: 8 digits
    '38': /^\d{9}$/,                // Slovenia:

    '38': /^\d{9}$/,                // Slovenia: 9 digits
    '39': /^\d{10}$/,               // Italy: 10 digits
    '40': /^\d{10}$/,               // Romania: 10 digits
    '41': /^\d{10}$/,               // Switzerland: 10 digits
    '42': /^\d{9}$/,                // Slovakia: 9 digits
    '43': /^\d{10}$/,               // Austria: 10 digits
    '44': /^(\d{10}|\d{11})$/,     // UK: 10 or 11 digits (note this is duplicated in the list)
    '45': /^\d{8}$/,                // Denmark: 8 digits
    '46': /^\d{6,11}$/,             // Sweden: 6 to 11 digits
    '47': /^\d{8}$/,                // Norway: 8 digits
    '48': /^\d{9}$/,                // Poland: 9 digits
    '49': /^\d{11,14}$/,            // Germany: 11 to 14 digits (including country code)
    '50': /^\d{10}$/,               // Mongolia: 10 digits
    '51': /^\d{9}$/,                // Peru: 9 digits
    '52': /^\d{10}$/,               // Mexico: 10 digits
    '53': /^\d{8}$/,                // Cuba: 8 digits
    '54': /^\d{10}$/,               // Argentina: 10 digits
    '55': /^\d{11}$/,               // Brazil: 11 digits
    '56': /^\d{9}$/,                // Chile: 9 digits
    '57': /^\d{10}$/,               // Colombia: 10 digits
    '58': /^\d{11}$/,               // Venezuela: 11 digits
    '60': /^\d{9,10}$/,             // Malaysia: 9 or 10 digits
    '61': /^(\d{9}|\d{10})$/,       // Australia: 9 or 10 digits
    '62': /^\d{10,13}$/,            // Indonesia: 10 to 13 digits
    '63': /^\d{10}$/,               // Philippines: 10 digits
    '64': /^\d{9}$/,                // New Zealand: 9 digits
    '65': /^\d{8}$/,                // Singapore: 8 digits
    '66': /^\d{9,10}$/,             // Thailand: 9 or 10 digits
    '81': /^\d{10}$/,               // Japan: 10 digits
    '82': /^\d{10}$/,               // South Korea: 10 digits
    '84': /^\d{10}$/,               // Vietnam: 10 digits
    '86': /^\d{11}$/,               // China: 11 digits
    '90': /^\d{10}$/,               // Turkey: 10 digits
    '92': /^\d{10}$/,               // Pakistan: 10 digits
    '93': /^\d{9}$/,                // Afghanistan: 9 digits
    '94': /^\d{10}$/,               // Sri Lanka: 10 digits
    '98': /^\d{10}$/,               // Iran: 10 digits
    '992': /^\d{9}$/,              // Tajikistan: 9 digits
    '993': /^\d{9}$/,              // Turkmenistan: 9 digits
    '994': /^\d{9}$/,              // Azerbaijan: 9 digits
    '995': /^\d{9}$/,              // Georgia: 9 digits
    '996': /^\d{9}$/,              // Kyrgyzstan: 9 digits
    '998': /^\d{9}$/,              // Uzbekistan: 9 digits
    '213': /^\d{9}$/,              // Algeria: 9 digits
    '216': /^\d{8}$/,              // Tunisia: 8 digits
    '218': /^\d{9}$/,              // Libya: 9 digits
    '220': /^\d{7}$/,              // Gambia: 7 digits
    '221': /^\d{9}$/,              // Senegal: 9 digits
    '222': /^\d{8}$/,              // Mauritania: 8 digits
    '223': /^\d{8}$/,              // Mali: 8 digits
    '224': /^\d{9}$/,              // Guinea: 9 digits
    '225': /^\d{8}$/,              // Côte d'Ivoire: 8 digits
    '226': /^\d{8}$/,              // Burkina Faso: 8 digits
    '227': /^\d{8}$/,              // Niger: 8 digits
    '228': /^\d{8}$/,              // Togo: 8 digits
    '229': /^\d{8}$/,              // Benin: 8 digits
    '230': /^\d{7}$/,              // Mauritius: 7 digits
    '231': /^\d{7}$/,              // Liberia: 7 digits
    '232': /^\d{8}$/,              // Sierra Leone: 8 digits
    '233': /^\d{10}$/,             // Ghana: 10 digits
    '234': /^\d{10}$/,             // Nigeria: 10 digits
    '235': /^\d{8}$/,              // Chad: 8 digits
    '236': /^\d{8}$/,              // Central African Republic: 8 digits
    '237': /^\d{9}$/,              // Cameroon: 9 digits
    '238': /^\d{7}$/,              // Cape Verde: 7 digits
    '239': /^\d{7}$/,              // São Tomé and Príncipe: 7 digits
}

const ProformaInvoice = () => {
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
            totalDueAmount : ''
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
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            purchaseOrder_id: purchaseOrderId
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
                    totalDueAmount : data?.total_amount,
                    paymentTerms : paymentTermsString
                }));
                setOrderItems(data?.order_items)
            } else {
                console.log('error in order list api', response);
            }
        });
    }, [navigate, supplierIdSessionStorage, supplierIdLocalStorage]);

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

    const resetForm = () => {
    
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

        // if(!formData.suppl) formErrors.buyerRegNo = 'Buyer VAT Reg No. is Required'
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }

    const handleCancel = () => {
        resetForm()
    }
    const validateSupplierMobile = (mobile) => {
        // This regex matches strings that start with a country code like +91 or +971
        // and ensures that there's at least one digit after the country code.
        const validMobileRegex = /^\+\d{1,3}-?\d{5,14}$/;
    
        return validMobileRegex.test(mobile);
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        // if (dateValue === undefined || dateValue === null || dateValue === '' ) {
        //     setDateError('Payment Due Date is Required');
        //     toast('Some fields are missing', {type: 'error'})
        //     return false;
        // }
        // if (!validateSupplierMobile(data.supplierMobile)) {
        //     setMobileError('Supplier Mobile No is Invalid or Required');
        //     toast('Supplier Mobile No is Invalid or Required', { type: 'error' });
        //     return false;
        // }

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
        const cleanedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    
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

    const handlePhoneChange = (value, type) => {
        let countryCode = '';
        let mobileNumber = value;
        let isValidNumber = false;
    
        // Extract the country code and the mobile number
        for (let code of countryCodes) {
            if (value.startsWith(code)) {
                countryCode = code.replace('+', ''); 
                mobileNumber = value.substring(code.length); 
                break;
            }
        }
    
        // Validate the phone number based on the country code
        if (countryCode && mobileNumber) {
            isValidNumber = validatePhoneNumber(mobileNumber, countryCode);
    
            if (isValidNumber) {
                const formattedPhoneNumber = formatPhoneNumber(mobileNumber, countryCode);
                console.log("formattedPhoneNumber", formattedPhoneNumber);
    
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
                                readOnly
                                value={formData.totalDueAmount}
                                // onInput={handleNumberInput}
                                />
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
                            defaultCountry="ae"
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





