import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { PostModel } from '../models/PostModel';
import { AddPostService } from '../add-post/add-post.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit {
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.postId = params['id'];
    });

    this.addPostService.getPost(this.postId).subscribe((data: PostModel) => {
      console.log(JSON.stringify(data) + 'fron on in int');
      this.postFromDB = data;
    });
  }
  postId: number;
  postFromDB: PostModel = new PostModel();
  updatedPost: PostModel;

  constructor(
    private addPostService: AddPostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  updatePost() {
    this.updatedPost = this.postFromDB;
    this.addPostService.updatePost(this.updatedPost).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl('/post/' + this.postId);
      },
      error: () => {
        console.log('Failure Response');
      },
    });
  }
}
