import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF"; // Assuming InvoicePDF is the PDF component

const Invoice = ({ title, service, details }) => {
  return (
    <div>
      <h1>Invoice Preview</h1>
      <PDFDownloadLink
        document={
          <InvoicePDF title={title} service={service} details={details} />
        }
        fileName="invoice.pdf"
      >
        {({ loading }) =>
          loading ? "Preparing document..." : "Download Invoice"
        }
      </PDFDownloadLink>
    </div>
  );
};

export default Invoice;
