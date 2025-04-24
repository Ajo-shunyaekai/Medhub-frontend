import React from 'react';
import styles from './addproduct.module.css'
import Tooltip from '@mui/material/Tooltip';
import Information from "../../../../assets/Images/infomation.svg";
 
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