import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import Tooltip from "../../SharedComponents/Tooltip/Tooltip";
import styles from "./addproduct.module.css";

// useFileUpload Hook
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
  console.log("existingFiles", existingFiles);
  console.log("initialValues?.image", initialValues?.image);
  console.log("initialValues?.imageNew", initialValues?.imageNew);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFilesNew((prev) => {
        const totalFiles = [...prev, ...acceptedFiles].slice(0, maxFiles); // Limit to maxFiles
        if (acceptedFiles?.length + prev.length > maxFiles) {
          alert(
            `You can only upload a maximum of ${maxFiles} ${maxFiles === 1 ? "file" : "files"
            }.`
          );
          return prev; // Keep previous files if limit exceeded
        }
        // Update Formik state
        console.log("field Value to update ", fieldInputName);
        setFieldValue(fieldInputName, totalFiles);
        return totalFiles;
      });
    },
    [fieldInputName, setFieldValue, maxFiles]
  );

  // Effect to handle initial file state
  useEffect(() => {
    if (existingFiles?.length > 0) {
      setFilesOld(existingFiles); // Set the existing files
    }
  }, [existingFiles]);

  // Effect to merge the old and new files
  useEffect(() => {
    const mergedFiles = [...filesOld, ...filesNew];
    if (JSON.stringify(mergedFiles) !== JSON.stringify(filesMerged)) {
      setFilesMerged(mergedFiles); // Only update if the merged files are different
    }
  }, [filesNew, filesOld, filesMerged]);

  // Effect to update Formik fields when merged files change
  useEffect(() => {
    if (filesMerged?.length > 0) {
      const newFiles = filesMerged.filter((item) => typeof item === "object");
      const oldFiles = filesMerged.filter((item) => typeof item !== "object");

      setFieldValue(fieldInputName, newFiles); // Set new files (File objects)
      setFieldValue(oldFieldName, oldFiles); // Set old files (strings or file paths)
    }
  }, [filesMerged, setFieldValue, fieldInputName, oldFieldName]);

  const removeFile = (index, event, arrayToFilter) => {
    if (event) event.stopPropagation();
    if (arrayToFilter == "new") {
      setFilesNew((prev) => {
        // Create the updated file list by removing the file at the specified index
        const updatedFiles = prev.filter((_, i) => i !== index);

        return updatedFiles; // Return the updated list to update the state
      });
    } else if (arrayToFilter == "old") {
      setFilesOld((prev) => {
        // Create the updated file list by removing the file at the specified index
        const updatedFiles = prev.filter((_, i) => i !== index);

        return updatedFiles; // Return the updated list to update the state
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
    accept: acceptTypes || defaultAccept, // Use provided acceptTypes or fallback to default
    multiple: maxFiles > 1, // Allow multiple only if maxFiles > 1
  });

  return { filesMerged, getRootProps, getInputProps, isDragActive, removeFile };
};

// AddProductFileUpload Component
const AddProductFileUpload = ({
  productDetails,
  setFieldValue,
  initialValues,
  fieldInputName,
  oldFieldName,
  existingFiles,
  label,
  error,
  tooltip,
  showLabel = true,
  acceptTypes, // Control accepted file types
  maxFiles = 4, // New prop to control maximum number of files
}) => {
  const tooltipId = `tooltip-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const tooltipContent = tooltip || "Default tooltip text";

  // Call the useFileUpload hook with acceptTypes and maxFiles
  const fileUpload = useFileUpload(
    fieldInputName,
    oldFieldName,
    setFieldValue,
    initialValues,
    acceptTypes,
    maxFiles,
    existingFiles
  );

  const isImageOnly =
    acceptTypes &&
    Object.keys(acceptTypes).every((type) => type?.startsWith("image/"));
  const isPdfOnly =
    acceptTypes &&
    Object.keys(acceptTypes).every((type) => type === "application/pdf");

  return (
    <div className={styles.compliancesContainer}>
      {showLabel && (
        <label className={styles.formLabel}>
          {label}
          {label === "Purchase Invoice" && <span className={styles.labelStamp}>*</span>}
        </label>
      )}
      <div className={styles.tooltipContainer}>
        <div {...fileUpload?.getRootProps({ className: styles.uploadBox })}>
          <input {...fileUpload?.getInputProps()} />
          <FiUploadCloud size={20} className={styles.uploadIcon} />
          <p className={styles.uploadText}>
            {fileUpload?.isDragActive
              ? `Drop the ${isImageOnly ? "image" : isPdfOnly ? "PDF" : "files"
              } here...`
              : `Click here to Upload ${isImageOnly ? "Image" : isPdfOnly ? "PDF" : ""
              }`}
          </p>
        </div>
        {tooltip && (
          <>
            <Tooltip
              content={tooltipContent}
              className={styles.tooltipSec}
            />
          </>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
      {fileUpload?.filesMerged?.length > 0 && (
        <div className={styles.previewContainer}>
          {fileUpload?.filesMerged?.map((file, index) => {
            // Determine the file extension based on whether it's a File object or string
            const fileExtension =
              typeof file === "string"
                ? file.split(".").pop().toLowerCase()
                : file?.name.split(".").pop().toLowerCase();

            const isImage =
              fileExtension === "jpeg" ||
              fileExtension === "png" ||
              fileExtension === "jpg" ||
              fileExtension === "gif" ||
              fileExtension === "bmp";

            const isPdf = fileExtension === "pdf";

            return (
              <div key={index} className={styles.filePreview}>
                {isImage ? (
                  <img
                    src={
                      typeof file === "string"
                        ? `${process.env.REACT_APP_SERVER_URL}uploads/products/${file}`
                        : URL.createObjectURL(file)
                    }
                    alt={file?.name}
                    className={styles.previewImage}
                  />
                ) : isPdf ? (
                  <FiFileText size={25} className={styles.fileIcon} />
                ) : null}
                <p className={styles.fileName}>
                  {typeof file === "string" ? file : file?.name}
                </p>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={(event) =>
                    fileUpload?.removeFile(
                      index,
                      event,
                      typeof file == "string" ? "old" : "new"
                    )
                  }
                  title={`Remove ${isImage ? "image" : isPdf ? "PDF" : "file"}`}
                >
                  <FiX size={15} className={styles.removeIcon} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddProductFileUpload;