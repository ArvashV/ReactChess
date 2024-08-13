import { chess } from './chess'; 

export const handleMove = (from, to) => {
  const move = chess.move({ from, to });
  if (!move) {
    return { valid: false, error: 'Invalid move' };
  }
  return { valid: true, board: chess.board(), move };
};

export const resetGame = () => {
  chess.reset();
  return chess.board();
};

export const getMoveNotation = (move) => {
  return move.san;  
};
