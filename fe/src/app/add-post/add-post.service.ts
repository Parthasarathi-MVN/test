import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostModel } from '../models/PostModel';

@Injectable({
  providedIn: 'root',
})
export class AddPostService {
  url = 'http://localhost:8080/api/';

  constructor(private httpClient: HttpClient) {}

  addPost(postModel: PostModel) {
    return this.httpClient.post(this.url + 'posts/', postModel);
  }

  updatePost(postModel: PostModel) {
    return this.httpClient.put(this.url + 'posts/', postModel);
  }

  getAllPosts(): Observable<Array<PostModel>> {
    return this.httpClient.get<Array<PostModel>>(this.url + 'posts/all');
  }

  getPost(permaLink: Number): Observable<PostModel> {
    return this.httpClient.get<PostModel>(this.url + 'posts/get/' + permaLink);
  }

  getPostByUsername(username: string): Observable<Array<PostModel>> {
    return this.httpClient.get<Array<PostModel>>(
      this.url + 'posts/getby/' + username
    );
  }
}
