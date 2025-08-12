import React from 'react'
import styles from "../../../assets/style/table.module.css";
import style from './productlist.module.css'
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import PaginationComponent from '../../SharedComponents/Pagination/pagination';

const ProductList = () => {
    const navigate = useNavigate();

    const columns = [
    // {
    //   name: "Id",
    //   selector: (row) =>
    //     (row?.type == "Product" ? "PDT" : "SRV") + " - " + row?.itemId,
    //   sortable: true,
    // },
    {
        name: "Product Name",
        selector: (row) => row?.productName,
        sortable: true,
    },
    {
        name: "Quantity Required",
        selector: (row) => row?.quantityRequired,
        sortable: true,
       /*  minWidth:"100px" */
    },
    {
        name: "Target Price",
        selector: (row) => (row?.targetPrice && row?.targetPrice + " USD"),
        sortable: true,
        /* maxWidth:"175px" */
    },
    {
        name: "Delivery Timeline",
        selector: (row) =>( row?.timeLine && row?.timeLine + " Days"),
        sortable: true,
    },
    {
        name: "Action",
        cell: (row) => (
        <div
        onClick={()=>navigate('/buyer/product-details/687a300ce533ae4db75f83f7')}
            /* to={`/buyer/bid/${id}/${row?.companyType?.toLowerCase()}/${row?.itemId}`} */
            to={`buyer/product-details/687a300ce533ae4db75f83f7`}
            title="View Details"
        >
            <div className={styles.activeBtn}>
            <VisibilityOutlinedIcon className={styles["table-icon"]} />
            </div>
        </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    },
    ];

    const bidData = [{productName:"New Pdt",quantityRequired: 10, timeLine: 10, targetPrice: 500}];


    const handlePageChange = () => {

    }

  return (
    <div className={styles.mainInvoicecontainer2}>

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
            color: #5e676f;
            font-size: 0.825rem;
            font-weight: 500;
            border-bottom: none !important;
        }
        .rdt_TableBody {
          gap: 10px !important;
        }
        .rdt_TableCol {
            color: #5e676f !important;
            font-size: 0.825rem;
            font-weight: 500 !important;
        }
        .rdt_TableCell {           
            color: #99a0ac;
            font-size: 0.825rem;
        }
        .rdt_TableCellStatus {           
            color: #99a0ac;
            font-size: 0.825rem;
        }
      `}
      </style>

      <DataTable
        columns={columns}
        data={bidData || []}
        noDataComponent={
          <div className={styles["no-data"]}>No Data Available</div>
        }
        persistTableHead
        pagination={false}
        responsive
      />

      <div className={style.paginationDiv}>
        <PaginationComponent
            activePage={/* currentPage */1}
            itemsCountPerPage={/* bidsPerPage */5}
            totalItemsCount={/* bidDetails?.additionalDetails?.participants?.length */1}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
        />
      </div>

    </div>
  )
}

export default ProductList