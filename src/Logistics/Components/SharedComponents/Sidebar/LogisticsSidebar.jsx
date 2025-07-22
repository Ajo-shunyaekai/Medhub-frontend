import React, { useEffect, useRef, useState } from 'react'
import styles from './LogisticsSidebar.module.css'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import order_list from '../../../Assets/Images/Dashboard/order_list.svg'
import DeliverLogo from '../../../Assets/Images/logo.svg';
import invoice from '../../../Assets/Images/invoice.svg'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Badge from '@mui/material/Badge';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import TocOutlinedIcon from '@mui/icons-material/TocOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import moment from "moment"
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../../redux/reducers/userDataSlice';


const LogisticsSidebar = ({ children, dragWindow,
    invoiceCount, notificationList, count, handleClick
}) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const supplierIdSessionStorage = localStorage?.getItem("partner_id");
    const supplierIdLocalStorage = localStorage?.getItem("partner_id");
    const [isDropOpen, setIsDropOpen] = useState(false);
    const [isIconOpen, setIsIconOpen] = useState(false);
  
    const toggleDropdown = () => {
        setIsDropOpen(!isDropOpen);
        setIsIconOpen(!isIconOpen);
    };

    const [isSearchVisible, setSearchVisible] = useState(false);
    const toggleSearchBar = () => {
        setSearchVisible(!isSearchVisible);
    };
    const [isFullScreen, setIsFullScreen] = useState(false);
  
    useEffect(() => {
        const handleFullScreenChange = () => {
            const isCurrentlyFullScreen = document.fullscreenElement !== null;
            setIsFullScreen(isCurrentlyFullScreen);
        };
  
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

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
      setIsNotificationOpen(false); 
    };

    const handleSignout = async () => {
        setIsProfileOpen(!isProfileOpen);
        
        const response = await  dispatch(logoutUser({}));
        if(response.meta.requestStatus === "fulfilled") {
        setTimeout(() => {
            localStorage?.clear();
            navigate('/logistic/login')
        }, 500);
        }
    }

    const handleProfileClick = (event) => {
        event.stopPropagation();
        setIsProfileOpen(false); // Close the dropdown first
        setTimeout(() => {
            navigate(`/logistic/profile/${localStorage.getItem("_id")}`); // Navigate after dropdown closes
        }, 0); 
    };

    const handleSubscriptionClick = (event) => {
        event.stopPropagation();
        setIsProfileOpen(false);
        /* setTimeout(() => {
            navigate("/supplier/subscription");
        }, 0); */
    };
    
    const handleSignOutClick = (event) => {
        event.stopPropagation();
        handleSignout(); // Your logout function
        setIsProfileOpen(false);
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
            <Link to="/logistic/dashboard" className={styles.sidebar_text} activeclassname={styles.active}>
                <div className={styles.icon}><HomeOutlinedIcon style={{ color: '#282f86' }} /></div>
                <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Dashboard</div>
            </Link>
  
            <Box sx={{ width: 200 }} role="presentation" >
                <div className={styles.mobile_order_btn}>
                    <div className={styles.sidebar_text} onClick={toggleAccordion}>
                        <div className={styles.icon}> <TocOutlinedIcon style={{ color: '#31c971' }} /></div>
                        <div style={{ marginLeft: '10px', padding: '5px 0px' }}>Orders</div>
                    </div>
                    {isDropdown && (
                        <div className={styles.accordion_content}>
                            <Link to="/logistic/order-request" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '170px' }}>
                                <img src={order_list} alt="order icon" style={{ padding: '6px 6px 0px 10px' }} />
                                Order Request
                            </Link>
  
                            <Link to="/logistic/active-order" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '170px' }}>
                                <img src={order_list} alt="order icon" style={{ padding: '6px 6px 0px 10px' }} />
                                Active Orders
                            </Link>
  
                            <Link to="/logistic/complete-order" className={styles.sidebar_text} activeclassname={styles.active} style={{ width: '170px' }}>
                                <img src={order_list} alt="order icon" style={{ padding: '6px 6px 0px 10px' }} />
                                Completed Orders
                            </Link>    
                        </div>
                    )
                    }
                </div >
            </Box >
        </Box >
    );
  
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
    // ======================

        const updateStatusApi = (id) => {
        }
     
    const handleNavigation = (notificationId, event, eventId, linkId) => {
        const eventRoutes = {
            enquiry: `/logistic/enquiry-request-details/${eventId}`,
            order: `/logistic/active-orders-details/${eventId}`,  
            "Profile Edit Approved": `/logistic/profile/${localStorage?.getItem('_id')}`,
            "Profile Edit Rejected": `/logistic/profile/${localStorage?.getItem('_id')}`,
        };
  
        const route = eventRoutes[event] || '/logistic/';
  
        setIsNotificationOpen(false);
        navigate(route);
  
        if (event === 'enquiry') {
            updateStatusApi(notificationId);
        }
    };
  
  
    const handleNotificationNavigate = () => {
        setIsNotificationOpen(false)
        navigate(`/logistic/notification-list`)
    }

  return (
    <>
      {/* Header Bar Code start from here  */}
      <div className={styles.nav_container}>
          <div className={styles.nav_wrapper}>
              <div className={styles.nav_img}>
                  <Link to='/logistic/'>
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
                    {/*   <Link to='/logistic/invoice/pending'>
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
                      </Link> */}


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
                                                  const words = data?.message?.split(' ');
                                                  const heading = words.slice(0, 2).join(' ');
                                                  const content = words.slice(2).join(' ');
                                                 
                                                  return (
                                                      <div
                                                          className={styles.noti_profile_wrapper}
                                                          onClick={() =>{
                                                            navigate('/logistic/order/active');
                                                            setIsNotificationOpen(false);
                                                          }
                                                          }
                                                          key={i}
                                                      >
                                                          <div className={styles.noti_profile_text}>
                                                              <div className={styles.noti_profile_section}>
                                                              <span className={styles.noti_heading}>{heading}</span>
                                                              <span className={styles.noti_content}>{content}
                                                              </span>
                                                              <span className={styles.noti_time}>{moment(data?.createdAt).fromNow()}</span>
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
                                              {localStorage?.getItem('logistic_name') || "Medhub Global"}
                                          </Link>
                                      </div>
                                      <div className={styles.profile_wrapper_mid}>
                                          <div>
                                              
                                                  <div className={styles.profile_text} onMouseDown={handleProfileClick}>Profile</div>
                                              
                                          </div>

                                          
                                      </div>

                                      <div
                                          className={styles.profile_sign_out}
                                          
                                          onMouseDown={handleSignOutClick}
                                      >
                                          Sign out
                                      </div>
                                  </div>
                              </div>
                          )}
                          
                      </div>
                      <div ref={profileRef}>
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
                  <Link to="/logistic/" className={styles.sidebar_text} activeclassname={styles.active}>
                      <div className={styles.icon}><HomeOutlinedIcon style={{ color: '#448BFF' }} /></div>
                      <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Dashboard</div>
                  </Link>

     {/*              <Link to="/logistic/enquiry-purchase-orders" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
                      <div className={styles.icon}><ManageSearchIcon style={{ color: '#20c997', fontSize: '22px' }} /></div>
                      <div style={{ display: isOpen ? "block" : "none" }} className={styles.sidebar_text}>Enquiry</div>
                  </Link> */}
                  <Link to="/logistic/order/active" className={`${styles.sidebar_text} ${styles.desktop_order_btn}`} activeclassname={styles.active}>
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
              </ div > : ''
          }
          <main>
              <Outlet/>
          </main>
      </ div >

      {/* Mobile Sidebar code start from here */}
      
      <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
      </Drawer>
      

    </>
  )
}

export default LogisticsSidebar