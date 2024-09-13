import React, { useState, useEffect } from 'react';
import styles from '../style/addproduct.module.css';
import Select, { components } from 'react-select';
import countryList from 'react-select-country-list';
import ImageAddUploader from './ImageAppUploader';
import CloseIcon from '@mui/icons-material/Close';
import AddPdfUpload from './AddPdfUpload';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequest, postRequestWithTokenAndFile } from '../api/Requests';
import { toast } from 'react-toastify';
import { InputMask } from '@react-input/mask';
import Loader from '../components/Loader';
import EditImageUploader from './EditImageUploader';
import EditPdfUpload from './EditPdfUpload';

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

const EditSecondaryProduct = ({socket}) => {

    const { medicineId } = useParams()
    const navigate       = useNavigate()

    const [medicineDetails, setMedicineDetails] = useState()
    const [medId, setMedId] = useState(medicineId)

    
    const productTypeOptions = [
        { value: 'secondary_market', label: 'Secondary Market' },
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
        { value: 'generies', label: 'Generics' },
        { value: 'orignals', label: 'Orignals' },
        { value: 'biosimilars', label: 'Biosimilars' },
        { value: 'medicaldevices', label: 'Medical Devices' },
        { value: 'nutraceuticals', label: 'Nutraceutical' }
    ];

    const [loading, setLoading] = useState(false);
    const [productType, setProductType] = useState({ value: 'secondary_market', label: 'Secondary Market' });
    const [formType, setFormType] = useState()
    const [productCategory, setProductCategory] = useState()
    const [countryOfOrigin, setCountryOfOrigin] = useState('')
    const [registeredCountries, setRegisteredCountries] = useState([])
    const [stockedIn, setStockedIn] = useState([])
    const [availableCountries, setAvailableCountries] = useState([])
    const [medicineImages, setMedicineImages] = useState([])
    const [invoiceImages, setInvoiceImages] = useState([])
    const [manufacturerCountryOfOrigin, setManufacturerCountryOfOrigin] = useState('')
    const [stockedInOptions, setStockedInOptions] = useState([])
    const [packageType, setPackageType] = useState('Box');
    const [condition, setCondition] = useState()

  
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
        stockedInData: '',

        quantity: [],
    unitPrice: [],
    totalPrice: [],
    estDeliveryTime: [],
    unitPrice: '',
    pdtQuantity: '',
    condition: ''
    })
    const [formSections, setFormSections] = useState([
        {
            strength: '',
            quantity: null,
            typeOfForm: null,
            productCategory: null,
            unitPrice: '',
            estDeliveryTime: '',
            condition: '',
            totalPrice: ''
        }
    ]);

    const [stockedInSections, setStockedInSections] = useState([
        {
            stockedInCountry: '',
            stockedInQuantity: '',
            stockedInType: 'Box',
        }
    ]);

    useEffect(() => {
        setFormData({
            ...formData,
            product_image: medicineImages
        });
    }, [medicineImages])

    useEffect(() => {
        setFormData({
            ...formData,
            invoice_image: invoiceImages
        });
    }, [invoiceImages])


    useEffect(() => {
        if (medicineDetails?.inventory_info && medicineDetails?.inventory_info.length > 0) {
            const initialSections = medicineDetails?.inventory_info?.map(item => ({
                strength: '', 
                quantity: { value: item.quantity, label: item.quantity }, 
                typeOfForm: null,
                productCategory: null,
                unitPrice: item.unit_price,
                estDeliveryTime: item.est_delivery_days,
                totalPrice: item.total_price,
                condition: { value: '', label: '' } 
            }));
            
            setFormSections(initialSections);

            setFormData(prev => ({
                ...prev,
                pdtQuantity: medicineDetails?.total_quantity,
                unitPrice: medicineDetails?.unit_price,
                condition: medicineDetails?.condition,
                    quantity: initialSections.map(section => section.quantity),
                unitPrice: initialSections.map(section => section.unitPrice),
                totalPrice: initialSections.map(section => section.totalPrice),
                estDeliveryTime: initialSections.map(section => section.estDeliveryTime),
            }))
        }
    }, [medicineDetails]);

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const countryOptions = countryList().getData();
        setCountries(countryOptions);
    }, []);
   
    
    const handleQuantityChange = (index, selected) => {
        const newFormSections = [...formSections];
        newFormSections[index].quantity = selected;
        setErrors(prevErrors => ({
            ...prevErrors,
            [`quantity${index}`]: ''
        }));
        const quantities = newFormSections.map(section => section.quantity);
        setFormData(prevFormData => ({
            ...prevFormData,
            quantity: quantities
        }));
        setFormSections(newFormSections);
    };
    

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newFormSections = [...formSections];
        let isValid = true;
    
        // Validation logic based on the input name
        if (name === 'unitPrice') {
            // Restrict input to max 4 digits before decimal, and 3 digits after
            if (/^\d{0,4}(\.\d{0,3})?$/.test(value)) {
                isValid = true;
            } else {
                isValid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`${name}${index}`]: ''
                }));
            }
        } else if (name === 'totalPrice') {
            // Restrict input to max 8 digits before decimal, and 3 digits after
            if (/^\d{0,8}(\.\d{0,3})?$/.test(value)) {
                isValid = true;
            } else {
                isValid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`${name}${index}`]: ''
                }));
            }
        } else if (name === 'estDeliveryTime') {
            // Restrict input to 3 digits for delivery time
            if (/^\d{0,3}$/.test(value)) {
                isValid = true;
            } else {
                isValid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`${name}${index}`]: ''
                }));
            }
        } else if (name === 'quantityNo') {
            // Allow only whole numbers
            if (/^\d*$/.test(value)) {
                isValid = true;
            } else {
                isValid = false;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`${name}${index}`]: 'Invalid quantity. Please enter only numbers.'
                }));
            }
        }
    
        // If the input is valid, update the form sections and reset any errors
        if (isValid) {
            newFormSections[index][name] = value;
    
            // Update formData with the newly modified values
            const unitPrices = newFormSections.map(section => section.unitPrice);
            const totalPrices = newFormSections.map(section => section.totalPrice);
            const estDeliveryTimes = newFormSections.map(section => section.estDeliveryTime);
    
            setFormData(prevFormData => ({
                ...prevFormData,
                unitPrice: unitPrices,
                totalPrice: totalPrices,
                estDeliveryTime: estDeliveryTimes,
            }));
    
            // Clear errors for this input
            setErrors(prevErrors => ({
                ...prevErrors,
                [`${name}${index}`]: ''
            }));
        } else {
            // Prevent the input from updating if invalid
            event.target.value = newFormSections[index][name] || '';
        }
    
        setFormSections(newFormSections);
    };
    
    const addFormSection = () => {
        let newProductValid = true;
        let secondaryMarketValue = true;
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

    const removeFormSection = (index) => {
        if (formSections.length > 1) {
            const newFormSections = formSections.filter((_, i) => i !== index);
            setFormSections(newFormSections);

            setFormData(prevFormData => ({
                ...prevFormData,
                quantity: prevFormData.quantity.filter((_, i) => i !== index),
                unitPrice: prevFormData.unitPrice.filter((_, i) => i !== index),
                totalPrice: prevFormData.totalPrice.filter((_, i) => i !== index),
                estDeliveryTime: prevFormData.estDeliveryTime.filter((_, i) => i !== index),
            }));
        }
    };

    const handleProductTypeChange = (selected) => {
        setProductType(selected);
    };

    const [defaultFormType, setDefaultFormType] = useState(null);
    const [defaultCategory, setDefaultCategory] = useState(null)
    const [defaultCountryOfOrigin, setDefaultCountryOfOrigin] = useState(null)
    const [defaultRegisteredIn, setDefaultRegisteredIn] = useState([])
    const [defaultStockedIn, setDefaultStockedIn] = useState([])
    const [defaultCountryAvailableIn, setDefaultCountryAvailableIn] = useState([])
    const [inventoryInfo, setInventoryInfo] = useState([]);
  
    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        
        const obj = {
            medicine_id : medId,
            supplier_id : supplierIdSessionStorage || supplierIdLocalStorage 
        }
        
        postRequest('buyer/medicine/medicine-details', obj, async (response) => {
            if (response.code === 200) {
                setMedicineDetails(response?.result?.data);
                const result = response?.result?.data;

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
                    invoice_image: [],
                    purchasedOn: result?.purchased_on || '',
                    minPurchaseUnit: result?.min_purchase_unit || '',
                    countryAvailableIn: result?.country_available_in || [],
                    manufacturerName: result?.manufacturer_name || '',
                    manufacturerOriginCountry: result?.manufacturer_country_of_origin || '',
                    manufacturerDescription: result?.manufacturer_description || '',
                    stockedInData: result?.stockedIn_details || [],
                    pdtQuantity: result?.total_quantity,
                    unitPrice: result?.unit_price,
                    condition: { label: result?.condition, value: result?.condition } || null,
                    product_image : result?.medicine_image || []
                }));
                setMedicineImages(result?.medicine_image || [])
                setInvoiceImages(result?.invoice_image || [])
                setProductCategory(result?.medicine_category)
                setCountryOfOrigin(result?.country_of_origin)
                setFormType(result?.type_of_form)
                // setCondition(result?.condition)
                setCondition(
                    result?.condition
                        ? { label: result?.condition, value: result?.condition }
                        : null // Default to null if no condition is found
                );
               
            } else {
               console.log('error in med details api');
            }
          })
    },[])

    useEffect(() => {
        if (medicineDetails?.type_of_form) {
            const selectedFormType = formTypesOptions.find(option => option.label === medicineDetails?.type_of_form);
            setDefaultFormType(selectedFormType);
        }
        if(medicineDetails?.medicine_category) {
            const selectedCategory = productCategoryOptions.find(option => option.label === medicineDetails?.medicine_category )
            setDefaultCategory(selectedCategory)
        }
        if(medicineDetails?.country_of_origin) {
            const selectedCountryOrigin = countries.find(option => option.label === medicineDetails?.country_of_origin )
            setDefaultCountryOfOrigin(selectedCountryOrigin)
        }
        if (medicineDetails?.registered_in) {
            const selectedRegisteredIn = countries.filter(option => 
                medicineDetails?.registered_in.includes(option.label)
            );
            setDefaultRegisteredIn(selectedRegisteredIn);
        }
        if (medicineDetails?.stocked_in) {
            const selectedStockedIn = countries.filter(option => 
                medicineDetails?.stocked_in.includes(option.label)
            );
            setDefaultStockedIn(selectedStockedIn);
        }
        if (medicineDetails?.country_available_in) {
            const countryAvailableIn = countries.filter(option => 
                medicineDetails?.country_available_in.includes(option.label)
            );
            setDefaultCountryAvailableIn(countryAvailableIn);
        }
        if (medicineDetails?.inventory_info) {
            setInventoryInfo(medicineDetails.inventory_info);
        }
        if(medicineDetails?.manufacturer_country_of_origin) {
            const manufacturerCountry = countries.find(option => option.label === medicineDetails?.manufacturer_country_of_origin )
            setManufacturerCountryOfOrigin(manufacturerCountry)
        }
    }, [medicineDetails]);

    useEffect(() => {
        if (medicineDetails?.stockedIn_details) {
            const initialSections = medicineDetails?.stockedIn_details?.map(detail => ({
                stockedInCountry: { label: detail.stocked_in_country, value: detail.stocked_in_country },
                stockedInQuantity: detail.stocked_quantity,
                stockedInType: detail.stocked_in_type
            }));
            setStockedInSections(initialSections);
        }
    }, [medicineDetails]);

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

    const handleStockedInCountryChange = (index, selected) => {
        const updatedSections = [...stockedInSections];
        updatedSections[index].stockedInCountry = selected;
        setErrors(prevErrors => ({
            ...prevErrors,
            [`stockedInCountry${index}`]: ''
        }));
        setStockedInSections(updatedSections);
        setFormData(prevFormData => ({
            ...prevFormData,
            stockedInData: updatedSections
        }));
    };

    const handleStockedInputChange = (index, event) => {
        const { name, value } = event.target;
        if (/^\d*$/.test(value) && value.length <= 8) {
            const updatedSections = [...stockedInSections];
            updatedSections[index][name] = value;
            setErrors(prevErrors => ({
                ...prevErrors,
                [`stockedInQuantity${index}`]: ''
            }));
            setStockedInSections(updatedSections);
            setFormData(prevFormData => ({
                ...prevFormData,
                stockedInData: updatedSections
            }));
        }
    };

    const handlePackageSelection = (index, packageType) => {
        const updatedSections = [...stockedInSections];
        updatedSections[index].stockedInType = packageType;
        setStockedInSections(updatedSections);
        setPackageType(packageType)
    };

    const removeStockedInFormSection = (index) => {
        setStockedInSections(prevSections => prevSections.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.productName) formErrors.productName = 'Product Name is Required';
        if (!productType) formErrors.productType = 'Product Type is Required';
        if (!formData.composition) formErrors.composition = 'Composition is Required';
        if (!formData.strength) formErrors.strength = 'Strength is Required';
        if (!formData.unitTax) formErrors.unitTax = 'Unit Tax is Required';
        if (!formType) formErrors.typeOfForm = 'Type of Form is Required';
        if (!formData.shelfLife) formErrors.shelfLife = 'Shelf Life is Required';
        if (!formData.dossierStatus) formErrors.dossierStatus = 'Dossier Status is Required';
        if (!formData.dossierType) formErrors.dossierType = 'Dossier Type is Required';
        if (productType && productType.label === 'New Product') {
            if (!formData.totalQuantity) formErrors.totalQuantity = 'Total Quantity is Required';
        }
        if (!formData.gmpApprovals) formErrors.gmpApprovals = 'Gmp Approval is Required';
        if (!formData.shippingTime) formErrors.shippingTime = 'Shipping Time is Required';
        if (!formData.availableFor) formErrors.availableFor = 'Available for is Required';
        if (!formData.tags) formErrors.tags = 'Tags are Required';
        if (!formData.description) formErrors.description = 'Description is Required';
        if (!countryOfOrigin) formErrors.originCountry = 'Country of Origin is Required'
        if (formData?.registeredIn?.length === 0) formErrors.registeredIn = 'Registered in is Required';
        if (formData?.stockedIn?.length === 0) formErrors.stockedIn = 'Stocked in is Required';
        if (!productCategory) formErrors.productCategory = 'Product Category is Required';

        if (!formData.manufacturerName) formErrors.manufacturerName = 'Manufacturer Name is Required';
        if (!formData.manufacturerOriginCountry) formErrors.manufacturerOriginCountry = 'Manufacturer Country of Origin is Required';
        if (!formData.manufacturerDescription) formErrors.manufacturerDescription = 'About Manufacturer is Required';

        // if (!formData.pdtQuantity) formErrors.pdtQuantity = 'Quantity is Required';
        if (!formData.unitPrice) formErrors.unitPrice = 'Unit Price is Required';
        if (!formData.condition) formErrors.condition = 'Condition is Required';

        if (formData.product_image?.length === 0) formErrors.product_image = 'Medicine Image is Required';

        if (productType && productType.label === 'New Product') {
            formSections.forEach((section, index) => {
                if (!section.quantity) formErrors[`quantity${index}`] = 'Quantity is Required';
                if (!section.unitPrice) formErrors[`unitPrice${index}`] = 'Unit Price is Required';
                if (!section.totalPrice) formErrors[`totalPrice${index}`] = 'Total Price is Required';
                if (!section.estDeliveryTime) formErrors[`estDeliveryTime${index}`] = 'Estimated Delivery Time is Required';
            });
        } else if (productType && productType.label === 'Secondary Market') {
        }
        stockedInSections.forEach((section, index) => {
            if (!section.stockedInCountry) formErrors[`stockedInCountry${index}`] = 'Stocked in Country is Required';
            if (!section.stockedInQuantity) formErrors[`stockedInQuantity${index}`] = 'Stocked in Quantity is Required';
            if (!section.stockedInType) formErrors[`stockedInType${index}`] = 'Stocked in Type is Required';
        });
        if (productType && productType.label === 'Secondary Market') {
            if (!availableCountries) formErrors.countryAvailableIn = 'Country Available in is Required';
            if (!formData.purchasedOn) formErrors.purchasedOn = 'Purchased on is Required';
            if (!formData.minPurchaseUnit) formErrors.minPurchaseUnit = 'Min. Purchase Unit is Required';
            if (invoiceImages?.length === 0 || formData.invoice_image === undefined) formErrors.invoiceImage = 'Invoice Image is Required';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }

    const resetForm = () => {
        setProductType({ value: 'secondary_market', label: 'Secondary Market' });
        setFormType('');
        setProductCategory('');
        setCountryOfOrigin('');
        setRegisteredCountries([]);
        setStockedIn([]);
        setAvailableCountries([]);
        setMedicineImages([]);
        setInvoiceImages([]);
        setStockedInSections([
            {
                stockedInCountry: '',
                stockedInQuantity: '',
                stockedInType: 'Box',
            }
        ])
        setManufacturerCountryOfOrigin('')
        setDefaultRegisteredIn([])
        setDefaultStockedIn([])
        setDefaultCountryAvailableIn([])
        setCondition()
        setErrors({});
        setFormData({
            productName: '',
            productType: { value: 'secondary_market', label: 'Secondary Market' },
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
            stockedInData: '',
            unitPrice: '',
            // pdtQuantity: '',
            condition: ''
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

        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        e.preventDefault()
        if (validateForm()) {
            setLoading(true);
            const newFormData = new FormData()
            const secondaryFormData = new FormData()
            const registered = formData.registeredIn?.map(country => {
                return country ? country.label : '';
            }) || [];

            const quantities = formData.quantity?.map(qty => {
                return qty ? qty?.label : ''
            })

            const stocked = formData.stockedIn?.map(country => {
                return country ? country.label : '';
            }) || []

            const simplifiedStockedInSections = stockedInSections.map(section => ({
                stocked_in_country: section.stockedInCountry?.label || '',
                stocked_quantity: section.stockedInQuantity || '',
                stocked_in_type: section.stockedInType || ''
            }));
            if (productType && productType.label === 'New Product') {

               
                newFormData.append('supplier_id', supplierIdSessionStorage || supplierIdLocalStorage);
                newFormData.append('medicine_id',  medicineId);
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
                newFormData.append('country_of_origin', countryOfOrigin?.label || countryOfOrigin);
                formData.registeredIn.forEach(item =>  newFormData.append('registered_in[]', item) )
                formData.stockedIn.forEach(item =>  newFormData.append('stocked_in[]', item) )
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
                newFormData.append('stocked_in_details', JSON.stringify(simplifiedStockedInSections));

                postRequestWithTokenAndFile('/medicine/edit-medicine', newFormData, async (response) => {
                    if (response.code === 200) {
                        resetForm()
                        setLoading(false);
                        toast(response.message, { type: "success" });
                        
                        setTimeout(() => {
                            navigate('/supplier/product/newproduct')
                        }, 1000);
                    } else {
                        setLoading(false);
                        toast(response.message, { type: "error" });
                        console.log('error in new  /medicine/add-medicine');
                    }
                    setLoading(false);
                })

            } else if (productType && productType.label === 'Secondary Market') {
                
                const countryLabels = formData.countryAvailableIn?.map(country => {
                    return country ;
                }) || [];

                console.log('fIMage', formData.product_image);
                secondaryFormData.append('supplier_id', supplierIdSessionStorage || supplierIdLocalStorage);
                secondaryFormData.append('medicine_id',  medicineId);
                secondaryFormData.append('medicine_name', formData.productName);
                secondaryFormData.append('product_type', 'secondary market');
                secondaryFormData.append('purchased_on', formData.purchasedOn);
                countryLabels.forEach(item => secondaryFormData.append('country_available_in[]', item));
                secondaryFormData.append('strength', formData.strength);
                secondaryFormData.append('unit_tax', formData.unitTax);
                secondaryFormData.append('total_quantity', formData.totalQuantity);
                secondaryFormData.append('min_purchase_unit', formData.minPurchaseUnit);
                secondaryFormData.append('composition', formData.composition);
                secondaryFormData.append('type_of_form', formData.typeOfForm?.label);
                secondaryFormData.append('shelf_life', formData.shelfLife);
                secondaryFormData.append('dossier_type', formData.dossierType);
                secondaryFormData.append('dossier_status', formData.dossierStatus);
                secondaryFormData.append('product_category', formData.productCategory?.label);
                secondaryFormData.append('gmp_approvals', formData.gmpApprovals);
                secondaryFormData.append('shipping_time', formData.shippingTime);
                secondaryFormData.append('country_of_origin', countryOfOrigin?.label || countryOfOrigin);
                formData.registeredIn.forEach(item =>  secondaryFormData.append('registered_in[]', item) )
                formData.stockedIn.forEach(item =>  secondaryFormData.append('stocked_in[]', item) )
                secondaryFormData.append('available_for', formData.availableFor);
                secondaryFormData.append('tags', formData.tags);
                secondaryFormData.append('description', formData.description);
                // secondaryFormData.append('quantity', formData.pdtQuantity);
                // secondaryFormData.append('unit_price', formData.unitPrice);
                quantities.forEach(item => secondaryFormData.append('quantity[]', item));
                formData.unitPrice.forEach(price => secondaryFormData.append('unit_price[]', price));
                formData.totalPrice.forEach(price => secondaryFormData.append('total_price[]', price));
                formData.estDeliveryTime.forEach(time => secondaryFormData.append('est_delivery_days[]', time));
                secondaryFormData.append('condition', condition?.label);
                // Array.from(formData.product_image).forEach(file => secondaryFormData.append('product_image', file));
                Array.from(formData.product_image).forEach(file => secondaryFormData.append('product_image', file));
                Array.from(formData.invoice_image).forEach(file => secondaryFormData.append('invoice_image', file));
                secondaryFormData.append('manufacturer_country_of_origin', manufacturerCountryOfOrigin?.label)
                secondaryFormData.append('manufacturer_name', formData?.manufacturerName)
                secondaryFormData.append('manufacturer_description', formData?.manufacturerDescription)
                secondaryFormData.append('stocked_in_details', JSON.stringify(simplifiedStockedInSections));

                postRequestWithTokenAndFile('/medicine/edit-medicine', secondaryFormData, async (response) => {
                    if (response.code === 200) {
                        resetForm()
                        setLoading(false);
                        toast(response.message, { type: "success" });
                        socket.emit('editSecondaryMedicine', {
                            adminId : process.env.REACT_APP_ADMIN_ID,
                            message : `New Edit Medicine Request `,
                            link    : process.env.REACT_APP_PUBLIC_URL
                            // send other details if needed
                        });
                        setTimeout(() => {
                            navigate('/supplier/product/secondarymarket')
                        }, 1000);
                    } else {
                        setLoading(false);
                        toast(response.message, { type: "error" });
                        console.log('error in secondary  /medicine/add-medicine');
                    }
                    setLoading(false);
                })
            }
        } else {
            setLoading(false);
            toast('Some Fields are Missing', { type: "error" });
            console.log('errorrrrr', formData);
        }
    }
    const handleCancel = () => {
        resetForm()
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        let newErrors = { ...errors };  // Start with existing errors
        let isValid = true;
    
        // Clear the error message for the field being updated
        newErrors[name] = '';
    
        if (name === 'description') {
            if (value.length > 1000) {
                newErrors.description = 'Description cannot exceed 1000 characters';
                isValid = false;
            }
        } else if (name === 'productName' || name === 'dossierStatus') {
            // Only check for invalid characters if the value is not empty
            if (value.trim() && !/^[a-zA-Z\s]*$/.test(value)) {
                newErrors[name] = '';
                isValid = false;
            }
        } else if (name === 'totalQuantity') {
            // Allow only up to 5 digits
            if (value.trim() && !/^\d{1,8}$/.test(value)) {
                newErrors[name] = '';
                isValid = false;
            }
        } else if (name === 'minPurchaseUnit') {
            // Allow only up to 3 digits
            if (value.trim() && !/^\d{1,3}$/.test(value)) {
                newErrors[name] = '';
                isValid = false;
            }
        } else if (name === 'unitTax') {
            // Regular expression to match up to 2 digits before the decimal and up to 2 digits after the decimal
            const regex = /^\d{0,2}(\.\d{0,3})?$/;

            if (value.trim() && !regex.test(value)) {
                newErrors[name] = '';
                isValid = false;
            } else {
                newErrors[name] = ''; // Clear error if input is valid
            }
        }  else if (name === 'shippingTime') {
            // Only check for invalid characters if the value is not empty
            if (value.trim() && !/^\d{1,3}$/.test(value)) {
                newErrors[name] = '';
                isValid = false;
            }

            
        } 
        // else if (['composition', 'strength', 'shelfLife', 'dossierType', 'gmpApprovals', 'shippingTime', 'availableFor', 'tags', 'manufacturerName', 'manufacturerDescription'].includes(name)) {
        //     // Validate only if the value is not empty
        //     if (value.trim() === '') {
        //         newErrors[name] = `${name.replace(/([A-Z])/g, ' $1')} is required`;
        //         isValid = false;
        //     }
        // }
    
        // Update the form data if valid
        if (isValid) {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
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

    const handlemanufacturerCountryOriginChange = (selected) => {
        setManufacturerCountryOfOrigin(selected)
        setFormData(prevState => ({ ...prevState, manufacturerOriginCountry: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, manufacturerOriginCountry: 'Manufacturer country of origin is Required' }));
        } else {
            setErrors(prevState => ({ ...prevState, manufacturerOriginCountry: '' }));
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

    const handleAvailableInChange = (selectedOptions) => {
        const selectedLabels = selectedOptions?.map(option => option.label) || [];
        setFormData({
            ...formData,
            countryAvailableIn: selectedLabels
        });
        setDefaultCountryAvailableIn(selectedOptions || [])
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

    const handleFormTypeChange = (selected) => {
        setFormType(selected)
        setFormData(prevState => ({ ...prevState, typeOfForm: selected }));
        if (!selected) {
            setErrors(prevState => ({ ...prevState, typeOfForm: 'Type of form is Required' }));
        } else {
            setErrors(prevState => ({ ...prevState, typeOfForm: '' }));
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

    const handleRegisteredInChange = (selectedOptions) => {
        const selectedLabels = selectedOptions?.map(option => option.label) || [];
        setFormData({
            ...formData,
            registeredIn: selectedLabels
        });
        setDefaultRegisteredIn(selectedOptions || []);
        setErrors(prevState => ({
            ...prevState,
            registeredIn: selectedLabels.length === 0 ? 'Registered in is Required' : ''
        }));
    };

    const handleStockedInChange = (selectedOptions) => {
        const selectedLabels = selectedOptions?.map(option => option.label) || [];
        setFormData({
            ...formData,
            stockedIn: selectedLabels
        });
        setDefaultStockedIn(selectedOptions || [])
        setErrors(prevState => ({
            ...prevState,
            stockedIn: selectedLabels.length === 0 ? 'Stocked in is Required' : ''
        }));
        const options = selectedOptions.map(option => ({ label: option.label }));
    };

     const handleConditionChange = (selected) => {
        const selectedValue = selected ? selected.label : ''; 
        setCondition(selected);

        // setFormData(prevState => ({ ...prevState, typeOfForm: selected }));
        // if (!selected) {
        //     setErrors(prevState => ({ ...prevState, typeOfForm: 'Type of form is Required' }));
        // } else {
        //     setErrors(prevState => ({ ...prevState, typeOfForm: '' }));
        // }
        setFormData(prevState => ({ ...prevState, condition: selectedValue }));
    
        if (!selectedValue) {
            setErrors(prevState => ({ ...prevState, condition: 'Condition is required' }));
        } else {
            setErrors(prevState => ({ ...prevState, condition: '' }));
        }
    };

    return (
        <>
            <div className={styles['create-invoice-container']}>
                <div className={styles['create-invoice-heading']}>Edit Product</div>
                <div className={styles['create-invoice-section']}>
                    <form className={styles['craete-invoice-form']} onSubmit={handleSubmit}>
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
                                    value={formData.productName}
                                    placeholder='Enter Product Name'
                                    autoComplete='off'
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
                                />
                                 {errors.productType && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.productType}</div>}
                            </div>

                            {productType && productType.value === 'secondary_market' && (
                                <>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Purchased On</label>
                                        <InputMask
                                            className={styles['create-invoice-div-input']}
                                            type="text"
                                            mask="dd/mm/yyyy" 
                                            placeholder='DD/MM/YYYY'
                                            name='purchasedOn'
                                            // placeholder='Enter Purchased on'
                                            autoComplete='off'
                                            value={formData.purchasedOn}
                                            onChange={handleChange}
                                            onBlur={handleBlur} 
                                            replacement={{ d: /\d/, m: /\d/, y: /\d/ }} showMask separate 
                                        />
                                        {errors.purchasedOn && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.purchasedOn}</div>}
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Condition</label>
                                        <Select
                                            className={styles['create-invoice-div-input-select']}
                                            value={condition}
                                            onChange={ handleConditionChange}
                                            options={conditionOptions}
                                            placeholder="Select Condition"
                                        />
                                        {errors.condition && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.condition}</div>}
                                        {/* {errors[`condition${index}`] && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors[`condition${index}`]}</div>} */}
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Country Available In</label>
                                        <MultiSelectDropdown
                                            options={countries}
                                            placeholderButtonLabel="Select Countries"
                                            onChange={handleAvailableInChange}
                                            value={defaultCountryAvailableIn}
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
                                    value={defaultRegisteredIn}
                                    onChange={handleRegisteredInChange}
                                />
                                {errors.registeredIn && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.registeredIn}</div>}
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Stocked in</label>
                                <MultiSelectDropdown
                                    options={countries}
                                    placeholderButtonLabel="Select Countries"
                                    onChange={handleStockedInChange}
                                    value={defaultStockedIn}
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
                                                    options={defaultStockedIn}
                                                    placeholder="Select Stocked in Country"
                                                    name='stockedInCountry'
                                                />
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

                        <div className={styles['create-invoice-inner-form-section']}>
                            <div className={styles['create-invoice-section']}>
                                <div className={styles['create-invoice-add-item-cont']}>
                                    <div className={styles['create-invoice-form-heading']}>Product Inventory</div>
                                    <span className={styles['create-invoice-add-item-button']} 
                                    onClick={addFormSection}
                                    >Add More</span>
                                </div>
                                {formSections.map((section, index) => (
                                    <div className={styles['form-item-container']} >

                                        {/* {productType && productType.value === 'new_product' && ( */}
                                            <div className={styles['create-invoice-new-product-section-containers']}>
                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Quantity</label>
                                                    <Select
                                                        className={styles['create-invoice-div-input-select']}
                                                        value={section.quantity}
                                                        onChange={(selected) => handleQuantityChange(index, selected)}
                                                        options={quantityOptions}
                                                        placeholder="Select Quantity"
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
                                                        defaultValue={section.unitPrice}
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
                                                        defaultValue={section.totalPrice}
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
                                        {/* )} */}

                                        {/* {productType && productType.value === 'secondary_market' && (
                                            <div className={styles['create-invoice-new-product-section-containers']}>
                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Quantity</label>
                                                    <input
                                                        className={styles['create-invoice-div-input']}
                                                        type='text'
                                                        name='pdtQuantity'
                                                        placeholder='Enter Quantity'
                                                        value={formData.pdtQuantity}
                                                        onChange={handleChange}
                                                    />
                                                   
                                                    {errors.pdtQuantity && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.pdtQuantity}</div>}
                                                </div>

                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Unit Price</label>
                                                    <input
                                                        className={styles['create-invoice-div-input']}
                                                        type='text'
                                                        name='unitPrice'
                                                        placeholder='Enter Unit Price'
                                                        value={formData.unitPrice}
                                                        onChange={handleChange}
                                                    />
                                                     
                                                        {errors.unitPrice && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.unitPrice}</div>}
                                                </div>
                                                <div className={styles['create-invoice-div-container']}>
                                                    <label className={styles['create-invoice-div-label']}>Condition</label>
                                                    <Select
                                                        className={styles['create-invoice-div-input-select']}
                                                        value={formData.condition}
                                                        onChange={handleConditionChange}
                                                        options={conditionOptions}
                                                        placeholder="Select Condition"
                                                    />
                                                    
                                                    {errors.condition && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.condition}</div>}
                                                    
                                                </div>
                                            </div>
                                        )} */}
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
                                    defaultValue={formData?.manufacturerName}
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
                                    defaultValue={formData?.manufacturerDescription}
                                    placeholder='Enter About Manufacturer'
                                    onChange={handleChange}
                                />
                                {errors.manufacturerDescription && <div className={styles['add-product-errors']} style={{ color: 'red' }}>{errors.manufacturerDescription}</div>}
                            </div>
                        </div>
                        {/* end the manufacturer details */}
                        <div className={styles['create-invoice-inner-form-section']}>
                            <div className={styles['create-invoice-product-image-section']}>
                                <div className={styles['create-invoice-upload-purchase']}>
                                    <div className={styles['create-invoice-form-heading']}>Upload Product Image</div>
                                    {/* <ImageAddUploader 
                                    image={medicineImages}
                                    setImage={setMedicineImages}
                                    /> */}
                                    <EditImageUploader
                                      image={medicineImages}
                                      setImage={setMedicineImages}
                                    />
                                </div>
                                {productType && productType.value === 'secondary_market' && (
                                    <>
                                        <div className={styles['create-invoice-upload-purchase']}>
                                            <div className={styles['create-invoice-form-heading']}>Upload Purchase Invoice</div>
                                            {/* <AddPdfUpload
                                             invoiceImage={invoiceImages}
                                             setInvoiceImage={setInvoiceImages}
                                             /> */}
                                             <EditPdfUpload
                                             invoiceImage={invoiceImages}
                                             setInvoiceImage={setInvoiceImages}

                                             />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles['craete-invoices-button']}>
                           
                            <button type="submit"
                             className={styles['create-invoices-submit']}
                             disabled={loading}
                             >
                                {/* Edit Product */}
                                {loading ? (
                    <div className={styles['loading-spinner']}></div> // Show spinner when loading
                ) : (
                    'Save'
                )}
                                </button>
                                <div className={styles['create-invoices-cancel']} 
                            onClick={handleCancel}>Cancel</div>
                        </div>
                    </form>

                </div>

            </div>
        </>
    );
};

export default EditSecondaryProduct;