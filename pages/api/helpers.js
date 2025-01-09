// Avoid checking every single time //TODO: MOVE OUT OF CHECKING EVERY TIME
export function isValidPosition(board, x, y){
    return x >= 0 && x < board.length && y >= 0 && y < board[0].length;
}

export function detectBrokenOutSnakes(board){
    for (const snake of board.snakes) {
        snake.broken = snake.latency === 500;
    }
}


// TODO: Only modify the snakes section or even less
export function getOpponentHeadDistances(you, board){
    const youId = you.id;
    const youX = you.body[0].x;
    const youY = you.body[0].y;

    // console.log(board)

    for (const snake of board.snakes) {
        if(snake.id === you.id){
            snake.distanceFromYouX = 0;
            snake.distanceFromYouY = 0;
            snake.distanceFromYouAbs = 0;
        }else{
            snake.distanceFromYouX = snake.body[0].x - youX;
            snake.distanceFromYouY = snake.body[0].y - youY;
            snake.distanceFromYouAbs = Math.abs(snake.distanceFromYouX)+Math.abs(snake.distanceFromYouY);

        }
    }
    // console.log(board)

    return board;
}

export function getQuadrentFills(board, you, startedAtCenters){
    const myEnd = you.body.at(-1);
    /*
    01
    23
    */
    let checkingQuadrents = [];//[0,1,2,3];

    if(startedAtCenters){
        if(myEnd.x === 5){
            if(myEnd.y === 1){//Bottom
                checkingQuadrents = [2,3];
            }else{
                checkingQuadrents = [0,1];
            }
        }else{
            if(myEnd.x === 1){//Left
                checkingQuadrents = [0,2];
            }else{
                checkingQuadrents = [1,3];
            }
        }

        const options = {};

        if(checkingQuadrents.includes(0)){
            options[myEnd.x === 5 ? "left" : "up"] = checkSpacesExcludeYou(board, you, 0,4,6,10);
        }
        if(checkingQuadrents.includes(1)){
            options[myEnd.x === 5 ? "right" : "up"] = checkSpacesExcludeYou(board, you, 6,10,6,10);
        }
        if(checkingQuadrents.includes(2)){
            options[myEnd.x === 5 ? "left" : "down"] = checkSpacesExcludeYou(board, you, 0,4,0,4);
        }
        if(checkingQuadrents.includes(3)){
            options[myEnd.x === 5 ? "right" : "down"] = checkSpacesExcludeYou(board, you, 6,10,0,4);
        }

        return options;
    }
}

function checkSpacesExcludeYou(board, you, startX, endX, startY, endY){
    const youId = you.id;
    let containsCount = 0;
    for (let i = 0; i < board.snakes; i++) {
        if(board.snakes[i].id === youId){//Skip yourself
            continue;
        }
        for (const bodyElement of board.snakes[i].body) {
            if(bodyElement.x >= startX && bodyElement.x <= endX && bodyElement.y >= startY && bodyElement.y <= endY){
                containsCount++;
            }
        }
    }
    return containsCount;
}



export function clamp(number, min, max) {
    return number <= min ? min : number >= max ? max : number;
}