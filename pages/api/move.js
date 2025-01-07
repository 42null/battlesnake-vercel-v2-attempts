import {isValidPosition, getClosestSnakes, getOpponentHeadDistances} from "./helpers.js";

// import { PredictorBoard } from "./predictor.js";
import {floodFill} from "./algorithms";


// THIS IS CURRENTLY SET UP ONLY TO FOCUS ON CONSTRICTOR

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const gameState = req.body;

  if (req.method !== "POST") {
    res.status(404).json({ message: "Only for POST" });
    return;
  }

  if (!gameState) {
    res.status(400).json({ message: "Missing gamestate" });
    return;
  }

  const startTime = new Date();

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  // const predictor = new PredictorBoard(gameState);

  const myId = gameState.you.id;

  // Snake details
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];
  const myEnd = gameState.you.body.at(-1)
  const myLength = gameState.you.length;

  const _boardMaxX = gameState.board.width - 1;
  const _boardMaxY = gameState.board.height - 1;

  const currentTerm = gameState.turn;

  console.log(`Turn # ${currentTerm} (Current)`);

  const opponents = gameState.board.snakes;

  let endTime = 0;


  // Move to the center of the screen

  // EXTRA INFO
  // CLOSEST SNAKES

  gameState.board = getOpponentHeadDistances(gameState.you, gameState.board);

  // STARTING ORIENTATION
  const startedAtCenters = (myEnd.x === 5 && (myEnd.y === 1 || myEnd.y === 9)) || (myEnd.y === 5 && (myEnd.x === 1 || myEnd.x === 9)); //Started in a center position
  console.log(startedAtCenters);
  console.log(myEnd.x, myEnd.y);



  if(currentTerm <= 3){//TODO: Change based on map size
    let movementOptions = {
    };
    if(startedAtCenters){
      if(myEnd.x === 5){
        if(myEnd.y === 1){
          res.status(200).json({ move: "up"});
        }else{
          res.status(200).json({ move: "down"});
        }
      }else{
        if(myEnd.x === 1){
          res.status(200).json({ move: "right"});
        }else{
          res.status(200).json({ move: "left"});
        }
      }
    }
  }



  // STRATEGY SELECTION

  if(currentTerm <= 3){

  }








  endTime = new Date();
  console.log((endTime - startTime)+"ms");
  res.status(200).json({ move: ""});
}
