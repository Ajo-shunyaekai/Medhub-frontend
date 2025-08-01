import React, { useState } from "react";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import ProductImage from "../../../assets/images/productImage.png"; // Default image

const InquiryProductList = ({
  items,
  setQuotationItems,
  quotationItems,
  inquiryDetails,
  quotation,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [prices, setPrices] = useState({});
  const ordersPerPage = 5;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = items.slice(indexOfFirstOrder, indexOfLastOrder);

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  // Function to check if the file has a valid image extension
  const isImageExtension = (filename) => {
    return /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(filename);
  };

  // Function to validate if the URL is HTTP/HTTPS
  const isValidHttpUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAcceptChange = (itemId) => {
    const item = items.find((item) => item._id === itemId);
    const existing = quotationItems.find((q) => q._id === itemId);
    const deliveryDays = existing?.est_delivery_days || "";

    setAcceptedOrders((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
    setRejectedOrders((prev) => prev.filter((id) => id !== itemId));
    setPrices((prev) => ({ ...prev, [itemId]: "" }));

    setQuotationItems((prev) => {
      const filtered = prev.filter((order) => order._id !== itemId);
      return [
        ...filtered,
        {
          ...item,
          accepted: true,
          est_delivery_days: deliveryDays,
        },
      ];
    });
  };

  const handleRejectChange = (itemId) => {
    const item = items.find((item) => item._id === itemId);
    const existing = quotationItems.find((q) => q._id === itemId);
    const deliveryDays = existing?.est_delivery_days || "";

    setRejectedOrders((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
    setAcceptedOrders((prev) => prev.filter((id) => id !== itemId));

    setQuotationItems((prev) => {
      const filtered = prev.filter((order) => order._id !== itemId);
      return [
        ...filtered,
        {
          ...item,
          accepted: false,
          counterPrice: prices[itemId] ? parseFloat(prices[itemId]) : "",
          est_delivery_days: deliveryDays,
        },
      ];
    });
  };

  const handlePriceChange = (itemId, value) => {
    if (/^\d*\.?\d{0,9}$/.test(value)) {
      setPrices((prev) => ({ ...prev, [itemId]: value }));

      if (value.length > 0) {
        setRejectedOrders((prev) => {
          if (!prev.includes(itemId)) {
            return [...prev, itemId];
          }
          return prev;
        });

        setAcceptedOrders((prev) => prev.filter((id) => id !== itemId));
        setQuotationItems((prev) =>
          prev.map((order) =>
            order._id === itemId
              ? { ...order, counterPrice: parseFloat(value) }
              : order
          )
        );
      }
    }
  };

  const handleDeliveryDaysChange = (itemId, value) => {
    const item = items.find((item) => item._id === itemId);

    setQuotationItems((prev) => {
      const existingItem = prev.find((order) => order._id === itemId);

      if (existingItem) {
        return prev.map((order) =>
          order._id === itemId ? { ...order, est_delivery_days: value } : order
        );
      } else {
        return [...prev, { ...item, est_delivery_days: value }];
      }
    });
  };

  return (
    <div className="card-body">
      <div>
        <div className="table-assign-driver-heading">Product List</div>
      </div>
      <table className="table">
        <tbody>
          {currentOrders?.map((item, index) => {
            // Determine the image source
            const firstViewKey = Object.keys(item?.medicine_details?.general?.image || {})[0];
            const imageName = item?.medicine_details?.general?.image?.[0] || item?.medicine_details?.general?.image?.[firstViewKey]?.[0];
            let imageSrc = ProductImage;

            if (imageName) {
              const imageUrl = imageName?.startsWith("http")
                ? imageName
                : `${serverUrl}uploads/products/${imageName}`;
              if (isValidHttpUrl(imageName) && isImageExtension(imageName)) {
                imageSrc = imageName;
              } else if (isImageExtension(imageName)) {
                imageSrc = imageUrl;
              }
            }

            return (
              <tr key={index}>
                <td className="tables-td">
                  <div className="table-g-section-content">
                    <span className="table-g-driver-name">Product ID</span>
                    <span className="table-g-not-names">{item.product_id}</span>
                  </div>
                </td>
                <td className="tables-td-cont">
                  <div className="table-second-container">
                    <img
                          src={imageSrc}
                          alt="Product"
                          style={{ width: "40px", height: "40px" }}
                          onError={(e) => (e.target.src = ProductImage)} // Fallback to default image on error
                        />
                    <div className="table-g-section-content">
                      <span className="table-g-driver-name">Product Name</span>
                      <div className="table-g-not-name">
                       
                        <span>
                          {item?.medicine_details?.medicine_name ||
                            item?.medicine_details?.general?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="tables-td">
                  <div className="table-g-section-content">
                    <span className="table-g-driver-name">Quantity Req.</span>
                    <span className="table-g-not-name">
                      {item?.quantity_required}
                    </span>
                  </div>
                </td>
                <td className="tables-td">
                  <div className="table-g-section-content">
                    <span className="table-g-driver-name">Target Price</span>
                    <span className="table-g-not-name">
                      {item.target_price ? `${item.target_price} USD` : "-"}
                    </span>
                  </div>
                </td>
                {quotation.length > 0 ? (
                  <td className="tables-td">
                    <div className="table-g-section-content">
                      <span className="table-g-driver-name">Counter Price</span>
                      <span className="table-g-not-name">
                        {quotation[index]?.counter_price
                          ? quotation[index]?.counter_price
                              .toLowerCase()
                              .includes("usd")
                            ? quotation[index]?.counter_price.replace(
                                /usd/i,
                                "USD"
                              )
                            : `${quotation[index]?.counter_price} USD`
                          : "-"}
                      </span>
                    </div>
                  </td>
                ) : (
                  ""
                )}
                <td className="tables-td">
                  <div className="table-g-section-content">
                    <span className="table-g-driver-name">
                      Est. Shipping Time
                    </span>
                    {inquiryDetails?.enquiry_status?.toLowerCase() !==
                    "pending" ? (
                      <span className="table-g-not-name">
                        {inquiryDetails?.quotation_items?.[index]
                          ?.est_delivery_days
                          ? inquiryDetails?.quotation_items?.[
                              index
                            ]?.est_delivery_days
                              .toLowerCase()
                              .includes("days")
                            ? inquiryDetails?.quotation_items?.[
                                index
                              ]?.est_delivery_days.replace(/days/i, "Days")
                            : `${inquiryDetails?.quotation_items?.[index]?.est_delivery_days} Days`
                          : "TBC- based on quantity"}
                      </span>
                    ) : (
                      <input
                        className="inquiry-text-input-section"
                        type="text"
                        value={
                          quotationItems.find((q) => q._id === item._id)
                            ?.est_delivery_days || ""
                        }
                        onChange={(e) =>
                          handleDeliveryDaysChange(item._id, e.target.value)
                        }
                        maxLength="3"
                        placeholder="Enter Delivery Days"
                      />
                    )}
                  </div>
                </td>
                {inquiryDetails.enquiry_status !== "Quotation submitted" &&
                inquiryDetails.enquiry_status !== "cancelled" &&
                inquiryDetails.enquiry_status !== "PO created" ? (
                  <td className="tables-status">
                    <div className="tables-button-conatiner">
                      <label className="inquiry-label-section">
                        <input
                          className="inquiry-input-section"
                          type="checkbox"
                          checked={acceptedOrders.includes(item._id)}
                          onChange={() => handleAcceptChange(item._id)}
                        />
                        Accept
                      </label>
                      <div className="inquiry-price-container">
                        <label className="inquiry-label-section">
                          <input
                            className="inquiry-input-section"
                            type="checkbox"
                            checked={rejectedOrders.includes(item._id)}
                            onChange={() => handleRejectChange(item._id)}
                          />
                        </label>
                        <input
                          className="inquiry-text-input-section"
                          type="text"
                          value={prices[item._id] || ""}
                          onChange={(e) =>
                            handlePriceChange(item._id, e.target.value)
                          }
                          disabled={!rejectedOrders.includes(item._id)}
                          maxLength="9"
                          placeholder="Enter Counter Price"
                        />
                      </div>
                    </div>
                  </td>
                ) : (
                  <td className="tables-td">
                    <div className="table-g-section-content">
                      <span className="table-g-driver-name">Status</span>
                      <span className="table-g-not-name">
                        {item?.status
                          ?.split(" ")
                          .map(
                            (word) =>
                              word?.charAt(0)?.toUpperCase() + word?.slice(1)
                          )
                          .join(" ")}
                      </span>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <PaginationComponent
        activePage={currentPage}
        itemsCountPerPage={ordersPerPage}
        totalItemsCount={items?.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default InquiryProductList;