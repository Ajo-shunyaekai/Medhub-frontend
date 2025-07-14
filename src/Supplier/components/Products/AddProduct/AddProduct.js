import React, { useState, useEffect, useRef, useMemo } from "react";
import "../../../assets/style/react-input-phone.css";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "./ProductDescriptionEditor";
import Select, { components } from "react-select";
import countryList from "react-select-country-list";
import DatePicker from "react-date-picker";
import CloseIcon from "@mui/icons-material/Close";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { Chips } from "primereact/chips";
import "./addproduct.css";
import "../../SharedComponents/Signup/signup.css";
import styles from "./addproduct.module.css";
import categoryArrays, { categoriesData } from "../../../../utils/Category";
import { Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import Tooltip from "../../SharedComponents/Tooltip/Tooltip";
import {
  addProduct,
  previewBulkProducts,
} from "../../../../redux/reducers/productSlice";
import ComplianceNCertification from "./ComplianceNCertification";
import moment from "moment";
import {
  Options,
  packagingUnits,
  volumeUnits,
  dimensionUnits,
  packagingOptions,
  materialOptions,
  conditionOptions,
  stockOptions,
  quantityOptions,
  stockQuantityOptions,
  pharmaOptions,
  skinhairOptions,
  vitalHealthOptions,
  moistureOptions,
  dermatologistOptions,
  pediatricianOptions,
  frameOptions,
  lensOptions,
  lensmaterialOptions,
  dairyfeeOptions,
  initialValues,
  addProductValidationSchema,
  strengthOptions,
} from "./DropDowns";
import { FiUploadCloud } from "react-icons/fi";
import FileUploadModal from "../../SharedComponents/FileUploadModal/FileUploadModal";
import { AddProductFileUpload } from "../../../../utils/helper";
import AddProductAddOtherDetailsFileUpload from "./AddProductAddOtherDetailsFileUpload";
 
const MultiSelectOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
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
 

const MultiSelectWithSelectAllOption = ({ children, ...props }) => {
  const { data, selectProps } = props;

  const isSelectAll = data.value === "Select All";
  const allOptions = selectProps.options.filter(
    (opt) => opt.value !== "Select All"
  );
  const selectedOptions = selectProps.value || [];

  const isAllSelected =
    selectedOptions.length === allOptions.length &&
    allOptions.every((opt) =>
      selectedOptions.some((selected) => selected.value === opt.value)
    );

  const isChecked = isSelectAll ? isAllSelected : props.isSelected;

  return (
    <components.Option {...props}>
      <input type="checkbox" checked={isChecked} readOnly />
      <label style={{ marginLeft: 8 }}>{children}</label>
    </components.Option>
  );
};


const MultiSelectWithSelectAllDropdown = ({
  options,
  value,
  setFieldValue,
  fieldName,
}) => {
  const isAllSelected = value?.length === options.length;

  const handleChange = (selectedOptions) => {
    const isSelectAllClicked = selectedOptions?.some(
      (option) => option.value === "Select All"
    );

    if (isSelectAllClicked) {
      if (isAllSelected) {
        setFieldValue(fieldName, []);
      } else {
        const allValues = options.map((opt) => opt.value);
        setFieldValue(fieldName, allValues);
      }
    } else {
      const selectedValues = selectedOptions
        ?.filter((opt) => opt.value !== "Select All")
        .map((opt) => opt.value);
      setFieldValue(fieldName, selectedValues);
    }
  };

  const selectedOptionObjects = options.filter((opt) =>
    value?.includes(opt.value)
  );

  const fullOptions = [
    { label: "Select All", value: "Select All" },
    ...options,
  ];

  return (
    <Select
      options={fullOptions}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{ Option: MultiSelectWithSelectAllOption }}
      onChange={handleChange}
      value={selectedOptionObjects}
    />
  );
};



const AddProduct = ({ placeholder }) => {
  const defaultValues = "Speak to the supplier for more info";
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { supplierId } = useParams();
  const [loading, setLoading] = useState(false);
  const productValidationSchema = addProductValidationSchema;
  const [productType, setProductType] = useState(null);
  const [value, setValue] = useState([]);
  const [inventoryStockedCountries, setInventoryStockedCountries] = useState(
    []
  );
  const [checked, setChecked] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedLevel3Category, setSelectedLevel3Category] = useState(null);
  const [countries, setCountries] = useState([]);
  const [inventoryList, setInventoryList] = useState([{}]);
  // const [stockedInDetails, setStockedInDetails] = useState([
  //   {
  //     country: "",
  //     quantity: "",
  //     placeholder: "Enter Quantity",
  //   },
  // ]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [otherMaterial, setOtherMaterial] = useState("");
  const [dermatologistTested, setDermatologistTested] = useState(null);
  const [pediatricianRecommended, setPediatricianRecommended] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
 
  const handleSelectFile = (file) => {
    setSelectedFile(file);
  };
 
  // Start the checked container
 
  const handleCheckboxChange = (id, vallue) => {
    setChecked((prev) => ({
      ...prev,
      [id]: vallue,
    }));
  };
 
  const handleInputChange = (
    e,
    setFieldValue,
    textLimit = 15,
    allowedType = "all",
    restrictSpecialForFields = [],
    allowedSpecialChars = ""
  ) => {
    let { value, name } = e.target;
 
    // Apply character limit
    value = value.slice(0, Number(textLimit));
 
    // Dimension field validation
    if (name === "dimension") {
      // Allow only numbers, "x", and "."
      value = value.replace(/[^0-9x.]/g, "")?.toLowerCase();
 
      // Prevent multiple consecutive "x"
      value = value.replace(/x{2,}/g, "x");
 
      // Split the values by "x" while keeping their sequence
      const parts = value?.split("x").map((part, index) => {
        // Allow up to 5 digits before decimal and 2 after
        part = part.replace(/^(\d{1,5})\.(\d{0,2}).*/, "$1.$2");
 
        // Ensure only one decimal per number
        part = part.replace(/(\..*)\./g, "$1");
 
        return part;
      });
 
      // Join back using "x" but ensure it doesn't remove already typed "x"
      value = parts.join("x");
 
      setFieldValue(name, value);
      return;
    }
 
    // Restrict input type
    if (allowedType === "number") {
      value = value.replace(/[^0-9]/g, ""); // Allow only numbers
    } else if (allowedType === "text") {
      value = value.replace(/[^a-zA-Z\s]/g, ""); // Allow only text and spaces
    } else if (
      allowedType === "all" &&
      restrictSpecialForFields.includes(name)
    ) {
      // Allow "-" in "brand" and "manufacturer"
      const allowedPattern = new RegExp(
        `[^a-zA-Z0-9\\s\\-(${allowedSpecialChars})]`,
        "g"
      );
      value = value.replace(allowedPattern, "");
    } else if (allowedType === "decimal") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }
 
    setFieldValue(name, value);
  };
 
  // End the checked container
  const editor = useRef(null);
  const [content, setContent] = useState("");
 
  // const config = useMemo(
  //   () => ({
  //     readonly: false,
  //     placeholder: placeholder || "Enter Product Description",
  //   }),
  //   [placeholder]
  // );
 
  // useEffect(() => {
  //   const countryOptions = countryList().getData();
  //   setCountries(countryOptions);
  // }, []);
  useEffect(() => {
    const countryOptions = countryList().getData().map((c) => ({
      label: c.label,
      value: c.label,
    }));
    setCountries(countryOptions);
  }, []);
  const categoryOptions = categoryArrays?.map((cat) => {
    return {
      value: cat.schema,
      label: cat.name,
    };
  });
 
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
  const handleBulkUpload = () => {
    if (selectedFile) {
      const bulkFormData = new FormData();
      if(supplierId) {
        bulkFormData.append("supplier_id", supplierId);
      } else {
        bulkFormData.append("supplier_id", localStorage?.getItem("_id"));
      }
      bulkFormData.append("csvfile", selectedFile);
 
      dispatch(previewBulkProducts(bulkFormData)).then((response) => {
        if (response?.meta.requestStatus === "fulfilled") {
          if(supplierId) {
            navigate(`/admin/supplier/${supplierId}/preview-file`);
          } else {
            navigate("/supplier/preview-file");
          }
          
        }
      });
    }
  };
 
  const handleCancel = () => {
    if(supplierId) {
      navigate(`/admin/supplier/${supplierId}/products/new`);
    } else {
      navigate("/supplier/product")
    }
    ;
  };
 
  // Handlers for Stocked in Details
  const addStockedInSection = (setFieldValue, values) => {
    setFieldValue("stockedInDetails", [
      ...values.stockedInDetails,
      { country: "", quantity: "", type: "Box" },
    ]);
  };
 
  const handleStockedInCountryChange = (index, selected, setFieldValue) => {
    setFieldValue(`stockedInDetails[${index}].country`, selected?.label || "");
  };
 
  const handleStockedInputChange = (index, e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFieldValue(`stockedInDetails[${index}].quantity`, value);
  };
 
  const handlePackageSelection = (index, type, setFieldValue) => {
    setFieldValue(`stockedInDetails[${index}].type`, type);
  };
 
  const removeStockedInFormSection = (index, setFieldValue, values) => {
    const updatedList = values.stockedInDetails.filter((_, i) => i !== index);
    setFieldValue("stockedInDetails", updatedList);
  };
 
  // Handlers for Add Other Details
  const addcategoryDetailsSection = (setFieldValue, values) => {
    setFieldValue("categoryDetails", [
      ...values.categoryDetails,
      {
        name: undefined,
        label: undefined,
        placeholder: undefined,
        type: undefined,
        maxLimit: undefined,
        allowedType: undefined,
        fieldValue: undefined,
      },
    ]);
  };
 
  const handlecategoryDetailsNameChange = (index, selected, setFieldValue) => {
    setFieldValue(`categoryDetails[${index}].name`, selected?.value || "");
    setFieldValue(`categoryDetails[${index}].label`, selected?.label || "");
    setFieldValue(
      `categoryDetails[${index}].placeholder`,
      selected?.placeholder || ""
    );
    setFieldValue(`categoryDetails[${index}].type`, selected?.type || "");
    setFieldValue(
      `categoryDetails[${index}].maxLimit`,
      selected?.maxLimit || ""
    );
    setFieldValue(
      `categoryDetails[${index}].allowedType`,
      selected?.allowedType || ""
    );
    setFieldValue(
      `categoryDetails[${index}].fieldValue`,
      selected?.fieldValue || ""
    );
    setFieldValue(
      `categoryDetails[${index}].optionsDD`,
      selected?.optionsDD || []
    );
  };
 
  const handlecategoryDetailsFieldValueChange = (index, e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue(`categoryDetails[${index}].fieldValue`, value);
  };
 
  const removecategoryDetailsFormSection = (index, setFieldValue, values) => {
    const updatedList = values.categoryDetails.filter((_, i) => i !== index);
    setFieldValue("categoryDetails", updatedList);
  };
 
  // Handlers for FAQs
  const addFAQs = (setFieldValue, values) => {
    setFieldValue("faqs", [...values.faqs, { ques: "", ans: "" }]);
  };
 
  const handleFaqsQuesChange = (index, e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue(`faqs[${index}].ques`, value || "");
  };
 
  const handleFaqsAnsChange = (index, e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue(`faqs[${index}].ans`, value || "");
  };
 
  const removeFaqFormSection = (index, setFieldValue, values) => {
    const updatedList = values.faqs.filter((_, i) => i !== index);
    setFieldValue("faqs", updatedList);
  };
 
  return (
    <div className={styles.container}>
      <div className={styles.headContainer}>
        <span className={styles.heading}>Add Products</span>
        <button onClick={() => setOpen(true)} className={styles.bulkButton}>
          Bulk Upload
        </button>
      </div>
 
      <Formik
        initialValues={initialValues}
        validationSchema={productValidationSchema}
        validateOnBlur={true}
        onSubmit={(values) => {
          setLoading(true);
          // Create a new FormData object
          const formData = new FormData();
 
          // Append fields as usual
          Object.keys(values).forEach((key) => {
            const value = values[key];
            if (
              key != "productPricingDetails" ||
              key != "categoryDetails" ||
              key != "faqs" ||
              key != "stockedInDetails" ||
              key != "cNCFileNDate"
            ) {
              if (Array.isArray(value)) {
                // Append array items under the same key
                value.forEach((item, index) => {
                  // If it's a file, append it with its index (to ensure uniqueness)
                  if (item instanceof File) {
                    formData.append(key, item); // appends the file
                  } else {
                    formData.append(key, item); // appends non-file array items
                  }
                });
              } else {
                formData.append(key, value); // Append regular fields
              }
            }
          });
          if(supplierId) {
            formData.append("supplier_id", supplierId);
          } else {
            formData.append("supplier_id", localStorage?.getItem("_id"));
          }
          // formData.append("supplier_id", localStorage?.getItem("_id"));
 
          const stockedInDetailsUpdated = JSON.stringify(
            values?.stockedInDetails?.map((section) => ({
              country: section?.country || "",
              quantity: section?.quantity || "",
              type: section?.type || "",
            }))
          );
 
          const productPricingDetailsUpdated = JSON.stringify(
            values?.productPricingDetails?.map((section) => ({
              price: section?.price || "",
              totalPrice: section?.totalPrice || "",
              // quantity: section?.quantity || "",
              quantityFrom: section?.quantityFrom || "",
              quantityTo: section?.quantityTo || "",
              deliveryTime: section?.deliveryTime || "",
            }))
          );
 
          const cNCFileNDateUpdated = JSON.stringify(
            values?.cNCFileNDate?.map((section) => ({
              date: section?.date || "",
              file: section?.file?.[0] || "",
            })) || [
              {
                date: "",
                file: "",
              },
            ]
          );
          const cNCFileNDateUpdated2 = values?.cNCFileNDate?.map((section) => ({
            date: section?.date || "",
            file: section?.file?.[0] || "",
          })) || [
            {
              date: "",
              file: "",
            },
          ];
 
          formData.append("stockedInDetails", stockedInDetailsUpdated);
          formData.append(
            "productPricingDetails",
            productPricingDetailsUpdated
          );
          if (
            JSON.stringify(values?.complianceFile) !=
            JSON.stringify(cNCFileNDateUpdated2?.map((file) => file?.file))
          ) {
            // fisetFieldValue("complianceFile", []);
            cNCFileNDateUpdated2?.forEach((file) =>
              formData.append("complianceFile", file?.file)
            );
          }
 
          const categoryDetailsUpdated = JSON.stringify(
            values?.categoryDetails?.map((section) => ({
              name: section?.name || "",
              type: section?.type || "",
              fieldValue:
                section?.type == "file"
                  ? section?.fieldValue?.[0]
                  : section?.fieldValue || "",
            })) || [
              {
                name: "",
                type: "",
                fieldValue: "",
              },
            ]
          );
          const categoryDetailsUpdated2 = values?.categoryDetails?.map(
            (section) => ({
              name: section?.name || "",
              type: section?.type || "",
              fieldValue:
                section?.type == "file"
                  ? section?.fieldValue?.[0]
                  : section?.fieldValue || "",
            })
          ) || [
            {
              name: "",
              type: "",
              fieldValue: "",
            },
          ];
 
          if (
            JSON.stringify(values?.categoryDetailsFile) !=
            JSON.stringify(
              categoryDetailsUpdated2?.map((file) => file?.fieldValue)
            )
          ) {
            // fisetFieldValue("categoryDetailsFile", []);
            categoryDetailsUpdated2?.forEach((file) =>
              formData.append("categoryDetailsFile", file?.fieldValue)
            );
          }
 
          // const faqsUpdated = JSON.stringify(
          //   values?.faqs?.map((section) => ({
          //     ques: section?.ques || "",
          //     ans: section?.ans || "",
          //   })) || []
          // );
          const faqsFiltered = values?.faqs?.filter(
            (section) => section?.ques?.trim() || section?.ans?.trim()
          ) || [];
          
          const faqsUpdated = JSON.stringify(
            faqsFiltered.map((section) => ({
              ques: section?.ques || "",
              ans: section?.ans || "",
            }))
          );
          formData.append("cNCFileNDate", cNCFileNDateUpdated);
          categoryDetailsUpdated?.length > 0 &&
            formData.append("categoryDetails", categoryDetailsUpdated);
          // values?.faqs?.length > 0 && formData.append("faqs", faqsUpdated);
          formData.append("faqs", faqsUpdated.length > 0 ? faqsUpdated : JSON.stringify([]));
          // formData.append(
          //   "tags",
          //   values?.tags?.includes(",")
          //     ? values?.tags?.split(",")
          //     : values?.tags
          // );

          dispatch(addProduct(formData)).then((response) => {
            if (response?.meta.requestStatus === "fulfilled") {
              if(supplierId) {
                navigate(`/admin/supplier/${supplierId}/products/new`);
              } else {
                navigate("/supplier/product");
              }
              setLoading(false);
            }
            setLoading(false);
          });
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          touched,
          errors,
          useFormikContext,
        }) => (
          <Form className={styles.form}>
            <div className={styles.section}>
              <span className={styles.formHead}>General Information</span>
              <div className={styles.formSection}>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Name<span className={styles.labelStamp}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Product Name"
                    // autoComplete="off"
                    name="name"
                    value={values.name}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        setFieldValue,
                        100,
                        "all",
                        ["name"],
                        "&"
                      )
                    }
                    onBlur={handleBlur}
                  />
                  {touched.name && errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </div>
 
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Market<span className={styles.labelStamp}>*</span>
                  </label>
                  <Select
                    className={styles.formSelect}
                    options={Options}
                    placeholder="Select Product Market"
                    onChange={(selectedOption) => {
                      setProductType(selectedOption?.value);
                      setFieldValue(
                        "market",
                        selectedOption?.value?.replaceAll(" product", "")
                      );
                    }}
                  />
                  {touched.market && errors.market && (
                    <span className={styles.error}>{errors.market}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Category<span className={styles.labelStamp}>*</span>
                  </label>
                  <Select
                    className={styles.formSelect}
                    options={categoryOptions}
                    value={selectedCategory}
                    onBlur={handleBlur}
                    onChange={(selectedOption) => {
                      setFieldValue("category", selectedOption?.value);
                      setSelectedCategory(selectedOption);
 
                      // Clear all related fields
                      setFieldValue("subCategory", "");
                      setSelectedSubCategory(null);
 
                      setFieldValue("anotherCategory", "");
                      setSelectedLevel3Category(null);
 
                      setFieldValue("categoryDetails", [
                        { name: "", fieldValue: "", type: "" },
                      ]);
                    }}
                    placeholder="Select Category"
                  />
                  {touched.category && errors.category && (
                    <span className={styles.error}>{errors.category}</span>
                  )}
                </div>
 
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Sub Category
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <Select
                    className={styles.formSelect}
                    options={
                      selectedCategory
                        ? getSubCategories(selectedCategory.label)
                        : []
                    }
                    value={selectedSubCategory}
                    onBlur={handleBlur}
                    onChange={(selectedOption) => {
                      setSelectedSubCategory(selectedOption);
                      setSelectedLevel3Category(null);
                      setFieldValue("subCategory", selectedOption?.value);
                    }}
                    placeholder="Select Sub Category"
                    isDisabled={!selectedCategory}
                  />
                  {touched.subCategory && errors.subCategory && (
                    <span className={styles.error}>{errors.subCategory}</span>
                  )}
                </div>
 
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Sub Category (Level 3)
                    <span className={styles.labelStamp2}>*</span>
                  </label>
                  <Select
                    className={styles.formSelect}
                    onBlur={handleBlur}
                    options={
                      selectedSubCategory
                        ? getLevel3Categories(selectedSubCategory.value)
                        : []
                    }
                    value={selectedLevel3Category}
                    onChange={(selectedOption) => {
                      setSelectedLevel3Category(selectedOption);
                      setFieldValue("anotherCategory", selectedOption?.value);
                    }}
                    placeholder="Select Level 3 Category"
                    isDisabled={!selectedSubCategory}
                  />
                </div>
                {productType === "secondary" && (
                  <>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Purchased On<span className={styles.labelStamp}>*</span>
                      </label>
 
                      <DatePicker
                        className={styles.formDate}
                        clearIcon={null}
                        format="dd/MM/yyyy"
                        placeholder="dd/MM/yyyy"
                        name="purchasedOn"
                        value={values.purchasedOn}
                        maxDate={new Date()}
                        onChange={(date) => {
                          setFieldValue("purchasedOn", date); // This updates Formik's value
                        }}
                        onBlur={handleBlur} // Adds the blur event to track when the field is blurred
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                      {touched.purchasedOn && errors.purchasedOn && (
                        <span className={styles.error}>
                          {errors.purchasedOn}
                        </span>
                      )}
                    </div>
 
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Condition<span className={styles.labelStamp}>*</span>
                      </label>
                      <Select
                        className={styles.formSelect}
                        options={conditionOptions}
                        placeholder="Select Condition"
                        onBlur={handleBlur}
                        onChange={(selectedOption) => {
                          setFieldValue("condition", selectedOption?.value);
                        }}
                      />
                      {touched.condition && errors.condition && (
                        <span className={styles.error}>{errors.condition}</span>
                      )}
                    </div>
 
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Country Available In
                        <span className={styles.labelStamp}>*</span>
                      </label>
 
                      <MultiSelectDropdown
                        options={countries}
                        placeholderButtonLabel="Select Countries"
                        name="countryAvailable"
                        onChange={(selectedOptions) => {
                          // Ensure we map selected options correctly
                          const selectedValues = selectedOptions
                            ? selectedOptions.map((option) => option.label)
                            : [];
                          setFieldValue("countryAvailable", selectedValues); // Update Formik value with the selected country values
                        }}
                        onBlur={handleBlur} // Optional: add this if the component has a blur event
                      />

                    {/* <MultiSelectWithSelectAllDropdown
                             options={countries}
                             value={values.countryAvailable}
                             setFieldValue={setFieldValue}
                             fieldName="countryAvailable"
                            /> */}
 
                      {touched.countryAvailable && errors.countryAvailable && (
                        <span className={styles.error}>
                          {errors.countryAvailable}
                        </span>
                      )}
                    </div>
                  </>
                )}
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Minimum Order Quantity
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Minimum Order Quantity"
                    // autoComplete="off"
                    name="minimumPurchaseUnit"
                    value={values.minimumPurchaseUnit}
                    onChange={(e) =>
                      handleInputChange(e, setFieldValue, 4, "number")
                    }
                    onBlur={handleBlur}
                  />
                  {touched.minimumPurchaseUnit &&
                    errors.minimumPurchaseUnit && (
                      <span className={styles.error}>
                        {errors.minimumPurchaseUnit}
                      </span>
                    )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Strength<span className={styles.labelStamp2}>*</span>
                  </label>
                  <div className={styles.weightContainer}>
                    <div className={styles.weightSection}>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Strength"
                          // autoComplete="off"
                          name="strength"
                          value={values.strength}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>
                    <div className={styles.unitSection}>
                      <Select
                        className={styles.formSelect}
                        name="strengthUnit"
                        options={strengthOptions}
                        placeholder="Select Units"
                        onBlur={handleBlur}
                        onChange={(selectedOption) => {
                          setFieldValue("strengthUnit", selectedOption?.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    UPC (Universal Product Code)
                    <span className={styles.labelStamp2}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter UPC"
                    // autoComplete="off"
                    name="upc"
                    value={values.upc}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        setFieldValue,
                        20,
                        "all",
                        ["upc"],
                        "-"
                      )
                    }
                    onBlur={handleBlur}
                  />
                  <span className={styles.error}></span>
                </div>
 
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Part/Model Number
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Part/Model Number"
                    // autoComplete="off"
                    name="model"
                    value={values.model}
                    onChange={(e) =>
                      handleInputChange(e, setFieldValue, 20, "all")
                    }
                    onBlur={handleBlur}
                  />
                  {touched.model && errors.model && (
                    <span className={styles.error}>{errors.model}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Brand Name<span className={styles.labelStamp2}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Brand Name"
                    // autoComplete="off"
                    name="brand"
                    value={values.brand}
                    onChange={(e) =>
                      handleInputChange(e, setFieldValue, 75, "all", ["brand"])
                    }
                    onBlur={handleBlur}
                  />
                  <span className={styles.error}></span>
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Type/Form
                    <span className={styles.labelStamp2}>*</span>
                    {/* <span className={styles.labelStamp}>*</span> */}
                  </label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Product Type/Form"
                      // autoComplete="off"
                      name="form"
                      value={values.form}
                      onChange={(e) =>
                        handleInputChange(e, setFieldValue, 50, "text")
                      }
                      onBlur={handleBlur}
                    />
                    <Tooltip
                      content=" The type of product (e.g., tablet, liquid, cream,
                      ointment, Surgical, Needle Type, Syringe, Type of monitor,
                      systems, devices, mobility or platforms,
                      wheelchair, walker, cane, crutches, grab bar, scooter
                      etc)."
                    ></Tooltip>
                  </div>
                  {/* {touched.form && errors.form && (
                    <span className={styles.error}>{errors.form}</span>
                  )} */}
                </div>
 
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Tax%
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Tax in percentage"
                      // autoComplete="off"
                      name="unit_tax"
                      value={values.unit_tax}
                      onChange={(e) =>
                        handleInputChange(e, setFieldValue, 9, "decimal", [
                          "unit_tax",
                        ])
                      }
                      onBlur={handleBlur}
                    />
                    <Tooltip content="Unit Tax of the product"></Tooltip>
                  </div>
                  {touched.unit_tax && errors.unit_tax && (
                    <span className={styles.error}>{errors.unit_tax}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Storage Conditions
                    <span className={styles.labelStamp2}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Storage Conditions"
                      // autoComplete="off"
                      name="storage"
                      onChange={(e) =>
                        handleInputChange(e, setFieldValue, 75, "all")
                      }
                      onBlur={handleBlur}
                    />
                    <Tooltip content="Recommended storage (e.g., store in a cool, dry place)"></Tooltip>
                  </div>
                </div>
                <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Buyers Preferred From
                      <span className={styles.labelStamp}>*</span>
                    </label>
 
                      {/* <MultiSelectDropdown
                        options={countries}
                        placeholderButtonLabel="Select Countries"
                        name="countryAvailable"
                        onChange={(selectedOptions) => {
                          // Ensure we map selected options correctly
                          const selectedValues = selectedOptions
                            ? selectedOptions.map((option) => option.label)
                            : [];
                          setFieldValue("countryAvailable", selectedValues); // Update Formik value with the selected country values
                        }}
                        onBlur={handleBlur} // Optional: add this if the component has a blur event
                      /> */}

                         <MultiSelectWithSelectAllDropdown
                             options={countries}
                             value={values.buyersPreferredFrom}
                             setFieldValue={setFieldValue}
                             fieldName="buyersPreferredFrom"
                          />
 
                      {touched.buyersPreferredFrom && errors.buyersPreferredFrom && (
                        <span className={styles.error}>
                          {errors.buyersPreferredFrom}
                        </span>
                      )}
                    </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Tags
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Tags"
                    // autoComplete="off"
                    name="tags"
                    value={values.tags}
                    onChange={(e) =>
                      handleInputChange(e, setFieldValue, 75, "all")
                    }
                    onBlur={handleBlur}
                    // error={errors.tags}
                  />
                  {touched.tags && errors.tags && (
                    <span className={styles.error}>{errors.tags}</span>
                  )}
                </div>

                
                <div className={styles.productTextContainer}>
                  <label className={styles.formLabel}>
                    Product Description
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <textarea
                    className={styles.formInput}
                    type="text"
                    name="description"
                    rows={5}
                    placeholder="Enter Description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={() => handleBlur}
                    error={errors.description}
                  />
                  {touched.description && errors.description && (
                    <span className={styles.error}>{errors.description}</span>
                  )}
                </div>
 
                {/* <RichTextEditor
                  label="Product Description"
                  name="description"
                  value={values.description}
                  onChange={(content) => setFieldValue("description", content)}
                  onBlur={() => handleBlur({ target: { name: "description" } })}
                  error={errors.description}
                  touched={touched.description}
                  height={300}
                /> */}
              </div>
            </div>
 
            {/* Start the manufacturer */}
 
            <div className={styles.section}>
              <span className={styles.formHead}>Manufacturer Details</span>
              <div className={styles.formSection}>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Manufacturer Name
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Manufacturer Name"
                    autoComplete="off"
                    name="manufacturer"
                    value={values.manufacturer}
                    onBlur={handleBlur}
                    onChange={(e) =>
                      handleInputChange(e, setFieldValue, 75, "all", [
                        "manufacturer",
                      ])
                    }
                  />
                  {touched.manufacturer && errors.manufacturer && (
                    <span className={styles.error}>{errors.manufacturer}</span>
                  )}
                </div>
 
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Manufacturer Country of Origin
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <Select
                    name="originCountry"
                    options={countries}
                    placeholder="Select Country of Origin"
                    autoComplete="off"
                    onBlur={handleBlur}
                    onChange={(selectedOption) => {
                      setFieldValue("countryOfOrigin", selectedOption.label);
                    }}
                  />
                  {touched.countryOfOrigin && errors.countryOfOrigin && (
                    <span className={styles.error}>
                      {errors.countryOfOrigin}
                    </span>
                  )}
                </div>
 
                <div className={styles.productTextContainer}>
                  <label className={styles.formLabel}>
                    About Manufacturer
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <textarea
                    className={styles.formInput}
                    type="text"
                    rows={4}
                    placeholder="Enter About Manufacturer"
                    value={values.aboutManufacturer}
                    name="aboutManufacturer"
                    onBlur={handleBlur}
                    onChange={(e) =>
                      handleInputChange(e, setFieldValue, 500, "all")
                    }
                  />
                  {touched.aboutManufacturer && errors.aboutManufacturer && (
                    <span className={styles.error}>
                      {errors.aboutManufacturer}
                    </span>
                  )}
                </div>
              </div>
            </div>
 
            {/* End the manufacturer */}
 
            {/* Start the Add Other Details */}
            <div className={styles.section}>
              {/* {inventoryStockedCountries?.length > 0 ? ( */}
              <div className={styles.Stocksection}>
                <div className={styles.formHeadSection}>
                  <span className={styles.formHead}>
                    {/* Add Other Details of{" "}
                    {
                      categoriesData?.find(
                        (cat) => cat?.schema === values?.category
                      )?.name
                    } */}
                    Add Other Details{" "}
                    {categoriesData?.find(
                      (cat) => cat?.schema === values?.category
                    )?.name
                      ? `of ${
                          categoriesData.find(
                            (cat) => cat?.schema === values?.category
                          )?.name
                        }`
                      : ""}
                  </span>
                  {values?.category && (
                    <span
                      className={styles.formAddButton}
                      onClick={() =>
                        addcategoryDetailsSection(setFieldValue, values)
                      }
                    >
                      Add More
                    </span>
                  )}
                </div>
                {values?.category ? (
                  values?.categoryDetails?.map((section, index) => {
                    // Get category options
                    const categoryOptions =
                      categoriesData
                        ?.find((cat) => cat?.schema === values?.category)
                        ?.options?.map((option) => ({
                          ...option,
                          label: option?.label,
                          value: option?.name,
                        })) || [];
 
                    // Match the selected option by value (not label)
                    const selectedOption = categoryOptions.find(
                      (opt) => opt.value === section.name
                    );
                    return (
                      <>
                        <div
                          key={`stocked_${index}`}
                          className={styles.stockedContainer2}
                        >
                          <div className={styles.stockedSection}>
                            <div className={styles.StockedDiv}>
                              <label className={styles.formLabel}>
                                Parameter Name
                                {/* <span className={styles.labelStamp}>*</span> */}
                              </label>
                              <Select
                                className={styles.formSelect}
                                value={selectedOption || null}
                                onChange={(selected) =>
                                  handlecategoryDetailsNameChange(
                                    index,
                                    selected,
                                    setFieldValue
                                  )
                                }
                                options={
                                  categoriesData
                                    ?.find(
                                      (cat) => cat?.schema == values?.category
                                    )
                                    ?.options?.map((option) => ({
                                      ...option,
                                      label: option?.label,
                                      value: option?.name,
                                    })) || []
                                }
                                placeholder="Select Parameter Name"
                                name={`categoryDetails.${index}.name`}
                                onBlur={() =>
                                  setFieldTouched(
                                    `categoryDetails.${index}.name`,
                                    true
                                  )
                                }
                              />
                              {touched.categoryDetails?.[index]?.name &&
                                errors.categoryDetails?.[index]?.name && (
                                  <span span className={styles.error}>
                                    {errors.categoryDetails[index].name}
                                  </span>
                                )}
                            </div>
                            {section?.name ? (
                              <div className={styles.StockedDivQuantity}>
                                <label className={styles.formLabel}>
                                  Parameter Description
                                  {/* <span className={styles.labelStamp}>*</span> */}
                                </label>
                                <div className={styles.quantitySelector}>
                                  <div className={styles.inputGroup}>
                                    {section?.type == "text" ? (
                                      <input
                                        type="text"
                                        name={`categoryDetails.${index}.fieldValue`}
                                        onChange={(e) =>
                                          handlecategoryDetailsFieldValueChange(
                                            index,
                                            e,
                                            setFieldValue
                                          )
                                        }
                                        value={section.fieldValue}
                                        placeholder={section?.placeholder}
                                        className={styles.inputStocked}
                                        onBlur={() =>
                                          setFieldTouched(
                                            `categoryDetails.${index}.fieldValue`,
                                            true
                                          )
                                        }
                                      />
                                    ) : section?.type == "textarea" ? (
                                      <textarea
                                        className={styles.inputStocked}
                                        type="text"
                                        placeholder={section?.placeholder}
                                        // autoComplete="off"
                                        name={`categoryDetails.${index}.fieldValue`}
                                        value={section?.fieldValue}
                                        onChange={(e) =>
                                          handlecategoryDetailsFieldValueChange(
                                            index,
                                            e,
                                            setFieldValue
                                          )
                                        }
                                        onBlur={() =>
                                          setFieldTouched(
                                            `categoryDetails.${index}.fieldValue`,
                                            true
                                          )
                                        }
                                      />
                                    ) : section?.type == "dropdown" ? (
                                      <Select
                                        className={styles.formSelect}
                                        options={section?.optionsDD}
                                        placeholder={section?.placeholder}
                                        name={`categoryDetails.${index}.fieldValue`}
                                        onBlur={handleBlur}
                                        onChange={(selectedOption) =>
                                          setFieldValue(
                                            `categoryDetails.${index}.fieldValue`,
                                            selectedOption.value
                                          )
                                        }
                                      />
                                    ) : section?.type == "checkbox" ? (
                                      <div className={styles.radioGroup2}>
                                        {["true", "false"].map((option) => (
                                          <label key={option}>
                                            <input
                                              type="radio"
                                              name={`categoryDetails.${index}.fieldValue`}
                                              value={option} // <-- This must be the option value, not section.fieldValue
                                              checked={
                                                section.fieldValue === option
                                              } // checked if value matches
                                              onChange={(e) =>
                                                setFieldValue(
                                                  `categoryDetails.${index}.fieldValue`,
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <span>
                                              {option === "true" ? "Yes" : "No"}
                                            </span>
                                          </label>
                                        ))}
                                      </div>
                                    ) : (
                                      section?.type == "file" && (
                                        <Field
                                          name={`categoryDetails.${index}.fieldValue`}
                                        >
                                          {({ field }) => (
                                            <AddProductAddOtherDetailsFileUpload
                                              fieldInputName={`categoryDetails.${index}.fieldValue`}
                                              setFieldValue={setFieldValue}
                                              initialValues={values}
                                              selectedFile={section?.fieldValue}
                                              preview={true}
                                              fileIndex={index}
                                              isEdit={false}
                                            />
                                          )}
                                        </Field>
                                      )
                                    )}
                                  </div>
                                </div>
                                {
                                  <span span className={styles.error}>
                                    {touched.categoryDetails &&
                                      errors?.categoryDetails?.[index]
                                        ?.fieldValue}
                                  </span>
                                  // )
                                }
                              </div>
                            ) : (
                              <div className={styles.StockedDivQuantity}>
                                <label className={styles.formLabel}>
                                  Parameter Description
                                  {/* <span className={styles.labelStamp}>*</span> */}
                                </label>
                                <div className={styles.quantitySelector}>
                                  <div className={styles.inputGroup}>
                                    <input
                                      type="text"
                                      value={section.fieldValue}
                                      placeholder={
                                        "Please select parameter name first"
                                      }
                                      disabled={true}
                                      className={styles.inputStocked}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div
                            className={styles.formclosebutton}
                            onClick={() =>
                              removecategoryDetailsFormSection(
                                index,
                                setFieldValue,
                                values
                              )
                            }
                          >
                            <CloseIcon className={styles.iconClose} />
                          </div>
                        </div>
                        {values?.categoryDetails?.length > 1 &&
                          index != values?.categoryDetails?.length - 1 && (
                            <div className={styles.stockedContainer3}></div>
                          )}
                      </>
                    );
                  })
                ) : (
                  <div className={styles.stockedContainer}>
                    <label className={styles.formLabel}>
                      Please select category first to add other details of the
                      product.
                    </label>
                  </div>
                )}
              </div>
            </div>
            {/* End the Add Other Details */}
 
            {/* Start the Inventory */}
            <div className={styles.section}>
              {/* <span className={styles.formHead}>Inventory</span>
              <div className={styles.formSection}>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Date of Manufacture
                  </label>
                  <div className={styles.tooltipContainer}>
                    <DatePicker
                      className={styles.formDate}
                      clearIcon={null}
                      format="dd/MM/yyyy"
                      placeholder="dd/MM/yyyy"
                      name="date"
                      maxDate={new Date()}
                      value={values.date}
                      onChange={(date) => {
                        setFieldValue("date", date); // This updates Formik's value
                      }}
                      onBlur={handleBlur} // Adds the blur event to track when the field is blurred
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                    <Tooltip content="The date when the item was assembled or manufactured. if applicable for in stock"></Tooltip>
                  </div>
                  {touched.date && errors.date && (
                    <span className={styles.error}>{errors.date}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>SKU</label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter SKU"
                      // autoComplete="off"
                      name="sku"
                      value={values.sku}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          setFieldValue,
                          20,
                          "all",
                          ["sku"],
                          "-"
                        )
                      }
                      onBlur={handleBlur}
                    />
                    <Tooltip content="Stock-keeping unit for inventory management"></Tooltip>
                  </div>
                  {touched.sku && errors.sku && (
                    <span className={styles.error}>{errors.sku}</span>
                  )}
                </div>
 
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Stock<span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <Select
                      className={styles.formSelect}
                      options={stockOptions}
                      placeholder="Select Stock"
                      name="stock"
                      onBlur={handleBlur}
                      onChange={(selectedOption) =>
                        setFieldValue("stock", selectedOption.value)
                      }
                    />
                    <Tooltip content="If the product is in stock or out of stock or On-demand"></Tooltip>
                  </div>
                  {touched.stock && errors.stock && (
                    <span className={styles.error}>{errors.stock}</span>
                  )}
                </div>
 
              </div> */}
 
              {/* {inventoryStockedCountries?.length > 0 ? ( */}
              <div className={styles.Stocksection}>
                <div className={styles.formHeadSection}>
                  <span className={styles.formHead}> Stocked in Details</span>
                  <span
                    className={styles.formAddButton}
                    onClick={() => addStockedInSection(setFieldValue, values)}
                  >
                    Add More
                  </span>
                </div>
                {values.stockedInDetails.map((section, index) => (
                  <div
                    key={`stocked_${index}`}
                    className={styles.stockedContainer}
                  >
                    <div className={styles.stockedSection}>
                      <div className={styles.StockedDiv}>
                        <label className={styles.formLabel}>
                          Stocked in Country
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <Select
                          className={styles.formSelect}
                          value={countries.find(
                            (option) => option.label === section.country
                          )}
                          onChange={(selected) =>
                            handleStockedInCountryChange(
                              index,
                              selected,
                              setFieldValue
                            )
                          }
                          options={countries}
                          placeholder="Select Stocked in Country"
                          name={`stockedInDetails.${index}.country`}
                          onBlur={() =>
                            setFieldTouched(
                              `stockedInDetails.${index}.country`,
                              true
                            )
                          }
                        />
                        {touched.stockedInDetails?.[index]?.country &&
                          errors.stockedInDetails?.[index]?.country && (
                            <span span className={styles.error}>
                              {errors.stockedInDetails[index].country}
                            </span>
                          )}
                      </div>
                      <div className={styles.StockedDivQuantity}>
                        <label className={styles.formLabel}>
                          Stocked in Quantity
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.quantitySelector}>
                          <div className={styles.inputGroup}>
                            <input
                              type="text"
                              name={`stockedInDetails.${index}.quantity`}
                              onChange={(e) =>
                                handleStockedInputChange(
                                  index,
                                  e,
                                  setFieldValue
                                )
                              }
                              value={section.quantity}
                              placeholder={`Enter ${
                                section.type || "Box"
                              } Quantity`}
                              className={styles.inputStocked}
                              onBlur={() =>
                                setFieldTouched(
                                  `stockedInDetails.${index}.quantity`,
                                  true
                                )
                              }
                            />
                            <button
                              className={`${styles.optionButton} ${
                                section.type === "Box" ? styles.selected : ""
                              }`}
                            >
                              {section.type || "Box"}
                            </button>
                          </div>
                          <div className={styles.radioGroup}>
                            {["Box", "Strip", "Pack", "Unit"].map((option) => (
                              <label key={option}>
                                <input
                                  type="radio"
                                  name={`stockedInDetails[${index}].type`}
                                  value={option}
                                  checked={
                                    section.type === option ||
                                    (!section.type && option === "Box")
                                  }
                                  onChange={() =>
                                    handlePackageSelection(
                                      index,
                                      option,
                                      setFieldValue
                                    )
                                  }
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        {
                          // touched.stockedInDetails?.[index]?.quantity &&
                          //   errors.stockedInDetails?.[index]?.quantity && (
                          <span span className={styles.error}>
                            {touched.stockedInDetails &&
                              errors?.stockedInDetails?.[index]?.quantity}
                          </span>
                          // )
                        }
                      </div>
                    </div>
                    {values.stockedInDetails.length > 1 && (
                      <div
                        className={styles.formclosebutton}
                        onClick={() =>
                          removeStockedInFormSection(
                            index,
                            setFieldValue,
                            values
                          )
                        }
                      >
                        <CloseIcon className={styles.iconClose} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
 
            {/* End the Inventory */}
 
            {/* Start the Product Pricing */}
            <div className={styles.section}>
              <div className={styles.formHeadSection}>
                <span className={styles.formHead}>Product Pricing</span>
                <span
                  className={styles.formAddButton}
                  onClick={() => {
                    setFieldValue("productPricingDetails", [
                      ...values.productPricingDetails,
                      {
                        quantity: "",
                        // quantityTo: "",
                        price: "",
                        totalPrice: "",
                        deliveryTime: "",
                      },
                    ]);
                  }}
                >
                  Add More
                </span>
              </div>
              {values?.productPricingDetails?.map((stock, index) => (
                <div key={`product_${index}`} className={styles.formSection}>
                  <div className={styles.productContainer2}>
                    <div className={styles.productContainer3}>
                      <label className={styles.formLabel}>
                        Quantity From
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <Field
                          name={`productPricingDetails.${index}.quantityFrom`}
                          type="text"
                          placeholder="Enter Quantity From"
                          className={styles.formInput}
                          onBlur={handleBlur}
                          onChange={(e) =>
                            setFieldValue(
                              `productPricingDetails.${index}.quantityFrom`,
                              e.target.value.replace(/\D/g, "") // Allow only numbers
                            )
                          }
                        />
                      </div>
                      <span className={styles.error}>
                        {touched.productPricingDetails?.[index]?.quantityFrom &&
                          errors.productPricingDetails?.[index]?.quantityFrom}
                      </span>
                    </div>
                    <div className={styles.productContainer3}>
                      <label className={styles.formLabel}>
                        Quantity To
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <Field
                          name={`productPricingDetails.${index}.quantityTo`}
                          type="text"
                          placeholder="Enter Quantity To"
                          className={styles.formInput}
                          onBlur={handleBlur}
                          onChange={(e) =>
                            setFieldValue(
                              `productPricingDetails.${index}.quantityTo`,
                              e.target.value.replace(/\D/g, "") // Allow only numbers
                            )
                          }
                        />
                      </div>
                      <span className={styles.error}>
                        {touched.productPricingDetails?.[index]?.quantityTo &&
                          errors.productPricingDetails?.[index]?.quantityTo}
                      </span>
                    </div>
                  </div>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Unit Price
                      <span className={styles.labelStamp}>*</span>
                    </label>
                    <div className={styles.tooltipContainer}>
                      <Field
                        name={`productPricingDetails.${index}.price`}
                        type="text"
                        placeholder="Enter Unit Price in USD"
                        className={styles.formInput}
                        onChange={handleChange}
                        // onInput={(e) => {
                        //   let value = e.target.value;
 
                        //   // Allow only numbers and one decimal point
                        //   value = value.replace(/[^0-9.]/g, "");
 
                        //   // Ensure only one decimal point exists
                        //   if (value?.split(".").length > 2) {
                        //     value = value.slice(0, -1);
                        //   }
 
                        //   // Limit numbers before decimal to 9 digits and after decimal to 3 digits
                        //   let parts = value?.split(".");
                        //   if (parts[0].length > 9) {
                        //     parts[0] = parts[0].slice(0, 9);
                        //   }
                        //   if (parts[1]?.length > 3) {
                        //     parts[1] = parts[1].slice(0, 3);
                        //   }
 
                        //   e.target.value = parts.join(".");
                        //   setFieldValue(
                        //   `productPricingDetails.${index}.totalPrice`,
                        //   e.target.value
                        // )
                        // }}
                      />
                      <Tooltip content="The cost of the medication per unit (MRP) in Dollar"></Tooltip>
                    </div>
                    <span className={styles.error}>
                      {touched.productPricingDetails?.[index]?.price &&
                        errors.productPricingDetails?.[index]?.price}
                    </span>
                  </div>
 
                  {/* <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Total Price
                      <span className={styles.labelStamp}>*</span>
                    </label>
                    <div className={styles.tooltipContainer}>
                      <Field
                        name={`productPricingDetails.${index}.totalPrice`}
                        type="text"
                        placeholder="Enter Total Price in USD"
                        className={styles.formInput}
                        onChange={handleChange}
                        // onInput={(e) => {
                        //   let value = e.target.value;
 
                        //   // Allow only numbers and one decimal point
                        //   value = value.replace(/[^0-9.]/g, "");
 
                        //   // Ensure only one decimal point exists
                        //   if (value?.split(".").length > 2) {
                        //     value = value.slice(0, -1);
                        //   }
 
                        //   // Limit numbers before decimal to 9 digits and after decimal to 3 digits
                        //   let parts = value?.split(".");
                        //   if (parts[0].length > 9) {
                        //     parts[0] = parts[0].slice(0, 9);
                        //   }
                        //   if (parts[1]?.length > 3) {
                        //     parts[1] = parts[1].slice(0, 3);
                        //   }
 
                        //   e.target.value = parts.join(".");
                        //   setFieldValue(
                        //     `productPricingDetails.${index}.totalPrice`,
                        //     e.target.value
                        //   );
                        // }}
                      />
                      <Tooltip content="The cost of the medication total (MRP) in Dollar"></Tooltip>
                    </div>
                    <span className={styles.error}>
                      {touched.productPricingDetails?.[index]?.totalPrice &&
                        errors.productPricingDetails?.[index]?.totalPrice}
                    </span>
                  </div> */}
 
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Est. Shipping Time
                      <span className={styles.labelStamp}>*</span>
                    </label>
                    <Field
                      name={`productPricingDetails.${index}.deliveryTime`}
                      type="text"
                      placeholder="Enter Est. Shipping Time in days"
                      className={styles.formInput}
                      onInput={(e) => {
                        // Allow only alphanumeric characters, spaces, hyphens
                        const value = e.target.value.replace(
                          /[^a-zA-Z0-9 \-]/g,
                          ""
                        );
                        setFieldValue(
                          `productPricingDetails.${index}.deliveryTime`,
                          value
                        );
                      }}
                    />
                    <span className={styles.error}>
                      {touched.productPricingDetails?.[index]?.deliveryTime &&
                        errors.productPricingDetails?.[index]?.deliveryTime}
                    </span>
                  </div>
 
                  {values?.productPricingDetails?.length > 1 && (
                    <div
                      className={styles.formCloseSection}
                      onClick={() => {
                        setFieldValue(
                          `productPricingDetails.${index}.quantity`,
                          ""
                        );
                        setFieldValue(
                          `productPricingDetails.${index}.quantityFrom`,
                          ""
                        );
                        setFieldValue(
                          `productPricingDetails.${index}.quantityTo`,
                          ""
                        );
                        setFieldValue(
                          `productPricingDetails.${index}.price`,
                          ""
                        );
                        setFieldValue(
                          `productPricingDetails.${index}.totalPrice`,
                          ""
                        );
                        setFieldValue(
                          `productPricingDetails.${index}.deliveryTime`,
                          ""
                        );
 
                        // Remove the row from the array
                        const updatedList = values.productPricingDetails.filter(
                          (_, elindex) => elindex !== index
                        );
                        setFieldValue("productPricingDetails", updatedList);
                      }}
                    >
                      <span className={styles.formclose}>
                        <CloseIcon className={styles.icon} />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
 
            {/* End the Product Pricing */}
 
            {/* Start the Compliances and certificate */}
 
            {/* Start the Compliances and certificate 222222222 */}
            <div className={styles.section}>
              <div className={styles.formHeadSection}>
                <span className={styles.formHead}>
                  Compliances & Certification
                </span>
                <span
                  className={styles.formAddButton}
                  onClick={() => {
                    values.cNCFileNDate?.length < 4 &&
                      setFieldValue("cNCFileNDate", [
                        ...values.cNCFileNDate,
                        {
                          file: [],
                          date: "",
                        },
                      ]);
                  }}
                >
                  Add More
                </span>
              </div>
 
              {values?.cNCFileNDate?.map((ele, index) => (
                <div
                  key={`certification_${index}`}
                  className={styles.formSection}
                >
                  {/* File Upload Section */}
                  <div className={styles.productContainer}>
                    <Field name={`cNCFileNDate.${index}.file`}>
                      {({ field }) => (
                        <ComplianceNCertification
                          fieldInputName={`cNCFileNDate.${index}.file`}
                          setFieldValue={setFieldValue}
                          initialValues={values}
                          label="Regulatory Compliance"
                          tooltip={
                            "Compliance with industry standards for healthcare-related tools (e.g. HIPAA, GMP, WDA, ASTM, \n" +
                            "FDA, CE, ISO, WHO etc) HIPAA applies to healthcare-related tools, while MHRA governs GMP in \n" +
                            " the UK. The European Medicines Agency (EMA) governs GMP in Europe."
                          }
                          // Pass the selected file here
                          selectedFile={ele?.file}
                          preview={ele?.preview}
                          fileIndex={index}
                          isEdit={false}
                        />
                      )}
                    </Field>
                    <span className={styles.error}>
                      {touched.cNCFileNDate &&
                        errors.cNCFileNDate?.[index]?.file}
                    </span>
                  </div>
 
                  {/* Date of Expiry Section */}
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Date of Expiry
                      <span className={styles.labelStamp2}>*</span>
                    </label>
                    <div className={styles.tooltipContainer}>
                      {/* Date Mask Input */}
 
                      <DatePicker
                        className={styles.formDate}
                        clearIcon={null}
                        format="dd/MM/yyyy"
                        placeholder="dd/MM/yyyy"
                        name={`cNCFileNDate.${index}.date`}
                        value={ele?.date}
                        minDate={new Date()}
                        onChange={(e) => {
                          setFieldValue(`cNCFileNDate.${index}.date`, e); // This updates Formik's value
                          setFieldTouched(
                            `cNCFileNDate.${index}.date`,
                            true,
                            true
                          );
                        }}
                        onBlur={handleBlur}
                        disabledDate={(current) =>
                          current && current < moment().endOf("day")
                        }
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                    <span className={styles.error}>
                      {touched.cNCFileNDate?.[index]?.date &&
                        errors.cNCFileNDate?.[index]?.date}
                    </span>
                  </div>
 
                  {/* Remove Section */}
                  {values?.cNCFileNDate?.length > 1 && (
                    <div
                      className={styles.formCloseSection}
                      onClick={() => {
                        // Clear form values before removing the row
                        setFieldValue(`cNCFileNDate.${index}.file`, {});
                        setFieldValue(`cNCFileNDate.${index}.date`, "");
                        setFieldValue(`cNCFileNDate.${index}.preview`, false);
 
                        // Remove the row from the array
                        const updatedList = values.cNCFileNDate.filter(
                          (_, elindex) => elindex !== index
                        );
                        const updatedList2 = values.complianceFile.filter(
                          (_, elindex) => elindex !== index
                        );
                        setFieldValue("cNCFileNDate", updatedList);
                        setFieldValue("complianceFile", updatedList2);
                      }}
                    >
                      <span className={styles.formclose}>
                        <CloseIcon className={styles.icon} />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
 
            {/* End the compliances and certificate 222222222 */}
 
            {/* Start the Product Documents */}
            <div className={styles.additionalSection}>
              <span className={styles.formHead}>Product Documents</span>
              <div className={styles.formSection}>
                <div className={styles.productContainer}>
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"catalogue"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Product Catalogue"
                    tooltip={false}
                    acceptTypes={{
                      "application/pdf": [],
                    }}
                    maxFiles={1}
                    error={
                      touched.catalogue && errors.catalogue
                        ? errors.catalogue
                        : null
                    }
                  />
                </div>
                <div className={styles.productContainer}>
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"specificationSheet"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Specification Sheet"
                    tooltip={false}
                    acceptTypes={{
                      "application/pdf": [],
                    }}
                    maxFiles={1}
                    error={
                      touched.specificationSheet && errors.specificationSheet
                        ? errors.specificationSheet
                        : null
                    }
                  />
                </div>
              </div>
            </div>
 
            {/* End the Product Documents */}
 
            {/* Start the Additional Information */}
            <div className={styles.additionalSection}>
              <span className={styles.formHead}>Additional Information</span>
              <div className={styles.formSection}>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Warranty<span className={styles.labelStamp2}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Warranty"
                    // autoComplete="off"
                    name="warranty"
                    value={values.warranty}
                    onChange={(e) =>
                      handleInputChange(e, setFieldValue, 20, "all")
                    }
                    onBlur={handleBlur}
                  />
                </div>
                <div className={styles.productContainer}>
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"guidelinesFile"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="User Guidelines"
                    tooltip={false}
                    acceptTypes={{
                      "application/pdf": [],
                    }}
                    maxFiles={1}
                    error={
                      touched.guidelinesFile && errors.guidelinesFile
                        ? errors.guidelinesFile
                        : null
                    }
                  />
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Other Information
                    <span className={styles.labelStamp2}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <textarea
                      className={styles.formTextarea}
                      type="text"
                      placeholder="Enter Other Information"
                      // autoComplete="off"
                      name="other"
                      value={values.other}
                      onChange={(e) =>
                        handleInputChange(e, setFieldValue, 100, "all")
                      }
                      onBlur={handleBlur}
                    />
                    <Tooltip
                      content=" Any relevant, additional or other information regarding
                      the product (eg. Prescribing  Info for Medication or
                      Dosage Info or regarding the shipping of large devices
                      etc.)"
                    ></Tooltip>
                  </div>
                </div>
              </div>
            </div>
 
            {/* End the Additional Information */}
            <div className={styles.additionalSection}>
              <span className={styles.formHead}>Upload Product Image</span>
              <div className={styles.formSection}>
                <div className={styles.ImageproductContainer}>
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"imageFront"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Front Image"
                    tooltip={false}
                    acceptTypes={{ "image/jpeg": [], "image/png": [] }}
                    maxFiles={1}
                    error={
                      touched.imageFront && errors.imageFront
                        ? errors.imageFront
                        : null
                    }
                  />
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"imageBack"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Back Image"
                    tooltip={false}
                    acceptTypes={{ "image/jpeg": [], "image/png": [] }}
                    maxFiles={1}
                    error={
                      touched.imageBack && errors.imageBack
                        ? errors.imageBack
                        : null
                    }
                  />
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"imageSide"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Side Image"
                    tooltip={false}
                    acceptTypes={{ "image/jpeg": [], "image/png": [] }}
                    maxFiles={1}
                    error={
                      touched.imageSide && errors.imageSide
                        ? errors.imageSide
                        : null
                    }
                  />
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"imageClosure"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Close Up Image"
                    tooltip={false}
                    acceptTypes={{ "image/jpeg": [], "image/png": [] }}
                    maxFiles={1}
                    error={
                      touched.imageClosure && errors.imageClosure
                        ? errors.imageClosure
                        : null
                    }
                  />
                </div>
                {productType === "secondary" && (
                  <div className={styles.productContainer}>
                    <AddProductFileUpload
                      styles={styles}
                      fieldInputName={"purchaseInvoiceFile"}
                      setFieldValue={setFieldValue}
                      initialValues={values}
                      label="Purchase Invoice"
                      tooltip={false}
                      acceptTypes={{
                        "application/pdf": [],
                      }}
                      maxFiles={1}
                      error={
                        touched.purchaseInvoiceFile &&
                        errors.purchaseInvoiceFile
                          ? errors.purchaseInvoiceFile
                          : null
                      }
                    />
                  </div>
                )}
              </div>
            </div>
 
            {/* Start the Add FAQs */}
            <div className={styles.section}>
              {/* {inventoryStockedCountries?.length > 0 ? ( */}
              <div className={styles.Stocksection}>
                <div className={styles.formHeadSection}>
                  <span className={styles.formHead}>Add FAQs</span>
                  <span
                    className={styles.formAddButton}
                    onClick={() => addFAQs(setFieldValue, values)}
                  >
                    Add More
                  </span>
                </div>
                {values?.faqs?.map((section, index) => {
                  return (
                    <>
                      <div
                        key={`stocked_${index}`}
                        className={styles.stockedContainer2}
                      >
                        <div className={styles.stockedSection2}>
                          <div className={styles.StockedDiv2}>
                            <label className={styles.formLabel}>
                              Question
                              {/* <span className={styles.labelStamp}>*</span> */}
                            </label>
                            <input
                              type="text"
                              name={`faqs.${index}.ques`}
                              onChange={(e) =>
                                handleFaqsQuesChange(index, e, setFieldValue)
                              }
                              value={section.ques}
                              placeholder={"Enter Question"}
                              className={styles.inputStocked}
                              onBlur={() =>
                                setFieldTouched(`faqs.${index}.ques`, true)
                              }
                            />
                            {touched.faqs?.[index]?.ques &&
                              errors.faqs?.[index]?.ques && (
                                <span span className={styles.error}>
                                  {errors.faqs[index].ques}
                                </span>
                              )}
                          </div>
                          <div className={styles.StockedDiv2}>
                            <label className={styles.formLabel}>
                              Answer
                              {/* <span className={styles.labelStamp}>*</span> */}
                            </label>
                            <div className={styles.quantitySelector}>
                              <div className={styles.inputGroup2}>
                                <textarea
                                  className={styles.inputStocked}
                                  type="text"
                                  placeholder={"Enter Answer"}
                                  // autoComplete="off"
                                  name={`faqs.${index}.ans`}
                                  value={section?.ans}
                                  onChange={(e) =>
                                    handleFaqsAnsChange(index, e, setFieldValue)
                                  }
                                  onBlur={() =>
                                    setFieldTouched(`faqs.${index}.ans`, true)
                                  }
                                />
                              </div>
                            </div>
                            {
                              <span span className={styles.error}>
                                {touched.faqs && errors?.faqs?.[index]?.ans}
                              </span>
                              // )
                            }
                          </div>
                        </div>
                        <div
                          className={styles.formclosebutton2}
                          onClick={() =>
                            removeFaqFormSection(index, setFieldValue, values)
                          }
                        >
                          <CloseIcon className={styles.iconClose} />
                        </div>
                      </div>
                      {values?.faqs?.length > 1 &&
                        index != values?.faqs?.length - 1 && (
                          <div className={styles.stockedContainer3}></div>
                        )}
                    </>
                  );
                })}
              </div>
            </div>
            {/* End the Add FAQs */}
 
            {/* Start button section */}
            <div className={styles.buttonContainer}>
              <button
                className={styles.buttonSubmit}
                type="submit"
                disabled={loading}
              >
                {loading ? <div className="loading-spinner"></div> : "Submit"}
              </button>
              <button className={styles.buttonCancel} onClick={handleCancel}>
                Cancel
              </button>
            </div>
 
            {/* End button section */}
          </Form>
        )}
      </Formik>
 
      {open && (
        <FileUploadModal
          onClose={() => setOpen(false)}
          onSelectFile={handleSelectFile}
          onHandleUpload={handleBulkUpload}
          modaltitle="Bulk Upload"
          title="Preview"
          selectedFile={selectedFile}
        />
      )}
    </div>
  );
};
 
export default AddProduct;