var v = require("./vector")

module.exports = function accelerate(object) {
    if (!object.velocity) {
        object.velocity = v(0,0);
    }
    object.velocity.add(object.acceleration);
    object.position.x += object.velocity.x;
    object.position.y += object.velocity.y;
    object.rotation = Math.PI/2 * Math.sin(object.velocity.y/100)

}