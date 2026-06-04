import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChessService } from './shared/services/chess.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly chessService = inject(ChessService);

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
