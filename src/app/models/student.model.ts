export class Student {
  id: number;
  name: string;
  email: string;
  department: number;
  semester: number;
  attendance: { sname: string; present: number }[];

  constructor(
    id: number,
    name: string,
    email: string,
    department: number,
    semester: number,
    attendance: { sname: string; present: number }[]
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.department = department;
    this.semester = semester;
    this.attendance = attendance;
  }
}
