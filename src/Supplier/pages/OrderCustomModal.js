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

const OrderCustomModal = ({ show, onClose, buyerData, logiscticsData, orderId, buyerId, setRefresh }) => {
    console.log('log',logiscticsData);
    console.log('buyer', buyerData);
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

    // const [stateid, setstateid] = useState(0);
    const [value, setValue] = useState(new Date());
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const handleDateChange = (date) => {
        setValue(date);
        console.log('Selected Date:', formatDate(date));
    };
    console.log('Selectedas Date:', value);

    const [pickupTime, setPickupTime] = useState('');
    const quantityOptions = [
        { value: '11:00 AM - 1:00 PM', label: '11:00 AM - 1:00 PM' },
        { value: '1:00 PM - 3:00 PM', label: '1:00 PM - 3:00 PM' },
        { value: '3:00 PM - 5:00 PM', label: '3:00 PM - 5:00 PM' },
        { value: '5:00 PM - 7:00 PM', label: '5:00 PM - 7:00 PM' },
    ];

    const handleSelectChange = (selectedOption) => {
        setPickupTime(selectedOption.value);
        console.log('Selected Time of Pickup:', selectedOption.value);
    };

    const handlePhoneChange = (phone) => {
        const phoneNumber = parsePhoneNumberFromString(phone);

        if (phoneNumber) {
            const countryCode = `+${phoneNumber.countryCallingCode}`; // Extract the country code like +91, +971
            const nationalNumber = phoneNumber.nationalNumber; // Get the national number without country code

            setBuyerCountryCode(countryCode); // Set the country code
            setSupplierMobileNumber(nationalNumber); // Set the mobile number
            console.log('Country Code:', countryCode);
            console.log('Supplier Mobile Number:', nationalNumber);
        }
    };



    const handleSupplierCountryChange = (selectedCountry) => {
        // Assuming selectedCountry is an object with id and name
        const { id, name } = selectedCountry;

        // Update state with selected country ID and name
        setCountryid(id);
        setSupplierCountryName(name);

        // Optional: Log the selected country name
        console.log('Selected Country:', name);
    };
    console.log('setSupplierCountryNam', supplierCountryName);

    const handleSupplierState = (selectedState) => {
        const { id, name } = selectedState;
        setstateid(id);
        setSupplierState(name);
        console.log('Selected state:', name);
    };

    const handleCityChange = (selectedCity) => {
        // Assuming selectedCity is an object with district details
        const { id, name } = selectedCity; // Extract district info from the city object

        // Update state with selected district
        setSupplierDistrict(name);

        // Optional: Log the selected district
        console.log('Selected District:', name);
    };


    const handleBuyerCountryChange = (selectedCountry) => {

        const { id, name } = selectedCountry;

        // Update state with selected country ID and name
        setBuyerCountryId(id);
        setBuyerCountryName(name);

        // Optional: Log the selected country name
        console.log('Selectedas Country:', name);
    };

    const handleBuyerState = (selectedState) => {
        const { id, name } = selectedState;
        setBuyerStateId(id);
        setBuyerState(name);
        console.log('Selectedbu state:', name);
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

        // Allow only numbers for specific fields
        if (['supplierMobile', 'pincode', 'packages', 'length', 'width', 'height'].includes(name)) {
            filteredValue = value.replace(/[^0-9]/g, '');
        }

        if (name === 'weight') {
            filteredValue = value.replace(/[^0-9.]/g, '');
            // Ensure only one decimal point
            const parts = filteredValue.split('.');
            if (parts.length > 2) {
                filteredValue = parts[0] + '.' + parts.slice(1).join('');
            }
        }

        // Allow only letters for specific fields
        if (['suppliername', 'cityDistrict', 'state'].includes(name)) {
            filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: filteredValue,
        }));
    };
    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        const formattedData = {
            supplier_details: {
                name: formData.suppliername,
                mobile: formData.supplierMobile,
                // country_code : supplierCountrC
                email: formData.supplierEmail,
                supplierCountry: supplierCountryName,
                address: formData.address,
                ciyt_disctrict: supplierDistrict,
                pincode: formData.pincode,
                prefered_pickup_date: value,
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
                name: buyerData?.buyer_name,
                mobile: buyerData?.buyer_mobile,
                email: buyerData?.buyer_email,
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
                toast('Details submitted successfully', { type: 'success' })
                setRefresh(true)
                onClose()
            } else {
                console.log('error in order details api');
            }
        });
        // ; 
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
                            required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Email ID</label>
                        <input placeholder='Enter Email ID'
                            className={styles['order-modal-input']}
                            type="email"
                            name="supplierEmail"
                            value={formData.supplierEmail}
                            onChange={handleChange} required
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Mobile No</label>
                        <PhoneInput
                            className='signup-form-section-phone-input'
                            value={buyerPhoneNumber}
                            defaultCountry={buyerCountryCode}
                            // onChange={phone => setBuyerCountryCode(phone)}
                            onChange={handlePhoneChange}
                            name="companyPhone"
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Address</label>
                        <input placeholder='Enter Full Address'
                            className={styles['order-modal-input']}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>



                    <div className={styles['order-modal-custom-main-sections']}>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Country</label>
                            <CountrySelect
                                className={styles['order-modal-input']}
                                onChange={handleSupplierCountryChange}
                                placeHolder="Select Country"
                            />
                        </div>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>State</label>
                            <StateSelect
                                className={styles['order-modal-input']}
                                countryid={countryid}
                                onChange={handleSupplierState}
                                placeHolder="Select State"
                            />

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
                        </div>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Pin Code</label>
                            <input placeholder='Enter Pincode' className={styles['order-modal-input']}
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles['order-modal-custom-main-sections']}>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Preferred Date of Pickup</label>
                            <DatePicker
                                className={styles['order-modal-input']}
                                // onChange={onChange}
                                onChange={handleDateChange}
                                value={value}
                                minDate={new Date()}
                                clearIcon={null}
                                format="dd-MM-yyyy"
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
                            required
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Total Weight</label>
                        <input placeholder='Enter Weight'
                            className={styles['order-modal-input']}
                            type="text"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        {/* <label className={styles['order-modal-label']}>Total Volume</label> */}
                        <div className={styles['order-modal-custom-main-sections']}>
                            <div className={styles['order-modal-dic-container']}>
                                <label className={styles['order-modal-label']}>Height</label>
                                <input placeholder='Enter Height' className={styles['order-modal-input']} name="height" value={formData.height} onChange={handleChange} required />
                            </div>
                            <div className={styles['order-modal-dic-container']}>
                                <label className={styles['order-modal-label']}>Width</label>
                                <input placeholder='Enter Width' className={styles['order-modal-input']} name="width" value={formData.width} onChange={handleChange} required />
                            </div>
                            <div className={styles['order-modal-dic-container']}>
                                <label className={styles['order-modal-label']}>Length</label>
                                <input placeholder='Enter Length' className={styles['order-modal-input']} name="length" value={formData.length} onChange={handleChange} required />
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
                            //  onChange={handleChange} 
                            required
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
                            defaultValue={buyerData?.buyer_name}
                            //  onChange={handleChange} 
                            required
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
                            //  onChange={handleChange} 
                            required />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Email ID</label>
                        <input placeholder='Enter Email ID'
                            className={styles['order-modal-input']}
                            type="email"
                            name="supplierEmail"
                            value={formData.supplierEmail}
                            onChange={handleChange} required
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Mobile No.</label>
                        <PhoneInput
                            className='signup-form-section-phone-input'
                            defaultCountry="ae"
                            name="companyPhone"
                        />
                    </div>
                    <div className={styles['order-modal-dic-container']}>
                        <label className={styles['order-modal-label']}>Address</label>
                        <input placeholder='Enter Full Address'
                            className={styles['order-modal-input']}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles['order-modal-custom-main-sections']}>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Country</label>
                            <CountrySelect
                                className={styles['order-modal-input']}
                                // onChange={(e) => {
                                //     setCountryid(e.id);
                                // }}
                                onChange={handleBuyerCountryChange}
                                placeHolder="Select Country"
                            />
                        </div>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>State</label>
                            <StateSelect
                                className={styles['order-modal-input']}
                                countryid={countryid}
                                onChange={handleBuyerState}
                                placeHolder="Select State"
                            />

                        </div>
                    </div>
                    <div className={styles['order-modal-custom-main-sections']}>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>City/District</label>
                            <CitySelect
                                className={styles['order-modal-input']}
                                countryid={countryid}
                                stateid={stateid}
                                onChange={(e) => {
                                    console.log(e);
                                }}
                                placeHolder="Select City"
                            />
                        </div>
                        <div className={styles['order-modal-dic-container']}>
                            <label className={styles['order-modal-label']}>Pin Code</label>
                            <input placeholder='Enter Pincode' className={styles['order-modal-input']}
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles['modal-order-button-section']}>
                        <button type="submit" className={styles.submitButton}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderCustomModal;



