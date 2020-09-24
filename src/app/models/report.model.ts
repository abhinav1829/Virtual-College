export class Report {
  sname: string;
  marks: number;
  total: number;

  constructor(sname: string, marks: number, total: number) {
    this.sname = sname;
    this.marks = marks;
    this.total = total;
  }
}
