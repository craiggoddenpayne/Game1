function Game() {
    Game.prototype = this;
    window.craigpayne = {};
    window.craigpayne.game = this;
    return this;
};

Game.prototype.keysDown = {};
Game.prototype.Canvas = null;
Game.prototype.Context = null;
Game.prototype.Platforms = [];
Game.prototype.Walls = [];
Game.prototype.Hazards = [];
Game.prototype.GravityInverters = [];

Game.prototype.PlayerLives = 13;
Game.prototype.FPS = 0;
Game.prototype.FPSTicks = 0;
Game.prototype.FPSTime = new Date().getTime();
Game.prototype.TPS = 0;
Game.prototype.TPSTicks = 0;
Game.prototype.TPSTime = new Date().getTime();

Game.prototype.TickLimiterTime = new Date().getTime();
Game.prototype.TickLimiterWait = 25;
Game.prototype.RenderLimiterTime = new Date().getTime();
Game.prototype.RenderLimiterWait = 50;
Game.prototype.InvertCooldown = 0;
Game.prototype.DebugString = "";

Game.prototype.Settings = {
    ShowFPS: false,
    ViewPort: function () {
        return { width: 640, height: 480 };
    },
    XOffset: 0,
    YOffset: 0
};

Game.prototype.Initialise = function () {
    addEventListener("keydown", function (e) {
        craigpayne.game.keysDown[e.keyCode] = true;
    }, false);
    addEventListener("mousemove", function (e) {
        craigpayne.game.DebugString =
            "X:" + (e.clientX - craigpayne.game.Settings.XOffset) +
            "Y:" + e.clientY;
    }, false)

    addEventListener("keyup", function (e) {

        if (Game.prototype.Settings.ShowFPS) {
            if (90 === e.keyCode) { //Z
                if (craigpayne.ball.InvertGravity === true) {
                    if (craigpayne.game.InvertCooldown === 0) {
                        craigpayne.ball.InvertGravity = false;
                        craigpayne.ball.Trajectory = -20;
                        craigpayne.game.InvertCooldown = 200;
                    }
                }
            }
            if (88 === e.keyCode) { //X 
                if (craigpayne.ball.InvertGravity === false) {
                    if (craigpayne.game.InvertCooldown === 0) {
                        craigpayne.ball.InvertGravity = true;
                        craigpayne.ball.Trajectory = -20;
                        craigpayne.game.InvertCooldown = 200;
                    }
                }
            }
        }
        delete craigpayne.game.keysDown[e.keyCode];
    }, false);

    craigpayne.game.Canvas = document.getElementById("gameCanvas");
    craigpayne.game.Canvas.width = Game.prototype.Settings.ViewPort().width;
    craigpayne.game.Canvas.height = Game.prototype.Settings.ViewPort().height;
    craigpayne.game.Context = craigpayne.game.Canvas.getContext("2d");
    craigpayne.ball = new Ball();
    craigpayne.ball.Initialise();

    var c = new Colours();
    craigpayne.game.Platforms = [
        { x: 180, y: 150, w: 50, colour: c.Yellow },
        { x: 100, y: 200, w: 80, colour: c.Yellow },
        { x: 100, y: 400, w: 970, colour: c.Yellow },
        { x: 230, y: 200, w: 700, colour: c.Pink },
     
        { x: 930, y: 230, w: 20, colour: c.Cyan },
        { x: 950, y: 260, w: 20, colour: c.Cyan },
        { x: 970, y: 290, w: 30, colour: c.Cyan },
    //1 ladder
        {x: 1000, y: 70, w: 300, colour: c.Cyan },
        { x: 1070, y: 120, w: 100, colour: c.Cyan },
        { x: 1070, y: 160, w: 100, colour: c.Cyan },
        { x: 1070, y: 200, w: 100, colour: c.Cyan },
        { x: 1070, y: 240, w: 100, colour: c.Cyan },
        { x: 1070, y: 280, w: 100, colour: c.Cyan },
        { x: 1000, y: 400, w: 300, colour: c.Cyan },
    ];

    craigpayne.game.Walls = [
        { x: 180, y: 150, h: 50, colour: c.Orange },
        { x: 230, y: 150, h: 50, colour: c.Orange },
        { x: 100, y: 200, h: 200, colour: c.Purple },
        { x: 1000, y: 350, h: 50, colour: c.Orange },
        { x: 930, y: 200, h: 30, colour: c.Blue },
        { x: 950, y: 230, h: 30, colour: c.Blue },
        { x: 970, y: 260, h: 30, colour: c.Blue },
        { x: 1000, y: 70, h: 220, colour: c.Pink },
        { x: 1070, y: 120, h: 280, colour: c.Blue },
    //1 ladder
        {x: 1170, y: 0, h: 280, colour: c.Blue },
        
    ];

    craigpayne.game.Hazards = [
        { x: 180, y: 150, w: 50, inverted: false },
    ];

    craigpayne.game.GravityInverters = [
      { x: 1035, y: 325 },
      { x: 1210, y: 130 },
    ];

    setInterval(craigpayne.game.Tick, 1);
    setInterval(craigpayne.game.Render, 1);
};

Game.prototype.Update = function () {//modifier) {
    if (38 in craigpayne.game.keysDown) { // Player holding up
    }
    if (40 in craigpayne.game.keysDown) { // Player holding down
    }
    if (37 in craigpayne.game.keysDown) { // Player holding left    
        craigpayne.ball.Left();
    }
    if (39 in craigpayne.game.keysDown) { // Player holding right
        craigpayne.ball.Right();
    }
};

Game.prototype.Render = function () {
    if ((craigpayne.game.RenderLimiterTime + craigpayne.game.RenderLimiterWait) >= new Date().getTime()) {
        return;
    }

    var colours = new Colours();
    craigpayne.game.RenderLimiterTime = new Date().getTime();
    craigpayne.game.Context.fillStyle = colours.Black();
    craigpayne.game.Context.fillRect(0, 0, 640, 480);

    //draw platforms
    for (var i = 0; i < craigpayne.game.Platforms.length; i++) {
        craigpayne.game.Context.strokeStyle = craigpayne.game.Platforms[i].colour();
        craigpayne.game.Context.lineWidth = 2;
        craigpayne.game.Context.beginPath();
        craigpayne.game.Context.moveTo(Game.prototype.Settings.XOffset + craigpayne.game.Platforms[i].x, craigpayne.game.Platforms[i].y);
        craigpayne.game.Context.lineTo(Game.prototype.Settings.XOffset + craigpayne.game.Platforms[i].x + craigpayne.game.Platforms[i].w, craigpayne.game.Platforms[i].y);
        craigpayne.game.Context.stroke();
    }
    //draw walls
    for (var i = 0; i < craigpayne.game.Walls.length; i++) {
        craigpayne.game.Context.strokeStyle = craigpayne.game.Walls[i].colour();
        craigpayne.game.Context.lineWidth = 2;
        craigpayne.game.Context.beginPath();
        craigpayne.game.Context.moveTo(Game.prototype.Settings.XOffset + craigpayne.game.Walls[i].x, craigpayne.game.Walls[i].y);
        craigpayne.game.Context.lineTo(Game.prototype.Settings.XOffset + craigpayne.game.Walls[i].x, craigpayne.game.Walls[i].y + craigpayne.game.Walls[i].h);
        craigpayne.game.Context.stroke();
    }
    //draw hazards
    for (var i = 0; i < craigpayne.game.Hazards.length; i++) {
        craigpayne.game.Context.strokeStyle = colours.White();
        craigpayne.game.Context.lineWidth = 2;
        craigpayne.game.Context.beginPath();
        craigpayne.game.Context.moveTo(Game.prototype.Settings.XOffset + craigpayne.game.Hazards[i].x, craigpayne.game.Hazards[i].y);

        for (var x = Game.prototype.Settings.XOffset + craigpayne.game.Hazards[i].x; x < Game.prototype.Settings.XOffset + craigpayne.game.Hazards[i].x + craigpayne.game.Hazards[i].w; x++) {
            if (x % 4 == 0) {
                craigpayne.game.Context.lineTo(x, craigpayne.game.Hazards[i].y);
                craigpayne.game.Context.stroke();
            }
            if (x % 8 == 2) {
                craigpayne.game.Context.lineTo(x, craigpayne.game.Hazards[i].y + (craigpayne.game.Hazards[i].inverted ? 10 : -10));
                craigpayne.game.Context.stroke();
            }
        }
    }
    //gravity Inverters
    for (var i = 0; i < craigpayne.game.GravityInverters.length; i++) {
        craigpayne.game.Context.fillStyle = colours.Purple();
        craigpayne.game.Context.fillRect(Game.prototype.Settings.XOffset + craigpayne.game.GravityInverters[i].x - 7.5, craigpayne.game.GravityInverters[i].y, 15, 15);
        craigpayne.game.Context.beginPath();
        craigpayne.game.Context.fillStyle = colours.Lime();
        craigpayne.game.Context.moveTo(Game.prototype.Settings.XOffset + craigpayne.game.GravityInverters[i].x + 5, craigpayne.game.GravityInverters[i].y + 2.5, 15);
        craigpayne.game.Context.lineTo(Game.prototype.Settings.XOffset + craigpayne.game.GravityInverters[i].x - 5, craigpayne.game.GravityInverters[i].y + 2.5, 15);
        craigpayne.game.Context.lineTo(Game.prototype.Settings.XOffset + craigpayne.game.GravityInverters[i].x - 5, craigpayne.game.GravityInverters[i].y + 13.5, 15);
        craigpayne.game.Context.lineTo(Game.prototype.Settings.XOffset + craigpayne.game.GravityInverters[i].x + 5, craigpayne.game.GravityInverters[i].y + 13.5, 15);
        craigpayne.game.Context.lineTo(Game.prototype.Settings.XOffset + craigpayne.game.GravityInverters[i].x + 5, craigpayne.game.GravityInverters[i].y + 7.5, 15);
        craigpayne.game.Context.lineTo(Game.prototype.Settings.XOffset + craigpayne.game.GravityInverters[i].x, craigpayne.game.GravityInverters[i].y + 7.5, 15);
        craigpayne.game.Context.stroke();
    }

    var white = colours.White();
    craigpayne.game.Context.font = "bold 14px Arial";
    craigpayne.game.Context.fillStyle = colours.White();
    craigpayne.game.Context.fillText("Lives:" + craigpayne.game.PlayerLives, 550, 470, 5000);
    if (craigpayne.game.InvertCooldown > 0) {
        craigpayne.game.Context.fillStyle = white;
        craigpayne.game.Context.strokeStyle = white;
        craigpayne.game.Context.fillText("Gravity Inversion Cool off:" +
            Helpers.prototype.RoundNumber(craigpayne.game.InvertCooldown / craigpayne.game.TPS, 1) + "s"
            , 10, 470, 5000);
    }

    craigpayne.ball.Render(craigpayne.game.Context);
    craigpayne.game.Context.fillStyle = colours.Debug();
    craigpayne.game.Context.strokeStyle = colours.Debug();
    craigpayne.game.Context.font = "bold 10px Arial";
    craigpayne.game.Context.fillText(craigpayne.game.DebugString, 300, 150, 200);


    craigpayne.game.Context.fillStyle = white;
    craigpayne.game.Context.strokeStyle = white;
    craigpayne.game.Context.font = "bold 20px Arial";
    craigpayne.game.Context.fillText("Welcome to Game Name Here!                                Bounce into G blocks to invert gravity", Game.prototype.Settings.XOffset + 150, 50, 5000);
    craigpayne.game.Context.fillText("                                            The ball naturally bounces against all flat surfaces.           ", Game.prototype.Settings.XOffset + 150, 450, 5000);
    craigpayne.game.Context.fillText("Use left and right keys to control the ball.                            ", Game.prototype.Settings.XOffset + 150, 80, 5000);
    craigpayne.game.Context.fillText("You've most likely found a bug, you shouldnt really be roaming around here...", Game.prototype.Settings.XOffset + -900, 80, 5000);
    craigpayne.game.Context.fillText("theres nothing to see, please go back --> -->", Game.prototype.Settings.XOffset + -900, 160, 5000);



    craigpayne.game.FPSTicks += 1;
    var now = new Date().getTime();
    if (now > craigpayne.game.FPSTime + 1000) {
        craigpayne.game.FPSTime = now;
        craigpayne.game.FPS = craigpayne.game.FPSTicks;
        craigpayne.game.FPSTicks = 0;
    }

    var settings = Game.prototype.Settings;
    if (settings.ShowFPS) {

        craigpayne.game.Context.fillStyle = colours.Debug();
        craigpayne.game.Context.font = "bold 10px Arial";
        craigpayne.game.Context.fillText("FPS:" + craigpayne.game.FPS, 10, 10, 600);
        craigpayne.game.Context.fillText("TPS:" + craigpayne.game.TPS, 10, 20, 600);
        craigpayne.game.Context.fillText("TimeCheck:" + craigpayne.game.FPSTime, 10, 30, 600);
        craigpayne.game.Context.fillText("X:" + craigpayne.ball.X, 10, 40, 600);
        craigpayne.game.Context.fillText("Y:" + craigpayne.ball.Y, 10, 50, 600);
        craigpayne.game.Context.fillText("Trajectory:" + craigpayne.ball.Trajectory, 10, 60, 600);
        craigpayne.game.Context.fillText("XOffset:" + Game.prototype.Settings.XOffset, 10, 70, 600);
        craigpayne.game.Context.fillText("YOffset:" + Game.prototype.Settings.YOffset, 10, 80, 600);
        craigpayne.game.Context.fillText("Press 'X' to Apply Gravity", 10, 100, 600);
        craigpayne.game.Context.fillText("Press 'Z' to Apply Inverted Gravity", 10, 110, 600);
    }
};

Game.prototype.Tick = function () {
    if ((craigpayne.game.TickLimiterTime + craigpayne.game.TickLimiterWait) >= new Date().getTime()) {
        return;
    }
    if (craigpayne.game.InvertCooldown !== 0) {
        craigpayne.game.InvertCooldown -= 1;
    }
    craigpayne.game.TickLimiterTime = new Date().getTime();
    var settings = Game.prototype.Settings;
    craigpayne.game.TPSTicks += 1;
    var now = new Date().getTime();
    if (now > craigpayne.game.TPSTime + 1000) {
        craigpayne.game.TPSTime = now;
        craigpayne.game.TPS = craigpayne.game.TPSTicks;
        craigpayne.game.TPSTicks = 0;
    }
    craigpayne.game.Update();
    craigpayne.ball.Tick();
};


Game.prototype.InvertRGBColor = function (rgbColour) {
    var oldCol = rgbColour.split('(')[1].split(')')[0].split(',');
    var newCol = new Array();
    for (var i = 0; i < oldCol.length; i++) {
        newCol[i] = 255 - Number(oldCol[i]);
    }
    return 'rgb(' + newCol[0] + ',' + newCol[1] + ',' + newCol[2] + ')';
};









function Colours() {
    Colours.prototype = this;
}

Colours.prototype = {
    Black: function () {
        var black = "rgb(0,0,0)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(black) : black;
    },
    Yellow: function () {
        var yellow = "rgb(255,216,0)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(yellow) : yellow;
    },
    White: function () {
        var white = "rgb(255,255,255)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(white) : white;
    },
    Cyan: function () {
        var cyan = "rgb(0,255,255)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(cyan) : cyan;
    },
    Lime: function () {
        var lime = "rgb(76,255,0)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(lime) : lime;
    },
    Orange: function () {
        var orange = "rgb(255,106,0)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(orange) : orange;
    },
    Purple: function () {
        var purple = "rgb(178,0,255)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(purple) : purple;
    },
    Pink: function () {
        var pink = "rgb(255,0,220)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(pink) : pink;
    },
    Blue: function () {
        var blue = "rgb(0,35,255)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(blue) : blue;
    },
    Debug: function () {
        var debug = "rgb(64,64,64)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(debug) : debug;
    }
};