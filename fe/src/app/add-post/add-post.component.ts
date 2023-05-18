import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PostModel } from '../models/PostModel';
import { AddPostService } from './add-post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
})
export class AddPostComponent {
  addPostForm: FormGroup;
  postModel: PostModel;
  title = new FormControl('');
  body = new FormControl('');

  constructor(private addPostService: AddPostService, private router: Router) {
    this.addPostForm = new FormGroup({
      title: this.title,
      body: this.body,
    });

    this.postModel = {
      id: '',
      content: '',
      title: '',
      username: '',
    };
  }

  addPost() {
    this.postModel.content = this.addPostForm.get('body').value;
    this.postModel.title = this.addPostForm.get('title').value;
    this.addPostService.addPost(this.postModel).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl('/home');
      },
      error: () => {
        console.log('Failure Response');
      },
    });
  }
}
