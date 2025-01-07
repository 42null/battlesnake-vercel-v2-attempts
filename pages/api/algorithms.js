//FLOOD FILL
import { isValidPosition } from "./helpers.js";


function inside(board, x, y){
    return isValidPosition(board, x, y);// && !board[x][y].floodFilled && board[x][y].fill === '·';
}
