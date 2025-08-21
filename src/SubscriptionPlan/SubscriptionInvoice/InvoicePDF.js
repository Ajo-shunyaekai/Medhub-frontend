import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  textContainer: { flexDirection: "column" },
  leftTextContainer: { width: "50%", alignItems: "flex-start" },
  rightTextContainer: { width: "50%", alignItems: "flex-end" },
  page: { padding: 30, backgroundColor: "#ffffff", fontFamily: "Helvetica" },
  billLeftTextContainer: { width: "50%", display: "flex", alignItems: "flex-start", flexDirection: "row", gap: 4 },
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
   /*  border: "1px solid #99A0AC", */
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#99A0AC",

  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 10,
  },
  leftSection: { width: "50%", alignItems: "flex-start" },
  rightSection: { width: "50%", alignItems: "flex-end" },
  leftAlign: { textAlign: "left" },
  rightAlign: { textAlign: "right" },
  logo: { width: 150, paddingBottom: 12 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#282f86",
    paddingBottom: 10,
  },
  titleText: { fontSize: 12, color: "#212121" },
  infoHeading: { fontWeight: 600, fontSize: 11, lineHeight: 1.2, paddingBottom: 4 },
  infoText: { fontSize: 10, color: "#212121", lineHeight: 1.4 },
  table: { display: "table", width: "100%" },
  invoiceKey: { fontSize: 10, lineHeight: 1.4 },
  row: {
    width: "100%",
    flexDirection: "row",
    /* borderBottom: "1px solid #99A0AC", */
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  rowHead: { flexDirection: "row", backgroundColor: "#FFFFFF" },
  cellHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: 600,
    padding: 12,
    backgroundColor: "#e1f2ff",
    color: "#333",
  },
  tableText: {
    fontSize: 10,
    color: "#212121",
    paddingTop: 10,
    paddingBottom: 5
  },
  cell: { flex: 1, fontSize: 10, padding: 12, color: "#212121" },
  totalSectionFirstView: {
    paddingTop: 20,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  totalSectionSecondView: {
    width: "50%",
  /*   borderBottom: "1px solid #99A0AC", */
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#99A0AC",
    paddingBottom: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4
  },
  totalSectionSecondAmountView: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4
  }
});

const InvoicePDF = ({ city,company_reg_address,country,land_mark,locality,state, contact_person_country_code,contact_person_mobile_no,contact_person_email
  ,productName,amount,subscriptionStartDate,subscriptionEndDate,invoiceNumber,subtotalAmount,totalAmount,discount,discountAmount }) => {

  /* console.log("city: ",city);
  console.log("subscriptionDetails: ",productName);
  console.log(moment(subscriptionStartDate).format("MM/DD/YYYY"));
  console.log(moment(subscriptionEndDate).format("MM/DD/YYYY")); */

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Image
            src={require("../assets/navibluelogo.png")}
            style={styles.logo}
          />

          {/* company name & address */}
          <View style={styles.header}>
            <View style={styles.leftSection}>
              <Text style={styles.infoHeading}>
                One Vision Technologies FZLLC,
              </Text>
              {company_reg_address && (
                <Text style={styles.infoText}>
                  {company_reg_address || ""},
                </Text>
              )}
              {
                locality && (
                  <Text style={styles.infoText}>
                    {locality || ""},
                    {locality && " "}
                  </Text>
                )
              }
              {
                land_mark && (
                  <Text style={styles.infoText}>
                    {land_mark || ""},
                    {land_mark && " "}
                  </Text>
                )
              }
              {(city ||
                state ||
                country) && (
                  <Text style={styles.infoText}>
                    {city || ""},
                    {city && " "}
                    {state || ""},
                    {state && " "}
                    {country || ""}
                  </Text>
                )}
              {(contact_person_mobile_no) && (
                <Text style={styles.infoText}>
                  {contact_person_country_code}{" "}
                  { contact_person_mobile_no}
                </Text>
              )}
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.title}>INVOICE</Text>
              <Text style={styles.invoiceKey}>
                Invoice Date:{" "}
                {moment(subscriptionStartDate).format(
                  "MM/DD/YYYY"
                )}
              </Text>
              <Text style={styles.invoiceKey}>
                Invoice No.:  {invoiceNumber}
              </Text>
            </View>
          </View>

          {/* Bill to section */}
          <View style={styles.header}>
            <View style={styles.billLeftTextContainer}>
              <Text style={styles.infoHeading}>Bill To:</Text>
              <Text style={styles.infoText}>
                {contact_person_email} {/* stripetest.shivani.test@yopmail.com */} {/* {user?.buyer_name || user?.supplier_name || ""} */}
              </Text>
            </View>
            <View style={styles.rightTextContainer}>
              {/* <Text style={styles.infoText}>
                Paid Via:{" "}Card
              </Text> */}
            </View>
          </View>

          {/* TABLE SECTION */}
          <View style={styles.table}>
            <View style={styles.rowHead}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cellHeader}>Description</Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text style={styles.cellHeader}>Quantity</Text>
                <Text style={styles.cellHeader}>Unit Price</Text>
                <Text style={styles.cellHeader}>Amount</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tableText}>{productName}</Text>
                <Text style={styles.infoText}>
                  ({subscriptionStartDate ? moment(subscriptionStartDate).format("MM/DD/YYYY") : ""} – 
                  {subscriptionEndDate ? moment(subscriptionEndDate).format("MM/DD/YYYY") : ""})
                </Text>

              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text style={[styles.cell, { flex: 1 }]}>1</Text>
                <Text style={[styles.cell, { flex: 1 }]}>${subtotalAmount?.toFixed(2)}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>${subtotalAmount?.toFixed(2)}</Text>
              </View>
            </View>

          </View>

          {/* Total Section */}
          <View style={styles.totalSectionFirstView}>
            {
              subtotalAmount && (
                <View style={styles.totalSectionSecondView}>
                  <Text style={styles.infoText}>Subtotal </Text>
                  <Text style={styles.infoText}>${subtotalAmount.toFixed(2)}</Text>
                </View>
              )
            }
            {
              (discount && discountAmount)&& (
                <View style={styles.totalSectionSecondView}>
                  <Text style={styles.infoText}>{discount} </Text>
                  <Text style={styles.infoText}>-${discountAmount.toFixed(2)}</Text>
                </View>
              )
            }
            {
              totalAmount && (
                <View style={styles.totalSectionSecondView}>
                  <Text style={styles.infoText}>Total </Text>
                  <Text style={styles.infoText}>${discountAmount ? (totalAmount - Number(discountAmount)).toFixed(2) : totalAmount.toFixed(2)}</Text>
                </View>
              )
            }
            {
              totalAmount && (
                <View style={styles.totalSectionSecondAmountView}>
                  <Text style={styles.infoHeading}>Amount due</Text>
                  <Text style={styles.infoText}>{discountAmount ? (totalAmount - Number(discountAmount)).toFixed(2): totalAmount.toFixed(2)} USD</Text>
                </View>
              )
            }
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default InvoicePDF;