import { Report } from './report.model';

export class Student {
  id: number;
  name: string;
  email: string;
  department: number;
  semester: number;
  attendance: { sname: string; present: number }[];
  report: Report[][];

  constructor(
    id: number,
    name: string,
    email: string,
    department: number,
    semester: number,
    attendance: { sname: string; present: number }[],
    report: Report[][]
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.department = department;
    this.semester = semester;
    this.attendance = attendance;
    this.report = report;
  }
}
