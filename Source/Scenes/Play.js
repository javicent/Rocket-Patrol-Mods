class Play extends Phaser.Scene
{
    constructor()
    {
        super("playScene");
    }
    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load images/tile sprites
        this.load.image("rocket", "./Assets/rocket.png");
        this.load.image("spaceship", "./Assets/spaceship.png");
        this.load.image("fastship", "./Assets/fastShip.png");
        this.load.video('video', './Assets/cosmos_background.mp4');
        this.load.image("hud", "./Assets/hud.png");

        // load spritesheet for explosion animation
        this.load.spritesheet
        (
            "explosion",
            "./Assets/explosion.png",
            {
                frameWidth: 64,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 9
            }
        );
    } 
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {

        //----------------------------------------------------------------------
        // configure the user interface
        // place tile sprite background
        this.starfield = this.add.tileSprite
        (
            0,
            0,
            640,
            480,
            "starfield"
        ).setOrigin(0, 0);
        
        this.video = this.add.video(0,0, 'video');
        this.video.play();
        

        // add hud
        this.add.image(320,240,'hud');

        //----------------------------------------------------------------------
        // add in the game objects
        // add rocket (p1)
        this.p1Rocket = new Rocket
        (
            this, // scene
            game.config.width/2, // x-coord
            431, // y-coord
            "rocket", // texture
            0 // frame
        ).setScale(0.5, 0.5).setOrigin(0, 0);

        // add spaceship 1
        this.ship1 = new Spaceship
        (
            this, // scene
            game.config.width + 192, // x-coord
            196, // y-coord
            "spaceship", // texture
            0, // frame
            30 // point value
        ).setOrigin(0, 0);

        // add spaceship 2
        this.ship2 = new Spaceship
        (
            this,
            game.config.width + 96,
            260,
            "spaceship",
            0,
            20
        ).setOrigin(0, 0);

        // add spaceship 3
        this.ship3 = new Spaceship
        (
            this,
            game.config.width,
            324,
            "spaceship",
            0,
            10
        ).setOrigin(0, 0);

        // fastship is an "Intermediate Tier" mod
        // this mod consists of new ship artwork that is smaller
        // moves faster, and has the highest point value 
        // add fastship 1
        this.fast1 = new Spaceship
        (
            this,
            game.config.width + 288,
            132,
            "fastship",
            0,
            50
        ).setOrigin(0, 0);

        //----------------------------------------------------------------------
        // add the user input
        // define mouse controls
        mouse = this.input;
        // define keyboard key M
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);


        //----------------------------------------------------------------------
        // add the animations
        // animation config for ship explosions
        this.anims.create
        (
            {
                key: "explode", //
                frames: this.anims.generateFrameNumbers
                (
                    "explosion", // key
                    { // configuration object
                        start: 0,
                        end: 9,
                        first: 0
                    }
                ),
                frameRate: 30
            }
        );

        //----------------------------------------------------------------------
        // add the UI text
        // player score updates during play
        this.p1Score = 0;
        // high score is saved across games played
        this.hScore = parseInt(localStorage.getItem("score")) || 0;
        // scores display configuration
        let scoreConfig =
        {
            fontFamily: "SciFi",
            fontSize: "20px",
            backgroundColor: "#00d9f8",
            color: "#0d262e",
            align: "left",
            padding: {top: 5, bottom: 5},
            fixedWidth: 150
        };
        this.scoreLeft = this.add.text
        (
            80, // x-coord
            44, // y-coord
            "Score: " + this.p1Score, // initial text
            scoreConfig // config settings
        );
        this.best = this.add.text
        (
            410, // x-coord
            44, // y-coord
            "Best: " + this.hScore, // initial text
            scoreConfig // config settings
        );

        // create a game clock that will countdown until game over
        this.gameClock = game.settings.gameTimer;
        // create an object to populate the text configuration members
        let gameClockConfig =
        {
            fontFamily: "SciFi",
            fontSize: "40px",
            backgroundColor: "#0d262e",
            color: "#00d9f8",
            align: "Right",
            padding: {top: 5, bottom: 5},
            fixedWidth: 82
        };
        // add the text to the screen
        this.timeLeft = this.add.text
        (
            280, // x-coord
            21, // y coord
            "" + this.formatTime(this.gameClock), // text to display
            gameClockConfig // text style config object
        );
        // add the event to decrement the clock
        // code adapted from:
        //  https://phaser.discourse.group/t/countdown-timer/2471/3
        this.timedEvent = this.time.addEvent
        (
            {
                delay: 1000,
                callback: () =>
                {
                    this.gameClock -= 1000; 
                    this.timeLeft.text = "" +
                        this.formatTime(this.gameClock);
                },
                scope: this,
                loop: true
            }
        );

        //----------------------------------------------------------------------
        // game over event
        this.gameOver = false;
        // 60s play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall
        (
            game.settings.gameTimer, // delay
            () => // callback
            {
                this.add.text
                (
                    game.config.width/2,
                    game.config.height/2,
                    "GAME OVER",
                    scoreConfig
                ).setOrigin(0.5);

                this.add.text
                (
                    game.config.width/2,
                    game.config.height/2 + 64,
                    "(R) to Restart or (M) for Menu",
                    scoreConfig
                ).setOrigin(0.5);

                this.gameOver = true;
            },
            null, // args
            this // calback scope
        );

        // set a timer to change the value of ship speed after
        // half of the game time has elapsed
        this.factor = 1;
        this.upSpeed = this.time.delayedCall
        (
            game.settings.gameTimer/2,
            () =>
            {
                this.factor = 1.5;
            },
            null,
            this
        );
    }
    // end create() ------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    update()
    {
        // generally updates every frame

        // when game is over remove the game clock event
        if(this.gameOver) this.time.removeAllEvents();

        // check for key input to restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR))
        {
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyM))
        {
            this.scene.start("menuScene");
        }

        if(!this.gameOver)
        {
            // scroll tile sprite
            this.starfield.tilePositionX -= 4;
            // update rocket
            this.p1Rocket.update();
            // update spaceship 1
            this.ship1.update(this.factor);
            // update spaceship 2
            this.ship2.update(this.factor);
            // update spaceship 3
            this.ship3.update(this.factor);
            // update fastship 1
            this.fast1.update(this.factor);
        }

        // check for collisions
        if(this.checkCollision(this.p1Rocket, this.ship3))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship3);
        }

        if(this.checkCollision(this.p1Rocket, this.ship2))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship2);
        }

        if(this.checkCollision(this.p1Rocket, this.ship1))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship1);
        }

        if(this.checkCollision(this.p1Rocket, this.fast1))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.fast1);
        }
    }
    //-end update()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // COLLISIONS
    //--------------------------------------------------------------------------
    //
    checkCollision(rocket, ship)
    {
        if
        (
            rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y
        ) return true;

        else return false;
    }
    //-end checkCollision(rocket, ship)-----------------------------------------
    //--------------------------------------------------------------------------
    // EXPLOSION
    //--------------------------------------------------------------------------
    shipExplode(ship)
    {
        ship.alpha = 0; // set ship to be fully transparent
        // create explosion sprite at ships position
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
        boom.anims.play("explode"); // play the explode animation
        boom.on
        (
            "animationcomplete", 
            () => 
            {
                ship.reset(); // reset ship position
                ship.alpha = 1; // set ship to be fully visible
                boom.destroy(); // remove explosion sprite
            }
        );
        // score increment and repaint
        this.p1Score += ship.points;
        // update the high score if needed
        if(this.p1Score > this.hScore)
        {
            this.hScore = this.p1Score;
            localStorage.setItem("score", this.hScore);
            this.best.text = "Best: " + this.hScore;
        }
        this.scoreLeft.text = "Score: " + this.p1Score;
        
        //randomize explosion sounds
        var i = Phaser.Math.Between(1, 4);
        if(i == 1){
            this.sound.play("sfx_explosion1");
        }else if(i == 2){
            this.sound.play("sfx_explosion2");
        }else if(i == 3){
            this.sound.play("sfx_explosion3");
        }else if(i == 4){
            this.sound.play("sfx_explosion4");
        }
    }
    //-end shipExplode(ship)----------------------------------------------------
    //--------------------------------------------------------------------------
    // FORMAT TIME
    //--------------------------------------------------------------------------
    // code adapted from:
    //  https://phaser.discourse.group/t/countdown-timer/2471/3
    formatTime(ms)
    {
        let s = ms/1000;
        let min = Math.floor(s/60);
        let seconds = s%60;
        seconds = seconds.toString().padStart(2, "0");
        return `${min}:${seconds}`;
    }
    //-end formatTime-----------------------------------------------------------
}
// end class Play

