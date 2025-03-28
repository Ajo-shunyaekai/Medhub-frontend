import React from "react";
import DataTable from "react-data-table-component";
import styles from "./PreviewFile.module.css";
import { testData } from "./PreviewFileData";
// const testData = null;

const hasRowError = (row) => Object.values(row).some((cell) => cell?.error);

// Function to check if any error exists in the data
const hasTableError = testData?.maincontent?.some((row) => hasRowError(row));

const calculateColumnWidth = (data, key, minWidth = 120, padding = 20) => {
  const maxContentWidth = Math.max(
    ...data.map((row) => {
      const valueLength = row[key]?.value ? row[key].value.length * 8 : 0;
      return valueLength;
    })
  );
  return Math.max(minWidth, maxContentWidth + padding);
};

const columns =
  testData?.maincontent && testData.maincontent.length > 0
    ? Object.keys(testData.maincontent[0]).map((key, index) => ({
        name: testData.headings[index] || key,
        selector: (row) => row[key]?.value || "-",
        cell: (row) => {
          const hasError = row[key]?.error;
          return (
            <div className={`${styles.cell} ${hasError ? styles.errorCell : ""}`}>
              {row[key]?.value || "-"}
            </div>
          );
        },
        minWidth: `${calculateColumnWidth(testData.maincontent, key)}px`,
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }))
    : [];

function PreviewFile() {
  if (!testData || !testData.maincontent || testData.maincontent.length === 0) {
    return (
      // <div className={styles.container}>
      //   <div className={styles.tableContainer}>
      //     <DataTable
      //       title="Bulk Upload Preview"
      //       columns={[]}
      //       data={[]}
      //       noDataComponent={<div style={{ padding: "20px", fontSize: "16px" }}>There are no records to display</div>}
      //     />
      //   </div>
      // </div>
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
              noDataComponent={<div style={{ padding: "20px", fontSize: "16px" }}>There are no records to display</div>}
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
            <button className={styles.uploadButton}>Re-Upload</button>
            <button className={styles.uploadButton}>Upload</button>
          </div>
        </div>
        {hasTableError && (
            <span className={styles.errorBanner}>
              Some errors were found in the uploaded file. Please review and correct them.
            </span>
          )}
      </div>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <DataTable
            // title="abc"
            columns={columns}
            data={testData.maincontent}
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
    </>
  );
}

export default PreviewFile;


// Old error code 

// import React from "react";
// import DataTable from "react-data-table-component";
// import styles from "./PreviewFile.module.css";
// import { testData } from "./PreviewFileData";
// // const testData = null;

// // calculate the max width of a column based on its content
// const calculateColumnWidth = (data, key, minWidth = 120, padding = 20) => {
//   // const maxContentWidth = Math.max(
//   //   ...data.map((row) => (row[key]?.value ? row[key].value.length * 8 : 0))
//   // );
//   // return Math.max(minWidth, maxContentWidth + padding);
//   const maxContentWidth = Math.max(
//     ...data.map((row) => {
//       const valueLength = row[key]?.value ? row[key].value.length * 8 : 0;
//       const errorLength = row[key]?.error ? row[key].error.length * 8 : 0;
//       return Math.max(valueLength, errorLength);
//     })
//   );
//   return Math.max(minWidth, maxContentWidth + padding);
// };

// const columns =
//   testData?.maincontent && testData.maincontent.length > 0
//     ? Object.keys(testData.maincontent[0]).map((key, index) => ({
//         name: testData.headings[index] || key,
//         selector: (row) => row[key]?.value || "-",
//         cell: (row) => {
//           const hasError = row[key]?.error;
//           return (
//             <div className={`${styles.cell} ${hasError ? styles.errorCell : ""}`}>
//               <span>{row[key]?.value || "-"}</span>
//               {hasError && (
//                 <span className={styles.errorMsg} style={{ color: "red", fontSize: "10px", display: "block"}}>
//                   ({row[key].error})
//                 </span>
//               )}
//             </div>
//           );
//         },
//         minWidth: `${
//           calculateColumnWidth(testData.maincontent, key) +
//           (testData.maincontent.some((row) => row[key]?.error) ? 50 : 0)
//         }px`,
//         style: {
//           whiteSpace: "nowrap",
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//         },
//       }))
//     : [];

// // check if any column in a row contains an error
// const hasRowError = (row) => Object.values(row).some((cell) => cell?.error);

// function PreviewFile() {

//   if (!testData || !testData.maincontent || testData.maincontent.length === 0) {
//     return <div className={styles.container}>
//     <div className={styles.tableContainer}>
//       <DataTable
//         title="Bulk Upload Preview"
//         columns={[]}
//         data={[]}
//         noDataComponent={<div style={{ padding: "20px", fontSize: "16px" }}>There are no records to display</div>}
//       />
//     </div>
//   </div>
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.tableContainer}>
//         <DataTable
//           title="Bulk Upload Preview"
//           columns={columns}
//           data={testData.maincontent}
//           fixedHeader
//           fixedHeaderScrollHeight="calc(100vh - 120px)"
//           responsive
//           // highlightOnHover
//           // striped
//           conditionalRowStyles={[
//             {
//               when: (row) => hasRowError(row),
//               style: {
//                 backgroundColor: "#ffe6e6",
//               },
//             },
//           ]}
//         />
//       </div>
//     </div>
//   );
// }

// export default PreviewFile;
