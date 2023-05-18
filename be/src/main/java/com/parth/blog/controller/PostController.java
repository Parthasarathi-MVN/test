package com.parth.blog.controller;

import java.util.List;

import com.parth.blog.model.Post;
import com.parth.blog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.parth.blog.dto.PostDto;
import com.parth.blog.service.PostService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/posts/")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody PostDto postDto) {

        System.out.println("Inside the post controller "+ postDto.toString());

        postService.createPost(postDto);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @PutMapping
    public ResponseEntity<PostDto> updatePost(@RequestBody PostDto postDto) {

        postService.updatePost(postDto);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @GetMapping("/all")
    public ResponseEntity<List<PostDto>> showAllPosts() {
        return new ResponseEntity<>(postService.showAllPosts(), HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Long id) {
        return new ResponseEntity<>(postService.getPostById(id), HttpStatus.OK);
    }

    @CrossOrigin("*")
    @GetMapping("/getby/{username}")
    public ResponseEntity<List<PostDto>> getPostByUserName(@PathVariable String username)
    {

        System.out.println("In the backend");
        List<PostDto> postsByUser = postService.getPostsByUsername(username);
        System.out.println(postsByUser);
        return new ResponseEntity<>(postsByUser, HttpStatus.OK);

    }


}
