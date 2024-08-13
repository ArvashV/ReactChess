import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChessBoard from './components/ChessBoard';
import GamesList from './components/GamesList';
import { io } from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the WebSocket connection
    const newSocket = io('http://localhost:4000', {
      transports: ['websocket', 'polling'],
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  if (!socket) return <div>Loading...</div>; 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<GamesList socket={socket} />} />
        <Route path="/game/:gameId" element={<ChessBoard socket={socket} />} />
      </Routes>
    </Router>
  );
};

export default App;
