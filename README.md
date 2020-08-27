# Augmented Reality Sudoku Solver

You can find details on how this project works in the video. You can also try it out here:

https://sudoku.cmgresearch.com

[![Demo Video](https://img.youtube.com/vi/cOC-ad0BsY0/0.jpg)](https://www.youtube.com/watch?v=cOC-ad0BsY0)

This project will let you use your phone (or your computers webcam) as an Augmented Reality camera for solving Sudoku puzzles.

It's an interesting proof of concept to see how powerful browsers on phone are now.

To perform the OCR we use tensorflowjs. The image processing is all carried out in customer code.

Hopefully after watching the video it should be mostly self explanatory...

A good place to start is the code in `app/src/augmentedReality/Processor.ts` as this steps through the processing pipeline described in the video.

# This project consists of two folders:

- app - the JavaScript application that runs in the browser using a phone's camera or webcam
- tensorflow - the training and test code for the neural network used for the OCR

# Building the App

To build the application you will need to have node and yarn installed.

## Setup

```
cd app
yarn
yarn start
```

If you want to run the app locally then you will need to use something like `ngrok` to proxy `https` connections from your phone to your local server (most phones will not allow access to the camera unless the page is served over https).

Running in your desktop browser should work so long as you use the `localhost` connection as this bypasses the `https` requirement.

## Building

```
yarn build
```

# Training the neural network

The application invluces a pretrained network so you only need to do this if you want to train the network on new images.

## Setup

```
cd tensorflow
python3 -m venv venv
. ./venv/bin/activate
pip install -r requirements.txt
```

You will need to go into the `tensorflow/fonts` folder and unzip the fonts files. You'll then need to run the `list.sh` script to update the list of fonts.

```
sh list.sh
```

## Running the notebooks

```
jupyter notebook .
```

There are three notebooks - `train.ipynb`, `test-model.ipynb` and `generate_training_data.ipynb`

`train.ipynb` containts the training code. This is a very simple model so should be trainable on a CPU.

`test-model.ipynb` contains some code for showing which images the network is failing on.

`generate_training_data.ipynb` contains code for creating the training and test set data.
