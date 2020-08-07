import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-student-feed',
  templateUrl: './student-feed.component.html',
  styleUrls: ['./student-feed.component.css'],
})
export class StudentFeedComponent implements OnInit {
  users = ['student', 'teacher', 'library', 'administrator'];
  signupForm: FormGroup;
  constructor(private fireDatabase: AngularFireDatabase) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl(null),
      password: new FormControl(null),
      usertype: new FormControl(null),
    });
  }

  onSubmit() {
    this.fireDatabase.database
      .ref('/' + this.signupForm.get('usertype').value)
      .push()
      .set(this.signupForm.get('email').value, () => {
        console.log('Registration success!');
      });
  }
}
