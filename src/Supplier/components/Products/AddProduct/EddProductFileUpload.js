import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Information from "../../../assets/images/infomation.svg";
import styles from "./addproduct.module.css";

// useFileUpload Hook
const useFileUpload = (fieldInputName, setFieldValue, initialValues, acceptTypes, maxFiles = 4) => {
  const [files, setFiles] = useState(() => {
    return initialValues && initialValues[fieldInputName] ? initialValues[fieldInputName] : [];
  });

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prev) => {
        const totalFiles = [...prev, ...acceptedFiles].slice(0, maxFiles);
        if (acceptedFiles.length + prev.length > maxFiles) {
          alert(`You can only upload a maximum of ${maxFiles} ${maxFiles === 1 ? "file" : "files"}.`);
          return prev;
        }
        setFieldValue(fieldInputName, totalFiles); // This expects setFieldValue to be defined
        return totalFiles;
      });
    },
    [fieldInputName, setFieldValue, maxFiles]
  );

  const removeFile = (index, event) => {
    if (event) event.stopPropagation();
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      setFieldValue(fieldInputName, updatedFiles); // This expects setFieldValue to be defined
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
    accept: acceptTypes || defaultAccept,
    multiple: maxFiles > 1,
  });

  return { files, getRootProps, getInputProps, isDragActive, removeFile };
};

// EddProductFileUpload Component
const EddProductFileUpload = ({
  setFieldValue,
  initialValues,
  fieldInputName,
  label,
  tooltip,
  showLabel = true,
  acceptTypes,
  maxFiles = 4,
}) => {
  const tooltipId = `tooltip-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const tooltipContent = tooltip || "Default tooltip text";

  const fileUpload = useFileUpload(fieldInputName, setFieldValue, initialValues, acceptTypes, maxFiles);

  const isImageOnly = acceptTypes && Object.keys(acceptTypes).every(type => type.startsWith("image/"));
  const isPdfOnly = acceptTypes && Object.keys(acceptTypes).every(type => type === "application/pdf");

  const getPreviewUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file.url || file; // Assuming file is a URL string if not a File object
  };

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
              <img src={Information} className={styles.iconTooltip} alt="info" />
            </span>
            <Tooltip className={styles.tooltipSec} id={tooltipId} place="top" effect="solid">
              <div dangerouslySetInnerHTML={{ __html: tooltipContent }} />
            </Tooltip>
          </>
        )}
      </div>

      {fileUpload.files.length > 0 && (
        <div className={styles.previewContainer}>
          {fileUpload.files.map((file, index) => (
            <div key={index} className={styles.filePreview}>
              {(file.type && file.type.startsWith("image/")) || (typeof file === "string" && file.match(/\.(jpeg|jpg|png|gif)$/i)) ? (
                <img
                  src={getPreviewUrl(file)}
                  alt={file.name || `File ${index}`}
                  className={styles.previewImage}
                />
              ) : (
                <FiFileText size={25} className={styles.fileIcon} />
              )}
              <p className={styles.fileName}>{file.name || (typeof file === "string" ? file.split('/').pop() : `File ${index}`)}</p>
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

export default EddProductFileUpload;