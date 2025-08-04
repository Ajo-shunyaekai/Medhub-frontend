import React, { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import PDFIcon from "../assets/images/pdf.png"; // fallback icon
 
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
 
const PDFThumbnail = ({ fileUrl, width = 80, onClick }) => {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
 
  useEffect(() => {
const renderThumbnail = async () => {
  try {
    const loadingTask = pdfjs.getDocument(fileUrl);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
 
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
 
    const desiredWidth = 80;
    const desiredHeight = 105;
 
    // Get original viewport at scale 1
    const originalViewport = page.getViewport({ scale: 1 });
 
    // Calculate scale to force render into fixed size
    const scaleX = desiredWidth / originalViewport.width;
    const scaleY = desiredHeight / originalViewport.height;
 
    // Set canvas size
    canvas.width = desiredWidth;
    canvas.height = desiredHeight;
 
    // Use original viewport + transform inside render() (not viewport)
    await page.render({
      canvasContext: context,
      viewport: originalViewport,
      transform: [scaleX, 0, 0, scaleY, 0, 0],
    }).promise;
 
    setLoaded(true);
  } catch (err) {
    console.error("Thumbnail render error:", err);
    setError(true);
  }
};
 
 
 
    if (fileUrl) {
      setLoaded(false);
      setError(false);
      renderThumbnail();
    }
  }, [fileUrl, width]);
 
  if (error) {
    return (
      <img
        src={PDFIcon}
        alt="PDF"
        style={{
          width,
          height: (width * 1.3),
          objectFit: "contain",
          borderRadius: 4,
          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
        }}
      />
    );
  }
 
  return (
    <div
      onClick={onClick}
      style={{
        width: 80,
        height: (width * 1.3),
        position: "relative",
        borderRadius: 4,
        boxShadow: "0 0 5px rgba(0,0,0,0.2)",
        backgroundColor: "#f5f5f5",
        cursor: "pointer",
      }}
    >
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "#666",
          }}
        >
          Loading...
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: loaded ? "block" : "none" }} />
    </div>
  );
};
 
export default PDFThumbnail;