import { Component, OnInit, ViewChild } from '@angular/core';
import { AcademicsService } from 'src/app/services/academics.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Attendance } from 'src/app/models/attendance.model';

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
  private dataSource: MatTableDataSource<Attendance> = new MatTableDataSource<
    Attendance
  >();
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(private academicsService: AcademicsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.hasError = false;
    this.academicsService
      .getAttendance()
      .then(
        (attendance: Attendance[]) => {
          this.attendance = attendance;
          this.dataSource = new MatTableDataSource<Attendance>(this.attendance);
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

  getDataSource() {
    return this.dataSource;
  }

  getTotalPercentage() {
    if (this.attendance) {
      return (
        this.attendance
          .map((t) => t.percentage)
          .reduce((acc, value) => acc + value, 0) / this.attendance.length
      );
    } else {
      return 0;
    }
  }
}
