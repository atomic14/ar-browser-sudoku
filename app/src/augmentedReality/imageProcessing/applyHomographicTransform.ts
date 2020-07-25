import Image from "./Image";
import { Transform } from "./findHomographicTransform";

/**
 * Extracts a square region from the source image using the transform
 * @param source Source image
 * @param size The size of the square area we want to extract
 * @param tranform The homography to apply to map to the source image
 */
export default function extractSquareFromRegion(
  source: Image,
  size: number,
  tranform: Transform
) {
  const { a, b, c, d, e, f, g, h } = tranform;

  const result = Image.withSize(size, size);
  for (let y = 0; y < size; y++) {
    const sxPre1 = b * y + c;
    const sxPre2 = h * y + 1;
    const syPre1 = e * y + f;
    const syPre2 = h * y + 1;

    for (let x = 0; x < size; x++) {
      const sx = Math.floor((a * x + sxPre1) / (g * x + sxPre2));
      const sy = Math.floor((d * x + syPre1) / (g * x + syPre2));
      // TODO - should we interpolate this value?
      result.bytes[y * size + x] = source.bytes[sy * source.width + sx];
    }
  }
  return result;
}
