import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatus: boolean;
  private id: string;

  constructor(
    private fireAuth: AngularFireAuth,
    private fireDatabase: AngularFireDatabase
  ) {
    this.authStatus = false;
    this.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User signed IN!');
      } else {
        console.log('User signed OUT!');
      }
    });
  }

  getAuthStatus(){
    return this.authStatus;
  }

  getID(){
    return this.id;
  }

  autoLogin() {
    return new Promise((resolve, reject) => {
      let user: {
        usertype: string;
        email: string;
        password: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (user) {
        this.login(user.usertype, user.email, user.password).then(
          () => {
            resolve(user.usertype);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject('No login found.');
      }
    });
  }

  timer(s: number) {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Timed out in ' + s + 's.');
      }, s * 1000);
    });
  }

  signIn(usertype: string, email: string, password: string) {
    return new Promise((resolve, reject) => {
      let flag = true;
      this.fireDatabase.database
        .ref('/' + usertype)
        .once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val() === email) {
              flag = false;
              this.fireAuth.signInWithEmailAndPassword(email, password).then(
                () => {
                  this.authStatus = true;
                  this.id = childSnapshot.key;
                  localStorage.setItem(
                    'userData',
                    JSON.stringify({
                      usertype: usertype,
                      email: email,
                      password: password,
                    })
                  );
                  resolve();
                },
                (error) => {
                  reject(error.message);
                }
              );
            }
          });
          if (flag) {
            reject(
              'There is no ' +
                (usertype === 'library' ? usertype + ' user' : usertype) +
                ' corresponding to the given email.'
            );
          }
        });
    });
  }

  login(usertype: string, email: string, password: string) {
    return Promise.race([
      this.signIn(usertype, email, password),
      this.timer(7),
    ]);
  }

  async logout() {
    await this.fireAuth.signOut();
    this.authStatus = false;
    localStorage.removeItem('userData');
  }
}
