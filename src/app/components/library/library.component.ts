import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent {

  constructor(private authService:AuthService,private router:Router) { }

  onLogout(){
    this.authService.logout().then(() => {
      this.router.navigate(['auth']);
    });
  }

}
