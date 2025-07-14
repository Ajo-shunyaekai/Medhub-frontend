// components/common/PdfViewerModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { Document, Page } from 'react-pdf';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; 
import 'react-pdf/dist/esm/Page/TextLayer.css';
import CloseIcon from '@mui/icons-material/Close';

GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const PdfViewerModal = ({ isOpen, onClose, fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="PDF Viewer"
      style={{
        content: {
          width: '550px',
          height: '650px',
          margin: 'auto',
          overflow: 'auto',
        },
      }}
    >
      {/* <button onClick={onClose} style={{ float: 'right' }}>
        Close
      </button> */}
      
      {/* <h4>PDF Preview</h4> */}
      {fileUrl ? (
        <>
        <span onClick={onClose} style={{ float: 'right' }}>
                        <CloseIcon  />
                      </span>
        <Document
          file={{ url: fileUrl, withCredentials: false }}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => console.error("PDF Load Error:", err)}
          onSourceError={(err) => console.error("PDF Source Error:", err)}
        >
          {/* <Page pageNumber={1} width={480} /> */}
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={480}
            />
          ))}
        </Document>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
};

export default PdfViewerModal;
