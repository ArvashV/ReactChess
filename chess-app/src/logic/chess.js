import { Chess } from 'chess.js';

export const chess = new Chess();

export const pieceIcons = {
  p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
  P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
};

export const getBoard = () => {
  return chess.board();
};

export const isGameOver = () => {
  return chess.isGameOver();
};

export const isCheck = () => {
  return chess.inCheck();
};

export const isCheckmate = () => {
  return chess.isCheckmate();
};

export const getHistory = () => {
  return chess.history({ verbose: true });
};


