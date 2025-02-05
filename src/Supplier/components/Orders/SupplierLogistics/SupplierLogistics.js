import React, { useState } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import "../../SharedComponents/Signup/signup.css"
import styles from "./supplierlogistics.module.css"
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { Link } from "react-router-dom";

const SupplierLogistics = () => {
    const [containers, setContainers] = useState([{}]);
    const [addressType, setAddressType] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [shrunkContainers, setShrunkContainers] = useState([]);

    const handleAddContainer = () => {
        setContainers([...containers, {}]);
    };

    const handleRemoveContainer = (index) => {
        setShrunkContainers([...shrunkContainers, index]);
        setTimeout(() => {
            setContainers(containers.filter((_, i) => i !== index));
            setShrunkContainers(shrunkContainers.filter((i) => i !== index));
        }, 300);
    };

    const handleChange = (e) => {
        setAddressType(e.target.value);
    };
    const [packages, setPackages] = useState([
        { id: 1, weight: '', dimensions: { length: '', width: '', height: '' }, volume: '' },
    ]);

    const addPackage = () => {
        setPackages((prevPackages) => [
            ...prevPackages,
            {
                id: prevPackages.length + 1,
                weight: '',
                dimensions: { length: '', width: '', height: '' },
                volume: '',
            },
        ]);
    };

    const removePackage = (id) => {
        setPackages((prevPackages) => prevPackages.filter((pkg) => pkg.id !== id));
    };

    const handleInputChange = (id, field, value) => {
        setPackages((prevPackages) =>
            prevPackages.map((pkg) =>
                pkg.id === id
                    ? {
                        ...pkg,
                        [field]: value,
                    }
                    : pkg
            )
        );
    };

    const handleDimensionChange = (id, dimension, value) => {
        setPackages((prevPackages) =>
            prevPackages.map((pkg) =>
                pkg.id === id
                    ? {
                        ...pkg,
                        dimensions: {
                            ...pkg.dimensions,
                            [dimension]: value,
                        },
                    }
                    : pkg
            )
        );
    };
    const quantityOptions = [
        { value: '08:00 AM - 10:00 AM', label: '08:00 AM - 10:00 AM' },
        { value: '10:00 AM  - 12:00 AM', label: '10:00 AM  - 12:00 AM' },
        { value: '12:00 PM - 02:00 PM', label: '12:00 PM - 02:00 PM' },
        { value: '02:00 PM - 04:00 PM', label: '02:00 PM - 04:00 PM' },
        { value: '04:00 AM - 06:00 PM', label: '04:00 AM - 06:00 PM' },
        { value: '06:00 PM - 08:00 PM', label: '06:00 PM - 08:00 PM' },
        { value: '08:00 PM - 10:00 PM', label: '08:00 PM - 10:00 PM' },

    ];
    const productOptions = [
        { value: 'Paracetamol', label: 'Paracetamol' },
        { value: 'Nise', label: 'Nise' },
        { value: 'Dollo', label: 'Dollo' },
        { value: 'Udiliv', label: 'Udiliv' },
    ];
    // const handleAddContainer = () => {
    //     setContainers([...containers, {}]);
    // };

    // const handleRemoveContainer = (index) => {
    //     const updatedContainers = containers.filter((_, i) => i !== index);
    //     setContainers(updatedContainers);
    // };
    return (

        <div className={styles.container}>
            <div className={styles.logisticsHeading}>Book Logistics</div>
            <div className={styles.logisticsCardContainer}>
                <div className={styles.adresssCardContainer}>
                    <div className={styles.logisticsMainHeading}>Drop Details</div>
                    <div className={styles.nameContainer}>
                        <span className={styles.addressText}>Shivanshi Tripathi</span>
                        <div className={styles.typeAdresss}>Warehouse</div>
                    </div>
                    <span className={styles.addressText}>C-12 Birlagram Nagda,Near Bal Mandir</span>
                    <span className={styles.addressText}>India, Madhya Pradesh, Nagda 456331</span>
                    <span className={styles.addressText}>+91 6265699633</span>
                </div>
                <div className={styles.adresssCardContainer}>
                    <div className={styles.logisticsMainHeading}>Transport Details</div>
                    <div className={styles.transportInnerSection}>
                        <div className={styles.transportHead}>Mode of Transport</div>
                        <div className={styles.transportText}>Air Cargo (Faster Delivery & High Freight)</div>
                    </div>
                    <div className={styles.transportInnerSection}>
                        <div className={styles.transportHead}>Extra Services</div>
                        <div className={styles.transportText}>Custom Clearance, Door to Door</div>
                    </div>
                </div>
            </div>


            <div className={styles.logisticsCardContainer}>
                <div className={styles.adresssCardContainer}>
                    <div className={styles.logisticsMainHeading}>Drop Details</div>
                    <div className={styles.nameContainer}>
                        <span className={styles.addressText}>Shivanshi Tripathi</span>
                        <div className={styles.typeAdresss}>Warehouse</div>
                    </div>
                    <span className={styles.addressText}>C-12 Birlagram Nagda,Near Bal Mandir</span>
                    <span className={styles.addressText}>India, Madhya Pradesh, Nagda 456331</span>
                    <span className={styles.addressText}>+91 6265699633</span>
                </div>
                <div className={styles.adresssCardContainer}>
                    <div className={styles.logisticsMainHeading}>Transport Details</div>
                    <div className={styles.transportInnerSection}>
                        <div className={styles.transportHead}>Mode of Transport</div>
                        <div className={styles.transportText}>Air Cargo (Faster Delivery & High Freight)</div>
                    </div>
                    <div className={styles.transportInnerSection}>
                        <div className={styles.transportHead}>Extra Services</div>
                        <div className={styles.transportText}>Custom Clearance, Door to Door</div>
                    </div>
                </div>
                <div className={styles.adresssCardContainer}>
                    <div className={styles.pickupHeadSection}>
                    <div className={styles.logisticsMainHeading}>Pickup Details</div>
                    <Link to='/supplier/logistics-address'>
                    <div className={styles.pickupButton}>Change</div>
                    </Link>
                    </div>
                    <div className={styles.nameContainer}>
                        <span className={styles.addressText}>Shivanshi Tripathi</span>
                        <div className={styles.typeAdresss}>Warehouse</div>
                    </div>
                    <span className={styles.addressText}>C-12 Birlagram Nagda,Near Bal Mandir</span>
                    <span className={styles.addressText}>India, Madhya Pradesh, Nagda 456331</span>
                    <span className={styles.addressText}>+91 6265699633</span>
                </div>
            </div>
            <form className={styles.formLogistics}>
                <div className={styles.formInnerClass}>
                    <div className={styles.innerHeading}>Pickup Details</div>
                    <div className={styles.checkboxSection}>
                        <input type="checkbox" id="termsCheckbox" className={styles.checkboxInput} />
                        <label htmlFor="termsCheckbox" className={styles.checkboxLabel}>
                            Same as registered address
                        </label>
                    </div>
                    <div className={styles['inner-container']}>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Full Name<span className={styles.labelstamp}>*</span></label>

                            <input
                                className={styles.formInput}
                                type="text"
                                placeholder="Enter your full name"
                                autoComplete="off"
                            />

                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Mobile Number<span className={styles.labelstamp}>*</span></label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name="contact"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Address<span className={styles.labelstamp}>*</span></label>
                            <input
                                className={styles.formInput}
                                type="text"
                                placeholder="House No, Building, Street, Area"
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Locality/Town<span className={styles.labelstamp}>*</span></label>
                            <input
                                className={styles.formInput}
                                type="text"
                                placeholder="Road Name, Area, Colony"
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Landmark</label>
                            <input
                                className={styles.formInput}
                                type="text"
                                placeholder="Enter Landmark"
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Country<span className={styles.labelstamp}>*</span></label>
                            <Select
                                options={Country.getAllCountries()}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.isoCode}
                                value={selectedCountry}
                                onChange={(option) => {
                                    setSelectedCountry(option);
                                    setSelectedState(null);
                                    setSelectedCity(null);
                                }}
                                placeholder="Select Country"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>State</label>
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
                                onChange={(option) => {
                                    setSelectedState(option);
                                    setSelectedCity(null);
                                }}
                                placeholder="Select State"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>City</label>
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
                                onChange={setSelectedCity}
                                placeholder="Select City"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Pincode</label>
                            <input
                                className={styles.formInput}
                                type="text"
                                placeholder="Enter your pincode"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className={styles.addressContainer}>
                        <div className={styles.innerHeading}>Type of Address<span className={styles.labelstamp}>*</span></div>
                        <div className={styles.radioInnerContainer}>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="warehouse"
                                    onChange={handleChange}
                                    checked={addressType === 'warehouse'}
                                />
                                <label className={styles.formLabel}>Warehouse</label>
                            </div>
                            <div className={styles.radioGroup}>

                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="factory"
                                    onChange={handleChange}
                                    checked={addressType === 'factory'}
                                />
                                <label className={styles.formLabel}>Factory</label>
                            </div>
                            <div className={styles.radioGroup}>

                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="shop"
                                    onChange={handleChange}
                                    checked={addressType === 'shop'}
                                />
                                <label className={styles.formLabel}>Shop</label>
                            </div>
                            <div className={styles.radioGroup}>
                                <input
                                    className={styles.radioInput}
                                    type="radio"
                                    name="addressType"
                                    value="other"
                                    onChange={handleChange}
                                    checked={addressType === 'other'}
                                />
                                <label className={styles.formLabel}>Other</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.formMaterialContainer}>
                    <div className={styles.headBillSection}>
                        <div className={styles.innerBillHead}>Bills of Material</div>
                        <span className={styles.innerAddButton} onClick={handleAddContainer}>
                            Add More
                        </span>
                        </div>
                        {containers.map((_, index) => (
                            <div
                                className={`${styles['inner-container']} ${shrunkContainers.includes(index) ? styles.shrink : ''
                                    }`}
                                key={index}
                            >
                                <div className={styles.logisticInputSection}>
                                    <label className={styles.formLabel}>
                                        Product Name<span className={styles.labelstamp}>*</span>
                                    </label>
                                    <Select options={productOptions} placeholder="Select the Product" />
                                </div>
                                <div className={styles.logisticInputSection}>
                                    <label className={styles.formLabel}>
                                        Quantity<span className={styles.labelstamp}>*</span>
                                    </label>
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        placeholder="Enter Quantity"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className={styles.logisticInputSection}>
                                    <label className={styles.formLabel}>
                                        No. of Packages<span className={styles.labelstamp}>*</span>
                                    </label>
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        placeholder="Enter No. of Packages"
                                        autoComplete="off"
                                    />
                                </div>
                                {containers.length > 1 && (
                                    <div
                                        className={styles.removeButtons}
                                        onClick={() => handleRemoveContainer(index)}
                                    >
                                        <span className={styles.crossButton}>✖</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    
                    <div className={styles.headBillSection}>
                        <div className={styles.innerBillHead}>Package Details</div>
                        <span className={styles.innerAddButton} onClick={addPackage}>
                            Add More
                        </span>
                    </div>
                    {packages.map((pkg) => (
                        <div key={pkg.id} className={styles['inner-container']}>
                            <div className={styles.logisticesInputSection}>
                                <label className={styles.formLabel}>
                                    Package Weight<span className={styles.labelstamp}>*</span>
                                </label>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    placeholder="Enter Package Weight"
                                    autoComplete="off"
                                    value={pkg.weight}
                                    onChange={(e) => handleInputChange(pkg.id, 'weight', e.target.value)}
                                />
                            </div>
                            <div className={styles.logisticesDimensionSection}>
                                <label className={styles.formLabel}>
                                    Package Dimensions<span className={styles.labelstamp}>*</span>
                                </label>
                                <div className={styles.dimensionSections}>
                                    <input
                                        className={styles.formDimensions}
                                        type="text"
                                        placeholder="Enter Length"
                                        autoComplete="off"
                                        value={pkg.dimensions.length}
                                        onChange={(e) =>
                                            handleDimensionChange(pkg.id, 'length', e.target.value)
                                        }
                                    />
                                    <input
                                        className={styles.formDimensions}
                                        type="text"
                                        placeholder="Enter Width"
                                        autoComplete="off"
                                        value={pkg.dimensions.width}
                                        onChange={(e) =>
                                            handleDimensionChange(pkg.id, 'width', e.target.value)
                                        }
                                    />
                                    <input
                                        className={styles.formDimensions}
                                        type="text"
                                        placeholder="Enter Height"
                                        autoComplete="off"
                                        value={pkg.dimensions.height}
                                        onChange={(e) =>
                                            handleDimensionChange(pkg.id, 'height', e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className={styles.logisticesInputSection}>
                                <label className={styles.formLabel}>
                                    Volume<span className={styles.labelstamp}>*</span>
                                </label>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    placeholder="Enter Volume"
                                    autoComplete="off"
                                    value={pkg.volume}
                                    onChange={(e) => handleInputChange(pkg.id, 'volume', e.target.value)}
                                />
                            </div>
                            {packages.length > 1 && (
                                <div
                                    className={styles.removeButton}
                                    onClick={() => removePackage(pkg.id)}
                                >
                                    <span className={styles.crossButton}>✖</span>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className={styles.innerHeading}>Pickup Slot</div>
                    <div className={styles['inner-container']}>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Preferred Date of Pickup<span className={styles.labelstamp}>*</span></label>
                            <DatePicker
                                className={styles.formInput}
                                minDate={new Date()}
                                clearIcon={null}
                                format="dd/MM/yyyy"
                            />
                        </div>
                        <div className={styles.logisticesInputSection}>
                            <label className={styles.formLabel}>Preferred Time of Pickup<span className={styles.labelstamp}>*</span></label>
                            <Select

                                options={quantityOptions}
                                placeholder="Select Time of Pickup"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['logistic-Button-Section']}>
                    <button type='submit' className={styles['logistic-submit']}>Submit</button>
                    <div className={styles['logistic-cancel']}>Cancel</div>
                </div>
            </form>
        </div>
        // Start the pickup details container


    )
}

export default SupplierLogistics