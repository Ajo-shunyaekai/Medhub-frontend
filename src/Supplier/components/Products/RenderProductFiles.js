import React from "react";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
 
const extractFileName = (url) => {
  return url.split("/").pop();
};
 
const RenderProductFiles = ({ files }) => {
  return files?.map((file, index) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
 
    if (file.endsWith(".pdf")) {
      return (
        <div key={index} className="buyer-details-pdf-section">
          <FaFilePdf
            size={50}
            color="red"
            style={{ cursor: "pointer" }}
            onClick={() =>
              window.open(`${serverUrl}uploads/products/${file}`, "_blank")
            }
          />
          <div
            className="pdf-url"
            onClick={() =>
              window.open(`${serverUrl}uploads/products/${file}`, "_blank")
            }
          >
            {extractFileName(file)}
          </div>
        </div>
      );
    } else if (
      file.endsWith(
        ".vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) ||
      file.endsWith(".docx")
    ) {
      const docxFileName = file.replace(
        ".vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".docx"
      );
      const docxUrl = `${serverUrl}uploads/products/${docxFileName}`;
 
      return (
        <div key={index} className="buyer-details-docx-section">
          <FaFileWord
            size={50}
            color="blue"
            style={{ cursor: "pointer" }}
            onClick={() => window.open(docxUrl, "_blank")}
          />
          <div
            className="docx-url"
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
          className="buyer-details-document-image"
        />
      );
    }
  });
};
 
export default RenderProductFiles;
 
{
  /* <div className={styles.uploadFileContainer}>
                <img src={Doc} className={styles.productIcon} alt="Doc" />
                <a
                className={styles.additionalLink}
                href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                target="_blank"
                rel="noopener noreferrer"
                >
                dd12-13_0.pdf
                </a>
            </div>
            <div className={styles.uploadFileContainer}>
                <img src={PDF} className={styles.productIcon} alt="Doc" />
                <a
                className={styles.additionalLink}
                href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                target="_blank"
                rel="noopener noreferrer"
                >
                dd12-13_0.pdf
                </a>
            </div>
            <div className={styles.uploadFileContainer}>
                <img
                className={styles.uploadImage}
                src={Image1}
                alt="Image"
                />
            </div>
            <div className={styles.uploadFileContainer}>
                <img src={Doc} className={styles.productIcon} alt="Doc" />
                <a
                className={styles.additionalLink}
                href="https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
                target="_blank"
                rel="noopener noreferrer"
                >
                dd12-13_0.pdf
                </a>
            </div> */
}