import { ChessPiece } from '../constants/chess';

export type ChessSide = 'red' | 'black';

export interface ChessPosition {
  x: number;
  y: number;
}

export interface ChessPiecePosition extends ChessPosition {
  piece: ChessPiece;
  side: ChessSide;
}

export interface BoardMark {
  x: number;
  y: number;
  topLeft?: boolean;
  topRight?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
}