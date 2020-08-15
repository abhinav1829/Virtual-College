import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: string): string {
    let year = value.slice(0, 4);
    let month = value.slice(4, 6);
    let day = value.slice(6, 8);
    let hour = value.slice(8, 10);
    let minute = value.slice(10, 12);
    return day + '/' + month + '/' + year + ' ' + hour + ':' + minute;
  }
}
