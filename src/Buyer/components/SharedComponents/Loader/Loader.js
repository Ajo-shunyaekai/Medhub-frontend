import React from 'react';
import { Oval } from 'react-loader-spinner';
import styles from './loader.module.css';

const Loader = () => {
    return (
        <div className={styles.loaderContainer}>
            <Oval
                height={80}
                width={80}
                color="#0075ce"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#0075ce"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
        </div>
    );
};

export default Loader;
