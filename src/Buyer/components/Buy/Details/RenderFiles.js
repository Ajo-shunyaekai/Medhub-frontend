import React, { useState } from "react";
// import { Document, Page } from "react-pdf";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import styles from './productdetails.module.css'
import PDFIcon from '../../../assets/images/pdf.png';
import DocxIcon from '../../../assets/images/doc.png'
import CloseIcon from '@mui/icons-material/Close';
import PdfViewerModal from '../../../../common/PdfViewer.js'
import PdfThumbnail from '../../../../common/PdfThumbnail.js'
 
const extractFileName = (url) => {
  return url?.split("/")?.pop();
};

const fallbackImageUrl = "https://medhub.shunyaekai.com/uploads/fallbackImage.jpg";

// utility to check if URL ends with image extension
const isImageExtension = (fileName) => {
  return /\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName);
};


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

        // if (isPdf(fileUrl)) {
        //   return (
        //     <div
        //       key={index}
        //       className={styles.pdfLink}
        //       onClick={() => handleOpenPdf(fileUrl)}
        //       style={{ cursor: "pointer" }}
        //     >
        //       <img src={PDFIcon} alt="PDF" className={styles.uploadImage} />
        //     </div>
        //   );
        // }

        if (isPdf(fileUrl)) {
          return (
            <PdfThumbnail
              key={index}
              fileUrl={fileUrl}
              onClick={() => handleOpenPdf(fileUrl)}
              className={styles.uploadImage}
              fallbackImageUrl={fallbackImageUrl}
            />
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
      <PdfViewerModal isOpen={open} onClose={handleClose} fileUrl={pdfToPreview} />

    </>
  );
};

export default RenderProductFiles;