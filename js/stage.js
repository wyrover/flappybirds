// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x66FF99);

// create a renderer instance.
var stageWidth = 768;
var stageHeight = 896;
var renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);


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
var floorHeight = 130;
var ground = new PIXI.TilingSprite(groundTexture, stageWidth, floorHeight)
ground.position.x = 0;
ground.position.y = stageHeight-floorHeight;
ground.tilePosition.x = 0;
ground.tilePosition.y = 0;
stage.addChild(ground);


//Bird
// create a texture from an image path
var texture = PIXI.Texture.fromImage("images/bird.png");
// create a new Sprite using the texture
var bird = new PIXI.Sprite(texture);
// center the sprites anchor point
bird.anchor.x = 0.5;
bird.anchor.y = 0.5;
// move the sprite t the center of the screen
bird.position.x = 200;
bird.position.y = 150;
// center the sprites anchor point
stage.addChild(bird);


function v(x, y) {
    return {
        x:x,
        y:y,

        add: function(vector) {
            this.x += vector.x;
            this.y += vector.y;
        }
    };
}

//Game params
var gravity = v(0,1);
var scrollSpeed = 5; //Pixels per frame (I think)
var floorPosition = stageHeight - floorHeight;

bird.acceleration = gravity;

function animate()
{
    background.tilePosition.x -= 0.5;
    ground.tilePosition.x -= scrollSpeed;

    checkCollisions(bird);

    accelerate(bird);

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
    bird.velocity.y = -20;
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
