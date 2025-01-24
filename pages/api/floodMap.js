// export let map = {}

/* Structure
    - [y][x] to work with easystar
    - .level => 0 is nothing, 1 is obstacle, 2+ are predictions
    - .owner => the snake index, 0 is always self

    go distance away and check for obstacles or recursive?
*/


import {convertToArrayForEasyStar} from "./algorithms";
import EasyStar from 'easystarjs';


export class FloodMap{
    gameState = {};
    grid = null;
    gridOutput = null;

    constructor(gameState){
        this.gameState = gameState;
        this.grid = convertToArrayForEasyStar([gameState.board.snakes[0].body, gameState.board.snakes[1].body, gameState.board.snakes[2].body, gameState.board.snakes[3].body]);
        this.gridOutput = structuredClone(this.grid);

    }

    iterateSteps(n){

    }

    determineClosestOnes(){
        const easystar = new EasyStar.js();

        for(let i = 0; i < this.gameState.board.snakes.length; i++){
            if(this.gameState.you.id === this.gameState.board.snakes[i].id){
                this.gameState.board.snakes[i].aStarDistance = 0;
            }else{
                const tempSnakeGrid = structuredClone(this.grid);
                tempSnakeGrid[this.gameState.board.snakes[i].head.y][this.gameState.board.snakes[i].head.x] = 0;

                easystar.setGrid(tempSnakeGrid);
                easystar.setAcceptableTiles([0]);
                easystar.disableDiagonals();
                easystar.enableSync();
                let path = [];
                easystar.findPath(this.gameState.you.head.x,this.gameState.you.head.y, this.gameState.board.snakes[i].head.x,this.gameState.board.snakes[i].head.y, function( aStarResults ) {
                    path = aStarResults;
                });
                easystar.setIterationsPerCalculation(10000000);
                easystar.calculate();

                for(let i = 0; i < path.length; i++) {
                    this.gridOutput[path[i].y][path[i].x] = `${i}`;
                }
                this.gameState.board.snakes[i].aStarDistance = path.length;
            }
        }

    }

    display(){
        console.log("Displaying");

        let rows = [];
        for (let i = 0; i < this.gridOutput[0].length; i++) {
            let row = "";
            for (let j = 0; j <= 10; j++) {
                const point = this.gridOutput[i][j];
                if(point === 0){
                    row += "░░";
                }else if(point === 1){
                    row += "██";
                }else{
                    if(point.length === 1){
                        row += `${point}${point}`;
                    }else{
                        row += point;
                    }

                }
            }
            rows.push(row);
        }

        for (let i = rows.length -1; i >= 0; i--) {
            console.log(rows[i]);
        }

        console.log("End Displaying");
    }
}