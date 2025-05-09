import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DataTable from 'react-data-table-component';
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";

const PurchasedOrder = ({ poList, totalPoList, currentPage, inquiryPerPage, handlePageChange, activeLink }) => {
  const [modal, setModal] = useState(false);
  const [selectedongoing, setSelectedongoing] = useState(null);

  const showModal = (ongoing) => {
    setSelectedongoing(ongoing);
    setModal(true);
  };

  const columns = [
    {
      name: 'PO ID',
      selector: row => row?.purchaseOrder_id,
      sortable: true,
    },
    {
      name: 'Inquiry ID',
      selector: row => row?.enquiry_id,
      sortable: true,
    },
    {
      name: 'Date',
      selector: row => row?.po_date,
      sortable: true,
    },
    {
      name: 'Supplier Name',
      selector: row => row?.supplier_name,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Total Amount',
      selector: row => {
        const totalAmount = row?.order_items?.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0);
        return `${row.total_amount || totalAmount} USD`;
      },
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className={styles.buttonContainer}>
          <Link to={`/buyer/purchased-order-details/${row?.purchaseOrder_id}`}>
          <div className={styles.activeBtn}>
            <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
          </div>
          </Link>
          <Link to={`/buyer/edit-create-po/${row?.purchaseOrder_id}`}>
          <div className={styles.activeBtn}>
            <EditIcon className={styles['table-icon']} onClick={() => showModal(row)} />
              </div>
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
          font-weight: bold;
          border-bottom: none !important;
        }
        .rdt_TableBody {
          gap: 10px !important;
        }
        .rdt_TableCol {
           
          color: #333;
        }
        .rdt_TableCell {
           
          color: #333;
          font-weight: 500 !important;
        }
        .rdt_TableCellStatus {
           
          color: #333;
        }
      `}
    </style>
    <div className={styles.tableMainContainer}>
          <DataTable
            columns={columns}
            data={poList ?? []}
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            persistTableHead
            pagination={false}
            responsive
          />
        {modal && <ongoingCancel setModal={setModal} ongoing={selectedongoing} />}
        {poList?.length > 0 && (
          <PaginationComponent
            activePage={currentPage}
            itemsCountPerPage={inquiryPerPage}
            totalItemsCount={totalPoList}
            pageRangeDisplayed={8}
            onChange={handlePageChange}
          />
        )}
      </div>
      </div>
  );
};

export default PurchasedOrder;