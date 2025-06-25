import React, { useCallback, useEffect, useState } from "react";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import Tooltip from "@mui/material/Tooltip";
import Information from "../Admin/assets/Images/infomation.svg";
export function extractLast13WithExtension(filename) {
  // Check if filename is provided and is a string
  if (!filename || typeof filename !== "string") {
    console.error("Invalid filename provided:", filename);
    return ""; // Return an empty string or some default value
  }

  // Split the filename at the period to separate the extension
  const parts = filename.split(".");

  // Check if there is an extension
  if (parts.length < 2) {
    console.error("No extension found in filename:", filename);
    return ""; // Return an empty string or handle the case as needed
  }

  const extension = parts[parts.length - 1]; // Get the file extension

  // Remove the extension and get the last 13 characters before the extension
  const baseFilename = parts.slice(0, parts.length - 1).join(".");
  const last13Chars = baseFilename.slice(-13); // Get last 13 characters

  // Return the last 13 characters and the extension
  return last13Chars + "." + extension;
}

export const renderFiles = (files, type, hasDate = false) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  if (!files || files.length === 0) {
    return <p>No files available.</p>;
  }
  const isObjectArray =
    files[0] && typeof files[0] === "object" && "file" in files[0];

  return files.map((item, index) => {
    const file = isObjectArray ? item.file : item;
    const date = isObjectArray ? item.date : null;
    if (
      (file?.startsWith("http")
        ? file?.replaceAll(process.env.REACT_APP_AWS_BUCKET_URL, "")
        : file
      )?.endsWith(".pdf")
    ) {
      return (
        <div key={`${file}-${index}`} className="buyer-details-pdf-section">
          <FaFilePdf
            size={50}
            color="red"
            style={{ cursor: "pointer" }}
            onClick={() =>
              window.open(
                file?.startsWith("http")
                  ? file
                  : `${serverUrl}uploads/supplier/${type}/${file}`,
                "_blank"
              )
            }
          />
          <div>
            <div
              className="pdf-url"
              onClick={() =>
                window.open(
                  file?.startsWith("http")
                    ? file
                    : `${serverUrl}uploads/supplier/${type}/${file}`,
                  "_blank"
                )
              }
            >
              {/* {file?.startsWith("http")
                ? extractLast13WithExtension(file)
                : extractFileName(file)} */}
              {extractLast13WithExtension(file)}
            </div>
            {hasDate && date && (
              <div className="expiry-date">
                Expiry Date: {new Date(date).toLocaleDateString()}
              </div>
            )}
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
        : `${serverUrl}uploads/supplier/${type}/${docxFileName}`;
      return (
        <div key={`${file}-${index}`} className="buyer-details-docx-section">
          <FaFileWord
            size={50}
            color="blue"
            style={{ cursor: "pointer" }}
            onClick={() => window.open(docxUrl, "_blank")}
          />
          <div>
            <div
              className="docx-url"
              onClick={() => window.open(docxUrl, "_blank")}
            >
              {extractLast13WithExtension(file)}
            </div>
            {hasDate && date && (
              <div className="expiry-date">
                Expiry Date: {new Date(date).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div key={`${file}-${index}`}>
          <img
            src={
              file?.startsWith("http")
                ? file
                : `${serverUrl}uploads/supplier/${type}/${file}`
            }
            alt={type}
            className="buyer-details-document-image"
          />
          {hasDate && date && (
            <div className="expiry-date">
              Expiry Date: {new Date(date).toLocaleDateString()}
            </div>
          )}
        </div>
      );
    }
  });
};

export const renderFiles2 = (files, type, styles, certificateFileNDate) => {
  if (!Array.isArray(files)) {
    if (!files || files === "") {
      return <div>No files available</div>;
    }
    files = [files];
  }

  return files.map((file, index) => {
    const fileUrl = file?.startsWith("http")
      ? file
      : `${process.env.REACT_APP_SERVER_URL}/uploads/supplier/supplier_image_files/${file}`;

    const expiryDate = certificateFileNDate?.find(
      (item) => item.file === file
    )?.date;

    if (
      (file?.startsWith("http")
        ? file?.replaceAll(process.env.REACT_APP_AWS_BUCKET_URL, "")
        : file
      )?.endsWith(".pdf")
    ) {
      return (
        <div key={index} className={styles.pdfSection}>
          <FaFilePdf
            size={50}
            color="red"
            style={{ cursor: "pointer" }}
            onClick={() => window.open(fileUrl, "_blank")} // Uncommented
          />
          <div
            className={styles.fileName}
            onClick={() => window.open(fileUrl, "_blank")} // Uncommented
          >
            {extractLast13WithExtension(file)}
          </div>
          {type === "Certificate" && expiryDate && (
            <p className={styles.expiryDate}>
              Expiry date:{" "}
              {new Date(expiryDate)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .split("/")
                .join("-")}
            </p>
          )}
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
        : `${process.env.REACT_APP_SERVER_URL}/Uploads/supplier/supplier_image_files/${docxFileName}`;

      return (
        <div key={index} className={styles.docxSection}>
          <FaFileWord
            size={50}
            color="blue"
            style={{ cursor: "pointer" }}
            onClick={() => window.open(docxUrl, "_blank")} // Uncommented
          />
          <div
            className={styles.fileName}
            onClick={() => window.open(docxUrl, "_blank")} // Uncommented
          >
            {extractLast13WithExtension(file)}
          </div>
        </div>
      );
    } else {
      return (
        <img
          key={index}
          src={fileUrl}
          alt={type}
          className={styles.documentImage}
        />
      );
    }
  });
};

const useFileUpload = (
  fieldInputName,
  oldFieldName,
  setFieldValue,
  initialValues,
  acceptTypes,
  maxFiles = 4,
  existingFiles = []
) => {
  const [files, setFiles] = useState(existingFiles || []);
  const [filesOld, setFilesOld] = useState(existingFiles || []);
  const [filesNew, setFilesNew] = useState([]);
  const [filesMerged, setFilesMerged] = useState([]);
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFilesNew((prev) => {
        const totalFiles = [...prev, ...acceptedFiles].slice(0, maxFiles); // Limit to maxFiles
        if (acceptedFiles?.length + prev.length > maxFiles) {
          alert(`You can only upload a maximum of 4 files.`);
          return prev;
        }
        setFieldValue(fieldInputName, totalFiles);
        return totalFiles;
      });
    },
    [fieldInputName, setFieldValue, maxFiles]
  );
  useEffect(() => {
    if (existingFiles?.length > 0) {
      setFilesOld(existingFiles);
    }
  }, [existingFiles]);
  useEffect(() => {
    const mergedFiles = [...filesOld, ...filesNew];
    if (JSON.stringify(mergedFiles) !== JSON.stringify(filesMerged)) {
      setFilesMerged(mergedFiles);
    }
  }, [filesNew, filesOld, filesMerged]);
  const removeFile = (index, event, arrayToFilter) => {
    if (event) event.stopPropagation();
    if (arrayToFilter === "new") {
      setFilesNew((prev) => {
        const updatedFiles = prev.filter((_, i) => i !== index);
        setFieldValue(fieldInputName, updatedFiles);
        return updatedFiles;
      });
    } else if (arrayToFilter === "old") {
      setFilesOld((prev) => {
        const updatedFiles = prev.filter((_, i) => i !== index);
        setFieldValue(oldFieldName, updatedFiles);
        return updatedFiles;
      });
    }
  };

  const defaultAccept = {
    "application/pdf": [],
    "application/msword": [],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      [],
    "image/png": [],
    "image/jpeg": [],
    "image/jpg": [],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptTypes || defaultAccept,
    multiple: maxFiles > 1,
  });

  return { filesMerged, getRootProps, getInputProps, isDragActive, removeFile };
};

function CustomTooltip({ content, styles }) {
  return (
    <Tooltip className={styles.infoTooltip} title={content}>
      <img src={Information} className={styles.iconTooltip} alt="information" />
    </Tooltip>
  );
}


// AddProductFileUpload Component
export const AddProductFileUpload = ({
  setFieldValue,
  initialValues,
  fieldInputName,
  oldFieldName,
  existingFiles,
  label,
  error,
  tooltip,
  showLabel = true,
  acceptTypes,
  maxFiles = 4,
  styles,
}) => {
  const tooltipContent = tooltip || "Default tooltip text";

  const isImageOnly =
    acceptTypes &&
    Object.keys(acceptTypes).every((type) => type?.startsWith("image/"));
  const isPdfOnly =
    acceptTypes &&
    Object.keys(acceptTypes).every((type) => type === "application/pdf");

  // Define the four sides for image uploads
  const sides = [
    { name: "Front Image", field: `${fieldInputName}.front`, oldField: `${oldFieldName}.front` },
    { name: "Back Image", field: `${fieldInputName}.back`, oldField: `${oldFieldName}.back` },
    { name: "Side Image", field: `${fieldInputName}.left`, oldField: `${oldFieldName}.left` },
    { name: "Closure Image", field: `${fieldInputName}.right`, oldField: `${oldFieldName}.right` },
  ];

  // Sanitize existingFiles to ensure iterability
  const safeExistingFiles = existingFiles || (isImageOnly ? {} : []);
  const getSafeFiles = (field) =>
    isImageOnly
      ? Array.isArray(safeExistingFiles[field]) ? safeExistingFiles[field] : []
      : Array.isArray(safeExistingFiles) ? safeExistingFiles : [];

  // Unconditional hook calls
  const singleUpload = useFileUpload(
    fieldInputName,
    oldFieldName,
    setFieldValue,
    initialValues,
    acceptTypes,
    maxFiles,
    getSafeFiles(fieldInputName)
  );

  const frontUpload = useFileUpload(
    sides[0].field,
    sides[0].oldField,
    setFieldValue,
    initialValues,
    acceptTypes,
    maxFiles,
    getSafeFiles(sides[0].field)
  );
  const backUpload = useFileUpload(
    sides[1].field,
    sides[1].oldField,
    setFieldValue,
    initialValues,
    acceptTypes,
    maxFiles,
    getSafeFiles(sides[1].field)
  );
  const leftUpload = useFileUpload(
    sides[2].field,
    sides[2].oldField,
    setFieldValue,
    initialValues,
    acceptTypes,
    maxFiles,
    getSafeFiles(sides[2].field)
  );
  const rightUpload = useFileUpload(
    sides[3].field,
    sides[3].oldField,
    setFieldValue,
    initialValues,
    acceptTypes,
    maxFiles,
    getSafeFiles(sides[3].field)
  );

  // Map file uploads for image sides
  const fileUploads = [frontUpload, backUpload, leftUpload, rightUpload];

  const renderUploadField = (fileUpload, side = null, errorMessage = error) => {
    const fieldName = side ? side.name : "";
    const fieldError = side ? error?.[side.field] : errorMessage;

    return (
      <div
        className={side ? styles.sideUploadContainer : styles.uploadContainer}
        style={side ? { flex: "1 1 45%", maxWidth: "45%" } : {}}
      >
        {side && <h3 className={styles.sideLabel}>{fieldName}</h3>}
        <div className={styles.tooltipContainer}>
          <div {...fileUpload?.getRootProps({ className: styles.uploadBox })}>
            <input {...fileUpload?.getInputProps()} />
            <FiUploadCloud size={30} className={styles.uploadIcon} />
            <p className={styles.uploadText}>
              {fileUpload?.isDragActive
                ? `Drop the ${isImageOnly ? "image" : isPdfOnly ? "PDF" : "files"} here...`
                : `Click here to Upload ${isImageOnly ? "Image" : isPdfOnly ? "PDF" : ""}`}
            </p>
          </div>
          {tooltip && (
            <CustomTooltip
              styles={styles}
              content={side ? `${tooltipContent} for ${fieldName}` : tooltipContent}
              className={styles.tooltipSec}
            />
          )}
        </div>
        {fieldError && <span className={styles.error}>{fieldError}</span>}
        <div className={styles.filePreviewContainer}>
          {fileUpload?.filesMerged?.map((file, fileIndex) => {
            const isString = typeof file === "string";
            const fileName = isString
              ? extractLast13WithExtension(file)
              : file?.name;
            const fileExtension = fileName?.split(".")?.pop()?.toLowerCase();
            const isImage = ["jpeg", "jpg", "png", "gif", "bmp", "webp"].includes(fileExtension);
            const isPdf = fileExtension === "pdf";
            const fallbackImage = "https://medhub.shunyaekai.com/uploads/fallbackImage.jpg";

            const isValidUrl = (url) => {
              try {
                new URL(url);
                return true;
              } catch {
                return false;
              }
            };

            let imageSrc = "";
            if (isImage) {
              imageSrc = isString
                ? isValidUrl(file)
                  ? file
                  : file?.startsWith("http")
                  ? file
                  : `${process.env.REACT_APP_SERVER_URL}uploads/products/${file}`
                : URL.createObjectURL(file);
            } else {
              imageSrc = fallbackImage;
            }

            return (
              <div key={fileIndex} className={styles.filePreview}>
                {isPdf ? (
                  <FiFileText size={25} className={styles.fileIcon} />
                ) : (
                  <img
                    src={imageSrc}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                    alt={fileName}
                    className={styles.previewImage}
                  />
                )}
                <p className={styles.fileName}>{fileName}</p>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={(event) =>
                    fileUpload?.removeFile(fileIndex, event, isString ? "old" : "new")
                  }
                  title={`Remove ${isImage ? "image" : isPdf ? "PDF" : "file"}`}
                >
                  <FiX size={15} className={styles.removeIcon} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.compliancesContainer}>
      {showLabel && (
        <label className={styles.formLabel}>
          {label}
          {label === "Purchase Invoice" && (
            <span className={styles.labelStamp}>*</span>
          )}
        </label>
      )}
      {isImageOnly ? (
        <div className={styles.sidesContainer} style={{ display: "flex", gap: "10px" }}>
          {sides.map((side, index) => renderUploadField(fileUploads[index], side))}
        </div>
      ) : (
        renderUploadField(singleUpload)
      )}
    </div>
  );
};

export const renderImages = (images, pathname) => {
  if (images?.length > 0) {
    return images.map((image, index) => (
      <img
        key={index}
        src={
          image?.startsWith("http")
            ? image
            : `${process.env.REACT_APP_SERVER_URL}uploads/buyer/order/complaint_images/${image}`
        }
        alt={`Complaint evidence ${index + 1}`}
        className="seller-details-document-image"
      />
    ));
  }
};
