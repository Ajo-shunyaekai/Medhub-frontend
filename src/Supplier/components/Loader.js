// components/Loader.js
import React from 'react';
import { Oval } from 'react-loader-spinner';
import styles from '../style/loader.module.css';

const Loader = () => {
    return (
        <div className={styles.loaderContainer}>
            <Oval
                height={80}
                width={80}
                color="#448bff"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#007bff"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
        </div>
    );
};

export default Loader;
