/// <reference path="Ball.js" />
/// <reference path="Game.js" />

function PositionModifier() {
    PositionModifier.prototype = this;
    return this;
};

PositionModifier.prototype.NewtonModifier = 10;

PositionModifier.prototype.ApplyTrajectoryLaw = function (y, trajectory) {
    var gravity = PositionModifier.prototype.NewtonModifier;
    y += gravity;
    trajectory -= 1;
    
    //if trajectory is positive it will fight against gravity, so cancel gravity
    if (trajectory > 0) {
        //cancel gravity
        y -= gravity;
    }

    if (trajectory > 20)
        y -= gravity;
    if (trajectory > 10 && trajectory < 20)
        y -= gravity - (gravity / 8);

    if (trajectory > 5 && trajectory < 10)
        y -= gravity - (gravity / 4);
    if (trajectory > 0 && trajectory < 5)
        y -= gravity - (gravity / 2);
    if (trajectory > -5 && trajectory < 0)
        y -= gravity - (gravity / 2);
    if (trajectory > -10 && trajectory < -5)
        y -= gravity - (gravity / 4);
    if (trajectory > -20 && trajectory < 10)
        y -= gravity - (gravity / 8);

    return { Trajectory: trajectory, Y: y };
};


PositionModifier.prototype.ApplyTrajectoryLawInverted = function (y, trajectory) {
    var gravity = PositionModifier.prototype.NewtonModifier;
    y -= gravity;
    trajectory -= 1;

    //if trajectory is positive it will fight against gravity, so cancel gravity
    if (trajectory > 0) {
        //cancel gravity
        y += gravity;
    }

    if (trajectory > 20)
        y += gravity;
    if (trajectory > 10 && trajectory < 20)
        y += gravity - (gravity / 8);

    if (trajectory > 5 && trajectory < 10)
        y += gravity - (gravity / 4);
    if (trajectory > 0 && trajectory < 5)
        y += gravity - (gravity / 2);
    if (trajectory > -5 && trajectory < 0)
        y += gravity - (gravity / 2);
    if (trajectory > -10 && trajectory < -5)
        y += gravity - (gravity / 4);
    if (trajectory > -20 && trajectory < 10)
        y += gravity - (gravity / 8);

    return { Trajectory: trajectory, Y: y };
};