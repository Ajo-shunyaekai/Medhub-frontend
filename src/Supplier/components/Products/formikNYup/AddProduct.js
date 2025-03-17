import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./login.css";
import "./forgotpass.css";
import { useDispatch } from "react-redux";
import { setEmailToResetPassword } from "../../../../redux/reducers/userDataSlice";
import { apiRequests } from "../../../../api";
import { toast } from "react-toastify";

const productValidationSchema = Yup.object({
  name: Yup.string().required("Product Name is required."),
  description: Yup.string().required("Product Description is required."),
  manufacturer: Yup.string().required("Manufacturer is required."),
  countryOfOrigin: Yup.string().required("Country of Origin is required."),
  upc: Yup.string().nullable(),
  model: Yup.string().required("Part/Model Number is required."),
  image: Yup.array()
    .max(4, "You can upload up to 4 images.")
    .of(
      Yup.mixed()
        .required("A file is required")
        .test(
          "fileSize",
          "File too large",
          (value) => value && value.size <= 1024 * 1024 * 5
        ) // Max 5MB
    ),
  brand: Yup.string().nullable(),
  form: Yup.string().required("Type/Form is required."),
  quantity: Yup.number()
    .required("Product Quantity is required.")
    .positive()
    .integer(),
  volumn: Yup.string().required("Product Size/Volumn is required."),
  weight: Yup.number().required("Product Weight is required.").positive(),
  unit: Yup.string().required("Product Weight Unit is required."),
  packageType: Yup.string().required("Product Packaging Type is required."),
  packageMaterial: Yup.string().required(
    "Product Packaging Material is required."
  ),
  packageMaterialIfOther: Yup.string().nullable(),
  packageMaterialIfOther: Yup.string().when("packageMaterial", {
    is: "Other",
    then: Yup.string().required(
      "Product Packaging Material Other Name is required.."
    ),
  }),
  costPerProduct: Yup.string().nullable(),
  sku: Yup.string().nullable(),
  stock: Yup.string()
    .oneOf(["In-stock", "Out of Stock", "On-demand"])
    .required("Stck is required."),
  stockQuantity: Yup.number().nullable().positive().integer(),
  countries: Yup.array().of(Yup.string().required("Country is required")),
  date: Yup.string().nullable(),
  complianceFile: Yup.array()
    .max(4, "You can upload up to 4 Compliance File.")
    .of(
      Yup.mixed()
        .required("A file is required")
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
  storage: Yup.string().nullable(),
  other: Yup.string().nullable(),
  guidelinesFile: Yup.array()
    .max(4, "You can upload up to 4 guideline files.")
    .of(
      Yup.mixed()
        .required("A file is required")
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
  warranty: Yup.string().nullable(),
  safetyDatasheet: Yup.array()
    .max(4, "You can upload up to 4 safety datasheets.")
    .of(
      Yup.mixed()
        .required("A file is required")
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
        .required("A file is required")
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
        .required("A file is required")
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
  performaInvoiceFile: Yup.array()
    .of(Yup.string().required("Performa Invoice File is required."))
    .when("market", {
      is: "secondary",
      then: Yup.array()
        .min(1, "At least one Performa Invoice File must be selected.")
        .max(4, "You can upload up to 4 safety datasheets.")
        .required("specification files is required.")
        .of(
          Yup.mixed()
            .required("A Performa Invoice File is required")
            .test(
              "fileSize",
              "File too large",
              (value) => value && value.size <= 1024 * 1024 * 5
            ) // Max 5MB
        ),
    }),
  countryAvailable: Yup.array()
    .of(Yup.string().required("Country is required."))
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
    // For "MedicalEquipmentAndDevices" category
    .when("category", {
      is: "MedicalEquipmentAndDevices",
      then: Yup.string()
        .oneOf(
          [
            "Diagnostic Tools",
            "Imaging Equipment",
            "Surgical Instruments",
            "Monitoring Devices",
            "Mobility Aids",
            "Respiratory Care",
            "Elderly Care Products",
          ],
          "Invalid Subcategory for Medical Equipment and Devices"
        )
        .required("Subcategory is required for Medical Equipment and Devices."),
    })
    // For "Pharmaceuticals" category
    .when("category", {
      is: "Pharmaceuticals",
      then: Yup.string()
        .oneOf(
          [
            "Prescription Medications",
            "Over-the-Counter Medications",
            "Vaccines",
            "Generic Drugs",
            "Specialized Treatments",
          ],
          "Invalid Subcategory"
        )
        .required("Subcategory is required."),
    })
    // For "SkinHairCosmeticSupplies" category
    .when("category", {
      is: "SkinHairCosmeticSupplies",
      then: Yup.string()
        .oneOf(
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
          "Invalid Subcategory for Skin Hair Cosmetic Supplies"
        )
        .required("Subcategory is required for Skin Hair Cosmetic Supplies."),
    })
    // For "VitalHealthAndWellness" category
    .when("category", {
      is: "VitalHealthAndWellness",
      then: Yup.string()
        .oneOf(
          [
            "Fitness Monitors",
            "Herbal & Alternative Medicines",
            "Immune Boosters",
            "Vitamins & Supplements",
            "Weight Management",
          ],
          "Invalid Subcategory for Vital Health And Wellness"
        )
        .required("Subcategory is required for Vital Health And Wellness."),
    })
    // For "MedicalConsumablesAndDisposables" category
    .when("category", {
      is: "MedicalConsumablesAndDisposables",
      then: Yup.string()
        .oneOf(
          [
            "Bandages, Gauze, & Wound Dressings",
            "Gloves, Masks, & Protective gear",
            "Sterilization Products",
            "Surgical Sutures & Adhesives",
            "Syringes, IV Sets & Catheters",
          ],
          "Invalid Subcategory for Medical Consumables And Disposables"
        )
        .required(
          "Subcategory is required for Medical Consumables and Disposables."
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
          "Invalid Subcategory for Laboratory Supplies"
        )
        .required("Subcategory is required for Laboratory Supplies."),
    })
    // For "DiagnosticAndMonitoringDevices" category
    .when("category", {
      is: "DiagnosticAndMonitoringDevices",
      then: Yup.string()
        .oneOf(
          [
            "Blood Glucose Monitors",
            "Blood Pressure Monitors",
            "Oxygen Concentrators",
            "Wearable Health Devices",
          ],
          "Invalid Subcategory for Diagnostic And Monitoring Devices"
        )
        .required(
          "Subcategory is required for Diagnostic And Monitoring Devices."
        ),
    })
    // For "HospitalAndClinicSupplies" category
    .when("category", {
      is: "HospitalAndClinicSupplies",
      then: Yup.string()
        .oneOf(
          [
            "Patient Beds & Stretchers",
            "Trolleys & Storage Units",
            "Examination Tables",
            "Medical Furniture",
            "First Aid Kits",
            "Emergency Medical Equipment",
            "Trauma Care Products"
          ],
          "Invalid Subcategory for Hospital And Clinic Supplies"
        )
        .required("Subcategory is required for Hospital And Clinic Supplies."),
    })
    // For "OrthopedicSupplies" category
    .when("category", {
      is: "OrthopedicSupplies",
      then: Yup.string()
        .oneOf(
          [
            "Orthopedic Braces & Supports",
            "Splints & Casting Materials",
            "Prosthetics",
            "Rehabilitation Equipment",
          ],
          "Invalid Subcategory for Orthopedic Supplies"
        )
        .required("Subcategory is required for Orthopedic Supplies."),
    })
    // For "DentalProducts" category
    .when("category", {
      is: "DentalProducts",
      then: Yup.string()
        .oneOf(
          [
            "Dental Instruments & tools",
            "Orthodontic Supplies",
            "Dental Chairs and Accessories",
            "Dental Consumables",
          ],
          "Invalid Subcategory for Dental Products"
        )
        .required("Subcategory is required for Dental Products."),
    })
    // For "EyeCareSupplies" category
    .when("category", {
      is: "EyeCareSupplies",
      then: Yup.string()
        .oneOf(
          [
            "Contact Lenses and Solutions",
            "Eyewear",
            "Eyewear Lenses",
            "Eye Drops and Ointments",
          ],
          "Invalid Subcategory for Eye Care Supplies"
        )
        .required("Subcategory is required for Eye Care Supplies."),
    })
    // For "HomeHealthcareProducts" category
    .when("category", {
      is: "HomeHealthcareProducts",
      then: Yup.string()
        .oneOf(
          [
            "Mobility Aids",
            "Respiratory Care",
            "Patient Monitoring Devices",
            "Elderly Care Products",
          ],
          "Invalid Subcategory for Home Healthcare Products"
        )
        .required("Subcategory is required for Home Healthcare Products."),
    })
    // For "AlternativeMedicines" category
    .when("category", {
      is: "AlternativeMedicines",
      then: Yup.string()
        .oneOf(
          ["Homeopathy", "Ayurvedic"],
          "Invalid Subcategory for Alternative Medicines"
        )
        .required("Subcategory is required for Alternative Medicines."),
    })
    // For "EmergencyAndFirstAidSupplies" category
    .when("category", {
      is: "EmergencyAndFirstAidSupplies",
      then: Yup.string()
        .oneOf(
          [
            "First Aid Kits",
            "Emergency Medical Equipment",
            "Trauma Care Products",
          ],
          "Invalid Subcategory for Emergency And First Aid Supplies"
        )
        .required(
          "Subcategory is required for Emergency And First Aid Supplies."
        ),
    })
    // For "DisinfectionAndHygieneSupplies" category
    .when("category", {
      is: "DisinfectionAndHygieneSupplies",
      then: Yup.string()
        .oneOf(
          ["Hand Sanitizers", "Air Purifiers", "Cleaning Agents"],
          "Invalid Subcategory for Disinfection And Hygiene Supplies"
        )
        .required(
          "Subcategory is required for Disinfection And Hygiene Supplies."
        ),
    })
    // For "NutritionAndDietaryProducts" category
    .when("category", {
      is: "NutritionAndDietaryProducts",
      then: Yup.string()
        .oneOf(
          [
            "Protein Powders and Shakes",
            "Specialized Nutrition",
            "Meal Replacement Solutions",
          ],
          "Invalid Subcategory for Nutrition And Dietary Products"
        )
        .required(
          "Subcategory is required for Nutrition And Dietary Products."
        ),
    })
    // For "HealthcareITSolutions" category
    .when("category", {
      is: "HealthcareITSolutions",
      then: Yup.string()
        .oneOf(
          [
            "Healthcare Management Software",
            "Telemedicine Platforms",
            "Medical Billing Software",
            "IoT-Enabled Medical Devices",
          ],
          "Invalid Subcategory for Healthcare IT Solutions"
        )
        .required("Subcategory is required for Healthcare IT Solutions."),
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
  controlledSubstance: Yup.boolean()
    .when("category", {
      is: (category) =>
        [
          "Pharmaceuticals",
          "SkinHairCosmeticSupplies",
          "VitalHealthAndWellness",
        ].includes(category),
      then: Yup.boolean().nullable(),
    })
    .nullable(),
  otcClassification: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "Pharmaceuticals",
          "SkinHairCosmeticSupplies",
          "VitalHealthAndWellness",
        ].includes(category),
      then: Yup.string().oneOf(
        ["Category I", "Category II", "Category III"],
        "Invalid OTC Classification"
      ),
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
      is: (category) =>
        [
          "Pharmaceuticals",
          "VitalHealthAndWellness",
          "MedicalConsumablesAndDisposables",
          "LaboratorySupplies",
          "HospitalAndClinicSupplies",
          "OrthopedicSupplies",
          "DentalProducts",
          "AlternativeMedicines",
          "NutritionAndDietaryProducts",
        ].includes(category),
      then: Yup.string().nullable(),
    })
    .when("category", {
      is: (category) => ["SkinHairCosmeticSupplies"].includes(category),
      then: Yup.string().reuired("Purpose is required."),
    })
    .nullable(),
  drugAdministrationRoute: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "Pharmaceuticals",
          "SkinHairCosmeticSupplies",
          "VitalHealthAndWellness",
        ].includes(category),
      then: Yup.string().requierd("Drug Administration Route is required."),
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
          "OrthopedicSupplies",
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
  allergens: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "Pharmaceuticals",
          "SkinHairCosmeticSupplies",
          "VitalHealthAndWellness",
        ].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  formulation: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "Pharmaceuticals",
          "SkinHairCosmeticSupplies",
          "VitalHealthAndWellness",
          "DisinfectionAndHygieneSupplies",
        ].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  vegan: Yup.boolean()
    .when("category", {
      is: (category) =>
        [
          "SkinHairCosmeticSupplies",
          "VitalHealthAndWellness",
          "NutritionAndDietaryProducts",
        ].includes(category),
      then: Yup.boolean().nullable(),
    })
    .nullable(),
  crueltyFree: Yup.boolean()
    .when("category", {
      is: (category) =>
        ["SkinHairCosmeticSupplies", , "VitalHealthAndWellness"].includes(
          category
        ),
      then: Yup.boolean().nullable(),
    })
    .nullable(),
  sideEffectsAndWarnings: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "Pharmaceuticals",
          "SkinHairCosmeticSupplies",
          "VitalHealthAndWellness",
        ].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  thickness: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "SkinHairCosmeticSupplies",
          "MedicalConsumablesAndDisposables",
          "HospitalAndClinicSupplies",
        ].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  interoperability: Yup.string()
    .when("category", {
      is: (category) => ["MedicalEquipmentAndDevices"].includes(category),
      then: Yup.string().nullable(),
    })
    .when("category", {
      is: (category) => ["HealthcareITSolutions"].includes(category),
      then: Yup.string().required("Interoperability is required."),
    })
    .nullable(),
  interoperabilityFile: Yup.string()
    .when("category", {
      is: (category) => ["HealthcareITSolutions"].includes(category),
      then: Yup.array()
        .min(1, "At least one file is required for the Interoperability file.")
        .max(4, "You can upload up to 4 Interoperability files.")
        .required("Interoperability files is required.")
        .test(
          "fileSize",
          "File too large",
          (value) => value && value.size <= 1024 * 1024 * 5
        ), // Max 5MB
    })
    .nullable(),
  specification: Yup.string()
    .when("category", {
      is: (category) => ["MedicalEquipmentAndDevices"].includes(category),
      then: Yup.string().nullable(),
    })
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
            .required("A file is required")
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
            .required("A file is required")
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
      is: (category) => ["MedicalEquipmentAndDevices"].includes(category),
      then: Yup.string().nullable(),
    })
    .when("category", {
      is: (category) => ["DiagnosticAndMonitoringDevices"].includes(category),
      then: Yup.string().required("Diagnostic Functions is required."),
    })
    .nullable(),
  performanceTestingReport: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "MedicalEquipmentAndDevices",
          "DiagnosticAndMonitoringDevices",
          "HomeHealthcareProducts",
        ].includes(category),
      then: Yup.string().nullable(),
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
      then: Yup.array()
        .max(4, "You can upload up to 4 performance testing files.")
        .of(
          Yup.mixed()
            .required("A file is required")
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
      is: (category) =>
        ["VitalHealthAndWellness", "NutritionAndDietaryProducts"].includes(
          category
        ),
      then: Yup.string().nullable(),
    })
    .nullable(),
  powdered: Yup.boolean()
    .when("category", {
      is: (category) =>
        [
          "MedicalConsumablesAndDisposables",
          "HospitalAndClinicSupplies",
        ].includes(category),
      then: Yup.boolean().nullable(),
    })
    .nullable(),
  productMaterial: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "MedicalConsumablesAndDisposables",
          "HospitalAndClinicSupplies",
          "DentalProducts",
        ].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  texture: Yup.boolean()
    .when("category", {
      is: (category) =>
        [
          "MedicalConsumablesAndDisposables",
          "HospitalAndClinicSupplies",
        ].includes(category),
      then: Yup.boolean().nullable(),
    })
    .nullable(),
  sterilized: Yup.boolean()
    .when("category", {
      is: (category) =>
        [
          "MedicalConsumablesAndDisposables",
          "HospitalAndClinicSupplies",
          "OrthopedicSupplies",
        ].includes(category),
      then: Yup.boolean().nullable(),
    })
    .nullable(),
  chemicalResistance: Yup.boolean()
    .when("category", {
      is: (category) =>
        [
          "MedicalConsumablesAndDisposables",
          "HospitalAndClinicSupplies",
        ].includes(category),
      then: Yup.boolean().nullable(),
    })
    .nullable(),
  fluidResistance: Yup.boolean()
    .when("category", {
      is: (category) =>
        [
          "MedicalConsumablesAndDisposables",
          "HospitalAndClinicSupplies",
        ].includes(category),
      then: Yup.boolean().nullable(),
    })
    .nullable(),
  shape: Yup.string()
    .when("category", {
      is: (category) =>
        ["MedicalConsumablesAndDisposables", "LaboratorySupplies"].includes(
          category
        ),
      then: Yup.boolean().nullable(),
    })
    .nullable(),
  coating: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "MedicalConsumablesAndDisposables",
          "LaboratorySupplies",
          "OrthopedicSupplies",
        ].includes(category),
      then: Yup.boolean().nullable(),
    })
    .nullable(),
  concentration: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "SkinHairCosmeticSupplies",
          "LaboratorySupplies",
          "DiagnosticAndMonitoringDevices",
          "HomeHealthcareProducts",
          "DisinfectionAndHygieneSupplies",
        ].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  measurementRange: Yup.string()
    .when("category", {
      is: (category) =>
        ["DiagnosticAndMonitoringDevices", "HomeHealthcareProducts"].includes(
          category
        ),
      then: Yup.string().nullable(),
    })
    .nullable(),
  maintenanceNotes: Yup.string()
    .when("category", {
      is: (category) =>
        ["DiagnosticAndMonitoringDevices", "DentalProducts"].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  compatibleEquipment: Yup.string()
    .when("category", {
      is: (category) =>
        ["DiagnosticAndMonitoringDevices", "DentalProducts"].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  usageRate: Yup.string()
    .when("category", {
      is: (category) =>
        ["DiagnosticAndMonitoringDevices", "DentalProducts"].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  adhesiveness: Yup.string()
    .when("category", {
      is: (category) =>
        ["SkinHairCosmeticSupplies", "HospitalAndClinicSupplies"].includes(
          category
        ),
      then: Yup.string().nullable(),
    })
    .nullable(),
  absorbency: Yup.string()
    .when("category", {
      is: (category) =>
        ["HospitalAndClinicSupplies", "OrthopedicSupplies"].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  targetCondition: Yup.string()
    .when("category", {
      is: (category) =>
        ["SkinHairCosmeticSupplies", "OrthopedicSupplies"].includes(category),
      then: Yup.string().required("Target Condition is required."),
    })
    .when("category", {
      is: (category) => ["DentalProducts"].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  elasticity: Yup.string()
    .when("category", {
      is: (category) =>
        [
          "SkinHairCosmeticSupplies",
          "HospitalAndClinicSupplies",
          "OrthopedicSupplies",
        ].includes(category),
      then: Yup.string().nullable(),
    })
    .nullable(),
  breathability: Yup.string()
    .when("category", {
      is: (category) =>
        ["MedicalConsumablesAndDisposables", "OrthopedicSupplies"].includes(
          category
        ),
      then: Yup.string().nullable(),
    })
    .nullable(),
  foldability: Yup.string()
    .when("category", {
      is: (category) => ["HomeHealthcareProducts"].includes(category),
      then: Yup.string().nullable(),
    })
    .when("category", {
      is: (category) => ["EmergencyAndFirstAidSupplies"].includes(category),
      then: Yup.string().required("Foldability is required."),
    })
    .nullable(),
  fragrance: Yup.string()
    .when("category", {
      is: (category) =>
        ["SkinHairCosmeticSupplies", "DisinfectionAndHygieneSupplies"].includes(
          category
        ),

      then: Yup.string().nullable(),
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
  // Add the other fields under MedicalEquipmentAndDevices
  laserType: Yup.string()
    .when("category", {
      is: "MedicalEquipmentAndDevices",
      then: Yup.string().nullable(),
    })
    .nullable(),
  coolingSystem: Yup.string()
    .when("category", {
      is: "MedicalEquipmentAndDevices",
      then: Yup.string().nullable(),
    })
    .nullable(),
  spotSize: Yup.string()
    .when("category", {
      is: "MedicalEquipmentAndDevices",
      then: Yup.string().nullable(),
    })
    .nullable(),
  // Add the other fields under Pharmaceuticals
  // Add the other fields under SkinHairCosmeticSupplies
  spf: Yup.string()
    .when("category", {
      is: "SkinHairCosmeticSupplies",
      then: Yup.string().nullable(),
    })
    .nullable(),
  dermatologistTested: Yup.string()
    .when("category", {
      is: "SkinHairCosmeticSupplies",
      then: Yup.string()
        .oneOf(["Yes", "No"], "Invalid Dermatologist Tested")
        .required("Dermatologist Tested is required."),
    })
    .nullable(),
  dermatologistTestedFile: Yup.array().when("category", {
    is: "SkinHairCosmeticSupplies", // Check category first
    then: Yup.array()
      .when("dermatologistTested", {
        is: (val) => val && val == "Yes", // If dermatologistTestedFile has a value
        then: Yup.array()
          .min(1, "At least one file is required for the Dermatologist Tested.")
          .max(4, "You can upload up to 4 dermatologist tested files.")
          .required("Dermatologist Tested file is required.")
          .of(
            Yup.mixed()
              .required("A file is required")
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
        .oneOf(["Yes", "No"], "Invalid Dermatologist Tested")
        .required("Dermatologist Tested is required."),
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
              .required("A file is required")
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
  moisturizers: Yup.string()
    .when("category", {
      is: "SkinHairCosmeticSupplies",
      then: Yup.string().nullable(),
    })
    .nullable(),
  fillerType: Yup.string()
    .when("category", {
      is: "SkinHairCosmeticSupplies",
      then: Yup.string().nullable(),
    })
    .nullable(),
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
  magnificationRange: Yup.string()
    .when("category", {
      is: "LaboratorySupplies",
      then: Yup.string(),
    })
    .nullable(),
  objectiveLenses: Yup.string()
    .when("category", {
      is: "LaboratorySupplies",
      then: Yup.string(),
    })
    .nullable(),
  powerSource: Yup.string()
    .when("category", {
      is: "LaboratorySupplies",
      then: Yup.string(),
    })
    .nullable(),
  resolution: Yup.string()
    .when("category", {
      is: "LaboratorySupplies",
      then: Yup.string(),
    })
    .nullable(),
  connectivity: Yup.string()
    .when("category", {
      is: "LaboratorySupplies",
      then: Yup.string(),
    })
    .nullable(),
  casNumber: Yup.string()
    .when("category", {
      is: "LaboratorySupplies",
      then: Yup.string(),
    })
    .nullable(),
  grade: Yup.string()
    .when("category", {
      is: "LaboratorySupplies",
      then: Yup.string(),
    })
    .nullable(),
  physicalState: Yup.array()
    .when("category", {
      is: "LaboratorySupplies",
      then: Yup.array(),
    })
    .nullable(),
  hazardClassification: Yup.array()
    .when("category", {
      is: "LaboratorySupplies",
      then: Yup.array(),
    })
    .nullable(),
  // Add the other fields under DiagnosticAndMonitoringDevices
  measurementRange: Yup.string()
    .when("category", {
      is: "DiagnosticAndMonitoringDevices",
      then: Yup.string(),
    })
    .nullable(),
  noiseLevel: Yup.string()
    .when("category", {
      is: "DiagnosticAndMonitoringDevices",
      then: Yup.string(),
    })
    .nullable(),
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
  lensPower: Yup.string()
    .when("category", {
      is: "EyeCareSupplies",
      then: Yup.string(),
    })
    .nullable(),
  baseCurve: Yup.string()
    .when("category", {
      is: "EyeCareSupplies",
      then: Yup.string(),
    })
    .nullable(),
  diameter: Yup.string()
    .when("category", {
      is: "EyeCareSupplies",
      then: Yup.string(),
    })
    .nullable(),
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
  maxWeightCapacity: Yup.string()
    .when("category", {
      is: "HomeHealthcareProducts",
      then: Yup.string(),
    })
    .nullable(),
  gripType: Yup.string()
    .when("category", {
      is: "HomeHealthcareProducts",
      then: Yup.string(),
    })
    .nullable(),
  lockingMechanism: Yup.string()
    .when("category", {
      is: "HomeHealthcareProducts",
      then: Yup.string(),
    })
    .nullable(),
  typeOfSupport: Yup.string()
    .when("category", {
      is: "HomeHealthcareProducts",
      then: Yup.string(),
    })
    .nullable(),
  batteryType: Yup.string()
    .when("category", {
      is: "HomeHealthcareProducts",
      then: Yup.string(),
    })
    .nullable(),
  batterySize: Yup.string()
    .when("category", {
      is: "HomeHealthcareProducts",
      then: Yup.string(),
    })
    .nullable(),
  // Add the other fields under AlternativeMedicines
  healthClaims: Yup.string()
    .when("category", {
      is: "AlternativeMedicines",
      then: Yup.string(),
    })
    .nullable(),
  healthClaimsFile: Yup.array()
    .when("category", {
      is: "AlternativeMedicines",
      then: Yup.array()
        .max(4, "You can upload up to 4 Health Claims Files.")
        .of(
          Yup.mixed()
            .required("A file is required")
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
      is: "AlternativeMedicines",
      then: Yup.string(),
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

const VerifyEmail = ({ step, setStep }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        manufacturer: "",
        countryOfOrigin: "",
        upc: "",
        model: "",
        image: [],
        brand: "",
        form: "",
        quantity: 0,
        volumn: "",
        weight: 0,
        unit: "",
        packageType: "",
        packageMaterial: "",
        packageMaterialIfOther: "",
        costPerProduct: "",
        sku: "",
        stock: "",
        stockQuantity: 0,
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
        performaInvoiceFile: [],
        condition: "",
        minimumPurchaseUnit: "",
        subCategory: "",
        anotherCategory: "",
        stckedInDetails: [
          {
            country: "",
            quantity: 0,
            type: "",
          },
        ],
        // Common fields of multiple categories
        drugClass: "",
        controlledSubstance: "",
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
        filtrationType: "",
        // Add the other fields under LaboratorySupplies
        magnificationRange: "",
        objectiveLenses: "",
        powerSource: "",
        resolution: "",
        connectivity: "",
        casNumber: "",
        grade: "",
        physicalState: "",
        hazardClassification: "",
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
      onSubmit={async (values) => {
        // Handle email verification logic here
      }}
      validateOnBlur={true}
      validateOnChange={false} // Only validate when user submits
    >
      {() => (
        <Form className="login-main-form-section">
          <div className="login-form-main-div">
            <label className="login-form-main-label">
              Email ID<span className="labelstamp">*</span>
            </label>
            <Field
              className="login-form-main-input"
              autoComplete="off"
              type="text"
              name="email"
              placeholder="username@domain.com"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="error-message"
            />
          </div>
          <div className="login-form-main-buttons">
            <button
              type="submit"
              className="login-form-main-login"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Verify Email"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default VerifyEmail;
