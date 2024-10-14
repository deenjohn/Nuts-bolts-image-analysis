import express from 'express';
import * as fs from 'fs';
import cors from "cors";
import imageAnalysis from "./analyseImage.js";
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json({limit : "50mb"}));
app.use(express.urlencoded({extended: true}))


// Route to handle image upload and processing
app.post('/upload', async (req, res) => {
  const imageData = req.body.image;
  // Remove the 'data:image/png;base64,' part to get raw base64 data
  const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
  // Save the image temporarily
  const imagePath = 'captured_image.png';
  fs.writeFileSync(imagePath, base64Data, 'base64');
  // Read the image using Jimp
  await imageAnalysis(imagePath)
    .then((msg) => {
      console.log(msg)
    })
    .catch((err) => {
      console.error('Error processing the image:', err);
      res.status(500).json({ message: 'Error processing the image' });
    });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
