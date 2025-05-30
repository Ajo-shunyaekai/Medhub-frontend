import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import UploadImage from "../../../assets/images/uplaod.svg";
import { FiFileText, FiX } from "react-icons/fi";
import styles from "./certificateuploder.module.css";
import Tooltip from "../Tooltip/Tooltip";

const useFileUpload = (
  onUploadStatusChange,
  setFilePreviews,
  acceptTypes,
  maxFiles = 1,
  filePreviews,
  reset,
  certificateFileNDate,
  setCertificateFileNDate,
  cNCFileArray,
  setCNCFileArray,
  cNCFileError,
  setCNCFileError,
  mainIndex
) => {
  const [filesMerged, setFilesMerged] = useState(filePreviews || []);
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setError(null);
      if (acceptedFiles.length > 1) {
        setError("Please upload one file at a time");
        return;
      }

      const newFile = acceptedFiles[0];
      if (filesMerged.length >= maxFiles) {
        setError(`Maximum ${maxFiles} file allowed`);
        return;
      }

      const newFiles = [{ file: newFile }];
      const updatedcertificateFileNDate = certificateFileNDate;
      updatedcertificateFileNDate[mainIndex] = {
        file: newFile,
        date: updatedcertificateFileNDate?.[mainIndex]?.date,
      };
      setCertificateFileNDate(updatedcertificateFileNDate);
      const updatedCNCFileArray = cNCFileArray;
      updatedCNCFileArray[mainIndex] = newFile;
      setCNCFileArray(updatedCNCFileArray);
      const fileErrorArr = cNCFileError || [];
      fileErrorArr[mainIndex] = "";
      setCNCFileError(fileErrorArr);
      setFilesMerged(newFiles);
      setFilePreviews(newFiles);
      onUploadStatusChange?.(true);
    },
    [filesMerged, maxFiles, setFilePreviews, onUploadStatusChange]
  );

  useEffect(() => {
    if (filePreviews?.length > 0) {
      setFilesMerged(filePreviews);
    }
  }, [filePreviews]);

  useEffect(() => {
    if (reset) {
      setFilesMerged([]);
      setFilePreviews([]);
      setError(null);
      onUploadStatusChange?.(false);
    }
  }, [reset, setFilePreviews, onUploadStatusChange]);

  const removeFile = (mainIndex, event) => {
    event.stopPropagation();
    setFilesMerged([]);
    setFilePreviews([]);
    setError(null);
    onUploadStatusChange?.(false);
    const updatedcertificateFileNDate = certificateFileNDate;
    updatedcertificateFileNDate[mainIndex] = {
      file: null,
      date: updatedcertificateFileNDate?.[mainIndex]?.date,
    };
    setCertificateFileNDate(updatedcertificateFileNDate);
    const updatedCNCFileArray = cNCFileArray;
    updatedCNCFileArray[mainIndex] = null;
    setCNCFileArray(updatedCNCFileArray);
    const fileErrorArr = cNCFileError || [];
    fileErrorArr[mainIndex] = `File is required.`;
    setCNCFileError(fileErrorArr);
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
    multiple: false,
  });

  return {
    filesMerged,
    getRootProps,
    getInputProps,
    isDragActive,
    removeFile,
    error,
  };
};

const CertificateUploader = ({
  onUploadStatusChange,
  filePreviews,
  setFilePreviews,
  label = "Upload Certificate",
  tooltipMessage,
  showTooltip = false,
  acceptTypes,
  maxFiles = 1,
  reset,
  certificateFileNDate,
  setCertificateFileNDate,
  cNCFileArray,
  setCNCFileArray,
  cNCFileError,
  setCNCFileError,
  mainIndex,
}) => {
  const fileUpload = useFileUpload(
    onUploadStatusChange,
    setFilePreviews,
    acceptTypes,
    maxFiles,
    filePreviews,
    reset,
    certificateFileNDate,
    setCertificateFileNDate,
    cNCFileArray,
    setCNCFileArray,
    cNCFileError,
    setCNCFileError,
    mainIndex
  );

  const isImageOnly =
    acceptTypes &&
    Object.keys(acceptTypes).every((type) => type?.startsWith("image/"));
  const isPdfOnly =
    acceptTypes &&
    Object.keys(acceptTypes).every((type) => type === "application/pdf");

  return (
    <div className={styles.compliancesContainer}>
      <div {...fileUpload?.getRootProps({ className: styles.uploadBox })}>
        <input {...fileUpload?.getInputProps()} />
        <img src={UploadImage} className={styles.uploadIcon} alt="img" />
        <p className={styles.uploadText}>
          {fileUpload?.isDragActive
            ? `Drop the ${
                isImageOnly ? "image" : isPdfOnly ? "PDF" : "file"
              } here...`
            : `Click here to Upload ${
                isImageOnly ? "Image" : isPdfOnly ? "PDF" : "File"
              }`}
        </p>
        {showTooltip && tooltipMessage && (
          <Tooltip content={tooltipMessage} className={styles.tooltipSec} />
        )}
      </div>

      {fileUpload.error && (
        <div className={styles.errorMessage}>{fileUpload.error}</div>
      )}

      {(Array?.isArray(fileUpload?.filesMerged)
        ? fileUpload?.filesMerged
        : [fileUpload?.filesMerged]
      )?.length > 0 && (
        <div className={styles.previewContainer}>
          {(Array?.isArray(fileUpload?.filesMerged)
            ? fileUpload?.filesMerged
            : [fileUpload?.filesMerged]
          )?.map((item, index) => {
            const file = item?.file || item;
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

            const isDoc = fileExtension === "doc" || fileExtension === "docx";

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
                ) : isDoc ? (
                  <FiFileText size={25} className={styles.fileIcon} /> // You can use a different icon for .doc/.docx if desired
                ) : (
                  <FiFileText size={25} className={styles.fileIcon} /> // Fallback for other file types
                )}
                <p className={styles.fileName}>
                  {typeof file === "string" ? file : file?.name}
                </p>

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={(event) => fileUpload?.removeFile(mainIndex, event)}
                  title={`Remove ${
                    isImage
                      ? "image"
                      : isPdf
                      ? "PDF"
                      : isDoc
                      ? "document"
                      : "file"
                  }`}
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

export default CertificateUploader;
