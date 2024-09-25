import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  constructor(private datepipe: DatePipe) { }

  transform(value: any): any {
    if (value) {
      const differenceInSeconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (differenceInSeconds < 30) {
        return 'Just now';
      }

      if (differenceInSeconds < 8640 && differenceInSeconds > 30) {
        return 'Today';
      }

      const upperLimit = 604800;
      if (differenceInSeconds > upperLimit) {
        return this.datepipe.transform(new Date(value), 'MMMM d, y');
      }

      const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1,
      };
      let counter: number;
      for (const interval in intervals) {
        counter = Math.floor(differenceInSeconds / intervals[interval]);

        if (counter > 0) {
          if (counter === 1) {
            // singular (e.g., 1 day ago)
            return `${counter} ${interval} ago`;
          } else {
            // plural (e.g., 2 days ago)
            return `${counter} ${interval}s ago`;
          }
        }
      }
    }
    return value;
  }

}
