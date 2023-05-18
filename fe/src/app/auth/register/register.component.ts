import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterModel } from '../models/RegisterModel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup<any>;
  registerModel: RegisterModel;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });

    this.registerModel = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  }
  ngOnInit(): void {}

  isUsernameInUse: Boolean = false;
  isEmailInUse: Boolean = false;

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit() {
    this.registerModel.username = this.registerForm.get('username')?.value;
    this.registerModel.email = this.registerForm.get('email')?.value;
    this.registerModel.password = this.registerForm.get('password')?.value;
    this.registerModel.confirmPassword =
      this.registerForm.get('confirmPassword')?.value;

    this.authService.register(this.registerModel).subscribe({
      next: (data) => {
        // console.log('Register success ' + data.status);
        this.router.navigateByUrl('/register-success');
      },
      error: (data) => {
        if (data.status == 409) {
          if (data.error === 'username') {
            this.isUsernameInUse = true;
            this.isEmailInUse = false;
          } else if (data.error === 'email') {
            this.isEmailInUse = true;
            this.isUsernameInUse = false;
          }
        }
        console.log(JSON.stringify(data));
        console.log('Register  failed');
      },
    });
  }
}
