import React, { useEffect, useState } from 'react';
import './sendinquiry.css';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../../../../api/Requests';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { updateInquiryCartCount } from '../../../../redux/reducers/inquirySlice';

const SendInquiry = ({socket}) => {
  const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage.getItem("buyer_id");
  const buyerNameSessionStorage = sessionStorage.getItem("buyer_name");
  const buyerNameLocalStorage = localStorage.getItem("buyer_name");
  const navigate = useNavigate();
  const dispatch = useDispatch()
  
  const itemsPerPage = 3;
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedState, setCheckedState] = useState({});
  const [list, setList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [cartCount, setCartCount] = useState(sessionStorage.getItem("list_count"))

  const handleCheckboxChange = (id) => {
    setCheckedState(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRemoveItem = (listId, itemId) => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }

    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      list_id: listId,
      item_id: [itemId],
      pageNo: currentPage,
      pageSize: itemsPerPage
    };

    postRequestWithToken('buyer/delete-list-item', obj, async (response) => {
      if (response.code === 200) {
        // setCartCount(response.result.listCount)
        sessionStorage.setItem('list_count', response.result.listCount)
        dispatch(updateInquiryCartCount(response.result.listCount))
        toast(response.message, { type: "success" });
        setCheckedState({});
        setCurrentPage(1);
        setRefreshTrigger(prev => !prev);
      } else {
        toast(response.message, { type: "error" });
        console.log('error in order list api', response);
      }
    });
  };

  const groupedProducts = groupBySupplier(list);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }

    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      pageNo: currentPage,
      pageSize: itemsPerPage
    };

    postRequestWithToken('buyer/show-list', obj, async (response) => {
      if (response.code === 200) {
        setList(response?.result?.data);
        setTotalItems(response?.result?.totalItems);

        // Set initial checked state
        const initialCheckedState = {};
        response?.result?.data.forEach(supplier => {
          supplier.item_details.forEach(item => {
            initialCheckedState[item._id] = true;
          });
        });
        setCheckedState(initialCheckedState);

      } else {
        toast(response.message, { type: "error" });
        console.log('error in order list api', response);
      }
    });
  }, [currentPage, refreshTrigger]);

  const handleSendEnquiry = () => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    
    
    const selectedItems = [];
    Object.entries(groupedProducts).forEach(([supplierName, supplierData]) => {
      const selectedItemDetails = supplierData.items.filter(item => checkedState[item?._id]);
      if (selectedItemDetails.length > 0) {
        selectedItems.push({
          supplier_id            : supplierData.supplier_details.supplier_id || "",
          supplier_name          : supplierData.supplier_details.supplier_name || "",
          supplier_email         : supplierData.supplier_details.contact_person_email || supplierData.supplier_details.supplier_email || "",
          supplier_contact_email : supplierData.supplier_details.contact_person_email || "",
          list_id                : supplierData.list_id || "",
          item_details           : selectedItemDetails.map(item => ({
            item_id              : item._id || "",
            medicine_id          : item.medicine_id || "",
            unit_price           : item.unit_price || "",
            quantity_required    : item.quantity_required || "",
            est_delivery_days    : item.est_delivery_days || "",
            target_price         : item.target_price || "",
            total_quantity: item.total_quantity || 0
          }))
        });
      } 
    });
// console.log('suplierId',supplier);

    const enquiryPayload = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      buyer_name : buyerNameSessionStorage || buyerNameLocalStorage,
      items: selectedItems
    };

    // Validation: Check if total_quantity is greater than 100
  for (const supplier of enquiryPayload.items) {
    for (const item of supplier.item_details) {
      if (parseInt(item.total_quantity, 10) <= 50) {
        return toast(`Selected Item is out of stock`, { type: "error" });
      }
    }
  }
    if(enquiryPayload.items.length === 0) {
      return toast('Select Atleast One Item', { type: "error" });
    }
    setButtonLoading(true)
    postRequestWithToken('buyer/send-enquiry', enquiryPayload, async (response) => {
      if (response.code === 200) {
        // toast(response.message, { type: "success" });
        enquiryPayload.items.forEach(item => {
          socket.emit('sendInquiry', {
              supplierId: item.supplier_id, // The supplier to be notified
              message: 'You have a new inquiry from a buyer!',
              link : process.env.REACT_APP_PUBLIC_URL
              // send other details if needed
          });
      });
        setCheckedState({});
        setCurrentPage(1);
        setRefreshTrigger(prev => !prev);
        
        // enquiryPayload.items.forEach(item => {
        //   socket.emit('sendInquiry', {
        //     supplierId: item.supplier_id, // The supplier to be notified
        //     message: 'You have a new inquiry from a buyer!',
        //     // send other details if needed
        //   });
        // });
        navigate("/buyer/thank-you", { state: { from: 'order' } });
        sessionStorage.setItem('list_count', response.result.listCount)
        dispatch(updateInquiryCartCount(response.result.listCount))
      
      } else {
        toast(response.message, { type: "error" });
        console.log('error in send-enquiry api', response);
      }
      setButtonLoading(false)
    });
  }

  return (
    <div className='send-enquiry-container'>
      <div className='send-enquiry-heading'>Send Inquiry</div>
      <div className='send-enquiry-main-section'>
        <div className='send-enquiry-inner-section'>
        {list.length > 0 && (
          <div className='send-enquiry-upper-section'>
            <div className='send-enquiry-upper-left-sec'>
              <span className='send-enquiry-upper-left-head'>Your Inquiries</span>
            </div>
            
            <div className='send-enquiry-upper-right-sec'>
              <div className='send-enquiry-upper-right-content'>
                <span className='send-enquiry-upper-right-total'>Total:</span>
                <span className='send-enquiry-upper-right-number'>{totalItems} Inquiries</span>
              </div>
              {/* <div className='send-enquiry-upper-right-button-sec' onClick={handleSendEnquiry}>
                <span className='send-enquiry-upper-right-button'>Send Inquiry</span>
              </div> */}
               <div className='send-enquiry-upper-right-button-sec' onClick={handleSendEnquiry}>
      <span className='send-enquiry-upper-right-button'>
        {buttonLoading ? (
          <>
            <ClipLoader size={20} color={"#ffffff"} loading={buttonLoading} />
            Sending...
          </>
        ) : (
          'Send Inquiry'
        )}
      </span>
    </div>
            </div>
         
          </div>
           )}
          <div className='send-enquiry-container-inner-container'>
            {list.length === 0 ? (
              <div className='no-data-found'>
                No Data Found
              </div>
            ) : (
              Object.entries(groupedProducts).map(([supplierName, supplierData]) => (
                <div key={supplierData?.list_id} className='send-enquiry-supplier-list-container'>
                  <div className='send-enquiry-supplier-list-upper-section'>
                    <div className='send-enquiry-supplier-list-heading'>Supplier Name:</div>
                    <div className='send-enquiry-supplier-list-text'>{supplierName}</div>
                  </div>
                  {supplierData.items.map(product => (
                    <div key={product?._id} className='send-enquiry-inner-bottom-section-container'>
                      <div className='send-enquiry-inner-checkbox'>
                        <label className="custom-checkbox-label">
                          <input
                            type='checkbox'
                            className='custom-checkbox'
                            checked={checkedState[product?._id] || false}
                            onChange={() => handleCheckboxChange(product?._id)}
                          />
                          <span className="custom-checkbox-checkmark"></span>
                        </label>
                      </div>
                      <div className='send-enquiry-inner-image'>
                        <img src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${product?.medicine_image[0]}`} alt='Product' />
                      </div>
                      <div className='send-enquiry-inner-content'>
                        <div className='send-enquiry-inner-top-container'>
                          <div className='send-enquiry-inner-top-head-section'>
                            <span className='send-enquiry-inner-top-heading'>{product?.medicine_name}</span>
                          </div>
                          <div className='send-enquiry-inner-top-text-section'>
                            <span className='send-enquiry-inner-top-supplier'>{supplierData?.supplier_details?.supplier_name}</span>
                          </div>
                        </div>
                        <div className='send-enquiry-inner-bottom-section'>
                        <div className='send-enquiry-inner-bottom-container'>
                            <span className='send-enquiry-inner-bootom-head'>Quantity Required:</span>
                            <span className='send-enquiry-inner-bootom-text'>{product?.quantity_required} </span>
                          </div>
                          <div className='send-enquiry-inner-bottom-container'>
                            <span className='send-enquiry-inner-bootom-head'>Unit Price:</span>
                            <span className='send-enquiry-inner-bootom-text'>{product?.unit_price} USD</span>
                          </div>
                          <div className='send-enquiry-inner-bottom-container'>
                            <span className='send-enquiry-inner-bootom-head'>Target Price:</span>
                            <span className='send-enquiry-inner-bootom-text'>{product?.target_price} USD</span>
                          </div>
                          <div className='send-enquiry-inner-bottom-container'>
                            <span className='send-enquiry-inner-bootom-head'>Est. Delivery Time:</span>
                            <span className='send-enquiry-inner-bootom-text'>
                              {/* {product?.est_delivery_days}  */}
                              {product?.est_delivery_days 
                                  ? product.est_delivery_days.toLowerCase().includes('days') 
                                      ? product.est_delivery_days.replace(/days/i, 'Days') 
                                      : `${product.est_delivery_days} Days` 
                                  : ''
                              }
                              </span>
                          </div>
                        </div>
                      </div>
                      <div className='send-enquiry-remove-section'>
                        <HighlightOffOutlinedIcon
                          className='send-enquiry-clear-icon'
                          onClick={() => handleRemoveItem(supplierData?.list_id, product?._id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
          {list.length > 0 && (
            <div className='pagi-container'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={totalItems}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                hideFirstLastPages={true}
              />
              <div className='pagi-total'>
                Total Items: {totalItems}
              </div>
            </div>
          )}
        </div>
      </div>
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
        items: []
      };
    }
    acc[supplierName].items = [...acc[supplierName].items, ...supplier?.item_details];
    return acc;
  }, {});
};


export default SendInquiry;