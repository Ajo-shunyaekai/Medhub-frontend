import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequests } from "../../../../../api";

function BuyerProformaDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const adminIdSessionStorage = localStorage?.getItem("admin_id");
  const adminIdLocalStorage = localStorage?.getItem("admin_id");

  const [orderDetails, setOrderDetails] = useState();

  useEffect(() => {
    const getOrderDetails = async () => {
      if (!adminIdSessionStorage && !adminIdLocalStorage) {
        localStorage?.clear();
        navigate("/admin/login");
        return;
      }
      const obj = {
        admin_id: adminIdSessionStorage || adminIdLocalStorage,
        order_id: orderId,
      };

      try {
        const response = await apiRequests.getRequest(
          `order/get-specific-order-details/${orderId}`,
          obj
        );
        if (response?.code === 200) {
          setOrderDetails(response.result);
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

  // Function to format address in two lines
  const formatAddress = (address) => {
    if (!address) return ["", ""];
    const {
      company_reg_address,
      locality,
      land_mark,
      city,
      state,
      country,
      pincode,
    } = address;
    const line1Parts = [
      company_reg_address,
      locality,
      land_mark,
    ].filter(Boolean);
    const line2Parts = [city, state, country, pincode].filter(Boolean);
    return [
      line1Parts.join(", "),
      line2Parts.join(", "),
    ];
  };

  const buyerAddress = formatAddress(orderDetails?.buyer_registered_address);
  const supplierAddress = formatAddress(orderDetails?.supplier_registered_address);

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
              color: "#212121",
              boxShadow: "0 2px 5px -1px #32325d40, 0 1px 3px -1px #0000004d",
              backgroundColor: "#FFFFFF",
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
                <tr style={{ borderBottom: "1px solid #616161" }}>
                  <td style={{ display: "flex", justifyContent: "end" }}>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>
                      Invoice Number :{" "}
                    </p>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>
                      &nbsp;{orderDetails?.invoice_no}
                    </p>
                  </td>
                  <td style={{ display: "flex", justifyContent: "end" }}>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>
                      Payment Due date :{" "}
                    </p>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>
                      &nbsp;{orderDetails?.payment_due_date}
                    </p>
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      paddingBottom: "10px",
                    }}
                  >
                    <p style={{ fontSize: "15px", fontWeight: "500" }}>
                      Invoice Generated Date :{" "}
                    </p>
                    <p style={{ fontSize: "15px", fontWeight: "500" }}>
                      &nbsp;{orderDetails?.invoice_date}
                    </p>
                  </td>
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
                        <tr style={{ borderBottom: "1px solid #616161" }}>
                          <td
                            style={{
                              verticalAlign: "top",
                              width: "60%",
                              paddingRight: "20px",
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
                            <p
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                              }}
                            >
                              {orderDetails?.supplier_name}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#616161",
                              }}
                            >
                              {supplierAddress[0]}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#616161",
                              }}
                            >
                              {supplierAddress[1]}
                            </p>
                            <td
                              style={{
                                display: "flex",
                                justifyContent: "start",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: "#616161",
                                }}
                              >
                                {orderDetails?.supplier_mobile}
                              </p>
                            </td>
                            <td
                              style={{
                                display: "flex",
                                justifyContent: "start",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: "#616161",
                                }}
                              >
                                {orderDetails?.supplier_email}
                              </p>
                            </td>
                          </td>
                          <td
                            style={{
                              verticalAlign: "top",
                              width: "40%",
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
                            <p
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                textAlign: "end",
                              }}
                            >
                              {orderDetails?.buyer_name}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#616161",
                                textAlign: "end",
                              }}
                            >
                              {buyerAddress[0]}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#616161",
                                textAlign: "end",
                              }}
                            >
                              {buyerAddress[1]}
                            </p>
                            <td
                              style={{ display: "flex", justifyContent: "end" }}
                            >
                              <p
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: "#616161",
                                }}
                              >
                                {orderDetails?.buyer_mobile}
                              </p>
                            </td>
                            <td
                              style={{ display: "flex", justifyContent: "end" }}
                            >
                              <p
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: "#616161",
                                }}
                              >
                                {orderDetails?.buyer_email}
                              </p>
                            </td>
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
                                      borderBottom: "1px solid #616161",
                                      width: "40px",
                                    }}
                                  >
                                    S.No
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 0",
                                      fontWeight: 500,
                                      borderBottom: "1px solid #616161",
                                      width: "180px",
                                    }}
                                  >
                                    Name
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 0",
                                      fontWeight: 500,
                                      borderBottom: "1px solid #616161",
                                      width: "40px",
                                    }}
                                  >
                                    Qty
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 0",
                                      fontWeight: 500,
                                      borderBottom: "1px solid #616161",
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
                                      borderBottom: "1px solid #616161",
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
                                      borderBottom: "1px solid #616161",
                                      textAlign: "end",
                                      width: "120px",
                                    }}
                                  >
                                    Total Amount
                                  </td>
                                </tr>
                              </thead>
                              {orderItems.map((item, index) => (
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        paddingBlock: "12px",
                                        display: "flex",
                                        alignItems: "baseline",
                                        verticalAlign: "baseline",
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
                                        {item.medicine_name} (
                                        {item?.strength || "150mg"})
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
                                          fontSize: "13px",
                                        }}
                                      >
                                        {item?.quantity_required}
                                      </p>
                                    </td>
                                    <td
                                      style={{
                                        paddingBlock: "12px",
                                        textAlign: "end",
                                        verticalAlign: "baseline",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontWeight: 500,
                                          fontSize: "13px",
                                        }}
                                      >
                                        {item?.counter_price || item?.target_price}{" "}
                                        USD
                                      </p>
                                    </td>
                                    <td
                                      style={{
                                        paddingBlock: "12px",
                                        textAlign: "end",
                                        verticalAlign: "baseline",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontWeight: 500,
                                          fontSize: "13px",
                                        }}
                                      >
                                        {item.unit_tax}%
                                      </p>
                                    </td>
                                    <td
                                      style={{
                                        paddingBlock: "12px",
                                        textAlign: "end",
                                        verticalAlign: "baseline",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontWeight: 500,
                                          fontSize: "13px",
                                        }}
                                      >
                                        {item.total_amount.toFixed(2)} USD{" "}
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              ))}
                            </table>
                            <table>
                              <tbody
                                style={{
                                  borderTop: "1px solid #616161",
                                  borderBottom: "1px solid #616161",
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
                                        <tr
                                          style={{
                                            display: "flex",
                                            justifyContent: "end",
                                            alignItems: "center",
                                            columnGap: "10px",
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
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                              <table>
                                <tbody
                                  style={{
                                    borderBottom: "1px solid #616161",
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
                                          Bank Name :
                                        </p>
                                        <p
                                          style={{
                                            fontSize: "14px",
                                            fontWeight: "500",
                                          }}
                                        >
                                          {orderDetails?.bank_name}
                                        </p>
                                      </tr>
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
                                            fontWeight: "500",
                                          }}
                                        >
                                          {orderDetails?.account_number}
                                        </p>
                                      </tr>
                                    </td>
                                    <td style={{ width: "500px" }}>
                                      <table
                                        style={{
                                          width: "100%",
                                          borderSpacing: 0,
                                        }}
                                      >
                                        <tbody>
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
                                                width: "150px",
                                              }}
                                            >
                                              {orderDetails?.deposit_requested}{" "}
                                              USD
                                            </p>
                                          </tr>
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
                                                  width: "150px",
                                                }}
                                              >
                                                {orderDetails?.deposit_due_date}
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
                    borderBottom: "1px solid #616161",
                  }}
                >
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
                          fontWeight: "500",
                          lineHeight: "20px",
                          marginTop: "4px",
                          color: "#616161",
                        }}
                      >
                        {orderDetails?.enquiry?.payment_terms?.map((data, i) => (
                          <p
                            style={{
                              position: "relative",
                              paddingLeft: "20px",
                            }}
                            key={i}
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
                </tbody>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerProformaDetails;