import React, { useState, useEffect } from 'react';
import styles from '../style/addproduct.module.css';
import Select, { components } from 'react-select';
import countryList from 'react-select-country-list';
import ImageAddUploader from './ImageAppUploader';
import CloseIcon from '@mui/icons-material/Close';
import AddPdfUpload from './AddPdfUpload';
import { postRequest, postRequestWithTokenAndFile } from '../api/Requests';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from 'react-spinners';
import Loader from '../components/Loader';


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

const debounce = (func, delay) => {
    let debounceTimer;
    return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
    };
};

const AddProduct = ({socket}) => {

    const navigate = useNavigate()

    const productTypeOptions = [
        { value: 'new_product', label: 'New Product' },
        { value: 'secondary_market', label: 'Secondary Market' }
    ];

    const formTypesOptions = [
        { value: 'tablet', label: 'Tablet' },
        { value: 'syrup', label: 'Syrup' }
    ];
    const conditionOptions = [
        { value: 'new', label: 'New' },
        { value: 'used', label: 'Used' },
        { value: 'refurbished', label: 'Refurbished' }
    ];

    const quantityOptions = [
        { value: '0-500', label: '0-500' },
        { value: '500-1000', label: '500-1000' },
        { value: '1000-2000', label: '1000-2000' },
        { value: '2000-5000', label: '2000-5000' },
    ];

    const productCategoryOptions = [
        { value: 'generics', label: 'Generics' },
        { value: 'originals', label: 'Originals' },
        { value: 'biosimilars', label: 'Biosimilars' },
        { value: 'medicaldevices', label: 'Medical Devices' },
        { value: 'nutraceuticals', label: 'Nutraceuticals' }
    ];

    const [loading, setLoading]                                         = useState(false);
    const [productType, setProductType]                                 = useState({ value: 'new_product', label: 'New Product' },);
    const [formType, setFormType]                                       = useState()
    const [condition, setCondition]                                     = useState()
    const [productCategory, setProductCategory]                         = useState()
    const [countryOfOrigin, setCountryOfOrigin]                         = useState('')
    const [registeredCountries, setRegisteredCountries]                 = useState([])
    const [stockedIn, setStockedIn]                                     = useState([])
    const [availableCountries, setAvailableCountries]                   = useState([])
    const [countries, setCountries]                                     = useState([]);
    const [medicineImages, setMedicineImages]                           = useState([])
    const [invoiceImages, setInvoiceImages]                             = useState([])
    const [manufacturerCountryOfOrigin, setManufacturerCountryOfOrigin] = useState('')
    const [stockedInOptions, setStockedInOptions]                       = useState([])
    const [medicineData, setMedicineData]                               = useState()

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        productName: '',
        productType: productType,
        composition: '',
        unitTax: '',
        strength: '',
        typeOfForm: null,
        shelfLife: '',
        dossierType: '',
        dossierStatus: '',
        productCategory: null,
        totalQuantity: '',
        gmpApprovals: '',
        shippingTime: '',
        originCountry: '',
        registeredIn: '',
        stockedIn: '',
        availableFor: '',
        tags: '',
        description: '',
        product_image: medicineImages,
        invoice_image: invoiceImages,
        //for secondary market
        purchasedOn: '',
        minPurchaseUnit: '',
        countryAvailableIn: '',
        condition: '',
        manufacturerName: '',
        manufacturerOriginCountry: '',
        manufacturerDescription: '',
        stockedInData: ''
    })

    useEffect(() => {
        const countryOptions = countryList().getData();
        setCountries(countryOptions);
    }, []);

    const handleQuantityChange = (index, selected) => {
        // if (productType.label === 'New Product') {
        const newFormSections = [...formSections];
        newFormSections[index].quantity = selected;
        setErrors(prevErrors => ({
            ...prevErrors,
            [`quantity${index}`]: ''
        }));
        const quantities = newFormSections.map(section => section.quantity);
        setFormData({
            ...formData,
            quantity: quantities
        });
        setFormSections(newFormSections);
        // }
    };

    const handleStockedInCountryChange = (index, selected) => {
        const updatedSections = [...stockedInSections];
        updatedSections[index].stockedInCountry = selected;
        setErrors(prevErrors => ({
            ...prevErrors,
            [`stockedInCountry${index}`]: ''
        }));
        setStockedInSections(updatedSections);
    };

    const handleStockedInputChange = (index, event) => {
        const { name, value } = event.target;

        // Allow only numbers and up to 5 digits
        if (/^\d*$/.test(value) && value.length <= 8) {
            const updatedSections = [...stockedInSections];
            updatedSections[index][name] = value;

            setErrors(prevErrors => ({
                ...prevErrors,
                [`stockedInQuantity${index}`]: ''
            }));

            setStockedInSections(updatedSections);
        }
    };


    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newFormSections = [...formSections];
        let isValid = true;

        if (name === 'unitPrice') {
            // Allow up to 4 digits before the decimal point and up to 3 digits after the decimal point
            if (!/^\d{0,4}(\.\d{0,3})?$/.test(value)) {
                isValid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`${name}${index}`]: 'Invalid unit price format'
                }));
            }
        } else if (name === 'totalPrice') {
            // Allow up to 5 digits before the decimal point and up to 3 digits after the decimal point
            if (!/^\d{0,8}(\.\d{0,3})?$/.test(value)) {
                isValid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`${name}${index}`]: 'Invalid total price format'
                }));
            }
        } else if (name === 'estDeliveryTime') {
            // Allow only numbers with up to 3 digits
            if (!/^\d{0,3}$/.test(value)) {
                isValid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`${name}${index}`]: 'Invalid delivery time format'
                }));
            }
        } else if (name === 'quantityNo') {
            // Allow only numbers
            isValid = /^\d*$/.test(value);
            if (!isValid) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`${name}${index}`]: 'Invalid quantity format'
                }));
            }
        } else if (name === 'unitPricee') {
            // Handle validation for unitPricee if applicable
            isValid = /^\d*\.?\d*$/.test(value);
            if (!isValid) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`${name}${index}`]: 'Invalid unitPricee format'
                }));
            }
        }

        if (isValid) {
            newFormSections[index][name] = value;
            setErrors(prevErrors => ({
                ...prevErrors,
                [`${name}${index}`]: ''
            }));

            // Update formData state
            const unitPrices = newFormSections.map(section => section.unitPrice);
            const totalPrices = newFormSections.map(section => section.totalPrice);
            const estDeliveryTimes = newFormSections.map(section => section.estDeliveryTime);

            setFormData({
                ...formData,
                unitPrice: unitPrices,
                totalPrice: totalPrices,
                estDeliveryTime: estDeliveryTimes
            });
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                [`${name}${index}`]: ''
            }));
        }

        setFormSections(newFormSections);
    };


    const addFormSection = () => {
        let newProductValid = true;
        let secondaryMarketValue = true;

        // if (productType && productType.label === 'New Product') {
        formSections.forEach((section, index) => {
            if (!section.quantity || !section.unitPrice || !section.totalPrice || !section.estDeliveryTime) {
                newProductValid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`quantity${index}`]: !section.quantity ? 'Quantity is Required' : '',
                    [`unitPrice${index}`]: !section.unitPrice ? 'Unit Price is Required' : '',
                    [`totalPrice${index}`]: !section.totalPrice ? 'Total Price is Required' : '',
                    [`estDeliveryTime${index}`]: !section.estDeliveryTime ? 'Estimated Delivery Time is Required' : '',

                }));
            }
        });
        if (newProductValid) {
            setFormSections([
                ...formSections,
                {
                    id: formSections.length,
                    quantity: null,
                    typeOfForm: null,
                    totalPrice: '',
                    unitPrice: '',
                    shelfLife: '',
                    estDeliveryTime: '',
                }
            ]);

            setErrors({});
        }
    };

    const addStockedInSection = () => {
        let newProductValid = true;
        stockedInSections.forEach((section, index) => {
            if (!section.stockedInCountry || !section.stockedInQuantity || !section.stockedInType) {
                newProductValid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`stockedInCountry${index}`]: !section.stockedInCountry ? 'stockedInCountry is Required' : '',
                    [`stockedInQuantity${index}`]: !section.stockedInQuantity ? 'stockedInQuantity is Required' : '',
                    [`stockedInType${index}`]: !section.stockedInType ? 'stockedInType is Required' : '',

                }));
            }
        });
        if (newProductValid) {
            setStockedInSections(prevSections => [
                ...prevSections,
                {
                    stockedInCountry: null,
                    stockedInQuantity: '',
                    stockedInType: 'Box'
                }
            ]);
            setErrors({});
        }
    };

    const removeFormSection = (index) => {
        if (formSections.length > 1) {
            const newFormSections = formSections.filter((_, i) => i !== index);

            const newQuantities = formData.quantity.filter((_, i) => i !== index);
            const newUnitPrices = formData.unitPrice.filter((_, i) => i !== index);
            const newTotalPrices = formData.totalPrice.filter((_, i) => i !== index);
            const newEstDeliveryTimes = formData.estDeliveryTime.filter((_, i) => i !== index);

            setFormSections(newFormSections);
            setFormData({
                ...formData,
                quantity: newQuantities,
                unitPrice: newUnitPrices,
                totalPrice: newTotalPrices,
                estDeliveryTime: newEstDeliveryTimes
            });
        }
    };

    const removeStockedInFormSection = (index) => {
        setStockedInSections(prevSections => prevSections.filter((_, i) => i !== index));
    };

    const handleProductTypeChange = (selected) => {
        setProductType(selected);
        setFormData(prevState => ({ ...prevState, productType: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, productType: 'Product Type is Required' }));
        } else {
            setErrors(prevState => ({ ...prevState, productType: '' }));
        }

        if (formData.productName.trim() !== '' && selected) {
            makeApiCall(formData.productName, selected.label);
        }
    };

    const handleFormTypeChange = (selected) => {
        setFormType(selected)
        setFormData(prevState => ({ ...prevState, typeOfForm: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, typeOfForm: 'Type of form is Required' }));
        } else {
            setErrors(prevState => ({ ...prevState, typeOfForm: '' }));
        }
    };

    const handleConditionChange = (selected) => {
        const selectedValue = selected ? selected.label : '';
        setCondition(selected);
        setFormData(prevState => ({ ...prevState, condition: selectedValue }));

        if (!selectedValue) {
            setErrors(prevState => ({ ...prevState, condition: 'Condition is required' }));
        } else {
            setErrors(prevState => ({ ...prevState, condition: '' }));
        }
    };


    const handleProductCategoryChange = (selected) => {
        setProductCategory(selected)
        setFormData(prevState => ({ ...prevState, productCategory: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, productCategory: 'Product category is Required' }));
        } else {
            setErrors(prevState => ({ ...prevState, productCategory: '' }));
        }
    };

    const handleCountryOriginChange = (selected) => {
        setCountryOfOrigin(selected)
        setFormData(prevState => ({ ...prevState, originCountry: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, originCountry: 'Country of origin is Required' }));
        } else {
            setErrors(prevState => ({ ...prevState, originCountry: '' }));
        }
    };

    const handlemanufacturerCountryOriginChange = (selected) => {
        setManufacturerCountryOfOrigin(selected)
        setFormData(prevState => ({ ...prevState, manufacturerOriginCountry: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, manufacturerOriginCountry: 'Manufacturer country of origin is Required' }));
        } else {
            setErrors(prevState => ({ ...prevState, manufacturerOriginCountry: '' }));
        }
    };

    const handleRegisteredInChange = (selectedOptions) => {
        const selectedLabels = selectedOptions?.map(option => option.label) || [];
        setFormData({
            ...formData,
            registeredIn: selectedOptions
        });
        setRegisteredCountries(selectedOptions)
        setErrors(prevState => ({
            ...prevState,
            registeredIn: selectedLabels.length === 0 ? 'Registered in is Required' : ''
        }));
    };

    const handleStockedInChange = (selectedOptions) => {
        const selectedLabels = selectedOptions?.map(option => option.label) || [];
        setFormData({
            ...formData,
            stockedIn: selectedOptions
        });
        setStockedIn(selectedOptions)
        setErrors(prevState => ({
            ...prevState,
            stockedIn: selectedLabels.length === 0 ? 'Stocked in is Required' : ''
        }));
        const options = selectedOptions.map(option => ({ label: option.label }));
        setStockedInOptions(options);
    };

    const handleAvailableInChange = (selectedOptions) => {
        const selectedLabels = selectedOptions?.map(option => option.label) || [];
        setFormData({
            ...formData,
            countryAvailableIn: selectedOptions
        });
        setAvailableCountries(selectedOptions)
        setErrors(prevState => ({
            ...prevState,
            countryAvailableIn: selectedLabels.length === 0 ? 'Country available in is Required' : ''
        }));

    }

    const getDropdownButtonLabel = ({ placeholderButtonLabel, value }) => {
        if (value && value.length) {
            return value.map(country => country.label).join(', ');
        }
        return placeholderButtonLabel;
    };

    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     let newErrors = { ...errors };  // Start with existing errors
    //     let isValid = true;

    //     // Clear the error message for the field being updated
    //     newErrors[name] = '';

    //     if (name === 'description') {
    //         if (value.length > 1000) {
    //             newErrors.description = 'Description cannot exceed 1000 characters';
    //             isValid = false;
    //         }
    //     } else if (name === 'productName' || name === 'dossierStatus') {
    //         // Only check for invalid characters if the value is not empty
    //         if (value.trim() && !/^[a-zA-Z\s]*$/.test(value)) {
    //             newErrors[name] = '';
    //             isValid = false;
    //         }
    //     } else if (name === 'totalQuantity') {
    //         // Allow only up to 5 digits
    //         if (value.trim() && !/^\d{1,8}$/.test(value)) {
    //             newErrors[name] = '';
    //             isValid = false;
    //         }
    //     } else if (name === 'minPurchaseUnit') {
    //         // Allow only up to 6 digits
    //         if (value.trim() && !/^\d{1,6}$/.test(value)) {
    //             newErrors[name] = '';
    //             isValid = false;
    //         }
    //     }else if (name === 'shelfLife') {
    //         // Allow only up to 3 digits
    //         if (value.trim() && !/^\d{1,4}$/.test(value)) {
    //             newErrors[name] = '';
    //             isValid = false;
    //         }
    //     } 
    //      else if (name === 'unitTax') {
    //         // Only check for invalid format if the value is not empty

    //         const regex = /^\d{0,2}(\.\d{0,3})?$/;

    //         if (value.trim() && !regex.test(value)) {
    //             newErrors[name] = '';
    //             isValid = false;
    //         } else {
    //             newErrors[name] = ''; // Clear error if input is valid
    //         }
    //     } else if (name === 'shippingTime') {

    //         const regex = /^\d{1,3}(-\d{1,2})?$/;

    //         // Partial match is allowed but full input should be validated
    //         if (value.trim() && !regex.test(value)) {
    //             newErrors[name] = '';
    //             isValid = false;
    //         } else {
    //             // Show error only when the input is fully invalid
    //             if (value.trim() && !regex.test(value) && !/^\d{1,2}$/.test(value)) {
    //                 newErrors[name] = '';
    //                 isValid = false;
    //             } else {
    //                 newErrors[name] = ''; // Clear error if input is valid
    //             }
    //         }
    //     }
        
    //     // Update the form data if valid
    //     if (isValid) {
    //         setFormData(prevState => ({ ...prevState, [name]: value }));
    //     }
    //     setErrors(newErrors);
    // };

    const handleChange = (event) => {
        const { name, value } = event.target;
        let newErrors = { ...errors }; // Copy existing errors
        let isValid = true;
    
        // Utility functions for validation
        const validateLength = (maxLength, errorMessage) => {
            if (value.length > maxLength) {
                newErrors[name] = errorMessage;
                isValid = false;
            }
        };
    
        const validateRegex = (regex, errorMessage) => {
            if (value.trim() && !regex.test(value)) {
                newErrors[name] = errorMessage;
                isValid = false;
            }
        };
    
        // Clear error for the current field by default
        newErrors[name] = '';
    
        // Validation logic for specific fields
        switch (name) {
            case 'description':
                validateLength(1000, '');
                break;
    
            case 'productName':
            case 'dossierStatus':
                validateRegex(/^[a-zA-Z\s]*$/, ``);
                break;
    
            case 'totalQuantity':
                validateRegex(/^\d{1,8}$/, '');
                break;
    
            case 'minPurchaseUnit':
                validateRegex(/^\d{1,6}$/, '');
                break;
    
            case 'shelfLife':
                validateRegex(/^\d{1,4}$/, '');
                break;
    
            case 'unitTax':
                validateRegex(/^\d{0,2}(\.\d{0,3})?$/, '');
                break;
    
            case 'shippingTime':
                validateRegex(/^\d{1,3}(-\d{1,2})?$/, '');
                break;
    
            default:
                break;
        }
    
        // Update the form data if valid
        if (isValid) {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
        }
    
        // Update errors state
        setErrors(newErrors);
    };
    
    const handleBlur = (e) => {
        const { name, value } = e.target;
        let newErrors = { ...errors };
        let isValid = true;

        if (name === 'purchasedOn') {
            // Validate the format dd/mm/yyyy
            if (value.trim() && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                const [day, month, year] = value.split('/').map(Number);
                const currentYear = new Date().getFullYear();

                // Helper function to check if a year is a leap year
                const isLeapYear = (year) => {
                    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
                };

                // Days allowed per month
                const daysInMonth = {
                    1: 31, // January
                    2: isLeapYear(year) ? 29 : 28, // February (leap year check)
                    3: 31, // March
                    4: 30, // April
                    5: 31, // May
                    6: 30, // June
                    7: 31, // July
                    8: 31, // August
                    9: 30, // September
                    10: 31, // October
                    11: 30, // November
                    12: 31, // December
                };

                // Validate month (01 to 12)
                if (month < 1 || month > 12) {
                    newErrors[name] = 'Invalid month. Please use a month between 01 and 12.';
                    isValid = false;
                }
                // Validate day based on the month and year
                else if (day < 1 || day > daysInMonth[month]) {
                    newErrors[name] = `Invalid day. The month ${String(month).padStart(2, '0')} has ${daysInMonth[month]} days.`;
                    isValid = false;
                }
                // Validate year (less than or equal to current year)
                else if (year > currentYear) {
                    newErrors[name] = `Invalid year. Year cannot be greater than ${currentYear}.`;
                    isValid = false;
                } else {
                    delete newErrors[name]; // Clear the error if valid
                    isValid = true;
                }
            } else if (value.trim()) {
                // If the input doesn't match the dd/mm/yyyy format
                newErrors[name] = 'Invalid date format. Please use dd/mm/yyyy';
                isValid = false;
            } else {
                delete newErrors[name]; // Clear the error if input is empty
                isValid = true;
            }

            setErrors(newErrors);
        }
    };

    useEffect(() => {
        setFormData({
            ...formData,
            invoice_image: invoiceImages
        });
    }, [invoiceImages])

    useEffect(() => {
        setFormData({
            ...formData,
            product_image: medicineImages
        });
    }, [medicineImages])

    useEffect(() => {
        if (productType && productType.label === 'New Product') {
            setInvoiceImages([])
            setAvailableCountries()
            setFormData({
                ...formData,
                purchasedOn: '',
                minPurchaseUnit: ''
            });
        } else if (productType && productType.label === 'Secondary Market') {
            setFormData({
                ...formData,
                totalQuantity: ''
            });
        }
    }, [productType])


    const validateForm = () => {
        let formErrors = {};
    
        // Required fields and their error messages
        const requiredFields = {
            productName               : 'Product Name is Required',
            composition               : 'Composition is Required',
            strength                  : 'Strength is Required',
            unitTax                   : 'Unit Tax is Required',
            shelfLife                 : 'Shelf Life is Required',
            dossierStatus             : 'Dossier Status is Required',
            dossierType               : 'Dossier Type is Required',
            totalQuantity             : 'Total Quantity is Required',
            gmpApprovals              : 'GMP Approvals is Required',
            shippingTime              : 'Shipping Time is Required',
            availableFor              : 'Available for is Required',
            tags                      : 'Tags are Required',
            description               : 'Description is Required',
            manufacturerName          : 'Manufacturer Name is Required',
            manufacturerOriginCountry : 'Manufacturer Country of Origin is Required',
            manufacturerDescription   : 'About Manufacturer is Required',
        };
    
        // Validate general required fields
        Object.keys(requiredFields).forEach((key) => {
            if (!formData[key]) {
                formErrors[key] = requiredFields[key];
            }
        });
    
        // Specific validations
        if (!productType) formErrors.productType = 'Product Type is Required';
        if (!formType) formErrors.typeOfForm = 'Type of Form is Required';
        if (!countryOfOrigin) formErrors.originCountry = 'Country of Origin is Required';
        if (registeredCountries.length === 0) formErrors.registeredIn = 'Registered in is Required';
        if (stockedIn.length === 0) formErrors.stockedIn = 'Stocked in is Required';
        if (!productCategory) formErrors.productCategory = 'Product Category is Required';
        if (formData.product_image?.length === 0) formErrors.product_image = 'Medicine Image is Required';
    
        const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        formSections.forEach((section, index) => {
            ['quantity', 'unitPrice', 'totalPrice', 'estDeliveryTime'].forEach((field) => {
                if (!section[field]) {
                    formErrors[`${field}${index}`] = `${capitalizeFirstLetter(field.replace(/([A-Z])/g, ' $1'))} is Required`;
                }
            });
        });

        // Stocked In sections validations
        stockedInSections.forEach((section, index) => {
            ['stockedInCountry', 'stockedInQuantity', 'stockedInType'].forEach((field) => {
                if (!section[field]) {
                    formErrors[`${field}${index}`] = `${field.replace(/([A-Z])/g, ' $1')} is Required`;
                }
            });
        });
    
        // Additional validation for Secondary Market
        if (productType?.label === 'Secondary Market') {
            const secondaryMarketFields = {
                countryAvailableIn: 'Country Available in is Required',
                purchasedOn: 'Purchased on is Required',
                minPurchaseUnit: 'Min. Purchase Unit is Required',
                condition: 'Condition is Required',
            };
    
            Object.keys(secondaryMarketFields).forEach((key) => {
                if (!formData[key]) {
                    formErrors[key] = secondaryMarketFields[key];
                }
            });
    
            if (invoiceImages?.length === 0 || formData.invoice_image === undefined) {
                formErrors.invoiceImage = 'Invoice Image is Required';
            }
        }
    
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };
    
    const [formSections, setFormSections] = useState([
        {
            strength: '',
            quantity: null,
            typeOfForm: null,
            productCategory: null,
            unitPrice: '',
            totalPrice: '',
            estDeliveryTime: '',
            condition: '',
            quantityNo: '',
            unitPricee: ''
        }
    ]);

    const [stockedInSections, setStockedInSections] = useState([
        {
            stockedInCountry: '',
            stockedInQuantity: '',
            stockedInType: 'Box',
        }
    ]);

    const resetForm = () => {
        setProductType({ value: 'new_product', label: 'New Product' });
        setFormType('');
        setProductCategory('');
        setCountryOfOrigin('');
        setRegisteredCountries([]);
        setStockedIn([]);
        setAvailableCountries([]);
        setMedicineImages([]);
        setInvoiceImages([]);
        setErrors({});
        setFormData({
            productName: '',
            productType: { value: 'new_product', label: 'New Product' },
            composition: '',
            strength: '',
            unitTax: '',
            typeOfForm: '',
            shelfLife: '',
            dossierType: '',
            dossierStatus: '',
            productCategory: '',
            totalQuantity: '',
            gmpApprovals: '',
            shippingTime: '',
            originCountry: '',
            registeredIn: '',
            stockedIn: '',
            availableFor: '',
            tags: '',
            description: '',
            product_image: '',
            invoice_image: '',
            purchasedOn: '',
            minPurchaseUnit: '',
            countryAvailableIn: '',
            manufacturerName: '',
            manufacturerOriginCountry: '',
            manufacturerDescription: '',
            stockedInData: ''
        });
        setFormSections([
            {
                strength: '',
                quantity: null,
                typeOfForm: null,
                productCategory: null,
                unitPrice: '',
                totalPrice: '',
                estDeliveryTime: '',
                condition: '',
                quantityNo: '',
                unitPricee: ''
            }
        ])
    };

    const handleSubmit = (e) => {
        const supplierId = sessionStorage.getItem("supplier_id") || localStorage.getItem("supplier_id");
    
        if (!supplierId) {
            navigate("/supplier/login");
            return;
        }
    
        e.preventDefault();
    
        if (!validateForm()) {
            toast('Some Fields are Missing', { type: "error" });
            console.log('Validation error:', formData);
            return;
        }
    
        setLoading(true);
    
        const baseFormData = new FormData();
        const registered = formData.registeredIn?.map(country => country?.label || '') || [];
        const quantities = formData.quantity?.map(qty => qty?.label || '') || [];
        const stocked = formData.stockedIn?.map(country => country?.label || '') || [];
        const stockedInDetails = JSON.stringify(
            stockedInSections.map(section => ({
                stocked_in_country: section.stockedInCountry?.label || '',
                stocked_quantity: section.stockedInQuantity || '',
                stocked_in_type: section.stockedInType || '',
            }))
        );
    
        // Populate common form data
        baseFormData.append('user_type', 'Supplier');
        baseFormData.append('supplier_id', supplierId);
        baseFormData.append('medicine_name', formData.productName);
        baseFormData.append('composition', formData.composition);
        baseFormData.append('strength', formData.strength);
        baseFormData.append('unit_tax', formData.unitTax);
        baseFormData.append('type_of_form', formData.typeOfForm?.label);
        baseFormData.append('shelf_life', formData.shelfLife);
        baseFormData.append('dossier_type', formData.dossierType);
        baseFormData.append('dossier_status', formData.dossierStatus);
        baseFormData.append('product_category', formData.productCategory?.label);
        baseFormData.append('total_quantity', formData.totalQuantity);
        baseFormData.append('gmp_approvals', formData.gmpApprovals);
        baseFormData.append('shipping_time', formData.shippingTime);
        baseFormData.append('country_of_origin', countryOfOrigin?.label || countryOfOrigin);
        baseFormData.append('available_for', formData.availableFor);
        baseFormData.append('tags', formData.tags);
        baseFormData.append('description', formData.description);
        baseFormData.append('manufacturer_country_of_origin', manufacturerCountryOfOrigin?.label);
        baseFormData.append('manufacturer_name', formData.manufacturerName);
        baseFormData.append('manufacturer_description', formData.manufacturerDescription);
        baseFormData.append('stocked_in_details', stockedInDetails);
    
        registered.forEach(item => baseFormData.append('registered_in[]', item));
        stocked.forEach(item => baseFormData.append('stocked_in[]', item));
        quantities.forEach(item => baseFormData.append('quantity[]', item));
        formData.unitPrice?.forEach(price => baseFormData.append('unit_price[]', price));
        formData.totalPrice?.forEach(price => baseFormData.append('total_price[]', price));
        formData.estDeliveryTime?.forEach(time => baseFormData.append('est_delivery_days[]', time));
        Array.from(formData.product_image || []).forEach(file => baseFormData.append('product_image', file));
    
        const isNewProduct = productType?.label === 'New Product';
        const endpoint = '/medicine/add-medicine';
    
        if (isNewProduct) {
            baseFormData.append('product_type', 'new');
        } else {
            baseFormData.append('product_type', 'secondary market');
            baseFormData.append('purchased_on', formData.purchasedOn);
            baseFormData.append('condition', formData.condition);
            baseFormData.append('min_purchase_unit', formData.minPurchaseUnit);
            const countryAvailableIn = formData.countryAvailableIn?.map(country => country?.label || '') || [];
            countryAvailableIn.forEach(item => baseFormData.append('country_available_in[]', item));
            Array.from(formData.invoice_image || []).forEach(file => baseFormData.append('invoice_image', file));
        }
    
        postRequestWithTokenAndFile(endpoint, baseFormData, async (response) => {
            setLoading(false);
            if (response.code === 200) {
                resetForm();
                toast(response.message, { type: "success" });
                socket.emit('addMedicine', {
                    adminId: process.env.REACT_APP_ADMIN_ID,
                    message: `New Medicine Approval Request`,
                    link: process.env.REACT_APP_PUBLIC_URL,
                });
                setTimeout(() => {
                    navigate('/supplier/pending-products-list');
                }, 1000);
            } else {
                toast(response.message, { type: "error" });
                console.log('Error in adding medicine:', response);
            }
        });
    };
    


    const handleCancel = () => {
        resetForm()
    }
    // start the stocked in section
    const [quantity, setQuantity] = useState('');
    const [packageType, setPackageType] = useState('Box');

    const handlePackageSelection = (index, packageType) => {
        const updatedSections = [...stockedInSections];
        updatedSections[index].stockedInType = packageType;
        setStockedInSections(updatedSections);
        setPackageType(packageType)

    };
    // end the stocked in section

    const makeApiCall = debounce((productName, productTypeLabel) => {
        setLoading(true)
        const obj = {
            medicine_name: productName,
            medicine_type: productTypeLabel === 'New Product'
                ? 'new'
                : productTypeLabel === 'Secondary Market'
                    ? 'secondary market'
                    : '',
        };

        postRequest('/medicine/get-medicine-by-name', obj, async (response) => {
            if (response.code === 200) {
                if (response.result) {
                    setLoading(false)
                    toast(response.message, { type: "success" });
                    setMedicineData(response.result)
                    const result = response.result;
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        productName: result?.medicine_name || '',
                        productType: { label: result?.medicine_type, value: result?.medicine_type } || null,
                        composition: result?.composition || '',
                        unitTax: result?.unit_tax || '',
                        strength: result?.strength || '',
                        typeOfForm: { label: result?.type_of_form, value: result?.type_of_form } || null,
                        shelfLife: result?.shelf_life || '',
                        dossierType: result?.dossier_type || '',
                        dossierStatus: result?.dossier_status || '',
                        productCategory: { label: result?.medicine_category, value: result?.medicine_category } || null,
                        totalQuantity: result?.total_quantity || '',
                        gmpApprovals: result?.gmp_approvals || '',
                        shippingTime: result?.shipping_time || '',
                        originCountry: { label: result?.country_of_origin, value: result?.country_of_origin } || null,
                        registeredIn: result?.registered_in || [],
                        stockedIn: result?.stocked_in || [],
                        availableFor: result?.available_for || '',
                        tags: result?.tags?.join(', ') || '',
                        description: result?.description || '',
                        product_image: result?.medicine_image || [],
                        invoice_image: [],
                        purchasedOn: '',
                        minPurchaseUnit: '',
                        countryAvailableIn: result?.country_available_in || [],
                        manufacturerName: result?.manufacturer_name || '',
                        manufacturerOriginCountry: result?.manufacturer_country_of_origin || '',
                        manufacturerDescription: result?.manufacturer_description || '',
                        stockedInData: result?.stockedIn_details || []
                    }));
                    setProductCategory(result?.medicine_category)
                    setCountryOfOrigin(result?.country_of_origin)
                    setFormType(result?.type_of_form)
                }

            } else {
                setLoading(false)
                toast(response.message, { type: "error" });
                console.log('error in get-medicine-by-name api');
            }
            setLoading(false)
        });
    }, 500);


    return (
        <>
          <ToastContainer />
            <div className={styles['create-invoice-container']}>
                <div className={styles['create-invoice-heading']}>Add Product</div>
                <div className={styles['create-invoice-section']}>
                    <form className={styles['craete-invoice-form']} onSubmit={handleSubmit}>
                        {/* details section */}
                        <div className={styles['create-invoice-inner-form-section']}>
                            <div className={styles['create-invoice-add-item-cont']}>
                                <div className={styles['create-invoice-form-heading']}>Product Details</div>
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Product Name</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='productName'
                                    placeholder='Enter Product Name'
                                    autoComplete='off'
                                    value={formData.productName}
                                    onChange={handleChange}
                                />
                                {errors.productName && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.productName}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Product Type</label>
                                <Select
                                    className={styles['create-invoice-div-input-select']}
                                    value={productType}
                                    onChange={handleProductTypeChange}
                                    options={productTypeOptions}
                                    placeholder="Select Product Type"
                                    name='productType'
                                />
                                {errors.productType && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.productType}</div>}
                            </div>

                            {productType && productType.value === 'secondary_market' && (
                                <>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Purchased on</label>
                                        <input
                                            className={styles['create-invoice-div-input']}
                                            type='text'
                                            name='purchasedOn'
                                            placeholder='dd/mm/yyyy'
                                            autoComplete='off'
                                            value={formData.purchasedOn}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.purchasedOn && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.purchasedOn}</div>}
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Condition</label>
                                        <Select
                                            className={styles['create-invoice-div-input-select']}
                                            value={condition}
                                            onChange={handleConditionChange}
                                            options={conditionOptions}
                                            placeholder="Select Condition"
                                        />
                                        {errors.condition && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.condition}</div>}
                                        {/* {errors[`condition${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`condition${index}`]}</div>} */}
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Country Available in</label>
                                        <MultiSelectDropdown
                                            options={countries}
                                            placeholderButtonLabel="Select Countries"
                                            onChange={handleAvailableInChange}
                                            getDropdownButtonLabel={getDropdownButtonLabel}
                                        />
                                        {errors.countryAvailableIn && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.countryAvailableIn}</div>}
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Minimum Purchase Unit</label>
                                        <input
                                            className={styles['create-invoice-div-input']}
                                            type='text'
                                            name='minPurchaseUnit'
                                            placeholder='Enter Min Purchase Unit'
                                            autoComplete='off'
                                            value={formData.minPurchaseUnit}
                                            onChange={handleChange}
                                        />
                                        {errors.minPurchaseUnit && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.minPurchaseUnit}</div>}
                                    </div>
                                </>
                            )}

                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Composition</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='composition'
                                    placeholder='Enter Composition'
                                    autoComplete='off'
                                    value={formData.composition}
                                    onChange={handleChange}
                                />
                                {errors.composition && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.composition}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Strength</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='strength'
                                    placeholder='Enter Strength'
                                    autoComplete='off'
                                    value={formData.strength}
                                    onChange={handleChange}
                                />
                                {errors.strength && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.strength}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Tax%</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='unitTax'
                                    placeholder='Enter Tax%'
                                    autoComplete='off'
                                    value={formData.unitTax}
                                    onChange={handleChange}
                                />
                                {errors.unitTax && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.unitTax}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Type of Form</label>
                                <Select
                                    className={styles['create-invoice-div-input-select']}
                                    // value={formType}
                                    value={formData.typeOfForm}
                                    options={formTypesOptions}
                                    onChange={handleFormTypeChange}
                                    placeholder="Select Type of Form"
                                    name='typeOfForm'
                                />
                                {errors.typeOfForm && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.typeOfForm}</div>}
                            </div>

                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Shelf Life</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='shelfLife'
                                    placeholder='Enter Shelf Life'
                                    autoComplete='off'
                                    value={formData.shelfLife}
                                    onChange={handleChange}
                                />
                                {errors.shelfLife && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.shelfLife}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Dossier Type</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='dossierType'
                                    placeholder='Enter Dossier Type'
                                    autoComplete='off'
                                    value={formData.dossierType}
                                    onChange={handleChange}
                                />
                                {errors.dossierType && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.dossierType}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Dossier Status</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='dossierStatus'
                                    placeholder='Enter Dossier Status'
                                    autoComplete='off'
                                    value={formData.dossierStatus}
                                    onChange={handleChange}
                                />
                                {errors.dossierStatus && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.dossierStatus}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Product Category</label>
                                <Select
                                    className={styles['create-invoice-div-input-select']}
                                    // value={productCategory}
                                    value={formData.productCategory}
                                    options={productCategoryOptions}
                                    placeholder="Select Product Category"
                                    name='produtCategory'
                                    onChange={handleProductCategoryChange}
                                />
                                {errors.productCategory && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.productCategory}</div>}
                            </div>

                            {/* {productType && productType.value === 'new_product' && ( */}
                            <>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Total Quantity</label>
                                    <input
                                        className={styles['create-invoice-div-input']}
                                        type='text'
                                        name='totalQuantity'
                                        placeholder='Enter Total Quantity'
                                        autoComplete='off'
                                        value={formData.totalQuantity}
                                        onChange={handleChange}
                                    />
                                    {errors.totalQuantity && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.totalQuantity}</div>}
                                </div>
                            </>
                            {/* )} */}
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>GMP Approvals</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='gmpApprovals'
                                    placeholder='Enter GMP Approvals'
                                    autoComplete='off'
                                    value={formData.gmpApprovals}
                                    onChange={handleChange}
                                />
                                {errors.gmpApprovals && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.gmpApprovals}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Shipping Time</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='shippingTime'
                                    placeholder='Enter Shipping Time'
                                    value={formData.shippingTime}
                                    onChange={handleChange}
                                />
                                {errors.shippingTime && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.shippingTime}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Country of Origin</label>
                                <Select
                                    className={styles['create-invoice-div-input-select']}
                                    name='originCountry'
                                    options={countries}
                                    placeholder="Select Country of Origin"
                                    autoComplete='off'
                                    // value={countryOfOrigin}
                                    value={formData.originCountry}
                                    onChange={handleCountryOriginChange}
                                />
                                {errors.originCountry && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.originCountry}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Registered in</label>
                                <MultiSelectDropdown
                                    options={countries}
                                    placeholderButtonLabel="Select Countries"
                                    onChange={handleRegisteredInChange}
                                    value={registeredCountries}
                                    getDropdownButtonLabel={getDropdownButtonLabel}
                                />
                                {errors.registeredIn && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.registeredIn}</div>}
                            </div>

                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Stocked in</label>
                                <MultiSelectDropdown
                                    options={countries}
                                    placeholderButtonLabel="Select Countries"
                                    onChange={handleStockedInChange}
                                    value={stockedIn}
                                    getDropdownButtonLabel={getDropdownButtonLabel}
                                />
                                {errors.stockedIn && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.stockedIn}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Available for</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='availableFor'
                                    placeholder='Enter Available for'
                                    value={formData.availableFor}
                                    onChange={handleChange}
                                />
                                {errors.availableFor && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.availableFor}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Tags</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='tags'
                                    placeholder='Enter Tags'
                                    value={formData.tags}
                                    onChange={handleChange}
                                />
                                {errors.tags && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.tags}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container-description']}>
                                <label className={styles['create-invoice-div-label']}>Product Description</label>
                                <textarea
                                    className={styles['create-invoice-div-input']}
                                    name="description"
                                    rows="4"
                                    cols="50"
                                    value={formData.description}
                                    placeholder='Enter Description'
                                    onChange={handleChange}
                                />
                                {errors.description && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.description}</div>}
                            </div>
                        </div>

                        {/* Start the stocked in section */}
                        <div className={styles['create-invoice-inner-form-section']}>
                            <div className={styles['create-invoice-section']}>
                                <div className={styles['create-invoice-add-item-cont']}>
                                    <div className={styles['create-invoice-form-heading']}>Stocked in Details</div>
                                    <span className={styles['create-invoice-add-item-button']} onClick={addStockedInSection}>Add More</span>
                                </div>
                                {stockedInSections.map((section, index) => (
                                    <div className={styles['form-item-container']} >
                                        {/* {productType && productType.value === 'new_product' && ( */}
                                        <div className={styles['create-invoice-new-product-section-containers']}>
                                            <div className={styles['create-invoice-div-container']}>
                                                <label className={styles['create-invoice-div-label']}>Stocked in Country</label>
                                                <Select
                                                    className={styles['create-invoice-div-input-select']}
                                                    value={section.stockedInCountry}
                                                    onChange={(selected) => handleStockedInCountryChange(index, selected)}
                                                    options={stockedInOptions}
                                                    placeholder="Select Stocked in Country"
                                                    name='stockedInCountry'
                                                />
                                                {/* {errors[`stockedInCountry${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`stockedInCountry${index}`]}</div>} */}
                                                {errors[`stockedInCountry${index}`] && (
                                                    <div className={styles['add-product-errors']} style={{ color: 'red' }}>
                                                        Stocked in Country is Required
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles['add-product-div-container']}>
                                                <label className={styles['create-invoice-div-label']}>Stocked in Quantity</label>
                                                <div className={styles.quantitySelector}>
                                                    <div className={styles.inputGroup}>
                                                        <input
                                                            type="text"
                                                            name="stockedInQuantity"
                                                            onChange={(event) => handleStockedInputChange(index, event)}
                                                            value={section.stockedInQuantity}
                                                            placeholder={`Enter ${packageType} Quantity`}
                                                            className={styles['add-product-div-input']}
                                                        />
                                                        <button
                                                            className={`${styles.optionButton} ${styles.selected}`}
                                                        >
                                                            {section.stockedInType}
                                                        </button>
                                                    </div>

                                                    <div className={styles.radioGroup}>
                                                        <label>
                                                            <input
                                                                name={`stockedInType_${index}`}
                                                                type="radio"
                                                                value="Box"
                                                                checked={section.stockedInType === 'Box'}
                                                                onChange={() => handlePackageSelection(index, 'Box')}
                                                            />
                                                            <span>Box</span>
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`stockedInType_${index}`}
                                                                value="Strip"
                                                                checked={section.stockedInType === 'Strip'}
                                                                onChange={() => handlePackageSelection(index, 'Strip')}
                                                            />
                                                            <span>Strip</span>
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="Pack"
                                                                name={`stockedInType_${index}`}
                                                                checked={section.stockedInType === 'Pack'}
                                                                onChange={() => handlePackageSelection(index, 'Pack')}
                                                            />
                                                            <span>Pack</span>
                                                        </label>
                                                    </div>


                                                </div>
                                                <div className={styles['quanity-error-section']}>
                                                    {errors[`stockedInQuantity${index}`] && (
                                                        <div className={styles['add-product-errors']} style={{ color: 'red' }}>
                                                            Stocked in Quantity is Required
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                        {/* )} */}
                                        {stockedInSections.length > 1 && (
                                            <div className={styles['addproduct-add-cross-icon']} onClick={() => removeStockedInFormSection(index)}>
                                                <CloseIcon />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* End the stocked in section */}

                        {/* inventory section */}
                        <div className={styles['create-invoice-inner-form-section']}>
                            <div className={styles['create-invoice-section']}>
                                {/* {productType && productType.value === 'new_product' && ( */}
                                <div className={styles['create-invoice-add-item-cont']}>
                                    <div className={styles['create-invoice-form-heading']}>Product Inventory</div>
                                    <span className={styles['create-invoice-add-item-button']} onClick={addFormSection}>Add More</span>
                                </div>

                                {formSections.map((section, index) => (
                                    <div className={styles['form-item-container-add-product']} key={index}>
                                        {/* {productType && productType.value === 'new_product' && ( */}
                                        <div className={styles['add-product-main-section-container']}>
                                            <div className={styles['create-invoice-new-product-section-containers']}>
                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Quantity</label>
                                                    <Select
                                                        className={styles['create-invoice-div-input-select']}
                                                        value={section.quantity}
                                                        onChange={(selected) => handleQuantityChange(index, selected)}
                                                        options={quantityOptions}
                                                        placeholder="Select Quantity"
                                                        name='quantity'
                                                    />
                                                    {errors[`quantity${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`quantity${index}`]}</div>}
                                                </div>

                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Unit Price</label>
                                                    <input
                                                        className={styles['create-invoice-div-input']}
                                                        type='text'
                                                        name='unitPrice'
                                                        placeholder='Enter Unit Price'
                                                        value={section.unitPrice}
                                                        onChange={(event) => handleInputChange(index, event)}
                                                    />
                                                    {errors[`unitPrice${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`unitPrice${index}`]}</div>}
                                                </div>

                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Total Price</label>
                                                    <input
                                                        className={styles['create-invoice-div-input']}
                                                        type='text'
                                                        name='totalPrice'
                                                        placeholder='Enter Total Price'
                                                        value={section.totalPrice}
                                                        onChange={(event) => handleInputChange(index, event)}
                                                    />
                                                    {errors[`totalPrice${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`totalPrice${index}`]}</div>}
                                                </div>

                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Est. Delivery Time</label>
                                                    <input
                                                        className={styles['create-invoice-div-input']}
                                                        type='text'
                                                        name='estDeliveryTime'
                                                        placeholder='Enter Est. Delivery Time'
                                                        value={section.estDeliveryTime}
                                                        onChange={(event) => handleInputChange(index, event)}
                                                    />
                                                    {errors[`estDeliveryTime${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`estDeliveryTime${index}`]}</div>}
                                                </div>
                                            </div>

                                            {formSections.length > 1 && (
                                                <div className={styles['craete-add-cross-icon']} onClick={() => removeFormSection(index)}>
                                                    <CloseIcon />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* start the manufacturer details */}
                        <div className={styles['create-invoice-inner-form-section']}>
                            <div className={styles['create-invoice-add-item-cont']}>
                                <div className={styles['create-invoice-form-heading']}>Manufacturer Details</div>
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Manufacturer Name</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='manufacturerName'
                                    placeholder='Enter Manufacturer Name'
                                    autoComplete='off'
                                    value={formData.manufacturerName}
                                    onChange={handleChange}
                                />
                                {errors.manufacturerName && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.manufacturerName}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Country of Origin</label>
                                <Select
                                    className={styles['create-invoice-div-input-select']}
                                    name='originCountry'
                                    options={countries}
                                    placeholder="Select Country of Origin"
                                    autoComplete='off'
                                    value={manufacturerCountryOfOrigin}
                                    onChange={handlemanufacturerCountryOriginChange}
                                />
                                {errors.manufacturerOriginCountry && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.manufacturerOriginCountry}</div>}
                            </div>
                            <div className={styles['create-manufaturer-div-container-description']}>
                                <label className={styles['create-invoice-div-label']}>About Manufacturer</label>
                                <textarea
                                    className={styles['create-invoice-div-input']}
                                    name="manufacturerDescription"
                                    rows="4"
                                    cols="20"
                                    value={formData.manufacturerDescription}
                                    placeholder='Enter About Manufacturer'
                                    onChange={handleChange}
                                />
                                {errors.manufacturerDescription && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.manufacturerDescription}</div>}
                            </div>
                        </div>
                        {/* end the manufacturer details */}
                        {/* image upload section */}
                        <div className={styles['create-invoice-inner-form-section']}>
                            <div className={styles['create-invoice-product-image-section']}>
                                <div className={styles['create-invoice-upload-purchase']}>
                                    <div className={styles['create-invoice-form-heading']}>Upload Product Image</div>
                                    <ImageAddUploader
                                        image={medicineImages}
                                        setImage={setMedicineImages}
                                    />
                                    {/* {!medicineImages || errors.product_image && <div className={styles['add-product-errors']} style={{ color: 'red', fontSize: '12px' }}>{errors.medicineImage}</div>} */}
                                    {/* {errors.product_image && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.product_image}</div>} */}
                                </div>
                                {productType && productType.value === 'secondary_market' && (
                                    <>
                                        <div className={styles['create-invoice-upload-purchase']}>
                                            <div className={styles['create-invoice-form-heading']}>Upload Purchase Invoice</div>
                                            <AddPdfUpload
                                                invoiceImage={invoiceImages}
                                                setInvoiceImage={setInvoiceImages}
                                            />
                                            {!invoiceImages || errors.invoice_image && <div className={styles['add-product-errors']} style={{ color: 'red', fontSize: '12px' }}>{errors.invoiceImage}</div>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={styles['craete-invoices-button']}>
                            <button
                                type='submit'
                                className={styles['create-invoices-submit']}
                                disabled={loading}
                            >
                                {/* Add Product */}
                                {loading ? (
                                    <div className={styles['loading-spinner']}></div>
                                ) : (
                                    'Add Product'
                                )}
                            </button>

                            <div className={styles['create-invoices-cancel']} onClick={handleCancel}>Cancel</div>
                        </div>
                    </form>

                </div>

            </div>
            {/* )} */}
        </>
    );
};

export default AddProduct;