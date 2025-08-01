import React, { useEffect, useState } from "react";
import "./sendinquiry.css";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import Pagination from "react-js-pagination";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { postRequestWithToken } from "../../../../api/Requests";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { updateInquiryCartCount } from "../../../../redux/reducers/inquirySlice";
import Loader from "../../SharedComponents/Loader/Loader";
import ProductImage from "../../../assets/images/productImage.png";
import { extractLast13WithExtension } from "../../../../utils/helper";


const SendInquiry = ({ socket }) => {
  const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage?.getItem("buyer_id");
  const buyerNameSessionStorage = localStorage?.getItem("buyer_name");
  const buyerNameLocalStorage = localStorage?.getItem("buyer_name");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const itemsPerPage = 3;
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedState, setCheckedState] = useState({});
  const [list, setList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [cartCount, setCartCount] = useState(
    localStorage?.getItem("list_count")
  );
  const [loading, setLoading] = useState(true);

  const isImageExtension = (filename) => {
    return /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(filename);
  };

  const isValidHttpUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleCheckboxChange = (id) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRemoveItem = (listId, itemId) => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }

    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      list_id: listId,
      item_id: [itemId],
      pageNo: currentPage,
      pageSize: itemsPerPage,
    };

    postRequestWithToken("buyer/delete-list-item", obj, async (response) => {
      if (response?.code === 200) {
        localStorage?.setItem("list_count", response.result.listCount);
        dispatch(updateInquiryCartCount(response.result.listCount));
        toast(response.message, { type: "success" });
        setCheckedState({});
        setCurrentPage(1);
        setRefreshTrigger((prev) => !prev);
      } else {
        toast(response.message, { type: "error" });
      }
    });
  };

  const groupedProducts = groupBySupplier(list);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }

    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      pageNo: currentPage,
      pageSize: itemsPerPage,
    };

    setLoading(true);
    postRequestWithToken("buyer/show-list", obj, async (response) => {
      if (response?.code === 200) {
        setList(response?.result?.data);
        setTotalItems(response?.result?.totalItems);
        localStorage?.setItem("list_count", response.result.totalItems);
        dispatch(updateInquiryCartCount(response.result.totalItems));
        const initialCheckedState = {};
        response?.result?.data.forEach((supplier) => {
          supplier.item_details.forEach((item) => {
            initialCheckedState[item._id] = true;
          });
        });
        setCheckedState(initialCheckedState);
      } else {
        toast(response.message, { type: "error" });
      }
      setLoading(false);
    });
  }, [currentPage, refreshTrigger]);

  const handleSendEnquiry = () => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }

    const selectedItems = [];
    Object.entries(groupedProducts).forEach(([supplierName, supplierData]) => {
      const selectedItemDetails = supplierData.items.filter(
        (item) => checkedState[item?._id]
      );
      if (selectedItemDetails.length > 0) {
        selectedItems.push({
          supplier_id: supplierData.supplier_details.supplier_id || "",
          supplier_name: supplierData.supplier_details.supplier_name || "",
          supplier_email:
            supplierData.supplier_details.contact_person_email ||
            supplierData.supplier_details.supplier_email ||
            "",
          supplier_contact_email:
            supplierData.supplier_details.contact_person_email || "",
          list_id: supplierData.list_id || "",
          item_details: selectedItemDetails.map((item) => ({
            item_id: item._id || "",
            product_id: item.product_id || "",
            unit_price: item.unit_price || "",
            unit_tax: item.unit_tax || "",
            quantity_required: item?.quantity_required || "",
            est_delivery_days: item.est_delivery_days || "",
            target_price: item.target_price || "",
            total_quantity: item.total_quantity || 0,
          })),
        });
      }
    });

    const enquiryPayload = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      buyer_name: buyerNameSessionStorage || buyerNameLocalStorage,
      items: selectedItems,
    };

    // for (const supplier of enquiryPayload.items) {
    //   for (const item of supplier.item_details) {
    //     if (parseInt(item.total_quantity, 10) <= 50) {
    //       return toast(`Selected Item is out of stock`, { type: "error" });
    //     }
    //   }
    // }
    if (enquiryPayload.items.length === 0) {
      return toast("Select Atleast One Item", { type: "error" });
    }
    setButtonLoading(true);
    postRequestWithToken(
      "buyer/send-enquiry",
      enquiryPayload,
      async (response) => {
        if (response?.code === 200) {
          enquiryPayload.items.forEach((item) => {
            socket.emit("sendInquiry", {
              supplierId: item.supplier_id,
              message: "You have a new enquiry from a buyer!",
              link: process.env.REACT_APP_PUBLIC_URL,
            });
          });
          setCheckedState({});
          setCurrentPage(1);
          setRefreshTrigger((prev) => !prev);
          navigate("/buyer/thank-you", { state: { from: "order" } });
          localStorage?.setItem("list_count", response.result.listCount);
          dispatch(updateInquiryCartCount(response.result.listCount));
        } else {
          toast(response.message, { type: "error" });
        }
        setButtonLoading(false);
      }
    );
  };

  return (
    <div className="send-enquiry-container">
      <div className="send-enquiry-heading">Send Enquiry</div>
      <div className="send-enquiry-main-section">
        <div className="send-enquiry-inner-section">
          {loading ? (
            <Loader />
          ) : (
            <>
              {list.length > 0 && (
                <div className="send-enquiry-upper-section">
                  <div className="send-enquiry-upper-left-sec">
                    <span className="send-enquiry-upper-left-head">
                      Your Enquiries
                    </span>
                  </div>
                  <div className="send-enquiry-upper-right-sec">
                    <div className="send-enquiry-upper-right-content">
                      <span className="send-enquiry-upper-right-total">
                        Total:
                      </span>
                      <span className="send-enquiry-upper-right-number">
                        {totalItems} Enquiries
                      </span>
                    </div>
                    <div
                      className="send-enquiry-upper-right-button-sec"
                      onClick={handleSendEnquiry}
                    >
                      <span className="send-enquiry-upper-right-button">
                        {buttonLoading ? (
                          <>
                            <ClipLoader
                              size={20}
                              color={"#ffffff"}
                              loading={buttonLoading}
                            />
                            Sending...
                          </>
                        ) : (
                          "Send Enquiry"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="send-enquiry-container-inner-container">
                {list.length === 0 ? (
                  <div className="no-data-found">No Data Found</div>
                ) : (
                  Object.entries(groupedProducts).map(
                    ([supplierName, supplierData]) => (
                      <div
                        key={supplierData?.list_id}
                        className="send-enquiry-supplier-list-container"
                      >
                        <div className="send-enquiry-supplier-list-upper-section">
                          <div className="send-enquiry-supplier-list-heading">
                            Supplier Name:
                          </div>
                          <div className="send-enquiry-supplier-list-text">
                            {supplierName}
                          </div>
                        </div>
                        
                      {supplierData.items.map((product) => {
                        // Enhanced image logic
                        const defaultImage = ProductImage;
                        const serverUrl = process.env.REACT_APP_SERVER_URL;

                        const imageRaw = product?.medicine_image;
                        let imageName = "";

                        if (Array.isArray(imageRaw)) {
                          imageName = imageRaw?.[0];
                        } else if (typeof imageRaw === "object" && imageRaw !== null) {
                          const firstKey = Object.keys(imageRaw || {})?.[0];
                          imageName = imageRaw?.[firstKey]?.[0];
                        }

                        let imageSrc = defaultImage;
                        const isFullUrl = isValidHttpUrl(imageName);

                        if (imageName) {
                          if (isFullUrl && isImageExtension(imageName)) {
                            imageSrc = imageName;
                          } else if (isImageExtension(imageName)) {
                            imageSrc = `${serverUrl}uploads/products/${imageName}`;
                          }
                        }

                        return (
                          <div
                            key={product?._id}
                            className="send-enquiry-inner-bottom-section-container"
                          >
                            <div className="send-enquiry-inner-checkbox">
                              <label className="custom-checkbox-label">
                                <input
                                  type="checkbox"
                                  className="custom-checkbox"
                                  checked={checkedState[product?._id] || false}
                                  onChange={() => handleCheckboxChange(product?._id)}
                                />
                                <span className="custom-checkbox-checkmark"></span>
                              </label>
                            </div>
                            <div className="send-enquiry-inner-image">
                              <img
                                src={imageSrc}
                                alt={extractLast13WithExtension(imageName) || "ProductImg"}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = defaultImage;
                                }}
                              />
                            </div>
                            <div className="send-enquiry-inner-content">
                              <div className="send-enquiry-inner-top-container">
                                <div className="send-enquiry-inner-top-head-section">
                                  <span className="send-enquiry-inner-top-heading">
                                    {product?.medicine_name}
                                  </span>
                                </div>
                              </div>
                              <div className="send-enquiry-inner-bottom-section">
                                <div className="send-enquiry-inner-bottom-container">
                                  <span className="send-enquiry-inner-bootom-head">
                                    Quantity Required
                                  </span>
                                  <span className="send-enquiry-inner-bootom-text">
                                    {product?.quantity_required}
                                  </span>
                                </div>
                                <div className="send-enquiry-inner-bottom-container">
                                  <span className="send-enquiry-inner-bootom-head">
                                    Cost Per Product
                                  </span>
                                  <span className="send-enquiry-inner-bootom-text">
                                    {product?.unit_price} USD
                                  </span>
                                </div>
                                <div className="send-enquiry-inner-bottom-container">
                                  <span className="send-enquiry-inner-bootom-head">
                                    Target Price
                                  </span>
                                  <span className="send-enquiry-inner-bootom-text">
                                    {product?.target_price} USD
                                  </span>
                                </div>
                                <div className="send-enquiry-inner-bottom-container">
                                  <span className="send-enquiry-inner-bootom-head">
                                    Est. Shipping Time
                                  </span>
                                  <span className="send-enquiry-inner-bootom-text">
                                    {product?.est_delivery_days
                                      ? product.est_delivery_days.toLowerCase().includes("days")
                                        ? product.est_delivery_days.replace(/days/i, "Days")
                                        : `${product.est_delivery_days} Days`
                                      : "TBC- based on quantity"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div
                              className="send-enquiry-remove-section"
                              title="Remove Product"
                            >
                              <HighlightOffOutlinedIcon
                                className="send-enquiry-clear-icon"
                                onClick={() =>
                                  handleRemoveItem(supplierData?.list_id, product?._id)
                                }
                              />
                            </div>
                          </div>
                        );
                      })}

                      </div>
                    )
                  )
                )}
              </div>
              {list?.length > 0 && (
                <div className="pagi-container">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={totalItems}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={
                      <KeyboardDoubleArrowLeftIcon
                        style={{ fontSize: "15px" }}
                      />
                    }
                    nextPageText={
                      <KeyboardDoubleArrowRightIcon
                        style={{ fontSize: "15px" }}
                      />
                    }
                    hideFirstLastPages={true}
                  />
                  <div className="pagi-total">Total Items: {totalItems}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const groupBySupplier = (list) => {
  return list?.reduce((acc, supplier) => {
    const supplierName = supplier?.supplier_details?.supplier_name;
    if (!acc[supplierName]) {
      acc[supplierName] = {
        list_id: supplier?.list_id,
        supplier_details: supplier?.supplier_details,
        items: [],
      };
    }
    acc[supplierName].items = [
      ...acc[supplierName].items,
      ...supplier?.item_details,
    ];
    return acc;
  }, {});
};

export default SendInquiry;
