import React from "react";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import styles from "./productdetail.module.css";
 
const extractFileName = (url) => {
  return url.split("/").pop();
};
 
const RenderProductFiles = ({ files }) => {
  return files?.map((file, index) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
 
    if (file?.endsWith(".pdf")) {
      return (
        <div key={index} className={styles.uploadFileContainer}>
          <FaFilePdf
            size={50}
            color="red"
            style={{ cursor: "pointer" }}
            onClick={() =>
              window.open(`${serverUrl}uploads/products/${file}`, "_blank")
            }
          />
          <div
            className={styles.additionalLink}
            onClick={() =>
              window.open(`${serverUrl}uploads/products/${file}`, "_blank")
            }
          >
            {extractFileName(file)}
          </div>
        </div>
      );
    } else if (
      file?.endsWith(
        ".vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) ||
      file?.endsWith(".docx")
    ) {
      const docxFileName = file.replace(
        ".vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".docx"
      );
      const docxUrl = `${serverUrl}uploads/products/${docxFileName}`;
 
      return (
 
        <div key={index} className={styles.uploadFileContainer}>
          <FaFileWord
            size={50}
            color="blue"
            style={{ cursor: "pointer" }}
            onClick={() => window.open(docxUrl, "_blank")}
          />
          <div
            className={styles.additionalLink}
            onClick={() => window.open(docxUrl, "_blank")}
          >
            {extractFileName(docxFileName)}
          </div>
        </div>
      );
    } else {
      return (
        <img
          key={index}
          src={`${serverUrl}uploads/products/${file}`}
          alt={"image"}
          className={styles.uploadImage}
        />
      );
    }
  });
};
 
export default RenderProductFiles;
