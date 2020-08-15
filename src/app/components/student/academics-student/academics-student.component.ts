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
  private attendance: Attendance[];
  private dataSource: MatTableDataSource<Attendance>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private academicsService: AcademicsService) {}

  ngOnInit() {
    this.attendance = this.academicsService.getAttendance();
    console.log(this.attendance);
    this.dataSource = new MatTableDataSource(this.attendance);
    this.dataSource.sort = this.sort;
  }

  getDataSource() {
    return this.dataSource;
  }

  getTotalPercentage() {
    if (this.attendance) {
      return this.attendance
        .map((t) => t.percentage)
        .reduce((acc, value) => (acc + value) / 2, 0);
    } else {
      return 0;
    }
  }
}
