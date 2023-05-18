package com.parth.blog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.parth.blog.model.User;
import com.parth.blog.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("just inside " + username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with " + username));

        System.out.println("userrrr " + user.toString());

        CustomUserDetails customUserDetails = new CustomUserDetails(user);
        customUserDetails.setUser(user);
        return customUserDetails;
        // return new CustomUserDetails(user);
    }

}
