import React, { useState, useEffect } from 'react';
import styles from '../style/addproduct.module.css';
import Select, { components } from 'react-select';
import countryList from 'react-select-country-list';
import ImageAddUploader from './ImageAppUploader';
import CloseIcon from '@mui/icons-material/Close';
import AddPdfUpload from './AddPdfUpload';
import { useParams } from 'react-router-dom';
import { postRequest } from '../api/Requests';


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

const AddProduct = () => {

    const { medicineId } = useParams()

    const [medicineDetails, setMedicineDetails] = useState()
    const [medId, setMedId] = useState(medicineId)

    
    const productTypeOptions = [
        { value: 'new_product', label: 'New Product' },
        // { value: 'secondary_market', label: 'Secondary Market' }
    ];

    const formTypes = [
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
        { value: 'generies', label: 'Generies' },
        { value: 'orignals', label: 'Orignals' },
        { value: 'biosimilars', label: 'Biosimilars' },
        { value: 'medicaldevices', label: 'Medical Devices' },
        { value: 'nutraceuticals', label: 'Nutraceuticals' }
    ];

    const [productType, setProductType] = useState({ value: 'new_product', label: 'New Product' });
   
    const [formSections, setFormSections] = useState([
        {
            strength: '',
            quantity: null,
            typeOfForm: null,
            productCategory: null,
            unitPrice: '',
            estDeliveryTime: '',
            condition: ''
        }
    ]);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const countryOptions = countryList().getData();
        setCountries(countryOptions);
    }, []);
    const handleConditionChange = (index, selected) => {
        const newFormSections = [...formSections];
        newFormSections[index].condition = selected;
        setFormSections(newFormSections);
    };
    const handleQuantityChange = (index, selected) => {
        const newFormSections = [...formSections];
        newFormSections[index].quantity = selected;
        setFormSections(newFormSections);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newFormSections = [...formSections];
        newFormSections[index][name] = value;
        setFormSections(newFormSections);
    };
    const addFormSection = () => {
        setFormSections([
            ...formSections,
            {
                strength: '',
                quantity: null,
                typeOfForm: null,
                totalPrice: '',
                unitPrice: '',
                shelfLife: '',
                estDeliveryTime: '',
                condition: ''
            }
        ]);
    };

    const removeFormSection = (index) => {
        if (formSections.length > 1) {
            const newFormSections = formSections.filter((_, i) => i !== index);
            setFormSections(newFormSections);
        }
    };

    const handleProductTypeChange = (selected) => {
        setProductType(selected);
    };

    useEffect(() => {
        // const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        // const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

        // if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        // navigate("/supplier/login");
        // return;
        // }
        
        const obj = {
            medicine_id : medId,
            // buyer_id    :supplierIdSessionStorage || supplierIdLocalStorage 
        }
        
        postRequest('buyer/medicine/medicine-details', obj, async (response) => {
            if (response.code === 200) {
                setMedicineDetails(response.result)
            } else {
               console.log('error in med details api');
            }
          })
    },[])

    return (
        <>
            <div className={styles['create-invoice-container']}>
                <div className={styles['create-invoice-heading']}>Edit Product</div>
                <div className={styles['create-invoice-section']}>
                    <form className={styles['craete-invoice-form']} >
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
                                    defaultValue={medicineDetails?.medicine_name}
                                    placeholder='Enter Product Name'
                                    autoComplete='off'
                                />
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
                                        />
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Country Available In</label>
                                        <MultiSelectDropdown
                                            options={countries}
                                            placeholderButtonLabel="Select Countries"
                                        />
                                    </div>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Minimum Purchase Unit</label>
                                        <input
                                            className={styles['create-invoice-div-input']}
                                            type='text'
                                            name='minPurchaseUnit'
                                            placeholder='Enter Min Purchase Unit'
                                            autoComplete='off'
                                        />
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
                                    defaultValue={medicineDetails?.composition}
                                    autoComplete='off'
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Strength</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='strength'
                                    defaultValue={medicineDetails?.strength}
                                    placeholder='Enter Strength'
                                    autoComplete='off'
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Type of form</label>
                                <Select
                                    className={styles['create-invoice-div-input-select']}
                                    options={formTypes}
                                    placeholder="Select Type of Form"
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Shelf Life</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='shelfLife'
                                    defaultValue={medicineDetails?.shelf_life}
                                    placeholder='Enter Shelf Life'
                                    autoComplete='off'
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Dossier Type</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='dossierType'
                                    defaultValue={medicineDetails?.dossier_type}
                                    placeholder='Enter Dossier Type'
                                    autoComplete='off'
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Dossier Status</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='dossierStatus'
                                    defaultValue={medicineDetails?.dossier_status}
                                    placeholder='Enter Dossier Status'
                                    autoComplete='off'
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Product Category</label>
                                <Select
                                    className={styles['create-invoice-div-input-select']}
                                    options={productCategoryOptions}
                                    placeholder="Select Product Category"
                                />
                            </div>
                            {productType && productType.value === 'new_product' && (
                                <>
                                    <div className={styles['create-invoice-div-container']}>
                                        <label className={styles['create-invoice-div-label']}>Total Quantity</label>
                                        <input
                                            className={styles['create-invoice-div-input']}
                                            type='text'
                                            name='gmpApprovals'
                                            defaultValue={medicineDetails?.total_quantity}
                                            placeholder='Enter Total Quantity'
                                            autoComplete='off'
                                        />
                                    </div>
                                </>
                            )}
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>GMP Approvals</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='gmpApprovals'
                                    defaultValue={medicineDetails?.gmp_approvals}
                                    placeholder='Enter GMP Approvals'
                                    autoComplete='off'
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Shipping Time</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='shippingTime'
                                    defaultValue={medicineDetails?.shipping_time}
                                    placeholder='Enter Shipping Time'
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Country of Origin</label>
                                <Select
                                    className={styles['create-invoice-div-input-select']}
                                    name='originCountry'
                                    options={countries}
                                    placeholder="Select Country of Origin"
                                    autoComplete='off'
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Registered In</label>
                                <MultiSelectDropdown
                                    options={countries}
                                    placeholderButtonLabel="Select Countries"
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Available For</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='availableFor'
                                    defaultValue={medicineDetails?.available_for}
                                    placeholder='Enter Available For'
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Tags</label>
                                <input
                                    className={styles['create-invoice-div-input']}
                                    type='text'
                                    name='availableFor'
                                    defaultValue={medicineDetails?.tags}
                                    placeholder='Enter Tags'
                                />
                            </div>
                            <div className={styles['create-invoice-div-container-description']}>
                                <label className={styles['create-invoice-div-label']}>Product Description</label>
                                <textarea
                                    className={styles['create-invoice-div-input']}
                                    name="description"
                                    defaultValue={medicineDetails?.description}
                                    rows="4"
                                    cols="50"
                                    placeholder='Enter Description'
                                />
                            </div>
                        </div>

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
                                                    />
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
                                                        name='quantity'
                                                        placeholder='Enter Quantity'
                                                        value={section.quantity}
                                                        onChange={(event) => handleInputChange(index, event)}
                                                    />
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
                        <div className={styles['create-invoice-inner-form-section']}>
                            <div className={styles['create-invoice-product-image-section']}>
                                <div className={styles['create-invoice-upload-purchase']}>
                                    <div className={styles['create-invoice-form-heading']}>Upload Product Image</div>
                                    <ImageAddUploader />
                                </div>
                                {productType && productType.value === 'secondary_market' && (
                                    <>
                                        <div className={styles['create-invoice-upload-purchase']}>
                                            <div className={styles['create-invoice-form-heading']}>Upload Purchase Invoice</div>
                                            <AddPdfUpload />
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>
                        <div className={styles['craete-invoices-button']}>
                            <div className={styles['create-invoices-cancel']}>Cancel</div>
                            <button type="submit" className={styles['create-invoices-submit']}>Edit Product</button>
                        </div>
                    </form>

                </div>

            </div>
        </>
    );
};

export default AddProduct;
