import {isValidPosition, getClosestSnakes, getOpponentHeadDistances, getQuadrentFills} from "./helpers.js";

// import { PredictorBoard } from "./predictor.js";
import {floodFill} from "./algorithms";
import {convertMove, translateEntire} from "./perspectiveMap";


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

  let gameState = translateEntire(gameStateO, false, true);


  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  const myId = gameState.you.id;

  // Snake details
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];
  const myEnd = gameState.you.body.at(-1)
  const myLength = gameState.you.length;

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
  myLogger.log(gameState.board.snakes[0].distanceFromYouAbs+" - ");
  myLogger.log(gameState.board.snakes[1].distanceFromYouAbs+" - ");
  myLogger.log(gameState.board.snakes[2].distanceFromYouAbs+" - ");
  myLogger.log(gameState.board.snakes[3].distanceFromYouAbs+" - ");


  // STARTING ORIENTATION
  console.log(startedAtCenters);
  console.log(myEnd.x, myEnd.y);



  if(currentTurn <= 2){//TODO: Change based on map size
    if(startedAtCenters){
      res.status(200).json({ move: convertMove("up")});
    }else{
      res.status(200).json({ move: convertMove("right")});
    }
    return;
  }else if(currentTurn <= 4){
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
