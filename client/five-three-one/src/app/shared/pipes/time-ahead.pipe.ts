import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'timeAhead',
  standalone: true,
})
export class TimeAheadPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) public locale: string,) { }

  transform(value: string): any {
    if (value) {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dayvalue = value.slice(0, 10);
        if (today.toISOString().slice(0, 10) === dayvalue) {
            return 'Today'
        }

        if (tomorrow.toISOString().slice(0,10) === dayvalue) {
          return 'Tomorrow'
        }

    
        return formatDate(new Date(value), 'EEEE, MMMM d', this.locale);
    }
    return value;
  }

}
