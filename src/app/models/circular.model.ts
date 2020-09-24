export class Circular {
  subject: string;
  author: string;
  date: string;
  downloadUrl: string;

  constructor(
    subject: string,
    author: string,
    date: string,
    downloadUrl: string
  ) {
    this.subject = subject;
    this.author = author;
    this.date = date;
    this.downloadUrl = downloadUrl;
  }
}
