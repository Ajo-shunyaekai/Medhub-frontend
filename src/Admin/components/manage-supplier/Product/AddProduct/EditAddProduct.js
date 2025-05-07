import React, { useState, useEffect, useRef, useMemo } from "react";
import Select, { components } from "react-select";
import Tooltip from "./Tooltip";
import countryList from "react-select-country-list";
import DatePicker from "react-date-picker";
import CloseIcon from "@mui/icons-material/Close";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-tooltip/dist/react-tooltip.css";
import Information from "../../../../assets/Images/infomation.svg";
import { Chips } from "primereact/chips";
import "./addproduct.css";
import styles from "./addproduct.module.css";
import categoryArrays from "../../../../../utils/Category";
import { Field, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import AddProductFileUpload from "./AddPRoductFileUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  editProduct,
  fetchProductDetail,
} from "../../../../../redux/reducers/productSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EditComplianceNCertification from "./EditComplianceNCertification";
import RichTextEditor from "./ProductDescriptionEditor";
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
  editProductValidationSchema,
} from "./DropDowns";

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

// End Image Container Section
const EditAddProduct = ({ placeholder }) => {
  const { id, supplierId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { productDetail } = useSelector(
    (state) => state?.productReducer
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: editProductValidationSchema,
    onSubmit: (values) => {
      
      setLoading(true)
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        const value = values[key];
     
        if (
          (key !== "productPricingDetails" && key !== "stockedInDetails") ||
          key != "cNCFileNDate"
        ) {
          if (Array.isArray(value)) {
            
            value.forEach((item) => {
             
              if (item instanceof File) {
                formData.append(key, item); // appends the file
              } else {
                formData.append(key, item); // appends non-file array items
              }
            });
          } else if (value) {
            // Append regular fields (non-array)
            formData.append(key, value);
          }
        }
      });

      // Append the supplier ID
      const supplier_Id = supplierId;
      if (supplier_Id) {
        formData.append("supplier_id", supplierId);
      } else {
        console.error("Supplier ID not found in session storage.");
      }

      // Prepare and append 'stockedInDetails' and 'productPricingDetails' fields as JSON strings
      const stockedInDetailsUpdated = JSON.stringify(
        values?.stockedInDetails?.map((section) => ({
          country: section?.country || "",
          quantity: section?.quantity || "",
          // type: section?.type || "",
        }))
      );
      const productPricingDetailsUpdated = JSON.stringify(
        values?.productPricingDetails?.map((section) => ({
          price: section?.price || "",
          quantity: section?.quantity || "",
          quantityFrom: section?.quantityFrom || "",
          quantityTo: section?.quantityTo || "",
          deliveryTime: section?.deliveryTime || "",
        }))
      );
      const cNCFileNDateUpdated = JSON.stringify(
        values?.cNCFileNDate?.map((section) => {
          return {
            date: section?.date || "",
            file:
              typeof section?.file == "string"
                ? section?.file
                : section?.file?.[0] || "",
          };
        })
      );

      formData.append("stockedInDetails", stockedInDetailsUpdated);
      formData.append("productPricingDetails", productPricingDetailsUpdated);
      formData.append(
        "cNCFileNDate",
        cNCFileNDateUpdated?.length == 0
          ? [{ date: "", file: "" }]
          : cNCFileNDateUpdated
      );

      // Dispatch the editProduct action (or any other submit action)
      dispatch(editProduct({ id, values: formData })).then((response) => {
        if (response?.meta.requestStatus === "fulfilled") {
          navigate(`/admin/supplier/${supplierId}/products/new`); // Change this to your desired route
          setLoading(false)
        }
        setLoading(false)
      });
    },
  });
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
      type: "Box",
      placeholder: "Enter Box Quantity",
    },
  ]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [otherMaterial, setOtherMaterial] = useState("");
  const [dermatologistTested, setDermatologistTested] = useState(null);
  const [pediatricianRecommended, setPediatricianRecommended] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const parseDate = (value) => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
  //   value = value.slice(0, Number(textLimit));
  //   if (name === "dimension") {
  //     value = value.replace(/[^0-9x.]/g, "")?.toLowerCase();
  //     value = value.replace(/x{2,}/g, "x");
  //     const parts = value.split("x").map((part, index) => {
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
  const [content, setContent] = useState(formik?.values?.description || "");

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: formik?.values?.description || "Enter Product Description",
    }),
    [formik?.values?.description]
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
      (cat) =>
        cat.name ===
        categoryOptions.find(
          (option) => option?.value === formik?.values?.category
        )?.label
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

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";

    // Try to parse the date from "12 Jan 2025"
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) return dateString; // Return original if invalid date

    // Format the date as DD-MM-YYYY
    const day = String(parsedDate.getDate()).padStart(2, "0"); // 01-31
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // 01-12
    const year = parsedDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  //   useEffects
  useEffect(() => {
    id && dispatch(fetchProductDetail(`product/${id}`));
  }, [id]);

  useEffect(() => {
    if (formik && productDetail) {
      
      const general = productDetail?.general || {};
      const additional = productDetail?.additional || {};
      const inventoryDetails = productDetail?.inventoryDetails || {};
      const healthNSafety = productDetail?.healthNSafety || {};
      const secondaryMarketDetails = productDetail?.secondaryMarketDetails || {};
      const categoryDetails = productDetail?.[productDetail?.category] || {}; // Safely access category details

      formik.setValues({
        name: general?.name || "",
        description: general?.description || "",
        manufacturer: general?.manufacturer || "",
        aboutManufacturer: general?.aboutManufacturer || "",
        countryOfOrigin: general?.countryOfOrigin || "",
        upc: general?.upc || "",
        model: general?.model || "",
        image: general?.image || [], // Image field based on general object
        imageNew: [],
        brand: general?.brand || "",
        form: general?.form || "",
        quantity: general?.quantity || "", // Quantity should be from general
        volumn: general?.volumn || "",
        volumeUnit: general?.volumeUnit || "",
        dimension: general?.dimension || "",
        dimensionUnit: general?.dimensionUnit || "",
        weight: general?.weight || "",
        unit: general?.unit || "",
        unit_tax: general?.unit_tax || "",
        packageType: general?.packageType || "",
        packageMaterial: general?.packageMaterial || "",
        packageMaterialIfOther: general?.packageMaterialIfOther || "",
       
        sku: inventoryDetails?.sku || "", // Nested access for inventoryDetails
        stock: inventoryDetails?.stock || "",
        stockQuantity: inventoryDetails?.stockQuantity || "",
        countries: inventoryDetails?.countries || [], // Assuming countries exists
       
        date: inventoryDetails?.date || "",
        complianceFile: productDetail?.complianceFile || [],
        cNCFileNDate: productDetail?.cNCFileNDate?.filter(
          (ele) => ele?.file || ele?.date
        ) || [{ date: "", file: "" }],
        complianceFileNew: [],
        storage: productDetail?.storage || "",
        other: productDetail?.additional?.other || "",
        guidelinesFile: additional?.guidelinesFile || [],
        guidelinesFileNew: [],
        warranty: productDetail?.additional?.warranty || "",
        safetyDatasheet: healthNSafety?.safetyDatasheet || [],
        safetyDatasheetNew: [],
        healthHazardRating: healthNSafety?.healthHazardRating || [],
        healthHazardRatingNew: [],
        environmentalImpact: healthNSafety?.environmentalImpact || [],
        environmentalImpactNew: [],
        category: productDetail?.category || "",
        market: productDetail?.market || "",
        purchasedOn: secondaryMarketDetails?.purchasedOn || "",
        countryAvailable: secondaryMarketDetails?.countryAvailable || [],
        purchaseInvoiceFile: secondaryMarketDetails?.purchaseInvoiceFile || [],
        purchaseInvoiceFileNew: [],
        condition: secondaryMarketDetails?.condition || "",
        minimumPurchaseUnit: secondaryMarketDetails?.minimumPurchaseUnit || "",
        subCategory: categoryDetails?.subCategory || "",
        anotherCategory: categoryDetails?.anotherCategory || "",
        stockedInDetails: inventoryDetails?.stockedInDetails || [
          {
            country: "",
            quantity: "",
            type: "Box",
            placeholder: "Enter Box Quantity",
          },
        ],
        productPricingDetails: inventoryDetails?.inventoryList || [
          {
            quantity: "",
            quantityFrom: "",
            quantityTo: "",
            price: "",
            deliveryTime: "",
          },
        ],

        // Common fields of multiple categories
        drugClass: categoryDetails?.drugClass || "",
        controlledSubstance: categoryDetails?.controlledSubstance || false,
        otcClassification: categoryDetails?.otcClassification || "",
        genericName: categoryDetails?.genericName || "",
        strength: categoryDetails?.strength || "",
        composition: categoryDetails?.composition || "",
        purpose: categoryDetails?.purpose || "",
        drugAdministrationRoute: categoryDetails?.drugAdministrationRoute || "",
        expiry: categoryDetails?.expiry || "",
        allergens: categoryDetails?.allergens || "",
        formulation: categoryDetails?.formulation || "",
        vegan: categoryDetails?.vegan || false,
        crueltyFree: categoryDetails?.crueltyFree || false,
        sideEffectsAndWarnings: categoryDetails?.sideEffectsAndWarnings || "",
        thickness: categoryDetails?.thickness || "",
        interoperability: categoryDetails?.interoperability || "",
        interoperabilityFile: categoryDetails?.interoperabilityFile || [],
        interoperabilityFileNew: [],
        specification: categoryDetails?.specification || "",
        specificationFile: categoryDetails?.specificationFile || [],
        specificationFileNew: [],
        diagnosticFunctions: categoryDetails?.diagnosticFunctions || "",
        flowRate: categoryDetails?.flowRate || "",
        performanceTestingReport:
          categoryDetails?.performanceTestingReport || "",
        performanceTestingReportFile:
          categoryDetails?.performanceTestingReportFile || [],
        performanceTestingReportFileNew: [],
        additivesNSweeteners: categoryDetails?.additivesNSweeteners || "",
        powdered: categoryDetails?.powdered || false,
        productMaterial: categoryDetails?.productMaterial || "",
        productMaterialIfOther: categoryDetails?.productMaterialIfOther || "",
        texture: categoryDetails?.texture || false,
        sterilized: categoryDetails?.sterilized || false,
        chemicalResistance: categoryDetails?.chemicalResistance || false,
        fluidResistance: categoryDetails?.fluidResistance || false,
        shape: categoryDetails?.shape || "",
        coating: categoryDetails?.coating || "",
        concentration: categoryDetails?.concentration || "",
        measurementRange: categoryDetails?.measurementRange || "",
        maintenanceNotes: categoryDetails?.maintenanceNotes || "",
        compatibleEquipment: categoryDetails?.compatibleEquipment || "",
        usageRate: categoryDetails?.usageRate || "",
        adhesiveness: categoryDetails?.adhesiveness || "",
        absorbency: categoryDetails?.absorbency || "",
        targetCondition: categoryDetails?.targetCondition || "",
        elasticity: categoryDetails?.elasticity || "",
        breathability: categoryDetails?.breathability || "",
        foldability: categoryDetails?.foldability || "",
        fragrance: categoryDetails?.fragrance || "",
        healthBenefit: categoryDetails?.healthBenefit || "",
        laserType: categoryDetails?.laserType || "",
        coolingSystem: categoryDetails?.coolingSystem || "",
        spotSize: categoryDetails?.spotSize || "",
        spf: categoryDetails?.spf || "",
        dermatologistTested: categoryDetails?.dermatologistTested || "",
        dermatologistTestedFile: categoryDetails?.dermatologistTestedFile || [],
        dermatologistTestedFileNew:
          categoryDetails?.dermatologistTestedFileNew || [],
        pediatricianRecommended: categoryDetails?.pediatricianRecommended || "",
        pediatricianRecommendedFile:
          categoryDetails?.pediatricianRecommendedFile || [],
        pediatricianRecommendedFileNew:
          categoryDetails?.pediatricianRecommendedFileNew || [],
        moisturizers: categoryDetails?.moisturizers || "",
        fillerType: categoryDetails?.fillerType || "",
        filtrationEfficiency: categoryDetails?.filtrationEfficiency || "",
        layerCount: categoryDetails?.layerCount || "",
        filtrationType: categoryDetails?.filtrationType || [],
        magnificationRange: categoryDetails?.magnificationRange || "",
        objectiveLenses: categoryDetails?.objectiveLenses || "",
        powerSource: categoryDetails?.powerSource || "",
        resolution: categoryDetails?.resolution || "",
        connectivity: categoryDetails?.connectivity || "",
        casNumber: categoryDetails?.casNumber || "",
        grade: categoryDetails?.grade || "",
        physicalState: categoryDetails?.physicalState || [],
        hazardClassification: categoryDetails?.hazardClassification || [],
        noiseLevel: categoryDetails?.noiseLevel || "",
        moistureResistance: categoryDetails?.moistureResistance || "",
        colorOptions: categoryDetails?.colorOptions || "",
        lensPower: categoryDetails?.lensPower || "",
        baseCurve: categoryDetails?.baseCurve || "",
        diameter: categoryDetails?.diameter || "",
        frame: categoryDetails?.frame || "",
        lens: categoryDetails?.lens || "",
        lensMaterial: categoryDetails?.lensMaterial || "",
        maxWeightCapacity: categoryDetails?.maxWeightCapacity || "",
        gripType: categoryDetails?.gripType || "",
        lockingMechanism: categoryDetails?.lockingMechanism || "",
        typeOfSupport: categoryDetails?.typeOfSupport || "",
        batteryType: categoryDetails?.batteryType || "",
        batterySize: categoryDetails?.batterySize || "",
        healthClaims: categoryDetails?.healthClaims || "",
        healthClaimsFile: categoryDetails?.healthClaimsFile || [],
        healthClaimsFileNew: [],
        productLongevity: categoryDetails?.productLongevity || "",
        flavorOptions: categoryDetails?.flavorOptions || "",
        aminoAcidProfile: categoryDetails?.aminoAcidProfile || "",
        fatContent: categoryDetails?.fatContent || "",
        dairyFree: categoryDetails?.dairyFree || "",
        license: categoryDetails?.license || "",
        scalabilityInfo: categoryDetails?.scalabilityInfo || "",
        addOns: categoryDetails?.addOns || "",
        userAccess: categoryDetails?.userAccess || "",
        keyFeatures: categoryDetails?.keyFeatures || "",
        coreFunctionalities: categoryDetails?.coreFunctionalities || "",
      });
    }
  }, [productDetail]); // Add formik to the dependency array

  const handleCancel = () => {
    navigate(`/admin/supplier/${supplierId}/products/new`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.headContainer}>
        <span className={styles.heading}>Edit Products</span>
      </div>
      <FormikProvider value={formik}>
        
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();

            // Check if the form is changed and no validation errors
            if (Object.keys(formik.errors).length === 0) {
              formik.handleSubmit();
            } else {
              // If validation errors exist or no change, show the error message
              toast.error("Please fill the required fields correctly.");
            }
          }}
        >
          <div className={styles.section}>
            <span className={styles.formHead}>General Information</span>
            <div className={styles.formSection}>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Name<span className={styles?.labelStamp}>*</span>
                </label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Enter Product Name"
                  // autoComplete="off"
                  name="name"
                  value={formik?.values?.name}
                  
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      formik.setFieldValue,
                      100,
                      "all",
                      ["name"],
                      "&"
                    )
                  }
                  onBlur={formik?.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <span className={styles.error}>{formik.errors.name}</span>
                )}
              </div>

              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Market<span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className={styles.formSelect}
                  options={Options}
                  placeholder="Select Product Market"
                  value={Options.find(
                    (option) =>
                      option?.value?.replaceAll(" product", "") ===
                      formik?.values?.market
                  )} // Use productType directly
                  onChange={(selectedOption) => {
                    const selectedValue = selectedOption?.value; // e.g., "new product"
                    const marketValue = selectedValue?.replaceAll(
                      " product",
                      ""
                    ); // e.g., "new"
                    setProductType(selectedValue); // Update productType for rendering
                    formik.setFieldValue("market", marketValue); // Update Formik market
                  }}
                  onBlur={formik.handleBlur}
                  name="market"
                  isDisabled={true}
                />

                {formik.touched.market && formik.errors.market && (
                  <span className={styles.error}>{formik.errors.market}</span>
                )}
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Category
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className={styles.formSelect}
                  options={categoryOptions}
                  value={
                    categoryOptions.find(
                      (option) => option?.value === formik?.values?.category
                    ) || null
                  }
                  onBlur={formik?.handleBlur}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("category", selectedOption?.value); // Set formik value
                    setSelectedCategory(selectedOption); // Update local state for selected category
                    setSelectedSubCategory(null); // Reset subcategory
                    formik.setFieldValue("subCategory", ""); // Reset subcategory in form
                    setSelectedLevel3Category(null); // Reset Level 3 category
                    formik.setFieldValue("anotherCategory", ""); // Reset Level 3 category in form
                  }}
                  placeholder="Select Category"
                  isDisabled={true}
                />
                {formik.touched.category && formik.errors.category && (
                  <span className={styles.error}>{formik.errors.category}</span>
                )}
              </div>

              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Sub Category
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className={styles.formSelect}
                  options={
                    categoryOptions.find(
                      (option) => option?.value === formik?.values?.category
                    )
                      ? getSubCategories(
                        categoryOptions.find(
                          (option) =>
                            option?.value === formik?.values?.category
                        )?.label
                      )
                      : []
                  }
                  value={
                    getSubCategories(
                      categoryOptions.find(
                        (option) => option?.value === formik?.values?.category
                      )?.label
                    )?.find(
                      (option) => option?.label === formik?.values?.subCategory
                    ) || null // Ensures that value is set correctly based on formik or local state
                  }
                  onBlur={formik?.handleBlur}
                  onChange={(selectedOption) => {
                    setSelectedSubCategory(selectedOption); // Set the selectedSubCategory state
                    setSelectedLevel3Category(null); // Reset Level 3 category when subcategory changes
                    formik.setFieldValue("subCategory", selectedOption?.value); // Update Formik state
                  }}
                  placeholder="Select Sub Category"
              
                />

                {formik.touched.subCategory && formik.errors.subCategory && (
                  <span className={styles.error}>
                    {formik.errors.subCategory}
                  </span>
                )}
              </div>

              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Sub Category (Level 3)
                </label>
                <Select
                  className={styles.formSelect}
                  onBlur={formik?.handleBlur}
                  options={
                    getSubCategories(
                      categoryOptions.find(
                        (option) => option?.value === formik?.values?.category
                      )?.label
                    )?.find(
                      (option) => option?.label === formik?.values?.subCategory
                    )
                      ? getLevel3Categories(
                        getSubCategories(
                          categoryOptions.find(
                            (option) =>
                              option?.value === formik?.values?.category
                          )?.label
                        )?.find(
                          (option) =>
                            option?.label === formik?.values?.subCategory
                        ).value
                      )
                      : []
                  }
                  value={
                    selectedLevel3Category ||
                    getLevel3Categories(
                      getSubCategories(
                        categoryOptions.find(
                          (option) => option?.value === formik?.values?.category
                        )?.label
                      )?.find(
                        (option) =>
                          option?.label === formik?.values?.subCategory
                      )?.value
                    )?.find(
                      (option) =>
                        option?.value === formik?.values?.anotherCategory
                    ) ||
                    null
                  }
                  onChange={(selectedOption) => {
                    setSelectedLevel3Category(selectedOption);
                    formik.setFieldValue(
                      "anotherCategory",
                      selectedOption?.value
                    );
                  }}
                  placeholder="Select Level 3 Category"
                // isDisabled={!selectedSubCategory}
                />
              </div>

              {formik?.values?.market === "secondary" && (
                <>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Purchased On
                      <span className={styles?.labelStamp}>*</span>
                    </label>

                    <DatePicker
                      className={styles.formDate}
                      clearIcon={null}
                      format="dd/MM/yyyy"
                      placeholder="dd/MM/yyyy"
                      name="purchasedOn"
                      maxDate={new Date()}
                    
                      value={parseDate(formik?.values?.purchasedOn)}
                      onChange={(date) => {
                        formik.setFieldValue("purchasedOn", date); // This updates Formik's value
                      }}
                      onBlur={formik?.handleBlur} // Adds the blur event to track when the field is blurred
                    />
                    {formik.touched.purchasedOn &&
                      formik.errors.purchasedOn && (
                        <span className={styles.error}>
                          {formik.errors.purchasedOn}
                        </span>
                      )}
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Condition<span className={styles?.labelStamp}>*</span>
                    </label>
                    <Select
                      className={styles.formSelect}
                      options={conditionOptions}
                      placeholder="Select Condition"
                      onBlur={formik?.handleBlur}
                      value={conditionOptions.find(
                        (option) => option?.value === formik?.values?.condition
                      )}
                      onChange={(selectedOption) => {
                        formik.setFieldValue(
                          "condition",
                          selectedOption?.value
                        );
                      }}
                    />
                    {formik.touched.condition && formik.errors.condition && (
                      <span className={styles.error}>
                        {formik.errors.condition}
                      </span>
                    )}
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Country Available In
                      <span className={styles?.labelStamp}>*</span>
                    </label>

                    <MultiSelectDropdown
                      options={countries}
                      placeholderButtonLabel="Select Countries"
                      name="countryAvailable"
                      
                      value={formik.values?.countryAvailable.map((country) => ({
                        label: country,
                        value: country,
                      }))}
                      onChange={(selectedOptions) => {
                     
                        const selectedValues = selectedOptions
                          ? selectedOptions.map((option) => option?.label)
                          : [];
                        formik.setFieldValue(
                          "countryAvailable",
                          selectedValues
                        ); 
                      }}
                      onBlur={formik?.handleBlur} // Optional: add this if the component has a blur event
                    />

                    {formik.touched.countryAvailable &&
                      formik.errors.countryAvailable && (
                        <span className={styles.error}>
                          {formik.errors.countryAvailable}
                        </span>
                      )}
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Minimum Purchase Unit
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Minimum Purchase Unit"
                      // autoComplete="off"
                      name="minimumPurchaseUnit"
                      value={formik?.values?.minimumPurchaseUnit}
                      
                      onChange={(e) =>
                        handleInputChange(e, formik.setFieldValue, 4, "number")
                      }
                      onBlur={formik?.handleBlur}
                    />
                    {formik.touched.minimumPurchaseUnit &&
                      formik.errors.minimumPurchaseUnit && (
                        <span className={styles.error}>
                          {formik.errors.minimumPurchaseUnit}
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
                  value={formik?.values?.upc}
                  
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      formik.setFieldValue,
                      20,
                      "all",
                      ["upc"],
                      "-"
                    )
                  }
                  onBlur={formik?.handleBlur}
                />
                <span className={styles.error}></span>
              </div>

              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Part/Model Number
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Enter Part/Model Number"
                  // autoComplete="off"
                  name="model"
                  value={formik?.values?.model}
                  
                  onChange={(e) =>
                    handleInputChange(e, formik.setFieldValue, 20, "all")
                  }
                  onBlur={formik?.handleBlur}
                />
                {formik.touched.model && formik.errors.model && (
                  <span className={styles.error}>{formik.errors.model}</span>
                )}
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Short Description
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <textarea
                  className={styles.formInput}
                  type="text"
                  placeholder="Enter Short Description"
                  value={formik?.values?.aboutManufacturer}
                  name="aboutManufacturer"
                  onBlur={formik?.handleBlur}
                  
                  onChange={(e) =>
                    handleInputChange(e, formik.setFieldValue, 500, "all")
                  }
                />
                {formik.touched.aboutManufacturer &&
                  formik.errors.aboutManufacturer && (
                    <span className={styles.error}>
                      {formik.errors.aboutManufacturer}
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
                  value={formik?.values?.brand}
                  
                  onChange={(e) =>
                    handleInputChange(e, formik.setFieldValue, 75, "all",["brand"])
                  }
                  onBlur={formik?.handleBlur}
                />
                <span className={styles.error}></span>
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Type/Form
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <div className={styles.tooltipContainer}>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Product Type/Form"
                    // autoComplete="off"
                    name="form"
                    value={formik?.values?.form}
                    
                    onChange={(e) =>
                      handleInputChange(e, formik.setFieldValue, 25, "text")
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip
                    content="The type of product (e.g., tablet, liquid, cream, ointment,
                    Surgical, Needle Type, Syringe, Type of monitor,
                    <br /> systems, devices, mobility or platforms, wheelchair,
                    walker, cane, crutches, grab bar, scooter etc.)"
                  ></Tooltip>
                </div>
                {formik.touched.form && formik.errors.form && (
                  <span className={styles.error}>{formik.errors.form}</span>
                )}
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Total Quantity
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <div className={styles.tooltipContainer}>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Total Quantity"
                    // autoComplete="off"
                    name="quantity"
                    value={formik?.values?.quantity}
                    
                    onChange={(e) =>
                      handleInputChange(e, formik.setFieldValue, 8, "number")
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip content="Add number of tablets in a strip, bottle, or box or number of bottles in a pack."></Tooltip>
                </div>
                {formik.touched.quantity && formik.errors.quantity && (
                  <span className={styles.error}>{formik.errors.quantity}</span>
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
                     
                        name="volumn"
                        value={formik?.values?.volumn}
                       
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            formik.setFieldValue,
                            9,
                            "decimal",
                            ["volumn"]
                          )
                        }
                        onBlur={formik?.handleBlur}
                      />
                      <Tooltip
                        content=" The volume of the product (e.g., 50 mL, 100 g,
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
                      onBlur={formik?.handleBlur}
                      value={volumeUnits.find(
                        (option) => option?.value === formik?.values?.volumeUnit
                      )}
                      onChange={(selectedOption) => {
                        formik?.setFieldValue(
                          "volumeUnit",
                          selectedOption?.value
                        );
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
                        value={formik?.values?.dimension}
                       
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            formik.setFieldValue,
                            35,
                            "all",
                            ["dimension"],
                            ". x"
                          )
                        }
                        onBlur={formik?.handleBlur}
                      />
                      <Tooltip content="The dimension of the product in Height x Width x Depth."></Tooltip>
                    </div>
                  </div>
                  <div className={styles.unitSection}>
                    <Select
                      className={styles.formSelect}
                      options={dimensionUnits}
                      placeholder="Select Units"
                      onBlur={formik?.handleBlur}
                      value={dimensionUnits.find(
                        (option) =>
                          option?.value === formik?.values?.dimensionUnit
                      )}
                      onChange={(selectedOption) => {
                        formik?.setFieldValue(
                          "dimensionUnit",
                          selectedOption?.value
                        );
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
                        value={formik?.values?.weight}
                        
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            formik.setFieldValue,
                            9,
                            "decimal",
                            ["weight"]
                          )
                        }
                        onBlur={formik?.handleBlur}
                      />
                      <Tooltip content="in (g, kg, lbs, l, ml, oz, gal, t)"></Tooltip>
                    </div>
                    {formik?.touched.weight && formik?.errors.weight && (
                      <span className={styles.error}>
                        {formik?.errors.weight}
                      </span>
                    )}
                  </div>
                  <div className={styles.unitSection}>
                    <Select
                      className={styles.formSelect}
                      options={packagingUnits}
                      placeholder="Select Units"
                      onBlur={formik?.handleBlur}
                   
                      value={packagingUnits.find(
                        (option) => option?.value === formik?.values?.unit
                      )}
                      onChange={(selectedOption) => {
                        formik.setFieldValue("unit", selectedOption?.value);
                      }}
                    />
                    {formik?.touched.unit && formik?.errors.unit && (
                      <span className={styles.error}>
                        {formik?.errors.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Tax%
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <div className={styles.tooltipContainer}>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Tax in percentage"
                    // autoComplete="off"
                    name="unit_tax"
                    value={formik?.values?.unit_tax}
                    
                    onChange={(e) =>
                      handleInputChange(e, formik.setFieldValue, 9, "decimal")
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip content="Unit Tax of the product"></Tooltip>
                </div>
                {formik.errors.unit_tax && (
                  <span className={styles.error}>{formik.errors.unit_tax}</span>
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
                    value={formik?.values?.packageType}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip
                    content="The type of product packaging (e.g., bottle, tube, jar,
                    pump, blister
                    pack, strip, pouches, soft case, hard case, backpack,
                    case )."
                  ></Tooltip>
                </div>
                {formik.touched.packageType && formik.errors.packageType && (
                  <span className={styles.error}>
                    {formik.errors.packageType}
                  </span>
                )}
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
                    value={formik?.values?.packageMaterial}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip content="The material used for packaging (e.g., plastic, glass, aluminum, cardboard, thermocol etc)."></Tooltip>
                </div>

               

                {/* Display error message if any */}
                {formik.touched.packageMaterial &&
                  formik.errors.packageMaterial && (
                    <span className={styles.error}>
                      {formik.errors.packageMaterial}
                    </span>
                  )}
                {formik.touched.packageMaterialIfOther &&
                  formik.errors.packageMaterialIfOther && (
                    <span className={styles.error}>
                      {formik.errors.packageMaterialIfOther}
                    </span>
                  )}
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
                    
                    value={formik?.values?.storage}
                    onChange={(e) =>
                      handleInputChange(e, formik.setFieldValue, 30, "all")
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip content="Recommended storage (e.g., store in a cool, dry place)"></Tooltip>
                </div>
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Manufacturer Name
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Enter Manufacturer Name"
                  // autoComplete="off"
                  name="manufacturer"
                  value={formik?.values?.manufacturer}
                  onBlur={formik?.handleBlur}
                  // onChange={(e) => {
                  //   formik.setFieldValue("manufacturer", e.target.value);
                  // }}

                  onChange={(e) =>
                    handleInputChange(e, formik.setFieldValue, 75, "all",["manufacturer"])
                  }
                />
                {formik.touched.manufacturer && formik.errors.manufacturer && (
                  <span className={styles.error}>
                    {formik.errors.manufacturer}
                  </span>
                )}
              </div>

              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Manufacturer Contry of Origin
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  name="countryOfOrigin"
                  options={countries}
                  placeholder="Select Country of Origin"
                  value={
                    countries.find(
                      (option) =>
                        option.label === formik.values?.countryOfOrigin
                    ) || null
                  }
                  onBlur={formik.handleBlur}
                  onChange={(selectedOption) => {
                    formik.setFieldValue(
                      "countryOfOrigin",
                      selectedOption?.label
                    );
                  }}
                />

                {formik.touched.countryOfOrigin &&
                  formik.errors.countryOfOrigin && (
                    <span className={styles.error}>
                      {formik.errors.countryOfOrigin}
                    </span>
                  )}
              </div>

              <div className={styles.productContainer}>
                <AddProductFileUpload
                  productDetails={productDetail}
                  maxFiles={4 - (formik?.values?.image?.length || 0)}
                  fieldInputName={"imageNew"}
                  oldFieldName={"image"}
                  existingFiles={formik?.values?.image}
                  setFieldValue={formik.setFieldValue}
                  initialValues={formik?.values}
                  label="Product Image"
                  tooltip={false}
                  acceptTypes={{
                    "image/png": [],
                    "image/jpeg": [],
                    "image/jpg": [],
                  }}
                  error={
                    (formik.touched.image ||
                      formik.touched.imageNew ||
                      formik.errors.image ||
                      formik.errors.imageNew) && (
                      <div>{formik.errors.image || formik.errors.imageNew}</div>
                    )
                  }
                />
              </div>
              <div className={styles.productContainer}>
                {formik?.values?.market === "secondary" && (
                  <AddProductFileUpload
                    productDetails={productDetail}
                    maxFiles={
                      1 - (formik?.values?.purchaseInvoiceFile?.length || 0)
                    }
                    fieldInputName={"purchaseInvoiceFileNew"}
                    oldFieldName={"purchaseInvoiceFile"}
                    existingFiles={formik?.values?.purchaseInvoiceFile}
                    setFieldValue={formik.setFieldValue}
                    initialValues={formik?.values}
                    label="Purchase Invoice"
                    tooltip={false}
                    acceptTypes={{
                      "application/pdf": [],
                    }}
                    
                    error={
                      (formik.touched.purchaseInvoiceFile ||
                        formik.touched.purchaseInvoiceFileNew ||
                        formik.errors.purchaseInvoiceFile ||
                        formik.errors.purchaseInvoiceFileNew) && (
                        <div>
                          {formik.errors.purchaseInvoiceFile ||
                            formik.errors.purchaseInvoiceFileNew}
                        </div>
                      )
                    }
                  />
                )}
              </div>
              <div className={styles.descriptionContainer}>
                <RichTextEditor
                  label="Product Description"
                  name="description"
                  value={formik?.values?.description}
                  onChange={(content) =>
                    formik?.setFieldValue("description", content)
                  }
                  onBlur={() =>
                    formik?.handleBlur({ target: { name: "description" } })
                  }
                  height={300}
                />
                {formik.touched.description && formik.errors.description && (
                  <span className={styles.error}>
                    {formik.errors.description}
                  </span>
                )}
              </div>

             
            </div>
          </div>

          {/* Start the Medical Equipment And Devices */}
          {formik?.values?.category?.toLowerCase() ===
            "MedicalEquipmentAndDevices"?.toLowerCase() && (
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
                        value={formik?.values?.interoperability}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 50, "all")
                        }
                        onBlur={formik?.handleBlur}
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
                        value={formik?.values?.laserType}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 50, "all")
                        }
                        onBlur={formik?.handleBlur}
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
                        value={formik?.values?.coolingSystem}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 50, "all")
                        }
                        onBlur={formik?.handleBlur}
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
                        value={formik?.values?.spotSize}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 4, "number")
                        }
                        onBlur={formik?.handleBlur}
                      />
                      <Tooltip content="Diameter of the laser spot on the skin (in mm or cm)."></Tooltip>
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
                        value={formik?.values?.diagnosticFunctions}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 1000, "all")
                        }
                        onBlur={formik?.handleBlur}
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
                        value={formik?.values?.performanceTestingReport}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 1000, "all")
                        }
                        onBlur={formik?.handleBlur}
                      />
                      <Tooltip
                        content="Results from any internal or external product testing
                        (e.g., nebulizer output, CPAP pressure and airflow
                        testing)."
                      ></Tooltip>
                    </div>
                    <AddProductFileUpload
                      productDetails={productDetail}
                      maxFiles={
                        4 -
                        (formik?.values?.performanceTestingReportFile?.length ||
                          0)
                      }
                      fieldInputName={"performanceTestingReportFileNew"}
                      oldFieldName={"performanceTestingReportFile"}
                      existingFiles={formik?.values?.performanceTestingReportFile}
                      setFieldValue={formik.setFieldValue}
                      initialValues={formik?.values}
                      label=""
                      tooltip={false}
                      showLabel={false}
                      acceptTypes={{
                        "image/png": [],
                        "image/jpeg": [],
                        "image/jpg": [],
                        "application/pdf": [],
                      }}
                      error={
                        (formik.touched.performanceTestingReportFile ||
                          formik.touched.performanceTestingReportFileNew ||
                          formik.errors.performanceTestingReportFile ||
                          formik.errors.performanceTestingReportFileNew) && (
                          <div>
                            {formik.errors.performanceTestingReportFile ||
                              formik.errors.performanceTestingReportFileNew}
                          </div>
                        )
                      }
                    />
                  </div>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>Specification</label>
                    <span className={styles.labelStamp}>*</span>
                    <div className={styles.tooltipContainer}>
                      <textarea
                        className={styles.formInput}
                        placeholder="Enter Specification"
                        rows="2"
                        name="specification"
                        value={formik?.values?.specification}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 1000, "all")
                        }
                        onBlur={formik?.handleBlur}
                      />
                      <Tooltip content="Technical Specification of the tool  (e.g., hardware, software, network diagnostics, etc.)"></Tooltip>
                      {formik?.touched.specification &&
                        formik?.errors.specification && (
                          <span className={styles.error}>
                            {formik?.errors.specification}
                          </span>
                        )}
                    </div>
                    <AddProductFileUpload
                      productDetails={productDetail}
                      maxFiles={
                        4 - (formik?.values?.specificationFile?.length || 0)
                      }
                      fieldInputName={"specificationFileNew"}
                      oldFieldName={"specificationFile"}
                      existingFiles={formik?.values?.specificationFile}
                      setFieldValue={formik.setFieldValue}
                      initialValues={formik?.values}
                      label=""
                      tooltip={false}
                      showLabel={false}
                      acceptTypes={{
                        "image/png": [],
                        "image/jpeg": [],
                        "image/jpg": [],
                        "application/pdf": [],
                      }}
                      error={
                        (formik.touched.specificationFile ||
                          formik.touched.specificationFileNew ||
                          formik.errors.specificationFile ||
                          formik.errors.specificationFileNew) && (
                          <div>
                            {formik.errors.specificationFile ||
                              formik.errors.specificationFileNew}
                          </div>
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          {/* End the MedicalEquipmentAndDevices */}

          {/* Start the Pharmaceuticals */}
          {formik?.values?.category?.toLowerCase() ===
            "Pharmaceuticals"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Generic Name
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Generic Name"
                          // autoComplete="off"
                          name="genericName"
                          value={formik?.values?.genericName}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 50, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="The generic name of the medication (e.g., Paracetamol, Metformin, Ibuprofene)"></Tooltip>
                      </div>
                      {formik.touched.genericName &&
                        formik.errors.genericName && (
                          <span className={styles.error}>
                            {formik.errors.genericName}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Class<span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Drug Class"
                          // autoComplete="off"
                          name="drugClass"
                          value={formik?.values?.drugClass}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 25, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"></Tooltip>
                      </div>
                      {formik.touched.drugClass && formik.errors.drugClass && (
                        <span className={styles.error}>
                          {formik.errors.drugClass}
                        </span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Strength<span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Strength"
                          // autoComplete="off"
                          name="strength"
                          value={formik?.values?.strength}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 10, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="The strength or concentration of the medication (e.g.
                           500 mg, 10 mg/mL,Standard or high-strength)."
                        ></Tooltip>
                      </div>
                      {formik.touched.strength && formik.errors.strength && (
                        <span className={styles.error}>
                          {formik.errors.strength}
                        </span>
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
                          // Ensure that the value reflects the value from formik or the productDetail state
                          value={pharmaOptions.find(
                            (option) =>
                              option?.value === formik?.values?.otcClassification
                          )}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "otcClassification",
                              selectedOption?.value
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" Classification of the OTC drug by health authorities
                          (e.g., <br /> approved for general public use,
                          behind-the-counter)."
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={formik?.values?.composition}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 100, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {formik.touched.composition &&
                        formik.errors.composition && (
                          <span className={styles.error}>
                            {formik.errors.composition}
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
                          value={formik?.values?.formulation}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 50, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.purpose}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Drug Administration Route"
                          rows="2"
                          name="drugAdministrationRoute"
                          value={formik?.values?.drugAdministrationRoute}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="  Drugs can be introduced into the body by many routes,
                          such as enteric (oral, peroral, rectal),
                          parenteral (intravascular, intramuscular, subcutaneous,
                          and inhalation
                           administration) or topical (skin and mucosal
                          membranes)"
                        ></Tooltip>
                      </div>
                      {formik.touched.drugAdministrationRoute &&
                        formik.errors.drugAdministrationRoute && (
                          <span className={styles.error}>
                            {formik.errors.drugAdministrationRoute}
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
                            onBlur={formik?.handleBlur}
                            name="controlledSubstance"
                            checked={formik?.values?.controlledSubstance || false}
                            onChange={(e) => {
                              handleCheckboxChange(
                                "controlledSubstance",
                                e?.target?.checked
                              );
                              formik.setFieldValue(
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
                          OTC drugs are restricted,
                          some are only available behind the counter or on
                          prescription)."
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>

                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>Storage & Handling</span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry "
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                50,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {formik.touched.expiry && formik.errors.expiry && (
                          <span className={styles.error}>
                            {formik.errors.expiry}
                          </span>
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
                              value={formik?.values?.sideEffectsAndWarnings}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip
                              content=" Common side effects associated with the medication.
                              Known
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
                              value={formik?.values?.allergens}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content=" Common allergens in the product (e.g., parabens, sulfates, gluten etc)."></Tooltip>
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
          {formik?.values?.category?.toLowerCase() ===
            "SkinHairCosmeticSupplies"?.toLowerCase() && (
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
                          placeholder="Enter SPF"
                          // autoComplete="off"
                          name="spf"
                          value={formik?.values?.spf}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 10, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="If the product is a sunscreen, the SPF (Sun Protection Factor) rating"></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Strength<span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Strength"
                          // autoComplete="off"
                          name="strength"
                          value={formik?.values?.strength}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="The strength or concentration of the medication (e.g.
                          500 mg, 10 mg/mL,Standard or high-strength)."
                        ></Tooltip>
                      </div>
                      {formik.touched.strength && formik.errors.strength && (
                        <span className={styles.error}>
                          {formik.errors.strength}
                        </span>
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
                          value={formik?.values?.elasticity}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 50, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Stretch for tapes"></Tooltip>
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
                          value={formik?.values?.adhesiveness}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 50, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Adhesive or non-adhesive."></Tooltip>
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
                          value={formik?.values?.thickness}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 5, "numer")
                          }
                          onBlur={formik?.handleBlur}
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
                          // Ensure that the value reflects the value from formik or the productDetail state
                          value={pharmaOptions.find(
                            (option) =>
                              option?.value === formik?.values?.otcClassification
                          )}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "otcClassification",
                              selectedOption?.value
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" Classification of the OTC drug by health authorities
                          (e.g. approved for general public use,
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
                          value={formik?.values?.formulation}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.fragrance}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Whether the product contains fragrance or is fragrance-free."></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={formik?.values?.composition}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {formik.touched.composition &&
                        formik.errors.composition && (
                          <span className={styles.error}>
                            {formik.errors.composition}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Purpose<span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Purpose"
                          rows="2"
                          name="purpose"
                          value={formik?.values?.purpose}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Target Condition
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Target Condition"
                          rows="2"
                          name="targetCondition"
                          value={formik?.values?.targetCondition}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="The hair, scalp or skin condition the product is formulated to address "></Tooltip>
                      </div>
                      {formik.touched.targetCondition &&
                        formik.errors.targetCondition && (
                          <span className={styles.error}>
                            {formik.errors.targetCondition}
                          </span>
                        )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Administration Route
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Drug Administration Route"
                          rows="2"
                          name="drugAdministrationRoute"
                          value={formik?.values?.drugAdministrationRoute}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" Drugs can be introduced into the body by many routes,
                          such as enteric (oral, peroral,
                         rectal), parenteral (intravascular,
                          intramuscular, subcutaneous, and inhalation
                         administration) or topical (skin and mucosal
                          membranes) "
                        ></Tooltip>
                      </div>
                      {formik.touched.drugAdministrationRoute &&
                        formik.errors.drugAdministrationRoute && (
                          <span className={styles.error}>
                            {formik.errors.drugAdministrationRoute}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Class<span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Drug Class"
                          rows="2"
                          name="drugClass"
                          value={formik?.values?.drugClass}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"></Tooltip>
                      </div>
                      {formik.touched.drugClass && formik.errors.drugClass && (
                        <span className={styles.error}>
                          {formik.errors.drugClass}
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
                          value={formik?.values?.concentration}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are  typically 70-90%
                          concentration for optimal antimicrobial efficacy.
                           Oxygen concentration level provided by the device
                          (e.g., 95%)"
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
                          value={formik?.values?.moisturizers}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Such as aloe vera, glycerin, or Vitamin E to reduce skin irritation from frequent use"></Tooltip>
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
                          value={formik?.values?.fillerType}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                            onBlur={formik?.handleBlur}
                            checked={
                              formik?.values?.vegan || checked["vegan"] || false
                            }
                            onChange={(e) => {
                              handleCheckboxChange("vegan", e?.target?.checked);
                              formik.setFieldValue("vegan", e?.target?.checked);
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
                            onBlur={formik?.handleBlur}
                            checked={
                              formik?.values?.crueltyFree ||
                              checked["crueltyFree"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "crueltyFree",
                                e?.target?.checked
                              );
                              formik.setFieldValue(
                                "crueltyFree",
                                e?.target?.checked
                              );
                            }}
                          />

                          <label
                            className={styles.checkText}
                            htmlFor="crueltyFree"
                          >
                            Whether the product is tested on <br /> animals or is
                            cruelty-free
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
                            onBlur={formik?.handleBlur}
                            name="controlledSubstance"
                            checked={formik?.values?.controlledSubstance || false}
                            onChange={(e) => {
                              handleCheckboxChange(
                                "controlledSubstance",
                                e?.target?.checked
                              );
                              formik.setFieldValue(
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
                          OTC drugs are restricted,
                           some are only available behind the counter or on
                          prescription)."
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
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <Select
                              className={styles.formSelect}
                              options={dermatologistOptions}
                              placeholder="Select Dermatologist Tested"
                              name="dermatologistTested"
                             
                              value={dermatologistOptions.find(
                                (option) =>
                                  option?.value ===
                                  formik?.values?.dermatologistTested
                              )}
                              onChange={(selectedOption) => {
                                formik.setFieldValue(
                                  "dermatologistTested",
                                  selectedOption?.value
                                );
                                setDermatologistTested(selectedOption?.value);
                              }}
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content=" Whether the product has been dermatologist-tested for sensitivity."></Tooltip>
                          </div>
                          {formik.touched.dermatologistTested &&
                            formik.errors.dermatologistTested && (
                              <span className={styles.error}>
                                {formik.errors.dermatologistTested}
                              </span>
                            )}
                          {dermatologistTested === "Yes" && (
                            <>
                              <AddProductFileUpload
                                productDetails={productDetail}
                                maxFiles={
                                  4 -
                                  (formik?.values?.dermatologistTestedFile
                                    ?.length || 0)
                                }
                                fieldInputName={"dermatologistTestedFileNew"}
                                oldFieldName={"dermatologistTestedFile"}
                                existingFiles={
                                  formik?.values?.dermatologistTestedFile
                                }
                                setFieldValue={formik.setFieldValue}
                                initialValues={formik?.values}
                                label=""
                                tooltip={false}
                                showLabel={false}
                                acceptTypes={{
                                  "image/png": [],
                                  "image/jpeg": [],
                                  "image/jpg": [],
                                  "application/pdf": [],
                                }}
                                error={
                                  (formik.touched.dermatologistTestedFile ||
                                    formik.touched.dermatologistTestedFileNew ||
                                    formik.errors.dermatologistTestedFile ||
                                    formik.errors.dermatologistTestedFileNew) && (
                                    <div>
                                      {formik.errors.dermatologistTestedFile ||
                                        formik.errors.dermatologistTestedFileNew}
                                    </div>
                                  )
                                }
                              />
                            </>
                          )}
                        </div>

                        {/* Pediatrician Recommended */}
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Pediatrician Recommended
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <Select
                              className={styles.formSelect}
                              options={pediatricianOptions}
                              placeholder="Select Pediatrician Recommended"
                              name="pediatricianRecommended"
                              
                              value={pediatricianOptions.find(
                                (option) =>
                                  option?.value ===
                                  formik?.values?.pediatricianRecommended
                              )}
                              onChange={(selectedOption) => {
                                formik.setFieldValue(
                                  "pediatricianRecommended",
                                  selectedOption?.value
                                );
                                setPediatricianRecommended(selectedOption?.value);
                              }}
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content="Whether the product has been recommended or endorsed by pediatricians."></Tooltip>
                          </div>
                          {formik.touched.pediatricianRecommended &&
                            formik.errors.pediatricianRecommended && (
                              <span className={styles.error}>
                                {formik.errors.pediatricianRecommended}
                              </span>
                            )}
                          {pediatricianRecommended === "Yes" && (
                            <>
                              <AddProductFileUpload
                                productDetails={productDetail}
                                maxFiles={
                                  4 -
                                  (formik?.values?.pediatricianRecommendedFile
                                    ?.length || 0)
                                }
                                fieldInputName={"pediatricianRecommendedFileNew"}
                                oldFieldName={"pediatricianRecommendedFile"}
                                existingFiles={
                                  formik?.values?.pediatricianRecommendedFile
                                }
                                setFieldValue={formik.setFieldValue}
                                initialValues={formik?.values}
                                label=""
                                tooltip={false}
                                showLabel={false}
                                acceptTypes={{
                                  "image/png": [],
                                  "image/jpeg": [],
                                  "image/jpg": [],
                                  "application/pdf": [],
                                }}
                                error={
                                  (formik.touched.pediatricianRecommendedFile ||
                                    formik.touched
                                      .pediatricianRecommendedFileNew ||
                                    formik.errors.pediatricianRecommendedFile ||
                                    formik.errors
                                      .pediatricianRecommendedFileNew) && (
                                    <div>
                                      {formik.errors
                                        .pediatricianRecommendedFile ||
                                        formik.errors
                                          .pediatricianRecommendedFileNew}
                                    </div>
                                  )
                                }
                              />
                            </>
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
                              value={formik?.values?.sideEffectsAndWarnings}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip
                              content="Common side effects associated with the medication.
                              Known interactions  with other drugs or food
                              (eg. Alcohol)"
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
                              value={formik?.values?.allergens}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content="Common allergens in the product (e.g., parabens, sulfates, gluten etc)."></Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>Storage & Handling</span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                50,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                      </div>
                      {formik.touched.expiry && formik.errors.expiry && (
                        <span className={styles.error}>
                          {formik.errors.expiry}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

          {/* End the Skin, Hair and Cosmetic Supplies */}

          {/* Start the Vital Health and Wellness */}
          {formik?.values?.category?.toLowerCase() ===
            "VitalHealthAndWellness"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Generic Name
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Generic Name"
                          // autoComplete="off"
                          name="genericName"
                          value={formik?.values?.genericName}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 50, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="The generic name of the medication (e.g., Paracetamol, Metformin, Ibuprofene)"></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Strength<span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Strength"
                          // autoComplete="off"
                          name="strength"
                          value={formik?.values?.strength}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" The strength or concentration of the medication (e.g.,
                          500 mg, 10 mg/mL,Standard or high-strength)."
                        ></Tooltip>
                      </div>
                      {formik.touched.strength && formik.errors.strength && (
                        <span className={styles.error}>
                          {formik.errors.strength}
                        </span>
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
                         
                          value={pharmaOptions.find(
                            (option) =>
                              option?.value === formik?.values?.otcClassification
                          )}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "otcClassification",
                              selectedOption?.value
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="Classification of the OTC drug by health authorities
                          (e.g., approved for general public use,
                          behind-the-counter)."
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Health Benefit
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Health Benefit"
                          rows="2"
                          name="healthBenefit"
                          value={formik?.values?.healthBenefit}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Info about the health benefits (e.g., “Boosts immunity”, “Supports joint health”)"></Tooltip>
                      </div>
                      {formik.touched.healthBenefit &&
                        formik.errors.healthBenefit && (
                          <span className={styles.error}>
                            {formik.errors.healthBenefit}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={formik?.values?.composition}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 500, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {formik.touched.composition &&
                        formik.errors.composition && (
                          <span className={styles.error}>
                            {formik.errors.composition}
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
                          value={formik?.values?.formulation}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.purpose}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain relief, 
                          Prevention of infection.,Cooling and
                          soothing.,Moisturizing and healing, procedure
                          or use case of tool, Relieves symptoms, promotes
                          healing, or prevents recurrence.)"
                        ></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Administration Route
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Drug Administration Route"
                          rows="2"
                          name="drugAdministrationRoute"
                          value={formik?.values?.drugAdministrationRoute}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" Drugs can be introduced into the body by many routes,
                          such as enteric (oral, peroral, rectal), parenteral
                          (intravascular, intramuscular, <br /> subcutaneous, and
                          inhalation administration) or topical (skin and mucosal
                          membranes)"
                        ></Tooltip>
                      </div>
                      {formik.touched.drugAdministrationRoute &&
                        formik.errors.drugAdministrationRoute && (
                          <span className={styles.error}>
                            {formik.errors.drugAdministrationRoute}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Drug Class<span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Drug Class"
                          rows="2"
                          name="drugClass"
                          value={formik?.values?.drugClass}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"></Tooltip>
                      </div>
                      {formik.touched.drugClass && formik.errors.drugClass && (
                        <span className={styles.error}>
                          {formik.errors.drugClass}
                        </span>
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
                          value={formik?.values?.additivesNSweeteners}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="Some proteins contain artificial sweeteners (e.g.,
                          sucralose, aspartame),
                          while others use natural sweeteners (e.g.,
                          stevia, monk fruit)."
                        ></Tooltip>
                      </div>
                      {formik.touched.additivesNSweeteners &&
                        formik.errors.additivesNSweeteners && (
                          <span className={styles.error}>
                            {formik.errors.additivesNSweeteners}
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
                            onBlur={formik?.handleBlur}
                            name="controlledSubstance"
                            checked={formik?.values?.controlledSubstance || false}
                            onChange={() =>
                              handleCheckboxChange("controlledSubstance")
                            }
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
                          OTC drugs are  restricted, some are only available
                          behind the counter or on prescription)."
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
                            onBlur={formik?.handleBlur}
                            checked={
                              formik?.values?.vegan || checked["vegan"] || false
                            }
                            onChange={(e) => {
                              handleCheckboxChange("vegan", e?.target?.checked);
                              formik.setFieldValue("vegan", e?.target?.checked);
                            }}
                          />

                          <label className={styles.checkText} htmlFor="vegan">
                            Whether the product is vegan (i.e.
                            <br />, no animal-derived ingredients).
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
                            onBlur={formik?.handleBlur}
                            checked={
                              formik?.values?.crueltyFree ||
                              checked["crueltyFree"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "crueltyFree",
                                e?.target?.checked
                              );
                              formik.setFieldValue(
                                "crueltyFree",
                                e?.target?.checked
                              );
                            }}
                          />

                          <label
                            className={styles.checkText}
                            htmlFor="crueltyFree"
                          >
                            Whether the product is tested on <br /> animals or is
                            cruelty-free
                          </label>
                        </span>
                        <Tooltip content="Whether the product is tested on animals or is cruelty-free"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>Storage & Handling</span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                20,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {formik.touched.expiry && formik.errors.expiry && (
                          <span className={styles.error}>
                            {formik.errors.expiry}
                          </span>
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
                              value={formik?.values?.sideEffectsAndWarnings}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  500,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip
                              content=" Common side effects associated with the medication.
                              Known interactions with other drugs or food
                              (eg. Alcohol)"
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
                              value={formik?.values?.allergens}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content=" Common allergens in the product (e.g., parabens, sulfates, gluten etc)."></Tooltip>
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
          {formik?.values?.category?.toLowerCase() ===
            "MedicalConsumablesAndDisposables"?.toLowerCase() && (
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
                          placeholder="Enter Thickness"
                          // autoComplete="off"
                          name="thickness"
                          value={formik?.values?.thickness}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 5, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" The thickness of the Item (e.g., in mil or gauge)."></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Product Material</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Product Material"
                          // autoComplete="off"
                          name="productMaterial"
                          value={formik?.values?.productMaterial}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 25, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" Material used (e.g., Latex, Nitrile, Vinyl, Rubber, stainless steel, titanium etc.)."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Filtration Type</label>
                      <div className={styles.tooltipContainer}>
                        <Chips
                          value={formik?.values.filtrationType}
                          name="filtrationType"
                          onBlur={formik?.handleBlur}
                          onChange={(e) => {
                            setValue(e.value);
                            formik.setFieldValue("filtrationType", e.value);
                          }}
                          placeholder={
                            value.length === 0 ? "Press enter to add label" : ""
                          }
                        />
                        <Tooltip
                          content="Type of Filteration (e.g., PFE (Particle Filtration
                          Efficiency),  BFE (Bacterial Filtration
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
                          value={formik?.values?.purpose}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.chemicalResistance}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.shape}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.coating}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                              formik?.values?.powdered ||
                              checked["powdered"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "powdered",
                                e?.target?.checked
                              );
                              formik.setFieldValue(
                                "powdered",
                                e?.target?.checked
                              );
                            }}
                          />

                          <label className={styles.checkText} htmlFor="powdered">
                            Whether the gloves are powdered <br /> or powder-free.
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
                              formik?.values?.texture ||
                              checked["texture"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange("texture", e?.target?.checked);
                              formik.setFieldValue("texture", e?.target?.checked);
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
                      <span className={styles.formHead}>Storage & Handling</span>

                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                20,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {formik.touched.expiry && formik.errors.expiry && (
                          <span className={styles.error}>
                            {formik.errors.expiry}
                          </span>
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
                              value={formik?.values?.allergens}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
                                checked={
                                  formik?.values?.sterilized ||
                                  checked["sterilized"] ||
                                  false
                                }
                                onChange={(e) => {
                                  handleCheckboxChange(
                                    "sterilized",
                                    e?.target?.checked
                                  );
                                  formik.setFieldValue(
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
                              value={formik?.values?.filtrationEfficiency}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  4,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
                              value={formik?.values?.breathability}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  50,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content="Breathability rating (e.g., air flow resistance, Inhalation/Exhalation rate)"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Layer Count</label>
                          <div className={styles.tooltipContainer}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="Enter Layer Count"
                              // autoComplete="off"
                              name="layerCount"
                              value={formik?.values?.layerCount}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  20,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
                                  formik?.values?.fluidResistance ||
                                  checked["fluidResistance"] ||
                                  false
                                }
                                onChange={(e) => {
                                  handleCheckboxChange(
                                    "fluidResistance",
                                    e?.target?.checked
                                  );
                                  formik.setFieldValue(
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
                  </div>
                </div>
              </>
            )}
          {/* End the Medical Consumables and Disposables */}

          {/* Start the Laboratory Supplies */}
          {formik?.values?.category?.toLowerCase() ===
            "LaboratorySupplies"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Physical State</label>
                      <div className={styles.tooltipContainer}>
                        <Chips
                          value={formik?.values?.physicalState}
                          placeholder={
                            value.length === 0 ? "Press enter to add label" : ""
                          }
                          name="physicalState"
                          onBlur={formik?.handleBlur}
                          onChange={(e) => {
                            setValue(e.value);
                            formik.setFieldValue("physicalState", e.value);
                          }}
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
                          value={formik?.values?.hazardClassification}
                          placeholder={
                            value.length === 0 ? "Press enter to add label" : ""
                          }
                          name="hazardClassification"
                          onBlur={formik?.handleBlur}
                          onChange={(e) => {
                            setValue(e.value);
                            formik.setFieldValue("hazardClassification", e.value);
                          }}
                        />
                        <Tooltip content="Physical state (e.g., solid, liquid, gas)"></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Shape</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Shape"
                          rows="2"
                          name="shape"
                          value={formik?.values?.shape}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              2000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.coating}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 50, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.purpose}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain
                          relief,Prevention of infection.,Cooling and
                          soothing.,Moisturizing and healing, procedure  or
                          use case of tool, Relieves symptoms, promotes healing,
                          or prevents recurrence.)"
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
                          value={formik?.values?.casNumber}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.grade}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.concentration}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90% 
                          concentration for optimal antimicrobial efficacy. Oxygen
                          concentration level provided by the device (e.g., 95%)"
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
                          value={formik?.values?.connectivity}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.magnificationRange}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Magnification capabilities (e.g., 40x to 1000x)."></Tooltip>
                      </div>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Objective Lenses</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Objective Lenses"
                          rows="2"
                          name="objectiveLenses"
                          value={formik?.values?.objectiveLenses}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.powerSource}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 500, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.resolution}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
          {formik?.values?.category?.toLowerCase() ===
            "DiagnosticAndMonitoringDevices"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Diagnostic Functions
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Diagnostic Functions"
                          rows="2"
                          name="diagnosticFunctions"
                          value={formik?.values?.diagnosticFunctions}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Specific diagnostic tests or functions that the tool performs"></Tooltip>
                      </div>
                      {formik.touched.diagnosticFunctions &&
                        formik.errors.diagnosticFunctions && (
                          <span className={styles.error}>
                            {formik.errors.diagnosticFunctions}
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
                          value={formik?.values?.flowRate}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.concentration}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="   Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90%
                          concentration for optimal antimicrobial efficacy.
                          Oxygen concentration level provided by the device (e.g.,
                          95%)"
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
                          value={formik?.values?.measurementRange}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.noiseLevel}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Operating noise level (e.g., 40 dB)."></Tooltip>
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
                        value={formik?.values?.usageRate}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 20, "all")
                        }
                        onBlur={formik?.handleBlur}
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
                        value={formik?.values?.maintenanceNotes}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 1000, "all")
                        }
                        onBlur={formik?.handleBlur}
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
                        value={formik?.values?.compatibleEquipment}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 1000, "all")
                        }
                        onBlur={formik?.handleBlur}
                      />
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Specification
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Specification"
                          rows="2"
                          name="specification"
                          value={formik?.values?.specification}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Technical Specification of the tool  (e.g., hardware, software, network diagnostics, etc.)"></Tooltip>
                      </div>
                      {formik.touched.specification &&
                        formik.errors.specification && (
                          <span className={styles.error}>
                            {formik.errors.specification}
                          </span>
                        )}
                      <AddProductFileUpload
                        productDetails={productDetail}
                        maxFiles={
                          4 - (formik?.values?.specificationFile?.length || 0)
                        }
                        fieldInputName={"specificationFileNew"}
                        oldFieldName={"specificationFile"}
                        existingFiles={formik?.values?.specificationFile}
                        setFieldValue={formik.setFieldValue}
                        initialValues={formik?.values}
                        label=""
                        tooltip={false}
                        showLabel={false}
                        acceptTypes={{
                          "image/png": [],
                          "image/jpeg": [],
                          "image/jpg": [],
                          "application/pdf": [],
                        }}
                        error={
                          (formik.touched.specificationFile ||
                            formik.touched.specificationFileNew ||
                            formik.errors.specificationFile ||
                            formik.errors.specificationFileNew) && (
                            <div>
                              {formik.errors.specificationFile ||
                                formik.errors.specificationFileNew}
                            </div>
                          )
                        }
                      />
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
                          value={formik?.values?.performanceTestingReport}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="  Results from any internal or external product testing
                          (e.g.,
                          nebulizer output, CPAP pressure and airflow
                          testing)."
                        ></Tooltip>
                      </div>
                      <AddProductFileUpload
                        productDetails={productDetail}
                        maxFiles={
                          4 -
                          (formik?.values?.performanceTestingReportFile?.length ||
                            0)
                        }
                        fieldInputName={"performanceTestingReportFileNew"}
                        oldFieldName={"performanceTestingReportFile"}
                        existingFiles={
                          formik?.values?.performanceTestingReportFile
                        }
                        setFieldValue={formik.setFieldValue}
                        initialValues={formik?.values}
                        label=""
                        tooltip={false}
                        showLabel={false}
                        acceptTypes={{
                          "image/png": [],
                          "image/jpeg": [],
                          "image/jpg": [],
                          "application/pdf": [],
                        }}
                        error={
                          (formik.touched.performanceTestingReportFile ||
                            formik.touched.performanceTestingReportFileNew ||
                            formik.errors.performanceTestingReportFile ||
                            formik.errors.performanceTestingReportFileNew) && (
                            <div>
                              {formik.errors.performanceTestingReportFile ||
                                formik.errors.performanceTestingReportFileNew}
                            </div>
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          {/* End the Diagnostic and Monitoring Devices */}

          {/* Start the Hospital and Clinic Supplies */}
          {formik?.values?.category?.toLowerCase() ===
            "HospitalAndClinicSupplies"?.toLowerCase() && (
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
                          placeholder="Enter Thickness"
                          // autoComplete="off"
                          name="thickness"
                          value={formik?.values?.thickness}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="The thickness of the Item (e.g., in mil or gauge)."></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Product Material</label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Product Material"
                          // autoComplete="off"
                          name="productMaterial"
                          value={formik?.values?.productMaterial}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.purpose}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.chemicalResistance}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                              formik?.values?.powdered ||
                              checked["powdered"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "powdered",
                                e?.target?.checked
                              );
                              formik.setFieldValue(
                                "powdered",
                                e?.target?.checked
                              );
                            }}
                          />

                          <label className={styles.checkText} htmlFor="powdered">
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
                              formik?.values?.texture ||
                              checked["texture"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange("texture", e?.target?.checked);
                              formik.setFieldValue("texture", e?.target?.checked);
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
                      <span className={styles.formHead}>Storage & Handling</span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                20,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {formik.touched.expiry && formik.errors.expiry && (
                          <span className={styles.error}>
                            {formik.errors.expiry}
                          </span>
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
                                checked={
                                  formik?.values?.sterilized ||
                                  checked["sterilized"] ||
                                  false
                                }
                                onChange={(e) => {
                                  handleCheckboxChange(
                                    "sterilized",
                                    e?.target?.checked
                                  );
                                  formik.setFieldValue(
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
                          value={formik?.values?.adhesiveness}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 50, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.absorbency}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 50, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.elasticity}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Stretch for tapes"></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Fluid Resistance</label>
                      <div className={styles.tooltipContainer}>
                        <span className={styles.formCheckboxSection}>
                          <input
                            type="checkbox"
                            id="fluidResistance"
                            checked={
                              formik?.values?.fluidResistance ||
                              checked["fluidResistance"] ||
                              false
                            }
                            onChange={(e) => {
                              handleCheckboxChange(
                                "fluidResistance",
                                e?.target?.checked
                              );
                              formik.setFieldValue(
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
          {formik?.values?.category?.toLowerCase() ===
            "OrthopedicSupplies"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Strength<span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <input
                          className={styles.formInput}
                          type="text"
                          placeholder="Enter Strength"
                          // autoComplete="off"
                          name="strength"
                          value={formik?.values?.strength}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" The strength or concentration of the medication (e.g.,
                           500 mg, 10 mg/mL,Standard or high-strength)."
                        ></Tooltip>
                      </div>
                      {formik.touched.strength && formik.errors.strength && (
                        <span className={styles.error}>
                          {formik.errors.strength}
                        </span>
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
                          // Ensure that the value reflects the value from formik or the productDetail state
                          value={moistureOptions.find(
                            (option) =>
                              option?.value === formik?.values?.moistureResistance
                          )}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "moistureResistance",
                              selectedOption?.value
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" Whether the item is moisture resistance or not"></Tooltip>
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
                          value={formik?.values?.purpose}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"></Tooltip>
                      </div>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Target Condition
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Target Condition"
                          rows="2"
                          name="targetCondition"
                          value={formik?.values?.targetCondition}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" The hair, scalp or skin condition the product is formulated to address"></Tooltip>
                      </div>
                      {formik.touched.targetCondition &&
                        formik.errors.targetCondition && (
                          <span className={styles.error}>
                            {formik.errors.targetCondition}
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
                          value={formik?.values?.coating}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 100, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" Type of coating (e.g., antimicrobial, silicone)."></Tooltip>
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
                                checked={
                                  formik?.values?.sterilized ||
                                  checked["sterilized"] ||
                                  false
                                }
                                onChange={(e) => {
                                  handleCheckboxChange(
                                    "sterilized",
                                    e?.target?.checked
                                  );
                                  formik.setFieldValue(
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
                              value={formik?.values?.elasticity}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  20,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
                              value={formik?.values?.absorbency}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  20,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
                              value={formik?.values?.breathability}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
                              value={formik?.values?.colorOptions}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
          {formik?.values?.category?.toLowerCase() ===
            "DentalProducts"?.toLowerCase() && (
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
                          placeholder="Enter Product Material"
                          // autoComplete="off"
                          name="productMaterial"
                          value={formik?.values?.productMaterial}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.purpose}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Target Condition</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Target Condition"
                          rows="2"
                          name="targetCondition"
                          value={formik?.values?.targetCondition}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="  Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain
                          relief,Prevention 
                          of infection.,Cooling and soothing.,Moisturizing and
                          healing, procedure or use case of tool, Relieves
                           symptoms, promotes healing, or prevents
                          recurrence.)"
                        ></Tooltip>
                      </div>
                      {formik.touched.targetCondition &&
                        formik.errors.targetCondition && (
                          <span className={styles.error}>
                            {formik.errors.targetCondition}
                          </span>
                        )}
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>Storage & Handling</span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                20,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {formik.touched.expiry && formik.errors.expiry && (
                          <span className={styles.error}>
                            {formik.errors.expiry}
                          </span>
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
                            value={formik?.values?.usageRate}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                20,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
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
                            value={formik?.values?.maintenanceNotes}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                1000,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
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
                            value={formik?.values?.compatibleEquipment}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                1000,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
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
          {formik?.values?.category?.toLowerCase() ===
            "EyeCareSupplies"?.toLowerCase() && (
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
                        name="frame"
                        // Ensure that the value reflects the value from formik or the productDetail state
                        value={frameOptions.find(
                          (option) => option?.value === formik?.values?.frame
                        )}
                        onChange={(selectedOption) =>
                          formik.setFieldValue("frame", selectedOption?.value)
                        }
                        onBlur={formik?.handleBlur}
                      />
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Lens</label>

                      <Select
                        className={styles.formSelect}
                        options={lensOptions}
                        placeholder="Select Lens"
                        name="lens"
                        // Ensure that the value reflects the value from formik or the productDetail state
                        value={lensOptions.find(
                          (option) => option?.value === formik?.values?.lens
                        )}
                        onChange={(selectedOption) =>
                          formik.setFieldValue("lens", selectedOption?.value)
                        }
                        onBlur={formik?.handleBlur}
                      />
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Lens Material</label>

                      <Select
                        className={styles.formSelect}
                        options={lensmaterialOptions}
                        placeholder="Select Lens Material"
                        name="lensMaterial"
                        // Ensure that the value reflects the value from formik or the productDetail state
                        value={lensmaterialOptions.find(
                          (option) =>
                            option?.value === formik?.values?.lensMaterial
                        )}
                        onChange={(selectedOption) =>
                          formik.setFieldValue(
                            "lensMaterial",
                            selectedOption?.value
                          )
                        }
                        onBlur={formik?.handleBlur}
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
                        value={formik?.values?.diameter}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 4, "all")
                        }
                        onBlur={formik?.handleBlur}
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
                        value={formik?.values?.lensPower}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 5, "all")
                        }
                        onBlur={formik?.handleBlur}
                      />
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Base Curve</label>

                      <textarea
                        className={styles.formInput}
                        placeholder="Enter Base Curve"
                        rows="2"
                        name="baseCurve"
                        value={formik?.values?.baseCurve}
                        
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 100, "all")
                        }
                        onBlur={formik?.handleBlur}
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
                          value={formik?.values?.colorOptions}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
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

          {formik?.values?.category?.toLowerCase() ===
            "HomeHealthcareProducts"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Flow Rate</label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Flow Rate"
                          rows="2"
                          name="flowRate"
                          value={formik?.values?.flowRate}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 20, "all")
                          }
                          onBlur={formik?.handleBlur}
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
                          value={formik?.values?.concentration}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90% 
                          concentration for optimal antimicrobial efficacy. Oxygen
                          concentration level
                           provided by the device (e.g., 95%)"
                        ></Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>Storage & Handling</span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                20,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {formik.touched.expiry && formik.errors.expiry && (
                          <span className={styles.error}>
                            {formik.errors.expiry}
                          </span>
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
                              value={formik?.values?.maxWeightCapacity}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  20,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
                              value={formik?.values?.gripType}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  20,
                                  "text"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content="Type of grips or handles (e.g., ergonomic, foam, rubberized handles for better comfort)."></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Battery Type</label>
                          <div className={styles.tooltipContainer}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="Enter Battery Type"
                              // autoComplete="off"
                              name="batteryType"
                              value={formik?.values?.batteryType}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  20,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content="Type of Battery Installed to Operate the Item"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Battery Size</label>
                          <div className={styles.tooltipContainer}>
                            <input
                              className={styles.formInput}
                              type="text"
                              placeholder="Enter Battery Size"
                              // autoComplete="off"
                              name="batterySize"
                              value={formik?.values?.batterySize}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  20,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
                              value={formik?.values?.colorOptions}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content="Available colors (e.g., black, beige, grey, tortoiseshell, frame color or lense color etc)"></Tooltip>
                          </div>
                          <span className={styles.error}></span>
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>Foldability</label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Foldability"
                              rows="2"
                              name="foldability"
                              value={formik?.values?.foldability}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  100,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
                              value={formik?.values?.lockingMechanism}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
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
                              value={formik?.values?.typeOfSupport}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip
                              content="  The type of support provided by the aid (e.g.,
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
                              value={formik?.values?.performanceTestingReport}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip
                              content="  Results from any internal or external product
                              testing (e.g.,
                              nebulizer output, CPAP pressure and airflow
                              testing)."
                            ></Tooltip>
                          </div>
                          <AddProductFileUpload
                            productDetails={productDetail}
                            maxFiles={
                              4 -
                              (formik?.values?.performanceTestingReportFile
                                ?.length || 0)
                            }
                            fieldInputName={"performanceTestingReportFileNew"}
                            oldFieldName={"performanceTestingReportFile"}
                            existingFiles={
                              formik?.values?.performanceTestingReportFile
                            }
                            setFieldValue={formik.setFieldValue}
                            initialValues={formik?.values}
                            label=""
                            tooltip={false}
                            showLabel={false}
                            acceptTypes={{
                              "image/png": [],
                              "image/jpeg": [],
                              "image/jpg": [],
                              "application/pdf": [],
                            }}
                            error={
                              (formik.touched.performanceTestingReportFile ||
                                formik.touched.performanceTestingReportFileNew ||
                                formik.errors.performanceTestingReportFile ||
                                formik.errors
                                  .performanceTestingReportFileNew) && (
                                <div>
                                  {formik.errors.performanceTestingReportFile ||
                                    formik.errors.performanceTestingReportFileNew}
                                </div>
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          {/* End the Home Healthcare Products */}

          {/* Start the Alternative Medicines */}
          {formik?.values?.category?.toLowerCase() ===
            "AlternativeMedicines"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={formik?.values?.composition}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {formik.touched.composition &&
                        formik.errors.composition && (
                          <span className={styles.error}>
                            {formik.errors.composition}
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
                          value={formik?.values?.purpose}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content="  Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain
                          relief,Prevention of infection.,Cooling
                          and soothing.,Moisturizing and healing, procedure
                          or use case of tool, Relieves symptoms, promotes
                          healing, or prevents recurrence.)"
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
                          value={formik?.values?.healthClaims}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" Verified by clinical trials or regulatory agencies."></Tooltip>
                      </div>
                      <AddProductFileUpload
                        productDetails={productDetail}
                        maxFiles={
                          4 - (formik?.values?.healthClaimsFile?.length || 0)
                        }
                        fieldInputName={"healthClaimsFileNew"}
                        oldFieldName={"healthClaimsFile"}
                        existingFiles={formik?.values?.healthClaimsFile}
                        setFieldValue={formik.setFieldValue}
                        initialValues={formik?.values}
                        label=""
                        tooltip={false}
                        showLabel={false}
                        acceptTypes={{
                          "image/png": [],
                          "image/jpeg": [],
                          "image/jpg": [],
                          "application/pdf": [],
                        }}
                        error={
                          (formik.touched.healthClaimsFile ||
                            formik.touched.healthClaimsFileNew ||
                            formik.errors.healthClaimsFile ||
                            formik.errors.healthClaimsFileNew) && (
                            <div>
                              {formik.errors.healthClaimsFile ||
                                formik.errors.healthClaimsFileNew}
                            </div>
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>Storage & Handling</span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                20,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content=" Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {formik.touched.expiry && formik.errors.expiry && (
                          <span className={styles.error}>
                            {formik.errors.expiry}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          {/* End the Alternative Medicines */}

          {/* Start the Emergency and First Aid Supplies */}
          {formik?.values?.category?.toLowerCase() ===
            "EmergencyAndFirstAidSupplies"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={formik?.values?.composition}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {formik.touched.composition &&
                        formik.errors.composition && (
                          <span className={styles.error}>
                            {formik.errors.composition}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Product Longevity
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Product Longevity"
                          rows="2"
                          name="productLongevity"
                          value={formik?.values?.productLongevity}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Expected lifespan of the product (e.g., single-use vs. reusable items)."></Tooltip>
                      </div>
                      {formik.touched.productLongevity &&
                        formik.errors.productLongevity && (
                          <span className={styles.error}>
                            {formik.errors.productLongevity}
                          </span>
                        )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Foldability
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Foldability"
                          rows="2"
                          name="foldability"
                          value={formik?.values?.foldability}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 100, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Whether the product can be folded for easy storage (e.g., foldable walkers)."></Tooltip>
                      </div>
                      {formik.touched.foldability &&
                        formik.errors.foldability && (
                          <span className={styles.error}>
                            {formik.errors.foldability}
                          </span>
                        )}
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>Storage & Handling</span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                20,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {formik.touched.expiry && formik.errors.expiry && (
                          <span className={styles.error}>
                            {formik.errors.expiry}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          {/* End the Emergency and First Aid Supplies */}

          {/* Start the Disinfection and Hygiene Supplies */}
          {formik?.values?.category?.toLowerCase() ===
            "DisinfectionAndHygieneSupplies"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={formik?.values?.composition}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {formik.touched.composition &&
                        formik.errors.composition && (
                          <span className={styles.error}>
                            {formik.errors.composition}
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
                          value={formik?.values?.concentration}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90%
                          concentration  for optimal antimicrobial efficacy.
                          Oxygen concentration level provided by the device (e.g.,
                          95%)"
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
                          value={formik?.values?.formulation}
                          
                          onChange={(e) =>
                            handleInputChange(e, formik.setFieldValue, 100, "all")
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."></Tooltip>
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
                          value={formik?.values?.fragrance}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" Whether the product contains fragrance or is fragrance-free."></Tooltip>
                      </div>
                      <span className={styles.error}></span>
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>Storage & Handling</span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                20,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content="Expected shelf life of the item under proper storage conditions or Expiry date"></Tooltip>
                        </div>
                        {formik.touched.expiry && formik.errors.expiry && (
                          <span className={styles.error}>
                            {formik.errors.expiry}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          {/* End the Disinfection and Hygiene Supplies */}

          {/* Start the Nutrition and Dietary Products */}
          {formik?.values?.category?.toLowerCase() ===
            "NutritionAndDietaryProducts"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Dairy Free<span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <Select
                          className={styles.formSelect}
                          options={dairyfeeOptions}
                          placeholder="Select Dairy Free"
                          name="dairyFree"
                          // Ensure that the value reflects the value from formik or the productDetail state
                          value={dairyfeeOptions?.find(
                            (option) =>
                              option?.value === formik?.values?.dairyFree
                          )}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "dairyFree",
                              selectedOption?.value
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Is the product dairy free?"></Tooltip>
                      </div>
                      {formik.touched.dairyFree && formik.errors.dairyFree && (
                        <span className={styles.error}>
                          {formik.errors.dairyFree}
                        </span>
                      )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Flavor Options
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Flavor Options"
                          rows="2"
                          name="flavorOptions"
                          value={formik?.values?.flavorOptions}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" Protein powders often come in a wide variety of flavors
                          like 
                          chocolate, vanilla, strawberry, cookies & cream, etc."
                        ></Tooltip>
                      </div>
                      {formik.touched.flavorOptions &&
                        formik.errors.flavorOptions && (
                          <span className={styles.error}>
                            {formik.errors.flavorOptions}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Amino Acid Profile
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Amino Acid Profile"
                          rows="2"
                          name="aminoAcidProfile"
                          value={formik?.values?.aminoAcidProfile}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Full spectrum or specific amino acids like BCAAs (Branched-Chain Amino Acids)."></Tooltip>
                      </div>
                      {formik.touched.aminoAcidProfile &&
                        formik.errors.aminoAcidProfile && (
                          <span className={styles.error}>
                            {formik.errors.aminoAcidProfile}
                          </span>
                        )}
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Fat Content
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Fat Content"
                          rows="2"
                          name="fatContent"
                          value={formik?.values?.fatContent}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Varies based on type (e.g., whey isolate vs. concentrate)"></Tooltip>
                      </div>
                      {formik.touched.fatContent && formik.errors.fatContent && (
                        <span className={styles.error}>
                          {formik.errors.fatContent}
                        </span>
                      )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Health Benefit
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Health Benefit"
                          rows="2"
                          name="healthBenefit"
                          value={formik?.values?.healthBenefit}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Info about the health benefits (e.g., “Boosts immunity”, “Supports joint health”)"></Tooltip>
                      </div>
                      {formik.touched.healthBenefit &&
                        formik.errors.healthBenefit && (
                          <span className={styles.error}>
                            {formik.errors.healthBenefit}
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
                          value={formik?.values?.purpose}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain
                          relief,Prevention of infection.,Cooling and soothing.,
                          
                          Moisturizing and healing, procedure or use case of tool,
                          Relieves symptoms, promotes healing, or prevents
                          recurrence.)"
                        ></Tooltip>
                      </div>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Composition/Ingredients
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Composition/Ingredients"
                          rows="2"
                          name="composition"
                          value={formik?.values?.composition}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content="Description of the active ingredients and components of the vaccine."></Tooltip>
                      </div>
                      {formik.touched.composition &&
                        formik.errors.composition && (
                          <span className={styles.error}>
                            {formik.errors.composition}
                          </span>
                        )}
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Additives & Sweeteners
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Additives & Sweeteners"
                          rows="2"
                          name="additivesNSweeteners"
                          value={formik?.values?.additivesNSweeteners}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip
                          content=" Some proteins contain artificial sweeteners (e.g.,
                          sucralose, aspartame),
                          while others use natural sweeteners (e.g.,
                          stevia, monk fruit)."
                        ></Tooltip>
                      </div>
                      {formik.touched.additivesNSweeteners &&
                        formik.errors.additivesNSweeteners && (
                          <span className={styles.error}>
                            {formik.errors.additivesNSweeteners}
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
                            onBlur={formik?.handleBlur}
                            checked={
                              formik?.values?.vegan || checked["vegan"] || false
                            }
                            onChange={(e) => {
                              handleCheckboxChange("vegan", e?.target?.checked);
                              formik.setFieldValue("vegan", e?.target?.checked);
                            }}
                          />
                          <label className={styles.checkText} htmlFor="vegan">
                            Whether the product is vegan (i.e. <br />, no
                            animal-derived ingredients).
                          </label>
                        </span>
                        <Tooltip content=" Description of the active and/or inactive ingredients and components."></Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className={styles.innerProductContainer}>
                    <div className={styles.innerSection}>
                      <span className={styles.formHead}>Storage & Handling</span>
                      <div className={styles.productInnerContainer}>
                        <label className={styles.formLabel}>
                          Shelf Life/Expiry
                          <span className={styles?.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                          <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Shelf Life/Expiry"
                            // autoComplete="off"
                            name="expiry"
                            value={formik?.values?.expiry}
                            
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                formik.setFieldValue,
                                20,
                                "all"
                              )
                            }
                            onBlur={formik?.handleBlur}
                          />
                          <Tooltip content=" Expected shelf life of the item under proper storage conditions or Expiry date."></Tooltip>
                        </div>
                        {formik.touched.expiry && formik.errors.expiry && (
                          <span className={styles.error}>
                            {formik.errors.expiry}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          {/* End the Nutrition and Dietary Products */}

          {/* Start the Healthcare IT Solutions */}
          {formik?.values?.category?.toLowerCase() ===
            "HealthcareITSolutions"?.toLowerCase() && (
              <>
                <div className={styles.section}>
                  <span className={styles.formHead}>Product Identification</span>
                  <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Scalability Info
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles.tooltipContainer}>
                        <textarea
                          className={styles.formInput}
                          placeholder="Enter Scalability Info"
                          rows="2"
                          name="scalabilityInfo"
                          value={formik?.values?.scalabilityInfo}
                          
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              formik.setFieldValue,
                              1000,
                              "all"
                            )
                          }
                          onBlur={formik?.handleBlur}
                        />
                        <Tooltip content=" Easily adjustable storage to accommodate growing data volumes."></Tooltip>
                      </div>
                      {formik.touched.scalabilityInfo &&
                        formik.errors.scalabilityInfo && (
                          <span className={styles.error}>
                            {formik.errors.scalabilityInfo}
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
                            License
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter License"
                              rows="2"
                              name="license"
                              value={formik?.values?.license}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  50,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content=" License Terms"></Tooltip>
                          </div>
                          {formik.touched.license && formik.errors.license && (
                            <span className={styles.error}>
                              {formik.errors.license}
                            </span>
                          )}
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Add-Ons
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Add-Ons"
                              rows="2"
                              name="addOns"
                              value={formik?.values?.addOns}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content="White-label solutions for branding. ,Custom integrations or API usage."></Tooltip>
                          </div>
                          {formik.touched.addOns && formik.errors.addOns && (
                            <span className={styles.error}>
                              {formik.errors.addOns}
                            </span>
                          )}
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            User Access
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter User Access"
                              rows="2"
                              name="userAccess"
                              value={formik?.values?.userAccess}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content="Patients Easy-to-use apps for booking and attending consultations."></Tooltip>
                          </div>
                          {formik.touched.userAccess &&
                            formik.errors.userAccess && (
                              <span className={styles.error}>
                                {formik.errors.userAccess}
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
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Key Features"
                              rows="2"
                              name="keyFeatures"
                              value={formik?.values?.keyFeatures}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip
                              content="  Remote monitoring of vital signs (e.g., heart rate,
                              blood pressure, glucose levels).
                              Real-time data transmission to healthcare providers
                              or mobile apps."
                            ></Tooltip>
                          </div>
                          {formik.touched.keyFeatures &&
                            formik.errors.keyFeatures && (
                              <span className={styles.error}>
                                {formik.errors.keyFeatures}
                              </span>
                            )}
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Core Functionalities
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Core Functionalities"
                              rows="2"
                              name="coreFunctionalities"
                              value={formik?.values?.coreFunctionalities}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content="Continuous or on-demand monitoring (e.g., ECG, blood oxygen levels, heart rate)."></Tooltip>
                          </div>
                          {formik.touched.coreFunctionalities &&
                            formik.errors.coreFunctionalities && (
                              <span className={styles.error}>
                                {formik.errors.coreFunctionalities}
                              </span>
                            )}
                        </div>
                        <div className={styles.productInnerContainer}>
                          <label className={styles.formLabel}>
                            Interoperability
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <textarea
                              className={styles.formInput}
                              placeholder="Enter Interoperability"
                              rows="2"
                              name="interoperability"
                              value={formik?.values?.interoperability}
                              
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  formik.setFieldValue,
                                  1000,
                                  "all"
                                )
                              }
                              onBlur={formik?.handleBlur}
                            />
                            <Tooltip content="Adheres to HL7/FHIR standards for healthcare data exchange."></Tooltip>
                          </div>
                          {formik.touched.interoperability &&
                            formik.errors.interoperability && (
                              <span className={styles.error}>
                                {formik.errors.interoperability}
                              </span>
                            )}
                          <AddProductFileUpload
                            productDetails={productDetail}
                            maxFiles={
                              4 -
                              (formik?.values?.interoperabilityFile?.length || 0)
                            }
                            fieldInputName={"interoperabilityFileNew"}
                            oldFieldName={"interoperabilityFile"}
                            existingFiles={formik?.values?.interoperabilityFile}
                            setFieldValue={formik.setFieldValue}
                            initialValues={formik?.values}
                            label=""
                            tooltip={false}
                            showLabel={false}
                            acceptTypes={{
                              "image/png": [],
                              "image/jpeg": [],
                              "image/jpg": [],
                              "application/pdf": [],
                            }}
                            error={
                              (formik.touched.interoperabilityFile ||
                                formik.touched.interoperabilityFileNew ||
                                formik.errors.interoperabilityFile ||
                                formik.errors.interoperabilityFileNew) && (
                                <div>
                                  {formik.errors.interoperabilityFile ||
                                    formik.errors.interoperabilityFileNew}
                                </div>
                              )
                            }
                          />
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
                  SKU
                 
                </label>
                <div className={styles.tooltipContainer}>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter SKU"
                    // autoComplete="off"
                    name="sku"
                    value={formik?.values?.sku}
                    
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        formik.setFieldValue,
                        20,
                        "all",
                        ["sku"],
                        "-"
                      )
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip content="Stock-keeping unit for inventory management"></Tooltip>
                </div>
                {formik.touched.sku && formik.errors.sku && (
                  <span className={styles.error}>{formik.errors.sku}</span>
                )}
              </div>
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
                  
                    value={parseDate(formik.values.date)}
                    onChange={(date) => {
                      formik.setFieldValue("date", date); // This updates Formik's value
                    }}
                    onBlur={formik?.handleBlur} // Adds the blur event to track when the field is blurred
                  />
                  <Tooltip content="The date when the item was assembled or manufactured. if applicable for in stock"></Tooltip>
                </div>
                {formik.touched.date && formik.errors.date && (
                  <span className={styles.error}>{formik.errors.date}</span>
                )}
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Stock<span className={styles?.labelStamp}>*</span>
                </label>
                <div className={styles.tooltipContainer}>
                  <Select
                    className={styles.formSelect}
                    options={stockOptions}
                    placeholder="Select Stock"
                    name="stock"
                    // Ensure that the value reflects the value from formik or the productDetail state
                    value={stockOptions.find(
                      (option) => option?.value === formik?.values?.stock
                    )}
                    onBlur={formik?.handleBlur}
                    onChange={(selectedOption) =>
                      formik.setFieldValue("stock", selectedOption?.value)
                    }
                  />
                  <Tooltip content="If the product is in stock or out of stock or On-demand"></Tooltip>
                </div>
                {formik.touched.stock && formik.errors.stock && (
                  <span className={styles.error}>{formik.errors.stock}</span>
                )}
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Stocked in Countries
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <MultiSelectDropdown
                  options={countries}
                  placeholderButtonLabel="Select Countries"
                  name="countries"
                
                  value={formik.values?.countries.map((country) => ({
                    label: country,
                    value: country,
                  }))}
                  onChange={(selectedOptions) => {
                    // Ensure we map selected options correctly
                    const selectedValues = selectedOptions
                      ? selectedOptions.map((option) => option?.label)
                      : [];
                    setInventoryStockedCountries(
                      selectedValues?.map((option) => ({
                        label: option,
                        value: option,
                      })) || []
                    );
                    formik.setFieldValue("countries", selectedValues); // Update Formik value with the selected country values
                    if (selectedValues?.length == 0) {
                      setStockedInDetails([
                        {
                          country: "",
                          quantity: "",
                          type: "Box",
                          placeholder: "Enter Box Quantity",
                        },
                      ]);
                    }
                  }}
                />
                {formik.touched.countries && formik.errors.countries && (
                  <span className={styles.error}>
                    {formik.errors.countries}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.formStockContainer}>
              <div className={styles.formHeadSection}>
                <span className={styles.formHead}>Stocked In Details</span>
                <span
                  className={styles.formAddButton}
                  onClick={() =>
                    (formik?.values?.stockedInDetails?.length || 0) <
                    (formik?.values?.countries?.length || 0) &&
                    formik.setFieldValue("stockedInDetails", [
                      ...formik?.values?.stockedInDetails,
                      {
                        country: "",
                        quantity: "",
                        type: "Box",
                        placeholder: "Enter Box Quantity",
                      },
                    ])
                  }
                >
                  Add More
                </span>
              </div>

              {formik?.values?.countries.map((country) => ({
                label: country,
                value: country,
              }))?.length > 0 ? (
                formik?.values?.stockedInDetails?.map((stock, index) => (
                  <div key={index} className={styles.formSection}>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Country where Stock Trades
                        
                      </label>
                      <Select
                        className={styles.formSelect}
                        options={formik?.values?.countries.map((country) => ({
                          label: country,
                          value: country,
                        }))} // Map countries to the correct format
                        placeholder="Select Country where Stock Trades"
                        value={formik?.values?.countries
                          .map((country) => ({
                            label: country,
                            value: country,
                          }))
                          .find((option) => option.value === stock?.country)} // Find the selected country
                        onBlur={formik?.handleBlur}
                        onChange={(option) =>
                          formik.setFieldValue(
                            `stockedInDetails.${index}.country`,
                            option?.value
                          )
                        }
                        isDisabled={
                          formik?.values?.countries.map((country) => ({
                            label: country,
                            value: country,
                          }))?.length == 0
                        }
                      />
                      <span className={styles.error}>
                        {formik.touched.stockedInDetails?.[index]?.country &&
                          formik.errors.stockedInDetails?.[index]?.country}
                      </span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Stock Quantity
                       
                      </label>
                      <div className={styles.productQuantityContainer}>
                        <div className={styles.quantitySection}>
                          <input
                            name={`stockedInDetails.${index}.quantity`}
                            className={styles.quantityInput}
                            placeholder={stock.placeholder}
                            type="number"
                            value={
                              formik?.values?.stockedInDetails[index]
                                ?.quantity || ""
                            }
                            onChange={formik.handleChange}
                          />

                        
                        </div>

                       
                      </div>
                      <span className={styles.error}>
                        {formik.touched.stockedInDetails?.[index]?.quantity &&
                          formik.errors.stockedInDetails?.[index]?.quantity}
                      </span>
                    </div>

                    {formik?.values?.stockedInDetails?.length > 1 && (
                      <div
                        className={styles.formCloseSection}
                        onClick={() => {
                          const updatedList =
                            formik?.values?.stockedInDetails.filter(
                              (_, elindex) => elindex !== index
                            );
                          formik.setFieldValue("stockedInDetails", updatedList);
                        }}
                      >
                        <span className={styles.formclose}>
                          <CloseIcon className={styles.icon} />
                        </span>
                      </div>
                    )}
                  </div>
                ))
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
          </div>

          {/* End the Inventory */}

          {/* Start the Product Pricing */}
          <div className={styles.section}>
            <div className={styles.formHeadSection}>
              <span className={styles.formHead}>Product Pricing</span>
              <span
                className={styles.formAddButton}
                onClick={() => {
                  formik.setFieldValue("productPricingDetails", [
                    ...formik?.values?.productPricingDetails,
                    {
                      quantity: "",
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
            <FieldArray
              name="productPricingDetails"
              render={(arrayHelpers) => (
                <>
                  {formik?.values?.productPricingDetails?.map(
                    (stock, index) => (
                      <div
                        key={`product_${index}`}
                        className={styles.formSection}
                      >
                        <div className={styles.productContainer}>
                          <label className={styles.formLabel}>
                            Quantity
                            <span className={styles?.labelStamp}>*</span>
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
                                    formik?.values.productPricingDetails[index]
                                      ?.quantityFrom
                                  }
                                  onChange={(e) =>
                                    formik?.setFieldValue(
                                      `productPricingDetails.${index}.quantityFrom`,
                                      e.target.value.replace(/\D/g, "") // Allow only numbers
                                    )
                                  }
                                  onBlur={formik?.handleBlur}
                                />
                              </div>
                            </div>
                            <div className={styles.unitSection}>
                              <input
                                className={styles.formInput}
                                type="text"
                                placeholder="Quantity From"
                                // autoComplete="off"
                                name={`productPricingDetails.${index}.quantityTo`}
                                value={
                                  formik?.values.productPricingDetails[index]
                                    ?.quantityTo
                                }
                                onChange={(e) =>
                                  formik?.setFieldValue(
                                    `productPricingDetails.${index}.quantityTo`,
                                    e.target.value.replace(/\D/g, "") // Allow only numbers
                                  )
                                }
                                onBlur={formik?.handleBlur}
                              />
                             
                            </div>
                          </div>
                         
                          <span className={styles.error}>
                            {formik.touched.productPricingDetails?.[index]
                              ?.quantityFrom &&
                              formik.errors.productPricingDetails?.[index]
                                ?.quantityFrom}
                          </span>
                          <span className={styles.error}>
                            {formik.touched.productPricingDetails?.[index]
                              ?.quantityTo &&
                              formik.errors.productPricingDetails?.[index]
                                ?.quantityTo}
                          </span>
                        </div>

                        <div className={styles.productContainer}>
                          <label className={styles.formLabel}>
                            Cost Per Product
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <div className={styles.tooltipContainer}>
                            <Field
                              name={`productPricingDetails.${index}.price`}
                              type="text"
                              placeholder="Enter Cost Per Product in USD"
                              className={styles.formInput}
                            />
                            <Tooltip content="The cost of the medication per unit (MRP) in Dollar"></Tooltip>
                          </div>
                          <span className={styles.error}>
                            {formik.touched.productPricingDetails?.[index]
                              ?.price &&
                              formik.errors.productPricingDetails?.[index]
                                ?.price}
                          </span>
                        </div>

                        <div className={styles.productContainer}>
                          <label className={styles.formLabel}>
                            Est. Delivery Time
                            {/* <span className={styles?.labelStamp}>*</span> */}
                          </label>
                          <Field
                            name={`productPricingDetails.${index}.deliveryTime`}
                            type="text"
                            placeholder="Enter Est. Delivery Time in days"
                            className={styles.formInput}
                            onChange={(e) => {
                              // Allow only alphanumeric characters, spaces, hyphens
                              const value = e.target.value.replace(/[^a-zA-Z0-9 \-]/g, "");
                              formik?.setFieldValue(`productPricingDetails.${index}.deliveryTime`, value);
                            }}
                          />
                          <span className={styles.error}>
                            {formik.touched.productPricingDetails?.[index]
                              ?.deliveryTime &&
                              formik.errors.productPricingDetails?.[index]
                                ?.deliveryTime}
                          </span>
                        </div>

                        {formik?.values?.productPricingDetails?.length > 1 && (
                          <div
                            className={styles.formCloseSection}
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            <span className={styles.formclose}>
                              <CloseIcon className={styles.icon} />
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </>
              )}
            />
          </div>

          {/* End the Product Pricing */}

          {/* Start the Compliances and certificate 222222222 */}
          <div className={styles.section}>
            <div className={styles.formHeadSection}>
              <span className={styles.formHead}>
                Compliances & Certification
              </span>
              <span
                className={styles.formAddButton}
                onClick={() => {
                  // Add new file and date pair to the array
                  formik?.values?.cNCFileNDate?.length < 4 &&
                    formik?.setFieldValue("cNCFileNDate", [
                      ...formik?.values?.cNCFileNDate,
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

            {formik?.values?.cNCFileNDate?.length > 0 ? (
              formik?.values?.cNCFileNDate?.map((ele, index) => (
                <div
                  key={`certification_${index}`}
                  className={styles.formSection}
                >
                  {/* File Upload Section */}
                  <div className={styles.productContainer}>
                    <Field name={`cNCFileNDate.${index}.file`}>
                      {({ field }) => (
                        <EditComplianceNCertification
                          fieldInputName={`cNCFileNDate.${index}.file`}
                          setFieldValue={formik?.setFieldValue}
                          initialValues={formik?.values}
                          label="Regulatory Compliance"
                          tooltip={
                            "Compliance with industry standards for healthcare-related tools (e.g. HIPAA, GMP, WDA, ASTM, \n" +
                            "FDA, CE, ISO, WHO etc) HIPAA applies to healthcare-related tools, while MHRA governs GMP in \n" +
                            " the UK. The European Medicines Agency (EMA) governs GMP in Europe."
                          }
                          // Pass the selected file here
                          selectedFile={
                            typeof ele?.file == "string"
                              ? [ele?.file]
                              : ele?.file
                          }
                          preview={ele?.preview}
                          fileIndex={index}
                          isEdit={true}
                        />
                      )}
                    </Field>
                    <span className={styles.error}>
                      {formik?.touched.cNCFileNDate?.[index]?.file &&
                        formik?.errors.cNCFileNDate?.[index]?.file}
                    </span>
                  </div>

                  {/* Date of Expiry Section */}
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Date of Expiry
                    
                    </label>
                    <div className={styles.tooltipContainer}>
                     

                      <DatePicker
                        className={styles.formDate}
                        clearIcon={null}
                        format="dd/MM/yyyy"
                        placeholder="dd/MM/yyyy"
                        name={`cNCFileNDate.${index}.date`}
                        
                        value={parseDate(ele?.date)}
                        minDate={new Date()}
                        onChange={(e) => {
                         
                          formik?.setFieldValue(
                            `cNCFileNDate.${index}.date`,
                            e
                          ); // This updates Formik's value
                          formik?.setFieldTouched(
                            `cNCFileNDate.${index}.date`,
                            true,
                            true
                          );
                        }}
                        onBlur={formik?.handleBlur}
                      />
                      <span
                        className={styles.infoTooltip}
                        data-tooltip-id="sku-tooltip"
                        data-tooltip-content="The cost of the medication per unit (MRP) in Dollar"
                      >
                        <img
                          src={Information}
                          className={styles.iconTooltip}
                          alt="information"
                        />
                      </span>
                   
                    </div>
                    <span className={styles.error}>
                      {formik?.touched.cNCFileNDate?.[index]?.date &&
                        formik?.errors.cNCFileNDate?.[index]?.date}
                    </span>
                  </div>

                  {/* Remove Section */}
                  {formik?.values?.cNCFileNDate?.length > 1 && (
                    <div
                      className={styles.formCloseSection}
                      onClick={() => {
                       
                        formik?.setFieldValue(`cNCFileNDate.${index}.file`, []);
                        formik?.setFieldValue(`cNCFileNDate.${index}.date`, "");
                        formik?.setFieldValue(
                          `cNCFileNDate.${index}.preview`,
                          false
                        );

                        // Remove the row from the array
                        const updatedList = formik?.values?.cNCFileNDate.filter(
                          (_, elindex) => elindex !== index
                        );
                        const updatedList2 =
                          formik?.values?.complianceFileNew.filter(
                            (_, elindex) => elindex !== index
                          );
                        formik?.setFieldValue("cNCFileNDate", updatedList);
                        formik?.setFieldValue("complianceFile", []);
                        formik?.setFieldValue(
                          "complianceFileNew",
                          updatedList2
                        );
                      }}
                    >
                      <span className={styles.formclose}>
                        <CloseIcon className={styles.icon} />
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>No Compliances & Certification Details added</div>
            )}
          </div>

          {/* End the compliances and certificate 222222222 */}

          {/* Start the Health & Safety */}
          <div className={styles.section}>
            <span className={styles.formHead}>Health & Safety</span>
            <div className={styles.formSection}>
              <div className={styles.productContainer}>
                <AddProductFileUpload
                  productDetails={productDetail}
                  maxFiles={4 - (formik?.values?.safetyDatasheet?.length || 0)}
                  fieldInputName={"safetyDatasheetNew"}
                  oldFieldName={"safetyDatasheet"}
                  existingFiles={formik?.values?.safetyDatasheet}
                  setFieldValue={formik.setFieldValue}
                  initialValues={formik?.values}
                  label="Safety Datasheet"
                  tooltip="Specific safety information, instructions or precautions related to product"
                  acceptTypes={{
                    "image/png": [],
                    "image/jpeg": [],
                    "image/jpg": [],
                    "application/pdf": [],
                  }}
                  error={
                    (formik.touched.safetyDatasheet ||
                      formik.touched.safetyDatasheetNew ||
                      formik.errors.safetyDatasheet ||
                      formik.errors.safetyDatasheetNew) && (
                      <div>
                        {formik.errors.safetyDatasheet ||
                          formik.errors.safetyDatasheetNew}
                      </div>
                    )
                  }
                />
              </div>
              <div className={styles.productContainer}>
                <AddProductFileUpload
                  productDetails={productDetail}
                  maxFiles={4 - (formik?.values?.healthHazardRating?.length || 0)}
                  fieldInputName={"healthHazardRatingNew"}
                  oldFieldName={"healthHazardRating"}
                  existingFiles={formik?.values?.healthHazardRating}
                  setFieldValue={formik.setFieldValue}
                  initialValues={formik?.values}
                  label="Health Hazard Rating"
                  tooltip="Health Hazard Rating Document"
                  acceptTypes={{
                    "image/png": [],
                    "image/jpeg": [],
                    "image/jpg": [],
                    "application/pdf": [],
                  }}
                  error={
                    (formik.touched.healthHazardRating ||
                      formik.touched.healthHazardRatingNew ||
                      formik.errors.healthHazardRating ||
                      formik.errors.healthHazardRatingNew) && (
                      <div>
                        {formik.errors.healthHazardRating ||
                          formik.errors.healthHazardRatingNew}
                      </div>
                    )
                  }
                />
              </div>
              <div className={styles.productContainer}>
                <AddProductFileUpload
                  productDetails={productDetail}
                  maxFiles={
                    4 - (formik?.values?.environmentalImpact?.length || 0)
                  }
                  fieldInputName={"environmentalImpactNew"}
                  oldFieldName={"environmentalImpact"}
                  existingFiles={formik?.values?.environmentalImpact}
                  setFieldValue={formik.setFieldValue}
                  initialValues={formik?.values}
                  label="Environmental Impact"
                  tooltip="Environment Impact Rating Document"
                  acceptTypes={{
                    "image/png": [],
                    "image/jpeg": [],
                    "image/jpg": [],
                    "application/pdf": [],
                  }}
                  error={
                    (formik.touched.environmentalImpact ||
                      formik.touched.environmentalImpactNew ||
                      formik.errors.environmentalImpact ||
                      formik.errors.environmentalImpactNew) && (
                      <div>
                        {formik.errors.environmentalImpact ||
                          formik.errors.environmentalImpactNew}
                      </div>
                    )
                  }
                />
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
                  value={formik?.values?.warranty}
                  
                  onChange={(e) =>
                    handleInputChange(e, formik.setFieldValue, 20, "all")
                  }
                  onBlur={formik?.handleBlur}
                />
              </div>
              <div className={styles.productContainer}>
              <AddProductFileUpload
                productDetails={productDetail}
                maxFiles={4 - (formik?.values?.guidelinesFile?.length || 0)}
                fieldInputName={"guidelinesFileNew"}
                oldFieldName={"guidelinesFile"}
                existingFiles={formik?.values?.guidelinesFile}
                setFieldValue={formik.setFieldValue}
                initialValues={formik?.values}
                label="User Guidelines"
                tooltip="Specific information, instructions related to product."
                acceptTypes={{
                  "image/png": [],
                  "image/jpeg": [],
                  "image/jpg": [],
                  "application/pdf": [],
                }}
                error={
                  (formik.touched.guidelinesFile ||
                    formik.touched.guidelinesFileNew ||
                    formik.errors.guidelinesFile ||
                    formik.errors.guidelinesFileNew) && (
                    <div>
                      {formik.errors.guidelinesFile ||
                        formik.errors.guidelinesFileNew}
                    </div>
                  )
                }
              />
              </div>
              {/* )} */}
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>Other Information</label>
                <div className={styles.tooltipContainer}>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Other Information"
                    // autoComplete="off"
                    name="other"
                    value={formik?.values?.other}
                    
                    onChange={(e) =>
                      handleInputChange(e, formik.setFieldValue, 100, "all")
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip
                    content=" Any relevant, additional or other information regarding the
                    product (eg. Prescribing Info for Medication or
                    Dosage Info or regarding the shipping of large devices etc)"
                  ></Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* End the Additional Information */}

          {/* Start button section */}
          <div className={styles.buttonContainer}>
            <button className={styles.buttonCancel} onClick={handleCancel}>Cancel</button>
            <button className={styles.buttonSubmit} type="submit" disabled={loading}>
              {loading ? (
                <div className='loading-spinner'></div>
              ) : (
                'Submit'
              )}
            </button>
          </div>

          {/* End button section */}
        </form>
        {/* //   </Row> */}
      </FormikProvider>
    </div>
  );
};

export default EditAddProduct;
