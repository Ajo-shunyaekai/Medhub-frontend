import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import PDFIcon from "../assets/images/pdf.png";

GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const PdfThumbnail = ({ fileUrl, onClick, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari || hasError) {
    return (
      <img
        src={PDFIcon}
        alt="PDF"
        onClick={onClick}
        className={className}
        style={{
          width: 90,
          height: 100,
          objectFit: "contain",
          cursor: "pointer",
        }}
      />
    );
  }

  const onDocumentLoadSuccess = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF thumbnail load error:", error);
    setIsLoading(false);
    setHasError(true);
  };

  const onPageLoadError = (error) => {
    console.error("PDF page load error:", error);
    setHasError(true);
  };

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        width: 60,
        height: 70,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", // ✅ Box shadow added here
        borderRadius: "4px", // Optional: adds a subtle rounded corner
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            fontSize: "10px",
          }}
        >
          Loading...
        </div>
      )}

      <Document
        file={{ url: fileUrl }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading=""
      >
        <Page
          pageNumber={1}
          width={50}
          onLoadError={onPageLoadError}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
};

export default PdfThumbnail;
