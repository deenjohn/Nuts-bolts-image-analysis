# Image Capture and Analysis App

This application captures images from a video stream (such as a webcam) in a web browser, sends them to a backend server, processes them, and uploads the processed image to AWS S3. This project is designed to work with torque nuts and bolts, analyzing captured images using image processing.

## Features

- Real-time video capture from the user's camera.
- Ability to capture frames as images and send them to the server.
- Image processing using Jimp on the server side to analyze the captured image.
- Upload processed images to AWS S3 and return the image URL.

## Technologies Used:

- Frontend: HTML, JavaScript (for capturing and sending images)
- Backend: Node.js, Express.js (for receiving and processing images)
- Image Processing: Jimp (for analyzing images)
- Cloud Storage: AWS S3 (for storing processed images)
- Other Libraries: dotenv for environment variable management, cors for handling cross-origin requests

# Installation and Setup
git clone https://github.com/yourusername/image-capture-app.git
cd image-capture-app

npm install


- AWS_ACCESS_KEY_ID=your-access-key-id
- AWS_SECRET_ACCESS_KEY=your-secret-access-key
- AWS_REGION=us-east-1

node server.js

.
├── analyseImage.js            # Image analysis logic
├── index.html                 # Frontend interface for capturing images
├── server.js                  # Express server for handling image upload and processing
├── utils/                     # Utility functions for image processing
└── .env                       # Environment variables (not in version control)

# Endpoint
POST /upload: Uploads an image and processes it.
Request Body: { "image": "<base64-encoded-image>" }
Response: { "message": "Image processed and uploaded successfully!", "url": "<s3-image-url>" }

# Troubleshooting
- Camera Not Accessible: Ensure your browser has permissions to access the camera.
- Access Denied on S3: Check bucket permissions to ensure the S3 bucket is accessible. Configure the bucket policy for public access if needed.

- PayloadTooLargeError: Adjust the payload limit in express.json() middleware if images are too large.

# Security Note
Ensure that sensitive information like AWS credentials is not hard-coded in files that may be exposed.
Restrict access to the server if deploying it publicly.


