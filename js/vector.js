module.exports = function vector(x, y) {
    return {
        x:x,
        y:y,

        add: function(vector) {
            this.x += vector.x;
            this.y += vector.y;
        }
    };
}
