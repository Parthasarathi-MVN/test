package com.parth.blog.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.parth.blog.dto.AuthenticationResponse;
import com.parth.blog.dto.LoginRequest;
import com.parth.blog.dto.RefreshTokenRequest;
import com.parth.blog.dto.RegisterRequest;
import com.parth.blog.model.User;
import com.parth.blog.repository.UserRepository;
import com.parth.blog.security.JwtProvider;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    RefreshTokenService refreshTokenService;

    private String encodePassword(String password) {
        return encoder.encode(password);
    }

    public void signup(RegisterRequest registerRequest) {

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(encodePassword(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());

        userRepository.save(user);
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {

        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authenticate);

        // AuthenticationResponse authenticationResponse = new AuthenticationResponse();

        // authenticationResponse.setAuthenticationToken(jwtProvider.generateToken(authenticate));
        // authenticationResponse.setUsername(loginRequest.getUsername());
        return AuthenticationResponse.builder()
                .authenticationToken(jwtProvider.generateToken(authenticate))
                .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))

                .username(loginRequest.getUsername())
                .build();
        // return authenticationResponse;

    }

    public Optional<CustomUserDetails> getCurrentUser() {

        CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        return Optional.of(user);
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        String token = jwtProvider.generateTokenWithUserName(refreshTokenRequest.getUsername());
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenRequest.getRefreshToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(refreshTokenRequest.getUsername())
                .build();
    }

}
