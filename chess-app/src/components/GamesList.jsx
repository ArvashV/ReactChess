import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const GamesList = ({ socket }) => {
  const [games, setGames] = useState([]);
  const [whitePlayer, setWhitePlayer] = useState('');
  const [blackPlayer, setBlackPlayer] = useState('');
  const [timeControl, setTimeControl] = useState(5); // Default to 5 minutes
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      fetch('/games')
        .then((response) => response.json())
        .then((data) => setGames(data));
    }
  }, [socket]);

  const startGame = () => {
    const gameId = Math.random().toString(36).substr(2, 9);
    if (socket) {
      socket.emit('startGame', { gameId, whitePlayer, blackPlayer, timeControl });
      navigate(`/game/${gameId}`, { state: { whitePlayer, blackPlayer, timeControl } });
    } else {
      console.error('Socket is undefined');
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl text-white mb-4">Ongoing Games</h1>
      <div className="mb-4">
        {games.map((gameId) => (
          <Link
            key={gameId}
            to={`/game/${gameId}`}
            className="text-blue-500 underline mb-2 block"
          >
            Join Game {gameId}
          </Link>
        ))}
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl text-white mb-4">Start a New Game</h2>
        <input
          className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
          type="text"
          placeholder="White Player Name"
          value={whitePlayer}
          onChange={(e) => setWhitePlayer(e.target.value)}
        />
        <input
          className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
          type="text"
          placeholder="Black Player Name"
          value={blackPlayer}
          onChange={(e) => setBlackPlayer(e.target.value)}
        />
        <label className="text-white mb-2 block">Time Control (minutes):</label>
        <input
          className="mb-4 p-2 w-full bg-gray-700 text-white rounded"
          type="number"
          value={timeControl}
          onChange={(e) => setTimeControl(e.target.value)}
          min="1"
        />
        <button
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition-colors"
          onClick={startGame}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GamesList;
