import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppComponent } from './app.component';
import { StudentComponent } from './components/student/student.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { LibraryComponent } from './components/library/library.component';
import { AssignmentSubmissionComponent } from './components/student/assignment-submission/assignment-submission.component';
import { DoubtAskingComponent } from './components/student/doubt-asking/doubt-asking.component';
import { OnlineTestsComponent } from './components/student/online-tests/online-tests.component';
import { FeesPaymentComponent } from './components/student/fees-payment/fees-payment.component';
import { UpdateFeedComponent } from './components/administrator/update-feed/update-feed.component';
import { UpdateSyllabusScheduleComponent } from './components/administrator/update-syllabus-schedule/update-syllabus-schedule.component';
import { FeesGenerationComponent } from './components/administrator/fees-generation/fees-generation.component';
import { SalaryDistributionComponent } from './components/administrator/salary-distribution/salary-distribution.component';
import { TeacherFeedComponent } from './components/teacher/teacher-feed/teacher-feed.component';
import { StudentFeedComponent } from './components/student/student-feed/student-feed.component';
import { AssignmentCheckingComponent } from './components/teacher/assignment-checking/assignment-checking.component';
import { DoubtAnsweringComponent } from './components/teacher/doubt-answering/doubt-answering.component';
import { TestBroadcastComponent } from './components/teacher/test-broadcast/test-broadcast.component';
import { SalaryComponent } from './components/teacher/salary/salary.component';
import { StudentCommunicationComponent } from './components/teacher/student-communication/student-communication.component';
import { AcademicsTeacherComponent } from './components/teacher/academics-teacher/academics-teacher.component';
import { AcademicsStudentComponent } from './components/student/academics-student/academics-student.component';
import { TeacherCommunicationComponent } from './components/student/teacher-communication/teacher-communication.component';
import { IssueStatusComponent } from './components/library/issue-status/issue-status.component';
import { AuthComponent } from './components/auth/auth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/auth/login/login.component';
import { ContactUsComponent } from './components/auth/contact-us/contact-us.component';
import { AboutComponent } from './components/auth/about/about.component';
import { DatePipe } from './pipes/date.pipe';
import { DialogComponent } from './components/shared/dialog/dialog.component';
import { AttendancePipe } from './pipes/attendance.pipe';

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,
    MatProgressBarModule,
  ],
  declarations: [
    AppComponent,
    StudentComponent,
    TeacherComponent,
    AdministratorComponent,
    LibraryComponent,
    AssignmentSubmissionComponent,
    DoubtAskingComponent,
    OnlineTestsComponent,
    FeesPaymentComponent,
    UpdateFeedComponent,
    UpdateSyllabusScheduleComponent,
    FeesGenerationComponent,
    SalaryDistributionComponent,
    ContactUsComponent,
    TeacherFeedComponent,
    StudentFeedComponent,
    AssignmentCheckingComponent,
    DoubtAnsweringComponent,
    TestBroadcastComponent,
    SalaryComponent,
    StudentCommunicationComponent,
    AcademicsTeacherComponent,
    AcademicsStudentComponent,
    TeacherCommunicationComponent,
    IssueStatusComponent,
    AuthComponent,
    AboutComponent,
    LoginComponent,
    DatePipe,
    DialogComponent,
    AttendancePipe,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
