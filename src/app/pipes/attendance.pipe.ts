import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attendance',
})
export class AttendancePipe implements PipeTransform {
  transform(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
