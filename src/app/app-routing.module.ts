import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { StudentComponent } from './components/student/student.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { LibraryComponent } from './components/library/library.component';
import { AcademicsStudentComponent } from './components/student/academics-student/academics-student.component';
import { AssignmentSubmissionComponent } from './components/student/assignment-submission/assignment-submission.component';
import { DoubtAskingComponent } from './components/student/doubt-asking/doubt-asking.component';
import { FeesPaymentComponent } from './components/student/fees-payment/fees-payment.component';
import { OnlineTestsComponent } from './components/student/online-tests/online-tests.component';
import { StudentFeedComponent } from './components/student/student-feed/student-feed.component';
import { TeacherCommunicationComponent } from './components/student/teacher-communication/teacher-communication.component';
import { FeesGenerationComponent } from './components/administrator/fees-generation/fees-generation.component';
import { SalaryDistributionComponent } from './components/administrator/salary-distribution/salary-distribution.component';
import { UpdateFeedComponent } from './components/administrator/update-feed/update-feed.component';
import { UpdateSyllabusScheduleComponent } from './components/administrator/update-syllabus-schedule/update-syllabus-schedule.component';
import { TeacherFeedComponent } from './components/teacher/teacher-feed/teacher-feed.component';
import { AssignmentCheckingComponent } from './components/teacher/assignment-checking/assignment-checking.component';
import { DoubtAnsweringComponent } from './components/teacher/doubt-answering/doubt-answering.component';
import { SalaryComponent } from './components/teacher/salary/salary.component';
import { TestBroadcastComponent } from './components/teacher/test-broadcast/test-broadcast.component';
import { StudentCommunicationComponent } from './components/teacher/student-communication/student-communication.component';
import { IssueStatusComponent } from './components/library/issue-status/issue-status.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AboutComponent } from './components/auth/about/about.component';
import { ContactUsComponent } from './components/auth/contact-us/contact-us.component';
import { AuthGuard } from './guards/auth.guard';
import { AcademicsTeacherComponent } from './components/teacher/academics-teacher/academics-teacher.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact_us', component: ContactUsComponent },
    ],
  },
  {
    path: 'administrator',
    component: AdministratorComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: UpdateFeedComponent },
      { path: 'syllabus', component: UpdateSyllabusScheduleComponent },
      { path: 'fees', component: FeesGenerationComponent },
      { path: 'salary', component: SalaryDistributionComponent },
    ],
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: StudentFeedComponent },
      { path: 'assignment', component: AssignmentSubmissionComponent },
      { path: 'doubt', component: DoubtAskingComponent },
      { path: 'fees', component: FeesPaymentComponent },
      { path: 'test', component: OnlineTestsComponent },
      { path: 'com', component: TeacherCommunicationComponent },
      { path: 'academics', component: AcademicsStudentComponent },
    ],
  },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: TeacherFeedComponent },
      { path: 'assignment', component: AssignmentCheckingComponent },
      { path: 'doubt', component: DoubtAnsweringComponent },
      { path: 'test', component: TestBroadcastComponent },
      { path: 'salary', component: SalaryComponent },
      { path: 'com', component: StudentCommunicationComponent },
      { path: 'academics', component: AcademicsTeacherComponent },
    ],
  },
  {
    path: 'library',
    component: LibraryComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'issue-status', pathMatch: 'full' },
      { path: 'issue-status', component: IssueStatusComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
