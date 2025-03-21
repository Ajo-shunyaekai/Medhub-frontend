import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import Tooltip from "../../SharedComponents/Tooltip/Tooltip";
import styles from "./addproduct.module.css";
import Information from "../../../assets/images/infomation.svg";

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
  console.log("filesOld", filesOld);

  console.log("acceptTypes", [
    ...initialValues?.complianceFileNew,
    // acceptedFiles?.[0],
  ]);
  // const onDrop = useCallback(
  //   (acceptedFiles) => {
  //     setFieldValue(fieldInputName, acceptedFiles);
  //     // // setFieldValue("complianceFile", [...initialValues?.complianceFile, ...acceptedFiles]);
  //     // // setFieldValue("complianceFile", [...initialValues?.complianceFile, ...acceptedFiles]);

  //     // setFilesMerged2((prev) => {
  //     //   const totalFiles = [...prev, ...acceptedFiles].slice(0, 4); // Limit to maxFiles
  //     //   // Update Formik state
  //     //   if (isEdit) {
  //     //     setFieldValue("complianceFile", []);
  //     //     setFieldValue("complianceFileNew", totalFiles);
  //     //   } else {
  //     //     setFieldValue("complianceFile", totalFiles);
  //     //   }
  //     //   return totalFiles;
  //     // });
  //     // setFilesMerged([acceptedFiles]); // Set the accepted files
  //     // const updatedFileObj = {...acceptedFiles, action:"add",indexAction:fileIndex}
  //     // setFilesNew((prev) => {
  //     //   const totalFiles = [...prev, ...updatedFileObj].slice(0, 4); // Limit to maxFiles
  //     //   return totalFiles;
  //     console.log("acceptedFiles?.[0]", acceptedFiles?.[0]);
  //     const updatedFileObj = {
  //       file: acceptedFiles?.[0],
  //       action: "add",
  //       indexAction: fileIndex,
  //     };
  //     console.log("acceptedFiles?.[0]2", updatedFileObj);
  //     setFilesNew((prev) => {
  //       const totalFiles = [...prev, acceptedFiles?.[0]]; // Limit to maxFiles
  //       return totalFiles;
  //     });
  //     setFieldValue("complianceFileNew", [
  //       ...initialValues?.complianceFileNew,
  //       acceptedFiles?.[0],
  //     ]);
  //   },
  //   [fieldInputName, setFieldValue]
  // );
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(fieldInputName, acceptedFiles);
      // Use Formik's `values` to get the current state of the form
      const updatedComplianceFiles = [
        ...(initialValues?.complianceFileNew || []), // Use `values` instead of `initialValues`
        ...acceptedFiles, // Add all the accepted files
      ];

      // Update Formik's field value with the new files
      setFieldValue("complianceFileNew", updatedComplianceFiles);

      // Optionally, you can update the filesNew state if necessary
      setFilesNew((prev) => {
        const totalFiles = [...prev, ...acceptedFiles].slice(0, 4); // Limit to maxFiles (4 in this case)
        return totalFiles;
      });

      console.log("Updated compliance files:", updatedComplianceFiles); // Debugging
    },
    [setFieldValue, initialValues]
  );

  // // Effect to handle initial file state
  // useEffect(() => {
  //   if (selectedFile?.length > 0) {
  //     setFilesMerged(selectedFile); // Set the existing files
  //   }
  // }, [selectedFile]);

  // // Effect to handle initial file state
  // useEffect(() => {
  //   if (isEdit) {
  //     if (initialValues?.complianceFileNew?.length > 0) {
  //       setFilesMerged2(initialValues?.complianceFileNew); // Set the existing files
  //     }
  //   } else {
  //     if (initialValues?.complianceFile?.length > 0) {
  //       setFilesMerged2(initialValues?.complianceFile); // Set the existing files
  //     }
  //   }
  // }, [initialValues?.complianceFile, initialValues?.complianceFileNew]);

  const removeFile = (index, event, arrayToFilter, file) => {
    event.stopPropagation();
    // const updatedFiles = (
    //   typeof filesMerged == "string" ? [filesMerged] : filesMerged
    // )?.filter((_, i) => i !== index);
    // setFilesMerged(updatedFiles);
    // if (isEdit) {
    //   setFieldValue("complianceFile", []); // Update Formik field with the new files
    //   setFieldValue(
    //     "complianceFileNew",
    //     initialValues?.complianceFileNew?.filter((_, i) => i !== fileIndex)
    //   ); // Update Formik field with the new files
    // } else {
    //   setFieldValue(
    //     "complianceFile",
    //     initialValues?.complianceFile?.filter((_, i) => i !== fileIndex)
    //   ); // Update Formik field with the new files
    // }
    console.log("ieldInputName, updatedFile", fieldInputName);
    if (arrayToFilter == "new") {
      // we will remove from new array
      setFilesNew([]);
      const indexToRemove = initialValues?.complianceFile?.findIndex(
        (ele, index) => JSON.stringify(ele) == file
      );
      const filteredValues = initialValues?.complianceFile?.filter(
        // (_, index) => index != indexToRemove
        (_, index) => JSON.stringify(_) != file
      )?.length;
      if (filteredValues > 1) {
        setFieldValue(
          "complianceFileNew",
          // initialValues?.complianceFileNew?.map((ele, index) => {
          //   console.log("ele to string in new", JSON.stringify(ele) == file);
          //   return index == fileIndex
          //     ? { ...ele, action: "delete", indexAction: fileIndex }
          //     : ele;
          // })
          initialValues?.complianceFileNew?.filter(
            (_, index) => index != indexToRemove
            // (_, index) => JSON.stringify(_) != file
          )
        );
      } else {
        setFieldValue(
          "complianceFileNew",
          // initialValues?.complianceFileNew?.map((ele, index) => {
          //   console.log("ele to string in new", JSON.stringify(ele) == file);
          //   return index == fileIndex
          //     ? { ...ele, action: "delete", indexAction: fileIndex }
          //     : ele;
          // })
          initialValues?.complianceFileNew?.filter(
            // (_, index) => index != indexToRemove
            (_, index) => JSON.stringify(_) != file
          )
        );
      }
    } else {
      // we will remove from old and new array
      setFilesNew([]);
      console.log(
        "ele to string in old",
        JSON.stringify(initialValues?.complianceFile)
      );
      const indexToRemove = initialValues?.complianceFileNew?.findIndex(
        (ele, index) => JSON.stringify(ele) == file
      );
      const filteredValues = initialValues?.complianceFileNew?.filter(
        // (_, index) => index != indexToRemove
        (_, index) => JSON.stringify(_) != file
      )?.length;
      if (filteredValues > 1) {
        setFieldValue(
          "complianceFile",
          // initialValues?.complianceFile?.map((ele, index) => {
          //   console.log("ele to string in new", JSON.stringify(ele) == file);
          //   return index == fileIndex
          //     ? { ...ele, action: "delete", indexAction: fileIndex }
          //     : ele;
          // })
          initialValues?.complianceFile?.filter(
            (_, index) => index != indexToRemove
            // (_, index) => JSON.stringify(_) != file
          )
        );
      } else {
        setFieldValue(
          "complianceFile",
          // initialValues?.complianceFile?.map((ele, index) => {
          //   console.log("ele to string in new", JSON.stringify(ele) == file);
          //   return index == fileIndex
          //     ? { ...ele, action: "delete", indexAction: fileIndex }
          //     : ele;
          // })
          initialValues?.complianceFile?.filter(
            // (_, index) => index != indexToRemove
            (_, index) => JSON.stringify(_) != file
          )
        );
      }
      // setFieldValue(
      //   "complianceFile",
      //   // initialValues?.complianceFile?.map((ele, index) => {
      //   //   return index == fileIndex
      //   //     ? { file: ele, action: "delete", indexAction: fileIndex }
      //   //     : ele;
      //   // })
      //   initialValues?.complianceFile?.filter(
      //     // (_, index) => index != indexToRemove
      //     (_, index) => JSON.stringify(_) != file
      //   )
      // );
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

// EditComplianceNCertification Component
const EditComplianceNCertification = ({
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
}) => {
  const tooltipId = `tooltip-${label.replace(/\s+/g, "-").toLowerCase()}`;
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

  console.log("selectedFile", selectedFile);

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
           <Tooltip
              content={tooltipContent}
              className={styles.tooltipSec}
            />
          </>
        )}
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
                ? file.split(".").pop().toLowerCase() // If it's a string (e.g., an existing file path)
                : file?.name.split(".").pop().toLowerCase(); // If it's a File object

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

export default EditComplianceNCertification;
