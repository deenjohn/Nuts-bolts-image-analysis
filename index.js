import React, { useRef, useEffect } from 'react';

const CaptureImageCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Access the camera and display video stream
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera: ", err);
      });
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame on canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to a base64 image
      const imageData = canvas.toDataURL('image/png');

      // Send the captured image to the backend server
      fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };

  return (
    <div>
      <h1>Capture Image of Torque Nuts and Bolts</h1>
      <video ref={videoRef} autoPlay></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <button onClick={captureImage}>Capture</button>
    </div>
  );
};

export default CaptureImageCamera;
