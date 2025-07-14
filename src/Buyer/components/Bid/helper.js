import { Country, State, City } from "country-state-city";
import * as Yup from "yup";

export const bidValidationSchema = Yup.object().shape({
  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Start date must be a valid date"),

  endDate: Yup.date()
    .required("End date is required")
    .typeError("End date must be a valid date")
    .min(Yup.ref("startDate"), "End date cannot be before start date"),

  description: Yup.string()
    .required("Bid description is required")
    .min(10, "Description must be at least 10 characters"),

  // documents is excluded

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

        upc: Yup.string()
          .required("UPC is required")
          .min(3, "UPC must be at least 3 characters"),

        brand: Yup.string()
          .required("Brand is required")
          .min(2, "Brand must be at least 2 characters"),

        quantity: Yup.number()
          .typeError("Quantity must be a number")
          .required("Quantity is required")
          .positive("Quantity must be positive"),

        targetPrice: Yup.number()
          .typeError("Target price must be a number")
          .required("Target price is required")
          .positive("Price must be positive"),

        country: Yup.string().required("Destination country is required"),

        selectedCountry: Yup.string().required(
          "Selected country code is required"
        ),

        state: Yup.string().required("Destination state is required"),

        openFor: Yup.string().required("Open for field is required"),

        fromCountries: Yup.array()
          .min(1, "At least one country must be selected")
          .required("From countries is required"),

        delivery: Yup.string()
          .required("Delivery details are required")
          .min(2, "Delivery must be at least 2 characters"),
      })
    )
    .min(1, "At least one item must be added"),

  status: Yup.string().required("Status is required"),

  userId: Yup.string().required("User ID is required"),
});

export const bidTypeOptions = [
  { label: "Product", value: "Product" },
  { label: "Service", value: "Service" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const openForOptions = [
  { label: "Manufacturer", value: "Manufacturer" },
  { label: "Distributor", value: "Distributor" },
  { label: "Service Provider", value: "Service Provider" },
]?.sort((a, b) => a?.label?.localeCompare(b?.label));

export const countryOptions = Country.getAllCountries()
  .map((country) => ({
    label: country.name,
    value: country.name,
    isoCode: country.isoCode, // ✅ include isoCode here
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
  endDate: undefined,
  description: undefined,
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
      country: undefined,
      selectedCountry: undefined,
      state: undefined,
      openFor: undefined,
      fromCountries: [],
      delivery: undefined,
    },
  ],
  status: "Active",
  userId: undefined,
};
