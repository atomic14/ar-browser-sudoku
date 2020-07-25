import Image from "./Image";
import { getConnectedComponent } from "./getLargestConnectedComponent";

export interface PuzzleBox {
  x: number;
  y: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  numberImage: Image;
  // filled in later by the OCR code
  contents: number;
}

/**
 * Looks through each box in the puzzle image to see if there is a potential digit in it. If there is an image is extracted that should contain the digit.
 * @param greyScale The greyscale image of the puzzle
 * @param thresholded A thresholded version of the greyscale image
 */
export default function extractBoxes(greyScale: Image, thresholded: Image) {
  const results: PuzzleBox[] = [];
  const size = greyScale.width;
  const boxSize = size / 9;
  const searchSize = boxSize / 5;
  // go through each box and see if it contains anything, if it does get the bounds of the contents and copy it from the greyScale image
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      let minX = Number.MAX_SAFE_INTEGER;
      let minY = Number.MAX_SAFE_INTEGER;
      let maxX = 0;
      let maxY = 0;
      let pointsCount = 0;
      const searchX1 = x * boxSize + searchSize;
      const searchY1 = y * boxSize + searchSize;
      const searchX2 = x * boxSize + boxSize - searchSize;
      const searchY2 = y * boxSize + boxSize - searchSize;
      for (let searchY = searchY1; searchY < searchY2; searchY++) {
        for (let searchX = searchX1; searchX < searchX2; searchX++) {
          if (thresholded.bytes[searchY * size + searchX] === 255) {
            const component = getConnectedComponent(
              thresholded,
              searchX,
              searchY
            );
            const foundWidth =
              component.bounds.bottomRight.x - component.bounds.topLeft.x;
            const foundHeight =
              component.bounds.bottomRight.y - component.bounds.topLeft.y;
            if (
              component.points.length > 10 &&
              foundWidth < boxSize &&
              foundHeight < boxSize
            ) {
              minX = Math.min(minX, component.bounds.topLeft.x);
              minY = Math.min(minY, component.bounds.topLeft.y);
              maxX = Math.max(maxX, component.bounds.bottomRight.x);
              maxY = Math.max(maxY, component.bounds.bottomRight.y);
              pointsCount += component.points.length;
            }
          }
        }
      }
      // sanity check to make sure we actually found something and we didn't get something weird
      const foundWidth = maxX - minX;
      const foundHeight = maxY - minY;
      if (
        pointsCount > 10 &&
        foundWidth < boxSize &&
        foundHeight < boxSize &&
        foundWidth > boxSize / 10 &&
        foundHeight > boxSize / 3
      ) {
        const numberImage = greyScale.subImage(
          Math.max(0, minX - 2),
          Math.max(0, minY - 2),
          Math.min(size - 1, maxX + 2),
          Math.min(size - 1, maxY + 2)
        );
        results.push({
          x,
          y,
          minX,
          maxX,
          minY,
          maxY,
          numberImage,
          contents: 0,
        });
      }
    }
  }
  return results;
}
