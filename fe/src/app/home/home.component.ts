import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AddPostService } from '../add-post/add-post.service';
import { PostModel } from '../models/PostModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private postService: AddPostService) {}

  posts: Array<PostModel>;
  showSpinner = false;

  ngOnInit() {
    this.showSpinner = true;
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.showSpinner = false;
      },
    });
  }
}
