import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  users: string[];
  tile_active: boolean[];
  loginForm: FormGroup;
  passHide: boolean;
  isLoading: boolean;
  rippleArr: MatRipple[];
  @ViewChildren(MatRipple) ripple: QueryList<MatRipple>;

  constructor(private authService: AuthService, private router: Router) {
    this.users = ['student', 'library', 'teacher', 'administrator'];
    this.tile_active = [false, false, false, false];
    this.passHide = true;
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }

  ngAfterViewInit() {
    this.rippleArr = this.ripple.toArray();
  }

  launchRipple(i: number) {
    const rippleRef = this.rippleArr[i].launch({ centered: true });
    rippleRef.fadeOut();
  }

  getIcon(user: string) {
    switch (user) {
      case 'student':
        return 'school';
      case 'library':
        return 'local_library';
      case 'teacher':
        return 'group';
      case 'administrator':
        return 'engineering';
      default:
        return 'school';
    }
  }

  getErrorMessage(i: string) {
    switch (i) {
      case 'email':
        if (this.loginForm.get('email').hasError('required')) {
          return 'You must enter a value';
        } else if (this.loginForm.get('email').hasError('email')) {
          return 'Not a valid email';
        } else {
          return '';
        }
      case 'password':
        if (this.loginForm.get('password').hasError('required')) {
          return 'You must enter a value';
        } else {
          return '';
        }
      default:
        break;
    }
  }

  tile_select(i: string) {
    switch (i) {
      case 'student':
        if (!this.tile_active[0]) {
          this.launchRipple(0);
          this.passHide = true;
        }
        this.tile_active = [true, false, false, false];
        break;
      case 'library':
        if (!this.tile_active[1]) {
          this.launchRipple(1);
          this.passHide = true;
        }
        this.tile_active = [false, true, false, false];
        break;
      case 'teacher':
        if (!this.tile_active[2]) {
          this.launchRipple(2);
          this.passHide = true;
        }
        this.tile_active = [false, false, true, false];
        break;
      case 'administrator':
        if (!this.tile_active[3]) {
          this.launchRipple(3);
          this.passHide = true;
        }
        this.tile_active = [false, false, false, true];
        break;
      default:
        this.tile_active = [false, false, false, false];
    }
  }

  onSubmit(user: string) {
    this.isLoading = true;
    this.authService
      .login(
        user,
        this.loginForm.value['email'],
        this.loginForm.value['password']
      )
      .then(
        () => {
          this.router.navigate([user]);
        },
        (error) => {
          alert(error);
        }
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
