import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {
    this.authService.autoLogin().then(
      (usertype) => {
        this.router.navigate([usertype]);
      },
      (error) => {
        console.log(error);
        router.navigate(['auth']);
      }
    );
  }
}
