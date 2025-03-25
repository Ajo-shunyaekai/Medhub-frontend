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
          // No NodeChange event listener here
        }}
        // init={{
        //   height: height,
        //   width: '100%',
        //   menubar: 'file edit view insert format tools table help',
        //   plugins: [
        //     'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        //     'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        //     'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount',
        //     'save', 'emoticons', 'codesample', 'directionality'
        //   ],
        //   toolbar: [
        //     'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | ' +
        //     'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
        //     'link image media table | removeformat | code preview fullscreen | help',
        //     'fontselect fontsizeselect | superscript subscript | charmap emoticons codesample | ltr rtl'
        //   ].join(' '),
        //   content_style: `
        //     body { 
        //       font-family: Helvetica, Arial, sans-serif; 
        //       font-size: 14px; 
        //       margin: 10px; 
        //     }
        //     img { 
        //       max-width: 200px; 
        //       height: auto; 
        //       display: block; 
        //     }
        //     .image-wrapper { 
        //       display: inline-block; 
        //       text-align: center; 
        //       margin: 10px 0; 
        //     }
        //     .image-caption { 
        //       font-size: 12px; 
        //       color: #666; 
        //       margin-top: 5px; 
        //     }
        //     /* Hide the TinyMCE image toolbar */
        //     .tox-pop.tox-pop--bottom, 
        //     .tox-pop.tox-pop--top, 
        //     .tox-pop.tox-pop--left, 
        //     .tox-pop.tox-pop--right {
        //       display: none !important;
        //     }
        //   `,
        //   automatic_uploads: false,
        //   file_picker_types: 'image file media',
        //   file_picker_callback: (callback, value, meta) => {
        //     const input = document.createElement('input');
        //     input.setAttribute('type', 'file');
        //     input.setAttribute('accept', meta.filetype === 'image' ? 'image/*' : '*/*');

        //     input.onchange = function () {
        //       const file = this.files[0];
        //       const fileName = file.name;
        //       const reader = new FileReader();
        //       reader.onload = () => {
        //         const html = `
        //           <div class="image-wrapper">
        //             <img src="${reader.result}" alt="${fileName}" />
        //             <div class="image-caption">${fileName}</div>
        //           </div>
        //         `;
        //         callback(html, { title: fileName });
        //       };
        //       reader.readAsDataURL(file);
        //     };

        //     input.click();
        //   },
        //   // Disable all image-related toolbars and features
        //   quickbars_image_toolbar: false, // Disable quickbars for images
        //   quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
        //   image_advtab: false, // Disable advanced image tab
        //   image_title: false, // Disable image title option
        //   image_caption: false, // Disable image caption option
        //   image_description: false, // Disable image description option
        //   contextmenu: 'link table', // Exclude 'image' from context menu
        //   statusbar: true,
        //   resize: true,
        //   placeholder: 'Start typing here...',
        //   toolbar_sticky: true,
        // }}
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