import React, { useEffect, useState } from "react";
import styles from "./PurchasedOrderDetails.module.css";
import html2pdf from "html2pdf.js";
import { useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../../../../api/Requests";
import Loader from "../../SharedComponents/Loader/Loader";

const PurchasedOrderDetails = () => {
  const { purchaseOrderId } = useParams();
  const navigate = useNavigate();

  const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

  const [poDetails, setPoDetails] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      setLoading(false);
      return;
    }

    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      purchaseOrder_id: purchaseOrderId,
    };

    postRequestWithToken(
      "purchaseorder/get-po-details",
      obj,
      async (response) => {
        if (response?.code === 200) {
          setPoDetails(response.result);
        }
        setLoading(false);
      }
    );
  }, [buyerIdSessionStorage, buyerIdLocalStorage, purchaseOrderId, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (!poDetails) {
    return <div>No purchase order details available.</div>;
  }

  const orderItems =
    poDetails?.order_items?.map((item) => ({
      ...item,
      unit_price: parseFloat(item.unit_price),
      unit_tax: parseFloat(item?.medicine_details?.general?.unit_tax || "0"),
      total_amount: parseFloat(item?.total_amount),
    })) || [];

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.total_amount,
    0
  );
  const totalTaxAmount = orderItems.reduce((sum, item) => {
    const unitTaxRate =
      parseFloat(
        item.unit_tax || item?.medicine_details?.general?.unit_tax || "0"
      ) / 100;
    const itemTotalAmount = parseFloat(item.total_amount);
    return sum + itemTotalAmount * unitTaxRate;
  }, 0);
  const grandTotal = totalAmount + totalTaxAmount;

  const handleDownload = () => {
    const element = document.getElementById("po-content");
    const options = {
      margin: 0.5,
      filename: `purchaseOrder-${poDetails?.po_number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };

  // Format buyer and supplier addresses
  const buyerAddressLine1 = [
    poDetails?.buyer_registered_address?.company_reg_address,
    poDetails?.buyer_registered_address?.locality,
    poDetails?.buyer_registered_address?.land_mark,
  ]
    .filter(Boolean)
    .join(", ");
  const buyerAddressLine2 = [
    poDetails?.buyer_registered_address?.country,
    // poDetails?.buyer_registered_address?.state,
    // poDetails?.buyer_registered_address?.city,
    // poDetails?.buyer_registered_address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const supplierAddressLine1 = [
    poDetails?.supplier_registered_address?.company_reg_address,
    poDetails?.supplier_registered_address?.locality,   
    poDetails?.supplier_registered_address?.land_mark,
  ]
    .filter(Boolean)
    .join(", ");
  const supplierAddressLine2 = [
    poDetails?.supplier_registered_address?.country,
    poDetails?.supplier_registered_address?.state,
    poDetails?.supplier_registered_address?.city,
    poDetails?.supplier_registered_address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={styles["purchased-template-design"]}>
      <div className={styles["purchased-scroll-wrapper"]}>
        <div className={styles["purchased-template-download"]}>
          <div
            className={styles["purchased-template-button"]}
            onClick={handleDownload}
          >
            Download
          </div>
        </div>
        <div
          id="po-content"
          style={{
            maxWidth: "800px",
            margin: "auto auto 10rem",
            padding: "30px",
            border: "1px solid #eee",
            fontSize: "16px",
            lineHeight: "24px",
            color: "#5e676f",
            boxShadow: '0 2px 5px -1px #32325d40, 0 1px 3px -1px #0000004d',
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
            Purchase Order
          </div>
          <table style={{ fontSize: "12px" }}>
            <thead>
              <div className={styles["purchased-order-container"]}>
                <tr>
                  <td>
                    <img
                      src={
                        poDetails?.buyer_details?.[0]?.buyer_image?.[0]?.startsWith(
                          "http"
                        )
                          ? poDetails?.buyer_details?.[0]?.buyer_image?.[0]
                          : `${process.env.REACT_APP_SERVER_URL}uploads/buyer/buyer_images/${poDetails?.buyer_details?.[0]?.buyer_image?.[0]}`
                      }
                      alt="companylogo"
                      className={styles["purchange-logo"]}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ display: "flex", justifyContent: "end" }}>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>
                      PO Number :{" "}
                    </p>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>
                       {poDetails?.po_number}
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
                      PO Date :{" "}
                    </p>
                    <p style={{ fontSize: "15px", fontWeight: "500" }}>
                       {poDetails?.po_date}
                    </p>
                  </td>
                </tr>
              </div>
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
                      <tr style={{ borderBottom: "1px solid #555555" }}>
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
                          <p
                            style={{
                              fontSize: "16px",
                              fontWeight: 500,
                            }}
                          >
                            {poDetails?.buyer_name}
                          </p>
                          {/* <p
                            style={{
                              fontSize: "13px",
                              color: "#555555",
                              fontWeight: "500",
                            }}
                          >
                            {buyerAddressLine1}
                          </p> */}
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#5e676f",
                            
                            }}
                          >
                            {buyerAddressLine2}
                          </p>
                          <div
                            style={{ display: "flex", justifyContent: "start" }}
                          >
                            <p
                              style={{
                                fontSize: "13px",
                              color: "#5e676f",
                              }}
                            >
                              {poDetails?.buyer_country_code}{" "}
                              {poDetails?.buyer_mobile}
                            </p>
                          </div>
                          <div
                            style={{ display: "flex", justifyContent: "start" }}
                          >
                            <p
                              style={{
                                fontSize: "13px",
                                color: "#5e676f",
                              }}
                            >
                              {poDetails?.buyer_email}
                            </p>
                          </div>
                          <div
                            style={{ display: "flex", justifyContent: "start" }}
                          >
                            <p
                              style={{
                                fontSize: "13px",
                               color: "#5e676f",
                                
                              }}
                            >
                              Registration No. :{" "}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                              color: "#5e676f",
                              }}
                            >
                               {poDetails?.buyer_regNo}
                            </p>
                          </div>
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "50%",
                            paddingLeft:"10px",
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
                            {poDetails?.supplier_name}
                          </p>
                          <p
                            style={{
                              fontSize: "13px",
                            color: "#5e676f",
                              textAlign: "end",
                            }}
                          >
                            {supplierAddressLine1}
                          </p>
                          <p
                            style={{
                              fontSize: "13px",
                            color: "#5e676f",
                              textAlign: "end",
                            }}
                          >
                            {supplierAddressLine2}
                          </p>
                          <div
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <p
                              style={{
                                fontSize: "13px",
                              color: "#5e676f",
                              }}
                            >
                              {poDetails?.supplier_country_code}{" "}
                              {poDetails?.supplier_mobile}
                            </p>
                          </div>
                          <div
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <p
                              style={{
                                fontSize: "13px",
                              color: "#5e676f",
                              }}
                            >
                              {poDetails?.supplier_email}
                            </p>
                          </div>
                          <div
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <p
                              style={{
                                fontSize: "13px",
                               color: "#5e676f",
                                
                              }}
                            >
                              Registration No. :{" "}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                              color: "#5e676f",
                              }}
                            >
                               {poDetails?.supplier_regNo}
                            </p>
                          </div>
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
                                    borderBottom:
                                      "1px solid #555555",
                                    width: "40px",
                                  }}
                                >
                                  S.No
                                </td>
                                <td
                                  style={{
                                    padding: "8px 0",
                                    fontWeight: 500,
                                    borderBottom:
                                      "1px solid #555555",
                                    width: "200px",
                                  }}
                                >
                                  Item Name
                                </td>
                                <td
                                  style={{
                                    padding: "8px 0",
                                    fontWeight: 500,
                                    borderBottom:
                                      "1px solid #555555",
                                    width: "40px",
                                  }}
                                >
                                  Qty
                                </td>
                                <td
                                  style={{
                                    padding: "8px 0",
                                    fontWeight: 500,
                                    borderBottom:
                                      "1px solid #555555",
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
                                    borderBottom:
                                      "1px solid #555555",
                                    textAlign: "end",
                                    width: "100px",
                                  }}
                                >
                                  Tax %
                                </td>
                                <td
                                  style={{
                                    padding: "8px 0",
                                    fontWeight: 500,
                                    borderBottom:
                                      "1px solid #555555",
                                    textAlign: "end",
                                    width: "120px",
                                  }}
                                >
                                  Total Price
                                </td>
                              </tr>
                            </thead>
                            {orderItems?.map((item, index) => (
                              <tbody key={index}>
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
                                      {index + 1}
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
                                      {item.medicine_name}
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
                                      {item?.counter_price ||
                                        item?.target_price}{" "}
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
                                      {item.unit_tax ||
                                        item?.medicine_details?.general
                                          ?.unit_tax}
                                      %
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
                                      {item.total_amount.toFixed(2)} USD
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            ))}
                          </table>
                          <table>
                            <tbody
                              style={{
                                borderTop: "1px solid #555555",
                                borderBottom: "1px solid #555555",
                              }}
                            >
                              <tr>
                                <td style={{ width: "750px" }}>
                                  <table
                                    style={{ width: "100%", borderSpacing: 0 }}
                                  >
                                    <tbody>
                                      <tr
                                        style={{
                                          display: "flex",
                                          justifyContent: "end",
                                          alignItems: "center",
                                          columnGap: "10px",
                                          marginTop: "8px",
                                          marginBottom: "8px",
                                        }}
                                      >
                                        <p
                                          style={{
                                            textAlign: "end",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                          }}
                                        >
                                          Total Amount :
                                        </p>
                                        <p
                                          style={{
                                            textAlign: "end",
                                            fontWeight: "500",
                                            fontSize: "14px",
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
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
            {poDetails?.additional_instructions && (
              <tfoot>
                <tbody
                  style={{
                    width: "100vw",
                    borderBottom: "1px solid #555555",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        verticalAlign: "top",
                        width: "100vw",
                        paddingRight: "20px",
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
                        Additional Instruction :
                      </h1>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#555555",
                          lineHeight: "20px",
                          marginTop: "4px",
                        }}
                      >
                        <p
                          style={{ position: "relative", paddingLeft: "20px", fontSize:"13px", fontWeight:"500" }}
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
                          {poDetails?.additional_instructions}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchasedOrderDetails;