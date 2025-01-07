// Avoid checking every single time //TODO: MOVE OUT OF CHECKING EVERY TIME
export function isValidPosition(board, x, y){
    return x >= 0 && x < board.length && y >= 0 && y < board[0].length;
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



export function clamp(number, min, max) {
    return number <= min ? min : number >= max ? max : number;
}
