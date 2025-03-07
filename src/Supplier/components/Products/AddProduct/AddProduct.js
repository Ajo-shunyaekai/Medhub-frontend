import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Select, { components } from "react-select";
import { FaUpload } from "react-icons/fa";
import JoditEditor from "jodit-react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import countryList from "react-select-country-list";
import DatePicker from "react-date-picker";
import CloseIcon from "@mui/icons-material/Close";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { Tooltip, TooltipProvider } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Chips } from "primereact/chips";
import Information from "../../../assets/images/infomation.svg";
import "./addproduct.css";
import styles from "./addproduct.module.css";
import categoryArrays from "../../../../utils/Category";
import { Field, Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import AddProductFileUpload from "./AddPRoductFileUpload";
import { ErrorSharp } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import {
  addProduct,
  fetchProductDetail,
  fetchProductsList,
  softDeleteProduct,
} from "../../../../redux/reducers/productSlice";
import { InputMask } from "@react-input/mask";

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
  const dispatch = useDispatch();
  const productValidationSchema = Yup.object({
    name: Yup.string().required("Product Name is required."),
    description: Yup.string().required("Product Description is required."),
    manufacturer: Yup.string().required("Manufacturer Name is required."),
    aboutManufacturer: Yup.string().required("About Manufacturer is required."),
    countryOfOrigin: Yup.string().required(
      "Manufacturer Country of Origin is required."
    ),
    model: Yup.string().required("Part/Model Number is required."),
    image: Yup.array()
      .max(4, "You can upload up to 4 images.")
      .of(
        Yup.mixed()
          .required("A file is required.")
          .test(
            "fileSize",
            "File too large",
            (value) => value && value.size <= 1024 * 1024 * 5
          ) // Max 5MB
      ),
    form: Yup.string().required("Product Type/Form is required."),
    quantity: Yup.number().required("Product Quantity is required."),

    volumn: Yup.string().required("Product Size/Volumn is required."),
    weight: Yup.number().required("Product Weight is required."),
    unit: Yup.string().required("Product Weight Unit is required."),
    packageType: Yup.string().required("Product Packaging Type is required."),
    packageMaterial: Yup.string().required(
      "Product Packaging Material is required."
    ),
    packageMaterialIfOther: Yup.string()
      .when("packageMaterial", {
        is: "Other",
        then: Yup.string().required("Package Material Name is required."),
      })
      .nullable(),
    packageMaterialIfOther: Yup.string().when("packageMaterial", {
      is: "Other",
      then: Yup.string().required(
        "Product Packaging Material Other Name is required."
      ),
    }),
    // costPerProduct: Yup.string().required("Cost Per Unit is required."),
    sku: Yup.string().required("SKU is required."),
    stock: Yup.string()
      .oneOf(["In-stock", "Out of Stock", "On-demand"])
      .required("Stock is required."),
    // stockQuantity: Yup.number().required("Stock Quantity is required."),
    countries: Yup.array()
      .min(1, "At least one country must be selected.")
      .of(Yup.string().required("Country Available is required.")),
    date: Yup.string().required("Date is required."),
    stockedInDetails: Yup.array()
      .of(
        Yup.object({
          country: Yup.string().required("Country is required."),
          quantity: Yup.number()
            .required("Quantity is required.")
            .positive("Quantity must be greater than 0"),
          type: Yup.string().required("Type is required."),
        })
      )
      .min(1, "At least one product is required."), // Optional: You can enforce at least one item in the array
    productPricingDetails: Yup.array()
      .of(
        Yup.object({
          quantity: Yup.string().required("Quantity is required."),
          price: Yup.number()
            .required("Price is required.")
            .positive("Price must be greater than 0"),
          deliveryTime: Yup.string().required("Delivery Time is required."),
        })
      )
      .min(1, "At least one product is required."), // Optional: You can enforce at least one item in the array
    complianceFile: Yup.array()
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
    guidelinesFile: Yup.array()
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
    safetyDatasheet: Yup.array()
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
    healthHazardRating: Yup.array()
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
    environmentalImpact: Yup.array()
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
      .of(Yup.mixed().required("Performa Invoice File is required."))
      .when("market", {
        is: "secondary",
        then: Yup.array()
          .min(1, "At least one Performa Invoice File must be selected.")
          .max(4, "You can upload up to 4 safety datasheets.")
          .required("Purchase Invoice files is required.")
          .of(
            Yup.mixed()
              .required("A Purchase Invoice File is required.")
              .test(
                "fileSize",
                "File too large",
                (value) => value && value.size <= 1024 * 1024 * 5
              ) // Max 5MB
          ),
      }),
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
          .required("Subcategory is required."),
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
    anotherCategory: Yup.string().nullable(),
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
    // controlledSubstance: Yup.boolean()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "Pharmaceuticals",
    //         "SkinHairCosmeticSupplies",
    //         "VitalHealthAndWellness",
    //       ].includes(category),
    //     then: Yup.boolean().nullable(),
    //   })
    //   .nullable(),
    // otcClassification: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "Pharmaceuticals",
    //         "SkinHairCosmeticSupplies",
    //         "VitalHealthAndWellness",
    //       ].includes(category),
    //     then: Yup.string().oneOf(
    //       ["Category I", "Category II", "Category III"],
    //       "Invalid OTC Classification"
    //     ),
    //   })
    //   .nullable(),
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
      // .when("category", {
      //   is: (category) =>
      //     [
      //       "Pharmaceuticals",
      //       "VitalHealthAndWellness",
      //       "MedicalConsumablesAndDisposables",
      //       "LaboratorySupplies",
      //       "HospitalAndClinicSupplies",
      //       "OrthopedicSupplies",
      //       "DentalProducts",
      //       "AlternativeMedicines",
      //       "NutritionAndDietaryProducts",
      //     ].includes(category),
      //   then: Yup.string().nullable(),
      // })
      .nullable(),
    drugAdministrationRoute: Yup.string()
      .when("category", {
        is: (category) =>
          [
            "Pharmaceuticals",
            "SkinHairCosmeticSupplies",
            "VitalHealthAndWellness",
          ].includes(category),
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
    // allergens: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "Pharmaceuticals",
    //         "SkinHairCosmeticSupplies",
    //         "VitalHealthAndWellness",
    //         "MedicalConsumablesAndDisposables",
    //       ].includes(category),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // formulation: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "Pharmaceuticals",
    //         "SkinHairCosmeticSupplies",
    //         "VitalHealthAndWellness",
    //         "DisinfectionAndHygieneSupplies",
    //       ].includes(category),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // vegan: Yup.boolean()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "SkinHairCosmeticSupplies",
    //         "VitalHealthAndWellness",
    //         "NutritionAndDietaryProducts",
    //       ].includes(category),
    //     then: Yup.boolean().nullable(),
    //   })
    //   .nullable(),
    // crueltyFree: Yup.boolean()
    //   .when("category", {
    //     is: (category) =>
    //       ["SkinHairCosmeticSupplies", , "VitalHealthAndWellness"].includes(
    //         category
    //       ),
    //     then: Yup.boolean().nullable(),
    //   })
    //   .nullable(),
    // sideEffectsAndWarnings: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "Pharmaceuticals",
    //         "SkinHairCosmeticSupplies",
    //         "VitalHealthAndWellness",
    //       ].includes(category),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // thickness: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "SkinHairCosmeticSupplies",
    //         "MedicalConsumablesAndDisposables",
    //         "HospitalAndClinicSupplies",
    //       ].includes(category),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    interoperability: Yup.string()
      // .when("category", {
      //   is: (category) => ["MedicalEquipmentAndDevices"].includes(category),
      //   then: Yup.string().nullable(),
      // })
      .when("category", {
        is: (category) => ["HealthcareITSolutions"].includes(category),
        then: Yup.string().required("Interoperability is required."),
      })
      .nullable(),
    interoperabilityFile: Yup.array()
      .when("category", {
        is: (category) => ["HealthcareITSolutions"].includes(category),
        then: Yup.array()
          .min(
            1,
            "At least one file is required for the Interoperability file."
          )
          .max(4, "You can upload up to 4 Interoperability files.")
          .required("Interoperability files is required.")
          // .test(
          //   "fileSize",
          //   "File too large",
          //   (value) => value && value.size <= 1024 * 1024 * 5
          // ), // Max 5MB
      })
      .nullable(),
    specification: Yup.string()
      // .when("category", {
      //   is: (category) => ["MedicalEquipmentAndDevices"].includes(category),
      //   then: Yup.string().nullable(),
      // })
      .when("category", {
        is: (category) => ["DiagnosticAndMonitoringDevices"].includes(category),
        then: Yup.string().required("Specification is required."),
      })
      .nullable(),
    specificationFile: Yup.array()
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
        is: (category) => ["DiagnosticAndMonitoringDevices"].includes(category),
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
      // .when("category", {
      //   is: (category) => ["MedicalEquipmentAndDevices"].includes(category),
      //   then: Yup.string().nullable(),
      // })
      .when("category", {
        is: (category) => ["DiagnosticAndMonitoringDevices"].includes(category),
        then: Yup.string().required("Diagnostic Functions is required."),
      })
      .nullable(),
    // performanceTestingReport: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "MedicalEquipmentAndDevices",
    //         "DiagnosticAndMonitoringDevices",
    //         "HomeHealthcareProducts",
    //       ].includes(category),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    performanceTestingReportFile: Yup.array()
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
    // additivesNSweeteners: Yup.string()
    //   .when("category", {
    //     is: (category) => ["VitalHealthAndWellness"].includes(category),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    additivesNSweeteners: Yup.string()
      .when("category", {
        is: (category) => ["NutritionAndDietaryProducts"].includes(category),
        then: Yup.string().required("Additives & Sweeteners is required."),
      })
      .nullable(),
    // powdered: Yup.boolean()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "MedicalConsumablesAndDisposables",
    //         "HospitalAndClinicSupplies",
    //       ].includes(category),
    //     then: Yup.boolean().nullable(),
    //   })
    //   .nullable(),
    // productMaterial: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "MedicalConsumablesAndDisposables",
    //         "HospitalAndClinicSupplies",
    //         "DentalProducts",
    //       ].includes(category),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // texture: Yup.boolean()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "MedicalConsumablesAndDisposables",
    //         "HospitalAndClinicSupplies",
    //       ].includes(category),
    //     then: Yup.boolean().nullable(),
    //   })
    //   .nullable(),
    // sterilized: Yup.boolean()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "MedicalConsumablesAndDisposables",
    //         "HospitalAndClinicSupplies",
    //         "OrthopedicSupplies",
    //       ].includes(category),
    //     then: Yup.boolean().nullable(),
    //   })
    //   .nullable(),
    // chemicalResistance: Yup.boolean()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "MedicalConsumablesAndDisposables",
    //         "HospitalAndClinicSupplies",
    //       ].includes(category),
    //     then: Yup.boolean().nullable(),
    //   })
    //   .nullable(),
    // fluidResistance: Yup.boolean()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "MedicalConsumablesAndDisposables",
    //         "HospitalAndClinicSupplies",
    //       ].includes(category),
    //     then: Yup.boolean().nullable(),
    //   })
    //   .nullable(),
    // shape: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       ["MedicalConsumablesAndDisposables", "LaboratorySupplies"].includes(
    //         category
    //       ),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // coating: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "MedicalConsumablesAndDisposables",
    //         "LaboratorySupplies",
    //         "OrthopedicSupplies",
    //       ].includes(category),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // concentration: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "SkinHairCosmeticSupplies",
    //         "LaboratorySupplies",
    //         "DiagnosticAndMonitoringDevices",
    //         "HomeHealthcareProducts",
    //         "DisinfectionAndHygieneSupplies",
    //       ].includes(category),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // measurementRange: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       ["DiagnosticAndMonitoringDevices", "HomeHealthcareProducts"].includes(
    //         category
    //       ),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // maintenanceNotes: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       ["DiagnosticAndMonitoringDevices", "DentalProducts"].includes(
    //         category
    //       ),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // compatibleEquipment: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       ["DiagnosticAndMonitoringDevices", "DentalProducts"].includes(
    //         category
    //       ),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // usageRate: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       ["DiagnosticAndMonitoringDevices", "DentalProducts"].includes(
    //         category
    //       ),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // adhesiveness: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       ["SkinHairCosmeticSupplies", "HospitalAndClinicSupplies"].includes(
    //         category
    //       ),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // absorbency: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       ["HospitalAndClinicSupplies", "OrthopedicSupplies"].includes(
    //         category
    //       ),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    targetCondition: Yup.string()
      .when("category", {
        is: (category) =>
          ["SkinHairCosmeticSupplies", "OrthopedicSupplies"].includes(category),
        then: Yup.string().required("Target Condition is required."),
      })
      // .when("category", {
      //   is: (category) => ["DentalProducts"].includes(category),
      //   then: Yup.string().nullable(),
      // })
      .nullable(),
    // elasticity: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "SkinHairCosmeticSupplies",
    //         "HospitalAndClinicSupplies",
    //         "OrthopedicSupplies",
    //       ].includes(category),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // breathability: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       ["MedicalConsumablesAndDisposables", "OrthopedicSupplies"].includes(
    //         category
    //       ),
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    foldability: Yup.string()
      // .when("category", {
      //   is: (category) => ["HomeHealthcareProducts"].includes(category),
      //   then: Yup.string().nullable(),
      // })
      .when("category", {
        is: (category) => ["EmergencyAndFirstAidSupplies"].includes(category),
        then: Yup.string().required("Foldability is required."),
      })
      .nullable(),
    // fragrance: Yup.string()
    //   .when("category", {
    //     is: (category) =>
    //       [
    //         "SkinHairCosmeticSupplies",
    //         "DisinfectionAndHygieneSupplies",
    //       ].includes(category),

    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    healthBenefit: Yup.string()
      .when("category", {
        is: (category) =>
          ["VitalHealthAndWellness", "NutritionAndDietaryProducts"].includes(
            category
          ),

        then: Yup.string().required("Health Benfits is required."),
      })
      .nullable(),
    // Add the other fields under MedicalEquipmentAndDevices
    // laserType: Yup.string()
    //   .when("category", {
    //     is: "MedicalEquipmentAndDevices",
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // coolingSystem: Yup.string()
    //   .when("category", {
    //     is: "MedicalEquipmentAndDevices",
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // spotSize: Yup.string()
    //   .when("category", {
    //     is: "MedicalEquipmentAndDevices",
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // Add the other fields under Pharmaceuticals
    // Add the other fields under SkinHairCosmeticSupplies
    // spf: Yup.string()
    //   .when("category", {
    //     is: "SkinHairCosmeticSupplies",
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
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
    // moisturizers: Yup.string()
    //   .when("category", {
    //     is: "SkinHairCosmeticSupplies",
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // fillerType: Yup.string()
    //   .when("category", {
    //     is: "SkinHairCosmeticSupplies",
    //     then: Yup.string().nullable(),
    //   })
    //   .nullable(),
    // Add the other fields under VitalHealthAndWellness
    // Add the other fields under MedicalConsumablesAndDisposables
    filtrationEfficiency: Yup.string()
      .when("category", {
        is: "MedicalConsumablesAndDisposables",
        then: Yup.string(),
      })
      .nullable(),
    layerCount: Yup.string()
      .when("category", {
        is: "MedicalConsumablesAndDisposables",
        then: Yup.string(),
      })
      .nullable(),
    filtrationType: Yup.array()
      .when("category", {
        is: "MedicalConsumablesAndDisposables",
        then: Yup.array(),
      })
      .nullable(),
    // Add the other fields under LaboratorySupplies
    // magnificationRange: Yup.string()
    //   .when("category", {
    //     is: "LaboratorySupplies",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // objectiveLenses: Yup.string()
    //   .when("category", {
    //     is: "LaboratorySupplies",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // powerSource: Yup.string()
    //   .when("category", {
    //     is: "LaboratorySupplies",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // resolution: Yup.string()
    //   .when("category", {
    //     is: "LaboratorySupplies",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // connectivity: Yup.string()
    //   .when("category", {
    //     is: "LaboratorySupplies",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // casNumber: Yup.string()
    //   .when("category", {
    //     is: "LaboratorySupplies",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // grade: Yup.string()
    //   .when("category", {
    //     is: "LaboratorySupplies",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // physicalState: Yup.array()
    //   .when("category", {
    //     is: "LaboratorySupplies",
    //     then: Yup.array(),
    //   })
    //   .nullable(),
    // hazardClassification: Yup.array()
    //   .when("category", {
    //     is: "LaboratorySupplies",
    //     then: Yup.array(),
    //   })
    //   .nullable(),
    // Add the other fields under DiagnosticAndMonitoringDevices
    // measurementRange: Yup.string()
    //   .when("category", {
    //     is: "DiagnosticAndMonitoringDevices",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // noiseLevel: Yup.string()
    //   .when("category", {
    //     is: "DiagnosticAndMonitoringDevices",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // Add the other fields under HospitalAndClinicSupplies
    // Add the other fields under OrthopedicSupplies
    moistureResistance: Yup.string()
      .when("category", {
        is: "OrthopedicSupplies",
        then: Yup.string().oneOf(["Yes", "No"], "Invalid Moisture Resistance"),
      })
      .nullable(),
    // Add the other fields under DentalProducts
    // Add the other fields under EyeCareSupplies
    // lensPower: Yup.string()
    //   .when("category", {
    //     is: "EyeCareSupplies",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // baseCurve: Yup.string()
    //   .when("category", {
    //     is: "EyeCareSupplies",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // diameter: Yup.string()
    //   .when("category", {
    //     is: "EyeCareSupplies",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    frame: Yup.string()
      .when("category", {
        is: "EyeCareSupplies",
        then: Yup.string().oneOf(
          ["Metal", "Plastic", "Rimless"],
          "Invalid Frame"
        ),
      })
      .nullable(),
    lens: Yup.string()
      .when("category", {
        is: "EyeCareSupplies",
        then: Yup.string().oneOf(
          ["Single Vision", "Bifocal", "Progressive", "Anti-Reflective"],
          "Invalid Lens"
        ),
      })
      .nullable(),
    lensMaterial: Yup.string()
      .when("category", {
        is: "EyeCareSupplies",
        then: Yup.string().oneOf(
          ["Polycarbonate", "Glass", "Trivex"],
          "Invalid Lens Material"
        ),
      })
      .nullable(),
    // Add the other fields under HomeHealthcareProducts
    // maxWeightCapacity: Yup.string()
    //   .when("category", {
    //     is: "HomeHealthcareProducts",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // gripType: Yup.string()
    //   .when("category", {
    //     is: "HomeHealthcareProducts",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // lockingMechanism: Yup.string()
    //   .when("category", {
    //     is: "HomeHealthcareProducts",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // typeOfSupport: Yup.string()
    //   .when("category", {
    //     is: "HomeHealthcareProducts",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // batteryType: Yup.string()
    //   .when("category", {
    //     is: "HomeHealthcareProducts",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // batterySize: Yup.string()
    //   .when("category", {
    //     is: "HomeHealthcareProducts",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    // // Add the other fields under AlternativeMedicines
    // healthClaims: Yup.string()
    //   .when("category", {
    //     is: "AlternativeMedicines",
    //     then: Yup.string(),
    //   })
    //   .nullable(),
    healthClaimsFile: Yup.array()
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
  const handleInputChange = (e, setFieldValue, textLimit = 15, allowedType = 'all', restrictSpecialForFields = [], allowedSpecialChars = "") => {
      // const { value, name } = e.target;
      // const valueToUpdate = value.slice(0, Number(textLimit));
      // setFieldValue(name, valueToUpdate);

      let { value, name } = e.target;

    // Apply character limit
    value = value.slice(0, Number(textLimit));

    // Restrict input type
    if (allowedType === "number") {
      value = value.replace(/[^0-9]/g, ""); // Allow only numbers
    } else if (allowedType === "text") {
      value = value.replace(/[^a-zA-Z\s]/g, ""); // Allow only text and spaces
    } else if (allowedType === "all" && restrictSpecialForFields.includes(name)) {
      // value = value.replace(/[^a-zA-Z0-9\s]/g, ""); // Allow only letters, numbers, and spaces (No special characters)

      const allowedPattern = new RegExp(`[^a-zA-Z0-9\\s${allowedSpecialChars}]`, "g");
    value = value.replace(allowedPattern, "");
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

  return (
    <div className={styles.container}>
      <div className={styles.headContainer}>
        <span className={styles.heading}>Products</span>
        <button onClick={() => setOpen(true)} className={styles.bulkButton}>
          Bulk Upload
        </button>
      </div>
      <Formik
        initialValues={{
          name: "",
          description: "",
          manufacturer: "",
          aboutManufacturer: "",
          countryOfOrigin: "",
          upc: "",
          model: "",
          image: [],
          brand: "",
          form: "",
          quantity: "",
          volumn: "",
          weight: "",
          unit: "",
          packageType: "",
          packageMaterial: "",
          packageMaterialIfOther: "",
          costPerProduct: "",
          sku: "",
          stock: "",
          stockQuantity: "",
          countries: [],
          date: "",
          complianceFile: [],
          storage: "",
          other: "",
          guidelinesFile: [],
          warranty: "",
          safetyDatasheet: [],
          healthHazardRating: [],
          environmentalImpact: [],
          category: "",
          // supplier_id: "",
          // market related fields (new/secondary)
          market: "",
          purchasedOn: "",
          countryAvailable: [],
          purchaseInvoiceFile: [],
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
          specification: "",
          specificationFile: [],
          diagnosticFunctions: "",
          performanceTestingReport: "",
          performanceTestingReportFile: [],
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
          // Add the other fields under MedicalEquipmentAndDevices
          laserType: "",
          coolingSystem: "",
          spotSize: "",
          // Add the other fields under Pharmaceuticals
          // Add the other fields under SkinHairCosmeticSupplies
          spf: "",
          dermatologistTested: "",
          dermatologistTestedFile: [],
          pediatricianRecommended: "",
          pediatricianRecommendedFile: [],
          moisturizers: "",
          fillerType: "",
          // Add the other fields under VitalHealthAndWellness
          // Add the other fields under MedicalConsumablesAndDisposables
          filtrationEfficiency: "",
          layerCount: "",
          filtrationType: [],
          // Add the other fields under LaboratorySupplies
          magnificationRange: "",
          objectiveLenses: "",
          powerSource: "",
          resolution: "",
          connectivity: "",
          casNumber: "",
          grade: "",
          physicalState: [],
          hazardClassification: [],
          // Add the other fields under DiagnosticAndMonitoringDevices
          measurementRange: "",
          noiseLevel: "",
          // Add the other fields under HospitalAndClinicSupplies
          // Add the other fields under OrthopedicSupplies
          moistureResistance: "",
          // Add the other fields under DentalProducts
          // Add the other fields under EyeCareSupplies
          lensPower: "",
          baseCurve: "",
          diameter: "",
          frame: "",
          lens: "",
          lensMaterial: "",
          // Add the other fields under HomeHealthcareProducts
          maxWeightCapacity: "",
          gripType: "",
          lockingMechanism: "",
          typeOfSupport: "",
          batteryType: "",
          batterySize: "",
          // Add the other fields under AlternativeMedicines
          healthClaims: "",
          healthClaimsFile: [],
          // Add the other fields under EmergencyAndFirstAidSupplies
          productLongevity: "",
          flavorOptions: "",
          aminoAcidProfile: "",
          fatContent: "",
          dairyFree: "",
          // Add the other fields under HealthcareITSolutions
          license: "",
          scalabilityInfo: "",
          addOns: "",
          userAccess: "",
          keyFeatures: "",
          coreFunctionalities: "",
        }}
        validationSchema={productValidationSchema}
        validateOnBlur={true}
        // validateOnChange={false} // Only validate when user submits
        onSubmit={(values) => {
          // Custom submit handler with e.preventDefault()
          console.log("Form submitted with values:", values);
          // Your custom submit logic here
          // Create a new FormData object
          const formData = new FormData();

          // Append fields as usual
          Object.keys(values).forEach((key) => {
            const value = values[key];
            if (key != "productPricingDetails" || key != "stockedInDetails") {
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
          formData.append("supplier_id", sessionStorage.getItem("_id"));

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
              quantity: section?.quantity || "",
              deliveryTime: section?.deliveryTime || "",
            }))
          );

          formData.append("stockedInDetails", stockedInDetailsUpdated);
          formData.append(
            "productPricingDetails",
            productPricingDetailsUpdated
          );

          dispatch(addProduct(formData));
          // setSubmitting(false); // Important to reset form submission state
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          touched,
          errors,
          useFormikContext,
        }) => (
          <Form className={styles.form}>
            {console.log("errors", errors)}
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
                    // onChange={handleChange}
                    onChange={(e) => handleInputChange(e, setFieldValue, 100, 'all' ,["name"], "&")}
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
                      // setFieldValue(
                      //   "category",
                      //   categoryArrays?.find(
                      //     (cat) => cat?.name === selectedOption?.label
                      //   )?.schema || null
                      // );
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
                    // onChange={setSelectedLevel3Category}
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
                        // value={values.countryAvailable} // Bind Formik's state
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 4, 'number')}
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
                    // onChange={handleChange}
                    onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['upc'], '-')}
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
                    placeholder="Enter Dossier Status"
                    // autoComplete="off"
                    name="model"
                    value={values.model}
                    // onChange={handleChange}
                    onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                    onBlur={handleBlur}
                  />
                  {touched.model && errors.model && (
                    <span className={styles.error}>{errors.model}</span>
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
                    // onChange={handleChange}
                    onChange={(e) => handleInputChange(e, setFieldValue, 50, 'text')}
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
                      // onChange={handleChange}
                      onChange={(e) => handleInputChange(e, setFieldValue, 25, 'text')}
                      onBlur={handleBlur}
                    />
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="product-type"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip className={styles.tooltipSec} id="product-type">
                      The type of product (e.g., tablet, liquid, cream,
                      ointment, Surgical, Needle Type, Syringe, Type of monitor,
                      <br /> systems, devices, mobility or platforms,
                      wheelchair, walker, cane, crutches, grab bar, scooter
                      etc).
                    </Tooltip>
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
                      // onChange={handleChange}
                      onChange={(e) => handleInputChange(e, setFieldValue, 8, 'number')}
                      onBlur={handleBlur}
                    />
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="sku-tooltip"
                      data-tooltip-content="Add number of tablets in a strip, bottle, or box or number of bottles in a pack"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                  </div>
                  {touched.quantity && errors.quantity && (
                    <span className={styles.error}>{errors.quantity}</span>
                  )}
                </div>

                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Size/Volumn
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Size/Volume"
                      // autoComplete="off"
                      name="volumn"
                      value={values.volumn}
                      // onChange={handleChange}
                      onChange={(e) => handleInputChange(e, setFieldValue, 9, 'all', ['volumn'])}
                      onBlur={handleBlur}
                    />
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="product-volumn"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip className={styles.tooltipSec} id="product-volumn">
                      The size or volume of the product (e.g., 50 mL, 100 g,
                      drip chamber ) (e.g., macro, micro),
                      <br /> Length of the needle (e.g., 19 mm, 26 mm ) tape
                      width, adhesive strip size etc.
                    </Tooltip>
                  </div>
                  {touched.volumn && errors.volumn && (
                    <span className={styles.error}>{errors.volumn}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Weight<span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Product Weight"
                      // autoComplete="off"
                      name="weight"
                      value={values.weight}
                      // onChange={handleChange}
                      onChange={(e) => handleInputChange(e, setFieldValue, 5, 'all', ['weight'])}
                      onBlur={handleBlur}
                    />
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="sku-tooltip"
                      data-tooltip-content="in (g, kg, lbs, l, ml, oz, gal, t)"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                  </div>
                  {touched.weight && errors.weight && (
                    <span className={styles.error}>{errors.weight}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Units<span className={styles.labelStamp}>*</span>
                  </label>
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
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Packaging Type
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <Select
                      className={styles.formSelect}
                      options={packagingOptions}
                      name={values.packageType}
                      onBlur={handleBlur}
                      onChange={(selectedOption) => {
                        setFieldValue("packageType", selectedOption?.value);
                      }}
                      placeholder="Select Product Packaging Type"
                    />
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="packaging-type"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip className={styles.tooltipSec} id="packaging-type">
                      The type of product packaging (e.g., bottle, tube, jar,
                      pump, blister
                      <br /> pack, strip, pouches, soft case, hard case,
                      backpack, case ).
                    </Tooltip>
                  </div>
                  {touched.packageType && errors.packageType && (
                    <span className={styles.error}>{errors.packageType}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Product Packaging Material
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <Select
                      className={styles.formSelect}
                      options={materialOptions}
                      placeholder="Select Product Packaging Material"
                      value={
                        materialOptions.find(
                          (option) => option.value === values.packageMaterial
                        ) || null
                      } // Bind selected option to Formik value
                      name="packageMaterial"
                      onBlur={handleBlur}
                      onChange={(option) => {
                        setSelectedOption(option);
                        setFieldValue("packageMaterial", option.value); // Update Formik value with selected option
                        if (option.value !== "Other") {
                          setFieldValue("otherMaterial", ""); // Reset other material if option is not "other"
                        }
                      }}
                    />
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="sku-tooltip"
                      data-tooltip-content="The material used for packaging (e.g., plastic, glass, aluminum, cardboard, thermocol etc)"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                  </div>

                  {/* Show text field when "Other" is selected */}
                  {selectedOption?.value === "Other" && (
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Enter Packaging Material"
                      name="packageMaterialIfOther"
                      value={otherMaterial}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        setOtherMaterial(e.target.value);
                        setFieldValue("packageMaterialIfOther", e.target.value);
                      }}
                    />
                  )}

                  {/* Display error message if any */}
                  {touched.packageMaterial && errors.packageMaterial && (
                    <span className={styles.error}>
                      {errors.packageMaterial}
                    </span>
                  )}
                  {touched.packageMaterialIfOther &&
                    errors.packageMaterialIfOther && (
                      <span className={styles.error}>
                        {errors.packageMaterialIfOther}
                      </span>
                    )}
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
                    value={values.manufacturer}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue("manufacturer", e.target.value);
                    }}
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
                    // value={values.countryOfOrigin}
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
                  <label className={styles.formLabel}>
                    About Manufacturer
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <textarea
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter About Manufacturer"
                    value={values.aboutManufacturer}
                    name="aboutManufacturer"
                    onBlur={handleBlur}
                    // onChange={handleChange}
                    onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                  />
                  {touched.aboutManufacturer && errors.aboutManufacturer && (
                    <span className={styles.error}>
                      {errors.aboutManufacturer}
                    </span>
                  )}
                </div>
                <div className={styles.descriptionContainer}>
                  <label className={styles.formLabel}>
                    Product Description
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <JoditEditor
                    ref={editor}
                    value={values.description}
                    name="description"
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => {
                      setContent(newContent);
                      setFieldValue("description", newContent);
                    }}
                    onChange={(newContent) => {
                      setContent(newContent);
                      setFieldValue("description", newContent);
                    }}
                  />
                  {touched.description && errors.description && (
                    <span className={styles.error}>{errors.description}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Start the Inventory & Packaging */}
            <div className={styles.section}>
              <span className={styles.formHead}>Inventory & Packaging</span>
              <div className={styles.formSection}>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    SKU<span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter SKU"
                      // autoComplete="off"
                      name="sku"
                      value={values.sku}
                      // onChange={handleChange}
                      onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['sku'], '-')}
                      onBlur={handleBlur}
                    />
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="sku-tooltip"
                      data-tooltip-content="Stock-keeping unit for inventory management"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                  </div>
                  {touched.sku && errors.sku && (
                    <span className={styles.error}>{errors.sku}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Date of Manufacture
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    {/* <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Date of Manufacture"
                      // autoComplete="off"
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    /> */}

                    <InputMask
                      className={styles.formInput}
                      type="text"
                      mask="dd-mm-yyyy"
                      placeholder="Enter Date of Manufacture"
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      replacement={{ d: /\d/, m: /\d/, y: /\d/ }}
                      showMask
                      separate
                    />
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="sku-tooltip"
                      data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                  </div>
                  {touched.date && errors.date && (
                    <span className={styles.error}>{errors.date}</span>
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
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="sku-tooltip"
                      data-tooltip-content="If the product is in stock or out of stock or On-demand"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                  </div>
                  {touched.stock && errors.stock && (
                    <span className={styles.error}>{errors.stock}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Stocked in Country
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <MultiSelectDropdown
                    options={countries}
                    placeholderButtonLabel="Select Countries"
                    name="countries"
                    // value={values.countryAvailable} // Bind Formik's state
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
                            type: "Box",
                            placeholder: "Enter Box Quantity",
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

              <div className={styles.formStockContainer}>
                <div className={styles.formHeadSection}>
                  <span className={styles.formHead}>Stocked In Details</span>
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
                          type: "Box",
                          placeholder: "Enter Box Quantity",
                        },
                      ])
                    }
                  >
                    Add More
                  </span>
                </div>
                {values?.stockedInDetails?.map((stock, index) => (
                  <>
                    <div key={index} className={styles.formSection}>
                      <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                          Countries where Stock Trades
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <Select
                          className={styles.formSelect}
                          options={inventoryStockedCountries}
                          placeholder="Select Countries where Stock Trades"
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
                        />
                      </div>

                      <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                          Stock Quantity
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.productQuantityContainer}>
                          <div className={styles.quantitySection}>
                            <Field
                              name={`stockedInDetails.${index}.quantity`}
                              className={styles.quantityInput}
                              placeholder={stock.placeholder}
                              // autoComplete="off"
                              type="number"
                            />
                            <button
                              type="button"
                              className={`${styles.quantityButton} ${styles.selected}`}
                            >
                              {stock.type}
                            </button>
                          </div>

                          <div className={styles.radioForm}>
                            {["Box", "Strip", "Pack"].map((type) => (
                              <label key={type}>
                                <Field
                                  type="radio"
                                  name={`stockedInDetails.${index}.type`}
                                  value={type}
                                  checked={stock.type === type}
                                  onChange={() => {
                                    const updatedList = [
                                      ...values.stockedInDetails,
                                    ];
                                    updatedList[index].type = type;
                                    updatedList[
                                      index
                                    ].placeholder = `Enter ${type} Quantity`;
                                    setFieldValue(
                                      "stockedInDetails",
                                      updatedList
                                    );
                                  }}
                                />
                                <span className={styles.radioText}>{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {values?.stockedInDetails?.length > 1 && (
                        <div
                          className={styles.formCloseSection}
                          onClick={() => {
                            const updatedList = values.stockedInDetails.filter(
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
                    {/* ///////// */}
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
            </div>

            {/* End the Inventory & Packaging */}

            {/* Start the product Inventory */}
            <div className={styles.section}>
              <div className={styles.formHeadSection}>
                <span className={styles.formHead}>Product Inventory</span>
                <span
                  className={styles.formAddButton}
                  onClick={() => {
                    setFieldValue("productPricingDetails", [
                      ...values.productPricingDetails,
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
              {values?.productPricingDetails?.map((stock, index) => (
                <div key={`product_${index}`} className={styles.formSection}>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Quantity<span className={styles.labelStamp}>*</span>
                    </label>
                    <Field name={`productPricingDetails.${index}.quantity`}>
                      {({ field }) => (
                        <Select
                          {...field}
                          className={styles.formSelect}
                          options={quantityOptions}
                          placeholder="Select Quantity"
                          value={quantityOptions.find(
                            (option) => option.value === stock.quantity
                          )}
                          onBlur={handleBlur}
                          onChange={(option) =>
                            setFieldValue(
                              `productPricingDetails.${index}.quantity`,
                              option.value
                            )
                          }
                        />
                      )}
                    </Field>
                    <span className={styles.error}>
                      {touched.productPricingDetails?.[index]?.quantity &&
                        errors.productPricingDetails?.[index]?.quantity}
                    </span>
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
                        placeholder="Enter Cost Per Product"
                        className={styles.formInput}
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
                      <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
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
                      placeholder="Enter Est. Delivery Time"
                      className={styles.formInput}
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
                        // Clear form values before removing the row
                        setFieldValue(
                          `productPricingDetails.${index}.quantity`,
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

            {/* End the product inventory */}

             {/* Start the Compliances and certificate */}
             <div className={styles.documentContainer}>
              <div className={styles.sectionCompliances}>
                <span className={styles.formHead}>Upload Documents</span>
                <div className={styles.formInnerSection}>
                <AddProductFileUpload
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
                 {productType === "secondary product" && (
                    <AddProductFileUpload
                      fieldInputName={"purchaseInvoiceFile"}
                      setFieldValue={setFieldValue}
                      initialValues={values}
                      label="Purchase Invoice"
                      tooltip={false}
                      acceptTypes={{
                        "application/pdf": [],
                      }}
                      maxFiles={1} // Limit to one file
                    />
                  )}
                  {productType === "secondary product" &&
                    touched.purchaseInvoiceFile &&
                    errors.purchaseInvoiceFile && (
                      <span className={styles.error}>
                        {errors.purchaseInvoiceFile}
                      </span>
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
                      type="text"
                      placeholder="Enter Storage Conditions"
                      // autoComplete="off"
                      name="storage"
                      // onChange={handleChange}
                      onChange={(e) => handleInputChange(e, setFieldValue, 30, 'all')}
                      onBlur={handleBlur}
                    />
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="sku-tooltip"
                      data-tooltip-content="Recommended storage (e.g., store in a cool, dry place)"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip className={styles.tooltipSec} id="sku-tooltip" />
                  </div>
                </div>
              </div>
              <div className={styles.sectionCompliances}>
                <span className={styles.formHead}>
                  Compliances & Certification
                </span>
                <AddProductFileUpload
                  fieldInputName={"complianceFile"}
                  setFieldValue={setFieldValue}
                  initialValues={values}
                  label="Regulatory Compliance"
                  // fileUpload={regulatoryCompliance}
                  tooltip={
                    "Compliance with industry standards for healthcare-related tools (e.g. HIPAA, GMP, WDA, ASTM,  \n" +
                    "FDA, CE, ISO, WHO etc) HIPAA applies to healthcare-related tools, while MHRA governs GMP in \n" +
                    " the UK. The European Medicines Agency (EMA) governs GMP in Europe."
                  }
                />
                {touched.complianceFile && errors.complianceFile && (
                  <span className={styles.error}>{errors.complianceFile}</span>
                )}
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
                        placeholder="Enter Interoperability"
                        // autoComplete="off"
                        name="interoperability"
                        value={values.interoperability}
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                        onBlur={handleBlur}
                      />
                      <span
                        className={styles.infoTooltip}
                        data-tooltip-id="medical-tooltip"
                        data-tooltip-content="Adheres to HL7/FHIR standards for healthcare data exchange."
                      >
                        <img
                          src={Information}
                          className={styles.iconTooltip}
                          alt="information"
                        />
                      </span>
                      <Tooltip
                        className={styles.tooltipSec}
                        id="medical-tooltip"
                      />
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                        onBlur={handleBlur}
                      />
                      <span
                        className={styles.infoTooltip}
                        data-tooltip-id="medical-tooltip"
                        data-tooltip-content="Type of laser (e.g., CO2, diode, Nd:YAG, Er:YAG)"
                      >
                        <img
                          src={Information}
                          className={styles.iconTooltip}
                          alt="information"
                        />
                      </span>
                      <Tooltip
                        className={styles.tooltipSec}
                        id="medical-tooltip"
                      />
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                        onBlur={handleBlur}
                      />
                      <span
                        className={styles.infoTooltip}
                        data-tooltip-id="medical-tooltip"
                        data-tooltip-content="Type of cooling used (e.g., air, contact, cryogenic cooling)."
                      >
                        <img
                          src={Information}
                          className={styles.iconTooltip}
                          alt="information"
                        />
                      </span>
                      <Tooltip
                        className={styles.tooltipSec}
                        id="medical-tooltip"
                      />
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 4, 'number')}
                        onBlur={handleBlur}
                      />
                      <span
                        className={styles.infoTooltip}
                        data-tooltip-id="medical-tooltip"
                        data-tooltip-content="Diameter of the laser spot on the skin (in mm or cm)"
                      >
                        <img
                          src={Information}
                          className={styles.iconTooltip}
                          alt="information"
                        />
                      </span>
                      <Tooltip
                        className={styles.tooltipSec}
                        id="medical-tooltip"
                      />
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                        onBlur={handleBlur}
                      />
                      <span
                        className={styles.infoTooltip}
                        data-tooltip-id="medical-tooltip"
                        data-tooltip-content="Specific diagnostic tests or functions that the tool performs"
                      >
                        <img
                          src={Information}
                          className={styles.iconTooltip}
                          alt="information"
                        />
                      </span>
                      <Tooltip
                        className={styles.tooltipSec}
                        id="medical-tooltip"
                      />
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                        onBlur={handleBlur}
                      />
                      <span
                        className={styles.infoTooltip}
                        data-tooltip-id="testing-tooltip"
                      >
                        <img
                          src={Information}
                          className={styles.iconTooltip}
                          alt="information"
                        />
                      </span>
                      <Tooltip
                        className={styles.tooltipSec}
                        id="testing-tooltip"
                      >
                        Results from any internal or external product testing
                        (e.g., nebulizer <br /> output, CPAP pressure and
                        airflow testing).
                      </Tooltip>
                    </div>
                    <AddProductFileUpload
                      fieldInputName={"performanceTestingReportFile"}
                      setFieldValue={setFieldValue}
                      initialValues={values}
                      label=""
                      // fileUpload={performanceUpload}
                      tooltip={false}
                      showLabel={false}
                    />
                   {touched.performanceTestingReportFile && errors.performanceTestingReportFile && (
                  <span className={styles.error}>{errors.performanceTestingReportFile}</span>
                )}
                  </div>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>Specification</label>
                    <div className={styles.tooltipContainer}>
                      <textarea
                        className={styles.formInput}
                        placeholder="Enter Specification"
                        rows="2"
                        name="specification"
                        value={values.specification}
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                        onBlur={handleBlur}
                      />
                      <span
                        className={styles.infoTooltip}
                        data-tooltip-id="medical-tooltip"
                        data-tooltip-content="Technical Specification of the tool  (e.g., hardware, software, network diagnostics, etc.)"
                      >
                        <img
                          src={Information}
                          className={styles.iconTooltip}
                          alt="information"
                        />
                      </span>
                      <Tooltip
                        className={styles.tooltipSec}
                        id="medical-tooltip"
                      />
                    </div>
                    <AddProductFileUpload
                      fieldInputName={"specificationFile"}
                      setFieldValue={setFieldValue}
                      initialValues={values}
                      label=""
                      // fileUpload={specificationUpload}
                      tooltip={false}
                      showLabel={false}
                    />
                    {touched.specificationFile && errors.specificationFile && (
                  <span className={styles.error}>{errors.specificationFile}</span>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="pharma-tooltip"
                          data-tooltip-content="The generic name of the medication (e.g., Paracetamol, Metformin, Ibuprofene)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="pharma-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 25, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="pharma-tooltip"
                          data-tooltip-content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="pharma-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 10, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="strength-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="strength-tooltip"
                        >
                          The strength or concentration of the medication (e.g.,{" "}
                          <br /> 500 mg, 10 mg/mL,Standard or high-strength).
                        </Tooltip>
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="classification-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="classification-tooltip"
                        >
                          Classification of the OTC drug by health authorities
                          (e.g., <br /> approved for general public use,
                          behind-the-counter).
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 100, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="pharma-tooltip"
                          data-tooltip-content="Description of the active ingredients and components of the vaccine."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="pharma-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="pharma-tooltip"
                          data-tooltip-content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="pharma-tooltip"
                        />
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
                          value={values.purpose}
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="purpose-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="purpose-tooltip"
                        >
                          Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain relief,{" "}
                          <br /> Prevention of infection.,Cooling and
                          soothing.,Moisturizing and healing, procedure or use
                          case of
                          <br /> tool, Relieves symptoms, promotes healing, or
                          prevents recurrence.)
                        </Tooltip>
                      </div>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="administration-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="administration-tooltip"
                        >
                          Drugs can be introduced into the body by many routes,
                          such as enteric (oral, peroral, rectal), <br />{" "}
                          parenteral (intravascular, intramuscular,
                          subcutaneous, and inhalation
                          <br /> administration) or topical (skin and mucosal
                          membranes)
                        </Tooltip>
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="controlled-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="controlled-tooltip"
                        >
                          Whether the drug is a controlled substance (e.g., some
                          OTC drugs are restricted,
                          <br /> some are only available behind the counter or
                          on prescription).
                        </Tooltip>
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="pharma-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="pharma-tooltip"
                          />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="warning-tooltip"
                              data-tooltip-content=""
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="warning-tooltip"
                            >
                              Common side effects associated with the
                              medication. Known
                              <br /> interactions with other drugs or food (eg.
                              Alcohol)
                            </Tooltip>
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
                              value={values.allergens}
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="pharma-tooltip"
                              data-tooltip-content="Common allergens in the product (e.g., parabens, sulfates, gluten etc)."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="pharma-tooltip"
                            />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 10, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="If the product is a sunscreen, the SPF (Sun Protection Factor) rating"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-strength-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-strength-tooltip"
                        >
                          The strength or concentration of the medication (e.g.,{" "}
                          <br /> 500 mg, 10 mg/mL,Standard or high-strength).
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="Stretch for tapes"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="Adhesive or non-adhesive."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 5, 'numer')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="The thickness of the Item (e.g., in mil or gauge)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-otc-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-otc-tooltip"
                        >
                          Classification of the OTC drug by health authorities
                          (e.g., <br /> approved for general public use,
                          behind-the-counter).
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="Whether the product contains fragrance or is fragrance-free."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="Description of the active ingredients and components of the vaccine."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="The hair, scalp or skin condition the product is formulated to address "
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="route-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="route-tooltip"
                        >
                          Drugs can be introduced into the body by many routes,
                          such as enteric (oral, peroral,
                          <br /> rectal), parenteral (intravascular,
                          intramuscular, subcutaneous, and inhalation
                          <br /> administration) or topical (skin and mucosal
                          membranes)
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="consentration-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="consentration-tooltip"
                        >
                          Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are <br /> typically
                          70-90% concentration for optimal antimicrobial
                          efficacy.
                          <br /> Oxygen concentration level provided by the
                          device (e.g., 95%)
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="such as aloe vera, glycerin, or Vitamin E to reduce skin irritation from frequent use"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="Hyaluronic acid, Calcium hydroxyapatite"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="Description of the active and/or inactive ingredients and components"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="skin-tooltip"
                          data-tooltip-content="Whether the product is tested on animals or is cruelty-free"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="skin-tooltip"
                        />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="substance-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="substance-tooltip"
                        >
                          Whether the drug is a controlled substance (e.g., some
                          OTC drugs are restricted,
                          <br /> some are only available behind the counter or
                          on prescription).
                        </Tooltip>
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
                              value={values.dermatologistTested}
                              onChange={(selectedOption) => {
                                setFieldValue(
                                  "dermatologistTested",
                                  selectedOption?.value
                                );
                                setDermatologistTested(selectedOption.value);
                              }}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="skin-tooltip"
                              data-tooltip-content="Whether the product has been dermatologist-tested for sensitivity."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="skin-tooltip"
                            />
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
                              value={values.pediatricianRecommended}
                              onChange={(selectedOption) => {
                                setFieldValue(
                                  "pediatricianRecommended",
                                  selectedOption?.value
                                );
                                setPediatricianRecommended(
                                  selectedOption.value
                                );
                              }}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="pediatrician-tooltip"
                              data-tooltip-content="Whether the product has been recommended or endorsed by pediatricians."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="pediatrician-tooltip"
                            />
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
                                fieldInputName={"pediatricianRecommendedFile"}
                                setFieldValue={setFieldValue}
                                initialValues={values}
                                label=""
                                // fileUpload={pediatricianUpload}
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="effects-tooltip"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="effects-tooltip"
                            >
                              Common side effects associated with the
                              medication. Known interactions <br /> with other
                              drugs or food (eg. Alcohol)
                            </Tooltip>
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="skin-tooltip"
                              data-tooltip-content="Common allergens in the product (e.g., parabens, sulfates, gluten etc)."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="skin-tooltip"
                            />
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="skin-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="skin-tooltip"
                          />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="The generic name of the medication (e.g., Paracetamol, Metformin, Ibuprofene)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-strength-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-strength-tooltip"
                        >
                          The strength or concentration of the medication (e.g.,
                          500 mg, 10 <br /> mg/mL,Standard or high-strength).
                        </Tooltip>
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-OTC-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-OTC-tooltip"
                        >
                          Classification of the OTC drug by health authorities
                          (e.g., <br /> approved for general public use,
                          behind-the-counter).
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Info about the health benefits (e.g., “Boosts immunity”, “Supports joint health”)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 500, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Description of the active ingredients and components of the vaccine."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-purpose-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-purpose-tooltip"
                        >
                          Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain relief,{" "}
                          <br />
                          Prevention of infection.,Cooling and
                          soothing.,Moisturizing and healing, procedure
                          <br /> or use case of tool, Relieves symptoms,
                          promotes healing, or prevents recurrence.)
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-drugs-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-drugs-tooltip"
                        >
                          Drugs can be introduced into the body by many routes,
                          such as enteric (oral, peroral, rectal), parenteral
                          (intravascular, intramuscular, <br /> subcutaneous,
                          and inhalation administration) or topical (skin and
                          mucosal membranes)
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="The class of the drug (e.g., analgesic, antibiotic, antihypertensive)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-sweeteners-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-sweeteners-tooltip"
                        >
                          Some proteins contain artificial sweeteners (e.g.,
                          sucralose, aspartame),
                          <br /> while others use natural sweeteners (e.g.,
                          stevia, monk fruit).
                        </Tooltip>
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
                            onBlur={handleBlur}
                            name="controlledSubstance"
                            checked={values.controlledSubstance || false}
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-substances-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-substances-tooltip"
                        >
                          Whether the drug is a controlled substance (e.g., some
                          OTC drugs are <br /> restricted, some are only
                          available behind the counter or on prescription).
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Description of the active and/or inactive ingredients and components"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Whether the product is tested on animals or is cruelty-free"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="wellness-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="wellness-tooltip"
                          />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 500, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="side-effects-tooltip"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="side-effects-tooltip"
                            >
                              Common side effects associated with the
                              medication. Known <br /> interactions with other
                              drugs or food (eg. Alcohol)
                            </Tooltip>
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Common allergens in the product (e.g., parabens, sulfates, gluten etc)."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 5, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="The thickness of the Item (e.g., in mil or gauge)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 25, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Material used (e.g., Latex, Nitrile, Vinyl, Rubber, stainless steel, titanium etc.)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
                      </div>
                      <span className={styles.error}></span>
                    </div>
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Filtration Type
                      </label>
                      <div className={styles.tooltipContainer}>
                        <Chips
                          value={value.filtrationType}
                          name="filtrationType"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setValue(e.value);
                            setFieldValue("filtrationType", e.value);
                          }}
                          placeholder={
                            value.length === 0 ? "Press enter to add label" : ""
                          }
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="filtration-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="filtration-tooltip"
                        >
                          Type of Filteration (e.g., PFE (Particle Filtration
                          Efficiency), <br /> BFE (Bacterial Filtration
                          Efficiency), Viral Filtration Efficiency etc)
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Any specific chemical resistance features"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Shape of the needle (e.g., 1/2 circle, 3/8 circle)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Type of coating (e.g., antimicrobial, silicone)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Whether the gloves are powdered or powder-free."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Whether the item have texture or smooth"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="wellness-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="wellness-tooltip"
                          />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Common allergens in the product (e.g., parabens, sulfates, gluten, milk, Latex etc)."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Whether the item is sterilized or non-sterile."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 4, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Percentage of particles the mask filters (e.g., 95%, 99%, etc.)"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Breathability rating (e.g., air flow resistance, Inhalation/Exhalation rate)"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Number of layers (e.g., 3-ply, 4-ply, 5-ply)."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Resistance to fluid penetration (e.g., for surgical masks)"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                          value={values.physicalState}
                          placeholder={
                            value.length === 0 ? "Press enter to add label" : ""
                          }
                          name="physicalState"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setValue(e.value);
                            setFieldValue("physicalState", e.value);
                          }}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Physical state (e.g., solid, liquid, gas)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
                      </div>
                      <span className={styles.error}></span>
                    </div>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Hazard Classification
                      </label>
                      <div className={styles.tooltipContainer}>
                        <Chips
                          value={values.hazardClassification}
                          placeholder={
                            value.length === 0 ? "Press enter to add label" : ""
                          }
                          name="hazardClassification"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setValue(e.value);
                            setFieldValue("hazardClassification", e.value);
                          }}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Physical state (e.g., solid, liquid, gas)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          value={values.shape}
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Shape of the needle (e.g., 1/2 circle, 3/8 circle)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Type of coating (e.g., antimicrobial, silicone)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="diagnostic-purpose-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="diagnostic-purpose-tooltip"
                        >
                          Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain <br />{" "}
                          relief,Prevention of infection.,Cooling and
                          soothing.,Moisturizing and healing, procedure <br />{" "}
                          or use case of tool, Relieves symptoms, promotes
                          healing, or prevents recurrence.)
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Chemical Abstracts Service (CAS) number for unique identification."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Purity or grade (e.g., analytical grade, reagent grade)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="concen-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="concen-tooltip"
                        >
                          Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90%{" "}
                          <br />
                          concentration for optimal antimicrobial efficacy.
                          Oxygen concentration level provided by the device
                          (e.g., 95%)
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
                          placeholder="Enter Connectivity"
                          // autoComplete="off"
                          name="connectivity"
                          value={values.connectivity}
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Connectivity options (e.g., USB, Wi-Fi, HDMI)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Magnification capabilities (e.g., 40x to 1000x)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Number and types of objective lenses (e.g., 4x, 10x, 40x)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 500, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Power requirements (e.g., battery, AC adapter)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Maximum resolution the microscope can achieve."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Specific diagnostic tests or functions that the tool performs"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Adjustable flow rate range (e.g., 1-5 LPM, 1-10 LPM)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="concentrations"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="concentrations"
                        >
                          Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90%
                          concentration for optimal <br /> antimicrobial
                          efficacy. Oxygen concentration level provided by the
                          device (e.g., 95%)
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Blood pressure range the monitor can measure (e.g., 0-300 mmHg)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Operating noise level (e.g., 40 dB)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Technical Specification of the tool  (e.g., hardware, software, network diagnostics, etc.)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
                      </div>
                      {touched.specification && errors.specification && (
                        <span className={styles.error}>
                          {errors.specification}
                        </span>
                      )}
                      <AddProductFileUpload
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="performance-tooltips"
                          data-tooltip-content=""
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="performance-tooltips"
                        >
                          Results from any internal or external product testing
                          (e.g.,
                          <br /> nebulizer output, CPAP pressure and airflow
                          testing).
                        </Tooltip>
                      </div>
                      <AddProductFileUpload
                        fieldInputName={"performanceTestingReportFile"}
                        setFieldValue={setFieldValue}
                        initialValues={values}
                        label=""
                        // fileUpload={performanceUpload}
                        tooltip={false}
                        showLabel={false}
                      />
                      {touched.performanceTestingReportFile && errors.performanceTestingReportFile && (
                  <span className={styles.error}>{errors.performanceTestingReportFile}</span>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="The thickness of the Item (e.g., in mil or gauge)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Material used (e.g., Latex, Nitrile, Vinyl, Rubber, stainless steel, titanium etc.)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Any specific chemical resistance features"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Whether the gloves are powdered or powder-free."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Whether the item have texture or smooth"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="wellness-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="wellness-tooltip"
                          />
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
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Whether the item is sterilized or non-sterile."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Adhesive or non-adhesive."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Whether the suture is absorbable or non-absorbable."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Stretch for tapes"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Resistance to fluid penetration (e.g., for surgical masks)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="streng-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="streng-tooltip"
                        >
                          The strength or concentration of the medication (e.g.,{" "}
                          <br /> 500 mg, 10 mg/mL,Standard or high-strength).
                        </Tooltip>
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Whether the item is moisture resistance or not"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="The hair, scalp or skin condition the product is formulated to address "
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 100, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Type of coating (e.g., antimicrobial, silicone)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Whether the item is sterilized or non-sterile."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Stretch for tapes"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Whether the suture is absorbable or non-absorbable."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Breathability rating (e.g., air flow resistance, Inhalation/Exhalation rate)"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="color-options-tooltip"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="color-options-tooltip"
                            >
                              Available colors (e.g., black, beige, grey,
                              tortoiseshell, <br /> frame color or lense color
                              etc)
                            </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Material used (e.g., Latex, Nitrile, Vinyl, Rubber, stainless steel, titanium etc.)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Intended use type (e.g., oily, dry, curly, fine, thick, straight, medical, industrial etc)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="target-condition-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="target-condition-tooltip"
                        >
                          Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain
                          relief,Prevention <br />
                          of infection.,Cooling and soothing.,Moisturizing and
                          healing, procedure or use case of tool, Relieves
                          <br /> symptoms, promotes healing, or prevents
                          recurrence.)
                        </Tooltip>
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="wellness-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="wellness-tooltip"
                          />
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 4, 'all')}
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 5, 'all')}
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
                        // onChange={handleChange}
                        onChange={(e) => handleInputChange(e, setFieldValue, 100, 'all')}
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Available colors (e.g., black, beige, grey, tortoiseshell, frame color or lense color etc)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Adjustable flow rate range (e.g., 1-5 LPM, 1-10 LPM)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="concentra-tooltip"
                          data-tooltip-content=""
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="concentra-tooltip"
                        >
                          Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90%{" "}
                          <br />
                          concentration for optimal antimicrobial efficacy.
                          Oxygen concentration level
                          <br /> provided by the device (e.g., 95%)
                        </Tooltip>
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="wellness-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="wellness-tooltip"
                          />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="The maximum weight capacity that the mobility aid can support (e.g., 250 lbs for a walker)."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 20, 'text')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Type of grips or handles (e.g., ergonomic, foam, rubberized handles for better comfort)."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Type of Battery Installed to Operate the Item"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Size of Battery Installed to Operate the Item"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Available colors (e.g., black, beige, grey, tortoiseshell, frame color or lense color etc)"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 100, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Whether the product can be folded for easy storage (e.g., foldable walkers)."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Details on any locking mechanisms (e.g., locking wheels or adjustable legs on walkers)"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="type-support-tooltip"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="type-support-tooltip"
                            >
                              The type of support provided by the aid (e.g.,
                              two-legged,
                              <br /> four-legged walker, or wall-mounted grab
                              bar).
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
                              placeholder="Enter Performance Testing Report"
                              rows="2"
                              name="performanceTestingReport"
                              value={values.performanceTestingReport}
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="reports-tooltip"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="reports-tooltip"
                            >
                              Results from any internal or external product
                              testing (e.g.,
                              <br /> nebulizer output, CPAP pressure and airflow
                              testing).
                            </Tooltip>
                          </div>
                          <AddProductFileUpload
                            fieldInputName={"performanceTestingReportFile"}
                            setFieldValue={setFieldValue}
                            initialValues={values}
                            label=""
                            // fileUpload={performanceUpload}
                            tooltip={false}
                            showLabel={false}
                          />
                          {touched.performanceTestingReportFile && errors.performanceTestingReportFile && (
                  <span className={styles.error}>{errors.performanceTestingReportFile}</span>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Description of the active ingredients and components of the vaccine."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="identification-purpose-tooltip"
                          data-tooltip-content=""
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="identification-purpose-tooltip"
                        >
                          Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain
                          relief,Prevention of infection.,Cooling
                          <br /> and soothing.,Moisturizing and healing,
                          procedure or use case of tool, Relieves symptoms,
                          promotes healing, or prevents recurrence.)
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content=" Verified by clinical trials or regulatory agencies."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
                      </div>
                      <AddProductFileUpload
                        fieldInputName={"healthClaimsFile"}
                        setFieldValue={setFieldValue}
                        initialValues={values}
                        label=""
                        // fileUpload={healthCliamUpload}
                        tooltip={false}
                        showLabel={false}
                      />
                                      {touched.healthClaimsFile && errors.healthClaimsFile && (
                  <span className={styles.error}>{errors.healthClaimsFile}</span>
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="wellness-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="wellness-tooltip"
                          />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Description of the active ingredients and components of the vaccine."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Expected lifespan of the product (e.g., single-use vs. reusable items)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 100, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Whether the product can be folded for easy storage (e.g., foldable walkers)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="wellness-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="wellness-tooltip"
                          />
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
            {selectedSchema === "disinfectionAndHygieneSuppliesSchema" && (
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Description of the active ingredients and components of the vaccine."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="contra-tooltips"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="contra-tooltips"
                        >
                          Concentration if it’s a solution (e.g., 0.1 M, 5% w/v)
                          ,Alcohol-based disinfectants are typically 70-90%
                          concentration <br /> for optimal antimicrobial
                          efficacy. Oxygen concentration level provided by the
                          device (e.g., 95%)
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 100, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="The type of formulation (e.g., gel, cream, lotion, serum, mask, foam etc)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Whether the product contains fragrance or is fragrance-free."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="wellness-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="wellness-tooltip"
                          />
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Is the product dairy free?"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="flavour-option-tooltip"
                          data-tooltip-content=""
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="flavour-option-tooltip"
                        >
                          Protein powders often come in a wide variety of
                          flavors like <br />
                          chocolate, vanilla, strawberry, cookies & cream, etc.
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Full spectrum or specific amino acids like BCAAs (Branched-Chain Amino Acids)."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Varies based on type (e.g., whey isolate vs. concentrate)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Info about the health benefits (e.g., “Boosts immunity”, “Supports joint health”)"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="purpose-well-tooltips"
                          data-tooltip-content=""
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="purpose-well-tooltips"
                        >
                          Purpose (e.g., COVID-19 detection, blood glucose
                          monitoring, cholesterol level check,Pain
                          relief,Prevention of infection.,Cooling and soothing.,{" "}
                          <br />
                          Moisturizing and healing, procedure or use case of
                          tool, Relieves symptoms, promotes healing, or prevents
                          recurrence.)
                        </Tooltip>
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Description of the active ingredients and components of the vaccine."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="additives-tooltip"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="additives-tooltip"
                        >
                          Some proteins contain artificial sweeteners (e.g.,
                          sucralose, aspartame),
                          <br /> while others use natural sweeteners (e.g.,
                          stevia, monk fruit).
                        </Tooltip>
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
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Description of the active and/or inactive ingredients and components"
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                            // onChange={handleChange}
                            onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                            onBlur={handleBlur}
                          />
                          <span
                            className={styles.infoTooltip}
                            data-tooltip-id="wellness-tooltip"
                            data-tooltip-content="Expected shelf life of the item under proper storage conditions or Expiry date"
                          >
                            <img
                              src={Information}
                              className={styles.iconTooltip}
                              alt="information"
                            />
                          </span>
                          <Tooltip
                            className={styles.tooltipSec}
                            id="wellness-tooltip"
                          />
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
                          // onChange={handleChange}
                          onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                          onBlur={handleBlur}
                        />
                        <span
                          className={styles.infoTooltip}
                          data-tooltip-id="wellness-tooltip"
                          data-tooltip-content="Easily adjustable storage to accommodate growing data volumes."
                        >
                          <img
                            src={Information}
                            className={styles.iconTooltip}
                            alt="information"
                          />
                        </span>
                        <Tooltip
                          className={styles.tooltipSec}
                          id="wellness-tooltip"
                        />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 50, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="License Terms"
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
                          </div>
                          {touched.license &&
                            errors.license && (
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="White-label solutions for branding. ,Custom integrations or API usage."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Patients Easy-to-use apps for booking and attending consultations."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content=""
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            >
                              Remote monitoring of vital signs (e.g., heart
                              rate, blood pressure, glucose levels). <br />
                              Real-time data transmission to healthcare
                              providers or mobile apps.
                            </Tooltip>
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Continuous or on-demand monitoring (e.g., ECG, blood oxygen levels, heart rate)."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
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
                              // onChange={handleChange}
                              onChange={(e) => handleInputChange(e, setFieldValue, 1000, 'all')}
                              onBlur={handleBlur}
                            />
                            <span
                              className={styles.infoTooltip}
                              data-tooltip-id="wellness-tooltip"
                              data-tooltip-content="Adheres to HL7/FHIR standards for healthcare data exchange."
                            >
                              <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                              />
                            </span>
                            <Tooltip
                              className={styles.tooltipSec}
                              id="wellness-tooltip"
                            />
                          </div>
                          {touched.interoperability &&
                            errors.interoperability && (
                              <span className={styles.error}>
                                {errors.interoperability}
                              </span>
                            )}
                          <AddProductFileUpload
                            fieldInputName={"interoperabilityFile"}
                            setFieldValue={setFieldValue}
                            initialValues={values}
                            label=""
                            // fileUpload={interoperabilityUpload}
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

            {/* Start the Health & Safety */}
            <div className={styles.section}>
              <span className={styles.formHead}>Health & Safety</span>
              <div className={styles.formSection}>
                <AddProductFileUpload
                  fieldInputName={"safetyDatasheet"}
                  setFieldValue={setFieldValue}
                  initialValues={values}
                  label="Safety Datasheet"
                  // fileUpload={safetyDatasheetUpload}
                  tooltip="Specific safety information, instructions or precautions related to product"
                />

                <AddProductFileUpload
                  fieldInputName={"healthHazardRating"}
                  setFieldValue={setFieldValue}
                  initialValues={values}
                  label="Health Hazard Rating"
                  // fileUpload={healthHazardUpload}
                  tooltip="Health Hazard Rating Document"
                />

                <AddProductFileUpload
                  fieldInputName={"environmentalImpact"}
                  setFieldValue={setFieldValue}
                  initialValues={values}
                  label="Environmental Impact"
                  // fileUpload={environmentalImpactUpload}
                  tooltip="Environment Impact Rating Document"
                />
              </div>
              <div className={styles.formSection}>
                {touched.safetyDatasheet && errors.safetyDatasheet && (
                  <span className={styles.error}>{errors.safetyDatasheet}</span>
                )}

                {touched.healthHazardRating && errors.healthHazardRating && (
                  <span className={styles.error}>
                    {errors.healthHazardRating}
                  </span>
                )}

                {touched.environmentalImpact && errors.environmentalImpact && (
                  <span className={styles.error}>
                    {errors.environmentalImpact}
                  </span>
                )}
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
                    // onChange={handleChange}
                    onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all')}
                    onBlur={handleBlur}
                  />
                </div>

                <AddProductFileUpload
                  fieldInputName={"guidelinesFile"}
                  setFieldValue={setFieldValue}
                  initialValues={values}
                  label="User Guidelines"
                  // fileUpload={userGuidelinesUpload}
                  tooltip="Specific information, instructions related to product."
                />
               {touched.guidelinesFile && errors.guidelinesFile && (
                  <span className={styles.error}>{errors.guidelinesFile}</span>
                )}
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
                      // onChange={handleChange}
                      onChange={(e) => handleInputChange(e, setFieldValue, 100, 'all')}
                      onBlur={handleBlur}
                    />
                    <span
                      className={styles.infoTooltip}
                      data-tooltip-id="other-information-tooltip"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span>
                    <Tooltip
                      className={styles.tooltipSec}
                      id="other-information-tooltip"
                    >
                      Any relevant, additional or other information regarding
                      the product (eg. Prescribing <br /> Info for Medication or
                      Dosage Info or regarding the shipping of large devices
                      etc.)
                    </Tooltip>
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

            {open && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  {/* Close Button */}
                  <div className={styles.modalHeadContainer}>
                    <div className={styles.modalTitle}>Bulk Upload</div>
                    <button
                      className={styles.closeButton}
                      onClick={() => setOpen(false)}
                    >
                      ×
                    </button>
                  </div>

                  <div className={styles.fileInputWrapper}>
                    <label className={styles.formLabel}>
                      Upload File (PDF, CSV, Excel, DOC)
                    </label>
                    <div className={styles.modalInnerSection}>
                      <FiUploadCloud size={20} className={styles.uploadIcon} />
                      <input
                        type="file"
                        accept=".pdf,.csv,.xls,.xlsx,.doc,.docx"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                      />
                      {!selectedFile && (
                        <p className={styles.placeholderText}>Upload file</p>
                      )}
                      {selectedFile && (
                        <p className={styles.fileModalName}>
                          {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={styles.modalButtonContainer}>
                    <button
                      onClick={() => setOpen(false)}
                      className={styles.buttonCancel}
                    >
                      Cancel
                    </button>
                    <button className={styles.buttonSubmit}>Upload</button>
                  </div>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProduct;
