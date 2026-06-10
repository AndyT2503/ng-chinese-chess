import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatTime',
  standalone: true,
})
export class FormatTimePipe {
  transform(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
