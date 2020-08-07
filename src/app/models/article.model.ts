import { formatDate } from '@angular/common';

export class Article {
  head: string;
  body: string;
  back: string;
  date: string;
  constructor(head: string, body: string, back: string) {
    this.head = head;
    this.body = body;
    this.back = back;
    this.date = formatDate(new Date(), 'yyyyMMddHHmmss', 'en-IN');
  }
}
