import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./byproduct.module.css";
import SearchSection from "../UiShared/Search/Search";
import ProductCard from "../UiShared/ProductCards/ProductCard";
import ListView from "../UiShared/ProductList/ProductList";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../SharedComponents/Loader/Loader";
import { fetchProductsList, fetchProductsQRList } from "../../../../redux/reducers/productSlice";
import AccordionFilter from "../UiShared/Category/Category";
import { BsCardList } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa";

const BuyProduct = ({
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
  const [totalItems, setTotalitems] = useState(0);
  const [viewMode, setViewMode] = useState("card");
  const itemsPerPage = 10;

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

        if (active === "product") {
          const fetchProducts = async () => {
            setLoading(true);
            const marketType = active === "product" ? "new" : "secondary";
            const { category, subCategory, level3Category, countries = [] } = filterCategory || {};
            const response = await dispatch(
              fetchProductsList({
                url: `product?market=${marketType}&page_no=${currentPage}&page_size=${itemsPerPage}&search_key=${
                  searchKey || ""
                }&category=${encodeURIComponent(
                  category || ""
                )}&subCategory=${encodeURIComponent(
                  subCategory || ""
                )}&level3Category=${encodeURIComponent(
                  level3Category || ""
                )}`,
                obj: { countries }, // Send countries in request body
              })
            );
            // const response2 = await dispatch(
            //   fetchProductsQRList({
            //     url: `product/get-all-qr-products?pageNo=${currentPage}&pageSize=${20}`,
            //     obj: { downloadCsv: true },
            //   })
            // );
            if (response.meta.requestStatus === "fulfilled") {
              setProductList(response?.payload?.products || []);
              setTotalitems(response?.payload?.totalItems || 0);
              setLoading(false);
            } else {
              console.error("Failed to fetch products:", response?.payload);
              setProductList([]);
              setTotalitems(0);
              setLoading(false);
            }
          };
          fetchProducts();
        }
      } catch (error) {
        console.error("Error fetching products:", error.message);
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
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              selectedLevel3Category={selectedLevel3Category}
              setSelectedLevel3Category={setSelectedLevel3Category}
            />
          )}
          <div className={styles.tabContainer}>
            <button
              onClick={() => setViewMode("card")}
              className={`${styles.tabButton} ${viewMode === "card" ? styles.activeTab : ""}`}
              title="List View"
            >
              <BsCardList className={styles.tabIcon} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`${styles.tabButton} ${viewMode === "list" ? styles.activeTab : ""}`}
              title="Card View"
            >
              <FaRegAddressCard className={styles.tabIcon} />
            </button>
          </div>
          {viewMode === "card" ? (
            <ProductCard
              productList={productList}
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          ) : (
            <ListView
              productList={productList}
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </>
  );
};

export default BuyProduct;