import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styles from './addproduct.module.css';

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
          width: '100%',
          menubar: false,
          plugins: [
            'lists', 'link', 'table', 'code',
          ],
          toolbar: 'undo redo | blocks | bold italic underline | link table | code | alignleft aligncenter alignright alignjustify',
          contextmenu: 'link table',
          statusbar: false,
          resize: true,
          placeholder: 'Start typing your blog post here...',
          toolbar_sticky: true,
        }}
        onBlur={onBlur}
        onEditorChange={onChange}
      />
      {touched && error && (
        <span className={styles.error} style={{ fontSize: '12px' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default RichTextEditor;