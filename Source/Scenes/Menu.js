/*
Justin Vicente
Rocket Patrol Mods
CMPM 120
Took 20 hours to complete
*/
class Menu extends Phaser.Scene
{
    constructor()
    {
        super("menuScene");
    }

    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load audio files
        this.load.audio("sfx_select", "./Assets/blip_select12.wav");
        this.load.audio("sfx_rocket", "./Assets/rocket_shot.wav");
        
        //randomizing menu music
        //has to be in preload() to prevent other possible songs from playing
        var i = Phaser.Math.Between(1, 3)
        if(i == 1){ //The Doom Party - Noisecream
            this.load.audio('bgm', './Assets/bgm.wav'); //this plays first
            this.load.audio('loop', './Assets/bgm_loop.wav'); //this loops after initial song
            this.load.audio('play', './Assets/go.wav'); //this plays once out of menu
        }
        if(i == 2){ //Mist of Rage - Noisecream
            this.load.audio('bgm', './Assets/bgm2.wav');
            this.load.audio('loop', './Assets/bgm2.wav');
            this.load.audio('play', './Assets/go2.wav');
        }        
        if(i == 3){ //The Only Thing they Fear is You - Mick Gordon
            this.load.audio('bgm', './Assets/bgm3.wav');
            this.load.audio('loop', './Assets/bgm_loop3.wav');
            this.load.audio('play', './Assets/go3.wav');
        }

        this.load.audio("sfx_explosion1", "./Assets/explosion1.wav");
        this.load.audio("sfx_explosion2", "./Assets/explosion2.wav");
        this.load.audio("sfx_explosion3", "./Assets/explosion3.wav");
        this.load.audio("sfx_explosion4", "./Assets/explosion4.wav");

    }
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {
        //initialization screens
        this.initialize1 = false; //initialize2 would have been for the tutorial, but that's scrapped

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
            "ROCKET PATROL", // initial text to be displayed
            menuConfig // configuration object
        ).setOrigin(0.5);

        this.menu2 = this.add.text
        (
            centerX,
            centerY,
            "Move with mouse and LEFT Click to fire",
            menuConfig
        ).setOrigin(0.5);
        menuConfig.backgroundColor = "#00C080"; // set object property
        menuConfig.color = "#000000";
        this.menu3 = this.add.text
        (
            centerX,
            centerY + textSpacer,
            "Press (E) for Easy or (H) for Hard",
            menuConfig
        ).setOrigin(0.5);

        

        this.cover = this.add.rectangle(0, 0, 1300, 1000, '#000000');
        this.coverText = this.add.text
        (
            centerX,
            centerY + textSpacer,
            "Press Space to Continue",
            menuConfig
        ).setOrigin(0.5);

        //initialize music
        this.music = this.sound.add('bgm');
        this.music.setLoop(false);
        this.play = this.sound.add('play')
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
        this.play.stop();
        if(this.initialize1 == false){
            if(Phaser.Input.Keyboard.JustDown(keySpace))
            {
                // this is so we force user interaction to work around google autoplay
                this.cover.destroy();
                this.coverText.destroy();
                // menu music plays
                this.music.play();
                this.initialize1 = true;
            }
    
        }
        if(this.initialize1 == true){
            if(this.music.isPlaying == false){ 
                if(this.musicLoop.isPlaying == false){
                    this.musicLoop.play();              
                }
            }
            
            if(Phaser.Input.Keyboard.JustDown(keyE))
            {
                // configuration settings for easy mode
                game.settings =
                {
                    spaceshipSpeed: 3,
                    fastshipSpeed: 4,
                    gameTimer: 60000
                }
                this.sound.play("sfx_select");
                this.music.stop();
                this.musicLoop.stop();
                this.sound.play("play");
                this.scene.start("playScene");
            }
    
            // configuration settings for hard mode
            if(Phaser.Input.Keyboard.JustDown(keyH))
            {
                game.settings =
                {
                    spaceshipSpeed: 4,
                    fastshipSpeed: 5,
                    gameTimer: 45000
                }
                this.sound.play("sfx_select");
                this.sound.play("play");
                this.music.stop();
                this.musicLoop.stop();
                this.scene.start("playScene");
            } 
        }
    } 
}
//-end update()-----------------------------------------------------------------

