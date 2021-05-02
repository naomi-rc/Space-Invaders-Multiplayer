class Explosion extends Phase.GameIbjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "explosion");
        scene.add.existing(this);
        this.play("explode");
    }
}