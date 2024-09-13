import React, { useEffect, useState } from 'react';
import styles from '../style/ordermodal.module.css';
import { postRequestWithToken } from '../api/Requests';
import { PhoneInput } from 'react-international-phone';
import { toast } from 'react-toastify';
import '../style/ordermodal.css'
import Select, { components } from 'react-select';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import {
    CitySelect,
    CountrySelect,
    StateSelect,
    LanguageSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const countryCodeMap = {
    '+1': 'us', // USA
    '+20': 'eg', // Egypt
    '+27': 'za', // South Africa
    '+30': 'gr', // Greece
    '+31': 'nl', // Netherlands
    '+32': 'be', // Belgium
    '+33': 'fr', // France
    '+34': 'es', // Spain
    '+36': 'hu', // Hungary
    '+39': 'it', // Italy
    '+40': 'ro', // Romania
    '+41': 'ch', // Switzerland
    '+42': 'cz', // Czech Republic
    '+43': 'at', // Austria
    '+44': 'gb', // United Kingdom
    '+45': 'dk', // Denmark
    '+46': 'se', // Sweden
    '+47': 'no', // Norway
    '+48': 'pl', // Poland
    '+49': 'de', // Germany
    '+51': 'pe', // Peru
    '+52': 'mx', // Mexico
    '+53': 'cu', // Cuba
    '+54': 'ar', // Argentina
    '+55': 'br', // Brazil
    '+56': 'cl', // Chile
    '+57': 'co', // Colombia
    '+58': 've', // Venezuela
    '+60': 'my', // Malaysia
    '+61': 'au', // Australia
    '+62': 'id', // Indonesia
    '+63': 'ph', // Philippines
    '+64': 'nz', // New Zealand
    '+65': 'sg', // Singapore
    '+66': 'th', // Thailand
    '+81': 'jp', // Japan
    '+82': 'kr', // South Korea
    '+84': 'vn', // Vietnam
    '+86': 'cn', // China
    '+90': 'tr', // Turkey
    '+91': 'in', // India
    '+92': 'pk', // Pakistan
    '+93': 'af', // Afghanistan
    '+94': 'lk', // Sri Lanka
    '+95': 'mm', // Myanmar
    '+98': 'ir', // Iran
    '+211': 'ss', // South Sudan
    '+212': 'ma', // Morocco
    '+213': 'dz', // Algeria
    '+216': 'tn', // Tunisia
    '+218': 'ly', // Libya
    '+220': 'gm', // Gambia
    '+221': 'sn', // Senegal
    '+222': 'mr', // Mauritania
    '+223': 'ml', // Mali
    '+224': 'gn', // Guinea
    '+225': 'ci', // Ivory Coast
    '+226': 'bf', // Burkina Faso
    '+227': 'ne', // Niger
    '+228': 'tg', // Togo
    '+229': 'bj', // Benin
    '+230': 'mu', // Mauritius
    '+231': 'lr', // Liberia
    '+232': 'sl', // Sierra Leone
    '+233': 'gh', // Ghana
    '+234': 'ng', // Nigeria
    '+235': 'td', // Chad
    '+236': 'cf', // Central African Republic
    '+237': 'cm', // Cameroon
    '+238': 'cv', // Cape Verde
    '+239': 'st', // São Tomé and Príncipe
    '+240': 'gq', // Equatorial Guinea
    '+241': 'ga', // Gabon
    '+242': 'cg', // Republic of the Congo
    '+243': 'cd', // Democratic Republic of the Congo
    '+244': 'ao', // Angola
    '+245': 'gw', // Guinea-Bissau
    '+246': 'io', // British Indian Ocean Territory
    '+247': 'ac', // Ascension Island
    '+248': 'sc', // Seychelles
    '+249': 'sd', // Sudan
    '+250': 'rw', // Rwanda
    '+251': 'et', // Ethiopia
    '+252': 'so', // Somalia
    '+253': 'dj', // Djibouti
    '+254': 'ke', // Kenya
    '+255': 'tz', // Tanzania
    '+256': 'ug', // Uganda
    '+257': 'bi', // Burundi
    '+258': 'mz', // Mozambique
    '+260': 'zm', // Zambia
    '+261': 'mg', // Madagascar
    '+262': 're', // Réunion
    '+263': 'zw', // Zimbabwe
    '+264': 'na', // Namibia
    '+265': 'mw', // Malawi
    '+266': 'ls', // Lesotho
    '+267': 'bw', // Botswana
    '+268': 'sz', // Eswatini
    '+269': 'km', // Comoros
    '+290': 'sh', // Saint Helena
    '+291': 'er', // Eritrea
    '+297': 'aw', // Aruba
    '+298': 'fo', // Faroe Islands
    '+299': 'gl', // Greenland
    '+350': 'gi', // Gibraltar
    '+351': 'pt', // Portugal
    '+352': 'lu', // Luxembourg
    '+353': 'ie', // Ireland
    '+354': 'is', // Iceland
    '+355': 'al', // Albania
    '+356': 'mt', // Malta
    '+357': 'cy', // Cyprus
    '+358': 'fi', // Finland
    '+359': 'bg', // Bulgaria
    '+370': 'lt', // Lithuania
    '+371': 'lv', // Latvia
    '+372': 'ee', // Estonia
    '+373': 'md', // Moldova
    '+374': 'am', // Armenia
    '+375': 'by', // Belarus
    '+376': 'ad', // Andorra
    '+377': 'mc', // Monaco
    '+378': 'sm', // San Marino
    '+379': 'va', // Vatican City
    '+380': 'ua', // Ukraine
    '+381': 'rs', // Serbia
    '+382': 'me', // Montenegro
    '+383': 'xk', // Kosovo
    '+385': 'hr', // Croatia
    '+386': 'si', // Slovenia
    '+387': 'ba', // Bosnia and Herzegovina
    '+388': 'eu', // European Union
    '+389': 'mk', // North Macedonia
    '+420': 'cz', // Czech Republic
    '+421': 'sk', // Slovakia
    '+423': 'li', // Liechtenstein
    '+500': 'gs', // South Georgia and the South Sandwich Islands
    '+501': 'bz', // Belize
    '+502': 'gt', // Guatemala
    '+503': 'sv', // El Salvador
    '+504': 'hn', // Honduras
    '+505': 'ni', // Nicaragua
    '+506': 'cr', // Costa Rica
    '+507': 'pa', // Panama
    '+508': 'pm', // Saint Pierre and Miquelon
    '+509': 'ht', // Haiti
    '+590': 'gp', // Guadeloupe
    '+591': 'bo', // Bolivia
    '+592': 'gy', // Guyana
    '+593': 'ec', // Ecuador
    '+594': 'gf', // French Guiana
    '+595': 'py', // Paraguay
    '+596': 'mq', // Martinique
    '+597': 'sr', // Suriname
    '+598': 'uy', // Uruguay
    '+599': 'an', // Netherlands Antilles (now defunct, use 'sx' or 'cw')
    '+670': 'tl', // Timor-Leste
    '+672': 'cc', // Cocos (Keeling) Islands
    '+673': 'bn', // Brunei
    '+674': 'nr', // Nauru
    '+675': 'pg', // Papua New Guinea
    '+676': 'to', // Tonga
    '+677': 'sb', // Solomon Islands
    '+678': 'vu', // Vanuatu
    '+679': 'fj', // Fiji
    '+680': 'pw', // Palau
    '+681': 'wf', // Wallis and Futuna
    '+682': 'ck', // Cook Islands
    '+683': 'nu', // Niue
    '+685': 'ws', // Samoa
    '+686': 'ki', // Kiribati
    '+687': 'nc', // New Caledonia
    '+688': 'tv', // Tuvalu
    '+689': 'pf', // French Polynesia
    '+690': 'tk', // Tokelau
    '+691': 'fm', // Micronesia
    '+692': 'mh', // Marshall Islands
    '+850': 'kp', // North Korea
    '+852': 'hk', // Hong Kong
    '+853': 'mo', // Macau
    '+855': 'kh', // Cambodia
    '+856': 'la', // Laos
    '+960': 'mv', // Maldives
    '+961': 'lb', // Lebanon
    '+962': 'jo', // Jordan
    '+963': 'sy', // Syria
    '+964': 'iq', // Iraq
    '+965': 'kw', // Kuwait
    '+966': 'sa', // Saudi Arabia
    '+967': 'ye', // Yemen
    '+968': 'om', // Oman
    '+970': 'ps', // Palestine
    '+971': 'ae', // United Arab Emirates
    '+972': 'il', // Israel
    '+973': 'bh', // Bahrain
    '+974': 'qa', // Qatar
    '+975': 'bt', // Bhutan
    '+976': 'mn', // Mongolia
    '+977': 'np', // Nepal
    '+992': 'tj', // Tajikistan
    '+993': 'tm', // Turkmenistan
    '+994': 'az', // Azerbaijan
    '+995': 'ge', // Georgia
    '+996': 'kg', // Kyrgyzstan
    '+997': 'kz', // Kazakhstan
    '+998': 'uz', // Uzbekistan
};

const phoneValidationRules = {
    '+1': /^\d{10}$/,                // USA/Canada: 10 digits
    '+44': /^(\d{10}|\d{11})$/,      // UK: 10 or 11 digits
    '+33': /^\d{10}$/,                // France: 10 digits
    '+49': /^\d{11,14}$/,             // Germany: 11 to 14 digits (including country code)
    '+91': /^[6-9]\d{9}$/,            // India: 10 digits, starts with 6-9
    '+81': /^\d{10}$/,                // Japan: 10 digits
    '+82': /^\d{10}$/,                // South Korea: 10 digits
    '+61': /^(\d{9}|\d{10})$/,        // Australia: 9 or 10 digits
    '+971': /^\d{7,9}$/,              // UAE: 7 to 9 digits
    '+55': /^\d{10,11}$/,             // Brazil: 10 or 11 digits
    '+27': /^\d{10}$/,                // South Africa: 10 digits
    '+52': /^\d{10}$/,                // Mexico: 10 digits
    '+46': /^\d{6,11}$/,              // Sweden: 6 to 11 digits
    '+34': /^\d{9}$/,                 // Spain: 9 digits
    '+64': /^\d{9}$/,                 // New Zealand: 9 digits
    '+39': /^\d{10}$/,                // Italy: 10 digits
    '+53': /^\d{8}$/,                 // Cuba: 8 digits
    '+20': /^\d{10}$/,                // Egypt: 10 digits
    '+90': /^\d{10}$/,                // Turkey: 10 digits
    '+7': /^(\d{10}|\d{11})$/,        // Russia: 10 or 11 digits
    '+60': /^\d{9,10}$/,              // Malaysia: 9 or 10 digits
    '+62': /^\d{10,13}$/,             // Indonesia: 10 to 13 digits
    '+63': /^\d{10}$/,                // Philippines: 10 digits
    '+86': /^\d{11}$/,                // China: 11 digits
    '+98': /^\d{10}$/,                // Iran: 10 digits
    '+92': /^\d{10}$/,                // Pakistan: 10 digits
    '+94': /^\d{10}$/,                // Sri Lanka: 10 digits
    '+41': /^\d{10}$/,                // Switzerland: 10 digits
    '+47': /^\d{8}$/,                 // Norway: 8 digits
    '+48': /^\d{9}$/,                 // Poland: 9 digits
    '+30': /^\d{10}$/,                // Greece: 10 digits
    '+31': /^\d{10}$/,                // Netherlands: 10 digits
    '+32': /^\d{9}$/,                 // Belgium: 9 digits
    '+35': /^\d{8,9}$/,              // Portugal: 8 or 9 digits
    '+36': /^\d{9}$/,                // Hungary: 9 digits
    '+37': /^\d{8}$/,                // Moldova: 8 digits
    '+38': /^\d{9}$/,                // Slovenia: 9 digits
    '+40': /^\d{10}$/,               // Romania: 10 digits
    '+42': /^\d{9}$/,                // Slovakia: 9 digits
    '+43': /^\d{10}$/,               // Austria: 10 digits
    '+45': /^\d{8}$/,                // Denmark: 8 digits
    '+50': /^\d{10}$/,               // Mongolia: 10 digits
    '+51': /^\d{9}$/,                // Peru: 9 digits
    '+54': /^\d{10}$/,               // Argentina: 10 digits
    '+56': /^\d{9}$/,                // Chile: 9 digits
    '+57': /^\d{10}$/,               // Colombia: 10 digits
    '+58': /^\d{11}$/,               // Venezuela: 11 digits
    '+65': /^\d{8}$/,                // Singapore: 8 digits
    '+66': /^\d{9,10}$/,             // Thailand: 9 or 10 digits
    '+84': /^\d{10}$/,               // Vietnam: 10 digits
    '+93': /^\d{9}$/,                // Afghanistan: 9 digits
    '+213': /^\d{9}$/,              // Algeria: 9 digits
    '+216': /^\d{8}$/,              // Tunisia: 8 digits
    '+218': /^\d{9}$/,              // Libya: 9 digits
    '+220': /^\d{7}$/,              // Gambia: 7 digits
    '+221': /^\d{9}$/,              // Senegal: 9 digits
    '+222': /^\d{8}$/,              // Mauritania: 8 digits
    '+223': /^\d{8}$/,              // Mali: 8 digits
    '+224': /^\d{9}$/,              // Guinea: 9 digits
    '+225': /^\d{8}$/,              // Côte d'Ivoire: 8 digits
    '+226': /^\d{8}$/,              // Burkina Faso: 8 digits
    '+227': /^\d{8}$/,              // Niger: 8 digits
    '+228': /^\d{8}$/,              // Togo: 8 digits
    '+229': /^\d{8}$/,              // Benin: 8 digits
    '+230': /^\d{7}$/,              // Mauritius: 7 digits
    '+231': /^\d{7}$/,              // Liberia: 7 digits
    '+232': /^\d{8}$/,              // Sierra Leone: 8 digits
    '+233': /^\d{10}$/,             // Ghana: 10 digits
    '+234': /^\d{10}$/,             // Nigeria: 10 digits
    '+235': /^\d{8}$/,              // Chad: 8 digits
    '+236': /^\d{8}$/,              // Central African Republic: 8 digits
    '+237': /^\d{9}$/,              // Cameroon: 9 digits
    '+238': /^\d{7}$/,              // Cape Verde: 7 digits
    '+239': /^\d{7}$/,              // São Tomé and Príncipe: 7 digits
}

const OrderCustomModal = ({ show, onClose, buyerData, logiscticsData, orderId, buyerId, setRefresh, socket }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        suppliername: '',
        supplierEmail: '',
        supplierMobile: '',
        address: '',
        supplierCountry: '',
        cityDistrict: '',
        pincode: '',
        pickupTime: '',
        packages: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        volume: '',
        buyerName: buyerData?.buyer_name,
        buyerEmail: buyerData?.buyer_email,
        buyerMobile: buyerData?.buyer_mobile,
        buyerType: buyerData?.buyer_type

    });
    const [buyerPhoneNumber, setBuyerPhoneNumber] = useState('');
    const [buyerCountryCode, setBuyerCountryCode] = useState('ae');
    const [supplierMobileNumber, setSupplierMobileNumber] = useState('');

    const [countryid, setCountryid] = useState(0);
    const [supplierCountryName, setSupplierCountryName] = useState('');
    const [stateid, setstateid] = useState(0);
    const [supplierState, setSupplierState] = useState('')
    const [supplierDistrict, setSupplierDistrict] = useState('');

    const [buyerStateId, setBuyerStateId] = useState(0)
    const [buyerState, setBuyerState] = useState('')
    const [buyerCountryId, setBuyerCountryId] = useState(0)
    const [buyerCountryName, setBuyerCountryName] = useState('ae')

    useEffect(() => {
        setBuyerPhoneNumber(logiscticsData?.drop_location?.mobile) 
    },[logiscticsData])

    const [errors, setErrors] = useState({});
    const [value, onChange] = useState(new Date());
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // const handleDateChange = (date) => {
    //     setValue(date);
    // };

    const [pickupTime, setPickupTime] = useState('');
    const quantityOptions = [
        { value: '11:00 AM - 1:00 PM', label: '11:00 AM - 1:00 PM' },
        { value: '1:00 PM - 3:00 PM', label: '1:00 PM - 3:00 PM' },
        { value: '3:00 PM - 5:00 PM', label: '3:00 PM - 5:00 PM' },
        { value: '5:00 PM - 7:00 PM', label: '5:00 PM - 7:00 PM' },
    ];

    const handleSelectChange = (selectedOption) => {
        setPickupTime(selectedOption.value);
        setFormData({ ...formData, pickupTime: selectedOption.value })
        setErrors((prevErrors) => ({
            ...prevErrors,
            pickupTime: ''
        }));
    };


    const handlePhoneChange = (phone) => {
        const phoneNumber = parsePhoneNumberFromString(phone);
    
        if (phoneNumber) {
            const countryCode = `+${phoneNumber.countryCallingCode}`;
            const nationalNumber = phoneNumber.nationalNumber;
            const formattedNumber = `${countryCode}-${nationalNumber}`;
            
            // Validate phone number length based on country code
            const validationRule = phoneValidationRules[countryCode];
            if (validationRule && validationRule.test(nationalNumber)) {
                setSupplierMobileNumber(formattedNumber);
                setFormData({ ...formData, supplierMobile: formattedNumber });
                setErrors((prevErrors) => {
                    const newErrors = { ...prevErrors };
                    delete newErrors.supplierMobile; // Clear error if phone number is valid
                    return newErrors;
                });
            } else {
                // Phone number is invalid
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    supplierMobile: ''
                    // supplierMobile: `Phone number should match the pattern for ${countryCode}`
                }));
            }
        } else {
            // Phone number parsing failed
            setErrors((prevErrors) => ({
                ...prevErrors,
                supplierMobile: ''
            }));
        }
    };

    const handleSupplierCountryChange = (selectedCountry) => {
        const { id, name } = selectedCountry;
        setCountryid(id);
        setSupplierCountryName(name);
        setFormData((prevData) => ({
            ...prevData,
            supplierCountry: name
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            supplierCountry: ''
        }));
    };

    const handleSupplierState = (selectedState) => {
        const { id, name } = selectedState;
        setstateid(id);
        setSupplierState(name);
        setFormData((prevData) => ({
            ...prevData,
            supplierState: name
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            supplierState: ''
        }));
    };

    const handleCityChange = (selectedCity) => {
        const { id, name } = selectedCity;
        setSupplierDistrict(name);
        setFormData((prevData) => ({
            ...prevData,
            cityDistrict: name
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            supplierDistrict: ''
        }));
    };


    const handleBuyerCountryChange = (selectedCountry) => {

        const { id, name } = selectedCountry;
        setBuyerCountryId(id);
        setBuyerCountryName(name);
    };

    const handleBuyerState = (selectedState) => {
        const { id, name } = selectedState;
        setBuyerStateId(id);
        setBuyerState(name);
    };


    useEffect(() => {
        const { length, width, height } = formData;
        if (length && width && height) {
            const volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
            setFormData(prevData => ({ ...prevData, volume: volume.toFixed(2) }));
        }
    }, [formData.length, formData.width, formData.height]);

    if (!show) return null;


    const handleChange = (e) => {
        const { name, value } = e.target;
        let filteredValue = value;
    
        // Handle different input fields
        if (['supplierMobile', 'pincode'].includes(name)) {
            filteredValue = value.replace(/[^0-9]/g, '');
            if (name === 'pincode') {
                filteredValue = filteredValue.slice(0, 6); // Limit to 6 digits for pincode
            }
        }
        
        if (['packages'].includes(name)) {
            filteredValue = value.replace(/[^0-9]/g, '').slice(0, 4);
        }
        
        if (['length', 'width', 'height'].includes(name)) {
            filteredValue = value.replace(/[^0-9]/g, '').slice(0, 3);
        }
        
        if (name === 'weight') {
            filteredValue = value.replace(/[^0-9.]/g, '');
            const parts = filteredValue.split('.');
            if (parts.length > 2) {
                filteredValue = parts[0] + '.' + parts.slice(1).join('');
            }
            // Limit to 6 digits including decimal places
            if (filteredValue.split('.').length > 1) {
                const [integerPart, decimalPart] = filteredValue.split('.');
                if (decimalPart.length > 5) {
                    filteredValue = integerPart + '.' + decimalPart.slice(0, 5);
                }
            } else if (filteredValue.length > 6) {
                filteredValue = filteredValue.slice(0, 6);
            }
        }
        
        if (['suppliername', 'cityDistrict', 'state'].includes(name)) {
            filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
        }
    
        // Update form data
        setFormData((prevData) => ({
            ...prevData,
            [name]: filteredValue,
        }));
    
        // Clear errors for fields where valid input is entered
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            
            // Adjust validation conditions as necessary
            if (name === 'supplierMobile' && filteredValue.length >= 10) {
                delete newErrors.supplierMobile;
            }
            if (name === 'pincode' && filteredValue.length >= 6) {
                delete newErrors.pincode;
            }
            if (name === 'packages' && filteredValue.length > 0) {
                delete newErrors.packages;
            }
            if (['length', 'width', 'height'].includes(name) && filteredValue.length > 0) {
                delete newErrors[name];
            }
            if (name === 'weight' && filteredValue.length > 0) {
                delete newErrors.weight;
            }
            if (['suppliername', 'cityDistrict', 'state'].includes(name) && filteredValue.length > 0) {
                delete newErrors[name];
            }
    
            // Additional error clearing logic for email, address, and mobile
            if (name === 'supplierEmail' && /\S+@\S+\.\S+/.test(filteredValue)) {
                delete newErrors.supplierEmail;
            }
            if (name === 'address' && filteredValue.length > 0) {
                delete newErrors.address;
            }
            if (name === 'supplierMobile' && filteredValue.length >= 10) {
                delete newErrors.supplierMobile;
            }
            
            return newErrors;
        });
    };
    

    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");

    const validateForm = () => {
        const newErrors = {};
        // Basic validation rules
        if (!formData.suppliername) newErrors.suppliername = 'Name is Required';
        if (!formData.supplierEmail || !/\S+@\S+\.\S+/.test(formData.supplierEmail)) newErrors.supplierEmail = 'Valid Email is Required';
        if (!formData.supplierMobile || formData.supplierMobile.length < 10) newErrors.supplierMobile = 'Valid Mobile No. is Required';
        if (!formData.address) newErrors.address = 'Address is Required';
        if (!supplierCountryName) newErrors.supplierCountry = 'Country is Required';
        if (!supplierState) newErrors.supplierState = 'State is Required';
        if (!supplierDistrict) newErrors.supplierDistrict = 'City/District is Required';
        // if (!formData.pincode || formData.pincode.length < 6) newErrors.pincode = 'Valid Pincode is required';
        if (!formData.packages) newErrors.packages = 'No. of Packages is Required';
        if (!formData.weight) newErrors.weight = 'Weight is Required';
        if (!formData.length) newErrors.length = 'Length is Required';
        if (!formData.width) newErrors.width = 'Width is Required';
        if (!formData.height) newErrors.height= 'Height is Required';
        if (!formData.volume) newErrors.volume = 'Volume is Required';
        if (!formData.pickupTime) newErrors.pickupTime = 'Pickup Time is Required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        console.log('yes');
        e.preventDefault();
        if (validateForm()) {
            setLoading(true)
            const formattedData = {
                supplier_details: {
                    name: formData.suppliername,
                    mobile: supplierMobileNumber,
                    email: formData.supplierEmail,
                    country: supplierCountryName,
                    address: formData.address,
                    ciyt_disctrict: supplierDistrict,
                    state: supplierState,
                    pincode: formData.pincode,
                    prefered_pickup_date: formatDate(value),
                    prefered_pickup_time: pickupTime
                },
                shipment_details: {
                    no_of_packages: formData.packages,
                    length: formData.length,
                    breadth: formData.width,
                    height: formData.height,
                    total_weight: formData.weight,
                    total_volume: formData.volume,
                },
                buyer_details: {
                    name: logiscticsData?.drop_location?.name,
                    email: logiscticsData?.drop_location?.email,
                    mobile: logiscticsData?.drop_location?.mobile,
                    address: logiscticsData?.drop_location?.address,
                    country: logiscticsData?.drop_location?.country,
                    state: logiscticsData?.drop_location?.state,
                    ciyt_disctrict: logiscticsData?.drop_location?.city_district,
                    pincode: logiscticsData?.drop_location?.city_district,
                    buyer_type: buyerData?.buyer_type
                },
    
            };
            const obj = {
                supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
                buyer_id: buyerId,
                order_id: orderId,
                shipment_details: formattedData
            }
            postRequestWithToken('supplier/order/submit-details', obj, (response) => {
                if (response.code === 200) {
                    toast('Details Submitted Successfully', { type: 'success' })
                    socket.emit('shipmentDetailsSubmitted', {
                        buyerId : buyerId, 
                        orderId : orderId,
                        message : `Shipment Details Submitted for ${orderId}`,
                        link    : process.env.REACT_APP_PUBLIC_URL
                        // send other details if needed
                    });
                    setRefresh(true)
                    onClose()
                    setLoading(false)
                } else {
                    setLoading(false)
                    toast(response.message, { type: 'error' })
                    console.log('error in order details api');
                }
            }); 
        }  else {
            setLoading(false)
            toast('Some Fields are Missing', {type:'error'})
        }
       
    };

    return (
        <div className={styles['order-modal-overlay']}>
            <div className={styles['order-modal-content-section']}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <form className={styles['main-modal-form-container']} onSubmit={handleSubmit}>
                    <div className={styles['order-modal-main-heading']}>Pickup Details</div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Name</label>
                        <input placeholder='Enter Name' type="text"
                            name="suppliername"
                            value={formData.suppliername}
                            onChange={handleChange}
                            className={styles['order-modal-input']}
                            // required
                             />
                             {errors.suppliername && <span style={{color: 'red', fontSize: '12px'}} className={styles.error}>{errors.suppliername}</span>}
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Email ID</label>
                        <input placeholder='Enter Email ID'
                            className={styles['order-modal-input']}
                            type="email"
                            name="supplierEmail"
                            value={formData.supplierEmail}
                            onChange={handleChange} 
                        />
                        {errors.supplierEmail && <span style={{color: 'red', fontSize: '12px'}} className={styles.error}>{errors.supplierEmail}</span>}
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Mobile No</label>
                        <PhoneInput
                            className='signup-form-section-phone-input'
                            value={supplierMobileNumber}
                            defaultCountry='ae'
                            onChange={handlePhoneChange}
                            name="supplierMobile"
                            // required
                            />
                            {errors.supplierMobile && <span style={{color: 'red', fontSize: '12px'}} className={styles.error}>{errors.supplierMobile}</span>}
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Address</label>
                        <input placeholder='Enter Full Address'
                            className={styles['order-modal-input']}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            // required
                        />
                        {errors.address && <span style={{color: 'red', fontSize: '12px'}} className={styles.error}>{errors.address}</span>}
                    </div>
                    <div className={styles['order-modal-custom-main-sections']}>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Country</label>
                            <CountrySelect
                                className={styles['order-modal-input']}
                                onChange={handleSupplierCountryChange}
                                placeHolder="Select Country"
                            />
                            {errors.supplierCountry && <div style={{color: 'red', fontSize: '12px'}} className={styles['error-message']}>{errors.supplierCountry}</div>}
                        </div>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>State</label>
                            <StateSelect
                                className={styles['order-modal-input']}
                                countryid={countryid}
                                onChange={handleSupplierState}
                                placeHolder="Select State"
                            />
                            {errors.supplierState && <div style={{color: 'red', fontSize: '12px'}} className={styles['error-message']}>{errors.supplierState}</div>}
                        </div>
                    </div>
                    <div className={styles['order-modal-custom-main-sections']}>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>City/District</label>
                            <CitySelect
                                className={styles['order-modal-input']}
                                countryid={countryid}
                                stateid={stateid}
                                onChange={handleCityChange}
                                placeHolder="Select City"
                            />
                            {errors.supplierDistrict && <div style={{color: 'red', fontSize: '12px'}} className={styles['error-message']}>{errors.supplierDistrict}</div>}
                        </div>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Pin Code (optional)</label>
                            <input placeholder='Enter Pincode' className={styles['order-modal-input']}
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                // required
                            />
                            {/* {errors.pincode && <span style={{color: 'red'}} className={styles.error}>{errors.pincode}</span>} */}
                        </div>
                    </div>
                    <div className={styles['order-modal-custom-main-sections']}>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Preferred Date of Pickup</label>
                            
                            <DatePicker
                               className={styles['order-modal-input']}
                                onChange={onChange}
                                value={value}
                                minDate={new Date()}
                                clearIcon={null}
                                format="dd/MM/yyyy"
                            />
                             
                        </div>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Preferred Time of Pickup</label>
                            <Select
                                className={styles['create-invoice-div-input-select']}
                                options={quantityOptions}
                                placeholder="Select Time of Pickup"
                                onChange={handleSelectChange}
                            />
                            {errors.pickupTime && <span style={{color: 'red', fontSize: '12px'}} className={styles.error}>{errors.pickupTime}</span>}
                        </div>
                    </div>
                    <div className={styles['order-modal-main-heading']}>Shipment Details</div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>No. of Packages</label>
                        <input placeholder='Enter No. of Packages'
                            className={styles['order-modal-input']}
                            type="text"
                            name="packages"
                            value={formData.packages}
                            onChange={handleChange}
                            // required
                        />
                        {errors.packages && <span style={{color: 'red', fontSize: '12px'}} className={styles.error}>{errors.packages}</span>}
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Total Weight</label>
                        <input placeholder='Enter Weight'
                            className={styles['order-modal-input']}
                            type="text"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            // required
                        />
                        {errors.weight && <span style={{color: 'red', fontSize: '12px'}} className={styles.error}>{errors.weight}</span>}
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <div className={styles['order-modal-custom-main-sections']}>
                            <div className={styles['order-modal-dic-container']}>
                                <label className={styles['order-modal-label']}>Height</label>
                                <input placeholder='Enter Height' className={styles['order-modal-input']} name="height" value={formData.height} onChange={handleChange}  />
                                {errors.height && <span style={{color: 'red', fontSize: '12px'}} className={styles.error}>{errors.height}</span>}
                            </div>
                            <div className={styles['order-modal-dic-container']}>
                                <label className={styles['order-modal-label']}>Width</label>
                                <input placeholder='Enter Width' className={styles['order-modal-input']} name="width" value={formData.width} onChange={handleChange}  />
                                {errors.width && <span style={{color: 'red', fontSize: '12px'}} className={styles.error}>{errors.width}</span>}
                            </div>
                            <div className={styles['order-modal-dic-container']}>
                                <label className={styles['order-modal-label']}>Length</label>
                                <input placeholder='Enter Length' className={styles['order-modal-input']} name="length" value={formData.length} onChange={handleChange}  />
                                {errors.length && <span style={{color: 'red', fontSize: '12px'}} className={styles.error}>{errors.length}</span>}
                            </div>
                        </div>
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Total Volume</label>
                        <input placeholder='Enter Weight'
                            className={styles['order-modal-input']}
                            type="text"
                            name="volume"
                            value={formData.volume}
                            // required
                        />
                    </div>
                    <div className={styles['order-modal-main-heading']}>Buyer Details</div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Buyer Name</label>
                        <input placeholder='Enter Buyer Name'
                            className={styles['order-modal-input']}
                            type="text"
                            name="buyerName"
                            readOnly
                            defaultValue={logiscticsData?.drop_location?.name}
                            // required
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Company Type</label>
                        <input placeholder='Enter Company Type'
                            className={styles['order-modal-input']}
                            type="text"
                            name="buyerCompanyType"
                            readOnly
                            defaultValue={buyerData?.buyer_type}
                            // required 
                            />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Email ID</label>
                        <input placeholder='Enter Email ID'
                            className={styles['order-modal-input']}
                            type="email"
                            name="supplierEmail"
                            readOnly
                            defaultValue={logiscticsData?.drop_location?.email}
                            onChange={handleChange} 
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Mobile No.</label>
                        <PhoneInput
                            className='signup-form-section-phone-input'
                            defaultCountry="ae"
                            name="companyPhone"
                            value={buyerPhoneNumber}
                            disabled
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Address</label>
                        <input placeholder='Enter Full Address'
                            className={styles['order-modal-input']}
                            name="address"
                            defaultValue={logiscticsData?.drop_location?.address}
                            onChange={handleChange}
                            readOnly
                            // required
                        />
                    </div>
                    <div className={styles['order-modal-custom-main-sections']}>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Country</label>
                            {/* <CountrySelect
                                className={styles['order-modal-input']}
                                onChange={handleBuyerCountryChange}
                                placeHolder="Select Country"
                            /> */}
                            <input placeholder='Enter country'
                            className={styles['order-modal-input']}
                            name="country"
                            defaultValue={logiscticsData?.drop_location?.country}
                            onChange={handleChange}
                            readOnly
                            required
                        />
                        </div>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>State</label>
                            {/* <StateSelect
                                className={styles['order-modal-input']}
                                countryid={countryid}
                                onChange={handleBuyerState}
                                placeHolder="Select State"
                            /> */}
                            <input placeholder='Enter state'
                            className={styles['order-modal-input']}
                            name="state"
                            defaultValue={logiscticsData?.drop_location?.state}
                            onChange={handleChange}
                            readOnly
                            // required
                        />

                        </div>
                    </div>
                    <div className={styles['order-modal-custom-main-sections']}>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>City/District</label>
                            {/* <CitySelect
                                className={styles['order-modal-input']}
                                countryid={countryid}
                                stateid={stateid}
                                onChange={(e) => {
                                    console.log(e);
                                }}
                                placeHolder="Select City"
                            /> */}
                             <input placeholder='Enter city/district' className={styles['order-modal-input']}
                                name="state"
                                defaultValue={logiscticsData?.drop_location?.city_district}
                                onChange={handleChange}
                                // required
                                readOnly
                            />

                        </div>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Pin Code</label>
                            <input placeholder='Enter Pincode' className={styles['order-modal-input']}
                                name="pincode"
                               defaultValue={logiscticsData?.drop_location?.pincode}
                                onChange={handleChange}
                                // required
                                readOnly
                    
                            />
                        </div>
                    </div>
                    <div className={styles['modal-order-button-section']}>
                        <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={loading}
                        >
                            {/* Submit */}
                            {loading ? (
                                <div className='loading-spinner'></div> 
                            ) : (
                                'Submit'
                            )}
                            </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderCustomModal;



