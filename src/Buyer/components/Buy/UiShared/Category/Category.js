import React, { useState } from "react";
import Select from "react-select";
import styles from "./category.module.css";
import categoryArrays from "../../../../../utils/Category";

const AccordionFilter = ({
  isOpen,
  toggleAccordion,
  setFilterCategory,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedLevel3Category,
  setSelectedLevel3Category,
}) => {
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubCategory, setSelectedSubCategory] = useState(null);
//   const [selectedLevel3Category, setSelectedLevel3Category] = useState(null);

  // Define category options from categoryArrays
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
    };
    setFilterCategory(filterData);
    // Add your apply filter logic here
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedLevel3Category(null);
    setFilterCategory(null);
  };

  const isFilterSelected =
    selectedCategory || selectedSubCategory || selectedLevel3Category;

  return (
    <div className={styles.filterWrapper}>
      <div
        className={`${styles.accordionContent} ${isOpen ? styles.open : ""}`}
      >
        <div className={styles.filterContainer}>
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
