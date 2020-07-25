export default class Image {
  public bytes: Uint8ClampedArray;
  public width: number;
  public height: number;
  constructor(bytes: Uint8ClampedArray, width: number, height: number) {
    this.bytes = bytes;
    this.width = width;
    this.height = height;
  }
  static withSize(width: number, height: number) {
    const bytes = new Uint8ClampedArray(width * height);
    return new Image(bytes, width, height);
  }
  public clone(): Image {
    return new Image(
      new Uint8ClampedArray(this.bytes),
      this.width,
      this.height
    );
  }
  public subImage(x1: number, y1: number, x2: number, y2: number): Image {
    const width = x2 - x1;
    const height = y2 - y1;
    const bytes = new Uint8ClampedArray(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        bytes[y * width + x] = this.bytes[(y + y1) * this.width + x + x1];
      }
    }
    return new Image(bytes, width, height);
  }
  public toImageData(): ImageData {
    const imageData = new ImageData(this.width, this.height);
    for (let y = 0; y < this.height; y++) {
      const row = y * this.width;
      for (let x = 0; x < this.width; x++) {
        const value = this.bytes[row + x];
        imageData.data[(row + x) * 4] = value;
        imageData.data[(row + x) * 4 + 1] = value;
        imageData.data[(row + x) * 4 + 2] = value;
        imageData.data[(row + x) * 4 + 3] = 255;
      }
    }
    return imageData;
  }
}
