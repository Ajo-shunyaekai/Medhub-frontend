import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postRequestWithToken } from '../../../api/Requests';
import moment from 'moment/moment';

const NotificationList = () => {
    const navigate = useNavigate();
    const adminIdSessionStorage = localStorage?.getItem("admin_id");
    const adminIdLocalStorage = localStorage?.getItem("admin_id");

    const [notificationList, setNotificationList] = useState([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage?.clear();
            navigate("/admin/login");
        }
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            pageNo: currentPage,
            pageSize: ordersPerPage
        };

        postRequestWithToken('admin/get-notification-details-list', obj, (response) => {
            if (response?.code === 200) {
                setNotificationList(response.result.data);
                setCount(response.result.totalItems || 0);
            }
        });
    }, [currentPage, adminIdSessionStorage, adminIdLocalStorage, navigate]);

    const handleNavigation = (notificationId, event, eventId) => {
        switch (event) {
            case 'addnewmedicinerequest':
                navigate(`/admin/product-request-details/${eventId}`);
                break;
            case 'addsecondarymedicinerequest':
                navigate(`/admin/secondary-product-request-details/${eventId}`);
                break;
            case 'editnewmedicinerequest':
                navigate(`/admin/edit-product-details/${eventId}`);
                break;
            case 'editsecondarymedicinerequest':
                navigate(`/admin/edit-secondary-details/${eventId}`);
                break;
            case 'buyerregistration':
                navigate(`/admin/buyer-details/${eventId}`);
                break;   
            case 'supplierregistration':
                navigate(`/admin/supplier-details/${eventId}`);
                break;        
            default:
                navigate('/admin/');
                break;
        }
    };

    const columns = [
        {
            name: 'From',
            selector: row => row?.fromDetails?.buyer_name || row.fromDetails?.supplier_name,
            sortable: true,
            
        },
        {
            name: 'Date',
            selector: row => row?.createdAt,
            sortable: true,
            cell: row => <div>{moment(row.createdAt).format("DD/MM/YYYY")}</div>
        },
        {
            name: 'Message',
            selector: row => row?.message,
            sortable: true,
            cell: row => {
                let additionalInfo = '';
                if (row?.event === 'order' || row.event === 'purposeorder') {
                    additionalInfo = `for ${row.event_id}`;
                } else if (row?.event === 'addmedicine') {
                    additionalInfo = `from: ${row.fromDetails?.buyer_name || row.fromDetails?.supplier_name}`;
                }
                return <div>{row?.message} {additionalInfo}</div>;
            }
        },
        {
            name: 'Action',
            cell: row => (
                <div 
                className={styles.activeBtn}
                    onClick={() => handleNavigation(row.notification_id, row.event, row.event_id)}
                >
                   
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                   
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
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
             <div className={styles.tableMainContainer}>
                                <span className={styles.title}>Notification List</span>
                    <DataTable
                        columns={columns}
                        data={notificationList}
                        persistTableHead
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        pagination={false}
                        responsive
                    />
                    {notificationList?.length > 0 && (
                        <PaginationComponent
                            activePage={currentPage}
                            itemsCountPerPage={ordersPerPage}
                            totalItemsCount={count}
                            pageRangeDisplayed={10}
                            onChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
    );
};

export default NotificationList;