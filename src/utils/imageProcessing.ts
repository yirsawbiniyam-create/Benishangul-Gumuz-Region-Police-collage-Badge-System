import { PhotoEnhancementOptions } from "../types";

/**
 * Compress and downscale raw uploaded photo to lightweight JPEG to avoid Firestore 1MB document size limits
 */
export async function compressPhotoForStorage(
  imageSrc: string,
  maxWidth = 350,
  maxHeight = 450,
  quality = 0.8
): Promise<string> {
  if (!imageSrc || !imageSrc.startsWith("data:image")) return imageSrc;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}

/**
 * Process a headshot photo on HTML5 Canvas according to user parameters:
 * - Clean white background
 * - Glare reduction & specular highlight smoothing
 * - Auto brightness and contrast adjustment
 */
export async function processHeadshotPhoto(
  imageSrc: string,
  options: PhotoEnhancementOptions
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Standard passport photo dimension ratio (~300 x 380)
      const targetWidth = 320;
      const targetHeight = 400;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      // Draw original image scaled to fit canvas centered with zoom and offset panning
      const hRatio = targetWidth / img.width;
      const vRatio = targetHeight / img.height;
      const baseRatio = Math.max(hRatio, vRatio);
      const zoom = options.zoom ?? 1;
      const ratio = baseRatio * zoom;

      const drawWidth = img.width * ratio;
      const drawHeight = img.height * ratio;

      const offsetX = options.offsetX ?? 0;
      const offsetY = options.offsetY ?? 0;

      const centerShiftX = (targetWidth - drawWidth) / 2 + offsetX;
      const centerShiftY = (targetHeight - drawHeight) / 2 + offsetY;

      // Fill background white first
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Draw image
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        drawWidth,
        drawHeight
      );

      // Get pixel data for canvas processing
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const data = imageData.data;

      // Calculate average luminance for auto-brightness
      let totalLuminance = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
      }
      const avgLuminance = totalLuminance / (targetWidth * targetHeight);

      // Auto-calculated contrast factor
      const brightnessOffset = options.autoBrightnessContrast
        ? avgLuminance < 110
          ? 25
          : avgLuminance > 180
          ? -15
          : 5
        : 0;

      const userBrightness = options.brightness + brightnessOffset;
      const contrastFactor =
        (259 * (options.contrast + 128)) / (255 * (259 - options.contrast));

      // Process pixel by pixel
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // 1. Auto Background Removal to White if enabled
        if (options.autoWhiteBackground) {
          // Check corner & perimeter background colors (usually light gray/blue/shadow)
          const isNearWhiteOrLightBg =
            r > 200 && g > 200 && b > 200; // Bright backdrop
          const isChromaBg =
            (g > r + 20 && g > b + 20) || (b > r + 30 && b > g + 10); // Green/Blue screen bg
          const isFlatDarkBg = r < 40 && g < 40 && b < 40; // Dark studio backdrop

          // Outer margin detection (edge pixels of canvas are background)
          const pixelIdx = i / 4;
          const x = pixelIdx % targetWidth;
          const y = Math.floor(pixelIdx / targetWidth);
          const isOuterBorder =
            x < 30 || x > targetWidth - 30 || y < 30 || y > targetHeight - 30;

          if (isOuterBorder && (isNearWhiteOrLightBg || isChromaBg || isFlatDarkBg)) {
            r = 255;
            g = 255;
            b = 255;
          }
        }

        // 2. Glare Reduction Filter (Dampen extreme specular highlight glare spots > 245)
        if (options.glareReduction) {
          if (r > 240 && g > 240 && b > 240) {
            // Tone down harsh flash reflection on skin/forehead/glasses
            r = Math.min(235, r * 0.92 + 10);
            g = Math.min(235, g * 0.92 + 10);
            b = Math.min(230, b * 0.90 + 10);
          }
        }

        // 3. Brightness adjustment
        if (userBrightness !== 0) {
          r = Math.min(255, Math.max(0, r + userBrightness));
          g = Math.min(255, Math.max(0, g + userBrightness));
          b = Math.min(255, Math.max(0, b + userBrightness));
        }

        // 4. Contrast adjustment
        if (options.contrast !== 0 || options.autoBrightnessContrast) {
          r = Math.min(255, Math.max(0, contrastFactor * (r - 128) + 128));
          g = Math.min(255, Math.max(0, contrastFactor * (g - 128) + 128));
          b = Math.min(255, Math.max(0, contrastFactor * (b - 128) + 128));
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }

      ctx.putImageData(imageData, 0, 0);

      // Return processed canvas image URL (JPEG quality 0.82 for compact size)
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };

    img.onerror = (err) => {
      console.error("Image loading error in processor:", err);
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}
