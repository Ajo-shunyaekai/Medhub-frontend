import React, { useEffect, useState } from "react";
import "../invoiceDesign.css";
import html2pdf from "html2pdf.js";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequests } from "../../../../api";

function ProformaDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
  const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

  const [orderDetails, setOrderDetails] = useState();
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNo: "",
    sortCode: "",
  });

  useEffect(() => {
    const getOrderDetails = async () => {
      if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        localStorage?.clear();
        navigate("/supplier/login");
        return;
      }
      const obj = {
        supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
        order_id: orderId,
      };

      try {
        const response = await apiRequests.getRequest(
          `order/get-specific-order-details/${orderId}`,
          obj
        );
        if (response?.code === 200) {
          setOrderDetails(response.result);
          if (response.result?.supplier?.bank_details) {
            const [bankName, accountNo, sortCode] =
              response.result.supplier.bank_details
                ?.split(",")
                ?.map((item) => item?.trim());

            setBankDetails({ bankName, accountNo, sortCode });
          }
        } else {
        }
      } catch (error) {}
    };
    getOrderDetails();
  }, []);

  const orderItems =
    orderDetails?.items?.map((item) => ({
      ...item,
      unit_price: parseFloat(item.unit_price),
      unit_tax: parseFloat(item?.unit_tax || "0"),
      total_amount: parseFloat(item.total_amount),
    })) || [];

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.total_amount,
    0
  );
  const totalTaxAmount = orderItems.reduce((sum, item) => {
    const unitTaxRate = parseFloat(item.unit_tax || "0") / 100;
    const itemTotalAmount = parseFloat(item.total_amount);
    return sum + itemTotalAmount * unitTaxRate;
  }, 0);
  const grandTotal = totalAmount + totalTaxAmount;

  const handleDownload = () => {
    const element = document.getElementById("invoice-content");
    const options = {
      margin: 0.5,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window?.location?.origin) return;
      if (event.data && event.data.type === "DOWNLOAD_INVOICE") {
        window.parent.postMessage(
          {
            type: "INVOICE_READY",
            orderId: orderId,
          },
          window?.location?.origin
        );
      }
    };

    window.addEventListener("message", handleMessage);

    if (window.self !== window.top) {
      setTimeout(() => {
        window.parent.postMessage(
          {
            type: "INVOICE_READY",
            orderId: orderId,
          },
          window?.location?.origin
        );
      }, 500);
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [orderId]);

  // Format supplier and buyer addresses in two lines using registered address
  const supplierAddressLine1 = [
    orderDetails?.supplier_registered_address?.company_reg_address,
    orderDetails?.supplier_registered_address?.locality,
    orderDetails?.supplier_registered_address?.land_mark,
  ]
    .filter(Boolean)
    .join(", ");
  const supplierAddressLine2 = [
    orderDetails?.supplier_registered_address?.city,
    orderDetails?.supplier_registered_address?.state,
    orderDetails?.supplier_registered_address?.country,
    orderDetails?.supplier_registered_address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const buyerAddressLine1 = [
    orderDetails?.buyer_registered_address?.company_reg_address,
    orderDetails?.buyer_registered_address?.locality,
    orderDetails?.buyer_registered_address?.land_mark,
  ]
    .filter(Boolean)
    .join(", ");
  const buyerAddressLine2 = [
    orderDetails?.buyer_registered_address?.city,
    orderDetails?.buyer_registered_address?.state,
    orderDetails?.buyer_registered_address?.country,
    orderDetails?.buyer_registered_address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="invoice-template-design">
      <div className="scroll-wrapper">
        <div className="invoice-template-download">
          <div className="invoice-template-button" onClick={handleDownload}>
            Download
          </div>
        </div>
        <div id="invoice-content">
          <div
            style={{
              maxWidth: "800px",
              margin: "auto auto 10rem",
              padding: "30px",
              border: "1px solid #eee",
              fontSize: "16px",
              lineHeight: "24px",
              color: "#5e676f",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 2px 5px -1px #32325d40, 0 1px 3px -1px #0000004d",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: "500",
                fontSize: "30px",
                margin: "0px 0px 20px 0px",
              }}
            >
              Proforma Invoice
            </div>
            <table style={{ fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #99a0ac" }}>
                  {orderDetails?.invoice_no && (
                    <td style={{ display: "flex", justifyContent: "end" }}>
                      <p style={{ fontSize: "15px", fontWeight: "500" }}>
                        Invoice Number :{" "}
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: "500" }}>
                         {orderDetails.invoice_no}
                      </p>
                    </td>
                  )}
                  {orderDetails?.invoice_date && (
                    <td style={{ display: "flex", justifyContent: "end" }}>
                      <p style={{ fontSize: "15px", fontWeight: "500" }}>
                        Invoice Date :{" "}
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: "500" }}>
                         {orderDetails.invoice_date}
                      </p>
                    </td>
                  )}
                  {orderDetails?.payment_due_date && (
                    <td style={{ display: "flex", justifyContent: "end" }}>
                      <p style={{ fontSize: "15px", fontWeight: "500" }}>
                        Payment Due date :{" "}
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: "500" }}>
                         {orderDetails.payment_due_date}
                      </p>
                    </td>
                  )}
                  {orderDetails?.deposit_due_date && (
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        paddingBottom: "10px",
                      }}
                    >
                      <p style={{ fontSize: "15px", fontWeight: "500" }}>
                        Deposit Due date :{" "}
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: "500" }}>
                         {orderDetails.deposit_due_date}
                      </p>
                    </td>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <table
                      style={{
                        padding: "20px 16px",
                        width: "100%",
                        borderRadius: "12px",
                        tableLayout: "fixed",
                        marginTop: "20px",
                      }}
                    >
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #99a0ac" }}>
                          <td
                            style={{
                              verticalAlign: "top",
                              width: "50%",
                              paddingRight: "10px",
                              paddingBottom: "20px",
                            }}
                          >
                            <h1
                              style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                paddingBottom: "3px",
                              }}
                            >
                              From :
                            </h1>
                            {orderDetails?.supplier_name && (
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 500,
                                  paddingBottom: "6px",
                                }}
                              >
                                {orderDetails.supplier_name}
                              </p>
                            )}
                            {(supplierAddressLine1 || supplierAddressLine2) && (
                              <div
                                style={{
                                  fontSize: "13px",
                                   color: "#5e676f",
                                }}
                              >
                                <p>{supplierAddressLine1}</p>
                                <p>{supplierAddressLine2}</p>
                              </div>
                            )}
                            {orderDetails?.supplier_mobile && (
                              <td
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "13px",
                                   color: "#5e676f",
                                  }}
                                >
                                  {orderDetails.supplier_mobile}
                                </p>
                              </td>
                            )}
                            {orderDetails?.supplier_email && (
                              <td
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "13px",
                                    color: "#5e676f",
                                  }}
                                >
                                  {orderDetails.supplier_email}
                                </p>
                              </td>
                            )}
                          </td>
                          <td
                            style={{
                              verticalAlign: "top",
                              width: "50%",
                              paddingLeft: "10px",
                              paddingBottom: "20px",
                            }}
                          >
                            <h1
                              style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                paddingBottom: "3px",
                                textAlign: "end",
                              }}
                            >
                              To :
                            </h1>
                            {orderDetails?.buyer_name && (
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 500,
                                  paddingBottom: "6px",
                                  textAlign: "end",
                                }}
                              >
                                {orderDetails.buyer_name}
                              </p>
                            )}
                            {(buyerAddressLine1 || buyerAddressLine2) && (
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#5e676f",
                                  textAlign: "end",
                                }}
                              >
                                <p>{buyerAddressLine1}</p>
                                <p>{buyerAddressLine2}</p>
                              </div>
                            )}
                            {orderDetails?.buyer_mobile && (
                              <td
                                style={{ display: "flex", justifyContent: "end" }}
                              >
                                <p
                                  style={{
                                    fontSize: "13px",
                                   color: "#5e676f",
                                  }}
                                >
                                  {orderDetails.buyer_mobile}
                                </p>
                              </td>
                            )}
                            {orderDetails?.buyer_email && (
                              <td
                                style={{ display: "flex", justifyContent: "end" }}
                              >
                                <p
                                  style={{
                                    fontSize: "13px",
                                    color: "#5e676f",
                                  }}
                                >
                                  {orderDetails.buyer_email}
                                </p>
                              </td>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3">
                            <table style={{ width: "100%", borderSpacing: 0 }}>
                              <thead>
                                <tr style={{ textTransform: "uppercase" }}>
                                  <td
                                    style={{
                                      padding: "8px 0",
                                      fontWeight: 500,
                                      borderBottom: "1px solid #99a0ac",
                                      width: "40px",
                                    }}
                                  >
                                    S.No
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 0",
                                      fontWeight: 500,
                                      borderBottom: "1px solid #99a0ac",
                                      width: "150px",
                                    }}
                                  >
                                    Name
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 0",
                                      fontWeight: 500,
                                      borderBottom: "1px solid #99a0ac",
                                      width: "40px",
                                    }}
                                  >
                                    Qty
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 0",
                                      fontWeight: 500,
                                      borderBottom: "1px solid #99a0ac",
                                      textAlign: "end",
                                      width: "100px",
                                    }}
                                  >
                                    Price
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 0",
                                      fontWeight: 500,
                                      borderBottom: "1px solid #99a0ac",
                                      textAlign: "end",
                                      width: "100px",
                                    }}
                                  >
                                    Tax%
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 0",
                                      fontWeight: 500,
                                      borderBottom: "1px solid #99a0ac",
                                      textAlign: "end",
                                      width: "120px",
                                    }}
                                  >
                                    Total Amount
                                  </td>
                                </tr>
                              </thead>
                              {orderItems.map((item, index) => (
                                <tbody key={index}>
                                  <tr>
                                    <td
                                      style={{
                                        paddingBlock: "12px",
                                        display: "flex",
                                        alignItems: "baseline",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontWeight: 500,
                                          fontSize: "14px",
                                        }}
                                      >
                                        {index + 1}.
                                      </p>
                                    </td>
                                    <td
                                      style={{
                                        paddingBlock: "12px",
                                        verticalAlign: "baseline",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontWeight: 500,
                                          fontSize: "14px",
                                          lineHeight: "20px",
                                        }}
                                      >
                                        {item.medicine_name}{" "}
                                        {item?.strength && `(${item.strength})`}
                                      </p>
                                    </td>
                                    <td
                                      style={{
                                        paddingBlock: "12px",
                                        verticalAlign: "baseline",
                                      }}
                                    >
                                      {item?.quantity_required && (
                                        <p
                                          style={{
                                            fontWeight: 500,
                                            fontSize: "13px",
                                          }}
                                        >
                                          {item.quantity_required}
                                        </p>
                                      )}
                                    </td>
                                    <td
                                      style={{
                                        paddingBlock: "12px",
                                        textAlign: "end",
                                        verticalAlign: "baseline",
                                      }}
                                    >
                                      {(item?.counter_price ||
                                        item?.target_price) && (
                                        <p
                                          style={{
                                            fontWeight: 500,
                                            fontSize: "13px",
                                          }}
                                        >
                                          {item.counter_price ||
                                            item.target_price}{" "}
                                          USD
                                        </p>
                                      )}
                                    </td>
                                    <td
                                      style={{
                                        paddingBlock: "12px",
                                        textAlign: "end",
                                        verticalAlign: "baseline",
                                      }}
                                    >
                                      {item?.unit_tax && (
                                        <p
                                          style={{
                                            fontWeight: 500,
                                            fontSize: "13px",
                                          }}
                                        >
                                          {item.unit_tax}%
                                        </p>
                                      )}
                                    </td>
                                    <td
                                      style={{
                                        paddingBlock: "12px",
                                        textAlign: "end",
                                        verticalAlign: "baseline",
                                      }}
                                    >
                                      {item?.total_amount && (
                                        <p
                                          style={{
                                            fontWeight: 500,
                                            fontSize: "13px",
                                          }}
                                        >
                                          {item.total_amount.toFixed(2)} USD
                                        </p>
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              ))}
                            </table>
                            <table>
                              <tbody
                                style={{
                                  borderTop: "1px solid #99a0ac",
                                  borderBottom: "1px solid #99a0ac",
                                }}
                              >
                                <tr>
                                  <td style={{ width: "750px" }}>
                                    <table
                                      style={{
                                        width: "100%",
                                        borderSpacing: 0,
                                      }}
                                    >
                                      <tbody>
                                        {totalAmount > 0 && (
                                          <tr
                                            style={{
                                              display: "flex",
                                              justifyContent: "end",
                                              alignItems: "center",
                                              columnGap: "10px",
                                              paddingTop: "6px",
                                            }}
                                          >
                                            <p
                                              style={{
                                                textAlign: "end",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                paddingBottom: "10px",
                                              }}
                                            >
                                              Grand Total :
                                            </p>
                                            <p
                                              style={{
                                                textAlign: "end",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                paddingBottom: "10px",
                                                width: "150px",
                                              }}
                                            >
                                              {totalAmount.toFixed(2)} USD
                                            </p>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                              <table>
                                <tbody
                                  style={{
                                    borderBottom: "1px solid #99a0ac",
                                  }}
                                >
                                  <tr>
                                    <td
                                      style={{
                                        verticalAlign: "top",
                                        paddingBottom: "20px",
                                        width: "42%",
                                      }}
                                    >
                                      {(bankDetails.bankName ||
                                        bankDetails.accountNo ||
                                        bankDetails.sortCode) && (
                                        <h1
                                          style={{
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            marginTop: "16px",
                                            textAlign: "start",
                                          }}
                                        >
                                          Bank Details :
                                        </h1>
                                      )}
                                      {bankDetails.bankName && (
                                        <tr
                                          style={{
                                            display: "flex",
                                            justifyContent: "start",
                                            paddingTop: "8px",
                                          }}
                                        >
                                          <p
                                            style={{
                                              fontSize: "14px",
                                              fontWeight: "500",
                                              width: "100px",
                                            }}
                                          >
                                            Bank Name :
                                          </p>
                                          <p
                                            style={{
                                              fontSize: "14px",
                                              fontWeight: "500",
                                            }}
                                          >
                                            {bankDetails.bankName}
                                          </p>
                                        </tr>
                                      )}
                                      {bankDetails.accountNo && (
                                        <tr
                                          style={{
                                            display: "flex",
                                            justifyContent: "start",
                                            alignItems: "center",
                                            paddingTop: "8px",
                                          }}
                                        >
                                          <p
                                            style={{
                                              fontSize: "14px",
                                              fontWeight: "500",
                                              width: "100px",
                                            }}
                                          >
                                            Account No :
                                          </p>
                                          <p
                                            style={{
                                              fontSize: "14px",
                                              color: "#5e676f",
                                            }}
                                          >
                                            {bankDetails.accountNo}
                                          </p>
                                        </tr>
                                      )}
                                      {bankDetails.sortCode && (
                                        <tr
                                          style={{
                                            display: "flex",
                                            justifyContent: "start",
                                            alignItems: "center",
                                            paddingTop: "8px",
                                          }}
                                        >
                                          <p
                                            style={{
                                              fontSize: "14px",
                                              fontWeight: "500",
                                              width: "100px",
                                            }}
                                          >
                                            Sort Code :
                                          </p>
                                          <p
                                            style={{
                                              fontSize: "14px",
                                              color: "#5e676f",
                                            }}
                                          >
                                            {bankDetails.sortCode}
                                          </p>
                                        </tr>
                                      )}
                                    </td>
                                    <td style={{ width: "550px" }}>
                                      <table
                                        style={{
                                          width: "100%",
                                          borderSpacing: 0,
                                        }}
                                      >
                                        <tbody>
                                          {orderDetails?.deposit_requested && (
                                            <tr
                                              style={{
                                                display: "flex",
                                                justifyContent: "end",
                                                alignItems: "center",
                                                columnGap: "10px",
                                                marginTop: "8px",
                                              }}
                                            >
                                              <p
                                                style={{
                                                  textAlign: "end",
                                                  fontSize: "14px",
                                                  fontWeight: "500",
                                                }}
                                              >
                                                Deposit Requested :
                                              </p>
                                              <p
                                                style={{
                                                  textAlign: "end",
                                                  fontWeight: "500",
                                                  fontSize: "14px",
                                                  width: "100px",
                                                }}
                                              >
                                                {orderDetails.deposit_requested}{" "}
                                                USD
                                              </p>
                                            </tr>
                                          )}
                                          {orderDetails?.deposit_due_date && (
                                            <tr
                                              style={{
                                                display: "flex",
                                                justifyContent: "end",
                                                alignItems: "center",
                                                columnGap: "10px",
                                                paddingTop: "8px",
                                              }}
                                            >
                                              <p
                                                style={{
                                                  textAlign: "end",
                                                  fontSize: "14px",
                                                  fontWeight: "500",
                                                }}
                                              >
                                                Deposit Due Date :
                                              </p>
                                              <p
                                                style={{
                                                  textAlign: "end",
                                                  fontWeight: "500",
                                                  fontSize: "14px",
                                                  width: "100px",
                                                }}
                                              >
                                                {orderDetails.deposit_due_date}
                                              </p>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tbody
                  style={{
                    width: "100%",
                    borderBottom: "1px solid #99a0ac",
                  }}
                >
                  {orderDetails?.enquiry?.payment_terms?.length > 0 && (
                    <tr>
                      <td
                        style={{
                          verticalAlign: "top",
                          width: "100vw",
                          paddingBottom: "20px",
                        }}
                      >
                        <h1
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            marginTop: "16px",
                          }}
                        >
                          Payment Terms :
                        </h1>
                        <div
                          style={{
                            fontSize: "13px",
                           color: "#5e676f",
                            lineHeight: "20px",
                            marginTop: "4px",
                          }}
                        >
                          {orderDetails.enquiry.payment_terms.map((data, i) => (
                            <p
                              key={i}
                              style={{
                                position: "relative",
                                paddingLeft: "20px",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  left: "0",
                                  top: "0",
                                  fontSize: "22px",
                                }}
                              >
                                •
                              </span>
                              {data}
                            </p>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProformaDetailsPage;