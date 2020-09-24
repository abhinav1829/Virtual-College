export class Attendance {
  sname: string;
  present: number;
  total: number;
  percentage: number;

  constructor(sname: string, present: number, total: number) {
    this.sname = sname;
    this.present = present;
    this.total = total;
    this.percentage = total === 0 ? -1 : (present / total) * 100;
  }
}
