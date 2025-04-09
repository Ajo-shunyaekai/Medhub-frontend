import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./byproduct.module.css";
import SearchSection from "../UiShared/Search/Search";
import ProductCard from "../UiShared/ProductCards/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../SharedComponents/Loader/Loader";
import { fetchProductsList } from "../../../../redux/reducers/productSlice";
import AccordionFilter from "../UiShared/Category/Category";

const BuyProduct = ({
  active,
  filterCategory,
  setFilterCategory,
  isOpen,
  toggleAccordion,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [medicineList, setMedicineList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchKey, setSearchKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalitems] = useState(0); // Initialize with 0
  const itemsPerPage = 5;

  const searchTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchKey(e.target.value);
      setCurrentPage(1);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setSearchKey(inputValue);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //   const handleCategoryFilter = (category) => {
  //     setCurrentPage(1);
  //     setFilterCategory(category);
  //   };

  useEffect(() => {
    const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage.getItem("buyer_id");

    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    const fetchData = async () => {
      try {
        const buyerId =
          sessionStorage.getItem("buyer_id") ||
          localStorage.getItem("buyer_id");
        if (!buyerId) {
          navigate("/buyer/login");
          return;
        }

        if (active === "product") {
          const fetchData = async () => {
            setLoading(true);
            const marketType = active === "product" ? "new" : "secondary";
            const { category, subCategory, level3Category } =
              filterCategory || {};
            const response = await dispatch(
              fetchProductsList(
                `product?market=${marketType}&page_no=${currentPage}&page_size=${itemsPerPage}&search_key=${
                  searchKey || ""
                }&category=${encodeURIComponent(
                  category || ""
                )}&subCategory=${encodeURIComponent(
                  subCategory || ""
                )}&level3Category=${encodeURIComponent(level3Category || "")}`
              )
            );
            if (response.meta.requestStatus === "fulfilled") {
              setMedicineList(response?.payload?.products || []);
              setTotalitems(response?.payload?.totalItems || 0);
              setLoading(false);
            } else {
              setMedicineList([]);
              setTotalitems(0);
              setLoading(false);
            }
          };
          fetchData();
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [active, currentPage, dispatch, filterCategory, navigate, searchKey]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.productContainer}>
          <SearchSection
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            placeholder="Search Products"
          />
          {(active === "product" || active === "market") && (
            <AccordionFilter
              isOpen={isOpen}
              toggleAccordion={toggleAccordion}
              setFilterCategory={setFilterCategory}
            />
          )}
          <ProductCard
            medicineList={medicineList}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default BuyProduct;
