import * as tf from "@tensorflow/tfjs";
import { setWasmPath } from "@tensorflow/tfjs-backend-wasm";
import { PuzzleBox } from "../imageProcessing/extractBoxes";

setWasmPath(`${process.env.PUBLIC_URL}/tfjs-backend-wasm.wasm`);
const MODEL_URL = `${process.env.PUBLIC_URL}/tfjs_model/model.json`;

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const IMAGE_SIZE = 20;
let _model: tf.LayersModel = undefined;
let modelLoadingPromise: Promise<tf.LayersModel> = undefined;

async function loadModel() {
  if (_model) {
    return _model;
  }
  if (modelLoadingPromise) {
    return modelLoadingPromise;
  }
  modelLoadingPromise = new Promise(async (resolve, reject) => {
    await tf.setBackend("wasm");
    _model = await tf.loadLayersModel(MODEL_URL);
    resolve(_model);
  });
}
loadModel().then(() => console.log("Model Loaded", console.error));

/**
 * Work out what the class should be from the results of the neural network prediction
 * @param logits
 */
export async function getClasses(logits: tf.Tensor<tf.Rank>) {
  const logitsArray = (await logits.array()) as number[][];
  const classes = logitsArray.map((values) => {
    let maxProb = 0;
    let maxIndex = 0;
    values.forEach((value, index) => {
      if (value > maxProb) {
        maxProb = value;
        maxIndex = index;
      }
    });
    return CLASSES[maxIndex];
  });
  return classes;
}

/**
 * Apply our neural network to the extracted images
 * @param boxes A set of puzzle boxes containing images
 */
export default async function fillInPrediction(boxes: PuzzleBox[]) {
  const model = await loadModel();
  const logits = tf.tidy(() => {
    // convert the images into tensors and process them in the same way we did during training
    // if you change the code in the training then update the code here
    const images = boxes.map((box) => {
      const img = tf.browser
        .fromPixels(box.numberImage.toImageData(), 1)
        .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
        .toFloat();
      const mean = img.mean();
      const std = tf.moments(img).variance.sqrt();
      const normalized = img.sub(mean).div(std);
      const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 1]);
      return batched;
    });
    // concatentate all the images for processing all at once
    const input = tf.concat(images);
    // Make the predictions
    return model.predict(input, {
      batchSize: boxes.length,
    });
  });
  // Convert logits to probabilities and class names.
  const classes = await getClasses(logits as tf.Tensor<tf.Rank>);
  // fill in the boxes with the results
  classes.forEach((className, index) => (boxes[index].contents = className));
}
