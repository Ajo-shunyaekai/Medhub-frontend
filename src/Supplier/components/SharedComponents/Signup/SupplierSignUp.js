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
import './signup.css';
import logo from '../../../assest/images/logo.svg'
import SuccessModal from './SuccessModal';
import ImageUploader from './ImageUploader';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { apiRequests } from '../../../../api/index';
import { InputMask } from '@react-input/mask';
import { toast } from 'react-toastify';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
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

const SupplierSignUp = ({ socket }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [showTnC, setShowTnC] = useState(false);
    const [errors, setErrors] = useState({});
    const [isChecked, setIsChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [countries, setCountries] = useState([]);
    const [companyPhone, setCompanyPhone] = useState('');
    const [companyCountryCode, setCompanyCountryCode] = useState('')
    const [mobile, setMobile] = useState('');
    const [countryCode, setCountryCode] = useState('')
    const [resetUploaders, setResetUploaders] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedCompanyType, setSelectedCompanyType] = useState(null);
    const [addressType, setAddressType] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
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
        salesPersonName: '',
        contactPersonName: '',
        designation: '',
        email: '',
        mobile: '',
        bankdetails: '',
        delivertime: '',
        tags: '',
        originCountry: '',
        operationCountries: [],
        companyLicenseNo: '',
        companyLicenseExpiry: '',
        companyTaxNo: '',
        description: '',
        activityCode: '',
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
        terms: '',
        registrationNo: '',
        vatRegistrationNo: '',
        locality: '',
        landMark: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        user_type: 'Supplier'
    }



    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        setSelectedState('');
        setSelectedCity('');

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
        setSelectedState(selectedOption || '');
        setSelectedCity('');

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
        setSelectedCity(selectedOption || '');

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
    };

    useEffect(() => {
        const options = countryList().getData();
        setCountries(options);
    }, []);

    const companyTypeOptions = [
        { value: 'manufacturer', label: 'Manufacturer' },
        { value: 'distributor', label: 'Distributor' },
        {
            value: 'medical practitioner', label: 'Medical Practitioner'
        }
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

    //     const alphanumericNoSpaceRegex = /^[a-zA-Z0-9]*$/;

    //     if ((name === 'companyName' || name === 'companyEmail' || name === 'email') && value.length > 50) {
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

    //     if (name === 'description' && value.length > 1000) {
    //         setErrors(prevState => ({ ...prevState, description: 'Description cannot exceed 1000 characters' }));
    //     } else if ((name === 'salesPersonName' || name === 'salesPersonName') && !/^[a-zA-Z\s]*$/.test(value)) {
    //         setErrors(prevState => ({ ...prevState, salesPersonName: '' }));
    //     }
    //     else if ((name === 'contactPersonName' || name === 'designation') && !/^[a-zA-Z\s]*$/.test(value)) {
    //         setErrors(prevState => ({ ...prevState, designation: '' }));
    //     } else if (name === 'delivertime' && !/^\d{0,3}$/.test(value)) {
    //         setErrors(prevState => ({ ...prevState, delivertime: '' }));
    //     } else {
    //         setFormData(prevState => ({ ...prevState, [name]: value }));
    //         setErrors(prevState => ({ ...prevState, [name]: '' }));
    //     }
    // };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const alphanumericNoSpaceRegex = /^[a-zA-Z0-9]*$/;

        // Handle license expiry date validation
        if (name === 'companyLicenseExpiry') {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));

            // Only validate if we have a complete date
            if (value.length === 10) {
                const [day, month, year] = value.split('-').map(Number);

                // Create date objects
                const inputDate = new Date(year, month - 1, day);
                const currentDate = new Date();

                // Reset time parts for accurate comparison
                currentDate.setHours(0, 0, 0, 0);
                inputDate.setHours(0, 0, 0, 0);

                // Check if it's a valid date
                if (
                    inputDate.getFullYear() === year &&
                    inputDate.getMonth() === month - 1 &&
                    inputDate.getDate() === day
                ) {
                    // Check if date is in the future
                    if (inputDate <= currentDate) {
                        setErrors(prevState => ({
                            ...prevState,
                            companyLicenseExpiry: 'License expiry date must be a future date'
                        }));
                    } else {
                        setErrors(prevState => ({
                            ...prevState,
                            companyLicenseExpiry: ''
                        }));
                    }
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        companyLicenseExpiry: 'Please enter a valid date'
                    }));
                }
            }
            return;
        }

         //bank details validation
        if (name === 'bankdetails') {
            setFormData(prevState => ({
            ...prevState,
            [name]: value
            }));

            const details = value.split(',').map(item => item.trim());
            let errorMessage = '';

            // validation for empty input
            if (!value.trim()) {
            errorMessage = 'Please enter bank details';
            }
            // Validate number of fields
            else if (details.length > 3) {
            errorMessage = 'Too many values. Please enter only Bank Name, Account Number, and IFSC Code';
            }
            else {
            const [bankName = '', accountNumber = '', ifscCode = ''] = details;

            // Validate bank name
            if (bankName && !/^[A-Za-z\s]*$/.test(bankName)) {
                errorMessage = 'Bank name should only contain letters and spaces';
            }

            // Validate account number if bank name is valid
            else if (accountNumber) {
                if (!/^\d*$/.test(accountNumber)) {
                errorMessage = 'Account number should only contain digits';
                } else if (accountNumber.length > 0 && accountNumber.length < 8) {
                errorMessage = 'Account number should be at least 8 digits';
                } else if (accountNumber.length > 20) {
                errorMessage = 'Account number should not exceed 20 digits';
                }
            }

            // Validate IFSC code if account number is valid
            else if (ifscCode) {
                // if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
                // errorMessage = 'Invalid IFSC/Sort code format (should be like HDFC0123456)';
                // } 
                 if (ifscCode.length > 20) {
                    errorMessage = 'IFSC/Sort Code should not exceed 20 digits';
                }
            }

            // If all fields are present, verify complete format
            if (details.length === 3 && !errorMessage) {
                if (!bankName) errorMessage = 'Please enter bank name';
                else if (!accountNumber) errorMessage = 'Please enter account number';
                else if (!ifscCode) errorMessage = 'Please enter IFSC code';
            }
            }

            setErrors(prevState => ({
            ...prevState,
            bankdetails: errorMessage
            }));

            return;
        }

        // Existing validations
        if ((name === 'companyName' || name === 'companyEmail' || name === 'email' || name === 'companyAddress' 
            || name === 'locality' || name === 'landMark') && value.length > 50) {
            setErrors((prevState) => ({
                ...prevState,
                [name]: ``,
            }));
            return;
        }

        if((name === 'tags' || name === 'activityCode')&& value.length > 60) {
            setErrors((prevState) => ({
                ...prevState,
                [name]: ``,
            }));
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

        if (name === 'description' && value.length > 1000) {
            setErrors(prevState => ({ ...prevState, description: 'Description cannot exceed 1000 characters' }));
        }  else if ((name === 'contactPersonName' || name === 'designation' || name === 'salesPersonName') && 
                    (!/^[a-zA-Z\s]*$/.test(value) ||  value.length > 50)) {
            setErrors(prevState => ({ ...prevState, designation: '' }));
        } else if (name === 'delivertime' && !/^\d{0,3}$/.test(value)) {
            setErrors(prevState => ({ ...prevState, delivertime: '' }));
        } else if(name === 'pincode' && !/^\d{0,6}$/.test(value)) {
            setErrors(prevState => ({ ...prevState, pincode: '' }));
        } else {
          setFormData(prevState => ({ ...prevState, [name]: value }));
          setErrors(prevState => ({ ...prevState, [name]: '' }));
        }
    };

    const handlePhoneChange = (name, value) => {
        // Clear previous errors
        setErrors(prevState => ({ ...prevState, [name]: '' }));

        try {
            // Parse the phone number
            const phoneNumber = parsePhoneNumber(value);

            // Validate the phone number
            if (phoneNumber && isValidPhoneNumber(value)) {
                // Format the phone number in E.164 format (international standard)

                const countryCode = phoneNumber.countryCallingCode
                const nationalNumber = phoneNumber.nationalNumber
                // const formattedNumber = phoneNumber.format('E.164');
                const formattedNumber = `+${countryCode} ${nationalNumber}`
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

    const validateForm = async () => {
        let formErrors = {};

        if (!formData.companyType) formErrors.companyType = 'Company Type is Required';
        if (!formData.companyName) formErrors.companyName = 'Company Name is Required';
        if (!formData.companyAddress) formErrors.companyAddress = 'Company Address is Required';
        // if (!formData.companyEmail) formErrors.companyEmail = 'Company Email ID is Required';
        if (formData.companyEmail && !validateEmail(formData.companyEmail)) formErrors.companyEmail = 'Invalid Company Email ID';
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
        // if (!companyPhone) formErrors.companyPhone = 'Company Phone No. is Required';
        // if (!formData.salesPersonName) formErrors.salesPersonName = 'Sales Person Name is Required';
        if (!formData.contactPersonName) formErrors.contactPersonName = 'Contact Person Name is Required';
        if (!formData.designation) formErrors.designation = 'Designation is Required';
        if (!formData.email) formErrors.email = 'Email ID is Required';
        if (formData.email && !validateEmail(formData.email)) formErrors.email = 'Invalid Email ID';
        if (!formData.originCountry) formErrors.originCountry = 'Country of Origin is Required';
        if (!formData.operationCountries.length) formErrors.operationCountries = 'Country of Operation is Required';
        if (!formData.companyLicenseNo) formErrors.companyLicenseNo = 'Company License No. is Required';
        // if (!formData.companyLicenseExpiry) formErrors.companyLicenseExpiry = 'Company License Expiry Date is Required';
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
        if (!formData.companyTaxNo) formErrors.companyTaxNo = 'Company Tax No. is Required';
        // if (!isChecked) formErrors.terms = 'You must agree to the terms and conditions';
        if (!formData.bankdetails) formErrors.bankdetails = 'Bank Details are Required';
        // if (!formData.delivertime) formErrors.delivertime = 'Estimated Delivery Time is Required';
        if (!formData.tags) formErrors.tags = 'Tags are Required';
        if (!formData.description) formErrors.description = 'Description is Required';
        if (formData.tags.split(',').map(tag => tag.trim()).length > 5) formErrors.tags = 'You can only enter up to 5 tags';
        if (formData.description.length > 1000) formErrors.description = 'Description cannot exceed 1000 characters';

        if (!formData.taxImage) formErrors.taxImage = 'Tax Image is Required';
        if (!formData.logoImage) formErrors.logoImage = 'Logo Image is Required';
        if (!formData.licenseImage) formErrors.licenseImage = 'License Image is Required';
        if (!formData.certificateImage) formErrors.certificateImage = 'Certificate Image is Required';
        // if (!formData.medicalCertificate) formErrors.medicalCertificate = 'Medical Certificate Image is Required';
        if (selectedCompanyType?.value === "medical practitioner" && !formData.medicalCertificateImage) {
            formErrors.medicalCertificateImage = 'Medical Certificate Image is Required';
        }
        if (!formData.registrationNo) formErrors.registrationNo = 'Registration No. is Required';
        if (!formData.vatRegistrationNo) formErrors.vatRegistrationNo = 'VAT Registration No. is Required';
        if (!formData.activityCode) formErrors.activityCode = 'Business/Trade Activity is Required';


        if (!formData.locality) formErrors.locality = 'Locality is Required';
        if (!formData.country) formErrors.country = 'Country is Required';

        console.log('Validation Errors:', formErrors);
        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    useEffect(() => {
        if (resetUploaders) {
            setResetUploaders(false);
        }
    }, [resetUploaders]);


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

    const formatCompanyPhoneNumber = (value) => {
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

    const handleCancel = () => {
        // setFormData(defaultFormData);
        // setErrors({});
        // setIsChecked(false);
        // setCompanyPhone('');
        // setMobile('');
        // setSelectedCompanyType(null)
        // setResetUploaders(true);
        navigate('/supplier/login')
    }

    const handleResetForm = () => {
        setFormData(defaultFormData);
        setErrors({});
        setIsChecked(false);
        setCompanyPhone('');
        setMobile('');
        setSelectedCompanyType(null)
        setResetUploaders(true);
        setSelectedCountry(null)
        setSelectedState(null)
        setSelectedCity(null)
    }

    const handleSubmit = async () => {
        const isFormValid = await validateForm();
        console.log('Is Form Valid:', isFormValid);
        if (isFormValid) {
            if (!isChecked) {
                toast("You must agree to the terms and conditions", { type: 'error' });
                return;
            }
            setLoading(true)
            const formDataToSend = new FormData();
            const countryLabels = formData.operationCountries.map(country => {
                return country ? country.label : '';
            }) || [];

            formDataToSend.append('supplier_type', formData.companyType?.label);
            formDataToSend.append('supplier_name', formData.companyName);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('supplier_address', formData.companyAddress);
            // formDataToSend.append('supplier_email', formData.companyEmail);
            // formDataToSend.append('supplier_mobile_no', companyPhone);
            formDataToSend.append('supplier_mobile_no', formData.companyPhone);
            formDataToSend.append('license_no', formData.companyLicenseNo);
            formDataToSend.append('license_expiry_date', formData.companyLicenseExpiry);
            formDataToSend.append('country_of_origin', formData.originCountry);
            formDataToSend.append('sales_person_name', formData.salesPersonName);
            formDataToSend.append('contact_person_name', formData.contactPersonName);
            formDataToSend.append('designation', formData.designation);
            formDataToSend.append('bank_details', formData.bankdetails);
            formDataToSend.append('tags', formData.tags);
            formDataToSend.append('estimated_delivery_time', formData.delivertime);
            // formDataToSend.append('contact_person_mobile', mobile);
            formDataToSend.append('contact_person_mobile', formData.mobile);
            formDataToSend.append('contact_person_email', formData.email);
            formDataToSend.append('registration_no', formData.registrationNo);
            formDataToSend.append('vat_reg_no', formData.vatRegistrationNo);
            countryLabels.forEach(item => formDataToSend.append('country_of_operation[]', item));
            formDataToSend.append('tax_no', formData.companyTaxNo);
            formDataToSend.append('activity_code', formData.activityCode);

            // New data fields
            formDataToSend.append('locality', formData.locality);
            formDataToSend.append('land_mark', formData.landMark);
            formDataToSend.append('country', formData.country?.name);
            formDataToSend.append('state', formData.state?.name || '');
            formDataToSend.append('city', formData.city?.name || '');
            formDataToSend.append('pincode', formData.pincode);
            formDataToSend.append('user_type', formData.user_type);

            (Array.isArray(formData.logoImage) ? formData.logoImage : []).forEach(file => formDataToSend.append('supplier_image', file));
            (Array.isArray(formData.licenseImage) ? formData.licenseImage : []).forEach(file => formDataToSend.append('license_image', file));
            (Array.isArray(formData.taxImage) ? formData.taxImage : []).forEach(file => formDataToSend.append('tax_image', file));
            (Array.isArray(formData.certificateImage) ? formData.certificateImage : []).forEach(file => formDataToSend.append('certificate_image', file));
            if (selectedCompanyType?.value === "medical practitioner") {
                (Array.isArray(formData.medicalCertificateImage) ? formData.medicalCertificateImage : []).forEach(file => formDataToSend.append('medical_practitioner_image', file));
            }

            try {
                const response = await apiRequests?.postRequestWithFile(`auth/register`, formDataToSend, "Supplier")
                if (response?.code !== 200) {
                    setLoading(false)
                    toast(response.message, { type: 'error' })
                    console.log('error in supplier/register api');
                    return;
                }
                // handleCancel()
                handleResetForm()
                setShowModal(true);
                setLoading(false)
                setMedicalPractiotionerPreview([])

                socket.emit('supplierRegistration', {
                    adminId: process.env.REACT_APP_ADMIN_ID,
                    message: `New Supplier Registration Request `,
                    link: process.env.REACT_APP_PUBLIC_URL
                    // send other details if needed
                });
            } catch (error) {
                // setButtonLoading(false)
                setLoading(false)
                toast(error.message, { type: 'error' })
                console.log('error in buyer/register api');

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
                                <div className='signup-form-section-heading'>Supplier Registration</div>
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
                                                <label className='signup-form-section-label'>State/Province</label>
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

                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>City/Town</label>
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

                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Pincode/Postcode(Optional)</label>
                                                <input
                                                    className='signup-form-section-input'
                                                    type="text"
                                                    name="pincode"
                                                    placeholder="Enter Pincode/Postcode"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                />
                                                {/* {errors.companyAddress && <div className='signup__errors'>{errors.companyAddress}</div>} */}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Sales Person Name</label>
                                                <input
                                                    className='signup-form-section-input'
                                                    type="text"
                                                    name="salesPersonName"
                                                    placeholder="Enter Sales Person Name"
                                                    value={formData.salesPersonName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Country of Origin<span className='labelstamp'>*</span></label>
                                                <Select
                                                    className='signup-forms-sections-select'
                                                    options={countries}
                                                    value={countries.find(option => option.value === formData.originCountry)}
                                                    onChange={handleCountryOriginChange}
                                                />
                                                {errors.originCountry && <div className='signup__errors'>{errors.originCountry}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Country of Operation<span className='labelstamp'>*</span></label>
                                                {countries.length > 0 && (
                                                    < MultiSelectDropdown
                                                        className='signup-forms-sections-select custom-multi-select'
                                                        options={countries}
                                                        value={formData.operationCountries}
                                                        onChange={handleOperationCountriesChange}
                                                        getDropdownButtonLabel={getDropdownButtonLabel}
                                                        style={{ width: '100%!important' }}
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
                                                    replacement={{ d: /\d/, m: /\d/, y: /\d/ }} showMask separate />

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
                                                <label className='signup-form-section-label'>Tags<span className='labelstamp'>*</span></label>
                                                <input
                                                    className='signup-form-section-input'
                                                    type="text"
                                                    name="tags"
                                                    placeholder="Enter Tags (comma separated)"
                                                    value={formData.tags}
                                                    onChange={handleChange}
                                                />
                                                {errors.tags && <div className='signup__errors'>{errors.tags}</div>}
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
                                                <label className='signup-form-section-label'>
                                                    Bank Details<span className='labelstamp'>*</span>
                                                </label>
                                                <div className='signup-tooltip-class'>
                                                    <textarea
                                                        className='signup-form-section-input'
                                                        type="text"
                                                        name="bankdetails"
                                                        rows="2"
                                                        cols="50"
                                                        placeholder="Enter Bank Details (Bank Name, Account Number, IFSC Code)"
                                                        value={formData.bankdetails}
                                                        onChange={handleChange}
                                                    />
                                                    <span
                                                        className="info-icon"
                                                        data-tooltip-id="bank-details-tooltip"
                                                        data-tooltip-content="Provide the following information: 
                                                             Bank Name ,
                                                            Account Number ,
                                                             IFSC Code,
                                                            (comma seperated)
                                                            "
                                                            
                                                    >
                                                        <img src={Information} className='tooltip-icons' alt='information' />
                                                    </span>
                                                    <Tooltip id="bank-details-tooltip" />
                                                </div>
                                                {errors.bankdetails && <div className='signup__errors'>{errors.bankdetails}</div>}
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
                                                            // Update local state for the input
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
                                                {/* <ImageUploader onUploadStatusChange={handleImageUpload} imageType="license" reset={resetUploaders} allowMultiple={true} /> */}
                                                <ImageUploader onUploadStatusChange={handleImageUpload} filePreviews={tradeLicensePreviews} setFilePreviews={setTradeLicensePreviews} imageType="license" reset={resetUploaders} allowMultiple={true} />
                                                {errors.licenseImage && <div className='signup__errors'>{errors.licenseImage}</div>}
                                            </div>
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Upload Tax Registration Certificate<span className='labelstamp'>*</span></label>
                                                {/* <ImageUploader onUploadStatusChange={handleImageUpload} imageType="tax" reset={resetUploaders} allowMultiple={true} /> */}
                                                <ImageUploader onUploadStatusChange={handleImageUpload} filePreviews={taxRegPreviews} setFilePreviews={setTaxRegPreviews} imageType="tax" reset={resetUploaders} allowMultiple={true} />
                                                {errors.taxImage && <div className='signup__errors'>{errors.taxImage}</div>}
                                            </div>

                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Upload a Certificate<span className='labelstamp'>*</span></label>
                                                {/* <ImageUploader onUploadStatusChange={handleImageUpload} imageType="certificate" reset={resetUploaders} allowMultiple={true} /> */}
                                                <ImageUploader onUploadStatusChange={handleImageUpload} filePreviews={certificatePreviews} setFilePreviews={setcertificatePreviews} imageType="certificate" reset={resetUploaders} allowMultiple={true} />
                                                {errors.certificateImage && <div className='signup__errors'>{errors.certificateImage}</div>}
                                            </div>
                                            {selectedCompanyType?.value === "medical practitioner" && (
                                                <div className='signup-form-section-div'>
                                                    <label className='signup-form-section-label'>Upload a Medical Practitioner Certificate<span className='labelstamp'>*</span></label>
                                                    <ImageUploader onUploadStatusChange={handleImageUpload} filePreviews={medicalPractitionerPreview} setFilePreviews={setMedicalPractiotionerPreview} imageType="medicalCertificate" reset={resetUploaders} allowMultiple={true} />
                                                    {errors.medicalCertificateImage && <div className='signup__errors'>{errors.medicalCertificateImage}</div>}
                                                </div>
                                            )}
                                            <div className='signup-form-section-div'>
                                                <label className='signup-form-section-label'>Upload Company Logo<span className='labelstamp'>*</span></label>
                                                {/* <ImageUploader onUploadStatusChange={handleImageUpload} imageType="logo" reset={resetUploaders} allowMultiple={false} /> */}
                                                <ImageUploader onUploadStatusChange={handleImageUpload} filePreviews={logoPreviews} setFilePreviews={setlogoPreviews} imageType="logo" reset={resetUploaders} allowMultiple={false} />
                                                {errors.logoImage && <div className='signup__errors'>{errors.logoImage}</div>}
                                            </div>
                                            <div className='signup-form-section-checkbox'>
                                                {/* <Link to='/supplier/terms-and-conditions' > */}
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

export default SupplierSignUp;