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
  titleText: { fontSize: 12, color: "#5e676f" },
  infoText: { fontSize: 12, color: "#5e676f", paddingBottom: 10 },
  table: { display: "table", width: "100%" },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #99A0AC",
    backgroundColor: "#FFFFFF",
  },
  rowHead: { flexDirection: "row", backgroundColor: "#FFFFFF" },
  cellHeader: {
    flex: 1,
    fontSize: 13,
    fontWeight: "bold",
    padding: 12,
    backgroundColor: "#e1f2ff",
    color: "#333",
  },
  cell: { flex: 1, fontSize: 12, padding: 12, color: "#5e676f" },
});

const InvoicePDF = ({ user, subscriptionDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <Image
          src={require("../assets/navibluelogo.png")}
          style={styles.logo}
        />
        <View style={styles.header}>
          <View style={styles.leftSection}>
            {user?.registeredAddress?.company_reg_address && (
              <Text style={styles.infoText}>
                {user?.registeredAddress?.company_reg_address || ""},
              </Text>
            )}
            <Text style={styles.infoText}>
              {user?.registeredAddress?.locality}
            </Text>
            {(user?.registeredAddress?.city ||
              user?.registeredAddress?.state ||
              user?.registeredAddress?.country) && (
              <Text style={styles.infoText}>
                {user?.registeredAddress?.city || ""}
                {user?.registeredAddress?.city && " "}
                {user?.registeredAddress?.state || ""}
                {user?.registeredAddress?.state && " "}
                {user?.registeredAddress?.country || ""}
              </Text>
            )}
            {(user?.contact_person_mobile ||
              user?.contact_person_mobile_no) && (
              <Text style={styles.infoText}>
                {user?.contact_person_country_code}{" "}
                {user?.contact_person_mobile || user?.contact_person_mobile_no}
              </Text>
            )}
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.titleText}>
              Payment ID:{" "}
              {subscriptionDetails?.paymentMethodId
                ?.replace("pm_", "PAY")
                ?.slice(0, 8)}
            </Text>
          </View>
        </View>
        <View style={styles.header}>
          <View style={styles.leftTextContainer}>
            <Text style={styles.infoText}>Bill To:</Text>
            <Text style={styles.infoText}>{user?.buyer_name || ""}</Text>
          </View>
          <View style={styles.rightTextContainer}>
            <Text style={styles.infoText}>
              Invoice Date:{" "}
              {moment(subscriptionDetails?.subscriptionStartDate).format(
                "MM/DD/YYYY"
              )}
            </Text>
            <Text style={styles.infoText}>
              Invoice No.: {subscriptionDetails?.invoiceNumber}
            </Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.rowHead}>
            <Text style={[styles.cellHeader, styles.leftAlign]}>
              Items Ordered
            </Text>
            <Text style={[styles.cellHeader, styles.rightAlign]}>Price</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.leftAlign]}>
              {subscriptionDetails?.name || ""}
            </Text>
            <Text style={[styles.cell, styles.rightAlign]}>
              $ {subscriptionDetails?.amount || 0}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.leftAlign]}>Total Amount:</Text>
            <Text style={[styles.cell, styles.rightAlign]}>
              $ {subscriptionDetails?.amount || 0}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
