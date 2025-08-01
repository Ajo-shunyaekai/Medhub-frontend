import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment';
import { postRequestWithToken } from '../../../api/Requests';
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import Loader from "../../SharedComponents/Loader/Loader";
import styles from "../../../assets/style/table.module.css";

const NotificationList = () => {
    const navigate = useNavigate();
    const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage?.getItem("supplier_id");
    const [notificationList, setNotificationList] = useState([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const ordersPerPage = 8;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            localStorage?.clear();
            navigate("/supplier/login");
            return;
        }

        setLoading(true);
        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
        };

        postRequestWithToken('supplier/get-notification-details-list', obj, (response) => {
            if (response?.code === 200) {
                setNotificationList(response.result.data);
                setCount(response.result.totalItems || 0);
            } else {
                setNotificationList([]);
                setCount(0);
            }
            setLoading(false);
        });
    }, [currentPage, navigate, supplierIdSessionStorage, supplierIdLocalStorage]);

    const handleNavigation = (notificationId, event, eventId, linkId) => {
        switch (event) {
            case 'enquiry':
                navigate(`/supplier/enquiry-request-details/${eventId}`);
                break;
            case 'order':
                navigate(`/supplier/active-orders-details/${eventId}`);
                break;
            case 'purchaseorder':
                navigate(`/supplier/purchased-order-details/${linkId}`);
                break;
            case 'invoice':
                navigate(`/supplier/invoice/paid`);
                break;
            case 'addnewmedicinerequest':
                navigate(`/supplier/product-details/${eventId}`);
                break;
            case 'addsecondarymedicinerequest':
                navigate(`/supplier/secondary-product-details/${eventId}`);
                break;
            case 'addnewmedicine':
                navigate(`/supplier/product-details/${eventId}`);
                break;
            case 'addsecondarymedicine':
                navigate(`/supplier/secondary-product-details/${eventId}`);
                break;
            case 'editnewmedicinerequest':
                navigate(`/supplier/pending-products-list`);
                break;
            case 'editsecondarymedicinerequest':
                navigate(`/supplier/pending-products-list`);
                break;
            case 'editnewmedicine':
                navigate(`/supplier/product-details/${eventId}`);
                break;
            case 'editsecondarymedicine':
                navigate(`/supplier/secondary-product-details/${eventId}`);
                break;
            case 'Profile Edit Approved':
                navigate(`/supplier/profile/${localStorage?.getItem('_id')}`);
                break;
            case 'Profile Edit Rejected':
                navigate(`/supplier/profile/${localStorage?.getItem('_id')}`);
                break;
            default:
                navigate('/supplier/');
                break;
        }
    };

    const columns = [
        {
            name: 'From',
            selector: row => row?.from === 'admin' ? 'Admin' : row?.buyer?.buyer_name || 'N/A',
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
            selector: row => row?.message,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Action',
            cell: row => (
                <div
                    className={styles.actionButton}
                    onClick={() => handleNavigation(row?.notification_id, row?.event, row?.event_id, row?.link_id)}
                >
                    <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
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
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={notificationList}
                            persistTableHead
                            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                            pagination={false}
                            responsive
                        />
                        {notificationList.length > 0 && (
                            <PaginationComponent
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={count}
                                pageRangeDisplayed={8}
                                onChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NotificationList;