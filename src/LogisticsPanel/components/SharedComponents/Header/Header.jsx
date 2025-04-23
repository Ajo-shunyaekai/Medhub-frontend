import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

//images,icons
import logo from "../../../assets/images/navibluelogo.svg";
import Drawerlogo from "../../../assets/images/logo.svg";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Badge from '@mui/material/Badge';
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../../redux/reducers/userDataSlice";

function Header({  notificationList, count }) {
    const notificationRef = useRef(null);
    const profileRef      = useRef(null);
    const navigate        = useNavigate();
    const location        = useLocation();
    const dispatch        = useDispatch()

    const [isDrawerOpen, setIsDrawerOpen]             = useState(false);
    const [isDisplayHamburger, setIsDisplayHamburger] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen]           = useState(false);


    function toggleDrawer() {
        setIsDrawerOpen((prevState) => !prevState);
        setIsDisplayHamburger((prevState) => !prevState);
    }

    function NotificationDropdown() {
        setIsNotificationOpen(!isNotificationOpen);
        setIsProfileOpen(false);
    };

    function ProfileDropdown() {
        setIsProfileOpen(!isProfileOpen);
        setIsNotificationOpen(false);
    };

    function handleClickOutside(event) {
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

    function handleNavigation(notificationId, event, eventId, linkId) {
        const eventRoutes = {
            enquiry: `/buyer/ongoing-inquiries-details/${eventId}`,
            order: `/buyer/order-details/${eventId}`,
            purchaseorder: `/buyer/purchased-order-details/${linkId}`,
            invoice: `/buyer/invoice/Pending-Invoice`,
        };
        const route = eventRoutes[event] || "/buyer/";
        setIsNotificationOpen(false);
        navigate(route);
    };

    function handleNotificationNavigate() {
        setIsNotificationOpen(false)
        navigate(`/buyer/notification-list`)
    }

    const handleSignout = async() => {
        setIsProfileOpen(!isProfileOpen);
                       
        const response = await  dispatch(logoutUser({}));
        if(response.meta.requestStatus === "fulfilled") {
        setTimeout(() => {
            localStorage.clear();
            navigate('/logistics/login')
        }, 500);
        }
    }

return (
    <>
        <header className={`${styles.header}`}>
            <main className={`${styles.wrapper}`}>
                <div className={styles.cursorPointer}>
                    <NavLink className={({ isActive }) => isActive ? styles.activeLink : ""} to="/logistics" end ><img className={`${styles.logo}`} src={logo} alt="logo" /></NavLink>
                </div>
                
                <ul className={`${styles.links}`}>
                    <li><NavLink className={() => (location.pathname === "/logistics" ? styles.activeLink : "")}                      to="/logistics" end >Dashboard</NavLink></li>
                    <li><NavLink className={() => (location.pathname.startsWith("/logistics/order") ? styles.activeLink : "")}        to="/logistics/order">Order</NavLink></li>
                    <li><NavLink className={() => (location.pathname.startsWith("/logistics/pickup-order") ? styles.activeLink : "")} to="/logistics/pickup-order">Pickup Order</NavLink></li>
                    {/* <li><NavLink className={() => (location.pathname.startsWith("/logistics/inventory") ? styles.activeLink : "")}    to="/logistics/inventory">Inventory</NavLink></li>
                    <li><NavLink className={() => (location.pathname.startsWith("/logistics/add-vehicle") ? styles.activeLink : "")}  to="/logistics/add-vehicle">Add Vehicle</NavLink></li>
                    <li><NavLink className={() => (location.pathname.startsWith("/logistics/vehicle-list") ? styles.activeLink : "")} to="/logistics/vehicle-list">Vehicle List</NavLink></li> */}
                    <li className={styles.dropdown}>
                        <span className={`${styles.dropdownToggle} dropdown-toggle`}>Inventory </span>
                        <ul className={styles.dropdownMenu}>
                            <li>
                                <NavLink className={() => (location.pathname.startsWith("/logistics/add-inventory") ? styles.activeLink : "")} to="/logistics/add-inventory">Add Inventory</NavLink>
                            </li>
                            <li>
                                <NavLink className={() => (location.pathname.startsWith("/logistics/inventory-list") ? styles.activeLink : "")} to="/logistics/inventory-list">Inventory List</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className={styles.dropdown}>
                        <span className={`${styles.dropdownToggle} dropdown-toggle`}>Vehicle </span>
                        <ul className={styles.dropdownMenu}>
                            <li>
                                <NavLink className={() => (location.pathname.startsWith("/logistics/add-vehicle") ? styles.activeLink : "")} to="/logistics/add-vehicle">Add Vehicle</NavLink>
                            </li>
                            <li>
                                <NavLink className={() => (location.pathname.startsWith("/logistics/vehicle-list") ? styles.activeLink : "")} to="/logistics/vehicle-list">Vehicle List</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li><NavLink className={() => (location.pathname.startsWith("/logistics/shipment") ? styles.activeLink : "")}     to="/logistics/shipment">Shipment</NavLink></li>
                    <li><NavLink className={() => (location.pathname.startsWith("/logistics/tracking") ? styles.activeLink : "")}     to="/logistics/tracking">Tracking</NavLink></li>
                </ul>

                <div className={`${styles.menus}`}>
                    <div ref={notificationRef} className={styles.cursorPointer}>
                        <Badge badgeContent={count > 9 ? '9+' : count} color="secondary">
                            <NotificationsNoneOutlinedIcon className={styles.cursorPointer} onClick={NotificationDropdown} />
                        </Badge>

                        {isNotificationOpen && (
                            <div className={styles.noti_container}>
                                <div className={styles.noti_wrapper}>
                                    <div className={styles.noti_top_wrapper}>
                                        {notificationList && notificationList.length > 0 ? (
                                            notificationList.slice(0, 5).map((data) => (
                                                <div key={data.notification_id} className={styles.noti_profile_wrapper}
                                                    onClick={() => handleNavigation( data.notification_id, data.event, data.event_id, data.link_id)}>
                                                    <div className={styles.noti_profile_text}>
                                                        {data.message.split(' ').length > 2 ? (
                                                            <>
                                                                <div className={styles.noti_time_content}>
                                                                    <span className={styles.noti_message_part_top}>
                                                                        {data.message.split(' ').slice(0, 2).join(' ')}
                                                                    </span>
                                                                    <span className={styles.noti_message_part_bottom}>
                                                                        {data.message.split(' ').slice(2).join(' ')}
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

                                                <div className={styles.noti_see_all_btn} onClick={handleNotificationNavigate}>See all</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div ref={profileRef} className={styles.cursorPointer}>
                        <AccountCircleOutlinedIcon className={styles.cursorPointer} onClick={ProfileDropdown}/>
                        {isProfileOpen && (
                            <div className={styles.profile_dropdown}>
                                <div className={styles.profile_wrapper}>
                                    <div className={styles.profile_wrapper_mid}>
                                            <Link to="/logistics/profile" onClick={() => setIsProfileOpen(false)}>
                                                <div className={styles.profile_text}>Profile</div>
                                            </Link>
                                    </div>
                                    <div className={styles.profile_sign_out} onClick={() => {
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
                    
                    {!isDisplayHamburger && 
                        <span className={styles.displayHamburger} onClick={toggleDrawer}>
                            <MenuOutlinedIcon />
                        </span>
                    }
                    {isDisplayHamburger && 
                        <span className={styles.displayHamburger} onClick={toggleDrawer}>
                            <CloseOutlinedIcon />
                        </span>
                    }
                </div>
            </main>
        </header>

        <Drawer
            open={isDrawerOpen}
            onClose={toggleDrawer}
            direction="left"
            className={`${styles.drawer}`}
        >
            <ul className={styles.drawerMenus}>
                <li>
                    <NavLink className={() => (location.pathname === "/logistics" ? styles.activeLink : "")} to="/logistics" end onClick={toggleDrawer}>Dashboard</NavLink>
                </li>
                <li>
                    <NavLink className={() => (location.pathname.startsWith("/logistics/order") ? styles.activeLink : "")} to="/logistics/order" end onClick={toggleDrawer}>Order</NavLink>
                </li>
                <li>
                    <NavLink className={() => (location.pathname.startsWith("/logistics/pickup-order") ? styles.activeLink : "")} to="/logistics/pickup-order" end onClick={toggleDrawer}>Pickup Order</NavLink>
                </li>
                {/* <li>
                    <NavLink className={() => (location.pathname.startsWith("/logistics/inventory") ? styles.activeLink : "")} to="/logistics/inventory" end onClick={toggleDrawer}>Inventory</NavLink>
                </li>
                <li>
                    <NavLink className={() => (location.pathname.startsWith("/logistics/add-vehicle") ? styles.activeLink : "")} to="/logistics/add-vehicle" end onClick={toggleDrawer}>Add Vehicle</NavLink>
                </li>
                <li>
                    <NavLink className={() => (location.pathname.startsWith("/logistics/vehicle-list") ? styles.activeLink : "")} to="/logistics/vehicle-list" end onClick={toggleDrawer}>Vehicle List</NavLink>
                </li> */}
                <li className={styles.dropdown}>
                    <span className={`${styles.dropdownToggleMobile} dropdown-toggle`}>Inventory </span>
                    <ul className={styles.dropdownMenuMobile}>
                        <li>
                            <NavLink className={() => (location.pathname.startsWith("/logistics/add-inventory") ? styles.activeLink : "")} to="/logistics/add-inventory" onClick={toggleDrawer}>Add Inventory</NavLink>
                        </li>
                        <li>
                            <NavLink className={() => (location.pathname.startsWith("/logistics/inventory-list") ? styles.activeLink : "")} to="/logistics/inventory-list" onClick={toggleDrawer}>Inventory List</NavLink>
                        </li>
                    </ul>
                </li>
                <li className={styles.dropdown}>
                    <span className={`${styles.dropdownToggleMobile} dropdown-toggle`}>Vehicle </span>
                    <ul className={styles.dropdownMenuMobile}>
                        <li>
                            <NavLink className={() => (location.pathname.startsWith("/logistics/add-vehicle") ? styles.activeLink : "")} to="/logistics/add-vehicle" onClick={toggleDrawer}>Add Vehicle</NavLink>
                        </li>
                        <li>
                            <NavLink className={() => (location.pathname.startsWith("/logistics/vehicle-list") ? styles.activeLink : "")} to="/logistics/vehicle-list" onClick={toggleDrawer}>Vehicle List</NavLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <NavLink className={() => (location.pathname.startsWith("/logistics/shipment") ? styles.activeLink : "")} to="/logistics/shipment" end onClick={toggleDrawer}>Shipment</NavLink>
                </li>
                <li>
                    <NavLink className={() => (location.pathname.startsWith("/logistics/tracking") ? styles.activeLink : "")} to="/logistics/tracking" end onClick={toggleDrawer}>Tracking</NavLink>
                </li>
            </ul>
        </Drawer>
    </>
  );
}

export default Header;
