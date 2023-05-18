import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { map, Observable, tap } from 'rxjs';
import { LoginModel } from './models/LoginModel';
import { LoginResponseModel } from './models/LoginResponseModel';
import { RefreshTokenPayload } from './models/RefreshTokenPayload';
import { RegisterModel } from './models/RegisterModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:8080';

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  register(registerModel: RegisterModel): Observable<any> {
    return this.httpClient.post(this.url + '/api/auth/signup', registerModel);
  }

  login(loginModel: LoginModel): Observable<boolean> {
    console.log('Inside service');
    return this.httpClient
      .post<LoginResponseModel>(this.url + '/api/auth/login', loginModel)
      .pipe(
        map((data) => {
          console.log(data);
          this.localStorageService.store(
            'authenticationToken',
            data.authenticationToken
          );
          this.localStorageService.store('username', data.username);
          this.localStorageService.store('refreshToken', data.refreshToken);
          this.localStorageService.store('expiresAt', data.expiresAt);
          return true;
        })
      );
  }

  isAuthenticated(): Boolean {
    return this.localStorageService.retrieve('username') != null;
  }

  logout() {
    this.localStorageService.clear('authenticationToken');
    this.localStorageService.clear('username');
    this.localStorageService.clear('refreshToken');
    this.localStorageService.clear('expiresAt');
  }

  getJwtToken() {
    return this.localStorageService.retrieve('authenticationToken');
  }

  getUserName() {
    return this.localStorageService.retrieve('username');
  }

  getRefreshToken() {
    return this.localStorageService.retrieve('refreshToken');
  }

  refreshTokenPayload: RefreshTokenPayload = new RefreshTokenPayload();

  refreshToken() {
    this.refreshTokenPayload.refreshToken = this.getRefreshToken();
    this.refreshTokenPayload.username = this.getUserName();

    console.log('current Refresh token ' + this.getRefreshToken());
    return this.httpClient
      .post<LoginResponseModel>(
        this.url + '/api/auth/refreshtoken',
        this.refreshTokenPayload
      )
      .pipe(
        tap((response) => {
          console.log('Inside refresh token method. new response ' + response);
          this.localStorageService.clear('authenticationToken');
          this.localStorageService.clear('expiresAt');

          this.localStorageService.store(
            'authenticationToken',
            response.authenticationToken
          );
          this.localStorageService.store('expiresAt', response.expiresAt);
        })
      );
  }

  // refreshToken(): Observable<LoginResponseModel> {
  //   this.refreshTokenPayload.refreshToken = this.getRefreshToken();
  //   this.refreshTokenPayload.username = this.getUserName();

  //   console.log('current Refresh token ' + this.getRefreshToken());

  //   let test = this.httpClient.post<LoginResponseModel>(
  //     this.url + '/api/auth/refreshtoken',
  //     this.refreshTokenPayload
  //   );

  //   console.log(JSON.stringify(test) + '  this is before subscribe');

  //   test.subscribe((data) => {
  //     console.log('new token and its expiry' + JSON.stringify(data));
  //     this.localStorageService.clear('authenticationToken');
  //     this.localStorageService.clear('expiresAt');

  //     this.localStorageService.store(
  //       'authenticationToken',
  //       data.authenticationToken
  //     );
  //     this.localStorageService.store('expiresAt', data.expiresAt);
  //   });

  //   return test;
  // }
}
