import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import PDFIcon from '../assets/images/pdf.png'
// import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfThumbnail = ({ fileUrl, onClick, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    // Safari can't render PDF thumbnails reliably, so show fallback icon
    return (
      <img
        src={PDFIcon}
        alt="PDF"
        onClick={onClick}
        className={className}
        style={{ cursor: 'pointer' }}
      />
    );
  }

  const onDocumentLoadSuccess = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF thumbnail load error:', error);
    setIsLoading(false);
    setHasError(true);
  };

  const onPageLoadError = (error) => {
    console.error('PDF page load error:', error);
    setHasError(true);
  };

  if (hasError) {
    return (
      <img
        src={PDFIcon}
        alt="PDF"
        className={className}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      />
    );
  }

  return (
    <div 
      onClick={onClick} 
      style={{ cursor: 'pointer', position: 'relative' }}
      className={className}
    >
      {isLoading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          fontSize: '12px'
        }}>
          Loading...
        </div>
      )}
      
      <Document
        file={{ url: fileUrl, withCredentials: false }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading=""
      >
        <Page
          pageNumber={1}
          width={150} // Adjust thumbnail size as needed
          onLoadError={onPageLoadError}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
};

export default PdfThumbnail;