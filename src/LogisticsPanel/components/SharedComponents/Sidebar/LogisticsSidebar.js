import React, { useState, useEffect, useRef } from 'react';
import styles from './logisticssidebar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DeliverLogo from '../../../assets/images/navibluelogo.svg';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import TocOutlinedIcon from '@mui/icons-material/TocOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CarCrashOutlinedIcon from '@mui/icons-material/CarCrashOutlined';
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../../redux/reducers/userDataSlice';


const Sidebar = ({  notificationList, count, handleClick }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { inquiriesCartCount } = useSelector(state => state.inquiryReducer)
    const [isSearchVisible, setSearchVisible] = useState(false);
    const toggleSearchBar = () => {
        setSearchVisible(!isSearchVisible);
    };
    // Notification and profile dropdown code here
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    const NotificationDropdown = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setIsProfileOpen(false); // Close profile dropdown if open
        // handleClick(); 
    };

    const ProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsNotificationOpen(false); // Close notification dropdown if open
    };

    const handleClickOutside = (event) => {
        // Close dropdowns if clicking outside
        if (
            notificationRef.current &&
            !notificationRef.current.contains(event.target) &&
            profileRef.current &&
            !profileRef.current.contains(event.target)
        ) {
            setIsNotificationOpen(false);
            setIsProfileOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Side bar code start from here
    const [isOpen, setIsOpen] = useState(true);
    const [isIcon, setIsIcon] = useState(true)
    const [isDropdown, setIsDropdown] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);

        if (window.innerWidth <= 992) {
            setIsIcon(!isIcon)
        } else {
            setIsIcon(true)
        }
    }
    // Effect to close sidebar when screen size is 1050px or less
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 992) {
                setIsOpen(true);
                setIsIcon(true)
            } else {
                setIsOpen(true);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Mobile sidebar
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const toggleAccordion = () => {
        setIsDropdown(!isDropdown)
    };

    const handleSignout = async () => {
        setIsProfileOpen(!isProfileOpen);
               
        const response = await  dispatch(logoutUser({}));
        if(response.meta.requestStatus === "fulfilled") {
        setTimeout(() => {
            localStorage?.clear();
            navigate('/logistics/login')
        }, 500);
        }
    }
 // ======================
    const [sidebarWidth, setSidebarWidth] = useState(0);
    useEffect(() => {
        const calculateSidebarWidth = () => {
            const width = document.querySelector('.sidebar')?.offsetWidth;
            setSidebarWidth(width);
        };
        calculateSidebarWidth();
        window.addEventListener('resize', calculateSidebarWidth);
        return () => {
            window.removeEventListener('resize', calculateSidebarWidth);
        };
    }, []); 
    const handleNavigation = (notificationId, event, eventId, linkId) => {
        const eventRoutes = {
            enquiry: `/buyer/ongoing-enquiries-details/${eventId}`,
            order: `/buyer/order-details/${eventId}`,
            purchaseorder: `/buyer/purchased-order-details/${linkId}`,
            invoice: `/buyer/invoice/pending-invoice`,
        };

        const route = eventRoutes[event] || "/buyer/";
        setIsNotificationOpen(false);
        navigate(route);
    };



    const handleNotificationNavigate = () => {
        setIsNotificationOpen(false)
        navigate(`/buyer/notification-list`)
    }

    return (
        <>
            {/* Header Bar Code start from here  */}
            <div className={styles.nav_container}>
                <div className={styles.nav_wrapper}>
                    <div className={styles.nav_img}>
                        <Link to='/logistics/'>
                            <img src={DeliverLogo} alt="Deliver Logo" />
                        </Link>
                    </div>

                    <div className={styles.nav_search_container}>
                        <div className={styles.nav_notifi_right}>
                            <SearchOutlinedIcon className={styles.nav_icon_color_two} onClick={toggleSearchBar} />
                            <div ref={notificationRef}>
                                <Badge badgeContent={count > 9 ? '9+' : count} color="secondary">
                                    <NotificationsNoneOutlinedIcon
                                        className={styles.nav_icon_color}
                                        onClick={NotificationDropdown}
                                    />
                                </Badge>

                                {isNotificationOpen && (
                                    <div className={styles.noti_container}>
                                        <div className={styles.noti_wrapper}>
                                            <div className={styles.noti_top_wrapper}>
                                                {notificationList && notificationList.length > 0 ? (
                                                    notificationList.slice(0, 5).map((data) => (
                                                        <div
                                                            key={data.notification_id}
                                                            className={styles.noti_profile_wrapper}
                                                            onClick={() =>
                                                                handleNavigation(
                                                                    data.notification_id,
                                                                    data.event,
                                                                    data.event_id,
                                                                    data.link_id
                                                                )
                                                            }
                                                        >
                                                            <div className={styles.noti_profile_text}>
                                                                {data?.message?.split(' ').length > 2 ? (
                                                                    <>
                                                                        <div className={styles.noti_time_content}>
                                                                            <span className={styles.noti_message_part_top}>
                                                                                {data?.message?.split(' ').slice(0, 2).join(' ')}
                                                                            </span>
                                                                            <span className={styles.noti_message_part_bottom}>
                                                                                {data?.message?.split(' ').slice(2).join(' ')}
                                                                            </span>
                                                                        </div>
                                                                        <div className={styles.noti_time_section}>
                                                                            <span className={styles.noti_time}>11:12 <br /> 16-12-2024</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span>{data.message}</span>
                                                                )}
                                                            </div>
                                                        
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className={styles.no_notifications}>
                                                        No notifications available
                                                    </div>
                                                )}
                                            </div>

                                            <div className={styles.noti_bottom_wrapper}>
                                                {notificationList && notificationList.length > 0 && (
                                                    <>
                                                        <div className={styles.noti_see_all_num}>
                                                            {notificationList.length} Notifications
                                                        </div>

                                                        <div
                                                            className={styles.noti_see_all_btn}
                                                            onClick={handleNotificationNavigate}
                                                        >
                                                            See all
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div ref={profileRef}>
                                <AccountCircleOutlinedIcon
                                    className={styles.nav_icon_color}
                                    onClick={ProfileDropdown}
                                />
                                {isProfileOpen && (
                                    <div className={styles.profile_dropdown}>
                                        <div className={styles.profile_wrapper}>
                                            {/* <div className={styles.profile_text}>
                                                <Link
                                                    to="#"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    {localStorage?.getItem('buyer_name') ||
                                                        localStorage?.getItem('buyer_name')}
                                                </Link>
                                            </div> */}
                                            <div className={styles.profile_wrapper_mid}>
                                                    <Link
                                                        to="/logistics/profile"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <div className={styles.profile_text}>Profile</div>
                                                    </Link>
                                            </div>
                                            <div
                                                className={styles.profile_sign_out}
                                                onClick={() => {
                                                    handleSignout();
                                                    setIsProfileOpen(false); 
                                                }}
                                            >
                                                Sign out
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <MenuOutlinedIcon className={styles.nav_icon_color_two_3} onClick={toggleDrawer(true)} />
                        </div>
                    </div>
                </div>

                {isSearchVisible && (
                    <div className={`${styles.nav_search} ${styles.nav_search_two}`} >
                        <SearchOutlinedIcon className={styles.nav_icon_color_two} />
                        <input type="text" placeholder='Search products...' className={styles.product_search_input} />
                    </div>
                )
                }
            </div >

            {/*Desktop Sidebar code start from here */}
            < div div className={styles.sidebar_container} >
                {
                    isIcon ? <div style={{ width: isOpen ? "200px" : "50px" }
                    }
                        className={styles.sidebar} >

                        <Link to="/logistics/" className={styles.sidebar_text} activeclassname={styles.active}>
                            <div className={styles.icon}><HomeOutlinedIcon style={{ color: '#448BFF', fontSize: '20px' }} /></div>

                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Dashboard</div>
                        </Link>
                        <Link to="/logistics/order" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
                            <div className={styles.icon}><TocOutlinedIcon style={{ color: '#31c971', fontSize: '20px' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Orders</div>
                        </Link>
                        <Link to="/logistics/pickup-order" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
                            <div className={styles.icon}><LocalShippingOutlinedIcon style={{ color: '#f4c414', fontSize: '20px' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Pickup Orders</div>
                        </Link>
                        <Link to="/logistics/inventory" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
                            <div className={styles.icon}><WarehouseOutlinedIcon style={{ color: '#14bae4', fontSize: '20px' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Inventory/Warehouse</div>
                        </Link>
                        <Link to="/logistics/add-vehicle" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
                            <div className={styles.icon}><AddCircleOutlineOutlinedIcon style={{ color: '#14bae4', fontSize: '20px' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Add Vehicle</div>
                        </Link>
                        <Link to="/logistics/vehicle-list" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
                            <div className={styles.icon}><CarCrashOutlinedIcon style={{ color: '#31c971', fontSize: '20px' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Vehicle List</div>
                        </Link>
                        <Link to="/logistics/shipment" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
                            <div className={styles.icon}><FlightTakeoffOutlinedIcon style={{ color: '#f54394', fontSize: '20px' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Shipment</div>
                        </Link>
                        <Link to="/logistics/tracking" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
                            <div className={styles.icon}><TimelineOutlinedIcon style={{ color: '#ff4545', fontSize: '20px' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Tracking</div>
                        </Link>
                    </ div> : ''
                }
                <main style={{ marginTop: isSearchVisible ? '30px' : '0' }}>
                    <Outlet />
                </main>
            </ div >
        </>
    );
};

export default Sidebar;
