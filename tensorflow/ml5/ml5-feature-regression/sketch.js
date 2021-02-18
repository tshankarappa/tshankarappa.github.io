let mobilenet;
let predictor;
let video;
let ukeButton;
let slider;
let addButton;

let value ='';

function modelReady() {
  console.log('model is Ready !!!');
}

function videoReady() {
  console.log('video is Ready !!!');
}

function whileTraining(loss){
  if(loss == null) {
    console.log('training complete');
    predictor.predict(gotResults);
  }
  else 
  {
    console.log(loss);
  }

}

function gotResults(error, results) {

  if (error) {
    console.error(error);
  }
  else {
   // console.log(results);
    value = results.value;
    predictor.predict(gotResults);
  }

}

function imageReady() {
  image(puffin, 0, 0, width, height);
}
function setup() {
  createCanvas(640, 520);
  video = createCapture(VIDEO);
  video.hide();
  background(0);

  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  predictor = mobilenet.regression(video, videoReady);


  slider = createSlider(0,1,0.5,0.01);


  addButton = createButton ('add example image');
  addButton.mousePressed(function() {
    predictor.addImage(slider.value());
  });


  trainButton = createButton('train');
  trainButton.mousePressed(function () {
    predictor.train(whileTraining);
  });

}


function draw() {
  background(0);
  image(video, 0, 0, 640, 480);
  rectMode(CENTER);
  fill(255, 0, 200);
  rect(value*width, height/2, 50,50);
  fill(255,)
  fill(255);
  textSize(16);
  text(value, 10, height -  20);
}

