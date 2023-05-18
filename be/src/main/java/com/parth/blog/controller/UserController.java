package com.parth.blog.controller;

import com.parth.blog.dto.PostDto;
import com.parth.blog.dto.UserDto;
import com.parth.blog.repository.UserRepository;
import com.parth.blog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/user/")
public class UserController {

    @Autowired
    private UserService userService;
    @GetMapping("get/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        return new ResponseEntity<>(userService.findUserByUsername(username), HttpStatus.OK);
    }
}
