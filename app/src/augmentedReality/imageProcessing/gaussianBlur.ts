import Image from "./Image";

// in place guassian blur
export default function gaussianBlur(image: Image) {
  const kernel = [
    0.03426,
    0.037671,
    0.04101,
    0.044202,
    0.047168,
    0.049832,
    0.052124,
    0.053979,
    0.055344,
    0.05618,
    0.056461,
    0.05618,
    0.055344,
    0.053979,
    0.052124,
    0.049832,
    0.047168,
    0.044202,
    0.04101,
    0.037671,
    0.03426,
  ];
  const { width, height, bytes } = image;
  const tmp = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      let value = 0;
      let divider = 0;
      for (let k = -10; k <= 10; k++) {
        if (k + x >= 0 && k + x < width) {
          value += bytes[row + x + k] * kernel[k + 10];
          divider += kernel[k + 10];
        }
      }
      tmp[row + x] = value / divider;
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let value = 0;
      let divider = 0;
      for (let k = -10; k <= 10; k++) {
        if (k + y >= 0 && k + y < height) {
          value += tmp[(k + y) * width + x] * kernel[k + 10];
          divider += kernel[k + 10];
        }
      }
      bytes[y * width + x] = value / divider;
    }
  }
  return image;
}
