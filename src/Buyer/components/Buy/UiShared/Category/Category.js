import React, { useState, useMemo } from "react";
import Select, { components } from "react-select";
import styles from "./category.module.css";
import '../../../SharedComponents/SignUp/signup.css';
import categoryArrays from "../../../../../utils/Category";
import countryList from "react-select-country-list";

const MultiSelectOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
    <label>{children}</label>
  </components.Option>
);

const MultiSelectDropdown = ({ options, value, onChange }) => {
  return (
    <Select
      className={styles.signupFormsSectionsSelect}
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

const AccordionFilter = ({
  isOpen,
  setFilterCategory,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedLevel3Category,
  setSelectedLevel3Category,
}) => {
  const [selectedCountries, setSelectedCountries] = useState([]);

  const countryOptions = useMemo(() =>
    countryList().getData().map(country => ({
      value: country.value, // e.g., "US"
      label: country.label // e.g., "United States"
    })),
    []);

  const categoryOptions = categoryArrays.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  const getCategorySchema = (category) => {
    if (!category) return null;
    return categoryArrays.find((cat) => cat.name === category)?.schema || null;
  };

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
      (cat) => cat.name === selectedCategory?.label
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

  const handleApply = () => {
    const filterData = {
      category: getCategorySchema(selectedCategory?.label) || "",
      subCategory: selectedSubCategory?.label || "",
      level3Category: selectedLevel3Category?.label || "",
      countries: selectedCountries.map(country => country.label) || [] // Use country.label for full names
    };
    setFilterCategory(filterData);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedLevel3Category(null);
    setSelectedCountries([]);
    setFilterCategory(null);
  };

  const isFilterSelected =
    selectedCategory || selectedSubCategory || selectedLevel3Category || selectedCountries.length > 0;

  return (
    <div className={styles.filterWrapper}>
      <div
        className={`${styles.accordionContent} ${isOpen ? styles.open : ""}`}
      >
        <div className={styles.filterContainer}>
          <div className={styles.filterSection}>
            <label>Countries Where Stock Traded</label>
            <MultiSelectDropdown
              options={countryOptions}
              value={selectedCountries}
              onChange={(selectedOptions) => {
                setSelectedCountries(selectedOptions || []);
              }}
            />
          </div>
          <div className={styles.filterSection}>
            <label>Product Category</label>
            <Select
              className={styles.reactSelect}
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
          <div className={styles.filterSection}>
            <label>Product Sub Category</label>
            <Select
              className={styles.reactSelect}
              options={
                selectedCategory ? getSubCategories(selectedCategory.label) : []
              }
              value={selectedSubCategory}
              onChange={(selectedOption) => {
                setSelectedSubCategory(selectedOption);
                setSelectedLevel3Category(null);
              }}
              placeholder="Select Sub Category"
              isDisabled={!selectedCategory}
            />
          </div>
          <div className={styles.filterSection}>
            <label>Product Sub Category (Level 3)</label>
            <Select
              className={styles.reactSelect}
              options={
                selectedSubCategory
                  ? getLevel3Categories(selectedSubCategory.value)
                  : []
              }
              value={selectedLevel3Category}
              onChange={(selectedOption) => {
                setSelectedLevel3Category(selectedOption);
              }}
              placeholder="Select Level 3 Category"
              isDisabled={!selectedSubCategory}
            />
          </div>
        </div>
        {isFilterSelected && (
          <div className={styles.buttonSection}>
            <button className={styles.applyButton} onClick={handleApply}>
              Apply
            </button>
            <button className={styles.resetButton} onClick={handleReset}>
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionFilter;