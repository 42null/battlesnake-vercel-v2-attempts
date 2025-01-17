//FLOOD FILL
import { isValidPosition } from "./helpers.js";

function inside(board, x, y){
    return isValidPosition(board, x, y);// && !board[x][y].floodFilled && board[x][y].fill === '·';
}

export function convertToArrayForEasyStar(obstacles = []){
    // gameState.board.snakes
    const grid = Array.from(Array(11), _ => Array(11).fill(0)); //Make the 2d array of blanks

    // console.log(JSON.stringify(obstacles, null, 2));

    for (const obstacleArr of obstacles) {
        for (const obstacleArrPoint of obstacleArr) {
            grid[obstacleArrPoint.y][obstacleArrPoint.x] = 1;
        }
    }

    return grid;
}
