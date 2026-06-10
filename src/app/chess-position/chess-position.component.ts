import { Component, inject } from '@angular/core';
import { ChessComponent } from '../chess/chess.component';
import { BoardMark, ChessPiecePosition, ChessPosition } from '../shared/models/chess.model';
import { ChessService } from '../shared/services/chess.service';

const BOARD_MARKS: BoardMark[] = [
  {
    x: 1,
    y: 2,
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
  {
    x: 7,
    y: 2,
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
  {
    x: 1,
    y: 7,
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
  {
    x: 7,
    y: 7,
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
  { x: 0, y: 3, topRight: true, bottomRight: true },
  {
    x: 2,
    y: 3,
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
  {
    x: 4,
    y: 3,
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
  {
    x: 6,
    y: 3,
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
  { x: 8, y: 3, topLeft: true, bottomLeft: true },
  { x: 0, y: 6, topRight: true, bottomRight: true },
  {
    x: 2,
    y: 6,
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
  {
    x: 4,
    y: 6,
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
  {
    x: 6,
    y: 6,
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
  { x: 8, y: 6, topLeft: true, bottomLeft: true },
];

@Component({
  selector: 'app-chess-position',
  imports: [ChessComponent],
  templateUrl: './chess-position.component.html',
  styleUrl: './chess-position.component.css',
})
export class ChessPositionComponent {
  readonly chessService = inject(ChessService);

  chessMove: ChessPiecePosition | null = null;

  getChessAtPosition(x: number, y: number): ChessPiecePosition | null {
    const chessPiecePosition = this.chessService.getChessPieceAtPosition(x, y);
    return chessPiecePosition ? chessPiecePosition : null;
  }

  getBoardMark(x: number, y: number): BoardMark | undefined {
    return BOARD_MARKS.find((mark) => mark.x === x && mark.y === y);
  }

  onChessClick(chessPiece: ChessPiecePosition) {
    if (
      (!this.chessMove && chessPiece.side !== this.chessService.turn()) ||
      !this.chessService.isGameStarted() || this.chessService.isMovePending()
    ) {
      return;
    }
    if (this.chessMove) {
      if (this.chessMove.x === chessPiece.x && this.chessMove.y === chessPiece.y) {
        this.chessMove = null;
        return;
      }
      this.updateChessPosition(chessPiece.x, chessPiece.y);
      return;
    }
    this.chessMove = chessPiece;
  }

  updateChessPosition(newX: number, newY: number): void {
    if (this.chessMove) {
      const isValidMove = this.chessService.isValidMove(this.chessMove, newX, newY);
      if (!isValidMove) {
        return;
      }
      this.chessService.updateChessPiecePosition(this.chessMove, newX, newY);
      this.chessMove = null;
    }
  }

  getPotentialMoveMarks(): ChessPosition[] {
    if (!this.chessMove) {
      return [];
    }
    return this.chessService.getPotentialMoves(this.chessMove);
  }
}
