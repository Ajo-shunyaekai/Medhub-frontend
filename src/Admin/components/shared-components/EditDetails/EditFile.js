import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import styles from "./edit.module.css";

// useFileUpload Hook
const useFileUpload = (
  fieldInputName,
  oldFieldName,
  setFieldValue,
  setFieldTouched,
  initialValues,
  acceptTypes,
  maxFiles = 4,
  maxFilesCount = 4,
  existingFiles = [],
  formik
) => {
  const [filesOld, setFilesOld] = useState(existingFiles || []);
  const [filesNew, setFilesNew] = useState([]);
  const [filesMerged, setFilesMerged] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFilesNew((prev) => {
        const totalFiles = [...prev, ...acceptedFiles].slice(0, maxFiles);
        if (acceptedFiles?.length + prev.length > maxFiles) {
          alert(
            `You can only upload a maximum of ${maxFilesCount} ${
              maxFilesCount != 1 ? "files" : "file"
            }.`
          );
          return prev;
        }
        // Update Formik state
        setFieldValue(fieldInputName, totalFiles);
        return totalFiles;
      });
    },
    [
      fieldInputName,
      oldFieldName,
      setFieldValue,
      setFieldTouched,
      maxFiles,
      maxFilesCount,
    ]
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
      setFilesMerged(mergedFiles);

      setFieldTouched(fieldInputName, true, false);
      setFieldTouched(oldFieldName, true, false);

      // ✅ If files are present, remove validation error
      if (mergedFiles.length > 0) {
        formik?.setFieldError(fieldInputName, undefined);
        formik?.setFieldError(oldFieldName, undefined);
      } else {
        formik?.setFieldError(
          fieldInputName,
          `At least one ${oldFieldName} is required`
        );
      }

      // Force revalidation
      formik?.validateForm();
    }
  }, [
    filesNew,
    filesOld,
    filesMerged,
    existingFiles,
    formik?.values?.[fieldInputName],
  ]);

  const removeFile = (index, event, arrayToFilter) => {
    if (event) event.stopPropagation();
    if (arrayToFilter == "new") {
      setFilesNew((prev) => {
        // Create the updated file list by removing the file at the specified index
        const updatedFiles = prev.filter((_, i) => i !== index);

        setFieldValue(fieldInputName, updatedFiles); // Set new files (File objects)
        return updatedFiles; // Return the updated list to update the state
      });
    } else if (arrayToFilter == "old") {
      setFilesOld((prev) => {
        // Create the updated file list by removing the file at the specified index
        const updatedFiles = prev.filter((_, i) => i !== index);

        setFieldValue(oldFieldName, updatedFiles); // Set old files (strings or file paths)
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
const EditFile = ({
  filePath,
  productDetails,
  setFieldValue,
  setFieldTouched,
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
  maxFilesCount = 4, // New prop to control maximum number of files
  formik,
}) => {
  const tooltipId = `tooltip-${label.replace(/\s+/g, "-")?.toLowerCase()}`;
  const tooltipContent = tooltip || "Default tooltip text";
  const [errorMsg, setErrorMsg] = useState(error);
  useEffect(() => {
    setErrorMsg(error || undefined);
  }, [error]);

  // Call the useFileUpload hook with acceptTypes and maxFiles
  const fileUpload = useFileUpload(
    fieldInputName,
    oldFieldName,
    setFieldValue,
    setFieldTouched,
    initialValues,
    acceptTypes,
    maxFiles,
    maxFilesCount,
    existingFiles,
    formik
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
          <span className={styles.labelStamp}>*</span>
        </label>
      )}
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
      </div>
      {/* {<span className={styles.error}>{errorMsg}</span>} */}
      {formik?.touched?.[fieldInputName] &&
        formik?.errors?.[fieldInputName] && (
          <span className={styles.error}>{formik.errors[fieldInputName]}</span>
        )}

      {fileUpload?.filesMerged?.length > 0 && (
        <div className={styles.previewContainer}>
          {fileUpload?.filesMerged?.map((file, index) => {
            // Check if file is a string or an object
            const isString = typeof file == "string";
            const fileName = isString
              ? file?.startsWith("http")
                ? file?.replaceAll(process.env.REACT_APP_AWS_BUCKET_URL, "")
                : file
              : file?.name;
            const fileExtension = isString
              ? file?.split(".")?.pop()?.toLowerCase()
              : fileName?.split(".")?.pop()?.toLowerCase();

            const isImage = ["jpeg", "png", "jpg", "gif", "bmp"].includes(
              fileExtension
            );
            const isPdf = fileExtension === "pdf";

            return (
              <div key={index} className={styles.filePreview}>
                {isImage ? (
                  <img
                    src={
                      typeof file === "string"
                        ? file?.startsWith("http")
                          ? file
                          : `${process.env.REACT_APP_SERVER_URL}uploads/${filePath}/${file}`
                        : URL.createObjectURL(file)
                    }
                    alt={
                      file?.startsWith("http")
                        ? file?.replaceAll(
                            process.env.REACT_APP_AWS_BUCKET_URL,
                            ""
                          )
                        : file?.name
                    }
                    className={styles.previewImage}
                  />
                ) : isPdf ? (
                  <FiFileText size={25} className={styles.fileIcon} />
                ) : null}
                <p className={styles.fileName}>{fileName}</p>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={(event) =>
                    fileUpload?.removeFile(
                      index,
                      event,
                      isString ? "old" : "new"
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

export default EditFile;
