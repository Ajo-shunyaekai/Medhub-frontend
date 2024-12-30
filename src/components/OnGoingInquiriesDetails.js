import React, { useEffect, useState } from "react";
import "../style/ongoingdetails.css";
import OnGoingList from "./OnGoingList";
import { Link, useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../api/Requests";
import moment from "moment-timezone";
import ProductList from "./details/ProductList";
import { toast } from "react-toastify";
import { apiRequests } from "../api";

const OnGoingInquiriesDetails = () => {
  const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage.getItem("buyer_id");

  const { inquiryId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [inquiryDetails, setInquiryDetails] = useState();
  const [acceptedItems, setAcceptedItems] = useState([]);
  const [rejectedItems, setRejectedItems] = useState([]);

  const email = inquiryDetails?.supplier?.contact_person_email;
  const subject = `Inquiry about Inquiry ${inquiryDetails?.enquiry_id || "unknown"
    }`;
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  const dateToDisplay = 
  inquiryDetails?.quotation_items_created_at || 
  inquiryDetails?.quotation_items_updated_at || 
  inquiryDetails?.created_at || 
  moment().toISOString();

  const formattedDate = moment(dateToDisplay)
    .tz("Asia/Kolkata")
    .format("DD/MM/YYYY HH:mm:ss");

  useEffect(() => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      enquiry_id: inquiryId,
    };
    const fetchData = async () => {
      // postRequestWithToken("buyer/enquiry/enquiry-details", obj, async (response) => {
      //   if (response.code === 200) {
      //     setInquiryDetails(response?.result);
      //     const acceptedItems = [];
      //     const rejectedItems = [];

      //     response?.result?.quotation_items?.forEach((item) => {
      //       if (item.status === "accepted") {
      //         acceptedItems.push(item);
      //       } else if (item.status === "rejected") {
      //         rejectedItems.push(item);
      //       }
      //     });
      //     setAcceptedItems(acceptedItems);
      //     setRejectedItems(rejectedItems);

      //     sessionStorage.setItem("acceptedQuotationItems", JSON.stringify(acceptedItems));
      //     sessionStorage.setItem("rejectedQuotationItems", JSON.stringify(rejectedItems));
      //   } else {
      //     console.log("error in order list api", response);
      //   }
      // }
      // );
                 
      // const response = await apiRequests.postRequest(`enquiry/get-specific-enquiry-details/${inquiryId}`, obj);
      // if (response?.code !== 200) {
      //     console.log('error in order list api', response);
      //     return;
      // }
      // setInquiryDetails(response?.result);
      // const acceptedItems = [];
      // const rejectedItems = [];

      // response?.result?.quotation_items?.forEach((item) => {
      //   if (item.status === "accepted") {
      //     acceptedItems.push(item);
      //   } else if (item.status === "rejected") {
      //     rejectedItems.push(item);
      //   }
      // });
      // setAcceptedItems(acceptedItems);
      // setRejectedItems(rejectedItems);

      // sessionStorage.setItem("acceptedQuotationItems", JSON.stringify(acceptedItems));
      // sessionStorage.setItem("rejectedQuotationItems", JSON.stringify(rejectedItems));
      postRequestWithToken(`enquiry/get-specific-enquiry-details/${inquiryId}`, obj, async (response) => {
        if (response.code === 200) {
          setInquiryDetails(response?.result);
          const acceptedItems = [];
          const rejectedItems = [];

          response?.result?.quotation_items?.forEach((item) => {
            if (item.status === "accepted") {
              acceptedItems.push(item);
            } else if (item.status === "rejected") {
              rejectedItems.push(item);
            }
          });
          setAcceptedItems(acceptedItems);
          setRejectedItems(rejectedItems);

          sessionStorage.setItem("acceptedQuotationItems", JSON.stringify(acceptedItems));
          sessionStorage.setItem("rejectedQuotationItems", JSON.stringify(rejectedItems));
        } else {
          console.log("error in order list api", response);
        }
      }
      );
    }
    fetchData()
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("acceptedQuotationItems");
      sessionStorage.removeItem("rejectedQuotationItems");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleAccept = (item, status) => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      enquiry_id: inquiryId,
      item_id: item._id,
      new_status: status,
    };
    postRequestWithToken("buyer/enquiry/accept-reject-quotation", obj, async (response) => {
      if (response.code === 200) {
        toast(response.message, { type: "success" });
        const fetchData = async () => {
          // postRequestWithToken("buyer/enquiry/enquiry-details", obj, async (response) => {
          // if (response.code === 200) {
          //   setInquiryDetails(response?.result);
          //   setAcceptedItems((prevItems) => {
          //     const updatedItems = [...prevItems, item];
          //     sessionStorage.setItem("acceptedQuotationItems", JSON.stringify(updatedItems));
          //     return updatedItems;
          //   });
          //   setRejectedItems((prevItems) => {
          //     const updatedItems = prevItems.filter(
          //       (rejItem) => rejItem._id !== item._id
          //     );
          //     sessionStorage.setItem("rejectedQuotationItems", JSON.stringify(updatedItems)
          //     );
          //     return updatedItems;
          //   });
          // } else {
          //   console.log("error in order list api", response);
          // }
          // }
          // );
                 
          // const response = await apiRequests.postRequest(`enquiry/get-specific-enquiry-details/${inquiryId}`, obj);
          // if (response?.code !== 200) {
          //     console.log('error in order list api', response);
          //     return;
          // }
          // setInquiryDetails(response?.result);
          // setAcceptedItems((prevItems) => {
          //   const updatedItems = [...prevItems, item];
          //   sessionStorage.setItem("acceptedQuotationItems", JSON.stringify(updatedItems));
          //   return updatedItems;
          // });
          // setRejectedItems((prevItems) => {
          //   const updatedItems = prevItems.filter(
          //     (rejItem) => rejItem._id !== item._id
          //   );
          //   sessionStorage.setItem("rejectedQuotationItems", JSON.stringify(updatedItems)
          //   );
          //   return updatedItems;
          // });
          postRequestWithToken(`enquiry/get-specific-enquiry-details/${inquiryId}`, obj, async (response) => {
          if (response.code === 200) {
            setInquiryDetails(response?.result);
            setAcceptedItems((prevItems) => {
              const updatedItems = [...prevItems, item];
              sessionStorage.setItem("acceptedQuotationItems", JSON.stringify(updatedItems));
              return updatedItems;
            });
            setRejectedItems((prevItems) => {
              const updatedItems = prevItems.filter(
                (rejItem) => rejItem._id !== item._id
              );
              sessionStorage.setItem("rejectedQuotationItems", JSON.stringify(updatedItems)
              );
              return updatedItems;
            });
          } else {
            console.log("error in order list api", response);
          }
          }
          );
        }

        fetchData()
      } else {
        toast(response.message, { type: "error" });
        console.log("error in accept-reject-quotation api", response);
      }
    }
    );
  };

  const handleReject = (item, status) => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    setLoading(true)
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      enquiry_id: inquiryId,
      item_id: item._id,
      new_status: status,
    };
    postRequestWithToken(
      "buyer/enquiry/accept-reject-quotation",
      obj,
      async (response) => {
        if (response.code === 200) {
          toast(response.message, { type: "success" });
          const fetchData = async ()=>{
            // postRequestWithToken(
            // "buyer/enquiry/enquiry-details",
            // obj,
            // async (response) => {
            //   if (response.code === 200) {
            //     setInquiryDetails(response?.result);
            //     setRejectedItems((prevItems) => {
            //       const updatedItems = [...prevItems, item];
            //       sessionStorage.setItem(
            //         "rejectedQuotationItems",
            //         JSON.stringify(updatedItems)
            //       );
            //       return updatedItems;
            //     });
            //     setAcceptedItems((prevItems) => {
            //       const updatedItems = prevItems.filter(
            //         (accItem) => accItem._id !== item._id
            //       );
            //       sessionStorage.setItem(
            //         "acceptedQuotationItems",
            //         JSON.stringify(updatedItems)
            //       );
            //       return updatedItems;
            //     });
            //   } else {
            //     console.log("error in order list api", response);
            //   }
            // }
            // );           
            // const response = await apiRequests.postRequest(`enquiry/get-specific-enquiry-details/${inquiryId}`, obj);
            // if (response?.code !== 200) {
              //     console.log('error in order list api', response);
              //     return;
              // }
              // setInquiryDetails(response?.result);
              // setRejectedItems((prevItems) => {
                //   const updatedItems = [...prevItems, item];
                //   sessionStorage.setItem(
                  //     "rejectedQuotationItems",
                  //     JSON.stringify(updatedItems)
                  //   );
                  //   return updatedItems;
                  // });
                  // setAcceptedItems((prevItems) => {
                    //   const updatedItems = prevItems.filter(
                      //     (accItem) => accItem._id !== item._id
                      //   );
                      //   sessionStorage.setItem(
                        //     "acceptedQuotationItems",
                        //     JSON.stringify(updatedItems)
                        //   );
                        //   return updatedItems;
                        // });
            postRequestWithToken(
            `enquiry/get-specific-enquiry-details/${inquiryId}`,
            obj,
            async (response) => {
              if (response.code === 200) {
                setInquiryDetails(response?.result);
                setRejectedItems((prevItems) => {
                  const updatedItems = [...prevItems, item];
                  sessionStorage.setItem(
                    "rejectedQuotationItems",
                    JSON.stringify(updatedItems)
                  );
                  return updatedItems;
                });
                setAcceptedItems((prevItems) => {
                  const updatedItems = prevItems.filter(
                    (accItem) => accItem._id !== item._id
                  );
                  sessionStorage.setItem(
                    "acceptedQuotationItems",
                    JSON.stringify(updatedItems)
                  );
                  return updatedItems;
                });
              } else {
                console.log("error in order list api", response);
              }
            }
            );           
          }
          fetchData()
        } else {
          toast(response.message, { type: "error" });
          console.log("error in accept-reject-quotation api", response);
        }
      }
    );
  };

  const hasPendingItems = inquiryDetails?.items?.some(item => item.status === 'pending');

  const handleCancel = () => {
    navigate(`/buyer/cancel-inquiry-list/${inquiryId}`)
  }

  // const handleCreatePOClick = () => {
  //   if (acceptedItems.length > 0) {
  //     navigate(`/buyer/Create-PO/${inquiryId}`);
  //   } else {
  //     toast('Please Accept Atleast One Item Before Creating Purchase Order.', {type: 'error'})
  //   }
  // };

  const handleCreatePOClick = () => {
    const totalProcessedItems = acceptedItems.length + rejectedItems.length;
    const totalQuotationItems = inquiryDetails?.quotation_items?.length || 0;
  
    if (totalProcessedItems === totalQuotationItems) {
      if (acceptedItems.length > 0) {
        navigate(`/buyer/Create-PO/${inquiryId}`);
      } else {
        toast('Please Accept At Least One Item Before Creating Purchase Order.', { type: 'error' });
      }
    } else {
      toast('Please Accept or Reject All Quotation Items Before Creating Purchase Order.', { type: 'error' });
    }
  };
  

  return (
    <div className="ongoing-details-container">
      <div className="ongoing-details-conatiner-heading">
        Inquiry ID: <span>{inquiryDetails?.enquiry_id}</span>
      </div>

      <div className="ongoing-details-section">
        <div className="ongoing-details-left-section">
          <div className="ongoing-details-top-inner-section">
            <div className="ongoing-details-left-inner-section-container">
              <div className="ongoing-details-left-top-containers">
                <Link
                  to={`/buyer/supplier-details/${inquiryDetails?.supplier?.supplier_id}`}
                >
                  <div className="ongoing-details-top-order-cont">
                    <div className="ongoing-details-left-top-main-heading">
                      {" "}
                      Supplier Name
                    </div>
                    <div className="ongoing-details-left-top-main-contents">
                      {" "}
                      {inquiryDetails?.supplier?.supplier_name}
                    </div>
                  </div>
                </Link>
                <div className="ongoing-details-top-order-cont">
                  <div className="ongoing-details-left-top-main-heading">
                    Type
                  </div>
                  <div className="ongoing-details-left-top-main-contents">
                    {inquiryDetails?.supplier?.supplier_type}
                  </div>
                </div>
                <div className="ongoing-details-top-order-cont">
                  <div className="ongoing-details-left-top-main-heading">
                    {" "}
                    Date & Time
                  </div>
                  <div className="ongoing-details-left-top-main-contents">
                    {/* {moment(inquiryDetails?.created_at)
                      .tz("Asia/Kolkata")
                      .format("DD/MM/YYYY HH:mm:ss")} */}
                       {formattedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Start the return enquiry section */}
      {inquiryDetails?.quotation_items?.length > 0 ? (
        <div className="ongoing-details-assign-driver-section">
          <ProductList
            inquiryDetails={inquiryDetails}
            quotationItems={inquiryDetails?.quotation_items}
            handleAccept={handleAccept}
            handleReject={handleReject}
          />
        </div>
      ) : (
        ""
      )}

      {inquiryDetails?.quotation_items?.length > 0 &&
        inquiryDetails?.payment_terms?.length > 0 ? (
        <div className="ongoing-details-payment-pending-container">
          <div className="ongoing-details-paymen-pending-right-section">
            <div className="ongoing-details-payment-first-terms-containers">
              <div class="table-assign-driver-heading">Payment Terms</div>
              <div className="ongoing-details-payment-first-terms-text">
                <ul className="ongoing-details-payment-ul-section">
                  {inquiryDetails?.payment_terms?.map((terms, i) => {
                    return (
                      <li className="ongoing-details-payment-li-section">
                        {terms}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* start the assign driver section */}
      <div className="ongoing-details-assign-driver-section">
        <OnGoingList
          items={inquiryDetails?.items}
          inquiryDetails={inquiryDetails}
        />
      </div>
      {/* end the assign driver section */}
      {/* start the button container */}
      <div className="ongoing-enguiries-details-button-sec">
        {hasPendingItems && (
          <div className="ongoing-enguiries-details-buttons" onClick={handleCancel}>
            Cancel Inquiries
          </div>
        )}
      </div>
      {/* end the button container */}

      {inquiryDetails?.enquiry_status === 'Quotation submitted' ? (
        <div className="pending-order-button-section">

          <div className="pending-order-create-order"
          onClick={handleCreatePOClick}
          style={{ cursor: 'pointer' }}
          >
                Create Purchase Order
              </div>
          <a href={mailtoLink} className="pending-order-contact-order">
            Contact Supplier
          </a>
        </div>
      ) : null}
      
{/* 
{inquiryDetails?.quotation_items?.some(item => item.status === 'pending') ? (
    <div className="pending-order-button-section">
        <div className="pending-order-create-order"
            onClick={handleCreatePOClick}
            style={{ cursor: 'pointer' }}
        >
            Create Purchase Order
        </div>
        <a href={mailtoLink} className="pending-order-contact-order">
            Contact Supplier
        </a>
    </div>
) : null} */}




    </div>
  );
};

export default OnGoingInquiriesDetails;
