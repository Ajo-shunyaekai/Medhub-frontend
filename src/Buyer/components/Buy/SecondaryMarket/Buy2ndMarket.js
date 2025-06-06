import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./market.module.css";
import Category from "../UiShared/Category/Category";
import Search from "../UiShared/Search/Search";
import ProductCard from "../UiShared/ProductCards/ProductCard";
import Loader from "../../SharedComponents/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsList } from "../../../../redux/reducers/productSlice";
import AccordionFilter from "../UiShared/Category/Category";

const Buy2ndMarket = ({
  active,
  filterCategory,
  setFilterCategory,
  isOpen,
  toggleAccordion,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedLevel3Category,
  setSelectedLevel3Category,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchKey, setSearchKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
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

  useEffect(() => {
    const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }
    const fetchData = async () => {
      try {
        const buyerId =
          localStorage?.getItem("buyer_id") ||
          localStorage?.getItem("buyer_id");
        if (!buyerId) {
          localStorage?.clear();
          navigate("/buyer/login");
          return;
        }

        if (active === "market") {
          const fetchData = async () => {
            const marketType = "secondary";
            const { category, subCategory, level3Category } =
              filterCategory || {};
            const response = await dispatch(
              fetchProductsList({
                url: `product?market=${marketType}&page_no=${currentPage}&page_size=${itemsPerPage}&search_key=${
                  searchKey || ""
                }&category=${encodeURIComponent(
                  category || ""
                )}&subCategory=${encodeURIComponent(
                  subCategory || ""
                )}&level3Category=${encodeURIComponent(level3Category || "")}`,
                // obj: { countries: ["Åland Islands"] },
              })
            );
            if (response.meta.requestStatus === "fulfilled") {
              setProductList(response?.payload?.products || []);
              setTotalItems(response?.payload?.totalItems || 0);
              setLoading(false);
            } else {
              setProductList([]);
              setTotalItems(0);
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
        <div className={styles.marketContainer}>
          <Search
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
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              selectedLevel3Category={selectedLevel3Category}
              setSelectedLevel3Category={setSelectedLevel3Category}
            />
          )}
          <ProductCard
            productList={productList}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            isSecondaryMarket={true}
          />
        </div>
      )}
    </>
  );
};

export default Buy2ndMarket;
