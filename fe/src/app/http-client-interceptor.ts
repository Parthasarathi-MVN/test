import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoginModel } from './auth/models/LoginModel';
import { LoginResponseModel } from './auth/models/LoginResponseModel';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {
  isTokenRefreshing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private $localStorage: LocalStorageService,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(req.url + '  this is urllll');

    if (req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') !== -1) {
      return next.handle(req);
    }
    // if (
    //   // req.url.indexOf('refresh') !== -1 ||
    //   req.url.indexOf('forgot-password') !== -1
    // ) {
    //   console.log(req.url + ' here in interceptor');
    //   return next.handle(req);
    // }
    const token = this.authService.getJwtToken();
    console.log('jwt token from interceptor ' + token);

    if (token) {
      return next.handle(this.addToken(req, token)).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 403) {
            console.log('yes we got 403 from server');
            return this.handleAuthErrors(req, next);
          } else {
            return throwError(error);
          }
        })
      );
    }
    return next.handle(req);
  }

  private handleAuthErrors(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((refreshTokenResponse: LoginResponseModel) => {
          console.log(
            'inside return statement of handleAuthErrors' + refreshTokenResponse
          );
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(
            refreshTokenResponse.authenticationToken
          );
          return next.handle(
            this.addToken(req, refreshTokenResponse.authenticationToken)
          );
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((result) => result !== null),
        take(1),
        switchMap((res) => {
          return next.handle(
            this.addToken(req, this.authService.getJwtToken())
          );
        })
      );
    }
  }

  // intercept(req, next) {
  //   const tokenizedReq = req.clone({
  //     setHeaders: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem(
  //         'ngx-webstorage|authenticationtoken'
  //       )}`,
  //     },
  //   });
  //   return next.handle(tokenizedReq);
  // }

  addToken(req: HttpRequest<any>, jwtToken: any) {
    return req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + jwtToken),
    });
  }
}
