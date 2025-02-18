import React, { useState } from "react";
import Select from "react-select";
import styles from "./addproduct.module.css";
import "../../SharedComponents/Signup/signup.css";
import categoryArrays from "../../../../utils/Category";

const AddProduct = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedLevel3Category, setSelectedLevel3Category] = useState(null);
    const categoryOptions = categoryArrays.map((cat) => ({
        value: cat.name,
        label: cat.name,
    }));
    const getSubCategories = (categoryName) => {
        const category = categoryArrays.find((cat) => cat.name === categoryName);
        return category?.subCategories.map((sub) => ({
            value: sub.name,
            label: sub.name,
        })) || [];
    };
    const getLevel3Categories = (subCategoryName) => {
        if (!selectedCategory) return [];
        const category = categoryArrays.find((cat) => cat.name === selectedCategory.value);
        const subCategory = category?.subCategories.find((sub) => sub.name === subCategoryName);
        return subCategory?.anotherCategories.map((level3) => ({
            value: level3,
            label: level3,
        })) || [];
    };
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setSelectedSubCategory(null);
        setSelectedLevel3Category(null);
    };
    const handleSubCategoryChange = (selectedOption) => {
        setSelectedSubCategory(selectedOption);
        setSelectedLevel3Category(null);
    };

    return (
        <div className={styles.container}>
            <span className={styles.heading}>Products</span>
            <form className={styles.form}>
                <div className={styles.section}>
                    <span className={styles.formHead}>General Information</span>
                    <div className={styles.formSection}>
                        {/* Category Selection */}
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Category</label>
                            <Select
                                className={styles.formSelect}
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                placeholder="Select Category"
                            />
                            <span className={styles.error}></span>
                        </div>

                        {/* Subcategory Selection */}
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Sub Category</label>
                            <Select
                                className={styles.formSelect}
                                options={selectedCategory ? getSubCategories(selectedCategory.value) : []}
                                value={selectedSubCategory}
                                onChange={handleSubCategoryChange}
                                placeholder="Select Subcategory"
                                isDisabled={!selectedCategory}
                            />
                            <span className={styles.error}></span>
                        </div>

                        {/* Level 3 Category Selection */}
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Sub Category (Level 3)</label>
                            <Select
                                className={styles.formSelect}
                                options={selectedSubCategory ? getLevel3Categories(selectedSubCategory.value) : []}
                                value={selectedLevel3Category}
                                onChange={setSelectedLevel3Category}
                                placeholder="Select Level 3 Category"
                                isDisabled={!selectedSubCategory}
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>
                </div>
                {/* Start the Medical equipnment and devices  */}
                <div className={styles.section}>
                    <span className={styles.formHead}>Technical Details</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Specification</label>
                            <textarea
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Diagnostic Functions</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Diagnostic Functions'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Interoperability</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Interoperability'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Laser Type</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Laser Type'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Cooling System</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Cooling System'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Spot Size</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Spot Size'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Performance Testing Report</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Performance Testing Report'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>
                </div>
                {/* End the Medical equipment and devices */}
            </form>
        </div>
    );
};

export default AddProduct;
