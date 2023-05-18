import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models/UserModel';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userInfo: UserModel = new UserModel();
  username: string;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params['user'];
    });
    this.getUserInfo(this.username).subscribe((data) => {
      this.userInfo = data;
    });
  }

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {}

  url = 'http://localhost:8080/api/';

  // This is a service method
  getUserInfo(username): Observable<UserModel> {
    return this.httpClient.get<UserModel>(this.url + 'user/get/' + username);
  }
}
