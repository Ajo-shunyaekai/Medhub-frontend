import React from "react";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import styles from "../../../../assets/style/table.module.css";
import { TbEdit } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import PaginationComponent from "../../../shared-components/Pagination/Pagination";
import { useSelector } from "react-redux";

const NewProductList = ({
  products,
  totalItems,
  currentPage,
  itemsPerPage,
  handlePageChange,
}) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { supplierId } = useParams();
  const { user } = useSelector((state) => state.userReducer);

  const columns = [
    {
      name: "Product ID",
      selector: (row) => row?.product_id,
      sortable: true,
      wrap: true,
    },
    {
      name: "Product Name",
      selector: (row) => row?.general.name || "Unnamed Product",
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) =>
        row?.category
          ?.replace(/([a-z])([A-Z])/g, "$1 $2")
          ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "N/A",
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: (row) => row?.[row?.category]?.subCategory || "N/A",
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row?.general.quantity || "0",
      sortable: true,
    },
    {
      name: "Stock Status",
      selector: (row) => {
        const stockValues = row?.inventoryDetails?.[0]?.stock
          ? [row?.inventoryDetails[0].stock]
          : ["N/A"];
        return stockValues[0];
      },
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className={styles.buttonContainer}>
          <Link to={`/admin/product-details/${row?._id}`}>
            <div className={styles.activeBtn}>
              <RemoveRedEyeOutlinedIcon className={styles["table-icon"]} />
            </div>
          </Link>
          {user?.accessControl?.supplier?.requests?.edit && (
            <Link to={`/admin/supplier/${supplierId}/edit-product/${row?._id}`}>
              <div className={styles.activeBtn}>
                <TbEdit className={styles["table-icon"]} />
              </div>
            </Link>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      sortable: false,
    },
  ];

  return (
    <div className={styles.container}>
      <style>
        {`
                    .rdt_Table {
                        border: none;
                        background-color: unset !important;
                    }
                    .rdt_TableRow {
                        background-color: #ffffff !important;
                        border-bottom: none !important;
                    }
                    .rdt_TableHeadRow {
                        background-color: #f9f9fa;
    font-weight: bold !important;
    font-size: 14px !important;
    border-bottom: none !important;
                    }
                    .rdt_TableBody {
                        gap: 10px !important;
                    }
                    .rdt_TableCol {
                        color: #212121 !important;
    font-weight: 600 !important;
                    }
                    .rdt_TableCell {
                        color: #616161;
                        font-weight: 500 !important;
                    }
                    .rdt_TableCellStatus {
                        color: #616161;
                    }
                `}
      </style>
      <DataTable
        columns={columns}
        data={products}
        persistTableHead
        noDataComponent={
          <div className={styles["no-data"]}>No Data Available</div>
        }
        pagination={false}
        responsive
      />

      {products?.length > 0 && totalItems > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={totalItems}
          pageRangeDisplayed={8}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default NewProductList;
