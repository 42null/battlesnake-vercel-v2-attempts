import {myLogger} from "./move";

export let perspectiveMap = {}

export const Rotations = Object.freeze({
    A: 0,
    B: 3,
    C: 2,
    D: 1,
    UNKNOWN: -1,
});

let sharedRotation = Rotations.UNKNOWN;

/*
  c
d   b
  a
*/



// {"x": 0, "y": 0}
function translatePoint(point, direction){
    switch (direction) {
        case Rotations.A:
            break;
        case Rotations.B:
            point = {x: Math.abs(point.y - 10), y: point.x}
            break;
        case Rotations.C:
            point = {x: Math.abs(point.x - 10), y: Math.abs(point.y-10)}
            break;
        case Rotations.D:
            point = {x: point.y, y: Math.abs(point.x - 10)}
            break;
    }
    // return point;
}

function traverseAndTranslate(obj, direction) {
    if (Array.isArray(obj)) {
        // If it's an array, apply traversal to each element
        return obj.map(traverseAndTranslate);
    } else if (typeof obj === 'object' && obj !== null) {
        // If it's an object, process each key
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Check if the value is a point {x, y}
                if (key === 'x' && 'y' in obj && typeof obj.x === 'number' && typeof obj.y === 'number') {
                    return translatePoint(obj, direction);
                }
                result[key] = traverseAndTranslate(obj[key]);
            }
        }
        return result;
    } else {
        // If it's a primitive value, return it unchanged
        return obj;
    }
}


export function translateEntire(gameState, undo, saveRotation=false) {
    let rotation;
    if(undo) {
        rotation = gameState.undoRotation;
        delete gameState.undoRotation;
    }else{
        // Detect starting orientation
        const myEndO = gameState.you.body.at(-1);
        const startedAtCenters = (myEndO.x === 5 && (myEndO.y === 1 || myEndO.y === 9)) || (myEndO.y === 5 && (myEndO.x === 1 || myEndO.x === 9)); //Started in a center position

        if(startedAtCenters){
            if(myEndO.x === 5){
                if(myEndO.y === 1){//Rotation 0
                    rotation = Rotations.A;
                    // res.status(200).json({ move: "up"});
                }else{//Rotation 2
                    rotation = Rotations.C;
                    // res.status(200).json({ move: "down"});
                }
            }else{
                if(myEndO.x === 1){//Rotation 1
                    rotation = Rotations.B;
                    // res.status(200).json({ move: "right"});
                }else{//Rotation3
                    rotation = Rotations.D;
                    // res.status(200).json({ move: "left"});
                }
            }
            gameState.undoRotation = rotation;
        }
        if(saveRotation){
            sharedRotation = rotation;
        }
    }

    traverseAndTranslate(gameState, rotation);
    return gameState;
}

export function convertMove(move) {
    const movesOrder = ["down", "right", "up", "left"]

    const moveIndex = movesOrder.indexOf(move);
    const newMoveIndex = (moveIndex + sharedRotation) % 4;

    const newMove = movesOrder[newMoveIndex];
    myLogger.log(`MOVE = ${move} -> ${newMove}, sharedRotation: ${sharedRotation}, movesOrder: ${movesOrder}`);


    return newMove;
    // switch (sharedRotation) {
    //     case Rotations.A:
    //         break;
    //     case Rotations.B:
    //         break;
    //     case Rotations.C:
    //         break;
    //     case Rotations.D:
    //         break;
    // }

}