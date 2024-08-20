import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import countryList from 'react-select-country-list';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import '../style/signup.css';
import logo from '../assest/signup.svg'
import SuccessModal from './SuccessModal';
import ImageUploader from './ImageUploader';
import { parsePhoneNumberFromString, AsYouType  } from 'libphonenumber-js';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { postRequestWithFile } from '../api/Requests';

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

const SupplierSignUp = () => {
    const [errors, setErrors]                           = useState({});
    const [isChecked, setIsChecked]                     = useState(false);
    const [showModal, setShowModal]                     = useState(false);
    const [countries, setCountries]                     = useState([]);
    const [companyPhone, setCompanyPhone]               = useState('');
    const [companyCountryCode, setCompanyCountryCode]   = useState('')
    const [mobile, setMobile]                           = useState('');
    const [countryCode, setCountryCode]                 = useState('')
    const [resetUploaders, setResetUploaders]           = useState(false);
    const [selectedOption, setSelectedOption]           = useState(null);
    const [selectedCompanyType, setSelectedCompanyType] = useState(null);

    const [formData, setFormData] = useState({
        companyType: '',
        companyName: '',
        companyAddress: '',
        companyEmail: '',
        companyPhone: '',
        contactPersonName: '',
        designation: '',
        email: '',
        mobile: '',
        paymentterms: '',
        delivertime: '',
        tags: '',
        originCountry: '',
        operationCountries: [],
        companyLicenseNo: '',
        companyLicenseExpiry : '',
        companyTaxNo: '',
        description: '',
        taxImage: null,
        taxImageType: 'tax',
        logoImage: null,
        logoImageType: 'logo',
        licenseImage: null,
        licenseImageType: 'license',
        certificateImage: null,
        certificateImageType: 'certificate',
        terms : '',
    });
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
        // Add more options as needed
    ];

    const handleCompanyTypeChange = (selectedOption) => {
        setSelectedCompanyType(selectedOption);
        setFormData(prevState => ({ ...prevState, companyType: selectedOption }));
        if (!selectedOption) {
            setErrors(prevState => ({ ...prevState, companyType: 'Company Type is required' }));
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
        setFormData({
            ...formData,
            [`${imageType}Image`]: hasImage ? file : null,
        });

        setErrors(prevState => ({
            ...prevState,
            [`${imageType}Image`]: !hasImage && !file ? `${imageType} image is required` : '',
        }));

    };
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        
        if (name === 'description' && value.length > 1000) {
            setErrors(prevState => ({ ...prevState, description: 'Description cannot exceed 1000 characters' }));
        }  else if (name === 'designation' && !/^[a-zA-Z\s]*$/.test(value)) {
            // setErrors(prevState => ({ ...prevState, designation: 'Designation should contain only letters' }));
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
            setErrors(prevState => ({ ...prevState, [name]: '' }));
        }
    };

    const handlePhoneChange = (name, value) => {
        setErrors(prevState => ({ ...prevState, [name]: '' }));
        if (value.trim() !== '') {
            // const phoneRegex = /^[0-9]{10,15}$/;
            const phoneRegex = /^(\+[1-9]{1}[0-9]{3,14})?([0-9]{9,14})$/;
            if (phoneRegex.test(value)) {
                const countryCode = value.slice(0, value.indexOf('-'));
                const nationalNumber = value.slice(value.indexOf('-') + 1);
                const formattedNumber = `+${countryCode} ${nationalNumber}`;

                setFormData(prevState => ({ ...prevState, [name]:formattedNumber }));
            } else {
                // setErrors(prevState => ({ ...prevState, [name]: 'Invalid phone number' }));
            }
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


    const validateForm = async() => {
        let formErrors = {};
    
        if (!formData.companyType) formErrors.companyType = 'Company Type is required';
        if (!formData.companyName) formErrors.companyName = 'Company Name is required';
        if (!formData.companyAddress) formErrors.companyAddress = 'Company Address is required';
        if (!formData.companyEmail) formErrors.companyEmail = 'Company Email ID is required';
        if (formData.companyEmail && !validateEmail(formData.companyEmail)) formErrors.companyEmail = 'Invalid Company Email ID';
        if (!companyPhone || companyPhone.length <= 6) {
            formErrors.companyPhone = 'Company phone no. is required';
        }
        // if (!companyPhone) formErrors.companyPhone = 'Company Phone No. is required';
        if (!formData.contactPersonName) formErrors.contactPersonName = 'Contact Person Name is required';
        if (!formData.designation) formErrors.designation = 'Designation is required';
        if (!formData.email) formErrors.email = 'Email ID is required';
        if (formData.email && !validateEmail(formData.email)) formErrors.email = 'Invalid Email ID';
        if (!mobile || mobile.length <= 6) {
            formErrors.mobile = 'Mobile No. is required';
        }
        if (!formData.originCountry) formErrors.originCountry                  = 'Country of Origin is required';
        if (!formData.operationCountries.length) formErrors.operationCountries = 'Country of Operation is required';
        if (!formData.companyLicenseNo) formErrors.companyLicenseNo            = 'Company License No. is required';
        if (!formData.companyLicenseExpiry) formErrors.companyLicenseExpiry    = 'Company License Expiry Date is required';
        if (!formData.companyTaxNo) formErrors.companyTaxNo                    = 'Company Tax No. is required';
        if (!isChecked) formErrors.terms = 'You must agree to the terms and conditions';
        if (!formData.paymentterms) formErrors.paymentterms = 'Payment Terms are required';
        if (!formData.delivertime) formErrors.delivertime = 'Estimated Delivery Time is required';
        if (!formData.tags) formErrors.tags = 'Tags are required';
        if (!formData.description) formErrors.description = 'Description is required';
        if (formData.tags.split(',').map(tag => tag.trim()).length > 5) formErrors.tags = 'You can only enter up to 5 tags';
        if (formData.description.length > 1000) formErrors.description = 'Description cannot exceed 1000 characters';
        if (!formData.taxImage) formErrors.taxImage = 'Tax image is required';
        if (!formData.logoImage) formErrors.logoImage = 'Logo image is required';
        if (!formData.licenseImage) formErrors.licenseImage = 'License image is required';
        if (!formData.certificateImage) formErrors.certificateImage = 'Certificate image is required';
        
        
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
            const nationalNumber     = phoneNumber.nationalNumber;
            return `${countryCallingCode} ${nationalNumber}`;
        }
        return value;
    };

    const formatCompanyPhoneNumber = (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        if (phoneNumber) {
            const countryCallingCode = `+${phoneNumber.countryCallingCode}`;
            const nationalNumber     = phoneNumber.nationalNumber;
            return `${countryCallingCode} ${nationalNumber}`;
        }
        return value;
    };

    const handleCountryOriginChange = (selectedOption) => {
        console.log(selectedOption);
        setFormData({ ...formData, originCountry: selectedOption.label })
        if (!selectedOption) {
            setErrors(prevState => ({ ...prevState, originCountry: 'Country of origin is required' }));
        } else {
            setErrors(prevState => ({ ...prevState,originCountry: '' }));
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
            operationCountries: selectedLabels.length === 0 ? 'Country of operation is required' : ''
        }));
    };
    
    const getDropdownButtonLabel = ({ placeholderButtonLabel, value }) => {
        if (value && value.length) {
            return value.map(country => country.label).join(', ');
        }
        return placeholderButtonLabel;
    };
    
    const handleSubmit = () => {
        if (validateForm() && isChecked) {
            
            const formDataToSend = new FormData();
            const countryLabels = formData.operationCountries.map(country => {
                return country ? country.label : '';
            }) || [];

            formDataToSend.append('supplier_type', formData.companyType?.label);
            formDataToSend.append('supplier_name', formData.companyName);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('supplier_address', formData.companyAddress);
            formDataToSend.append('supplier_email', formData.companyEmail);
            formDataToSend.append('supplier_mobile_no', companyPhone);
            formDataToSend.append('license_no', formData.companyLicenseNo);
            formDataToSend.append('license_expiry_date', formData.companyLicenseExpiry);
            formDataToSend.append('country_of_origin', formData.originCountry);
            formDataToSend.append('contact_person_name', formData.contactPersonName);
            formDataToSend.append('designation', formData.designation);
            formDataToSend.append('payment_terms', formData.paymentterms);
            formDataToSend.append('tags', formData.tags);
            formDataToSend.append('estimated_delivery_time', formData.delivertime);
            formDataToSend.append('contact_person_mobile', mobile);
            formDataToSend.append('contact_person_email', formData.email);
            // formDataToSend.append('country_of_operation', countryLabels);
            countryLabels.forEach(item => formDataToSend.append('country_of_operation[]', item));
            formDataToSend.append('tax_no', formData.companyTaxNo);
            Array.from(formData.logoImage).forEach(file => formDataToSend.append('supplier_image', file));
            Array.from(formData.licenseImage).forEach(file => formDataToSend.append('license_image', file));
            Array.from(formData.taxImage).forEach(file => formDataToSend.append('tax_image', file));
            Array.from(formData.certificateImage).forEach(file => formDataToSend.append('certificate_image', file));

            postRequestWithFile('supplier/register', formDataToSend, async (response) => {
                if (response.code === 200) {
                    setFormData({
                        companyType: '',
                        companyName: '',
                        companyAddress: '',
                        companyEmail: '',
                        companyPhone: '',
                        contactPersonName: '',
                        designation: '',
                        email: '',
                        mobile: '',
                        paymentterms: '',
                        delivertime: '',
                        tags: '',
                        originCountry: '',
                        operationCountries: [],
                        companyLicenseNo: '',
                        companyLicenseExpiry: '',
                        companyTaxNo: '',
                        description: '',
                        taxImage: null,
                        taxImageType: 'tax',
                        logoImage: null,
                        logoImageType: 'logo',
                        licenseImage: null,
                        licenseImageType: 'license',
                        certificateImage: null,
                        certificateImageType: 'certificate'
                    });
                    setErrors({});
                    setIsChecked(false);
                    setCompanyPhone('');
                    setMobile('');
                    setSelectedCompanyType(null)
                    setResetUploaders(true);
                    setShowModal(true);
                    
                } else {
                   console.log('error in supplier/register api');
                }
            }) 
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit();
    };

    const handleCancel = () => {
        setFormData({
            companyType: '',
            companyName: '',
            companyAddress: '',
            companyEmail: '',
            companyPhone: '',
            contactPersonName: '',
            designation: '',
            email: '',
            mobile: '',
            paymentterms: '',
            delivertime: '',
            tags: '',
            originCountry: '',
            operationCountries: [],
            companyLicenseNo: '',
            companyLicenseExpiry: '',
            companyTaxNo: '',
            description: '',
            taxImage: null,
            taxImageType: 'tax',
            logoImage: null,
            logoImageType: 'logo',
            licenseImage: null,
            licenseImageType: 'license',
            certificateImage: null,
            certificateImageType: 'certificate'
        });
        setErrors({});
        setIsChecked(false);
        setCompanyPhone('');
        setMobile('');
        setSelectedCompanyType(null)
        setResetUploaders(true);
    }

    return (
        <>
            <div className='signup-container'>
                <div className='signup-logo-section'>
                    <img src={logo} alt='Signup Logo' />
                </div>
                <div className='signup-form-section'>
                    <div className='signup-form-section-heading'>Supplier Registration</div>
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
                            <label className='signup-form-section-label'>Company Phone No.</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name="companyPhone"
                                value={companyPhone}
                                onChange={(value) => {
                                    const formattedValue = formatCompanyPhoneNumber(value);
                                    setCompanyPhone(formattedValue);
                                    handlePhoneChange('companyPhone', value);
                                }}
                            />
                            {errors.companyPhone  && <div className='signup__errors'>{errors.companyPhone}</div>}
                        </div>

                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Contact Person Name</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="contactPersonName"
                                placeholder="Enter Contact Person Name"
                                value={formData.contactPersonName}
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
                                defaultCountry="ae"
                                name="mobile"
                                value={mobile}
                                onChange={(value) => {
                                    const formattedValue = formatPhoneNumber(value);
                                    setMobile(formattedValue);
                                    handlePhoneChange('mobile', value);
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
                               < ReactMultiSelectCheckboxes
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
                            <label className='signup-form-section-label'>Est. Delivery Time</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="delivertime"
                                placeholder="Enter Delivery Time"
                                value={formData.delivertime}
                                onChange={handleChange}
                            />
                            {errors.delivertime && <div className='signup__errors'>{errors.delivertime}</div>}
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
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="companyLicenseExpiry"
                                placeholder="Enter License Expiry Date"
                                value={formData.companyLicenseExpiry}
                                onChange={handleChange}
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
                            <label className='signup-form-section-label'>Tags</label>
                            <input
                                className='signup-form-section-input'
                                type="text"
                                name="tags"
                                placeholder="Enter Tags (comma separated, max 5)"
                                value={formData.tags}
                                onChange={handleChange}
                            />
                            {errors.tags && <div className='signup__errors'>{errors.tags}</div>}
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
                            <label className='signup-form-section-label'>Payment Terms</label>
                            <textarea
                                className='signup-form-section-input'
                                type="text"
                                name="paymentterms"
                                rows="4"
                                cols="50"
                                placeholder="Enter Payment Terms"
                                value={formData.paymentterms}
                                onChange={handleChange}
                            />
                            {errors.paymentterms && <div className='signup__errors'>{errors.paymentterms}</div>}
                        </div>
                       
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Upload Trade License</label>
                            <ImageUploader onUploadStatusChange={handleImageUpload} imageType="license" reset={resetUploaders} allowMultiple={true}/>
                            {errors.licenseImage && <div className='signup__errors'>{errors.licenseImage}</div>}
                        </div>
                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Upload Tax Registration Certificate</label>
                            <ImageUploader onUploadStatusChange={handleImageUpload} imageType="tax" reset={resetUploaders} allowMultiple={true}/>
                            {errors.taxImage && <div className='signup__errors'>{errors.taxImage}</div>}
                        </div>

                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Upload a Certificate</label>
                            <ImageUploader onUploadStatusChange={handleImageUpload} imageType="certificate" reset={resetUploaders} allowMultiple={true}/>
                            {errors.certificateImage && <div className='signup__errors'>{errors.certificateImage}</div>}
                        </div>

                        <div className='signup-form-section-div'>
                            <label className='signup-form-section-label'>Upload Company Logo</label>
                            <ImageUploader onUploadStatusChange={handleImageUpload} imageType="logo" reset={resetUploaders} allowMultiple={false} />
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
                            <button type='submit' className='signup-form-button-submit'>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <SuccessModal show={showModal} handleClose={handleCloseModal} />
        </>
    );
};

export default SupplierSignUp;

