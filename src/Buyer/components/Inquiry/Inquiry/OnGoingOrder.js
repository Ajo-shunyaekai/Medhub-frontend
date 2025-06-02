import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DataTable from 'react-data-table-component';
import moment from 'moment-timezone';
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";

const OnGoingongoing = ({ inquiryList, totalInquiries, currentPage, inquiryPerPage, handlePageChange, activeLink }) => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [selectedongoing, setSelectedongoing] = useState(null);

  const showModal = (ongoing) => {
    setSelectedongoing(ongoing);
    setModal(true);
  };

  const handleNavigate = (id) => {
    navigate(`/buyer/cancel-enquiry-list/${id}`);
  };
  const columns = [
    {
      name: 'Enquiry ID',
      selector: row => row?.enquiry_id,
      sortable: true,
    },
    {
      name: 'Date',
      selector: row => moment(row?.created_at)?.format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      name: 'Supplier Name',
      selector: row => row?.supplier?.supplier_name,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row =>
        row?.enquiry_status === 'Quotation submitted'
          ? 'Quotation Received'
          : row?.enquiry_status
              ?.split(' ')
              ?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))
              ?.join(' '),
      sortable: true,
      width: '200px',
    },
    {
      name: 'Action',
      cell: row => (
        <div className={styles.buttonContainer}>
          <Link to={`/buyer/ongoing-enquiries-details/${row?.enquiry_id}`} title="View Details">
          <div className={styles.activeBtn}>
            <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
          </div>
          </Link>
          {row?.enquiry_status === 'pending' && (
            <div
              className={styles.activeBtn}
              onClick={() => handleNavigate(row?.enquiry_id)}
              title="Cancel Enquiry"
            >
              <HighlightOffIcon className={styles['table-icon']}/>
            </div>
          )}
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
    <div className={styles.tableMainContainer}>
          <DataTable
            columns={columns}
            data={inquiryList}
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            persistTableHead
            pagination={false}
            responsive
          />
        {modal && <ongoingCancel setModal={setModal} ongoing={selectedongoing} />}
        {inquiryList?.length > 0 && (
          <PaginationComponent
            activePage={currentPage}
            itemsCountPerPage={inquiryPerPage}
            totalItemsCount={totalInquiries}
            pageRangeDisplayed={8}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default OnGoingongoing;