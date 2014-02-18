// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x66FF99);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(768, 896);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

requestAnimFrame(animate);


//Background

var backgroundTexture = PIXI.Texture.fromImage("images/background.png");
var background = new PIXI.TilingSprite(backgroundTexture, 768, 896)
background.position.x = 0;
background.position.y = 0;
background.tilePosition.x = 0;
background.tilePosition.y = 0;
stage.addChild(background);


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

var gravity = v(0,1);

function animate()
{
    background.tilePosition.x -= 5;

    accelerate(bird, gravity);

    requestAnimFrame(animate);

    // render the stage
    renderer.render(stage);
}

function accelerate(object, acceleration) {
    if (!object.velocity) {
        console.log("Creating new vel")
        object.velocity = v(0,0);
    }
    //Update the velocity according to this acceleration
    object.velocity.add(acceleration);
    object.position.x += object.velocity.x;
    object.position.y += object.velocity.y;

    console.log("Pos:" + object.velocity.y);
}