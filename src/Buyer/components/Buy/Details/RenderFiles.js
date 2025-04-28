import React from "react";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import styles from './productdetails.module.css'
import PDFIcon from '../../../assets/images/pdf.png';
import DocxIcon from '../../../assets/images/doc.png'
 
const extractFileName = (url) => {
  return url.split("/").pop();
};

const fallbackImageUrl = "https://medhub.shunyaekai.com/uploads/fallbackImage.jpg";


// utility to check if URL ends with image extension
const isImageExtension = (fileName) => {
  return /\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName);
};
 
// const RenderProductFiles = ({ files }) => {
//   return files?.map((file, index) => {
//     const serverUrl = process.env.REACT_APP_SERVER_URL;
 
//     if (file.endsWith(".pdf")) {
//       return (
//         <div key={index} className={styles.uploadFileContainer}>
//           <FaFilePdf
//             size={50}
//             color="red"
//             style={{ cursor: "pointer" }}
//             onClick={() =>
//               window.open(`${serverUrl}uploads/products/${file}`, "_blank")
//             }
//           />
//           <div
//             className={styles.additionalLink}
//             onClick={() =>
//               window.open(`${serverUrl}uploads/products/${file}`, "_blank")
//             }
//           >
//             {extractFileName(file)}
//           </div>
//         </div>
//       );
//     } else if (
//       file.endsWith(
//         ".vnd.openxmlformats-officedocument.wordprocessingml.document"
//       ) ||
//       file.endsWith(".docx")
//     ) {
//       const docxFileName = file.replace(
//         ".vnd.openxmlformats-officedocument.wordprocessingml.document",
//         ".docx"
//       );
//       const docxUrl = `${serverUrl}uploads/products/${docxFileName}`;
 
//       return (
 
//         <div key={index} className={styles.uploadFileContainer}>
//           <FaFileWord
//             size={50}
//             color="blue"
//             style={{ cursor: "pointer" }}
//             onClick={() => window.open(docxUrl, "_blank")}
//           />
//           <div
//             className={styles.additionalLink}
//             onClick={() => window.open(docxUrl, "_blank")}
//           >
//             {extractFileName(docxFileName)}
//           </div>
//         </div>
//       );
//     } else {
//       return (
//         <img
//           key={index}
//           src={`${serverUrl}uploads/products/${file}`}
//           alt={"image"}
//           className={styles.uploadImage}
//         />
//       );
//     }
//   });
// };

const RenderProductFiles = ({ files }) => {

  const baseUrl = process.env.REACT_APP_SERVER_URL?.endsWith("/")
  ? process.env.REACT_APP_SERVER_URL
  : `${process.env.REACT_APP_SERVER_URL}/`;

return files?.map((file, index) => {
  const fileUrl = file?.startsWith("http")
    ? file
    : `${baseUrl}uploads/products/${file}`;

  const isImage = isImageExtension(fileUrl);
  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");
  const isDocx = fileUrl.toLowerCase().endsWith(".docx");

  if (isImage) {
    return (
      <img
        key={index}
        src={fileUrl}
        alt="Image File"
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