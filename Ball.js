/// <reference path="Game.js" />
/// <reference path="PositionModifier.js" />
/// <reference path="Helpers.js" />

function Ball() {
    Ball.prototype = this;
    return this;
};

Ball.prototype.Width = 5;
Ball.prototype.Height = 5;
Ball.prototype.X = 200;
Ball.prototype.Y = 200;
Ball.prototype.Trajectory = -20;
Ball.prototype.InvertGravity = false;
Ball.prototype.PlatformTolerance = 5;
Ball.prototype.DefaultTrajectory = 12;

Ball.prototype.ThrustTicks = 0;
Ball.prototype.ThrustModifier = 5;
Ball.prototype.ThrustLeft = false;
Ball.prototype.ThrustRight = false;
Ball.prototype.ThrustInvert = false;

Ball.prototype.Initialise = function () {
};

Ball.prototype.Render = function (context) {

    var lime = new Colours().Lime();
    context.lineWidth = 2;
    //context.shadowColor = lime;
    context.strokeStyle = lime;
    context.beginPath();

    var radius = ((craigpayne.ball.Width + craigpayne.ball.Height) / 2);
    context.arc(craigpayne.ball.X, craigpayne.ball.Y, radius, 0, 2 * Math.PI, false);
    context.stroke();
};

Ball.prototype.Tick = function () {
    var settings = Game.prototype.Settings;
    var positionModifier = new PositionModifier();
    //Ceiling and floor
    if (craigpayne.ball.Y >= (settings.ViewPort().height - craigpayne.ball.Height)) {
        craigpayne.ball.Trajectory = craigpayne.ball.DefaultTrajectory;
        craigpayne.ball.Y = (settings.ViewPort().height - craigpayne.ball.Height);
    }
    if (craigpayne.ball.Y <= (0 + craigpayne.ball.Height)) {
        craigpayne.ball.Trajectory = craigpayne.ball.DefaultTrajectory;
        craigpayne.ball.Y = (1 + craigpayne.ball.Height);
    }

    //Platforms
    //if the ball is with the range of a platform, and hits it, when dropping then add trajectory
    for (var i = 0; i < craigpayne.game.Platforms.length; i++) {
        if (craigpayne.ball.X > Game.prototype.Settings.XOffset + craigpayne.game.Platforms[i].x - craigpayne.ball.PlatformTolerance) {
            if (craigpayne.ball.X < Game.prototype.Settings.XOffset + craigpayne.game.Platforms[i].x + craigpayne.game.Platforms[i].w + craigpayne.ball.PlatformTolerance) {
                if (craigpayne.ball.Y >= craigpayne.game.Platforms[i].y - craigpayne.ball.PlatformTolerance) {
                    if (craigpayne.ball.Y <= craigpayne.game.Platforms[i].y + craigpayne.ball.PlatformTolerance) {
                        if (craigpayne.ball.Trajectory < 0) {
                            if (!craigpayne.ball.InvertGravity) {
                                craigpayne.ball.Trajectory = craigpayne.ball.DefaultTrajectory;
                                craigpayne.ball.Y = craigpayne.game.Platforms[i].y - (craigpayne.ball.Height * 2);
                                Helpers.prototype.PlayBounce();
                            } else {
                                craigpayne.ball.Trajectory = craigpayne.ball.DefaultTrajectory;
                                craigpayne.ball.Y = craigpayne.game.Platforms[i].y + (craigpayne.ball.Height * 2);
                                Helpers.prototype.PlayBounce();
                            }
                        }
                    }
                }
            }
        }
    }

    for (var i = 0; i < craigpayne.game.GravityInverters.length; i++) {
        if (craigpayne.ball.Y >= craigpayne.game.GravityInverters[i].y) {
            if (craigpayne.ball.Y <= craigpayne.game.GravityInverters[i].y + 15) {
                if (craigpayne.ball.X >= Game.prototype.Settings.XOffset + craigpayne.game.GravityInverters[i].x) {
                    if (craigpayne.ball.X <= Game.prototype.Settings.XOffset + craigpayne.game.GravityInverters[i].x + 15) {
                        if (craigpayne.game.InvertCooldown === 0) {
                            craigpayne.game.InvertCooldown = 100;
                            craigpayne.ball.InvertGravity = !craigpayne.ball.InvertGravity;
                        }
                    }
                }
            }
        }
    }


    //Apply Gravity and Trajectory
    var trajectoryLaw;
    if (!Ball.prototype.InvertGravity)
        trajectoryLaw = positionModifier.ApplyTrajectoryLaw(craigpayne.ball.Y, craigpayne.ball.Trajectory);
    else
        trajectoryLaw = positionModifier.ApplyTrajectoryLawInverted(craigpayne.ball.Y, craigpayne.ball.Trajectory);

    craigpayne.ball.Y = trajectoryLaw.Y;
    craigpayne.ball.Trajectory = trajectoryLaw.Trajectory;

    //if leaves bottom of the screen
    if (craigpayne.ball.Y <= craigpayne.ball.Height) {
        if (!craigpayne.ball.InvertGravity) {
            craigpayne.ball.Y = craigpayne.ball.Height + 1;
            craigpayne.ball.Y = positionModifier.ApplyTrajectoryLawInverted(craigpayne.ball.Y, craigpayne.ball.Trajectory).Y;
            craigpayne.ball.Trajectory = -craigpayne.ball.Height + 1;
        }
        else {
            craigpayne.ball.Y = craigpayne.ball.Height + 1;
            craigpayne.ball.Trajectory = craigpayne.ball.DefaultTrajectory;
        }
    }
    //if leaves top of the screen
    if (craigpayne.ball.Y >= (settings.ViewPort().height - craigpayne.ball.Height)) {
        if (!craigpayne.ball.InvertGravity) {
            craigpayne.ball.Y = (settings.ViewPort().height - craigpayne.ball.Height - 1);
            craigpayne.ball.Y = positionModifier.ApplyTrajectoryLaw(craigpayne.ball.Y, craigpayne.ball.Trajectory).Y;
            craigpayne.ball.Trajectory = -craigpayne.ball.Height + 1;
        }
        else {
            craigpayne.ball.Y = (settings.ViewPort().height - craigpayne.ball.Height) - 1;
            craigpayne.ball.Trajectory = -craigpayne.ball.DefaultTrajectory;
        }
    }
};

Ball.prototype.Left = function () {
    //if the ball crosses a wall boundary, thrust in opposite direction to prevent a blocking movement
    for (var i = 0; i < craigpayne.game.Walls.length; i++) {
        if (craigpayne.ball.Y >= craigpayne.game.Walls[i].y) {
            if (craigpayne.ball.Y <= craigpayne.game.Walls[i].y + craigpayne.game.Walls[i].h) {
                if (craigpayne.ball.X >= Game.prototype.Settings.XOffset + craigpayne.game.Walls[i].x) {
                    if (craigpayne.ball.X - craigpayne.ball.ThrustModifier <= Game.prototype.Settings.XOffset + craigpayne.game.Walls[i].x + craigpayne.ball.PlatformTolerance) {
                        craigpayne.ball.X += craigpayne.ball.ThrustModifier;
                    }
                }
            }
        }
    }
    if (craigpayne.ball.X <= 100) 
        Game.prototype.Settings.XOffset += craigpayne.ball.ThrustModifier;
    else
        craigpayne.ball.X -= craigpayne.ball.ThrustModifier;
};
Ball.prototype.Right = function () {
    //var settings = Game.prototype.Settings;
    //if the ball crosses a wall boundary, thrust in opposite direction to prevent a blocking movement
    for (var i = 0; i < craigpayne.game.Walls.length; i++) {
        if (craigpayne.ball.Y >= craigpayne.game.Walls[i].y) {
            if (craigpayne.ball.Y <= craigpayne.game.Walls[i].y + craigpayne.game.Walls[i].h) {
                if (craigpayne.ball.X <= Game.prototype.Settings.XOffset + craigpayne.game.Walls[i].x) {
                    if (craigpayne.ball.X + craigpayne.ball.ThrustModifier >= Game.prototype.Settings.XOffset + craigpayne.game.Walls[i].x - craigpayne.ball.PlatformTolerance) {
                        craigpayne.ball.X -= craigpayne.ball.ThrustModifier;
                    }
                }
            }
        }
    }
    if (craigpayne.ball.X >= 500) 
        Game.prototype.Settings.XOffset -= craigpayne.ball.ThrustModifier;
    else
        craigpayne.ball.X += craigpayne.ball.ThrustModifier;
};