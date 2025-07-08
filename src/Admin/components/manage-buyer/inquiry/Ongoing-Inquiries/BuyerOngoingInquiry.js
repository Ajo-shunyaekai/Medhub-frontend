import React from 'react';
import DataTable from 'react-data-table-component';
import styles from '../../../../assets/style/table.module.css';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PaginationComponent from '../../../shared-components/Pagination/Pagination';

const BuyerOngoingInquiry = ({ inquiryList, totalInquiries, currentPage, inquiriesPerPage, handlePageChange }) => {
    const columns = [
        {
            name: 'Enquiry ID',
            selector: row => row?.enquiry_id,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row?.created_at,
            sortable: true,
            cell: row => <div>{moment(row?.created_at).format("DD/MM/YYYY")}</div>,
        },
        {
            name: 'Supplier Name',
            selector: row => row?.supplier?.supplier_name,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row?.enquiry_status,
            sortable: true,
            cell: row => (
                <div className={styles.tableCell}>
                    {row?.enquiry_status?.split(' ').map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)).join(' ')}
                </div>
            ),
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/admin/ongoing-enquiries-details/${row?.enquiry_id}`} title="View Details">
                    <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
                </Link>
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
                data={inquiryList}
                persistTableHead
                noDataComponent={<div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No Data Available</div>}
                pagination={false}
                responsive
            />
            {inquiryList && inquiryList.length > 0 && (
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={inquiriesPerPage}
                    totalItemsCount={totalInquiries}
                    pageRangeDisplayed={8}
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default BuyerOngoingInquiry;