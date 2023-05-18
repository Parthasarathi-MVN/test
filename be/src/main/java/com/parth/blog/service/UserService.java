package com.parth.blog.service;

import com.parth.blog.dto.UserDto;
import com.parth.blog.exception.PostNotFoundException;
import com.parth.blog.exception.UserNotFoundException;
import com.parth.blog.model.Post;
import com.parth.blog.model.User;
import com.parth.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public UserDto findUserByUsername(String username)
    {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("For username " + username));
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        return userDto;
//        return userRepository.findByUsername(username);
    }
}
