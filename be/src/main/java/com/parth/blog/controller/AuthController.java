package com.parth.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parth.blog.dto.AuthenticationResponse;
import com.parth.blog.dto.LoginRequest;
import com.parth.blog.dto.RefreshTokenRequest;
import com.parth.blog.dto.RegisterRequest;
import com.parth.blog.repository.UserRepository;
import com.parth.blog.service.AuthService;
import com.parth.blog.service.RefreshTokenService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody RegisterRequest registerRequest) {

        var usernameFromDB = userRepository.findByUsername(registerRequest.getUsername()).orElse(null);
        var emailFromDB = userRepository.findByEmail(registerRequest.getEmail()).orElse(null);

        if (usernameFromDB != null || emailFromDB != null) {
            if (usernameFromDB != null) {
                return new ResponseEntity<>("username", HttpStatus.CONFLICT);
            }

            else {
                return new ResponseEntity<>("email", HttpStatus.CONFLICT);
            }
        }

        else {
            authService.signup(registerRequest);
            return new ResponseEntity<>(HttpStatus.OK);
        }

    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/refreshtoken")
    public AuthenticationResponse refreshTokens(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        System.out.println("Hit the refresh token api");
        return authService.refreshToken(refreshTokenRequest);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken());

        return new ResponseEntity<String>("Refresh Token Deleted Successfully", HttpStatus.OK);
    }

}
