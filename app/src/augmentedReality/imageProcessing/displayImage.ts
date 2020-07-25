import Image from "./Image";

export default function displayImage(image: Image, canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (context) {
    context.putImageData(image.toImageData(), 0, 0);
  } else {
    console.log("No context");
  }
}
