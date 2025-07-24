import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Country, State, City } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { parsePhoneNumber,} from "libphonenumber-js";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../SharedComponents/Loader/Loader";
import "../../Assets/Styles/react-input-phone.css";
import { editProfile, fetchUserData } from "../../../redux/reducers/userDataSlice";
import { toast } from "react-toastify";

const EditProfile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, loading } = useSelector((state) => state?.userReducer);
   /*  const [loading, setLoading] = useState(false); */
   /* const user =  {
        "registeredAddress": {
            "company_reg_address": "476, Udyog Vihar, Gurgaon",
            "locality": "Phase V, test",
            "land_mark": null,
            "city": "Gurgaon",
            "state": "Haryana",
            "country": "India",
            "pincode": "122016",
            "type": "Registered"
        },
        "_id": "664ae224e07969304eb37bac",
        "supplier_id": "SUP-88363ef1b2c6a",
        "supplier_name": "PureMed Pharmaceuticals",
        "supplier_image": [
            "https://medhubglobal.s3.ap-south-1.amazonaws.com/testing/1747638122927-supplier_image-Driver-1747638122864.png"
        ],
        "supplier_address": "476, Udyog Vihar, Gurgaon",
        "description": "PureMed Pharmaceuticals supplies high-quality pharmaceutical products, including generic and branded medications.",
        "license_no": "456345234",
        "country_of_origin": "India",
        "contact_person_name": "Shubham Dubey",
        "designation": "Market General Manager",
        "payment_terms": "Credit, COD",
        "tags": "Abilify, Acanya",
        "estimated_delivery_time": "10 Days",
        "contact_person_email": "puremedpharma@gmail.com",
        "supplier_email": "puremedpharma@gmail.com",
        "contact_person_country_code": "+91",
        "contact_person_mobile_no": "9744630909",
        "supplier_country_code": "+91",
        "supplier_mobile": "6694611789",
        "account_status": 1,
        "profile_status": 1,
        "supplier_type": "Manufacturer",
        "tax_no": "9867342",
        "country_of_operation": [
            "India"
        ],
        "registration_no": "6712312378",
        "vat_reg_no": "453231",
        "certificate_image": [
            "certificate_image-1721202330235.pdf"
        ],
        "license_image": [
            "license_image-1721202330059.pdf"
        ],
        "tax_image": [
            "tax_image-1721202330093.pdf"
        ],
        "license_expiry_date": "31-12-2027",
        "bank_details": "Barclays ,3323323332323, Bar2233",
        "otpCount": 3,
        "categories": [
            "Pharmaceuticals",
            "Alternative Medicines",
            "Dental Products",
            "Diagnostic and Monitoring Devices",
            "Disinfection and Hygiene Supplies",
            "Emergency and First Aid Supplies",
            "Eye Care Supplies",
            "Healthcare IT Solutions",
            "Home Healthcare Products",
            "Hospital and Clinic Supplies",
            "Laboratory Supplies",
            "Medical Consumables and Disposables",
            "Medical Equipment and Devices",
            "Nutrition and Dietary Products",
            "Orthopedic Supplies",
            "Skin, Hair and Cosmetic Supplies",
            "Vital Health and Wellness"
        ],
        "certificateFileNDate": [
            {
                "file": "certificate_image-1721202330235.pdf",
                "date": "",
                "_id": "684679867ddb8feb098a5012"
            }
        ],
        "medical_certificate": [],
        "subscriptionEmail": "",
        "subscriptionsHistory": [],
        "test_account": 0,
        "otpExpiry": "2025-07-16T07:53:09.657Z",
        "last_login": "2025-07-17T10:10:07.502Z",
        "login_history": [
            {
                "date": "2025-04-04T07:24:07.913Z",
                "_id": "67ef891782181f3afd25c938"
            },
            {
                "date": "2025-04-04T07:24:29.865Z",
                "_id": "67ef892d82181f3afd25c950"
            },
            {
                "date": "2025-04-07T04:21:04.981Z",
                "_id": "67f352b0a7e039bf042fc8fa"
            },
        ],
        "account_accepted_date": "31-12-2024",
        "sales_person_name": "Shivanshi Tripathi",
        "activity_code": "786513",
        "lastLogin": "2025-04-21T07:17:30.579Z",
        "otp": 145484,
        "websiteAddress": "puremed.pharma.com",
        "otpLimitReachedAt": null,
        "annualTurnover": 450,
        "yrFounded": 1990    
    } */

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    useEffect(() => {
      (id || localStorage?.getItem("id")) &&
        dispatch(fetchUserData(id || localStorage?.getItem("id")));
    }, [id, dispatch]);

    const formik = useFormik({
    initialValues: {
        contactPersonName: "",
        contactPersonEmail: "",
        phoneNumber: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        companyAddress: "",
        locality: "",
        land_mark: "",
        country: null,
        state: null,
        city: null,
        pincode: "",
    },
    validationSchema: Yup.object().shape({
        contactPersonName: Yup.string().required("Contact name is required"),
        contactPersonEmail: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
        phoneNumber: Yup.string()
        .required("Phone number is required")
        .test("is-valid-phone", "Invalid phone number", (value) => {
            try {
            const phoneNumber = parsePhoneNumber(value);

            // Validate phone number and return true if it's valid, false if not
            return phoneNumber && phoneNumber.isValid();
            } catch (error) {
            // If parsing fails, mark it as invalid
            return false;
            }
        }),
        oldPassword: Yup.string(),
        // New password is required when oldPassword is provided
        newPassword: Yup.string().when("oldPassword", {
        is: (oldPassword) => oldPassword && oldPassword.length > 0,
        then: Yup.string()
            .required("New password is required")
            .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
            "Password must be 8-15 characters, include one capital letter, one small letter, one number, and one special character"
            )
            .notOneOf(
            [Yup.ref("oldPassword")],
            "New password cannot be the same as old password"
            ),
        otherwise: Yup.string(), // It's optional if oldPassword isn't provided
        }),
        // Confirm password is required and must match newPassword if newPassword is provided
        confirmPassword: Yup.string().when("newPassword", {
        is: (newPassword) => newPassword && newPassword.length > 0,
        then: Yup.string()
            .oneOf(
            [Yup.ref("newPassword")],
            "Confirm New password must match new password"
            )
            .required("Confirm New password is required"),
        otherwise: Yup.string(), // It's optional if newPassword isn't provided
        }),

        companyAddress: Yup.string().required(
        "Company billing address is required"
        ),
       /*  locality: Yup.string().required("Area/Locality/Road name is required"), */
        country: Yup.object().nullable().required("Country is required"),
    }),

    onSubmit: async (values) => {
        const apiPayload = {
        name: values?.contactPersonName, // contact person name
        email: values?.contactPersonEmail, // contact person email
        phone: values?.phoneNumber, // contact person phone
        newPassword: values?.newPassword || null,
        oldPassword: values?.oldPassword || null,
        confirmPassword: values?.confirmPassword || null,
        address: {
            company_reg_address: values?.companyAddress,
            locality: values?.locality,
            land_mark: values?.land_mark || null, 
            city: values?.city?.label || null,
            state: values?.state?.label || null,
            country: values?.country?.label,
            pincode: values?.pincode,
            type: "Registered",
        },
        };
        // Dispatch the action to update the profile
         const updatedProfile = await dispatch(
          editProfile({
              id: user?._id,
              obj: apiPayload,
          })
        ); 

        // After dispatching, check if the profile update was successful
       if (updatedProfile.meta.requestStatus === "fulfilled") {
        if (apiPayload?.newPassword) {
            // If new password is provided, clear localStorage and sessionStorage and navigate to login
             setTimeout(() => {
            localStorage?.clear();
            navigate("/supplier/login");
            }, 100); 
        } else {
            navigate(-1);
        }
        } 
    },
    });

    const resetForminlValues = (user) => {
    const initialCountryValue = user?.address?.country
        ? {
            value: Country.getAllCountries().find(
            (country) => country.name === user.address.country
            )?.isoCode,
            label: user.address.country,
        }
        : null;

    const initialStateValue = user?.address?.state
        ? {
            value: State.getStatesOfCountry(
            user.address.country || selectedCountry?.value
            ).find((state) => state.name === user.address.state)
            ?.isoCode,
            label: user.address.state,
        }
        : null;

    const initialCityValue = user?.address?.city
        ? {
            value: City.getCitiesOfState(
            user.address.state || selectedState?.value
            ).find((city) => city.name === user.address.city)?.name,
            label: user.address.city,
        }
        : null;
    // Use setValues to update Formik form values
    formik.setValues({
        contactPersonName: user?.contact_person || "",
        contactPersonEmail: user?.email || "",
        phoneNumber:
        `${user?.contact_person_country_code} ${user?.phone}` ||
        "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        companyAddress:
        user?.address?.street ||"",
        locality: user?.address?.locality || "",
        land_mark: user?.address?.land_mark || "", 
        country: initialCountryValue,
        state: initialStateValue,
        city: initialCityValue,
        pincode: user?.address?.zip_code || null,
    });

    setSelectedCountry(initialCountryValue);
    setSelectedState(initialStateValue);
    setSelectedCity(initialCityValue);
    };

    // Update formik values when user data is fetched
    useEffect(() => {
    if (user) {
        resetForminlValues(user);
    }
    }, [user]);

    // Handlers for Select components
    const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedCity(null);
    formik.setFieldValue("country", selectedOption);
    };

    const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedCity(null);
    formik.setFieldValue("state", selectedOption);
    };
    

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        formik.setFieldValue("city", selectedOption);
    };

    const handlePhoneChange = (name, value) => {
    try {
        // Parse the phone number
        const phoneNumber = parsePhoneNumber(value);

        // Validate the phone number
        if (phoneNumber && phoneNumber.isValid()) {
        // Format the phone number in E.164 format (international standard)
        const formattedNumber = phoneNumber.formatInternational();

        // Update the Formik field value for phoneNumber
        formik.setFieldValue(name, formattedNumber);
        // Clear any previous error if the phone number is valid
        formik.setFieldError(name, "");
        } else {
        // Set error if phone number is invalid
        formik.setFieldValue(name, value); // Keep the invalid value
        formik.setFieldError(name, "Invalid phone number");
        }
    } catch (error) {
        // Handle parsing errors (invalid number format)
        formik.setFieldValue(name, value); // Keep the invalid value
        formik.setFieldError(name, "Invalid phone number");
    }
    };

    return (
    <div className={styles.editProfileContainer}>
      <span className={styles.editProfileHead}>Edit Profile</span>
      {loading ? (
        <Loader />
      ) : (
        <form
          className={styles.editForm}
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
          {/* Contact Details Section */}
          <div className={styles.editProfileSection}>
            <span className={styles.editProfileSubHead}>Contact Details</span>
            <div className={styles.editProfileInnerSection}>
              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>
                  Contact Name <span className={styles.labelStamp}>*</span>
                </label>
                <input
                  autoComplete="false"
                  className={styles.editInput}
                  type="text"
                  name="contactPersonName"
                  placeholder="Enter Contact Name"
                  value={formik.values.contactPersonName}
                  onChange={formik.handleChange}
                />
                {formik.errors.contactPersonName && (
                  <span className={styles.error_message_formik}>
                    {formik.errors.contactPersonName}
                  </span>
                )}
              </div>
              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>
                  Email <span className={styles.labelStamp}>*</span>
                </label>
                <input
                  autoComplete="false"
                  className={styles.editInput}
                  type="email"
                  name="contactPersonEmail"
                  placeholder="Enter Email"
                  value={formik.values.contactPersonEmail}
                  onChange={formik.handleChange}
                />
                {formik.errors.contactPersonEmail && (
                  <span className={styles.error_message_formik}>
                    {formik.errors.contactPersonEmail}
                  </span>
                )}
              </div>
              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>
                  Phone Number <span className={styles.labelStamp}>*</span>
                </label>
                <PhoneInput
                  className="signup-form-section-phone-input"
                  defaultCountry={
                    Country.getAllCountries()?.filter(
                      (country) =>
                        country?.phonecode?.replace("+", "") ===
                        user?.contact_person_country_code?.replace("+", "")
                    )?.[0]?.isoCode
                  }
                  name="mobile"
                  value={formik.values.phoneNumber}
                  onChange={(value) => {
                    handlePhoneChange("phoneNumber", value);
                    //   setMobile(value);
                  }}
                />

                {formik.errors.phoneNumber && (
                  <span className={styles.error_message_formik}>
                    {formik.errors.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className={styles.editProfileSection}>
            <span className={styles.editProfileSubHead}>Password</span>
            <div className={styles.editProfileInnerSection}>
              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>Old Password</label>
                <input
                  autoComplete="false"
                  className={styles.editInput}
                  type="text"
                  name="oldPassword"
                  placeholder="Enter Old Password"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                />
              </div>
              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>New Password</label>
                <input
                  autoComplete="false"
                  className={styles.editInput}
                  type="text"
                  name="newPassword"
                  placeholder="Enter New Password"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                />
                {formik.errors.newPassword && (
                  <span className={styles.error_message_formik}>
                    {formik.errors.newPassword}
                  </span>
                )}
              </div>
              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>Confirm New Password</label>
                <input
                  autoComplete="false"
                  className={styles.editInput}
                  type="text"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                />
                {formik.errors.confirmPassword && (
                  <span className={styles.error_message_formik}>
                    {formik.errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Billing Address Section */}
          <div className={styles.editProfileSection}>
            <span className={styles.editProfileSubHead}>
              Billing Address Details{" "}
              {user?.profile_status === 0 && (
                <label className={styles.onEditInfo}>
                  (You cannot edit address details as your request is pending
                  with the admin.)
                </label>
              )}
            </span>
            <div className={styles.editProfileInnerSection}>
              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>
                  Company Billing Address{" "}
                  <span className={styles.labelStamp}>*</span>
                </label>
                <input
                  autoComplete="false"
                  className={
                    user?.profile_status === 0
                      ? styles?.editInputDisabed
                      : styles.editInput
                  }
                  type="text"
                  name="companyAddress"
                  placeholder="Enter Company Billing Address"
                  value={formik.values.companyAddress}
                  readOnly={user?.profile_status === 0}
                  disabled={user?.profile_status === 0}
                  onChange={formik.handleChange}
                />
                {formik.errors.companyAddress && (
                  <span className={styles.error_message_formik}>
                    {formik.errors.companyAddress}
                  </span>
                )}
              </div>


              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>
                  Area/Locality/Road Name{" "}
                  <span className={styles.labelStamp}>*</span>
                </label>
                <input
                  autoComplete="false"
                  className={
                    user?.profile_status === 0
                      ? styles?.editInputDisabed
                      : styles.editInput
                  }
                  type="text"
                  name="locality"
                  placeholder="Enter Area/Locality/Road Name"
                  value={formik.values.locality}
                  readOnly={user?.profile_status === 0}
                  disabled={user?.profile_status === 0}
                  onChange={formik.handleChange}
                />
                {formik.errors.locality && (
                  <span className={styles.error_message_formik}>
                    {formik.errors.locality}
                  </span>
                )}
              </div>
              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>Landmark</label>
                <input
                  autoComplete="false"
                  className={
                    user?.profile_status === 0
                      ? styles?.editInputDisabed
                      : styles.editInput
                  }
                  type="text"
                  name="land_mark"
                  placeholder="Enter Landmark"
                  value={formik.values.land_mark}
                  readOnly={user?.profile_status === 0}
                  disabled={user?.profile_status === 0}
                  onChange={formik.handleChange}
                />
              </div>

              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>
                  Country <span className={styles.labelStamp}>*</span>
                </label>
                <Select
                  name="country"
                  options={[
                    ...Country.getAllCountries().map((country) => ({
                      value: country.isoCode,
                      label: country.name,
                    })),
                    { value: "OTHER", label: "Other" },
                  ]}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  placeholder="Select Country"
                  isDisabled={user?.profile_status === 0}
                />
                {formik.errors.country && (
                  <span className={styles.error_message_formik}>
                    {formik.errors.country}
                  </span>
                )}
              </div>

              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>State</label>
                <Select
                  name="state"
                  options={
                    selectedCountry
                      ? [
                          ...State.getStatesOfCountry(
                            selectedCountry.value
                          ).map((state) => ({
                            value: state.isoCode,
                            label: state.name,
                          })),
                          { value: "OTHER", label: "Other" }, // Add "Other" option here
                        ]
                      : []
                  }
                  value={selectedState}
                  onChange={handleStateChange}
                  placeholder="Select State"
                  isDisabled={user?.profile_status === 0 || !selectedCountry}
                />
                {formik.errors.state && (
                  <span className={styles.error_message_formik}>
                    {formik.errors.state}
                  </span>
                )}
              </div>

              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>City</label>
                <Select
                  name="city"
                  options={
                    selectedState
                      ? [
                          ...City.getCitiesOfState(
                            selectedCountry.value,
                            selectedState.value
                          ).map((city) => ({
                            value: city.name,
                            label: city.name,
                          })),
                          { value: "Other", label: "Other" }, // Add "Other" option here
                        ]
                      : []
                  }
                  value={selectedCity}
                  onChange={handleCityChange}
                  placeholder="Select City"
                  isDisabled={user?.profile_status === 0 || !selectedState}
                />
                {formik.errors.city && (
                  <span className={styles.error_message_formik}>
                    {formik.errors.city}
                  </span>
                )}
              </div>

              <div className={styles.editSubSection}>
                <label className={styles.editLabel}>Pincode</label>
                <input
                  autoComplete="false"
                  className={
                    user?.profile_status === 0
                      ? styles?.editInputDisabed
                      : styles.editInput
                  }
                  type="number"
                  name="pincode"
                  placeholder="Enter Pincode"
                  value={formik.values.pincode}
                  readOnly={user?.profile_status === 0}
                  disabled={user?.profile_status === 0}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.editButtonSection}>
            <button type="submit" className={styles.editSubmit}>
              Submit
            </button>
            <button
              className={styles.editCancel}
              onClick={(e) => {
                e.preventDefault();
                user && resetForminlValues(user);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
    )
}

export default EditProfile