/// <reference path="Game.js" />
/// <reference path="PositionModifier.js" />

function Ball() {
    Ball.prototype = this;
    return this;
};

Ball.prototype.X = 320;
Ball.prototype.Y = 240;
Ball.prototype.Trajectory = 0;
Ball.prototype.InvertGravity = false;

Ball.prototype.ThrustTicks = 0;
Ball.prototype.ThrustModifier = 20;
Ball.prototype.ThrustLeft = false;
Ball.prototype.ThrustRight = false;
Ball.prototype.ThrustInvert = false;

Ball.prototype.Initialise = function () {
};

Ball.prototype.Render = function (context) {

    context.fillStyle = "red";
    context.shadowColor = "red";
    context.beginPath();
    context.arc(craigpayne.ball.X, craigpayne.ball.Y, 10, 0, 2 * Math.PI, false);
    context.lineWidth = 5;
    context.strokeStyle = "red";
    context.stroke();

    context.lineWidth = 2;
    context.shadowColor = "cyan";
    context.strokeStyle = "cyan";
    
    context.beginPath();
    context.moveTo(0, 20);
    context.lineTo(640, 20);
    context.stroke();

    context.beginPath();
    context.moveTo(0, 460);
    context.lineTo(640, 460);
    context.stroke();
};

Ball.prototype.LastTrajectory = 30;
Ball.prototype.Tick = function () {

    var positionModifier = new PositionModifier();
    if (craigpayne.ball.Y > 450) {
        Ball.prototype.LastTrajectory -= 2;
        craigpayne.ball.Trajectory = Ball.prototype.LastTrajectory;
        if (Ball.prototype.LastTrajectory == 0)
            Ball.prototype.LastTrajectory = 30;
    }

    if (craigpayne.ball.Y < 30) {
        Ball.prototype.LastTrajectory -= 2;
        craigpayne.ball.Trajectory = Ball.prototype.LastTrajectory;
        if (Ball.prototype.LastTrajectory == 0)
            Ball.prototype.LastTrajectory = 30;
    }

    //if ball is not on ground level
    var trajectoryLaw;
    if(Ball.prototype.InvertGravity)
        trajectoryLaw = positionModifier.ApplyTrajectoryLaw(craigpayne.ball.Y, craigpayne.ball.Trajectory);
    else
        trajectoryLaw = positionModifier.ApplyTrajectoryLawInverted(craigpayne.ball.Y, craigpayne.ball.Trajectory);
    
    craigpayne.ball.Y = trajectoryLaw.Y;
    craigpayne.ball.Trajectory = trajectoryLaw.Trajectory;
};

Ball.prototype.Left = function () {
    if (craigpayne.ball.X > 0) {
       craigpayne.ball.X -= craigpayne.ball.ThrustModifier;
    }
};
Ball.prototype.Right = function () {
    if (craigpayne.ball.X < 640) {
        craigpayne.ball.X += craigpayne.ball.ThrustModifier;
    }
};