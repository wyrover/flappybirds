module.exports = function(){
// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x66FF99);
var v = require("./vector")

var onclick = [], birds = []
// create a renderer instance.
var stageWidth = 768;
var stageHeight = 896;
var renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

//Game params
var gravity = v(0,1);
var scrollSpeed = 5; //Pixels per frame (I think)
var floorHeight = 130;
var floorPosition = stageHeight - floorHeight;

//Background
var backgroundTexture = PIXI.Texture.fromImage("images/background.png");


var background = new PIXI.TilingSprite(backgroundTexture, stageWidth, stageHeight)
background.position.x = 0;
background.position.y = 0;
background.tilePosition.x = 0;
background.tilePosition.y = 0;
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
        // adding clone differencies
        
    }
    onclick.push(function(){
        bird.velocity.y = -20;
        
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
}

function animate()
{
    if (birds.length) {
        background.tilePosition.x -= 0.5;
        ground.tilePosition.x -= scrollSpeed;

        var i, max = birds.length;
        for(i=0; i<max; i++){
            accelerate(birds[i]);
            checkCollisions(birds[i]);
        }
    }

    requestAnimFrame(animate);

    // render the stage
    renderer.render(stage);
}

function accelerate(object) {
    if (!object.velocity) {
        object.velocity = v(0,0);
    }
    object.velocity.add(object.acceleration);
    object.position.x += object.velocity.x;
    object.position.y += object.velocity.y;
    object.rotation = Math.PI/2 * Math.sin(object.velocity.y/100)

}

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