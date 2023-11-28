rightWristY=0;
rightWristX=0;
scoreRightWrist=0;
gameStatus="";
paddle1=10;
paddle2=10;
paddle1x=10;
paddle1height=110;
var paddle1y;
paddel2y=785;
paddle2height=70;
score1=0;
score2=0;
playerScore=0;
pcscore=0;
ball={
    x:350/2,
    y:480/2,
    r:50,
    dx:3,
    dy:3
}

function setup(){
 canvas=createCanvas(800,600);
 canvas.parent('canvas');

 video=createCapture(VIDEO);
 video.size(800,600);
 video.hide();

 poseNet=ml5.poseNet(video,modelLoaded);
 poseNet.on('pose',gotPoses);

}
function draw(){
    if(gameStatus == "start"){
background(0);
 image(video,0,0,800,600);

 fill("black");
 stroke("black");
 rect(780,0,20,800);

 fill("black");
 stroke("black");
 rect(0,0,20,600);
 if(scoreRightWrist>0.2){
    fill("#FF0000");
    stroke("#FF0000");
    circle(rightWristX,rightWristY,10);
 }
paddleInCanvas();
//paleta jugador
fill("#FF0000");
stroke("#FF0000");
strokeWeight(0.5);
paddle1y=rightWristY;
rect(paddle1x,paddle1y,paddle1,paddle1height,100);

//paleta de la computadora
fill("#0000FF");
stroke("#0000FF");
paddle2y=ball.y-paddle2height/2;
rect(paddel2y,paddle2y,paddle2,paddle2height,100);

midline();
drawscore();
models();
move();

}
}



function modelLoaded(){
    console.log("PoseNet se ha inicializado");
}
function gotPoses(results){
    if(results.lenght>0){
        rightWristY=results[0].pose.rightWrist.y;
        rightWristX=results[0].pose.rightWrist.x;
        scoreRightWrist=results[0].pose.keypoints[10].score;
        console.log(scoreRightWrist);
    }
}
function startgame(){
    gameStatus="start";
    document.getElementById("status").innerHTML = "El juego se ha cargado";
}

function reset(){
    ball.x=width/2+100;
    ball.y=height/2+100;
    ball.dx=3;
    ball.dy=3;
}
function preload(){
    ball_touch_paddle=loadSound("ball_touch_paddel.wav");
    missed=loadSound("missed.wav");
}
function midline(){
    for(i=0; i<600; i+=10){
        var y=0;
        fill("#008000");
        stroke(0);
        rect(width/2,y+1,10,600);
    }
}
function drawscore(){
    textAlign(CENTER);
    textSize(30);
    fill("FFFFFF");
    stroke("FFFFFF");
    text("Jugador: ",100,50);
    text(playerScore,180,50);
    text("Computadora: ",580,50);
    text(pcscore,700,50);
    
}

function move(){
 fill("#0000FF");
 stroke("#000FF");
 strokeWeight(0.5);
 ellipse(ball.x,ball.y,ball.r,20);
 ball.x=ball.x+ball.dx;
 ball.y=ball.y+ball.dy;
 if(ball.x+ball.r>width-ball.r/2){
    ball.dx=-ball.dx-0.5;
 }
 if(ball.x-2.5*ball.r/2<0){
    if(ball.y>=paddle1y&&ball.y<=paddle1y+paddle1height){
        ball.dx=-ball.dx+0.5;
        ball_touch_paddle.play();
        playerScore++;
    }
     else{
        pcscore++;
        missed.play();
        reset();
        navigator.vibrate(100);
     }
 }
 if(pcscore==4){
    fill("#0000FF");
    stroke("#0000FF");
    rect(0,0,width,height-1);
    fill("white");
    stroke("white");
    textSize(50);
    text("Fin del juego",width/2,height/2);
    text("Presiona el botón de reinicio para jugar de nuevo",width/2,height/2+30);
    noLoop();
    pcscore=0;
 }
 if(ball.y+ball.r>height || ball.y-ball.r<0){
    ball.dy=-ball.dy;
 }

}

//ancho,altura y velocidad de la pelota escritos en el canvas
function models(){
    textSize(20);
    fill("white");
    noStroke();
    text("ancho: "+width,135,15);
    text("velocidad:"+abs(ball.dx),50,15);
    text("altura:"+height,235,15);
}

//esta funcion ayuda a que la pelota nos salga del canvas
function paddleInCanvas(){
    if(mouseY+paddle1height>height){
        mouseY=height-paddle1height;
    }
    if(mouseY<0){
        mouseY=0;
    }

}

function restart(){
    loop();
    pcscore=0;
    playerScore=0;
}