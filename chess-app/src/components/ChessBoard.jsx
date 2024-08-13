import React, { useState, useEffect } from 'react';
import { getBoard, pieceIcons, handleMove } from './chessboard';

const ChessBoard = ({ gameId, socket, whitePlayer, blackPlayer, timeControl }) => {
  const [board, setBoard] = useState(getBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [whiteTime, setWhiteTime] = useState(timeControl * 60);
  const [blackTime, setBlackTime] = useState(timeControl * 60);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

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
      const newBoard = handleMove(selectedSquare, square);
      if (newBoard) {
        setBoard(newBoard);
        setIsWhiteTurn(!isWhiteTurn);
        socket.emit('move', { gameId, board: newBoard, isWhiteTurn: !isWhiteTurn });
      }
      setSelectedSquare(null);
    } else if (getBoard()[rowIndex][colIndex]) {
      setSelectedSquare(square);
    }
  };

  useEffect(() => {
    socket.on('move', ({ gameId: movedGameId, board, isWhiteTurn }) => {
      if (gameId === movedGameId) {
        setBoard(board);
        setIsWhiteTurn(isWhiteTurn);
      }
    });

    return () => socket.off('move');
  }, [socket, gameId]);

  return (
    <div className="flex flex-col items-center bg-wooden-pattern p-8 rounded-lg">
      <div className="flex justify-between w-full mb-4">
        <div className="text-white flex flex-col items-center">
          <div>{whitePlayer} (White)</div>
          <div>{`${Math.floor(whiteTime / 60)}:${('0' + (whiteTime % 60)).slice(-2)}`}</div>
        </div>
        <div className="text-white flex flex-col items-center">
          <div>{blackPlayer} (Black)</div>
          <div>{`${Math.floor(blackTime / 60)}:${('0' + (blackTime % 60)).slice(-2)}`}</div>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-0 border-4 border-brown-700 rounded-lg">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-20 h-20 flex justify-center items-center text-4xl 
              ${selectedSquare === String.fromCharCode(97 + colIndex) + (8 - rowIndex) ? 'bg-yellow-300' : ((rowIndex + colIndex) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-600')}`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              <span className={`text-${square && square.color === 'w' ? 'white' : 'black'}`}>
                {square ? pieceIcons[square.type] : ''}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
