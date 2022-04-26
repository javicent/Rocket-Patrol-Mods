/*
Justin Vicente
Rocket Patrol Mods
CMPM 120
Took 20 hours to complete
*/

// Create game configuration object
let config =
{
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
};

let game = new Phaser.Game(config); // create main game object

// define the game settings, initially set for easy mode
game.settings =
{
    spaceshipSpeed: 3,
    fastshipSpeed: 4,
    gameTimer: 60000
};

// reserve some keyboard bindings
let keyE, keyH, keyM, keyR, keySpace;
// reserve an inputPlugin binding
let mouse;