import React, { useState, useEffect } from 'react';
import { getBoard, pieceIcons, isGameOver, isCheck, isCheckmate } from '../logic/chess';
import { handleMove, resetGame, getMoveNotation } from '../logic/chessMoveHandler';

const ChessBoard = ({ gameId, socket, whitePlayer, blackPlayer, timeControl }) => {
  const [board, setBoard] = useState(getBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [whiteTime, setWhiteTime] = useState(timeControl * 60);
  const [blackTime, setBlackTime] = useState(timeControl * 60);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [moveHistory, setMoveHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isWhiteTurn) {
        setWhiteTime((time) => Math.max(0, time - 1));
      } else {
        setBlackTime((time) => Math.max(0, time - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isWhiteTurn]);

  const handleSquareClick = (rowIndex, colIndex) => {
    const square = String.fromCharCode(97 + colIndex) + (8 - rowIndex);

    if (selectedSquare) {
      if (selectedSquare !== square) {
        const { valid, board: newBoard, move } = handleMove(selectedSquare, square);
        if (valid) {
          setBoard(newBoard);
          setIsWhiteTurn(!isWhiteTurn);
          socket.emit('move', { gameId, board: newBoard, isWhiteTurn: !isWhiteTurn, move });
          const moveNotation = getMoveNotation(move);
          setMoveHistory([...moveHistory, moveNotation]);

          if (isCheckmate()) {
            alert('Checkmate! Game Over.');
            resetGame();
            setBoard(getBoard());
            setMoveHistory([]);
          } else if (isCheck()) {
            alert('Check!');
          }

          if (isGameOver()) {
            alert('Game Over!');
            resetGame();
            setBoard(getBoard());
            setMoveHistory([]);
          }
        }
      }
      setSelectedSquare(null);
    } else if (board[rowIndex][colIndex]) {
      if ((isWhiteTurn && board[rowIndex][colIndex].color === 'w') || (!isWhiteTurn && board[rowIndex][colIndex].color === 'b')) {
        setSelectedSquare(square);
      }
    }
  };

  useEffect(() => {
    socket.on('move', ({ gameId: movedGameId, board, isWhiteTurn }) => {
      if (gameId === movedGameId) {
        setBoard(board);
        setIsWhiteTurn(isWhiteTurn);
        const lastMove = board.move[board.move.length - 1];
        const moveNotation = getMoveNotation(lastMove);
        setMoveHistory([...moveHistory, moveNotation]);
      }
    });

    return () => socket.off('move');
  }, [socket, gameId]);

  return (
    <div className="flex flex-col items-center bg-gray-900 p-6 rounded-lg">
      <div className="flex justify-between w-full mb-4 text-white text-xl">
        <div className="flex flex-col items-center">
          <div>{whitePlayer} (White)</div>
          <div>{whiteTime >= 0 ? `${Math.floor(whiteTime / 60)}:${('0' + (whiteTime % 60)).slice(-2)}` : 'Time out'}</div>
        </div>
        <div className="flex flex-col items-center">
          <div>{blackPlayer} (Black)</div>
          <div>{blackTime >= 0 ? `${Math.floor(blackTime / 60)}:${('0' + (blackTime % 60)).slice(-2)}` : 'Time out'}</div>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-1 border-4 border-gray-700 rounded-lg">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-24 h-24 flex justify-center items-center text-5xl 
              ${selectedSquare === String.fromCharCode(97 + colIndex) + (8 - rowIndex) ? 'bg-yellow-300' : ((rowIndex + colIndex) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-700')}`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              <span className={`text-${square && square.color === 'w' ? 'white' : 'black'}`}>
                {square ? pieceIcons[square.type] : ''}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 p-4 bg-gray-800 rounded-lg text-white w-full max-w-md">
        <h3 className="text-xl mb-2">Move History</h3>
        <div className="overflow-y-auto h-32">
          {moveHistory.map((move, index) => (
            <div key={index}>{index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ${move}` : move}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
