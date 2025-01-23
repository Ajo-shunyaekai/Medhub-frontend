import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select, { components } from 'react-select';
import countryList from 'react-select-country-list';
import { Tooltip, TooltipProvider } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Information from '../../../assest/images/infomation.svg'
import { Country, State, City } from "country-state-city";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import './signup.css'
import logo from '../../../assest/images/navibluelogo.svg'
import SuccessModal from './SuccessModal';
import ImageUploaders from './ImageUploader';
import { parsePhoneNumberFromString, isValidNumber } from 'libphonenumber-js';
// import { postRequestWithFile } from '../api/Requests';
import { InputMask } from '@react-input/mask';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { apiRequests } from '../../../../api/index';
import TermsAndConditions from '../../../../Policies/Terms&Conditions';


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

const SignUp = ({ socket }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [showTnC, setShowTnC] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isChecked, setIsChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [countries, setCountries] = useState([]);
    const [companyPhone, setCompanyPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [resetUploaders, setResetUploaders] = useState(false);
    const [selectedCompanyType, setSelectedCompanyType] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [tradeLicensePreviews, setTradeLicensePreviews] = useState([]);
    const [taxRegPreviews, setTaxRegPreviews] = useState([]);
    const [certificatePreviews, setcertificatePreviews] = useState([]);
    const [medicalPractitionerPreview, setMedicalPractiotionerPreview] = useState([])
    const [logoPreviews, setlogoPreviews] = useState([]);

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
        activityCode:'',
        taxImage: null,
        taxImageType: 'tax',
        logoImage: null,
        logoImageType: 'logo',
        licenseImage: null,
        licenseImageType: 'license',
        certificateImage: null,
        certificateImageType: 'certificate',
        medicalCertificateImage: null,
        medicalCertificateType: 'medicalCertificate',
        registrationNo: '',
        vatRegistrationNo: '',
        locality: '',
        landMark: '',
        country: null,
        state: null,
        city: null,
        pincode: '',
        user_type: 'Buyer'
    }

   

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        setSelectedState(null);
        setSelectedCity(null);

        if (!selectedOption) {
            setErrors((prevState) => ({
                ...prevState,
                country: "Country is required",
            }));
        } else {
            setErrors((prevState) => ({ ...prevState, country: "" }));
            setFormData({ ...formData, country: selectedOption });
        }
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        setSelectedCity(null);

        if (!selectedOption) {
            setErrors((prevState) => ({
                ...prevState,
                state: "State is required",
            }));
        } else {
            setErrors((prevState) => ({ ...prevState, state: "" }));
            setFormData({ ...formData, state: selectedOption });
        }
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);

        if (!selectedOption) {
            setErrors((prevState) => ({
                ...prevState,
                city: "City is required",
            }));
        } else {
            setErrors((prevState) => ({ ...prevState, city: "" }));
            setFormData({ ...formData, city: selectedOption });
        }
    };

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
        { value: 'medical practitioner', label: 'Medical Practitioner' }
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


    // const handleChange = (event) => {
    //     const { name, value } = event.target;

    //     // Regex to allow only alphanumeric characters and spaces
    //     const alphanumericNoSpaceRegex = /^[a-zA-Z0-9]*$/;

    //     // Regex to allow empty string or only one white space between numbers for yearlyPurchaseValue
    //     const yearlyPurchaseValueRegex = /^\d{0,8}$/;

    //     if ((name === 'companyName' || name === 'companyEmail' || name === 'email') && value.length > 50) {
    //         // setErrors((prevState) => ({
    //         //     ...prevState,
    //         //     [name]: `${
    //         //         name === 'companyName' 
    //         //         ? 'Company Name' 
    //         //         : name === 'companyEmail' 
    //         //         ? 'Company Email' 
    //         //         : 'Email'
    //         //     } cannot exceed 50 characters`,
    //         // }));

    //         setErrors((prevState) => ({
    //             ...prevState,
    //             [name]: ``,
    //         }));
    //         return;
    //     }


    //     if (['registrationNo', 'vatRegistrationNo', 'companyLicenseNo', 'companyTaxNo'].includes(name)) {
    //         if (value.length > 16) {
    //             setErrors(prevState => ({ ...prevState, [name]: '' }));
    //             return;
    //         }

    //         // Disallow spaces in these fields
    //         if (!alphanumericNoSpaceRegex.test(value)) {
    //             setErrors(prevState => ({ ...prevState, [name]: '' }));
    //             return;
    //         }
    //     }

    //     // Validate yearlyPurchaseValue to allow only one whitespace or an empty value
    //     if (name === 'yearlyPurchaseValue') {
    //         if (!yearlyPurchaseValueRegex.test(value)) {
    //             setErrors(prevState => ({ ...prevState, yearlyPurchaseValue: '' }));
    //             return;
    //         }
    //     }

    //     if (name === 'description' && value.length > 1000) {
    //         setErrors(prevState => ({ ...prevState, description: 'Description cannot exceed 1000 characters' }));
    //     } else if ((name === 'contactPersonName' || name === 'designation') && !/^[a-zA-Z\s]*$/.test(value)) {
    //         setErrors(prevState => ({ ...prevState, designation: '' }));
    //     } else if (name === 'delivertime' && !/^\d{0,3}$/.test(value)) {
    //         setErrors(prevState => ({ ...prevState, delivertime: 'Invalid delivery time' }));
    //     } else {
    //         setFormData(prevState => ({ ...prevState, [name]: value }));
    //         setErrors(prevState => ({ ...prevState, [name]: '' }));
    //     }
    // };

    const handleChange = (event) => {
        const { name, value } = event.target;
        
        // Regex patterns
        const alphanumericNoSpaceRegex = /^[a-zA-Z0-9]*$/;
        const yearlyPurchaseValueRegex = /^\d{0,8}$/;
      
        // Handle license expiry date validation
        if (name === 'companyLicenseExpiry') {
          // Always update the form data to show the input
          setFormData(prevState => ({
            ...prevState,
            [name]: value
          }));
      
          // Check for empty value
          if (!value) {
            setErrors(prevState => ({
              ...prevState,
              companyLicenseExpiry: 'This field is required'
            }));
            return;
          }
      
          // Validate date format using regex
          const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
          if (!dateRegex.test(value)) {
            setErrors(prevState => ({
              ...prevState,
              companyLicenseExpiry: 'Please enter date in DD-MM-YYYY format'
            }));
            return;
          }
      
          const [day, month, year] = value.split('-').map(Number);
          
          // Validate date components
          if (
            month < 1 || month > 12 ||
            day < 1 || day > 31 ||
            year < 2024  // Assuming we don't want dates before 2024
          ) {
            setErrors(prevState => ({
              ...prevState,
              companyLicenseExpiry: 'Please enter a valid date'
            }));
            return;
          }
      
          // Create date objects for comparison
          const inputDate = new Date(year, month - 1, day);
          const currentDate = new Date();
          
          // Reset time parts
          currentDate.setHours(0, 0, 0, 0);
          inputDate.setHours(0, 0, 0, 0);
      
          // Validate if date is actually valid (handles cases like 31st Feb)
          if (
            inputDate.getFullYear() !== year ||
            inputDate.getMonth() !== month - 1 ||
            inputDate.getDate() !== day
          ) {
            setErrors(prevState => ({
              ...prevState,
              companyLicenseExpiry: 'Please enter a valid date'
            }));
            return;
          }
      
          // Check if date is in the future
          if (inputDate <= currentDate) {
            setErrors(prevState => ({
              ...prevState,
              companyLicenseExpiry: 'License expiry date must be a future date'
            }));
            return;
          }
      
          // Clear errors if all validations pass
          setErrors(prevState => ({
            ...prevState,
            companyLicenseExpiry: ''
          }));
          return;
        }
      
        // Rest of your existing validations...
        if ((name === 'companyName' || name === 'companyEmail' || name === 'email') && value.length > 50) {
          setErrors(prevState => ({
            ...prevState,
            [name]: ''
          }));
          return;
        }
      
        if (['registrationNo', 'vatRegistrationNo', 'companyLicenseNo', 'companyTaxNo'].includes(name)) {
          if (value.length > 16) {
            setErrors(prevState => ({
              ...prevState,
              [name]: ''
            }));
            return;
          }
          if (!alphanumericNoSpaceRegex.test(value)) {
            setErrors(prevState => ({
              ...prevState,
              [name]: ''
            }));
            return;
          }
        }
      
        if (name === 'yearlyPurchaseValue') {
          if (!yearlyPurchaseValueRegex.test(value)) {
            setErrors(prevState => ({
              ...prevState,
              yearlyPurchaseValue: ''
            }));
            return;
          }
        }
      
        if (name === 'description' && value.length > 1000) {
          setErrors(prevState => ({
            ...prevState,
            description: 'Description cannot exceed 1000 characters'
          }));
        } 
        else if ((name === 'contactPersonName' || name === 'designation') && !/^[a-zA-Z\s]*$/.test(value)) {
          setErrors(prevState => ({
            ...prevState,
            [name]: ''
          }));
        }
        else if (name === 'delivertime' && !/^\d{0,3}$/.test(value)) {
          setErrors(prevState => ({
            ...prevState,
            delivertime: 'Invalid delivery time'
          }));
        }
        else {
          setFormData(prevState => ({
            ...prevState,
            [name]: value
          }));
          setErrors(prevState => ({
            ...prevState,
            [name]: ''
          }));
        }
      };

    const handlePhoneChange = (name, value) => {
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
        // if (!formData.companyLicenseExpiry) formErrors.companyLicenseExpiry = 'Company License Expiry is Required';
        // License expiry date validation
    if (!formData.companyLicenseExpiry) {
        formErrors.companyLicenseExpiry = 'Company License Expiry Date is Required';
    } else {
        // Check if date is in valid format
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (!dateRegex.test(formData.companyLicenseExpiry)) {
            formErrors.companyLicenseExpiry = 'Please enter date in DD-MM-YYYY format';
        } else {
            const [day, month, year] = formData.companyLicenseExpiry.split('-').map(Number);
            const inputDate = new Date(year, month - 1, day);
            const currentDate = new Date();
            
            // Reset time parts for accurate comparison
            currentDate.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);

            // Check if it's a valid date (e.g., not 31st Feb)
            if (
                inputDate.getFullYear() !== year ||
                inputDate.getMonth() !== month - 1 ||
                inputDate.getDate() !== day
            ) {
                formErrors.companyLicenseExpiry = 'Please enter a valid date';
            }
            // Check if date is in the future
            else if (inputDate <= currentDate) {
                formErrors.companyLicenseExpiry = 'License expiry date must be a future date';
            }
        }
    }
        if (!formData.yearlyPurchaseValue) formErrors.yearlyPurchaseValue = 'Yearly Purchase Value is Required';
        if (!formData.companyTaxNo) formErrors.companyTaxNo = 'Company Tax No. is Required';
        if (!formData.interestedIn) formErrors.interestedIn = 'Interested in  is Required';
        // if (!isChecked) formErrors.terms = 'You must agree to the terms and conditions';
        if (!formData.description) formErrors.description = 'Description is Required';
        if (formData.description.length > 1000) formErrors.description = 'Description cannot exceed 1000 characters';
        if (!formData.taxImage) formErrors.taxImage = 'Tax Image is Required';
        if (!formData.logoImage) formErrors.logoImage = 'Company Logo is Required';
        if (!formData.licenseImage) formErrors.licenseImage = 'License Image is Required';
        if (!formData.certificateImage) formErrors.certificateImage = 'Certificate Image is Required';
        if (!formData.registrationNo) formErrors.registrationNo = 'Registration No. is Required';
        if (!formData.vatRegistrationNo) formErrors.vatRegistrationNo = 'VAT Registration No. is Required';
        // if (!formData.medicalCertificate) formErrors.medicalCertificate = 'Medical Certificate Image is Required';
        if (selectedCompanyType?.value === "medical practitioner" && !formData.medicalCertificateImage) {
            formErrors.medicalCertificateImage = 'Medical Certificate Image is Required';
        }
        if (!formData.activityCode) formErrors.activityCode = 'Business/Trade Activity is Required';
        if (!formData.locality) formErrors.locality = 'Locality is Required';
        if (!formData.country) formErrors.country = 'Country is Required';
        if (!formData.state) formErrors.state = 'State is Required';
        if (!formData.city) formErrors.city = 'City is Required';
        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    useEffect(() => {
        if (resetUploaders) {
            setResetUploaders(false);
        }
    }, [resetUploaders]);

    const handleCancel = () => {
        // setFormData(defaultFormData)
        // setErrors({});
        // setIsChecked(false);
        // setCompanyPhone('');
        // setMobile('');
        // setSelectedCompanyType(null)
        // setSelectedOptions([])
        // setResetUploaders(true);
        navigate('/buyer/login')
    }

    const handleResetForm = () => {
        setFormData(defaultFormData)
        setErrors({});
        setIsChecked(false);
        setCompanyPhone('');
        setMobile('');
        setSelectedCompanyType(null)
        setSelectedOptions([])
        setResetUploaders(true);
        setSelectedCountry(null)
        setSelectedState(null)
        setSelectedCity(null)
    }


    const handleSubmit = async () => {
        if (validateForm()) {
            if (!isChecked) {
                toast("You must agree to the terms and conditions", { type: 'error' });
                return;
            }
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
            formDataToSend.append('activity_code', formData.activityCode);
            formDataToSend.append('user_type', formData.user_type || 'Buyer');
            // New data fields
            formDataToSend.append('locality', formData.locality);
            formDataToSend.append('land_mark', formData.landMark);
            formDataToSend.append('country', formData.country?.name);
            formDataToSend.append('state', formData.state?.name);
            formDataToSend.append('city', formData.city?.name);
            formDataToSend.append('pincode', formData.pincode);


            Array.from(formData.logoImage).forEach(file => formDataToSend.append('buyer_image', file));
            Array.from(formData.licenseImage).forEach(file => formDataToSend.append('license_image', file));
            Array.from(formData.taxImage).forEach(file => formDataToSend.append('tax_image', file));
            Array.from(formData.certificateImage).forEach(file => formDataToSend.append('certificate_image', file));
            if (selectedCompanyType?.value === "medical practitioner") {
                Array.from(formData.medicalCertificateImage).forEach(file => formDataToSend.append('medical_practitioner_image', file));
            }
            
            console.log(`\n FORM DATA FOR API PAYLOAD OF REGISTER BUYER : \n${formDataToSend}`)


            console.log(`formDataToSend ${formDataToSend}`)
            try {
                const response = await apiRequests?.postRequestWithFile(`auth/register`, formDataToSend, "Buyer")
                if (response?.code !== 200) {
                    // setButtonLoading(false)
                    setLoading(false)
                    toast(response.message, { type: 'error' })
                    console.log('error in buyer/register api');
                    return
                }
                // handleCancel()
                handleResetForm()
                setShowModal(true)
                // setButtonLoading(false)
                setLoading(false)
                setMedicalPractiotionerPreview([])

                socket.emit('buyerRegistration', {
                    adminId: process.env.REACT_APP_ADMIN_ID,
                    message: `New Buyer Registration Request `,
                    link: process.env.REACT_APP_PUBLIC_URL
                    // send other details if needed
                });


            } catch (error) {
                // setButtonLoading(false)
                setLoading(false)
                toast(error.message, { type: 'error' })
                console.log('error in buyer/register api');

            } finally {

                setLoading(false)

            }
        } else {
            setLoading(false)
            toast('Some Fields are Missing', { type: 'error' })
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit();
    };
    const handlePermissionSubmit = () => {
        setLoading(true);
        // Simulate form submission and loading state
        setTimeout(() => {
            setLoading(false);
            alert('Signup Successful!');
        }, 2000); // Simulate loading for 2 seconds
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
            {
                showTnC
                    ?
                    <TermsAndConditions
                        setShowTnC={setShowTnC}
                        showTnC={showTnC}
                        isChecked={isChecked}
                        setIsChecked={setIsChecked}

                    />
                    :
                    <>
                        <div className='signup-container'>
                            <div className='signup-logo-section'>
                                <img src={logo} alt='Signup Logo' />
                            </div>
                            <div className='signup-form-section'>
                                <div className='signup-form-section-heading'>Buyer Registration</div>
                                <form className='signup-form-container' onSubmit={handleFormSubmit}>
                                    <div className='signup-form-section-container'>
                                        <div className='signup-inner-heading'>Company Details</div>
                                        <div className='signup-form-inner-div-section'>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Company Type<span className='labelstamp'>*</span></label>
                                                <Select
                                                    value={selectedCompanyType}
                                                    onChange={handleCompanyTypeChange}
                                                    options={companyTypeOptions}
                                                />
                                                {errors.companyType && <div className='signup__errors'>{errors.companyType}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Company Name<span className='labelstamp'>*</span></label>
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
                                                <label className='signup-form-section-label'>Company Registration Number<span className='labelstamp'>*</span></label>
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
                                                <label className='signup-form-section-label'>VAT Registration Number<span className='labelstamp'>*</span></label>
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
                                                <label className='signup-form-section-label'>Company Email ID<span className='labelstamp'>*</span></label>
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
                                                <label className='signup-form-section-label'>Company Phone No.<span className='labelstamp'>*</span></label>
                                                <PhoneInput
                                                    className='signup-form-section-phone-input'
                                                    defaultCountry="gb"
                                                    name="companyPhone"
                                                    value={companyPhone}
                                                    onChange={(value) => {
                                                        handlePhoneChange('companyPhone', value);
                                                        setCompanyPhone(value);
                                                    }}
                                                />
                                                {errors.companyPhone && <div className='signup__errors'>{errors.companyPhone}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Company Billing Address<span className='labelstamp'>*</span></label>
                                                <input
                                                    className='signup-form-section-input'
                                                    type="text"
                                                    name="companyAddress"
                                                    placeholder="Enter Company Billing Address"
                                                    value={formData.companyAddress}
                                                    onChange={handleChange}
                                                />
                                                {errors.companyAddress && <div className='signup__errors'>{errors.companyAddress}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Area/Locality/Road Name<span className='labelstamp'>*</span></label>
                                                <input
                                                    className='signup-form-section-input'
                                                    type="text"
                                                    name="locality"
                                                    placeholder="Enter Area/Locality/Road Name"
                                                    value={formData.locality}
                                                    onChange={handleChange}
                                                />
                                                {errors.locality && <div className='signup__errors'>{errors.locality}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Landmark(Optional)</label>
                                                <input
                                                    className='signup-form-section-input'
                                                    type="text"
                                                    name="landMark"
                                                    placeholder="Enter Landmark"
                                                    value={formData.landMark}
                                                    onChange={handleChange}
                                                />
                                                {/* {errors.companyAddress && <div className='signup__errors'>{errors.companyAddress}</div>} */}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Country<span className='labelstamp'>*</span></label>
                                                <Select
                                                    options={Country.getAllCountries()}
                                                    getOptionLabel={(option) => option.name}
                                                    getOptionValue={(option) => option.isoCode}
                                                    value={selectedCountry}
                                                    onChange={handleCountryChange}
                                                    placeholder="Select Country"
                                                />
                                                {errors.country && <div className="signup__errors">{errors.country}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>State<span className='labelstamp'>*</span></label>
                                                <Select
                                                    options={
                                                        selectedCountry
                                                            ? [
                                                                ...State.getStatesOfCountry(selectedCountry.isoCode),
                                                                { name: "Other", isoCode: "OTHER" },
                                                            ]
                                                            : []
                                                    }
                                                    getOptionLabel={(option) => option.name}
                                                    getOptionValue={(option) => option.isoCode}
                                                    value={selectedState}
                                                    onChange={handleStateChange}
                                                    placeholder="Select State"
                                                />
                                                {errors.state && <div className="signup__errors">{errors.state}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>City<span className='labelstamp'>*</span></label>
                                                <Select
                                                    options={
                                                        selectedState && selectedState.isoCode !== "OTHER"
                                                            ? [
                                                                ...City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode),
                                                                { name: "Other" },
                                                            ]
                                                            : [{ name: "Other" }]
                                                    }
                                                    getOptionLabel={(option) => option.name}
                                                    getOptionValue={(option) => option.name}
                                                    value={selectedCity}
                                                    onChange={handleCityChange}
                                                    placeholder="Select City"
                                                />
                                                {errors.city && <div className="signup__errors">{errors.city}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Pincode(Optional)</label>
                                                <input
                                                    className='signup-form-section-input'
                                                    type="text"
                                                    name="pincode"
                                                    placeholder="Enter Pincode"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                />
                                                {/* {errors.companyAddress && <div className='signup__errors'>{errors.companyAddress}</div>} */}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Country of Origin<span className='labelstamp'>*</span></label>
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
                                                <label className='signup-form-section-label'>Country of Operation<span className='labelstamp'>*</span></label>
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
                                                <label className='signup-form-section-label'>Company License No.<span className='labelstamp'>*</span></label>
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
                                                <label className='signup-form-section-label'>License Expiry / Renewal Date<span className='labelstamp'>*</span></label>
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
                                                <label className='signup-form-section-label'>Company Tax No.<span className='labelstamp'>*</span></label>
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
                                                <label className='signup-form-section-label'>Approx. Yearly Purchase Value<span className='labelstamp'>*</span></label>
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
                                                <label className='signup-form-section-label'>Interested In<span className='labelstamp'>*</span></label>
                                                <MultiSelectDropdown
                                                    options={options}
                                                    value={selectedOptions}
                                                    onChange={handleMultiSelectChange}
                                                />
                                                {errors.interestedIn && <div className='signup__errors'>{errors.interestedIn}</div>}
                                            </div>

                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>About Company<span className='labelstamp'>*</span></label>
                                                <div className='signup-tooltip-class'>
                                                <textarea
                                                    className='signup-form-section-input'
                                                    name="description"
                                                    rows="2"
                                                    cols="50"
                                                    placeholder='Enter Description'
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                />
                                                 <span
                                                        className="info-icon"
                                                        data-tooltip-id="about-company-tooltip"
                                                        data-tooltip-content="Provide a brief description about your company."
                                                    >
                                                        <img src={Information} className='tooltip-icons' alt='information' />

                                                    </span>
                                                    <Tooltip id="about-company-tooltip" />
                                                </div>
                                                {errors.description && <div className='signup__errors'>{errors.description}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'> Business/Trade Activity Code<span className='labelstamp'>*</span></label>
                                                <textarea
                                                    className='signup-form-section-input'
                                                    name="activityCode"
                                                    rows="2"
                                                    cols="50"
                                                    placeholder='Enter Business/Trade Activity Code'
                                                    value={formData.activityCode}
                                                    onChange={handleChange}
                                                />
                                                {errors.activityCode && <div className='signup__errors'>{errors.activityCode}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='signup-form-section-container'>
                                        <div className='signup-inner-heading'>Contact Details</div>
                                        <div className='signup-form-inner-div-section'>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Contact Name<span className='labelstamp'>*</span></label>
                                                <input
                                                    className='signup-form-section-input'
                                                    type="text"
                                                    name="contactPersonName"
                                                    placeholder="Enter Contact Name"
                                                    value={formData.contactPersonName}
                                                    pattern="[A-Za-z\s]*"
                                                    onChange={handleChange}
                                                />
                                                {errors.contactPersonName && <div className='signup__errors'>{errors.contactPersonName}</div>}
                                            </div>

                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Email ID<span className='labelstamp'>*</span></label>
                                                <div className='signup-tooltip-class'>
                                                <input
                                                    className='signup-form-section-input'
                                                    type="text"
                                                    name="email"
                                                    placeholder="Enter Email ID"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                                 <span
                                                        className="email-info-icon"
                                                        data-tooltip-id="email-tooltip"
                                                        data-tooltip-content="Enter a valid email address for communication."
                                                    >
                                                        <img src={Information} className='tooltip-icons' alt='information' />
                                                    </span>
                                                    <Tooltip id="email-tooltip" />
                                                </div>
                                                {errors.email && <div className='signup__errors'>{errors.email}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Mobile No.<span className='labelstamp'>*</span></label>
                                                <div className='signup-tooltip-class'>
                                                <PhoneInput
                                                    className='signup-form-section-phone-input'
                                                    defaultCountry="gb"
                                                    name="mobile"
                                                    value={mobile}
                                                    onChange={(value) => {
                                                        handlePhoneChange('mobile', value);
                                                        setMobile(value);
                                                    }}

                                                />
                                                  <span
                                                        className="email-info-icon"
                                                        data-tooltip-id="mobile-tooltip"
                                                        data-tooltip-content="Provide your mobile number, including the country code."
                                                    >
                                                        <img src={Information} className='tooltip-icons' alt='information' />
                                                    </span>
                                                    <Tooltip id="mobile-tooltip" />
                                                </div>
                                                {errors.mobile && <div className='signup__errors'>{errors.mobile}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Designation<span className='labelstamp'>*</span></label>
                                                <div className='signup-tooltip-class'>
                                                <input
                                                    className='signup-form-section-input'
                                                    type="text"
                                                    name="designation"
                                                    placeholder="Enter Designation"
                                                    value={formData.designation}
                                                    onChange={handleChange}
                                                />
                                                 <span
                                                        className="email-info-icon"
                                                        data-tooltip-id="designation-tooltip"
                                                        data-tooltip-content="Mention your professional designation."
                                                    >
                                                        <img src={Information} className='tooltip-icons' alt='information' />
                                                    </span>
                                                    <Tooltip id="designation-tooltip" />
                                                </div>
                                                {errors.designation && <div className='signup__errors'>{errors.designation}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='signup-form-section-container'>
                                        <div className='signup-inner-heading'>Documents</div>
                                        <div className='signup-form-inner-div-section'>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Upload Trade License<span className='labelstamp'>*</span></label>
                                                {/* <ImageUploaders onUploadStatusChange={handleImageUpload} imageType="license" reset={resetUploaders} allowMultiple={true} /> */}
                                                <ImageUploaders onUploadStatusChange={handleImageUpload} filePreviews={tradeLicensePreviews} setFilePreviews={setTradeLicensePreviews} imageType="license" reset={resetUploaders} allowMultiple={true} />
                                                {errors.licenseImage && <div className='signup__errors'>{errors.licenseImage}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Upload Tax Registration Certificate<span className='labelstamp'>*</span></label>
                                                {/* <ImageUploaders onUploadStatusChange={handleImageUpload} imageType="tax" reset={resetUploaders} allowMultiple={true} /> */}
                                                <ImageUploaders onUploadStatusChange={handleImageUpload} filePreviews={taxRegPreviews} setFilePreviews={setTaxRegPreviews} imageType="tax" reset={resetUploaders} allowMultiple={true} />
                                                {errors.taxImage && <div className='signup__errors'>{errors.taxImage}</div>}
                                            </div>

                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Upload a Certificate<span className='labelstamp'>*</span></label>
                                                {/* <ImageUploaders onUploadStatusChange={handleImageUpload} imageType="certificate" reset={resetUploaders} allowMultiple={true} /> */}
                                                <ImageUploaders onUploadStatusChange={handleImageUpload} filePreviews={certificatePreviews} setFilePreviews={setcertificatePreviews} imageType="certificate" reset={resetUploaders} allowMultiple={true} />
                                                {errors.certificateImage && <div className='signup__errors'>{errors.certificateImage}</div>}
                                            </div>
                                            {selectedCompanyType?.value === "medical practitioner" && (
                                                <div className='signup-form-section-div'>
                                                    <label className='signup-form-section-label'>Upload a Medical Practitioner Certificate<span className='labelstamp'>*</span></label>
                                                    {/* <ImageUploaders onUploadStatusChange={handleImageUpload} imageType="medical" reset={resetUploaders} allowMultiple={true} /> */}
                                                    <ImageUploaders onUploadStatusChange={handleImageUpload} filePreviews={medicalPractitionerPreview} setFilePreviews={setMedicalPractiotionerPreview} imageType="medicalCertificate" reset={resetUploaders} allowMultiple={true} />
                                                    {errors.medicalCertificateImage && <div className='signup__errors'>{errors.medicalCertificateImage}</div>}
                                                </div>
                                            )}
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Upload Company Logo<span className='labelstamp'>*</span></label>
                                                {/* <ImageUploaders onUploadStatusChange={handleImageUpload} imageType="logo" reset={resetUploaders} allowMultiple={false} /> */}
                                                <ImageUploaders onUploadStatusChange={handleImageUpload} filePreviews={logoPreviews} setFilePreviews={setlogoPreviews} imageType="logo" reset={resetUploaders} allowMultiple={false} />
                                                {errors.logoImage && <div className='signup__errors'>{errors.logoImage}</div>}
                                            </div>
                                            <div className='signup-form-section-checkbox'>
                                                {/* <Link to='/buyer/terms-and-conditions' > */}
                                                <div className='termscondition' onClick={() => setShowTnC(true)}>Terms & Conditions<span className='labelstamp'>*</span></div>
                                                {/* </Link> */}
                                            </div>
                                        </div>
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
            }
        </>
    );
};

export default SignUp;