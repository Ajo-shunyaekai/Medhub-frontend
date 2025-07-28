import React, { useState } from "react";
import Modal from "react-modal";
import { Document, Page, pdfjs } from "react-pdf";
import CloseIcon from "@mui/icons-material/Close";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Use official CDN worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const PdfViewerModal = ({ isOpen, onClose, fileUrl }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="PDF Viewer"
      style={{
        content: {
          width: "600px",
          height: "700px",
          margin: "auto",
          overflow: "auto",
        },
      }}
    >
      <span onClick={onClose} style={{ float: "right", cursor: "pointer" }}>
        <CloseIcon />
      </span>
      {fileUrl ? (
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => console.error("PDF Load Error:", err)}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page key={index + 1} pageNumber={index + 1} width={550} />
          ))}
        </Document>
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
};

export default PdfViewerModal;