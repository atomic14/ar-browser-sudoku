import Image from "./Image";

export interface Point {
  x: number;
  y: number;
}

export class ConnectedRegion {
  public points: Point[];
  public bounds: { topLeft: Point; bottomRight: Point };
  constructor(points: Point[], topLeft: Point, bottomRight: Point) {
    this.points = points;
    this.bounds = { topLeft, bottomRight };
  }
  get width() {
    return this.bounds.bottomRight.x - this.bounds.topLeft.x;
  }
  get height() {
    return this.bounds.bottomRight.y - this.bounds.topLeft.y;
  }
  get aspectRatio() {
    return this.width / this.height;
  }
}

export function getConnectedComponent(
  image: Image,
  x: number,
  y: number
): ConnectedRegion {
  const { width, height, bytes } = image;
  let minX = x;
  let minY = y;
  let maxX = x;
  let maxY = y;
  const points: Point[] = [];
  const frontier: Point[] = [];
  points.push({ x, y });
  frontier.push({ x, y });
  bytes[y * width + x] = 0;
  while (frontier.length > 0) {
    const seed = frontier.pop()!;
    minX = Math.min(seed.x, minX);
    maxX = Math.max(seed.x, maxX);
    minY = Math.min(seed.y, minY);
    maxY = Math.max(seed.y, maxY);
    for (
      let dy = Math.max(0, seed.y - 1);
      dy < height && dy <= seed.y + 1;
      dy++
    ) {
      for (
        let dx = Math.max(0, seed.x - 1);
        dx < width && dx <= seed.x + 1;
        dx++
      ) {
        if (bytes[dy * width + dx] === 255) {
          points.push({ x: dx, y: dy });
          frontier.push({ x: dx, y: dy });
          bytes[dy * width + dx] = 0;
        }
      }
    }
  }
  return new ConnectedRegion(
    points,
    { x: minX, y: minY },
    { x: maxX, y: maxY }
  );
}

type ConnectedComponentOptions = {
  minAspectRatio: number;
  maxAspectRatio: number;
  minSize: number;
  maxSize: number;
};

/**
 *
 * @param image Input image
 * @param options: Filtering options
 */
export default function getLargestConnectedComponent(
  image: Image,
  {
    minAspectRatio,
    maxAspectRatio,
    minSize,
    maxSize,
  }: ConnectedComponentOptions
): ConnectedRegion | null {
  let maxRegion: ConnectedRegion | null = null;
  // clone the input image as this is a destructive operation
  const tmp = image.clone();
  const { width, height, bytes } = tmp;
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      if (bytes[row + x] === 255) {
        const region = getConnectedComponent(tmp, x, y);
        const width = region.bounds.bottomRight.x - region.bounds.topLeft.x;
        const height = region.bounds.bottomRight.y - region.bounds.topLeft.y;
        if (
          region.aspectRatio >= minAspectRatio &&
          region.aspectRatio <= maxAspectRatio &&
          height >= minSize &&
          width >= minSize &&
          height <= maxSize &&
          width <= maxSize
        ) {
          if (!maxRegion || region.points.length > maxRegion.points.length) {
            maxRegion = region;
          }
        }
      }
    }
  }
  return maxRegion;
}
