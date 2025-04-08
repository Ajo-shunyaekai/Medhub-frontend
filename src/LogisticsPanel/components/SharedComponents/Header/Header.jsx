import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

import logo from "../../../assets/images/navibluelogo.svg";
import Drawerlogo from "../../../assets/images/logo.svg";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

function Header() {
    const notificationRef = useRef(null);
    const profileRef      = useRef(null);
    const navigate        = useNavigate();

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

    const handleSignout = () => {
        setIsProfileOpen(!isProfileOpen);
        localStorage.clear()
        sessionStorage.clear()
        navigate('/logistics/login')
    }

return (
    <>
        <header className={`${styles.header}`}>
            <main className={`${styles.wrapper}`}>
                <Link to={`/logistics/`}><img className={`${styles.logo}`} src={logo} alt="logo" /></Link>
                
                <ul className={`${styles.links}`}>
                    <li><Link to={`/logistics/`} className="">Dashboard</Link></li>
                    <li><Link to={`/logistics/order`} className="">Order</Link></li>
                    <li><Link to={`/logistics/pickup-order`} className="">Pickup Order</Link></li>
                    <li><Link to={`/logistics/inventory`} className="">Inventory</Link></li>
                    <li><Link to={`/logistics/add-vehicle`} className="">Add Vehicle</Link></li>
                    <li><Link to={`/logistics/vehicle-list`} className="">Vehicle List</Link></li>
                    <li><Link to={`/logistics/shipment`} className="">Shipment</Link></li>
                    <li><Link to={`/logistics/tracking`} className="">Tracking</Link></li>
                </ul>
                <div className={`${styles.menus}`}>
                    <span className="notification">
                        <NotificationsNoneOutlinedIcon onClick={NotificationDropdown}/>
                    </span>
                    <span className="profile" ref={profileRef}>
                        <AccountCircleOutlinedIcon onClick={ProfileDropdown}/>
                            {isProfileOpen && (
                                <div className={styles.profileDropdown}>
                                    <button onClick={handleSignout}>Logout</button>
                                </div>
                            )}
                    </span>
                    
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
                <Link to={`/logistics/`}>Dashboard</Link>
            </li>
            <li>
                <Link to={`/logistics/order`}>Order</Link>
            </li>
            <li>
                <Link to={`/logistics/pickup-order`}>Pickup Order</Link>
            </li>
            <li>
                <Link to={`/logistics/inventory`}>Inventory</Link>
            </li>
            <li>
                <Link to={`/logistics/add-vehicle`}>Add vehicle</Link>
            </li>
            <li>
                <Link to={`/logistics/vehicle-list`}>Vehicle List</Link>
            </li>
            <li>
                <Link to={`/logistics/shipment`}>Shipment</Link>
            </li>
            <li>
                <Link to={`/logistics/tracking`}>Tracking</Link>
            </li>
            </ul>
        </Drawer>
    </>
  );
}

export default Header;
