import { Jimp } from "jimp";
import { getBoltPositions, getWhitePixels, getClusters, drawCircle } from "./utils/index.js";
import 'dotenv/config'
import {
    PutObjectCommand,
    S3Client,
    GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(process.env.AWS_ACCESS_KEY_ID)

const output_img = "./images/output.png";

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
    signatureVersion: 'v4',
});

export async function getSignedDownloadUrl(params) {
    console.log("params ", params)
    let command = new GetObjectCommand({ Bucket: params.Bucket, Key: params.Key });
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
}


async function imageAnalysis(path_bolts) {

    Jimp.read(path_bolts) // Replace with your image path
        .then(async (image) => {
            // Convert image to grayscale
            image.greyscale();
            // Apply a threshold to isolate bright areas (likely the paint markings)
            image.threshold({ max: 200 });
            const width = image.bitmap.width;
            const height = image.bitmap.height;
            console.log(`Image loaded with dimensions: ${width}x${height}`);
            const whitePixels = getWhitePixels(image, height, width); // Get all white pixels
            // Step 2: Group white pixels into clusters for each bolt
            const distanceThreshold = 30;
            const clusters = getClusters(whitePixels, distanceThreshold);
            // Step 3: Analyze each bolt individually and create bolt positions with assigned colors
            const boltPositions = getBoltPositions(clusters);
            console.log("bolt positions ", boltPositions)
            // Step 4: Draw overlays on the image for each bolt position
            boltPositions.forEach(({ x, y, color }) => drawCircle(color, image, x, y))
            await image.write(output_img); // Save the modified image
            console.log("write image to path ")
            const fileContent = fs.readFileSync(path.join(__dirname, output_img)); //local save
            const params = {
                Bucket: "myawsbucket-camera",
                Key: `output.png`,
                Body: fileContent,
                ContentType: "image/png",

            };
            const command = new PutObjectCommand(params);
            await s3.send(command);
            const url = await getSignedDownloadUrl(params)
            console.log("Image uploaded successfully. s3URL:", url);
        })
        .then(() => {
            console.log(
                "Image with detected bolt positions and color-coded overlays saved successfully!"
            );
            return "success"
        })
        .catch((err) => {
            console.error(err);
            throw Error(err)
        });

}

export default imageAnalysis;