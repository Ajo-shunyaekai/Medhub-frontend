import React from 'react';
import styles from './category.module.css';
import Generics from '../../../../assets/images/Buy/generics.svg';
import Originals from '../../../../assets/images/Buy/orignals.svg';
import Biosimilars from '../../../../assets/images/Buy/biosimilars.svg';
import MedicalDevices from '../../../../assets/images/Buy/medicaldevices.svg';
import Nutraceutical from '../../../../assets/images/Buy/neutraceutical.svg';
import Arrow from '../../../../assets/images/Buy/arrow.svg'; 

const Category = ({ handleCategoryFilter }) => {
    const categories = [
        { name: 'Generics', image: Generics, description: '10+ generic categories and 60+ finished dosage formulations' },
        { name: 'Originals', image: Originals, description: '10+ products' },
        { name: 'Biosimilars', image: Biosimilars, description: '60+ products' },
        { name: 'Medical Devices', image: MedicalDevices, description: '200+ products' },
        { name: 'Nutraceutical', image: Nutraceutical, description: '500+ products' },
    ];

    return (
        <div className={styles.Container}>
            {categories.map((category, index) => (
                <div 
                    key={index}
                    className={styles.section} 
                    onClick={() => handleCategoryFilter(category.name)}
                >
                    <div className={styles.iconMain}>
                        <img 
                            className={`-${index + 1}`} 
                            src={category.image} 
                            alt={category.name}
                        />
                    </div>
                    <div className={styles.head}>{category.name}</div>
                    <div className={styles.content}>{category.description}</div>
                    <div className={styles.icon}>
                        <img src={Arrow} alt="Arrow" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Category;