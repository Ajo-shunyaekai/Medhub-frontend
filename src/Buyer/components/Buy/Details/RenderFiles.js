import React, { useState } from "react";
// import { Document, Page } from "react-pdf";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import styles from './productdetails.module.css'
import PDFIcon from '../../../assets/images/pdf.png';
import DocxIcon from '../../../assets/images/doc.png'
import CloseIcon from '@mui/icons-material/Close';
// import { Modal } from "react-responsive-modal";
// import "react-responsive-modal/styles.css";
// import Modal from 'react-modal';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // optional but improves rendering
// import 'react-pdf/dist/esm/Page/TextLayer.css';
import PdfViewerModal from '../../../../common/PdfViewer.js'

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
 
const extractFileName = (url) => {
  return url?.split("/")?.pop();
};

const fallbackImageUrl = "https://medhub.shunyaekai.com/uploads/fallbackImage.jpg";

// utility to check if URL ends with image extension
const isImageExtension = (fileName) => {
  return /\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName);
};


// const isImageExtension = (fileName) =>
//   /\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName);
// const isPdf = (fileName) => fileName?.toLowerCase()?.endsWith(".pdf");
// const isDocx = (fileName) => fileName?.toLowerCase()?.endsWith(".docx");

const RenderProductFiles = ({ files }) => {
  const [open, setOpen] = useState(false);
  const [pdfToPreview, setPdfToPreview] = useState(null);
  const baseUrl = process.env.REACT_APP_SERVER_URL?.endsWith("/")
    ? process.env.REACT_APP_SERVER_URL
    : `${process.env.REACT_APP_SERVER_URL}/`;

  const handleOpenPdf = (fileUrl) => {
    setPdfToPreview(fileUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPdfToPreview(null);
  };

  const isImageExtension = (url) =>
    /\.(jpeg|jpg|png|gif|webp)$/i.test(url);

  const isPdf = (url) => url?.toLowerCase()?.endsWith(".pdf");
  const isDocx = (url) => url?.toLowerCase()?.endsWith(".docx");

  return (
    <>
      {files?.map((file, index) => {
        // const fileUrl = file?.startsWith("http")
        //   ? file
        //   : `${baseUrl}uploads/products/${file}`;

        const filename = file?.split("/")?.pop(); // ensures just the filename
        const fileUrl = `${process.env.REACT_APP_SERVER_URL.replace(/\/$/, "")}/pdf-proxy/${filename}`;

        if (isImageExtension(fileUrl)) {
          return (
            <img
              key={index}
              src={fileUrl}
              alt="Image"
              className={styles.uploadImage}
              onError={(e) => (e.target.src = fallbackImageUrl)}
            />
          );
        }

        if (isPdf(fileUrl)) {
          return (
            <div
              key={index}
              className={styles.pdfLink}
              onClick={() => handleOpenPdf(fileUrl)}
              style={{ cursor: "pointer" }}
            >
              <img src={PDFIcon} alt="PDF" className={styles.uploadImage} />
            </div>
          );
        }

        if (isDocx(fileUrl)) {
          return (
            <a
              key={index}
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pdfLink}
            >
              <img src={DocxIcon} alt="DOCX" className={styles.uploadImage} />
            </a>
          );
        }

        return (
          <img
            key={index}
            src={fallbackImageUrl}
            alt="Fallback"
            className={styles.uploadImage}
          />
        );
      })}


      {/* PDF Modal using react-modal */}
      {/* <Modal
        isOpen={open}
        onRequestClose={handleClose}
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
        
        <span onClick={handleClose} style={{ float: 'right' }}>
                        <CloseIcon style={{ float: 'right' }} />
                      </span>
        {pdfToPreview ? (
          <Document
            file={{ url: pdfToPreview, withCredentials: false }}
            onLoadError={(err) => console.error("PDF Load Error:", err)}
            onSourceError={(err) => console.error("PDF Source Error:", err)}
          >
            <Page pageNumber={1} width={480} />
          </Document>
        ) : (
          <p>Loading...</p>
        )}
      </Modal> */}
      <PdfViewerModal isOpen={open} onClose={handleClose} fileUrl={pdfToPreview} />

      {/* Optional Modal for pdf viewer */}
      {/* {open && (
          
        <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeadContainer}>
                  <div className={styles.modalTitle}>{'PDF Viewer'}</div>
                  <button className={styles.closeButton} onClick={handleClose}>×</button>
                </div>
                <div className={styles.fileInputWrapper}>
                  <label className={styles.formLabel}>{title} File (CSV)</label>
                  <div className={styles.modalInnerSection}>
                    {pdfToPreview ? (
                      <iframe
                        src={pdfToPreview}
                        className={styles.pdfIframe}
                        width={`100%`}
                        height={`100vh`}
                        title="Purchase Invoice"
                        accessKey=""
                        onError={() =>
                          alert("Failed to load PDF. Please check the file path.")
                        }
                      />
                    ) : (
                      <p>Loading PDF or file not found...</p>
                    )}
                  </div>
                  {error && <p className={styles.errorText}>{error}</p>}
                </div>
                <div className={styles.modalButtonContainer}>
                   <button className={styles.buttonSubmit} onClick={handleUploadClick}>{title}</button>
                  <button className={styles.buttonCancel} onClick={onClose}>Cancel</button>
                 
                </div>
              </div>
            </div>
        )} */}
    </>
  );
};

export default RenderProductFiles;