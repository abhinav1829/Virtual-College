export class Attendance {
  sname: string;
  present: number;
  total: number;
  percentage: number;

  constructor(sname: string, present: number, total: number) {
    this.sname = sname;
    this.present = present;
    this.total = total;
    this.percentage = (present / total) * 100;
  }
}
