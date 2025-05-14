import * as faceapi from "face-api.js";

let modelsLoaded = false;

export async function loadFaceDetectionModels() {
  if (modelsLoaded) return;

  try {
    // Only load the tiny face detector model - it's the lightest and fastest
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

    modelsLoaded = true;
    console.log("Face detection model loaded successfully");
  } catch (error) {
    console.error("Error loading face detection model:", error);
  }
}

// Different cropping modes for different rounds
export type CropMode =
  | "normal"
  | "tight"
  | "eyes-only"
  | "mouth-only"
  | "forehead-only"
  | "random-feature";

export async function detectAndCropFace(
  imageUrl: string,
  cropMode: CropMode = "normal"
): Promise<string | null> {
  if (!modelsLoaded) {
    await loadFaceDetectionModels();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = async () => {
      try {
        // Resize the image for faster processing if it's large
        const MAX_SIZE = 500; // Max width or height
        let processWidth = img.width;
        let processHeight = img.height;

        // Scale down large images for faster processing
        if (img.width > MAX_SIZE || img.height > MAX_SIZE) {
          if (img.width > img.height) {
            processWidth = MAX_SIZE;
            processHeight = Math.floor(img.height * (MAX_SIZE / img.width));
          } else {
            processHeight = MAX_SIZE;
            processWidth = Math.floor(img.width * (MAX_SIZE / img.height));
          }
        }

        // Create a temporary canvas for processing
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = processWidth;
        tempCanvas.height = processHeight;
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) {
          console.error("Could not get canvas context");
          resolve(null);
          return;
        }

        // Draw the resized image for processing
        tempCtx.drawImage(img, 0, 0, processWidth, processHeight);

        // Use optimized detection options
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 320, // smaller input size
          scoreThreshold: 0.5, // balance between speed and accuracy
        });

        // Only detect the face bounding box - no landmarks for better performance
        const detection = await faceapi.detectSingleFace(tempCanvas, options);

        if (!detection) {
          console.log("No face detected in the image");
          // Return a center crop when no face is detected
          const centerX = img.width / 2;
          const centerY = img.height / 2;
          const size = Math.min(img.width, img.height) * 0.6;

          const resultCanvas = document.createElement("canvas");
          resultCanvas.width = size;
          resultCanvas.height = size;
          const resultCtx = resultCanvas.getContext("2d");

          if (!resultCtx) {
            console.error("Could not get result canvas context");
            resolve(null);
            return;
          }

          resultCtx.drawImage(
            img,
            centerX - size / 2,
            centerY - size / 2,
            size,
            size,
            0,
            0,
            size,
            size
          );

          resolve(resultCanvas.toDataURL("image/jpeg", 0.85)); // Use compression for smaller file size
          return;
        }

        // Scale the detection back to original image dimensions
        const scaleX = img.width / processWidth;
        const scaleY = img.height / processHeight;
        const box = {
          x: detection.box.x * scaleX,
          y: detection.box.y * scaleY,
          width: detection.box.width * scaleX,
          height: detection.box.height * scaleY,
        };

        // Adjust cropping based on cropMode
        let x, y, width, height;
        let padding = { width: 0, height: 0 };

        switch (cropMode) {
          case "tight":
            // Tighter crop around the face - less context
            padding = {
              width: box.width * 0.1,
              height: box.height * 0.1,
            };
            break;

          case "eyes-only":
            // Focus on the upper third of the face (eyes)
            padding = {
              width: box.width * 0.1,
              height: box.height * 0.05,
            };
            // Adjust y to focus on eyes region
            box.y = box.y + box.height * 0.1;
            box.height = box.height * 0.35;
            break;

          case "mouth-only":
            // Focus on the lower third of the face (mouth)
            padding = {
              width: box.width * 0.1,
              height: box.height * 0.05,
            };
            // Adjust y to focus on mouth region
            box.y = box.y + box.height * 0.6;
            box.height = box.height * 0.35;
            break;

          case "forehead-only":
            // Focus on the forehead region
            padding = {
              width: box.width * 0.1,
              height: box.height * 0.05,
            };
            // Adjust to focus on forehead
            box.height = box.height * 0.3;
            break;

          case "normal":
          default:
            // Default padding (original behavior)
            padding = {
              width: box.width * 0.4,
              height: box.height * 0.4,
            };
            break;
        }

        // Calculate crop dimensions with padding
        x = Math.max(0, box.x - padding.width / 2);
        y = Math.max(0, box.y - padding.height / 2);
        width = Math.min(img.width - x, box.width + padding.width);
        height = Math.min(img.height - y, box.height + padding.height);

        // Create the final canvas for the cropped face
        const faceCanvas = document.createElement("canvas");
        const faceCtx = faceCanvas.getContext("2d");
        if (!faceCtx) {
          console.error("Could not get face canvas context");
          resolve(null);
          return;
        }

        faceCanvas.width = width;
        faceCanvas.height = height;

        // Draw the cropped face
        faceCtx.drawImage(img, x, y, width, height, 0, 0, width, height);

        // Convert to data URL with compression for smaller size
        resolve(faceCanvas.toDataURL("image/jpeg", 0.85));
      } catch (error) {
        console.error("Error detecting face:", error);
        // Return a center crop on error
        const centerX = img.width / 2;
        const centerY = img.height / 2;
        const size = Math.min(img.width, img.height) * 0.6;

        const resultCanvas = document.createElement("canvas");
        resultCanvas.width = size;
        resultCanvas.height = size;
        const resultCtx = resultCanvas.getContext("2d");

        if (resultCtx) {
          resultCtx.drawImage(
            img,
            centerX - size / 2,
            centerY - size / 2,
            size,
            size,
            0,
            0,
            size,
            size
          );
          resolve(resultCanvas.toDataURL("image/jpeg", 0.85));
        } else {
          resolve(null);
        }
      }
    };

    img.onerror = () => {
      console.error("Error loading image");
      resolve(null);
    };
  });
}
