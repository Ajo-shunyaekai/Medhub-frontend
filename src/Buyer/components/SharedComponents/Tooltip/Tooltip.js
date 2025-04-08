import React from 'react';
import styles from '../../../../Supplier/components/Products/AddProduct/addproduct.module.css'
import Tooltip from '@mui/material/Tooltip';
import Information from "../../../assets/images/infomation.svg";
 
function CustomTooltip({content}) {
  return (
    <Tooltip className={styles.infoTooltip} title={content}>
      <img                
        src={Information}
        className={styles.iconTooltip}
        alt="information"
      />
    </Tooltip>
  );
}
 
export default CustomTooltip;