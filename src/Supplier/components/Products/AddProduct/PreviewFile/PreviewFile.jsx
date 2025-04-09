import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bulkUpload,
  csvDownload,
  previewBulkProducts,
} from "../../../../../redux/reducers/productSlice";
 
import DataTable from "react-data-table-component";
import styles from "./PreviewFile.module.css";
import FileUploadModal from "../../../SharedComponents/FileUploadModal/FileUploadModal";
import { useNavigate } from "react-router-dom";
 
function PreviewFile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasErrorEntries, setHasErrorEntries] = useState(false);
  const [isErrorFreeDataUploaded, setIsErrorFreeDataUploaded] = useState(false); // New state to track error-free data upload status
  const { previewProducts } = useSelector((state) => state?.productReducer);
 
  const hasRowError = (row) => Object.values(row).some((cell) => cell?.error);
 
  const calculateColumnWidth = (data, key, heading, minWidth = 120) => {
    const headingWidth = heading.length * 10;
    const maxContentWidth = Math.max(
      ...data.map((row) => {
        const value = row[key]?.value;
        return value ? value.toString().length * 8 : 0;
      }),
      headingWidth
    );
    return Math.max(minWidth, maxContentWidth);
  };
 
  const handleSelectFile = (file) => {
    setSelectedFile(file);
  };
 
  const handleCSVDownload = () => {
    dispatch(csvDownload(previewProducts?.entriesWithErrors)).then(
      (response) => {
        if (response?.meta.requestStatus === "fulfilled") {
          navigate("/supplier/preview-file");
        }
      }
    );
  };
 
  const handleBulkUpload = () => {
    if (selectedFile) {
      const bulkFormData = new FormData();
      bulkFormData.append("supplier_id", sessionStorage.getItem("_id"));
      bulkFormData.append("csvfile", selectedFile);
 
      dispatch(previewBulkProducts(bulkFormData)).then((response) => {
        if (response?.meta.requestStatus === "fulfilled") {
          setIsErrorFreeDataUploaded(false); // Mark that the error-free data is uploaded successfully
          // navigate("/supplier/preview-file");
        }
      });
    }
  };
 
  const handleSubmit = async () => {
    const payloadData = previewProducts?.entriesWithoutErrors?.map((ele) => {
      return {
        ...ele,
        supplier_id: {
          value: sessionStorage.getItem("_id"),
        },
      };
    });
    dispatch(bulkUpload(payloadData))?.then((response) => {
      if (response?.meta.requestStatus === "fulfilled") {
        setHasErrorEntries(false);
        setIsErrorFreeDataUploaded(true); // Mark that the error-free data is uploaded successfully
        previewProducts?.entriesWithErrors?.length == 0 &&
          navigate("/supplier/product");
      }
    });
  };
 
  return (
    <>
      <div className={styles.previewContainer}>
        <div className={styles.tableHeader}>
          <h4>Products Preview</h4>
        </div>
 
        {!isErrorFreeDataUploaded &&
          previewProducts?.entriesWithoutErrors?.length > 0 && (
            <div className={styles.container}>
              <div
                className={`alert alert-success ${styles.successContainer}`}
                role="alert"
              >
                {previewProducts.entriesWithoutErrorsCount} successfully
                uploaded
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.uploadButton}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
              <div className={styles.tableContainer}>
                <DataTable
                  columns={Object.keys(
                    previewProducts?.entriesWithoutErrors[0]
                  ).map((key, index) => {
                    const heading = previewProducts?.headings[index] || key;
                    return {
                      name: heading,
                      selector: (row) => row[key]?.value || "-",
                      width: `${calculateColumnWidth(
                        previewProducts?.entriesWithoutErrors,
                        key,
                        heading
                      )}px`,
                    };
                  })}
                  data={previewProducts.entriesWithoutErrors}
                  fixedHeader
                  pagination
                  responsive
                />
              </div>
            </div>
          )}
 
        {previewProducts?.entriesWithErrors?.length > 0 && (
          <div className={styles.container}>
            <div
              className={`alert alert-danger ${styles.successContainer}`}
              role="alert"
            >
              {previewProducts.entriesWithErrorsCount} errors have been
              identified
              <div className={styles.buttonGroup}>
                <button
                  className={styles.uploadButton}
                  onClick={() => setOpen(true)}
                >
                  Re-Upload
                </button>
                <button
                  className={styles.uploadButton}
                  onClick={handleCSVDownload}
                >
                  Download
                </button>
              </div>
            </div>
            <div className={styles.tableContainer}>
              <DataTable
                columns={Object.keys(previewProducts?.entriesWithErrors[0]).map(
                  (key, index) => {
                    const heading = previewProducts?.headings[index] || key;
                    return {
                      name: heading,
                      selector: (row) => row[key]?.value || "-",
                      width: `${calculateColumnWidth(
                        previewProducts?.entriesWithErrors,
                        key,
                        heading
                      )}px`,
                      style: {
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                      cell: (row) => {
                        const hasError = row[key]?.error;
                        return (
                          <div
                            className={`${styles.cell} ${
                              hasError ? styles.errorCell : ""
                            }`}
                          >
                            {Array.isArray(row[key]?.value)
                              ? row[key]?.value?.join()
                              : row[key]?.value || "-"}
                          </div>
                        );
                      },
                    };
                  }
                )}
                data={previewProducts.entriesWithErrors}
                fixedHeader
                pagination
                responsive
                conditionalRowStyles={[
                  {
                    when: (row) => hasRowError(row),
                    style: {
                      backgroundColor: "#ffe6e6",
                    },
                  },
                ]}
                // fixedHeaderScrollHeight="calc(100vh - 140px)"
              />
            </div>
          </div>
        )}
      </div>
 
      {open && (
        <FileUploadModal
          onClose={() => setOpen(false)}
          onSelectFile={handleSelectFile}
          onHandleUpload={handleBulkUpload}
          modaltitle="Bulk Upload"
          title="Upload"
          selectedFile={selectedFile}
        />
      )}
    </>
  );
}
 
export default PreviewFile;