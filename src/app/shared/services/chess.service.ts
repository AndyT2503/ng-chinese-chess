import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChessService {
  xAis = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  yAis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
}
