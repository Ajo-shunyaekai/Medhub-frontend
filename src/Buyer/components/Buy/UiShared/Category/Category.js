import React, { useState, useMemo, useEffect, useRef } from "react";
import styles from "./category.module.css";
import arrow from "../../../../assets/images/arrow.svg";
import category from "../../../../../utils/Category";
import { FaCapsules, FaHeartbeat, FaStar, FaSyringe, FaLeaf, FaPills, FaBandAid, FaStethoscope, FaVial, FaCrutch, FaThermometer, FaDna, FaLungs, FaBone, FaEye, FaBrain, FaTooth } from "react-icons/fa";

const CategoryCard = ({ icon, color, title, description, onClick, isActive }) => {
  return (
    <div className={`${styles.categoryCard} ${isActive ? styles.activeCard : ""}`} onClick={onClick}>
      <div className={styles.cardIconWrapper} style={{ backgroundColor: color }}>
        {icon}
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      <div className={styles.cardArrow}>
        <img src={arrow} alt="arrow" className={styles.arrow} />
      </div>
    </div>
  );
};

const AccordionFilter = ({
  isOpen,
  setFilterCategory,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedLevel3Category,
  setSelectedLevel3Category,
}) => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeCard, setActiveCard] = useState(null); // New state for active card
  const carouselRef = useRef(null);

  // Use imported category data
  const categoryArrays = useMemo(() => category, []);

  // Duplicate cards for seamless looping effect
  const cardsForCarousel = useMemo(() => {
    const numCardsToDuplicate = 5;
    return [
      ...categoryArrays.slice(-numCardsToDuplicate),
      ...categoryArrays,
      ...categoryArrays.slice(0, numCardsToDuplicate),
    ];
  }, [categoryArrays]);

  // Initial scroll to the start of the "real" content
  useEffect(() => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.children[0];
      const cardWidthWithGap = firstCard ? firstCard.offsetWidth + 20 : 0;

      const initialOffset = categoryArrays.length * cardWidthWithGap;
      carouselRef.current.scrollTo({ left: initialOffset, behavior: "instant" });
    }
  }, [categoryArrays]);

  const categoryOptions = categoryArrays.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  const getCategorySchema = (category) => {
    if (!category) return null;
    return categoryArrays.find((cat) => cat.name === category)?.schema || null;
  };

  const handleApply = () => {
    const filterData = {
      category: getCategorySchema(selectedCategory?.label) || "",
      subCategory: selectedSubCategory?.label || "",
      level3Category: selectedLevel3Category?.label || "",
      countries: selectedCountries.map((country) => country.label) || [],
    };
    setFilterCategory(filterData);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedLevel3Category(null);
    setSelectedCountries([]);
    setFilterCategory(null);
    setActiveCard(null); // Reset active card
  };

  const isFilterSelected =
    selectedCategory ||
    selectedSubCategory ||
    selectedLevel3Category ||
    selectedCountries.length > 0;

  // Auto-scrolling effect for carousel
  useEffect(() => {
    let interval;
    if (!isHovered && !isDragging) {
      interval = setInterval(() => {
        if (carouselRef.current) {
          const { scrollWidth, clientWidth, scrollLeft } = carouselRef.current;
          const firstCard = carouselRef.current.children[0];
          const cardWidthWithGap = firstCard ? firstCard.offsetWidth + 20 : 0;

          const realContentStart = categoryArrays.length * cardWidthWithGap;
          const realContentEnd =
            realContentStart + categoryArrays.length * cardWidthWithGap;

          if (scrollLeft + clientWidth >= realContentEnd) {
            carouselRef.current.scrollTo({
              left: realContentStart,
              behavior: "instant",
            });
          } else {
            carouselRef.current.scrollBy({
              left: cardWidthWithGap,
              behavior: "smooth",
            });
          }
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isHovered, isDragging, categoryArrays.length]);

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    setIsHovered(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  // Navigation arrow handlers
  const handlePrevClick = () => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.children[0];
      const cardWidthWithGap = firstCard ? firstCard.offsetWidth + 20 : 0;
      carouselRef.current.scrollBy({
        left: -cardWidthWithGap * 2, // Scroll left by two cards
        behavior: "smooth",
      });
    }
  };

  const handleNextClick = () => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.children[0];
      const cardWidthWithGap = firstCard ? firstCard.offsetWidth + 20 : 0;
      carouselRef.current.scrollBy({
        left: cardWidthWithGap * 2, // Scroll right by two cards
        behavior: "smooth",
      });
    }
  };

  // Define a set of React icons to cycle through
  const iconSet = [
    <FaCapsules size={30} color="#5e676f" strokeWidth={1} />,
    <FaHeartbeat size={30} color="#5e676f" strokeWidth={1} />,
    <FaStar size={30} color="#5e676f" strokeWidth={1} />,
    <FaSyringe size={30} color="#5e676f" strokeWidth={1} />,
    <FaLeaf size={30} color="#5e676f" strokeWidth={1} />,
    <FaPills size={30} color="#5e676f" strokeWidth={1} />,
    <FaBandAid size={30} color="#5e676f" strokeWidth={1} />,
    <FaStethoscope size={30} color="#5e676f" strokeWidth={1} />,
    <FaVial size={30} color="#5e676f" strokeWidth={1} />,
    <FaCrutch size={30} color="#5e676f" strokeWidth={1} />,
    <FaThermometer size={30} color="#5e676f" strokeWidth={1} />,
    <FaDna size={30} color="#5e676f" strokeWidth={1} />,
    <FaLungs size={30} color="#5e676f" strokeWidth={1} />,
    <FaBone size={30} color="#5e676f" strokeWidth={1} />,
    <FaEye size={30} color="#5e676f" strokeWidth={1} />,
    <FaBrain size={30} color="#5e676f" strokeWidth={1} />,
    <FaTooth size={30} color="#5e676f" strokeWidth={1} />,
  ];

  // Define a set of colors to cycle through
  const colorSet = [
    "#d6f3f7", // Light blue
    "#ffded7", // Light red
    "#feead6", // Light yellow
    "#f7f7d6", // Light green
    "#d6f7df", // Light pink
    "#F0F0F0", // Light gray
    "#E0F2F1", // Light teal
    "#FFF3E0", // Light orange
  ];

  // Function to get icon and color based on category index
  const getCategoryIcon = (index) => {
    return iconSet[index % iconSet.length];
  };

  const getCategoryColor = (index) => {
    return colorSet[index % colorSet.length];
  };

  return (
    <div className={styles.filterWrapper}>
      <div className={`${styles.accordionContent} ${isOpen ? styles.open : ""}`}>
        <div className={styles.filterContainer}>
          <div
            className={styles.categoryCardContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              className={styles.navArrowLeft}
              onClick={handlePrevClick}
              aria-label="Previous cards"
            >
              &lt;
            </button>
            <div
              className={`${styles.cardsWrapper} ${isDragging ? styles.dragging : ""}`}
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {cardsForCarousel.map((category, index) => (
                <CategoryCard
                  key={`${category.name}-${index}`}
                  icon={getCategoryIcon(index)}
                  color={getCategoryColor(index)}
                  title={category.name}
                  onClick={() => {
                    setSelectedCategory({ value: category.name, label: category.name });
                    setActiveCard(`${category.name}-${index}`); // Set active card
                  }}
                  isActive={activeCard === `${category.name}-${index}`} // Pass active state
                />
              ))}
            </div>
            <button
              className={styles.navArrowRight}
              onClick={handleNextClick}
              aria-label="Next cards"
            >
              &gt;
            </button>
          </div>
        </div>
        {isFilterSelected && (
          <div className={styles.buttonSection}>
            <button className={styles.applyButton} onClick={handleApply}>
              Apply
            </button>
            <button className={styles.resetButton} onClick={handleReset}>
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionFilter;