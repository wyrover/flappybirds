module.exports = function(){
// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x66FF99);
var v = require("./vector")


var onclick = [], birds = []
// create a renderer instance.
var stageWidth = 768;
var stageHeight = 800;
var renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

//Game params
var gravity = v(0,1);
var backgroundScrollSpeed = 5; //Pixels per frame (I think)
var scrollSpeed = 3.75;
var floorHeight = 130;
var floorPosition = stageHeight - floorHeight;
var NUM_PIPES = 6;
//Background
var backgroundTexture = PIXI.Texture.fromImage("images/background.png")

// Pipes !!!!
var pipesTexture = PIXI.Texture.fromImage("images/pipe.png")
var topPipesTexture = PIXI.Texture.fromImage("images/pipe.png")
var bottomPipes = []
var topPipes = []

var first_pipe_position = stageWidth + 200,
    distance_between_pipes = 500
    
for (var i = 0; i < NUM_PIPES; i++) {
    bottomPipes.push(new PIXI.Sprite(pipesTexture));
    bottomPipes[i].velocity = v(-scrollSpeed, 0)
    bottomPipes[i].position = v(first_pipe_position + i*distance_between_pipes, stageHeight - 200 - floorHeight)
    bottomPipes[i].acceleration = v(0,0)
}
    
for (var i = 0; i < NUM_PIPES; i++) {
    topPipes.push(new PIXI.Sprite(pipesTexture));
    topPipes[i].anchor.y = 1
    topPipes[i].scale.y = -1
    topPipes[i].velocity = v(-scrollSpeed, 0)
    topPipes[i].position = v(first_pipe_position + i*distance_between_pipes, -500)
    topPipes[i].acceleration = v(0,0)
}
     

var background = new PIXI.TilingSprite(backgroundTexture, stageWidth, stageHeight)
background.position.x = 0;
background.position.y = 0//stageHeight - 896;
background.tilePosition.x = 0;
background.tilePosition.y = stageHeight - 896 - floorHeight;
stage.addChild(background);
//Ground
var groundTexture = PIXI.Texture.fromImage("images/ground.png");

var ground = new PIXI.TilingSprite(groundTexture, stageWidth, floorHeight)
ground.position.x = 0;
ground.position.y = stageHeight-floorHeight;
ground.tilePosition.x = 0;
ground.tilePosition.y = 0;
stage.addChild(ground);

var assetsToLoader = ["images/birdspritesheet.json"];
loader = new PIXI.AssetLoader(assetsToLoader);
loader.onComplete = onAssetsLoaded;
loader.load();

function create(clone){
    var bird = new PIXI.MovieClip(anibird)
    bird.animationSpeed = 1/5
    bird.gotoAndPlay(0)
    // center the sprites anchor point
    
    bird.anchor.x = 0.5;
    bird.anchor.y = 0.5;
    
    
    
    bird.position.x = 200;
    bird.position.y = 150;
    bird.acceleration = gravity;
    if(clone){
        console.log(clone)
        // adding clone differencies
        bird.velocity = v(0,0)
        bird.velocity.y = -25
        bird.position.y = clone.position.y
        //bird.position.x = 30
    }
    
    onclick.push(function(){
        bird.velocity.y = -20
        
        if(!clone){
            var cloned = create(bird)
            birds.push(cloned)
            stage.addChild(cloned)
        }
        
    })
    return bird;
}
    
var anibird;    
function onAssetsLoaded() {
    anibird = [PIXI.Texture.fromFrame("bird1.png"), PIXI.Texture.fromFrame("bird2.png"), PIXI.Texture.fromFrame("bird3.png")]
    var bird = create();
    birds.push(bird)
    
    stage.addChild(bird);
    for(i = 0; i < bottomPipes.length; i++){
      stage.addChild(bottomPipes[i])
    }
    for(i = 0; i < topPipes.length; i++){
      stage.addChild(topPipes[i])
    }
}

function animate()
{
    if (birds.length) {
        background.tilePosition.x -= backgroundScrollSpeed;
        ground.tilePosition.x -= backgroundScrollSpeed;

        var i, max = birds.length;
        for(i=0; i<max; i++){
            accelerate(birds[i]);
            checkCollisions(birds[i]);
            checkBottomPipeCollisions(birds[i])
            checkTopPipeCollisions(birds[i])
        }
        
        for(i=0, max = bottomPipes.length; i < max; i++){
            bottomPipes[i].position.x -= scrollSpeed
        }
        for(i=0, max = topPipes.length; i < max; i++){
            topPipes[i].position.x -= scrollSpeed
        }
        resetPipes()
    }

    requestAnimFrame(animate);

    // render the stage
    renderer.render(stage);
}
    
var accelerate = require("./accelerate")

function checkCollisions(bird) {
    var maxYPos = floorPosition - (bird.texture.height * 0.5);
    if (bird.position.y > maxYPos) {
        //Stop the bird falling
        //bird.acceleration = v(0,0);
        bird.position.y = maxYPos;
        bird.velocity.y = -Math.abs(bird.velocity.y) * 0.7;
    }
}

function click() {
  //raw event handler :)    
  for(var i = 0, max = onclick.length; i < max; i++){
    onclick[i]()
  }    
}
    
function resetPipes() {
    for (var i = 0; i < bottomPipes.length; i++) {
        if (bottomPipes[i].position.x < -200) {
            bottomPipes[i].position.x = bottomPipes[i].position.x + (NUM_PIPES * distance_between_pipes)
        }
    }
    for (var i = 0; i < topPipes.length; i++) {
        if (topPipes[i].position.x < -200) {
            topPipes[i].position.x = topPipes[i].position.x + (NUM_PIPES * distance_between_pipes)
        }
    }
}
    
function checkBottomPipeCollisions(currentBird) {
    for (var i = 0; i < bottomPipes.length; i++) {
        var currentPipe = bottomPipes[i];
        var leftOverlap = currentBird.position.x + currentBird.width/2 - currentPipe.position.x;
        var topOverlap = currentBird.position.y + currentBird.height/2 - currentPipe.position.y;
        var rightOverlap = currentPipe.position.x + currentPipe.width - (currentBird.position.x - currentBird.width/2);
        if (leftOverlap > 0 && topOverlap > 0 && rightOverlap > 0) {
            if (leftOverlap < topOverlap && leftOverlap < rightOverlap) {
                currentBird.velocity.x = -scrollSpeed
            }else if (topOverlap < leftOverlap && topOverlap < rightOverlap) {
                currentBird.velocity.y = -10
            }
        }
    }
}

function checkTopPipeCollisions(currentBird) {
    for (var i = 0; i < topPipes.length; i++) {
        var currentPipe = topPipes[i];
        var leftOverlap = currentBird.position.x + currentBird.width/2 - currentPipe.position.x;
        var bottomOverlap = currentBird.position.y - (currentPipe.position.y + currentPipe.height);
        var rightOverlap = currentPipe.position.x + currentPipe.width - (currentBird.position.x - currentBird.width/2);
        if (leftOverlap > 0 && bottomOverlap > 0 && rightOverlap > 0) {
            if (leftOverlap < bottomOverlap && leftOverlap < rightOverlap) {
                currentBird.velocity.x = -scrollSpeed
            }else if (bottomOverlap < leftOverlap && bottomOverlap < rightOverlap) {
                currentBird.velocity.y = 0
            }
        }
    }
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 32) {
        click();
    }
});

document.addEventListener('mousedown', function(event) {
    click();
});

requestAnimFrame(animate);


}