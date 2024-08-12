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

const AddProduct = () => {

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
        { value: 'orignals', label: 'Orignals' },
        { value: 'biosimilars', label: 'Biosimilars' },
        { value: 'medicaldevices', label: 'Medical Devices' },
        { value: 'nutraceuticals', label: 'Nutraceuticals' }
    ];

    const [productType, setProductType] = useState({ value: 'new_product', label: 'New Product' },);
    const [formType, setFormType] = useState()
    const [productCategory, setProductCategory] = useState()
    const [countryOfOrigin, setCountryOfOrigin] = useState('')
    const [registeredCountries, setRegisteredCountries] = useState([])
    const [stockedIn, setStockedIn] = useState([])
    const [availableCountries, setAvailableCountries] = useState([])
    const [countries, setCountries] = useState([]);
    const [medicineImages, setMedicineImages] = useState([])
    const [invoiceImages, setInvoiceImages] = useState([])
    const [manufacturerCountryOfOrigin, setManufacturerCountryOfOrigin] = useState('')

    const [stockedInOptions, setStockedInOptions] = useState([])
    const [medicineData, setMedicineData] = useState()

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
        manufacturerName: '',
        manufacturerOriginCountry: '',
        manufacturerDescription: '',
        stockedInData: ''
    })

    useEffect(() => {
        const countryOptions = countryList().getData();
        setCountries(countryOptions);
    }, []);

    const handleConditionChange = (index, selected) => {
        const newFormSections = [...formSections];
        newFormSections[index].condition = selected;
        setErrors(prevErrors => ({
            ...prevErrors,
            [`condition${index}`]: ''
        }));
        const conditions = newFormSections.map(section => section.condition);
        setFormData({
            ...formData,
            condition: conditions
        });
        setFormSections(newFormSections);
    };

    const handleQuantityChange = (index, selected) => {
        if (productType.label === 'New Product') {
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
        }
    };

    const handleStockedInCountryChange = (index, selected) => {
        const updatedSections = [...stockedInSections];
        updatedSections[index].stockedInCountry = selected;
        setStockedInSections(updatedSections);
    };

    const handleStockedInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedSections = [...stockedInSections];
        updatedSections[index][name] = value;
        setStockedInSections(updatedSections);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newFormSections = [...formSections];
        let isValid = true;
        if (name === 'unitPrice' || name === 'totalPrice' || name === 'estDeliveryTime' || name === 'unitPricee' || name === 'quantityNo') {
            if (!/^\d*\.?\d*$/.test(value)) {
                isValid = false;
            }
        }

        if (isValid) {
            newFormSections[index][name] = value;
            setFormSections(newFormSections);
        }

        if (value.trim() === '') {
            setErrors(prevErrors => ({
                ...prevErrors,
                [`${name}${index}`]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
            }));
        } else if (!isValid) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [`${name}${index}`]: `${name.charAt(0).toUpperCase() + name.slice(1)} should contain only numbers`
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                [`${name}${index}`]: ''
            }));

            if (productType.label === 'New Product') {
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
                const unitPrices = newFormSections.map(section => section.unitPricee);
                const quantities = newFormSections.map(section => section.quantityNo);
                setFormData({
                    ...formData,
                    unitPricee: unitPrices,
                    quantityNo: quantities,
                });
            }
            setFormSections(newFormSections);
        }
    };

    const addFormSection = () => {
        let newProductValid = true;
        let secondaryMarketValue = true;

        if (productType && productType.label === 'New Product') {
            formSections.forEach((section, index) => {
                if (!section.quantity || !section.unitPrice || !section.totalPrice || !section.estDeliveryTime) {
                    newProductValid = false;
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        [`quantity${index}`]: !section.quantity ? 'Quantity is required' : '',
                        [`unitPrice${index}`]: !section.unitPrice ? 'Unit Price is required' : '',
                        [`totalPrice${index}`]: !section.totalPrice ? 'Total Price is required' : '',
                        [`estDeliveryTime${index}`]: !section.estDeliveryTime ? 'Estimated Delivery Time is required' : '',

                    }));
                }
            });

            if (newProductValid && productType.label === 'New Product') {
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
        } else if (productType && productType.label === 'Secondary Market') {

            formSections.forEach((section, index) => {
                if (!section.quantityNo || !section.unitPrice || !section.condition) {
                    secondaryMarketValue = false;
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        [`quantityNo${index}`]: !section.quantityNo ? 'Quantity is required' : '',
                        [`unitPricee${index}`]: !section.unitPricee ? 'Unit Price is required' : '',
                        [`condition${index}`]: !section.condition ? 'Condition is required' : '',

                    }));
                }
            });

            if (secondaryMarketValue && productType.label === 'Secondary Market') {
                setFormSections([
                    ...formSections,
                    {
                        id: formSections.length,
                        quantityNo: '',
                        unitPricee: '',
                        condition: ''
                    }
                ]);
                setErrors({});
            }
        }
    };

    const addStockedInSection = () => {
        let newProductValid = true;
        stockedInSections.forEach((section, index) => {
            if (!section.stockedInCountry || !section.stockedInQuantity || !section.stockedInType ) {
                newProductValid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`stockedInCountry${index}`]: !section.stockedInCountry ? 'stockedInCountry is required' : '',
                    [`stockedInQuantity${index}`]: !section.stockedInQuantity ? 'stockedInQuantity is required' : '',
                    [`stockedInType${index}`]: !section.stockedInType ? 'stockedInType is required' : '',

                }));
            }
        });
        if(newProductValid) {
            setStockedInSections(prevSections => [
                ...prevSections,
                {
                    stockedInCountry: null, 
                    stockedInQuantity: '',
                    stockedInType : 'Box'
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
        // setSelectedCompanyType(selectedOption);
        setFormData(prevState => ({ ...prevState, productType: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, productType: 'Product Type is required' }));
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
            setErrors(prevState => ({ ...prevState, typeOfForm: 'Type of form is required' }));
        } else {
            setErrors(prevState => ({ ...prevState, typeOfForm: '' }));
        }
    };

    const handleProductCategoryChange = (selected) => {
        setProductCategory(selected)
        setFormData(prevState => ({ ...prevState, productCategory: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, productCategory: 'Product category is required' }));
        } else {
            setErrors(prevState => ({ ...prevState, productCategory: '' }));
        }
    };

    const handleCountryOriginChange = (selected) => {
        setCountryOfOrigin(selected)
        setFormData(prevState => ({ ...prevState, originCountry: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, originCountry: 'Country of origin is required' }));
        } else {
            setErrors(prevState => ({ ...prevState, originCountry: '' }));
        }
    };

    const handlemanufacturerCountryOriginChange = (selected) => {
        setManufacturerCountryOfOrigin(selected)
        setFormData(prevState => ({ ...prevState, manufacturerOriginCountry: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, manufacturerOriginCountry: 'Manufacturer country of origin is required' }));
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
            registeredIn: selectedLabels.length === 0 ? 'Registered in is required' : ''
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
            stockedIn: selectedLabels.length === 0 ? 'Stocked in is required' : ''
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
            countryAvailableIn: selectedLabels.length === 0 ? 'Country available in is required' : ''
        }));

    }

    const getDropdownButtonLabel = ({ placeholderButtonLabel, value }) => {
        if (value && value.length) {
            return value.map(country => country.label).join(', ');
        }
        return placeholderButtonLabel;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Initialize a newErrors object to hold the validation errors
        let newErrors = {};
        let isValid = true;

        // Description field validation
        if (name === 'description') {
            if (value.length > 1000) {
                newErrors.description = 'Description cannot exceed 1000 characters';
                isValid = false;
            } else {
                newErrors.description = '';
            }
        }

        // Product Name and Dossier Status field validation: only letters allowed
        if (name === 'productName' || name === 'dossierStatus') {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} should contain only letters`;
                isValid = false;
            } else {
                newErrors[name] = '';
            }
        }

        // Total Quantity field validation: only numbers allowed
        if (name === 'totalQuantity' || name === 'minPurchaseUnit') {
            if (!/^\d*$/.test(value)) {
                newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} should contain only numbers`;
                isValid = false;
            } else {
                newErrors[name] = '';
            }
        }

        // Update the formData state only if the input is valid
        if (isValid) {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }

        // Update the errors state with the newErrors object
        setErrors(prevState => ({ ...prevState, ...newErrors }));
    };

    //useEffect to update the invoice images
    useEffect(() => {
        setFormData({
            ...formData,
            invoice_image: invoiceImages
        });
    }, [invoiceImages])

    //useEffect to update the medicineImages
    useEffect(() => {
        setFormData({
            ...formData,
            product_image: medicineImages
        });
    }, [medicineImages])

    //useEffect to update the variables to inital state based on productType
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

    //validation
    const validateForm = () => {
        let formErrors = {};

        if (!formData.productName) formErrors.productName = 'Product name is required';
        if (!productType) formErrors.productType = 'Product type is required';
        if (!formData.composition) formErrors.composition = 'Composition is required';
        if (!formData.strength) formErrors.strength = 'Strength is required';
        if (!formData.unitTax) formErrors.unitTax = 'Unit tax is required';
        if (!formType) formErrors.typeOfForm = 'Type of form is required';
        if (!formData.shelfLife) formErrors.shelfLife = 'Shelf life is required';
        if (!formData.dossierStatus) formErrors.dossierStatus = 'Dossier Status is required';
        if (!formData.dossierType) formErrors.dossierType = 'Dossier Type is required';
        if (productType && productType.label === 'New Product') {
            if (!formData.totalQuantity) formErrors.totalQuantity = 'Total quantity is required';
        }

        if (!formData.gmpApprovals) formErrors.gmpApprovals = 'Gmp approval is required';
        if (!formData.shippingTime) formErrors.shippingTime = 'Shipping time is required';
        if (!formData.availableFor) formErrors.availableFor = 'Available for is required';
        if (!formData.tags) formErrors.tags = 'Tags are required';
        if (!formData.description) formErrors.description = 'Description is required';
        // if (countryOfOrigin.length >= 0) formErrors.originCountry = 'Country of Origin is required';
        if (!countryOfOrigin) formErrors.originCountry = 'Country of Origin is required'
        if (registeredCountries.length === 0) formErrors.registeredIn = 'Registered in is required';
        if (stockedIn.length === 0) formErrors.stockedIn = 'Stocked in is required';
        if (!productCategory) formErrors.productCategory = 'Product Category is required';

        if (!formData.manufacturerName) formErrors.manufacturerName = 'Manufacturer name is required';
        if (!formData.manufacturerOriginCountry) formErrors.manufacturerOriginCountry = 'Manufacturer country of origin is required';
        if (!formData.manufacturerDescription) formErrors.manufacturerDescription = 'Manufacturer description is required';

        if (productType && productType.label === 'New Product') {
            formSections.forEach((section, index) => {
                if (!section.quantity) formErrors[`quantity${index}`] = 'Quantity is required';
                if (!section.unitPrice) formErrors[`unitPrice${index}`] = 'Unit Price is required';
                if (!section.totalPrice) formErrors[`totalPrice${index}`] = 'Total Price is required';
                if (!section.estDeliveryTime) formErrors[`estDeliveryTime${index}`] = 'Estimated Delivery Time is required';
            });
        } else if (productType && productType.label === 'Secondary Market') {
            formSections.forEach((section, index) => {
                if (!section.quantityNo) formErrors[`quantityNo${index}`] = 'Quantity is required';
                if (!section.unitPricee) formErrors[`unitPricee${index}`] = 'Unit Price is required';
                if (!section.condition) formErrors[`condition${index}`] = 'Condition is required';
            });
        }

        if (formData.product_image?.length === 0) formErrors.medicineImage = 'Medicine Image is required';

        
            stockedInSections.forEach((section, index) => {
                if (!section.stockedInCountry) formErrors[`stockedInCountry${index}`] = 'Stocked in country is required';
                if (!section.stockedInQuantity) formErrors[`stockedInQuantity${index}`] = 'Stocked in quantity is required';
                if (!section.stockedInType) formErrors[`stockedInType${index}`] = 'Stocked in type is required';
            });
        


        if (productType && productType.label === 'Secondary Market') {
            if (!availableCountries) formErrors.countryAvailableIn = 'Country available in is required';
            if (!formData.purchasedOn) formErrors.purchasedOn = 'Purchased on is required';
            if (!formData.minPurchaseUnit) formErrors.minPurchaseUnit = 'Min. purchase unit is required';
            if (invoiceImages?.length === 0 || formData.invoice_image === undefined) formErrors.invoiceImage = 'Invoice Image is required';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }

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
            stockedInType : 'Box',
        }
    ]);

    const handleSubmit = (e) => {

        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        e.preventDefault()

        if (validateForm()) {

            const newFormData = new FormData()
            const secondaryFormData = new FormData()

            const registered = formData.registeredIn?.map(country => {
                return country ? country.label : '';
            }) || [];

            const stocked = formData.stockedIn?.map(country => {
                return country ? country.label : '';
            }) || []

            const simplifiedStockedInSections = stockedInSections.map(section => ({
                stocked_in_country: section.stockedInCountry?.label || '',
                stocked_quantity: section.stockedInQuantity || '',
                stocked_in_type: section.stockedInType || ''
            }));
            if (productType && productType.label === 'New Product') {

                const quantities = formData.quantity?.map(qty => {
                    return qty ? qty?.label : ''
                })

                newFormData.append('supplier_id', supplierIdSessionStorage || supplierIdLocalStorage);
                newFormData.append('medicine_name', formData.productName);
                newFormData.append('product_type', 'new');
                newFormData.append('composition', formData.composition);
                newFormData.append('unit_tax', formData.unitTax);
                newFormData.append('strength', formData.strength);
                newFormData.append('type_of_form', formData.typeOfForm?.label);
                newFormData.append('shelf_life', formData.shelfLife);
                newFormData.append('dossier_type', formData.dossierType);
                newFormData.append('dossier_status', formData.dossierStatus);
                newFormData.append('product_category', formData.productCategory?.label);
                newFormData.append('total_quantity', formData.totalQuantity);
                newFormData.append('gmp_approvals', formData.gmpApprovals);
                newFormData.append('shipping_time', formData.shippingTime);
                newFormData.append('country_of_origin', countryOfOrigin?.label);
                registered.forEach(item => newFormData.append('registered_in[]', item));
                stocked.forEach(item => newFormData.append('stocked_in[]', item));
                newFormData.append('available_for', formData.availableFor);
                newFormData.append('tags', formData.tags);
                newFormData.append('description', formData.description);
                quantities.forEach(item => newFormData.append('quantity[]', item));
                formData.unitPrice.forEach(price => newFormData.append('unit_price[]', price));
                formData.totalPrice.forEach(price => newFormData.append('total_price[]', price));
                formData.estDeliveryTime.forEach(time => newFormData.append('est_delivery_days[]', time));
                Array.from(formData.product_image).forEach(file => newFormData.append('product_image', file));
                newFormData.append('manufacturer_country_of_origin', manufacturerCountryOfOrigin?.label)
                newFormData.append('manufacturer_name', formData?.manufacturerName)
                newFormData.append('manufacturer_description', formData?.manufacturerDescription)
                // newFormData.append('stocked_in_details', simplifiedStockedInSections)
                newFormData.append('stocked_in_details', JSON.stringify(simplifiedStockedInSections));

                postRequestWithTokenAndFile('/medicine/add-medicine', newFormData, async (response) => {
                    if (response.code === 200) {
                        toast(response.message, { type: "success" });
                        setTimeout(() => {
                            navigate('/supplier/product/newproduct')
                        }, 1000);
                    } else {
                        toast(response.message, { type: "error" });
                        console.log('error in new  /medicine/add-medicine');
                    }
                })

            } else if (productType && productType.label === 'Secondary Market') {
                const countryLabels = formData.countryAvailableIn?.map(country => {
                    return country ? country.label : '';
                }) || [];

                secondaryFormData.append('supplier_id', supplierIdSessionStorage || supplierIdLocalStorage);
                secondaryFormData.append('medicine_name', formData.productName);
                secondaryFormData.append('product_type', 'secondary market');
                secondaryFormData.append('purchased_on', formData.purchasedOn);

                countryLabels.forEach(item => secondaryFormData.append('country_available_in[]', item));
                secondaryFormData.append('strength', formData.strength);
                secondaryFormData.append('unit_tax', formData.unitTax);
                secondaryFormData.append('min_purchase_unit', formData.minPurchaseUnit);

                secondaryFormData.append('composition', formData.composition);
                secondaryFormData.append('type_of_form', formData.typeOfForm?.label);
                secondaryFormData.append('shelf_life', formData.shelfLife);
                secondaryFormData.append('dossier_type', formData.dossierType);
                secondaryFormData.append('dossier_status', formData.dossierStatus);
                secondaryFormData.append('product_category', formData.productCategory?.label);
                secondaryFormData.append('gmp_approvals', formData.gmpApprovals);
                secondaryFormData.append('shipping_time', formData.shippingTime);
                secondaryFormData.append('country_of_origin', countryOfOrigin?.label);
                registered.forEach(item => secondaryFormData.append('registered_in[]', item));
                stocked.forEach(item => secondaryFormData.append('stocked_in[]', item));
                secondaryFormData.append('available_for', formData.availableFor);
                secondaryFormData.append('tags', formData.tags);
                secondaryFormData.append('description', formData.description);
                secondaryFormData.append('quantity', formData.quantityNo.join(','));
                secondaryFormData.append('unit_price', formData.unitPricee);
                secondaryFormData.append('condition', formData.condition[0].value);
                Array.from(formData.product_image).forEach(file => secondaryFormData.append('product_image', file));
                Array.from(formData.invoice_image).forEach(file => secondaryFormData.append('invoice_image', file));
                secondaryFormData.append('manufacturer_country_of_origin', manufacturerCountryOfOrigin?.label)
                secondaryFormData.append('manufacturer_name', formData?.manufacturerName)
                secondaryFormData.append('manufacturer_description', formData?.manufacturerDescription)
                secondaryFormData.append('stocked_in_details', JSON.stringify(simplifiedStockedInSections));

                postRequestWithTokenAndFile('/medicine/add-medicine', secondaryFormData, async (response) => {
                    if (response.code === 200) {
                        toast(response.message, { type: "success" });

                        setTimeout(() => {
                            navigate('/supplier/product/secondarymarket')
                        }, 1000);
                    } else {
                        toast(response.message, { type: "error" });
                        console.log('error in secondary  /medicine/add-medicine');
                    }
                })
            }
        } else {
            console.log('errorrrrr',formData);
        }
    }

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
            countryAvailableIn: ''
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
    };
    // end the stocked in section

    // const handleBlur = debounce(() => {
    //     if (formData.productName.trim() !== '' && productType) {
    //         // makeApiCall(formData.productName);
    //         const obj = {
    //             medicine_name : formData.productName,
    //             medicine_type: 
    //     productType.label === 'New Product' 
    //     ? 'new' 
    //     : productType.label === 'Secondary Market' 
    //     ? 'secondary market' 
    //     : '',
    //         }
    //         postRequest('/medicine/get-medicine-by-name', obj, async (response) => {
    //             if (response.code === 200) {
    //                 // toast(response.message, { type: "success" });
    //                 // setTimeout(() => {
    //                 //     navigate('/supplier/product/newproduct')
    //                 // }, 1000);
    //             } else {
    //                 toast(response.message, { type: "error" });
    //                 console.log('error in get-medicine-by-name api');
    //             }
    //         })
    //     }
    // }, 500);

    const makeApiCall = debounce((productName, productTypeLabel) => {
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
                toast(response.message, { type: "success" });
                setMedicineData(response.result)
                // setFormData(prevFormData => ({
                //     ...prevFormData,
                //     ...response.result
                // }));
                const result = response.result;
            setFormData(prevFormData => ({
                ...prevFormData,
                productName: result.medicine_name || '',
                productType: { label: result.medicine_type, value: result.medicine_type } || null,
                composition: result.composition || '',
                unitTax: result.unit_tax || '',
                strength: result.strength || '',
                typeOfForm: { label: result.type_of_form, value: result.type_of_form } || null,
                shelfLife: result.shelf_life || '',
                dossierType: result.dossier_type || '',
                dossierStatus: result.dossier_status || '',
                // productCategory: result.medicine_category || '',
                productCategory: { label: result.medicine_category, value: result.medicine_category } || null,
                totalQuantity: result.total_quantity || '',
                gmpApprovals: result.gmp_approvals || '',
                shippingTime: result.shipping_time || '',
                // originCountry: result.country_of_origin || '',
                originCountry: { label: result.country_of_origin, value: result.country_of_origin } || null,
                registeredIn: result.registered_in || [],
                stockedIn: result.stocked_in || [],
                availableFor: result.available_for || '',
                tags: result.tags.join(', ') || '', // Assuming tags are an array
                description: result.description || '',
                product_image: result.medicine_image || [],
                invoice_image: [], // Adjust if needed
                purchasedOn: '', // Not in response
                minPurchaseUnit: '', // Not in response
                countryAvailableIn: result.country_available_in || [],
                manufacturerName: result.manufacturer_name || '',
                manufacturerOriginCountry: result.manufacturer_country_of_origin || '',
                manufacturerDescription: result.manufacturer_description || '',
                stockedInData: result.stockedIn_details || []
            }));
            setProductCategory(result.medicine_category)
            setCountryOfOrigin(result.country_of_origin)
            setFormType(result.type_of_form)
            } else {
                toast(response.message, { type: "error" });
                console.log('error in get-medicine-by-name api');
            }
        });
    }, 500);
    
    return (
        <>
            <div className={styles['create-invoice-container']}>
                <ToastContainer />
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
                                    // onBlur={handleBlur}
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
                                        <label className={styles['create-invoice-div-label']}>Purchased On</label>
                                        <input
                                            className={styles['create-invoice-div-input']}
                                            type='text'
                                            name='purchasedOn'
                                            placeholder='Enter Purchased On'
                                            autoComplete='off'
                                            value={formData.purchasedOn}
                                            onChange={handleChange}
                                        />
                                        {errors.purchasedOn && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.purchasedOn}</div>}
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Country Available In</label>
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
                                <label className={styles['create-invoice-div-label']}>Unit Tax</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='unitTax'
                                    placeholder='Enter Unit Tax'
                                    autoComplete='off'
                                    value={formData.unitTax}
                                    onChange={handleChange}
                                />
                                {errors.unitTax && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.unitTax}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Type of form</label>
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

                            {productType && productType.value === 'new_product' && (
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
                            )}
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
                                <label className={styles['create-invoice-div-label']}>Registered In</label>
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
                                <label className={styles['create-invoice-div-label']}>Stocked In</label>
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
                                <label className={styles['create-invoice-div-label']}>Available For</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='availableFor'
                                    placeholder='Enter Available For'
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
                                    <div className={styles['create-invoice-form-heading']}>Stocked In Details</div>
                                    <span className={styles['create-invoice-add-item-button']} onClick={addStockedInSection}>Add More</span>
                                </div>
                                {stockedInSections.map((section, index) => (
                                    <div className={styles['form-item-container']} >
                                        {/* {productType && productType.value === 'new_product' && ( */}
                                        <div className={styles['create-invoice-new-product-section-containers']}>
                                            <div className={styles['create-invoice-div-container']}>
                                                <label className={styles['create-invoice-div-label']}>Stocked In Country</label>
                                                <Select
                                                    className={styles['create-invoice-div-input-select']}
                                                    value={section.stockedInCountry}
                                                    onChange={(selected) => handleStockedInCountryChange(index, selected)}
                                                    options={stockedInOptions}
                                                    placeholder="Select Stocked In Country"
                                                    name='stockedInCountry'
                                                />
                                                {errors[`stockedInCountry${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`stockedInCountry${index}`]}</div>}
                                            </div>
                                            <div className={styles['add-product-div-container']}>
                                                <label className={styles['create-invoice-div-label']}>Stocked In Quantity</label>
                                                <div className={styles.quantitySelector}>
                                                    <div className={styles.inputGroup}>
                                                        <input
                                                            type="text"
                                                            // value={quantity}
                                                            // onChange={(e) => setQuantity(e.target.value)}
                                                            // onChange={handleStockedInputChange(index, event)}
                                                            name='stockedInQuantity'
                                                            onChange={(event) => handleStockedInputChange(index, event)}
                                                            value={section.stockedInQuantity}
                                                            placeholder={`Enter ${packageType} Quantity`}
                                                            className={styles['add-product-div-input']}
                                                        />
                                                        <button
                                                            className={`${styles.optionButton} ${styles.selected}`}
                                                        >
                                                            {/* {packageType} */}
                                                            {section.stockedInType}
                                                        </button>
                                                       
                                                    </div>
                                                    
                                                    <div className={styles.radioGroup}>
                                                        <label>
                                                            <input
                                                                name={`stockedInType_${index}`}
                                                                type="radio"
                                                                value="Box"
                                                                // checked={packageType === 'Box'}
                                                                checked={section.stockedInType === 'Box'}
                                                                // onChange={handlePackageSelection}
                                                                onChange={() => handlePackageSelection(index, 'Box')}
                                                            />
                                                            <span>Box</span>
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"

                                                                name={`stockedInType_${index}`}
                                                                value="Strip"
                                                                // checked={packageType === 'Strip'}
                                                                checked={section.stockedInType === 'Strip'}
                                                                // onChange={handlePackageSelection}
                                                                onChange={() => handlePackageSelection(index, 'Strip')}
                                                            />
                                                            <span>Strip</span>
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="Pack"
                                                                name={`stockedInType_${index}`}
                                                                // checked={packageType === 'Pack'}
                                                                checked={section.stockedInType === 'Pack'}
                                                                // onChange={handlePackageSelection}
                                                                onChange={() => handlePackageSelection(index, 'Pack')}
                                                            />
                                                            <span>Pack</span>
                                                        </label>

                                                    </div>
                                                    {errors[`stockedInQuantity${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`stockedInQuantity${index}`]}</div>}
                                                </div>
                                            </div>
                                        </div>
                                        {/* )} */}
                                        {stockedInSections.length > 1 && (
                                            <div className={styles['craete-add-cross-icon']} onClick={() => removeStockedInFormSection(index)}>
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
                                <div className={styles['create-invoice-add-item-cont']}>
                                    <div className={styles['create-invoice-form-heading']}>Product Inventory</div>
                                    <span className={styles['create-invoice-add-item-button']} onClick={addFormSection}>Add More</span>
                                </div>
                                {formSections.map((section, index) => (
                                    <div className={styles['form-item-container']} >

                                        {productType && productType.value === 'new_product' && (
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
                                                    {/* {errors.unitPrice && <div className={styles['add-product-errors']}>{errors.unitPrice}</div>} */}
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
                                                    {/* {errors.totalPrice && <div className={styles['add-product-errors']}>{errors.totalPrice}</div>} */}
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
                                                    {/* {errors.estDeliveryTime && <div className={styles['add-product-errors']}>{errors.estDeliveryTime}</div>} */}
                                                    {errors[`estDeliveryTime${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`estDeliveryTime${index}`]}</div>}
                                                </div>


                                            </div>
                                        )}

                                        {productType && productType.value === 'secondary_market' && (
                                            <div className={styles['create-invoice-new-product-section-containers']}>
                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Quantity</label>
                                                    <input
                                                        className={styles['create-invoice-div-input']}
                                                        type='text'
                                                        name='quantityNo'
                                                        placeholder='Enter Quantity'
                                                        value={section.quantityNo}
                                                        onChange={(event) => handleInputChange(index, event)}
                                                    />
                                                    {errors[`quantityNo${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`quantityNo${index}`]}</div>}
                                                </div>

                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Unit Price</label>
                                                    <input
                                                        className={styles['create-invoice-div-input']}
                                                        type='text'
                                                        name='unitPricee'
                                                        placeholder='Enter Unit Price'
                                                        value={section.unitPricee}
                                                        onChange={(event) => handleInputChange(index, event)}
                                                    />
                                                    {errors[`unitPricee${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`unitPricee${index}`]}</div>}
                                                </div>
                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Condition</label>
                                                    <Select
                                                        className={styles['create-invoice-div-input-select']}
                                                        value={section.condition}
                                                        onChange={(selected) => handleConditionChange(index, selected)}
                                                        options={conditionOptions}
                                                        placeholder="Select Condition"
                                                    />
                                                    {errors[`condition${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`condition${index}`]}</div>}
                                                </div>
                                            </div>
                                        )}
                                        {formSections.length > 1 && (
                                            <div className={styles['craete-add-cross-icon']} onClick={() => removeFormSection(index)}>
                                                <CloseIcon />
                                            </div>
                                        )}
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
                                <label className={styles['create-invoice-div-label']}>Description</label>
                                <textarea
                                    className={styles['create-invoice-div-input']}
                                    name="manufacturerDescription"
                                    rows="4"
                                    cols="20"
                                    value={formData.manufacturerDescription}
                                    placeholder='Enter Description'
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
                                    {!medicineImages || errors.product_image && <div className={styles['add-product-errors']} style={{ color: 'red', fontSize: '12px' }}>{errors.medicineImage}</div>}
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
                            <button type='submit' className={styles['create-invoices-submit']}>Add Product</button>
                            <div className={styles['create-invoices-cancel']} onClick={handleCancel}>Cancel</div>
                        </div>
                    </form>

                </div>

            </div>
        </>
    );
};

export default AddProduct;