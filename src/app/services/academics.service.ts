import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { Attendance } from '../models/attendance.model';
import { Report } from '../models/report.model';
import { Student } from '../models/student.model';
import { Syllabus } from '../models/syllabus.model';

@Injectable({
  providedIn: 'root',
})
export class AcademicsService {
  constructor(
    private authService: AuthService,
    private fireDatabase: AngularFireDatabase
  ) {}

  timer(s: number) {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Timed out in ' + s + 's.');
      }, s * 1000);
    });
  }

  getData() {
    return Promise.race([
      this.timer(7),
      new Promise((resolve, reject) => {
        this.syncData().then(
          (student: Student) => {
            resolve(
              Promise.all([
                this.syncAttendance(student),
                this.syncReport(student),
                this.syncSyllabi(student),
              ])
            );
          },
          (error) => {
            reject(error);
          }
        );
      }),
    ]);
  }

  syncData() {
    return new Promise((resolve, reject) => {
      this.fireDatabase.database.ref('/students/' + this.authService.id).once(
        'value',
        (snapshot) => {
          let attendance: { sname: string; present: number }[] = [];
          let report: Report[][] = new Array<Report[]>(5);
          let elements = ['insem', 'endsem', 'termwork', 'practical', 'oral'];
          snapshot.child('attendance').forEach((subject) => {
            attendance.push({ sname: subject.key, present: subject.val() });
          });
          for (const [index, value] of elements.entries()) {
            report[index] = [];
            snapshot.child('report/' + value).forEach((subject) => {
              report[index].push(new Report(subject.key, subject.val(), 0));
            });
          }
          resolve(
            new Student(
              snapshot.child('id').val(),
              snapshot.child('name').val(),
              snapshot.child('email').val(),
              snapshot.child('department').val(),
              snapshot.child('semester').val(),
              attendance,
              report
            )
          );
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  }

  syncAttendance(student: Student) {
    return new Promise((resolve, reject) => {
      let attendance: Attendance[] = [];
      this.fireDatabase.database
        .ref('/subjects/' + student.department + '/' + student.semester)
        .orderByChild('sname')
        .once(
          'value',
          (snapshot) => {
            let i = 0;
            snapshot.forEach((subject) => {
              attendance.push(
                new Attendance(
                  student.attendance[i].sname,
                  student.attendance[i].present,
                  subject.child('total').val()
                )
              );
              i++;
            });
            resolve(attendance);
          },
          (error) => {
            reject(error.message);
          }
        );
    });
  }

  syncReport(student: Student) {
    return new Promise((resolve, reject) => {
      let i: number;
      let buf: Report[];
      let report: Report[][] = student.report;
      let elements = ['insem', 'endsem', 'termwork', 'practical', 'oral'];
      this.fireDatabase.database
        .ref('/reports/' + student.department + '/' + student.semester)
        .once(
          'value',
          (snapshot) => {
            for (const [index, value] of elements.entries()) {
              i = 0;
              buf = report[index];
              report[index] = [];
              snapshot.child(value).forEach((subject) => {
                if (buf[i].sname === subject.key) {
                  report[index].push(
                    new Report(buf[i].sname, buf[i].marks, subject.val())
                  );
                } else {
                  report[index].push(
                    new Report(subject.key, -1, subject.val())
                  );
                  i--;
                }
                if (typeof buf[i + 1] !== 'undefined') {
                  i++;
                }
              });
            }
            resolve(report);
          },
          (error) => {
            reject(error.message);
          }
        );
    });
  }

  syncSyllabi(student: Student) {
    return new Promise((resolve, reject) => {
      let syllabi: Syllabus[] = [];
      this.fireDatabase.database.ref('/syllabi').once(
        'value',
        (snapshot) => {
          snapshot.forEach((department) => {
            syllabi.push(
              new Syllabus(
                department.child('department').val(),
                department.child('description').val(),
                department.hasChild('1')
                  ? [
                      {
                        name: department.child('0/name').val(),
                        downloadUrl: department.child('0/link').val(),
                      },
                      {
                        name: department.child('1/name').val(),
                        downloadUrl: department.child('1/link').val(),
                      },
                      {
                        name: department.child('2/name').val(),
                        downloadUrl: department.child('2/link').val(),
                      },
                    ]
                  : [
                      {
                        name: department.child('0/name').val(),
                        downloadUrl: department.child('0/link').val(),
                      },
                    ]
              )
            );
          });
          resolve(syllabi);
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  }
}
