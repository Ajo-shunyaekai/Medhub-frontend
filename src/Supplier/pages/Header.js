import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeliverLogo from '../assest/navbar-img/DeliverLogo.svg';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CropFreeOutlinedIcon from '@mui/icons-material/CropFreeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


const Header = ({ children }) => {
    // notification code here
    const [notificationText, setIsNotificationText] = useState('Lorem ipsum dolor sit amet consectetur adipisicing elit  ');

    // Search bar toggle function
    const [isSearchVisible, setSearchVisible] = useState(false);
    const toggleSearchBar = () => {
        setSearchVisible(!isSearchVisible);
    };

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

    // Add full screen code
    const [isFullScreen, setIsFullScreen] = useState(false);
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

    const NotificationDropdown = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setIsProfileOpen(false); // Close profile dropdown if open
    };

    // Profile Dropdown Code
    const ProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsNotificationOpen(false); // Close notification dropdown if open
    };

    // Mobile sidebar
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    return (
        <>
            <div className="nav-container">
                <div className="nav-wrapper">
                    <div className="nav-img">
                        <Link to='/supplier/'>
                            <img src={DeliverLogo} alt="Deliver Logo" />
                        </Link>
                        <MenuOutlinedIcon className='nav-icon-color bar-icon ' onClick={toggle} />
                    </div>

                    <div className="nav_search-container">
                        <div className="nav_search nav_search-one">
                            <SearchOutlinedIcon className='nav-icon-color' />
                            <input type="text" placeholder='Search products...' className='product_search_input' />
                        </div>
                        <div className="nav-notifi-right">
                            <CropFreeOutlinedIcon className='nav-icon-color' onClick={toggleFullScreen} />
                            <SearchOutlinedIcon className='nav_icon_color_two' onClick={toggleSearchBar} />
                            <NotificationsNoneOutlinedIcon className='nav-icon-color' onClick={NotificationDropdown} />
                            {isNotificationOpen && (
                                <div className="noti_container">
                                    {/* Notificatio content goes here */}
                                    <div className="noti_wrapper">
                                        <div className="noti_top_wrapper">


                                            <div className="noti_profile_wrapper">
                                                <div className="noti_profile">
                                                    A
                                                </div>
                                                <div className="noti_profile_text">
                                                    {notificationText.length > 50 ? `${notificationText.slice(0, 50)}...` : notificationText}
                                                </div>
                                            </div>

                                            <div className="noti_profile_wrapper">
                                                <div className="noti_profile">
                                                    B
                                                </div>
                                                <div className="noti_profile_text">
                                                    {notificationText.length > 50 ? `${notificationText.slice(0, 50)}...` : notificationText}
                                                </div>
                                            </div>

                                            <div className="noti_profile_wrapper">
                                                <div className="noti_profile">
                                                    C
                                                </div>
                                                <div className="noti_profile_text">
                                                    {notificationText.length > 50 ? `${notificationText.slice(0, 50)}...` : notificationText}
                                                </div>
                                            </div>

                                            <div className="noti_profile_wrapper">
                                                <div className="noti_profile">
                                                    D
                                                </div>
                                                <div className="noti_profile_text">
                                                    {notificationText.length > 50 ? `${notificationText.slice(0, 50)}...` : notificationText}
                                                </div>
                                            </div>

                                            <div className="noti_profile_wrapper">
                                                <div className="noti_profile">
                                                    E
                                                </div>
                                                <div className="noti_profile_text">
                                                    {notificationText.length > 50 ? `${notificationText.slice(0, 50)}...` : notificationText}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="noti_bottom_wrapper">
                                            <div className="noti_see_all_num">
                                                6 Notifications
                                            </div>

                                            <Link to='#'>
                                                <div className="noti_see_all_btn">See all</div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <AccountCircleOutlinedIcon className='nav-icon-color' onClick={ProfileDropdown} />
                            {isProfileOpen && (
                                <div className="profile_dropdown">
                                    {/* Profile content goes here */}
                                    <div className="profile_wrapper">
                                        <div className="profile_text">
                                            <Link to='#'>
                                                vikrant
                                            </Link>
                                        </div>
                                        <div className="profile_wrapper_mid">
                                            <div >
                                                <Link to='#'>
                                                    <div className="profile_text">Profile</div>
                                                </Link>
                                            </div>

                                            <div className='invoice_container'>
                                                <Link to='#' className='invoice_container'>
                                                    <div className="profile_text">Invoice</div>
                                                    <div className="total_invoice">5</div>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="profile_sign_out">
                                            Sign out
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* <MenuOutlinedIcon className='nav_icon_color_two-3 ' onClick={toggle} /> */}
                            <MenuOutlinedIcon className='nav_icon_color_two-3 ' onClick={toggleDrawer(true)} />
                        </div>
                    </div>
                </div>

                {/* {isSearchVisible && (
                    <div className="nav_search nav_search_two">
                        <SearchOutlinedIcon className='nav_icon_color_two' />
                        <input type="text" placeholder='Search products...' className='product_search_input' />
                    </div>
                )} */}
            </div >
        </>
    )
}

export default Header
