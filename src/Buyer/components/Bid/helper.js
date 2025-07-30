import { Country, State, City } from "country-state-city";
import * as Yup from "yup";
import moment from "moment";


export const bidValidationSchema = Yup.object().shape({
  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Start date must be a valid date"),

  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),

  endDate: Yup.date()
    .required("End date is required")
    .typeError("End date must be a valid date")
    .min(Yup.ref("startDate"), "End date cannot be before start date"),

  country: Yup.string().required("Destination country is required"),  
  state: Yup.string().required("Destination state is required"),
  fromCountries: Yup.array()
      .min(1, "At least one country must be selected")
      .required("From countries is required"),
  selectedCountry: Yup.string().required(
    "Selected country code is required"
  ),    

  description: Yup.string()
    .required("Bid description is required")
    .min(10, "Description must be at least 10 characters"),

  // documents is excluded
  documents: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Document name is required"),
        document: Yup.array()
          .min(1, "At least one document must be added")
          .max(1, "You can upload up to 1 image.")
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
    )
    .min(1, "At least one item must be added"),

  additionalDetails: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.string().required("Bid type is required"),

        category: Yup.string().required("Category is required"),

        // subCategory is excluded

        name: Yup.string()
          .required("Item name is required")
          .min(2, "Name must be at least 2 characters"),

        description: Yup.string()
          .required("Item description is required")
          .min(5, "Description must be at least 5 characters"),

        // upc: Yup.string().when("type", {
        //   is: "Product",
        //   then: Yup.string()
        //     .required("UPC is required for products")
        //     .min(3, "UPC must be at least 3 characters"),
        //   otherwise: Yup.string().notRequired(),
        // }),

        // brand: Yup.string().when("type", {
        //   is: "Product",
        //   then: Yup.string()
        //     .required("Brand name is required for products")
        //     .min(2, "Brand must be at least 2 characters"),
        //   otherwise: Yup.string().notRequired(),
        // }),

        quantity: Yup.number()
          .typeError("Quantity must be a number")
          .required("Quantity is required")
          .positive("Quantity must be positive"),

        targetPrice: Yup.number()
          .typeError("Target price must be a number")
          .required("Target price is required")
          .positive("Price must be positive"),

        // country: Yup.string().required("Destination country is required"),

        // selectedCountry: Yup.string().required(
        //   "Selected country code is required"
        // ),


        openFor: Yup.string().required("Open for field is required"),

        docReq: Yup.string().required(
          "Certification Required field is required"
        ),

        certificateName: Yup.string().when("docReq", {
          is: "Yes",
          then: Yup.string().required("Certificate name is required"),
          otherwise: Yup.string().notRequired(),
        }),

        delivery: Yup.string()
          .required("Delivery details are required")
          // .min(2, "Delivery must be at least 2 characters"),
      })
    )
    .min(1, "At least one item must be added"),

  // status: Yup.string().required("Status is required"),

  // userId: Yup.string().required("User ID is required"),
});

export const bidTypeOptions = [
  { label: "Product", value: "Product" },
  { label: "Service", value: "Service" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const docReqOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
]?.sort((a, b) => b?.label?.localeCompare(a?.label));

export const openForOptions = [
  { label: "Manufacturer", value: "Manufacturer" },
  { label: "Distributor", value: "Distributor" },
  { label: "Service Provider", value: "Service Provider" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const countryOptions = Country.getAllCountries()
  .map((country) => ({
    label: country.name,
    value: country.name,
    isoCode: country.isoCode, // include isoCode here
  }))
  ?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const stateOptions = (selectedCountry) =>
  State.getStatesOfCountry(selectedCountry)
    .map((state) => ({
      label: state.name,
      value: state.name,
    }))
    ?.sort((a, b) => a?.label?.localeCompare(b?.label)) || [];

export const initialValues = {
  startDate: undefined,
  startTime: undefined,
  endTime: undefined,
  endDate: undefined,
  fromCountries: [],
  country: undefined,
  state: undefined,
  description: undefined,
  bidDocs: [],
  documents: [
    {
      name: undefined,
      document: [],
    },
  ],
  additionalDetails: [
    {
      type: undefined,
      category: undefined,
      subCategory: undefined,
      name: undefined,
      description: undefined,
      upc: undefined,
      brand: undefined,
      quantity: undefined,
      targetPrice: undefined,
      selectedCountry: undefined,
      docReq: undefined,
      certificateName: undefined, 
      openFor: undefined,
      delivery: undefined,
      // country: undefined,
      // state: undefined,
      // fromCountries: [],
    },
  ],
  // status: "Active",
};

export const getTimeRemaining = (startDate, startTime = "00:00", endDate, endTime = "00:00") => {
  if (!startDate || !endDate) return "";
 
  const start = moment(`${moment(startDate).format("YYYY-MM-DD")}T${startTime}`, "YYYY-MM-DDTHH:mm");
  const end = moment(`${moment(endDate).format("YYYY-MM-DD")}T${endTime}`, "YYYY-MM-DDTHH:mm");
  const now = moment();
 
  if (now.isBefore(start)) {
    return "Not Started";
  }
 
  if (now.isAfter(end)) {
    return "Ended";
  }
 
  const duration = moment.duration(end.diff(now));
 
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  if(days > 0) console.log(`${days} day${days !== 1 ? "s" : ""}`);
 
  if (days > 0) return `${days} day${days !== 1 ? "s" : ""}  ${hours} hr${hours !== 1 ? "s":""}  ${minutes} min${minutes !== 1 ? "s":""}`;
  if (hours > 0) return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} min${minutes !== 1 ? "s":""}`;
  return `${minutes} min${minutes !== 1 ? "s" : ""}`;
};
