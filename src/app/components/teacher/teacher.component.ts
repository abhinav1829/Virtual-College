import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent {

  constructor(private authService:AuthService,private router:Router) { }

  onLogout(){
    this.authService.logout().then(() => {
      this.router.navigate(['auth']);
    });
  }

}
