import { Component, computed, inject, input, signal } from '@angular/core';
import { ChessPiece } from '../shared/constants/chess';
import { NgClass } from '@angular/common';
import { ChessService } from '../shared/services/chess.service';

@Component({
  selector: 'app-chess',
  imports: [NgClass],
  templateUrl: './chess.component.html',
  styleUrl: './chess.component.css',
})
export class ChessComponent {
  private readonly chessService = inject(ChessService);
  readonly chess = input.required<ChessPiece>();
  readonly side = input.required<'red' | 'black'>();
  readonly isSelected = input.required<boolean>();
  readonly isCaptureTarget = input.required<boolean>();
  readonly chessUnicodeMap: Record<ChessPiece, string> = {
    General: '帥',
    Advisor: '仕',
    Elephant: '相',
    Horse: '傌',
    Chariot: '俥',
    Cannon: '炮',
    Soldier: '兵',
  };
  readonly chessUnicode = computed(() => this.chessUnicodeMap[this.chess()]);
  readonly isClickable = computed(() => {
    if (!this.chessService.isGameStarted() || this.chessService.isMovePending()) {
      return false;
    }
    return this.chessService.turn() === this.side();
  });
}
