// Initial values for the form
export const initialValues = {
  activity_code: "",
  buyer_name: "",
  buyer_id: "",
  buyer_image: [],
  buyer_country_code: "",
  buyer_imageNew: [],
  buyer_type: "",
  categories: [],
  certificateFileNDate: [],
  certificate_image: [],
  certificate_imageNew: [],
  contact_person_country_code: "",
  contact_person_email: "",
  contact_person_mobile: "",
  contact_person_mobile_no: "",
  contact_person_name: "",
  country_of_operation: [],
  country_of_origin: "",
  description: "",
  designation: "",
  estimated_delivery_time: "",
  license_expiry_date: "",
  license_image: [],
  license_imageNew: [],
  license_no: "",
  medical_practitioner_image: [],
  medical_practitioner_imageNew: [],
  city: "",
  company_reg_address: "",
  land_mark: "",
  locality: "",
  pincode: "",
  state: "",
  type: "",
  registration_no: "",
  sales_person_name: "",
  supplier_address: "",
  supplier_country_code: "",
  supplier_id: "",
  supplier_image: [],
  supplier_imageNew: [],
  supplier_mobile: "",
  supplier_name: "",
  supplier_type: "",
  tags: "",
  tax_image: [],
  tax_imageNew: [],
  tax_no: "",
  vat_reg_no: "",
};

export const setInitFormValues = (formik, otherUserDetails) => {
  // otherUserDetails &&
  if (formik && otherUserDetails) {
    const registeredAddress = otherUserDetails?.registeredAddress;
    formik.setValues({
      activity_code: otherUserDetails?.activity_code || "",
      bank_details: otherUserDetails?.bank_details || "",
      categories: otherUserDetails?.categories || [],
      certificateFileNDate:
        otherUserDetails?.certificateFileNDate?.length == 0
          ? otherUserDetails?.certificate_image?.map((filename) => ({
              file: filename,
              date: null,
            }))
          : otherUserDetails?.certificateFileNDate || [],
      certificate_image: otherUserDetails?.certificate_image || [],
      contact_person_country_code:
        otherUserDetails?.contact_person_country_code || "",
      contact_person_email: otherUserDetails?.contact_person_email || "",
      contact_person_mobile_no:
        otherUserDetails?.contact_person_mobile_no || "",
      contact_person_mobile: otherUserDetails?.contact_person_mobile || "",
      contact_person_name: otherUserDetails?.contact_person_name || "",
      country_of_operation: otherUserDetails?.country_of_operation || [],
      interested_in: otherUserDetails?.interested_in || [],
      country_of_origin: otherUserDetails?.country_of_origin || "",
      description: otherUserDetails?.description || "",
      designation: otherUserDetails?.designation || "",
      estimated_delivery_time: otherUserDetails?.estimated_delivery_time || "",
      license_expiry_date: otherUserDetails?.license_expiry_date || null,
      license_image: otherUserDetails?.license_image || [],
      approx_yearly_purchase_value:
        otherUserDetails?.approx_yearly_purchase_value || [],
      license_no: otherUserDetails?.license_no || "",
      medical_practitioner_image: otherUserDetails?.medical_certificate || "",
      city: registeredAddress?.city || "",
      country: registeredAddress?.country || "",
      company_reg_address: registeredAddress?.supplier_address || "",
      land_mark: registeredAddress?.land_mark || "",
      locality: registeredAddress?.locality || "",
      pincode: registeredAddress?.pincode || "",
      state: registeredAddress?.state || "",
      type: registeredAddress?.type || "",
      registration_no: otherUserDetails?.registration_no || "",
      sales_person_name: otherUserDetails?.sales_person_name || "",
      supplier_address: otherUserDetails?.supplier_address || "",
      buyer_address: otherUserDetails?.buyer_address || "",
      supplier_country_code: otherUserDetails?.supplier_country_code || "",
      buyer_country_code: otherUserDetails?.buyer_country_code || "",
      supplier_id: otherUserDetails?.supplier_id || "",
      supplier_image: otherUserDetails?.supplier_image || "",
      buyer_image: otherUserDetails?.buyer_image || "",
      supplier_mobile: otherUserDetails?.supplier_mobile || "",
      supplier_name: otherUserDetails?.supplier_name || "",
      buyer_name: otherUserDetails?.buyer_name || "",
      buyer_email: otherUserDetails?.buyer_email || "",
      supplier_type: otherUserDetails?.supplier_type || "",
      buyer_type: otherUserDetails?.buyer_type || "",
      buyer_mobile: otherUserDetails?.buyer_mobile || "",
      tags: otherUserDetails?.tags || "",
      tax_image: otherUserDetails?.tax_image || "",
      tax_no: otherUserDetails?.tax_no || "",
      vat_reg_no: otherUserDetails?.vat_reg_no || "",
    });
  }
};

// Define options arrays for suppliers
export const supplierOptions = [
  { value: "Manufacturer", label: "Manufacturer" },
  { value: "Distributor", label: "Distributor" },
  { value: "Medical Practitioner", label: "Medical Practitioner" },
];

// Define options arrays
export const buyererOptions = [
  { value: "End User", label: "End User" },
  { value: "Distributor", label: "Distributor" },
  { value: "Medical Practitioner", label: "Medical Practitioner" },
];
