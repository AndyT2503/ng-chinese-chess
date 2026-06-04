import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChessService } from './shared/services/chess.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly chessService = inject(ChessService);
}
