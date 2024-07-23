// import React, { useEffect, useState } from 'react';
// import '../style/sendinruiry.css';
// import MedicineOne from '../assest/enquiry/medicine__one.png';
// import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
// import Pagination from 'react-js-pagination';
// import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
// import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
// import { postRequest, postRequestWithToken } from '../api/Requests';

// const SendInquiry = () => {
//   const itemsPerPage = 3;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [checkedState, setCheckedState] = useState({});

//   const [list, setList] = useState([])
//   const [totalItems, setTotalItems] = useState()
//   const [products, setProducts] = useState([
//     { id: 1, name: 'Paracetamol', strength: '500 Mg', description: 'Acetaminophen, also known as N-acetyl-para-aminophenol (APAP) or paracetamol in many countries, is a non-opioid analgesic and antipyretic agent utilized for treating pain and fever.', 
//       supplier: 'Atom Pharma', unitPrice: 24, targetPrice: 20, deliveryTime: '12 Days', image: MedicineOne },
//     { id: 2, name: 'Dolo', strength: '650 Mg', description: 'Acetaminophen, also known as N-acetyl-para-aminophenol (APAP) or paracetamol in many countries, is a non-opioid analgesic and antipyretic agent utilized for treating pain and fever.', 
//       supplier: 'Atom Pharma', unitPrice: 24, targetPrice: 20, deliveryTime: '12 Days', image: MedicineOne },
//       { id: 3, name: 'Dolo', strength: '650 Mg', description: 'Acetaminophen, also known as N-acetyl-para-aminophenol (APAP) or paracetamol in many countries, is a non-opioid analgesic and antipyretic agent utilized for treating pain and fever.', 
//         supplier: 'Atom Pharma', unitPrice: 24, targetPrice: 20, deliveryTime: '12 Days', image: MedicineOne },
//     { id: 4, name: 'Migon', strength: '1000 Mg', description: 'Acetaminophen, also known as N-acetyl-para-aminophenol (APAP) or paracetamol in many countries, is a non-opioid analgesic and antipyretic agent utilized for treating pain and fever.', 
//       supplier: 'Beta Pharma', unitPrice: 24, targetPrice: 20, deliveryTime: '12 Days', image: MedicineOne },
//     { id: 5, name: 'Migon', strength: '1000 Mg', description: 'Acetaminophen, also known as N-acetyl-para-aminophenol (APAP) or paracetamol in many countries, is a non-opioid analgesic and antipyretic agent utilized for treating pain and fever.',
//        supplier: 'Beta Pharma', unitPrice: 24, targetPrice: 20, deliveryTime: '12 Days', image: MedicineOne },
//     // Add more products as needed
//   ]);

//   const handleCheckboxChange = (id) => {
//     setCheckedState(prevState => ({
//       ...prevState,
//       [id]: !prevState[id]
//     }));
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleRemoveItem = (id) => {
//     setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
//   };

//   const groupedProducts = groupBySupplier(products);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

//   useEffect(() => {
//     // const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
//     // const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

//     // if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
//     // navigate("/buyer/login");
//     // return;
//     // }
    
//     const obj = {
//         // buyer_id  : buyerIdSessionStorage || buyerIdLocalStorage,
//         // filterKey : activeLink,
//         // page_no   : currentPage, 
//         // limit     : ordersPerPage,

//         buyer_id: 'BYR-jmn98sdanx',
//         pageNo : currentPage,
//         pageSize : itemsPerPage
//     }

//     postRequestWithToken('buyer/show-list', obj, async (response) => {
//         if (response.code === 200) {
//             setList(response.result)
//             setTotalItems(response.result.totalItems)
//         } else {
//            console.log('error in order list api',response);
//         }
//       })
// },[])

//   return (
//     <div className='send-enquiry-container'>
//       <div className='send-enquiry-heading'>Send Enquiry</div>
//       <div className='send-enquiry-main-section'>
//         <div className='send-enquiry-inner-section'>
//           <div className='send-enquiry-upper-section'>
//             <div className='send-enquiry-upper-left-sec'>
//               <span className='send-enquiry-upper-left-head'>Your Enquiries</span>
//             </div>
//             <div className='send-enquiry-upper-right-sec'>
//               <div className='send-enquiry-upper-right-content'>
//                 <span className='send-enquiry-upper-right-total'>Total:</span>
//                 <span className='send-enquiry-upper-right-number'>{products.length} Enquiries</span>
//               </div>
//               <div className='send-enquiry-upper-right-button-sec'>
//                 <span className='send-enquiry-upper-right-button'>Send Enquiry</span>
//               </div>
//             </div>
//           </div>
//           <div className='send-enquiry-container-inner-container'>
//             {Object.entries(groupedProducts).map(([supplier, products]) => (
//               <div key={supplier} className='send-enquiry-supplier-list-container'>
//                 <div className='send-enquiry-supplier-list-upper-section'>
//                   <div className='send-enquiry-supplier-list-heading'>Supplier Name:</div>
//                   <div className='send-enquiry-supplier-list-text'>{supplier}</div>
//                 </div>
//                 {products.map(product => (
//                   <div key={product.id} className='send-enquiry-inner-bottom-section-container'>
//                     <div className='send-enquiry-inner-checkbox'>
//                       <label className="custom-checkbox-label">
//                         <input
//                           type='checkbox'
//                           className='custom-checkbox'
//                           checked={checkedState[product.id] || false}
//                           onChange={() => handleCheckboxChange(product.id)}
//                         />
//                         <span className="custom-checkbox-checkmark"></span>
//                       </label>
//                     </div>
//                     <div className='send-enquiry-inner-image'>
//                       <img src={product.image} alt='Img1' />
//                     </div>
//                     <div className='send-enquiry-inner-content'>
//                       <div className='send-enquiry-inner-top-container'>
//                         <div className='send-enquiry-inner-top-head-section'>
//                           <span className='send-enquiry-inner-top-heading'>{product.name}</span>
//                           <span className='send-enquiry-inner-top-strength'>({product.strength})</span>
//                         </div>
//                         <div className='send-enquiry-inner-top-text-section'>
//                           <span className='send-enquiry-inner-top-supplier'>{product.description}</span>
//                         </div>
//                       </div>
//                       <div className='send-enquiry-inner-bottom-section'>
//                         <div className='send-enquiry-inner-bottom-container'>
//                           <span className='send-enquiry-inner-bootom-head'>Unit Price:</span>
//                           <span className='send-enquiry-inner-bootom-text'>{product.unitPrice} USD</span>
//                         </div>
//                         <div className='send-enquiry-inner-bottom-container'>
//                           <span className='send-enquiry-inner-bootom-head'>Target Price:</span>
//                           <span className='send-enquiry-inner-bootom-text'>{product.targetPrice} USD</span>
//                         </div>
//                         <div className='send-enquiry-inner-bottom-container'>
//                           <span className='send-enquiry-inner-bootom-head'>Est. Delivery Time:</span>
//                           <span className='send-enquiry-inner-bootom-text'>{product.deliveryTime}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className='send-enquiry-remove-section'>
//                       <HighlightOffOutlinedIcon
//                         className='send-enquiry-clear-icon'
//                         onClick={() => handleRemoveItem(product.id)}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//           <div className='pagi-container'>
//             <Pagination
//               activePage={currentPage}
//               itemsCountPerPage={itemsPerPage}
//               totalItemsCount={products.length}
//               pageRangeDisplayed={5}
//               onChange={handlePageChange}
//               itemClass="page-item"
//               linkClass="page-link"
//               prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
//               nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
//               hideFirstLastPages={true}
//             />
//             <div className='pagi-total'>
//               Total Items: {products.length}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const groupBySupplier = (products) => {
//   return products.reduce((acc, product) => {
//     const supplier = product.supplier;
//     if (!acc[supplier]) {
//       acc[supplier] = [];
//     }
//     acc[supplier].push(product);
//     return acc;
//   }, {});
// };

// export default SendInquiry;


import React, { useEffect, useState } from 'react';
import '../style/sendinruiry.css';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../api/Requests';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendInquiry = () => {
  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedState, setCheckedState] = useState({});
  const [list, setList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

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
    const obj = {
      buyer_id : 'BYR-jmn98sdanx',
      list_id  : listId,
      item_id  : [itemId],
      pageNo   : currentPage,
      pageSize : itemsPerPage

    };

    postRequestWithToken('buyer/delete-list-item', obj, async (response) => {
      if (response.code === 200) {
        toast(response.message, { type: "success" });
        setCheckedState({})
        setRefreshTrigger(prev => !prev);
      } else {
        toast(response.message, { type: "error" });
        console.log('error in order list api', response);
      }
    });


    // setList(prevList =>
    //   prevList.map(supplier =>
    //     supplier.list_id === listId
    //       ? {
    //           ...supplier,
    //           item_details: supplier.item_details.filter(item => item._id !== itemId)
    //         }
    //       : supplier
    //   )
    // );

  };
  
  const groupedProducts = groupBySupplier(list);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const obj = {
      buyer_id: 'BYR-jmn98sdanx',
      pageNo: currentPage,
      pageSize: itemsPerPage
    };

    postRequestWithToken('buyer/show-list', obj, async (response) => {
      if (response.code === 200) {
        setList(response?.result?.data);
        setTotalItems(response?.result?.totalItems);
      } else {
        toast(response.message, { type: "error" });
        console.log('error in order list api', response);
      }
    });
  }, [currentPage, refreshTrigger]);


  const handleSendEnquiry = () => {
    console.log(checkedState);
    if(Object.keys(checkedState).length === 0) {
      return toast('Select atleast one item', { type: "error" });
    }
    
    const selectedItems = [];
    Object.entries(groupedProducts).forEach(([supplierName, supplierData]) => {
      const selectedItemDetails = supplierData.items.filter(item => checkedState[item?._id]);
      if (selectedItemDetails.length > 0) {
        selectedItems.push({
          supplier_id  : supplierData.supplier_details.supplier_id,
          list_id      : supplierData.list_id,
          item_details : selectedItemDetails.map(item => ({
            item_id           : item._id,
            medicine_id       : item.medicine_id,
            unit_price        : item.unit_price,
            quantity_required : item.quantity_required,
            est_delivery_days : item.est_delivery_days,
            target_price      : item.target_price
          }))
        });
      } 
    });

    const enquiryPayload = {
      buyer_id: 'BYR-jmn98sdanx',
      items: selectedItems
    };

    postRequestWithToken('buyer/send-enquiry', enquiryPayload, async (response) => {
      if (response.code === 200) {
        toast(response.message, { type: "success" });
        setCheckedState({})
        setRefreshTrigger(prev => !prev);
      } else {
        toast(response.message, { type: "error" });
        console.log('error in send-enquiry api', response);
      }
    });
    
  }

  return (
    <div className='send-enquiry-container'>
      <div className='send-enquiry-heading'>Send Enquiry</div>
      <div className='send-enquiry-main-section'>
        <div className='send-enquiry-inner-section'>
          <div className='send-enquiry-upper-section'>
            <div className='send-enquiry-upper-left-sec'>
              <span className='send-enquiry-upper-left-head'>Your Enquiries</span>
            </div>
            <div className='send-enquiry-upper-right-sec'>
              <div className='send-enquiry-upper-right-content'>
                <span className='send-enquiry-upper-right-total'>Total:</span>
                <span className='send-enquiry-upper-right-number'>{totalItems} Enquiries</span>
              </div>
              <div className='send-enquiry-upper-right-button-sec' onClick={handleSendEnquiry}>
                <span className='send-enquiry-upper-right-button'>Send Enquiry</span>
              </div>
            </div>
          </div>
          <div className='send-enquiry-container-inner-container'>
            {Object.entries(groupedProducts).map(([supplierName, supplierData]) => (
              <div key={supplierData?.list_id} className='send-enquiry-supplier-list-container'>
                <div className='send-enquiry-supplier-list-upper-section'>
                  <div className='send-enquiry-supplier-list-heading'>Supplier Name:</div>
                  <div className='send-enquiry-supplier-list-text'>{supplierName}</div>
                </div>
                {supplierData.items.map(product => {
                  return (
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
                          <span className='send-enquiry-inner-bootom-head'>Unit Price:</span>
                          <span className='send-enquiry-inner-bootom-text'>{product?.unit_price}</span>
                        </div>
                        <div className='send-enquiry-inner-bottom-container'>
                          <span className='send-enquiry-inner-bootom-head'>Target Price:</span>
                          <span className='send-enquiry-inner-bootom-text'>{product?.target_price}</span>
                        </div>
                        <div className='send-enquiry-inner-bottom-container'>
                          <span className='send-enquiry-inner-bootom-head'>Est. Delivery Time:</span>
                          <span className='send-enquiry-inner-bootom-text'>{product?.est_delivery_days} Days</span>
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
                  )
                 
                })}
              </div>
            ))}
          </div>
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
