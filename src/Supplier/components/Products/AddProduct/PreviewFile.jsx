import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bulkUpload,
  csvDownload,
  previewBulkProducts,
} from "../../../../redux/reducers/productSlice";

import DataTable from "react-data-table-component";
import styles from "./PreviewFile.module.css";
import FileUploadModal from "../../SharedComponents/FileUploadModal/FileUploadModal";
import { useNavigate } from "react-router-dom";
// import { previewProducts } from "./PreviewFileData";

function PreviewFile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { previewProducts } = useSelector((state) => state?.productReducer);

  const hasRowError = (row) => Object.values(row).some((cell) => cell?.error);
  const hasTableError = previewProducts?.entriesWithoutErrors?.some((row) =>
    hasRowError(row)
  );

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

  const columns =
    previewProducts?.entriesWithoutErrors &&
    previewProducts?.entriesWithoutErrors.length > 0
      ? Object.keys(previewProducts?.entriesWithoutErrors[0]).map(
          (key, index) => {
            const heading = previewProducts?.headings[index] || key;
            return {
              name: heading,
              selector: (row) => row[key]?.value || "-",
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
              width: `${calculateColumnWidth(
                previewProducts?.entriesWithoutErrors,
                key,
                heading
              )}px`,
              style: {
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            };
          }
        )
      : [];

  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };

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
          navigate("/supplier/preview-file");
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
        // navigate("/supplier/product"); // Change this to your desired route
      }
    });
  };

  if (
    !previewProducts ||
    !previewProducts?.entriesWithoutErrors ||
    previewProducts?.entriesWithoutErrors?.length === 0
  ) {
    return (
      <>
        <div className={styles.tableHeader}>
          <div className={styles.headerContainer}>
            <h4>Bulk Upload Preview</h4>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.tableContainer}>
            <DataTable
              columns={[]}
              data={[]}
              noDataComponent={
                <div style={{ padding: "20px", fontSize: "16px" }}>
                  There are no records to display
                </div>
              }
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.tableHeader}>
        <div className={styles.headerContainer}>
          <h4>Bulk Upload Preview</h4>
          <div className={styles.buttonGroup}>
            <button
              className={styles.uploadButton}
              onClick={() => setOpen(true)}
            >
              Re-Upload
            </button>
            <button className={styles.uploadButton} onClick={handleSubmit}>
              Upload
            </button>
          </div>
        </div>
        {hasTableError && (
          <span className={styles.errorBanner}>
            Some errors were found in the uploaded file. Please review and
            correct them.
          </span>
        )}
      </div>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <DataTable
            columns={columns}
            data={previewProducts.entriesWithoutErrors}
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 140px)"
            responsive
            conditionalRowStyles={[
              {
                when: (row) => hasRowError(row),
                style: {
                  backgroundColor: "#ffe6e6",
                },
              },
            ]}
          />
        </div>
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
      {/* {open && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeadContainer}>
                <div className={styles.modalTitle}>Bulk Upload</div>
                <button
                  className={styles.closeButton}
                  onClick={() => setOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className={styles.fileInputWrapper}>
                <label className={styles.formLabel}>
                  Upload File (PDF, CSV, Excel, DOC)
                </label>
                <div className={styles.modalInnerSection}>
                  <FiUploadCloud size={20} className={styles.uploadIcon} />
                  <input
                    type="file"
                    accept=".pdf,.csv,.xls,.xlsx,.doc,.docx"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  {!selectedFile && (
                    <p className={styles.placeholderText}>Upload file</p>
                  )}
                  {selectedFile && (
                    <p className={styles.fileModalName}>
                      {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
              <div className={styles.modalButtonContainer}>
                <button
                  onClick={() => setOpen(false)}
                  className={styles.buttonCancel}
                > Cancel
                </button>
                <button className={styles.buttonSubmit} onClick = {handleBulkUpload}>Upload</button>
              </div>
            </div>
          </div>
        )} */}
    </>
  );
}

export default PreviewFile;

// Old error code
/*
import React from "react";
import DataTable from "react-data-table-component";
import styles from "./PreviewFile.module.css";
import { previewProducts } from "./PreviewFileData";
// const previewProducts = null;

// calculate the max width of a column based on its content
const calculateColumnWidth = (data, key, minWidth = 120, padding = 20) => {
  // const maxContentWidth = Math.max(
  //   ...data.map((row) => (row[key]?.value ? row[key].value.length * 8 : 0))
  // );
  // return Math.max(minWidth, maxContentWidth + padding);
  const maxContentWidth = Math.max(
    ...data.map((row) => {
      const valueLength = row[key]?.value ? row[key].value.length * 8 : 0;
      const errorLength = row[key]?.error ? row[key].error.length * 8 : 0;
      return Math.max(valueLength, errorLength);
    })
  );
  return Math.max(minWidth, maxContentWidth + padding);
};

const columns =
  previewProducts?.entriesWithoutErrors && previewProducts?.entriesWithoutErrors.length > 0
    ? Object.keys(previewProducts?.entriesWithoutErrors[0]).map((key, index) => ({
        name: previewProducts?.headings[index] || key,
        selector: (row) => row[key]?.value || "-",
        cell: (row) => {
          const hasError = row[key]?.error;
          return (
            <div className={`${styles.cell} ${hasError ? styles.errorCell : ""}`}>
              <span>{row[key]?.value || "-"}</span>
              {hasError && (
                <span className={styles.errorMsg} style={{ color: "red", fontSize: "10px", display: "block"}}>
                  ({row[key].error})
                </span>
              )}
            </div>
          );
        },
        minWidth: `${
          calculateColumnWidth(previewProducts?.entriesWithoutErrors, key) +
          (previewProducts?.entriesWithoutErrors.some((row) => row[key]?.error) ? 50 : 0)
        }px`,
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }))
    : [];

// check if any column in a row contains an error
const hasRowError = (row) => Object.values(row).some((cell) => cell?.error);

function PreviewFile() {

  if (!previewProducts || !previewProducts?.entriesWithoutErrors || previewProducts?.entriesWithoutErrors.length === 0) {
    return <div className={styles.container}>
    <div className={styles.tableContainer}>
      <DataTable
        title="Bulk Upload Preview"
        columns={[]}
        data={[]}
        noDataComponent={<div style={{ padding: "20px", fontSize: "16px" }}>There are no records to display</div>}
      />
    </div>
  </div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <DataTable
          title="Bulk Upload Preview"
          columns={columns}
          data={previewProducts?.entriesWithoutErrors}
          fixedHeader
          fixedHeaderScrollHeight="calc(100vh - 120px)"
          responsive
          // highlightOnHover
          // striped
          conditionalRowStyles={[
            {
              when: (row) => hasRowError(row),
              style: {
                backgroundColor: "#ffe6e6",
              },
            },
          ]}
        />
      </div>
    </div>
  );
}

export default PreviewFile;
*/
