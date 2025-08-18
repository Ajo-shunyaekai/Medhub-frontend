import React, { useEffect, useRef, useState } from "react";
import styles from "./modal.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Modal = ({
  isOpen,
  onClose,
  couponArray,
  selectedPlan,
  handleClickPurchase,
}) => {
  const modalRef = useRef(null);
  const formRef = useRef(); // to reset form
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const initialValues = {
    discount: "",
  };

  useEffect(() => {
    if (isOpen && formRef.current) {
      formRef.current.resetForm(); // Reset form when modal opens
    }
  }, [isOpen]);

  const validationSchema = Yup.object({
    discount: Yup.string()
      //   .min(3, 'Must be at least 3 characters')
      .required("Coupon code is required")
      .oneOf(
        ["SAVET1-99", "SAVET2-198", "SAVET3-297", "SAVET4-396", "SAVET6-594"],
        "Invalid Coupon Code"
      )
      .max(25, "Maximum character should be 25"),
  });

  const handleSubmit = (values) => {
    setLoading(true);
    const discountObj = couponArray.find((item)=>item.name===values.discount);
    handleClickPurchase(selectedPlan, discountObj.name,discountObj.amount);
  };

  if (!isOpen) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <h2 className={styles.heading}>Enter Your Coupon Code</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, resetForm }) => {
            return (
              <Form className={styles.form}>
                <div className={styles.inputWrapper}>
                  <Field
                    name="discount"
                    type="text"
                    placeholder="Coupon Code"
                    className={styles.input}
                  />
                  <ErrorMessage
                    name="discount"
                    component="span"
                    className={styles.error}
                  />
                </div>

                {loading ? (
                  <div className={styles.loadingSpinner}></div>
                ) : (
                  <div className={styles.btnDiv}>
                    <button type="submit" className={styles.applyBtn}>
                      Apply
                    </button>
                    <button
                      type="button"
                      className={styles.skipBtn}
                      onClick={() => {
                        setLoading(true);
                        handleClickPurchase(selectedPlan);
                      }}
                    >
                      Skip
                    </button>
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Modal;
