import React, { useState, useEffect, useRef } from 'react';
import styles from './sidebar.module.css';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import order_list from '../../../assest/images/dashboard/order_list.svg'
import DeliverLogo from '../../../assest/images/logo.svg';
import invoice from '../../../assest/images/invoice.svg'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Badge from '@mui/material/Badge';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CropFreeOutlinedIcon from '@mui/icons-material/CropFreeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import TocOutlinedIcon from '@mui/icons-material/TocOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
// Mobile sidebar
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';


const SupSidebar = ({ children, dragWindow,
    invoiceCount, notificationList, count, handleClick
}) => {
    const navigate = useNavigate()
    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");
    const [isDropOpen, setIsDropOpen] = useState(false);
    const [isIconOpen, setIsIconOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropOpen(!isDropOpen);
        setIsIconOpen(!isIconOpen);
    };

    const [refresh, setRefresh] = useState(false)

    // notification code here
    const [notificationText, setIsNotificationText] = useState('Lorem ipsum dolor sit amet consectetur adipisicing elit  ');

    // Search bar toggle function
    const [isSearchVisible, setSearchVisible] = useState(false);
    const toggleSearchBar = () => {
        setSearchVisible(!isSearchVisible);
    };

    // Add full screen code
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const handleFullScreenChange = () => {
            const isCurrentlyFullScreen = document.fullscreenElement !== null;
            setIsFullScreen(isCurrentlyFullScreen);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullScreen(!isFullScreen);
    };

    // Notification and profile dropdown code here
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    const NotificationDropdown = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setIsProfileOpen(false); // Close profile dropdown if open
        handleClick(); // for notification status update
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

    {/* Mobile sidebar */ }
    const DrawerList = (
        <Box sx={{ width: 200 }} role="presentation" onClick={toggleDrawer(true)} >
            <Link to="/supplier/dashboard" className={styles.sidebar_text} activeclassname={styles.active}>
                <div className={styles.icon}><HomeOutlinedIcon style={{ color: '#448BFF' }} /></div>
                <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Dashboard</div>
            </Link>

            <Link to="/supplier/product" className={styles.sidebar_text} activeclassname={styles.active}>
                <div className={styles.icon}><LocalMallOutlinedIcon style={{ color: '#14bae4' }} /></div>
                <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Products</div>
            </Link>

            <Box sx={{ width: 200 }} role="presentation" >
                <div className={styles.mobile_order_btn}>
                    <div className={styles.sidebar_text} onClick={toggleAccordion}>
                        <div className={styles.icon}> <TocOutlinedIcon style={{ color: '#31c971' }} /></div>
                        <div style={{ marginLeft: '10px', padding: '5px 0px' }}>Orders</div>
                    </div>
                    {isDropdown && (
                        <div className={styles.accordion_content}>
                            <Link to="/supplier/order-request" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '170px' }}>
                                <img src={order_list} alt="order icon" style={{ padding: '6px 6px 0px 10px' }} />
                                Order Request
                            </Link>

                            <Link to="/supplier/active-order" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '170px' }}>
                                <img src={order_list} alt="order icon" style={{ padding: '6px 6px 0px 10px' }} />
                                Active Orders
                            </Link>

                            <Link to="/supplier/complete-order" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '170px' }}>
                                <img src={order_list} alt="order icon" style={{ padding: '6px 6px 0px 10px' }} />
                                Completed Orders
                            </Link>

                            <Link to="/supplier/deleted-order" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '170px' }}>
                                <img src={order_list} alt="order icon" style={{ padding: '6px 6px 0px 10px' }
                                } />
                                Deleted Orders
                            </Link>
                        </div>
                    )
                    }

                    <Link to="/supplier/invoice/pending" className={styles.sidebar_text} activeclassname={styles.active}>
                        <div className={styles.icon}> <DescriptionOutlinedIcon style={{ color: '#F54394' }} /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}> Invoice</div>
                    </Link>

                    <Link to="/supplier/support" className={styles.sidebar_text} activeclassname={styles.active}>
                        <div className={styles.icon}> <SupportAgentOutlinedIcon style={{ color: '#FF4545' }} /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}> Support</div>
                    </Link>
                </div >
            </Box >
        </Box >
    );

    // ======================
    const [sidebarWidth, setSidebarWidth] = useState(0);
    useEffect(() => {
        // Function to calculate sidebar width
        const calculateSidebarWidth = () => {
            const width = document.querySelector('.sidebar')?.offsetWidth;
            setSidebarWidth(width);
        };

        // Call the function initially and on window resize
        calculateSidebarWidth();
        window.addEventListener('resize', calculateSidebarWidth);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', calculateSidebarWidth);
        };
    }, []); // Empty dependency array to run this effect only once on mount
    // ======================

    const handleSignout = () => {
        setIsProfileOpen(!isProfileOpen);
        localStorage.clear()
        sessionStorage.clear()
        navigate('/supplier/login')
    }

    const updateStatusApi = (id) => {
        // postRequestWithToken('buyer/update-notification-status', obj, (response) => {
        //             if (response.code === 200) {
        //                 // setNotificationList(response.result.data);
        //                 // setCount(response.result.totalItems || 0)
        //             } else {
        //                 console.log('error in order details api');
        //             }
        //         });
    }

    const handleNavigation = (notificationId, event, eventId, linkId) => {
        const eventRoutes = {
            enquiry: `/supplier/inquiry-request-details/${eventId}`,
            order: `/supplier/active-orders-details/${eventId}`,
            purchaseorder: `/supplier/purchased-order-details/${linkId}`,
            invoice: `/supplier/invoice/paid`,
            addnewmedicinerequest: `/supplier/product-details/${eventId}`,
            addsecondarymedicinerequest: `/supplier/secondary-product-details/${eventId}`,
            addnewmedicine: `/supplier/product-details/${eventId}`,
            addsecondarymedicine: `/supplier/secondary-product-details/${eventId}`,
            editnewmedicinerequest: `/supplier/pending-products-list`,
            editsecondarymedicinerequest: `/supplier/pending-products-list`,
            editnewmedicine: `/supplier/product-details/${eventId}`,
            editsecondarymedicine: `/supplier/secondary-product-details/${eventId}`,
            "Profile Edit Approved": `/supplier/profile/${sessionStorage.getItem('_id')}`,
            "Profile Edit Rejected": `/supplier/profile/${sessionStorage.getItem('_id')}`,
        };

        const route = eventRoutes[event] || '/supplier/';

        setIsNotificationOpen(false);
        navigate(route);

        if (event === 'enquiry') {
            updateStatusApi(notificationId);
        }
        // handleClick(notificationId, event);
    };


    const handleNotificationNavigate = () => {
        setIsNotificationOpen(false)
        navigate(`/supplier/notification-list`)
    }

    return (
        <>
            {/* Header Bar Code start from here  */}
            <div className={styles.nav_container}>
                <div className={styles.nav_wrapper}>
                    <div className={styles.nav_img}>
                        <Link to='/supplier/'>
                            <img src={DeliverLogo} alt="Deliver Logo" />
                        </Link>
                        <MenuOutlinedIcon className={`${styles.nav_icon_color} ${styles.bar_icon}`} onClick={toggle} />
                    </div>

                    <div className={styles.nav_search_container}>

                        <div className={`${styles.nav_search} ${styles.nav_search_one}`}>
                            <SearchOutlinedIcon className={styles.nav_icon_color} />
                            <input type="text" placeholder='Search products...' className={styles.product_search_input} />
                        </div>
                        <div className={styles.nav_notifi_right}>
                            <Link to='/supplier/invoice/pending'>
                                <div className={styles.invoice_head}>
                                    <img
                                        className={styles.invoice_head_img}
                                        src={invoice}
                                        alt='invoice'
                                        id='invoice-tooltip'
                                    />
                                    <Tooltip
                                        anchorId='invoice-tooltip'
                                        content='Invoice'
                                        place='top'
                                    />
                                </div>
                            </Link>


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
                                                    notificationList.slice(0, 5).map((data, i) => {
                                                        const words = data.message.split(' ');
                                                        const heading = words.slice(0, 2).join(' ');
                                                        const content = words.slice(2).join(' ');
                                                        return (
                                                            <div
                                                                className={styles.noti_profile_wrapper}
                                                                onClick={() =>
                                                                    handleNavigation(
                                                                        data.notification_id,
                                                                        data.event,
                                                                        data.event_id,
                                                                        data.link_id
                                                                    )
                                                                }
                                                                key={i}
                                                            >
                                                                <div className={styles.noti_profile_text}>
                                                                    <div className={styles.noti_profile_section}>
                                                                    <span className={styles.noti_heading}>{heading}</span>
                                                                    <span className={styles.noti_content}>{content}
                                                                    </span>
                                                                    <span className={styles.noti_time}>4 hours ago</span>
                                                                    </div>
                                                                   
                                                                </div>
                                                              
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className={styles.noti_error}>No notifications available</div>
                                                )}
                                            </div>
                                            {notificationList && notificationList.length > 0 && (
                                                <div className={styles.noti_bottom_wrapper}>
                                                    <div className={styles.noti_see_all_num}>
                                                        {notificationList.length} Notifications
                                                    </div>
                                                    <div
                                                        className={styles.noti_see_all_btn}
                                                        onClick={handleNotificationNavigate}
                                                    >
                                                        See all
                                                    </div>
                                                </div>
                                            )}
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
                                            <div className={styles.profile_text}>
                                                <Link
                                                    to="#"
                                                    onClick={() => setIsProfileOpen(false)} // Close dropdown on click
                                                >
                                                    {sessionStorage.getItem('supplier_name')}
                                                </Link>
                                            </div>
                                            <div className={styles.profile_wrapper_mid}>
                                                <div>
                                                    <Link
                                                        to={`/supplier/profile/${sessionStorage?.getItem("_id")}`}
                                                        onClick={() => setIsProfileOpen(false)} // Close dropdown on click
                                                    >
                                                        <div className={styles.profile_text}>Profile</div>
                                                    </Link>
                                                </div>

                                                <div>
                                                    <Link
                                                        to="/supplier/subscription"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <div className={styles.profile_text}>Subscription</div>
                                                    </Link>
                                                </div>
                                            </div>

                                            <div
                                                className={styles.profile_sign_out}
                                                onClick={() => {
                                                    handleSignout();
                                                    setIsProfileOpen(false); // Close dropdown on sign out
                                                }}
                                            >
                                                Sign out
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <MenuOutlinedIcon
                                    className={styles.nav_icon_color_two_3}
                                    onClick={toggleDrawer(true)}
                                />
                            </div>
                        </div >
                    </div >
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
                        <Link to="/supplier/" className={styles.sidebar_text} activeclassname={styles.active}>
                            <div className={styles.icon}><HomeOutlinedIcon style={{ color: '#448BFF' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Dashboard</div>
                        </Link>
                        {/* start the dropdown container */}
                        <div className={`${styles.dropdown} ${styles.sidebars_section}`}>
                            <div className={styles.dropdownToggle} onClick={toggleDropdown}>

                                <div className={styles.icon}>
                                    <LocalMallOutlinedIcon style={{ color: '#14bae4' }} />
                                </div>
                                <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Products</div>
                                {isOpen && (
                                    isIconOpen
                                        ? <KeyboardArrowUpOutlinedIcon style={{ color: '#5e676f' }} />
                                        : <KeyboardArrowDownOutlinedIcon style={{ color: '#5e676f' }} />
                                )}
                            </div>
                            {isOpen && isDropOpen && (
                                <div className={styles.dropdownContent}>
                                    <Link to="/supplier/product" className={styles.sidebar_text} activeclassname={styles.active}>
                                        <FiberManualRecordIcon style={{ color: '#d3d3d3', fontSize: '12px', marginLeft: "10px" }} />
                                        <div className={styles.sidebar_text}>Add Products</div>
                                    </Link>
                                    <Link to="/supplier/pending-products-list" className={styles.sidebar_text} activeclassname={styles.active}>
                                        <FiberManualRecordIcon style={{ color: '#d3d3d3', fontSize: '12px', marginLeft: "10px" }} />
                                        <div className={styles.sidebar_text}>Pending Products</div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* end the dropdown container */}



                        <Link to="/supplier/inquiry-purchase-orders" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
                            <div className={styles.icon}><ManageSearchIcon style={{ color: '#20c997', fontSize: '22px' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Inquiry</div>
                        </Link>
                        <Link to="/supplier/order/active" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
                            <div className={styles.icon}><TocOutlinedIcon style={{ color: '#31c971' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Orders</div>
                        </Link>


                        <div className={styles.mobile_order_btn}>
                            <div className={styles.sidebar_text} onClick={toggleAccordion}>
                                <div className={styles.icon}><TocOutlinedIcon style={{ color: '#31c971' }} /></div>
                                <div style={{ marginLeft: '10px', padding: '5px 0px', display: isOpen ? "block" : "none" }}>Orders</div>
                            </div>
                            {isDropdown && isOpen && (
                                <div className={styles.accordion_content}>
                                    <Link to="/supplier/order-request" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '160px' }}>
                                        <img src={order_list} alt="order icon" style={{ paddingRight: '15px', }} />
                                        Order Request
                                    </Link>

                                    <Link to="/supplier/active-order" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '160px' }}>
                                        <img src={order_list} alt="order icon" style={{ paddingRight: '15px', }} />
                                        Active Orders
                                    </Link>

                                    <Link to="/supplier/complete-order" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '160px' }}>
                                        <img src={order_list} alt="order icon" style={{ paddingRight: '15px', }} />
                                        Completed Orders
                                    </Link>

                                    <Link to="/supplier/deleted-order" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '160px' }}>
                                        <img src={order_list} alt="order icon" style={{ paddingRight: '15px', }} />
                                        Deleted Orders
                                    </Link>
                                </div>
                            )}

                        </div>

                        <Link to="/supplier/subscription" className={styles.sidebar_text} activeclassname={styles.active}>
                            <div className={styles.icon}><SubscriptionsOutlinedIcon style={{ color: '#14bae4', }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Subscription</div>
                        </Link>

                        <Link to="/supplier/invoice" className={styles.sidebar_text} activeclassname={styles.active}>
                            <div className={styles.icon}><DescriptionOutlinedIcon style={{ color: '#F54394' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Invoice</div>
                        </Link>

                        <Link to="/supplier/support" className={styles.sidebar_text} activeclassname={styles.active}>
                            <div className={styles.icon}><SupportAgentOutlinedIcon style={{ color: '#FF4545' }} /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Support</div>
                        </Link>
                    </ div > : ''
                }
                <main style={{ marginTop: isSearchVisible ? '30px' : '0' }}>
                    <Outlet />
                </main>
            </ div >

            {/* Mobile Sidebar code start from here */}
            < div >
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
            </div >

        </>
    );;
};

export default SupSidebar;
