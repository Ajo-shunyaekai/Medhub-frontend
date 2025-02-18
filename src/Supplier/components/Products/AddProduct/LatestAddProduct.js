import React, { useState, useEffect } from 'react';
import styles from './addproduct.module.css';
import Select, { components } from 'react-select';
import countryList from 'react-select-country-list';
import '../SharedComponents/Signup/signup.css'
import categoriesData from '../../../utils/Category'

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
    const [countries, setCountries] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedLevel3, setSelectedLevel3] = useState(null);

    // Convert Categories Data into react-select format
    const categoryOptions = categoriesData.subCategories.map((cat) => ({
        value: cat.name,
        label: cat.name,
    }));

    // Get Subcategories dynamically
    const getSubCategories = (categoryName) => {
        const category = categoriesData.subCategories.find(
            (cat) => cat.name === categoryName
        );
        return category
            ? category.anotherCategories.map((sub) => ({ value: sub, label: sub }))
            : [];
    };

    // Handle Category Change
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setSelectedSubCategory(null);
        setSelectedLevel3(null);
    };

    // Handle Subcategory Change
    const handleSubCategoryChange = (selectedOption) => {
        setSelectedSubCategory(selectedOption);
        setSelectedLevel3(null);
    };
    useEffect(() => {
        const countryOptions = countryList().getData();
        setCountries(countryOptions);
    }, []);
    const Options = [
        { value: 'new product', label: 'New Product' },
        { value: 'secondary product', label: 'Secondary Product' },

    ];
    const packagingOptions = [
        { value: 'bottle', label: 'Bottle' },
        { value: 'tube', label: 'Tube' },
        { value: 'jar', label: 'Jar' },
        { value: 'pump', label: 'Pump' },
        { value: 'blister pack', label: 'Blister Pack' },
        { value: 'strip', label: 'Strip' },
        { value: 'pouches', label: 'Pouches' },
        { value: 'soft case', label: 'Soft Case' },
        { value: 'hard case', label: 'Hard Case' },
        { value: 'backpack', label: 'Backpack' }
    ];
    const materialOptions = [
        { value: 'plastic', label: 'Plastic' },
        { value: 'glass', label: 'Glass' },
        { value: 'aluminum', label: 'Aluminum' },
        { value: 'cardboard', label: 'Cardboard' },
        { value: 'thermocol', label: 'Thermocol' },
    ];


    const stockOptions = [
        { value: 'in stock', label: 'In Stock' },
        { value: 'out of stock', label: 'Out of Stock' },
        { value: 'on demand', label: 'On Demand' },
    ];
    return (
        <div className={styles.container}>
            <span className={styles.heading}>Products</span>
            <form className={styles.form}>
                <div className={styles.section}>
                    <span className={styles.formHead}>General Information</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Name</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Product Name'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Type</label>
                            <Select className={styles.formSelect} options={Options} placeholder='Select Product Type' />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                                Product Category
                            </label>
                            <Select
                                className={styles.formSelect}
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                placeholder="Select Category"
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Sub Catgory</label>
                            <Select
                                className={styles.formSelect}
                                options={getSubCategories(selectedCategory.value)}
                                value={selectedSubCategory}
                                onChange={handleSubCategoryChange}
                                placeholder="Select Subcategory"
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Sub Category (Level 3)</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Type of Form'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>UPC (Universal Product Code)</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter UPC'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Part/Model Number</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Brand Name</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Brand Name'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Type/Form</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>


                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Size/Volumn</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Weight</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Packaging Type</label>
                            <Select className={styles.formSelect} options={packagingOptions} placeholder='Select Product Packaging Type' />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Packaging Material</label>
                            <Select className={styles.formSelect} options={materialOptions} placeholder='Select Product Packaging Material' />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Manufacturer Name</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Manufacturer Name'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Manufacturer Contry of Origin</label>
                            <Select
                                name='originCountry'
                                options={countries}
                                placeholder="Select Country of Origin"
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>About Manufacturer</label>
                            <textarea
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='About Manufacturer'

                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Description</label>
                            <textarea
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Product Description'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>
                </div>

                {/* Start the product inventory section */}
                <div className={styles.section}>
                    <span className={styles.formHead}>Inventory & Packaging</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>SKU</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter SKU'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Date of Manufacture</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Date of Manufacture'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Stock</label>
                            <Select className={styles.formSelect} options={stockOptions} placeholder='Select Stock' />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Stocked in Country</label>
                            <MultiSelectDropdown
                                options={countries}
                                placeholderButtonLabel="Select Countries"

                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Countries where Stock Trades</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Stock Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Stock Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>

                </div>

                <div className={styles.section}>
                    <span className={styles.formHead}>Product Inventory</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Cost Per Product</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Cost Per Product'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Est. Delivery Time</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Est. Delivery Time'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>

                </div>
                <div className={styles.documentContainer}>
                    <div className={styles.section}>
                        <span className={styles.formHead}>Compliances & Certification</span>
                        <div className={styles.formSection}>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Regulatory Compliance</label>
                                <input
                                    className={styles.formInput}
                                    type='text'
                                    name='totalQuantity'
                                    placeholder='Enter Total Quantity'
                                    autoComplete='off'
                                />
                                <span className={styles.error}></span>
                            </div>


                        </div>

                    </div>
                    <div className={styles.section}>
                        <span className={styles.formHead}>Storage & Handling</span>
                        <div className={styles.formSection}>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Storage Conditions</label>
                                <input
                                    className={styles.formInput}
                                    type='text'
                                    name='totalQuantity'
                                    placeholder='Enter Storage Conditions'
                                    autoComplete='off'
                                />
                                <span className={styles.error}></span>
                            </div>
                        </div>
                    </div>
                </div>



                <div className={styles.section}>
                    <span className={styles.formHead}>Health & Safety</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Safety Datasheet</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Health Hazard Rating</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Environmental Impact</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <span className={styles.formHead}>Additional Information</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Other Information</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>User Guidelines</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter User Guidelines'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Warranty</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Warranty'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;