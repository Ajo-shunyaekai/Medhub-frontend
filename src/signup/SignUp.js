import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import countryList from 'react-select-country-list';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import '../style/signup.css'
import logo from '../assest/logo.svg';
import SuccessModal from './SuccessModal';
import ImageUploaders from './ImageUploader';
import { parsePhoneNumberFromString, isValidNumber } from 'libphonenumber-js';
// import { postRequestWithFile } from '../api/Requests';
import { InputMask } from '@react-input/mask';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { apiRequests } from '../api/index';
import { registerUser } from '../redux/reducers/userDataSlice';
import { useDispatch } from 'react-redux';


const MultiSelectOption = ({ children, ...props }) => (
    <components.Option {...props}>
        <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
        />{" "}
        <label>{children}</label>
    </components.Option>
);

// MultiSelectDropdown Component
const MultiSelectDropdown = ({ options, value, onChange }) => {
    return (
        <Select
            options={options}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{ Option: MultiSelectOption }}
            onChange={onChange}
            value={value}
        />
    );
};

const SignUp = ({socket}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isChecked, setIsChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [countries, setCountries] = useState([]);
    const [companyPhone, setCompanyPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [resetUploaders, setResetUploaders] = useState(false);
    const [selectedCompanyType, setSelectedCompanyType] = useState(null);

    const defaultFormData = {
        companyType: '',
        companyName: '',
        companyAddress: '',
        companyEmail: '',
        companyPhone: '',
        contactPersonName: '',
        designation: '',
        email: '',
        mobile: '',
        originCountry: '',
        operationCountries: [],
        interestedIn: '',
        companyLicenseNo: '',
        companyTaxNo: '',
        yearlyPurchaseValue: '',
        companyLicenseExpiry: '',
        description: '',
        taxImage: null,
        taxImageType: 'tax',
        logoImage: null,
        logoImageType: 'logo',
        licenseImage: null,
        licenseImageType: 'license',
        certificateImage: null,
        certificateImageType: 'certificate',
        registrationNo : '',
        vatRegistrationNo : '',
        user_type: 'Buyer'
    }

    const [formData, setFormData] = useState(defaultFormData);
    const [selectedOptions, setSelectedOptions] = React.useState([]);

    const handleMultiSelectChange = (selected) => {
        setSelectedOptions(selected);
        setFormData(prevState => ({ ...prevState, interestedIn: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, interestedIn: 'Interested In is Required' }));
        } else {
            setErrors(prevState => ({ ...prevState, interestedIn: '' }));
        }
    };

    useEffect(() => {
        const options = countryList().getData();
        setCountries(options);
    }, []);

    const companyTypeOptions = [
        { value: 'distributor', label: 'Distributor' },
        { value: 'end user', label: 'End User' },
    ];

    const handleCompanyTypeChange = (selectedOption) => {
        setSelectedCompanyType(selectedOption);
        setFormData(prevState => ({ ...prevState, companyType: selectedOption }));
        if (!selectedOption) {
            setErrors(prevState => ({ ...prevState, companyType: 'Company Type is Required' }));
        } else {
            setErrors(prevState => ({ ...prevState, companyType: '' }));
        }
    };

    const options = [
        { value: 'generies', label: 'Generies' },
        { value: 'orignal', label: 'Orignals' },
        { value: 'biosimilars', label: 'Biosimilars' },
        { value: 'medical devices', label: 'Medical Devices' },
        { value: 'nutraceuticals', label: 'Nutraceuticals' },
    ];
    
    const handleImageUpload = (hasImage, file, imageType) => {
        setFormData(prevState => ({
            ...prevState,
            [`${imageType}Image`]: null, 
        }));
        setTimeout(() => {
            setFormData(prevState => ({
                ...prevState,
                [`${imageType}Image`]: hasImage ? file : null,
            }));
        }, 0);
    
        setErrors(prevState => ({
            ...prevState,
            [`${imageType}Image`]: !hasImage && !file ? `${imageType} image is Required` : '',
        }));
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
    
        // Regex to allow only alphanumeric characters and spaces
        const alphanumericNoSpaceRegex = /^[a-zA-Z0-9]*$/;
    
        // Regex to allow empty string or only one white space between numbers for yearlyPurchaseValue
        const yearlyPurchaseValueRegex = /^\d{0,8}$/;

        if ((name === 'companyName' || name === 'companyEmail' || name === 'email') && value.length > 50) {
            // setErrors((prevState) => ({
            //     ...prevState,
            //     [name]: `${
            //         name === 'companyName' 
            //         ? 'Company Name' 
            //         : name === 'companyEmail' 
            //         ? 'Company Email' 
            //         : 'Email'
            //     } cannot exceed 50 characters`,
            // }));

            setErrors((prevState) => ({
                ...prevState,
                [name]: ``,
            }));
            return;
        }
    
    
        if (['registrationNo', 'vatRegistrationNo', 'companyLicenseNo', 'companyTaxNo'].includes(name)) {
            if (value.length > 16) {
                setErrors(prevState => ({ ...prevState, [name]: '' }));
                return;
            }
            
            // Disallow spaces in these fields
            if (!alphanumericNoSpaceRegex.test(value)) {
                setErrors(prevState => ({ ...prevState, [name]: '' }));
                return;
            }
        }
    
        // Validate yearlyPurchaseValue to allow only one whitespace or an empty value
        if (name === 'yearlyPurchaseValue') {
            if (!yearlyPurchaseValueRegex.test(value)) {
                setErrors(prevState => ({ ...prevState, yearlyPurchaseValue: '' }));
                return;
            }
        }
    
        if (name === 'description' && value.length > 1000) {
            setErrors(prevState => ({ ...prevState, description: 'Description cannot exceed 1000 characters' }));
        } else if ((name === 'contactPersonName' || name === 'designation') && !/^[a-zA-Z\s]*$/.test(value)) {
            setErrors(prevState => ({ ...prevState, designation: '' }));
        } else if (name === 'delivertime' && !/^\d{0,3}$/.test(value)) {
            setErrors(prevState => ({ ...prevState, delivertime: 'Invalid delivery time' }));
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
            setErrors(prevState => ({ ...prevState, [name]: '' }));
        }
    };


    // const handlePhoneChange = (name, value) => {

    //     setErrors(prevState => ({ ...prevState, [name]: '' }));
    //     if (value.trim() !== '') {
    //         const phoneRegex = /^[0-9]{10,15}$/;
    //         if (phoneRegex.test(value)) {
    //             const countryCode = value.slice(0, value.indexOf('-'));
    //             const nationalNumber = value.slice(value.indexOf('-') + 1);
    //             const formattedNumber = `+${countryCode} ${nationalNumber}`;
    //             setFormData(prevState => ({ ...prevState, [name]: formattedNumber }));
    //         } else {
    //             // setErrors(prevState => ({ ...prevState, [name]: 'Invalid phone number' }));
    //         }
    //     } else {

    //     }
    // };


    const handlePhoneChange = (name, value) => {
        // Clear previous errors
        setErrors(prevState => ({ ...prevState, [name]: '' }));
      
        try {
          // Parse the phone number
          const phoneNumber = parsePhoneNumber(value);
      
          // Validate the phone number
          if (phoneNumber && isValidPhoneNumber(value)) {
            // Format the phone number in E.164 format (international standard)
           
            console.log(phoneNumber.countryCallingCode);
            const countryCode = phoneNumber.countryCallingCode
            const nationalNumber = phoneNumber.nationalNumber
            // const formattedNumber = phoneNumber.format('E.164');
            const formattedNumber = `+${countryCode} ${nationalNumber}`
            console.log(formattedNumber);
            // Update form data with the formatted number
            setFormData(prevState => ({ ...prevState, [name]: formattedNumber }));
          } else {
            // Set error if phone number is invalid
            setErrors(prevState => ({ 
              ...prevState, 
              [name]: 'Invalid phone number' 
            }));
          }
        } catch (error) {
          // Handle parsing errors
          setErrors(prevState => ({ 
            ...prevState, 
            [name]: '' 
          }));
        }
      };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        if (!isChecked) setErrors(prevState => ({ ...prevState, terms: '' }));
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.companyType) formErrors.companyType = 'Company Type is Required';
        if (!formData.companyName) formErrors.companyName = 'Company Name is Required';
        if (!formData.companyAddress) formErrors.companyAddress = 'Company Address is Required';
        if (!formData.companyEmail) formErrors.companyEmail = 'Company Email ID is Required';
        if (formData.companyEmail && !validateEmail(formData.companyEmail)) formErrors.companyEmail = 'Invalid Company Email ID';
        // if (!companyPhone || companyPhone.length <= 12) {
        //     formErrors.companyPhone = 'Company Phone No. is Required';
        // }

        try {
            // Validate Company Phone
            if (!companyPhone) {
              formErrors.companyPhone = 'Company Phone No. is Required';
            } else {
              const companyPhoneNumber = parsePhoneNumber(companyPhone);
              if (!companyPhoneNumber || !isValidPhoneNumber(companyPhone)) {
                formErrors.companyPhone = 'Invalid Company Phone Number';
              }
            }
        
            // Validate Mobile Number
            if (!mobile) {
              formErrors.mobile = 'Mobile No. is Required';
            } else {
              const mobileNumber = parsePhoneNumber(mobile);
              if (!mobileNumber || !isValidPhoneNumber(mobile)) {
                formErrors.mobile = 'Invalid Mobile Number';
              }
            }
          } catch (error) {
            // Catch any parsing errors
            formErrors.companyPhone = 'Invalid Phone Number Format';
            formErrors.mobile = 'Invalid Phone Number Format';
          }

        if (!formData.contactPersonName) formErrors.contactPersonName = 'Contact Person Name is Required';
        if (!formData.designation) formErrors.designation = 'Designation is Required';
        if (!formData.email) formErrors.email = 'Email ID is Required';
        if (formData.email && !validateEmail(formData.email)) formErrors.email = 'Invalid Email ID';
        // if (!mobile || mobile.length <= 12) {
        //     formErrors.mobile = 'Mobile No. is Required';
        // }
        if (!formData.originCountry) formErrors.originCountry = 'Country of Origin is Required';
        if (!formData.operationCountries.length) formErrors.operationCountries = 'Country of Operation is Required';
        if (!formData.companyLicenseNo) formErrors.companyLicenseNo = 'Company License No. is Required';
        if (!formData.companyLicenseExpiry) formErrors.companyLicenseExpiry = 'Company License Expiry is Required';
        if (!formData.yearlyPurchaseValue) formErrors.yearlyPurchaseValue = 'Yearly Purchase Value is Required';
        if (!formData.companyTaxNo) formErrors.companyTaxNo = 'Company Tax No. is Required';
        if (!formData.interestedIn) formErrors.interestedIn = 'Interested in  is Required';
        if (!isChecked) formErrors.terms = 'You must agree to the terms and conditions';
        if (!formData.description) formErrors.description = 'Description is Required';
        if (formData.description.length > 1000) formErrors.description = 'Description cannot exceed 1000 characters';
        if (!formData.taxImage) formErrors.taxImage = 'Tax Image is Required';
        if (!formData.logoImage) formErrors.logoImage = 'Logo Image is Required';
        if (!formData.licenseImage) formErrors.licenseImage = 'License Image is Required';
        if (!formData.certificateImage) formErrors.certificateImage = 'Certificate Image is Required';
        if (!formData.registrationNo) formErrors.registrationNo = 'Registration No. is Required';
        if (!formData.vatRegistrationNo) formErrors.vatRegistrationNo = 'VAT Registration No. is Required';

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    useEffect(() => {
        if (resetUploaders) {
            setResetUploaders(false);
        }
    }, [resetUploaders]);    

    const handleCancel = () => {
        setFormData(defaultFormData)
        setErrors({});
        setIsChecked(false);
        setCompanyPhone('');
        setMobile('');
        setSelectedCompanyType(null)
        setSelectedOptions([])
        setResetUploaders(true);
    }


    const handleSubmit = async() => {
        if (validateForm() && isChecked) {
            setLoading(true)
            // setButtonLoading(true)
            const formDataToSend = new FormData();

            const countryLabels = formData.operationCountries?.map(country => {
                return country ? country.label : '';
            });
            const interested = formData?.interestedIn?.map(data => {
                return data ? data.label : ""
            });
            formDataToSend.append('buyer_type', formData.companyType?.label);
            formDataToSend.append('buyer_name', formData.companyName);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('buyer_address', formData.companyAddress);
            formDataToSend.append('buyer_email', formData.companyEmail);
            // formDataToSend.append('buyer_mobile', companyPhone);
            formDataToSend.append('buyer_mobile', formData.companyPhone);
            formDataToSend.append('license_no', formData.companyLicenseNo);
            formDataToSend.append('country_of_origin', formData.originCountry);
            formDataToSend.append('contact_person_name', formData.contactPersonName);
            interested.forEach(item => formDataToSend.append('interested_in[]', item));
            formDataToSend.append('approx_yearly_purchase_value', formData.yearlyPurchaseValue);
            formDataToSend.append('license_expiry_date', formData.companyLicenseExpiry);
            formDataToSend.append('designation', formData.designation);
            // formDataToSend.append('contact_person_mobile', mobile);
            formDataToSend.append('contact_person_mobile', formData.mobile);
            formDataToSend.append('contact_person_email', formData.email);
            formDataToSend.append('registration_no', formData.registrationNo);
            formDataToSend.append('vat_reg_no', formData.vatRegistrationNo);
            // formDataToSend.append('country_of_operation', countryLabels);
            countryLabels.forEach(item => formDataToSend.append('country_of_operation[]', item));
            formDataToSend.append('tax_no', formData.companyTaxNo);
            formDataToSend.append('user_type', formData.user_type || 'Buyer');
            Array.from(formData.logoImage).forEach(file => formDataToSend.append('buyer_image', file));
            Array.from(formData.licenseImage).forEach(file => formDataToSend.append('license_image', file));
            Array.from(formData.taxImage).forEach(file => formDataToSend.append('tax_image', file));
            Array.from(formData.certificateImage).forEach(file => formDataToSend.append('certificate_image', file));

            console.log(`\n FORM DATA FOR API PAYLOAD OF REGISTER BUYER : \n${formDataToSend}`)
            // postRequestWithFile('auth/register', formDataToSend, async (response) => {
                // if (response.code === 200) {
                //     setFormData(defaultFormData)
                //     setErrors({});
                //     setIsChecked(false);
                //     setCompanyPhone('');
                //     setMobile('');
                //     setSelectedCompanyType(null)
                //     setSelectedOptions([])
                //     setResetUploaders(true);
                //     setShowModal(true)
                //     // setButtonLoading(false)
                //     setLoading(false)

                //     socket.emit('buyerRegistration', {
                //         adminId : process.env.REACT_APP_ADMIN_ID,
                //         message : `New Buyer Registration Request `,
                //         link    : process.env.REACT_APP_PUBLIC_URL
                //         // send other details if needed
                //     });

                // } else {
                //     // setButtonLoading(false)
                //     setLoading(false)
                //     toast(response.message, {type: 'error'})
                //     console.log('error in buyer/register api');
                // }
                // // setButtonLoading(false)
            // })

            console.log(`formDataToSend ${formDataToSend}`)
            try {
                // const response = await apiRequests?.postRequestWithFile(`auth/register`, formDataToSend, "Buyer")
                // if(response?.code !== 200){
                //     // setButtonLoading(false)
                //     setLoading(false)
                //     toast(response.message, {type: 'error'})
                //     console.log('error in buyer/register api');
                //     return
                // }
                // handleCancel()
                // setShowModal(true)
                // // setButtonLoading(false)
                // setLoading(false)

                socket.emit('buyerRegistration', {
                    adminId : process.env.REACT_APP_ADMIN_ID,
                    message : `New Buyer Registration Request `,
                    link    : process.env.REACT_APP_PUBLIC_URL
                    // send other details if needed
                });
                const action = await dispatch(registerUser(formDataToSend))
                // Check if login was successful
                if (registerUser.fulfilled.match(action)) {
                    setTimeout(() => {
                        handleCancel()
                        setShowModal(true);
                        setLoading(false)
                    }, 500);
                }
            } catch (error) {
                // setButtonLoading(false)
                setLoading(false)
                toast(error.message, {type: 'error'})
                console.log('error in buyer/register api');
                
            }finally{
    
                setLoading(false)

            }
        } else {
            setLoading(false)
            toast('Some Fields are Missing', {type: 'error'})
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit();
    };

    const handleCloseModal = () => setShowModal(false);

    const formatPhoneNumber = (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        if (phoneNumber) {
            const countryCallingCode = `+${phoneNumber.countryCallingCode}`;
            const nationalNumber = phoneNumber.nationalNumber;
            return `${countryCallingCode} ${nationalNumber}`;
        }
        return value;
    };

    const handleCountryOriginChange = (selectedOption) => {

        setFormData({ ...formData, originCountry: selectedOption.label })
        if (!selectedOption) {
            setErrors(prevState => ({ ...prevState, originCountry: 'Country of Origin is Required' }));
        } else {
            setErrors(prevState => ({ ...prevState, originCountry: '' }));
        }
    };

    const handleOperationCountriesChange = (selectedOptions) => {
        const selectedLabels = selectedOptions?.map(option => option.label) || [];

        setFormData({
            ...formData,
            operationCountries: selectedOptions
        });

        setErrors(prevState => ({
            ...prevState,
            operationCountries: selectedLabels.length === 0 ? 'Country of Operation is Required' : ''
        }));
    };

    const getDropdownButtonLabel = ({ placeholderButtonLabel, value }) => {
        if (value && value.length) {
            return value.map(country => country.label).join(', ');
        }
        return placeholderButtonLabel;
    };

    return (
        <>
            <div className='signup-container'>
                <div className='signup-logo-section'>
                    <img src={logo} alt='Signup Logo' />
                </div>
                <div className='signup-form-section'>
                    <div className='signup-form-section-heading'>Buyer Registration</div>
                    <form className='signup-form-container' onSubmit={handleFormSubmit}>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Company Type</label>
                            <Select
                                value={selectedCompanyType}
                                onChange={handleCompanyTypeChange}
                                options={companyTypeOptions}
                            />
                            {errors.companyType && <div className='signup__errors'>{errors.companyType}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Company Name</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="companyName"
                                placeholder="Enter Company Name"
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                            {errors.companyName && <div className='signup__errors'>{errors.companyName}</div>}
                        </div>

                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Company Address</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="companyAddress"
                                placeholder="Enter Company Address"
                                value={formData.companyAddress}
                                onChange={handleChange}
                            />
                            {errors.companyAddress && <div className='signup__errors'>{errors.companyAddress}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Company Email ID</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="companyEmail"
                                placeholder="Enter Company Email ID"
                                value={formData.companyEmail}
                                onChange={handleChange}
                            />
                            {errors.companyEmail && <div className='signup__errors'>{errors.companyEmail}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Company Registration Number</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="registrationNo"
                                placeholder="Enter Company Registration Number"
                                value={formData.registrationNo}
                                onChange={handleChange}
                            />
                            {errors.registrationNo && <div className='signup__errors'>{errors.registrationNo}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>VAT Registration Number</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="vatRegistrationNo"
                                placeholder="Enter VAT Registration Number"
                                value={formData.vatRegistrationNo}
                                onChange={handleChange}
                            />
                            {errors.vatRegistrationNo && <div className='signup__errors'>{errors.vatRegistrationNo}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Company Phone No.</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="gb"
                                name="companyPhone"
                                value={companyPhone}
                                // onChange={(value) => {
                                //     const formattedValue = formatPhoneNumber(value);

                                //     setCompanyPhone(formattedValue);
                                //     handlePhoneChange('companyPhone', value);
                                // }}

                                onChange={(value) => {
                                    handlePhoneChange('companyPhone', value);
                                    // Update local state for the input
                                    setCompanyPhone(value);
                                  }}
                            />
                            {errors.companyPhone && <div className='signup__errors'>{errors.companyPhone}</div>}
                        </div>

                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Contact Person Name</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="contactPersonName"
                                placeholder="Enter Contact Person Name"
                                value={formData.contactPersonName}
                                pattern="[A-Za-z\s]*" 
                                onChange={handleChange}
                            />
                            {errors.contactPersonName && <div className='signup__errors'>{errors.contactPersonName}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Designation</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="designation"
                                placeholder="Enter Designation"
                                value={formData.designation}
                                onChange={handleChange}
                            />
                            {errors.designation && <div className='signup__errors'>{errors.designation}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Email ID</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="email"
                                placeholder="Enter Email ID"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <div className='signup__errors'>{errors.email}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Mobile No.</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="gb"
                                name="mobile"
                                value={mobile}
                                // onChange={(value) => {
                                //     const formattedValue = formatPhoneNumber(value);
                                //     setMobile(formattedValue);
                                //     handlePhoneChange('mobile', value);
                                // }}

                                onChange={(value) => {
                                    handlePhoneChange('mobile', value);
                                    // Update local state for the input
                                    setMobile(value);
                                  }}

                            />
                            {errors.mobile && <div className='signup__errors'>{errors.mobile}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Country of Origin</label>
                            <Select
                                className='signup-forms-sections-select'
                                options={countries}
                                value={countries.find(option => option.value === formData.originCountry)}
                                onChange={handleCountryOriginChange}
                            // onChange={(selectedOption) => setFormData({ ...formData, originCountry: selectedOption.value })}
                            />
                            {errors.originCountry && <div className='signup__errors'>{errors.originCountry}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Country of Operation</label>
                            {countries.length > 0 && (
                                <MultiSelectDropdown
                                    className='signup-forms-sections-select'
                                    options={countries}
                                    value={formData.operationCountries}
                                    onChange={handleOperationCountriesChange}
                                    getDropdownButtonLabel={getDropdownButtonLabel}
                                // onChange={(selectedOptions) => setFormData({ ...formData, operationCountries: selectedOptions })}
                                />

                            )}
                            {errors.operationCountries && <div className='signup__errors'>{errors.operationCountries}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Approx. Yearly Purchase Value</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="yearlyPurchaseValue"
                                placeholder="Enter Approx. Yearly Purchase Value"
                                value={formData.yearlyPurchaseValue}
                                onChange={handleChange}
                            />
                            {errors.yearlyPurchaseValue && <div className='signup__errors'>{errors.yearlyPurchaseValue}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Company License No.</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="companyLicenseNo"
                                placeholder="Enter License No."
                                value={formData.companyLicenseNo}
                                onChange={handleChange}
                            />
                            {errors.companyLicenseNo && <div className='signup__errors'>{errors.companyLicenseNo}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>License Expiry Date</label>
                            <InputMask
                                className='signup-form-section-input'
                                type="text"
                                mask="dd-mm-yyyy"
                                placeholder='DD-MM-YYYY'
                                name="companyLicenseExpiry"
                                value={formData.companyLicenseExpiry}
                                onChange={handleChange}
                                replacement={{ d: /\d/, m: /\d/, y: /\d/ }} showMask separate
                            />
                            {errors.companyLicenseExpiry && <div className='signup__errors'>{errors.companyLicenseExpiry}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Company Tax No.</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="companyTaxNo"
                                placeholder="Enter Company Tax No."
                                value={formData.companyTaxNo}
                                onChange={handleChange}
                            />
                            {errors.companyTaxNo && <div className='signup__errors'>{errors.companyTaxNo}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Interested In</label>
                            <MultiSelectDropdown
                                options={options}
                                value={selectedOptions}
                                onChange={handleMultiSelectChange}
                            />
                            {errors.interestedIn && <div className='signup__errors'>{errors.interestedIn}</div>}
                        </div>

                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>About Company</label>
                            <textarea
                                className='signup-form-section-input'
                                name="description"
                                rows="4"
                                cols="50"
                                placeholder='Enter Description'
                                value={formData.description}
                                onChange={handleChange}
                            />
                            {errors.description && <div className='signup__errors'>{errors.description}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Upload Trade License</label>
                            <ImageUploaders onUploadStatusChange={handleImageUpload} imageType="license" reset={resetUploaders} allowMultiple={true} />
                            {errors.licenseImage && <div className='signup__errors'>{errors.licenseImage}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Upload Tax Registration Certificate</label>
                            <ImageUploaders onUploadStatusChange={handleImageUpload} imageType="tax" reset={resetUploaders} allowMultiple={true} />
                            {errors.taxImage && <div className='signup__errors'>{errors.taxImage}</div>}
                        </div>

                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Upload a Certificate</label>
                            <ImageUploaders onUploadStatusChange={handleImageUpload} imageType="certificate" reset={resetUploaders} allowMultiple={true} />
                            {errors.certificateImage && <div className='signup__errors'>{errors.certificateImage}</div>}
                        </div>

                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Upload Company Logo</label>
                            <ImageUploaders onUploadStatusChange={handleImageUpload} imageType="logo" reset={resetUploaders} allowMultiple={false} />
                            {errors.logoImage && <div className='signup__errors'>{errors.logoImage}</div>}
                        </div>
                        <div className='signup-form-section-checkbox'>
                            <div className='signup-form-inner-section-checkbox'>
                                <label className='signup-form-checkbox-label'>
                                    <input
                                        style={{ width: '20px', height: '20px' }}
                                        className='signup-form-checkbox-input'
                                        type='checkbox'
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                    I agree to the terms and conditions
                                </label>
                            </div>
                            {errors.terms && <div className='signup__errors'>{errors.terms}</div>}
                        </div>
                        <div className='signup-form-cont-button'>
                            <div className='signup-form-button-cancel' onClick={handleCancel}>Cancel</div>
                            <button 
                            type='submit' 
                            className='signup-form-button-submit'
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
            <SuccessModal show={showModal} handleClose={handleCloseModal} />
        </>
    );
};

export default SignUp;
