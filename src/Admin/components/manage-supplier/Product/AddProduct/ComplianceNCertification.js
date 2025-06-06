import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import Tooltip from "./Tooltip";
import styles from "./addproduct.module.css";

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
    initialValues?.complianceFile || []
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(fieldInputName, acceptedFiles);

      setFilesMerged2((prev) => {
        const totalFiles = [...prev, ...acceptedFiles].slice(0, 4);

        return totalFiles;
      });
      setFilesMerged(acceptedFiles);

      const updatedComplianceFiles = [
        ...(initialValues?.complianceFile || []),
        ...acceptedFiles,
      ];

      setFieldValue("complianceFile", updatedComplianceFiles);
    },
    [fieldInputName, setFieldValue]
  );
  useEffect(() => {
    if (selectedFile?.length > 0) {
      setFilesMerged(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (initialValues?.complianceFile?.length > 0) {
      setFilesMerged2(initialValues?.complianceFile);
    }
  }, [initialValues?.complianceFile]);

  const removeFile = (index, event) => {
    event.stopPropagation();
    const updatedFiles = filesMerged.filter((_, i) => i !== index);
    setFilesMerged(updatedFiles);
    setFieldValue(fieldInputName, updatedFiles);
    setFieldValue(
      "complianceFile",
      initialValues?.complianceFile?.filter((_, i) => i !== fileIndex)
    );
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

const ComplianceNCertification = ({
  setFieldValue,
  fieldInputName,
  initialValues,
  label,
  tooltip,
  showLabel = true,
  acceptTypes,
  maxFiles = 1,
  selectedFile,
  fileIndex,
}) => {
  const tooltipId = `tooltip-${label.replace(/\s+/g, "-")?.toLowerCase()}`;
  const tooltipContent = tooltip || "Default tooltip text";

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
          <FiUploadCloud size={20} className={styles.uploadIcon} />
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
            const fileExtension =
              typeof file === "string"
                ? file?.split(".")?.pop()?.toLowerCase()
                : file?.name?.split(".")?.pop()?.toLowerCase();

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
