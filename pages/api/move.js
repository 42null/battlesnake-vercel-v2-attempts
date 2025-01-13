import {isValidPosition, getClosestSnakes, getOpponentHeadDistances, getQuadrentFills} from "./helpers.js";

// import { PredictorBoard } from "./predictor.js";
import {convertToArrayForEasyStar, floodFill} from "./algorithms";
import {convertMove, translateEntire} from "./perspectiveMap";

// import EasyStar from '../libraries/easystar-0.4.4.min.js';
import EasyStar from 'easystarjs';
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

  let gameState = gameStateO;//translateEntire(gameStateO, false, true);


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

  const currentTurn = gameState.turn;

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
  myLogger.log(gameState.board.snakes[0].distanceFromYouAbs+" - "+gameState.board.snakes[0].id);
  myLogger.log(gameState.board.snakes[1].distanceFromYouAbs+" - "+gameState.board.snakes[1].id);
  myLogger.log(gameState.board.snakes[2].distanceFromYouAbs+" - "+gameState.board.snakes[2].id);
  myLogger.log(gameState.board.snakes[3].distanceFromYouAbs+" - "+gameState.board.snakes[3].id);

  let myHead = null;
  for (const snake of gameState.board.snakes) {
    if(snake.id === myId){
      myHead = snake.body[0];
      break;
    }
  }
  if(myHead === null){
    console.error(`COULD NOT FIND MYSELF!!! myId= ${myId}`);
  }

  if(currentTurn <= 2){//TODO: Change based on map size
    if(startedAtCenters){
      res.status(200).json({ move: convertMove("up")});
    }else{
      res.status(200).json({ move: convertMove("right")});
    }
    return;
  }
  // let easystar = new EasyStar.js();
  // const easystar = EasyStar();

  // var easystar = new EasyStar.js();
  const easystar = new EasyStar.js(); // This is correct now

  let aStarResults = [];
  const grid = convertToArrayForEasyStar([gameState.board.snakes[0].body, gameState.board.snakes[1].body, gameState.board.snakes[2].body, gameState.board.snakes[3].body]);//, [{x:10,y:10}, {x:9,y:9}]);
  // const grid = convertToArrayForEasyStar([[{x:0,y:1},{x:0,y:2},{x:0,y:3}]]);
  // grid[myHead.x][myHead.y] = 0; //Set self head start as safe
  // grid[gameState.board.snakes[1].body[currentTurn].x][gameState.board.snakes[1].body[currentTurn].y] = 0;

  // for (let i = rows.length; i > 0 ; i--) {
  //   console.log(rows[i-1]);
  // }



  easystar.setGrid(grid);
  easystar.setAcceptableTiles([0]);
  // easystar.findPath(myHead.x, myHead.y, gameState.board.snakes[1].body[currentTurn+1].x, gameState.board.snakes[1].body[currentTurn].y, function( path ) {
  easystar.enableSync();
  easystar.findPath(myHead.x, myHead.y, 0,0, function( path ) {
      if (path === null) {
        console.log("Path was not found.");
      } else {
        console.log("Path was found. The first Point is " + path[0].x + " " + path[0].y);
        console.log("Head is at " + myHead.x + " " + myHead.y);
        aStarResults = path;
      }
    }
  );
  easystar.setIterationsPerCalculation(1000000);
  easystar.calculate();

  if(aStarResults[0].x === myHead.x){//Up or down
    if(aStarResults[0].y > myHead.y){
      res.status(200).json({ move: convertMove("up")});
    }else{
      res.status(200).json({ move: convertMove("down")});
    }
  }else{
    if(aStarResults[0].x > myHead.x){
      res.status(200).json({ move: convertMove("right")});
    }else{
      res.status(200).json({ move: convertMove("left")});
    }
  }

  console.log(aStarResults);

  for(let i = 0; i < aStarResults.length; i++) {
    grid[aStarResults[i].x][aStarResults[i].y] = `${i}`;
  }

  let rows = [];
  for (let i = 0; i < 11; i++) {
    let row = "";
    for (let j = 0; j < 11; j++) {
      const point =  grid[j][i];
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

  for (let i = 0; i < rows.length ; i++) {
    console.log(rows[11-i]);
  }


  return;


  if(currentTurn <= 4){
    if(startedAtCenters){//Then go in the direction of way from the closest snake, check only the above and below, the opposite could not have matched
      // const quadrentCounts = getQuadrentFills(gameState.board, gameState.you, startedAtCenters);
      // if(quadrentCounts[0] === quadrentCounts[1]){//If they are the same
      //
      // }else{
      //   const moveDirection = Object.keys(quadrentCounts).reduce((a, b) => quadrentCounts[a] < quadrentCounts[b] ? a : b);//Get the smallest option
      // }
      res.status(200).json({ move: convertMove("left")}); //Testing
    }else{
      res.status(200).json({ move: convertMove("down")}); //Testing
    }
    return;
  }



  // STRATEGY SELECTION

  if(currentTurn <= 3){

  }








  endTime = new Date();
  console.log((endTime - startTime)+"ms");
  // res.status(200).json({ move: ""}); //Testing
}
