import Image from "./Image";
// import gaussianBlur from "./gaussianBlur";
import boxBlur from "./boxBlur";

/**
 * Applies adaptive thresholding to an image. Uses a fast box blur for speed.
 * @param image Image to threshold
 * @param threshold Threshold value - higher removes noise, lower more noise
 */
export default function adaptiveThreshold(
  image: Image,
  threshold: number,
  blurSize: number
): Image {
  const { width, height, bytes } = image;
  const blurred = boxBlur(image, blurSize, blurSize);
  const blurredBytes = blurred.bytes;
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      bytes[row + width + x] =
        blurredBytes[row + x] - bytes[row + width + x] > threshold ? 255 : 0;
    }
  }
  return image;
}
