const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let games = {};

app.use(cors());
app.use(express.json());

app.get('/games', (req, res) => {
  res.json(Object.keys(games));
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('startGame', ({ gameId, whitePlayer, blackPlayer, timeControl }) => {
    games[gameId] = { board: null, whitePlayer, blackPlayer, timeControl };
    io.emit('gamesList', Object.keys(games));
  });

  socket.on('move', ({ gameId, board, isWhiteTurn }) => {
    if (games[gameId]) {
      games[gameId].board = board;
      io.emit('move', { gameId, board, isWhiteTurn });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
