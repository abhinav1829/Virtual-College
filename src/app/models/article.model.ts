import { formatDate } from '@angular/common';

export class Article {
  head: string;
  body: string;
  back: string;
  details: string[];
  link: string[];
  date: string;
  constructor(
    head: string,
    body: string,
    back: string,
    details: string[],
    link: string[]
  ) {
    this.head = head;
    this.body = body;
    this.back = back;
    this.details = details;
    this.link = link;
    this.date = formatDate(new Date(), 'yyyyMMddHHmmss', 'en-IN');
  }
}
