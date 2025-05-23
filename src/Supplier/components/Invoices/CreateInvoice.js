import React, { useState, useEffect } from "react";
import styles from "./createInvoice.module.css";
import '../SharedComponents/Signup/signup.css'
import Select from "react-select";
import countryList from "react-select-country-list";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../../api/Requests";
import { toast } from "react-toastify";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { apiRequests } from "../../../api";

const CreateInvoice = ({ socket }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    orderId: "",
    purchaseOrderId: "",
    enquiryId: "",
    invoiceNo: "",
    invoiceDate: "",
    supplierId: "",
    supplierName: "",
    supplierEmail: "",
    supplierCountry: "",
    supplierAddress: "",
    supplierMobile: "",
    supplierCountryCode: "",
    supplierContactPersonMobile: "",
    supplierContactPersonCountryCode: "",
    supplierVatRegNo: "",
    buyerId: "",
    buyerName: "",
    buyerEmail: "",
    buyerCountry: "",
    buyerAddress: "",
    buyerMobile: "",
    buyerCountryCode: "",
    buyerContactPersonMobile: "",
    buyerContactPersonCountryCode: "",
    buyerVatRegNo: "",
    orderItems: [],
    vatPercentage: "",
    totalPayableAmount: "",
    bankName: "",
    accountNo: "",
    sortCode: "",
    grandTotal: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [supplierCountryOfOrigin, setSupplierCountryOfOrigin] = useState("");
  const [buyerCountryOfOrigin, setBuyerCountryOfOrigin] = useState("");

  useEffect(() => {
    const countryOptions = countryList().getData();
    setCountries(countryOptions);
  }, []);

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setCurrentDate(`${day}-${month}-${year}`);

    const generateRandomNumber = () =>
      Math.floor(10000000 + Math.random() * 90000000);
    const generatedInvoiceNumber = generateRandomNumber();
    setInvoiceNumber(generatedInvoiceNumber);

    setFormData((prevState) => ({
      ...prevState,
      invoiceNo: generatedInvoiceNumber,
      invoiceDate: formattedDate,
    }));
  }, [orderId]);

  const handleSupplierCountryOriginChange = (selected) => {
    setSupplierCountryOfOrigin(selected);
    setFormData((prevState) => ({ ...prevState, supplierCountry: selected }));
    if (!selected) {
      setErrors((prevState) => ({
        ...prevState,
        supplierCountry: "Supplie Country of Origin is Required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, supplierCountry: "" }));
    }
  };

  const handleBuyerCountryOriginChange = (selected) => {
    setBuyerCountryOfOrigin(selected);
    setFormData((prevState) => ({ ...prevState, buyerCountry: selected }));
    if (!selected) {
      setErrors((prevState) => ({
        ...prevState,
        buyerCountry: "Buyer Country of Origin is Required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, buyerCountry: "" }));
    }
  };

  useEffect(() => {
    const getOrderDetails = async () => {
      const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
      const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

      if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        localStorage?.clear();
        navigate("/supplier/login");
        return;
      }

      const obj = {
        order_id: orderId,
        supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
      };

      try {
        const response = await apiRequests.getRequest(
          `order/get-specific-order-details/${orderId}`,
          obj
        );
        if (response?.code === 200) {
          setOrderDetails(response.result);
          const data = response.result;
          const formattedSupplierMobile = `${
            data.supplier?.supplier_country_code || ""
          }-${data.supplier?.supplier_mobile || ""}`;
          const formattedBuyerMobile = `${
            data.buyer?.buyer_country_code || ""
          }-${data.buyer?.buyer_mobile || ""}`;

          // Parse bank details
        const bankDetailsArray = data?.supplier?.bank_details?.split(",") || [];
        const [bankName, accountNo, sortCode] = bankDetailsArray.map((v) => v.trim());

          setFormData((prevFormData) => ({
            ...prevFormData,
            orderId: data.order_id,
            purchaseOrderId: data.purchaseOrder_id,
            enquiryId: data.enquiry_id,
            supplierId: data.supplier_id,
            supplierName: data?.supplier?.supplier_name,
            supplierEmail: data?.supplier?.supplier_email,
            supplierCountry:
              {
                label: data?.supplier?.country_of_origin,
                value: data?.supplier?.country_of_origin,
              } || null,
            supplierAddress: data?.supplier?.supplier_address,
           
            supplierMobile: formattedSupplierMobile,
            supplierContactPersonMobile:
              data?.supplier?.contact_person_mobile_no,
            supplierContactPersonCountryCode:
              data?.supplier?.contact_person_country_code,
            supplierVatRegNo: data?.supplier?.vat_reg_no,
            buyerId: data.buyer_id,
            buyerName: data?.buyer?.buyer_name,
            buyerEmail: data?.buyer?.buyer_email,
            buyerCountry:
              {
                label: data?.buyer?.country_of_origin,
                value: data?.buyer?.country_of_origin,
              } || null,
            buyerAddress: data?.buyer?.buyer_address,
          
            buyerMobile: formattedBuyerMobile,
            buyerContactPersonMobile: data?.buyer?.contact_person_mobile,
            buyerContactPersonCountryCode:
              data?.buyer?.contact_person_country_code,
            buyerVatRegNo: data?.buyer?.vat_reg_no,
            orderItems: data?.items,
            grandTotal: data?.pending_amount,
           
            bankName: bankName || "",
            accountNo: accountNo || "",
            sortCode: sortCode || "",
          }));
        } else {
        }
      } catch (error) {}
    };
    getOrderDetails()
  }, [orderId, navigate]);

  const handleVatPercentageChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newErrors = {};
    let isValid = true;

    if (name === "bankName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        isValid = false;
        newErrors.bankName = "";
      } else if (value.length > 30) {
        isValid = false;
        newErrors.bankName = "";
      } else {
        newErrors.bankName = "";
      }
    }

    if (name === "totalQuantity" || name === "minPurchaseUnit") {
      if (!/^\d*$/.test(value)) {
        isValid = false;
      } else {
        newErrors[name] = "";
      }
    }
    if (name === "unitTax") {
      if (!/^\d*\.?\d*$/.test(value)) {
        isValid = false;
      } else {
        newErrors.unitTax = "";
      }
    }
    if (name === "accountNo" || name === "sortCode") {
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        isValid = false;
        newErrors[name] = "";
      } else if (value.length > 20) {
        isValid = false;
        newErrors[name] = "";
      } else {
        newErrors[name] = "";
      }
    }

    if (name === "totalPayableAmount") {
      if (!/^\d{0,8}(\.\d{0,3})?$/.test(value)) {
        isValid = false;
        newErrors.totalPayableAmount = "";
      } else {
        newErrors.totalPayableAmount = "";
      }
    }
    if (isValid) {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
    setErrors((prevState) => ({ ...prevState, ...newErrors }));
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.supplierName)
      formErrors.supplierName = "Supplier Name is Required";
    if (!formData.supplierEmail)
      formErrors.supplierEmail = "Supplier Email is Required";
    if (!formData.supplierAddress)
      formErrors.supplierAddress = "Supplier Address is Required";
    if (!formData.supplierMobile)
      formErrors.supplierMobile = "Supplier Mobile is Required";
    if (!formData.supplierVatRegNo)
      formErrors.supplierVatRegNo = "Supplier VAT Reg No. is Required";
    if (!formData.supplierCountry)
      formErrors.supplierCountry = "Supplier Country is Required";

    if (!formData.buyerName) formErrors.buyerName = "Buyer Name is Required";
    if (!formData.buyerEmail) formErrors.buyerEmail = "Buyer Email is Required";
    if (!formData.buyerAddress)
      formErrors.buyerAddress = "Buyer Address is Required";
    if (!formData.buyerMobile)
      formErrors.buyerMobile = "Buyer Mobile is Required";
    if (!formData.buyerVatRegNo)
      formErrors.buyerVatRegNo = "Buyer VAT Reg No. is Required";
    if (!formData.buyerCountry)
      formErrors.buyerCountry = "Buyer Country is Required";

    if (!formData.bankName) formErrors.bankName = "Bank Name is Required";
    if (!formData.accountNo)
      formErrors.accountNo = "Account Number is Required";
    if (!formData.sortCode) formErrors.sortCode = "Sort Code is Required";
    if (!formData.totalPayableAmount)
      formErrors.totalPayableAmount = "Total Payable Amount is Required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      localStorage?.clear();
      navigate("/supplier/login");
      return;
    }
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      postRequestWithToken(
        "invoice/create-invoice",
        formData,
        async (response) => {
          if (response?.code === 200) {
            toast(response.message, { type: "success" });
            socket.emit("createInvoice", {
              buyerId: formData?.buyerId,
              orderId: orderId,
             
              message: `Invoice Created for ${orderId}`,
              link: process.env.REACT_APP_PUBLIC_URL,
             
            });
            setTimeout(() => {
              navigate("/supplier/invoice/pending");
              setLoading(false);
            }, 500);
          } else {
            setLoading(false);
            toast(response.message, { type: "error" });
          }
        }
      );
    } else {
    }
  };

  const resetForm = () => {};

  const handleCancel = () => {
    resetForm();
  };

  

  const handlePhoneChange = (value, type) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(value);

      if (phoneNumber && phoneNumber.isValid()) {
        const formattedPhoneNumber = phoneNumber.formatInternational();

        setFormData((prevState) => ({
          ...prevState,
          [type]: formattedPhoneNumber,
        }));
      } else {
        console.error("Invalid phone number");
        setFormData((prevState) => ({
          ...prevState,
          [type]: "", 
        }));
      }
    } catch (error) {
      console.error("Error parsing phone number:", error);
      setFormData((prevState) => ({
        ...prevState,
        [type]: "", 
      }));
    }
  };

  const totalPayableAmount = formData?.orderItems?.reduce(
    (total, item) => total + item.total_amount,
    0
  );
  return (
   
      <div className={styles["create-invoice-container"]}>
        <div className={styles["create-invoice-heading"]}>Create Invoice</div>
        <form className={styles["craete-invoice-form"]} onSubmit={handleSubmit}>
          <div className={styles["create-invoice-section"]}>
            <div className={styles["create-invoice-form-heading"]}>
              Supplier
            </div>
            <div className={styles["create-invoice-inner-form-container"]}>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Name*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="supplierName"
                  placeholder="Enter Supplier Name"
                  value={formData.supplierName}
                  onChange={handleChange}
                />
                {errors.supplierName && (
                  <p style={{ color: "red" }}>{errors.supplierName}</p>
                )}
              </div>

              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Invoice Number*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  placeholder="Enter Invoice Number"
                  name="invoiceNumber"
                  value={invoiceNumber}
                  readOnly
                />
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Invoice Generate Date*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="invoiceDate"
                  placeholder="Enter Invoice Generate Date"
                  value={currentDate}
                  readOnly
                />
              </div>

              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Email ID*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="supplierEmail"
                  placeholder="Enter Email ID"
                  value={formData.supplierEmail}
                  onChange={handleChange}
                />
                {errors.supplierEmail && (
                  <p style={{ color: "red" }}>{errors.supplierEmail}</p>
                )}
              </div>

              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Mobile No.*
                </label>
                <PhoneInput
                  className="signup-form-section-phone-input"
                  defaultCountry="uk"
                  name="phoneinput"
                  value={formData.supplierMobile}
                 
                  onChange={(value) =>
                    handlePhoneChange(value, "supplierMobile")
                  }
                />
                {errors.supplierMobile && (
                  <p style={{ color: "red" }}>{errors.supplierMobile}</p>
                )}
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Address*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="supplierAddress"
                  placeholder="Enter Address"
                  value={formData.supplierAddress}
                  onChange={handleChange}
                />
                {errors.supplierAddress && (
                  <p style={{ color: "red" }}>{errors.supplierAddress}</p>
                )}
              </div>

              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Country*
                </label>
                <Select
                  className={styles["create-invoice-div-input-select"]}
                  name="supplierCountry"
                  options={countries}
                  autoComplete="off"
                  value={formData.supplierCountry}
                  onChange={handleSupplierCountryOriginChange}
                />
                {errors.supplierCountry && (
                  <p style={{ color: "red" }}>{errors.supplierCountry}</p>
                )}
              </div>

              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  GST/VAT Reg No.*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="supplierVatRegNo"
                  placeholder="Enter GST/VAT Reg No"
                  value={formData.supplierVatRegNo}
                  onChange={handleChange}
                />
                {errors.supplierVatRegNo && (
                  <p style={{ color: "red" }}>{errors.supplierVatRegNo}</p>
                )}
              </div>
            </div>
          </div>
          <div className={styles["create-invoice-section"]}>
            <div className={styles["create-invoice-form-heading"]}>Buyer</div>
            <div className={styles["create-invoice-inner-form-container"]}>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Name*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="buyerName"
                  placeholder="Enter Name"
                  readOnly
                  value={formData.buyerName}
                />
                {errors.buyerName && (
                  <p style={{ color: "red" }}>{errors.buyerName.message}</p>
                )}
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Email ID*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="buyerEmail"
                  placeholder="Enter Email ID"
                  readOnly
                  value={formData.buyerEmail}
                />
                {errors.buyerEmail && (
                  <p style={{ color: "red" }}>{errors.buyerEmail.message}</p>
                )}
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Mobile No.*
                </label>
                <PhoneInput
                  className="signup-form-section-phone-input"
                  defaultCountry="ae"
                  name="phoneinput"
                  value={formData.buyerMobile}
                  disabled
                />
                {errors.buyerMobile && (
                  <p style={{ color: "red" }}>{errors.buyerMobile.message}</p>
                )}
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Address*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="buyerAddress"
                  placeholder="Enter Address"
                  readOnly
                  value={formData.buyerAddress}
                />
                {errors.buyerAddress && (
                  <p style={{ color: "red" }}>{errors.buyerAddress.message}</p>
                )}
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Country*
                </label>
                <Select
                  className={styles["create-invoice-div-input-select"]}
                  name="buyerCountryy"
                  options={countries}
                  autoComplete="off"
                  value={formData.buyerCountry}
                
                  isDisabled={true}
                />
                {errors.buyerCountry && (
                  <p style={{ color: "red" }}>{errors.buyerCountry.message}</p>
                )}
              </div>

              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  GST/VAT Reg No.*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="buyerVatRegNo"
                  placeholder="Enter GST/VAT Reg No"
                  value={formData.buyerVatRegNo}
                  readOnly
                />
                {errors.buyerVatRegNo && (
                  <p style={{ color: "red" }}>{errors.buyerVatRegNo.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className={styles["create-invoice-section"]}>
            {formData?.orderItems?.map((item, index) => (
              <div className={styles["form-item-container"]} key={item.id}>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Product Name*
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`ProductName-${item.id}`}
                    placeholder="Enter Product Name"
                    value={item?.medicine_name}
                    readOnly
                  />
                </div>

                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Quantity*
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`Qty-${item.id}`}
                    placeholder="Enter Quantity"
                    value={item?.quantity_required}
                    readOnly
                  />
                </div>

                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Price*
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`UnitPrice-${item.id}`}
                    placeholder="Enter Price"
                    value={item?.counter_price || item?.target_price}
                    readOnly
                  />
                </div>

                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Tax%*
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`Tax-${item.id}`}
                    placeholder="Enter Tax%"
                    value={item?.unit_tax}
                    readOnly
                  />
                </div>

                {/* Common Total Payable Amount */}
              </div>
            ))}
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Total Payable Amount*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="totalPayableAmount"
                placeholder="Enter Total Payable Amount"
                value={formData.totalPayableAmount}
                onChange={handleChange}
               
              />
              {errors.totalPayableAmount && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.totalPayableAmount}
                </p>
              )}
            </div>
          </div>

          <div className={styles["create-invoice-section"]}>
            <div className={styles["create-invoice-inner-form-container"]}>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Name of Bank*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="bankName"
                  placeholder="Enter Name of Bank"
                  value={formData.bankName}
                  onChange={handleChange}
                />
                {errors.bankName && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.bankName}
                  </p>
                )}
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Account Number*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="accountNo"
                  placeholder="Enter Account Number"
                  value={formData.accountNo}
                  onChange={handleChange}
                />
                {errors.accountNo && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.accountNo}
                  </p>
                )}
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Sort Code*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name="sortCode"
                  placeholder="Enter Sort Code"
                  value={formData.sortCode}
                  onChange={handleChange}
                />
                {errors.sortCode && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.sortCode}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className={styles["craete-invoices-button"]}>
            <button
              type="submit"
              className={styles["create-invoices-submit"]}
              disabled={loading}
            >
              {/* Create Invoice */}
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Create Invoice"
              )}
            </button>
            <div
              className={styles["create-invoices-cancel"]}
              onClick={handleCancel}
            >
              Cancel
            </div>
          </div>
        </form>
      </div>
    
  );
};

export default CreateInvoice;
