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
  billLeftTextContainer:{width:"50%",display:"flex",alignItems:"flex-start", flexDirection:"row", gap:4},
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    border: "1px solid #99A0AC",
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
  infoHeading:{fontWeight:600, fontSize:11, lineHeight:1.2,paddingBottom:4},
  infoText: { fontSize: 10, color: "#212121", lineHeight:1.4 },
  table: { display: "table", width: "100%" },
  invoiceKey:{fontSize:10,lineHeight:1.4},
  row: {
    width:"100%",
    flexDirection: "row",
    /* borderBottom: "1px solid #99A0AC", */
    paddingBottom:10,
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
  tableText:{
    fontSize: 10,
    color: "#212121",
    paddingTop: 10,
    paddingBottom: 5
  },
  cell: { flex: 1, fontSize: 10, padding: 12, color: "#212121" },
  totalSectionFirstView:{
    paddingTop: 20,
    width:"100%",
    display:"flex",
    flexDirection:"col",
    alignItems:"flex-end"
  },
  totalSectionSecondView:{
    width:"50%",
    borderBottom: "1px solid #99A0AC",
    paddingBottom:4,
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    paddingTop:4
  },
  totalSectionSecondAmountView:{
    width:"50%",
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    paddingTop:4
  }
});
 
const InvoicePDF = ({ user, subscriptionDetails }) => {

  return(
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
                  One Vision Technologies FZLLC{/* {user?.registeredAddress?.company_reg_address || ""} */},
                </Text>
            {/*   {user?.registeredAddress?.company_reg_address && (
                <Text style={styles.infoText}>
                  {user?.registeredAddress?.company_reg_address || ""},
                </Text>
              )} */}
              <Text style={styles.infoText}>
                VUPR0467, Compass building - Al Hulaila{/* {user?.registeredAddress?.locality} */}
              </Text>
              <Text style={styles.infoText}>AL Hulaila Industrial Zone-FZ,</Text>
              <Text style={styles.infoText}>United Arab Emirates</Text>
              {/* <Text style={styles.infoText}>إمارة رأس الخيمة</Text> */}
              <Text style={styles.infoText}>+91 9292392399</Text>
              {/* {(user?.registeredAddress?.city ||
                user?.registeredAddress?.state ||
                user?.registeredAddress?.country) && (
                <Text style={styles.infoText}>
                  {user?.registeredAddress?.city || ""}
                  {user?.registeredAddress?.city && " "}
                  {user?.registeredAddress?.state || ""}
                  {user?.registeredAddress?.state && " "}
                  {user?.registeredAddress?.country || ""}
                </Text>
              )} */}
              {/* {(user?.contact_person_mobile ||
                user?.contact_person_mobile_no) && (
                <Text style={styles.infoText}>
                  {user?.contact_person_country_code}{" "}
                  {user?.contact_person_mobile || user?.contact_person_mobile_no}
                </Text>
              )} */}
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.title}>INVOICE</Text>
              {/* <Text style={styles.titleText}>
                Payment ID:{" "}
                {subscriptionDetails?.paymentMethodId
                  ?.replace("pm_", "PAY")
                  ?.slice(0, 8)}
              </Text> */}
              <Text style={styles.invoiceKey}>
                Invoice Date:{" "}
                {/* {moment(subscriptionDetails?.subscriptionStartDate).format(
                  "MM/DD/YYYY"
                )} */}
                05/08/2025
              </Text>
              <Text style={styles.invoiceKey}>
                Invoice No.:  INV-545723{/* {subscriptionDetails?.invoiceNumber} */}
              </Text>
            </View>
          </View>
  
          {/* Bill to section */}
          <View style={styles.header}>
            <View style={styles.billLeftTextContainer}>
              <Text style={styles.infoHeading}>Bill To:</Text>
              <Text style={styles.infoText}>
                stripetest.shivani.test@yopmail.com {/* {user?.buyer_name || user?.supplier_name || ""} */}
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
                <Text style={styles.tableText}>Yearly Subscription</Text>
                <Text style={styles.infoText}>(Aug 4, 2025 – Aug 4, 2026)</Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text style={[styles.cell, { flex: 1 }]}>1</Text>
                <Text style={[styles.cell, { flex: 1 }]}>$1,188.00</Text>
                <Text style={[styles.cell, { flex: 1 }]}>$1,188.00</Text>
              </View>
            </View>
  
            {/* <View style={styles.row}>
              <Text style={[styles.cell, styles.leftAlign]}>Total Amount:</Text>
              <Text style={[styles.cell, styles.rightAlign]}>
                $ {subscriptionDetails?.amount || 0}
              </Text>
            </View> */}
          </View>
  
          {/* Total Section */}
          <View style={styles.totalSectionFirstView}>
            <View style={styles.totalSectionSecondView}>
                <Text style={styles.infoText}>Subtotal </Text>
                <Text style={styles.infoText}>$1,188.00</Text>
              </View>
              <View style={styles.totalSectionSecondView}>
                <Text style={styles.infoText}>SAVET1-99 ($99.00 off) </Text>
                <Text style={styles.infoText}>-$99.00</Text>
              </View>
              <View style={styles.totalSectionSecondView}>
                <Text style={styles.infoText}>Total </Text>
                <Text style={styles.infoText}>$1,089.00</Text>
              </View>
              <View style={styles.totalSectionSecondAmountView}>
                <Text style={styles.infoHeading}>Amount due</Text>
                <Text style={styles.infoText}>$1,089.00 USD</Text>
              </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
 
export default InvoicePDF;