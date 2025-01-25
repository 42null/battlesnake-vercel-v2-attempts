import {isValidPosition, getClosestSnakes, getOpponentHeadDistances, getQuadrentFills} from "./helpers.js";

// import { PredictorBoard } from "./predictor.js";
import {convertToArrayForEasyStar, floodFill} from "./algorithms";
import {convertMove, translateEntire} from "./perspectiveMap";

// import EasyStar from '../libraries/easystar-0.4.4.min.js';
import EasyStar from 'easystarjs';
import {createMap} from "./floodFill";
import {FloodMap} from "./floodMap";
// console.log(`EasyStar = ${EasyStar}`); // Check what is exported from the file

// import EasyStar from 'easystarjs';

// THIS IS CURRENTLY SET UP ONLY TO FOCUS ON CONSTRICTOR


// From https://melvingeorge.me/blog/save-logs-to-files-nodejs
const { Console } = require("console");
const fs = require("fs");
export const myLogger = new Console({
  stdout: fs.createWriteStream("logs/normalStdout.txt"),
  stderr: fs.createWriteStream("logs/errStdErr.txt"),
});



export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const gameStateO = req.body;

  if (req.method !== "POST") {
    res.status(404).json({ message: "Only for POST" });
    return;
  }

  if (!gameStateO) {
    res.status(400).json({ message: "Missing gamestate" });
    return;
  }

  const startTime = new Date();

  const currentTurn = gameStateO.turn;

  let gameState = null;

  if(currentTurn <= 2){
    gameState = translateEntire(gameStateO, false, true);
  }else{
    gameState = gameStateO;
  }


  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  const myId = gameState.you.id;

  // Snake details
  const myEnd = gameState.you.body.at(-1)

  const _boardMaxX = gameState.board.width - 1;
  const _boardMaxY = gameState.board.height - 1;


  console.log(`Turn # ${currentTurn} (Current)`);

  const startedAtCenters = (myEnd.x === 5 && (myEnd.y === 1 || myEnd.y === 9)) || (myEnd.y === 5 && (myEnd.x === 1 || myEnd.x === 9)); //Started in a center position

  // const opponents = gameState.board.snakes;

  let endTime = 0;


  // Move to the center of the screen

  // EXTRA INFO
  // CLOSEST SNAKES

  // always start from center bottom or bottom right


  gameState.board = getOpponentHeadDistances(gameState.you, gameState.board);

  myLogger.log("----------------"+currentTurn);
  myLogger.log(gameState.board.snakes[0]?.distanceFromYouAbs+" - "+gameState.board.snakes[0]?.id);
  myLogger.log(gameState.board.snakes[1]?.distanceFromYouAbs+" - "+gameState.board.snakes[1]?.id);
  myLogger.log(gameState.board.snakes[2]?.distanceFromYouAbs+" - "+gameState.board.snakes[2]?.id);
  myLogger.log(gameState.board.snakes[3]?.distanceFromYouAbs+" - "+gameState.board.snakes[3]?.id);

  let myHead = null;
  for (const snake of gameState.board.snakes) {
    if(snake.id === myId){
      myHead = snake.head;
      break;
    }
  }
  if(myHead === null){
    console.error(`COULD NOT FIND MYSELF!!! myId= ${myId}`);
  }

  if(currentTurn <= 2){//TODO: Change based on map size
    if(startedAtCenters){
      res.status(200).json({ move: convertMove("up")});
      return;
    }else{
      // res.status(200).json({ move: convertMove("right")});
    }
  }
  // let easystar = new EasyStar.js();
  // const easystar = EasyStar();

  // var easystar = new EasyStar.js();
  const easystar = new EasyStar.js();

  let aStarResults = [];
  const grid = convertToArrayForEasyStar([gameState.board.snakes[0].body, gameState.board.snakes[1].body, gameState.board.snakes[2].body, gameState.board.snakes[3].body]);//, [{x:10,y:9},{x:9,y:8},{x:9,y:7}]]);
  // const grid = convertToArrayForEasyStar([[{x:9,y:10}, {x:9,y:9},{x:9,y:8},{x:9,y:7}]]);
  // const grid = convertToArrayForEasyStar( [[{x:9,y:9},{x:9,y:8}]]);
  /* Grid is
  (0,10) (10,10)
  (0,0) ()
  */


  // const grid = convertToArrayForEasyStar([[{x:0,y:1},{x:0,y:2},{x:0,y:3}]]);
  // grid[myHead.x][myHead.y] = 0; //Set self head start as safe
  // grid[gameState.board.snakes[1].body[currentTurn].x][gameState.board.snakes[1].body[currentTurn].y] = 0;
  //
  // for (let i = rows.length; i > 0 ; i--) {
  //   console.log(rows[i-1]);
  // }

  console.log("grid[5][5] === 0 "+grid[5][5]);
  if(grid[5][5] === 0){
    // easystar.setGrid(grid);
    // easystar.setAcceptableTiles([0]);
    // // easystar.diagonalMovement = false;
    // easystar.disableDiagonals();
    // // easystar.findPath(myHead.x, myHead.y, gameState.board.snakes[1].body[currentTurn+1].x, gameState.board.snakes[1].body[currentTurn].y, function( path ) {
    // easystar.enableSync();
    // easystar.findPath(myHead.x, myHead.y, 5,5, function( path ) {
    //       if (path === null || path.length === 0) {
    //         console.log("Path was not found.");

    const floodMap = new FloodMap(gameState);
    floodMap.iterateSteps(1);
    floodMap.determineClosestOnes();
    floodMap.display();

  } else {
    console.log("Path was found. Path is ", path);
    console.log("Path was found. The first Point is " + path[0].x + " " + path[0].y);
    console.log("Head is at " + myHead.x + " " + myHead.y);
    aStarResults = path;
  }
    // //     }
    // // );
    // easystar.setIterationsPerCalculation(10000000);
    // easystar.calculate();
  // }

  if(aStarResults.length !== 0){
    console.table([
      { x: myHead.x, y: myHead.y },
      { x: aStarResults[0].x, y: aStarResults[0].y }
    ], ["x", "y"]);
    // return;
  }else{
    console.log("ending early");
  }




  if (aStarResults && aStarResults.length > 1) { // Check if a path exists
    if (aStarResults[1].x === myHead.x) { // Up or down
      if (aStarResults[1].y > myHead.y) {
        console.log("DOWN");
        res.status(200).json({ move: "up" });
      } else {
        console.log("UP");
        res.status(200).json({ move: "down" });
      }
    } else { // Left or right
      if (aStarResults[1].x > myHead.x) {
        console.log("RIGHT");
        res.status(200).json({ move: "right" });
      } else {
        console.log("LEFT");
        res.status(200).json({ move: "left" });
      }
    }
  } else {
    console.log("No path found or empty path.");
    // Handle the case where no path was found. A common approach is to return a default move.
    res.status(200).json({ move: "down" }); // Example: Default to down
  }

  // console.log(aStarResults);

  for(let i = 0; i < aStarResults.length; i++) {
    grid[aStarResults[i].y][aStarResults[i].x] = `${i}`;
  }

  let rows = [];
  for (let i = 0; i < grid[0].length; i++) {
    let row = "";
    for (let j = 0; j <= 10; j++) {
      const point =  grid[i][j];
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


  return;


  // if(currentTurn <= 4){
  //   if(startedAtCenters){//Then go in the direction of way from the closest snake, check only the above and below, the opposite could not have matched
  //     // const quadrentCounts = getQuadrentFills(gameState.board, gameState.you, startedAtCenters);
  //     // if(quadrentCounts[0] === quadrentCounts[1]){//If they are the same
  //     //
  //     // }else{
  //     //   const moveDirection = Object.keys(quadrentCounts).reduce((a, b) => quadrentCounts[a] < quadrentCounts[b] ? a : b);//Get the smallest option
  //     // }
  //     res.status(200).json({ move: convertMove("left")}); //Testing
  //   }else{
  //     res.status(200).json({ move: convertMove("down")}); //Testing
  //   }
  //   return;
  // }
  //
  //
  //
  // // STRATEGY SELECTION
  //
  // if(currentTurn <= 3){
  //
  // }








  endTime = new Date();
  console.log((endTime - startTime)+"ms");
  // res.status(200).json({ move: ""}); //Testing
}
