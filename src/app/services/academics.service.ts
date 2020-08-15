import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { Attendance } from '../models/attendance.model';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class AcademicsService {
  private student: Student;
  private attendance: Attendance[];

  constructor(
    private fireDatabase: AngularFireDatabase,
    private authService: AuthService
  ) {
    this.syncData().then(
      (student: Student) => {
        this.student = student;
        this.syncAttendance().then(
          (attendance: Attendance[]) => {
            this.attendance = attendance;
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAttendance() {
    return this.attendance;
  }

  syncData() {
    return new Promise((resolve, reject) => {
      this.fireDatabase.database
        .ref('/students/' + this.authService.getID())
        .once(
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

  syncAttendance() {
    return new Promise((resolve, reject) => {
      let attendance = [];
      this.fireDatabase.database
        .ref(
          '/subjects/' + this.student.department + '/' + this.student.semester
        )
        .orderByChild('sname')
        .once(
          'value',
          (snapshot) => {
            let i = 0;
            let a = this.student.attendance;
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
            if (attendance.length > 0) {
              resolve(attendance);
            } else {
              reject('Attendance not available for ' + this.student.id + '.');
            }
          },
          (error) => {
            reject(error.message);
          }
        );
    });
  }
}
