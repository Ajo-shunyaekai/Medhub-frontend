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
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const volumeUnits = [
  { value: "Cubic meter (m³)", label: "Cubic meter (m³)" },
  { value: "Liter (L)", label: "Liter (L)" },
  { value: "Milliliter (mL)", label: "Milliliter (mL)" },
  { value: "Microgram (µg)", label: "Microgram (µg)" },
  { value: "Cubic centimeter (cm³)", label: "Cubic centimeter (cm³)" },
  { value: "Cubic decimeter (dm³)", label: "Cubic decimeter (dm³)" },
  { value: "Cubic inch (in³)", label: "Cubic inch (in³)" },
  { value: "Cubic foot (ft³)", label: "Cubic foot (ft³)" },
  { value: "Cubic yard (yd³)", label: "Cubic yard (yd³)" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

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
