import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import Tooltip from "../SharedComponents/Tooltip/Tooltip";
import styles from "./CreateBid/createBid.module.css";

// useFileUpload Hook
const useFileUpload = (
  fieldInputName,
  setFieldValue,
  acceptTypes,
  maxFiles = 4,
  selectedFile,
  fileIndex,
  initialValues
) => {
  const [filesMerged, setFilesMerged] = useState(selectedFile || []);
  const [filesMerged2, setFilesMerged2] = useState(
    initialValues?.bidDocs || []
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(fieldInputName, acceptedFiles);

      setFilesMerged2((prev) => {
        const totalFiles = [...prev, ...acceptedFiles].slice(0, 4); // Limit to maxFiles

        return totalFiles;
      });
      setFilesMerged(acceptedFiles); // Set the accepted files

      const updatedbidDocss = [
        ...(initialValues?.bidDocs || []), // Use `values` instead of `initialValues`
        ...acceptedFiles, // Add all the accepted files
      ];

      // Update Formik's field value with the new files
      // setFieldValue("bidDocs", updatedbidDocss);
    },
    [fieldInputName, setFieldValue]
  );

  // Effect to handle initial file state
  useEffect(() => {
    if (selectedFile?.length > 0) {
      setFilesMerged(selectedFile); // Set the existing files
    }
  }, [selectedFile]);

  // Effect to handle initial file state
  useEffect(() => {
    if (initialValues?.bidDocs?.length > 0) {
      setFilesMerged2(initialValues?.bidDocs); // Set the existing files
    }
  }, [initialValues?.bidDocs]);

  const removeFile = (index, event) => {
    event.stopPropagation();
    const updatedFiles = filesMerged.filter((_, i) => i !== index);
    setFilesMerged(updatedFiles);
    setFieldValue(fieldInputName, updatedFiles); // Update Formik field with the new files
    // setFieldValue("bidDocs", initialValues?.bidDocs?.filter((_, i) => i !== fileIndex)); // Update Formik field with the new files
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

// ComplianceNCertification Component
const ComplianceNCertification = ({
  setFieldValue,
  fieldInputName,
  initialValues,
  label,
  tooltip,
  showLabel = true,
  acceptTypes, // Control accepted file types
  maxFiles = 1, // New prop to control maximum number of files
  selectedFile,
  fileIndex,
}) => {
  const tooltipId = `tooltip-${label.replace(/\s+/g, "-")?.toLowerCase()}`;
  const tooltipContent = tooltip || "Default tooltip text";

  // Call the useFileUpload hook with acceptTypes and maxFiles
  const fileUpload = useFileUpload(
    fieldInputName,
    setFieldValue,
    acceptTypes,
    maxFiles,
    selectedFile,
    fileIndex,
    initialValues
  );

  const isImageOnly =
    acceptTypes &&
    Object.keys(acceptTypes).every((type) => type?.startsWith("image/"));
  const isPdfOnly =
    acceptTypes &&
    Object.keys(acceptTypes).every((type) => type === "application/pdf");

  return (
    <div className={styles.compliancesContainer}>
      {showLabel && <label className={styles.formLabel}>{label}</label>}
      <div className={styles.tooltipContainer}>
        <div {...fileUpload?.getRootProps({ className: styles.uploadBox })}>
          <input {...fileUpload?.getInputProps()} />
          <FiUploadCloud size={30} className={styles.uploadIcon} />
          <p className={styles.uploadText}>
            {fileUpload?.isDragActive
              ? `Drop the ${
                  isImageOnly ? "image" : isPdfOnly ? "PDF" : "files"
                } here...`
              : `Click here to Upload ${
                  isImageOnly ? "Image" : isPdfOnly ? "PDF" : ""
                }`}
          </p>
        </div>
        {tooltip && (
          <>
            <Tooltip content={tooltipContent} className={styles.tooltipSec} />
          </>
        )}
      </div>
      {fileUpload?.filesMerged?.length > 0 && (
        <div className={styles.previewContainer}>
          {fileUpload?.filesMerged?.map((file, index) => {
            // Determine the file extension based on whether it's a File object or string
            const fileExtension =
              typeof file === "string"
                ? file?.split(".")?.pop()?.toLowerCase() // If it's a string (e.g., an existing file path)
                : file?.name?.split(".")?.pop()?.toLowerCase(); // If it's a File object

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
                        ? file?.startsWith("http")
                          ? file
                          : `${process.env.REACT_APP_SERVER_URL}uploads/products/${file}`
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
                  onClick={(event) => fileUpload?.removeFile(index, event)}
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

export default ComplianceNCertification;
