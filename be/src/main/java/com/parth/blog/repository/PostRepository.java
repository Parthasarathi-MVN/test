package com.parth.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parth.blog.model.Post;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUsername(String username);

}
