import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Information from "../../../assets/images/infomation.svg";
import styles from "./addproduct.module.css";
 
// useFileUpload Hook
const useFileUpload = (fieldInputName, setFieldValue, initialValues, acceptTypes, maxFiles = 4) => {
  const [files, setFiles] = useState([]);
 
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prev) => {
        const totalFiles = [...prev, ...acceptedFiles].slice(0, maxFiles); // Limit to maxFiles
        if (acceptedFiles.length + prev.length > maxFiles) {
          alert(`You can only upload a maximum of ${maxFiles} ${maxFiles === 1 ? "file" : "files"}.`);
          return prev; // Keep previous files if limit exceeded
        }
        // Update Formik state
        setFieldValue(fieldInputName, totalFiles);
        return totalFiles;
      });
    },
    [fieldInputName, setFieldValue, maxFiles]
  );
 
  const removeFile = (index, event) => {
    if (event) event.stopPropagation();
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      // Update Formik state
      setFieldValue(fieldInputName, updatedFiles);
      return updatedFiles;
    });
  };
 
  const defaultAccept = {
    "application/pdf": [],
    "application/msword": [],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    "image/png": [],
    "image/jpeg": [],
    "image/jpg": [],
  };
 
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptTypes || defaultAccept, // Use provided acceptTypes or fallback to default
    multiple: maxFiles > 1, // Allow multiple only if maxFiles > 1
  });
 
  return { files, getRootProps, getInputProps, isDragActive, removeFile };
};
 
// AddProductFileUpload Component
const AddProductFileUpload = ({
  setFieldValue,
  initialValues,
  fieldInputName,
  label,
  tooltip,
  showLabel = true,
  acceptTypes, // Control accepted file types
  maxFiles = 4, // New prop to control maximum number of files
}) => {
  const tooltipId = `tooltip-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const tooltipContent = tooltip || "Default tooltip text";
 
  // Call the useFileUpload hook with acceptTypes and maxFiles
  const fileUpload = useFileUpload(fieldInputName, setFieldValue, initialValues, acceptTypes, maxFiles);
 
  const isImageOnly = acceptTypes && Object.keys(acceptTypes).every(type => type.startsWith("image/"));
  const isPdfOnly = acceptTypes && Object.keys(acceptTypes).every(type => type === "application/pdf");
 
  return (
    <div className={styles.compliancesContainer}>
      {showLabel && <label className={styles.formLabel}>{label}</label>}
      <div className={styles.tooltipContainer}>
        <div {...fileUpload.getRootProps({ className: styles.uploadBox })}>
          <input {...fileUpload.getInputProps()} />
          <FiUploadCloud size={20} className={styles.uploadIcon} />
          <p className={styles.uploadText}>
            {fileUpload.isDragActive
              ? `Drop the ${isImageOnly ? "image" : isPdfOnly ? "PDF" : "files"} here...`
              : `Click here to Upload ${isImageOnly ? "Image" : isPdfOnly ? "PDF" : ""}`}
          </p>
        </div>
        {tooltip && (
          <>
            <span
              className={styles.infoTooltip}
              data-tooltip-id={tooltipId}
              data-tooltip-content={tooltipContent}
            >
              <img
                src={Information}
                className={styles.iconTooltip}
                alt="info"
              />
            </span>
            <Tooltip
              className={styles.tooltipSec}
              id={tooltipId}
              place="top"
              effect="solid"
            >
              <div dangerouslySetInnerHTML={{ __html: tooltipContent }} />
            </Tooltip>
          </>
        )}
      </div>
 
      {fileUpload.files.length > 0 && (
        <div className={styles.previewContainer}>
          {fileUpload.files.map((file, index) => (
            <div key={index} className={styles.filePreview}>
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className={styles.previewImage}
                />
              ) : (
                <FiFileText size={25} className={styles.fileIcon} />
              )}
              <p className={styles.fileName}>{file.name}</p>
              <button
                type="button"
                className={styles.removeButton}
                onClick={(event) => fileUpload.removeFile(index, event)}
                title={`Remove ${isImageOnly ? "image" : "file"}`}
              >
                <FiX size={15} className={styles.removeIcon} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddProductFileUpload;