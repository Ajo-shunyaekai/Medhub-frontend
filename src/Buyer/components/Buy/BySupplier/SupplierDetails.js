import React, { useEffect, useState } from 'react';
import styles from './supplierdetails.module.css';
import { Tooltip as ReactTooltip } from "react-tooltip";
import SupplyOrderList from './SupplyOrderList'
import SupplyProductList from './SupplyProductList';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../../../api/Requests';
import SupplySecondaryList from './SupplySecondaryList';
import { apiRequests } from "../../../../api/index";

const SupplierDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { supplierId } = useParams()

  const [activeTab, setActiveTab] = useState('');
  const [supplier, setSupplier] = useState()
  const [buyerSupplierOrder, setBuyerSupplierOrder] = useState([])
  const [totalOrders, setTotalOrders] = useState()
  const [currentOrderPage, setCurrentOrderPage] = useState(1)
  const ordersPerPage = 10;

  const [productList, setProductList] = useState([])
  const [totalProducts, setTotalProducts] = useState()
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
        setCurrentPage(1)
        break;
      case 'secondary':
        navigate(`/buyer/supplier-details/${supplierId}/secondary`);
        setActiveTab('secondary');
        setCurrentPage(1)
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


  //supplier-details
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

      }
      try {
        const response = await apiRequests.getRequest(`supplier/get-specific-supplier-details/${supplierId}`, obj);
        if (response?.code !== 200) {
          return;
        }
        setSupplier(response?.result);
      } catch (error) {
      }
    }

    getSupplierDeatils()
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
      medicine_type: medicineType
    }

    postRequestWithToken('buyer/supplier-product-list', obj, async (response) => {
      if (response?.code === 200) {
        setProductList(response.result.data);
        setTotalProducts(response.result.totalItems);
      } else {
      }
    })

    const fetchBuyerSupplierOrder = () => {
      const obj = {
        buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
        supplier_id: supplierId,
        pageSize: ordersPerPage,
        pageNo: currentOrderPage,
        order_type: ''
      }

      postRequestWithToken('buyer/buyer-supplier-orders', obj, async (response) => {
        if (response?.code === 200) {
          setBuyerSupplierOrder(response.result)
          setTotalOrders(response.result.totalOrders)
        } else {
        }
      })
    }
    fetchBuyerSupplierOrder()
    // }

  }, [currentPage, activeTab, currentOrderPage]);
  return (
    <div className={styles.container}>
      <span className={styles.heading}>Supplier ID: {supplier?.supplier_id || 'SUP-0987RF67R'}</span>

      <div className={styles.section}>
        <div className={styles.leftCard}>
          <div className={styles.cardSection}>
            <div className={styles.innerSection}>
              <span className={styles.mainHead}>{supplier?.supplier_name || 'XYZ Pharmaceuticals'}</span>
              <span className={styles.typeHead}>{supplier?.supplier_type || 'Manufacturer'}</span>
            </div>
            <div
              className={styles.headIcons}
              data-tooltip-id="phoneTooltip"
              data-tooltip-content={`${supplier?.supplier_country_code || '+971'} ${supplier?.supplier_mobile || '765765'}`}
            >
              <PhoneInTalkOutlinedIcon className={styles.Icon} />
              <ReactTooltip id="phoneTooltip" place="top" effect="solid" />
            </div>
          </div>

          <div className={styles.innerContainer}>
            <div className={styles.cardContainer}>
              <span className={styles.cardHead}>Description</span>
              <span className={styles.cardContents}>{supplier?.description || 'No description available'}</span>
            </div>

          </div>

          <div className={styles.innerContainer}>
            <div className={styles.cardContainer}>
              <span className={styles.cardHeads}>Address</span>
              <span className={styles.cardContents}>
                {[
                  supplier?.supplier_address,
                  supplier?.registeredAddress?.locality && supplier?.registeredAddress?.land_mark
                    ? `${supplier?.registeredAddress?.locality}, ${supplier?.registeredAddress?.land_mark}`
                    : supplier?.registeredAddress?.locality || supplier?.registeredAddress?.land_mark,
                  [supplier?.registeredAddress?.country, supplier?.registeredAddress?.state, supplier?.registeredAddress?.city]
                    .filter(Boolean)
                    .join(', '),
                  supplier?.registeredAddress?.pincode
                ]
                  .filter(Boolean)
                  .map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      <br />
                    </React.Fragment>
                  ))}
              </span>
            </div>
            <div className={styles.cardContainer}>
              <span className={styles.cardHeads}>Bank Details</span>
              <div className={styles.cardContents}>
                {supplier?.bank_details ? (
                  supplier.bank_details.split(', ').map((detail, index) => (
                    <div key={index}>{detail.trim()}</div>
                  ))
                ) : (
                  'Not provided'
                )}
              </div>
            </div>
          </div>

          <div className={styles.cardInnerSection}>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Company Registration No</span>
              <span className={styles.cardContent}>{supplier?.registration_no || 'Not provided'}</span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>GST/VAT Registration Number</span>
              <span className={styles.cardContent}>{supplier?.vat_reg_no || 'Not provided'}</span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Business/Trade Activity Code</span>
              <span className={styles.cardContent}>{supplier?.activity_code || 'Not provided'}</span>
            </div>

            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Sales Person Name</span>
              <span className={styles.cardContent}>{supplier?.sales_person_name || 'Not provided'}</span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Country of Origin</span>
              <span className={styles.cardContent}>{supplier?.country_of_origin || 'Not provided'}</span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Country of Operation</span>
              <span className={styles.cardContent}>
                {supplier?.country_of_operation?.join(', ') || 'Not provided'}
              </span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Categories you Trade In</span>
              <span className={styles.cardContent}>
                {supplier?.categories?.length > 0 ? supplier.categories.join(', ') : 'Not provided'}
              </span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>License No.</span>
              <span className={styles.cardContent}>{supplier?.license_no || 'Not provided'}</span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>License Expiry/Renewal Date</span>
              <span className={styles.cardContent}>{supplier?.license_expiry_date || 'Not provided'}</span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Tags</span>
              <span className={styles.cardContent}>{supplier?.tags || 'Not provided'}</span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Contact Name</span>
              <span className={styles.cardContent}>{supplier?.contact_person_name || 'Not provided'}</span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Email ID</span>
              <span className={styles.cardContent}>{supplier?.contact_person_email || 'Not provided'}</span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Mobile No</span>
              <span className={styles.cardContent}>
                {`${supplier?.contact_person_country_code || ''} ${supplier?.contact_person_mobile_no || 'Not provided'}`}
              </span>
            </div>
            <div className={styles.cardMainContainer}>
              <span className={styles.cardHead}>Designation</span>
              <span className={styles.cardContent}>{supplier?.designation || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Right Card Section remains unchanged */}
        <div className={styles.rightCard}>
          <div className={styles.rightContainer}>
          <Link className={styles.rightSection} to={`/buyer/supplier-active/${supplierId}`}>
            
              <span className={styles.rightHead}>Active Orders</span>
              <span className={styles.rightContent}>{buyerSupplierOrder?.activeCount || 0}</span>
           
            </Link>
            <Link  className={styles.rightSection} to={`/buyer/supplier-completed/${supplierId}`}>
            
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
  )
}

export default SupplierDetails