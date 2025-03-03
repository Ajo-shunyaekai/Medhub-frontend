import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Select, { components } from 'react-select';
import JoditEditor from 'jodit-react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFileText, FiX } from 'react-icons/fi';
import countryList from 'react-select-country-list';
import DatePicker from 'react-date-picker';
import CloseIcon from '@mui/icons-material/Close';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { Tooltip, TooltipProvider } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Chips } from 'primereact/chips';
import Information from '../../../assest/images/infomation.svg'
import './addproduct.css'
import styles from "./addproduct.module.css";
import categoryArrays from "../../../../utils/Category";
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
// Start Image container section
const useFileUpload = () => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prev) => {
            const totalFiles = [...prev, ...acceptedFiles];
            if (totalFiles.length > 4) {
                alert("You can only upload a maximum of 4 files.");
                return prev;
            }
            return totalFiles;
        });
    }, []);

    const removeFile = (index, event) => {
        if (event) event.stopPropagation();
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [],
            "application/msword": [],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
        },
        multiple: true,
    });

    return { files, getRootProps, getInputProps, isDragActive, removeFile };
};

const FileUploadSection = ({ label, fileUpload, tooltip, showLabel = true }) => {
    const tooltipId = `tooltip-${label.replace(/\s+/g, "-").toLowerCase()}`;
    const tooltipContent = tooltip || "Default tooltip text";
    return (
        <div className={styles.compliancesContainer}>
            {showLabel && <label className={styles.formLabel}>{label}</label>}
            <div className={styles.tooltipContainer}>
                <div {...fileUpload.getRootProps({ className: styles.uploadBox })}>
                    <input {...fileUpload.getInputProps()} />
                    <FiUploadCloud size={20} className={styles.uploadIcon} />
                    <p className={styles.uploadText}>
                        {fileUpload.isDragActive ? "Drop the files here..." : "Click here to Upload"}
                    </p>
                </div>
                {tooltip && (
                    <>
                        <span
                            className={styles.infoTooltip}
                            data-tooltip-id={tooltipId}
                            data-tooltip-content={tooltipContent} 
                        >
                            <img src={Information} className={styles.iconTooltip} alt="info" />
                        </span>
                        <Tooltip className={styles.tooltipSec} id={tooltipId} place="top" effect="solid">
            <div dangerouslySetInnerHTML={{ __html: tooltipContent }} />
        </Tooltip>
                    </>
                )}
            </div>
            {fileUpload.files.length > 0 && (
                <div className={styles.previewContainer}>
                    {fileUpload.files.map((file, index) => (
                        <div key={index} className={styles.filePreview}>
                            {file.type.startsWith("image/") ? (
                                <img src={URL.createObjectURL(file)} alt={file.name} className={styles.previewImage} />
                            ) : (
                                <FiFileText size={25} className={styles.fileIcon} />
                            )}
                            <p className={styles.fileName}>{file.name}</p>
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={(event) => fileUpload.removeFile(index, event)}
                                title="Remove file"
                            >
                                <FiX size={15} className={styles.removeIcon} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// End Image Container Section
const EditAddProduct = ({ placeholder }) => {
    const [productType, setProductType] = useState(null);
    const [value, setValue] = useState([]);
    const [checked, setChecked] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedLevel3Category, setSelectedLevel3Category] = useState(null);
    const [countries, setCountries] = useState([]);
    const [inventoryList, setInventoryList] = useState([{}]);
    const [stockList, setStockList] = useState([{ quantityType: 'Box', placeholder: 'Enter Box Quantity' }]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [otherMaterial, setOtherMaterial] = useState('');
    const [dermatologistTested, setDermatologistTested] = useState(null);
    const [pediatricianRecommended, setPediatricianRecommended] = useState(null);
    const productImageUpload = useFileUpload();
    const purchaseInvoiceUpload = useFileUpload();
    const regulatoryCompliance = useFileUpload();
    const userGuidelinesUpload = useFileUpload();
    const safetyDatasheetUpload = useFileUpload();
    const healthHazardUpload = useFileUpload();
    const environmentalImpactUpload = useFileUpload();
    const medicalSpecificationUpload = useFileUpload();
    const medicalPerformanceUpload = useFileUpload();
    const dermatologistUpload = useFileUpload();
    const pediatricianUpload = useFileUpload();
    const diagonsticSpecificationUpload = useFileUpload();
    const diagnosticPerformanceUpload = useFileUpload();
    const healthcarePerformanceUpload = useFileUpload();
    const healthCliamUpload = useFileUpload();
    const interoperabilityUpload = useFileUpload();
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const handleSelectChange = (option) => {
        setSelectedOption(option);
        if (option.value !== 'other') {
            setOtherMaterial('');
        }
    };

    // Start the checked container

    const handleCheckboxChange = (id) => {
        setChecked((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // End the checked container
    const editor = useRef(null);
    const [content, setContent] = useState('');

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || 'Enter Product Description'
    }),
        [placeholder]
    );



    useEffect(() => {
        const countryOptions = countryList().getData();
        setCountries(countryOptions);
    }, []);
    const categoryOptions = categoryArrays.map((cat) => ({
        value: cat.name,
        label: cat.name,
    }));

    const getCategorySchema = (category) => {
        if (!category) return null;
        return (
            categoryArrays.find((cat) => cat.name === category.label)?.schema || null
        );
    };

    const selectedSchema = getCategorySchema(selectedCategory);

    const getSubCategories = (categoryName) => {
        return (
            categoryArrays
                .find((cat) => cat.name === categoryName)
                ?.subCategories.map((sub) => ({
                    value: sub.name,
                    label: sub.name,
                })) || []
        );
    };

    const getLevel3Categories = (subCategoryName) => {
        const category = categoryArrays.find(
            (cat) => cat.name === selectedCategory?.value
        );
        return (
            category?.subCategories
                .find((sub) => sub.name === subCategoryName)
                ?.anotherCategories.map((level3) => ({
                    value: level3,
                    label: level3,
                })) || []
        );
    };
    // Start the add more functionality
    const handleAddStock = () => {
        setStockList([...stockList, { quantityType: 'Box', placeholder: 'Enter Box Quantity' }]);
    };
    const handleRemoveStock = (index) => {
        const updatedList = [...stockList];
        updatedList.splice(index, 1);
        setStockList(updatedList);
    };

    const handleQuantityTypeChange = (index, type) => {
        const updatedList = [...stockList];
        updatedList[index].quantityType = type;
        updatedList[index].placeholder = `Enter ${type} Quantity`;
        setStockList(updatedList);
    };

    const handleAddInventory = () => {
        setInventoryList([...inventoryList, {}]);
    };

    const handleRemoveInventory = (index) => {
        const updatedList = [...inventoryList];
        updatedList.splice(index, 1);
        setInventoryList(updatedList);
    };
    // End the add more functionality
      //   Start the Dropdown option
      const Options = [
        { value: 'new product', label: 'New Product' },
        { value: 'secondary product', label: 'Secondary Product' },

    ];

    const packagingUnits = [
        { value: 'kg', label: 'Kilogram (kg)' },
        { value: 'g', label: 'Gram (g)' },
        { value: 'mg', label: 'Milligram (mg)' },
        { value: 'µg', label: 'Microgram (µg)' },
        { value: 't', label: 'Tonne (t)' },
        { value: 'lb', label: 'Pound (lb)' },
        { value: 'oz', label: 'Ounce (oz)' },
        { value: 'st', label: 'Stone (st)' },
        { value: 'long_ton', label: 'Ton (long ton)' },
        { value: 'short_ton', label: 'Short ton' },
        { value: 'ct', label: 'Carat (ct)' },
        { value: 'gr', label: 'Grain (gr)' },
    ];
    const conditionOptions = [
        { value: 'new', label: 'New' },
        { value: 'used', label: 'Used' },
        { value: 'refurbished', label: 'Refurbished' }
    ]
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
        { value: 'other', label: 'Other' },
    ];
    const stockOptions = [
        { value: 'in stock', label: 'In Stock' },
        { value: 'out of stock', label: 'Out of Stock' },
        { value: 'on demand', label: 'On Demand' },
    ];
    const quantityOptions = [
        { value: '0-500', label: '0-500' },
        { value: '500-1000', label: '500-1000' },
        { value: '1000-2000', label: '1000-2000' },
        { value: '2000-5000', label: '2000-5000' },
        { value: '5000-8000', label: '5000-8000' },
        { value: '8000-12000', label: '8000-12000' },
    ];
    const stockQuantityOptions = [
        { value: 'America', label: 'America' },
        { value: 'India', label: 'India' },
        { value: 'United Arab Emirates', label: 'United Arab Emirates' },
        { value: 'United Kingdom', label: 'United Kingdom' },
    ]


    const pharmaOptions = [
        { value: "Category I", label: "Category I" },
        { value: "Category II", label: "Category II" },
        { value: "Category III", label: "Category III" },
    ];

    const skinhairOptions = [
        { value: "Category I", label: "Category I" },
        { value: "Category II", label: "Category II" },
        { value: "Category III", label: "Category III" },
    ];
    const vitalHealthOptions = [
        { value: "Category I", label: "Category I" },
        { value: "Category II", label: "Category II" },
        { value: "Category III", label: "Category III" },
    ];
    const moistureOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];
    const dermatologistOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];
    const pediatricianOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];
    const frameOptions = [
        { value: "Metal", label: "Metal" },
        { value: "Plastic", label: "Plastic" },
        { value: "Rimless", label: "Rimless" },
    ];
    const lensOptions = [
        { value: "Single Vision", label: "Single Vision" },
        { value: "Bifocal", label: "Bifocal" },
        { value: "Progressive", label: "Progressive" },
        { value: "Anti-Reflective", label: "Anti-Reflective" },
    ];
    const lensmaterialOptions = [
        { value: "Polycarbonate", label: "Polycarbonate" },
        { value: "Glass", label: "Glass" },
        { value: "Trivex", label: "Trivex" },
    ];
    const dairyfeeOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];
    //   End the Dropdown option
    return (
        <div className={styles.container}>
                <span className={styles.heading}>Edit Products</span>
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
                            <Select
                                className={styles.formSelect}
                                options={Options}
                                placeholder='Select Product Type'
                                onChange={(selectedOption) => setProductType(selectedOption?.value)}
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Category</label>
                            <Select
                                className={styles.formSelect}
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={(selectedOption) => {
                                    setSelectedCategory(selectedOption);
                                    setSelectedSubCategory(null);
                                    setSelectedLevel3Category(null);
                                }}
                                placeholder="Select Category"
                            />
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Sub Category</label>
                            <Select
                                className={styles.formSelect}
                                options={
                                    selectedCategory
                                        ? getSubCategories(selectedCategory.value)
                                        : []
                                }
                                value={selectedSubCategory}
                                onChange={(selectedOption) => {
                                    setSelectedSubCategory(selectedOption);
                                    setSelectedLevel3Category(null);
                                }}
                                placeholder="Select Subcategory"
                                isDisabled={!selectedCategory}
                            />
                        </div>  

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                                Product Sub Category (Level 3)
                            </label>
                            <Select
                                className={styles.formSelect}
                                options={
                                    selectedSubCategory
                                        ? getLevel3Categories(selectedSubCategory.value)
                                        : []
                                }
                                value={selectedLevel3Category}
                                onChange={setSelectedLevel3Category}
                                placeholder="Select Level 3 Category"
                                isDisabled={!selectedSubCategory}
                            />
                        </div>

                        {productType === 'secondary product' && (
                            <>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Purchase On</label>

                                    <DatePicker
                                        className={styles.formDate}
                                        clearIcon={null}
                                        format="dd/MM/yyyy"
                                        placeholder='dd/MM/yyyy'
                                    />

                                </div>

                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Condition</label>
                                    <Select className={styles.formSelect} options={conditionOptions}
                                        placeholder="Select Condition" />
                                </div>

                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Country Available In</label>
                                    <MultiSelectDropdown
                                        options={countries}
                                        placeholderButtonLabel="Select Countries"

                                    />
                                </div>

                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Minimum Purchase Unit</label>
                                    <input className={styles.formInput} type='text' placeholder='Enter Minimum Purchase Unit' autoComplete='off' />
                                </div>
                            </>
                        )}
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
                            <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type='text'
                                    name='totalQuantity'
                                    placeholder='Enter Dossier Status'
                                    autoComplete='off'
                                />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="product-type"
                                >
                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                </span>
                                <Tooltip className={styles.tooltipSec} id="product-type">
                                    The type of product (e.g., tablet, liquid, cream, ointment, Surgical, Needle Type, Syringe,  Type of monitor,<br /> systems,
                                    devices, mobility or platforms, wheelchair, walker, cane, crutches, grab bar, scooter etc).
                                </Tooltip>
                            </div>
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Total Quantity</label>
                            <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type='text'
                                    name='totalQuantity'
                                    placeholder='Enter Dossier Status'
                                    autoComplete='off'
                                />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="sku-tooltip"
                                    data-tooltip-content="Add number of tablets in a strip, bottle, or box or number of bottles in a pack"
                                >
                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                </span>
                                <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                            </div>
                            <span className={styles.error}></span>
                        </div>


                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Size/Volumn</label>
                            <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type='text'
                                    name='totalQuantity'
                                    placeholder='Enter Dossier Status'
                                    autoComplete='off'
                                />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="product-volumn"

                                >
                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                </span>
                                <Tooltip className={styles.tooltipSec} id="product-volumn">
                                    The size or volume of the product (e.g., 50 mL, 100 g, drip chamber )
                                    (e.g., macro, micro),<br /> Length of the needle (e.g., 19 mm, 26 mm )  tape width, adhesive strip size etc.
                                </Tooltip>
                            </div>
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Weight</label>
                            <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type='text'
                                    name='totalQuantity'
                                    placeholder='Enter Dossier Status'
                                    autoComplete='off'
                                />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="sku-tooltip"
                                    data-tooltip-content="in (g, kg, lbs, l, ml, oz, gal, t)"
                                >
                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                </span>
                                <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                            </div>
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Units</label>
                            <Select className={styles.formSelect} options={packagingUnits} placeholder='Select Units' />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Packaging Type</label>
                            <div className={styles.tooltipContainer}>
                                <Select className={styles.formSelect} options={packagingOptions} placeholder='Select Product Packaging Type' />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="packaging-type"

                                >
                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                </span>
                                <Tooltip className={styles.tooltipSec} id="packaging-type">
                                    The type of product packaging (e.g., bottle, tube, jar, pump, blister<br /> pack, strip, pouches, soft case, hard case, backpack, case ).
                                </Tooltip>
                            </div>
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Packaging Material</label>
                            <div className={styles.tooltipContainer}>
                                <Select
                                    className={styles.formSelect}
                                    options={materialOptions}
                                    placeholder="Select Product Packaging Material"
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="sku-tooltip"
                                    data-tooltip-content="The material used for packaging (e.g., plastic, glass, aluminum, cardboard, thermocol etc)"
                                >
                                    <img src={Information} className={styles.iconTooltip} alt="information" />
                                </span>
                                <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                            </div>

                            {/* Show text field when "Other" is selected */}
                            {selectedOption?.value === 'other' && (
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    placeholder="Enter Packaging Material"
                                    value={otherMaterial}
                                    onChange={(e) => setOtherMaterial(e.target.value)}
                                />
                            )}

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
                        <div className={styles.descriptionContainer}>
                            <label className={styles.formLabel}>Product Description</label>
                            <JoditEditor
                                ref={editor}
                                value={content}
                                config={config}
                                tabIndex={1}
                                onBlur={newContent => setContent(newContent)}
                                onChange={newContent => { }}
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>
                </div>

                {/* Start the Inventory & Packaging */}
                <div className={styles.section}>
                    <span className={styles.formHead}>Inventory & Packaging</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>SKU</label>
                            <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type='text'
                                    name='sku'
                                    placeholder='Enter SKU'
                                    autoComplete='off'
                                />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="sku-tooltip"
                                    data-tooltip-content="Stock-keeping unit for inventory management"
                                >
                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                </span>
                                <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                            </div>
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Date of Manufacture</label>
                            <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type='text'
                                    name='totalQuantity'
                                    placeholder='Enter Date of Manufacture'
                                    autoComplete='off'
                                />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="sku-tooltip"
                                    data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                                >
                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                </span>
                                <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                            </div>
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Stock</label>
                            <div className={styles.tooltipContainer}>
                                <Select className={styles.formSelect} options={stockOptions} placeholder='Select Stock' />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="sku-tooltip"
                                    data-tooltip-content="If the product is in stock or out of stock or on demand"
                                >
                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                </span>
                                <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                            </div>
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
                    </div>

                    <div className={styles.formStockContainer}>
                        <div className={styles.formHeadSection}>
                            <span className={styles.formHead}>Product Inventory</span>
                            <span className={styles.formAddButton} onClick={handleAddStock}>Add More</span>
                        </div>
                        {stockList.map((stock, index) => (
                            <div key={index} className={styles.formSection}>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Countries where Stock Trades</label>
                                    <Select
                                        className={styles.formSelect}
                                        options={stockQuantityOptions}
                                        placeholder="Select Countries where Stock Trades"
                                    />
                                    <span className={styles.error}></span>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Stock Quantity</label>
                                    <div className={styles.productQuantityContainer}>
                                        <div className={styles.quantitySection}>
                                            <input
                                                className={styles.quantityInput}
                                                name='totalQuantity'
                                                placeholder={stock.placeholder}
                                                autoComplete='off'
                                            />
                                            <button className={`${styles.quantityButton} ${styles.selected}`}>
                                                {stock.quantityType}
                                            </button>

                                        </div>

                                        <div className={styles.radioForm}>
                                            {['Box', 'Strip', 'Pack'].map((type) => (
                                                <label key={type}>
                                                    <input
                                                        className={styles.radioInput}
                                                        type="radio"
                                                        value={type}
                                                        checked={stock.quantityType === type}
                                                        onChange={() => handleQuantityTypeChange(index, type)}
                                                    />
                                                    <span className={styles.radioText}>{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <span className={styles.error}></span>
                                </div>

                                {stockList.length > 1 && (
                                    <div className={styles.formCloseSection} onClick={() => handleRemoveStock(index)}>
                                        <span className={styles.formclose}><CloseIcon className={styles.icon} /></span>
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                </div>

                {/* End the Inventory & Packaging */}


                {/* Start the product Inventory */}
                <div className={styles.section}>
                    <div className={styles.formHeadSection}>
                        <span className={styles.formHead}>Product Inventory</span>
                        <span className={styles.formAddButton} onClick={handleAddInventory}>Add More</span>
                    </div>
                    {inventoryList.map((_, index) => (
                        <div key={index} className={styles.formSection}>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Quantity</label>
                                <Select
                                    className={styles.formSelect}
                                    options={quantityOptions}
                                    placeholder="Select Quantity"

                                />
                                <span className={styles.error}></span>
                            </div>

                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Cost Per Product</label>
                                <div className={styles.tooltipContainer}>
                                    <input className={styles.formInput} type="text" placeholder="Enter Cost Per Product" autoComplete="off" />
                                    <span
                                        className={styles.infoTooltip}
                                        data-tooltip-id="sku-tooltip"
                                        data-tooltip-content="The cost of the medication per unit (MRP) in Dollar"
                                    >
                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                    </span>
                                    <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                                </div>
                                <span className={styles.error}></span>
                            </div>

                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Est. Delivery Time</label>
                                <input className={styles.formInput} type="text" placeholder="Enter Est. Delivery Time" autoComplete="off" />
                                <span className={styles.error}></span>
                            </div>

                            {inventoryList.length > 1 && (
                                <div className={styles.formCloseSection} onClick={() => handleRemoveInventory(index)}>
                                    <span className={styles.formclose}><CloseIcon className={styles.icon} /></span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* End the product inventory */}


                {/* Start the Compliances and certificate */}
                <div className={styles.documentContainer}>
                    <div className={styles.sectionCompliances}>
                        <span className={styles.formHead}>Upload Documents</span>
                        <div className={styles.formInnerSection}>
                            <FileUploadSection label="Product Image" fileUpload={productImageUpload} tooltip={false} />
                            {productType === 'secondary product' && (
                                <FileUploadSection label="Purchase Invoice" fileUpload={purchaseInvoiceUpload} tooltip={false} />
                            )}
                        </div>
                    </div>
                    <div className={styles.sectionCompliances}>
                        <span className={styles.formHead}>Storage & Handling</span>
                        <div className={styles.compliancesContainer}>
                            <label className={styles.formLabel}>Storage Conditions</label>
                            <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type='text'
                                    name='totalQuantity'
                                    placeholder='Enter Storage Conditions'
                                    autoComplete='off'
                                />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="sku-tooltip"
                                    data-tooltip-content="Recommended storage (e.g., store in a cool, dry place)"
                                >
                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                </span>
                                <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                            </div>
                            <span className={styles.error}></span>
                        </div>
                    </div>
                    <div className={styles.sectionCompliances}>
                        <span className={styles.formHead}>Compliances & Certification</span>
                        <FileUploadSection
                            label="Regulatory Compliance"
                            fileUpload={regulatoryCompliance}
                            tooltip={
                                "Compliance with industry standards for healthcare-related tools (e.g. HIPAA, GMP, WDA, ASTM,  \n" +
                                "FDA, CE, ISO, WHO etc) HIPAA applies to healthcare-related tools, while MHRA governs GMP in \n" +
                                " the UK. The European Medicines Agency (EMA) governs GMP in Europe."
                            }
                        />
                    </div>

                </div>
                {/* End the compliances and certificate */}


                {/* Start the Medical Equipment And Devices */}
                {selectedSchema === "MedicalEquipmentAndDevices" && (
                    <div className={styles.section}>
                        <span className={styles.formHead}>Technical Details</span>
                        <div className={styles.formSection}>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Interoperability</label>
                                <div className={styles.tooltipContainer}>
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        name="interoperability"
                                        placeholder="Enter Interoperability"
                                        autoComplete="off"
                                    />
                                    <span
                                        className={styles.infoTooltip}
                                        data-tooltip-id="medical-tooltip"
                                        data-tooltip-content="Adheres to HL7/FHIR standards for healthcare data exchange."
                                    >
                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                    </span>
                                    <Tooltip className={styles.tooltipSec} id="medical-tooltip" />
                                </div>
                            </div>

                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Laser Type</label>
                                <div className={styles.tooltipContainer}>
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        name="totalQuantity"
                                        placeholder="Enter Laser Type"
                                        autoComplete="off"
                                    />
                                    <span
                                        className={styles.infoTooltip}
                                        data-tooltip-id="medical-tooltip"
                                        data-tooltip-content="Type of laser (e.g., CO2, diode, Nd:YAG, Er:YAG)"
                                    >
                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                    </span>
                                    <Tooltip className={styles.tooltipSec} id="medical-tooltip" />
                                </div>
                                <span className={styles.error}></span>
                            </div>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Cooling System</label>
                                <div className={styles.tooltipContainer}>
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        name="totalQuantity"
                                        placeholder="Enter Cooling System"
                                        autoComplete="off"
                                    />
                                    <span
                                        className={styles.infoTooltip}
                                        data-tooltip-id="medical-tooltip"
                                        data-tooltip-content="Type of cooling used (e.g., air, contact, cryogenic cooling)."
                                    >
                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                    </span>
                                    <Tooltip className={styles.tooltipSec} id="medical-tooltip" />
                                </div>
                                <span className={styles.error}></span>
                            </div>

                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Spot Size</label>
                                <div className={styles.tooltipContainer}>
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        name="totalQuantity"
                                        placeholder="Enter Spot Size"
                                        autoComplete="off"
                                    />
                                    <span
                                        className={styles.infoTooltip}
                                        data-tooltip-id="medical-tooltip"
                                        data-tooltip-content="Diameter of the laser spot on the skin (in mm or cm)"
                                    >
                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                    </span>
                                    <Tooltip className={styles.tooltipSec} id="medical-tooltip" />
                                </div>
                                <span className={styles.error}></span>
                            </div>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Diagnostic Functions</label>
                                <div className={styles.tooltipContainer}>
                                    <textarea
                                        className={styles.formInput}
                                        name="diagnosticFunctions"
                                        placeholder="Enter Diagnostic Functions"
                                        rows="2"
                                    />
                                    <span
                                        className={styles.infoTooltip}
                                        data-tooltip-id="medical-tooltip"
                                        data-tooltip-content="Specific diagnostic tests or functions that the tool performs"
                                    >
                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                    </span>
                                    <Tooltip className={styles.tooltipSec} id="medical-tooltip" />
                                </div>
                            </div>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>
                                    Performance Testing Report
                                </label>
                                <div className={styles.tooltipContainer}>
                                    <textarea
                                        className={styles.formInput}
                                        name="diagnosticFunctions"
                                        placeholder="Enter Diagnostic Functions"
                                        rows="2"
                                    />
                                    <span
                                        className={styles.infoTooltip}
                                        data-tooltip-id="testing-tooltip"
                                        
                                    >
                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                    </span>
                                    <Tooltip className={styles.tooltipSec} id="testing-tooltip">
                                    Results from any internal or external product testing (e.g., nebulizer <br/> output, CPAP pressure and airflow testing).
                                        </Tooltip>
                                </div>
                                <FileUploadSection label="" fileUpload={medicalPerformanceUpload} tooltip={false} showLabel={false} />
                                <span className={styles.error}></span>
                            </div>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>Specification</label>
                                <div className={styles.tooltipContainer}>
                                    <textarea
                                        className={styles.formInput}
                                        name="diagnosticFunctions"
                                        placeholder="Enter Diagnostic Functions"
                                        rows="2"
                                    />
                                    <span
                                        className={styles.infoTooltip}
                                        data-tooltip-id="medical-tooltip"
                                        data-tooltip-content="Technical Specification of the tool  (e.g., hardware, software, network diagnostics, etc.)"
                                    >
                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                    </span>
                                    <Tooltip className={styles.tooltipSec} id="medical-tooltip" />
                                </div>
                                <FileUploadSection label="" fileUpload={medicalSpecificationUpload} tooltip={false} showLabel={false} />
                                <span className={styles.error}></span>
                            </div>
                        </div>
                    </div>
                )}
                {/* End the MedicalEquipmentAndDevices */}

                {/* Start the Pharmaceuticals */}
                {selectedSchema === "Pharmaceuticals" && (
                    <>
                        <div className={styles.section}>
                            <span className={styles.formHead}>Product Identification</span>
                            <div className={styles.formSection}>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Generic Name</label>
                                    <div className={styles.tooltipContainer}>
                                        <input
                                            className={styles.formInput}
                                            type="text"
                                            name="genericName"
                                            placeholder="Enter Generic Name"
                                            autoComplete="off"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="pharma-tooltip"
                                            data-tooltip-content="The generic name of the medication (e.g., Paracetamol, Metformin, Ibuprofene)"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="pharma-tooltip" />
                                    </div>
                                </div>

                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Drug Class</label>
                                    <div className={styles.tooltipContainer}>
                                        <input
                                            className={styles.formInput}
                                            type="text"
                                            name="drugClass"
                                            placeholder="Enter Drug Class"
                                            autoComplete="off"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="pharma-tooltip"
                                            data-tooltip-content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="pharma-tooltip" />
                                    </div>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Strength</label>
                                    <div className={styles.tooltipContainer}>
                                        <input
                                            className={styles.formInput}
                                            type="text"
                                            name="totalQuantity"
                                            placeholder="Enter Strength"
                                            autoComplete="off"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="strength-tooltip"
                                            
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="strength-tooltip">
                                        The strength or concentration of the medication (e.g., <br/> 500 mg, 10 mg/mL,Standard or high-strength).
                                            </Tooltip>
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>
                                        OTC Classification
                                    </label>
                                    <div className={styles.tooltipContainer}>
                                        <Select
                                            className={styles.formSelect}
                                            options={pharmaOptions}
                                            placeholder="Select OTC Classification"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="classification-tooltip"
                                            
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="classification-tooltip">
                                        Classification of the OTC drug by health authorities (e.g., <br/> approved for general public use, behind-the-counter).
                                            </Tooltip>
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>
                                        Composition / Ingredients
                                    </label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="pharma-tooltip"
                                            data-tooltip-content="Description of the active ingredients and components of the vaccine."
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="pharma-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Formulation</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="pharma-tooltip"
                                            data-tooltip-content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="pharma-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div>

                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Purpose</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="purpose-tooltip"
                                            
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="purpose-tooltip">
                                        Purpose (e.g., COVID-19 detection, blood glucose monitoring, cholesterol level check,Pain relief, <br/> Prevention of infection.,Cooling and soothing.,Moisturizing and healing, procedure or use case of<br/> tool, Relieves symptoms, promotes healing, or prevents recurrence.)
                                            </Tooltip>
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>
                                        Drug Administration Route
                                    </label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="administration-tooltip"
                                            
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="administration-tooltip">
                                        Drugs can be introduced into the body by many routes, such as enteric (oral, peroral, rectal), <br/> parenteral (intravascular, intramuscular, subcutaneous, and inhalation<br/> administration) or topical (skin and mucosal membranes)
                                            </Tooltip>
                                    </div>
                                    <span className={styles.error}></span>
                                </div>

                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>
                                        Controlled Substance
                                    </label>
                                    <div className={styles.tooltipContainer}>
                                        <span className={styles.formCheckboxSection}>
                                            <input
                                                type="checkbox"
                                                id="controlled-substance"
                                                checked={checked["controlled-substance"] || false}
                                                onChange={() => handleCheckboxChange("controlled-substance")}

                                            />
                                            <label
                                                className={styles.checkText}
                                                htmlFor="controlled-substance"
                                            >
                                                Whether the drug is a controlled substance
                                            </label>
                                        </span>
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="controlled-tooltip"
                                            
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="controlled-tooltip">
                                        Whether the drug is a controlled substance (e.g., some OTC drugs are restricted,<br/> some are only available behind the counter or on prescription).
                                            </Tooltip>
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                            </div>

                            <div className={styles.innerProductContainer}>
                                <div className={styles.innerSection}>
                                    <span className={styles.formHead}>Storage & Handling</span>
                                    <div className={styles.productInnerContainer}>
                                        <label className={styles.formLabel}>
                                            Shelf Life / Expiry
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="totalQuantity"
                                                placeholder="Enter Shelf Life / Expiry"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="pharma-tooltip"
                                                data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="pharma-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>

                                <div className={styles.innerMonitorSection}>
                                    <span className={styles.formHead}>
                                        Monitoring and Adherence
                                    </span>
                                    <div className={styles.formInnerSection}>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Side Effects and Warnings
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <textarea
                                                    className={styles.formInput}
                                                    name="diagnosticFunctions"
                                                    placeholder="Enter Diagnostic Functions"
                                                    rows="2"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="warning-tooltip"
                                                    data-tooltip-content=""
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="warning-tooltip">
                                                Common side effects associated with the medication. Known<br/> interactions with other drugs or food (eg. Alcohol)
                                                    </Tooltip>
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>Allergens</label>
                                            <div className={styles.tooltipContainer}>
                                                <textarea
                                                    className={styles.formInput}
                                                    name="diagnosticFunctions"
                                                    placeholder="Enter Diagnostic Functions"
                                                    rows="2"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="pharma-tooltip"
                                                    data-tooltip-content="Common allergens in the product (e.g., parabens, sulfates, gluten etc)."
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="pharma-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                )}

                {/* End the Pharmaceuticals */}

                {/* Start the Skin, Hair and Cosmetic Supplies */}
                {selectedSchema === "SkinHairCosmeticSupplies" && (
                    <>
                        <div className={styles.section}>
                            <span className={styles.formHead}>Product Identification</span>
                            <div className={styles.formSection}>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>SPF</label>
                                    <div className={styles.tooltipContainer}>
                                        <input
                                            className={styles.formInput}
                                            type="text"
                                            name="drugClass"
                                            placeholder="Enter SPF"
                                            autoComplete="off"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="If the product is a sunscreen, the SPF (Sun Protection Factor) rating"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Strength</label>
                                    <div className={styles.tooltipContainer}>
                                        <input
                                            className={styles.formInput}
                                            type="text"
                                            name="totalQuantity"
                                            placeholder="Enter Strength"
                                            autoComplete="off"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-strength-tooltip"
                                            
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-strength-tooltip">
                                        The strength or concentration of the medication (e.g., <br/> 500 mg, 10 mg/mL,Standard or high-strength).
                                            </Tooltip>
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Elasticity</label>
                                    <div className={styles.tooltipContainer}>
                                        <input
                                            className={styles.formInput}
                                            type="text"
                                            name="totalQuantity"
                                            placeholder="Enter Elasticity"
                                            autoComplete="off"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="Stretch for tapes"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Adhesiveness</label>
                                    <div className={styles.tooltipContainer}>
                                        <input
                                            className={styles.formInput}
                                            type="text"
                                            name="totalQuantity"
                                            placeholder="Enter Adhesiveness"
                                            autoComplete="off"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="Adhesive or non-adhesive."
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Thickness</label>
                                    <div className={styles.tooltipContainer}>
                                        <input
                                            className={styles.formInput}
                                            type="text"
                                            name="totalQuantity"
                                            placeholder="Enter Thickness"
                                            autoComplete="off"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="The thickness of the Item (e.g., in mil or gauge)."
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>OTC Classification</label>
                                    <div className={styles.tooltipContainer}>
                                        <Select
                                            className={styles.formSelect}
                                            options={skinhairOptions}
                                            placeholder="Select OTC Classification"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-otc-tooltip"
                                           
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-otc-tooltip">
                                        Classification of the OTC drug by health authorities (e.g., <br/> approved for general public use, behind-the-counter).
                                            </Tooltip>
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Formulation</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div >

                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Fragrance</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="Whether the product contains fragrance or is fragrance-free."
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                </div >
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>
                                        Composition / Ingredients
                                    </label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="Description of the active ingredients and components of the vaccine."
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div >

                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Purpose</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div >

                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Target Condition</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="The hair, scalp or skin condition the product is formulated to address "
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div >
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>
                                        Drug Administration Route
                                    </label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="route-tooltip"
                                            
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="route-tooltip">

                                        Drugs can be introduced into the body by many routes, such as enteric (oral, peroral,<br/> rectal), parenteral (intravascular, intramuscular, subcutaneous, and inhalation<br/> administration) or topical (skin and mucosal membranes)
                                            </Tooltip>
                                    </div>
                                    <span className={styles.error}></span>
                                </div >

                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Drug Class</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div >
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Concentration</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="consentration-tooltip"
                                            
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="consentration-tooltip">
                                        Concentration if it’s a solution (e.g., 0.1 M, 5% w/v) ,Alcohol-based disinfectants are <br/> typically 70-90% concentration for optimal antimicrobial efficacy.<br/> Oxygen concentration level provided by the device (e.g., 95%)
                                            </Tooltip>
                                    </div>
                                    <span className={styles.error}></span>
                                </div >
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Purpose</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div >
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Moisturizers</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="such as aloe vera, glycerin, or Vitamin E to reduce skin irritation from frequent use"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div >
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Filler Type</label>
                                    <div className={styles.tooltipContainer}>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="Hyaluronic acid, Calcium hydroxyapatite"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div >
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Vegan</label>
                                    <div className={styles.tooltipContainer}>
                                        <span className={styles.formCheckboxSection}>
                                            <input
                                                type="checkbox"
                                                id="cosmetic-vegan"
                                                checked={checked["cosmetic-vegan"] || false}
                                                onChange={() => handleCheckboxChange("cosmetic-vegan")}

                                            />

                                            <label
                                                className={styles.checkText}
                                                htmlFor="cosmetic-vegan"
                                            >
                                                Whether the product is vegan (i.e., no animal-derived
                                                ingredients).
                                            </label>
                                        </span>
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="Description of the active and/or inactive ingredients and components"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div >
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>Cruelty-Free</label>
                                    <div className={styles.tooltipContainer}>
                                        <span className={styles.formCheckboxSection}>
                                            <input
                                                type="checkbox"
                                                id="cosmetic-cruelty-free"
                                                checked={checked["cosmetic-cruelty-free"] || false}
                                                onChange={() => handleCheckboxChange("cosmetic-cruelty-free")}

                                            />

                                            <label
                                                className={styles.checkText}
                                                htmlFor="cosmetic-cruelty-free"
                                            >
                                                Whether the product is tested on animals or is
                                                cruelty-free
                                            </label>
                                        </span>
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="skin-tooltip"
                                            data-tooltip-content="Whether the product is tested on animals or is cruelty-free"
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                    </div>
                                    <span className={styles.error}></span>
                                </div >
                                <div className={styles.productContainer}>
                                    <label className={styles.formLabel}>
                                        Controlled Substance
                                    </label>
                                    <div className={styles.tooltipContainer}>
                                        <span className={styles.formCheckboxSection}>
                                            <input
                                                type="checkbox"
                                                id="cosmetic-controlled-substance"
                                                checked={checked["cosmetic-controlled-substance"] || false}
                                                onChange={() => handleCheckboxChange("cosmetic-controlled-substance")}

                                            />
                                            <label
                                                className={styles.checkText}
                                                htmlFor="cosmetic-controlled-substance"
                                            >
                                                Whether the drug is a controlled substance
                                            </label>
                                        </span>
                                        <span
                                            className={styles.infoTooltip}
                                            data-tooltip-id="substance-tooltip"
                                            
                                        >
                                            <img src={Information} className={styles.iconTooltip} alt='information' />

                                        </span>
                                        <Tooltip className={styles.tooltipSec} id="substance-tooltip">
                                        Whether the drug is a controlled substance (e.g., some OTC drugs<br/> are restricted, some are only available behind the counter or on prescription).
                                            </Tooltip>
                                    </div>
                                    <span className={styles.error}></span>
                                </div >
                            </div >

                            <div className={styles.innerProductContainer}>
                                <div className={styles.innerMonitorSection}>
                                    <span className={styles.formHead}>
                                        Compliance & Certification
                                    </span>
                                    <div className={styles.formInnerSection}>
                                        {/* Dermatologist Tested */}
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>Dermatologist Tested</label>
                                            <div className={styles.tooltipContainer}>
                                                <Select
                                                    className={styles.formSelect}
                                                    options={dermatologistOptions}
                                                    placeholder="Select OTC Classification"
                                                    onChange={(selectedOption) => setDermatologistTested(selectedOption.value)}
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="skin-tooltip"
                                                    data-tooltip-content="Whether the product has been dermatologist-tested for sensitivity."
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt="information" />
                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                            </div>
                                            {dermatologistTested === "Yes" && (
                                                <>
                                                    <FileUploadSection
                                                        label=""
                                                        fileUpload={dermatologistUpload}
                                                        tooltip={false}
                                                        showLabel={false}
                                                    />
                                                </>

                                            )}
                                            <span className={styles.error}></span>
                                        </div>

                                        {/* Pediatrician Recommended */}
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>Pediatrician Recommended</label>
                                            <div className={styles.tooltipContainer}>
                                                <Select
                                                    className={styles.formSelect}
                                                    options={pediatricianOptions}
                                                    placeholder="Select OTC Classification"
                                                    onChange={(selectedOption) => setPediatricianRecommended(selectedOption.value)}
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="pediatrician-tooltip"
                                                    data-tooltip-content="Whether the product has been recommended or endorsed by pediatricians."
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt="information" />
                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="pediatrician-tooltip" />
                                            </div>
                                            {pediatricianRecommended === "Yes" && (
                                                <>
                                                    <FileUploadSection
                                                        label=""
                                                        fileUpload={pediatricianUpload}
                                                        tooltip={false}
                                                        showLabel={false}
                                                    />
                                                </>
                                            )}
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>
                                </div >
                                <div className={styles.innerMonitorSection}>
                                    <span className={styles.formHead}>
                                        Monitoring and Adherence
                                    </span>
                                    <div className={styles.formInnerSection}>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Side Effects and Warnings
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <textarea
                                                    className={styles.formInput}
                                                    name="diagnosticFunctions"
                                                    placeholder="Enter Diagnostic Functions"
                                                    rows="2"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="effects-tooltip"
                                                   
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="effects-tooltip">
                                                Common side effects associated with the medication. Known interactions <br/> with other drugs or food (eg. Alcohol)
                                                    </Tooltip>
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>Allergens</label>
                                            <div className={styles.tooltipContainer}>
                                                <textarea
                                                    className={styles.formInput}
                                                    name="diagnosticFunctions"
                                                    placeholder="Enter Diagnostic Functions"
                                                    rows="2"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="skin-tooltip"
                                                    data-tooltip-content="Common allergens in the product (e.g., parabens, sulfates, gluten etc)."
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div >
                                </div >
                                <div className={styles.innerSection}>
                                    <span className={styles.formHead}>Storage & Handling</span>
                                    <div className={styles.productInnerContainer}>
                                        <label className={styles.formLabel}>
                                            Shelf Life / Expiry
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="totalQuantity"
                                                placeholder="Enter Shelf Life / Expiry"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="skin-tooltip"
                                                data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="skin-tooltip" />
                                        </div>
                                    </div>
                                    <span className={styles.error}></span>
                                </div>
                            </div >
                        </div >
                    </>
                )}

                {/* End the Skin, Hair and Cosmetic Supplies */}

                {/* Start the Vital Health and Wellness */}
                {
                    selectedSchema === "VitalHealthAndWellness" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Generic Name</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="drugClass"
                                                placeholder="Enter Generic Name"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="The generic name of the medication (e.g., Paracetamol, Metformin, Ibuprofene)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Strength</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="totalQuantity"
                                                placeholder="Enter Strength"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-strength-tooltip"
                                                
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-strength-tooltip">
                                            The strength or concentration of the medication (e.g., 500 mg, 10 <br/> mg/mL,Standard or high-strength).
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>OTC Classification</label>
                                        <div className={styles.tooltipContainer}>
                                            <Select
                                                className={styles.formSelect}
                                                options={vitalHealthOptions}
                                                placeholder="Select OTC Classification"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-OTC-tooltip"
                                               
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-OTC-tooltip">
                                            Classification of the OTC drug by health authorities (e.g., <br/> approved for general public use, behind-the-counter).
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Health Benefit</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Info about the health benefits (e.g., “Boosts immunity”, “Supports joint health”)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Composition / Ingredients
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Description of the active ingredients and components of the vaccine."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Formulation</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Purpose</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-purpose-tooltip"
                                               
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-purpose-tooltip">
                                            Purpose (e.g., COVID-19 detection, blood glucose monitoring, cholesterol level check,Pain relief, <br/>Prevention of infection.,Cooling and soothing.,Moisturizing and healing, procedure<br/> or use case of tool, Relieves symptoms, promotes healing, or prevents recurrence.)
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Drug Administration Route
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-drugs-tooltip"
                                                
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-drugs-tooltip">
                                            Drugs can be introduced into the body by many routes, such as enteric (oral, peroral, rectal), parenteral <br/>(intravascular, intramuscular, subcutaneous, and inhalation administration) or topical (skin and mucosal membranes)
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Drug Class</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Additives & Sweeteners
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-sweeteners-tooltip"
                                                
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-sweeteners-tooltip">
                                            Some proteins contain artificial sweeteners (e.g., sucralose, aspartame),<br/> while others use natural sweeteners (e.g., stevia, monk fruit).
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Controlled Substance
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <span className={styles.formCheckboxSection}>
                                                <input
                                                    type="checkbox"
                                                    id="wellness-controlled-substance"
                                                    checked={checked["wellness-controlled-substance"] || false}
                                                    onChange={() => handleCheckboxChange("wellness-controlled-substance")}

                                                />

                                                <label
                                                    className={styles.checkText}
                                                    htmlFor="wellness-controlled-substance"
                                                >
                                                    Whether the drug is a controlled substance
                                                </label>
                                            </span>
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-substances-tooltip"
                            
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-substances-tooltip">
                                            Whether the drug is a controlled substance (e.g., some OTC drugs are <br/> restricted, some are only available behind the counter or on prescription).
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Vegan</label>
                                        <div className={styles.tooltipContainer}>
                                            <span className={styles.formCheckboxSection}>
                                                <input
                                                    type="checkbox"
                                                    id="wellness-vegan"
                                                    checked={checked["wellness-vegan"] || false}
                                                    onChange={() => handleCheckboxChange("wellness-vegan")}

                                                />

                                                <label
                                                    className={styles.checkText}
                                                    htmlFor="wellness-vegan"
                                                >
                                                    Whether the product is vegan (i.e., no animal-derived
                                                    ingredients).
                                                </label>
                                            </span>
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Description of the active and/or inactive ingredients and components"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Cruelty-Free</label>
                                        <div className={styles.tooltipContainer}>
                                            <span className={styles.formCheckboxSection}>
                                                <input
                                                    type="checkbox"
                                                    id="wellness-cruelty-free"
                                                    checked={checked["wellness-cruelty-free"] || false}
                                                    onChange={() => handleCheckboxChange("wellness-cruelty-free")}

                                                />

                                                <label
                                                    className={styles.checkText}
                                                    htmlFor="wellness-cruelty-free"
                                                >
                                                    Whether the product is tested on animals or is
                                                    cruelty-free
                                                </label>
                                            </span>
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Whether the product is tested on animals or is cruelty-free"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Storage & Handling</span>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Shelf Life / Expiry
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <input
                                                    className={styles.formInput}
                                                    type="text"
                                                    name="totalQuantity"
                                                    placeholder="Enter Shelf Life / Expiry"
                                                    autoComplete="off"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="wellness-tooltip"
                                                    data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>

                                    <div className={styles.innerMonitorSection}>
                                        <span className={styles.formHead}>
                                            Monitoring and Adherence
                                        </span>
                                        <div className={styles.formInnerSection}>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>
                                                    Side Effects and Warnings
                                                </label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="totalQuantity"
                                                        placeholder="Enter Side Effects and Warnings"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="side-effects-tooltip"
                                                       
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="side-effects-tooltip">
                                                    Common side effects associated with the medication. Known <br/> interactions with other drugs or food (eg. Alcohol)
                                                        </Tooltip>
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Allergens</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="totalQuantity"
                                                        placeholder="Enter Allergens"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Common allergens in the product (e.g., parabens, sulfates, gluten etc)."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }
                {/* End the Vital Health and Wellness */}

                {/* Start the Medical Consumables and Disposables */}
                {
                    selectedSchema === "MedicalConsumablesAndDisposables" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Thickness</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="genericName"
                                                placeholder="Enter Thickness"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="The thickness of the Item (e.g., in mil or gauge)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Product Material</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="totalQuantity"
                                                placeholder="Enter Product Material"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Material used (e.g., Latex, Nitrile, Vinyl, Rubber, stainless steel, titanium etc.)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Filtration Type</label>
                                        <div className={styles.tooltipContainer}>
                                            <Chips value={value} onChange={(e) => setValue(e.value)} placeholder={value.length === 0 ? "Press enter to add label" : ""} />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="filtration-tooltip"
                                               
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="filtration-tooltip">
                                            Type of Filteration (e.g., PFE (Particle Filtration Efficiency), <br/> BFE (Bacterial Filtration Efficiency), Viral Filtration Efficiency etc)
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Purpose</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Chemical Resistance
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Any specific chemical resistance features"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Shape</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Shape of the needle (e.g., 1/2 circle, 3/8 circle)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Coating</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Type of coating (e.g., antimicrobial, silicone)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Powdered</label>
                                        <div className={styles.tooltipContainer}>
                                            <span className={styles.formCheckboxSection}>
                                                <input
                                                    type="checkbox"
                                                    id="disposal-powered"
                                                    checked={checked["disposal-powered"] || false}
                                                    onChange={() => handleCheckboxChange("disposal-powered")}

                                                />

                                                <label className={styles.checkText} htmlFor="disposal-powered">
                                                    Whether the gloves are powdered or powder-free.
                                                </label>
                                            </span>
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Whether the gloves are powdered or powder-free."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Texture</label>
                                        <div className={styles.tooltipContainer}>
                                            <span className={styles.formCheckboxSection}>
                                                <input
                                                    type="checkbox"
                                                    id="disposal-texture"
                                                    checked={checked["disposal-texture"] || false}
                                                    onChange={() => handleCheckboxChange("disposal-texture")}

                                                />

                                                <label className={styles.checkText} htmlFor="disposal-texture">
                                                    Whether the item have texture or smooth
                                                </label>
                                            </span>
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Whether the item have texture or smooth"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Storage & Handling</span>

                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Shelf Life / Expiry
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <input
                                                    className={styles.formInput}
                                                    type="text"
                                                    name="totalQuantity"
                                                    placeholder="Enter Shelf Life / Expiry"
                                                    autoComplete="off"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="wellness-tooltip"
                                                    data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>

                                    <div className={styles.innerMonitorSection}>
                                        <span className={styles.formHead}>
                                            Monitoring and Adherence
                                        </span>
                                        <div className={styles.formInnerSection}>

                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Allergens</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Common allergens in the product (e.g., parabens, sulfates, gluten, milk, Latex etc)."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Sterilized</label>
                                                <div className={styles.tooltipContainer}>
                                                    <span className={styles.formCheckboxSection}>
                                                        <input
                                                            type="checkbox"
                                                            id="disposal-sterilized"
                                                            checked={checked["disposal-sterilized"] || false}
                                                            onChange={() => handleCheckboxChange("disposal-sterilized")}

                                                        />

                                                        <label className={styles.checkText} htmlFor="disposal-sterilized">
                                                            Whether the item is sterilized or non-sterile.
                                                        </label>
                                                    </span>
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Whether the item is sterilized or non-sterile."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.innerMonitorSection}>
                                        <span className={styles.formHead}>Technical Details</span>
                                        <div className={styles.formInnerSection}>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>
                                                    Filtration Efficiency
                                                </label>
                                                <div className={styles.tooltipContainer}>
                                                    <input
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="totalQuantity"
                                                        placeholder="Enter Filtration Efficiency"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Percentage of particles the mask filters (e.g., 95%, 99%, etc.)"
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Breathability</label>
                                                <div className={styles.tooltipContainer}>
                                                    <input
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="totalQuantity"
                                                        placeholder="Enter Breathability"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Breathability rating (e.g., air flow resistance, Inhalation/Exhalation rate)"
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Layer Count</label>
                                                <div className={styles.tooltipContainer}>
                                                    <input
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="totalQuantity"
                                                        placeholder="Enter Layer Count"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Number of layers (e.g., 3-ply, 4-ply, 5-ply)."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Fluid Resistance</label>
                                                <div className={styles.tooltipContainer}>
                                                    <span className={styles.formCheckboxSection}>

                                                        <input
                                                            type="checkbox"
                                                            id="disposal-resistance"
                                                            checked={checked["disposal-resistance"] || false}
                                                            onChange={() => handleCheckboxChange("disposal-resistance")}

                                                        />

                                                        <label className={styles.checkText} htmlFor="disposal-resistance">
                                                            Resistance to fluid penetration (e.g., for surgical masks)
                                                        </label>
                                                    </span>
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Resistance to fluid penetration (e.g., for surgical masks)"
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }
                {/* End the Medical Consumables and Disposables */}

                {/* Start the Laboratory Supplies */}
                {
                    selectedSchema === "LaboratorySupplies" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Physical State</label>
                                        <div className={styles.tooltipContainer}>
                                            <Chips value={value} onChange={(e) => setValue(e.value)} placeholder={value.length === 0 ? "Press enter to add label" : ""} />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Physical state (e.g., solid, liquid, gas)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Hazard Classification
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <Chips value={value} onChange={(e) => setValue(e.value)} placeholder={value.length === 0 ? "Press enter to add label" : ""} />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Physical state (e.g., solid, liquid, gas)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Shape</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Shape of the needle (e.g., 1/2 circle, 3/8 circle)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Coating</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Type of coating (e.g., antimicrobial, silicone)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Purpose</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="diagnostic-purpose-tooltip"
                                                
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="diagnostic-purpose-tooltip">
                                            Purpose (e.g., COVID-19 detection, blood glucose monitoring, cholesterol level check,Pain <br/> relief,Prevention of infection.,Cooling and soothing.,Moisturizing and healing, procedure <br/> or use case of tool, Relieves symptoms, promotes healing, or prevents recurrence.)
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>CAS Number</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Chemical Abstracts Service (CAS) number for unique identification."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Grade</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Purity or grade (e.g., analytical grade, reagent grade)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Concentration</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="concen-tooltip"
                                                
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="concen-tooltip">
                                            Concentration if it’s a solution (e.g., 0.1 M, 5% w/v) ,Alcohol-based disinfectants are typically 70-90% <br/>concentration for optimal antimicrobial efficacy. Oxygen concentration level provided by the device (e.g., 95%)
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                                <span className={styles.formHead}>Technical Details</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Connectivity</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="totalQuantity"
                                                placeholder="Enter Connectivity"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Connectivity options (e.g., USB, Wi-Fi, HDMI)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Magnification Range
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Magnification capabilities (e.g., 40x to 1000x)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Objective Lenses</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Number and types of objective lenses (e.g., 4x, 10x, 40x)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Power Source</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Power requirements (e.g., battery, AC adapter)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Resolution</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Maximum resolution the microscope can achieve."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                            </div>




                        </>
                    )
                }
                {/* End the Laboratory Supplies */}

                {/* Start the Diagnostic and Monitoring Devices */}
                {
                    selectedSchema === "DiagnosticAndMonitoringDevices" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Diagnostic Functions
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Specific diagnostic tests or functions that the tool performs"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Flow Rate</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Adjustable flow rate range (e.g., 1-5 LPM, 1-10 LPM)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Concentration</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="concentrations"
                                               
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="concentrations">
                                            Concentration if it’s a solution (e.g., 0.1 M, 5% w/v) ,Alcohol-based disinfectants are typically 70-90% <br/> concentration for optimal antimicrobial efficacy. Oxygen concentration level provided by the device (e.g., 95%)
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                                <span className={styles.formHead}>Technical Details</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Measurement Range</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="drugClass"
                                                placeholder="Enter Measurement Range"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Blood pressure range the monitor can measure (e.g., 0-300 mmHg)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Noise Level</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="totalQuantity"
                                                placeholder="Enter Noise Level"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Operating noise level (e.g., 40 dB)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Usage Rate</label>
                                        <input
                                            className={styles.formInput}
                                            type="text"
                                            name="totalQuantity"
                                            placeholder="Enter Usage Rate"
                                            autoComplete="off"
                                        />
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Maintenance Notes</label>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Compatible Equipment
                                        </label>
                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Specification</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Technical Specification of the tool  (e.g., hardware, software, network diagnostics, etc.)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <FileUploadSection
                                            label=""
                                            fileUpload={diagonsticSpecificationUpload}
                                            tooltip={false}
                                            showLabel={false}
                                        />
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Performance Testing Report
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="performance-tooltips"
                                                data-tooltip-content=""
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="performance-tooltips">
                                            Results from any internal or external product testing (e.g.,<br/> nebulizer output, CPAP pressure and airflow testing).
                                                </Tooltip>
                                        </div>
                                        <FileUploadSection
                                            label=""
                                            fileUpload={diagnosticPerformanceUpload}
                                            tooltip={false}
                                            showLabel={false}
                                        />
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                            </div>




                        </>
                    )
                }
                {/* End the Diagnostic and Monitoring Devices */}

                {/* Start the Hospital and Clinic Supplies */}
                {
                    selectedSchema === "HospitalAndClinicSupplies" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Thickness</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="genericName"
                                                placeholder="Enter Thickness"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="The thickness of the Item (e.g., in mil or gauge)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Product Material</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="totalQuantity"
                                                placeholder="Enter Product Material"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Material used (e.g., Latex, Nitrile, Vinyl, Rubber, stainless steel, titanium etc.)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Purpose</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Chemical Resistance
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Any specific chemical resistance features"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Powdered</label>
                                        <div className={styles.tooltipContainer}>
                                            <span className={styles.formCheckboxSection}>
                                                <input
                                                    type="checkbox"
                                                    id="hospital-powered"
                                                    checked={checked["hospital-powered"] || false}
                                                    onChange={() => handleCheckboxChange("hospital-powered")}

                                                />

                                                <label className={styles.checkText} htmlFor="hospital-powered">
                                                    Whether the gloves are powdered or powder-free.
                                                </label>
                                            </span>
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Whether the gloves are powdered or powder-free."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Texture</label>
                                        <div className={styles.tooltipContainer}>
                                            <span className={styles.formCheckboxSection}>
                                                <input
                                                    type="checkbox"
                                                    id="hospital-texture"
                                                    checked={checked["hospital-texture"] || false}
                                                    onChange={() => handleCheckboxChange("hospital-texture")}

                                                />

                                                <label className={styles.checkText} htmlFor="hospital-texture">
                                                    Whether the item have texture or smooth
                                                </label>
                                            </span>
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Whether the item have texture or smooth"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Storage & Handling</span>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Shelf Life / Expiry
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <input
                                                    className={styles.formInput}
                                                    type="text"
                                                    name="totalQuantity"
                                                    placeholder="Enter Shelf Life / Expiry"
                                                    autoComplete="off"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="wellness-tooltip"
                                                    data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>

                                    <div className={styles.innerMonitorSection}>
                                        <span className={styles.formHead}>
                                            Monitoring and Adherence
                                        </span>
                                        <div className={styles.formInnerSection}>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Sterilized</label>
                                                <div className={styles.tooltipContainer}>
                                                    <span className={styles.formCheckboxSection}>
                                                        <input
                                                            type="checkbox"
                                                            id="hospital-sterilized"
                                                            checked={checked["hospital-sterilized"] || false}
                                                            onChange={() => handleCheckboxChange("hospital-sterilized")}

                                                        />

                                                        <label className={styles.checkText} htmlFor="hospital-sterilized">
                                                            Whether the item is sterilized or non-sterile.
                                                        </label>
                                                    </span>
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Whether the item is sterilized or non-sterile."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <span className={styles.formHead}>Technical Details</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Adhesiveness</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="genericName"
                                                placeholder="Enter Adhesiveness"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Adhesive or non-adhesive."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Absorbency</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="drugClass"
                                                placeholder="Enter Absorbency"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Whether the suture is absorbable or non-absorbable."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Elasticity</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="totalQuantity"
                                                placeholder="Enter Elasticity"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Stretch for tapes"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Fluid Resistance</label>
                                        <div className={styles.tooltipContainer}>
                                            <span className={styles.formCheckboxSection}>
                                                <input
                                                    type="checkbox"
                                                    id="hospital-resistance"
                                                    checked={checked["hospital-resistance"] || false}
                                                    onChange={() => handleCheckboxChange("hospital-resistance")}

                                                />
                                                <label className={styles.checkText} htmlFor="hospital-resistance">
                                                    Resistance to fluid penetration (e.g., for surgical masks)
                                                </label>
                                            </span>
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Resistance to fluid penetration (e.g., for surgical masks)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                            </div>





                        </>
                    )
                }
                {/* End the Hospital and Clinic Supplies */}

                {/* Start the Orthopedic Supplies */}
                {
                    selectedSchema === "OrthopedicSupplies" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Strength</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="totalQuantity"
                                                placeholder="Enter Strength"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="streng-tooltip"
                                                
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="streng-tooltip">
                                            The strength or concentration of the medication (e.g., <br/> 500 mg, 10 mg/mL,Standard or high-strength).
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Moisture Resistance
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <Select
                                                className={styles.formSelect}
                                                options={moistureOptions}
                                                placeholder="Select Moisture Resistance"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Whether the item is moisture resistance or not"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Purpose</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Target Condition</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="The hair, scalp or skin condition the product is formulated to address "
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Coating</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Type of coating (e.g., antimicrobial, silicone)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>


                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerMonitorSection}>
                                        <span className={styles.formHead}>
                                            Monitoring and Adherence
                                        </span>
                                        <div className={styles.formInnerSection}>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Sterilized</label>
                                                <div className={styles.tooltipContainer}>
                                                    <span className={styles.formCheckboxSection}>

                                                        <input
                                                            type="checkbox"
                                                            id="orthopedic-sterilized"
                                                            checked={checked["orthopedic-sterilized"] || false}
                                                            onChange={() => handleCheckboxChange("orthopedic-sterilized")}

                                                        />
                                                        <label className={styles.checkText} htmlFor="orthopedic-sterilized">
                                                            Whether the item is sterilized or non-sterile.
                                                        </label>
                                                    </span>
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Whether the item is sterilized or non-sterile."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                        </div>
                                    </div>


                                    <div className={styles.innerMonitorSection}>
                                        <span className={styles.formHead}>
                                            Technical Details
                                        </span>
                                        <div className={styles.formInnerSection}>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Elasticity</label>
                                                <div className={styles.tooltipContainer}>
                                                    <input
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="totalQuantity"
                                                        placeholder="Enter Elasticity"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Stretch for tapes"
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Absorbency</label>
                                                <div className={styles.tooltipContainer}>
                                                    <input
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="totalQuantity"
                                                        placeholder="Enter Absorbency"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Whether the suture is absorbable or non-absorbable."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Breathability</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Breathability rating (e.g., air flow resistance, Inhalation/Exhalation rate)"
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                            </div>

                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Color Options</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="color-options-tooltip"
                                                        
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="color-options-tooltip">
                                                    Available colors (e.g., black, beige, grey, tortoiseshell, <br/> frame color or lense color etc)
                                                        </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }
                {/* End the Orthopedic Supplies */}

                {/* Start the Dental Products */}
                {
                    selectedSchema === "DentalProducts" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Product Material</label>
                                        <div className={styles.tooltipContainer}>
                                            <input
                                                className={styles.formInput}
                                                type="text"
                                                name="genericName"
                                                placeholder="Enter Product Material"
                                                autoComplete="off"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Material used (e.g., Latex, Nitrile, Vinyl, Rubber, stainless steel, titanium etc.)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Purpose</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Target Condition</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="target-condition-tooltip"
                                                
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="target-condition-tooltip">
                                            Purpose (e.g., COVID-19 detection, blood glucose monitoring, cholesterol level check,Pain relief,Prevention <br/>of infection.,Cooling and soothing.,Moisturizing and healing, procedure or use case of tool, Relieves<br/> symptoms, promotes healing, or prevents recurrence.)
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Storage & Handling</span>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Shelf Life / Expiry
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <input
                                                    className={styles.formInput}
                                                    type="text"
                                                    name="totalQuantity"
                                                    placeholder="Enter Shelf Life / Expiry"
                                                    autoComplete="off"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="wellness-tooltip"
                                                    data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>

                                    <div className={styles.innerMonitorSection}>
                                        <span className={styles.formHead}>Technical Details</span>
                                        <div className={styles.formInnerSection}>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Usage Rate</label>

                                                <input
                                                    className={styles.formInput}
                                                    type="text"
                                                    name="totalQuantity"
                                                    placeholder="Enter Usage Rate"
                                                    autoComplete="off"
                                                />

                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>
                                                    Maintenance Notes
                                                </label>

                                                <textarea
                                                    className={styles.formInput}
                                                    name="diagnosticFunctions"
                                                    placeholder="Enter Diagnostic Functions"
                                                    rows="2"
                                                />

                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>
                                                    Compatible Equipment
                                                </label>

                                                <textarea
                                                    className={styles.formInput}
                                                    name="diagnosticFunctions"
                                                    placeholder="Enter Diagnostic Functions"
                                                    rows="2"
                                                />

                                                <span className={styles.error}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }
                {/* End the Dental Products */}

                {/* Start the Eye Care Supplies */}
                {
                    selectedSchema === "EyeCareSupplies" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Frame</label>

                                        <Select
                                            className={styles.formSelect}
                                            options={frameOptions}
                                            placeholder="Select Frame"
                                        />

                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Lens</label>

                                        <Select
                                            className={styles.formSelect}
                                            options={lensOptions}
                                            placeholder="Select Lens"
                                        />

                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Lens Material</label>

                                        <Select
                                            className={styles.formSelect}
                                            options={lensmaterialOptions}
                                            placeholder="Select Lens Material"
                                        />

                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                                <span className={styles.formHead}>Technical Details</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Diameter</label>

                                        <input
                                            className={styles.formInput}
                                            type="text"
                                            name="totalQuantity"
                                            placeholder="Enter Diameter"
                                            autoComplete="off"
                                        />

                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Lens Power</label>

                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />

                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Base Curve</label>

                                        <textarea
                                            className={styles.formInput}
                                            name="diagnosticFunctions"
                                            placeholder="Enter Diagnostic Functions"
                                            rows="2"
                                        />

                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Color Options</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Available colors (e.g., black, beige, grey, tortoiseshell, frame color or lense color etc)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                            </div>



                        </>
                    )
                }
                {/* End the Eye Care Supplies */}

                {/* Start the Home Healthcare Products */}

                {
                    selectedSchema === "HomeHealthcareProducts" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Flow Rate</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Adjustable flow rate range (e.g., 1-5 LPM, 1-10 LPM)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Concentration</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="concentra-tooltip"
                                                data-tooltip-content=""
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="concentra-tooltip">
                                            Concentration if it’s a solution (e.g., 0.1 M, 5% w/v) ,Alcohol-based disinfectants are typically 70-90% <br/>concentration for optimal antimicrobial efficacy. Oxygen concentration level<br/> provided by the device (e.g., 95%)
                                                </Tooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Storage & Handling</span>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Shelf Life / Expiry
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <input
                                                    className={styles.formInput}
                                                    type="text"
                                                    name="totalQuantity"
                                                    placeholder="Enter Shelf Life / Expiry"
                                                    autoComplete="off"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="wellness-tooltip"
                                                    data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>

                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Technical Details</span>
                                        <div className={styles.formInnerSection}>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>
                                                    Max Weight Capacity
                                                </label>
                                                <div className={styles.tooltipContainer}>
                                                    <input
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="drugClass"
                                                        placeholder="Enter Max Weight Capacity"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="The maximum weight capacity that the mobility aid can support (e.g., 250 lbs for a walker)."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Grip Type</label>
                                                <div className={styles.tooltipContainer}>
                                                    <input
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="genericName"
                                                        placeholder="Enter Grip Type"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Type of grips or handles (e.g., ergonomic, foam, rubberized handles for better comfort)."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Battery Type</label>
                                                <div className={styles.tooltipContainer}>
                                                    <input
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="genericName"
                                                        placeholder="Enter Battery Type"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Type of Battery Installed to Operate the Item"
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Battery Size</label>
                                                <div className={styles.tooltipContainer}>
                                                    <input
                                                        className={styles.formInput}
                                                        type="text"
                                                        name="drugClass"
                                                        placeholder="Enter Battery Size"
                                                        autoComplete="off"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Size of Battery Installed to Operate the Item"
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Color Options</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Available colors (e.g., black, beige, grey, tortoiseshell, frame color or lense color etc)"
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Foldability</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Whether the product can be folded for easy storage (e.g., foldable walkers)."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Locking Mechanism</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Details on any locking mechanisms (e.g., locking wheels or adjustable legs on walkers)"
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Type of Support</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="type-support-tooltip"
                                                        
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="type-support-tooltip">
                                                    The type of support provided by the aid (e.g., two-legged,<br/> four-legged walker, or wall-mounted grab bar).
                                                        </Tooltip>
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>
                                                    Performance Testing Report
                                                </label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="reports-tooltip"
                                                        
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="reports-tooltip">
                                                    Results from any internal or external product testing (e.g.,<br/> nebulizer output, CPAP pressure and airflow testing).
                                                        </Tooltip>
                                                </div>
                                                <FileUploadSection
                                                    label=""
                                                    fileUpload={healthcarePerformanceUpload}
                                                    tooltip={false}
                                                    showLabel={false}
                                                />
                                                <span className={styles.error}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }
                {/* End the Home Healthcare Products */}

                {/* Start the Alternative Medicines */}
                {
                    selectedSchema === "AlternativeMedicines" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Purpose</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="identification-purpose-tooltip"
                                                data-tooltip-content=""
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="identification-purpose-tooltip">
                                            Purpose (e.g., COVID-19 detection, blood glucose monitoring, cholesterol level check,Pain relief,Prevention of infection.,Cooling<br/> and soothing.,Moisturizing and healing, procedure or use case of tool, Relieves symptoms, promotes healing, or prevents recurrence.)
                                                </Tooltip>
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Composition / Ingredients
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Description of the active ingredients and components of the vaccine."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Health Claims</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content=" Verified by clinical trials or regulatory agencies."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <FileUploadSection
                                            label=""
                                            fileUpload={healthCliamUpload}
                                            tooltip={false}
                                            showLabel={false}
                                        />
                                    </div>
                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Storage & Handling</span>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Shelf Life / Expiry
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <input
                                                    className={styles.formInput}
                                                    type="text"
                                                    name="totalQuantity"
                                                    placeholder="Enter Shelf Life / Expiry"
                                                    autoComplete="off"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="wellness-tooltip"
                                                    data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }
                {/* End the Alternative Medicines */}

                {/* Start the Emergency and First Aid Supplies */}
                {
                    selectedSchema === "EmergencyAndFirstAidSupplies" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Composition / Ingredients
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Description of the active ingredients and components of the vaccine."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Product Longevity</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Expected lifespan of the product (e.g., single-use vs. reusable items)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Foldability</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Whether the product can be folded for easy storage (e.g., foldable walkers)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Storage & Handling</span>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Shelf Life / Expiry
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <input
                                                    className={styles.formInput}
                                                    type="text"
                                                    name="totalQuantity"
                                                    placeholder="Enter Shelf Life / Expiry"
                                                    autoComplete="off"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="wellness-tooltip"
                                                    data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }

                {/* End the Emergency and First Aid Supplies */}

                {/* Start the Disinfection and Hygiene Supplies */}
                {
                    selectedSchema === "disinfectionAndHygieneSuppliesSchema" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Composition / Ingredients
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Description of the active ingredients and components of the vaccine."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Concentration</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="contra-tooltips"
                                               
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="contra-tooltips">
                                            Concentration if it’s a solution (e.g., 0.1 M, 5% w/v) ,Alcohol-based disinfectants are typically 70-90% concentration <br/> for optimal antimicrobial efficacy. Oxygen concentration level provided by the device (e.g., 95%)
                                                </Tooltip>
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Formulation</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Fragrance</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Whether the product contains fragrance or is fragrance-free."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Storage & Handling</span>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Shelf Life / Expiry
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <input
                                                    className={styles.formInput}
                                                    type="text"
                                                    name="totalQuantity"
                                                    placeholder="Enter Shelf Life / Expiry"
                                                    autoComplete="off"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="wellness-tooltip"
                                                    data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }
                {/* End the Disinfection and Hygiene Supplies */}

                {/* Start the Nutrition and Dietary Products */}
                {
                    selectedSchema === "NutritionAndDietaryProducts" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Dairy Free</label>
                                        <div className={styles.tooltipContainer}>
                                            <Select
                                                className={styles.formSelect}
                                                options={dairyfeeOptions}
                                                placeholder="Select Dairy Free"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Is the product dairy free?"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Flavor Options</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="flavour-option-tooltip"
                                                data-tooltip-content=""
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="flavour-option-tooltip">
                                            Protein powders often come in a wide variety of flavors like <br/>chocolate, vanilla, strawberry, cookies & cream, etc.
                                                </Tooltip>
                                        </div>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Amino Acid Profile</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Full spectrum or specific amino acids like BCAAs (Branched-Chain Amino Acids)."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Fat Content</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Varies based on type (e.g., whey isolate vs. concentrate)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Purpose</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="purpose-well-tooltips"
                                                data-tooltip-content=""
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="purpose-well-tooltips">
                                            Purpose (e.g., COVID-19 detection, blood glucose monitoring, cholesterol level check,Pain relief,Prevention of infection.,Cooling and soothing., <br/>Moisturizing and healing, procedure or use case of tool, Relieves symptoms, promotes healing, or prevents recurrence.)
                                                </Tooltip>
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Health Benefit</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Info about the health benefits (e.g., “Boosts immunity”, “Supports joint health”)"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Composition / Ingredients
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Description of the active ingredients and components of the vaccine."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>
                                            Additives & Sweeteners
                                        </label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="additives-tooltip"
                                                
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="additives-tooltip">
                                            Some proteins contain artificial sweeteners (e.g., sucralose, aspartame),<br/> while others use natural sweeteners (e.g., stevia, monk fruit).
                                            </Tooltip>
                                         
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Vegan</label>
                                        <div className={styles.tooltipContainer}>
                                            <span className={styles.formCheckboxSection}>
                                                <input
                                                    type="checkbox"
                                                    id="nutrition-vegan"
                                                    checked={checked["nutrition-vegan"] || false}
                                                    onChange={() => handleCheckboxChange("nutrition-vegan")}

                                                />
                                                <label className={styles.checkText} htmlFor="nutrition-vegan">
                                                    Whether the product is vegan (i.e., no animal-derived
                                                    ingredients).
                                                </label>
                                            </span>
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Description of the active and/or inactive ingredients and components"
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                        <span className={styles.error}></span>
                                    </div>

                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Storage & Handling</span>
                                        <div className={styles.productInnerContainer}>
                                            <label className={styles.formLabel}>
                                                Shelf Life / Expiry
                                            </label>
                                            <div className={styles.tooltipContainer}>
                                                <input
                                                    className={styles.formInput}
                                                    type="text"
                                                    name="totalQuantity"
                                                    placeholder="Enter Shelf Life / Expiry"
                                                    autoComplete="off"
                                                />
                                                <span
                                                    className={styles.infoTooltip}
                                                    data-tooltip-id="wellness-tooltip"
                                                    data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                                                >
                                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                                </span>
                                                <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                            </div>
                                            <span className={styles.error}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }

                {/* End the Nutrition and Dietary Products */}

                {/* Start the Healthcare IT Solutions */}
                {
                    selectedSchema === "HealthcareITSolutions" && (
                        <>
                            <div className={styles.section}>
                                <span className={styles.formHead}>Product Identification</span>
                                <div className={styles.formSection}>
                                    <div className={styles.productContainer}>
                                        <label className={styles.formLabel}>Scalability Info</label>
                                        <div className={styles.tooltipContainer}>
                                            <textarea
                                                className={styles.formInput}
                                                name="diagnosticFunctions"
                                                placeholder="Enter Diagnostic Functions"
                                                rows="2"
                                            />
                                            <span
                                                className={styles.infoTooltip}
                                                data-tooltip-id="wellness-tooltip"
                                                data-tooltip-content="Easily adjustable storage to accommodate growing data volumes."
                                            >
                                                <img src={Information} className={styles.iconTooltip} alt='information' />

                                            </span>
                                            <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.innerProductContainer}>
                                    <div className={styles.innerSection}>
                                        <span className={styles.formHead}>Additional Information</span>
                                        <div className={styles.formInnerSection}>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>License</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="License Terms"
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Add-Ons</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="White-label solutions for branding. ,Custom integrations or API usage."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>User Access</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Patients Easy-to-use apps for booking and attending consultations."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.innerMonitorSection}>
                                        <span className={styles.formHead}>Technical Details</span>
                                        <div className={styles.formInnerSection}>

                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Key Features</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content=""
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip">
                                                        Remote monitoring of vital signs (e.g., heart rate, blood pressure, glucose levels). <br />Real-time data transmission to healthcare providers or mobile apps.
                                                    </Tooltip>
                                                </div>

                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>
                                                    Core Functionalities
                                                </label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Continuous or on-demand monitoring (e.g., ECG, blood oxygen levels, heart rate)."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <span className={styles.error}></span>
                                            </div>
                                            <div className={styles.productInnerContainer}>
                                                <label className={styles.formLabel}>Interoperability</label>
                                                <div className={styles.tooltipContainer}>
                                                    <textarea
                                                        className={styles.formInput}
                                                        name="diagnosticFunctions"
                                                        placeholder="Enter Diagnostic Functions"
                                                        rows="2"
                                                    />
                                                    <span
                                                        className={styles.infoTooltip}
                                                        data-tooltip-id="wellness-tooltip"
                                                        data-tooltip-content="Adheres to HL7/FHIR standards for healthcare data exchange."
                                                    >
                                                        <img src={Information} className={styles.iconTooltip} alt='information' />

                                                    </span>
                                                    <Tooltip className={styles.tooltipSec} id="wellness-tooltip" />
                                                </div>
                                                <FileUploadSection
                                                    label=""
                                                    fileUpload={interoperabilityUpload}
                                                    tooltip={false}
                                                    showLabel={false}
                                                />
                                                <span className={styles.error}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }
                {/* End the Healthcare IT Solutions */}

                {/* Start the Health & Safety */}
                <div className={styles.section}>
                    <span className={styles.formHead}>Health & Safety</span>
                    <div className={styles.formSection}>

                        <FileUploadSection
                            label="Safety Datasheet"
                            fileUpload={safetyDatasheetUpload}
                            tooltip="Specific safety information, instructions or precautions related to product"
                        />


                        <FileUploadSection
                            label="Health Hazard Rating"
                            fileUpload={healthHazardUpload}
                            tooltip="Health Hazard Rating Document"
                        />


                        <FileUploadSection
                            label="Environmental Impact"
                            fileUpload={environmentalImpactUpload}
                            tooltip="Environment Impact Rating Document"
                        />


                    </div>
                </div>

                {/* End the Health & Safety */}

                {/* Start the Additional Information */}
                <div className={styles.additionalSection}>
                    <span className={styles.formHead}>Additional Information</span>
                    <div className={styles.formSection}>




                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Warranty</label>
                            <input
                                className={styles.formInput}
                                type="text"
                                name="totalQuantity"
                                placeholder="Enter Warranty"
                                autoComplete="off"
                            />
                            <span className={styles.error}></span>
                        </div>


                        <FileUploadSection
                            label="User Guidelines"
                            fileUpload={userGuidelinesUpload}
                            tooltip="Specific information, instructions related to product."
                        />
                        <span className={styles.error}></span>


                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Other Information</label>
                            <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    name="totalQuantity"
                                    placeholder="Enter Total Quantity"
                                    autoComplete="off"
                                />
                                <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="other-information-tooltip"
                                    
                                >
                                    <img src={Information} className={styles.iconTooltip} alt='information' />

                                </span>
                                <Tooltip className={styles.tooltipSec} id="other-information-tooltip">
                                Any relevant, additional or other information regarding the product (eg. Prescribing <br/> Info for Medication or Dosage Info or regarding the shipping of large devices etc.)
                                    </Tooltip>
                            </div>
                            <span className={styles.error}></span>
                        </div>
                    </div>
                </div>

                {/* End the Additional Information */}


                {/* Start button section */}
                <div className={styles.buttonContainer}>
                    <button className={styles.buttonCancel}>Cancel</button>
                    <button className={styles.buttonSubmit}>Submit</button>
                </div>

                {/* End button section */}
            </form >
        </div >
    );
};

export default EditAddProduct;