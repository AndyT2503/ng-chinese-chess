import { Component, inject } from '@angular/core';
import { ChessService } from '../shared/services/chess.service';
import { TimerService } from '../shared/services/timer.service';
import { FormatTimePipe } from './format-time.pipe';
import { NgClass } from '@angular/common';
import { ChessMode } from '../shared/constants/chess-mode';

@Component({
  selector: 'app-timer',
  imports: [FormatTimePipe, NgClass],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
})
export class TimerComponent {
  readonly timerService = inject(TimerService);
  readonly chessService = inject(ChessService);
  readonly modeOptions: { label: string; value: ChessMode }[] = [
    { label: 'Blitz (5 mins)', value: 'blitz' },
    { label: 'Standard (30 mins)', value: 'standard' },
  ] as const;

  clickToggleTimer(): void {
    const isInitialized = this.chessService.isGameStarted();

    if (!isInitialized) {
      this.chessService.startGame();
      this.timerService.triggerTimer(this.chessService.turn());
      return;
    }

    if (!this.chessService.isMovePending()) {
      return;
    }

    this.timerService.stopTimer(this.chessService.turn());
    this.chessService.updateTurn();
    this.timerService.triggerTimer(this.chessService.turn());
    this.chessService.clearMovePending();
  }

  changeMode(mode: ChessMode): void {
    this.timerService.updateMode(mode);
    this.chessService.resetGame();
  }
}
