import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: number): string {
    let x = value.toString();
    let year = x.slice(0, 4);
    let month = x.slice(4, 6);
    let day = x.slice(6, 8);
    let hour = x.slice(8, 10);
    let minute = x.slice(10, 12);
    return day + '/' + month + '/' + year + ' ' + hour + ':' + minute;
  }
}
