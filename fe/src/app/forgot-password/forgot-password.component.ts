import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VerifyOTP } from '../models/VerifyOTP';
import { EmailModel } from './EmailModel';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  emailModel: EmailModel = new EmailModel();

  verifyOTP: VerifyOTP = new VerifyOTP();
  displayOTPPage: Boolean = false;

  otpFromClient: string;
  // isOTPMatch: Boolean;

  url = 'http://localhost:8080/api';

  ngOnInit(): void {
    this.emailModel.isEmailInDB = true;
    this.verifyOTP.isOTPMatch = true;
  }

  constructor(private httpClient: HttpClient) {}

  onSubmit() {
    this.emailModel.isEmailInDB = true;
    console.log(this.url + '/send-mail');
    console.log(this.emailModel.email);
    console.log(this.emailModel.isEmailInDB);

    this.httpClient.post(this.url + '/send-mail', this.emailModel).subscribe({
      next: (data) => {
        console.log(data, 'in forgot compoenent NEXT');
        this.displayOTPPage = true;
      },
      error: (data) => {
        if (data.status == 404) {
          console.log(data, 'in forgot compoenent ERROR');
          // this.emailModel.isEmailInDB = false;
          this.emailModel.isEmailInDB = data.error.isEmailInDB;
        }
      },
    });
  }

  onSubmitOTP() {
    console.log(this.emailModel.email);
    this.verifyOTP.email = this.emailModel.email;
    this.verifyOTP.otpFromClient = this.otpFromClient;
    let postData = `{"email": "${this.emailModel.email}", "otpFromClient": "${this.otpFromClient}"}`;
    console.log(postData + 'posting...');
    console.log(JSON.parse(postData));
    this.httpClient
      .post<VerifyOTP>(this.url + '/verify-otp', JSON.parse(postData))
      .subscribe({
        next: (data) => {
          this.verifyOTP.isOTPMatch = data.isOTPMatch;
          console.log('Inside otp', data);
        },
        error: (data) => {
          this.verifyOTP.isOTPMatch = data.error.isOTPMatch;
          console.log('Inside error OTP', data);
        },
      });
  }
}
