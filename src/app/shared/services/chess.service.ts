import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChessService {
  xAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  yAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
}
