package com.parth.blog.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.parth.blog.dto.PostDto;
import com.parth.blog.exception.PostNotFoundException;
import com.parth.blog.model.Post;
import com.parth.blog.repository.PostRepository;

@Service
public class PostService {

    @Autowired
    AuthService authService;

    @Autowired
    PostRepository postRepository;

    public void createPost(PostDto postDto) {

        System.out.println("Inside Post Service "+postDto.toString());

        Post post = mapFromDtoToPost(postDto);

        postRepository.save(post);

    }

    public void updatePost(PostDto postDto)
    {
        Post post = mapFromDtoToPost(postDto);
        postRepository.save(post);
    }

    public List<PostDto> showAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts.stream().map(this::mapFromPostToDto).collect(Collectors.toList());
    }

    private PostDto mapFromPostToDto(Post post) {
        PostDto postDto = new PostDto();
        postDto.setId(post.getId());
        postDto.setContent(post.getContent());
        postDto.setTitle(post.getTitle());
        postDto.setUsername(post.getUsername());
        return postDto;
    }

    private Post mapFromDtoToPost(PostDto postDto) {


            Post post = new Post();
            if(postDto.getId() != null)
            {
                Optional<Post> postFromDB = postRepository.findById(postDto.getId());
                postFromDB.ifPresent(value -> post.setId(value.getId()));
            }

            // checking for update post. if post is present in db then getting its id and setting it to the post object

            post.setTitle(postDto.getTitle());
            post.setContent(postDto.getContent());
            CustomUserDetails user = authService.getCurrentUser()
                    .orElseThrow(() -> new IllegalArgumentException("No user logged in"));
            post.setUsername(user.getUsername());
            post.setCreatedOn(Instant.now());
            post.setUpdatedOn(Instant.now());
            return post;







    }

    public PostDto getPostById(Long id) {

        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("For id " + id));
        return mapFromPostToDto(post);
    }

    public List<PostDto> getPostsByUsername(String username)
    {
        List<Post> postsByUser = postRepository.findByUsername(username);
        return postsByUser.stream().map(this::mapFromPostToDto).collect(Collectors.toList());
    }

}
