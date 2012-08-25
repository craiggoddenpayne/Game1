/// <reference path="Game.js" />
/// <reference path="PositionModifier.js" />

function Ball() {
    Ball.prototype = this;
    return this;
};

Ball.prototype.X = 320;
Ball.prototype.Y = 240;
Ball.prototype.Trajectory = -100;
Ball.prototype.InvertGravity = false;
Ball.prototype.PlatformTolerance = 8;
Ball.prototype.DefaultTrajectory = 20;

Ball.prototype.ThrustTicks = 0;
Ball.prototype.ThrustModifier = 5;
Ball.prototype.ThrustLeft = false;
Ball.prototype.ThrustRight = false;
Ball.prototype.ThrustInvert = false;

Ball.prototype.Initialise = function () {
};

Ball.prototype.Render = function (context) {

    context.shadowColor = "lime";
    context.beginPath();
    context.strokeStyle = "lime";
    context.arc(craigpayne.ball.X, craigpayne.ball.Y, 5, 0, 2 * Math.PI, false);
    context.lineWidth = 2;
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

Ball.prototype.Tick = function () {

    var positionModifier = new PositionModifier();
    //Ceiling and floor
    if (craigpayne.ball.Y > 450) {
        craigpayne.ball.Trajectory = craigpayne.ball.DefaultTrajectory;
    }
    if (craigpayne.ball.Y < 30) {
        craigpayne.ball.Trajectory = craigpayne.ball.DefaultTrajectory;
    }

    //Platforms
    //if the ball is with the range of a platform, and hits it, when dropping then add trajectory
    for (var i = 0; i < craigpayne.game.Platforms.length; i++) {
        if (craigpayne.ball.X > craigpayne.game.Platforms[i].x - craigpayne.ball.PlatformTolerance) {
            if (craigpayne.ball.X < craigpayne.game.Platforms[i].x + craigpayne.game.Platforms[i].w + craigpayne.ball.PlatformTolerance) {
                if (craigpayne.ball.Y > craigpayne.game.Platforms[i].y - craigpayne.ball.PlatformTolerance) {
                    if (craigpayne.ball.Y < craigpayne.game.Platforms[i].y + craigpayne.ball.PlatformTolerance) {
                        if (craigpayne.ball.Trajectory < 0) {
                            if (!craigpayne.ball.InvertGravity) 
                                craigpayne.ball.Trajectory = craigpayne.ball.DefaultTrajectory;                         
                            else 
                                craigpayne.ball.Trajectory = craigpayne.ball.DefaultTrajectory;                            
                        }
                    }
                }
            }
        }
    }


    if (craigpayne.ball.Y < 0 || craigpayne.ball.Y > 480) {
        craigpayne.ball.InvertGravity = !craigpayne.ball.InvertGravity;
    }

    //Apply Gravity and Trajectory
    var trajectoryLaw;
    if (!Ball.prototype.InvertGravity)
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