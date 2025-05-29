import styles from "./Button.module.css";

function Button({ children, className, onClick, loading, disabled: externalDisabled, ...props }) {
  const classes = [styles.button, className].filter(Boolean).join(" ");

  return (
    <button className={classes} onClick={onClick} disabled={loading} {...props} >
      {loading ? <span className={styles.loadingSpinner}></span> : children}
    </button>
  );
}

export default Button;