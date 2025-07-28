import React, { useEffect, useState } from 'react';
import styles from './supplierdetails.module.css';
import SupplyOrderList from './SupplyOrderList';
import SupplyProductList from './SupplyProductList';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../../../api/Requests';
import SupplySecondaryList from './SupplySecondaryList';
import { apiRequests } from "../../../../api/index";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsList } from '../../../../redux/reducers/productSlice';
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
 
const SupplierDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { supplierId } = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productReducer);
  const [activeTab, setActiveTab] = useState('');
  const [supplier, setSupplier] = useState();
  const [buyerSupplierOrder, setBuyerSupplierOrder] = useState([]);
  const [totalOrders, setTotalOrders] = useState();
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const ordersPerPage = 10;
 
  const [productList, setProductList] = useState([]);
  const [totalProducts, setTotalProducts] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
 
  const getActiveButtonFromPath = (path) => {
    if (path.includes('/products')) {
      return 'products';
    } else if (path.includes('/secondary')) {
      return 'secondary';
    } else if (path.includes('/orders')) {
      return 'orders';
    } else {
      return 'products';
    }
  };
 
  const activeButton = getActiveButtonFromPath(location.pathname);
 
  const handleButtonClick = (button) => {
    switch (button) {
      case 'products':
        navigate(`/buyer/supplier-details/${supplierId}/products`);
        setActiveTab('products');
        setCurrentPage(1);
        break;
      case 'secondary':
        navigate(`/buyer/supplier-details/${supplierId}/secondary`);
        setActiveTab('secondary');
        setCurrentPage(1);
        break;
      case 'orders':
        navigate(`/buyer/supplier-details/${supplierId}/orders`);
        setActiveTab('orders');
        break;
      default:
        navigate(`/buyer/supplier-details/${supplierId}/products`);
        setActiveTab('products');
    }
  };
 
  const handleProductPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
 
  const handleOrderPageChange = (pageNumber) => {
    setCurrentOrderPage(pageNumber);
  };
 
  // supplier-details
  useEffect(() => {
    const getSupplierDeatils = async () => {
      const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
      const buyerIdLocalStorage = localStorage?.getItem("buyer_id");
 
      if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        localStorage?.clear();
        navigate("/buyer/login");
        return;
      }
 
      const obj = {
        supplier_id: supplierId,
        buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      };
      try {
        const response = await apiRequests.getRequest(`supplier/get-specific-supplier-details/${supplierId}`, obj);
        if (response?.code !== 200) {
          return;
        }
        setSupplier(response?.result);
      } catch (error) { }
    };
 
    getSupplierDeatils();
  }, []);
 
  useEffect(() => {
    const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage?.getItem("buyer_id");
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }
 
    const medicineType = activeButton === 'products' ? 'new' : activeButton === 'secondary' ? 'secondary' : '';
 
    const obj = {
      supplier_id: supplierId,
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      pageSize: productsPerPage,
      pageNo: currentPage,
      medicine_type: medicineType,
    };
 
    postRequestWithToken('buyer/supplier-product-list', obj, async (response) => {
      if (response?.code === 200) {
        setProductList(response.result.data);
        setTotalProducts(response.result.totalItems);
      } else {
      }
    });
 
      // const fetchData = async () => {
      //       const marketType = activeButton === "products" ? "new" : "secondary";
      //       const response = await dispatch(
      //         fetchProductsList({
      //           url: `product?market=${marketType}&supplier_id=${supplier?._id}&buyer_id=${buyer_id}&page_no=${currentPage}&page_size=${productsPerPage}&showDuplicate=false`,
      //           // obj: { countries: ["India"] },
      //         })
      //       );
      //       if (response.meta.requestStatus === "fulfilled") {
      //         setTotalProducts(response.payload?.totalItems);
      //         // setLoading(false);
      //       }
      // };
    const fetchBuyerSupplierOrder = () => {
      const obj = {
        buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
        supplier_id: supplierId,
        pageSize: ordersPerPage,
        pageNo: currentOrderPage,
        order_type: '',
      };
 
      postRequestWithToken('buyer/buyer-supplier-orders', obj, async (response) => {
        if (response?.code === 200) {
          setBuyerSupplierOrder(response.result);
          setTotalOrders(response.result.totalOrders);
        } else {
        }
      });
    };
    // fetchData()
    fetchBuyerSupplierOrder();
  }, [currentPage, activeTab, currentOrderPage]);
 
  return (
    <div className={styles.container}>
      {supplier?.supplier_id && (
        <span className={styles.heading}>Supplier ID: {supplier.supplier_id}</span>
      )}
 
      <div className={styles.section}>
        <div className={styles.leftCard}>
          {(supplier?.supplier_name || supplier?.supplier_type) && (
            <div className={styles.cardSection}>
              <div className={styles.innerSection}>
                {supplier?.supplier_name && (
                  <span className={styles.mainHead}>{supplier.supplier_name}</span>
                )}
                {supplier?.websiteAddress && (
                  <a
                    href={supplier.websiteAddress}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.typeLink}
                  >
                    {supplier.websiteAddress}
                  </a>
                )}
 
                {supplier?.supplier_type && (
                  <span className={styles.typeHead}>{supplier.supplier_type}</span>
                )}
              </div>
             <div className={styles.logoSection}>
          <img   src={
                      supplier?.supplier_image[0]?.startsWith("http")
                        ? supplier?.supplier_image[0]
                        : `${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplier?.supplier_image[0]}`
                    }
                    alt='supplier-logo'
                    />
             </div>
            </div>
          )}
 
          {supplier?.description && (
            <div className={styles.innerContainer}>
              <div className={styles.cardContainer}>
                <span className={styles.cardHead}>Description</span>
                <span className={styles.cardContents}>{supplier.description}</span>
              </div>
            </div>
          )}
 
          {/* {(supplier?.supplier_address ||
            supplier?.registeredAddress?.locality ||
            supplier?.registeredAddress?.land_mark ||
            supplier?.registeredAddress?.country ||
            supplier?.registeredAddress?.state ||
            supplier?.registeredAddress?.city ||
            supplier?.registeredAddress?.pincode ||
            supplier?.bank_details) && (
              <div className={styles.innerContainer}>
                {(supplier?.supplier_address ||
                  supplier?.registeredAddress?.locality ||
                  supplier?.registeredAddress?.land_mark ||
                  supplier?.registeredAddress?.country ||
                  supplier?.registeredAddress?.state ||
                  supplier?.registeredAddress?.city ||
                  supplier?.registeredAddress?.pincode) && (
                    <div className={styles.cardContainer}>
                      <span className={styles.cardHeads}>Address</span>
                      <span className={styles.cardContents}>
                        {[
                          supplier?.supplier_address,
                          supplier?.registeredAddress?.locality,
                          supplier?.registeredAddress?.land_mark,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                        {[
                          supplier?.registeredAddress?.country,
                          supplier?.registeredAddress?.state,
                          supplier?.registeredAddress?.city,
                          supplier?.registeredAddress?.pincode,
                        ].filter(Boolean).length > 0 && (
                            <div>
                              {[
                                supplier?.registeredAddress?.country,
                                supplier?.registeredAddress?.state,
                                supplier?.registeredAddress?.city,
                                supplier?.registeredAddress?.pincode,
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </div>
                          )}
                      </span>
                    </div>
                  )}
                {supplier?.bank_details && (
                  <div className={styles.cardContainer}>
                    <span className={styles.cardHeads}>Bank Details</span>
                    <div className={styles.cardContents}>
                      {supplier?.bank_details?.split(', ').map((detail, index) => (
                        <div key={index} className={styles.bankDetail}>
                          {detail.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )} */}
 
          {(
            supplier?.supplier_mobile ||
            supplier?.registration_no ||
            supplier?.vat_reg_no ||
            supplier?.activity_code ||
            supplier?.sales_person_name ||
            supplier?.country_of_origin ||
            supplier?.country_of_operation ||
            supplier?.categories ||
            supplier?.license_no ||
            supplier?.license_expiry_date ||
 
  supplier?.yrFounded ||
            supplier?.annualTurnover ||
 
            supplier?.tags ||
            supplier?.contact_person_name ||
            supplier?.contact_person_email ||
            supplier?.contact_person_mobile_no ||
            supplier?.designation) && (
              <div className={styles.cardInnerSection}>
                  {supplier?.supplier_mobile && (
                    <div className={styles.cardMainContainer}>
                      <span className={styles.cardHead}>Company Phone No.</span>
                    <span className={styles.cardContent}>{supplier?.supplier_country_code || ''}{supplier.supplier_mobile}</span>
                  </div>
               
                 
               
              )}
                {supplier?.registration_no && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Company Registration No</span>
                    <span className={styles.cardContent}>{supplier.registration_no}</span>
                  </div>
                )}
                {supplier?.vat_reg_no && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>GST/VAT Registration Number</span>
                    <span className={styles.cardContent}>{supplier.vat_reg_no}</span>
                  </div>
                )}
                {supplier?.activity_code && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Business/Trade Activity Code</span>
                    <span className={styles.cardContent}>{supplier.activity_code}</span>
                  </div>
                )}
                {/* {supplier?.sales_person_name && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Medhub Global Sales Representative</span>
                    <span className={styles.cardContent}>{supplier.sales_person_name}</span>
                  </div>
                )} */}
              
               
                {supplier?.license_no && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>License No.</span>
                    <span className={styles.cardContent}>{supplier.license_no}</span>
                  </div>
                )}
                {supplier?.license_expiry_date && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>License Expiry/Renewal Date</span>
                    <span className={styles.cardContent}>{supplier.license_expiry_date}</span>
                  </div>
                )}
 
                  {supplier?.yrFounded && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Year Company Founded</span>
                    <span className={styles.cardContent}>{supplier.yrFounded}</span>
                  </div>
                )}
               {supplier?.annualTurnover&& (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Annual Turnover</span>
                    <span className={styles.cardContent}>{supplier.annualTurnover}</span>
                  </div>
                )}
                {supplier?.tags && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Tags</span>
                    <span className={styles.cardContent}>{supplier.tags}</span>
                  </div>
                )}
                  {supplier?.country_of_origin && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Country of Origin</span>
                    <span className={styles.cardContent}>{supplier.country_of_origin}</span>
                  </div>
                )}
                {supplier?.country_of_operation && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Country of Operation</span>
                    <span className={styles.cardContent}>{supplier.country_of_operation.join(', ')}</span>
                  </div>
                )}
                 {supplier?.categories?.length > 0 && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Trading Categories</span>
                    <span className={styles.cardContent}>{supplier?.categories?.length < 6 ?
                    (supplier?.categories?.slice(0, supplier?.categories?.length).join(', '))
                    :
                    (
                      <>
                        {(window.innerWidth < 1380? supplier?.categories?.slice(0,4).join(', '): supplier?.categories?.slice(0,5)).join(",")}
                        <span>{" ... "}</span>
                        <span
                          id="buyer-tooltip"
                          style={{ textDecoration: "underline" , color:'#0075ce'}}
                        >
                          {"view more"}
                        </span>
                        <Tooltip
                          anchorId="buyer-tooltip"
                          place="bottom-start"
                          className={styles.toolTip}
                          delayHide={500}
                          content={
                            supplier?.categories?.join(",")
                          }
                        />
                      </>
                    )}
                    </span>
                  </div>
                )}
                {/* {supplier?.contact_person_name && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Contact Name</span>
                    <span className={styles.cardContent}>{supplier.contact_person_name}</span>
                  </div>
                )}
                {supplier?.contact_person_email && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Email ID</span>
                    <span className={styles.cardContent}>{supplier.contact_person_email}</span>
                  </div>
                )}
                {(supplier?.contact_person_mobile_no || supplier?.contact_person_country_code) && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Mobile No</span>
                    <span className={styles.cardContent}>
                      {`${supplier?.contact_person_country_code || ''} ${supplier?.contact_person_mobile_no || ''}`}
                    </span>
                  </div>
                )}
                {supplier?.designation && (
                  <div className={styles.cardMainContainer}>
                    <span className={styles.cardHead}>Designation</span>
                    <span className={styles.cardContent}>{supplier.designation}</span>
                  </div>
                )} */}
              </div>
            )}
        </div>
 
        <div className={styles.rightCard}>
          <div className={styles.rightContainer}>
            <Link className={styles.rightSection} to={`/buyer/supplier-active/${supplierId}`}>
              <span className={styles.rightHead}>Active Orders</span>
              <span className={styles.rightContent}>{buyerSupplierOrder?.activeCount || 0}</span>
            </Link>
            <Link className={styles.rightSection} to={`/buyer/supplier-completed/${supplierId}`}>
              <span className={styles.rightHead}>Completed Orders</span>
              <span className={styles.rightContent}>{buyerSupplierOrder?.completedCount || 0}</span>
            </Link>
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={`${styles.buttonProduct} ${activeButton === 'products' ? styles.active : ''}`}
              onClick={() => handleButtonClick('products')}
            >
              New Products
            </button>
            <button
              className={`${styles.button} ${activeButton === 'secondary' ? styles.active : ''}`}
              onClick={() => handleButtonClick('secondary')}
            >
              Secondary Products
            </button>
            <button
              className={`${styles.button} ${activeButton === 'orders' ? styles.active : ''}`}
              onClick={() => handleButtonClick('orders')}
            >
              Previous Orders List
            </button>
          </div>
          {activeButton === 'products' ? (
            <SupplyProductList
              productsData={productList}
              totalProducts={totalProducts}
              currentPage={currentPage}
              productsPerPage={productsPerPage}
              handleProductPageChange={handleProductPageChange}
            />
          ) : activeButton === 'secondary' ? (
            <SupplySecondaryList
              productsData={productList}
              totalProducts={totalProducts}
              currentPage={currentPage}
              productsPerPage={productsPerPage}
              handleProductPageChange={handleProductPageChange}
            />
          ) : (
            <SupplyOrderList
              orderList={buyerSupplierOrder?.orderList}
              totalOrders={totalOrders}
              currentPage={currentOrderPage}
              ordersPerPage={ordersPerPage}
              handleOrderPageChange={handleOrderPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};
 
export default SupplierDetails;