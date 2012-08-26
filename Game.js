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
Game.prototype.TickLimiterWait = 30;
Game.prototype.RenderLimiterTime = new Date().getTime();
Game.prototype.RenderLimiterWait = 60;

Game.prototype.Settings = {
    ShowFPS: true,
    ViewPort: function () {
        return { width: 640, height: 480 };
    }
};

Game.prototype.Initialise = function () {
    addEventListener("keydown", function (e) {
        craigpayne.game.keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete craigpayne.game.keysDown[e.keyCode];
    }, false);

    craigpayne.game.Canvas = document.getElementById("gameCanvas");
    craigpayne.game.Canvas.width = Game.prototype.Settings.ViewPort().width;
    craigpayne.game.Canvas.height = Game.prototype.Settings.ViewPort().height;
    craigpayne.game.Context = craigpayne.game.Canvas.getContext("2d");
    craigpayne.ball = new Ball();
    craigpayne.ball.Initialise();

    craigpayne.game.Platforms = [
        { x: 10, y: 100, w: 100 },
        { x: 50, y: 150, w: 50  },
        { x: 200, y: 150, w: 150 },
        { x: 200, y: 400, w: 150 },
    ];
    craigpayne.game.Walls = [
        { x: 10, y: 100, h: 100 },
        { x: 50, y: 150, h: 50 },
        { x: 200, y: 150, h: 150 },
        { x: 200, y: 400, h: 150 },
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
    if (90 in craigpayne.game.keysDown) { //Z
        craigpayne.ball.InvertGravity = false;
        craigpayne.ball.Trajectory = -100;
    }
    if (88 in craigpayne.game.keysDown) { //X 
        craigpayne.ball.InvertGravity = true;
        craigpayne.ball.Trajectory = -100;
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
        craigpayne.game.Context.strokeStyle = colours.Yellow();
        craigpayne.game.Context.lineWidth = 2;
        craigpayne.game.Context.beginPath();
        craigpayne.game.Context.moveTo(craigpayne.game.Platforms[i].x, craigpayne.game.Platforms[i].y);
        craigpayne.game.Context.lineTo(craigpayne.game.Platforms[i].x + craigpayne.game.Platforms[i].w, craigpayne.game.Platforms[i].y);
        craigpayne.game.Context.stroke();
    }
    //draw walls
    for (var i = 0; i < craigpayne.game.Platforms.length; i++) {
        craigpayne.game.Context.strokeStyle = colours.Orange();
        craigpayne.game.Context.lineWidth = 2;
        craigpayne.game.Context.beginPath();
        craigpayne.game.Context.moveTo(craigpayne.game.Platforms[i].x, craigpayne.game.Platforms[i].y);
        craigpayne.game.Context.lineTo(craigpayne.game.Platforms[i].x, craigpayne.game.Platforms[i].y + craigpayne.game.Platforms[i].w);
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
        craigpayne.game.Context.shadowBlur = 10;
        craigpayne.game.Context.fillStyle = white;
        craigpayne.game.Context.shadowColor = white;
        craigpayne.game.Context.strokeStyle = white;
        craigpayne.game.Context.font = "bold 20px Arial";
        craigpayne.game.Context.fillText("Bouncing Ball Example", 400, 440, 400);

        craigpayne.game.Context.font = "bold 10px Arial";
        craigpayne.game.Context.fillText("FPS:" + craigpayne.game.FPS, 10, 10, 600);
        craigpayne.game.Context.fillText("TPS:" + craigpayne.game.TPS, 10, 20, 600);
        craigpayne.game.Context.fillText("TimeCheck:" + craigpayne.game.FPSTime, 10, 30, 600);
        craigpayne.game.Context.fillText("X:" + craigpayne.ball.X, 10, 40, 600);
        craigpayne.game.Context.fillText("Y:" + craigpayne.ball.Y, 10, 50, 600);
        craigpayne.game.Context.fillText("Trajectory:" + craigpayne.ball.Trajectory, 10, 60, 600);
        craigpayne.game.Context.fillText("Press 'X' to Apply Gravity", 10, 70, 600);
        craigpayne.game.Context.fillText("Press 'Z' to Apply Inverted Gravity", 10, 80, 600);
    }

    //window frame
    var cyan = colours.Cyan();    
    craigpayne.game.Context.lineWidth = 2;
    craigpayne.game.Context.shadowColor = cyan;
    craigpayne.game.Context.strokeStyle = cyan;

    craigpayne.game.Context.beginPath();
    craigpayne.game.Context.moveTo(0, 0);
    craigpayne.game.Context.lineTo(640, 0);
    craigpayne.game.Context.stroke();
    craigpayne.game.Context.beginPath();
    craigpayne.game.Context.moveTo(0, 480);
    craigpayne.game.Context.lineTo(640, 480);
    craigpayne.game.Context.stroke();

    craigpayne.game.Context.beginPath();
    craigpayne.game.Context.moveTo(0, 0);
    craigpayne.game.Context.lineTo(0, 480);
    craigpayne.game.Context.stroke();
    craigpayne.game.Context.beginPath();
    craigpayne.game.Context.moveTo(640, 0);
    craigpayne.game.Context.lineTo(640, 480);
    craigpayne.game.Context.stroke();
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


Game.prototype.InvertRGBColor = function(rgbColour) {
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
    Black: function() {
        var black = "rgb(0,0,0)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(black) : black;
    },
    Yellow: function() {
        var yellow = "rgb(255,216,0)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(yellow) : yellow;
    },
    White: function() {
        var white = "rgb(255,255,255)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(white) : white;
    },
    Cyan: function() {
        var cyan = "rgb(0,255,255)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(cyan) : cyan;
    },
    Lime: function() {
        var lime = "rgb(76,255,0)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(lime) : lime;
    },
    Orange: function() {
        var orange= "rgb(255,106,0)";
        return craigpayne.ball.InvertGravity ? craigpayne.game.InvertRGBColor(orange) : orange;
    }
};