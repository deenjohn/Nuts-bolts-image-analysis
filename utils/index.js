import { intToRGBA } from "@jimp/utils";
export const hasThreeStraightLines = (cluster) => {
    // Placeholder logic for detecting three straight lines
    return cluster.length >= 3; // Example condition - replace with real analysis
};

export const getBoltPositions = (clusters) => {
    return clusters.map((cluster, index) => {
        // Calculate the center for each bolt
        const x = Math.round(
            cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length
        );
        const y = Math.round(
            cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length
        );


        // Determine if the bolt has three straight lines
        const aligned = hasThreeStraightLines(cluster);
        const color = aligned ? "green" : "red"; // Assign color based on alignment


        // Log the detection for each bolt
        console.log(
            `Detected Bolt ${index + 1} at (${x}, ${y}) - ${aligned ? "Aligned" : "Not Aligned"
            }`
        );


        return { x, y, color };
    });
};
export const getWhitePixels = (image, height, width) => {
    // Step 1: Collect white pixels (paint markings) for each bolt
    const whitePixels = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixelColor = image.getPixelColor(x, y);
            const rgba = intToRGBA(pixelColor);


            // Check if pixel is close to white
            if (rgba.r > 200 && rgba.g > 200 && rgba.b > 200) {
                whitePixels.push({ x, y });
            }
        }
    }
    return whitePixels;
};
export const getClusters = (whitePixels, distanceThreshold) => {
    const clusters = []

    whitePixels.forEach((pixel) => {
        let addedToCluster = false;


        for (let cluster of clusters) {
            for (let p of cluster) {
                const distance = Math.sqrt((p.x - pixel.x) ** 2 + (p.y - pixel.y) ** 2);
                if (distance < distanceThreshold) {
                    cluster.push(pixel);
                    addedToCluster = true;
                    break;
                }
            }
            if (addedToCluster) break;
        }


        if (!addedToCluster) {
            clusters.push([pixel]);
        }
    });
    return clusters
};
export const drawCircle = (color, image, x, y) => {

    let hexColor;
    if (color === "green") hexColor = 0x00ff00ff; // Green in RGBA
    if (color === "red") hexColor = 0xff0000ff; // Red in RGBA


    // Draw a filled circle overlay for each bolt
    for (let i = -20; i < 20; i++) {
        for (let j = -20; j < 20; j++) {
            const distance = Math.sqrt(i * i + j * j);
            if (distance <= 20) {
                image.setPixelColor(hexColor, x + i, y + j);
            }
        }
    }
}
