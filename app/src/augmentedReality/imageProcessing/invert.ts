import Image from "./Image";

/**
 * Inverts a greyscale image returning a new image
 * @param image Input image
 */
export default function invert(image: Image): Image {
  const bytes = image.bytes;
  const invertedBytes = bytes.map((b) => 255 - b);
  return new Image(invertedBytes, image.width, image.height);
}
