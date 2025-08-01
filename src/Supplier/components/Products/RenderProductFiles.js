import React from "react";
import styles from './ProductDetails/productdetail.module.css'
import PDFIcon from '../../assets/images/pdf.png';
import DocxIcon from '../../assets/images/doc.png'
import Modal from 'react-modal';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // optional but improves rendering
import 'react-pdf/dist/esm/Page/TextLayer.css';

const fallbackImageUrl = "https://medhub.shunyaekai.com/uploads/fallbackImage.jpg";
// utility to check if URL ends with image extension
const isImageExtension = (fileName) => {
  return /\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName);
};

const RenderProductFiles = ({ files }) => {
  const baseUrl = process.env.REACT_APP_SERVER_URL?.endsWith("/")
  ? process.env.REACT_APP_SERVER_URL
  : `${process.env.REACT_APP_SERVER_URL}/`;

return files?.map((file, index) => {
  const fileUrl = file?.startsWith("http")
    ? file
    : `${baseUrl}uploads/products/${file}`;

  const isImage = isImageExtension(fileUrl);
  const isPdf = fileUrl?.toLowerCase()?.endsWith(".pdf");
  const isDocx = fileUrl?.toLowerCase()?.endsWith(".docx");

  if (isImage) {
    return (
      <img
        key={index}
        src={fileUrl}
        alt="ImageFile"
        className={styles.uploadImage}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImageUrl;
        }}
      />
    );
  }

  if (isPdf) {
    return (
      <a
        key={index}
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.pdfLink}
      >
        <img
          src={PDFIcon} // Or any PDF icon you prefer
          alt="PDF File"
          className={styles.uploadImage}
        />
        {/* <p>View PDF</p> */}
      </a>
    );
  } else if(isDocx) {
    return (
      <a
        key={index}
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.pdfLink}
      >
        <img
          src={DocxIcon} // Or any PDF icon you prefer
          alt="Docx File"
          className={styles.uploadImage}
        />
        {/* <p>View PDF</p> */}
      </a>
    );
  }

  // Fallback for unknown types
  return (
    <img
      key={index}
      src={fallbackImageUrl}
      alt="Fallback"
      className={styles.uploadImage}
    />
  );
});

};

export default RenderProductFiles;