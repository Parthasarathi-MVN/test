import { Component, OnInit } from '@angular/core';
import { PostModel } from '../models/PostModel';
import { Observable } from 'rxjs';
import { AddPostService } from '../add-post/add-post.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css'],
})
export class MyPostsComponent implements OnInit {
  posts: Array<PostModel>;
  id: number;
  showSpinner: Boolean = false;

  ngOnInit() {
    this.showSpinner = true;
    const userName = this.localStorageService.retrieve('username');
    this.postService.getPostByUsername(userName).subscribe({
      next: (data) => {
        this.posts = data;
        this.showSpinner = false;
      },
    });
  }
  constructor(
    private postService: AddPostService,
    private localStorageService: LocalStorageService
  ) {}
}
