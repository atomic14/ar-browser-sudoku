import Image from "./Image";

export default function captureImage(video: HTMLVideoElement) {
  const canvas = document.createElement("canvas");
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  // draw the video to the canvas
  context!.drawImage(video, 0, 0, width, height);
  // get the raw image bytes
  const imageData = context!.getImageData(0, 0, width, height);
  // convert to greyscale
  const bytes = new Uint8ClampedArray(width * height);
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      //const r = imageData.data[(y * width + x) * 4];
      const g = imageData.data[(row + x) * 4 + 1];
      // const b = imageData.data[(y * width + x) * 4 + 2];
      // https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
      // const grey = 0.299 * r + 0.587 * g + 0.114 * b;
      bytes[row + x] = g;
    }
  }
  return new Image(bytes, width, height);
}
