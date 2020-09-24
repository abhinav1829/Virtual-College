export class Article {
  head: string;
  body: string;
  details: string[];
  links: string[];
  date: string;
  cover: string;

  constructor(
    head: string,
    body: string,
    details: string[],
    links: string[],
    date: string,
    cover: string
  ) {
    this.head = head;
    this.body = body;
    this.details = details;
    this.links = links;
    this.date = date;
    this.cover = cover;
  }
}
