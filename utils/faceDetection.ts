import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadFaceDetectionModels() {
  if (modelsLoaded) return;
  
  try {
    // Load the required face-api.js models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]);
    
    modelsLoaded = true;
    console.log('Face detection models loaded successfully');
  } catch (error) {
    console.error('Error loading face detection models:', error);
  }
}

export async function detectAndCropFace(imageUrl: string): Promise<string | null> {
  if (!modelsLoaded) {
    await loadFaceDetectionModels();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    
    img.onload = async () => {
      try {
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('Could not get canvas context');
          resolve(null);
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        // Detect faces in the image
        const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();
        
        if (!detections) {
          console.log('No face detected in the image');
          // Instead of returning the original image, create a cropped version of the center
          // This ensures we never show the full original image
          const centerX = img.width / 2;
          const centerY = img.height / 2;
          const size = Math.min(img.width, img.height) * 0.6; // Take 60% of the smaller dimension
          
          const faceCanvas = document.createElement('canvas');
          const faceCtx = faceCanvas.getContext('2d');
          if (!faceCtx) {
            console.error('Could not get face canvas context');
            resolve(null);
            return;
          }
          
          faceCanvas.width = size;
          faceCanvas.height = size;
          
          // Draw the center portion of the image
          faceCtx.drawImage(
            img, 
            centerX - size/2, centerY - size/2, size, size,
            0, 0, size, size
          );
          
          const croppedImageUrl = faceCanvas.toDataURL('image/jpeg');
          resolve(croppedImageUrl);
          return;
        }
        
        // Get the face box with some padding
        const box = detections.detection.box;
        const padding = {
          width: box.width * 0.4,  // 40% padding
          height: box.height * 0.4  // 40% padding
        };
        
        // Create a new canvas for the cropped face
        const faceCanvas = document.createElement('canvas');
        const faceCtx = faceCanvas.getContext('2d');
        if (!faceCtx) {
          console.error('Could not get face canvas context');
          resolve(null);
          return;
        }
        
        // Set dimensions for the cropped face
        const x = Math.max(0, box.x - padding.width / 2);
        const y = Math.max(0, box.y - padding.height / 2);
        const width = Math.min(img.width - x, box.width + padding.width);
        const height = Math.min(img.height - y, box.height + padding.height);
        
        faceCanvas.width = width;
        faceCanvas.height = height;
        
        // Draw the cropped face
        faceCtx.drawImage(
          img, 
          x, y, width, height,
          0, 0, width, height
        );
        
        // Convert canvas to data URL
        const croppedImageUrl = faceCanvas.toDataURL('image/jpeg');
        resolve(croppedImageUrl);
      } catch (error) {
        console.error('Error detecting face:', error);
        resolve(imageUrl); // Return original image on error
      }
    };
    
    img.onerror = () => {
      console.error('Error loading image');
      resolve(null);
    };
  });
}
