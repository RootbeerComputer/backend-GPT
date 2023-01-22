import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

function ChessBoard({ setComputerTurn }) {
  const [game, setGame] = useState(new Chess());

  function makeAMove(move) {
    // const gameCopy = game;
    let gameCopy = Object.assign(
      Object.create(Object.getPrototypeOf(game)),
      game
    );

    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    let gameCopy = Object.assign(
      Object.create(Object.getPrototypeOf(game)),
      game
    );
    let gameFen = gameCopy.fen();
    const newFen = gameFen.replace("w", "b");
    gameCopy.load(newFen);
    console.log(gameCopy);

    setGame(gameCopy);

    const possibleMoves = gameCopy.moves();

    console.log(possibleMoves);
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
    // makeAMove(possibleMoves[0]);
    setComputerTurn(false);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    setComputerTurn(true);

    setTimeout(makeRandomMove, 4500);

    return true;
  }

  return (
    <>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={600} />
    </>
  );
}

export default ChessBoard;
