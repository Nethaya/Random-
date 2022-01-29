var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameoverImage;
var restartImage;

var score;
var highscore = 0;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkpoint.mp3")
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;

  trex.setCollider("circle",0,0,50);
  

  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;

  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameover = createSprite(300,80,20,50);
  gameover.addImage("defeat", gameoverImage)
  gameover.scale = 2;
  gameover.visible = false;

  restart = createSprite(300,120,30,60);
  restart.addImage("beginagain", restartImage);
  restart.scale = 0.4
  restart.visible = false;


  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background(180); 
  text("Score: "+ score, 500,50);
  text("High Score: "+ highscore, 400,50);
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4 + score/1000);
    
    if(frameCount%5 == 0){
      score = score + 1  
    }
    
    if(highscore<score){
      highscore = score; 
    }
    if(keyDown("space")&& trex.y >= 100) {
      jumpSound.play()
      trex.velocityY = -13;  
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
   
    if(score)
  spawnClouds();
  spawnObstacles(); 

  if(obstaclesGroup.isTouching(trex) ){
    dieSound.play()
    gameState = END
  }
  
    
  }

  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0); 
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    trex.changeAnimation("collided" , trex_collided);
    gameover.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart)){
      reset()
    }

    
  }
  
  
  
  
  
  trex.collide(invisibleGround);
  
  //spawn the clouds
  
  //spawn obstacles on the ground
 
  
  drawSprites();
}

function reset(){
  gameState=PLAY
  score = 0
  restart.visible = false;
  gameover.visible = false;
  cloudsGroup.destroyEach()
  obstaclesGroup.destroyEach()
  trex.changeAnimation("running",trex_running)
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(6 + score/1000);

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 40 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}