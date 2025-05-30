import React from "react";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import styles from "./productdetail.module.css";
import { extractLast13WithExtension } from "../../../../utils/helper";

const RenderProductFiles = ({ files }) => {
  return files?.map((file, index) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    if (
      (file?.startsWith("http")
        ? file?.replaceAll(process.env.REACT_APP_AWS_BUCKET_URL, "")
        : file
      )?.endsWith(".pdf")
    ) {
      return (
        <div key={index} className={styles.uploadFileContainer}>
          <FaFilePdf
            size={50}
            color="red"
            style={{ cursor: "pointer" }}
            onClick={() =>
              window.open(
                file?.startsWith("http")
                  ? file
                  : `${serverUrl}uploads/products/${file}`,
                "_blank"
              )
            }
          />
          <div
            className={styles.additionalLink}
            onClick={() =>
              window.open(
                file?.startsWith("http")
                  ? file
                  : `${serverUrl}uploads/products/${file}`,
                "_blank"
              )
            }
          >
            {/* {file?.startsWith("http")
              ? extractLast13WithExtension(file)
              : extractFileName(file)} */}
            {extractLast13WithExtension(file)}
          </div>
        </div>
      );
    } else if (
      (file?.startsWith("http")
        ? file?.replaceAll(process.env.REACT_APP_AWS_BUCKET_URL, "")
        : file
      )?.endsWith(
        ".vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) ||
      (file?.startsWith("http")
        ? file?.replaceAll(process.env.REACT_APP_AWS_BUCKET_URL, "")
        : file
      )?.endsWith(".docx")
    ) {
      const docxFileName = file.replace(
        ".vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".docx"
      );
      const docxUrl = file?.startsWith("http")
        ? file
        : `${serverUrl}uploads/products/${docxFileName}`;

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
            {extractLast13WithExtension(file)}
          </div>
        </div>
      );
    } else {
      return (
        <img
          key={index}
          src={
            file?.startsWith("http")
              ? file
              : `${serverUrl}uploads/products/${file}`
          }
          alt={"image"}
          className={styles.uploadImage}
        />
      );
    }
  });
};

export default RenderProductFiles;
