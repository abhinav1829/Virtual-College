import { formatDate } from '@angular/common';

export class Circular {
  file: File;
  head: string;
  name: string;
  date: Date;

  constructor(head: string, file: File) {
    this.head = head;
    this.file = file;
    let date = new Date();
    this.name = formatDate(date, 'yyyyMMddHHmmss', 'en-IN');
    this.date = date;
  }
}
