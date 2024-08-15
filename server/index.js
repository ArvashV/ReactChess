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

app.post('/game', (req, res) => {
  const { gameId, whitePlayer, blackPlayer, timeControl } = req.body;
  if (!games[gameId]) {
    games[gameId] = {
      whitePlayer,
      blackPlayer,
      timeControl,
      board: null,
      moveHistory: [],
      isWhiteTurn: true,
      whiteTime: timeControl * 60,
      blackTime: timeControl * 60,
    };
  }
  res.status(200).send('Game created');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('startGame', ({ gameId, whitePlayer, blackPlayer, timeControl }) => {
    if (!games[gameId]) {
      games[gameId] = {
        whitePlayer,
        blackPlayer,
        timeControl,
        board: null,
        moveHistory: [],
        isWhiteTurn: true,
        whiteTime: timeControl * 60,
        blackTime: timeControl * 60,
      };
      io.emit('gamesList', Object.keys(games));
    }
  });

  socket.on('move', ({ gameId, board, isWhiteTurn, move }) => {
    if (games[gameId]) {
      games[gameId].board = board;
      games[gameId].isWhiteTurn = isWhiteTurn;
      games[gameId].moveHistory.push(move);
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
