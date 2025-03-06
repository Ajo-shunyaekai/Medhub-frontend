import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Information from "../../../assets/images/infomation.svg";
import styles from "./addproduct.module.css";

// useFileUpload Hook
const useFileUpload = (fieldInputName, setFieldValue, initialValues) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prev) => {
        const totalFiles = [...prev, ...acceptedFiles];
        if (totalFiles.length > 4) {
          alert("You can only upload a maximum of 4 files.");
          return prev;
        }
        // Update Formik state
        setFieldValue(fieldInputName, totalFiles);
        return totalFiles;
      });
    },
    [fieldInputName, setFieldValue]
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
    },
    multiple: true,
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
}) => {
  const tooltipId = `tooltip-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const tooltipContent = tooltip || "Default tooltip text";

  // Call the useFileUpload hook
  const fileUpload = useFileUpload(fieldInputName, setFieldValue, initialValues);

  return (
    <div className={styles.compliancesContainer}>
      {showLabel && <label className={styles.formLabel}>{label}</label>}
      <div className={styles.tooltipContainer}>
        <div {...fileUpload.getRootProps({ className: styles.uploadBox })}>
          <input {...fileUpload.getInputProps()} />
          <FiUploadCloud size={20} className={styles.uploadIcon} />
          <p className={styles.uploadText}>
            {fileUpload.isDragActive
              ? "Drop the files here..."
              : "Click here to Upload"}
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
                title="Remove file"
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
