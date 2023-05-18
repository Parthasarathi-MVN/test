import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from '../auth.service';
import { LoginModel } from '../models/LoginModel';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginModel: LoginModel;
  loginSuccessMessage: string = 'Logged In Successfully';
  loginFaliureMessage: string = 'Oops! Please check your Credentials';
  snackbarAction: string = 'Dismiss';
  snackbarSuccess: string = 'snackbar-success';
  snackbarFailure: string = 'snackbar-failure';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
    });

    this.loginModel = {
      username: '',
      password: '',
    };
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.loginModel.username = this.loginForm.get('username').value;
    this.loginModel.password = this.loginForm.get('password').value;

    this.authService.login(this.loginModel).subscribe({
      next: (data) => {
        console.log(data);
        // this.localStorageService.store('authenticationToken', JSON.stringify(data.authenticationToken));
        // this.localStorageService.store('username', JSON.stringify(data.username));
        console.log('Login Successful');
        this.router.navigateByUrl('/home');
        this.openSnackBar(
          this.loginSuccessMessage,
          this.snackbarAction,
          this.snackbarSuccess
        );
      },
      error: (data) => {
        console.log('Login failure');
        this.openSnackBar(
          this.loginFaliureMessage,
          this.snackbarAction,
          this.snackbarFailure
        );
      },
    });

    // this.authService.login(this.loginModel).subscribe((data) => {
    //   if (data) {
    //     console.log(data);
    //     // this.localStorageService.store('authenticationToken', JSON.stringify(data.authenticationToken));
    //     // this.localStorageService.store('username', JSON.stringify(data.username));
    //     console.log('Login Successful');
    //     this.router.navigateByUrl('/home');
    //     this.openSnackBar(
    //       this.loginSuccessMessage,
    //       this.snackbarAction,
    //       this.snackbarSuccess
    //     );
    //   } else {
    //     console.log('Login failure');
    //     this.openSnackBar(
    //       this.loginFaliureMessage,
    //       this.snackbarAction,
    //       this.snackbarFailure
    //     );
    //   }
    // });
  }

  openSnackBar(message, action, snackBarColor) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: snackBarColor,
    });
  }
}
