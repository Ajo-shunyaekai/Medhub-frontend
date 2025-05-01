// NotificationList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import PaginationComponent from '../Pagination/pagination';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postRequestWithToken } from '../../../../api/Requests';
import moment from 'moment/moment';
import styles from '../../../assets/style/table.module.css';

const NotificationList = () => {
    const navigate = useNavigate();
    const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

    const [list, setList] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 8;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const notificationOrders = list?.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            localStorage?.clear();
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
        };

        postRequestWithToken('buyer/get-notification-details-list', obj, (response) => {
            if (response?.code === 200) {
                setList(response.result.data || []);
                setTotalItems(response.result.totalItems || 0);
            } else {
                setList([]);
                setTotalItems(0);
            }
        });
    }, [currentPage, buyerIdSessionStorage, buyerIdLocalStorage, navigate]);

    const handleNavigation = (notificationId, event, eventId, linkId) => {
        switch (event) {
            case 'enquiry':
                navigate(`/buyer/ongoing-inquiries-details/${eventId}`);
                break;
            case 'order':
                navigate(`/buyer/order-details/${eventId}`);
                break;
            case 'purchaseorder':
                navigate(`/buyer/purchased-order-details/${linkId}`);
                break;
            case 'invoice':
                navigate(`/buyer/invoice/pending-invoice`);
                break;
            case 'Profile Edit Approved':
            case 'Profile Edit Rejected':
                navigate(`/buyer/profile/${localStorage?.getItem('_id')}`);
                break;
            default:
                navigate('/buyer/');
                break;
        }
    };

    const columns = [
        {
            name: 'Supplier Name',
            selector: row => row?.from === 'admin' ? 'Admin' : row?.supplier?.supplier_name || '-',
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row?.createdAt,
            sortable: true,
            cell: row => (
                <div>
                    {moment(row?.createdAt).format("DD/MM/YYYY HH:mm")}
                    <span>
                        ({moment(row?.createdAt).fromNow()})
                    </span>
                </div>
            ),
        },
        {
            name: 'Message',
            selector: row => row?.message || '-',
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
             
                     <div className={styles.activeBtn}   onClick={() => handleNavigation(row?.notification_id, row?.event, row?.event_id, row?.link_id)}>
            <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
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
               
              color: #99a0ac;
              font-weight: 500 !important;
            }
            .rdt_TableCellStatus {
               
              color: #333;
            }
          `}
        </style>
        <div className={styles.tableMainContainer}>
            <header className={styles.header}>
              <span className={styles.title}>Notification List</span>
            </header>
           
                        <DataTable
                            columns={columns}
                            data={notificationOrders || []}
                            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                            persistTableHead
                            pagination={false}
                            responsive
                        />
                    </div>
                    {list?.length > 0 && (
                        <PaginationComponent
                            activePage={currentPage}
                            itemsCountPerPage={ordersPerPage}
                            totalItemsCount={totalItems}
                            pageRangeDisplayed={8}
                            onChange={handlePageChange}
                        />
                    )}
                </div>
          
    );
};

export default NotificationList;