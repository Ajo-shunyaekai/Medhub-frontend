import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";

const Invoice = () => {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <InvoicePDF />
    </PDFViewer>
  );
};

export default Invoice;
      