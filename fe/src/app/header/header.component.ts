import { Component } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from '../auth/auth.service';
import { UserModel } from '../models/UserModel';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  loggedInUsername: UserModel;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  isAuthenticated(): Boolean {
    this.loggedInUsername = this.localStorageService.retrieve('username');
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
  }

  testMethod() {
    console.log('inside test method');
    return this.authService.refreshToken();
  }
}
