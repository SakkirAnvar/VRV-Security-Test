import imageCompression from "browser-image-compression";

// Function to crop the image using canvas
export const getCroppedImage = async (imageSrc, crop, width, height) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    width,
    height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      const randomFileName = `cropped-${Date.now()}}.jpeg`;
      const croppedFile = new File([blob], randomFileName, {
        type: "image/jpeg",
      });
      resolve(croppedFile);
    }, "image/jpeg");
  });
};

// Create image from URL
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

// Function to compress the image
export const compressImage = async (
  file,
  options = { maxSizeMB: 1, maxWidthOrHeight: 420 }
) => {
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    throw error;
  }
};
