import React from 'react';
import { Oval } from 'react-loader-spinner';
import styles from './Loader.css';

const Loader = () => {
    return (
        <div className={styles.loaderContainer}>
            <Oval
                height={80}
                width={80}
                color="#282f86"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#282f86"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
        </div>
    );
};

export default Loader;
