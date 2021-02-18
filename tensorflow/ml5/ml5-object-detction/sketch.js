
let img;
let video;
let detector;
let detections = [];

function preload() {
    img = loadImage('images/dog-cat-1.jpg');
    detector= ml5.objectDetector('cocossd');
}

function gotDetections(error, results){
    if(error){
        console.error(error);
       // detector.detect(video, gotDetections);
    }
    else{
       // console.log(results)
        detections = results;
       
    }
}

function gotVideo()
{
    detector.detect(video, gotDetections);
}
function setup(){
    createCanvas(640, 480);
    //image(img, 0, 0 );
    video = createCapture(VIDEO, gotVideo);
    //video.load();
    video.size(640, 480);
  

}
function draw() {
    image(video, 0 ,0);

    for(let i=0;i<detections.length; i++){
        let object = detections[i];
        stroke(0,255,0);
        strokeWeight(4);
        noFill();
        rect(object.x, object.y, object.width, object.height);
        noStroke();
        fill(51);
        textSize(24);
        text(object.label, object.x + 10, object.y + 24);
        detector.detect(video, gotDetections);

    }
}