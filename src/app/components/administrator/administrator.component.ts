import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent {

  constructor(private authService:AuthService,private router:Router) { }

  onLogout(){
    this.authService.logout().then(() => {
      this.router.navigate(['auth']);
    });
  }

}
