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

Game.prototype.Settings = {
    ShowFPS: true,
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

    addEventListener("keyup", function (e) {

        if (90 === e.keyCode) { //Z
            craigpayne.ball.InvertGravity = false;
            craigpayne.ball.Trajectory = -20;
        }
        if (88 === e.keyCode) { //X 
            craigpayne.ball.InvertGravity = true;
            craigpayne.ball.Trajectory = -20;
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
        { x: 80, y: 150, w: 50, colour: c.Yellow },
        { x: 0, y: 200, w: 80, colour:c.Yellow  },
        { x: 0, y: 400, w: 800, colour: c.Yellow },
    ];
    craigpayne.game.Walls = [
        { x: 80, y: 150, h: 50, colour: c.Orange },
        { x: 130, y: 150, h: 50, colour: c.Orange },
        { x: 5, y: 195, h: 210, colour: c.Purple },
        { x: 10, y: 195, h: 210, colour: c.Purple },
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
    craigpayne.ball.Render(craigpayne.game.Context);

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



    var settings = Game.prototype.Settings;
    if (settings.ShowFPS) {
        craigpayne.game.FPSTicks += 1;
        var now = new Date().getTime();
        if (now > craigpayne.game.FPSTime + 1000) {
            craigpayne.game.FPSTime = now;
            craigpayne.game.FPS = craigpayne.game.FPSTicks;
            craigpayne.game.FPSTicks = 0;
        }

        var white = colours.White();
        craigpayne.game.Context.fillStyle = white;
        craigpayne.game.Context.strokeStyle = white;
        craigpayne.game.Context.font = "bold 20px Arial";
        craigpayne.game.Context.fillText("Welcome to Game Name Here!                                              The ball naturally bounces against all surfaces. ", Game.prototype.Settings.XOffset + 150, 100, 5000);
        craigpayne.game.Context.fillText("Use left and right keys to control the ball.                            ", Game.prototype.Settings.XOffset + 150, 130, 5000);
        craigpayne.game.Context.fillText("You've most likely found a bug, you shouldnt really be roaming around here...", Game.prototype.Settings.XOffset + -900, 130, 5000);
        craigpayne.game.Context.fillText("theres nothing to see, please go back --> -->", Game.prototype.Settings.XOffset + -900, 160, 5000);
        
        //, Game.prototype.Settings.XOffset + 150, 100, 5000);

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
    craigpayne.game.TickLimiterTime = new Date().getTime();
    var settings = Game.prototype.Settings;
    if (settings.ShowFPS) {
        craigpayne.game.TPSTicks += 1;
        var now = new Date().getTime();
        if (now > craigpayne.game.TPSTime + 1000) {
            craigpayne.game.TPSTime = now;
            craigpayne.game.TPS = craigpayne.game.TPSTicks;
            craigpayne.game.TPSTicks = 0;
        }
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
    Debug: function () {
        var debug = "rgb(64,64,64)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(debug) : debug;
    }
};