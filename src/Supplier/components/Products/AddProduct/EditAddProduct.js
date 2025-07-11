import React, { useState, useEffect, useRef, useMemo } from "react";
import Select, { components } from "react-select";
import "../../../assets/style/react-input-phone.css";
import Tooltip from "../../SharedComponents/Tooltip/Tooltip";
import countryList from "react-select-country-list";
import DatePicker from "react-date-picker";
import CloseIcon from "@mui/icons-material/Close";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-tooltip/dist/react-tooltip.css";
import Information from "../../../assets/images/infomation.svg";
import { Chips } from "primereact/chips";
import "./addproduct.css";
import styles from "./addproduct.module.css";
import categoryArrays, { categoriesData } from "../../../../utils/Category";
import { Field, FieldArray, FormikProvider, useFormik } from "formik";
// import * as Yup from "yup";
// import AddProductFileUpload from "./AddPRoductFileUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  editProduct,
  fetchProductDetail,
} from "../../../../redux/reducers/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EditComplianceNCertification from "./EditComplianceNCertification";
import RichTextEditor from "./ProductDescriptionEditor";
import {
  Options,
  packagingUnits,
  volumeUnits,
  dimensionUnits,
  conditionOptions,
  stockOptions,
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
  quantityOptions,
  strengthOptions,
} from "./DropDowns";
import { AddProductFileUpload } from "../../../../utils/helper";
import EditCategoryDetails from "./EditCategoryDetails";

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
  const { productDetail } = useSelector((state) => state?.productReducer);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: editProductValidationSchema,
    onSubmit: (values) => {
      // Custom submit handler with e.preventDefault()
      setLoading(true);
      const formData = new FormData();

      // Append fields as usual
      Object.keys(values).forEach((key) => {
        const value = values[key];
        // Fixing condition to check for 'productPricingDetails' and 'stockedInDetails'
        if (
          (key !== "productPricingDetails" && key !== "stockedInDetails") ||
          key !== "cNCFileNDate" ||
          key !== "categoryDetails" ||
          key !== "faqs"
        ) {
          if (Array.isArray(value)) {
            // Append array items under the same key
            value.forEach((item) => {
              // If it's a file, append it with its index (to ensure uniqueness)
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
      // const supplierId = localStorage?.getItem("_id");
      // if (supplierId) {
      //   formData.append("supplier_id", supplierId);
      // } else {
      //   console.error("Supplier ID not found in session storage.");
      // }

      if(supplierId) {
        formData.append("supplier_id", supplierId);
      } else {
        formData.append("supplier_id", localStorage?.getItem("_id"));
      }

      // Prepare and append 'stockedInDetails' and 'productPricingDetails' fields as JSON strings
      const stockedInDetailsUpdated = JSON.stringify(
        values?.stockedInDetails?.map((section) => ({
          country: section?.country || "",
          quantity: section?.quantity || "",
          type: section?.type || "",
        }))
      );
      // const faqsUpdated = JSON.stringify(
      //   values?.faqs?.map((section) => ({
      //     ques: section?.ques || "",
      //     ans: section?.ans || "",
      //   }))
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
      const productPricingDetailsUpdated = JSON.stringify(
        values?.productPricingDetails?.map((section) => ({
          price: section?.price || "",
          // quantity: section?.quantity || "",
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

      formData.append("stockedInDetails", stockedInDetailsUpdated);
      // formData.append("faqs", faqsUpdated);
      formData.append("faqs", faqsUpdated.length > 0 ? faqsUpdated : JSON.stringify([]));
      formData.append("productPricingDetails", productPricingDetailsUpdated);
      formData.append(
        "cNCFileNDate",
        cNCFileNDateUpdated?.length === 0
          ? [{ date: "", file: "" }]
          : cNCFileNDateUpdated
      );
      formData.append(
        "categoryDetails",
        categoryDetailsUpdated?.length === 0
          ? [
              {
                name: "",
                type: "",
                fieldValue: "",
              },
            ]
          : categoryDetailsUpdated
      );

      // Dispatch the editProduct action (or any other submit action)
      dispatch(editProduct({ id, values: formData })).then((response) => {
        if (response?.meta.requestStatus === "fulfilled") {
          if(supplierId) {
            navigate(`/admin/supplier/${supplierId}/products/new`);
          } else {
            navigate(`/supplier/product-details/${id}`);
          }
          setLoading(false);
        }
        setLoading(false);
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
  const [content, setContent] = useState(formik?.values?.description || "");

  // const config = useMemo(
  //   () => ({
  //     readonly: false,
  //     placeholder: formik?.values?.description || "Enter Product Description",
  //   }),
  //   [formik?.values?.description]
  // );

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
      // Destructure the general part of productDetail to simplify access
      const general = productDetail?.general || {};
      const additional = productDetail?.additional || {};
      const inventoryDetails = productDetail?.inventoryDetails || {};
      const healthNSafety = productDetail?.healthNSafety || {};
      const secondaryMarketDetails =
        productDetail?.secondaryMarketDetails || {};
      // const categoryDetails = productDetail?.[productDetail?.category] || {}; // Safely access category details

      formik?.setValues({
        name: general?.name || "",
        description: general?.description || "",
        strength: general?.strength || "",
        strengthUnit: general?.strengthUnit || "",
        tags:
          general?.tags?.length > 1
            ? general?.tags?.join(", ")
            : general?.tags || "",
        manufacturer: general?.manufacturer || "",
        aboutManufacturer: general?.aboutManufacturer || "",
        countryOfOrigin: general?.countryOfOrigin || "",
        upc: general?.upc || "",
        model: general?.model || "",
        imageFront: general?.image?.front
          ? general?.image?.front
          : Array.isArray(general?.image) &&
            general?.image?.length > 0 &&
            general?.image?.[0]
          ? [general?.image?.[0]]
          : [] || [], // ImageFront field based on general object
        imageFrontNew: [],
        imageBack: general?.image?.back
          ? general?.image?.back
          : Array.isArray(general?.image) &&
            general?.image?.length > 0 &&
            general?.image?.[1]
          ? [general?.image?.[1]]
          : [] || [], // ImageBack field based on general object
        imageBackNew: [],
        imageSide: general?.image?.side
          ? general?.image?.side
          : Array.isArray(general?.image) &&
            general?.image?.length > 0 &&
            general?.image?.[2]
          ? [general?.image?.[2]]
          : [] || [], // ImageSide field based on general object
        imageSideNew: [],
        imageClosure: general?.image?.closeup
          ? general?.image?.closeup
          : Array.isArray(general?.image) &&
            general?.image?.length > 0 &&
            general?.image?.[3]
          ? [general?.image?.[3]]
          : [] || [], // ImageClosure field based on general object
        imageClosureNew: [],
        specificationSheet: productDetail?.documents?.specification || [], // specificationSheet field based on general object
        specificationSheetNew: [],
        catalogue: productDetail?.documents?.catalogue || [], // catalogue field based on general object
        catalogueNew: [],
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
        faqs:
          productDetail?.faqs?.filter((ele) => ele?.ques || ele?.answ) || [],
        complianceFileNew: [],
        categoryDetailsFile: productDetail?.categoryDetailsFile || [],
        categoryDetails:
          productDetail?.categoryDetails?.filter(
            (ele) => ele?.fieldValue || ele?.name || ele?.type
          ) || [],
        categoryDetailsFileNew: [],
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
        minimumPurchaseUnit:
          secondaryMarketDetails?.minimumPurchaseUnit ||
          general?.minimumPurchaseUnit ||
          "",
        // subCategory: categoryDetails?.subCategory || "",
        subCategory:
          productDetail?.[productDetail?.category]?.subCategory ||
          productDetail?.subCategory ||
          "",
        anotherCategory:
          productDetail?.[productDetail?.category]?.anotherCategory ||
          productDetail?.anotherCategory ||
          "",
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
            // quantity: "",
            quantityFrom: "",
            quantityTo: "",
            price: "",
            deliveryTime: "",
          },
        ],
      });
    }
  }, [productDetail]); // Add formik to the dependency array

  const handleCancel = () => {
    if(supplierId) {
      navigate(`/admin/supplier/${supplierId}/products/new`);
    } else {
      navigate(`/supplier/product-details/${id}`);
    }
    
  };
  // Handlers for Stocked in Details
  const addStockedInSection = (setFieldValue, values) => {
    setFieldValue("stockedInDetails", [
      ...values?.stockedInDetails,
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
    console.log('type',type)
    setFieldValue(`stockedInDetails[${index}].type`, type);
  };

  const removeStockedInFormSection = (index, setFieldValue, values) => {
    const updatedList = values?.stockedInDetails.filter((_, i) => i !== index);
    setFieldValue("stockedInDetails", updatedList);
  };

  // Handlers for Add Other Details
  const addcategoryDetailsSection = (setFieldValue, values) => {
    setFieldValue("categoryDetails", [
      ...values?.categoryDetails,
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
    const updatedList = values?.categoryDetails.filter((_, i) => i !== index);
    setFieldValue("categoryDetails", updatedList);
  };

  // Handlers for FAQs
  const addFAQs = (setFieldValue, values) => {
    setFieldValue("faqs", [
      ...values?.faqs,
      { ques: "", ans: "" },
    ]);
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
    const updatedList = values?.faqs.filter((_, i) => i !== index);
    setFieldValue("faqs", updatedList);
  };

  return (
    <div className={styles?.container}>
      <div className={styles?.headContainer}>
        <span className={styles?.heading}>Edit Products</span>
      </div>
      <FormikProvider value={formik}>
        {/* <Row> */}
        <form
          className={styles?.form}
          onSubmit={(e) => {
            e.preventDefault();

            const fields = Object.keys(formik?.initialValues);
            const touchedFields = fields.reduce((acc, key) => {
              acc[key] = true;
              return acc;
            }, {});

            // Mark all fields as touched to trigger validation display
            formik?.setTouched(touchedFields, true);

            // Check if the form is valid
            if (Object.keys(formik?.errors).length === 0) {
              formik?.handleSubmit();
            } else {
              console.log('formik?.errors',formik?.errors)
              toast.error("Please fill the required fields correctly.");
            }
          }}
        >
          <div className={styles?.section}>
            <span className={styles?.formHead}>General Information</span>
            <div className={styles?.formSection}>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Product Name<span className={styles?.labelStamp}>*</span>
                </label>
                <input
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Product Name"
                  // autoComplete="off"
                  name="name"
                  value={formik?.values?.name}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      formik?.setFieldValue,
                      100,
                      "all",
                      ["name"],
                      "&"
                    )
                  }
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.name && formik?.errors?.name && (
                  <span className={styles?.error}>{formik?.errors?.name}</span>
                )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Product Market<span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className={styles?.formSelect}
                  options={Options}
                  placeholder="Select Product Market"
                  value={Options.find(
                    (option) =>
                      option?.value?.replaceAll(" product", "") ===
                      formik?.values?.market
                  )}
                  onChange={(selectedOption) => {
                    const selectedValue = selectedOption?.value; // e.g., "new product"
                    const marketValue = selectedValue?.replaceAll(
                      " product",
                      ""
                    ); // e.g., "new"
                    setProductType(selectedValue); // Update productType for rendering
                    formik?.setFieldValue("market", marketValue); // Update Formik market
                  }}
                  onBlur={formik?.handleBlur}
                  name="market"
                  isDisabled={true}
                />

                {formik?.touched?.market && formik?.errors?.market && (
                  <span className={styles?.error}>
                    {formik?.errors?.market}
                  </span>
                )}
              </div>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Product Category
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className={styles?.formSelect}
                  options={categoryOptions}
                  value={
                    categoryOptions.find(
                      (option) => option?.value === formik?.values?.category
                    ) || null
                  }
                  onBlur={formik?.handleBlur}
                  onChange={(selectedOption) => {
                    formik?.setFieldValue("category", selectedOption?.value); // Set formik value
                    setSelectedCategory(selectedOption); // Update local state for selected category
                    setSelectedSubCategory(null); // Reset subcategory
                    formik?.setFieldValue("subCategory", ""); // Reset subcategory in form
                    setSelectedLevel3Category(null); // Reset Level 3 category
                    formik?.setFieldValue("anotherCategory", ""); // Reset Level 3 category in form
                    formik?.setFieldValue("categoryDetails", []); // Reset categoryDetails in form
                  }}
                  placeholder="Select Category"
                  isDisabled={true}
                />
                {formik?.touched?.category && formik?.errors?.category && (
                  <span className={styles?.error}>
                    {formik?.errors?.category}
                  </span>
                )}
              </div>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Product Sub Category
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className={styles?.formSelect}
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
                    formik?.setFieldValue("subCategory", selectedOption?.value); // Update Formik state
                  }}
                  placeholder="Select Sub Category"
                />

                {formik?.touched?.subCategory &&
                  formik?.errors?.subCategory && (
                    <span className={styles?.error}>
                      {formik?.errors?.subCategory}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Product Sub Category (Level 3)
                </label>
                <Select
                  className={styles?.formSelect}
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
                    formik?.setFieldValue(
                      "anotherCategory",
                      selectedOption?.value
                    );
                  }}
                  placeholder="Select Level 3 Category"
                />
              </div>

              {formik?.values?.market === "secondary" && (
                <>
                  <div className={styles?.productContainer}>
                    <label className={styles?.formLabel}>
                      Purchased On
                      <span className={styles?.labelStamp}>*</span>
                    </label>

                    <DatePicker
                      className={styles?.formDate}
                      clearIcon={null}
                      format="dd/MM/yyyy"
                      placeholder="dd/MM/yyyy"
                      name="purchasedOn"
                      maxDate={new Date()}
                      value={parseDate(formik?.values?.purchasedOn)}
                      onChange={(date) => {
                        formik?.setFieldValue("purchasedOn", date); // This updates Formik's value
                      }}
                      onBlur={formik?.handleBlur} // Adds the blur event to track when the field is blurred
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                    {formik?.touched?.purchasedOn &&
                      formik?.errors?.purchasedOn && (
                        <span className={styles?.error}>
                          {formik?.errors?.purchasedOn}
                        </span>
                      )}
                  </div>

                  <div className={styles?.productContainer}>
                    <label className={styles?.formLabel}>
                      Condition<span className={styles?.labelStamp}>*</span>
                    </label>
                    <Select
                      className={styles?.formSelect}
                      options={conditionOptions}
                      placeholder="Select Condition"
                      onBlur={formik?.handleBlur}
                      value={conditionOptions.find(
                        (option) => option?.value === formik?.values?.condition
                      )}
                      onChange={(selectedOption) => {
                        formik?.setFieldValue(
                          "condition",
                          selectedOption?.value
                        );
                      }}
                    />
                    {formik?.touched?.condition &&
                      formik?.errors?.condition && (
                        <span className={styles?.error}>
                          {formik?.errors?.condition}
                        </span>
                      )}
                  </div>

                  <div className={styles?.productContainer}>
                    <label className={styles?.formLabel}>
                      Country Available In
                      <span className={styles?.labelStamp}>*</span>
                    </label>

                    <MultiSelectDropdown
                      options={countries}
                      placeholderButtonLabel="Select Countries"
                      name="countryAvailable"
                      value={formik?.values?.countryAvailable.map(
                        (country) => ({
                          label: country,
                          value: country,
                        })
                      )}
                      onChange={(selectedOptions) => {
                        // Ensure we map selected options correctly
                        const selectedValues = selectedOptions
                          ? selectedOptions.map((option) => option?.label)
                          : [];
                        formik?.setFieldValue(
                          "countryAvailable",
                          selectedValues
                        ); // Update Formik value with the selected country values
                      }}
                      onBlur={formik?.handleBlur} // Optional: add this if the component has a blur event
                    />

                    {formik?.touched?.countryAvailable &&
                      formik?.errors?.countryAvailable && (
                        <span className={styles?.error}>
                          {formik?.errors?.countryAvailable}
                        </span>
                      )}
                  </div>
                </>
              )}
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Minimum Order Quantity
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <input
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Minimum Order Quantity"
                  // autoComplete="off"
                  name="minimumPurchaseUnit"
                  value={formik?.values?.minimumPurchaseUnit}
                  onChange={(e) =>
                    handleInputChange(e, formik?.setFieldValue, 4, "number")
                  }
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.minimumPurchaseUnit &&
                  formik?.errors?.minimumPurchaseUnit && (
                    <span className={styles?.error}>
                      {formik?.errors?.minimumPurchaseUnit}
                    </span>
                  )}
              </div>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Strength</label>
                <div className={styles?.weightContainer}>
                  <div className={styles?.weightSection}>
                    <div className={styles?.tooltipContainer}>
                      <input
                        className={styles?.formInput}
                        type="text"
                        placeholder="Enter Strength"
                        // autoComplete="off"
                        name="strength"
                        value={formik?.values?.strength}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                      />
                    </div>
                  </div>
                  <div className={styles?.unitSection}>
                    <Select
                      className={styles.formSelect}
                      name="strengthUnit"
                      options={strengthOptions}
                      placeholder="Select Units"
                      onBlur={formik?.handleBlur}
                      value={
                        strengthOptions.find(
                          (option) =>
                            option.label === formik?.values?.strengthUnit
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        formik?.setFieldValue(
                          "strengthUnit",
                          selectedOption?.value
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  UPC (Universal Product Code)
                </label>
                <input
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter UPC"
                  // autoComplete="off"
                  name="upc"
                  value={formik?.values?.upc}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      formik?.setFieldValue,
                      20,
                      "all",
                      ["upc"],
                      "-"
                    )
                  }
                  onBlur={formik?.handleBlur}
                />
                <span className={styles?.error}></span>
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Part/Model Number
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <input
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Part/Model Number"
                  // autoComplete="off"
                  name="model"
                  value={formik?.values?.model}
                  onChange={(e) =>
                    handleInputChange(e, formik?.setFieldValue, 20, "all")
                  }
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.model && formik?.errors?.model && (
                  <span className={styles?.error}>{formik?.errors?.model}</span>
                )}
              </div>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Brand Name</label>
                <input
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Brand Name"
                  // autoComplete="off"
                  name="brand"
                  value={formik?.values?.brand}
                  onChange={(e) =>
                    handleInputChange(e, formik?.setFieldValue, 75, "all", [
                      "brand",
                    ])
                  }
                  onBlur={formik?.handleBlur}
                />
                <span className={styles?.error}></span>
              </div>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Product Type/Form
                  {/* <span className={styles?.labelStamp}>*</span> */}
                </label>
                <div className={styles?.tooltipContainer}>
                  <input
                    className={styles?.formInput}
                    type="text"
                    placeholder="Enter Product Type/Form"
                    // autoComplete="off"
                    name="form"
                    value={formik?.values?.form}
                    onChange={(e) =>
                      handleInputChange(e, formik?.setFieldValue, 25, "text")
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
                {/* {formik?.touched?.form && formik?.errors?.form && (
                  <span className={styles?.error}>{formik?.errors?.form}</span>
                )} */}
              </div>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Product Tax%
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <div className={styles?.tooltipContainer}>
                  <input
                    className={styles?.formInput}
                    type="text"
                    placeholder="Enter Tax in percentage"
                    // autoComplete="off"
                    name="unit_tax"
                    value={formik?.values?.unit_tax}
                    onChange={(e) =>
                      handleInputChange(e, formik?.setFieldValue, 9, "decimal")
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip content="Unit Tax of the product"></Tooltip>
                </div>
                {formik?.errors?.unit_tax && (
                  <span className={styles?.error}>
                    {formik?.errors?.unit_tax}
                  </span>
                )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Storage Conditions</label>
                <div className={styles?.tooltipContainer}>
                  <input
                    className={styles?.formInput}
                    type="text"
                    placeholder="Enter Storage Conditions"
                    // autoComplete="off"
                    name="storage"
                    value={formik?.values?.storage}
                    onChange={(e) =>
                      handleInputChange(e, formik?.setFieldValue, 30, "all")
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip content="Recommended storage (e.g., store in a cool, dry place)"></Tooltip>
                </div>
              </div>

              {/* <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Stocked in Countries
                  
                </label>
                <MultiSelectDropdown
                  options={countries}
                  placeholderButtonLabel="Select Countries"
                  name="countries"
                  value={formik?.values?.countries.map((country) => ({
                    label: country,
                    value: country,
                  }))}
                  onChange={(selectedOptions) => {
                    // Ensure we map selected options correctly
                    const selectedValues = selectedOptions
                      ? selectedOptions.map((option) => option?.label)
                      : [];
                    // setInventoryStockedCountries(
                    //   selectedValues?.map((option) => ({
                    //     label: option,
                    //     value: option,
                    //   })) || []
                    // );
                    formik?.setFieldValue("countries", selectedValues); // Update Formik value with the selected country values
                    // if (selectedValues?.length == 0) {
                    //   setStockedInDetails([
                    //     {
                    //       country: "",
                    //       quantity: "",
                    //       type: "Box",
                    //       placeholder: "Enter Box Quantity",
                    //     },
                    //   ]);
                    // }
                  }}
                />
                {formik?.touched?.countries && formik?.errors?.countries && (
                  <span className={styles?.error}>
                    {formik?.errors?.countries}
                  </span>
                )}
              </div> */}

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Tags
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <input
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Tags"
                  // autoComplete="off"
                  name="tags"
                  value={formik?.values?.tags}
                  onChange={(e) =>
                    handleInputChange(e, formik?.setFieldValue, 75, "all")
                  }
                  onBlur={formik?.handleBlur}
                  // error={errors?.tags}
                />

                {formik?.touched?.tags && formik?.errors?.tags && (
                  <span className={styles?.error}>{formik?.errors?.tags}</span>
                )}
              </div>
              <div className={styles?.productTextContainer}>
                <label className={styles?.formLabel}>
                  Product Description
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <textarea
                  className={styles.formInput}
                  type="text"
                  name="description"
                  rows={5}
                  placeholder="Enter Description"
                  value={formik?.values.description}
                  onChange={formik?.handleChange}
                  onBlur={() => formik?.handleBlur}
                />

                <span className={styles?.error}></span>
              </div>
            </div>
          </div>

          {/* Start manufacturer details */}
          <div className={styles?.section}>
            <span className={styles?.formHead}>Manufacturer Details</span>
            <div className={styles?.formSection}>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Manufacturer Name
                  {/* <span className={styles?.labelStamp}>*</span> */}
                </label>
                <input
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Manufacturer Name"
                  // autoComplete="off"
                  name="manufacturer"
                  value={formik?.values?.manufacturer}
                  onBlur={formik?.handleBlur}
                  // onChange={(e) => {
                  //   formik?.setFieldValue("manufacturer", e.target.value);
                  // }}
                  onChange={(e) =>
                    handleInputChange(e, formik?.setFieldValue, 75, "all", [
                      "manufacturer",
                    ])
                  }
                />
                {/* {formik?.touched?.manufacturer && formik?.errors?.manufacturer && (
                  <span className={styles?.error}>
                    {formik?.errors?.manufacturer}
                  </span>
                )} */}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Manufacturer Country of Origin
                  {/* <span className={styles?.labelStamp}>*</span> */}
                </label>
                <Select
                  name="countryOfOrigin"
                  options={countries}
                  placeholder="Select Country of Origin"
                  value={
                    countries.find(
                      (option) =>
                        option.label === formik?.values?.countryOfOrigin
                    ) || null
                  }
                  onBlur={formik?.handleBlur}
                  onChange={(selectedOption) => {
                    formik?.setFieldValue(
                      "countryOfOrigin",
                      selectedOption?.label
                    );
                  }}
                />

                {/* {formik?.touched?.countryOfOrigin &&
                  formik?.errors?.countryOfOrigin && (
                    <span className={styles?.error}>
                      {formik?.errors?.countryOfOrigin}
                    </span>
                  )} */}
              </div>

              <div className={styles?.productTextContainer}>
                <label className={styles?.formLabel}>
                  About Manufacturer
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <textarea
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter About Manufacturer"
                  value={formik?.values?.aboutManufacturer}
                  name="aboutManufacturer"
                  onBlur={formik?.handleBlur}
                  onChange={(e) =>
                    handleInputChange(e, formik?.setFieldValue, 500, "all")
                  }
                />
                {formik?.touched?.aboutManufacturer &&
                  formik?.errors?.aboutManufacturer && (
                    <span className={styles?.error}>
                      {formik?.errors?.aboutManufacturer}
                    </span>
                  )}
              </div>
            </div>
          </div>

          {/* End manufacturer details */}

          {/* Start the Compliances and certificate */}
          <div className={styles?.section}>
            <div className={styles?.formHeadSection}>
              <span className={styles?.formHead}>
                 Add Other Details
                {formik?.values?.category &&
                  (() => {
                    const matchedCategory = categoryOptions.find(
                      (opt) => opt.value === formik.values.category
                    );
                    return matchedCategory ? ` of ${matchedCategory.label}` : "";
                  })()}
                </span>
              <span
                className={styles?.formAddButton}
                onClick={() => {
                  // Add new file and date pair to the array
                  // formik?.values?.categoryDetails?.length < 4 &&
                  formik?.setFieldValue("categoryDetails", [
                    ...formik?.values?.categoryDetails,
                    {
                      fieldValue: "",
                      name: "",
                      type: "",
                    },
                  ]);
                }}
              >
                Add More
              </span>
            </div>

            {/* {formik?.values?.categoryDetails?.length > 0 ? (
              formik?.values?.categoryDetails?.map((ele, index) => (
                <div
                  key={`certification_${index}`}
                  className={styles?.formSection}
                >
                  <div className={styles?.productContainer}>
                    <Field name={`categoryDetails.${index}.fieldValue`}>
                      {({ field }) => (
                        <EditComplianceNCertification
                          fieldInputName={`categoryDetails.${index}.fieldValue`}
                          setFieldValue={formik?.setFieldValue}
                          initialValues={formik?.values}
                          label="Parameter Description"
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
                    <span className={styles?.error}>
                      {formik?.touched?.categoryDetails?.[index]?.fieldValue &&
                        formik?.errors?.categoryDetails?.[index]?.fieldValue}
                    </span>
                  </div>

                  {formik?.values?.categoryDetails?.length > 1 && (
                    <div
                      className={styles?.formCloseSection}
                      onClick={() => {
                        // Clear form values before removing the row
                        formik?.setFieldValue(
                          `categoryDetails.${index}.fieldValue`,
                          ""
                        );
                        formik?.setFieldValue(
                          `categoryDetails.${index}.name`,
                          ""
                        );
                        formik?.setFieldValue(
                          `categoryDetails.${index}.type`,
                          ""
                        );
                        formik?.setFieldValue(
                          `categoryDetails.${index}.preview`,
                          false
                        );

                        // Remove the row from the array
                        const updatedList =
                          formik?.values?.categoryDetails.filter(
                            (_, elindex) => elindex !== index
                          );
                        const updatedList2 =
                          formik?.values?.categoryDetailsFileNew.filter(
                            (_, elindex) => elindex !== index
                          );
                        formik?.setFieldValue("categoryDetails", updatedList);
                        formik?.setFieldValue("categoryDetailsFile", []);
                        formik?.setFieldValue(
                          "categoryDetailsFileNew",
                          updatedList2
                        );
                      }}
                    >
                      <span className={styles?.formclose}>
                        <CloseIcon className={styles?.icon} />
                      </span>
                    </div>
                  )}
                </div>
              )) */}
            {formik?.values?.categoryDetails?.length > 0 ? (
              formik?.values?.categoryDetails?.map((section, index) => {
                // Get category options
                const categoryOptions =
                  categoriesData
                    ?.find((cat) => cat?.schema === formik?.values?.category)
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
                  <div
                    key={`categoryDetails_${index}`}
                    className={styles?.stockedContainer2}
                  >
                    <div className={styles?.stockedSection}>
                      <div className={styles?.StockedDiv}>
                        <label className={styles?.formLabel}>
                          Parameter Name
                          {/* <span className={styles?.labelStamp}>*</span> */}
                        </label>
                        <Select
                          className={styles?.formSelect}
                          value={selectedOption || null}
                          onChange={(selected) =>
                            handlecategoryDetailsNameChange(
                              index,
                              selected,
                              formik?.setFieldValue
                            )
                          }
                          options={
                            categoriesData
                              ?.find(
                                (cat) => cat?.schema == formik?.values?.category
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
                            formik?.setFieldTouched(
                              `categoryDetails.${index}.name`,
                              true
                            )
                          }
                        />
                        {formik?.touched?.categoryDetails?.[index]?.name &&
                          formik?.errors?.categoryDetails?.[index]?.name && (
                            <span span className={styles?.error}>
                              {formik?.errors?.categoryDetails[index].name}
                            </span>
                          )}
                      </div>
                      {section?.name ? (
                        <div className={styles?.StockedDivQuantity}>
                          <label className={styles?.formLabel}>
                            Parameter Description
                            {/* <span className={styles?.labelStamp}>*</span> */}
                          </label>
                          <div className={styles?.quantitySelector}>
                            <div className={styles?.inputGroup}>
                              {section?.type == "text" ? (
                                <input
                                  type="text"
                                  name={`categoryDetails.${index}.fieldValue`}
                                  onChange={(e) =>
                                    handlecategoryDetailsFieldValueChange(
                                      index,
                                      e,
                                      formik?.setFieldValue
                                    )
                                  }
                                  value={section.fieldValue}
                                  placeholder={section?.placeholder}
                                  className={styles?.inputStocked}
                                  onBlur={() =>
                                    formik?.setFieldTouched(
                                      `categoryDetails.${index}.fieldValue`,
                                      true
                                    )
                                  }
                                />
                              ) : section?.type == "textarea" ? (
                                <textarea
                                  className={styles?.inputStocked}
                                  type="text"
                                  placeholder={section?.placeholder}
                                  // autoComplete="off"
                                  name={`categoryDetails.${index}.fieldValue`}
                                  value={section?.fieldValue}
                                  onChange={(e) =>
                                    handlecategoryDetailsFieldValueChange(
                                      index,
                                      e,
                                      formik?.setFieldValue
                                    )
                                  }
                                  onBlur={() =>
                                    formik?.setFieldTouched(
                                      `categoryDetails.${index}.fieldValue`,
                                      true
                                    )
                                  }
                                />
                              ) : section?.type == "dropdown" ? (
                                <Select
                                  className={styles?.formSelect}
                                  options={section?.optionsDD}
                                  placeholder={section?.placeholder}
                                  name={`categoryDetails.${index}.fieldValue`}
                                  onBlur={formik?.handleBlur}
                                  onChange={(selectedOption) =>
                                    formik?.setFieldValue(
                                      `categoryDetails.${index}.fieldValue`,
                                      selectedOption.value
                                    )
                                  }
                                />
                              ) : section?.type == "checkbox" ? (
                                <div className={styles?.radioGroup}>
                                  {["true", "false"].map((option) => (
                                    <label key={option}>
                                      <input
                                        type="radio"
                                        name={`categoryDetails.${index}.fieldValue`}
                                        value={option} // <-- This must be the option value, not section.fieldValue
                                        checked={section.fieldValue === option} // checked if value matches
                                        onChange={(e) =>
                                          formik?.setFieldValue(
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
                                      <EditCategoryDetails
                                        fieldInputName={`categoryDetails.${index}.fieldValue`}
                                        setFieldValue={formik?.setFieldValue}
                                        initialValues={formik?.values}
                                        selectedFile={section?.fieldValue}
                                        preview={true}
                                        fileIndex={index}
                                        isEdit={true}
                                      />
                                    )}
                                  </Field>
                                )
                              )}
                            </div>
                          </div>
                          {
                            <span span className={styles?.error}>
                              {formik?.touched?.categoryDetails &&
                                formik?.errors?.categoryDetails?.[index]
                                  ?.fieldValue}
                            </span>
                            // )
                          }
                        </div>
                      ) : (
                        <div className={styles?.StockedDivQuantity}>
                          <label className={styles?.formLabel}>
                            Parameter Description
                            {/* <span className={styles?.labelStamp}>*</span> */}
                          </label>
                          <div className={styles?.quantitySelector}>
                            <div className={styles?.inputGroup}>
                              <input
                                type="text"
                                value={section.fieldValue}
                                placeholder={
                                  "Please select parameter name first"
                                }
                                disabled={true}
                                className={styles?.inputStocked}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={styles?.formclosebutton}
                      onClick={() =>
                        removecategoryDetailsFormSection(
                          index,
                          formik?.setFieldValue,
                          formik?.values
                        )
                      }
                    >
                      <CloseIcon className={styles?.iconClose} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No Other Details added</div>
            )}
          </div>

          {/* End the compliances and certificate */}

          {/* Start the Inventory */}
          <div className={styles?.section}>
            <div className={styles?.Stocksection}>
              <div className={styles?.formHeadSection}>
                <span className={styles?.formHead}> Stocked in Details</span>
                <span
                  className={styles?.formAddButton}
                  onClick={() =>
                    addStockedInSection(formik?.setFieldValue, formik?.values)
                  }
                >
                  Add More
                </span>
              </div>
              {formik?.values?.stockedInDetails.map((section, index) => (
                <div
                  key={`stocked_${index}`}
                  className={styles?.stockedContainer}
                >
                  {console.log('stockedInDetails',stockedInDetails)}
                  <div className={styles?.stockedSection}>
                    <div className={styles?.StockedDiv}>
                      <label className={styles?.formLabel}>
                        Stocked in Country
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <Select
                        className={styles?.formSelect}
                        value={countries.find(
                          (option) => option.label === section.country
                        )}
                        onChange={(selected) =>
                          handleStockedInCountryChange(
                            index,
                            selected,
                            formik?.setFieldValue
                          )
                        }
                        options={countries}
                        placeholder="Select Stocked in Country"
                        name={`stockedInDetails.${index}.country`}
                        onBlur={() =>
                          formik?.setFieldTouched(
                            `stockedInDetails.${index}.country`,
                            true
                          )
                        }
                      />
                    </div>
                    <div className={styles?.StockedDivQuantity}>
                      <label className={styles?.formLabel}>
                        Stocked in Quantity
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <div className={styles?.quantitySelector}>
                        <div className={styles?.inputGroup}>
                          <input
                            type="text"
                            name={`stockedInDetails.${index}.quantity`}
                            onChange={(e) =>
                              handleStockedInputChange(
                                index,
                                e,
                                formik?.setFieldValue
                              )
                            }
                            value={section.quantity}
                            placeholder={`Enter ${
                              section.type || "Box"
                            } Quantity`}
                            className={styles?.inputStocked}
                            onBlur={() =>
                              formik?.setFieldTouched(
                                `stockedInDetails.${index}.quantity`,
                                true
                              )
                            }
                          />
                          <button
                            className={`${styles?.optionButton} ${
                              section.type === "Box" ? styles?.selected : ""
                            }`}
                          >
                            {section.type || "Box"}
                          </button>
                        </div>
                        <div className={styles?.radioGroup}>
                          {["Box", "Strip", "Pack", "Unit"].map((type) => (
                            <label key={type}>
                              <input
                                type="radio"
                                name={`stockedInDetails[${index}].type`}
                                value={type}
                                checked={
                                  section.type === type ||
                                  (!section.type && type === "Box")
                                }
                                onChange={() =>
                                  handlePackageSelection(
                                    index,
                                    type,
                                    formik?.setFieldValue
                                  )
                                }
                              />
                              <span>{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {formik?.values?.stockedInDetails.length > 1 && (
                    <div
                      className={styles?.formclosebutton}
                      onClick={() =>
                        removeStockedInFormSection(
                          index,
                          formik?.setFieldValue,
                          formik?.values
                        )
                      }
                    >
                      <CloseIcon className={styles?.iconClose} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* End the Inventory */}

          {/* Start the Product Pricing */}
          <div className={styles?.section}>
            <div className={styles?.formHeadSection}>
              <span className={styles?.formHead}>Product Pricing</span>
              <span
                className={styles?.formAddButton}
                onClick={() => {
                  formik?.setFieldValue("productPricingDetails", [
                    ...formik?.values?.productPricingDetails,
                    {
                      // quantity: "",
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
                        className={styles?.formSection}
                      >
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
                          onBlur={formik?.handleBlur}
                          onChange={(e) =>
                            formik?.setFieldValue(
                              `productPricingDetails.${index}.quantityFrom`,
                              e.target.value.replace(/\D/g, "") // Allow only numbers
                            )
                          }
                        />
                      </div>
                      <span className={styles.error}>
                        {formik?.touched.productPricingDetails?.[index]?.quantityFrom &&
                          formik?.errors.productPricingDetails?.[index]?.quantityFrom}
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
                          onBlur={formik?.handleBlur}
                          onChange={(e) =>
                            formik?.setFieldValue(
                              `productPricingDetails.${index}.quantityTo`,
                              e.target.value.replace(/\D/g, "") // Allow only numbers
                            )
                          }
                        />
                      </div>
                      <span className={styles.error}>
                        {formik?.touched.productPricingDetails?.[index]?.quantityTo &&
                          formik?.errors.productPricingDetails?.[index]?.quantityTo}
                      </span>
                    </div>
                  </div>

                        <div className={styles?.productContainer}>
                          <label className={styles?.formLabel}>
                            Unit Price
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <div className={styles?.tooltipContainer}>
                            <Field
                              name={`productPricingDetails.${index}.price`}
                              type="text"
                              placeholder="Enter Unit Price in USD"
                              className={styles?.formInput}
                              onChange={formik?.handleChange}
                            />
                            <Tooltip content="The cost of the medication per unit (MRP) in Dollar"></Tooltip>
                          </div>
                          <span className={styles?.error}>
                            {formik?.touched?.productPricingDetails?.[index]
                              ?.price &&
                              formik?.errors?.productPricingDetails?.[index]
                                ?.price}
                          </span>
                        </div>
                        <div className={styles?.productContainer}>
                          <label className={styles?.formLabel}>
                            Est. Shipping Time
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <Field
                            name={`productPricingDetails.${index}.deliveryTime`}
                            type="text"
                            placeholder="Enter Est. Shipping Time in days"
                            className={styles?.formInput}
                            onChange={(e) => {
                              // Allow only alphanumeric characters, spaces, hyphens
                              const value = e.target.value.replace(
                                /[^a-zA-Z0-9 \-]/g,
                                ""
                              );
                              formik?.setFieldValue(
                                `productPricingDetails.${index}.deliveryTime`,
                                value
                              );
                            }}
                          />
                          <span className={styles?.error}>
                            {formik?.touched?.productPricingDetails?.[index]
                              ?.deliveryTime &&
                              formik?.errors?.productPricingDetails?.[index]
                                ?.deliveryTime}
                          </span>
                        </div>

                        {formik?.values?.productPricingDetails?.length > 1 && (
                          <div
                            className={styles?.formCloseSection}
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            <span className={styles?.formclose}>
                              <CloseIcon className={styles?.icon} />
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

          {/* Start the Compliances and certificate */}
          <div className={styles?.section}>
            <div className={styles?.formHeadSection}>
              <span className={styles?.formHead}>
                Compliances & Certification
              </span>
              <span
                className={styles?.formAddButton}
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
                  className={styles?.formSection}
                >
                  {/* File Upload Section */}
                  <div className={styles?.productContainer}>
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
                    <span className={styles?.error}>
                      {formik?.touched?.cNCFileNDate?.[index]?.file &&
                        formik?.errors?.cNCFileNDate?.[index]?.file}
                    </span>
                  </div>

                  {/* Date of Expiry Section */}
                  <div className={styles?.productContainer}>
                    <label className={styles?.formLabel}>Date of Expiry</label>
                    <div className={styles?.tooltipContainer}>
                      {/* Date Mask Input */}

                      <DatePicker
                        className={styles?.formDate}
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
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                      <span
                        className={styles?.infoTooltip}
                        data-tooltip-id="sku-tooltip"
                        data-tooltip-content="The cost of the medication per unit (MRP) in Dollar"
                      >
                        <img
                          src={Information}
                          className={styles?.iconTooltip}
                          alt="information"
                        />
                      </span>
                      {/* <Tooltip className={styles?.tooltipSec} id="sku-tooltip" /> */}
                    </div>
                    <span className={styles?.error}>
                      {formik?.touched?.cNCFileNDate?.[index]?.date &&
                        formik?.errors?.cNCFileNDate?.[index]?.date}
                    </span>
                  </div>

                  {/* Remove Section */}
                  {formik?.values?.cNCFileNDate?.length > 1 && (
                    <div
                      className={styles?.formCloseSection}
                      onClick={() => {
                        // Clear form values before removing the row
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
                      <span className={styles?.formclose}>
                        <CloseIcon className={styles?.icon} />
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>No Compliances & Certification Details added</div>
            )}
          </div>

          {/* End the compliances and certificate */}

          {/* Start Product document*/}
          <div className={styles?.section}>
            {console.log('ormik?.values?.catalogue?.length',formik?.values?.catalogue?.length)}
            <span className={styles?.formHead}>Product Documents</span>
            <div className={styles?.formSection}>
              <div className={styles?.productContainer}>
                <AddProductFileUpload
                  styles={styles}
                  productDetails={productDetail}
                  maxFiles={1 - (formik?.values?.catalogue?.length || 0)}
                  fieldInputName={"catalogueNew"}
                  oldFieldName={"catalogue"}
                  existingFiles={formik?.values?.catalogue}
                  setFieldValue={formik?.setFieldValue}
                  initialValues={formik?.values}
                  label="Product Catalogue"
                  // tooltip="Specific safety information, instructions or precautions related to product"
                  acceptTypes={{
                    "application/pdf": [],
                  }}
                  error={
                    (formik?.touched?.catalogue ||
                      formik?.touched?.catalogueNew ||
                      formik?.errors?.catalogue ||
                      formik?.errors?.catalogueNew) && (
                      <div>
                        {formik?.errors?.catalogue ||
                          formik?.errors?.catalogueNew}
                      </div>
                    )
                  }
                />
              </div>
              <div className={styles?.productContainer}>
                <AddProductFileUpload
                  styles={styles}
                  productDetails={productDetail}
                  maxFiles={
                    1 - (formik?.values?.specificationSheet?.length || 0)
                  }
                  fieldInputName={"specificationSheetNew"}
                  oldFieldName={"specificationSheet"}
                  existingFiles={formik?.values?.specificationSheet}
                  setFieldValue={formik?.setFieldValue}
                  initialValues={formik?.values}
                  label="Specification Sheet"
                  // tooltip="Health Hazard Rating Document"
                  acceptTypes={{
                    "application/pdf": [],
                  }}
                  error={
                    (formik?.touched?.specificationSheet ||
                      formik?.touched?.specificationSheetNew ||
                      formik?.errors?.specificationSheet ||
                      formik?.errors?.specificationSheetNew) && (
                      <div>
                        {formik?.errors?.specificationSheet ||
                          formik?.errors?.specificationSheetNew}
                      </div>
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* End Product document*/}
          {/* Start the Additional Information */}
          <div className={styles?.additionalSection}>
            <span className={styles?.formHead}>Additional Information</span>
            <div className={styles?.formSection}>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Warranty</label>
                <input
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Warranty"
                  // autoComplete="off"
                  name="warranty"
                  value={formik?.values?.warranty}
                  onChange={(e) =>
                    handleInputChange(e, formik?.setFieldValue, 20, "all")
                  }
                  onBlur={formik?.handleBlur}
                />
              </div>
              <div className={styles?.productContainer}>
                <AddProductFileUpload
                  styles={styles}
                  productDetails={productDetail}
                  maxFiles={1 - (formik?.values?.guidelinesFile?.length || 0)}
                  fieldInputName={"guidelinesFileNew"}
                  oldFieldName={"guidelinesFile"}
                  existingFiles={formik?.values?.guidelinesFile}
                  setFieldValue={formik?.setFieldValue}
                  initialValues={formik?.values}
                  label="User Guidelines"
                  tooltip="Specific information, instructions related to product."
                  acceptTypes={{
                    "application/pdf": [],
                  }}
                  error={
                    (formik?.touched?.guidelinesFile ||
                      formik?.touched?.guidelinesFileNew ||
                      formik?.errors?.guidelinesFile ||
                      formik?.errors?.guidelinesFileNew) && (
                      <div>
                        {formik?.errors?.guidelinesFile ||
                          formik?.errors?.guidelinesFileNew}
                      </div>
                    )
                  }
                />
              </div>
              {/* )} */}
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Other Information</label>
                <div className={styles?.tooltipContainer}>
                  <textarea
                    className={styles?.formTextarea}
                    type="text"
                    placeholder="Enter Other Information"
                    // autoComplete="off"
                    name="other"
                    value={formik?.values?.other}
                    onChange={(e) =>
                      handleInputChange(e, formik?.setFieldValue, 100, "all")
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
          {/* Start image upload container */}
          <div className={styles?.additionalSection}>
            <span className={styles?.formHead}>Upload Product Image</span>
            <div className={styles?.formSection}>
              <div className={styles?.ImageproductContainer}>
                <AddProductFileUpload
                  styles={styles}
                  productDetails={productDetail}
                  maxFiles={1 - (formik?.values?.imageFront?.length || 0)}
                  fieldInputName={"imageFrontNew"}
                  oldFieldName={"imageFront"}
                  existingFiles={formik?.values?.imageFront}
                  setFieldValue={formik?.setFieldValue}
                  initialValues={formik?.values}
                  label="Front Image"
                  tooltip={false}
                  showLabel={false}
                  acceptTypes={{
                    "image/png": [],
                    "image/jpeg": [],
                  }}
                  error={
                    (formik?.touched?.imageFront ||
                      formik?.touched?.imageFrontNew ||
                      formik?.errors?.imageFront ||
                      formik?.errors?.imageFrontNew) && (
                      <div>
                        {formik?.errors?.imageFront ||
                          formik?.errors?.imageFrontNew}
                      </div>
                    )
                  }
                />
                <AddProductFileUpload
                  styles={styles}
                  productDetails={productDetail}
                  maxFiles={1 - (formik?.values?.imageBack?.length || 0)}
                  fieldInputName={"imageBackNew"}
                  oldFieldName={"imageBack"}
                  existingFiles={formik?.values?.imageBack}
                  setFieldValue={formik?.setFieldValue}
                  initialValues={formik?.values}
                  label="Back Image"
                  tooltip={false}
                  showLabel={false}
                  acceptTypes={{
                    "image/png": [],
                    "image/jpeg": [],
                  }}
                  error={
                    (formik?.touched?.imageBack ||
                      formik?.touched?.imageBackNew ||
                      formik?.errors?.imageBack ||
                      formik?.errors?.imageBackNew) && (
                      <div>
                        {formik?.errors?.imageBack ||
                          formik?.errors?.imageBackNew}
                      </div>
                    )
                  }
                />
                <AddProductFileUpload
                  styles={styles}
                  productDetails={productDetail}
                  maxFiles={1 - (formik?.values?.imageSide?.length || 0)}
                  fieldInputName={"imageSideNew"}
                  oldFieldName={"imageSide"}
                  existingFiles={formik?.values?.imageSide}
                  setFieldValue={formik?.setFieldValue}
                  initialValues={formik?.values}
                  label="Side Image"
                  tooltip={false}
                  showLabel={false}
                  acceptTypes={{
                    "image/png": [],
                    "image/jpeg": [],
                  }}
                  error={
                    (formik?.touched?.imageSide ||
                      formik?.touched?.imageSideNew ||
                      formik?.errors?.imageSide ||
                      formik?.errors?.imageSideNew) && (
                      <div>
                        {formik?.errors?.imageSide ||
                          formik?.errors?.imageSideNew}
                      </div>
                    )
                  }
                />
                <AddProductFileUpload
                  styles={styles}
                  productDetails={productDetail}
                  maxFiles={1 - (formik?.values?.imageClosure?.length || 0)}
                  fieldInputName={"imageClosureNew"}
                  oldFieldName={"imageClosure"}
                  existingFiles={formik?.values?.imageClosure}
                  setFieldValue={formik?.setFieldValue}
                  initialValues={formik?.values}
                  label="Close up Image"
                  tooltip={false}
                  showLabel={false}
                  acceptTypes={{
                    "image/png": [],
                    "image/jpeg": [],
                  }}
                  error={
                    (formik?.touched?.imageClosure ||
                      formik?.touched?.imageClosureNew ||
                      formik?.errors?.imageClosure ||
                      formik?.errors?.imageClosureNew) && (
                      <div>
                        {formik?.errors?.imageClosure ||
                          formik?.errors?.imageClosureNew}
                      </div>
                    )
                  }
                />
              </div>
              <div className={styles?.productContainer}>
                {formik?.values?.market === "secondary" && (
                  <AddProductFileUpload
                    styles={styles}
                    productDetails={productDetail}
                    maxFiles={
                      1 - (formik?.values?.purchaseInvoiceFile?.length || 0)
                    }
                    fieldInputName={"purchaseInvoiceFileNew"}
                    oldFieldName={"purchaseInvoiceFile"}
                    existingFiles={formik?.values?.purchaseInvoiceFile}
                    setFieldValue={formik?.setFieldValue}
                    initialValues={formik?.values}
                    label="Purchase Invoice"
                    tooltip={false}
                    acceptTypes={{
                      "application/pdf": [],
                    }}
                    // maxFiles={1}
                    error={
                      (formik?.touched?.purchaseInvoiceFile ||
                        formik?.touched?.purchaseInvoiceFileNew ||
                        formik?.errors?.purchaseInvoiceFile ||
                        formik?.errors?.purchaseInvoiceFileNew) && (
                        <div>
                          {formik?.errors?.purchaseInvoiceFile ||
                            formik?.errors?.purchaseInvoiceFileNew}
                        </div>
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* End image upload container */}

          {/* Start the Add FAQs */}
          <div className={styles?.section}>
            {/* {inventoryStockedCountries?.length > 0 ? ( */}
            <div className={styles?.Stocksection}>
              <div className={styles?.formHeadSection}>
                <span className={styles?.formHead}>Add FAQs</span>
                <span
                  className={styles?.formAddButton}
                  onClick={() => addFAQs(formik?.setFieldValue, formik?.values)}
                >
                  Add More
                </span>
              </div>
              {formik?.values?.faqs?.map((section, index) => {
                return (
                  <div
                    key={`faqs_${index}`}
                    className={styles?.stockedContainer2}
                  >
                    <div className={styles?.stockedSection2}>
                      <div className={styles?.StockedDiv2}>
                        <label className={styles?.formLabel}>
                          Question
                          {/* <span className={styles?.labelStamp}>*</span> */}
                        </label>
                        <input
                          type="text"
                          name={`faqs.${index}.ques`}
                          onChange={(e) =>
                            handleFaqsQuesChange(
                              index,
                              e,
                              formik?.setFieldValue
                            )
                          }
                          value={section.ques}
                          placeholder={"Enter Question"}
                          className={styles?.inputStocked}
                          onBlur={() =>
                            formik?.setFieldTouched(`faqs.${index}.ques`, true)
                          }
                        />
                        {formik?.touched?.faqs?.[index]?.ques &&
                          formik?.errors?.faqs?.[index]?.ques && (
                            <span span className={styles?.error}>
                              {formik?.errors?.faqs[index].ques}
                            </span>
                          )}
                      </div>
                      <div className={styles?.StockedDiv2}>
                        <label className={styles?.formLabel}>
                          Answer
                          {/* <span className={styles?.labelStamp}>*</span> */}
                        </label>
                        <div className={styles?.quantitySelector}>
                          <div className={styles?.inputGroup2}>
                            <textarea
                              className={styles?.inputStocked}
                              type="text"
                              placeholder={"Enter Answer"}
                              // autoComplete="off"
                              name={`faqs.${index}.ans`}
                              value={section?.ans}
                              onChange={(e) =>
                                handleFaqsAnsChange(
                                  index,
                                  e,
                                  formik?.setFieldValue
                                )
                              }
                              onBlur={() =>
                                formik?.setFieldTouched(
                                  `faqs.${index}.ans`,
                                  true
                                )
                              }
                            />
                          </div>
                        </div>
                        {
                          <span span className={styles?.error}>
                            {formik?.touched?.faqs &&
                              formik?.errors?.faqs?.[index]?.ans}
                          </span>
                          // )
                        }
                      </div>
                    </div>
                    <div
                      className={styles?.formclosebutton2}
                      onClick={() =>
                        removeFaqFormSection(
                          index,
                          formik?.setFieldValue,
                          formik?.values
                        )
                      }
                    >
                      <CloseIcon className={styles?.iconClose} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* End the Add FAQs */}

          {/* Start button section */}
          <div className={styles?.buttonContainer}>
            <button
              className={styles?.buttonSubmit}
              type="submit"
              disabled={loading}
            >
              {loading ? <div className="loading-spinner"></div> : "Submit"}
            </button>

            <button className={styles?.buttonCancel} onClick={handleCancel}>
              Cancel
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
