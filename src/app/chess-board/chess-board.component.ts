import { Component } from '@angular/core';
import { ChessPositionComponent } from '../chess-position/chess-position.component';

@Component({
  selector: 'app-chess-board',
  imports: [ChessPositionComponent],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css',
})
export class ChessBoardComponent {

  readonly topPalaceDiagonals = [
    { row: 0, col: 3, direction: 'down-right' },
    { row: 0, col: 4, direction: 'down-left' },
    { row: 1, col: 3, direction: 'up-right' },
    { row: 1, col: 4, direction: 'up-left' },
  ];

  readonly bottomPalaceDiagonals = [
    { row: 7, col: 3, direction: 'down-right' },
    { row: 7, col: 4, direction: 'down-left' },
    { row: 8, col: 3, direction: 'up-right' },
    { row: 8, col: 4, direction: 'up-left' },
  ];

  isPalaceDiagonal(row: number, col: number, direction: string): boolean {
    return [...this.topPalaceDiagonals, ...this.bottomPalaceDiagonals].some(
      (item) => item.row === row && item.col === col && item.direction === direction,
    );
  }
}
