import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DataTable from 'react-data-table-component';
import PaginationComponent from "../../SharedComponents/Pagination/Pagination"
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
      selector: (row) => row?.purchaseOrder_id,
      sortable: true,
    
    },
    {
      name: 'Inquiry ID',
      selector: (row) => row?.enquiry_id,
      sortable: true,
     
    },
    {
      name: 'PO Date',
      selector: (row) => row?.po_date,
      sortable: true,
     
    },
    {
      name: 'Buyer Name',
      selector: (row) => row?.buyer_name,
      sortable: true,
     
    },
    {
      name: 'Status',
      selector: (row) => row?.po_status,
      sortable: true,
      cell: (row) => (
        <div>
          {row?.po_status?.charAt(0)?.toUpperCase() + row?.po_status?.slice(1)}
        </div>
      ),
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className={styles.buttonContainer}>
          <Link to={`/supplier/proforma-invoice/${row?.purchaseOrder_id}`}>
          <button className={styles.orderButton}>Make Order</button>
          </Link>
          <Link to={`/supplier/purchased-order-details/${row?.purchaseOrder_id}`}>
          <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
          </Link>
        </div>
      ),
      sortable: true,
    }
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
            data={poList || []}
            persistTableHead
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
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
  );
};

export default PurchasedOrder;