import { Component } from '@angular/core';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { ChessPositionComponent } from './chess-position/chess-position.component';
import { TimerComponent } from './timer/timer.component';

@Component({
  selector: 'app-root',
  imports: [ChessBoardComponent, TimerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
