import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import styles from "./edit.module.css";

// useFileUpload Hook
const useFileUpload = (
  fieldInputName,
  setFieldValue,
  acceptTypes,
  maxFiles = 4,
  selectedFile,
  fileIndex,
  initialValues,
  isEdit
) => {
  const [filesMerged, setFilesMerged] = useState(selectedFile || []);
  const [filesMerged2, setFilesMerged2] = useState([]);
  const [filesOld, setFilesOld] = useState(selectedFile || []);
  const [filesNew, setFilesNew] = useState([]);
  const [filesNewMerged, setFilesNewMerged] = useState([]);
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(fieldInputName, acceptedFiles);
      const updatedcertificate_images = [
        ...(initialValues?.certificate_imageNew || []),
        ...acceptedFiles,
      ];
      setFieldValue("certificate_imageNew", updatedcertificate_images);
      setFilesNew((prev) => {
        const totalFiles = [...prev, ...acceptedFiles].slice(0, 4); // Limit to maxFiles (4 in this case)
        return totalFiles;
      });
    },
    [setFieldValue, initialValues]
  );

  const removeFile = (index, event, arrayToFilter, file) => {
    event.stopPropagation();
    if (arrayToFilter == "new") {
      // we will remove from new array
      setFilesNew([]);
      const indexToRemove = initialValues?.certificate_image?.findIndex(
        (ele, index) => JSON.stringify(ele) == file
      );
      const filteredValues = initialValues?.certificate_image?.filter(
       
        (_, index) => JSON.stringify(_) != file
      )?.length;
      if (filteredValues > 1) {
        setFieldValue(
          "certificate_imageNew",

          initialValues?.certificate_imageNew?.filter(
            (_, index) => index != indexToRemove
          )
        );
      } else {
        setFieldValue(
          "certificate_imageNew",

          initialValues?.certificate_imageNew?.filter(
            
            (_, index) => JSON.stringify(_) != file
          )
        );
      }
    } else {
      // we will remove from old and new array
      setFilesNew([]);
      const indexToRemove = initialValues?.certificate_imageNew?.findIndex(
        (ele, index) => JSON.stringify(ele) == file
      );
      const filteredValues = initialValues?.certificate_imageNew?.filter(
      
        (_, index) => JSON.stringify(_) != file
      )?.length;
      if (filteredValues > 1) {
        setFieldValue(
          "certificate_image",

          initialValues?.certificate_image?.filter(
            (_, index) => index != indexToRemove
          
          )
        );
      } else {
        setFieldValue(
          "certificate_image",

          initialValues?.certificate_image?.filter(
          
            (_, index) => JSON.stringify(_) != file
          )
        );
      }
    }
    setFieldValue(fieldInputName, []); // Update Formik field with the new files
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

  return {
    selectedFile,
    getRootProps,
    getInputProps,
    isDragActive,
    removeFile,
  };
};

// EditCertificate Component
const EditCertificate = ({
  filePath,
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
  isEdit,
  formik,
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
    initialValues,
    isEdit
  );

  useEffect(() => {
    // Force revalidation
    formik?.validateForm();
  }, [selectedFile]);

  const isImageOnly =
    acceptTypes &&
    Object.keys(acceptTypes).every((type) => type?.startsWith("image/"));
  const isPdfOnly =
    acceptTypes &&
    Object.keys(acceptTypes).every((type) => type === "application/pdf");

  return (
    <div className={styles.compliancesContainer}>
      {showLabel && <label className={styles.formLabel}>{label}
         <span className={styles.labelStamp}>*</span>
        </label>}
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
      {(typeof fileUpload?.selectedFile == "string"
        ? [fileUpload?.selectedFile]
        : fileUpload?.selectedFile
      )?.length > 0 && (
        <div className={styles.previewContainer}>
          {(typeof fileUpload?.selectedFile == "string"
            ? [fileUpload?.selectedFile]
            : fileUpload?.selectedFile
          )?.map((file, index) => {
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
                <p className={styles.fileName}>
                  {typeof file === "string"
                    ? file?.startsWith("http")
                      ? file?.replaceAll(
                          process.env.REACT_APP_AWS_BUCKET_URL,
                          ""
                        )
                      : file
                    : file?.name}
                </p>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={(event) =>
                    fileUpload?.removeFile(
                      index,
                      event,
                      typeof file === "string" ? "old" : "new",
                      JSON.stringify(file)
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

export default EditCertificate;
