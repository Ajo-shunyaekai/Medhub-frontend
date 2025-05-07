import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "./ProductDescriptionEditor";
import Select, { components } from "react-select";
import countryList from "react-select-country-list";
import DatePicker from "react-date-picker";
import CloseIcon from "@mui/icons-material/Close";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { Chips } from "primereact/chips";
import "./addproduct.css";
import styles from "./addproduct.module.css";
import categoryArrays from "../../../../utils/Category";
import { Field, Form, Formik } from "formik";
// import AddProductFileUpload from "./AddPRoductFileUpload";
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
} from "./DropDowns";
import { FiUploadCloud } from "react-icons/fi";
import FileUploadModal from "../../SharedComponents/FileUploadModal/FileUploadModal";
import { AddProductFileUpload } from "../../../../utils/helper";

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

const AddProduct = ({ placeholder }) => {
  const defaultValues = "Speak to the supplier for more info";
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const [stockedInDetails, setStockedInDetails] = useState([
    {
      country: "",
      quantity: "",
      placeholder: "Enter Quantity",
    },
  ]);
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

  //handle field input
  // const handleInputChange = (
  //   e,
  //   setFieldValue,
  //   textLimit = 15,
  //   allowedType = "all",
  //   restrictSpecialForFields = [],
  //   allowedSpecialChars = ""
  // ) => {
    

  //   let { value, name } = e.target;

  //   // Apply character limit
  //   value = value.slice(0, Number(textLimit));

  //   // Dimension field validation
  //   if (name === "dimension") {
  //     // Allow only numbers, "x", and "."
  //     value = value.replace(/[^0-9x.]/g, "")?.toLowerCase();

  //     // Prevent multiple consecutive "x"
  //     value = value.replace(/x{2,}/g, "x");

  //     // Split the values by "x" while keeping their sequence
  //     const parts = value.split("x").map((part, index) => {
  //       // Allow up to 5 digits before decimal and 2 after
  //       part = part.replace(/^(\d{1,5})\.(\d{0,2}).*/, "$1.$2");

  //       // Ensure only one decimal per number
  //       part = part.replace(/(\..*)\./g, "$1");

  //       return part;
  //     });

  //     // Join back using "x" but ensure it doesn't remove already typed "x"
  //     value = parts.join("x");

  //     setFieldValue(name, value);
  //     return;
  //   }

  //   // Restrict input type
  //   if (allowedType === "number") {
  //     value = value.replace(/[^0-9]/g, ""); // Allow only numbers
  //   } else if (allowedType === "text") {
  //     value = value.replace(/[^a-zA-Z\s]/g, ""); // Allow only text and spaces
  //   } else if (
  //     allowedType === "all" &&
  //     restrictSpecialForFields.includes(name)
  //   ) {
     

  //     const allowedPattern = new RegExp(
  //       `[^a-zA-Z0-9\\s${allowedSpecialChars}]`,
  //       "g"
  //     );
  //     value = value.replace(allowedPattern, "");
  //   } else if (allowedType === "decimal") {
  //     if (!/^\d*\.?\d*$/.test(value)) return;
  //   }

  //   setFieldValue(name, value);
  // };

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
        const parts = value.split("x").map((part, index) => {
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

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Enter Product Description",
    }),
    [placeholder]
  );

  useEffect(() => {
    const countryOptions = countryList().getData();
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
      bulkFormData.append("supplier_id", localStorage?.getItem("_id"));
      bulkFormData.append("csvfile", selectedFile);

      dispatch(previewBulkProducts(bulkFormData)).then((response) => {
        if (response?.meta.requestStatus === "fulfilled") {
          navigate("/supplier/preview-file");
        }
      });
    }
  };

  const handleCancel = () => {
    navigate("/supplier/product");
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
          formData.append("supplier_id", localStorage?.getItem("_id"));

          const stockedInDetailsUpdated = JSON.stringify(
            values?.stockedInDetails?.map((section) => ({
              country: section?.country || "",
              quantity: section?.quantity || "",
              
            }))
          );
          

          const productPricingDetailsUpdated = JSON.stringify(
            values?.productPricingDetails?.map((section) => ({
              price: section?.price || "",
           
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
          formData.append("cNCFileNDate", cNCFileNDateUpdated);

       
          dispatch(addProduct(formData)).then((response) => {
            if (response?.meta.requestStatus === "fulfilled") {
              navigate("/supplier/product"); // Change this to your desired route
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
                    
                      setSelectedSubCategory(null);
                      setFieldValue("subCategory", "");
                      setSelectedLevel3Category(null);
                      setFieldValue("anotherCategory", "");
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
                {productType === "secondary product" && (
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

                      {touched.countryAvailable && errors.countryAvailable && (
                        <span className={styles.error}>
                          {errors.countryAvailable}
                        </span>
                      )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Minimum Purchase Unit
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <input
                        className={styles.formInput}
                        type="text"
                        placeholder="Enter Minimum Purchase Unit"
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
                  </>
                )}

                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    UPC (Universal Product Code)
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
                    Short Description
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <textarea
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Short Description of Product"
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
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>Brand Name</label>
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
                    <span className={styles.labelStamp}>*</span>
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
                  {touched.form && errors.form && (
                    <span className={styles.error}>{errors.form}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Total Quantity
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Total Quantity"
                      // autoComplete="off"
                      name="quantity"
                      value={values.quantity}
                       
                      onChange={(e) =>
                        handleInputChange(e, setFieldValue, 8, "number")
                      }
                      onBlur={handleBlur}
                    />
                    <Tooltip content="Add number of tablets in a strip, bottle, or box or number of bottles in a pack"></Tooltip>
                  </div>
                  {touched.quantity && errors.quantity && (
                    <span className={styles.error}>{errors.quantity}</span>
                  )}
                </div>

                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>Product Volume</label>
                  <div className={styles.weightContainer}>
                    <div className={styles.weightSection}>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Volume"
                          // autoComplete="off"
                          name="volumn"
                          value={values.volumn}
                           
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              setFieldValue,
                              9,
                              "decimal",
                              ["volumn"],
                              "."
                            )
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" The size or volume of the product (e.g., 50 mL, 100 g,
                      drip chamber ) (e.g., macro, micro),
                     Length of the needle (e.g., 19 mm, 26 mm ) tape
                      width, adhesive strip size etc."
                        ></Tooltip>
                      </div>
                    </div>
                    <div className={styles.unitSection}>
                      <Select
                        className={styles.formSelect}
                        options={volumeUnits}
                        placeholder="Select Units"
                        onBlur={handleBlur}
                        onChange={(selectedOption) => {
                          setFieldValue("volumeUnit", selectedOption?.value);
                        }}
                      />
                     
                    </div>
                  </div>
                 
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>Product Dimension</label>
                  <div className={styles.weightContainer}>
                    <div className={styles.weightSection}>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Height x Width x Depth"
                          // autoComplete="off"
                          name="dimension"
                          value={values.dimension}
                           
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              setFieldValue,
                              35,
                              "all",
                              ["dimension"],
                              ". x"
                            )
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The dimension of the product in Height x Width x Depth."></Tooltip>
                      </div>
                    </div>
                    <div className={styles.unitSection}>
                      <Select
                        className={styles.formSelect}
                        options={dimensionUnits}
                        placeholder="Select Units"
                        onBlur={handleBlur}
                        onChange={(selectedOption) => {
                          setFieldValue("dimensionUnit", selectedOption?.value);
                        }}
                      />
                   
                    </div>
                  </div>
               
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Weight & Units
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.weightContainer}>
                    <div className={styles.weightSection}>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Product Weight"
                          // autoComplete="off"
                          name="weight"
                          value={values.weight}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 9, "decimal", [
                              "weight",
                            ])
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="in (g, kg, lbs, l, ml, oz, gal, t)"></Tooltip>
                      </div>
                      {touched.weight && errors.weight && (
                        <span className={styles.error}>{errors.weight}</span>
                      )}
                    </div>
                    <div className={styles.unitSection}>
                      <Select
                        className={styles.formSelect}
                        options={packagingUnits}
                        placeholder="Select Units"
                        onBlur={handleBlur}
                        onChange={(selectedOption) => {
                          setFieldValue("unit", selectedOption?.value);
                        }}
                      />
                      {touched.unit && errors.unit && (
                        <span className={styles.error}>{errors.unit}</span>
                      )}
                    </div>
                  </div>
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
                    Product Packaging Type
                  
                  </label>
                  <div className={styles.tooltipContainer}>
                  
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Product Packaging Type"
                      // autoComplete="off"
                      name="packageType"
                      value={values?.packageType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Tooltip
                      content="The type of product packaging (e.g., bottle, tube, jar,
                      pump, blister
                       pack, strip, pouches, soft case, hard case,
                      backpack, case )."
                    ></Tooltip>
                  </div>
                  
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Packaging Material
                   
                  </label>
                  <div className={styles.tooltipContainer}>
                   
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Product Packaging Material"
                      // autoComplete="off"
                      name="packageMaterial"
                      value={values?.packageMaterial}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Tooltip content="The material used for packaging (e.g., plastic, glass, aluminum, cardboard, thermocol etc)"></Tooltip>
                  </div>

                
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>Storage Conditions</label>
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
                    Manufacturer Name
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Manufacturer Name"
                    // autoComplete="off"
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
                    Manufacturer Contry of Origin
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <Select
                    name="originCountry"
                    options={countries}
                    placeholder="Select Country of Origin"
                    // autoComplete="off"
                    
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

                <div className={styles.productContainer}>
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"image"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Product Image"
                    tooltip={false}
                    acceptTypes={{
                      "image/png": [],
                      "image/jpeg": [],
                      "image/jpg": [],
                    }}
                  />

                  {touched.image && errors.image && (
                    <span className={styles.error}>{errors.image}</span>
                  )}
                </div>
                {productType === "secondary product" && (
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
               
                <RichTextEditor
                  label="Product Description"
                  name="description"
                  value={values.description}
                  onChange={(content) => setFieldValue("description", content)}
                  onBlur={() => handleBlur({ target: { name: "description" } })}
                  error={errors.description}
                  touched={touched.description}
                  height={300}
                />
              </div>
            </div>

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
                        placeholder="Enter Interoperability"
                        // autoComplete="off"
                        name="interoperability"
                        value={values.interoperability}
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 75, "all")
                        }
                        onBlur={handleBlur}
                      />
                      <Tooltip content="Adheres to HL7/FHIR standards for healthcare data exchange."></Tooltip>
                    </div>
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>Laser Type</label>
                    <div className={styles.tooltipContainer}>
                      <input
                        className={styles.formInput}
                        type="text"
                        placeholder="Enter Laser Type"
                        // autoComplete="off"
                        name="laserType"
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 75, "all")
                        }
                        onBlur={handleBlur}
                      />
                      <Tooltip content="Type of laser (e.g., CO2, diode, Nd:YAG, Er:YAG)"></Tooltip>
                    </div>
                    <span className={styles.error}></span>
                  </div>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>Cooling System</label>
                    <div className={styles.tooltipContainer}>
                      <input
                        className={styles.formInput}
                        type="text"
                        placeholder="Enter Cooling System"
                        // autoComplete="off"
                        name="coolingSystem"
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 75, "all")
                        }
                        onBlur={handleBlur}
                      />
                      <Tooltip content="Type of cooling used (e.g., air, contact, cryogenic cooling)."></Tooltip>
                    </div>
                    <span className={styles.error}></span>
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>Spot Size</label>
                    <div className={styles.tooltipContainer}>
                      <input
                        className={styles.formInput}
                        type="text"
                        placeholder="Enter Spot Size"
                        // autoComplete="off"
                        name="spotSize"
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 4, "number")
                        }
                        onBlur={handleBlur}
                      />
                      <Tooltip content="Diameter of the laser spot on the skin (in mm or cm)"></Tooltip>
                    </div>
                    <span className={styles.error}></span>
                  </div>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Diagnostic Functions
                    </label>
                    <div className={styles.tooltipContainer}>
                      <textarea
                        className={styles.formInput}
                        placeholder="Enter Diagnostic Functions"
                        rows="2"
                        name="diagnosticFunctions"
                        value={values.diagnosticFunctions}
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 2000, "all")
                        }
                        onBlur={handleBlur}
                      />
                      <Tooltip content="Specific diagnostic tests or functions that the tool performs"></Tooltip>
                    </div>
                  </div>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Performance Testing Report
                    </label>
                    <div className={styles.tooltipContainer}>
                      <textarea
                        className={styles.formInput}
                        placeholder="Enter Performance Testing Report"
                        rows="2"
                        name="performanceTestingReport"
                        value={values.performanceTestingReport}
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 2000, "all")
                        }
                        onBlur={handleBlur}
                      />
                      <Tooltip
                        content=" Results from any internal or external product testing
                        (e.g., nebulizer output, CPAP pressure and
                        airflow testing)."
                      ></Tooltip>
                    </div>
                    <AddProductFileUpload
                      styles={styles}
                      fieldInputName={"performanceTestingReportFile"}
                      setFieldValue={setFieldValue}
                      initialValues={values}
                      label=""
                     
                      tooltip={false}
                      showLabel={false}
                    />
                    {touched.performanceTestingReportFile &&
                      errors.performanceTestingReportFile && (
                        <span className={styles.error}>
                          {errors.performanceTestingReportFile}
                        </span>
                      )}
                  </div>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Specification<span className={styles.labelStamp}>*</span>
                    </label>

                    <div className={styles.tooltipContainer}>
                      <textarea
                        className={styles.formInput}
                        placeholder="Enter Specification"
                        rows="2"
                        name="specification"
                        value={values.specification}
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 2000, "all")
                        }
                        onBlur={handleBlur}
                      />
                      <Tooltip content="Technical Specification of the tool  (e.g., hardware, software, network diagnostics, etc.)"></Tooltip>

                      {touched.specification && errors.specification && (
                        <span className={styles.error}>
                          {errors.specification}
                        </span>
                      )}
                    </div>
                    <AddProductFileUpload
                      styles={styles}
                      fieldInputName={"specificationFile"}
                      setFieldValue={setFieldValue}
                      initialValues={values}
                      label=""
                    
                      tooltip={false}
                      showLabel={false}
                    />
                    {touched.specificationFile && errors.specificationFile && (
                      <span className={styles.error}>
                        {errors.specificationFile}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* End the MedicalEquipmentAndDevices */}

            {/* Start the Pharmaceuticals */}
            {selectedSchema === "Pharmaceuticals" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Generic Name<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Generic Name"
                          // autoComplete="off"
                          name="genericName"
                          value={values.genericName}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The generic name of the medication (e.g., Paracetamol, Metformin, Ibuprofene)"></Tooltip>
                      </div>
                      {touched.genericName && errors.genericName && (
                        <span className={styles.error}>
                          {errors.genericName}
                        </span>
                      )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Class<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Drug Class"
                          // autoComplete="off"
                          name="drugClass"
                          value={values.drugClass}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"></Tooltip>
                      </div>
                      {touched.drugClass && errors.drugClass && (
                        <span className={styles.error}>{errors.drugClass}</span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Strength<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Strength"
                          // autoComplete="off"
                          name="strength"
                          value={values.strength}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 20, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" The strength or concentration of the medication (e.g.,
                           500 mg, 10 mg/mL,Standard or high-strength)."
                        ></Tooltip>
                      </div>
                      {touched.strength && errors.strength && (
                        <span className={styles.error}>{errors.strength}</span>
                      )}
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
                          name="otcClassification"
                          onChange={(selectedOption) =>
                            setFieldValue(
                              "otcClassification",
                              selectedOption?.value
                            )
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content="  Classification of the OTC drug by health authorities
                          (e.g.,  approved for general public use,
                          behind-the-counter)."
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={values.composition}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {touched.composition && errors.composition && (
                        <span className={styles.error}>
                          {errors.composition}
                        </span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Formulation</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Formulation"
                          rows="2"
                          name="formulation"
                          value={values.formulation}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."></Tooltip>
                      </div>
                      
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Purpose</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={values.purpose}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain relief,
                           Prevention of infection.,Cooling and
                          soothing.,Moisturizing and healing, procedure or use
                          case of
                           tool, Relieves symptoms, promotes healing, or
                          prevents recurrence.)"
                        ></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Administration Route
                    
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Drug Administration Route"
                          rows="2"
                          name="drugAdministrationRoute"
                          value={values.drugAdministrationRoute}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content="  Drugs can be introduced into the body by many routes,
                          such as enteric (oral, peroral, rectal), 
                          parenteral (intravascular, intramuscular,
                          subcutaneous, and inhalation
                           administration) or topical (skin and mucosal
                          membranes)"
                        ></Tooltip>
                      </div>
                      {touched.drugAdministrationRoute &&
                        errors.drugAdministrationRoute && (
                          <span className={styles.error}>
                            {errors.drugAdministrationRoute}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Controlled Substance
                      </label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="controlledSubstance"
                            onBlur={handleBlur}
                            name="controlledSubstance"
                            checked={values?.controlledSubstance || false}
                            onChange={(e) => {
                              handleCheckboxChange(
                                "controlledSubstance",
                                e?.target?.checked
                              );
                              setFieldValue(
                                "controlledSubstance",
                                e?.target?.checked
                              );
                            }}
                          />
                          <label
                            className={styles.checkText}
                            htmlFor="controlledSubstance"
                          >
                            Whether the drug is a controlled <br /> substance
                          </label>
                        </span>
                        <Tooltip
                          content="Whether the drug is a controlled substance (e.g., some
                          OTC drugs are restricted,
                          some are only available behind the counter or
                          on prescription)."
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>

                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry "
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 75, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {touched.expiry && errors.expiry && (
                          <span className={styles.error}>{errors.expiry}</span>
                        )}
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
                              placeholder="Enter Side Effects and Warnings"
                              rows="2"
                              name="sideEffectsAndWarnings"
                              value={values.sideEffectsAndWarnings}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip
                              content="Common side effects associated with the
                              medication. Known
                              interactions with other drugs or food (eg.
                              Alcohol)"
                            ></Tooltip>
                          </div>
                        
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Allergens</label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Allergens"
                              rows="2"
                              name="allergens"
                              value={values.allergens}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Common allergens in the product (e.g., parabens, sulfates, gluten etc)."></Tooltip>
                          </div>
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
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>SPF</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter SPF"
                          // autoComplete="off"
                          name="spf"
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="If the product is a sunscreen, the SPF (Sun Protection Factor) rating"></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Fragrance</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          placeholder="Enter Fragrance"
                          type="text"
                          name="fragrance"
                          value={values.fragrance}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Whether the product contains fragrance or is fragrance-free."></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Strength<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Strength"
                          // autoComplete="off"
                          name="strength"
                          value={values.strength}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 20, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" The strength or concentration of the medication (e.g.,
                          500 mg, 10 mg/mL,Standard or high-strength)."
                        ></Tooltip>
                      </div>
                      {touched.strength && errors.strength && (
                        <span className={styles.error}>{errors.strength}</span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Elasticity</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Elasticity"
                          // autoComplete="off"
                          name="elasticity"
                          value={values.elasticity}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content=" Stretch for tapes"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Adhesiveness</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Adhesiveness"
                          // autoComplete="off"
                          name="adhesiveness"
                          value={values.adhesiveness}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content=" Adhesive or non-adhesive."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Thickness</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Thickness"
                          // autoComplete="off"
                          name="thickness"
                          value={values.thickness}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 5, "numer")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The thickness of the Item (e.g., in mil or gauge)."></Tooltip>
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
                          options={skinhairOptions}
                          placeholder="Select OTC Classification"
                          name="otcClassification"
                          onChange={(selectedOption) =>
                            setFieldValue(
                              "otcClassification",
                              selectedOption?.value
                            )
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Classification of the OTC drug by health authorities
                          (e.g., approved for general public use,
                          behind-the-counter)."
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Formulation</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Formulation"
                          rows="2"
                          name="formulation"
                          value={values.formulation}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={values.composition}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {touched.composition && errors.composition && (
                        <span className={styles.error}>
                          {errors.composition}
                        </span>
                      )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Purpose<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={values.purpose}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Target Condition
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Target Condition"
                          rows="2"
                          name="targetCondition"
                          value={values.targetCondition}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The hair, scalp or skin condition the product is formulated to address"></Tooltip>
                      </div>
                      {touched.targetCondition && errors.targetCondition && (
                        <span className={styles.error}>
                          {errors.targetCondition}
                        </span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Administration Route
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Drug Administration Route"
                          rows="2"
                          name="drugAdministrationRoute"
                          value={values.drugAdministrationRoute}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Drugs can be introduced into the body by many routes,
                          such as enteric (oral, peroral,
                          rectal), parenteral (intravascular,
                          intramuscular, subcutaneous, and inhalation
                          administration) or topical (skin and mucosal
                          membranes)"
                        ></Tooltip>
                      </div>
                      {touched.drugAdministrationRoute &&
                        errors.drugAdministrationRoute && (
                          <span className={styles.error}>
                            {errors.drugAdministrationRoute}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Class<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Drug Class"
                          rows="2"
                          name="drugClass"
                          value={values.drugClass}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"></Tooltip>
                      </div>
                      {touched.drugClass && errors.drugClass && (
                        <span className={styles.error}>{errors.drugClass}</span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Concentration</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Concentration"
                          rows="2"
                          name="concentration"
                          value={values.concentration}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content="Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically
                          70-90% concentration for optimal antimicrobial
                          efficacy.
                          Oxygen concentration level provided by the
                          device (e.g., 95%)"
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Moisturizers</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Moisturizers"
                          rows="2"
                          name="moisturizers"
                          value={values.moisturizers}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="such as aloe vera, glycerin, or Vitamin E to reduce skin irritation from frequent use"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Filler Type</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Filler Type"
                          rows="2"
                          name="fillerType"
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Hyaluronic acid, Calcium hydroxyapatite"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Vegan</label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="vegan"
                            name="vegan"
                            onBlur={handleBlur}
                            checked={values?.vegan || checked["vegan"] || false}
                            onChange={(e) => {
                              handleCheckboxChange("vegan", e?.target?.checked);
                              setFieldValue("vegan", e?.target?.checked);
                            }}
                          />

                          <label className={styles.checkText} htmlFor="vegan">
                            Whether the product is vegan (i.e. <br />, no
                            animal-derived ingredients).
                          </label>
                        </span>
                        <Tooltip content="Description of the active and/or inactive ingredients and components"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Cruelty-Free</label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="crueltyFree"
                            name="crueltyFree"
                            onBlur={handleBlur}
                            checked={
                              values?.crueltyFree ||
                              checked["crueltyFree"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "crueltyFree",
                                e?.target?.checked
                              );
                              setFieldValue("crueltyFree", e?.target?.checked);
                            }}
                          />

                          <label
                            className={styles.checkText}
                            htmlFor="crueltyFree"
                          >
                            Whether the product is tested on <br /> animals or
                            is cruelty-free
                          </label>
                        </span>
                        <Tooltip content="Whether the product is tested on animals or is cruelty-free"></Tooltip>
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
                            id="controlledSubstance"
                            onBlur={handleBlur}
                            name="controlledSubstance"
                            checked={values.controlledSubstance || false}
                            onChange={(e) => {
                              handleCheckboxChange(
                                "controlledSubstance",
                                e?.target?.checked
                              );
                              setFieldValue(
                                "controlledSubstance",
                                e?.target?.checked
                              );
                            }}
                          />
                          <label
                            className={styles.checkText}
                            htmlFor="controlledSubstance"
                          >
                            Whether the drug is a controlled <br /> substance
                          </label>
                        </span>
                        <Tooltip
                          content="    Whether the drug is a controlled substance (e.g., some
                          OTC drugs are restricted,
                           some are only available behind the counter or
                          on prescription)."
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>

                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerMonitorSection}>
                      <span className={styles.formHead}>
                        Compliance & Certification
                      </span>
                      <div className={styles.formInnerSection}>
                        {/* Dermatologist Tested */}
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Dermatologist Tested
                            <span className={styles.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                           

                            <Select
                              className={styles.formSelect}
                              options={dermatologistOptions}
                              placeholder="Select Dermatologist Tested"
                              name="dermatologistTested"
                              value={dermatologistOptions.find(
                                (option) =>
                                  option.value === values.dermatologistTested
                              )} // Find matching option object
                              onChange={(selectedOption) => {
                                setFieldValue(
                                  "dermatologistTested",
                                  selectedOption?.value
                                );
                                setDermatologistTested(selectedOption?.value);
                              }}
                              onBlur={handleBlur}
                            />
                            <Tooltip content="   Whether the product has been dermatologist-tested for sensitivity."></Tooltip>
                          </div>
                          {touched.dermatologistTested &&
                            errors.dermatologistTested && (
                              <span className={styles.error}>
                                {errors.dermatologistTested}
                              </span>
                            )}
                          {dermatologistTested === "Yes" && (
                            <>
                              <AddProductFileUpload
                                styles={styles}
                                fieldInputName={"dermatologistTestedFile"}
                                setFieldValue={setFieldValue}
                                initialValues={values}
                                label=""
                                // fileUpload={dermatologistUpload}
                                tooltip={false}
                                showLabel={false}
                              />
                            </>
                          )}
                          {touched.dermatologistTestedFile &&
                            errors.dermatologistTestedFile && (
                              <span className={styles.error}>
                                {errors.dermatologistTestedFile}
                              </span>
                            )}
                        </div>

                        {/* Pediatrician Recommended */}
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Pediatrician Recommended
                            <span className={styles.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                        

                            <Select
                              className={styles.formSelect}
                              options={pediatricianOptions}
                              placeholder="Select Pediatrician Recommended"
                              name="pediatricianRecommended"
                              value={pediatricianOptions.find(
                                (option) =>
                                  option.value ===
                                  values.pediatricianRecommended
                              )} // Ensure it maps to an object
                              onChange={(selectedOption) => {
                                setFieldValue(
                                  "pediatricianRecommended",
                                  selectedOption?.value
                                );
                                setPediatricianRecommended(
                                  selectedOption?.value
                                );
                              }}
                              onBlur={handleBlur}
                            />
                            <Tooltip content=" Whether the product has been recommended or endorsed by pediatricians."></Tooltip>
                          </div>
                          {touched.pediatricianRecommended &&
                            errors.pediatricianRecommended && (
                              <span className={styles.error}>
                                {errors.pediatricianRecommended}
                              </span>
                            )}
                          {pediatricianRecommended === "Yes" && (
                            <>
                              <AddProductFileUpload
                                styles={styles}
                                fieldInputName={"pediatricianRecommendedFile"}
                                setFieldValue={setFieldValue}
                                initialValues={values}
                                label=""
                               
                                tooltip={false}
                                showLabel={false}
                              />
                            </>
                          )}
                          {touched.pediatricianRecommendedFile &&
                            errors.pediatricianRecommendedFile && (
                              <span className={styles.error}>
                                {errors.pediatricianRecommendedFile}
                              </span>
                            )}
                        </div>
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
                              placeholder="Enter Side Effects and Warnings"
                              rows="2"
                              name="sideEffectsAndWarnings"
                              value={values.sideEffectsAndWarnings}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip
                              content="  Common side effects associated with the
                              medication. Known interactions  with other
                              drugs or food (eg. Alcohol)"
                            ></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Allergens</label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Allergens"
                              rows="2"
                              name="allergens"
                              value={values.allergens}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content=" Common allergens in the product (e.g., parabens, sulfates, gluten etc)."></Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 75, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                      </div>
                      {touched.expiry && errors.expiry && (
                        <span className={styles.error}>{errors.expiry}</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* End the Skin, Hair and Cosmetic Supplies */}

            {/* Start the Vital Health and Wellness */}
            {selectedSchema === "VitalHealthAndWellness" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Generic Name<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Generic Name"
                          // autoComplete="off"
                          name="genericName"
                          value={values.genericName}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The generic name of the medication (e.g., Paracetamol, Metformin, Ibuprofene)"></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Strength<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Strength"
                          // autoComplete="off"
                          name="strength"
                          value={values.strength}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 20, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" The strength or concentration of the medication (e.g.,
                          500 mg, 10 mg/mL,Standard or high-strength)."
                        ></Tooltip>
                      </div>
                      {touched.strength && errors.strength && (
                        <span className={styles.error}>{errors.strength}</span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        OTC Classification
                      </label>
                      <div className={styles.tooltipContainer}>
                        <Select
                          className={styles.formSelect}
                          options={vitalHealthOptions}
                          placeholder="Select OTC Classification"
                          name="otcClassification"
                          onChange={(selectedOption) =>
                            setFieldValue(
                              "otcClassification",
                              selectedOption?.value
                            )
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content="      Classification of the OTC drug by health authorities
                          (e.g.,  approved for general public use,
                          behind-the-counter)."
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Health Benefit
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Health Benefit"
                          rows="2"
                          name="healthBenefit"
                          value={values.healthBenefit}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="  Info about the health benefits (e.g., “Boosts immunity”, “Supports joint health”)"></Tooltip>
                      </div>
                      {touched.healthBenefit && errors.healthBenefit && (
                        <span className={styles.error}>
                          {errors.healthBenefit}
                        </span>
                      )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={values.composition}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {touched.composition && errors.composition && (
                        <span className={styles.error}>
                          {errors.composition}
                        </span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Formulation</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Formulation"
                          rows="2"
                          name="formulation"
                          value={values.formulation}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Purpose</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={values.purpose}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain relief,
                         
                          Prevention of infection.,Cooling and
                          soothing.,Moisturizing and healing, procedure
                           or use case of tool, Relieves symptoms,
                          promotes healing, or prevents recurrence.)"
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Administration Route
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Drug Administration Route"
                          rows="2"
                          name="drugAdministrationRoute"
                          value={values.drugAdministrationRoute}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Drugs can be introduced into the body by many routes,
                          such as enteric (oral, peroral, rectal), parenteral
                          (intravascular, intramuscular,  subcutaneous,
                          and inhalation administration) or topical (skin and
                          mucosal membranes)"
                        ></Tooltip>
                      </div>
                      {touched.drugAdministrationRoute &&
                        errors.drugAdministrationRoute && (
                          <span className={styles.error}>
                            {errors.drugAdministrationRoute}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Class<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Drug Class"
                          rows="2"
                          name="drugClass"
                          value={values.drugClass}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"></Tooltip>
                      </div>
                      {touched.drugClass && errors.drugClass && (
                        <span className={styles.error}>{errors.drugClass}</span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Additives & Sweeteners
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Additives & Sweeteners"
                          rows="2"
                          name="additivesNSweeteners"
                          value={values.additivesNSweeteners}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content="Some proteins contain artificial sweeteners (e.g.,
                          sucralose, aspartame),
                           while others use natural sweeteners (e.g.,
                          stevia, monk fruit)."
                        ></Tooltip>
                      </div>
                      {touched.additivesNSweeteners &&
                        errors.additivesNSweeteners && (
                          <span className={styles.error}>
                            {errors.additivesNSweeteners}
                          </span>
                        )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Controlled Substance
                      </label>
                

                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="controlledSubstance"
                            name="controlledSubstance"
                            onBlur={handleBlur}
                            checked={
                              values?.controlledSubstance ||
                              checked["controlledSubstance"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "controlledSubstance",
                                e?.target?.checked
                              );
                              setFieldValue(
                                "controlledSubstance",
                                e?.target?.checked
                              );
                            }}
                          />

                          <label
                            className={styles.checkText}
                            htmlFor="controlledSubstance"
                          >
                            Whether the drug is a controlled <br /> substance
                          </label>
                        </span>
                        <Tooltip
                          content=" Whether the drug is a controlled substance (e.g., some
                          OTC drugs are restricted, some are only
                          available behind the counter or on prescription)."
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Vegan</label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="vegan"
                            name="vegan"
                            onBlur={handleBlur}
                            checked={values?.vegan || checked["vegan"] || false}
                            onChange={(e) => {
                              handleCheckboxChange("vegan", e?.target?.checked);
                              setFieldValue("vegan", e?.target?.checked);
                            }}
                          />

                          <label className={styles.checkText} htmlFor="vegan">
                            Whether the product is vegan (i.e.
                            <br />, no animal-derived ingredients).
                          </label>
                        </span>
                        <Tooltip content=" Description of the active and/or inactive ingredients and components"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Cruelty-Free</label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="crueltyFree"
                            name="crueltyFree"
                            onBlur={handleBlur}
                            checked={
                              values?.crueltyFree ||
                              checked["crueltyFree"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "crueltyFree",
                                e?.target?.checked
                              );
                              setFieldValue("crueltyFree", e?.target?.checked);
                            }}
                          />

                          <label
                            className={styles.checkText}
                            htmlFor="crueltyFree"
                          >
                            Whether the product is tested on <br /> animals or
                            is cruelty-free
                          </label>
                        </span>
                        <Tooltip content=" Whether the product is tested on animals or is cruelty-free"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 20, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {touched.expiry && errors.expiry && (
                          <span className={styles.error}>{errors.expiry}</span>
                        )}
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
                              placeholder="Enter Side Effects and Warnings"
                              // autoComplete="off"
                              name="sideEffectsAndWarnings"
                              value={values.sideEffectsAndWarnings}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip
                              content="Common side effects associated with the
                              medication. Known interactions with other
                              drugs or food (eg. Alcohol)"
                            ></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Allergens</label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Allergens"
                              rows="2"
                              name="allergens"
                              value={values.allergens}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Common allergens in the product (e.g., parabens, sulfates, gluten etc)."></Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Vital Health and Wellness */}

            {/* Start the Medical Consumables and Disposables */}
            {selectedSchema === "MedicalConsumablesAndDisposables" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Thickness</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Thickness"
                          // autoComplete="off"
                          name="thickness"
                          value={values.thickness}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 5, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The thickness of the Item (e.g., in mil or gauge)."></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Product Material
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Product Material"
                          // autoComplete="off"
                          name="productMaterial"
                          value={values.productMaterial}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Material used (e.g., Latex, Nitrile, Vinyl, Rubber, stainless steel, titanium etc.)."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Filtration Type
                      </label>
                      <div className={styles.tooltipContainer}>
                        <Chips
                          value={value.filtrationType || []}
                          name="filtrationType"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const newValue = e.value || e.target.value;
                            setValue((prev) => ({
                              ...prev,
                              filtrationType: newValue,
                            }));
                            setFieldValue("filtrationType", newValue);
                          }}
                          placeholder={
                            !value.filtrationType ||
                            value.filtrationType.length === 0
                              ? "Press enter to add label"
                              : ""
                          }
                          allowDuplicate={false}
                          separator=","
                        />
                        <Tooltip
                          content="  Type of Filtration (e.g., PFE (Particle Filtration
                          Efficiency), BFE (Bacterial Filtration
                          Efficiency), Viral Filtration Efficiency etc)"
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Purpose</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={values.purpose}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content=" Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"></Tooltip>
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
                          placeholder="Enter Chemical Resistance"
                          rows="2"
                          name="chemicalResistance"
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Any specific chemical resistance features"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Shape</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Shape"
                          rows="2"
                          name="shape"
                          value={values.shape}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Shape of the needle (e.g., 1/2 circle, 3/8 circle)."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Coating</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Coating"
                          rows="2"
                          name="coating"
                          value={values.coating}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Type of coating (e.g., antimicrobial, silicone)."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Powdered</label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="powdered"
                            checked={
                              values?.powdered || checked["powdered"] || false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "powdered",
                                e?.target?.checked
                              );
                              setFieldValue("powdered", e?.target?.checked);
                            }}
                          />

                          <label
                            className={styles.checkText}
                            htmlFor="powdered"
                          >
                            Whether the gloves are powdered <br /> or
                            powder-free.
                          </label>
                        </span>
                        <Tooltip content="Whether the gloves are powdered or powder-free."></Tooltip>
                      </div>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Texture</label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="texture"
                            checked={
                              values?.texture || checked["texture"] || false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "texture",
                                e?.target?.checked
                              );
                              setFieldValue("texture", e?.target?.checked);
                            }}
                          />

                          <label className={styles.checkText} htmlFor="texture">
                            Whether the item have texture <br /> or smooth
                          </label>
                        </span>
                        <Tooltip content="Whether the item have texture or smooth"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>

                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 20, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {touched.expiry && errors.expiry && (
                          <span className={styles.error}>{errors.expiry}</span>
                        )}
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
                              placeholder="Enter Allergens"
                              rows="2"
                              name="allergens"
                              value={values.allergens}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Common allergens in the product (e.g., parabens, sulfates, gluten, milk, Latex etc)."></Tooltip>
                          </div>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Sterilized</label>
                          <div className={styles.tooltipContainer}>
                            <span className={styles.formCheckboxSection}>
                              <input
                                type="checkbox"
                                id="sterilized"
                                checked={checked["sterilized"] || false}
                                onChange={(e) => {
                                  handleCheckboxChange(
                                    "sterilized",
                                    e?.target?.checked
                                  );
                                  setFieldValue(
                                    "sterilized",
                                    e?.target?.checked
                                  );
                                }}
                              />

                              <label
                                className={styles.checkText}
                                htmlFor="sterilized"
                              >
                                Whether the item is sterilized <br /> or
                                non-sterile.
                              </label>
                            </span>
                            <Tooltip content="Whether the item is sterilized or non-sterile."></Tooltip>
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
                              placeholder="Enter Filtration Efficiency"
                              // autoComplete="off"
                              name="filtrationEfficiency"
                              value={values.filtrationEfficiency}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 4, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Percentage of particles the mask filters (e.g., 95%, 99%, etc.)"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Breathability
                          </label>
                          <div className={styles.tooltipContainer}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="Enter Breathability"
                              // autoComplete="off"
                              name="breathability"
                              value={values.breathability}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 75, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Breathability rating (e.g., air flow resistance, Inhalation/Exhalation rate)"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Layer Count
                          </label>
                          <div className={styles.tooltipContainer}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="Enter Layer Count"
                              // autoComplete="off"
                              name="layerCount"
                              value={values.layerCount}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 20, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Number of layers (e.g., 3-ply, 4-ply, 5-ply)."></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Fluid Resistance
                          </label>
                          <div className={styles.tooltipContainer}>
                            <span className={styles.formCheckboxSection}>
                              <input
                                type="checkbox"
                                id="fluidResistance"
                                checked={
                                  values.fluidResistance ||
                                  checked["fluidResistance"] ||
                                  false
                                }
                                onChange={(e) => {
                                  handleCheckboxChange(
                                    "fluidResistance",
                                    e?.target?.checked
                                  );
                                  setFieldValue(
                                    "fluidResistance",
                                    e?.target?.checked
                                  );
                                }}
                              />

                              <label
                                className={styles.checkText}
                                htmlFor="fluidResistance"
                              >
                                Resistance to fluid penetration (e.g., <br />{" "}
                                for surgical masks)
                              </label>
                            </span>
                            <Tooltip content="Resistance to fluid penetration (e.g., for surgical masks)"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Medical Consumables and Disposables */}

            {/* Start the Laboratory Supplies */}
            {selectedSchema === "LaboratorySupplies" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Physical State</label>
                      <div className={styles.tooltipContainer}>
                        <Chips
                          value={values.physicalState || []} // Ensure value is always an array
                          placeholder={
                            !values.physicalState ||
                            values.physicalState.length === 0
                              ? "Press enter to add label"
                              : ""
                          }
                          name="physicalState"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const newValue = e.value || e.target.value; // Handle different event structures
                            setValue((prev) => ({
                              ...prev,
                              physicalState: newValue,
                            }));
                            setFieldValue("physicalState", newValue); // For form libraries like Formik
                          }}
                          allowDuplicate={false} // Prevent duplicate entries if supported
                          separator="," // Optional: Define separator for adding values
                        />
                        <Tooltip content="Physical state (e.g., solid, liquid, gas)"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Hazard Classification
                      </label>
                      <div className={styles.tooltipContainer}>
                        <Chips
                          value={values.hazardClassification || []} // Ensure value is always an array
                          placeholder={
                            !values.hazardClassification ||
                            values.hazardClassification.length === 0
                              ? "Press enter to add label"
                              : ""
                          }
                          name="hazardClassification"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const newValue = e.value || e.target.value; // Handle different event structures
                            setValue((prev) => ({
                              ...prev,
                              hazardClassification: newValue,
                            }));
                            setFieldValue("hazardClassification", newValue); // For form libraries like Formik
                          }}
                          allowDuplicate={false} // Prevent duplicate entries if supported
                          separator="," // Optional: Define separator for adding values
                        />
                        <Tooltip content="Hazard Classification (e.g., flammable, toxic, etc)"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Shape</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Shape"
                          rows="2"
                          name="shape"
                          value={values.shape}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Shape of the needle (e.g., 1/2 circle, 3/8 circle)."></Tooltip>
                      </div>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Coating</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Coating"
                          rows="2"
                          name="coating"
                          value={values.coating}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Type of coating (e.g., antimicrobial, silicone)."></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Purpose</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={values.purpose}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />

                        <Tooltip
                          content="Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain 
                          relief,Prevention of infection.,Cooling and
                          soothing.,Moisturizing and healing, procedure 
                          or use case of tool, Relieves symptoms, promotes
                          healing, or prevents recurrence.)"
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>CAS Number</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter CAS Number"
                          rows="2"
                          name="casNumber"
                          value={values.casNumber}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Chemical Abstracts Service (CAS) number for unique identification."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Grade</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Grade"
                          rows="2"
                          name="grade"
                          value={values.grade}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Purity or grade (e.g., analytical grade, reagent grade)"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Concentration</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Concentration"
                          rows="2"
                          name="concentration"
                          value={values.concentration}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90%
                          
                          concentration for optimal antimicrobial efficacy.
                          Oxygen concentration level provided by the device
                          (e.g., 95%)"
                        ></Tooltip>
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
                          placeholder="Enter Connectivity"
                          // autoComplete="off"
                          name="connectivity"
                          value={values.connectivity}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Connectivity options (e.g., USB, Wi-Fi, HDMI)."></Tooltip>
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
                          placeholder="Enter Magnification Range"
                          rows="2"
                          name="magnificationRange"
                          value={values.magnificationRange}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Magnification capabilities (e.g., 40x to 1000x)."></Tooltip>
                      </div>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Objective Lenses
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Objective Lenses"
                          rows="2"
                          name="objectiveLenses"
                          value={values.objectiveLenses}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Number and types of objective lenses (e.g., 4x, 10x, 40x)"></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Power Source</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Power Source"
                          rows="2"
                          name="powerSource"
                          value={values.powerSource}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Power requirements (e.g., battery, AC adapter)."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Resolution</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Resolution"
                          rows="2"
                          name="resolution"
                          value={values.resolution}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Maximum resolution the microscope can achieve."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Laboratory Supplies */}

            {/* Start the Diagnostic and Monitoring Devices */}
            {selectedSchema === "DiagnosticAndMonitoringDevices" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Diagnostic Functions
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Diagnostic Functions"
                          rows="2"
                          name="diagnosticFunctions"
                          value={values.diagnosticFunctions}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Specific diagnostic tests or functions that the tool performs"></Tooltip>
                      </div>
                      {touched.diagnosticFunctions &&
                        errors.diagnosticFunctions && (
                          <span className={styles.error}>
                            {errors.diagnosticFunctions}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Flow Rate</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Flow Rate"
                          rows="2"
                          name="flowRate"
                          value={values.flowRate}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Adjustable flow rate range (e.g., 1-5 LPM, 1-10 LPM)"></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Concentration</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Concentration"
                          rows="2"
                          name="concentration"
                          value={values.concentration}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90%
                          concentration for optimal  antimicrobial
                          efficacy. Oxygen concentration level provided by the
                          device (e.g., 95%)"
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>
                  <span className={styles.formHead}>Technical Details</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Measurement Range
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Measurement Range"
                          // autoComplete="off"
                          name="measurementRange"
                          value={values.measurementRange}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content=" Blood pressure range the monitor can measure (e.g., 0-300 mmHg)."></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Noise Level</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Noise Level"
                          // autoComplete="off"
                          name="noiseLevel"
                          value={values.noiseLevel}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 20, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content=" Operating noise level (e.g., 40 dB)."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Usage Rate</label>
                      <input
                        className={styles.formInput}
                        type="text"
                        placeholder="Enter Usage Rate"
                        // autoComplete="off"
                        name="usageRate"
                        value={values.usageRate}
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 75, "all")
                        }
                        onBlur={handleBlur}
                      />
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Maintenance Notes
                      </label>
                      <textarea
                        className={styles.formInput}
                        placeholder="Enter Maintenance Notes"
                        rows="2"
                        name="maintenanceNotes"
                        value={values.maintenanceNotes}
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 2000, "all")
                        }
                        onBlur={handleBlur}
                      />
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Compatible Equipment
                      </label>
                      <textarea
                        className={styles.formInput}
                        placeholder="Enter Compatible Equipment"
                        rows="2"
                        name="compatibleEquipment"
                        value={values.compatibleEquipment}
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 2000, "all")
                        }
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Specification
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Specification"
                          rows="2"
                          name="specification"
                          value={values.specification}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Technical Specification of the tool  (e.g., hardware, software, network diagnostics, etc.)"></Tooltip>
                      </div>
                      {touched.specification && errors.specification && (
                        <span className={styles.error}>
                          {errors.specification}
                        </span>
                      )}
                      <AddProductFileUpload
                        styles={styles}
                        fieldInputName={"specificationFile"}
                        setFieldValue={setFieldValue}
                        initialValues={values}
                        label=""
                        // fileUpload={specificationUpload}
                        tooltip={false}
                        showLabel={false}
                      />
                      {touched.specificationFile &&
                        errors.specificationFile && (
                          <span className={styles.error}>
                            {errors.specificationFile}
                          </span>
                        )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Performance Testing Report
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Performance Testing Report"
                          rows="2"
                          name="performanceTestingReport"
                          value={values.performanceTestingReport}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Results from any internal or external product testing
                          (e.g.,
                          nebulizer output, CPAP pressure and airflow
                          testing)."
                        ></Tooltip>
                      </div>
                      <AddProductFileUpload
                        styles={styles}
                        fieldInputName={"performanceTestingReportFile"}
                        setFieldValue={setFieldValue}
                        initialValues={values}
                        label=""
                        // fileUpload={performanceUpload}
                        tooltip={false}
                        showLabel={false}
                      />
                      {touched.performanceTestingReportFile &&
                        errors.performanceTestingReportFile && (
                          <span className={styles.error}>
                            {errors.performanceTestingReportFile}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Diagnostic and Monitoring Devices */}

            {/* Start the Hospital and Clinic Supplies */}
            {selectedSchema === "HospitalAndClinicSupplies" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Thickness</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Thickness"
                          // autoComplete="off"
                          name="thickness"
                          value={values.thickness}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content=" The thickness of the Item (e.g., in mil or gauge)."></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Product Material
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Product Material"
                          // autoComplete="off"
                          name="productMaterial"
                          value={values.productMaterial}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 1000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Material used (e.g., Latex, Nitrile, Vinyl, Rubber, stainless steel, titanium etc.)."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Purpose</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={values.purpose}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"></Tooltip>
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
                          placeholder="Enter Chemical Resistance"
                          rows="2"
                          name="chemicalResistance"
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Any specific chemical resistance features"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Powdered</label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="powdered"
                            checked={
                              values?.powdered || checked["powdered"] || false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "powdered",
                                e?.target?.checked
                              );
                              setFieldValue("powdered", e?.target?.checked);
                            }}
                          />

                          <label
                            className={styles.checkText}
                            htmlFor="powdered"
                          >
                            Whether the gloves are powdered <br />
                            or powder-free.
                          </label>
                        </span>
                        <Tooltip content="Whether the gloves are powdered or powder-free."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Texture</label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="texture"
                            checked={
                              values?.texture || checked["texture"] || false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "texture",
                                e?.target?.checked
                              );
                              setFieldValue("texture", e?.target?.checked);
                            }}
                          />

                          <label className={styles.checkText} htmlFor="texture">
                            Whether the item have texture <br /> or smooth
                          </label>
                        </span>
                        <Tooltip content="Whether the item have texture or smooth"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 20, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {touched.expiry && errors.expiry && (
                          <span className={styles.error}>{errors.expiry}</span>
                        )}
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
                                id="sterilized"
                                checked={checked["sterilized"] || false}
                                onChange={(e) => {
                                  handleCheckboxChange(
                                    "sterilized",
                                    e?.target?.checked
                                  );
                                  setFieldValue(
                                    "sterilized",
                                    e?.target?.checked
                                  );
                                }}
                              />

                              <label
                                className={styles.checkText}
                                htmlFor="sterilized"
                              >
                                Whether the item is sterilized <br />
                                or non-sterile.
                              </label>
                            </span>
                            <Tooltip content="Whether the item is sterilized or non-sterile."></Tooltip>
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
                          placeholder="Enter Adhesiveness"
                          // autoComplete="off"
                          name="adhesiveness"
                          value={values.adhesiveness}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Adhesive or non-adhesive."></Tooltip>
                      </div>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Absorbency</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Absorbency"
                          // autoComplete="off"
                          name="absorbency"
                          value={values.absorbency}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Whether the suture is absorbable or non-absorbable."></Tooltip>
                      </div>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Elasticity</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Elasticity"
                          // autoComplete="off"
                          name="elasticity"
                          value={values.elasticity}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 75, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Stretch for tapes"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Fluid Resistance
                      </label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="fluidResistance"
                            checked={
                              values?.fluidResistance ||
                              checked["fluidResistance"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "fluidResistance",
                                e?.target?.checked
                              );
                              setFieldValue(
                                "fluidResistance",
                                e?.target?.checked
                              );
                            }}
                          />
                          <label
                            className={styles.checkText}
                            htmlFor="fluidResistance"
                          >
                            Resistance to fluid penetration (e.g., <br /> for
                            surgical masks)
                          </label>
                        </span>
                        <Tooltip content="Resistance to fluid penetration (e.g., for surgical masks)"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Hospital and Clinic Supplies */}

            {/* Start the Orthopedic Supplies */}
            {selectedSchema === "OrthopedicSupplies" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Strength<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Strength"
                          // autoComplete="off"
                          name="strength"
                          value={values.strength}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 20, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content="The strength or concentration of the medication (e.g.,
                       500 mg, 10 mg/mL,Standard or high-strength)."
                        ></Tooltip>
                      </div>
                      {touched.strength && errors.strength && (
                        <span className={styles.error}>{errors.strength}</span>
                      )}
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
                          name="moistureResistance"
                          onChange={(selectedOption) =>
                            setFieldValue(
                              "moistureResistance",
                              selectedOption?.value
                            )
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Whether the item is moisture resistance or not"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Purpose</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={values.purpose}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"></Tooltip>
                      </div>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Target Condition
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Target Condition"
                          rows="2"
                          name="targetCondition"
                          value={values.targetCondition}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The hair, scalp or skin condition the product is formulated to address"></Tooltip>
                      </div>
                      {touched.targetCondition && errors.targetCondition && (
                        <span className={styles.error}>
                          {errors.targetCondition}
                        </span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Coating</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Coating"
                          rows="2"
                          name="coating"
                          value={values.coating}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Type of coating (e.g., antimicrobial, silicone)."></Tooltip>
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
                                id="sterilized"
                                checked={checked["sterilized"] || false}
                                onChange={(e) => {
                                  handleCheckboxChange(
                                    "sterilized",
                                    e?.target?.checked
                                  );
                                  setFieldValue(
                                    "sterilized",
                                    e?.target?.checked
                                  );
                                }}
                              />
                              <label
                                className={styles.checkText}
                                htmlFor="sterilized"
                              >
                                Whether the item is sterilized <br /> or
                                non-sterile.
                              </label>
                            </span>
                            <Tooltip content="Whether the item is sterilized or non-sterile."></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.innerMonitorSection}>
                      <span className={styles.formHead}>Technical Details</span>
                      <div className={styles.formInnerSection}>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Elasticity</label>
                          <div className={styles.tooltipContainer}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="Enter Elasticity"
                              // autoComplete="off"
                              name="elasticity"
                              value={values.elasticity}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 75, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Stretch for tapes"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Absorbency</label>
                          <div className={styles.tooltipContainer}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="Enter Absorbency"
                              // autoComplete="off"
                              name="absorbency"
                              value={values.absorbency}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 75, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Whether the suture is absorbable or non-absorbable."></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Breathability
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Breathability"
                              rows="2"
                              name="breathability"
                              value={values.breathability}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Breathability rating (e.g., air flow resistance, Inhalation/Exhalation rate)"></Tooltip>
                          </div>
                        </div>

                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Color Options
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Color Options"
                              rows="2"
                              name="colorOptions"
                              value={values.colorOptions}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip
                              content=" Available colors (e.g., black, beige, grey,
                              tortoiseshell, frame color or lense color
                              etc)"
                            ></Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Orthopedic Supplies */}

            {/* Start the Dental Products */}
            {selectedSchema === "DentalProducts" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Product Material
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Product Material"
                          // autoComplete="off"
                          name="productMaterial"
                          value={values.productMaterial}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 100, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Material used (e.g., Latex, Nitrile, Vinyl, Rubber, stainless steel, titanium etc.)."></Tooltip>
                      </div>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Purpose</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={values.purpose}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Target Condition
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Target Condition"
                          rows="2"
                          name="targetCondition"
                          value={values.targetCondition}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain
                          relief,Prevention 
                          of infection.,Cooling and soothing.,Moisturizing and
                          healing, procedure or use case of tool, Relieves
                           symptoms, promotes healing, or prevents
                          recurrence.)"
                        ></Tooltip>
                      </div>
                      {touched.targetCondition && errors.targetCondition && (
                        <span className={styles.error}>
                          {errors.targetCondition}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 20, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {touched.expiry && errors.expiry && (
                          <span className={styles.error}>{errors.expiry}</span>
                        )}
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
                            placeholder="Enter Usage Rate"
                            // autoComplete="off"
                            name="usageRate"
                            value={values.usageRate}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 75, "all")
                            }
                            onBlur={handleBlur}
                          />

                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Maintenance Notes
                          </label>

                          <textarea
                            className={styles.formInput}
                            placeholder="Enter Maintenance Notes"
                            rows="2"
                            name="maintenanceNotes"
                            value={values.maintenanceNotes}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 2000, "all")
                            }
                            onBlur={handleBlur}
                          />

                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Compatible Equipment
                          </label>

                          <textarea
                            className={styles.formInput}
                            placeholder="Enter Compatible Equipment"
                            rows="2"
                            name="compatibleEquipment"
                            value={values.compatibleEquipment}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 2000, "all")
                            }
                            onBlur={handleBlur}
                          />

                          <span className={styles.error}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Dental Products */}

            {/* Start the Eye Care Supplies */}
            {selectedSchema === "EyeCareSupplies" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Frame</label>

                      <Select
                        className={styles.formSelect}
                        options={frameOptions}
                        placeholder="Select Frame"
                        name="frame"
                        onChange={(selectedOption) =>
                          setFieldValue("frame", selectedOption?.value)
                        }
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Lens</label>

                      <Select
                        className={styles.formSelect}
                        options={lensOptions}
                        placeholder="Select Lens"
                        name="lens"
                        onChange={(selectedOption) =>
                          setFieldValue("lens", selectedOption?.value)
                        }
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Lens Material</label>

                      <Select
                        className={styles.formSelect}
                        options={lensmaterialOptions}
                        placeholder="Select Lens Material"
                        name="lensMaterial"
                        onChange={(selectedOption) =>
                          setFieldValue("lensMaterial", selectedOption?.value)
                        }
                        onBlur={handleBlur}
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
                        placeholder="Enter Diameter"
                        // autoComplete="off"
                        name="diameter"
                        value={values.diameter}
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 4, "all")
                        }
                        onBlur={handleBlur}
                      />

                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Lens Power</label>

                      <textarea
                        className={styles.formInput}
                        placeholder="Enter Lens Power"
                        rows="2"
                        name="lensPower"
                        value={values.lensPower}
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 9, "all")
                        }
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Base Curve</label>

                      <textarea
                        className={styles.formInput}
                        placeholder="Enter Base Curve"
                        rows="2"
                        name="baseCurve"
                        value={values.baseCurve}
                         
                        onChange={(e) =>
                          handleInputChange(e, setFieldValue, 2000, "all")
                        }
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Color Options</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Color Options"
                          rows="2"
                          name="colorOptions"
                          value={values.colorOptions}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Available colors (e.g., black, beige, grey, tortoiseshell, frame color or lense color etc)"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Eye Care Supplies */}

            {/* Start the Home Healthcare Products */}

            {selectedSchema === "HomeHealthcareProducts" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Flow Rate</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Flow Rate"
                          rows="2"
                          name="flowRate"
                          value={values.flowRate}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Adjustable flow rate range (e.g., 1-5 LPM, 1-10 LPM)"></Tooltip>
                      </div>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Concentration</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Concentration"
                          rows="2"
                          name="concentration"
                          value={values.concentration}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content="Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90%
                         
                          concentration for optimal antimicrobial efficacy.
                          Oxygen concentration level
                         provided by the device (e.g., 95%)"
                        ></Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 20, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {touched.expiry && errors.expiry && (
                          <span className={styles.error}>{errors.expiry}</span>
                        )}
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
                              placeholder="Enter Max Weight Capacity"
                              // autoComplete="off"
                              name="maxWeightCapacity"
                              value={values.maxWeightCapacity}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 75, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="The maximum weight capacity that the mobility aid can support (e.g., 250 lbs for a walker)."></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Grip Type</label>
                          <div className={styles.tooltipContainer}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="Enter Grip Type"
                              // autoComplete="off"
                              name="gripType"
                              value={values.gripType}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 75, "text")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Type of grips or handles (e.g., ergonomic, foam, rubberized handles for better comfort)."></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Battery Type
                          </label>
                          <div className={styles.tooltipContainer}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="Enter Battery Type"
                              // autoComplete="off"
                              name="batteryType"
                              value={values.batteryType}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 75, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Type of Battery Installed to Operate the Item"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Battery Size
                          </label>
                          <div className={styles.tooltipContainer}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="Enter Battery Size"
                              // autoComplete="off"
                              name="batterySize"
                              value={values.batterySize}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 75, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Size of Battery Installed to Operate the Item"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Color Options
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Color Options"
                              rows="2"
                              name="colorOptions"
                              value={values.colorOptions}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Available colors (e.g., black, beige, grey, tortoiseshell, frame color or lense color etc)"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Foldability
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Foldability"
                              rows="2"
                              name="foldability"
                              value={values.foldability}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Whether the product can be folded for easy storage (e.g., foldable walkers)."></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Locking Mechanism
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Locking Mechanism"
                              rows="2"
                              name="lockingMechanism"
                              value={values.lockingMechanism}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Details on any locking mechanisms (e.g., locking wheels or adjustable legs on walkers)"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Type of Support
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Type of Support"
                              rows="2"
                              name="typeOfSupport"
                              value={values.typeOfSupport}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip
                              content=" The type of support provided by the aid (e.g.,
                              two-legged,
                             four-legged walker, or wall-mounted grab
                              bar)."
                            ></Tooltip>
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
                              placeholder="Enter Performance Testing Report"
                              rows="2"
                              name="performanceTestingReport"
                              value={values.performanceTestingReport}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip
                              content="   Results from any internal or external product
                              testing (e.g.,
                               nebulizer output, CPAP pressure and airflow
                              testing)."
                            ></Tooltip>
                          </div>
                          <AddProductFileUpload
                            styles={styles}
                            fieldInputName={"performanceTestingReportFile"}
                            setFieldValue={setFieldValue}
                            initialValues={values}
                            label=""
                            // fileUpload={performanceUpload}
                            tooltip={false}
                            showLabel={false}
                          />
                          {touched.performanceTestingReportFile &&
                            errors.performanceTestingReportFile && (
                              <span className={styles.error}>
                                {errors.performanceTestingReportFile}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Home Healthcare Products */}

            {/* Start the Alternative Medicines */}
            {selectedSchema === "AlternativeMedicines" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={values.composition}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine.."></Tooltip>
                      </div>
                      {touched.composition && errors.composition && (
                        <span className={styles.error}>
                          {errors.composition}
                        </span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Purpose</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={values.purpose}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content="  Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain
                          relief,Prevention of infection.,Cooling
                          and soothing.,Moisturizing and healing,
                          procedure or use case of tool, Relieves symptoms,
                          promotes healing, or prevents recurrence.)"
                        ></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Health Claims</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Health Claims"
                          rows="2"
                          name="healthClaims"
                          value={values.healthClaims}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="  Verified by clinical trials or regulatory agencies."></Tooltip>
                      </div>
                      <AddProductFileUpload
                        styles={styles}
                        fieldInputName={"healthClaimsFile"}
                        setFieldValue={setFieldValue}
                        initialValues={values}
                        label=""
                       
                        tooltip={false}
                        showLabel={false}
                      />
                      {touched.healthClaimsFile && errors.healthClaimsFile && (
                        <span className={styles.error}>
                          {errors.healthClaimsFile}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 20, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {touched.expiry && errors.expiry && (
                          <span className={styles.error}>{errors.expiry}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Alternative Medicines */}

            {/* Start the Emergency and First Aid Supplies */}
            {selectedSchema === "EmergencyAndFirstAidSupplies" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={values.composition}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {touched.composition && errors.composition && (
                        <span className={styles.error}>
                          {errors.composition}
                        </span>
                      )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Product Longevity
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Product Longevity"
                          rows="2"
                          name="productLongevity"
                          value={values.productLongevity}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Expected lifespan of the product (e.g., single-use vs. reusable items)."></Tooltip>
                      </div>
                      {touched.productLongevity && errors.productLongevity && (
                        <span className={styles.error}>
                          {errors.productLongevity}
                        </span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Foldability<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Foldability"
                          rows="2"
                          name="foldability"
                          value={values.foldability}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Whether the product can be folded for easy storage (e.g., foldable walkers)."></Tooltip>
                      </div>
                      {touched.foldability && errors.foldability && (
                        <span className={styles.error}>
                          {errors.foldability}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 20, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {touched.expiry && errors.expiry && (
                          <span className={styles.error}>{errors.expiry}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* End the Emergency and First Aid Supplies */}

            {/* Start the Disinfection and Hygiene Supplies */}
            {selectedSchema === "DisinfectionAndHygieneSupplies" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={values.composition}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {touched.composition && errors.composition && (
                        <span className={styles.error}>
                          {errors.composition}
                        </span>
                      )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Concentration</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Concentration"
                          rows="2"
                          name="concentration"
                          value={values.concentration}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content="  Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90%
                          concentration <br /> for optimal antimicrobial
                          efficacy. Oxygen concentration level provided by the
                          device (e.g., 95%)"
                        ></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Formulation</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Formulation"
                          rows="2"
                          name="formulation"
                          value={values.formulation}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Fragrance</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Fragrance"
                          rows="2"
                          name="fragrance"
                          value={values.fragrance}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Whether the product contains fragrance or is fragrance-free."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 20, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {touched.expiry && errors.expiry && (
                          <span className={styles.error}>{errors.expiry}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Disinfection and Hygiene Supplies */}

            {/* Start the Nutrition and Dietary Products */}
            {selectedSchema === "NutritionAndDietaryProducts" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Dairy Free<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <Select
                          className={styles.formSelect}
                          options={dairyfeeOptions}
                          placeholder="Select Dairy Free"
                          name="dairyFree"
                          onChange={(selectedOption) =>
                            setFieldValue("dairyFree", selectedOption?.value)
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Is the product dairy free?"></Tooltip>
                      </div>
                      {touched.dairyFree && errors.dairyFree && (
                        <span className={styles.error}>{errors.dairyFree}</span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Flavor Options
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Flavor Options"
                          rows="2"
                          name="flavorOptions"
                          value={values.flavorOptions}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Protein powders often come in a wide variety of
                          flavors like 
                          chocolate, vanilla, strawberry, cookies & cream, etc."
                        ></Tooltip>
                      </div>
                      {touched.flavorOptions && errors.flavorOptions && (
                        <span className={styles.error}>
                          {errors.flavorOptions}
                        </span>
                      )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Amino Acid Profile
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Amino Acid Profile"
                          rows="2"
                          name="aminoAcidProfile"
                          value={values.aminoAcidProfile}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content=" Full spectrum or specific amino acids like BCAAs (Branched-Chain Amino Acids)."></Tooltip>
                      </div>
                      {touched.aminoAcidProfile && errors.aminoAcidProfile && (
                        <span className={styles.error}>
                          {errors.aminoAcidProfile}
                        </span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Fat Content<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Fat Content"
                          rows="2"
                          name="fatContent"
                          value={values.fatContent}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Varies based on type (e.g., whey isolate vs. concentrate)"></Tooltip>
                      </div>
                      {touched.fatContent && errors.fatContent && (
                        <span className={styles.error}>
                          {errors.fatContent}
                        </span>
                      )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Health Benefit
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Health Benefit"
                          rows="2"
                          name="healthBenefit"
                          value={values.healthBenefit}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Info about the health benefits (e.g., “Boosts immunity”, “Supports joint health”)"></Tooltip>
                      </div>
                      {touched.healthBenefit && errors.healthBenefit && (
                        <span className={styles.error}>
                          {errors.healthBenefit}
                        </span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Purpose</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={values.purpose}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content="     Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain
                          relief,Prevention of infection.,Cooling and soothing.
                         
                          Moisturizing and healing, procedure or use case of
                          tool, Relieves symptoms, promotes healing, or prevents
                          recurrence.)"
                        ></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={values.composition}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {touched.composition && errors.composition && (
                        <span className={styles.error}>
                          {errors.composition}
                        </span>
                      )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Additives & Sweeteners
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Additives & Sweeteners"
                          rows="2"
                          name="additivesNSweeteners"
                          value={values.additivesNSweeteners}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip
                          content=" Some proteins contain artificial sweeteners (e.g.,
                          sucralose, aspartame),
                          while others use natural sweeteners (e.g.,
                          stevia, monk fruit)."
                        ></Tooltip>
                      </div>
                      {touched.additivesNSweeteners &&
                        errors.additivesNSweeteners && (
                          <span className={styles.error}>
                            {errors.additivesNSweeteners}
                          </span>
                        )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Vegan</label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="vegan"
                            name="vegan"
                            onBlur={handleBlur}
                            checked={values?.vegan || checked["vegan"] || false}
                            onChange={(e) => {
                              handleCheckboxChange("vegan", e?.target?.checked);
                              setFieldValue("vegan", e?.target?.checked);
                            }}
                          />
                          <label className={styles.checkText} htmlFor="vegan">
                            Whether the product is vegan (i.e. <br />, no
                            animal-derived ingredients).
                          </label>
                        </span>
                        <Tooltip content="Description of the active and/or inactive ingredients and components."></Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Storage & Handling
                      </span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={values?.expiry}
                             
                            onChange={(e) =>
                              handleInputChange(e, setFieldValue, 20, "all")
                            }
                            onBlur={handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {touched.expiry && errors.expiry && (
                          <span className={styles.error}>{errors.expiry}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* End the Nutrition and Dietary Products */}

            {/* Start the Healthcare IT Solutions */}
            {selectedSchema === "HealthcareITSolutions" && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>
                    Product Identification
                  </span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Scalability Info
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Scalability Info"
                          rows="2"
                          name="scalabilityInfo"
                          value={values.scalabilityInfo}
                           
                          onChange={(e) =>
                            handleInputChange(e, setFieldValue, 2000, "all")
                          }
                          onBlur={handleBlur}
                        />
                        <Tooltip content="Easily adjustable storage to accommodate growing data volumes."></Tooltip>
                      </div>
                      {touched.scalabilityInfo && errors.scalabilityInfo && (
                        <span className={styles.error}>
                          {errors.scalabilityInfo}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>
                        Additional Information
                      </span>
                      <div className={styles.formInnerSection}>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            License<span className={styles.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter License"
                              rows="2"
                              name="license"
                              value={values.license}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 50, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="License Terms"></Tooltip>
                          </div>
                          {touched.license && errors.license && (
                            <span className={styles.error}>
                              {errors.license}
                            </span>
                          )}
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Add-Ons<span className={styles.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Add-Ons"
                              rows="2"
                              name="addOns"
                              value={values.addOns}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="White-label solutions for branding. ,Custom integrations or API usage."></Tooltip>
                          </div>
                          {touched.addOns && errors.addOns && (
                            <span className={styles.error}>
                              {errors.addOns}
                            </span>
                          )}
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            User Access
                            <span className={styles.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter User Access"
                              rows="2"
                              name="userAccess"
                              value={values.userAccess}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Patients Easy-to-use apps for booking and attending consultations."></Tooltip>
                          </div>
                          {touched.userAccess && errors.userAccess && (
                            <span className={styles.error}>
                              {errors.userAccess}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.innerMonitorSection}>
                      <span className={styles.formHead}>Technical Details</span>
                      <div className={styles.formInnerSection}>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Key Features
                            <span className={styles.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Key Features"
                              rows="2"
                              name="keyFeatures"
                              value={values.keyFeatures}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip
                              content="Remote monitoring of vital signs (e.g., heart
                              rate, blood pressure, glucose levels).
                              Real-time data transmission to healthcare
                              providers or mobile apps."
                            ></Tooltip>
                          </div>
                          {touched.keyFeatures && errors.keyFeatures && (
                            <span className={styles.error}>
                              {errors.keyFeatures}
                            </span>
                          )}
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Core Functionalities
                            <span className={styles.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Core Functionalities"
                              rows="2"
                              name="coreFunctionalities"
                              value={values.coreFunctionalities}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Continuous or on-demand monitoring (e.g., ECG, blood oxygen levels, heart rate)."></Tooltip>
                          </div>
                          {touched.coreFunctionalities &&
                            errors.coreFunctionalities && (
                              <span className={styles.error}>
                                {errors.coreFunctionalities}
                              </span>
                            )}
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Interoperability
                            <span className={styles.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Interoperability"
                              rows="2"
                              name="interoperability"
                              value={values.interoperability}
                               
                              onChange={(e) =>
                                handleInputChange(e, setFieldValue, 2000, "all")
                              }
                              onBlur={handleBlur}
                            />
                            <Tooltip content="Adheres to HL7/FHIR standards for healthcare data exchange."></Tooltip>
                          </div>
                          {touched.interoperability &&
                            errors.interoperability && (
                              <span className={styles.error}>
                                {errors.interoperability}
                              </span>
                            )}
                          <AddProductFileUpload
                            styles={styles}
                            fieldInputName={"interoperabilityFile"}
                            setFieldValue={setFieldValue}
                            initialValues={values}
                            label=""
                           
                            tooltip={false}
                            showLabel={false}
                          />

                          {touched.interoperabilityFile &&
                            errors.interoperabilityFile && (
                              <span className={styles.error}>
                                {errors.interoperabilityFile}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End the Healthcare IT Solutions */}

            {/* Start the Inventory */}
            <div className={styles.section}>
              <span className={styles.formHead}>Inventory</span>
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
                    />
                    <Tooltip content="The date when the item was assembled or manufactured. if applicable for in stock"></Tooltip>
                  </div>
                  {touched.date && errors.date && (
                    <span className={styles.error}>{errors.date}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    SKU
                  
                  </label>
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
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Stocked in Countries
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <MultiSelectDropdown
                    options={countries}
                    placeholderButtonLabel="Select Countries"
                    name="countries"
                  
                    onChange={(selectedOptions) => {
                      // Ensure we map selected options correctly
                      const selectedValues = selectedOptions
                        ? selectedOptions.map((option) => option.label)
                        : [];
                      setInventoryStockedCountries(
                        selectedValues?.map((option) => ({
                          label: option,
                          value: option,
                        })) || []
                      );
                      setFieldValue("countries", selectedValues); // Update Formik value with the selected country values
                      if (selectedValues?.length == 0) {
                        setStockedInDetails([
                          {
                            country: "",
                            quantity: "",
                            placeholder: "Enter Quantity",
                          },
                        ]);
                      }
                    }}
                  />
                  {touched.countries && errors.countries && (
                    <span className={styles.error}>{errors.countries}</span>
                  )}
                </div>
              </div>

              {inventoryStockedCountries?.length > 0 ? (
                <div className={styles.formStockContainer}>
                  <div className={styles.formHeadSection}>
                    <span className={styles.formHead}>Stocked In Details</span>
                    {
                      
                      <span
                        className={styles.formAddButton}
                        onClick={() =>
                          (values?.stockedInDetails?.length || 0) <
                            (values.countries?.length || 0) &&
                          setFieldValue("stockedInDetails", [
                            ...values.stockedInDetails,
                            {
                              country: "",
                              quantity: "",
                              placeholder: "Enter Quantity",
                            },
                          ])
                        }
                      >
                        Add More
                      </span>
                    }
                  </div>
                  {values?.stockedInDetails?.map((stock, index) => (
                    <>
                      <div key={index} className={styles.formSection}>
                        <div className={styles.productContainer}>
                          <label className={styles.formLabel}>
                            Country where Stock Trades
                          
                          </label>
                          <Select
                            className={styles.formSelect}
                            options={inventoryStockedCountries}
                            placeholder="Select Country where Stock Trades"
                            value={inventoryStockedCountries.find(
                              (option) => option.value === stock.country
                            )}
                            onBlur={handleBlur}
                            onChange={(option) =>
                              setFieldValue(
                                `stockedInDetails.${index}.country`,
                                option.value
                              )
                            }
                            isDisabled={inventoryStockedCountries?.length == 0}
                          />
                        </div>

                        <div className={styles.productContainer}>
                          <label className={styles.formLabel}>
                            Stock Quantity
                          
                          </label>
                          <div className={styles.productQuantityContainer}>
                            <div className={styles.quantitySection}>
                              <Field
                                name={`stockedInDetails.${index}.quantity`}
                                className={styles.quantityInput}
                              
                                placeholder="Enter Quantity"
                                // autoComplete="off"
                              
                                onInput={(e) => {
                                  e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6);
                                }}
                             
                              />
                           
                            </div>

                          
                          </div>
                        </div>

                        {values?.stockedInDetails?.length > 1 && (
                          <div
                            className={styles.formCloseSection}
                            onClick={() => {
                              const updatedList =
                                values.stockedInDetails.filter(
                                  (_, elindex) => elindex !== index
                                );
                              setFieldValue("stockedInDetails", updatedList);
                            }}
                          >
                            <span className={styles.formclose}>
                              <CloseIcon className={styles.icon} />
                            </span>
                          </div>
                        )}
                      </div>
                     
                      <div key={index} className={styles.formSection}>
                        <div className={styles.productContainer}>
                          <span className={styles.error}>
                            {touched.stockedInDetails?.[index]?.country &&
                              errors.stockedInDetails?.[index]?.country}
                          </span>
                        </div>

                        <div className={styles.productContainer}>
                          <span className={styles.error}>
                            {touched.stockedInDetails?.[index]?.quantity &&
                              errors.stockedInDetails?.[index]?.quantity}
                          </span>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              ) : (
                <div className={styles.formStockContainer}>
                  <div className={styles.formHeadSection}>
                    <label className={styles.formLabel}>
                      Please select Stocked in Countries to add stocked In
                      details
                    </label>
                  </div>
                </div>
              )}
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
                       
                        quantityFrom: "",
                        quantityTo: "",
                        price: "",
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
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Quantity<span className={styles.labelStamp}>*</span>
                    </label>
                   
                    <div className={styles.weightContainer}>
                      <div className={styles.weightSection}>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Quantity From"
                            // autoComplete="off"
                            name={`productPricingDetails.${index}.quantityFrom`}
                            value={
                              values.productPricingDetails[index]?.quantityFrom
                            }
                            onChange={(e) =>
                              setFieldValue(
                                `productPricingDetails.${index}.quantityFrom`,
                                e.target.value.replace(/\D/g, "") // Allow only numbers
                              )
                            }
                            onBlur={handleBlur}
                          />
                        </div>
                        <span className={styles.error}>
                          {touched.productPricingDetails?.[index]
                            ?.quantityFrom &&
                            errors.productPricingDetails?.[index]?.quantityFrom}
                        </span>
                      </div>
                      <div className={styles.weightSection}>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Quantity To"
                            // autoComplete="off"
                            name={`productPricingDetails.${index}.quantityTo`}
                            value={
                              values.productPricingDetails[index]?.quantityTo
                            }
                            onChange={(e) =>
                              setFieldValue(
                                `productPricingDetails.${index}.quantityTo`,
                                e.target.value.replace(/\D/g, "") // Allow only numbers
                              )
                            }
                            onBlur={handleBlur}
                          />
                        </div>
                        <span className={styles.error}>
                          {touched.productPricingDetails?.[index]?.quantityTo &&
                            errors.productPricingDetails?.[index]?.quantityTo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Cost Per Product
                      <span className={styles.labelStamp}>*</span>
                    </label>
                    <div className={styles.tooltipContainer}>
                      <Field
                        name={`productPricingDetails.${index}.price`}
                        type="text"
                        placeholder="Enter Cost Per Product in USD"
                        className={styles.formInput}
                        onInput={(e) => {
                          let value = e.target.value;

                          // Allow only numbers and one decimal point
                          value = value.replace(/[^0-9.]/g, "");

                          // Ensure only one decimal point exists
                          if (value.split(".").length > 2) {
                            value = value.slice(0, -1);
                          }

                          // Limit numbers before decimal to 9 digits and after decimal to 3 digits
                          let parts = value.split(".");
                          if (parts[0].length > 9) {
                            parts[0] = parts[0].slice(0, 9);
                          }
                          if (parts[1]?.length > 3) {
                            parts[1] = parts[1].slice(0, 3);
                          }

                          e.target.value = parts.join(".");
                        }}
                      />
                      <Tooltip content="The cost of the medication per unit (MRP) in Dollar"></Tooltip>
                    </div>
                    <span className={styles.error}>
                      {touched.productPricingDetails?.[index]?.price &&
                        errors.productPricingDetails?.[index]?.price}
                    </span>
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Est. Delivery Time
                      <span className={styles.labelStamp}>*</span>
                    </label>
                    <Field
                      name={`productPricingDetails.${index}.deliveryTime`}
                      type="text"
                      placeholder="Enter Est. Delivery Time in days"
                      className={styles.formInput}
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 3); // Allow only numbers & limit to 3 digits
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
                      {touched.cNCFileNDate?.[index]?.file &&
                        errors.cNCFileNDate?.[index]?.file}
                    </span>
                  </div>

                  {/* Date of Expiry Section */}
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Date of Expiry
                    
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

            {/* Start the Health & Safety */}
            <div className={styles.section}>
              <span className={styles.formHead}>Health & Safety</span>
              <div className={styles.formSection}>
                <div className={styles.productContainer}>
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"safetyDatasheet"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Safety Datasheet"
                   
                    tooltip="Specific safety information, instructions or precautions related to product"
                  />
                  {touched.safetyDatasheet && errors.safetyDatasheet && (
                    <span className={styles.error}>
                      {errors.safetyDatasheet}
                    </span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"healthHazardRating"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Health Hazard Rating"
                   
                    tooltip="Health Hazard Rating Document"
                  />
                  {touched.healthHazardRating && errors.healthHazardRating && (
                    <span className={styles.error}>
                      {errors.healthHazardRating}
                    </span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <AddProductFileUpload
                    styles={styles}
                    fieldInputName={"environmentalImpact"}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Environmental Impact"
                   
                    tooltip="Environment Impact Rating Document"
                  />
                  {touched.environmentalImpact &&
                    errors.environmentalImpact && (
                      <span className={styles.error}>
                        {errors.environmentalImpact}
                      </span>
                    )}
                </div>
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
                   
                    tooltip="Specific information, instructions related to product."
                  />
                  {touched.guidelinesFile && errors.guidelinesFile && (
                    <span className={styles.error}>
                      {errors.guidelinesFile}
                    </span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>Other Information</label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
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

            {/* Start button section */}
            <div className={styles.buttonContainer}>
              <button className={styles.buttonCancel} onClick={handleCancel}>
                Cancel
              </button>
              <button
                className={styles.buttonSubmit}
                type="submit"
                disabled={loading}
              >
                {loading ? <div className="loading-spinner"></div> : "Submit"}
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
