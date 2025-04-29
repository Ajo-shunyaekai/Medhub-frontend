import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-tooltip/dist/react-tooltip.css";
import countryList from "react-select-country-list";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Country, State, City } from "country-state-city";
import categoryArrays from "../../../../utils/Category";
import EditCertificate from "./EditCertificate";
import EditFile from "./EditFile";
import "./edit.css";
import styles from "./edit.module.css";
import { Formik, Form, Field, useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import DatePicker from "react-date-picker";
import moment from "moment";
import { MdClose } from "react-icons/md";
import {
  buyererOptions,
  initialValues,
  setInitFormValues,
  supplierOptions,
} from "./helper";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { fetchOtherUserData } from "../../../../redux/reducers/userDataSlice";
import { editProfileDetails } from "../../../../redux/reducers/adminSlice";
import { toast } from "react-toastify";

// MultiSelectOption Component
const MultiSelectOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
    <label>{children}</label>
  </components.Option>
);

// MultiSelectDropdown Component
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

const EditProfileDetails = () => {
  const navigate = useNavigate();
  const { userType, id } = useParams();
  const dispatch = useDispatch();
  const { otherUserDetails } = useSelector((state) => state?.userReducer);
  // State for country, state, city selection
  const [category, setCategory] = useState([]);
  // Country list for select
  const countries = countryList()?.getData();

  const validationSchema = Yup.object().shape({
    supplier_type: Yup.string().when([], {
      is: () => userType === "supplier",
      then: (schema) => schema.required("Company Type is required."),
      otherwise: (schema) => schema.notRequired(),
    }),
    buyer_type: Yup.string().when([], {
      is: () => userType === "buyer",
      then: (schema) => schema.required("Company Type is required."),
      otherwise: (schema) => schema.notRequired(),
    }),
    supplier_name: Yup.string().when([], {
      is: () => userType === "supplier",
      then: (schema) => schema.required("Company Name is required."),
      otherwise: (schema) => schema.notRequired(),
    }),
    buyer_name: Yup.string().when([], {
      is: () => userType === "buyer",
      then: (schema) => schema.required("Company Name is required."),
      otherwise: (schema) => schema.notRequired(),
    }),
    registration_no: Yup.string().required(
      "Company Registration No. is required."
    ),
    vat_reg_no: Yup.string().required("GST/VAT Registration No. is required."),
    buyer_email: Yup.string().when([], {
      is: () => userType === "buyer",
      then: (schema) => schema.required("Company Email ID is required."),
      otherwise: (schema) => schema.notRequired(),
    }),
    ...(userType === "supplier"
      ? {
          supplier_mobile: Yup.string()
            .required("Company Phone No. is required")
            .test(
              "phone-validation",
              "Company Phone No. is required",
              function (value) {
                const { supplier_country_code } = this.parent;
                const fullNumber = supplier_country_code?.includes("+")
                  ? `${supplier_country_code || ""} ${value || ""}`
                  : `+${supplier_country_code || ""} ${value || ""}`;

                if (!value && !supplier_country_code) {
                  return this.createError({
                    message: "Company Phone No. is required",
                  });
                }

                if (value && supplier_country_code) {
                  if (!isValidPhoneNumber(fullNumber)) {
                    return this.createError({
                      message: "Invalid Company Phone No.",
                    });
                  }
                }

                return true;
              }
            ),
        }
      : {
          buyer_mobile: Yup.string().test(
            "phone-validation",
            "Company Phone No. is required",
            function (value) {
              const { buyer_country_code } = this.parent;
              const fullNumber = buyer_country_code?.includes("+")
                ? `${buyer_country_code || ""} ${value || ""}`
                : `+${buyer_country_code || ""} ${value || ""}`;

              if (!value && !buyer_country_code) {
                return this.createError({
                  message: "Company Phone No. is required",
                });
              }

              if (value && buyer_country_code) {
                if (!isValidPhoneNumber(fullNumber)) {
                  return this.createError({
                    message: "Invalid Company Phone No.",
                  });
                }
              }

              return true;
            }
          ),
        }),
    supplier_address: Yup.string().when([], {
      is: () => userType === "supplier",
      then: (schema) => schema.required("Company Billing Address is required."),
      otherwise: (schema) => schema.notRequired(),
    }),
    buyer_address: Yup.string().when([], {
      is: () => userType === "buyer",
      then: (schema) => schema.required("Company Billing Address is required."),
      otherwise: (schema) => schema.notRequired(),
    }),
    locality: Yup.string().required("Area/Locality/Road Name is required."),
    country: Yup.string().required("Country is required."),
    country_of_origin: Yup.string().required("Country of Origin is required."),
    tags: Yup.string().when([], {
      is: () => userType === "supplier",
      then: (schema) => schema.required("Tags are required."),
      otherwise: (schema) => schema.notRequired(),
    }),
    categories: Yup.array().when([], {
      is: () => userType === "supplier",
      then: (schema) =>
        schema
          .min(1, "At least one category is required.")
          .required("Categories are required."),
      otherwise: (schema) => schema.notRequired(),
    }),
    description: Yup.string().required("About Company is required."),
    // bank_details: Yup.string().required("Bank Details is required."),
    bank_details: Yup.string().when([], {
      is: () => userType === "supplier",
      then: (schema) => schema.required("Bank Details is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    activity_code: Yup.string().required(
      "Business/Trade Activity Code is required."
    ),
    contact_person_name: Yup.string().required("Contact Name is required."),
    contact_person_email: Yup.string().required("Email ID is required."),
    ...(userType === "supplier"
      ? {
          contact_person_mobile_no: Yup.string()
            .required("Mobile No. is required")
            .test(
              "phone-validation",
              "Mobile No. is required",
              function (value) {
                const { contact_person_country_code } = this.parent;
                const fullNumber = contact_person_country_code?.includes("+")
                  ? `${contact_person_country_code || ""} ${value || ""}`
                  : `+${contact_person_country_code || ""} ${value || ""}`;

                if (!value && !contact_person_country_code) {
                  return this.createError({
                    message: "Mobile No. is required",
                  });
                }

                if (value && contact_person_country_code) {
                  if (!isValidPhoneNumber(fullNumber)) {
                    return this.createError({
                      message: "Invalid Mobile No.",
                    });
                  }
                }

                return true;
              }
            ),
        }
      : {
          contact_person_mobile: Yup.string().test(
            "phone-validation",
            "Mobile No. is required",
            function (value) {
              const { contact_person_country_code } = this.parent;
              const fullNumber = contact_person_country_code?.includes("+")
                ? `${contact_person_country_code || ""} ${value || ""}`
                : `+${contact_person_country_code || ""} ${value || ""}`;

              if (!value && !contact_person_country_code) {
                return this.createError({
                  message: "Mobile No. is required",
                });
              }

              if (value && contact_person_country_code) {
                if (!isValidPhoneNumber(fullNumber)) {
                  return this.createError({ message: "Invalid Mobile No." });
                }
              }

              return true;
            }
          ),
        }),
    designation: Yup.string().required("Designation is required."),
    certificateFileNDate: Yup.array().of(
      Yup.object().shape({
        file: Yup.mixed().test(
          "file-required",
          "Certificate file is required",
          function (value) {
            if (!value) return false;
            // If file is an array, ensure it's not empty
            if (Array.isArray(value)) return value.length > 0;
            // If file is a string (existing file name), check it's not empty
            if (typeof value === "string") return value.trim().length > 0;
            // If file is a File object
            if (typeof value === "object" && value.name) return true;
            return false;
          }
        ),
        date: Yup.mixed(), // optional or add validation if needed
      })
    ),
    license_image: Yup.array().max(4, "You can upload up to 4 license image."),
    license_imageNew: Yup.array()
      .max(4, "You can upload up to 4 license image.")
      .of(
        Yup.mixed()
          .required("A file is required.")
          .test(
            "fileSize",
            "File too large",
            (value) => value && value.size <= 1024 * 1024 * 5 // Max 5MB
          )
      )
      .test(
        "at-least-one-medical",
        "At least one license image is required.",
        function (value) {
          const { license_image } = this.parent;
          const totalLength =
            (license_image?.length || 0) + (value?.length || 0);
          return totalLength > 0;
        }
      ),
    medical_practitioner_image: Yup.array().max(
      4,
      "You can upload up to 4 medical certificate."
    ),

    medical_practitioner_imageNew: Yup.array()
      .max(4, "You can upload up to 4 medical certificates.")
      .of(
        Yup.mixed()
          .required("A file is required.")
          .test(
            "fileSize",
            "File too large",
            (value) => value && value.size <= 1024 * 1024 * 5 // Max 5MB
          )
      )
      .when(["supplier_type", "buyer_type"], {
        is: (supplier_type, buyer_type) =>
          (userType === "supplier" &&
            supplier_type === "Medical Practitioner") ||
          (userType === "buyer" && buyer_type === "Medical Practitioner"),
        then: Yup.array()
          .min(1, "At least one medical certificate is required.")
          .test(
            "at-least-one-medical",
            "At least one medical certificate is required.",
            function (value) {
              const { medical_practitioner_image } = this.parent;
              const totalLength =
                (medical_practitioner_image?.length || 0) +
                (value?.length || 0);
              return totalLength > 0;
            }
          ),
        otherwise: Yup.array().notRequired(), // No validation if not a "Medical Practitioner"
      }),

    // Supplier Image (only for supplier)
    supplier_image: Yup.array().when([], {
      is: () => userType === "supplier",
      then: (schema) => schema.max(4, "You can upload up to 4 company images."),
      otherwise: (schema) => schema.notRequired(),
    }),
    supplier_imageNew: Yup.array().when([], {
      is: () => userType === "supplier",
      then: (schema) =>
        schema
          .max(4, "You can upload up to 4 company images.")
          .of(
            Yup.mixed()
              .required("A file is required.")
              .test(
                "fileSize",
                "File too large",
                (value) => value && value.size <= 1024 * 1024 * 5
              )
          )
          .test(
            "at-least-one-supplier-image",
            "At least one company image is required.",
            function (value) {
              const { supplier_image } = this.parent;
              const totalLength =
                (supplier_image?.length || 0) + (value?.length || 0);
              return totalLength > 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    // Buyer Image (only for buyer)
    buyer_image: Yup.array().when([], {
      is: () => userType === "buyer",
      then: (schema) => schema.max(4, "You can upload up to 4 company images."),
      otherwise: (schema) => schema.notRequired(),
    }),
    buyer_imageNew: Yup.array().when([], {
      is: () => userType === "buyer",
      then: (schema) =>
        schema
          .max(4, "You can upload up to 4 company images.")
          .of(
            Yup.mixed()
              .required("A file is required.")
              .test(
                "fileSize",
                "File too large",
                (value) => value && value.size <= 1024 * 1024 * 5
              )
          )
          .test(
            "at-least-one-buyer-image",
            "At least one company image is required.",
            function (value) {
              const { buyer_image } = this.parent;
              const totalLength =
                (buyer_image?.length || 0) + (value?.length || 0);
              return totalLength > 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      // Append fields as usual
      Object.keys(values).forEach((key) => {
        const value = values[key];
        // Fixing condition to check for 'productPricingDetails' and 'stockedInDetails'
        if (key != "certificateFileNDate") {
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

      const certificateFileNDateUpdated = JSON.stringify(
        values?.certificateFileNDate?.map((section) => {
          return {
            date: section?.date || "",
            file:
              typeof section?.file == "string"
                ? section?.file
                : section?.file?.[0] || "",
          };
        })
      );

      formData.append(
        "certificateFileNDate",
        certificateFileNDateUpdated?.length == 0
          ? [{ date: "", file: "" }]
          : certificateFileNDateUpdated
      );

      formData.append(
        "usertype",
        userType == "supplier" ? "Supplier" : "Buyer"
      );
      // Custom submit handler with e.preventDefault()

      // Dispatch the editProfileDetails action (or any other submit action)
      dispatch(editProfileDetails({ userType, id, values: formData })).then(
        (response) => {
          if (response?.meta.requestStatus === "fulfilled") {
            navigate(-1);
          }
        }
      );
    },
  });

  useEffect(() => {
    userType && id && dispatch(fetchOtherUserData({ userType, id }));
  }, [id]);

  useEffect(() => {
    setInitFormValues(formik, otherUserDetails);
  }, [otherUserDetails]);

  // Populate category options from categoryArrays
  useEffect(() => {
    const categoryOptions = categoryArrays?.map((cat) => ({
      value: cat.name,
      label: cat.name,
    }));
    setCategory(categoryOptions || []);
  }, []);

  // Placeholder for dropdown button label
  const getDropdownButtonLabel = ({ value }) => {
    if (!value || value?.length === 0) return "Select...";
    return value?.map((item) => item.label)?.join(", ");
  };

  // Define handlePhoneChange inside Formik to access setFieldValue
  const handlePhoneChange = (name, value) => {
    try {
      if (!value) {
        formik.setFieldError(
          name,
          name == "buyer_mobile" || name == "supplier_mobile"
            ? "Company Phone No. is required."
            : "Mobile No. is required."
        );
        return;
      }

      const phoneNumber = parsePhoneNumber(value);

      // If nothing is entered yet, clear fields
      if (!value || !phoneNumber) {
        if (userType === "buyer") {
          formik.setFieldValue("buyer_country_code", "");
          formik.setFieldValue("buyer_mobile", "");
        } else if (userType === "supplier") {
          formik.setFieldValue("supplier_country_code", "");
          formik.setFieldValue("supplier_mobile", "");
        }
        return;
      }

      // Extract components
      const countryCode = phoneNumber.countryCallingCode;
      const nationalNumber = phoneNumber.nationalNumber;

      // Update Formik fields based on userType
      if (userType === "buyer") {
        if (name === "buyer_mobile") {
          formik.setFieldValue("buyer_country_code", countryCode);
          formik.setFieldValue("buyer_mobile", nationalNumber);
        } else if (name === "contact_person_mobile") {
          formik.setFieldValue("contact_person_country_code", countryCode);
          formik.setFieldValue("contact_person_mobile", nationalNumber);
        }
      } else if (userType === "supplier") {
        if (name === "supplier_mobile") {
          formik.setFieldValue("supplier_country_code", countryCode);
          formik.setFieldValue("supplier_mobile", nationalNumber);
        } else if (name === "contact_person_mobile_no") {
          formik.setFieldValue("contact_person_country_code", countryCode);
          formik.setFieldValue("contact_person_mobile_no", nationalNumber);
        }
      }

      // Touch the field to trigger validation
      formik.setFieldTouched(name, true, false);
    } catch (error) {
      // Do not throw or set error here — let Yup handle it via validationSchema
      console.warn("Phone parsing error:", error.message);
    }
  };

  return (
    <div className={styles?.container}>
      <div className={styles?.headContainer}>
        <span className={styles?.heading}>Edit Profile Details</span>
      </div>
      <FormikProvider value={formik}>
        <form
          className={styles?.form}
          onSubmit={async (e) => {
            e.preventDefault(); // Prevent the default form submission behavior

            // Wait for form validation to complete
            const errors = await formik?.validateForm();

            // Check if there are any validation errors after validation
            if (Object.keys(errors).length > 0) {
              // Mark all fields as touched
              for (const property in errors) {
                formik?.setFieldTouched(property, true);
              }

              // Log the touched fields (for debugging)
              // Show error toast if there are validation errors
              toast.error("Please fill the details correctly");
            } else {
              // Submit the form if no errors
              formik.handleSubmit();
            }
          }}
        >
          <div className={styles?.section}>
            <span className={styles?.formHead}>Company Details</span>
            <div className={styles?.formSection}>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Company Type<span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className={styles?.formSelect}
                  options={
                    userType === "supplier" ? supplierOptions : buyererOptions
                  }
                  name={
                    userType === "supplier" ? "supplier_type" : "buyer_type"
                  }
                  placeholder="Select Company Type"
                  value={(userType === "supplier"
                    ? supplierOptions
                    : buyererOptions
                  )?.find(
                    (option) =>
                      option?.value ===
                      (userType === "supplier"
                        ? formik?.values?.supplier_type
                        : formik?.values?.buyer_type)
                  )}
                  onChange={(option) => {
                    formik?.setFieldValue(
                      userType === "supplier" ? "supplier_type" : "buyer_type",
                      option?.value
                    );
                  }}
                />
                {userType === "supplier"
                  ? formik?.touched?.supplier_type &&
                    formik?.errors?.supplier_type && (
                      <span className={styles?.error}>
                        {formik?.errors?.supplier_type}
                      </span>
                    )
                  : formik?.touched?.buyer_type &&
                    formik?.errors?.buyer_type && (
                      <span className={styles?.error}>
                        {formik?.errors?.buyer_type}
                      </span>
                    )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Company Name<span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Company Name"
                  name={
                    userType === "supplier" ? "supplier_name" : "buyer_name"
                  }
                  value={
                    userType === "supplier"
                      ? formik?.values?.supplier_name
                      : formik?.values?.buyer_name
                  }
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {userType === "supplier"
                  ? formik?.touched?.supplier_name &&
                    formik?.errors?.supplier_name && (
                      <span className={styles?.error}>
                        {formik?.errors?.supplier_name}
                      </span>
                    )
                  : formik?.touched?.buyer_name &&
                    formik?.errors?.buyer_name && (
                      <span className={styles?.error}>
                        {formik?.errors?.buyer_name}
                      </span>
                    )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Company Registration No.
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Company Registration No."
                  name="registration_no"
                  value={formik?.values?.registration_no}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.registration_no &&
                  formik?.errors?.registration_no && (
                    <span className={styles?.error}>
                      {formik?.errors?.registration_no}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  GST/VAT Registration No.
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter GST/VAT Registration No."
                  name="vat_reg_no"
                  value={formik?.values?.vat_reg_no}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.vat_reg_no && formik?.errors?.vat_reg_no && (
                  <span className={styles?.error}>
                    {formik?.errors?.vat_reg_no}
                  </span>
                )}
              </div>

              {userType === "buyer" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>
                    Company Email ID
                    <span className={styles?.labelStamp}>*</span>
                  </label>
                  <Field
                    className={styles?.formInput}
                    type="text"
                    placeholder="Enter Company Email ID"
                    name="buyer_email"
                    value={formik?.values?.buyer_email}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  />
                  {formik?.touched?.buyer_email &&
                    formik?.errors?.buyer_email && (
                      <span className={styles?.error}>
                        {formik?.errors?.buyer_email}
                      </span>
                    )}
                </div>
              )}

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Company Phone No.
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <PhoneInput
                  defaultCountry="gb"
                  name={
                    userType === "supplier" ? "supplier_mobile" : "buyer_mobile"
                  }
                  value={
                    userType === "supplier"
                      ? `+${formik.values.supplier_country_code || ""}${
                          formik.values.supplier_mobile || ""
                        }`
                      : `+${formik.values.buyer_country_code || ""}${
                          formik.values.buyer_mobile || ""
                        }`
                  }
                  onChange={(value) => {
                    const fieldName =
                      userType === "supplier"
                        ? "supplier_mobile"
                        : "buyer_mobile";

                    handlePhoneChange(fieldName, value);
                    formik.setFieldTouched(fieldName, true, false); // <-- This is crucial
                  }}
                  // onBlur={formik?.handleBlur}
                />
                {userType === "supplier"
                  ? formik.touched["supplier_mobile"] &&
                    formik.errors["supplier_mobile"] && (
                      <span className={styles.error}>
                        {formik.errors["supplier_mobile"]}
                      </span>
                    )
                  : formik.touched["buyer_mobile"] &&
                    formik.errors["buyer_mobile"] && (
                      <span className={styles.error}>
                        {formik.errors["buyer_mobile"]}
                      </span>
                    )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Company Billing Address
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Company Billing Address"
                  name={
                    userType === "supplier"
                      ? "supplier_address"
                      : "buyer_address"
                  }
                  value={
                    userType === "supplier"
                      ? formik?.values?.supplier_address
                      : formik?.values?.buyer_address
                  }
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {userType === "supplier"
                  ? formik?.touched?.supplier_address &&
                    formik?.errors?.supplier_address && (
                      <span className={styles?.error}>
                        {formik?.errors?.supplier_address}
                      </span>
                    )
                  : formik?.touched?.buyer_address &&
                    formik?.errors?.buyer_address && (
                      <span className={styles?.error}>
                        {formik?.errors?.buyer_address}
                      </span>
                    )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Area/Locality/Road Name
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Area/Locality/Road Name"
                  name="locality"
                  value={formik?.values?.locality}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.locality && formik?.errors?.locality && (
                  <span className={styles?.error}>
                    {formik?.errors?.locality}
                  </span>
                )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Landmark</label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Landmark"
                  name="land_mark"
                  value={formik?.values?.land_mark}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Country
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  options={Country?.getAllCountries()}
                  getOptionLabel={(option) => option?.name}
                  getOptionValue={(option) => option?.isoCode}
                  name="country"
                  value={Country?.getAllCountries()?.find(
                    (country) => country?.name === formik?.values?.country
                  )}
                  onChange={(country) => {
                    formik?.setFieldValue("country", country?.name);
                    formik?.setFieldValue("state", "");
                    formik?.setFieldValue("city", "");
                  }}
                  placeholder="Select Country"
                />
                {formik?.touched?.country && formik?.errors?.country && (
                  <span className={styles?.error}>
                    {formik?.errors?.country}
                  </span>
                )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>State/Province</label>
                <Select
                  options={
                    Country?.getAllCountries()?.find(
                      (country) => country?.name === formik?.values?.country
                    )
                      ? [
                          ...State?.getStatesOfCountry(
                            Country?.getAllCountries()?.find(
                              (country) =>
                                country?.name === formik?.values?.country
                            )?.isoCode
                          ),
                          { name: "Other", isoCode: "OTHER" },
                        ]
                      : []
                  }
                  getOptionLabel={(option) => option?.name}
                  getOptionValue={(option) => option?.isoCode}
                  value={[
                    ...State?.getStatesOfCountry(
                      Country?.getAllCountries()?.find(
                        (country) => country?.name === formik?.values?.country
                      )?.isoCode
                    ),
                    { name: "Other", isoCode: "OTHER" },
                  ]?.find((state) => state?.name === formik?.values?.state)}
                  onChange={(state) => {
                    formik?.setFieldValue("state", state?.name);
                    formik?.setFieldValue("city", "");
                  }}
                  placeholder="Select State"
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>City/Town</label>
                <Select
                  options={
                    [
                      ...State?.getStatesOfCountry(
                        Country?.getAllCountries()?.find(
                          (country) => country?.name === formik?.values?.country
                        )?.isoCode
                      ),
                      { name: "Other", isoCode: "OTHER" },
                    ]?.find((state) => state?.name === formik?.values?.state) &&
                    [
                      ...State?.getStatesOfCountry(
                        Country?.getAllCountries()?.find(
                          (country) => country?.name === formik?.values?.country
                        )?.isoCode
                      ),
                      { name: "Other", isoCode: "OTHER" },
                    ]?.find((state) => state?.name === formik?.values?.state)
                      .isoCode !== "OTHER"
                      ? [
                          ...City.getCitiesOfState(
                            [
                              ...State?.getStatesOfCountry(
                                Country?.getAllCountries()?.find(
                                  (country) =>
                                    country?.name === formik?.values?.country
                                )?.isoCode
                              ),
                              { name: "Other", isoCode: "OTHER" },
                            ]?.find(
                              (state) => state?.name === formik?.values?.state
                            )?.countryCode,
                            [
                              ...State?.getStatesOfCountry(
                                Country?.getAllCountries()?.find(
                                  (country) =>
                                    country?.name === formik?.values?.country
                                )?.isoCode
                              ),
                              { name: "Other", isoCode: "OTHER" },
                            ]?.find(
                              (state) => state?.name === formik?.values?.state
                            )?.isoCode
                          ),
                          { name: "Other" },
                        ]
                      : [{ name: "Other" }]
                  }
                  getOptionLabel={(option) => option?.name}
                  getOptionValue={(option) => option?.name}
                  value={[
                    ...City.getCitiesOfState(
                      [
                        ...State?.getStatesOfCountry(
                          Country?.getAllCountries()?.find(
                            (country) =>
                              country?.name === formik?.values?.country
                          )?.isoCode
                        ),
                        { name: "Other", isoCode: "OTHER" },
                      ]?.find((state) => state?.name === formik?.values?.state)
                        ?.countryCode,
                      [
                        ...State?.getStatesOfCountry(
                          Country?.getAllCountries()?.find(
                            (country) =>
                              country?.name === formik?.values?.country
                          )?.isoCode
                        ),
                        { name: "Other", isoCode: "OTHER" },
                      ]?.find((state) => state?.name === formik?.values?.state)
                        ?.isoCode
                    ),
                    { name: "Other" },
                  ]?.find((city) => city?.name === formik?.values?.city)}
                  onChange={(city) => {
                    formik?.setFieldValue("city", city?.name);
                  }}
                  placeholder="Select City"
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Pincode/Postcode</label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Pincode/Postcode"
                  name="pincode"
                  value={formik?.values?.pincode}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Sales Person Name</label>
                <Field
                  applause
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Sales Person Name"
                  name="sales_person_name"
                  value={formik?.values?.sales_person_name}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Country of Origin
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className="signup-forms-sections-select"
                  options={countries}
                  value={countries?.find(
                    (option) =>
                      option.label === formik?.values?.country_of_origin
                  )}
                  name="country_of_origin"
                  onBlur={formik?.handleBlur}
                  onChange={(option) => {
                    formik?.setFieldValue("country_of_origin", option?.label);
                  }}
                />
                {formik?.touched?.country_of_origin &&
                  formik?.errors?.country_of_origin && (
                    <span className={styles?.error}>
                      {formik?.errors?.country_of_origin}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Country of Operation
                </label>
                {countries?.length > 0 && (
                  <MultiSelectDropdown
                    className="signup-forms-sections-select custom-multi-select"
                    options={countries}
                    value={
                      formik.values?.country_of_operation?.map((country) =>
                        countries?.find((c) => c.label === country)
                      ) || []
                    }
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions?.map(
                        (option) => option.label
                      );
                      formik.setFieldValue(
                        "country_of_operation",
                        selectedValues
                      );
                    }}
                    getDropdownButtonLabel={getDropdownButtonLabel}
                    style={{ width: "100%!important" }}
                  />
                )}
                {formik?.touched?.country_of_operation &&
                  formik?.errors?.country_of_operation && (
                    <span className={styles?.error}>
                      {formik.errors.country_of_operation}
                    </span>
                  )}
              </div>

              {userType === "buyer" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>
                    Approx. Yearly Purchase Value
                  </label>
                  <Field
                    className={styles?.formInput}
                    type="text"
                    placeholder="Enter Approx. Yearly Purchase Value"
                    name="approx_yearly_purchase_value"
                    value={formik?.values?.approx_yearly_purchase_value}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  />
                </div>
              )}

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Company License No.</label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Company License No."
                  name="license_no"
                  value={formik?.values?.license_no}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  License Expiry/Renewal Date
                </label>
                <DatePicker
                  className={styles?.formInput}
                  clearIcon={null}
                  format="dd/MM/yyyy"
                  placeholder="dd/MM/yyyy"
                  name="license_expiry_date"
                  value={
                    formik?.values?.license_expiry_date
                      ? moment(
                          formik?.values?.license_expiry_date,
                          "DD/MM/YYYY"
                        ).toDate()
                      : null
                  }
                  minDate={new Date()}
                  onChange={(date) => {
                    const formattedDate = date
                      ? moment(date).format("DD/MM/YYYY")
                      : null;
                    formik?.setFieldValue(`license_expiry_date`, formattedDate);
                    formik?.setFieldTouched(`license_expiry_date`, true, true);
                  }}
                  onBlur={formik?.handleBlur}
                  disabledDate={(current) =>
                    current && current < moment()?.endOf("day")
                  }
                />
              </div>

              {userType === "supplier" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>
                    Tags
                    <span className={styles?.labelStamp}>*</span>
                  </label>
                  <Field
                    className={styles?.formInput}
                    type="text"
                    placeholder="Enter Tags"
                    name="tags"
                    value={formik?.values?.tags}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  />
                  {formik?.touched?.tags && formik?.errors?.tags && (
                    <span className={styles?.error}>
                      {formik?.errors?.tags}
                    </span>
                  )}
                </div>
              )}

              {userType === "buyer" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>Interested in</label>
                  {category.length > 0 && (
                    <MultiSelectDropdown
                      className="signup-forms-sections-select custom-multi-select"
                      options={category}
                      value={
                        formik.values?.interested_in?.map((cat) =>
                          category?.find((c) => c.label === cat)
                        ) || []
                      }
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions?.map(
                          (option) => option.label
                        );
                        formik.setFieldValue("interested_in", selectedValues);
                      }}
                      getDropdownButtonLabel={getDropdownButtonLabel}
                      style={{ width: "100%!important" }}
                    />
                  )}
                  {formik?.touched?.interested_in &&
                    formik?.errors?.interested_in && (
                      <span className={styles?.error}>
                        {formik.errors.interested_in}
                      </span>
                    )}
                </div>
              )}

              {userType === "supplier" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>
                    Categories you Trade In
                    <span className={styles?.labelStamp}>*</span>
                  </label>
                  {category?.length > 0 && (
                    <MultiSelectDropdown
                      className="signup-forms-sections-select custom-multi-select"
                      options={category}
                      value={
                        formik.values?.categories?.map((cat) =>
                          category?.find((c) => c.label === cat)
                        ) || []
                      }
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions?.map(
                          (option) => option.label
                        );
                        formik.setFieldValue("categories", selectedValues);
                      }}
                      getDropdownButtonLabel={getDropdownButtonLabel}
                      style={{ width: "100%!important" }}
                    />
                  )}
                  {formik?.touched?.categories &&
                    formik?.errors?.categories && (
                      <span className={styles?.error}>
                        {formik?.errors?.categories}
                      </span>
                    )}
                </div>
              )}

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  About Company
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  as="textarea"
                  className={styles?.formInput}
                  placeholder="Enter About Company"
                  name="description"
                  value={formik?.values?.description}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.description &&
                  formik?.errors?.description && (
                    <span className={styles?.error}>
                      {formik?.errors?.description}
                    </span>
                  )}
              </div>

              {userType == "supplier" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>
                    Bank Details
                    <span className={styles?.labelStamp}>*</span>
                  </label>
                  <Field
                    as="textarea"
                    className={styles?.formInput}
                    placeholder="Enter Bank Details"
                    name="bank_details"
                    value={formik?.values?.bank_details}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  />
                  {formik?.touched?.bank_details &&
                    formik?.errors?.bank_details && (
                      <span className={styles?.error}>
                        {formik?.errors?.bank_details}
                      </span>
                    )}
                </div>
              )}

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Business/Trade Activity Code
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  as="textarea"
                  className={styles?.formInput}
                  placeholder="Enter Business/Trade Activity Code"
                  name="activity_code"
                  value={formik?.values?.activity_code}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.activity_code &&
                  formik?.errors?.activity_code && (
                    <span className={styles?.error}>
                      {formik?.errors?.activity_code}
                    </span>
                  )}
              </div>
            </div>
          </div>

          <div className={styles?.section}>
            <span className={styles?.formHead}>Contact Details</span>
            <div className={styles?.formSection}>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Contact Name<span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Contact Name"
                  name="contact_person_name"
                  value={formik?.values?.contact_person_name}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.contact_person_name &&
                  formik?.errors?.contact_person_name && (
                    <span className={styles?.error}>
                      {formik?.errors?.contact_person_name}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Email ID
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Contact Name"
                  name="contact_person_email"
                  value={formik?.values?.contact_person_email}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.contact_person_email &&
                  formik?.errors?.contact_person_email && (
                    <span className={styles?.error}>
                      {formik?.errors?.contact_person_email}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Mobile No.
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <PhoneInput
                  defaultCountry="gb"
                  name={
                    userType === "supplier"
                      ? "contact_person_mobile_no"
                      : "contact_person_mobile"
                  }
                  value={
                    userType === "supplier"
                      ? `+${formik.values.contact_person_country_code || ""}${
                          formik.values.contact_person_mobile_no || ""
                        }`
                      : `+${formik.values.contact_person_country_code || ""}${
                          formik.values.contact_person_mobile || ""
                        }`
                  }
                  onChange={(value) => {
                    const fieldName =
                      userType === "supplier"
                        ? "contact_person_mobile_no"
                        : "contact_person_mobile";

                    handlePhoneChange(fieldName, value);
                    formik.setFieldTouched(fieldName, true, false); // <-- This is crucial
                  }}
                  // onBlur={formik?.handleBlur}
                />
                {userType === "supplier"
                  ? formik.touched["contact_person_mobile_no"] &&
                    formik.errors["contact_person_mobile_no"] && (
                      <span className={styles.error}>
                        {formik.errors["contact_person_mobile_no"]}
                      </span>
                    )
                  : formik.touched["contact_person_mobile"] &&
                    formik.errors["contact_person_mobile"] && (
                      <span className={styles.error}>
                        {formik.errors["contact_person_mobile"]}
                      </span>
                    )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Designation
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Designation"
                  name="designation"
                  value={formik?.values?.designation}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.designation &&
                  formik?.errors?.designation && (
                    <span className={styles?.error}>
                      {formik?.errors?.designation}
                    </span>
                  )}
              </div>
            </div>
          </div>

          <div className={styles?.section}>
            <div className={styles?.formHeadSection}>
              <span className={styles?.formHead}>Certificate</span>
              {formik?.values?.certificateFileNDate?.length < 4 && (
                <span
                  className={styles?.formAddButton}
                  onClick={() => {
                    if (formik?.values?.certificateFileNDate?.length < 4) {
                      formik?.setFieldValue("certificateFileNDate", [
                        ...formik?.values?.certificateFileNDate,
                        {
                          file: [],
                          date: "",
                          preview: false,
                        },
                      ]);
                    }
                  }}
                >
                  Add More
                </span>
              )}
            </div>

            {formik?.values?.certificateFileNDate?.map((ele, index) => (
              <div
                key={`certification_${index}`}
                className={styles?.formSection}
              >
                
                  <Field name={`certificateFileNDate.${index}.file`}>
                    {({ field }) => (
                      <EditCertificate
                        filePath={
                          userType == "supplier"
                            ? "supplier/certificate_image"
                            : "buyer/certificate_images"
                        }
                        formik={formik}
                        fieldInputName={`certificateFileNDate.${index}.file`}
                        setFieldValue={formik?.setFieldValue}
                        setFieldTouched={formik?.setFieldTouched}
                        initialValues={formik?.values}
                        label="Upload Certificate"
                        selectedFile={ele.file}
                        preview={ele.preview}
                        fileIndex={index}
                        isEdit={false}
                      />
                    )}
                  </Field>
                  <span className={styles?.error}>
                    {formik?.touched?.certificateFileNDate?.[index]?.file &&
                      formik?.errors?.certificateFileNDate?.[index]?.file}
                  </span>
                
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>Date of Expiry</label>
                  <div className={styles?.tooltipContainer}>
                    <DatePicker
                      className={styles?.formDate}
                      clearIcon={null}
                      format="dd/MM/yyyy"
                      placeholder="dd/MM/yyyy"
                      name={`certificateFileNDate.${index}.date`}
                      value={
                        ele.date
                          ? moment(ele.date, "DD/MM/YYYY").toDate()
                          : null
                      }
                      minDate={new Date()}
                      onChange={(date) => {
                        const formattedDate = date
                          ? moment(date).format("DD/MM/YYYY")
                          : null;
                        formik?.setFieldValue(
                          `certificateFileNDate.${index}.date`,
                          formattedDate
                        );
                        formik?.setFieldTouched(
                          `certificateFileNDate.${index}.date`,
                          true,
                          true
                        );
                      }}
                      onBlur={formik?.handleBlur}
                      disabledDate={(current) =>
                        current && current < moment()?.endOf("day")
                      }
                    />
                  </div>
                  <span className={styles?.error}>
                    {formik?.touched?.certificateFileNDate?.[index]?.date &&
                      formik?.errors?.certificateFileNDate?.[index]?.date}
                  </span>
                </div>

                {formik?.values?.certificateFileNDate?.length > 1 && (
                  <div
                    className={styles?.formCloseSection}
                    onClick={() => {
                      formik?.setFieldValue(
                        `certificateFileNDate.${index}.file`,
                        []
                      );
                      formik?.setFieldValue(
                        `certificateFileNDate.${index}.date`,
                        ""
                      );
                      formik?.setFieldValue(
                        `certificateFileNDate.${index}.preview`,
                        false
                      );

                      const updatedList =
                        formik?.values?.certificateFileNDate?.filter(
                          (_, elindex) => elindex !== index
                        );
                      const updatedList2 =
                        formik?.values?.certificate_image?.filter(
                          (_, elindex) => elindex !== index
                        );
                      formik?.setFieldValue(
                        "certificateFileNDate",
                        updatedList
                      );
                      formik?.setFieldValue("certificate_image", updatedList2);
                    }}
                  >
                    <span className={styles?.formclose}>
                      <MdClose className={styles?.icon} />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles?.section}>
            <span className={styles?.formHead}>Documents</span>
            <div className={styles?.formSection}>
              <EditFile
                filePath={
                  userType == "supplier"
                    ? "supplier/supplierImage_files"
                    : "buyer/buyer_images"
                }
                error={
                  userType == "supplier"
                    ? formik?.errors?.supplier_imageNew
                    : formik?.errors?.buyer_imageNew
                }
                formik={formik}
                productDetails={otherUserDetails}
                maxFilesCount={1}
                maxFiles={
                  userType == "supplier"
                    ? 1 - (formik?.values?.supplier_image?.length || 0)
                    : 1 - (formik?.values?.buyer_image?.length || 0)
                }
                fieldInputName={
                  userType == "supplier"
                    ? "supplier_imageNew"
                    : "buyer_imageNew"
                }
                oldFieldName={
                  userType == "supplier" ? "supplier_image" : "buyer_image"
                }
                existingFiles={
                  userType == "supplier"
                    ? formik?.values?.supplier_image
                    : formik?.values?.buyer_image
                }
                setFieldValue={formik?.setFieldValue}
                setFieldTouched={formik?.setFieldTouched}
                initialValues={formik?.values}
                label="Upload Company Logo"
                acceptTypes={{
                  "image/png": [],
                  "image/jpeg": [],
                  "image/jpg": [],
                  "application/pdf": [],
                }}
              />

              <EditFile
                filePath={
                  userType == "supplier"
                    ? "supplier/license_image"
                    : "buyer/license_images"
                }
                error={formik?.errors?.license_imageNew}
                formik={formik}
                productDetails={otherUserDetails}
                maxFilesCount={4}
                maxFiles={4 - (formik?.values?.license_image?.length || 0)}
                fieldInputName="license_imageNew"
                oldFieldName="license_image"
                existingFiles={formik?.values?.license_image}
                setFieldValue={formik?.setFieldValue}
                setFieldTouched={formik?.setFieldTouched}
                initialValues={formik?.values}
                label="Upload Trade License"
                acceptTypes={{
                  "image/png": [],
                  "image/jpeg": [],
                  "image/jpg": [],
                  "application/pdf": [],
                }}
              />

              {(userType === "supplier"
                ? formik?.values?.supplier_type
                : formik?.values?.buyer_type) === "Medical Practitioner" && (
                <EditFile
                  filePath={
                    userType == "supplier"
                      ? "supplier/medical_practitioner_image"
                      : "buyer/medical_practitioner_images"
                  }
                  error={formik?.errors?.medical_practitioner_imageNew}
                  formik={formik}
                  productDetails={otherUserDetails}
                  maxFilesCount={4}
                  maxFiles={
                    4 -
                    (formik?.values?.medical_practitioner_image?.length || 0)
                  }
                  fieldInputName="medical_practitioner_imageNew"
                  oldFieldName="medical_practitioner_image"
                  existingFiles={formik?.values?.medical_practitioner_image}
                  setFieldValue={formik?.setFieldValue}
                  setFieldTouched={formik?.setFieldTouched}
                  initialValues={formik?.values}
                  label="Upload Medical Practitioner Certificate"
                  acceptTypes={{
                    "image/png": [],
                    "image/jpeg": [],
                    "image/jpg": [],
                    "application/pdf": [],
                  }}
                />
              )}
            </div>
          </div>

          <div className={styles?.buttonContainer}>
            <button type="button" className={styles?.buttonCancel}>
              Cancel
            </button>
            <button type="submit" className={styles?.buttonSubmit}>
              Submit
            </button>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default EditProfileDetails;
