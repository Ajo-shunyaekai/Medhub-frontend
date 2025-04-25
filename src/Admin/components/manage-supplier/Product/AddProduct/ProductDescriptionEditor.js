import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styles from './addproduct.module.css'; // Optional CSS module

const RichTextEditor = ({
  value,
  onChange,
  onBlur,
  name,
  label,
  error,
  touched,
  height = 500,
}) => {
  const editorRef = React.useRef(null);

  return (
    <div className={styles.descriptionContainer}>
      {label && (
        <label className={styles.formLabel}>
          {label}
          <span className={styles.labelStamp}>*</span>
        </label>
      )}
      <Editor
        value={value}
        name={name}
        apiKey="wvcl8z7mpoz0ed40t8k6s4a86vd4eegy6w7wryudvgrkdufd"
        onInit={(evt, editor) => {
          editorRef.current = editor;
          
        }}
     
        init={{
          height: height,
          width: "100%",
          menubar: false, // Disable menu bar
          plugins: ["code", "paste"], // Only allow HTML editing
          toolbar: "code", // Only allow HTML view/editing
          content_style: `
            body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; margin: 10px; }
          `,
          paste_auto_cleanup_on_paste: true, // Auto-clean pasted content
          forced_root_block: false, // Prevents automatic paragraph wrapping
          valid_elements: "p,br", // Only allow basic HTML
          contextmenu: false, // Disable right-click menu
          statusbar: false, // Hide the status bar
          resize: false, // Disable resizing
          placeholder: "Enter plain text or HTML...",
        }}
        onBlur={onBlur}
        onEditorChange={onChange}
      />
      {touched && error && (
        <span className={styles.error} style={{ fontSize: "12px" }}>{error}</span>
      )}
    </div>
  );
};

export default RichTextEditor;