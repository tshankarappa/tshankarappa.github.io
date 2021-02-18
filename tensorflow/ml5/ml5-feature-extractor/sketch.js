let mobilenet;
let classifier;
let video;
let ukeButton;
let button1;
let button2;
let label ='';

function modelReady() {
  console.log('model is Ready !!!');
}

function videoReady() {
  console.log('video is Ready !!!');
}

function whileTraining(loss){
  if(loss == null) {
    console.log('training complete');
    classifier.classify(gotResults);
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
    console.log(results);
    label = results[0].label;
    classifier.classify(gotResults);
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
  classifier = mobilenet.classification(video, videoReady);

  button1 = createButton('happy');
  button1.mousePressed(function () {
    classifier.addImage('happy');
  });

  button2 = createButton('sad');
  button2.mousePressed(function () {
    classifier.addImage('sad');
  });


  trainButton = createButton('train');
  trainButton.mousePressed(function () {
    classifier.train(whileTraining);
  });

}


function draw() {
  background(0);
  image(video, 0, 0, 640, 480);
  fill(255);
  textSize(16);
  text(label, 10, height -  20);
}

