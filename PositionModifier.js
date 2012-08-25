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

    if (trajectory > -10) {
        //cancel gravity
        y -= gravity;
    }

    if (trajectory > 10)
        y -= gravity;
    
    var quarterGravity = gravity / 4;
    var halfGravity = gravity / 2;
    switch (trajectory) {
        case 10: y -= halfGravity + quarterGravity; break;
        case 9: y -= halfGravity + quarterGravity; break;
        case 8: y -= halfGravity + quarterGravity; break;
        case 7: y -= halfGravity; break;
        case 6: y -= halfGravity; break;
        case 5: y -= halfGravity; break;
        case 4: y -= quarterGravity; break;
        case 3: y -= quarterGravity; break;
        case 2: y -= quarterGravity; break;
        case 1: break;
        case 0: break;
        case -1: break;
        case -2: y += quarterGravity; break;
        case -3: y += quarterGravity; break;
        case -4: y += quarterGravity; break;
        case -5: y += halfGravity; break;
        case -6: y += halfGravity; break;
        case -7: y += halfGravity; break;
        case -8: y += halfGravity + quarterGravity; break;
        case -9: y += halfGravity + quarterGravity; break;
        case -10: y += halfGravity + quarterGravity; break;
    }
    return { Trajectory: trajectory, Y: y };
};


PositionModifier.prototype.ApplyTrajectoryLawInverted = function (y, trajectory) {
    var gravity = PositionModifier.prototype.NewtonModifier;
    y -= gravity;
    trajectory -= 1;

    //if trajectory is positive it will fight against gravity, so cancel gravity
    if (trajectory > -10) {
        //cancel gravity
        y += gravity;
    }

    if (trajectory > 10)
        y += gravity;

    var quarterGravity = gravity / 4;
    var halfGravity = gravity / 2;
    switch (trajectory) {
       case 10: y += halfGravity + quarterGravity; break;
        case 9: y += halfGravity + quarterGravity; break;
        case 8: y += halfGravity + quarterGravity; break;
        case 7: y += halfGravity; break;
        case 6: y += halfGravity; break;
        case 5: y += halfGravity; break;
        case 4: y += quarterGravity; break;
        case 3: y += quarterGravity; break;
        case 2: y += quarterGravity; break;
        case 1: break;
        case 0: break;
        case -1: break;
        case -2: y -= quarterGravity; break;
        case -3: y -= quarterGravity; break;
        case -4: y -= quarterGravity; break;
        case -5: y -= halfGravity; break;
        case -6: y -= halfGravity; break;
        case -7: y -= halfGravity; break;
        case -8: y -= halfGravity + quarterGravity; break;
        case -9: y -= halfGravity + quarterGravity; break;
        case -10: y -= halfGravity + quarterGravity; break;
    }
    return { Trajectory: trajectory, Y: y };
};