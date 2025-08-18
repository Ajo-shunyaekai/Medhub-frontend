import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";

const Invoice = ({user, subscribedPlanDetails}) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <InvoicePDF user={user} subscriptionDetails={subscribedPlanDetails} />
    </PDFViewer>
  );
};

export default Invoice;
      