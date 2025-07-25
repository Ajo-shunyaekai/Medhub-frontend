import React, { useState, useEffect, useRef } from "react";
import styles from "./buyersidebar.module.css";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import order_list from "../../../assets/images/dashboard/order_list.svg";
import DeliverLogo from "../../../assets/images/navibluelogo.svg";
import invoice from "../../../assets/images/invoice.svg";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Badge from "@mui/material/Badge";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import TocOutlinedIcon from "@mui/icons-material/TocOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { logoutUser } from "../../../../redux/reducers/userDataSlice";
import HandshakeIcon from "@mui/icons-material/Handshake";
import GavelIcon from "@mui/icons-material/Gavel";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

const Sidebar = ({
  children,
  dragWindow,
  invoiceCount,
  notificationList,
  count,
  handleClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { inquiriesCartCount } = useSelector((state) => state.inquiryReducer);
  const listCount = localStorage.getItem("list_count");

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

    // Cleanup the event listener on component unmount
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
    // setIsFullScreen(!isFullScreen);
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

  const toggleAccordion = () => {
    setIsDropdown(!isDropdown);
  };

  const handleSignout = async () => {
    setIsProfileOpen(!isProfileOpen);

    const response = await dispatch(logoutUser({}));
    if (response.meta.requestStatus === "fulfilled") {
      setTimeout(() => {
        localStorage?.clear();
        navigate("/buyer/login");
      }, 500);
    }
  };

  {
    /* Mobile sidebar */
  }
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(true)}>
      <Link
        to="/buyer/"
        className={styles.sidebar_text}
        activeclassname={styles.active}
      >
        <div className={styles.icon}>
          <HomeOutlinedIcon style={{ color: "#282f86", fontSize: "20px" }} />
        </div>
        <div
          style={{ display: isOpen ? "block" : "none" }}
          className={styles.sidebar_text}
        >
          Dashboard
        </div>
      </Link>

      <Link
        to="/buyer/buy"
        className={styles.sidebar_text}
        activeclassname={styles.active}
      >
        <div className={styles.icon}>
          <LocalMallOutlinedIcon
            style={{ color: "#14bae4", fontSize: "20px" }}
          />
        </div>
        <div
          style={{ display: isOpen ? "block" : "none" }}
          className={styles.sidebar_text}
        >
          Buy
        </div>
      </Link>
      <Link
        to="/buyer/bid"
        className={styles.sidebar_text}
        activeclassname={styles.active}
      >
        <div className={styles.icon}>
          <LocalOfferOutlinedIcon
            style={{ color: "#ff7f50", fontSize: "20px" }}
          />
        </div>
        <div
          style={{ display: isOpen ? "block" : "none" }}
          className={styles.sidebar_text}
        >
          Bid
        </div>
      </Link>

      <Box sx={{ width: 250 }} role="presentation">
        <div className={styles.mobile_order_btn}>
          <div className={styles.sidebar_text} onClick={toggleAccordion}>
            <div className={styles.icon}>
              {" "}
              <TocOutlinedIcon style={{ color: "#31c971", fontSize: "20px" }} />
            </div>
            <div style={{ marginLeft: "10px", padding: "5px 0px" }}>Orders</div>
          </div>
          {isDropdown && (
            <div className={styles.accordion_content}>
              <Link
                to="/buyer/alotted-order"
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
                to="/buyer/active-order"
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

              <Link
                to="/buyer/complete-order"
                className={styles.sidebar_text}
                activeclassname={styles.active}
                style={{ width: "170px" }}
              >
                <img
                  src={order_list}
                  alt="order icon"
                  style={{ padding: "6px 6px 0px 10px" }}
                />
                Pending Orders
              </Link>
            </div>
          )}

          <Link
            to="/buyer/my-supplier"
            className={styles.sidebar_text}
            activeclassname={styles.active}
          >
            <div className={styles.icon}>
              {" "}
              <LocalShippingOutlinedIcon
                style={{ color: "#f4c414", fontSize: "20px" }}
              />
            </div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className={styles.sidebar_text}
            >
              {" "}
              My Supplier
            </div>
          </Link>
          <Link
            to="/buyer/invoice/pending-invoice"
            className={styles.sidebar_text}
            activeclassname={styles.active}
          >
            <div className={styles.icon}>
              {" "}
              <DescriptionOutlinedIcon
                style={{ color: "#F54394", fontSize: "20px" }}
              />
            </div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className={styles.sidebar_text}
            >
              {" "}
              Invoice
            </div>
          </Link>

          <Link
            to="/buyer/support"
            className={styles.sidebar_text}
            activeclassname={styles.active}
          >
            <div className={styles.icon}>
              {" "}
              <SupportAgentOutlinedIcon
                style={{ color: "#FF4545", fontSize: "20px" }}
              />
            </div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className={styles.sidebar_text}
            >
              {" "}
              Support
            </div>
          </Link>
        </div>
      </Box>
    </Box>
  );

  // ======================
  const [sidebarWidth, setSidebarWidth] = useState(0);
  useEffect(() => {
    // Function to calculate sidebar width
    const calculateSidebarWidth = () => {
      const width = document.querySelector(".sidebar")?.offsetWidth;
      setSidebarWidth(width);
    };

    // Call the function initially and on window resize
    calculateSidebarWidth();
    window.addEventListener("resize", calculateSidebarWidth);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", calculateSidebarWidth);
    };
  }, []); // Empty dependency array to run this effect only once on mount

  // ======================

  const handleNavigation = (notificationId, event, eventId, linkId) => {
    const eventRoutes = {
      enquiry: `/buyer/ongoing-enquiries-details/${eventId}`,
      order: `/buyer/order-details/${eventId}`,
      purchaseorder: `/buyer/purchased-order-details/${linkId}`,
      invoice: `/buyer/invoice/pending-invoice`,
      "Profile Edit Approved": `/buyer/profile/${localStorage?.getItem("_id")}`,
      "Profile Edit Rejected": `/buyer/profile/${localStorage?.getItem("_id")}`,
    };

    const route = eventRoutes[event] || "/buyer/";
    setIsNotificationOpen(false);
    navigate(route);
  };

  const handleNotificationNavigate = () => {
    setIsNotificationOpen(false);
    navigate(`/buyer/notification-list`);
  };

  return (
    <>
      {/* Header Bar Code start from here  */}
      <div className={styles.nav_container}>
        <div className={styles.nav_wrapper}>
          <div className={styles.nav_img}>
            <Link to="/buyer/">
              <img src={DeliverLogo} alt="Deliver Logo" />
            </Link>
            <MenuOutlinedIcon
              className={`${styles.nav_icon_color} ${styles.bar_icon}`}
              onClick={toggle}
            />
          </div>

          <div className={styles.nav_search_container}>
            <div className={`${styles.nav_search} ${styles.nav_search_one}`}>
              <SearchOutlinedIcon className={styles.nav_icon_color} />
              <input
                type="text"
                placeholder="Search products..."
                className={styles.product_search_input}
              />
            </div>
            <div className={styles.nav_notifi_right}>
              <Badge
                badgeContent={inquiriesCartCount || listCount}
                color="secondary"
              >
                <Link to="/buyer/send-enquiry">
                  <ShoppingCartCheckoutIcon className={styles.nav_icon_color} />
                </Link>
              </Badge>
              <Link to="/buyer/invoice/pending-invoice">
                <div className={styles.invoice_head}>
                  <img
                    className={styles.invoice_head_img}
                    src={invoice}
                    alt="invoice"
                    id="invoice-tooltip"
                  />
                  <Tooltip
                    anchorId="invoice-tooltip"
                    content="Invoice"
                    place="top"
                  />
                </div>
              </Link>

              <SearchOutlinedIcon
                className={styles.nav_icon_color_two}
                onClick={toggleSearchBar}
              />
              <div ref={notificationRef}>
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
                                className={styles.noti_profile_wrapper}
                                onClick={() =>
                                  handleNavigation(
                                    data?.notification_id,
                                    data?.event,
                                    data?.event_id,
                                    data?.link_id
                                  )
                                }
                                key={i}
                              >
                                <div className={styles.noti_profile_text}>
                                  <div className={styles.noti_profile_section}>
                                    <span className={styles.noti_heading}>
                                      {heading}
                                    </span>
                                    <span className={styles.noti_content}>
                                      {content}
                                    </span>
                                    <span className={styles.noti_time}>
                                      {moment(data?.createdAt).fromNow()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className={styles.noti_error}>
                            No notifications available
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

              {/* Profile Icon and Dropdown */}
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
                          {localStorage?.getItem("buyer_name") ||
                            localStorage?.getItem("buyer_name")}
                        </Link>
                      </div>
                      <div className={styles.profile_wrapper_mid}>
                        <div>
                          <Link
                            to={`/buyer/profile/${localStorage?.getItem(
                              "_id"
                            )}`}
                            onClick={() => setIsProfileOpen(false)} // Close dropdown on click
                          >
                            <div className={styles.profile_text}>Profile</div>
                          </Link>
                        </div>
                        <div></div>
                      </div>
                      <div
                        className={styles.profile_sign_out}
                        onClick={() => {
                          handleSignout();
                          setIsProfileOpen(false); // Close dropdown on click
                        }}
                      >
                        Sign out
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
      <div div className={styles.sidebar_container}>
        {isIcon ? (
          <div
            style={{ width: isOpen ? "200px" : "50px" }}
            className={styles.sidebar}
          >
            <Link
              to="/buyer/"
              className={styles.sidebar_text}
              activeclassname={styles.active}
            >
              <div className={styles.icon}>
                <HomeOutlinedIcon
                  style={{ color: "#282f86", fontSize: "20px" }}
                />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className={styles.sidebar_text}
              >
                Dashboard
              </div>
            </Link>

            <Link
              to="/buyer/buy"
              className={styles.sidebar_text}
              activeclassname={styles.active}
            >
              <div className={styles.icon}>
                <LocalMallOutlinedIcon
                  style={{ color: "#14bae4", fontSize: "20px" }}
                />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className={styles.sidebar_text}
              >
                Buy
              </div>
            </Link>
            <Link
              to="/buyer/bid"
              className={styles.sidebar_text}
              activeclassname={styles.active}
            >
              <div className={styles.icon}>
                <LocalOfferOutlinedIcon
                  style={{ color: "#ff7f50", fontSize: "20px" }}
                />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className={styles.sidebar_text}
              >
                Bid
              </div>
            </Link>
            <Link
              to="/buyer/enquiry"
              className={`${styles.sidebar_text} ${styles.desktop_order_btn}`}
              activeclassname={styles.active}
            >
              <div className={styles.icon}>
                <ManageSearchIcon
                  style={{ color: "#5c6bc0", fontSize: "20px" }}
                />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className={styles.sidebar_text}
              >
                Enquiry
              </div>
            </Link>
            <Link
              to="/buyer/order/active-orders"
              className={`${styles.sidebar_text} ${styles.desktop_order_btn}`}
              activeclassname={styles.active}
            >
              <div className={styles.icon}>
                <TocOutlinedIcon
                  style={{ color: "#31c971", fontSize: "20px" }}
                />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className={styles.sidebar_text}
              >
                Orders
              </div>
            </Link>

            <div className={styles.mobile_order_btn}>
              <div className={styles.sidebar_text} onClick={toggleAccordion}>
                <div className={styles.icon}>
                  <TocOutlinedIcon
                    style={{ color: "#31c971", fontSize: "20px" }}
                  />
                </div>
                <div
                  style={{
                    marginLeft: "10px",
                    padding: "5px 0px",
                    display: isOpen ? "block" : "none",
                  }}
                >
                  Orders
                </div>
              </div>
              {isDropdown && isOpen && (
                <div className={styles.accordion_content}>
                  <Link
                    to="/buyer/alotted-order"
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
                    to="/buyer/active-order"
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
                    to="/buyer/complete-order"
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

            <Link
              to="/buyer/my-supplier"
              className={styles.sidebar_text}
              activeclassname={styles.active}
            >
              <div className={styles.icon}>
                <LocalShippingOutlinedIcon
                  style={{ color: "#f4c414", fontSize: "20px" }}
                />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className={styles.sidebar_text}
              >
                My Supplier
              </div>
            </Link>

            <Link
              to="/buyer/invoice/pending-invoice"
              className={styles.sidebar_text}
              activeclassname={styles.active}
            >
              <div className={styles.icon}>
                <DescriptionOutlinedIcon
                  style={{ color: "#F54394", fontSize: "20px" }}
                />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className={styles.sidebar_text}
              >
                Invoice
              </div>
            </Link>

            <Link
              to="/buyer/support"
              className={styles.sidebar_text}
              activeclassname={styles.active}
            >
              <div className={styles.icon}>
                <SupportAgentOutlinedIcon
                  style={{ color: "#FF4545", fontSize: "20px" }}
                />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className={styles.sidebar_text}
              >
                Support
              </div>
            </Link>
          </div>
        ) : (
          ""
        )}
        <main style={{ marginTop: isSearchVisible ? "30px" : "0" }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar code start from here */}
      <div>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </div>
    </>
  );
};

export default Sidebar;
