import React, { useEffect, useState } from "react";
import styles from "./buy.module.css";
import Right from "../../assets/images/right-arrow.svg";
import BuySeller from "./BySupplier/BySupplier";
import BuyProduct from "./ByProduct/BuyProduct";
import Buy2ndMarket from "./SecondaryMarket/Buy2ndMarket";
import AccordionFilter from "./UiShared/Category/Category";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineFilter } from "react-icons/hi";

const Buy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedLevel3Category, setSelectedLevel3Category] = useState(null);
  const [filterCategory, setFilterCategory] = useState({
    category: "",
    subCategory: "",
    level3Category: "",
  });
  const [isOpen, setIsOpen] = useState(true); // State to control accordion

  const getCategoryName = (value) => {
    let catName;

    switch (value?.trim()) {
      case "AlternativeMedicines":
        catName = "Alternative Medicines";
        break;

      case "DentalProducts":
        catName = "Dental Products";
        break;

      case "DiagnosticAndMonitoringDevices":
        catName = "Diagnostic and Monitoring Devices";
        break;

      case "DisinfectionAndHygieneSupplies":
        catName = "Disinfection and Hygiene Supplies";
        break;

      case "EmergencyAndFirstAidSupplies":
        catName = "Emergency and First Aid Supplies";
        break;

      case "EyeCareSupplies":
        catName = "Eye Care Supplies";
        break;

      case "HealthcareITSolutions":
        catName = "Healthcare IT Solutions";
        break;

      case "HospitalAndClinicSupplies":
        catName = "Hospital and Clinic Supplies";
        break;

      case "HomeHealthcareProducts":
        catName = "Home Healthcare Products";
        break;

      case "LaboratorySupplies":
        catName = "Laboratory Supplies";
        break;

      case "MedicalConsumablesAndDisposables":
        catName = "Medical Consumables and Disposables";
        break;

      case "MedicalEquipmentAndDevices":
        catName = "Medical Equipment and Devices";
        break;

      case "NutritionAndDietaryProducts":
        catName = "Nutrition and Dietary Products";
        break;

      case "OrthopedicSupplies":
        catName = "Orthopedic Supplies";
        break;

      case "Pharmaceuticals":
        catName = "Pharmaceuticals";
        break;

      case "SkinHairCosmeticSupplies":
        catName = "Skin, Hair and Cosmetic Supplies";
        break;

      case "VitalHealthAndWellness":
        catName = "Vital Health and Wellness";
        break;

      default:
        break;
    }

    return catName;
  };

  const getBreadCrumbs = (pathname, filterCategory) => {
    const crumbs = [{ name: "Buy", path: "/buyer/buy/suppliers" }];
    switch (pathname) {
      case "/buyer/buy/suppliers":
        crumbs.push({ name: "Suppliers", path: "/buyer/buy/suppliers" });
        break;
      case "/buyer/buy/new-products":
        crumbs.push({ name: "New Products", path: "/buyer/buy/new-products" });
        if (filterCategory?.category) {
          crumbs.push({
            name: getCategoryName(filterCategory?.category),
            path: `/buyer/buy/new-products`,
          });
        }
        if (filterCategory?.subCategory) {
          crumbs.push({
            name: filterCategory?.subCategory,
            path: `/buyer/buy/new-products`,
          });
        }
        if (filterCategory?.level3Category) {
          crumbs.push({
            name: filterCategory?.level3Category,
            path: `/buyer/buy/new-products`,
          });
        }
        break;
      case "/buyer/buy/secondary-market":
        crumbs.push({
          name: "Secondary Market",
          path: "/buyer/buy/secondary-market",
        });
        if (filterCategory?.category) {
          crumbs.push({
            name: filterCategory?.category,
            path: `/buyer/buy/secondary-market`,
          });
        }
        if (filterCategory?.subCategory) {
          crumbs.push({
            name: filterCategory?.subCategory,
            path: `/buyer/buy/secondary-market`,
          });
        }
        if (filterCategory?.level3Category) {
          crumbs.push({
            name: filterCategory?.level3Category,
            path: `/buyer/buy/secondary-market`,
          });
        }
        break;
      default:
        crumbs.push({ name: "Suppliers", path: "/buyer/buy/suppliers" });
    }
    return crumbs;
  };

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const crumbs = getBreadCrumbs(location.pathname, filterCategory);
    setBreadcrumbs(crumbs);
  }, [location.pathname, selectedCategory, filterCategory]);
  

  const handleBreadcrumbClick = (path, index) => {
    if (index == 2) {
      const filterData = {
        ...filterCategory,
        subCategory: "",
        level3Category: "",
      };
      setFilterCategory(filterData);
      setSelectedSubCategory(null);
      setSelectedLevel3Category(null);
    } else if (index == 3) {
      const filterData = {
        ...filterCategory,
        level3Category: "",
      };
      setFilterCategory(filterData);
      setSelectedLevel3Category(null);
    } else if (index == 4) {
    } else {
      setFilterCategory("");
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedLevel3Category(null);
      navigate(path);
    }
  };

  useEffect(() => {
    setFilterCategory("");
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedLevel3Category(null);
  }, [location.pathname]);

  const getActiveButtonFromPath = (path) => {
    switch (path) {
      case "/buyer/buy/suppliers":
        return "seller";
      case "/buyer/buy/new-products":
        return "product";
      case "/buyer/buy/secondary-market":
        return "market";
      default:
        return "seller";
    }
  };

  const activeButton = getActiveButtonFromPath(location.pathname);

  const handleButtonClick = (button) => {
    switch (button) {
      case "seller":
        navigate("suppliers");
        break;
      case "product":
        navigate("new-products");
        break;
      case "market":
        navigate("secondary-market");
        break;
      default:
        navigate("suppliers");
    }
  };

  const toggleAccordion = () => {
    setIsOpen(true); 
  };

  return (
    <>
      <div className={styles.main}>
       

        {/* Render breadcrumbs */}
        <div className={styles.breadcrumbSection}>
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.name}>
              <span
                className={`${styles.breadcrumbText} ${
                  index === breadcrumbs.length - 1 ? styles.active : ""
                }`}
                onClick={() => handleBreadcrumbClick(breadcrumb.path, index)}
              >
                {breadcrumb.name}
              </span>
              {index < breadcrumbs.length - 1 && (
                <img className={styles.breadcrumbIcon} src={Right} alt=">" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.innerSection}>
            <div
              className={`${styles.supplierBtn} ${
                activeButton === "seller" ? styles.active : ""
              }`}
              onClick={() => handleButtonClick("seller")}
            >
              Suppliers
            </div>
            <div
              className={`${styles.productBtn} ${
                activeButton === "product" ? styles.active : ""
              }`}
              onClick={() => handleButtonClick("product")}
            >
              New Products
            </div>
            <div
              className={`${styles.productBtn} ${
                activeButton === "market" ? styles.active : ""
              }`}
              onClick={() => handleButtonClick("market")}
            >
              Secondary Market
            </div>
          </div>
       
        </div>

        {activeButton === "seller" && <BuySeller active={activeButton} />}
        {activeButton === "product" && (
          <div>
            <BuyProduct
              active={activeButton}
              isOpen={isOpen}
              toggleAccordion={toggleAccordion}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              selectedLevel3Category={selectedLevel3Category}
              setSelectedLevel3Category={setSelectedLevel3Category}
            />
          </div>
        )}
        {activeButton === "market" && (
          <div>
            <Buy2ndMarket
              active={activeButton}
              isOpen={isOpen}
              toggleAccordion={toggleAccordion}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              selectedLevel3Category={selectedLevel3Category}
              setSelectedLevel3Category={setSelectedLevel3Category}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Buy;
