export class Syllabus {
  name: string;
  description: string;
  syllabus: { name: string; downloadUrl: string }[];

  constructor(
    name: string,
    description: string,
    syllabus: { name: string; downloadUrl: string }[]
  ) {
    this.name = name;
    this.description = description;
    this.syllabus = syllabus;
  }
}
