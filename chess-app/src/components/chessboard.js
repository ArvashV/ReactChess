import { Chess } from 'chess.js';

export const chess = new Chess();

export const pieceIcons = {
  p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
  P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
};

export const getBoard = () => {
  return chess.board();
};

export const handleMove = (from, to) => {
  const move = chess.move({ from, to });
  return move ? chess.board() : null;
};

export const resetGame = () => {
  chess.reset();
};
