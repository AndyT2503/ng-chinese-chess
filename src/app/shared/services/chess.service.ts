import { ChangeDetectorRef, inject, Injectable, Service, signal } from '@angular/core';
import { CHESS_PIECES } from '../constants/chess';
import { BoardMark, ChessPiecePosition, ChessPosition, ChessSide } from '../models/chess.model';
import { TimerService } from './timer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const initialChessPiecesPositions: ChessPiecePosition[] = [
  // Black
  { piece: CHESS_PIECES.CHARIOT, x: 0, y: 0, side: 'black' },
  { piece: CHESS_PIECES.HORSE, x: 1, y: 0, side: 'black' },
  { piece: CHESS_PIECES.ELEPHANT, x: 2, y: 0, side: 'black' },
  { piece: CHESS_PIECES.ADVISOR, x: 3, y: 0, side: 'black' },
  { piece: CHESS_PIECES.GENERAL, x: 4, y: 0, side: 'black' },
  { piece: CHESS_PIECES.ADVISOR, x: 5, y: 0, side: 'black' },
  { piece: CHESS_PIECES.ELEPHANT, x: 6, y: 0, side: 'black' },
  { piece: CHESS_PIECES.HORSE, x: 7, y: 0, side: 'black' },
  { piece: CHESS_PIECES.CHARIOT, x: 8, y: 0, side: 'black' },

  { piece: CHESS_PIECES.CANNON, x: 1, y: 2, side: 'black' },
  { piece: CHESS_PIECES.CANNON, x: 7, y: 2, side: 'black' },

  { piece: CHESS_PIECES.SOLDIER, x: 0, y: 3, side: 'black' },
  { piece: CHESS_PIECES.SOLDIER, x: 2, y: 3, side: 'black' },
  { piece: CHESS_PIECES.SOLDIER, x: 4, y: 3, side: 'black' },
  { piece: CHESS_PIECES.SOLDIER, x: 6, y: 3, side: 'black' },
  { piece: CHESS_PIECES.SOLDIER, x: 8, y: 3, side: 'black' },

  // Red
  { piece: CHESS_PIECES.CHARIOT, x: 0, y: 9, side: 'red' },
  { piece: CHESS_PIECES.HORSE, x: 1, y: 9, side: 'red' },
  { piece: CHESS_PIECES.ELEPHANT, x: 2, y: 9, side: 'red' },
  { piece: CHESS_PIECES.ADVISOR, x: 3, y: 9, side: 'red' },
  { piece: CHESS_PIECES.GENERAL, x: 4, y: 9, side: 'red' },
  { piece: CHESS_PIECES.ADVISOR, x: 5, y: 9, side: 'red' },
  { piece: CHESS_PIECES.ELEPHANT, x: 6, y: 9, side: 'red' },
  { piece: CHESS_PIECES.HORSE, x: 7, y: 9, side: 'red' },
  { piece: CHESS_PIECES.CHARIOT, x: 8, y: 9, side: 'red' },
  { piece: CHESS_PIECES.CANNON, x: 1, y: 7, side: 'red' },
  { piece: CHESS_PIECES.CANNON, x: 7, y: 7, side: 'red' },
  { piece: CHESS_PIECES.SOLDIER, x: 0, y: 6, side: 'red' },
  { piece: CHESS_PIECES.SOLDIER, x: 2, y: 6, side: 'red' },
  { piece: CHESS_PIECES.SOLDIER, x: 4, y: 6, side: 'red' },
  { piece: CHESS_PIECES.SOLDIER, x: 6, y: 6, side: 'red' },
  { piece: CHESS_PIECES.SOLDIER, x: 8, y: 6, side: 'red' },
];

@Service()
export class ChessService {
  private readonly timerService = inject(TimerService);
  private readonly _turn = signal<ChessSide>('red');
  private readonly _isGameStarted = signal(false);
  private readonly _isMovePending = signal(false);
  private readonly _chessPiecesPositions = signal(structuredClone(initialChessPiecesPositions));

  readonly isMovePending = this._isMovePending.asReadonly();
  readonly notifyWin$ = this.timerService.notifyWin$.pipe(takeUntilDestroyed());
  readonly turn = this._turn.asReadonly();
  readonly isGameStarted = this._isGameStarted.asReadonly();
  readonly chessPiecesPositions = this._chessPiecesPositions.asReadonly();
  

  constructor() {
    this.notifyWin$.subscribe((winner) => {
      this.notifyWin(winner);
    });
  }

  clearMovePending(): void {
    this._isMovePending.set(false);
  }

  resetGame(): void {
    this._chessPiecesPositions.set(structuredClone(initialChessPiecesPositions));
    this._turn.set('red');
    this._isGameStarted.set(false);
    this.timerService.resetTime();
    this.clearMovePending();
  }

  startGame(): void {
    this._isGameStarted.set(true);
  }

  getChessPieceAtPosition(x: number, y: number): ChessPiecePosition | undefined {
    return this._chessPiecesPositions().find(( piece) => piece.x === x && piece.y === y);
  }

  updateChessPiecePosition(chessPiece: ChessPiecePosition, newX: number, newY: number): void {
    const chessPieceAtNewPosition = this.getChessPieceAtPosition(newX, newY);
    if (chessPieceAtNewPosition) {
      this._chessPiecesPositions.update((pieces) =>
        pieces.filter(
          (piece) => piece.x !== chessPieceAtNewPosition.x || piece.y !== chessPieceAtNewPosition.y
        )
      );
    }
    const pieceIndex = this._chessPiecesPositions().findIndex(
      (piece) => piece.x === chessPiece.x && piece.y === chessPiece.y,
    );
    if (pieceIndex !== -1) {
      this._chessPiecesPositions.update((pieces) => {
        pieces[pieceIndex] = { ...chessPiece, x: newX, y: newY };
        return pieces;
      });
    }
    this._isMovePending.set(true);
    this.checkWinCondition();
  }

  updateTurn(): void {
    this._turn.set(this._turn() === 'red' ? 'black' : 'red');
  }

  isValidMove(chessPiece: ChessPiecePosition, newX: number, newY: number): boolean {
    const potentialMoves = this.getPotentialMoves(chessPiece);
    return potentialMoves.some((move) => move.x === newX && move.y === newY);
  }

  getPotentialMoves(chessPiece: ChessPiecePosition): ChessPosition[] {
    switch (chessPiece.piece) {
      case CHESS_PIECES.CHARIOT:
        return this.getChariotMoves(chessPiece);

      case CHESS_PIECES.CANNON:
        return this.getCannonMoves(chessPiece);

      case CHESS_PIECES.HORSE:
        return this.getHorseMoves(chessPiece);

      case CHESS_PIECES.ELEPHANT:
        return this.getElephantMoves(chessPiece);

      case CHESS_PIECES.ADVISOR:
        return this.getAdvisorMoves(chessPiece);

      case CHESS_PIECES.GENERAL:
        return this.getGeneralMoves(chessPiece);

      case CHESS_PIECES.SOLDIER:
        return this.getSoldierMoves(chessPiece);

      default:
        return [];
    }
  }

  private notifyWin(winner: ChessSide): void {
    const isResetConfirmed = confirm(
      `${winner.toUpperCase()} wins! Do you want to reset the game?`,
    );
    if (isResetConfirmed) {
      this.resetGame();
    }
  }

  private checkWinCondition(): void {
    const currentTurn = this._turn();
    const opponentGeneral = this._chessPiecesPositions().find(
      (piece) => piece.piece === CHESS_PIECES.GENERAL && piece.side !== currentTurn,
    );
    if (!opponentGeneral) {
      this.notifyWin(currentTurn);
    }
  }

  private isInsideBoard(x: number, y: number): boolean {
    return x >= 0 && x <= 8 && y >= 0 && y <= 9;
  }

  private isEmpty(x: number, y: number): boolean {
    return !this.getChessPieceAtPosition(x, y);
  }

  private canMoveTo(x: number, y: number, side: ChessSide): boolean {
    if (!this.isInsideBoard(x, y)) {
      return false;
    }

    const piece = this.getChessPieceAtPosition(x, y);

    return !piece || piece.side !== side;
  }

  private getChariotMoves(chessPiece: ChessPiecePosition): ChessPosition[] {
    const moves: ChessPosition[] = [];

    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];

    for (const [dx, dy] of directions) {
      let x = chessPiece.x + dx;
      let y = chessPiece.y + dy;

      while (this.isInsideBoard(x, y)) {
        const target = this.getChessPieceAtPosition(x, y);

        if (!target) {
          moves.push({ x, y });
        } else {
          if (target.side !== chessPiece.side) {
            moves.push({ x, y });
          }

          break;
        }

        x += dx;
        y += dy;
      }
    }

    return moves;
  }

  private getCannonMoves(chessPiece: ChessPiecePosition): ChessPosition[] {
    const moves: ChessPosition[] = [];

    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];

    for (const [dx, dy] of directions) {
      let x = chessPiece.x + dx;
      let y = chessPiece.y + dy;

      let jumped = false;

      while (this.isInsideBoard(x, y)) {
        const target = this.getChessPieceAtPosition(x, y);

        if (!jumped) {
          if (!target) {
            moves.push({ x, y });
          } else {
            jumped = true;
          }
        } else {
          if (target) {
            if (target.side !== chessPiece.side) {
              moves.push({ x, y });
            }

            break;
          }
        }

        x += dx;
        y += dy;
      }
    }

    return moves;
  }

  private getHorseMoves(chessPiece: ChessPiecePosition): ChessPosition[] {
    const moves: ChessPosition[] = [];

    const patterns = [
      { block: [0, -1], move: [-1, -2] },
      { block: [0, -1], move: [1, -2] },
      { block: [0, 1], move: [-1, 2] },
      { block: [0, 1], move: [1, 2] },
      { block: [-1, 0], move: [-2, -1] },
      { block: [-1, 0], move: [-2, 1] },
      { block: [1, 0], move: [2, -1] },
      { block: [1, 0], move: [2, 1] },
    ];

    for (const pattern of patterns) {
      const blockX = chessPiece.x + pattern.block[0];
      const blockY = chessPiece.y + pattern.block[1];

      if (!this.isEmpty(blockX, blockY)) {
        continue;
      }

      const x = chessPiece.x + pattern.move[0];
      const y = chessPiece.y + pattern.move[1];

      if (this.canMoveTo(x, y, chessPiece.side)) {
        moves.push({ x, y });
      }
    }

    return moves;
  }

  private getElephantMoves(chessPiece: ChessPiecePosition): ChessPosition[] {
    const moves: ChessPosition[] = [];

    const directions = [
      [-2, -2],
      [2, -2],
      [-2, 2],
      [2, 2],
    ];

    for (const [dx, dy] of directions) {
      const x = chessPiece.x + dx;
      const y = chessPiece.y + dy;

      const eyeX = chessPiece.x + dx / 2;
      const eyeY = chessPiece.y + dy / 2;

      if (!this.isEmpty(eyeX, eyeY)) {
        continue;
      }

      if (chessPiece.side === 'red' && y < 5) {
        continue;
      }

      if (chessPiece.side === 'black' && y > 4) {
        continue;
      }

      if (this.canMoveTo(x, y, chessPiece.side)) {
        moves.push({ x, y });
      }
    }

    return moves;
  }

  private getAdvisorMoves(chessPiece: ChessPiecePosition): ChessPosition[] {
    const moves: ChessPosition[] = [];

    const palaceY = chessPiece.side === 'red' ? [7, 8, 9] : [0, 1, 2];

    const directions = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      const x = chessPiece.x + dx;
      const y = chessPiece.y + dy;

      if (x >= 3 && x <= 5 && palaceY.includes(y) && this.canMoveTo(x, y, chessPiece.side)) {
        moves.push({ x, y });
      }
    }

    return moves;
  }

  private getGeneralMoves(chessPiece: ChessPiecePosition): ChessPosition[] {
    const moves: ChessPosition[] = [];

    const palaceY = chessPiece.side === 'red' ? [7, 8, 9] : [0, 1, 2];

    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];

    for (const [dx, dy] of directions) {
      const x = chessPiece.x + dx;
      const y = chessPiece.y + dy;

      if (x >= 3 && x <= 5 && palaceY.includes(y) && this.canMoveTo(x, y, chessPiece.side)) {
        moves.push({ x, y });
      }
    }

    return moves;
  }

  private getSoldierMoves(chessPiece: ChessPiecePosition): ChessPosition[] {
    const moves: ChessPosition[] = [];

    const { x, y, side } = chessPiece;

    const addMove = (x: number, y: number) => {
      if (this.canMoveTo(x, y, side)) {
        moves.push({ x, y });
      }
    };

    if (side === 'red') {
      addMove(x, y - 1);

      if (y <= 4) {
        addMove(x - 1, y);
        addMove(x + 1, y);
      }
    } else {
      addMove(x, y + 1);

      if (y >= 5) {
        addMove(x - 1, y);
        addMove(x + 1, y);
      }
    }

    return moves;
  }
}
