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


function animate()
{
    background.tilePosition.x -= 5;

    requestAnimFrame(animate);

    // render the stage
    renderer.render(stage);
}