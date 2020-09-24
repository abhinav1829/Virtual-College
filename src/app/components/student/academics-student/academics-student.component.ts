import { Component, OnInit, ViewChild } from '@angular/core';
import { AcademicsService } from 'src/app/services/academics.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Attendance } from 'src/app/models/attendance.model';
import { Report } from 'src/app/models/report.model';

@Component({
  selector: 'app-academics-student',
  templateUrl: './academics-student.component.html',
  styleUrls: ['./academics-student.component.css'],
})
export class AcademicsStudentComponent implements OnInit {
  isLoading: boolean;
  hasError: boolean;
  error: string;

  private attendance: Attendance[];
  private attendanceDataSource: MatTableDataSource<
    Attendance
  > = new MatTableDataSource<Attendance>();

  private final_report: { sname: string; marks: number[]; total: number[] }[];
  private reportDataSource: MatTableDataSource<{
    sname: string;
    marks: number[];
    total: number[];
  }> = new MatTableDataSource<{
    sname: string;
    marks: number[];
    total: number[];
  }>();

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.attendanceDataSource.sort = sort;
  }

  constructor(private academicsService: AcademicsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.hasError = false;
    this.academicsService
      .getData()
      .then(
        (data: [Attendance[], Report[][]]) => {
          this.attendance = data[0];
          this.attendanceDataSource = new MatTableDataSource<Attendance>(
            this.attendance
          );
          this.setReport(data[1]);
          this.reportDataSource = new MatTableDataSource<{
            sname: string;
            marks: number[];
            total: number[];
          }>(this.final_report);
        },
        (error) => {
          this.hasError = true;
          this.error = error;
        }
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  getAttendanceSource() {
    return this.attendanceDataSource;
  }

  getReportSource() {
    return this.final_report;
  }

  getTotalPercentage() {
    if (this.attendance) {
      let p = this.attendance
        .map((t) => t.percentage)
        .filter((value) => value != -1);
      return p.reduce((acc, value) => acc + value, 0) / p.length;
    } else {
      return 0;
    }
  }

  getMarks(subject: { sname: string; marks: number[]; total: number[] }) {
    return subject.marks
      .filter((value) => value != -1)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotal(subject: { sname: string; marks: number[]; total: number[] }) {
    return subject.total
      .filter((value) => value != -1)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalMarks(i: number) {
    if (this.final_report) {
      return this.final_report
        .map((t) => t.marks[i])
        .filter((value) => value != -1)
        .reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  getTotalTotal(i: number) {
    if (this.final_report) {
      return this.final_report
        .map((t) => t.total[i])
        .filter((value) => {
          return value != -1;
        })
        .reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  setReport(report: Report[][]) {
    let flag: boolean;
    this.final_report = [];
    for (const [index, value] of this.attendance
      .map((value) => value.sname)
      .entries()) {
      this.final_report.push({ sname: value, marks: [], total: [] });
      for (let i = 0; i < 5; i++) {
        flag = true;
        report[i].forEach((element) => {
          if (element.sname === value) {
            this.final_report[index].marks.push(element.marks);
            this.final_report[index].total.push(
              element.marks === -1 ? 0 : element.total
            );
            flag = false;
          }
        });
        if (flag) {
          this.final_report[index].marks.push(-1);
          this.final_report[index].total.push(-1);
        }
      }
    }
  }
}
