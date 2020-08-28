import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { Attendance } from '../models/attendance.model';
import { Student } from '../models/student.model';

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

  getAttendance() {
    return Promise.race([
      this.timer(7),
      new Promise((resolve, reject) => {
        this.syncData().then(
          (student: Student) => {
            this.syncAttendance(student).then(
              (attendance) => {
                resolve(attendance);
              },
              (error) => {
                reject(error);
              }
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
          let a: { sname: string; present: number }[] = [];
          snapshot.child('attendance').forEach((subject) => {
            a.push({ sname: subject.key, present: subject.val() });
          });
          resolve(
            new Student(
              snapshot.child('id').val(),
              snapshot.child('name').val(),
              snapshot.child('email').val(),
              snapshot.child('department').val(),
              snapshot.child('semester').val(),
              a
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
      let attendance = [];
      this.fireDatabase.database
        .ref('/subjects/' + student.department + '/' + student.semester)
        .orderByChild('sname')
        .once(
          'value',
          (snapshot) => {
            let a = student.attendance;
            let i = 0;
            snapshot.forEach((subject) => {
              attendance.push(
                new Attendance(
                  a[i].sname,
                  a[i].present,
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
}
