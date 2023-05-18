import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddPostService } from '../add-post/add-post.service';
import { PostModel } from '../models/PostModel';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  permaLink: Number;
  post: PostModel = new PostModel();

  constructor(
    private router: ActivatedRoute,
    private postService: AddPostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.permaLink = params['id'];
    });

    this.postService.getPost(this.permaLink).subscribe((data: PostModel) => {
      console.log(data);
      this.post = data;
    });
  }

  isAuthenticated(): Boolean {
    return this.authService.isAuthenticated();
  }
}
