import { linkedSignal, Service, signal } from '@angular/core';
import { interval, Subject, Subscription, tap } from 'rxjs';
import { ChessMode } from '../constants/chess-mode';
import { ChessSide } from '../models/chess.model';

export const CHESS_MODE_TIMES: Record<ChessMode, number> = {
  standard: 30 * 60,
  blitz: 5 * 60,
} as const;

@Service()
export class TimerService {
  private readonly _mode = signal<ChessMode>('standard');
  private readonly _redTime = linkedSignal(() => CHESS_MODE_TIMES[this._mode()]);
  private readonly _blackTime = linkedSignal(() => CHESS_MODE_TIMES[this._mode()]);

  private readonly _notifyWin$ = new Subject<ChessSide>();
  private redSubscription!: Subscription;
  private blackSubscription!: Subscription;
  private readonly _redTimer$ = interval(1000).pipe(
    tap(() => {
      this._redTime.update((t) => t - 1);
      if (this._redTime() <= 0) {
        this._notifyWin$.next('black');
      }
    }),
  );
  private readonly _blackTimer$ = interval(1000).pipe(
    tap(() => {
      this._blackTime.update((t) => t - 1);
      if (this._blackTime() <= 0) {
        this._notifyWin$.next('red');
      }
    }),
  );

  readonly notifyWin$ = this._notifyWin$.asObservable();
  readonly mode = this._mode.asReadonly();

  updateMode(mode: ChessMode): void {
    this._mode.set(mode);
    this.resetTime();
  }

  resetTime(): void {
    this.setInitialTime();
    this.redSubscription?.unsubscribe();
    this.blackSubscription?.unsubscribe();
  }

  readonly redTime = this._redTime.asReadonly();
  readonly blackTime = this._blackTime.asReadonly();

  triggerTimer(side: ChessSide): void {
    if (side === 'red') {
      this.redSubscription = this._redTimer$.subscribe();
    } else {
      this.blackSubscription = this._blackTimer$.subscribe();
    }
  }

  stopTimer(side: ChessSide): void {
    if (side === 'red') {
      this.redSubscription.unsubscribe();
    } else {
      this.blackSubscription.unsubscribe();
    }
  }

  private setInitialTime(): void {
    this._redTime.set(CHESS_MODE_TIMES[this._mode()]);
    this._blackTime.set(CHESS_MODE_TIMES[this._mode()]);
  }
}
