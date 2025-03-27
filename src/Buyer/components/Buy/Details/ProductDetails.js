import styles from "./productdetails.module.css";
import Select from 'react-select';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOtherSupplierProductsList, fetchProductDetail } from "../../../../redux/reducers/productSlice";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import CloseIcon from "../../../assets/images/Icon.svg";
import ProductCard from "../UiShared/ProductCards/ProductCard";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

Modal.setAppElement("#root");

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  selectedQuantity: Yup.string()
    .required('Quantity selection is mandatory'),
  quantityRequired: Yup.number()
    .required('Quantity Required is mandatory')
    .positive('Must be a positive number')
    .typeError('Must be a number'),
  targetPrice: Yup.number()
    .required('Target Price is mandatory')
    .positive('Must be a positive price')
    .typeError('Must be a number'),
});

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state?.productReducer || {});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  const pdfFile = productDetail?.secondayMarketDetails?.purchaseInvoiceFile?.[0] ||
    productDetail?.data?.[0]?.secondayMarketDetails?.purchaseInvoiceFile?.[0];
  const pdfUrl = pdfFile
    ? `${process.env.REACT_APP_SERVER_URL}/uploads/products/${pdfFile}`
    : "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";

  const inventoryList = productDetail?.inventoryDetails?.inventoryList || [];
  const [medicineList, setMedicineList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalitems] = useState(0);
  const itemsPerPage = 6;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(`product/${id}`));
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(fetchOtherSupplierProductsList(`product/get-other-products/${id}?page_no=${currentPage}&page_size=${itemsPerPage}`));
      if (response.meta.requestStatus === 'fulfilled') {
        setMedicineList(response?.payload?.products || []);
        setTotalitems(response?.payload?.totalItems || 0);
      } else {
        setMedicineList([]);
        setTotalitems(0);
      }
    }
    fetchData();
  }, [id, dispatch, currentPage]);

  const getCategoryData = (property) => {
    if (!productDetail?.category) return null;
    return productDetail[productDetail.category]?.[property];
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.ProductMainContainer}>
          <span className={styles.medicineName}>
            {productDetail?.general?.name}
          </span>
        </div>
        
        {productDetail?.inventoryDetails?.inventoryList?.length > 0 && (
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Product Inventory</span>
            <div className={styles.innerInventorySection}>
              <div className={styles.inventorySection}>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Quantity</span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Cost Per Product</span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Est. Delivery Time</span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Quantity Required</span>
                </div>
                <div className={styles.inventoryContainer}>
                  <span className={styles.inventoryHead}>Target Price</span>
                </div>
              </div>

              {productDetail?.inventoryDetails?.inventoryList?.map((ele, index) => {
                const options = Array.isArray(ele?.quantity)
                  ? ele.quantity.map((qty) => ({ value: qty, label: qty }))
                  : [{ value: ele?.quantity, label: ele?.quantity }];

                return (
                  <Formik
                    key={index}
                    initialValues={{
                      selectedQuantity: '',
                      quantityRequired: '',
                      targetPrice: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                      console.log('Form submitted:', values);
                      // Add your submit logic here
                    }}
                  >
                    {({ handleReset, setFieldValue, errors, touched }) => (
                      <Form className={styles.formSection}>
                        <div className={styles.fromContainer}>
                          <div className={styles.inventoryContainer}>
                            <Select
                              options={options}
                              placeholder="Select Quantity"
                              onChange={(option) => setFieldValue('selectedQuantity', option?.value || '')}
                              className={errors.selectedQuantity && touched.selectedQuantity ? styles.errorSelect : ''}
                            />
                            <ErrorMessage
                              name="selectedQuantity"
                              component="span"
                              className={styles.errorText}
                            />
                          </div>
                          <div className={styles.inventoryContainer}>
                            <span className={styles.inventoryInput} readOnly>
                              {ele?.price}
                            </span>
                          </div>
                          <div className={styles.inventoryContainer}>
                            <span className={styles.inventoryInput} readOnly>
                              {ele?.deliveryTime}
                            </span>
                          </div>
                          <div className={styles.inventoryContainer}>
                            <Field
                              type="number"
                              name="quantityRequired"
                              className={styles.inventoryInput}
                              placeholder="Enter quantity"
                            />
                            <ErrorMessage
                              name="quantityRequired"
                              component="span"
                              className={styles.errorText}
                            />
                          </div>
                          <div className={styles.inventoryContainer}>
                            <Field
                              type="number"
                              name="targetPrice"
                              className={styles.inventoryInput}
                              placeholder="Enter target price"
                            />
                            <ErrorMessage
                              name="targetPrice"
                              component="span"
                              className={styles.errorText}
                            />
                          </div>
                        </div>
                        <div className={styles.buttonContainer}>
                          <button type="submit" className={styles.submitButton}>
                            Add to List
                          </button>
                          <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleReset}
                          >
                            Cancel
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                );
              })}
            </div>
          </div>
        )}
        
        <ProductCard
          medicineList={medicineList}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ProductDetails;