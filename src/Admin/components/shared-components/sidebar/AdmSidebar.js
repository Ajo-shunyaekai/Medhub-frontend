import React, { useState, useEffect, useRef } from "react";
import styles from "./sidebar.module.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import order_list from "../../../assets/Images/dashboard/order_list.svg";
import DeliverLogo from "../../../assets/Images/logo.svg";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TocOutlinedIcon from "@mui/icons-material/TocOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import moment from "moment";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../../redux/reducers/userDataSlice";

const AdmSidebar = ({
  children,
  dragWindow,
  notificationList,
  count,
  handleClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);
  const [isBuyerIconOpen, setIsBuyerIconOpen] = useState(false);
  const [isProductIconOpen, setIsProductIconOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropOpen(!isDropOpen);
    setIsSellerOpen(false);
    setIsManageOpen(false);
    setIsBuyerIconOpen(!isBuyerIconOpen);
  };

  const toggleSellerDropdown = () => {
    setIsSellerOpen(!isSellerOpen);
    setIsDropOpen(false);
    setIsManageOpen(false);
    setIsIconOpen(!isIconOpen);
  };

  const toggleManageDropdown = () => {
    setIsManageOpen(!isManageOpen);
    setIsDropOpen(false);
    setIsSellerOpen(false);
    setIsProductIconOpen(!isProductIconOpen);
  };

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

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
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
    setIsProfileOpen(false); 
    handleClick(); 
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Side bar code start from here
  const [isOpen, setIsOpen] = useState(true);
  const [isIcon, setIsIcon] = useState(true);
  const [isDropdown, setIsDropdown] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);

    if (window.innerWidth <= 992) {
      setIsIcon(!isIcon);
    } else {
      setIsIcon(true);
    }
  };
  // Effect to close sidebar when screen size is 1050px or less
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsOpen(true);
        setIsIcon(true);
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

  const handleSignout = async() => {
    setIsProfileOpen(!isProfileOpen);
    const response = await  dispatch(logoutUser({}));
    if(response.meta.requestStatus === "fulfilled") {
    setTimeout(() => {
      localStorage?.clear();
      navigate("/admin/login");
    }, 500);
    }
  };

  const toggleAccordion = () => {
    setIsDropdown(!isDropdown);
  };
  const DrawerList = (
    <Box sx={{ width: 240 }} role="presentation" onClick={toggleDrawer(true)}>
      <Link
        to="/admin"
        className={styles.sidebar_text}
        activeclassname={styles.active}
      >
        <div className={styles.icon}>
          <HomeOutlinedIcon style={{ color: "#282f86",  fontSize: "22px" }} />
        </div>
        <div
          style={{ display: isOpen ? "block" : "none" }}
          className={styles.sidebar_text}
        >
          Dashboard
        </div>
      </Link>

      <Box sx={{ width: 200 }} role="presentation">
        <div className={styles.mobile_order_btn}>
          <div className={styles.sidebar_text} onClick={toggleAccordion}>
            <div className={styles.icon}>
              {" "}
              <TocOutlinedIcon style={{ color: "#31c971",  fontSize: "22px" }} />
            </div>
            <div >Orders</div>
          </div>
          {isDropdown && (
            <div className={styles.accordion_content}>
              <Link
                to="/admin/alotted-order"
                className={styles.sidebar_text}
                activeclassname={styles.active}
                style={{ width: "170px" }}
              >
                <img
                  src={order_list}
                  alt="order icon"
                  style={{ padding: "6px 6px 0px 10px" }}
                />
                Active Orders
              </Link>

              <Link
                to="/admin/active-order"
                className={styles.sidebar_text}
                activeclassname={styles.active}
                style={{ width: "170px" }}
              >
                <img
                  src={order_list}
                  alt="order icon"
                  style={{ padding: "6px 6px 0px 10px" }}
                />
                Completed Orders
              </Link>
            </div>
          )}
          <div className={styles.dropdown}>
            <div
              className={styles.dropdownToggle}
              onClick={toggleSellerDropdown}
            >
              <LocalMallOutlinedIcon
                style={{ color: "#14bae4",  fontSize: "22px" }}
              />
              <div
                className={styles.dropdownText}
                style={{ display: isOpen ? "block" : "none" }}
              >
                Manage Supplier
                {isIconOpen ? (
                   <KeyboardArrowUpOutlinedIcon style={{ color: "#212121", cursor:"pointer" }} /> 
                ) : (
                   <KeyboardArrowDownOutlinedIcon
                      style={{ color: "#212121", cursor:"pointer" }}
                    />
                )}
              </div>
            </div>
            {isOpen && isSellerOpen && (
              <div className={styles.dropdownContent}>
                <Link
                  to="/admin/supplier-request"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                 
               
                  <div className={styles.sidebar_text}>Supplier Requests</div>
                </Link>
                <Link
                  to="/admin/approved-supplier"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                  
             
                  <div className={styles.sidebar_text}>Approved Supplier</div>
                </Link>
                <Link
                  to="/admin/rejected-supplier"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                   
               
                  <div className={styles.sidebar_text}>Rejected Supplier </div>
                </Link>

                <Link
                  to="/admin/supplier-transaction"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                  
          
                  <div className={styles.sidebar_text}>
                    Supplier Transaction
                  </div>
                </Link>
                <Link
                  to="/admin/manage-seller/enquiry"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                  
            
                  <div className={styles.sidebar_text}>Support</div>
                </Link>
                <Link
                  to="#"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                  
           
                  <div className={styles.sidebar_text}>Invoices </div>
                </Link>
              </div>
            )}
          </div>

          <div className={styles.dropdown}>
            <div className={styles.dropdownToggle} onClick={toggleDropdown}>
              <LocalShippingOutlinedIcon
                style={{ color: "#31c971",  fontSize: "22px" }}
              />
              <div
                className={styles.dropdownText}
                style={{ display: isOpen ? "block" : "none" }}
              >
                Manage Buyer
                {isBuyerIconOpen ? (
                   <KeyboardArrowUpOutlinedIcon style={{ color: "#212121", cursor:"pointer" }} />
                ) : (
                   <KeyboardArrowDownOutlinedIcon
                      style={{ color: "#212121", cursor:"pointer" }}
                    /> 
                )}
              </div>
            </div>
            {isOpen && isDropOpen && (
              <div className={styles.dropdownContent}>
                <Link
                  to="/admin/buyer-request"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                    
             
                  <div className={styles.sidebar_text}>Buyer Requests</div>
                </Link>
                <Link
                  to="#"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                   
           
                  <div className={styles.sidebar_text}>Approved Buyer</div>
                </Link>
                <Link
                  to="#"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                   
              
                  <div className={styles.sidebar_text}>Rejected Buyer </div>
                </Link>
                <Link
                  to="/admin/buyer-transaction"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                    
           
                  <div className={styles.sidebar_text}>Buyer Transaction</div>
                </Link>
                <Link
                  to="/admin/manage-buyer/feedback"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                 
              
                  <div className={styles.sidebar_text}>Support</div>
                </Link>
                <Link
                  to="#"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                   
             
                  <div className={styles.sidebar_text}>Invoices </div>
                </Link>
              </div>
            )}
          </div>
          <div className={styles.dropdown} style={{ marginTop: "8px" }}>
            <div
              className={styles.dropdownToggle}
              onClick={toggleManageDropdown}
            >
              <DescriptionOutlinedIcon
                style={{ color: "#f4c414",  fontSize: "22px" }}
              />
              <div
                className={styles.dropdownText}
                style={{ display: isOpen ? "block" : "none" }}
              >
                Manage Products{" "}
              </div>
              {isProductIconOpen ? (
                 <KeyboardArrowUpOutlinedIcon style={{ color: "#212121", cursor:"pointer" }} /> 
              ) : (
                 <KeyboardArrowDownOutlinedIcon
                      style={{ color: "#212121", cursor:"pointer" }}
                    /> 
              )}
            </div>
            {isOpen && isManageOpen && (
              <div className={styles.dropdownContent}>
                <Link
                  to="/admin/products/new"
                  className={styles.sidebar_text}
                  activeclassname={styles.active}
                >
                   <FiberManualRecordIcon className={styles.icons}/>
                   
              
                  <div className={styles.sidebar_text}>Products</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Box>
    </Box>
  );

  // ======================
  const [sidebarWidth, setSidebarWidth] = useState(0);
  useEffect(() => {
    const calculateSidebarWidth = () => {
      const width = document.querySelector(".sidebar")?.offsetWidth;
      setSidebarWidth(width);
    };
    calculateSidebarWidth();
    window.addEventListener("resize", calculateSidebarWidth);
    return () => {
      window.removeEventListener("resize", calculateSidebarWidth);
    };
  }, []);

  const handleNavigation = (notificationId, event, eventId, linkId) => {
    const eventRoutes = {
      addnewmedicinerequest: "/admin/product-requests/newproduct",
      addsecondarymedicinerequest: "/admin/product-requests/secondary",
      editnewmedicinerequest: "/admin/product-update-requests/newproduct",
      editsecondarymedicinerequest: "/admin/product-update-requests/secondary",
      buyerregistration: "/admin/buyer-request",
      supplierregistration: "/admin/supplier-request",
    };

    const route = eventRoutes[event] || "/admin/";
    setIsNotificationOpen(false);
    navigate(route);
  };

  const handleNotificationNavigate = () => {
    setIsNotificationOpen(false);
    navigate(`/admin/notification-list`);
  };
  return (
    <>
      {/* Header Bar Code start from here  */}
      <div className={styles.nav_container}>
        <div className={styles.nav_wrapper}>
          <div className={styles.nav_img}>
            <Link to="/admin">
              <img src={DeliverLogo} alt="Deliver Logo" />
            </Link>
            
          </div>

          <div className={styles.nav_search_container}>     
              <div className={styles.notificationSection} ref={notificationRef}>
                <Badge
                  badgeContent={count > 9 ? "9+" : count}
                  color="secondary"
                >
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
                            const words = data?.message?.split(" ");
                            const heading = words.slice(0, 2).join(" "); 
                            const content = words.slice(2).join(" ");

                            return (
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
                                  <span className={styles.noti_heading}>
                                    {heading}
                                  </span>
                                  <span className={styles.noti_head_content}>
                                    {content.length > 100
                                      ? `${content.slice(0, 100)}...`
                                      : content}
                                  </span>
                                  <span className={styles.noti_profile}>
                                    {" "}
                                    {moment(data.createdAt).fromNow()}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          // Error message if no notifications exist
                          <div className={styles.error_message}>
                            <p>No notifications available</p>
                          </div>
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
              <div className={styles.notificationSection} ref={profileRef}>
                <AccountCircleOutlinedIcon
                  className={styles.nav_icon_color}
                  onClick={ProfileDropdown}
                />
                {isProfileOpen && (
                  <div className={styles.profile_dropdown}>
                    {/* Profile content goes here */}
                    <div className={styles.profile_wrapper}>
                      <div className={styles.profile_text}>
                        <Link
                          to="#"
                          onClick={() => setIsProfileOpen(false)} // Close dropdown on click
                        >
                          {localStorage?.email || "admin@gmail.com"}
                        </Link>
                      </div>
                      <div className={styles.profile_wrapper_mid}>
                        <div>
                          <Link
                            to="/admin/profile"
                            onClick={() => setIsProfileOpen(false)} // Close dropdown on click
                          >
                            <div className={styles.profile_text}>Profile</div>
                          </Link>
                        </div>
                      </div>

                      <div
                        className={styles.profile_sign_out}
                        onClick={() => {
                          handleSignout();
                          setIsProfileOpen(false); // Close dropdown on signout
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
            </div>
        </div>
        {isSearchVisible && (
          <div className={`${styles.nav_search} ${styles.nav_search_two}`}>
            <SearchOutlinedIcon className={styles.nav_icon_color_two} />
            <input
              type="text"
              placeholder="Search products..."
              className={styles.product_search_input}
            />
          </div>
        )}
      </div>

      {/*Desktop Sidebar code start from here */}
      <div className={styles.sidebar_container}>
        {isIcon ? (
          <div
            style={{ width: isOpen ? "250px" : "50px" }}
            className={styles.sidebar}
          >
            <Link
              to="/admin"
              className={styles.sidebar_text}
              activeclassname={styles.active}
            >
              <div className={styles.icon}>
                <HomeOutlinedIcon
                  style={{ color: "#282f86",  fontSize: "22px" }}
                />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className={styles.sidebar_text}
              >
                Dashboard
              </div>
            </Link>

            <div className={styles.mobile_order_btn}>
              {isDropdown && isOpen && (
                <div className={styles.accordion_content}>
                  <Link
                    to="/admin/alotted-order"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                    style={{ width: "160px" }}
                  >
                    <img
                      src={order_list}
                      alt="order icon"
                      style={{ paddingRight: "15px" }}
                    />
                    Active Orders
                  </Link>

                  <Link
                    to="/admin/active-order"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                    style={{ width: "160px" }}
                  >
                    <img
                      src={order_list}
                      alt="order icon"
                      style={{ paddingRight: "15px" }}
                    />
                    Completed Orders
                  </Link>

                  <Link
                    to="/admin/complete-order"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                    style={{ width: "160px" }}
                  >
                    <img
                      src={order_list}
                      alt="order icon"
                      style={{ paddingRight: "15px" }}
                    />
                    Pending Orders
                  </Link>
                </div>
              )}
            </div>
            {/* =========================== */}
            <div className={styles.dropdown} >
              <div
                className={styles.dropdownToggle}
                onClick={toggleSellerDropdown}
              >
                <LocalMallOutlinedIcon
                  style={{ color: "#14bae4",  fontSize: "22px" }}
                />
                <div
                  className={styles.dropdownText}
                  style={{ display: isOpen ? "block" : "none" }}
                >
                  Manage Supplier
                  {isIconOpen ? (
                     <KeyboardArrowUpOutlinedIcon style={{ color: "#212121", cursor:"pointer" }} /> 
                  ) : (
                     <KeyboardArrowDownOutlinedIcon
                      style={{ color: "#212121", cursor:"pointer" }}
                    />
                     
                  )}
                </div>
              </div>
              {isOpen && isSellerOpen && (
                <div className={styles.dropdownContent}>
                  <Link
                    to="/admin/supplier-request"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                    <div className={styles.sidebar_text}>Supplier Requests</div>
                  </Link>
                  <Link
                    to="/admin/approved-supplier"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                    
                    
                    <div className={styles.sidebar_text}>Approved Supplier</div>
                  </Link>
                  <Link
                    to="/admin/rejected-supplier"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                      
                   
                    <div className={styles.sidebar_text}>
                      Rejected Supplier{" "}
                    </div>
                  </Link>
                  <Link
                    to="/admin/supplier-transaction"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                     
                 
                    <div className={styles.sidebar_text}>
                      Supplier Transaction
                    </div>
                  </Link>
                  <Link
                    to="/admin/supplier-inquiry"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                     
                   
                    <div className={styles.sidebar_text}>Inquiry</div>
                  </Link>
                  <Link
                    to="/admin/supplier-order"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                    
                  
                    <div className={styles.sidebar_text}>Order</div>
                  </Link>
                  <Link
                    to="/admin/supplier-invoice"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                     
                    
                    <div className={styles.sidebar_text}>Invoices </div>
                  </Link>
                  <Link
                    to="/admin/supplier-support"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                     
                  
                    <div className={styles.sidebar_text}>Support</div>
                  </Link>
                </div>
              )}
            </div>
            {/* =========================== */}
            <div className={styles.dropdown}>
              <div className={styles.dropdownToggle} onClick={toggleDropdown}>
                <LocalShippingOutlinedIcon
                  style={{ color: "#31c971",  fontSize: "22px" }}
                />
                <div
                  className={styles.dropdownText}
                  style={{ display: isOpen ? "block" : "none" }}
                >
                  Manage Buyer
                  {isBuyerIconOpen ? (
                     <KeyboardArrowUpOutlinedIcon style={{ color: "#212121", cursor:"pointer" }} />
                  ) : (
                     <KeyboardArrowDownOutlinedIcon
                      style={{ color: "#212121", cursor:"pointer" }}
                    />
                     
                  )}
                </div>
              </div>
              {isOpen && isDropOpen && (
                <div className={styles.dropdownContent}>
                  <Link
                    to="/admin/buyer-request"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                     
                  
                    <div className={styles.sidebar_text}>Buyer Requests</div>
                  </Link>
                  <Link
                    to="/admin/approved-buyer"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                     
                  
                    <div className={styles.sidebar_text}>Approved Buyer</div>
                  </Link>
                  <Link
                    to="/admin/rejected-buyer"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                     
                   
                    <div className={styles.sidebar_text}>Rejected Buyer </div>
                  </Link>
                  <Link
                    to="/admin/buyer-transaction"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                     
                  
                    <div className={styles.sidebar_text}>Buyer Transaction</div>
                  </Link>
                  <Link
                    to="/admin/buyer-inquiry"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                    
                   
                    <div className={styles.sidebar_text}>Inquiry</div>
                  </Link>
                  <Link
                    to="/admin/buyer-order"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                     
                  
                    <div className={styles.sidebar_text}>Order</div>
                  </Link>
                  <Link
                    to="/admin/buyer-invoice"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                      
                
                    <div className={styles.sidebar_text}>Invoices </div>
                  </Link>
                  <Link
                    to="/admin/buyer-support"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                    
                
                    <div className={styles.sidebar_text}>Support</div>
                  </Link>
                </div>
              )}
            </div>

            {/* ===================== */}
            <div className={styles.dropdown}>
              <div
                className={styles.dropdownToggle}
                onClick={toggleManageDropdown}
              >
                <DescriptionOutlinedIcon
                  style={{ color: "#f4c414",  fontSize: "22px" }}
                />
                <div
                  className={styles.dropdownText}
                  style={{ display: isOpen ? "block" : "none" }}
                >
                  Manage Products
                  {isProductIconOpen ? (
                     <KeyboardArrowUpOutlinedIcon style={{ color: "#212121", cursor:"pointer" }} /> 
                  ) : (
                     <KeyboardArrowDownOutlinedIcon
                      style={{ color: "#212121", cursor:"pointer" }}
                    />
                     
                  )}
                </div>
              </div>
              {isOpen && isManageOpen && (
                <div className={styles.dropdownContent}>
                  
                  <Link
                    to="/admin/products/new"
                    className={styles.sidebar_text}
                    activeclassname={styles.active}
                  >
                     <FiberManualRecordIcon className={styles.icons}/>
                     
              
                    <div className={styles.sidebar_text}>Products</div>
                  </Link>
                  
                </div>
              )}
            </div>

           
          </div>
        ) : (
          ""
        )}
        <main style={{ marginTop: isSearchVisible ? "30px" : "0" }}>
          <Outlet />
        </main>
      </div>
      <div>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </div>
    </>
  );
};

export default AdmSidebar;
