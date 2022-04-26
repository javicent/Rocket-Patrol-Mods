/*
Justin Vicente
Rocket Patrol Mods
CMPM 120
Took 20 hours to complete
*/

/*
    THIS IS A FAILED SCENE. KEEPING FOR FUTURE PURPOSES
*/
class Tutorial extends Phaser.Scene
{
    constructor()
    {
        super("tutorialScene");
    }

    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load audio files
        this.load.audio('play', './Assets/play.wav');
    }
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {
        // menu display configuration
        let menuConfig =
        {
            fontFamily: "SciFi",
            fontSize: "28px",
            backgroundColor: "#f3b141",
            color: "#843605",
            align: "right",
            padding: {top: 5, bottom: 5},
            fixedWidth: 0
        };

        // menu text positioning
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        // show menu text
        this.menu = this.add.text
        (
            centerX, // x-coord
            centerY - textSpacer, // y-coord
            "test", // initial text to be displayed
            menuConfig // configuration object
        ).setOrigin(0.5);

        //initialize music
        this.musicLoop = this.sound.add('loop');
        this.musicLoop.setLoop(true);

        // define input keys
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    //-end create()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------

    update()
    {            
        if(Phaser.Input.Keyboard.JustDown(keySpace))
        {
            this.sound.play("sfx_select");
            this.sound.play("play");
            this.scene.start("playScene");
        }
     
   
    } 
}
//-end update()-----------------------------------------------------------------

