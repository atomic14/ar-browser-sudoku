import Image from "./Image";

// Fast box blur algorithm
// see - https://www.gamasutra.com/view/feature/3102/four_tricks_for_fast_blurring_in_.php?print=1

function precompute(
  bytes: Uint8ClampedArray,
  width: number,
  height: number
): number[] {
  const result: number[] = new Array(bytes.length);
  let dst = 0;
  let src = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let tot = bytes[src];
      if (x > 0) tot += result[dst - 1];
      if (y > 0) tot += result[dst - width];
      if (x > 0 && y > 0) tot -= result[dst - width - 1];
      result[dst] = tot;
      dst++;
      src++;
    }
  }
  return result;
}

// this is a utility function used by DoBoxBlur below
function readP(
  precomputed: number[],
  w: number,
  h: number,
  x: number,
  y: number
): number {
  if (x < 0) x = 0;
  else if (x >= w) x = w - 1;
  if (y < 0) y = 0;
  else if (y >= h) y = h - 1;
  return precomputed[x + y * w];
}

export default function boxBlur(src: Image, boxw: number, boxh: number): Image {
  const { width, height, bytes } = src;
  const precomputed = precompute(bytes, width, height);
  const result = new Uint8ClampedArray(width * height);
  let dst = 0;
  const mul = 1.0 / ((boxw * 2 + 1) * (boxh * 2 + 1));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tot =
        readP(precomputed, width, height, x + boxw, y + boxh) +
        readP(precomputed, width, height, x - boxw, y - boxh) -
        readP(precomputed, width, height, x - boxw, y + boxh) -
        readP(precomputed, width, height, x + boxw, y - boxh);
      result[dst] = tot * mul;
      dst++;
    }
  }
  return new Image(result, width, height);
}
