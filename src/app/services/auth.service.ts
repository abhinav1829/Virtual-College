import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authStatus: boolean;

  constructor(private fireAuth: AngularFireAuth) {
    this.authStatus=false;
    this.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User signed IN!');
      } else {
        console.log('User signed OUT!');
      }
    });
  }

  async login(email: string, password: string) {
      await this.fireAuth
        .signInWithEmailAndPassword(email, password)
        .then(
          () => {
            this.authStatus = true;
          }
        )
        .catch((error) => {
          switch (error.code) {
            case 'auth/invalid-email':
              alert('The email address is not valid.');
              break;
            case 'auth/user-disabled':
              alert(
                'The user corresponding to the given email has been disabled.'
              );
              break;
            case 'auth/user-not-found':
              alert('There is no user corresponding to the given email.');
              break;
            case 'auth/wrong-password':
              alert(
                'The password is invalid for the given email, or the account corresponding to the email does not have a password set.'
              );
              break;
          }
        });
  }

  async logout() {
    await this.fireAuth.signOut();
    this.authStatus = false;
  }
}
