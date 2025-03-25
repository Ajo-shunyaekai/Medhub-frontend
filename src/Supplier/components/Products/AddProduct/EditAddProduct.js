import React, { useState, useEffect, useRef, useMemo } from "react";
import Select, { components } from "react-select";
import Tooltip from "../../SharedComponents/Tooltip/Tooltip";
import JoditEditor from "jodit-react";
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
import categoryArrays from "../../../../utils/Category";
import { Field, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import AddProductFileUpload from "./AddPRoductFileUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  editProduct,
  fetchProductDetail,
} from "../../../../redux/reducers/productSlice";
import { InputMask } from "@react-input/mask";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ComplianceNCertification from "./ComplianceNCertification";
import EditComplianceNCertification from "./EditComplianceNCertification";
import RichTextEditor from "./ProductDescriptionEditor";

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
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, productDetail } = useSelector(
    (state) => state?.productReducer
  );
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      manufacturer: "",
      aboutManufacturer: "",
      countryOfOrigin: "",
      upc: "",
      model: "",
      image: [],
      imageNew: [],
      brand: "",
      quantity: "",
      volumn: "",
      dimension: "",
      weight: "",
      unit: "",
      packageType: "",
      packageMaterial: "",
      packageMaterialIfOther: "",
      sku: "",
      stock: "",
      stockQuantity: "",
      countries: [],
      date: "",
      complianceFile: [],
      cNCFileNDate: [],
      complianceFileNew: [],
      storage: "",
      other: "",
      guidelinesFile: [],
      guidelinesFileNew: [],
      warranty: "",
      safetyDatasheet: [],
      safetyDatasheetNew: [],
      healthHazardRating: [],
      healthHazardRatingNew: [],
      environmentalImpact: [],
      environmentalImpactNew: [],
      category: "",
      market: "",
      purchasedOn: "",
      countryAvailable: [],
      purchaseInvoiceFile: [],
      purchaseInvoiceFileNew: [],
      condition: "",
      minimumPurchaseUnit: "",
      subCategory: "",
      anotherCategory: "",
      stockedInDetails: [
        {
          country: "",
          quantity: "",
          type: "Box",
          placeholder: "Enter Box Quantity",
        },
      ],
      productPricingDetails: [
        {
          quantity: "",
          price: "",
          deliveryTime: "",
        },
      ],
      // Common fields of multiple categories
      drugClass: "",
      controlledSubstance: false,
      otcClassification: "",
      genericName: "",
      strength: "",
      composition: "",
      purpose: "",
      drugAdministrationRoute: "",
      expiry: "",
      allergens: "",
      formulation: "",
      vegan: false,
      crueltyFree: false,
      sideEffectsAndWarnings: "",
      thickness: "",
      interoperability: "",
      interoperabilityFile: [],
      interoperabilityFileNew: [],
      specification: "",
      specificationFile: [],
      specificationFileNew: [],
      diagnosticFunctions: "",
      performanceTestingReport: "",
      performanceTestingReportFile: [],
      performanceTestingReportFileNew: [],
      additivesNSweeteners: "",
      powdered: false,
      productMaterial: "",
      productMaterialIfOther: "",
      texture: false,
      sterilized: false,
      chemicalResistance: false,
      fluidResistance: false,
      shape: "",
      coating: "",
      concentration: "",
      measurementRange: "",
      maintenanceNotes: "",
      compatibleEquipment: "",
      usageRate: "",
      adhesiveness: "",
      absorbency: "",
      targetCondition: "",
      elasticity: "",
      breathability: "",
      foldability: "",
      fragrance: "",
      healthBenefit: "",
      // Add the other fields under MedicalEquipmentAndDevices || Add the other fields under MedicalEquipmentAndDevices
      laserType: "",
      coolingSystem: "",
      spotSize: "",
      // Add the other fields under Pharmaceuticals || Add the other fields under Pharmaceuticals
      // Add the other fields under SkinHairCosmeticSupplies || Add the other fields under SkinHairCosmeticSupplies
      spf: "",
      dermatologistTested: "",
      dermatologistTestedFile: [],
      dermatologistTestedFileNew: [],
      pediatricianRecommended: "",
      pediatricianRecommendedFile: [],
      pediatricianRecommendedFileNew: [],
      moisturizers: "",
      fillerType: "",
      // Add the other fields under VitalHealthAndWellness || Add the other fields under VitalHealthAndWellness
      // Add the other fields under MedicalConsumablesAndDisposables || Add the other fields under MedicalConsumablesAndDisposables
      filtrationEfficiency: "",
      layerCount: "",
      filtrationType: [],
      // Add the other fields under LaboratorySupplies || Add the other fields under LaboratorySupplies
      magnificationRange: "",
      objectiveLenses: "",
      powerSource: "",
      resolution: "",
      connectivity: "",
      casNumber: "",
      grade: "",
      physicalState: [],
      hazardClassification: [],
      // Add the other fields under DiagnosticAndMonitoringDevices || Add the other fields under DiagnosticAndMonitoringDevices
      flowRate: "",
      noiseLevel: "",
      // Add the other fields under HospitalAndClinicSupplies || Add the other fields under HospitalAndClinicSupplies
      // Add the other fields under OrthopedicSupplies || Add the other fields under OrthopedicSupplies
      moistureResistance: "",
      colorOptions: "",
      // Add the other fields under DentalProducts || Add the other fields under DentalProducts
      // Add the other fields under EyeCareSupplies || Add the other fields under EyeCareSupplies
      lensPower: "",
      baseCurve: "",
      diameter: "",
      frame: "",
      lens: "",
      lensMaterial: "",
      // Add the other fields under HomeHealthcareProducts || Add the other fields under HomeHealthcareProducts
      maxWeightCapacity: "",
      gripType: "",
      lockingMechanism: "",
      typeOfSupport: "",
      batteryType: "",
      batterySize: "",
      // Add the other fields under AlternativeMedicines || Add the other fields under AlternativeMedicines
      healthClaims: "",
      healthClaimsFile: [],
      healthClaimsFileNew: [],
      // Add the other fields under EmergencyAndFirstAidSupplies || Add the other fields under EmergencyAndFirstAidSupplies
      productLongevity: "",
      flavorOptions: "",
      aminoAcidProfile: "",
      fatContent: "",
      dairyFree: "",
      // Add the other fields under HealthcareITSolutions || Add the other fields under HealthcareITSolutions
      license: "",
      scalabilityInfo: "",
      addOns: "",
      userAccess: "",
      keyFeatures: "",
      coreFunctionalities: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product Name is required."),
      description: Yup.string().required("Product Description is required."),
      manufacturer: Yup.string().required("Manufacturer Name is required."),
      aboutManufacturer: Yup.string().required(
        "About Manufacturer is required."
      ),
      countryOfOrigin: Yup.string().required(
        "Manufacturer Country of Origin is required."
      ),
      model: Yup.string().required("Part/Model Number is required."),
      image: Yup.array().max(4, "You can upload up to 4 images."),
      // .of(
      // Yup.string().required("A file path is required.") // Since it's now a string
      // ),
      imageNew: Yup.array()
        .max(4, "You can upload up to 4 images.")
        .of(
          Yup.mixed()
            .required("A file is required.")
            .test(
              "fileSize",
              "File too large",
              (value) => value && value.size <= 1024 * 1024 * 5 // Max 5MB
            )
        ),
      form: Yup.string().required("Product Type/Form is required."),
      quantity: Yup.number().required("Product Quantity is required."),
      weight: Yup.number().required("Product Weight is required."),
      unit: Yup.string().required("Product Weight Unit is required."),
      // packageType: Yup.string().required("Product Packaging Type is required."),
      // packageMaterial: Yup.string().required(
      //   "Product Packaging Material is required."
      // ),
      // packageMaterialIfOther: Yup.string()
      //   .when("packageMaterial", {
      //     is: "Other",
      //     then: Yup.string().required("Package Material Name is required."),
      //   })
      //   .nullable(),
      // packageMaterialIfOther: Yup.string().when("packageMaterial", {
      //   is: "Other",
      //   then: Yup.string().required(
      //     "Product Packaging Material Other Name is required."
      //   ),
      // }),
      // costPerProduct: Yup.string().required("Cost Per Unit is required."),
      // sku: Yup.string().required("SKU is required."),
      stock: Yup.string()
        .oneOf(["In-stock", "Out of Stock", "On-demand"])
        .required("Stock is required."),
      // stockQuantity: Yup.number().required("Stock Quantity is required."),
      countries: Yup.array()
        .min(1, "At least one country must be selected.")
        .of(Yup.string().required("Country Available is required.")),
      // date: Yup.string().required("Date is required."),
      // date: Yup.string()
      // .required("Date is required.")
      // .test(
      //   'is-valid-date',
      //   'Please enter a valid date',
      //   function (value) {
      //     if (!value) return false;

      //     // Split the date and convert to numbers
      //     const parts = value.split('-');
      //     if (parts.length !== 3) return false;

      //     const day = parseInt(parts[0], 10);
      //     const month = parseInt(parts[1], 10);
      //     const year = parseInt(parts[2], 10);

      //     // Check if date is valid (using Date object)
      //     const date = new Date(year, month - 1, day);
      //     return (
      //       date.getFullYear() === year &&
      //       date.getMonth() === month - 1 &&
      //       date.getDate() === day
      //     );
      //   }
      // )
      // .test(
      //   "not-future-date",
      //   "Future dates are not allowed",
      //   function (value) {
      //     if (!value) return true;

      //     const parts = value.split("-");
      //     if (parts.length !== 3) return true;

      //     const day = parseInt(parts[0], 10);
      //     const month = parseInt(parts[1], 10);
      //     const year = parseInt(parts[2], 10);

      //     const enteredDate = new Date(year, month - 1, day);
      //     const today = new Date();

      //     return enteredDate <= today;
      //   }
      // )
      // .nullable(),
      // stockedInDetails: Yup.array()
      //   .of(
      //     Yup.object({
      //       country: Yup.string().required("Country is required."),
      //       quantity: Yup.number()
      //         .required("Quantity is required.")
      //         .positive("Quantity must be greater than 0"),
      //       type: Yup.string().required("Type is required."),
      //     })
      //   )
      //   .min(1, "At least one product is required."), // Optional: You can enforce at least one item in the array
      productPricingDetails: Yup.array()
        .of(
          Yup.object({
            quantity: Yup.string().required("Quantity is required."),
            price: Yup.number()
              .typeError("Cost Per Price must be a number.")
              .required("Cost Per Price is required.")
              .positive("Cost Per Price must be greater than 0")
              .test(
                "decimal-places",
                "Price can have up to 3 decimal places only.",
                (value) => {
                  if (value === undefined || value === null) return true; // Skip validation if empty
                  return /^\d+(\.\d{1,3})?$/.test(value.toString()); // Allows up to 3 decimals
                }
              ),
            deliveryTime: Yup.string()
              .matches(
                /^\d{1,3}$/,
                "Delivery Time must be a number with up to 3 digits."
              )
              .required("Est. Delivery Time is required."),
          })
        )
        .min(1, "At least one product is required."), // Optional: You can enforce at least one item in the array
      complianceFile: Yup.array().max(
        4,
        "You can upload up to 4 Compliance File."
      ),
      // .of(
      // Yup.string().required("A file path is required.") // Since it's now a string
      // ),
      complianceFileNew: Yup.array()
        .max(4, "You can upload up to 4 Compliance File.")
        .of(
          Yup.mixed()
            .required("A file is required.")
            .test(
              "fileSize",
              "File too large",
              (value) => value && value.size <= 1024 * 1024 * 5
            ) // Max 5MB
            .test("fileType", "Unsupported file format", (value) => {
              const allowedFormats = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ];
              return value && allowedFormats.includes(value.type);
            })
        ),
      guidelinesFile: Yup.array().max(
        4,
        "You can upload up to 4 guideline files."
      ),
      // .of(
      // Yup.string().required("A file path is required.") // Since it's now a string
      // ),
      guidelinesFileNew: Yup.array()
        .max(4, "You can upload up to 4 guideline files.")
        .of(
          Yup.mixed()
            .required("A file is required.")
            .test(
              "fileSize",
              "File too large",
              (value) => value && value.size <= 1024 * 1024 * 5
            ) // Max 5MB
            .test("fileType", "Unsupported file format", (value) => {
              const allowedFormats = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ];
              return value && allowedFormats.includes(value.type);
            })
        ),
      safetyDatasheet: Yup.array().max(
        4,
        "You can upload up to 4 safety datasheets."
      ),
      safetyDatasheetNew: Yup.array()
        .max(4, "You can upload up to 4 safety datasheets.")
        .of(
          Yup.mixed()
            .required("A file is required.")
            .test(
              "fileSize",
              "File too large",
              (value) => value && value.size <= 1024 * 1024 * 5
            ) // Max 5MB
            .test("fileType", "Unsupported file format", (value) => {
              const allowedFormats = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ];
              return value && allowedFormats.includes(value.type);
            })
        ),
      healthHazardRating: Yup.array().max(
        4,
        "You can upload up to 4 safety datasheets."
      ),
      // .of(
      // Yup.string().required("A file path is required.") // Since it's now a string
      // ),
      healthHazardRatingNew: Yup.array()
        .max(4, "You can upload up to 4 safety datasheets.")
        .of(
          Yup.mixed()
            .required("A file is required.")
            .test("fileType", "Unsupported file format", (value) => {
              const allowedFormats = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ];
              return value && allowedFormats.includes(value.type);
            })
        ),
      environmentalImpact: Yup.array().max(
        4,
        "You can upload up to 4 safety datasheets."
      ),
      // .of(
      // Yup.string().required("A file path is required.") // Since it's now a string
      // ),
      environmentalImpactNew: Yup.array()
        .max(4, "You can upload up to 4 safety datasheets.")
        .of(
          Yup.mixed()
            .required("A file is required.")
            .test(
              "fileSize",
              "File too large",
              (value) => value && value.size <= 1024 * 1024 * 5
            ) // Max 5MB
            .test("fileType", "Unsupported file format", (value) => {
              const allowedFormats = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ];
              return value && allowedFormats.includes(value.type);
            })
        ),
      category: Yup.string()
        .oneOf([
          "MedicalEquipmentAndDevices",
          "Pharmaceuticals",
          "SkinHairCosmeticSupplies",
          "VitalHealthAndWellness",
          "MedicalConsumablesAndDisposables",
          "LaboratorySupplies",
          "DiagnosticAndMonitoringDevices",
          "HospitalAndClinicSupplies",
          "OrthopedicSupplies",
          "DentalProducts",
          "EyeCareSupplies",
          "HomeHealthcareProducts",
          "AlternativeMedicines",
          "EmergencyAndFirstAidSupplies",
          "DisinfectionAndHygieneSupplies",
          "NutritionAndDietaryProducts",
          "HealthcareITSolutions",
        ])
        .required("Category is required."),
      market: Yup.string()
        .oneOf(["new", "secondary"])
        .required("Product Market is required."),
      purchasedOn: Yup.string().when("market", {
        is: "secondary",
        then: Yup.string().required("Purchased On is required."),
      }),
      purchaseInvoiceFile: Yup.array()
        .of(Yup.mixed().required("Purchase Invoice File is required."))
        .when("market", {
          is: "secondary",
          then: Yup.array().max(4, "You can upload up to 4 safety datasheets."),
        }),
      purchaseInvoiceFileNew: Yup.array()
        .max(4, "You can upload up to 4 Compliance File.")
        .of(
          Yup.mixed()
            .required("A file is required.")
            .test(
              "fileSize",
              "File too large",
              (value) => value && value.size <= 1024 * 1024 * 5
            ) // Max 5MB
            .test("fileType", "Unsupported file format", (value) => {
              const allowedFormats = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ];
              return value && allowedFormats.includes(value.type);
            })
        ),
      countryAvailable: Yup.array()
        .of(Yup.string().required("Country Available is required."))
        .when("market", {
          is: "secondary",
          then: Yup.array().min(1, "At least one country must be selected."),
        }),
      condition: Yup.string().when("market", {
        is: "secondary",
        then: Yup.string().required("Condition is required."),
      }),
      minimumPurchaseUnit: Yup.string().when("market", {
        is: "secondary",
        then: Yup.string().required("Minimum Purchase Unit is required."),
      }),

      // New Fields Validation
      subCategory: Yup.string()
        .required("Sub Category is required.")
        // For "MedicalEquipmentAndDevices" category
        .when("category", {
          is: "MedicalEquipmentAndDevices",
          then: Yup.string().oneOf(
            [
              "Diagnostic Tools",
              "Imaging Equipment",
              "Surgical Instruments",
              "Monitoring Devices",
              "Mobility Aids",
              "Respiratory Care",
              "Elderly Care Products",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "Pharmaceuticals" category
        .when("category", {
          is: "Pharmaceuticals",
          then: Yup.string().oneOf(
            [
              "Prescription Medications",
              "Over-the-Counter Medications",
              "Vaccines",
              "Generic Drugs",
              "Specialized Treatments",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "SkinHairCosmeticSupplies" category
        .when("category", {
          is: "SkinHairCosmeticSupplies",
          then: Yup.string().oneOf(
            [
              "Skin Care",
              "Hair Care",
              "Personal Hygiene",
              "Baby Care",
              "Anti-aging Solutions",
              "Skin Graft",
              "Anti-Scar & Healing Ointments",
              "Burn Care Solutions",
              "Dermal Fillers & Injectables",
              "Laser Treatment Devices",
              "Chemical Peels",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "VitalHealthAndWellness" category
        .when("category", {
          is: "VitalHealthAndWellness",
          then: Yup.string().oneOf(
            [
              "Fitness Monitors",
              "Herbal & Alternative Medicines",
              "Immune Boosters",
              "Vitamins & Supplements",
              "Weight Management",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "MedicalConsumablesAndDisposables" category
        .when("category", {
          is: "MedicalConsumablesAndDisposables",
          then: Yup.string().oneOf(
            [
              "Bandages, Gauze, & Wound Dressings",
              "Gloves, Masks, & Protective gear",
              "Sterilization Products",
              "Surgical Sutures & Adhesives",
              "Syringes, IV Sets & Catheters",
            ],
            "Invalid Subcategory for Medical Consumables And Disposables"
          ),
        })
        // For "LaboratorySupplies" category
        .when("category", {
          is: "LaboratorySupplies",
          then: Yup.string()
            .oneOf(
              [
                "Test kits",
                "Microscopes & Lab Equipment",
                "Chemicals & Reagents",
                "Lab Consumables",
              ],
              "Invalid Subcategory."
            )
            .required("Sub Category is required."),
        })
        // For "DiagnosticAndMonitoringDevices" category
        .when("category", {
          is: "DiagnosticAndMonitoringDevices",
          then: Yup.string().oneOf(
            [
              "Blood Glucose Monitors",
              "Blood Pressure Monitors",
              "Oxygen Concentrators",
              "Wearable Health Devices",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "HospitalAndClinicSupplies" category
        .when("category", {
          is: "HospitalAndClinicSupplies",
          then: Yup.string().oneOf(
            [
              "Patient Beds & Stretchers",
              "Trolleys & Storage Units",
              "Examination Tables",
              "Medical Furniture",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "OrthopedicSupplies" category
        .when("category", {
          is: "OrthopedicSupplies",
          then: Yup.string().oneOf(
            [
              "Orthopedic Braces & Supports",
              "Splints & Casting Materials",
              "Prosthetics",
              "Rehabilitation Equipment",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "DentalProducts" category
        .when("category", {
          is: "DentalProducts",
          then: Yup.string().oneOf(
            [
              "Dental Instruments & tools",
              "Orthodontic Supplies",
              "Dental Chairs and Accessories",
              "Dental Consumables",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "EyeCareSupplies" category
        .when("category", {
          is: "EyeCareSupplies",
          then: Yup.string().oneOf(
            [
              "Contact Lenses and Solutions",
              "Eyewear",
              "Eyewear Lenses",
              "Eye Drops and Ointments",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "HomeHealthcareProducts" category
        .when("category", {
          is: "HomeHealthcareProducts",
          then: Yup.string().oneOf(
            [
              "Mobility Aids",
              "Respiratory Care",
              "Patient Monitoring Devices",
              "Elderly Care Products",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "AlternativeMedicines" category
        .when("category", {
          is: "AlternativeMedicines",
          then: Yup.string().oneOf(
            ["Homeopathy", "Ayurvedic"],
            "Invalid Subcategory"
          ),
        })
        // For "EmergencyAndFirstAidSupplies" category
        .when("category", {
          is: "EmergencyAndFirstAidSupplies",
          then: Yup.string().oneOf(
            [
              "First Aid Kits",
              "Emergency Medical Equipment",
              "Trauma Care Products",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "DisinfectionAndHygieneSupplies" category
        .when("category", {
          is: "DisinfectionAndHygieneSupplies",
          then: Yup.string().oneOf(
            ["Hand Sanitizers", "Air Purifiers", "Cleaning Agents"],
            "Invalid Subcategory"
          ),
        })
        // For "NutritionAndDietaryProducts" category
        .when("category", {
          is: "NutritionAndDietaryProducts",
          then: Yup.string().oneOf(
            [
              "Protein Powders and Shakes",
              "Specialized Nutrition",
              "Meal Replacement Solutions",
            ],
            "Invalid Subcategory"
          ),
        })
        // For "HealthcareITSolutions" category
        .when("category", {
          is: "HealthcareITSolutions",
          then: Yup.string().oneOf(
            [
              "Healthcare Management Software",
              "Telemedicine Platforms",
              "Medical Billing Software",
              "IoT-Enabled Medical Devices",
            ],
            "Invalid Subcategory"
          ),
        })
        .nullable(),
      // Common fields of multiple categories
      drugClass: Yup.string()
        .when("category", {
          is: (category) =>
            [
              "Pharmaceuticals",
              "SkinHairCosmeticSupplies",
              "VitalHealthAndWellness",
            ].includes(category),
          then: Yup.string().required("Drug Class is required."),
        })
        .nullable(),
      genericName: Yup.string()
        .when("category", {
          is: (category) =>
            ["Pharmaceuticals", "VitalHealthAndWellness"].includes(category),
          then: Yup.string().required("Generic Name is required."),
        })
        .nullable(),
      strength: Yup.string()
        .when("category", {
          is: (category) =>
            [
              "Pharmaceuticals",
              "SkinHairCosmeticSupplies",
              "VitalHealthAndWellness",
              "OrthopedicSupplies",
            ].includes(category),
          then: Yup.string().required("Strength is required."),
        })
        .nullable(),
      composition: Yup.string()
        .when("category", {
          is: (category) =>
            [
              "Pharmaceuticals",
              "SkinHairCosmeticSupplies",
              "VitalHealthAndWellness",
              "AlternativeMedicines",
              "EmergencyAndFirstAidSupplies",
              "DisinfectionAndHygieneSupplies",
              "NutritionAndDietaryProducts",
            ].includes(category),
          then: Yup.string().required("Composition/Ingredients is required."),
        })
        .nullable(),
      purpose: Yup.string()
        .when("category", {
          is: (category) => ["SkinHairCosmeticSupplies"].includes(category),
          then: Yup.string().required("Purpose is required."),
        })
        .nullable(),
      drugAdministrationRoute: Yup.string()
        .when("category", {
          is: (category) =>
            ["SkinHairCosmeticSupplies", "VitalHealthAndWellness"].includes(
              category
            ),
          then: Yup.string().required("Drug Administration Route is required."),
        })
        .nullable(),
      expiry: Yup.string()
        .when("category", {
          is: (category) =>
            [
              "Pharmaceuticals",
              "SkinHairCosmeticSupplies",
              "VitalHealthAndWellness",
              "MedicalConsumablesAndDisposables",
              "HospitalAndClinicSupplies",
              // "OrthopedicSupplies",
              "DentalProducts",
              "HomeHealthcareProducts",
              "AlternativeMedicines",
              "EmergencyAndFirstAidSupplies",
              "DisinfectionAndHygieneSupplies",
              "NutritionAndDietaryProducts",
            ].includes(category),
          then: Yup.string().required("Shelf Life/Expiry is required."),
        })
        .nullable(),

      interoperability: Yup.string()
        .when("category", {
          is: (category) => ["HealthcareITSolutions"].includes(category),
          then: Yup.string().required("Interoperability is required."),
        })
        .nullable(),
      interoperabilityFile: Yup.array()
        .when("category", {
          is: (category) => ["HealthcareITSolutions"].includes(category),
          then: Yup.array().max(
            4,
            "You can upload up to 4 Interoperability file."
          ),
          // .of(
          // Yup.string().required("A file path is required.") // Since it's now a string
          // ),
        })
        .nullable(),
      interoperabilityFileNew: Yup.array()
        .when("category", {
          is: (category) => ["HealthcareITSolutions"].includes(category),
          then: Yup.array()
            .min(
              1,
              "At least one file is required for the Interoperability file."
            )
            .max(4, "You can upload up to 4 Interoperability files.")
            .required("Interoperability files is required."),
        })
        .nullable(),
      specification: Yup.string()
        .when("category", {
          is: (category) =>
            [
              "MedicalEquipmentAndDevices",
              "DiagnosticAndMonitoringDevices",
            ].includes(category),
          then: Yup.string().required("Specification is required."),
        })
        .nullable(),
      specificationFile: Yup.array()
        .when("category", {
          is: (category) =>
            [
              "MedicalEquipmentAndDevices",
              "DiagnosticAndMonitoringDevices",
            ].includes(category),
          then: Yup.array().max(
            4,
            "You can upload up to 4 specification files."
          ),
          // .of(
          // Yup.string().required("A file path is required.") // Since it's now a string
          // ),
        })
        // .when("category", {
        //   is: (category) =>
        //     ["MedicalEquipmentAndDevices","DiagnosticAndMonitoringDevices"].includes(category),
        //   then: Yup.array()
        //     .min(1, "At least one file is required for the specification file.")
        //     .max(4, "You can upload up to 4 specification files.")
        //     .required("specification files is required."),
        //   // .of(
        //   // Yup.string().required("A file path is required.") // Since it's now a string
        //   // ),
        // })
        .nullable(),
      specificationFileNew: Yup.array()
        .when("category", {
          is: (category) => ["MedicalEquipmentAndDevices"].includes(category),
          then: Yup.array()
            .max(4, "You can upload up to 4 specification files.")
            .of(
              Yup.mixed()
                .required("A file is required.")
                .test(
                  "fileSize",
                  "File too large",
                  (value) => value && value.size <= 1024 * 1024 * 5
                ) // Max 5MB
            ),
        })
        .when("category", {
          is: (category) =>
            ["DiagnosticAndMonitoringDevices"].includes(category),
          then: Yup.array()
            .min(1, "At least one file is required for the specification file.")
            .max(4, "You can upload up to 4 specification files.")
            .required("specification files is required.")
            .of(
              Yup.mixed()
                .required("A file is required.")
                .test(
                  "fileSize",
                  "File too large",
                  (value) => value && value.size <= 1024 * 1024 * 5
                ) // Max 5MB
            ),
        })
        .nullable(),
      diagnosticFunctions: Yup.string()
        .when("category", {
          is: (category) =>
            ["DiagnosticAndMonitoringDevices"].includes(category),
          then: Yup.string().required("Diagnostic Functions is required."),
        })
        .nullable(),

      performanceTestingReportFile: Yup.array()
        .when("category", {
          is: (category) =>
            [
              "MedicalEquipmentAndDevices",
              "DiagnosticAndMonitoringDevices",
              "HomeHealthcareProducts",
            ].includes(category),
          then: Yup.array().max(
            4,
            "You can upload up to 4 performance testing files."
          ),
          // .of(
          // Yup.string().required("A file path is required.") // Since it's now a string
          // ),
        })
        .nullable(),
      performanceTestingReportFileNew: Yup.array()
        .when("category", {
          is: (category) =>
            [
              "MedicalEquipmentAndDevices",
              "DiagnosticAndMonitoringDevices",
              "HomeHealthcareProducts",
            ].includes(category),
          then: Yup.array()
            .max(4, "You can upload up to 4 performance testing files.")
            .of(
              Yup.mixed()
                .required("A file is required.")
                .test(
                  "fileSize",
                  "File too large",
                  (value) => value && value.size <= 1024 * 1024 * 5
                ) // Max 5MB
            ),
        })
        .nullable(),
      additivesNSweeteners: Yup.string()
        .when("category", {
          is: (category) => ["NutritionAndDietaryProducts"].includes(category),
          then: Yup.string().required("Additives & Sweeteners is required."),
        })
        .nullable(),
      targetCondition: Yup.string()
        .when("category", {
          is: (category) =>
            ["SkinHairCosmeticSupplies", "OrthopedicSupplies"].includes(
              category
            ),
          then: Yup.string().required("Target Condition is required."),
        })
        .nullable(),
      foldability: Yup.string()
        .when("category", {
          is: (category) => ["EmergencyAndFirstAidSupplies"].includes(category),
          then: Yup.string().required("Foldability is required."),
        })
        .nullable(),
      healthBenefit: Yup.string()
        .when("category", {
          is: (category) =>
            ["VitalHealthAndWellness", "NutritionAndDietaryProducts"].includes(
              category
            ),

          then: Yup.string().required("Health Benfits is required."),
        })
        .nullable(),
      dermatologistTested: Yup.string()
        .when("category", {
          is: "SkinHairCosmeticSupplies",
          then: Yup.string()
            .required("Dermatologist Tested is required.")
            .oneOf(["Yes", "No"], "Invalid Dermatologist Tested"),
        })
        .nullable(),
      dermatologistTestedFile: Yup.array().when("category", {
        is: "SkinHairCosmeticSupplies", // Check category first
        then: Yup.array()
          .when("dermatologistTested", {
            is: (val) => val && val == "Yes", // If dermatologistTestedFile has a value
            then: Yup.array().max(
              4,
              "You can upload up to 4 dermatologist tested files."
            ),
            otherwise: Yup.array().nullable(), // If no dermatologistTestedFile, file is optional
          })
          .nullable(),
        otherwise: Yup.array().nullable(), // If category is not dermatologistTestedFile, it's not required
      }),
      dermatologistTestedFileNew: Yup.array().when("category", {
        is: "SkinHairCosmeticSupplies", // Check category first
        then: Yup.array()
          .when("dermatologistTested", {
            is: (val) => val && val == "Yes", // If dermatologistTestedFile has a value
            then: Yup.array()
              .min(
                1,
                "At least one file is required for the Dermatologist Tested."
              )
              .max(4, "You can upload up to 4 dermatologist tested files.")
              .required("Dermatologist Tested file is required.")
              .of(
                Yup.mixed()
                  .required("A file is required.")
                  .test(
                    "fileSize",
                    "File too large",
                    (value) => value && value.size <= 1024 * 1024 * 5
                  ) // Max 5MB
              ),
            otherwise: Yup.array().nullable(), // If no dermatologistTestedFile, file is optional
          })
          .nullable(),
        otherwise: Yup.array().nullable(), // If category is not dermatologistTestedFile, it's not required
      }),
      pediatricianRecommended: Yup.string()
        .when("category", {
          is: "SkinHairCosmeticSupplies",
          then: Yup.string()
            .required("Pediatrician Recommended is required.")
            .oneOf(["Yes", "No"], "Invalid Pediatrician Recommended"),
        })
        .nullable(),
      pediatricianRecommendedFile: Yup.array().when("category", {
        is: "SkinHairCosmeticSupplies", // Check category first
        then: Yup.array()
          .when("pediatricianRecommended", {
            is: (val) => val && val == "Yes", // If pediatricianRecommendedFile has a value
            then: Yup.array().max(
              4,
              "You can upload up to 4 Pediatrician Recommended files."
            ),
            otherwise: Yup.array().nullable(), // If no pediatricianRecommendedFile, file is optional
          })
          .nullable(),
        otherwise: Yup.array().nullable(), // If category is not pediatricianRecommendedFile, it's not required
      }),
      pediatricianRecommendedFileNew: Yup.array().when("category", {
        is: "SkinHairCosmeticSupplies", // Check category first
        then: Yup.array()
          .when("pediatricianRecommended", {
            is: (val) => val && val == "Yes", // If pediatricianRecommendedFile has a value
            then: Yup.array()
              .min(
                1,
                "At least one file is required for the Pediatrician Recommended."
              )
              .max(4, "You can upload up to 4 Pediatrician Recommended files.")
              .required("Pediatrician Recommended file is required.")
              .of(
                Yup.mixed()
                  .required("A file is required.")
                  .test(
                    "fileSize",
                    "File too large",
                    (value) => value && value.size <= 1024 * 1024 * 5
                  ) // Max 5MB
              ),
            otherwise: Yup.array().nullable(), // If no pediatricianRecommendedFile, file is optional
          })
          .nullable(),
        otherwise: Yup.array().nullable(), // If category is not pediatricianRecommendedFile, it's not required
      }),
      healthClaimsFile: Yup.array()
        .when("category", {
          is: "AlternativeMedicines",
          then: Yup.array().max(
            4,
            "You can upload up to 4 Health Claims Files."
          ),
        })
        .nullable(),
      healthClaimsFileNew: Yup.array()
        .when("category", {
          is: "AlternativeMedicines",
          then: Yup.array()
            .max(4, "You can upload up to 4 Health Claims Files.")
            .of(
              Yup.mixed()
                .required("A file is required.")
                .test(
                  "fileSize",
                  "File too large",
                  (value) => value && value.size <= 1024 * 1024 * 5
                ) // Max 5MB
            ),
        })
        .nullable(),
      // Add the other fields under EmergencyAndFirstAidSupplies
      productLongevity: Yup.string()
        .when("category", {
          is: "EmergencyAndFirstAidSupplies",
          then: Yup.string().required("Product Longevity is required."),
        })
        .nullable(),
      // Add the other fields under DisinfectionAndHygieneSupplies
      // Add the other fields under NutritionAndDietaryProducts
      flavorOptions: Yup.string()
        .when("category", {
          is: "NutritionAndDietaryProducts",
          then: Yup.string().required("Flavor Options is required."),
        })
        .nullable(),
      aminoAcidProfile: Yup.string()
        .when("category", {
          is: "NutritionAndDietaryProducts",
          then: Yup.string().required("Amino Acid Profile is required."),
        })
        .nullable(),
      fatContent: Yup.string()
        .when("category", {
          is: "NutritionAndDietaryProducts",
          then: Yup.string().required("Fat Content is required."),
        })
        .nullable(),
      dairyFree: Yup.string()
        .when("category", {
          is: "NutritionAndDietaryProducts",
          then: Yup.string()
            .oneOf(["Yes", "No"], "Invalid Dairy Free")
            .required("Dairy Free is required."),
        })
        .nullable(),
      // Add the other fields under HealthcareITSolutions
      license: Yup.string()
        .when("category", {
          is: "HealthcareITSolutions",
          then: Yup.string().required("License is required."),
        })
        .nullable(),
      scalabilityInfo: Yup.string()
        .when("category", {
          is: "HealthcareITSolutions",
          then: Yup.string().required("Scalability Info is required."),
        })
        .nullable(),
      addOns: Yup.string()
        .when("category", {
          is: "HealthcareITSolutions",
          then: Yup.string().required("Add-Ons is required."),
        })
        .nullable(),
      userAccess: Yup.string()
        .when("category", {
          is: "HealthcareITSolutions",
          then: Yup.string().required("User Access is required."),
        })
        .nullable(),
      keyFeatures: Yup.string()
        .when("category", {
          is: "HealthcareITSolutions",
          then: Yup.string().required("Key Features is required."),
        })
        .nullable(),
      coreFunctionalities: Yup.string()
        .when("category", {
          is: "HealthcareITSolutions",
          then: Yup.string().required("Core Functionalities is required."),
        })
        .nullable(),
    }),
    onSubmit: (values) => {
      // Custom submit handler with e.preventDefault()

      const formData = new FormData();

      // Append fields as usual
      Object.keys(values).forEach((key) => {
        const value = values[key];
        // Fixing condition to check for 'productPricingDetails' and 'stockedInDetails'
        if (
          (key !== "productPricingDetails" && key !== "stockedInDetails") ||
          key != "cNCFileNDate"
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
      const supplierId = sessionStorage.getItem("_id");
      if (supplierId) {
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
      formData.append("cNCFileNDate", cNCFileNDateUpdated);

      // Dispatch the editProduct action (or any other submit action)
      dispatch(editProduct({ id, values: formData })).then((response) => {
        if (response?.meta.requestStatus === "fulfilled") {
          // navigate("/supplier/product"); // Change this to your desired route
        }
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

    // Restrict input type
    if (allowedType === "number") {
      value = value.replace(/[^0-9]/g, ""); // Allow only numbers
    } else if (allowedType === "text") {
      value = value.replace(/[^a-zA-Z\s]/g, ""); // Allow only text and spaces
    } else if (
      allowedType === "all" &&
      restrictSpecialForFields.includes(name)
    ) {
      // value = value.replace(/[^a-zA-Z0-9\s]/g, ""); // Allow only letters, numbers, and spaces (No special characters)

      const allowedPattern = new RegExp(
        `[^a-zA-Z0-9\\s${allowedSpecialChars}]`,
        "g"
      );
      value = value.replace(allowedPattern, "");
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

  //   Start the Dropdown option
  const Options = [
    { value: "new product", label: "New Product" },
    { value: "secondary product", label: "Secondary Product" },
  ];
  const packagingUnits = [
    { value: "Kilogram (kg)", label: "Kilogram (kg)" },
    { value: "Gram (g)", label: "Gram (g)" },
    { value: "Milligram (mg)", label: "Milligram (mg)" },
    { value: "Microgram (µg)", label: "Microgram (µg)" },
    { value: "Tonne (t)", label: "Tonne (t)" },
    { value: "Pound (lb)", label: "Pound (lb)" },
    { value: "Ounce (oz)", label: "Ounce (oz)" },
    { value: "Stone (st)", label: "Stone (st)" },
    { value: "Ton (long ton)", label: "Ton (long ton)" },
    { value: "Short ton", label: "Short ton" },
    { value: "Carat (ct)", label: "Carat (ct)" },
    { value: "Grain (gr)", label: "Grain (gr)" },
  ];
  const packagingOptions = [
    { value: "Bottle", label: "Bottle" },
    { value: "Tube", label: "Tube" },
    { value: "Jar", label: "Jar" },
    { value: "Pump", label: "Pump" },
    { value: "Blister Pack", label: "Blister Pack" },
    { value: "Strip", label: "Strip" },
    { value: "Pouches", label: "Pouches" },
    { value: "Soft Case", label: "Soft Case" },
    { value: "Hard Case", label: "Hard Case" },
    { value: "Backpack", label: "Backpack" },
  ];
  const materialOptions = [
    { value: "Plastic", label: "Plastic" },
    { value: "Glass", label: "Glass" },
    { value: "Aluminum", label: "Aluminum" },
    { value: "Cardboard", label: "Cardboard" },
    { value: "Thermocol", label: "Thermocol" },
    { value: "Other", label: "Other" },
  ];
  const conditionOptions = [
    { value: "New", label: "New" },
    { value: "Used", label: "Used" },
    { value: "Refurbished", label: "Refurbished" },
  ];
  const stockOptions = [
    { value: "In-stock", label: "In-stock" },
    { value: "Out of Stock", label: "Out of Stock" },
    { value: "On-demand", label: "On-demand" },
  ];
  const quantityOptions = [
    { value: "0-500", label: "0-500" },
    { value: "500-1000", label: "500-1000" },
    { value: "1000-2000", label: "1000-2000" },
    { value: "2000-5000", label: "2000-5000" },
    { value: "5000-8000", label: "5000-8000" },
    { value: "8000-12000", label: "8000-12000" },
  ];
  const stockQuantityOptions = [
    { value: "America", label: "America" },
    { value: "India", label: "India" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "United Kingdom", label: "United Kingdom" },
  ];
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
      const secondayMarketDetails = productDetail?.secondayMarketDetails || {};
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
        dimension: general?.dimension || "",
        weight: general?.weight || "",
        unit: general?.unit || "",
        packageType: general?.packageType || "",
        packageMaterial: general?.packageMaterial || "",
        packageMaterialIfOther: general?.packageMaterialIfOther || "",
        // costPerProduct: productDetail?.costPerProduct || "", // Assuming it exists in your data
        sku: inventoryDetails?.sku || "", // Nested access for inventoryDetails
        stock: inventoryDetails?.stock || "",
        stockQuantity: inventoryDetails?.stockQuantity || "",
        countries: inventoryDetails?.countries || [], // Assuming countries exists
        // date: productDetail?.date || "",
        date: formatDateToDDMMYYYY(inventoryDetails?.date) || "",
        complianceFile: productDetail?.complianceFile || [],
        cNCFileNDate: productDetail?.cNCFileNDate || [],
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
        purchasedOn: secondayMarketDetails?.purchasedOn || "",
        countryAvailable: secondayMarketDetails?.countryAvailable || [],
        purchaseInvoiceFile: secondayMarketDetails?.purchaseInvoiceFile || [],
        purchaseInvoiceFileNew: [],
        condition: secondayMarketDetails?.condition || "",
        minimumPurchaseUnit: secondayMarketDetails?.minimumPurchaseUnit || "",
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
          { quantity: "", price: "", deliveryTime: "" },
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

  return (
    <div className={styles.container}>
      <div className={styles.headContainer}>
        <span className={styles.heading}>Edit Products</span>
      </div>
      <FormikProvider value={formik}>
        {/* <Row> */}
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
                  // onChange={formik?.handleChange}
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
                  // isDisabled={true} // Disable when no category is selected
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
                      value={formik?.values?.purchasedOn}
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
                      // value={formik?.values?.countryAvailable} // Bind Formik's state
                      value={formik.values?.countryAvailable.map((country) => ({
                        label: country,
                        value: country,
                      }))}
                      onChange={(selectedOptions) => {
                        // Ensure we map selected options correctly
                        const selectedValues = selectedOptions
                          ? selectedOptions.map((option) => option?.label)
                          : [];
                        formik.setFieldValue(
                          "countryAvailable",
                          selectedValues
                        ); // Update Formik value with the selected country values
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
                      // onChange={formik?.handleChange}
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
                  // onChange={formik?.handleChange}
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
                  // onChange={formik?.handleChange}
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
                <label className={styles.formLabel}>Brand Name</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Enter Brand Name"
                  // autoComplete="off"
                  name="brand"
                  value={formik?.values?.brand}
                  // onChange={formik?.handleChange}
                  onChange={(e) =>
                    handleInputChange(e, formik.setFieldValue, 50, "text")
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
                    // onChange={formik?.handleChange}
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
                    // onChange={formik?.handleChange}
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
                <label className={styles.formLabel}>
                  Product Size/Volumn
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <div className={styles.tooltipContainer}>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Size/Volume"
                    // autoComplete="off"
                    name="volumn"
                    value={formik?.values?.volumn}
                    // onChange={formik?.handleChange}
                    onChange={(e) =>
                      handleInputChange(e, formik.setFieldValue, 9, "all", [
                        "volumn",
                      ])
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip
                    content="The size or volume of the product (e.g., 50 mL, 100 g, drip
                    chamber ) (e.g., macro, micro),
                    Length of the needle (e.g., 19 mm, 26 mm ) tape
                    width, adhesive strip size etc."
                  ></Tooltip>
                </div>
                {formik.touched.volumn && formik.errors.volumn && (
                  <span className={styles.error}>{formik.errors.volumn}</span>
                )}
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Dimension
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <div className={styles.tooltipContainer}>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Size/Volume"
                    // autoComplete="off"
                    name="dimension"
                    value={formik?.values?.dimension}
                    // onChange={formik?.handleChange}
                    onChange={(e) =>
                      handleInputChange(e, formik.setFieldValue, 9, "all", [
                        "dimension",
                      ])
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip
                    content="The size or volume of the product (e.g., 50 mL, 100 g, drip
                    chamber ) (e.g., macro, micro),
                    Length of the needle (e.g., 19 mm, 26 mm ) tape
                    width, adhesive strip size etc."
                  ></Tooltip>
                </div>
                {formik.touched.dimension && formik.errors.dimension && (
                  <span className={styles.error}>
                    {formik.errors.dimension}
                  </span>
                )}
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Weight<span className={styles?.labelStamp}>*</span>
                </label>
                <div className={styles.tooltipContainer}>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter Product Weight"
                    // autoComplete="off"
                    name="weight"
                    value={formik?.values?.weight}
                    // onChange={formik?.handleChange}
                    onChange={(e) =>
                      handleInputChange(e, formik.setFieldValue, 5, "all", [
                        "weight",
                      ])
                    }
                    onBlur={formik?.handleBlur}
                  />
                  <Tooltip content="in (g, kg, lbs, l, ml, oz, gal, t)"></Tooltip>
                </div>
                {formik.touched.weight && formik.errors.weight && (
                  <span className={styles.error}>{formik.errors.weight}</span>
                )}
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Units<span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className={styles.formSelect}
                  options={packagingUnits}
                  placeholder="Select Units"
                  onBlur={formik?.handleBlur}
                  // Ensure that the value reflects the value from formik or the productDetail state
                  value={packagingUnits.find(
                    (option) => option?.value === formik?.values?.unit
                  )}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("unit", selectedOption?.value);
                  }}
                />
                {formik.touched.unit && formik.errors.unit && (
                  <span className={styles.error}>{formik.errors.unit}</span>
                )}
              </div>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  Product Packaging Type
                  {/* <span className={styles?.labelStamp}>*</span> */}
                </label>
                <div className={styles.tooltipContainer}>
                  {/* <Select
                    className={styles.formSelect}
                    options={packagingOptions}
                    name={formik?.values?.packageType}
                    onBlur={formik?.handleBlur}
                    // Ensure that the value reflects the value from formik or the productDetail state
                    value={packagingOptions.find(
                      (option) => option?.value === formik?.values?.packageType
                    )}
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "packageType",
                        selectedOption?.value
                      );
                    }}
                    placeholder="Select Product Packaging Type"
                  /> */}
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
                  {/* <span className={styles?.labelStamp}>*</span> */}
                </label>
                <div className={styles.tooltipContainer}>
                  {/* <Select
                    className={styles.formSelect}
                    options={materialOptions}
                    placeholder="Select Product Packaging Material"
                    value={
                      materialOptions.find(
                        (option) =>
                          option?.value === formik?.values?.packageMaterial
                      ) || null
                    } // Bind selected option to Formik value
                    name="packageMaterial"
                    onBlur={formik?.handleBlur}
                    onChange={(option) => {
                      setSelectedOption(option);
                      formik.setFieldValue("packageMaterial", option?.value); // Update Formik value with selected option
                      if (option?.value !== "Other") {
                        formik.setFieldValue("otherMaterial", ""); // Reset other material if option is not "other"
                      }
                    }}
                  /> */}
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

                {/* Show text field when "Other" is selected */}
                {/* {selectedOption?.value === "Other" && (
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Enter Packaging Material"
                    name="packageMaterialIfOther"
                    value={otherMaterial}
                    onBlur={formik?.handleBlur}
                    onChange={(e) => {
                      setOtherMaterial(e.target.value);
                      formik.setFieldValue(
                        "packageMaterialIfOther",
                        e.target.value
                      );
                    }}
                  />
                )} */}

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
                  onChange={(e) => {
                    formik.setFieldValue("manufacturer", e.target.value);
                  }}
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
                <label className={styles.formLabel}>
                  About Manufacturer
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <textarea
                  className={styles.formInput}
                  type="text"
                  placeholder="Enter About Manufacturer"
                  value={formik?.values?.aboutManufacturer}
                  name="aboutManufacturer"
                  onBlur={formik?.handleBlur}
                  // onChange={formik?.handleChange}
                  onChange={(e) =>
                    handleInputChange(e, formik.setFieldValue, 1000, "all")
                  }
                />
                {formik.touched.aboutManufacturer &&
                  formik.errors.aboutManufacturer && (
                    <span className={styles.error}>
                      {formik.errors.aboutManufacturer}
                    </span>
                  )}
              </div>
              <div className={styles.formInnerSection}>
                <AddProductFileUpload
                  productDetails={productDetail}
                  maxfileCount={4 - (formik?.values?.image?.length || 0)}
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
              <div className={styles.formInnerSection}>
                {formik?.values?.market === "secondary" && (
                  <AddProductFileUpload
                    productDetails={productDetail}
                    maxfileCount={
                      4 - (formik?.values?.purchaseInvoiceFile?.length || 0)
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
                    maxFiles={1}
                    error={
                      (formik.touched.purchaseInvoiceFileNew ||
                        formik.touched.purchaseInvoiceFile ||
                        formik.errors.purchaseInvoiceFileNew ||
                        formik.errors.purchaseInvoiceFile) &&
                      (formik.errors.purchaseInvoiceFileNew ||
                        formik.errors.purchaseInvoiceFile)
                    }
                  />
                )}
              </div>
              <div className={styles.descriptionContainer}>
                {/* <label className={styles.formLabel}>
                  Product Description
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <JoditEditor
                  ref={editor}
                  value={formik?.values?.description}
                  name="description"
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => {
                    setContent(newContent);
                    formik.setFieldValue("description", newContent);
                  }}
                  onChange={(newContent) => {
                    setContent(newContent);
                    formik.setFieldValue("description", newContent);
                  }}
                /> */}
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
                  // error={formik?.errors.description}
                  // touched={formik?.touched.description}
                  height={300}
                />
                {formik.touched.description && formik.errors.description && (
                  <span className={styles.error}>
                    {formik.errors.description}
                  </span>
                )}
              </div>
              <div className={styles.sectionCompliances}>
                <span className={styles.formHead}>Storage & Handling</span>
                <div className={styles.compliancesContainer}>
                  <label className={styles.formLabel}>Storage Conditions</label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Storage Conditions"
                      // autoComplete="off"
                      name="storage"
                      // onChange={formik?.handleChange}
                      value={formik?.values?.storage}
                      onChange={(e) =>
                        handleInputChange(e, formik.setFieldValue, 30, "all")
                      }
                      onBlur={formik?.handleBlur}
                    />
                    <Tooltip content="Recommended storage (e.g., store in a cool, dry place)"></Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Start the Inventory */}
          <div className={styles.section}>
            <span className={styles.formHead}>Inventory</span>
            <div className={styles.formSection}>
              <div className={styles.productContainer}>
                <label className={styles.formLabel}>
                  SKU<span className={styles?.labelStamp}>*</span>
                </label>
                <div className={styles.tooltipContainer}>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter SKU"
                    // autoComplete="off"
                    name="sku"
                    value={formik?.values?.sku}
                    // onChange={formik?.handleChange}
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
                  {/* <span className={styles?.labelStamp}>*</span> */}
                </label>
                <div className={styles.tooltipContainer}>
                  {/* <InputMask
                    className={styles.formInput}
                    type="text"
                    mask="dd-mm-yyyy"
                    placeholder="Enter Date of Manufacture"
                    name="date"
                    value={formik?.values?.date}
                    onChange={formik?.handleChange}
                    replacement={{ d: /\d/, m: /\d/, y: /\d/ }}
                    showMask
                    separate
                  /> */}

                  <DatePicker
                    className={styles.formDate}
                    clearIcon={null}
                    format="dd/MM/yyyy"
                    placeholder="dd/MM/yyyy"
                    name="date"
                    maxDate={new Date()}
                    value={formik?.values?.date}
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
                  Stocked in Country
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <MultiSelectDropdown
                  options={countries}
                  placeholderButtonLabel="Select Countries"
                  name="countries"
                  // value={formik?.values?.countryAvailable} // Bind Formik's state
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

              {formik?.values?.stockedInDetails?.map((stock, index) => (
                <div key={index} className={styles.formSection}>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Countries where Stock Trades
                      {/* <span className={styles?.labelStamp}>*</span> */}
                    </label>
                    <Select
                      className={styles.formSelect}
                      options={formik?.values?.countries.map((country) => ({
                        label: country,
                        value: country,
                      }))} // Map countries to the correct format
                      placeholder="Select Countries where Stock Trades"
                      value={formik?.values?.countries
                        .map((country) => ({ label: country, value: country }))
                        .find((option) => option.value === stock?.country)} // Find the selected country
                      onBlur={formik?.handleBlur}
                      onChange={(option) =>
                        formik.setFieldValue(
                          `stockedInDetails.${index}.country`,
                          option?.value
                        )
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
                      {/* <span className={styles?.labelStamp}>*</span> */}
                    </label>
                    <div className={styles.productQuantityContainer}>
                      <div className={styles.quantitySection}>
                        <input
                          name={`stockedInDetails.${index}.quantity`}
                          className={styles.quantityInput}
                          placeholder={stock.placeholder}
                          type="number"
                          value={
                            formik?.values?.stockedInDetails[index]?.quantity ||
                            ""
                          }
                          onChange={formik.handleChange}
                        />

                        {/* <button
                          type="button"
                          className={`${styles.quantityButton} ${styles.selected}`}
                        >
                          {stock.type}
                        </button> */}
                      </div>

                      {/* <div className={styles.radioForm}>
                        {["Box", "Strip", "Pack"].map((type) => (
                          <label key={type}>
                            <input
                              type="radio"
                              name={`stockedInDetails.${index}.type`}
                              value={type}
                              checked={stock.type === type}
                              onChange={() => {
                                const updatedList = [
                                  ...formik?.values?.stockedInDetails,
                                ];
                                updatedList[index].type = type;
                                updatedList[
                                  index
                                ].placeholder = `Enter ${type} Quantity`;
                                formik.setFieldValue(
                                  "stockedInDetails",
                                  updatedList
                                );
                              }}
                            />
                            <span className={styles.radioText}>{type}</span>
                          </label>
                        ))}
                      </div> */}
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
                  formik.setFieldValue("productPricingDetails", [
                    ...formik?.values?.productPricingDetails,
                    {
                      quantity: "",
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
                          <Field
                            name={`productPricingDetails.${index}.quantity`}
                          >
                            {({ field }) => (
                              <Select
                                {...field}
                                className={styles.formSelect}
                                options={quantityOptions}
                                placeholder="Select Quantity"
                                value={quantityOptions.find(
                                  (option) => option?.value === stock?.quantity
                                )}
                                onBlur={formik.handleBlur}
                                onChange={(option) =>
                                  formik.setFieldValue(
                                    `productPricingDetails.${index}.quantity`,
                                    option?.value
                                  )
                                }
                              />
                            )}
                          </Field>
                          <span className={styles.error}>
                            {formik.touched.productPricingDetails?.[index]
                              ?.quantity &&
                              formik.errors.productPricingDetails?.[index]
                                ?.quantity}
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
                            <span className={styles?.labelStamp}>*</span>
                          </label>
                          <Field
                            name={`productPricingDetails.${index}.deliveryTime`}
                            type="text"
                            placeholder="Enter Est. Delivery Time"
                            className={styles.formInput}
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

            {formik?.values?.cNCFileNDate?.map((ele, index) => (
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
                          typeof ele?.file == "string" ? [ele?.file] : ele?.file
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
                    {/* <span className={styles.labelStamp}>*</span> */}
                  </label>
                  <div className={styles.tooltipContainer}>
                    {/* Date Mask Input */}
                    {/* <InputMask
                      className={styles.formInput}
                      type="text"
                      mask="dd-mm-yyyy"
                      placeholder="Enter Date of Expiry"
                      name={`cNCFileNDate.${index}.date`}
                      value={ele?.date}
                      onChange={(e) => {
                        formik?.handleChange(e);
                        // Force validation immediately after change
                        formik?.setFieldTouched(
                          `cNCFileNDate.${index}.date`,
                          true,
                          true
                        );
                      }}
                      onBlur={formik?.handleBlur}
                      replacement={{ d: /\d/, m: /\d/, y: /\d/ }}
                      showMask
                      separate
                    /> */}

                    <DatePicker
                      className={styles.formDate}
                      clearIcon={null}
                      format="dd/MM/yyyy"
                      placeholder="dd/MM/yyyy"
                      name={`cNCFileNDate.${index}.date`}
                      value={ele?.date}
                      minDate={new Date()}
                      onChange={(e) => {
                        // formik?.handleChange(e);
                        // Force validation immediately after change
                        formik?.setFieldValue(`cNCFileNDate.${index}.date`, e); // This updates Formik's value
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
                    {/* <Tooltip className={styles.tooltipSec} id="sku-tooltip" /> */}
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
                      formik?.setFieldValue("complianceFileNew", updatedList2);
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
                      // onChange={formik?.handleChange}
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
                      // onChange={formik?.handleChange}
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
                      // onChange={formik?.handleChange}
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
                      // onChange={formik?.handleChange}
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
                      // onChange={formik?.handleChange}
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
                      // onChange={formik?.handleChange}
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
                    maxfileCount={
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
                      // onChange={formik?.handleChange}
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
                    maxfileCount={
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
                    error={
                      (formik.touched.specificationFile ||
                        formik.touched.specificationFileNew ||
                        formik.errors.specificationFile ||
                        formik.errors.specificationFileNew) &&
                      (formik.errors.specificationFile ||
                        formik.errors.specificationFileNew)
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 50, "all")
                        }
                        onBlur={formik?.handleBlur}
                      />
                      <Tooltip content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."></Tooltip>
                    </div>
                    {/* <span className={styles.error}></span> */}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                        {/* <span className={styles.error}></span> */}
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
                            // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                            value={formik?.values?.dermatologistTested}
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
                              maxfileCount={
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
                              // fileUpload={dermatologistUpload}
                              tooltip={false}
                              showLabel={false}
                              error={
                                (formik.touched.dermatologistTestedFile ||
                                  formik.touched.dermatologistTestedFileNew ||
                                  formik.errors.dermatologistTestedFile ||
                                  formik.errors.dermatologistTestedFileNew) &&
                                (formik.errors.dermatologistTestedFile ||
                                  formik.errors.dermatologistTestedFileNew)
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
                            value={formik?.values?.pediatricianRecommended}
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
                              maxfileCount={
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
                              // fileUpload={pediatricianUpload}
                              tooltip={false}
                              showLabel={false}
                              error={
                                formik.touched.pediatricianRecommendedFileNew ||
                                formik.touched.pediatricianRecommendedFile ||
                                ((formik.errors
                                  .pediatricianRecommendedFileNew ||
                                  formik.errors.pediatricianRecommendedFile) &&
                                  (formik.errors
                                    .pediatricianRecommendedFileNew ||
                                    formik.errors.pediatricianRecommendedFile))
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        value={value.filtrationType}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                              checked={checked["sterilized"] || false}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
                        onChange={(e) =>
                          handleInputChange(e, formik.setFieldValue, 20, "all")
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                      // onChange={formik?.handleChange}
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
                      // onChange={formik?.handleChange}
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
                      // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                      maxfileCount={
                        4 - (formik?.values?.specificationFile?.length || 0)
                      }
                      fieldInputName={"specificationFileNew"}
                      oldFieldName={"specificationFile"}
                      existingFiles={formik?.values?.specificationFile}
                      setFieldValue={formik.setFieldValue}
                      initialValues={formik?.values}
                      label=""
                      // fileUpload={specificationUpload}
                      tooltip={false}
                      showLabel={false}
                      error={
                        ((formik.touched.specificationFileNew ||
                          formik.touched.specificationFile ||
                          formik.errors.specificationFileNew ||
                          formik.errors.specificationFile) &&
                          formik.errors.specificationFileNew) ||
                        formik.errors.specificationFile
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
                        // onChange={formik?.handleChange}
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
                      maxfileCount={
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                              checked={checked["sterilized"] || false}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        value={pharmaOptions.find(
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                              checked={checked["sterilized"] || false}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                      value={pharmaOptions.find(
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
                      value={pharmaOptions.find(
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
                      value={pharmaOptions.find(
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
                      // onChange={formik?.handleChange}
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
                      // onChange={formik?.handleChange}
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
                      // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                          maxfileCount={
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                      maxfileCount={
                        4 - (formik?.values?.healthClaimsFile?.length || 0)
                      }
                      fieldInputName={"healthClaimsFileNew"}
                      oldFieldName={"healthClaimsFile"}
                      existingFiles={formik?.values?.healthClaimsFile}
                      setFieldValue={formik.setFieldValue}
                      initialValues={formik?.values}
                      label=""
                      // fileUpload={healthCliamUpload}
                      tooltip={false}
                      showLabel={false}
                      error={
                        formik.touched.healthClaimsFileNew ||
                        formik.touched.healthClaimsFile ||
                        ((formik.errors.healthClaimsFileNew ||
                          formik.errors.healthClaimsFile) &&
                          formik.errors.healthClaimsFileNew) ||
                        formik.errors.healthClaimsFile
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
                          // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
            "disinfectionAndHygieneSuppliesSchema"?.toLowerCase() && (
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                        value={pharmaOptions.find(
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                          // onChange={formik?.handleChange}
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
                        // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                            // onChange={formik?.handleChange}
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
                          maxfileCount={
                            4 -
                            (formik?.values?.interoperabilityFile?.length || 0)
                          }
                          fieldInputName={"interoperabilityFileNew"}
                          oldFieldName={"interoperabilityFile"}
                          existingFiles={formik?.values?.interoperabilityFile}
                          setFieldValue={formik.setFieldValue}
                          initialValues={formik?.values}
                          label=""
                          // fileUpload={interoperabilityUpload}
                          tooltip={false}
                          showLabel={false}
                          error={
                            formik.touched.interoperabilityFileNew ||
                            formik.touched.interoperabilityFile ||
                            ((formik.errors.interoperabilityFileNew ||
                              formik.errors.interoperabilityFile) &&
                              formik.errors.interoperabilityFileNew) ||
                            formik.errors.interoperabilityFile
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

          {/* Start the Health & Safety */}
          <div className={styles.section}>
            <span className={styles.formHead}>Health & Safety</span>
            <div className={styles.formSection}>
              {/* <AddProductFileUpload
                productDetails={productDetail}
                maxfileCount={
                  4 - (formik?.values?.safetyDatasheet?.length || 0)
                }
                fieldInputName={"safetyDatasheetNew"}
                oldFieldName={"safetyDatasheet"}
                existingFiles={formik?.values?.safetyDatasheet}
                setFieldValue={formik.setFieldValue}
                initialValues={formik?.values}
                label="Safety Datasheet"
                // fileUpload={safetyDatasheetUpload}
                tooltip="Specific safety information, instructions or precautions related to product"
                error={
                  formik.touched.safetyDatasheetNew ||
                  formik.touched.safetyDatasheet ||
                  ((formik.errors.safetyDatasheetNew ||
                    formik.errors.safetyDatasheet) &&
                    formik.errors.safetyDatasheetNew) ||
                  formik.errors.safetyDatasheet
                }
              /> */}
              <AddProductFileUpload
                productDetails={productDetail}
                maxfileCount={
                  4 - (formik?.values?.safetyDatasheet?.length || 0)
                }
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

              <AddProductFileUpload
                productDetails={productDetail}
                maxfileCount={
                  4 - (formik?.values?.healthHazardRating?.length || 0)
                }
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

              <AddProductFileUpload
                productDetails={productDetail}
                maxfileCount={
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
                  // onChange={formik?.handleChange}
                  onChange={(e) =>
                    handleInputChange(e, formik.setFieldValue, 20, "all")
                  }
                  onBlur={formik?.handleBlur}
                />
              </div>

              <AddProductFileUpload
                productDetails={productDetail}
                maxfileCount={4 - (formik?.values?.guidelinesFile?.length || 0)}
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
                    // onChange={formik?.handleChange}
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
            <button className={styles.buttonCancel}>Cancel</button>
            <button className={styles.buttonSubmit} type="submit">
              Submit
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
