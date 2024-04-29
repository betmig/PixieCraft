class ImageProcessor {
  greyscaleFilter(img) {
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    // Precalculate luma coefficients
    const rCoefficient = 0.299;
    const gCoefficient = 0.587;
    const bCoefficient = 0.114;

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        let index = (x + y * img.width) * 4;
        let r = img.pixels[index];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];

        // Calculate grayscale value using optimized luma calculation
        let grey = rCoefficient * r + gCoefficient * g + bCoefficient * b;

        // Assign grayscale value to all channels
        imgOut.pixels[index] = grey;
        imgOut.pixels[index + 1] = grey;
        imgOut.pixels[index + 2] = grey;
        imgOut.pixels[index + 3] = 255; // Set alpha
      }
    }
    imgOut.updatePixels();
    return imgOut;
  }

  splitChannels(img) {
    let redChannel = createImage(img.width, img.height);
    let greenChannel = createImage(img.width, img.height);
    let blueChannel = createImage(img.width, img.height);

    img.loadPixels();
    redChannel.loadPixels();
    greenChannel.loadPixels();
    blueChannel.loadPixels();

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        let index = (x + y * img.width) * 4;

        // Extract pixel values for each channel directly from the original image
        redChannel.pixels[index] = img.pixels[index]; // Red channel
        greenChannel.pixels[index + 1] = img.pixels[index + 1]; // Green channel
        blueChannel.pixels[index + 2] = img.pixels[index + 2]; // Blue channel

        // Set alpha for all channels
        redChannel.pixels[index + 3] = 255;
        greenChannel.pixels[index + 3] = 255;
        blueChannel.pixels[index + 3] = 255;
      }
    }

    // Update pixels for each channel once all values are assigned
    redChannel.updatePixels();
    greenChannel.updatePixels();
    blueChannel.updatePixels();

    return [redChannel, greenChannel, blueChannel];
  }

    /*
        Image segmentation with individual channel sliders (red, green, blue) showcases distinct
        results across channels due to inherent differences in color intensity distributions.
        This leads to varied segmentation effects:

          - Variability in Segmentation: Segmentation outcomes differ significantly among the red,
          green, and blue channels. This is attributed to the unique intensity profiles of each color
          component within the original image. Certain features may be more pronounced or subdued in
          one channel compared to others, reflecting the image's color composition.

          - Channel-Specific Details: The segmentation's sensitivity to specific color ranges allows
          for targeted isolation or suppression of features by adjusting the corresponding channel's
          threshold. This is particularly evident in images with dominant colors, where the right 
          threshold setting can highlight or conceal specific elements.

          - Optimized Pixel Processing & Application of Insights: Efficiency enhancements in pixel
          processing support smooth, real-time slider adjustments. These technical improvements, 
          combined with an understanding of each channel's segmentation behavior, empower nuanced 
          color-based differentiation. This is vital for fields requiring precise color segmentation,
          such as digital art, medical imaging, or object detection under diverse lighting.

        These enhancements enable a detailed exploration of color-based segmentation, demonstrating
        how individual channel thresholds influence the segmentation outcome.
        The approach underscores the importance of recognizing and adjusting to the distinct
        characteristics of each color channel for tailored image analysis and processing.

        Comment for code below vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv */

  segmentImage(img, redThreshold, greenThreshold, blueThreshold) {
    let segmentedImg = createImage(img.width, img.height);
    segmentedImg.loadPixels();
    img.loadPixels();

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        let index = (x + y * img.width) * 4;
        let r = img.pixels[index];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];

        // Apply segmentation thresholds
        let redSegmented = r > redThreshold ? 255 : 0;
        let greenSegmented = g > greenThreshold ? 255 : 0;
        let blueSegmented = b > blueThreshold ? 255 : 0;

        // Assign segmented values to respective channels
        segmentedImg.pixels[index] = redSegmented;
        segmentedImg.pixels[index + 1] = greenSegmented;
        segmentedImg.pixels[index + 2] = blueSegmented;
        segmentedImg.pixels[index + 3] = 255; // Set alpha
      }
    }

    segmentedImg.updatePixels();
    return segmentedImg;
  }

  // RGB to HSV
  rgbToHsv(img) {
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
      let r = img.pixels[i] / 255;
      let g = img.pixels[i + 1] / 255;
      let b = img.pixels[i + 2] / 255;

      let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        v = max;

      let d = max - min;
      s = max == 0 ? 0 : d / max;

      if (max == min) {
        h = 0; // achromatic
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      // Convert h, s, v values back to 0-255 range for display
      imgOut.pixels[i] = h * 255;
      imgOut.pixels[i + 1] = s * 255;
      imgOut.pixels[i + 2] = v * 255;
      imgOut.pixels[i + 3] = 255; // alpha
    }

    imgOut.updatePixels();
    return imgOut;
  }
  // RGB to YCbCr
  rgbToYCbCr(img) {
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
      let r = img.pixels[i];
      let g = img.pixels[i + 1];
      let b = img.pixels[i + 2];

      let y = 0.299 * r + 0.587 * g + 0.114 * b;
      let cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
      let cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;

      imgOut.pixels[i] = y;
      imgOut.pixels[i + 1] = cb;
      imgOut.pixels[i + 2] = cr;
      imgOut.pixels[i + 3] = 255; // alpha
    }

    imgOut.updatePixels();
    return imgOut;
  }

    /*
      Comparative Commentary on Segmentation Methods:

       1. Noise and Clarity: RGB-based segmentation might produce noisier results due to its
      straightforward color thresholding, which might not distinguish well between subtle color
      variations. In contrast, HSV and YCbCr methods focus on human perceptual aspects like
      luminance and color saturation, leading to potentially clearer segmentation outcomes.

      2. Colorfulness: The RGB method can result in a more binary, less colorful appearance
      due to its per-channel thresholding. HSV and YCbCr approaches, with their adjustments
      to saturation and chrominance, maintain more of the original image's color richness.

      3. Usability and Flexibility: Sliders for dynamic threshold adjustment in HSV and YCbCr
      offer intuitive control, allowing users to fine-tune segmentation based on visual perception
      (e.g., brightness, color intensity) more directly than RGB.

      4. Segmentation Quality: HSV segmentation is beneficial for images where brightness and
      saturation are crucial, offering better segmentation in such cases. YCbCr's separation of
      luminance from chrominance can improve segmentation under varied lighting and color conditions,
      making it a versatile choice for diverse applications.

      Comment for code below vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv */

  // Colorful segmentation in HSV
  colorfulSegmentHSV(img, valueThreshold) {
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
      let v = img.pixels[i + 2]; // Value component
      if (v > valueThreshold) {
        img.pixels[i + 1] = min(img.pixels[i + 1] * 1.2, 255) / 2; // Increase saturation - Divided by 2 for more segmentation
        img.pixels[i + 2] = min(v * 1.1, 255); // Increase brightness/value
      }
    }
    img.updatePixels();
    return img;
  }

  // Colorful segmentation in YCbCr
  colorfulSegmentYCbCr(img, yThreshold) {
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
      let y = img.pixels[i]; // Luminance component
      if (y > yThreshold) {
        img.pixels[i + 1] = min(img.pixels[i + 1] * 1.1, 255) * 2; // Adjust Cb - Added * 2 for more segmentation
        img.pixels[i + 2] = min(img.pixels[i + 2] * 1.1, 255) * 2; // Adjust Cr - Added * 2 for more segmentation
      }
    }
    img.updatePixels();
    return img;
  }

  highContrastGreyscaleFilter(img) {
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    // Threshold for high contrast adjustment
    const threshold = 128; // Midpoint of 0-255 scale

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        let index = (x + y * img.width) * 4;
        let r = img.pixels[index];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];

        // Calculate grayscale value using luma calculation
        let grey = 0.299 * r + 0.587 * g + 0.114 * b;

        // Apply high contrast based on the threshold
        grey = grey < threshold ? 0 : 255;

        imgOut.pixels[index] = grey;
        imgOut.pixels[index + 1] = grey;
        imgOut.pixels[index + 2] = grey;
        imgOut.pixels[index + 3] = 255; // Set alpha
      }
    }
    imgOut.updatePixels();
    return imgOut;
  }

  // Blur filter using convolution
  blurFilter(img) {
    const matrix = [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ];

    var imgOut = createImage(img.width, img.height);
    var matrixSize = matrix.length;

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < img.width; x++) {
      for (var y = 0; y < img.height; y++) {
        var index = (y * img.width + x) * 4;

        var c = this.convolution(x, y, matrix, matrixSize, img);

        imgOut.pixels[index + 0] = c[0];
        imgOut.pixels[index + 1] = c[1];
        imgOut.pixels[index + 2] = c[2];
        imgOut.pixels[index + 3] = 255;
      }
    }
    imgOut.updatePixels();
    return imgOut;
  }

  convolution(x, y, matrix, matrixSize, img) {
    var totalRed = 0;
    var totalGreen = 0;
    var totalBlue = 0;

    var offset = floor(matrixSize / 2);

    for (var i = 0; i < matrixSize; i++) {
      for (var j = 0; j < matrixSize; j++) {
        var xloc = x + i - offset;
        var yloc = y + j - offset;

        var index = (img.width * yloc + xloc) * 4;

        index = constrain(index, 0, img.pixels.length - 1);

        totalRed += img.pixels[index + 0] * matrix[i][j];
        totalGreen += img.pixels[index + 1] * matrix[i][j];
        totalBlue += img.pixels[index + 2] * matrix[i][j];
      }
    }

    return [totalRed, totalGreen, totalBlue];
  }
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  // Ensure that result is not undefined before accessing its properties
  if (result && result.alignedRect) {
    detections = result; // Assuming this is a single detection result, not an array
  }
}

var capture;
var capture2;
var redSlider, greenSlider, blueSlider;
var redChannelImg, greenChannelImg, blueChannelImg;
var faceApi;
var detections = [];
var faceDetectionCanvas;
var lastDetectionResult = null;
var funCanvas;
var processor = new ImageProcessor();
const detectionOptions = {
  withLandmarks: true,
  withDescriptors: false,
};

let shooterSound;

function preload() {
  // Load the shooter sound file
  shooterSound = loadSound('./sounds/sound-effect-twinklesparkle-115095.mp3');
}


function setup() {
  // Set the resolution to a smaller size, to help with performance
  captureWidth = 160;
  captureHeight = 120;

  capture = createCapture(VIDEO);
  capture.size(captureWidth, captureHeight);
  capture.parent("content-box-1");

  // Ensure the video stream is ready before starting detection
  capture.elt.onloadedmetadata = () => {
    initializeFaceDetection();
  };

  // Create a p5 canvas specifically for face detection drawing.
  faceDetectionCanvas = createCanvas(captureWidth, captureHeight);
  faceDetectionCanvas.parent("content-box-13");


  function initializeFaceDetection() {
    faceapi = ml5.faceApi(capture.elt, detectionOptions, modelReady);
    faceapi.detectSingle(capture2, gotResults);
  }

  function modelReady() {
    console.log(faceapi);
    console.log("ml5 face api model is ready.");
  }

  capture2 = createCapture(VIDEO);
  capture2.size(captureWidth, captureHeight);
  capture2.parent("content-box-10");

  // Create sliders for each channel
  redSlider = createSlider(0, 255, 128);
  greenSlider = createSlider(0, 255, 128);
  blueSlider = createSlider(0, 255, 128);

  // Position the sliders
  redSlider.parent("box-7");
  greenSlider.parent("box-8");
  blueSlider.parent("box-9");

  // Initialize sliders for HSV Value and YCbCr Y threshold
  hsvValueSlider = createSlider(0, 255, 128);
  yCbCrYSlider = createSlider(0, 255, 128);

  // Position the sliders for hsv and ycbcry
  hsvValueSlider.parent("box-14");
  yCbCrYSlider.parent("box-15");

  // Initialize and position funFilter sliders
  funFilterSlider = createSlider(0, 255, 128);
  funFilterSlider.parent("box-3");
}

let blurApplied = false; //flag for debugging

function keyPressed() {
  shooterSound.play();
  if (key !== "g" && key !== "b" && key !== "c" && key !== "p" && key !== "f") {
    // Clear the content of the content boxes before adding new images
    for (let i = 1; i <= 15; i++) {
      if (i === 1 || i === 10) continue; // Skip clearing content for boxes 1 and 10 because they're the webcam streams

      let contentBoxId = "content-box-" + i;
      let contentBox = document.getElementById(contentBoxId);
      if (contentBox) {
        // Check if the element exists to avoid errors
        contentBox.innerHTML = "";
      }
    }

    funFilter(); // Fun filter is triggered with any key since, it looks odd if it does not but it will still mapped to f

    // Process the capture with any method from ImageProcessor
    let processedImage = processor.greyscaleFilter(capture);
    processedImage.loadPixels();

    // Convert the processed p5.Image to a data URL
    let imageDataURL = processedImage.canvas.toDataURL();

    // Create an img element or select existing one in the content box
    let imgElement = document.createElement("img");
    imgElement.src = imageDataURL;

    // Insert or replace the img element in the specified content box
    let contentBox2 = document.getElementById("content-box-2");

    // Clear previous content if necessary
    contentBox2.innerHTML = "";
    contentBox2.appendChild(imgElement);

    // Split the channels
    let channels = processor.splitChannels(processedImage);
    redChannelImg = channels[0];
    greenChannelImg = channels[1];
    blueChannelImg = channels[2];

    // Display each channel
    displayImage(redChannelImg, "content-box-4"); // Red channel
    displayImage(greenChannelImg, "content-box-5"); // Green channel
    displayImage(blueChannelImg, "content-box-6"); // Blue channel

    // Add copies of red, green, and blue channel images to their respective content boxes
    addChannelCopyToContentBox(redChannelImg, "content-box-7");
    addChannelCopyToContentBox(greenChannelImg, "content-box-8");
    addChannelCopyToContentBox(blueChannelImg, "content-box-9");

    // Process the capture with segmentation
    let redThreshold = redSlider.value();
    let greenThreshold = greenSlider.value();
    let blueThreshold = blueSlider.value();

    let segmentedRedImg = processor.segmentImage(
      redChannelImg,
      redThreshold,
      0,
      0
    );
    let segmentedGreenImg = processor.segmentImage(
      greenChannelImg,
      0,
      greenThreshold,
      0
    );
    let segmentedBlueImg = processor.segmentImage(
      blueChannelImg,
      0,
      0,
      blueThreshold
    );

    // Display segmented images
    displayImage(segmentedRedImg, "content-box-7");
    displayImage(segmentedGreenImg, "content-box-8");
    displayImage(segmentedBlueImg, "content-box-9");

    let hsvImage = processor.rgbToHsv(capture2);
    let yCbCrImage = processor.rgbToYCbCr(capture2);

    // Display HSV image
    displayImage(hsvImage, "content-box-11");

    // Display YCbCr image
    displayImage(yCbCrImage, "content-box-12");

    let hsvSegmentedImage = processor.colorfulSegmentHSV(
      hsvImage,
      hsvValueSlider.value()
    );
    addChannelCopyToContentBox(hsvSegmentedImage, "content-box-14");

    // Colorful Segment YCbCr Image based on the Y slider and display it
    let yCbCrSegmentedImage = processor.colorfulSegmentYCbCr(
      yCbCrImage,
      yCbCrYSlider.value()
    );
    addChannelCopyToContentBox(yCbCrSegmentedImage, "content-box-15");

    // Create a p5.Graphics object for drawing the results
    let graphics = createGraphics(160, 120);
    graphics.clear();

    // Trigger face detection directly on the video element of capture2
    faceapi.detectSingle(capture2.elt, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      if (result && result.alignedRect) {
        // Draw the video frame to the graphics object
        graphics.image(capture2, 0, 0, 160, 120);

        // Now draw the detection results (box and landmarks)
        drawBoxAndLandmarks(graphics, result);

        // Display the graphics object in box-13
        let contentBox13 = document.getElementById("content-box-13");
        contentBox13.innerHTML = ""; // Clear previous content
        let imgElement = document.createElement("img");
        imgElement.src = graphics.elt.toDataURL();
        imgElement.style.width = "160px";
        imgElement.style.height = "120px";
        contentBox13.appendChild(imgElement);

        lastDetectionResult = result;
      } else {
        console.log("No face detected.");
      }
    });
  }

  switch (key.toLowerCase()) {
    case "g":
      applyHighContrastGreyscaleFilter();
      break;
    case "b":
      applyBlurFilter();
      break;
    case "c":
      yCbCrFilter();
      break;
    case "p":
      pixelateFilter();
      break;
    case "f":
      funFilter();
      break;
  }
}

//Helper functions
function displayImage(image, contentBoxId) {
  // Convert the processed p5.Image to a data URL
  let imageDataURL = image.canvas.toDataURL();

  // Create an img element or select existing one in the content box
  let imgElement = document.createElement("img");
  imgElement.src = imageDataURL;

  // Insert or replace the img element in the specified content box
  let contentBox = document.getElementById(contentBoxId);
  // Clear previous content if necessary
  contentBox.innerHTML = "";
  contentBox.appendChild(imgElement);
}

function addChannelCopyToContentBox(channelImg, contentBoxId) {
  // Convert the processed p5.Image to a data URL
  let imageDataURL = channelImg.canvas.toDataURL();

  // Create an img element or select existing one in the content box
  let imgElement = document.createElement("img");
  imgElement.src = imageDataURL;

  // Insert or replace the img element in the specified content box
  let contentBox = document.getElementById(contentBoxId);
  // Clear previous content if necessary
  contentBox.innerHTML = "";
  // Append a copy of the channel image to the content box
  contentBox.appendChild(imgElement.cloneNode(true));
}

function drawBoxAndLandmarks(graphics, detection) {
  // Check if detection result is not undefined
  if (detection && detection.alignedRect) {
    const { _x, _y, _width, _height } = detection.alignedRect._box;
    graphics.stroke(255, 0, 0); // Red color for the box
    graphics.strokeWeight(2);
    graphics.noFill();
    graphics.rect(_x, _y, _width, _height);

    // Draw landmarks if they exist
    if (detection.landmarks) {
      graphics.stroke(161, 95, 251); // Purple color for landmarks
      graphics.strokeWeight(2);
      detection.landmarks.positions.forEach((position) => {
        graphics.point(position._x, position._y);
      });
    }
  }
}

function applyHighContrastGreyscaleFilter() {
  // Ensure there's a last detection result or simply process the whole frame
  let img = capture2; // Or however you obtain the current frame
  let processedImage = processor.highContrastGreyscaleFilter(img);
  updateDisplayWithGraphics(processedImage, "content-box-13");
}

function applyBlurFilter() {
  let img = capture2; // Assuming this is the current video frame you want to process
  let processedImage = processor.blurFilter(img);
  updateDisplayWithGraphics(processedImage, "content-box-13");
}

function funFilter() {
  let snapshot = createImage(captureWidth, captureHeight);
  snapshot.copy(capture2, 0, 0, captureWidth, captureHeight, 0, 0, captureWidth, captureHeight);
  snapshot.loadPixels();

  let graphics = createGraphics(captureWidth, captureHeight);
  graphics.clear();

  // Get the current value of the slider
  let sliderValue = funFilterSlider.value();

  faceapi.detect(capture2.elt, function (err, results) {
    if (err) {
      console.error(err);
      return;
    }
    if (results && results.length > 0) {
      graphics.image(snapshot, 0, 0);
      results.forEach((result) => {
        if (result.landmarks) {
          const leftEye = result.landmarks.positions[36]; 
          const rightEye = result.landmarks.positions[45];
          let faceWidth = result.detection._box.width;

          // Pass the sliderValue to control the quantity of graphics
          generateGraphics(graphics, leftEye._x, leftEye._y, rightEye._x, rightEye._y, faceWidth, sliderValue);
        }
      });
      updateDisplayWithGraphics(graphics, "content-box-3");
    } else {
      updateDisplayWithGraphics(snapshot, "content-box-3");
    }
  });
}

function generateGraphics(graphics, leftEyeX, leftEyeY, rightEyeX, rightEyeY, faceWidth, sliderValue) {
  let quantity = map(sliderValue, 0, 255, 1, 5);
  
  let eyeOffsetY = faceWidth / 15; 
  let decorationSize = faceWidth / 15; 

  let leftCheekX = leftEyeX - faceWidth / 5;
  let rightCheekX = rightEyeX + faceWidth / 5;
  let cheekY = (leftEyeY + rightEyeY) / 2 + eyeOffsetY;

  let offsetRange = decorationSize * 2;

  for (let i = 0; i < quantity; i++) {
    let xOffset = random(-offsetRange, offsetRange); // Random x offset
    let yOffset = random(-offsetRange, offsetRange); // Random y offset

    // Adjust the position of the star or heart based on the random offsets
    let starX = leftCheekX + xOffset;
    let starY = cheekY + yOffset;
    let heartX = rightCheekX + xOffset;
    let heartY = cheekY + yOffset;

    // Draw the star and heart at the randomized positions
    let yellowShade = random(200, 255); // Random shade of yellow
    graphics.fill(255, yellowShade, 0); // Yellow color for stars
    let starSize = random(decorationSize / 3, decorationSize); // Random star size
    drawStar(graphics, starX, starY, starSize, starSize * 2, 5); // Adjusted star size range

    let pinkShade = random(100, 255); // Random shade of pink/red
    graphics.fill(255, pinkShade, pinkShade); // Pink/red color for hearts
    let heartSize = random(decorationSize / 1, decorationSize * 3); // Random heart size
    drawHeart(graphics, heartX, heartY, heartSize);
  }
}

function drawStar(graphics, x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  graphics.beginShape();
  for (let i = 0; i < TWO_PI; i += angle) {
    let sx = x + cos(i) * radius2;
    let sy = y + sin(i) * radius2;
    graphics.vertex(sx, sy);
    sx = x + cos(i + halfAngle) * radius1;
    sy = y + sin(i + halfAngle) * radius1;
    graphics.vertex(sx, sy);
  }
  graphics.endShape(CLOSE);
}

function drawHeart(graphics, x, y, size) {
  graphics.beginShape();
  graphics.vertex(x, y);
  graphics.bezierVertex(
    x - size / 2,
    y - size / 2,
    x - size,
    y + size / 3,
    x,
    y + size
  );
  graphics.bezierVertex(
    x + size,
    y + size / 3,
    x + size / 2,
    y - size / 2,
    x,
    y
  );
  graphics.endShape(CLOSE);
}

function yCbCrFilter() {
  // Take a snapshot from capture2
  let snapshot = createImage(capture2.width, capture2.height);
  snapshot.copy(
    capture2,
    0,
    0,
    capture2.width,
    capture2.height,
    0,
    0,
    capture2.width,
    capture2.height
  );
  snapshot.loadPixels();

  // Detect faces on the snapshot
  faceapi.detect(capture2.elt, function (err, results) {
    if (err) {
      console.error(err);
      return;
    }
    if (results && results.length > 0) {
      results.forEach((result) => {
        // Assuming result.detection is available and contains the bounding box
        const { _x, _y, _width, _height } = result.detection._box;
        // Apply YCbCr filter only within the detected face region
        for (let x = Math.floor(_x); x < Math.floor(_x + _width); x++) {
          for (let y = Math.floor(_y); y < Math.floor(_y + _height); y++) {
            let index = (y * snapshot.width + x) * 4;
            if (index >= 0 && index < snapshot.pixels.length - 3) {
              let r = snapshot.pixels[index];
              let g = snapshot.pixels[index + 1];
              let b = snapshot.pixels[index + 2];

              // Convert RGB to YCbCr
              let y = 0.299 * r + 0.587 * g + 0.114 * b;
              let cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
              let cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;

              // Reassign the converted YCbCr values back to the pixels
              snapshot.pixels[index] = y;
              snapshot.pixels[index + 1] = cb;
              snapshot.pixels[index + 2] = cr;
            }
          }
        }
      });

      snapshot.updatePixels();
      // Display the modified snapshot in 'content-box-13'
      updateDisplayWithGraphics(snapshot, "content-box-13");
    }
  });
}

function pixelateFilter() {
  // Take a snapshot from capture2
  let snapshot = createImage(capture2.width, capture2.height);
  snapshot.copy(
    capture2,
    0,
    0,
    capture2.width,
    capture2.height,
    0,
    0,
    capture2.width,
    capture2.height
  );
  snapshot.loadPixels();

  // Detect faces on the snapshot
  faceapi.detect(capture2.elt, function (err, results) {
    if (err) {
      console.error(err);
      return;
    }
    if (results && results.length > 0) {
      results.forEach((result) => {
        const { _x, _y, _width, _height } = result.detection._box;

        // Process each 5x5 block within the detected face region for pixelation in color
        for (let x = Math.floor(_x); x < Math.floor(_x + _width); x += 5) {
          for (let y = Math.floor(_y); y < Math.floor(_y + _height); y += 5) {
            let sumR = 0,
              sumG = 0,
              sumB = 0;
            let count = 0;

            // Calculate the average RGB values within the block
            for (let bx = 0; bx < 5; bx++) {
              for (let by = 0; by < 5; by++) {
                if (x + bx < snapshot.width && y + by < snapshot.height) {
                  let index = ((y + by) * snapshot.width + (x + bx)) * 4;
                  sumR += snapshot.pixels[index];
                  sumG += snapshot.pixels[index + 1];
                  sumB += snapshot.pixels[index + 2];
                  count++;
                }
              }
            }

            let aveR = sumR / count;
            let aveG = sumG / count;
            let aveB = sumB / count;

            // Paint the block with the average RGB values
            for (let bx = 0; bx < 5; bx++) {
              for (let by = 0; by < 5; by++) {
                if (x + bx < snapshot.width && y + by < snapshot.height) {
                  let index = ((y + by) * snapshot.width + (x + bx)) * 4;
                  snapshot.pixels[index] = aveR;
                  snapshot.pixels[index + 1] = aveG;
                  snapshot.pixels[index + 2] = aveB;
                }
              }
            }
          }
        }
      });

      snapshot.updatePixels();
      // Display the modified snapshot in 'content-box-13'
      updateDisplayWithGraphics(snapshot, "content-box-13");
    }
  });
}

function updateDisplayWithGraphics(graphics, contentBoxId) {
  let contentBox = document.getElementById(contentBoxId);
  contentBox.innerHTML = ""; // Clear previous content
  let imgElement = document.createElement("img");
  imgElement.src = graphics.canvas.toDataURL();
  imgElement.style.width = "160px";
  imgElement.style.height = "120px";
  contentBox.appendChild(imgElement);
}

/*
   This file contains the main sketch logic for the project, including the implementation
   of image segmentation using each color channel. Let's discuss the challenges faced,
   solutions implemented, project completion status, and the unique extension idea.

   Challenges Faced:
   - Manipulating Copied Image:
     The main challenge was manipulating a copied image in the backend and pushing it
     into the frontend without using a giant canvas. Each small box represents a canvas
     element, which added complexity to the manipulation process.

   Solutions Implemented:
   - Utilized createImage() function:
     Separate image objects were created for each color channel (red, green, and blue)
     using the createImage() function.
   - Loaded and Updated Pixels:
     Pixels of the original image and each channel image were loaded using loadPixels(),
     and their values were updated accordingly.
   - Displaying Color Channels:
     The resulting color channel images were displayed on the canvas using the image()
     function.

   Project Completion:
   - On Target:
     Despite the challenges, the project was completed a month ahead of schedule.
   - Browser Compatibility Issue:
     An issue was encountered with the ml5 library not loading well in Firefox due to
     browser security measures. To avoid this, it's recommended to preview the project
     in Chrome.

   Unique Extension Idea:
   - Inspired by Snapchat Filters:
     The project extension was inspired by Snapchat filters, aiming to add cute graphics
     to enhance pictures.
   - ML5 Face API Integration:
     The ML5 face API was utilized for face recognition, providing a unique feature.
   - Memory Consumption and Performance:
     The application consumes a significant amount of memory and may experience issues
     with quick user actions.

   By addressing these challenges and solutions, the project successfully implemented
   image segmentation using each color channel while overcoming technical hurdles and
   delivering a unique user experience inspired by popular social media filters.
*/

