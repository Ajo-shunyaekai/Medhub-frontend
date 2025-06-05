import * as Yup from "yup";

export const Options = [
  { value: "new product", label: "New Product" },
  { value: "secondary product", label: "Secondary Product" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const packagingUnits = [
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
  { value: "Milliton (mt)", label: "Milliton (mt)" },
].sort((a, b) => a?.label?.localeCompare(b?.label));

export const volumeUnits = [
  { value: "Cubic meter (m³)", label: "Cubic meter (m³)" },
  { value: "Litre (L)", label: "Litre (L)" },
  { value: "MilliLitre (mL)", label: "MilliLitre (mL)" },
  { value: "Microgram (µg)", label: "Microgram (µg)" },
  { value: "Cubic centimeter (cm³)", label: "Cubic centimeter (cm³)" },
  { value: "Cubic decimeter (dm³)", label: "Cubic decimeter (dm³)" },
  { value: "Cubic inch (in³)", label: "Cubic inch (in³)" },
  { value: "Cubic foot (ft³)", label: "Cubic foot (ft³)" },
  { value: "Cubic yard (yd³)", label: "Cubic yard (yd³)" },
  { value: "Gallon (gal)", label: "Gallon (gal)" },
  { value: "Quart (qt)", label: "Quart (qt)" },
  { value: "Pint (pt)", label: "Pint (pt)" },
].sort((a, b) => a?.label?.localeCompare(b?.label));

export const dimensionUnits = [
  { value: "Millimeter (mm)", label: "Millimeter (mm)" },
  { value: "Centimeter (cm)", label: "Centimeter (cm)" },
  { value: "Meter (m)", label: "Meter (m)" },
  { value: "Inch (in)", label: "Inch (in)" },
  { value: "Feet (ft)", label: "Feet (ft)" },
  { value: "Yard (yd)", label: "Yard (yd)" },
  { value: "Mile (mi)", label: "Mile (mi)" },
].sort((a, b) => a?.label?.localeCompare(b?.label));

export const packagingOptions = [
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
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const materialOptions = [
  { value: "Plastic", label: "Plastic" },
  { value: "Glass", label: "Glass" },
  { value: "Aluminum", label: "Aluminum" },
  { value: "Cardboard", label: "Cardboard" },
  { value: "Thermocol", label: "Thermocol" },
  { value: "Other", label: "Other" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const conditionOptions = [
  { value: "New", label: "New" },
  { value: "Used", label: "Used" },
  { value: "Refurbished", label: "Refurbished" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const stockOptions = [
  { value: "In-stock", label: "In-stock" },
  { value: "Out of Stock", label: "Out of Stock" },
  { value: "On-demand", label: "On-demand" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const quantityOptions = [
  { value: "0-500", label: "0-500" },
  { value: "500-1000", label: "500-1000" },
  { value: "1000-2000", label: "1000-2000" },
  { value: "2000-5000", label: "2000-5000" },
  { value: "5000-8000", label: "5000-8000" },
  { value: "8000-12000", label: "8000-12000" },
];

export const stockQuantityOptions = [
  { value: "America", label: "America" },
  { value: "India", label: "India" },
  { value: "United Arab Emirates", label: "United Arab Emirates" },
  { value: "United Kingdom", label: "United Kingdom" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const pharmaOptions = [
  { value: "Category I", label: "Category I" },
  { value: "Category II", label: "Category II" },
  { value: "Category III", label: "Category III" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const skinhairOptions = [
  { value: "Category I", label: "Category I" },
  { value: "Category II", label: "Category II" },
  { value: "Category III", label: "Category III" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const vitalHealthOptions = [
  { value: "Category I", label: "Category I" },
  { value: "Category II", label: "Category II" },
  { value: "Category III", label: "Category III" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const moistureOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const dermatologistOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const pediatricianOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const frameOptions = [
  { value: "Metal", label: "Metal" },
  { value: "Plastic", label: "Plastic" },
  { value: "Rimless", label: "Rimless" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const lensOptions = [
  { value: "Single Vision", label: "Single Vision" },
  { value: "Bifocal", label: "Bifocal" },
  { value: "Progressive", label: "Progressive" },
  { value: "Anti-Reflective", label: "Anti-Reflective" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const lensmaterialOptions = [
  { value: "Polycarbonate", label: "Polycarbonate" },
  { value: "Glass", label: "Glass" },
  { value: "Trivex", label: "Trivex" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const dairyfeeOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

const defaultValues = "Speak to the supplier for more info";
export const initialValues = {
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
  volumeUnit: "",
  dimension: "",
  dimensionUnit: "",
  weight: "",
  unit: "",
  unit_tax: "",
  packageType: "",
  packageMaterial: "",
  packageMaterialIfOther: "",
  costPerProduct: "",
  sku: "",
  stock: "",
  stockQuantity: "",
  quantityFrom: "",
  quantityTo: "",
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
    },
  ],
  productPricingDetails: [
    {
      quantityFrom: "",
      quantityTo: "",
      price: "",
      deliveryTime: "TBC - Depends on quantity",
    },
  ],
  cNCFileNDate: [
    {
      file: [],
      date: "",
    },
  ],
  drugClass: defaultValues || "",
  controlledSubstance: false,
  otcClassification: "",
  genericName: "",
  strength: defaultValues || "",
  composition: defaultValues || "",
  purpose: defaultValues || "",
  drugAdministrationRoute: defaultValues || "",
  expiry: defaultValues || "",
  allergens: "",
  formulation: "",
  vegan: false,
  crueltyFree: false,
  sideEffectsAndWarnings: "",
  thickness: "",
  interoperability: defaultValues || "",
  interoperabilityFile: [],
  specification: "",
  specificationFile: [],
  diagnosticFunctions: defaultValues || "",
  performanceTestingReport: "",
  performanceTestingReportFile: [],
  additivesNSweeteners: defaultValues || "",
  powdered: false,
  productMaterial: "",
  productMaterialIfOther: "",
  texture: false,
  sterilized: false,
  chemicalResistance: false,
  fluidResistance: false,
  shape: "",
  coating: "",
  concentration: defaultValues || "",
  measurementRange: "",
  maintenanceNotes: "",
  compatibleEquipment: "",
  usageRate: "",
  adhesiveness: "",
  absorbency: "",
  targetCondition: defaultValues || "",
  elasticity: "",
  breathability: "",
  foldability: defaultValues || "",
  fragrance: "",
  healthBenefit: defaultValues || "",

  laserType: "",
  coolingSystem: "",
  spotSize: "",

  spf: "",
  dermatologistTested: "",
  dermatologistTestedFile: [],
  pediatricianRecommended: "",
  pediatricianRecommendedFile: [],
  moisturizers: defaultValues || "",
  fillerType: defaultValues || "",

  filtrationEfficiency: "",
  layerCount: "",
  filtrationType: [],

  magnificationRange: "",
  objectiveLenses: "",
  powerSource: "",
  resolution: "",
  connectivity: "",
  casNumber: "",
  grade: "",
  physicalState: [],
  hazardClassification: [],

  flowRate: "",
  noiseLevel: "",

  colorOptions: "",
  moistureResistance: "",

  lensPower: "",
  baseCurve: "",
  diameter: "",
  frame: "",
  lens: "",
  lensMaterial: "",

  maxWeightCapacity: "",
  gripType: "",
  lockingMechanism: "",
  typeOfSupport: "",
  batteryType: "",
  batterySize: "",

  healthClaims: "",
  healthClaimsFile: [],

  productLongevity: defaultValues || "",
  flavorOptions: defaultValues || "",
  aminoAcidProfile: defaultValues || "",
  fatContent: defaultValues || "",
  dairyFree: "",

  license: defaultValues || "",
  scalabilityInfo: defaultValues || "",
  addOns: defaultValues || "",
  userAccess: defaultValues || "",
  keyFeatures: defaultValues || "",
  coreFunctionalities: defaultValues || "",
};

export const addProductValidationSchema = Yup.object({
  name: Yup.string().required("Product Name is required."),
  description: Yup.string().required("Product Description is required."),
  // manufacturer: Yup.string().required("Manufacturer Name is required."),
  aboutManufacturer: Yup.string().required("Short Description is required."),
  // countryOfOrigin: Yup.string().required(
  //   "Manufacturer Country of Origin is required."
  // ),
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
        )
    ),
  // form: Yup.string().required("Product Type/Form is required."),
  quantity: Yup.number().required("Product Quantity is required."),

  // weight: Yup.number().required("Product Weight is required."),
  // unit: Yup.string().required("Product Weight Unit is required."),
  unit_tax: Yup.string().required("Tax Percentage is required."),

  stock: Yup.string()
    .oneOf(["In-stock", "Out of Stock", "On-demand"])
    .required("Stock is required."),

  // countries: Yup.array()
  //   .min(1, "At least one country must be selected.")
  //   .of(Yup.string().required("Country Available is required.")),

  stockedInDetails: Yup.array().of(
    Yup.object({
      country: Yup.string().required("Country is required."),
      // quantity: Yup.number()
      //   .required("Quantity is required.")
      //   .positive("Quantity must be greater than 0"),
      // type: Yup.string().required("Type is required."),
    })
  ),
  // .min(1, "At least one product is required."), // Optional: You can enforce at least one item in the array

  productPricingDetails: Yup.array()
    .of(
      Yup.object({
        quantityFrom: Yup.string().required("Quantity From is required."),
        quantityTo: Yup.string().required("Quantity To is required."),
        price: Yup.number()
          .typeError("Cost Per Price must be a number.")
          .required("Cost Per Price is required.")
          .positive("Cost Per Price must be greater than 0")
          .test(
            "decimal-places",
            "Price can have up to 3 decimal places only.",
            (value) => {
              if (value === undefined || value === null) return true;
              return /^\d+(\.\d{1,3})?$/.test(value.toString());
            }
          ),
        // deliveryTime: Yup.string()
        //   .matches(
        //     /^\d{1,3}$/,
        //     "Delivery Time must be a number with up to 3 digits."
        //   )
        //   .required("Est. Delivery Time is required."),
      })
    )
    .min(1, "At least one product is required."),
  cNCFileNDate: Yup.array().of(
    Yup.object({
      file: Yup.array()
        .max(1, "You can upload up to 1 Compliance File.")
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
        )
        .nullable(),
    })
  ),
  complianceFile: Yup.array()
    .max(4, "You can upload up to 4 Compliance File.")
    .of(
      Yup.mixed()
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
    .of(Yup.mixed().required("Purchase Invoice File is required."))
    .when("market", {
      is: "secondary",
      then: Yup.array()
        .min(1, "At least one Purchase Invoice File must be selected.")
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
          "Care Products",
        ],
        "Invalid Subcategory"
      ),
    })

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
          "First Aid Kits",
          "Emergency Medical Equipment",
          "Trauma Care Products",
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
          "Care Products",
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
  // expiry: Yup.string()
  //   .when("category", {
  //     is: (category) =>
  //       [
  //         "Pharmaceuticals",
  //         "SkinHairCosmeticSupplies",
  //         "VitalHealthAndWellness",
  //         "MedicalConsumablesAndDisposables",
  //         "HospitalAndClinicSupplies",

  //         "DentalProducts",
  //         "HomeHealthcareProducts",
  //         "AlternativeMedicines",
  //         "EmergencyAndFirstAidSupplies",
  //         "DisinfectionAndHygieneSupplies",
  //         "NutritionAndDietaryProducts",
  //       ].includes(category),
  //     then: Yup.string().required("Shelf Life/Expiry is required."),
  //   })
  //   .nullable(),
  // interoperability: Yup.string()
  //   .when("category", {
  //     is: (category) => ["HealthcareITSolutions"].includes(category),
  //     then: Yup.string().required("Interoperability is required."),
  //   })
  //   .nullable(),
  // interoperabilityFile: Yup.array()
  //   .when("category", {
  //     is: (category) => ["HealthcareITSolutions"].includes(category),
  //     then: Yup.array()
  //       .min(1, "At least one file is required for the Interoperability file.")
  //       .max(4, "You can upload up to 4 Interoperability files.")
  //       .required("Interoperability files is required."),

  //   })
  //   .nullable(),
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
      is: (category) => ["DiagnosticAndMonitoringDevices"].includes(category),
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
        ["SkinHairCosmeticSupplies", "OrthopedicSupplies"].includes(category),
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
        is: (val) => val && val == "Yes",
        then: Yup.array()
          .min(1, "At least one file is required for the Dermatologist Tested.")
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
        otherwise: Yup.array().nullable(),
      })
      .nullable(),
    otherwise: Yup.array().nullable(),
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
    is: "SkinHairCosmeticSupplies",
    then: Yup.array()
      .when("pediatricianRecommended", {
        is: (val) => val && val == "Yes",
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
        otherwise: Yup.array().nullable(),
      })
      .nullable(),
    otherwise: Yup.array().nullable(),
  }),

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
  // license: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("License is required."),
  //   })
  //   .nullable(),
  // scalabilityInfo: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("Scalability Info is required."),
  //   })
  //   .nullable(),
  // addOns: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("Add-Ons is required."),
  //   })
  //   .nullable(),
  // userAccess: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("User Access is required."),
  //   })
  //   .nullable(),
  // keyFeatures: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("Key Features is required."),
  //   })
  //   .nullable(),
  // coreFunctionalities: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("Core Functionalities is required."),
  //   })
  //   .nullable(),
});

export const editProductValidationSchema = Yup.object({
  name: Yup.string().required("Product Name is required."),
  description: Yup.string().required("Product Description is required."),
  // manufacturer: Yup.string().required("Manufacturer Name is required."),
  aboutManufacturer: Yup.string().required("Short Description is required."),
  // countryOfOrigin: Yup.string().required(
  //   "Manufacturer Country of Origin is required."
  // ),
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
  // form: Yup.string().required("Product Type/Form is required."),
  quantity: Yup.number().required("Product Quantity is required."),
  // weight: Yup.number().required("Product Weight is required."),
  // unit: Yup.string().required("Product Weight Unit is required."),
  unit_tax: Yup.string().required("Tax Percentage is required."),

  stock: Yup.string()
    .oneOf(["In-stock", "Out of Stock", "On-demand"])
    .required("Stock is required."),

  // countries: Yup.array()
  //   .min(1, "At least one country must be selected.")
  //   .of(Yup.string().required("Country Available is required.")),

  stockedInDetails: Yup.array().of(
    Yup.object({
      country: Yup.string().required("Country is required."),
      // .test(
      //   "country-in-countries",
      //   "Country must be one of the selected countries",
      //   (value, context) => {
      //     const { countries } = context?.from?.[context?.from?.length-1]?.value; // Get the countries array from the form values
      //     console.log("context.parent",countries)
      //     return countries?.includes(value); // Check if the country exists in the countries array
      //   }
      // ),
      // quantity: Yup.number()
      //   .required("Quantity is required.")
      //   .positive("Quantity must be greater than 0"),
      // type: Yup.string().required("Type is required."),
    })
  ),
  // .min(1, "At least one product is required."), // Optional: You can enforce at least one item in the array

  productPricingDetails: Yup.array()
    .of(
      Yup.object({
        // quantity: Yup.string().required("Quantity is required."),
        quantityFrom: Yup.number()
          .typeError("Quantity From must be a number.")
          .required("Quantity From is required.")
          .positive("Quantity From must be greater than 0"),
        quantityTo: Yup.number()
          .typeError("Quantity To must be a number.")
          .required("Quantity To is required.")
          .positive("Quantity To must be greater than 0"),
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
        // deliveryTime: Yup.string()
        //   .matches(
        //     /^\d{1,3}$/,
        //     "Delivery Time must be a number with up to 3 digits."
        //   )
        //   .required("Est. Delivery Time is required."),
      })
    )
    .min(1, "At least one product is required."), // Optional: You can enforce at least one item in the array
  complianceFile: Yup.array().max(4, "You can upload up to 4 Compliance File."),

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
  guidelinesFile: Yup.array().max(4, "You can upload up to 4 guideline files."),

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
          "Care Products",
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
          "Care Products",
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
  // expiry: Yup.string()
  //   .when("category", {
  //     is: (category) =>
  //       [
  //         "Pharmaceuticals",
  //         "SkinHairCosmeticSupplies",
  //         "VitalHealthAndWellness",
  //         "MedicalConsumablesAndDisposables",
  //         "HospitalAndClinicSupplies",
  //         // "OrthopedicSupplies",
  //         "DentalProducts",
  //         "HomeHealthcareProducts",
  //         "AlternativeMedicines",
  //         "EmergencyAndFirstAidSupplies",
  //         "DisinfectionAndHygieneSupplies",
  //         "NutritionAndDietaryProducts",
  //       ].includes(category),
  //     then: Yup.string().required("Shelf Life/Expiry is required."),
  //   })
  //   .nullable(),

  // interoperability: Yup.string()
  //   .when("category", {
  //     is: (category) => ["HealthcareITSolutions"].includes(category),
  //     then: Yup.string().required("Interoperability is required."),
  //   })
  //   .nullable(),
  // interoperabilityFile: Yup.array()
  //   .max(4, "You can upload up to 4 Interoperability files.")
  //   .of(
  //     Yup.string().required("A file path is required.") // Since it's now a string
  //   ),
  interoperabilityFileNew: Yup.array()
    .when("category", {
      is: (category) => ["HealthcareITSolutions"].includes(category),
      then: Yup.array().max(4, "You can upload up to 4 Interoperability file."),
    })
    .nullable(),
  interoperabilityFileNew: Yup.array()
    .when("category", {
      is: (category) => ["HealthcareITSolutions"].includes(category),
      then: Yup.array()
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
      then: Yup.array().max(4, "You can upload up to 4 specification files."),
    })

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
      is: (category) => ["DiagnosticAndMonitoringDevices"].includes(category),
      then: Yup.array()
        // .min(1, "At least one file is required for the specification file.")
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
      is: (category) => ["DiagnosticAndMonitoringDevices"].includes(category),
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
        ["SkinHairCosmeticSupplies", "OrthopedicSupplies"].includes(category),
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
        is: (val) => val && val == "Yes",
        then: Yup.array().max(
          4,
          "You can upload up to 4 dermatologist tested files."
        ),
        otherwise: Yup.array().nullable(),
      })
      .nullable(),
    otherwise: Yup.array().nullable(),
  }),
  dermatologistTestedFileNew: Yup.array().when("category", {
    is: "SkinHairCosmeticSupplies", // Check category first
    then: Yup.array()
      .when("dermatologistTested", {
        is: (val) => val && val == "Yes",
        then: Yup.array()

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
      then: Yup.array().max(4, "You can upload up to 4 Health Claims Files."),
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
  // license: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("License is required."),
  //   })
  //   .nullable(),
  // scalabilityInfo: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("Scalability Info is required."),
  //   })
  //   .nullable(),
  // addOns: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("Add-Ons is required."),
  //   })
  //   .nullable(),
  // userAccess: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("User Access is required."),
  //   })
  //   .nullable(),
  // keyFeatures: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("Key Features is required."),
  //   })
  //   .nullable(),
  // coreFunctionalities: Yup.string()
  //   .when("category", {
  //     is: "HealthcareITSolutions",
  //     then: Yup.string().required("Core Functionalities is required."),
  //   })
  //   .nullable(),
});
